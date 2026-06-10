-- Capture whether an applicant needs a program uniform (funnel consent step).
-- Nullable-safe default so it is non-breaking for the existing inline form.
-- Applied live 2026-06; recorded here for reproducibility.
ALTER TABLE public.power_game_applications
  ADD COLUMN IF NOT EXISTS needs_uniform boolean NOT NULL DEFAULT false;
