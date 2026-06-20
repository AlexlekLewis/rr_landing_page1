-- Internal ability flag for Power Game applicants.
-- The funnel no longer gates payment on this — every 12-16 player gets a slot
-- picker. The flag is for coach-side lane allocation only and MUST NOT appear
-- on any public surface.
--
--   qualified — rep cricket OR graded senior (Premier / Sub-District / Assoc 2nd+)
--   review    — Wild Card / CS-BELOW / no history
--   senior_review — 17+ (auto-routes to coach review, no automatic placement)
ALTER TABLE public.power_game_applications
  ADD COLUMN IF NOT EXISTS internal_stream text
    CHECK (internal_stream IS NULL OR internal_stream IN ('qualified','review','senior_review'));

COMMENT ON COLUMN public.power_game_applications.internal_stream IS
  'Internal-only ability flag for coach lane allocation. Never surface in user-facing UI.';

-- Backfill historical rows so the admin view has values for every applicant.
UPDATE public.power_game_applications
SET internal_stream = CASE
  WHEN age >= 17 THEN 'senior_review'
  WHEN bio LIKE '%Rep %' OR (
    bio LIKE '%Club P1M%' OR bio LIKE '%Club P2M%' OR bio LIKE '%Club P3M%' OR bio LIKE '%Club P4M%' OR
    bio LIKE '%Club P1F%' OR bio LIKE '%Club P2F%' OR
    bio LIKE '%Club SD1%' OR bio LIKE '%Club SD2%' OR bio LIKE '%Club SD3%' OR bio LIKE '%Club SD4%' OR
    bio LIKE '%Club CS-1T%' OR bio LIKE '%Club CS-2T%' OR bio LIKE '%Club CS-1S%' OR bio LIKE '%Club CS-2S%' OR
    bio LIKE '%Club CW-1%'
  ) THEN 'qualified'
  ELSE 'review'
END
WHERE source = 'pgp2026' AND internal_stream IS NULL;
