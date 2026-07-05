-- Elite Program 2026 feedback + win-back survey  →  public.program_feedback
--
-- Purpose: hear how the families who actually DID the 12-week Elite Program (Apr–Jul 2026)
-- feel about the product, and — critically — capture WHY they are / aren't continuing into
-- the next program (Power Game Pre-Season, Aug–Sep). The output is win-back intelligence:
-- a contactable list of who isn't re-signing and the specific reason, so they can be
-- targeted with the right incentive to jump back in.
--
-- Trust model mirrors academy_reviews (this project's locked-down convention):
--   * NO anon policy        -> the anon key CANNOT read or write this table. This matters here:
--                              rows hold respondent names, emails and candid churn reasons (PII).
--   * authenticated CRUD    -> the admin dashboard (/rramadmin_26/feedback) reads + housekeeps.
--   * service_role          -> bypasses RLS; used by /api/program-feedback for the public submit
--                              and for the (server-side) Google Sheet mirror.
CREATE TABLE IF NOT EXISTS public.program_feedback (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at           timestamptz NOT NULL DEFAULT now(),
  program              text NOT NULL DEFAULT 'Elite Program 2026',

  -- ── Identity (required — we need to know who to follow up with) ──
  respondent_name      text NOT NULL,
  respondent_email     text NOT NULL,
  player_name          text NOT NULL,
  respondent_role      text,                        -- 'Parent' | 'Player' | 'Both'
  centre               text,                        -- Williamstown | Hallam | Mickleham | Other

  -- ── Overall (1–5) ──
  rating_overall       smallint CHECK (rating_overall     BETWEEN 1 AND 5),
  improvement          smallint CHECK (improvement        BETWEEN 1 AND 5),
  enjoyment            smallint CHECK (enjoyment           BETWEEN 1 AND 5),

  -- ── Core elements: Explore / Challenge / Execute (1–5 + optional comment) ──
  explore_rating       smallint CHECK (explore_rating     BETWEEN 1 AND 5),
  explore_comment      text,
  challenge_rating     smallint CHECK (challenge_rating   BETWEEN 1 AND 5),
  challenge_comment    text,
  execute_rating       smallint CHECK (execute_rating     BETWEEN 1 AND 5),
  execute_comment      text,

  -- ── Format & value ──
  format_fit           text,                        -- 'too_much' | 'just_right' | 'not_enough'
  times_rating         smallint CHECK (times_rating       BETWEEN 1 AND 5),
  times_better         text,                        -- which days/times would suit better
  location_rating      smallint CHECK (location_rating    BETWEEN 1 AND 5),
  value_rating         smallint CHECK (value_rating       BETWEEN 1 AND 5),

  -- ── Coaching & pathway ──
  coaching_rating      smallint CHECK (coaching_rating    BETWEEN 1 AND 5),
  guests_rating        smallint CHECK (guests_rating      BETWEEN 1 AND 5),   -- guest coaches / masterclasses
  communication_rating smallint CHECK (communication_rating BETWEEN 1 AND 5),
  pathway_clarity      smallint CHECK (pathway_clarity    BETWEEN 1 AND 5),

  -- ── Advocacy & continuation (the money question) ──
  nps                  smallint CHECK (nps BETWEEN 0 AND 10),   -- likelihood to recommend
  continue_next        text,                        -- 'signed_up' | 'intend' | 'unsure' | 'no'
  stay_reasons         text[],                      -- why continuing        (yes branch, multi)
  stay_reason_other    text,
  barriers             text[],                      -- why NOT continuing     (unsure/no branch, multi)
  barrier_other        text,
  change_mind          text,                        -- what would change your mind

  -- ── Closing open text ──
  love_most            text,
  would_change         text,
  anything_else        text,

  -- ── Consent / attribution / abuse signal ──
  consent_contact      boolean NOT NULL DEFAULT false,   -- happy for us to use feedback + follow up
  ip_hash              text,                             -- sha-256(ip) set server-side
  source               text DEFAULT 'web',
  utm_source           text,
  utm_medium           text,
  utm_campaign         text,
  page_referrer        text
);

CREATE INDEX IF NOT EXISTS idx_program_feedback_created
  ON public.program_feedback (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_program_feedback_continue
  ON public.program_feedback (continue_next);

ALTER TABLE public.program_feedback ENABLE ROW LEVEL SECURITY;

-- Admin (any authenticated dashboard user) can read + housekeep everything.
DROP POLICY IF EXISTS "feedback_authenticated_select" ON public.program_feedback;
CREATE POLICY "feedback_authenticated_select" ON public.program_feedback
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "feedback_authenticated_update" ON public.program_feedback;
CREATE POLICY "feedback_authenticated_update" ON public.program_feedback
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "feedback_authenticated_delete" ON public.program_feedback;
CREATE POLICY "feedback_authenticated_delete" ON public.program_feedback
  FOR DELETE TO authenticated USING (true);

-- Intentionally NO anon INSERT/SELECT policy: the public submit goes through the service-role
-- /api/program-feedback function so we control validation and nothing (esp. PII + churn reasons)
-- is readable with the public anon key.

COMMENT ON TABLE public.program_feedback IS
  'Elite Program 2026 feedback + win-back survey (/elite-feedback). Public submit via service-role /api/program-feedback. Admin reads in /rramadmin_26/feedback. No anon access (holds PII + candid churn reasons).';
