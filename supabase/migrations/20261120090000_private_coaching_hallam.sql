-- ─────────────────────────────────────────────────────────────
-- Royals Private Coaching — Hallam as a fourth location (Andy, 20 Nov 2026:
-- "add Hallam as a location also please, replicating the same coaches as there are in
-- Cranbourne North").
--
-- private_coaching_availability.centre accepted three centres; this adds 'hallam'. The
-- one-centre-per-night trigger already treats it like any other centre, so a coach who
-- works Cranbourne North and Hallam still can't be at both on the same night.
-- ROLLBACK: re-create the check without 'hallam' (only if no rows use it).
-- ─────────────────────────────────────────────────────────────
alter table public.private_coaching_availability
  drop constraint if exists private_coaching_availability_centre_check;
alter table public.private_coaching_availability
  add constraint private_coaching_availability_centre_check
  check (centre in ('cranbourne-north', 'hallam', 'mickleham', 'ravenhall'));
