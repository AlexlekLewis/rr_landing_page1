-- ─────────────────────────────────────────────────────────────
-- Royals Private Coaching — pay at booking, hold the times, second-player form
-- (Andy, 18 Nov 2026)
--
-- "we need to get the payment on the day ... someone has to then choose the time of the
-- coach and then pay for what they want." and, for 1-to-2: "the booker needs to pay it
-- all ... The second one, before they join any session or the first session, will need
-- to fill out a form ... ticked all the boxes and accepted all the different elements."
--
-- 1. premium_private_coaching_requests: Stripe session, when paid, how much.
-- 2. private_coaching_availability: a family's chosen hours are HELD for 30 minutes while
--    they pay (api/private-coaching-checkout.js), so two families can't buy the same hour.
--    The webhook turns a paid hold into 'booked'. An expired hold counts as open again.
-- 3. premium_private_coaching_partners: the second player in a 1-to-2. One row = that
--    player's details, governance boxes and training shirt. Written only by
--    api/private-coaching-partner.js (service role); nobody else can read or write it.
--
-- ROLLBACK: drop table public.premium_private_coaching_partners;
--   alter table public.private_coaching_availability drop column held_until, drop column held_by;
--   alter table public.premium_private_coaching_requests drop column stripe_session_id,
--     drop column paid_at, drop column amount_paid_cents;
--   (and re-create private_coaching_open_slots from 20261117120000)
-- ─────────────────────────────────────────────────────────────

alter table public.premium_private_coaching_requests
  add column if not exists stripe_session_id text,
  add column if not exists paid_at timestamptz,
  add column if not exists amount_paid_cents integer;

comment on column public.premium_private_coaching_requests.payment_status is
  'request = saved, not yet sent to Stripe; sent_to_stripe = checkout opened; paid = Stripe confirmed (webhook).';

alter table public.private_coaching_availability
  add column if not exists held_until timestamptz,
  add column if not exists held_by uuid;

comment on column public.private_coaching_availability.held_until is
  'While status = held: the hold lapses at this time (30 min after checkout opened) and the hour shows as open again.';

-- Open hours = open, or held but the hold has lapsed.
create or replace function public.private_coaching_open_slots(p_coach text default null)
returns table (coach_slug text, centre text, date date, start_time time, end_time time)
language sql stable security definer
set search_path = public
as $$
  select a.coach_slug, a.centre, a.date, a.start_time, a.end_time
  from public.private_coaching_availability a
  where (a.status = 'open' or (a.status = 'held' and a.held_until < now()))
    and a.date >= (now() at time zone 'Australia/Melbourne')::date
    and a.date <  (now() at time zone 'Australia/Melbourne')::date + 35
    and (p_coach is null or a.coach_slug = p_coach)
  order by a.date, a.start_time;
$$;
revoke all on function public.private_coaching_open_slots(text) from public;
grant execute on function public.private_coaching_open_slots(text) to anon, authenticated;

create table if not exists public.premium_private_coaching_partners (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  booking_id uuid not null references public.premium_private_coaching_requests(id) on delete cascade,
  player_first_name text not null,
  player_last_name text not null,
  player_age smallint not null,
  parent_name text,
  email text not null,
  phone text not null,
  notes text,
  shirt_size text,                               -- null = already has one
  shirt_paid_at timestamptz,                     -- set by the webhook when the shirt is paid
  stripe_session_id text,
  accept_terms boolean not null default false,
  accept_player_code boolean not null default false,
  accept_parent_code boolean not null default false,
  accept_social_media boolean not null default false,
  unique (booking_id)
);

comment on table public.premium_private_coaching_partners is
  'Royals Private Coaching 1-to-2: the second player. One row = their details, the four governance boxes '
  'and the training shirt (paid separately if ordered). Must be completed before the first session. '
  'Written only by api/private-coaching-partner.js.';

alter table public.premium_private_coaching_partners enable row level security;
-- no policies: service role only.
