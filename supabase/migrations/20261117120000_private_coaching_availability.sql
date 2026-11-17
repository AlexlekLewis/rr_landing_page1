-- ─────────────────────────────────────────────────────────────
-- Royals Private Coaching — coach availability (Andy, 17 Nov 2026)
--
-- "You will be able to find Alex's availability in his portal where he will weekly
-- mark his availability. You will need to mirror his availability so that it is
-- always live for customers." and "make sure he never has a private coaching
-- session in different centres on the same night."
--
-- One row = one hour a coach is available for private coaching, at one centre.
-- The coach portal (or a sync from it) writes these rows; the page at
-- rramelbourne.com/private-coaching-premium reads them live through
-- private_coaching_open_slots(), which returns only coach, centre, date and times.
--
-- ONE CENTRE PER NIGHT: a coach can have many hours on a night, but all at one
-- centre. Any insert/update that would put the same coach at a second centre on the
-- same date is refused with ONE_CENTRE_PER_NIGHT. Applies to every coach (Alex Lewis
-- and Jinang Shah both work North and West).
--
-- Once a family pays, the session is still subject to lane availability at the centre
-- and staff confirmation (shown on the page). Staff set status = 'booked' to remove an
-- hour from the page.
--
-- ROLLBACK: drop function public.private_coaching_open_slots(text);
--           drop table public.private_coaching_availability;
-- ─────────────────────────────────────────────────────────────

create table if not exists public.private_coaching_availability (
  id uuid primary key default gen_random_uuid(),
  coach_slug text not null,                          -- matches COACHES[].slug in premiumCoachingData.js, e.g. 'alex-thornhill'
  centre text not null check (centre in ('cranbourne-north', 'mickleham', 'ravenhall')),
  date date not null,                                -- Melbourne date of the session
  start_time time not null,
  end_time time not null,
  status text not null default 'open' check (status in ('open', 'held', 'booked', 'withdrawn')),
  source text not null default 'coach-portal',       -- where the row came from (portal sync, staff, ...)
  updated_at timestamptz not null default now(),
  check (end_time > start_time),
  unique (coach_slug, date, start_time)
);

comment on table public.private_coaching_availability is
  'Royals Private Coaching: hours each coach is available, mirrored from the coach portal (weekly). '
  'One row = one coach, one centre, one hour. A coach can only be at ONE centre per night (trigger). '
  'Read by rramelbourne.com/private-coaching-premium via private_coaching_open_slots().';
comment on column public.private_coaching_availability.status is
  'open = shown to families; held = being booked; booked = taken (paid and confirmed); withdrawn = coach pulled it.';

create index if not exists private_coaching_availability_coach_date_idx
  on public.private_coaching_availability (coach_slug, date);

-- ── One centre per night, per coach. Advisory lock so two writes can't race past it.
create or replace function public.private_coaching_one_centre_per_night()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  perform pg_advisory_xact_lock(hashtext('pca:' || new.coach_slug || ':' || new.date::text));
  if exists (
    select 1 from public.private_coaching_availability a
    where a.coach_slug = new.coach_slug
      and a.date = new.date
      and a.centre <> new.centre
      and a.status <> 'withdrawn'
      and a.id <> new.id
  ) then
    raise exception 'ONE_CENTRE_PER_NIGHT: % already has private coaching at another centre on %', new.coach_slug, new.date
      using errcode = 'P0001';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists private_coaching_one_centre_per_night on public.private_coaching_availability;
create trigger private_coaching_one_centre_per_night
  before insert or update on public.private_coaching_availability
  for each row execute function public.private_coaching_one_centre_per_night();

-- ── RLS: nobody outside the service role reads or writes the table directly.
alter table public.private_coaching_availability enable row level security;

-- ── What the page reads: open hours from today for the next 5 weeks, Melbourne time.
-- Coach, centre, date and times only.
create or replace function public.private_coaching_open_slots(p_coach text default null)
returns table (coach_slug text, centre text, date date, start_time time, end_time time)
language sql stable security definer
set search_path = public
as $$
  select a.coach_slug, a.centre, a.date, a.start_time, a.end_time
  from public.private_coaching_availability a
  where a.status = 'open'
    and a.date >= (now() at time zone 'Australia/Melbourne')::date
    and a.date <  (now() at time zone 'Australia/Melbourne')::date + 35
    and (p_coach is null or a.coach_slug = p_coach)
  order by a.date, a.start_time;
$$;
revoke all on function public.private_coaching_open_slots(text) from public;
grant execute on function public.private_coaching_open_slots(text) to anon, authenticated;
