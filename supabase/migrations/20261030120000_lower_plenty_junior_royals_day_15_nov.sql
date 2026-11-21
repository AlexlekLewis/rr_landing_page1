-- ─────────────────────────────────────────────────────────────
-- Lower Plenty Junior Royals Day: BACK ON for Sunday 15 November 2026
-- (Alex, 30 Oct 2026)
--
-- The 25 October morning was rained out (closed on 23 Oct by migration
-- 20261023083000). Same times, $10 and 60 places; the new date is Sunday
-- 15 November 2026, 9:00-11:00am. This:
--   1. reopens registrations until Friday 13 November 2026, 9:00pm Melbourne
--      (lower_plenty_jr_day_limits(); the page's CLOSES_AT_ISO matches);
--   2. frees the three places from 25 October. All three families were refunded
--      their $10 in full in Stripe (26 Oct). The rows stay; cancelled_at is set,
--      so they no longer count towards the 60 or show as booked for 15 November;
--   3. puts the card back on the home page (programs_config) with the new date.
-- Steps 2 and 3 check the exact rows they expect and stop if anything differs.
--
-- ROLLBACK (only if this was a mistake):
--   create or replace function public.lower_plenty_jr_day_limits()
--   returns table (capacity integer, closes_at timestamptz) language sql stable
--   set search_path = public as $$
--     select 60, ('2026-10-23 08:30:00'::timestamp at time zone 'Australia/Melbourne');
--   $$;
--   update public.lower_plenty_junior_royals_day_registrations set cancelled_at = null
--    where id in ('327ed803-6554-4e56-b037-f56708de77b0',
--                 '61257277-6063-4543-875c-8acce1790232',
--                 'ec853d40-c215-4973-8aa1-bee42a9d78f8');
--   update public.programs_config set is_active = false, urgency_text = '$10 · Sun 25 Oct'
--    where program_id = 'lower-plenty-junior-royals-day-2026';
-- ─────────────────────────────────────────────────────────────

create or replace function public.lower_plenty_jr_day_limits()
returns table (capacity integer, closes_at timestamptz)
language sql stable
set search_path = public
as $$
  select 60, ('2026-11-13 21:00:00'::timestamp at time zone 'Australia/Melbourne');
$$;

do $$
declare n integer;
begin
  update public.lower_plenty_junior_royals_day_registrations
     set cancelled_at = now()
   where cancelled_at is null
     and id in ('327ed803-6554-4e56-b037-f56708de77b0',
                '61257277-6063-4543-875c-8acce1790232',
                'ec853d40-c215-4973-8aa1-bee42a9d78f8');
  get diagnostics n = row_count;
  if n <> 3 then
    raise exception 'Expected to free exactly 3 places from 25 October, would free %', n;
  end if;

  update public.programs_config
     set is_active = true, urgency_text = '$10 · Sun 15 Nov'
   where program_id = 'lower-plenty-junior-royals-day-2026';
  get diagnostics n = row_count;
  if n <> 1 then
    raise exception 'Expected exactly 1 home-page card, found %', n;
  end if;
end;
$$;
