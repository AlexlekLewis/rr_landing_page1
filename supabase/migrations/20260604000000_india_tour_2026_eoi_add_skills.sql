-- India Tour 2026 EOI — capture player's primary + secondary cricket skill.
-- Options (UI): Batsman, Wicketkeeper, Fast bowler, Off spinner, Leg spinner.
ALTER TABLE public.india_tour_2026_eoi
  ADD COLUMN IF NOT EXISTS primary_skill text,
  ADD COLUMN IF NOT EXISTS secondary_skill text;
