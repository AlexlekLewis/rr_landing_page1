-- ============================================================
-- match_registrations: add club + notes (applied to prod 27 Sep 2026 via MCP
-- apply_migration as "match_registrations_add_club_notes"; this file is the
-- canonical record).
-- ============================================================
-- /sid-juniors reuses the shared match_registrations table, tagged by
-- match_slug. It asks two optional things no match page asks: the player's
-- current club and a note for the coaches. Both nullable with no default, so
-- existing rows and the match pages' inserts (which send neither) are
-- unaffected. Length caps follow the repo's convention for public forms.
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
