-- Elite feedback survey v2 (applied 2026-07-12): per-specialist ratings, the NeuroVision +
-- fitness question, and the Match Centre block under the Execute phase.
--
--   * specialist_* — individual 1–5s for the specialist coaches (who to bring back):
--     Jarryd Rogers (power hitting), BowlStrong (bowling assessments), Callum Stow,
--     Harkirat Bajwa, Zach Parr. guests_rating now covers the guest SPEAKERS only
--     (Kyle Hogg, Lhuan-dre Pretorius).
--   * neuro_fitness_rating — the NeuroVision training + fitness program & assessments.
--   * matchcentre_* / scouting_reports_use — the iPad match-up tool: value rating +
--     open comment, whether scouting reports were used ('yes'|'sometimes'|'no'), and
--     would they use the app in their own time ('yes'|'maybe'|'no') — product signal.
--
-- The centre question was dropped from the form (single venue); the centre column is
-- kept for historical rows.
ALTER TABLE public.program_feedback
  ADD COLUMN IF NOT EXISTS specialist_jarryd     smallint CHECK (specialist_jarryd     BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS specialist_bowlstrong smallint CHECK (specialist_bowlstrong BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS specialist_callum     smallint CHECK (specialist_callum     BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS specialist_bajwa      smallint CHECK (specialist_bajwa      BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS specialist_zach       smallint CHECK (specialist_zach       BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS neuro_fitness_rating  smallint CHECK (neuro_fitness_rating  BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS matchcentre_rating    smallint CHECK (matchcentre_rating    BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS matchcentre_comment   text,
  ADD COLUMN IF NOT EXISTS scouting_reports_use  text,
  ADD COLUMN IF NOT EXISTS matchcentre_own_time  text;
