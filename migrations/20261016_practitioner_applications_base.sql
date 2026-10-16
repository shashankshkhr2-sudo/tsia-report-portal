-- Already applied manually to staging on 16 October 2026; retained here for reproducibility.
BEGIN;
CREATE TABLE IF NOT EXISTS public.jeevansutra_practitioner_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id),
  full_name text NOT NULL, mobile text NOT NULL, email text NOT NULL,
  city text NOT NULL, state_region text NOT NULL, country text NOT NULL,
  expertise text NOT NULL CHECK (expertise IN ('numerologist','astrologer','both')),
  methods text NOT NULL, experience text NOT NULL, languages text NOT NULL,
  guidance_areas text[] NOT NULL DEFAULT '{}', qualification_type text NOT NULL,
  qualification_details text NOT NULL,
  consultation_mode text NOT NULL CHECK (consultation_mode IN ('online','in_person','both')),
  availability text NOT NULL, introduction text NOT NULL, portfolio_url text,
  accuracy_consent boolean NOT NULL CHECK (accuracy_consent),
  contact_consent boolean NOT NULL CHECK (contact_consent),
  application_status text NOT NULL DEFAULT 'pending'
    CHECK (application_status IN ('pending','under_review','approved','rejected')),
  review_notes text, reviewed_by uuid REFERENCES public.profiles(id), reviewed_at timestamptz,
  employee_id uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS js_applications_organization_created_idx
  ON public.jeevansutra_practitioner_applications(organization_id,created_at DESC,id DESC);
ALTER TABLE public.jeevansutra_practitioner_applications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.jeevansutra_practitioner_applications FROM anon,authenticated;
CREATE OR REPLACE FUNCTION public.can_review_js_applications(p_organization_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT p_organization_id = 'd7e678c2-2d43-4fd9-9ef4-48a791b6a5ba'::uuid AND EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_active = true
      AND p.organization_id = p_organization_id AND lower(btrim(p.role)) = 'admin'
  );
$$;
REVOKE ALL ON FUNCTION public.can_review_js_applications(uuid) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.can_review_js_applications(uuid) TO authenticated;
GRANT SELECT ON public.jeevansutra_practitioner_applications TO authenticated;
DROP POLICY IF EXISTS js_applications_admin_read ON public.jeevansutra_practitioner_applications;
CREATE POLICY js_applications_admin_read ON public.jeevansutra_practitioner_applications
  FOR SELECT TO authenticated USING (public.can_review_js_applications(organization_id));
GRANT SELECT,INSERT,UPDATE ON public.jeevansutra_practitioner_applications TO service_role;
COMMIT;
