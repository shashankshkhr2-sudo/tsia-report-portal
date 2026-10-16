-- Apply to Jeevan Sutra staging first. The base table was created in the SQL Editor.
BEGIN;
ALTER TABLE public.jeevansutra_practitioner_applications
  ADD COLUMN IF NOT EXISTS invitation_hash text,
  ADD COLUMN IF NOT EXISTS invitation_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS onboarding_location_id uuid REFERENCES public.locations(id);
CREATE UNIQUE INDEX IF NOT EXISTS js_applications_email_unique
  ON public.jeevansutra_practitioner_applications (organization_id, lower(btrim(email)));
CREATE TABLE IF NOT EXISTS public.js_practitioner_review_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.jeevansutra_practitioner_applications(id),
  actor_id uuid NOT NULL REFERENCES public.profiles(id),
  action text NOT NULL,
  notes text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.js_practitioner_review_history ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.js_practitioner_review_history FROM anon, authenticated;
GRANT SELECT ON public.js_practitioner_review_history TO authenticated;
DROP POLICY IF EXISTS js_practitioner_history_admin_read ON public.js_practitioner_review_history;
CREATE POLICY js_practitioner_history_admin_read ON public.js_practitioner_review_history
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM public.jeevansutra_practitioner_applications a
    WHERE a.id = application_id AND public.can_review_js_applications(a.organization_id)
  ));
