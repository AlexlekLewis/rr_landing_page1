-- India Tour 2026 — expression-of-interest captures from the private /india-tour-2026 invite page.
CREATE TABLE IF NOT EXISTS public.india_tour_2026_eoi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  player_name text NOT NULL,
  player_dob date,
  player_age integer,
  current_club text,
  highest_level text,
  player_email text,
  player_phone text,
  guardian1_name text,
  guardian1_relationship text,
  guardian1_email text,
  guardian1_phone text,
  guardian2_name text,
  guardian2_relationship text,
  guardian2_email text,
  guardian2_phone text,
  is_over_18 boolean,
  consent_contact boolean DEFAULT false,
  referral_code text,
  referral_name text,
  source text DEFAULT 'india-tour-2026-eoi',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  page_referrer text
);
CREATE INDEX IF NOT EXISTS idx_india_tour_2026_eoi_created_at ON public.india_tour_2026_eoi (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_india_tour_2026_eoi_referral_code ON public.india_tour_2026_eoi (referral_code);
ALTER TABLE public.india_tour_2026_eoi ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_public_insert" ON public.india_tour_2026_eoi;
CREATE POLICY "allow_public_insert" ON public.india_tour_2026_eoi FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "allow_authenticated_select" ON public.india_tour_2026_eoi;
CREATE POLICY "allow_authenticated_select" ON public.india_tour_2026_eoi FOR SELECT TO authenticated USING (true);
COMMENT ON TABLE public.india_tour_2026_eoi IS 'Expression-of-interest registrations from the private /india-tour-2026 invite page. Synced to a Google Sheet via export_india_tour_2026_eoi.';
