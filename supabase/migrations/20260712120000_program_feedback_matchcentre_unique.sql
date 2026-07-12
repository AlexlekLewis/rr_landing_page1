-- Elite feedback survey: "how unique were the Match Centre match-ups compared to other
-- cricket training?" — a differentiation signal (is this experience unavailable elsewhere?).
ALTER TABLE public.program_feedback
  ADD COLUMN IF NOT EXISTS matchcentre_unique smallint CHECK (matchcentre_unique BETWEEN 1 AND 5);
