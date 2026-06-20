-- Referral capture for the Power Game apply funnel (applicant-credits-referrer).
-- The applicant optionally enters a SHARED referral code + the name/role of the
-- coach / talent scout / player who referred them. It never blocks the application
-- or payment; Alex confirms manually before any referrer reward. Additive + nullable
-- (non-breaking). Already applied to prod via Supabase migration of the same name.
ALTER TABLE public.power_game_applications
  ADD COLUMN IF NOT EXISTS referral_code text,
  ADD COLUMN IF NOT EXISTS referred_by_name text,
  ADD COLUMN IF NOT EXISTS referred_by_role text,   -- elite_player | talent_scout | coach
  ADD COLUMN IF NOT EXISTS referral_valid boolean;  -- code matched shared code AND a name given

COMMENT ON COLUMN public.power_game_applications.referral_code IS 'Referral: code the applicant entered (soft-checked against the shared REFERRAL_CODE in the app). Optional.';
COMMENT ON COLUMN public.power_game_applications.referred_by_name IS 'Referral: name of the coach/talent scout/player who referred the applicant. Optional.';
COMMENT ON COLUMN public.power_game_applications.referred_by_role IS 'Referral: referrer role — elite_player | talent_scout | coach. Optional.';
COMMENT ON COLUMN public.power_game_applications.referral_valid IS 'Referral: convenience flag = entered code matched the shared code AND a referrer name was given. Alex still confirms manually before rewarding.';