CREATE TABLE IF NOT EXISTS public.js_practitioner_request_limits (
  request_key text PRIMARY KEY, window_start timestamptz NOT NULL, attempts integer NOT NULL
);
ALTER TABLE public.js_practitioner_request_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.js_practitioner_request_limits FROM PUBLIC, anon, authenticated;
CREATE OR REPLACE FUNCTION public.check_js_practitioner_rate_limit(p_key text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE n integer;
BEGIN
  IF p_key !~ '^[a-f0-9]{64}$' THEN RAISE EXCEPTION 'Invalid key'; END IF;
  INSERT INTO public.js_practitioner_request_limits AS r VALUES (p_key, now(), 1)
  ON CONFLICT (request_key) DO UPDATE SET
    attempts = CASE WHEN r.window_start < now() - interval '1 hour' THEN 1 ELSE least(r.attempts + 1, 11) END,
    window_start = CASE WHEN r.window_start < now() - interval '1 hour' THEN now() ELSE r.window_start END
  RETURNING attempts INTO n;
  RETURN n <= 10;
END; $$;
REVOKE ALL ON FUNCTION public.check_js_practitioner_rate_limit(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_js_practitioner_rate_limit(text) TO service_role;

CREATE OR REPLACE FUNCTION public.review_js_practitioner_application(
  p_id uuid, p_status text, p_notes text, p_hash text DEFAULT NULL, p_location uuid DEFAULT NULL
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE a public.jeevansutra_practitioner_applications%ROWTYPE;
BEGIN
  SELECT * INTO a FROM public.jeevansutra_practitioner_applications WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR NOT public.can_review_js_applications(a.organization_id) THEN RAISE EXCEPTION 'Access denied'; END IF;
  IF a.employee_id IS NOT NULL THEN RAISE EXCEPTION 'Already onboarded. Manage this employee separately.'; END IF;
  IF p_status NOT IN ('under_review', 'approved', 'rejected') OR p_status IS NULL
    OR length(btrim(coalesce(p_notes, ''))) NOT BETWEEN 1 AND 2000 THEN RAISE EXCEPTION 'Review notes and valid status required'; END IF;
  IF p_status = 'approved' AND (p_hash IS NULL OR p_hash !~ '^[a-f0-9]{64}$') THEN RAISE EXCEPTION 'Invitation required'; END IF;
  IF p_location IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.locations WHERE id = p_location AND organization_id = a.organization_id AND is_active
  ) THEN RAISE EXCEPTION 'Invalid location'; END IF;
  UPDATE public.jeevansutra_practitioner_applications SET
    application_status = p_status, review_notes = btrim(p_notes), reviewed_by = auth.uid(), reviewed_at = now(), updated_at = now(),
    invitation_hash = CASE WHEN p_status = 'approved' THEN p_hash ELSE NULL END,
    invitation_expires_at = CASE WHEN p_status = 'approved' THEN now() + interval '7 days' ELSE NULL END,
    onboarding_location_id = CASE WHEN p_status = 'approved' THEN p_location ELSE NULL END
  WHERE id = p_id;
  INSERT INTO public.js_practitioner_review_history(application_id, actor_id, action, notes)
    VALUES(p_id, auth.uid(), p_status, btrim(p_notes));
END; $$;
REVOKE ALL ON FUNCTION public.review_js_practitioner_application(uuid,text,text,text,uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.review_js_practitioner_application(uuid,text,text,text,uuid) TO authenticated;

-- Only the server calls this after validating the bearer session; Auth is checked again here.
CREATE OR REPLACE FUNCTION public.claim_js_practitioner_invitation(p_hash text, p_user uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE a public.jeevansutra_practitioner_applications%ROWTYPE;
u auth.users%ROWTYPE;
p public.profiles%ROWTYPE;
BEGIN
  IF p_hash IS NULL OR p_hash !~ '^[a-f0-9]{64}$' THEN RAISE EXCEPTION 'Invalid invitation'; END IF;
  SELECT * INTO a FROM public.jeevansutra_practitioner_applications WHERE invitation_hash = p_hash FOR UPDATE;
  IF NOT FOUND OR a.application_status <> 'approved' OR a.invitation_expires_at <= now()
     OR a.invitation_expires_at IS NULL OR a.employee_id IS NOT NULL
     OR a.organization_id <> 'd7e678c2-2d43-4fd9-9ef4-48a791b6a5ba'::uuid THEN RAISE EXCEPTION 'Invitation invalid, expired or already used'; END IF;
  SELECT * INTO u FROM auth.users WHERE id = p_user FOR UPDATE;
  IF NOT FOUND OR u.email_confirmed_at IS NULL OR coalesce(u.is_anonymous, false)
     OR lower(btrim(u.email)) IS DISTINCT FROM lower(btrim(a.email))
     OR (to_jsonb(a)->>'auth_user_id') IS DISTINCT FROM p_user::text THEN RAISE EXCEPTION 'Use the verified application email'; END IF;
  SELECT * INTO p FROM public.profiles WHERE id = p_user FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Account profile missing'; END IF;
  IF p.organization_id IS NOT NULL OR p.is_active OR EXISTS (
    SELECT 1 FROM public.js_customer_access WHERE auth_user_id = p_user
  ) OR lower(btrim(p.role)) NOT IN ('customer', 'report_generator') THEN
    RAISE EXCEPTION 'Existing account cannot be converted automatically. Contact the administrator.';
  END IF;
  UPDATE public.profiles SET full_name = a.full_name, mobile = a.mobile,
    role = 'report_generator', specialization = a.expertise, is_active = true,
    organization_id = a.organization_id, location_id = a.onboarding_location_id, updated_at = now()
    WHERE id = p_user;
  -- A new employee starts unavailable until an administrator enables assignments.
  INSERT INTO public.practitioner_assignment_settings(employee_id, available, capacity)
    VALUES(p_user, false, 20) ON CONFLICT (employee_id) DO NOTHING;
  UPDATE public.jeevansutra_practitioner_applications SET employee_id = p_user,
    invitation_hash = NULL, invitation_expires_at = NULL, updated_at = now() WHERE id = a.id;
  INSERT INTO public.js_practitioner_review_history(application_id, actor_id, action, notes)
    VALUES(a.id, p_user, 'onboarded', 'Verified applicant activated as an employee.');
END; $$;
REVOKE ALL ON FUNCTION public.claim_js_practitioner_invitation(text,uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_js_practitioner_invitation(text,uuid) TO service_role;
COMMIT;
