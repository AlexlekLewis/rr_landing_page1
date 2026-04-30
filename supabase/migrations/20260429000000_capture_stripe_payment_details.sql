-- Capture full Stripe payment + customer data on every paid order.
-- Adds columns to both shop_orders_training and shop_orders_ipl so the
-- webhook can persist everything: card brand/last4, charge id, receipt
-- URL, paid amounts, currency, paid_at, and full Stripe metadata blob.

ALTER TABLE public.shop_orders_training
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text,
  ADD COLUMN IF NOT EXISTS stripe_charge_id        text,
  ADD COLUMN IF NOT EXISTS card_brand              text,
  ADD COLUMN IF NOT EXISTS card_last4              text,
  ADD COLUMN IF NOT EXISTS card_country            text,
  ADD COLUMN IF NOT EXISTS card_funding            text,
  ADD COLUMN IF NOT EXISTS receipt_url             text,
  ADD COLUMN IF NOT EXISTS amount_subtotal_cents   integer,
  ADD COLUMN IF NOT EXISTS amount_shipping_cents   integer,
  ADD COLUMN IF NOT EXISTS amount_tax_cents        integer,
  ADD COLUMN IF NOT EXISTS amount_total_cents      integer,
  ADD COLUMN IF NOT EXISTS currency                text,
  ADD COLUMN IF NOT EXISTS paid_at                 timestamptz,
  ADD COLUMN IF NOT EXISTS stripe_metadata         jsonb;

ALTER TABLE public.shop_orders_ipl
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text,
  ADD COLUMN IF NOT EXISTS stripe_charge_id        text,
  ADD COLUMN IF NOT EXISTS card_brand              text,
  ADD COLUMN IF NOT EXISTS card_last4              text,
  ADD COLUMN IF NOT EXISTS card_country            text,
  ADD COLUMN IF NOT EXISTS card_funding            text,
  ADD COLUMN IF NOT EXISTS receipt_url             text,
  ADD COLUMN IF NOT EXISTS amount_subtotal_cents   integer,
  ADD COLUMN IF NOT EXISTS amount_shipping_cents   integer,
  ADD COLUMN IF NOT EXISTS amount_tax_cents        integer,
  ADD COLUMN IF NOT EXISTS amount_total_cents      integer,
  ADD COLUMN IF NOT EXISTS currency                text,
  ADD COLUMN IF NOT EXISTS paid_at                 timestamptz,
  ADD COLUMN IF NOT EXISTS stripe_metadata         jsonb;

-- Unique stripe_session_id per table so the webhook can use ON CONFLICT
-- for idempotent upserts (Stripe occasionally redelivers events).
-- Multiple NULLs allowed (pre-checkout draft rows have NULL session id).
CREATE UNIQUE INDEX IF NOT EXISTS uq_shop_orders_training_stripe_session
  ON public.shop_orders_training(stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_shop_orders_ipl_stripe_session
  ON public.shop_orders_ipl(stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;
