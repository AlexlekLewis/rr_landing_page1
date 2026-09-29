-- ============================================================
-- match_registrations: second photo consent (applied to prod 27 Sep 2026 via
-- MCP apply_migration as "match_registrations_add_royals_media_consent"; this
-- file is the canonical record).
-- ============================================================
-- /sid-juniors asks two separate, optional photo questions.
-- accept_social_media (existing) holds the first; accept_royals_media (new)
-- holds the second. DEFAULT false: an unanswered question is a no, and the
-- match pages' inserts (which never ask it) keep working.
--
-- ROLLBACK:
--   ALTER TABLE public.match_registrations DROP COLUMN IF EXISTS accept_royals_media;
--   COMMENT ON COLUMN public.match_registrations.notes IS 'Optional. Anything the coaches should know on the day, as typed by the parent. First used by /sid-juniors.';
-- ============================================================

ALTER TABLE public.match_registrations
  ADD COLUMN IF NOT EXISTS accept_royals_media boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.match_registrations.accept_royals_media IS 'Optional consent: the Rajasthan Royals may use photos and video of the player on their own channels, which reach a worldwide audience. Separate from accept_social_media (RRA Melbourne''s own website, emails and social media). First used by /sid-juniors.';

COMMENT ON COLUMN public.match_registrations.notes IS 'Optional. Anything the coaches should know, as typed by the parent. May contain health information (asthma, allergies, medication, injuries). For the Academy staff running that session only, to keep the player safe on the day. First used by /sid-juniors.';
