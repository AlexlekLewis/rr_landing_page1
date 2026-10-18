-- ─────────────────────────────────────────────────────────────
-- Lower Plenty Junior Royals Day — registrations
--
-- The free Junior Royals Carnival at Lower Plenty Cricket Club on Sunday
-- 25 October 2026, 9:00–11:00am, for players aged 7 to 12 (Alex, 16 Oct 2026).
-- Page: rramelbourne.com/lower-plenty-junior-royals-day
-- Facts: src/components/lower-plenty-junior-royals-day/lpJrDayData.js
--
-- One row = one player registered for the morning. It is free: no payment is
-- taken, and a saved row IS the player's place.
--
-- Two limits are enforced HERE, not only in the browser, so a stale tab or a
-- script cannot get round them (Alex, 16 Oct 2026):
--   • 60 places. The 61st insert is refused with EVENT_FULL.
--   • Registrations close Friday 23 October 2026, 9:00pm Melbourne time.
--     Any insert after that is refused with REGISTRATIONS_CLOSED.
-- Both numbers live in ONE function, lower_plenty_jr_day_limits(). Change
-- them there and the trigger and the page's place count both follow.
--
-- To free a place (a family cancels), set cancelled_at = now() on their row.
-- Never delete the row: the sheet and the place count both read cancelled_at.
-- ─────────────────────────────────────────────────────────────

create table if not exists public.lower_plenty_junior_royals_day_registrations (
  id uuid primary key default gen_random_uuid(),   -- generated in the browser
  created_at timestamptz not null default now(),
  -- player
  player_first_name text not null,
  player_last_name  text not null,
  player_age smallint not null,                    -- age on the day; the form only accepts 7 to 12
  club_status text,                                -- 'lower-plenty' | 'other-club' | 'no-club' (no CHECK on purpose)
  club_name text,                                  -- filled when club_status = 'other-club'
  notes text,                                      -- medical / anything the coaches should know
  -- parent / guardian (every player is under 18)
  parent_name text not null,
  email text not null,
  phone text not null,
  suburb text,
  -- agreements and consents (one per checkbox on the form)
  accept_terms boolean not null default false,
  accept_player_code boolean not null default false,
  accept_parent_code boolean not null default false,
  photo_consent_academy boolean not null default false,
  photo_consent_royals boolean not null default false,
  marketing_opt_in boolean not null default false,
  -- staff use
  cancelled_at timestamptz,                        -- set by staff to free the place; never set by the form
  -- attribution
  utm_source text, utm_medium text, utm_campaign text, utm_content text, page_referrer text
);

comment on table public.lower_plenty_junior_royals_day_registrations is
  'Lower Plenty Junior Royals Day (Junior Royals Carnival), Sun 25 Oct 2026, 9-11am, Lower Plenty '
  'Cricket Club. One row = one player aged 7-12 registered for the free morning. No payment is '
  'taken; a saved row is the player''s place. Capped at 60 places and closed after Fri 23 Oct '
  '2026 9pm Melbourne by trigger (limits in lower_plenty_jr_day_limits()). Filled by the form at '
  'rramelbourne.com/lower-plenty-junior-royals-day. Synced to Google Sheet "RRA - Program Sign-Ups", '
  'tab "Lower Plenty Junior Royals Day - DO NOT EDIT", every 30 min. Facts: '
  'src/components/lower-plenty-junior-royals-day/lpJrDayData.js.';
comment on column public.lower_plenty_junior_royals_day_registrations.player_age is
  'Age on Sunday 25 October 2026, as typed by the parent. The form accepts 7 to 12.';
comment on column public.lower_plenty_junior_royals_day_registrations.club_status is
  'lower-plenty = plays at Lower Plenty Cricket Club; other-club = another club (name in club_name); no-club = not at a club yet.';
comment on column public.lower_plenty_junior_royals_day_registrations.cancelled_at is
  'Set by staff when a family cancels. A cancelled row no longer counts towards the 60 places.';
comment on column public.lower_plenty_junior_royals_day_registrations.photo_consent_academy is
  'Parent said yes to Rajasthan Royals Academy Melbourne using photos/video of the player from this morning.';
comment on column public.lower_plenty_junior_royals_day_registrations.photo_consent_royals is
  'Parent said yes to the Rajasthan Royals also using them on their own channels.';
comment on column public.lower_plenty_junior_royals_day_registrations.marketing_opt_in is
  'Parent asked to hear about other Junior Royals programs and events. Unticked by default.';

create index if not exists lower_plenty_jr_day_created_idx
  on public.lower_plenty_junior_royals_day_registrations (created_at desc);
create index if not exists lower_plenty_jr_day_email_idx
  on public.lower_plenty_junior_royals_day_registrations (email);

-- ── RLS: the public form can INSERT. Nobody outside the service role can read,
-- update or delete. The form can never set cancelled_at.
alter table public.lower_plenty_junior_royals_day_registrations enable row level security;
drop policy if exists "public insert" on public.lower_plenty_junior_royals_day_registrations;
create policy "public insert" on public.lower_plenty_junior_royals_day_registrations
  for insert to anon, authenticated
  with check (cancelled_at is null);

-- ── The two limits, in one place.
create or replace function public.lower_plenty_jr_day_limits()
returns table (capacity integer, closes_at timestamptz)
language sql stable
set search_path = public
as $$
  select 60, ('2026-10-23 21:00:00'::timestamp at time zone 'Australia/Melbourne');
$$;

-- ── Refuse an insert once the event is full or registrations have closed.
-- SECURITY DEFINER so it can count rows the anon role cannot read. The advisory
-- lock serialises inserts, so two parents can't both take the 60th place.
create or replace function public.lower_plenty_jr_day_guard()
returns trigger
language plpgsql security definer
set search_path = public
as $$
declare
  lim record;
  taken integer;
begin
  select * into lim from public.lower_plenty_jr_day_limits();
  if now() >= lim.closes_at then
    raise exception 'REGISTRATIONS_CLOSED' using errcode = 'P0001';
  end if;
  perform pg_advisory_xact_lock(hashtext('lower_plenty_junior_royals_day_registrations'));
  select count(*) into taken
    from public.lower_plenty_junior_royals_day_registrations
    where cancelled_at is null;
  if taken >= lim.capacity then
    raise exception 'EVENT_FULL' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
revoke all on function public.lower_plenty_jr_day_guard() from public, anon, authenticated;

drop trigger if exists lower_plenty_jr_day_guard on public.lower_plenty_junior_royals_day_registrations;
create trigger lower_plenty_jr_day_guard
  before insert on public.lower_plenty_junior_royals_day_registrations
  for each row execute function public.lower_plenty_jr_day_guard();

-- ── What the page reads to show "X of 60 places left". Returns counts only,
-- never a name or contact detail.
create or replace function public.lower_plenty_jr_day_places()
returns json
language sql stable security definer
set search_path = public
as $$
  select json_build_object(
    'capacity', l.capacity,
    'taken', (select count(*) from public.lower_plenty_junior_royals_day_registrations where cancelled_at is null),
    'closes_at', l.closes_at
  )
  from public.lower_plenty_jr_day_limits() l;
$$;
revoke all on function public.lower_plenty_jr_day_places() from public;
grant execute on function public.lower_plenty_jr_day_places() to anon, authenticated;
