-- Elite feedback survey: break the single generic "how much did they improve?" into the
-- specific gains the program targets, so we can see WHAT improved (not just that it did).
-- The old `improvement` column is left in place (dormant) rather than dropped.
ALTER TABLE public.program_feedback
  ADD COLUMN IF NOT EXISTS imp_shot_range         smallint CHECK (imp_shot_range         BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS imp_batting_smart      smallint CHECK (imp_batting_smart      BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS imp_bowling_smart      smallint CHECK (imp_bowling_smart      BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS imp_power              smallint CHECK (imp_power              BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS imp_game_understanding smallint CHECK (imp_game_understanding BETWEEN 1 AND 5);
