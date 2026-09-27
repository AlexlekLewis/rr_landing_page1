-- ============================================================
-- match_registrations: add club + notes (applied to prod 27 Sep 2026 via MCP
-- apply_migration as "match_registrations_add_club_notes"; this file is the
-- canonical record).
-- ============================================================
-- /sid-juniors reuses the generic match_registrations table, tagged by
-- match_slug ('sid-juniors-2026-10-05-request' for booking requests,
-- 'sid-juniors-2026-10-05' once a payment link is set). It asks two optional
-- things no match page asks: the player's current club, and a note for the
-- coaches.
--
-- Both nullable with no default, so existing rows and the live Power League
-- insert (which sends neither column) are unaffected. Length caps follow the
-- repo's anon-insert convention (power_game_length_caps, jr_term4_waitlist).
--
-- RLS is unchanged: anon/authenticated may INSERT only. There is still no
-- SELECT, UPDATE or DELETE policy, so the browser can never read or edit a row.
--
-- ROLLBACK:
--   ALTER TABLE public.match_registrations
--     DROP CONSTRAINT IF EXISTS match_registrations_club_len,
--     DROP CONSTRAINT IF EXISTS match_registrations_notes_len,
--     DROP COLUMN IF EXISTS club,
--     DROP COLUMN IF EXISTS notes;
-- ============================================================

ALTER TABLE public.match_registrations
  ADD COLUMN IF NOT EXISTS club  text,
  ADD COLUMN IF NOT EXISTS notes text;

ALTER TABLE public.match_registrations
  ADD CONSTRAINT match_registrations_club_len  CHECK (char_length(club)  <= 200),
  ADD CONSTRAINT match_registrations_notes_len CHECK (char_length(notes) <= 1000);

COMMENT ON COLUMN public.match_registrations.club  IS 'Optional. The player''s current club, as typed by the parent. First used by /sid-juniors.';
COMMENT ON COLUMN public.match_registrations.notes IS 'Optional. Anything the coaches should know on the day, as typed by the parent. First used by /sid-juniors.';
