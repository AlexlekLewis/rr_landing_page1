-- ============================================================
-- match_registrations: second photo consent (applied to prod 27 Sep 2026 via
-- MCP apply_migration as "match_registrations_add_royals_media_consent"; this
-- file is the canonical record).
-- ============================================================
-- Safeguarding review (27 Sep 2026) for /sid-juniors: photo consent is two
-- separate, optional answers, both unticked by default, neither blocking a
-- booking.
--   accept_social_media  (existing)  "RRA Melbourne may use photos and video of
--                                     my player from this session on its
--                                     website, emails and social media."
--   accept_royals_media  (new)       "The Rajasthan Royals may also use them on
--                                     their own channels, which reach a
--                                     worldwide audience."
--
-- DEFAULT false: an unanswered consent is a no. Adding a column with a
-- constant default is a metadata-only change, and the live Power League
-- insert (which never asks it) keeps working and reads as no.
--
-- Also re-describes `notes`, which may now hold health information.
--
-- ROLLBACK:
--   ALTER TABLE public.match_registrations DROP COLUMN IF EXISTS accept_royals_media;
--   COMMENT ON COLUMN public.match_registrations.notes IS 'Optional. Anything the coaches should know on the day, as typed by the parent. First used by /sid-juniors.';
-- ============================================================

ALTER TABLE public.match_registrations
  ADD COLUMN IF NOT EXISTS accept_royals_media boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.match_registrations.accept_royals_media IS 'Optional consent: the Rajasthan Royals may use photos and video of the player on their own channels, which reach a worldwide audience. Separate from accept_social_media (RRA Melbourne''s own website, emails and social media). First used by /sid-juniors.';

COMMENT ON COLUMN public.match_registrations.notes IS 'Optional. Anything the coaches should know, as typed by the parent. May contain health information (asthma, allergies, medication, injuries). For the Academy staff running that session only, to keep the player safe on the day. First used by /sid-juniors.';
