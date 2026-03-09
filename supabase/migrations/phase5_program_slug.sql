-- ============================================================================
-- Phase 5 Migration: Add program_slug to support multi-program architecture
-- 
-- RUN THIS when you're ready to add a second program (e.g., Winter Camp 2026).
-- Until then, the admin portal works fine without it — the program selector
-- is in place but filtering is not yet active on queries.
--
-- After running this migration, update ProgramContext.jsx to add the new
-- program to the PROGRAMS array, and update admin components to filter
-- queries by program_slug using the useProgram() hook.
-- ============================================================================

-- Add program_slug to applications (default to elite_2026 for existing data)
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS program_slug TEXT DEFAULT 'elite_2026';

-- Add program_slug to official_cohort_2026 
ALTER TABLE public.official_cohort_2026
ADD COLUMN IF NOT EXISTS program_slug TEXT DEFAULT 'elite_2026';

-- Add program_slug to pipeline_entries
ALTER TABLE public.pipeline_entries
ADD COLUMN IF NOT EXISTS program_slug TEXT DEFAULT 'elite_2026';

-- Add program_slug to offer_tokens
ALTER TABLE public.offer_tokens
ADD COLUMN IF NOT EXISTS program_slug TEXT DEFAULT 'elite_2026';

-- Backfill: ensure all existing rows have the default
UPDATE public.applications SET program_slug = 'elite_2026' WHERE program_slug IS NULL;
UPDATE public.official_cohort_2026 SET program_slug = 'elite_2026' WHERE program_slug IS NULL;
UPDATE public.pipeline_entries SET program_slug = 'elite_2026' WHERE program_slug IS NULL;
UPDATE public.offer_tokens SET program_slug = 'elite_2026' WHERE program_slug IS NULL;

-- Optional: Create an index for faster filtering
CREATE INDEX IF NOT EXISTS idx_applications_program ON public.applications(program_slug);
CREATE INDEX IF NOT EXISTS idx_cohort_program ON public.official_cohort_2026(program_slug);
CREATE INDEX IF NOT EXISTS idx_entries_program ON public.pipeline_entries(program_slug);
CREATE INDEX IF NOT EXISTS idx_tokens_program ON public.offer_tokens(program_slug);
