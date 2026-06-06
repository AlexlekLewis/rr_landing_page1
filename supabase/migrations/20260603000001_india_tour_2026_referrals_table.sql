-- India Tour 2026 — member referral/invite codes that gate the private /india-tour-2026 page.
CREATE TABLE IF NOT EXISTS public.india_tour_2026_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  code text UNIQUE NOT NULL,
  member_name text,
  member_email text,
  note text,
  active boolean NOT NULL DEFAULT true,
  is_public boolean NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS idx_india_tour_2026_referrals_code ON public.india_tour_2026_referrals (lower(code));
ALTER TABLE public.india_tour_2026_referrals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_authenticated_all" ON public.india_tour_2026_referrals;
CREATE POLICY "allow_authenticated_all" ON public.india_tour_2026_referrals FOR ALL TO authenticated USING (true) WITH CHECK (true);
COMMENT ON TABLE public.india_tour_2026_referrals IS 'Member referral/invite codes that gate the private /india-tour-2026 page. Validated anonymously via validate_india_tour_referral().';
