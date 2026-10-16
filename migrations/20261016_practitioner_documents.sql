-- Apply AFTER base and onboarding migrations, to staging first.
BEGIN;
ALTER TABLE public.jeevansutra_practitioner_applications
  ADD COLUMN IF NOT EXISTS auth_user_id uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS email_verified_at timestamptz;
CREATE UNIQUE INDEX IF NOT EXISTS js_applications_auth_unique
  ON public.jeevansutra_practitioner_applications(auth_user_id) WHERE auth_user_id IS NOT NULL;
CREATE OR REPLACE FUNCTION public.guard_js_practitioner_submission()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE u auth.users%ROWTYPE; p public.profiles%ROWTYPE;
BEGIN
  SELECT * INTO u FROM auth.users WHERE id = NEW.auth_user_id;
  IF NOT FOUND OR u.email_confirmed_at IS NULL OR coalesce(u.is_anonymous,false)
     OR lower(btrim(u.email)) IS DISTINCT FROM lower(btrim(NEW.email)) THEN RAISE EXCEPTION 'Verified application email required'; END IF;
  SELECT * INTO p FROM public.profiles WHERE id = u.id;
  IF NOT FOUND OR p.is_active OR p.organization_id IS NOT NULL OR lower(btrim(p.role)) NOT IN ('customer','report_generator')
    OR EXISTS(SELECT 1 FROM public.js_customer_access WHERE auth_user_id = u.id) THEN RAISE EXCEPTION 'Existing account must be handled separately'; END IF;
  IF NEW.organization_id <> 'd7e678c2-2d43-4fd9-9ef4-48a791b6a5ba'::uuid THEN RAISE EXCEPTION 'Invalid organization'; END IF;
  NEW.email := lower(btrim(u.email)); NEW.email_verified_at := u.email_confirmed_at;
  NEW.application_status := 'pending'; NEW.employee_id := NULL;
  NEW.reviewed_by := NULL; NEW.reviewed_at := NULL; NEW.review_notes := NULL;
  NEW.invitation_hash := NULL; NEW.invitation_expires_at := NULL;
  RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.guard_js_practitioner_submission() FROM PUBLIC,anon,authenticated;
DROP TRIGGER IF EXISTS guard_js_practitioner_submission ON public.jeevansutra_practitioner_applications;
CREATE TRIGGER guard_js_practitioner_submission BEFORE INSERT ON public.jeevansutra_practitioner_applications
  FOR EACH ROW EXECUTE FUNCTION public.guard_js_practitioner_submission();

INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
VALUES('js-practitioner-documents','js-practitioner-documents',false,5242880,ARRAY['application/pdf','image/jpeg','image/png'])
ON CONFLICT(id) DO UPDATE SET public=false,file_size_limit=5242880,allowed_mime_types=ARRAY['application/pdf','image/jpeg','image/png'];
-- No browser policies are added to storage.objects. Files are served only through authorized server checks.
CREATE TABLE IF NOT EXISTS public.js_practitioner_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.jeevansutra_practitioner_applications(id),
  storage_path text NOT NULL UNIQUE, original_name text NOT NULL,
  document_type text NOT NULL CHECK(document_type IN ('degree','certificate','other_qualification')),
  upload_source text NOT NULL CHECK(upload_source IN ('applicant','administrator')),
  uploaded_by uuid NOT NULL REFERENCES auth.users(id), uploaded_by_name text NOT NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now(), notes text NOT NULL DEFAULT '',
  review_status text NOT NULL DEFAULT 'not_reviewed' CHECK(review_status IN ('not_reviewed','verified','needs_clarification')),
  review_notes text, reviewed_by uuid REFERENCES public.profiles(id), reviewed_at timestamptz
);
ALTER TABLE public.js_practitioner_documents ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.js_practitioner_documents FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.js_practitioner_documents TO service_role;
CREATE OR REPLACE FUNCTION public.register_js_practitioner_document(
  p_application uuid,p_actor uuid,p_admin boolean,p_path text,p_name text,p_type text,p_notes text
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE a public.jeevansutra_practitioner_applications%ROWTYPE; actor_name text;
BEGIN
  SELECT * INTO a FROM public.jeevansutra_practitioner_applications WHERE id=p_application FOR UPDATE;
  IF NOT FOUND OR a.organization_id <> 'd7e678c2-2d43-4fd9-9ef4-48a791b6a5ba'::uuid THEN RAISE EXCEPTION 'Access denied'; END IF;
  IF p_admin IS TRUE THEN
    SELECT full_name INTO actor_name FROM public.profiles WHERE id=p_actor AND is_active AND organization_id=a.organization_id AND lower(btrim(role))='admin';
    IF NOT FOUND THEN RAISE EXCEPTION 'Administrator required'; END IF;
  ELSE
    IF p_admin IS NULL OR p_actor IS DISTINCT FROM a.auth_user_id OR a.application_status NOT IN ('pending','under_review')
      OR NOT EXISTS(SELECT 1 FROM auth.users WHERE id=p_actor AND email_confirmed_at IS NOT NULL AND lower(btrim(email))=lower(btrim(a.email))) THEN RAISE EXCEPTION 'Applicant access denied'; END IF;
    actor_name := a.full_name;
  END IF;
  IF p_path IS NULL OR p_path !~ ('^' || p_application::text || '/[a-f0-9-]{36}\.(pdf|jpg|png)$')
    OR p_name IS NULL OR length(p_name) NOT BETWEEN 1 AND 180 OR p_type IS NULL OR p_type NOT IN ('degree','certificate','other_qualification')
    OR p_notes IS NULL OR length(p_notes)>2000 THEN RAISE EXCEPTION 'Invalid document details'; END IF;
  IF (SELECT count(*) FROM public.js_practitioner_documents WHERE application_id=p_application)>=10 THEN RAISE EXCEPTION 'Document limit reached'; END IF;
  IF NOT EXISTS(SELECT 1 FROM storage.objects WHERE bucket_id='js-practitioner-documents' AND name=p_path) THEN RAISE EXCEPTION 'File missing'; END IF;
  INSERT INTO public.js_practitioner_documents(application_id,storage_path,original_name,document_type,upload_source,uploaded_by,uploaded_by_name,notes)
    VALUES(p_application,p_path,p_name,p_type,CASE WHEN p_admin THEN 'administrator' ELSE 'applicant' END,p_actor,actor_name,p_notes);
  INSERT INTO public.js_practitioner_review_history(application_id,actor_id,action,notes)
    VALUES(p_application,p_actor,'document_attached',p_type || ' attached by ' || actor_name || '. ' || p_notes);
END; $$;
REVOKE ALL ON FUNCTION public.register_js_practitioner_document(uuid,uuid,boolean,text,text,text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.register_js_practitioner_document(uuid,uuid,boolean,text,text,text,text) TO service_role;
CREATE OR REPLACE FUNCTION public.review_js_practitioner_document(p_id uuid,p_application uuid,p_status text,p_notes text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE org uuid;
BEGIN
  SELECT organization_id INTO org FROM public.jeevansutra_practitioner_applications WHERE id=p_application;
  IF NOT FOUND OR NOT public.can_review_js_applications(org) THEN RAISE EXCEPTION 'Access denied'; END IF;
  IF p_status IS NULL OR p_status NOT IN ('not_reviewed','verified','needs_clarification') OR length(btrim(coalesce(p_notes,''))) NOT BETWEEN 1 AND 2000 THEN RAISE EXCEPTION 'Invalid review'; END IF;
  UPDATE public.js_practitioner_documents SET review_status=p_status,review_notes=btrim(p_notes),reviewed_by=auth.uid(),reviewed_at=now() WHERE id=p_id AND application_id=p_application;
  IF NOT FOUND THEN RAISE EXCEPTION 'Document not found'; END IF;
  INSERT INTO public.js_practitioner_review_history(application_id,actor_id,action,notes)
    VALUES(p_application,auth.uid(),'document_'||p_status,p_id::text || ': ' || btrim(p_notes));
END; $$;
REVOKE ALL ON FUNCTION public.review_js_practitioner_document(uuid,uuid,text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.review_js_practitioner_document(uuid,uuid,text,text) TO authenticated;
CREATE OR REPLACE FUNCTION public.add_js_practitioner_interview_note(p_application uuid,p_mode text,p_notes text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE org uuid;
BEGIN
  SELECT organization_id INTO org FROM public.jeevansutra_practitioner_applications WHERE id=p_application;
  IF NOT FOUND OR NOT public.can_review_js_applications(org) THEN RAISE EXCEPTION 'Access denied'; END IF;
  IF p_mode IS NULL OR p_mode NOT IN ('telephone','in_person','other') OR length(btrim(coalesce(p_notes,''))) NOT BETWEEN 1 AND 2000 THEN RAISE EXCEPTION 'Invalid interview note'; END IF;
  INSERT INTO public.js_practitioner_review_history(application_id,actor_id,action,notes)
    VALUES(p_application,auth.uid(),'interview_'||p_mode,btrim(p_notes));
END; $$;
REVOKE ALL ON FUNCTION public.add_js_practitioner_interview_note(uuid,text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.add_js_practitioner_interview_note(uuid,text,text) TO authenticated;
COMMIT;
