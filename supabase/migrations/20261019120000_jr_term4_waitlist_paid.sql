-- ─────────────────────────────────────────────────────────────
-- Junior Royals Term 4 — bookings now take payment (Alex, 19 Oct 2026)
--
-- Term 4 (8 Wednesdays, 28 Oct – 16 Dec 2026, Mickleham + Cranbourne North)
-- is now paid through Alex's two Stripe Payment Links:
--   upfront  https://buy.stripe.com/14A14n4fn3ud0uU7jJ9Zm0Y  ($349 for 8 weeks)
--   weekly   https://buy.stripe.com/7sYeVd9zH3udgtSavV9Zm0X  ($44.95 a week)
-- The page saves the entry first (this table), then sends the family to the
-- link with the row id as Stripe's client_reference_id; api/stripe-webhook.js
-- marks the row paid. Alex approved adding these columns on 19 Oct 2026
-- ("Yes, add the paid columns").
--
-- A row still means "a player entered". paid = true means Stripe confirmed the
-- first payment. Monday rows (preferred_day = 'monday') are interest only.
-- ─────────────────────────────────────────────────────────────

alter table public.jr_term4_waitlist
  add column if not exists paid boolean not null default false,
  add column if not exists paid_at timestamptz,
  add column if not exists amount_paid_cents integer,
  add column if not exists stripe_session_id text;

comment on column public.jr_term4_waitlist.paid is
  'True once Stripe confirmed the payment for this entry (set by api/stripe-webhook.js via client_reference_id). For the weekly plan this is the first weekly payment.';
comment on column public.jr_term4_waitlist.amount_paid_cents is
  'What the first Stripe checkout charged, in cents, shirt included if bought.';
comment on column public.jr_term4_waitlist.stripe_session_id is
  'Stripe Checkout Session that paid for this entry (cs_...).';

-- The public form may only ever insert an UNPAID row. Without this, anyone
-- could post paid = true straight to the API.
drop policy if exists "anon can join the term 4 waitlist" on public.jr_term4_waitlist;
create policy "anon can join the term 4 waitlist" on public.jr_term4_waitlist
  for insert to anon, authenticated
  with check (
    paid = false
    and paid_at is null
    and amount_paid_cents is null
    and stripe_session_id is null
  );
