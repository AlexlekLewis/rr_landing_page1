-- ─────────────────────────────────────────────────────────────
-- Lower Plenty Junior Royals Day: CANCELLED, so close registrations now
-- (Alex, 23 Oct 2026)
--
-- Heavy rain is forecast for the weekend, so the morning on Sunday 25 October
-- is called off. Registrations were due to close Friday 23 October, 9:00pm.
-- This moves the close time to a moment that has already passed.
--
-- What that does, with no other change:
--   * lower_plenty_jr_day_guard() refuses every new insert
--     (REGISTRATIONS_CLOSED), so nobody can register and nobody reaches the
--     Stripe page from the form.
--   * lower_plenty_jr_day_places() reports a closes_at in the past, so the
--     live page treats the event as closed.
-- Existing rows, paid flags and the Stripe webhook are untouched. Refunds are
-- done in Stripe by staff.
--
-- ROLLBACK (re-opens registrations until Fri 23 Oct 9:00pm; only if this was
-- a mistake):
--   create or replace function public.lower_plenty_jr_day_limits()
--   returns table (capacity integer, closes_at timestamptz)
--   language sql stable
--   set search_path = public
--   as $$
--     select 60, ('2026-10-23 21:00:00'::timestamp at time zone 'Australia/Melbourne');
--   $$;
-- ─────────────────────────────────────────────────────────────

create or replace function public.lower_plenty_jr_day_limits()
returns table (capacity integer, closes_at timestamptz)
language sql stable
set search_path = public
as $$
  select 60, ('2026-10-23 08:30:00'::timestamp at time zone 'Australia/Melbourne');
$$;
