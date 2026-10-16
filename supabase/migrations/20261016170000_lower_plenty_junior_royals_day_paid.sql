-- ─────────────────────────────────────────────────────────────
-- Lower Plenty Junior Royals Day — now $10 per player (Alex, 16 Oct 2026)
--
-- Families register on the page, then pay $10 (incl. GST) through the Stripe
-- Payment Link "Junior Royals Carnival Day Entry Fee"
-- (plink_1UR3QNIo52UEA50yq6GKVkSy, https://buy.stripe.com/5kQdR99zHd4N0uUdI79Zm0W).
-- The form sends the row id as Stripe's client_reference_id, and
-- api/stripe-webhook.js marks the row paid when the payment completes.
--
-- A row now means: a player registered. paid = true means Stripe confirmed the
-- $10 and the place is booked. Unpaid rows still count towards the 60 places
-- (so we never oversell); staff free a place by setting cancelled_at.
-- ─────────────────────────────────────────────────────────────

alter table public.lower_plenty_junior_royals_day_registrations
  add column if not exists paid boolean not null default false,
  add column if not exists paid_at timestamptz,
  add column if not exists amount_paid_cents integer,
  add column if not exists stripe_session_id text,
  add column if not exists receipt_url text;

comment on column public.lower_plenty_junior_royals_day_registrations.paid is
  'True once Stripe confirmed the $10 entry fee (set by api/stripe-webhook.js via client_reference_id). Only then is the place booked.';
comment on column public.lower_plenty_junior_royals_day_registrations.stripe_session_id is
  'Stripe Checkout Session that paid for this row (cs_...).';

comment on table public.lower_plenty_junior_royals_day_registrations is
  'Lower Plenty Junior Royals Day (Junior Royals Carnival), Sun 25 Oct 2026, 9-11am, Lower Plenty '
  'Oval South, Montmorency Park. One row = one player aged 7-12 registered. $10 incl. GST per player '
  'via Stripe Payment Link plink_1UR3QNIo52UEA50yq6GKVkSy; paid=true means Stripe confirmed it and the '
  'place is booked (set by the webhook). Capped at 60 non-cancelled rows and closed after Fri 23 Oct '
  '2026 9pm Melbourne by trigger (limits in lower_plenty_jr_day_limits()). Filled by the form at '
  'rramelbourne.com/lower-plenty-junior-royals-day. Synced to Google Sheet "RRA - Program Sign-Ups", '
  'tab "Lower Plenty Junior Royals Day - DO NOT EDIT", every 30 min.';

-- The public form may only ever insert an UNPAID, un-cancelled row. Without
-- this, anyone could post paid = true straight to the API.
drop policy if exists "public insert" on public.lower_plenty_junior_royals_day_registrations;
create policy "public insert" on public.lower_plenty_junior_royals_day_registrations
  for insert to anon, authenticated
  with check (
    cancelled_at is null
    and paid = false
    and paid_at is null
    and amount_paid_cents is null
    and stripe_session_id is null
    and receipt_url is null
  );
