-- ─────────────────────────────────────────────────────────────
-- Royals Private Coaching (premium) — booking requests
--
-- Andy, 13 Nov 2026: premium one-to-one (and one-to-two, one-to-three) coaching
-- where the coach uses the Academy's tech in the lane (Match Centre, fielding heat
-- maps, bowling maps). Three coach price tiers. Three centres: Cranbourne North,
-- Mickleham, and the West Centre at M9 Sports Centre, Ravenhall.
-- Page: rramelbourne.com/private-coaching-premium (PREVIEW, hidden, noindex)
-- Facts: src/components/premium-coaching/premiumCoachingData.js
--
-- One row = one family booking private coaching for one player (in a 1-to-2 the
-- training partner is named in other_players). Formats: 1-to-1 or 1-to-2 at the SAME
-- price (Andy, 17 Nov 2026). Packages: 1, 3 or 5 sessions.
-- Prices are stored as shown on the page (GST-inclusive). While a tier has no Stripe
-- Payment Link the row is a REQUEST: nothing charged, staff send the payment link.
-- Paid or not, each session is subject to lane availability and staff confirmation.
--
-- Governance (CLAUDE.md): the four accept_* boxes are required by the form.
-- Training shirt (CLAUDE.md): shirt_size is set when the family said the player has
-- no shirt (and `source` carries |shirt=order-<size> or |shirt=has). When payment
-- links arrive, "No" must get the link with the shirt locked at quantity 1.
--
-- ORDER: apply BEFORE the form is deployed anywhere it can be submitted.
-- ROLLBACK: drop table public.premium_private_coaching_requests;
-- ─────────────────────────────────────────────────────────────

create table if not exists public.premium_private_coaching_requests (
  id uuid primary key default gen_random_uuid(),   -- generated in the browser
  created_at timestamptz not null default now(),
  -- what they asked for
  centre text not null,                            -- 'cranbourne-north' | 'mickleham' | 'ravenhall'
  format text not null check (format in ('1-1', '1-2')),
  coach_slug text,                                 -- e.g. 'alex-lewis'; null = "match me with a coach"
  coach_tier text,                                 -- 'head' | 'performance' | 'academy'; null when matched by staff
  other_players text,                              -- name and age of the training partner in a 1-to-2
  package_sessions smallint check (package_sessions in (1, 3, 5)),
  price_per_session numeric(8,2),                  -- incl. GST, as shown; null for tiers not priced yet
  package_total numeric(8,2),                      -- incl. GST, before the training shirt
  selected_slots jsonb,                            -- [{date, start, end, centre}] chosen from the coach's live availability
  payment_status text not null default 'request',  -- request (no link yet) | sent_to_stripe | paid
  -- player
  player_first_name text not null,
  player_last_name text not null,
  player_age smallint not null,
  focus text not null,                             -- batting | pace | spin | wicketkeeping | all-round | not-sure
  playing_level text,
  club text,
  -- contact (parent/guardian when the player is under 18)
  parent_name text,
  email text not null,
  phone text not null,
  suburb text,
  availability text,
  notes text,                                      -- goals, injuries, medical
  -- kit
  shirt_size text,                                 -- training shirt to hand out; null = already has one
  source text,                                     -- 'premium-private-coaching|shirt=has' or '...|shirt=order-<size>'
  -- governance boxes (all required on the form)
  accept_terms boolean not null default false,
  accept_player_code boolean not null default false,
  accept_parent_code boolean not null default false,
  accept_social_media boolean not null default false,
  -- staff use
  status text not null default 'new',              -- staff: new | contacted | booked | paid | closed
  staff_notes text,
  -- attribution
  utm_source text, utm_medium text, utm_campaign text, utm_content text, page_referrer text
);

comment on table public.premium_private_coaching_requests is
  'Royals Private Coaching (premium 1-to-1 / 1-to-2 with Academy tech). One row = one family '
  'booking 1, 3 or 5 sessions for one player at Cranbourne North, Mickleham or Ravenhall (M9). '
  'Sessions are subject to lane availability and staff confirmation. Form: '
  'rramelbourne.com/private-coaching-premium. Facts: src/components/premium-coaching/premiumCoachingData.js.';
comment on column public.premium_private_coaching_requests.coach_slug is 'The coach the family chose. Null = they asked us to match them.';
comment on column public.premium_private_coaching_requests.shirt_size is 'Training shirt size to order and hand out ($29.95 incl. GST, added to the first payment). Null = the player already has one.';
comment on column public.premium_private_coaching_requests.accept_terms is 'Agreed to the Terms & Conditions and Privacy Policy and confirmed the details are accurate.';
comment on column public.premium_private_coaching_requests.accept_player_code is 'Agreed to the Player Code of Conduct.';
comment on column public.premium_private_coaching_requests.accept_parent_code is 'Agreed to the Parent/Guardian Code of Conduct. False for players 18+, who are not asked.';
comment on column public.premium_private_coaching_requests.accept_social_media is 'Agreed to photos and videos of the player being used on the Academy''s social media and marketing.';
comment on column public.premium_private_coaching_requests.status is 'Staff only. new → contacted → booked → paid, or closed.';

create index if not exists premium_pc_requests_created_idx on public.premium_private_coaching_requests (created_at desc);
create index if not exists premium_pc_requests_email_idx on public.premium_private_coaching_requests (email);

-- RLS: the public form can INSERT a new request. Nobody outside the service role can
-- read, update or delete. The form can't set staff fields.
alter table public.premium_private_coaching_requests enable row level security;
drop policy if exists "public insert" on public.premium_private_coaching_requests;
create policy "public insert" on public.premium_private_coaching_requests
  for insert to anon, authenticated
  with check (status = 'new' and staff_notes is null and payment_status in ('request', 'sent_to_stripe'));
