-- power_game_applications: full application records for the Power Game Program
-- (Pre-Season Power Phase and future phases). Captures the same rich field set
-- as the Elite Program application, plus venue/age-group selection, source, and
-- UTM attribution. Public anon insert; authenticated (admin) read. A Supabase
-- Database Webhook on INSERT/UPDATE drives the Google Sheets sync
-- (/api/sync-power-game-row), mirroring the holiday-program pipeline.

CREATE TABLE IF NOT EXISTS public.power_game_applications (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Player
    first_name           TEXT NOT NULL,
    last_name            TEXT NOT NULL,
    player_name          TEXT,                 -- convenience: "First Last"
    dob                  DATE,
    age                  INTEGER,
    cricket_type         TEXT,                 -- 'Male Cricket' | 'Female Cricket'
    email                TEXT,                 -- player email (blank for U18)
    phone                TEXT,                 -- player phone (blank for U18)
    suburb               TEXT,

    -- Cricket profile
    profile_link         TEXT,
    club                 TEXT,
    bio                  TEXT,
    goals                TEXT,
    cv_url               TEXT,

    -- Parent / Guardian
    parent1_name         TEXT,
    parent1_email        TEXT,
    parent1_phone        TEXT,
    parent2_name         TEXT,
    parent2_email        TEXT,
    parent2_phone        TEXT,

    -- Selection (if provided from the selector flow)
    venue                TEXT,
    age_group            TEXT,
    session_day          TEXT,
    session_time         TEXT,
    phase                TEXT DEFAULT 'Pre-Season Power Phase',

    -- Compliance
    accept_terms         BOOLEAN DEFAULT FALSE,
    accept_player_code   BOOLEAN DEFAULT FALSE,
    accept_parent_code   BOOLEAN DEFAULT FALSE,
    accept_social_media  BOOLEAN DEFAULT FALSE,
    accept_playing_standard BOOLEAN DEFAULT FALSE,

    -- Payment (filled later if/when checkout is wired)
    payment_status       TEXT DEFAULT 'pending',
    amount_paid_cents    INTEGER,
    paid_at              TIMESTAMPTZ,
    stripe_session_id    TEXT,
    receipt_url          TEXT,

    -- Admin
    status               TEXT DEFAULT 'pending',
    admin_notes          TEXT,

    -- Attribution
    source               TEXT NOT NULL DEFAULT 'power-game-program',
    utm_source           TEXT,
    utm_medium           TEXT,
    utm_campaign         TEXT,
    page_referrer        TEXT
);

CREATE INDEX IF NOT EXISTS idx_pg_apps_created_at ON public.power_game_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pg_apps_email      ON public.power_game_applications (parent1_email);

ALTER TABLE public.power_game_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.power_game_applications;
CREATE POLICY "Enable insert for anonymous users"
    ON public.power_game_applications
    FOR INSERT
    TO public
    WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read for authenticated users only" ON public.power_game_applications;
CREATE POLICY "Enable read for authenticated users only"
    ON public.power_game_applications
    FOR SELECT
    TO authenticated
    USING (true);

COMMENT ON TABLE public.power_game_applications IS
    'Full application records for The Power Game Program (/PGP2026). Public anon insert, authenticated (admin) read. A Supabase webhook on INSERT/UPDATE syncs each row to the Power Game Applications Google Sheet via /api/sync-power-game-row.';
