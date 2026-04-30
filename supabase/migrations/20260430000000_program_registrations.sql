-- ============================================================
-- Program Registrations — unified table for all PAID program
-- registrations across the Royals platform: Elite Program,
-- Holiday Programs, Female Cricket Kickstart, and Junior Royals
-- (multiple age/venue variants).
-- ============================================================
-- Distinct from shop_orders_training / shop_orders_ipl which
-- handle physical merchandise. The two systems live side-by-side;
-- the Stripe webhook routes between them based on metadata.source
-- and price IDs.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.program_registrations (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Classification
    program                     TEXT NOT NULL,        -- 'elite' | 'holiday' | 'female_kickstart' | 'junior_royals'
    program_variant             TEXT,                  -- short slug e.g. 'ages_7_9_bundoora', 'term_2_hallam'
    program_label               TEXT,                  -- human-readable: "Junior Royals — Ages 7-9, Bundoora"

    -- Customer
    customer_name               TEXT,
    customer_email              TEXT,
    customer_phone              TEXT,
    shipping_address            JSONB,

    -- Items
    items                       JSONB,                 -- array of line items as captured from Stripe

    -- Money (always store as integer cents — no division at write time)
    amount_subtotal_cents       INTEGER,
    amount_shipping_cents       INTEGER DEFAULT 0,
    amount_tax_cents            INTEGER DEFAULT 0,
    amount_total_cents          INTEGER,
    currency                    TEXT DEFAULT 'aud',

    -- Payment status
    payment_status              TEXT DEFAULT 'pending', -- 'pending' | 'completed' | 'refunded'

    -- Stripe references (UNIQUE constraint, NOT a partial index — required for ON CONFLICT to work)
    stripe_session_id           TEXT UNIQUE,
    stripe_payment_intent_id    TEXT,
    stripe_charge_id            TEXT,
    card_brand                  TEXT,
    card_last4                  TEXT,
    card_country                TEXT,
    card_funding                TEXT,
    receipt_url                 TEXT,
    paid_at                     TIMESTAMPTZ,
    stripe_metadata             JSONB
);

-- Indexes for common dashboard queries
CREATE INDEX IF NOT EXISTS idx_program_registrations_program          ON public.program_registrations (program);
CREATE INDEX IF NOT EXISTS idx_program_registrations_customer_email   ON public.program_registrations (customer_email);
CREATE INDEX IF NOT EXISTS idx_program_registrations_paid_at          ON public.program_registrations (paid_at DESC);
CREATE INDEX IF NOT EXISTS idx_program_registrations_payment_status   ON public.program_registrations (payment_status);
CREATE INDEX IF NOT EXISTS idx_program_registrations_program_variant  ON public.program_registrations (program_variant);

-- RLS — match the shop_orders_training pattern exactly
ALTER TABLE public.program_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_authenticated_select" ON public.program_registrations;
CREATE POLICY "allow_authenticated_select"
    ON public.program_registrations
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "allow_public_insert" ON public.program_registrations;
CREATE POLICY "allow_public_insert"
    ON public.program_registrations
    FOR INSERT
    TO anon
    WITH CHECK (true);

DROP POLICY IF EXISTS "allow_public_update" ON public.program_registrations;
CREATE POLICY "allow_public_update"
    ON public.program_registrations
    FOR UPDATE
    TO public
    WITH CHECK (true);

COMMENT ON TABLE public.program_registrations IS 'Paid program registrations (Elite, Holiday, Female Kickstart, Junior Royals) — populated by Stripe webhook + sync-programs-from-stripe endpoint. Shop merchandise lives in shop_orders_training/_ipl.';
