-- power_game_inquiries: inquiries for The Power Game Program (new program).
-- Simple contact capture: player + parent details, location, player DOB.
-- Mirrors the anon-insert / authenticated-select RLS used by other public
-- landing-page lead tables (e.g. upcoming_program_interest, female_kickstart_2026).

CREATE TABLE IF NOT EXISTS public.power_game_inquiries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Player
    player_name     TEXT NOT NULL,
    player_dob      DATE,

    -- Parent / Guardian (best contact)
    parent_name     TEXT NOT NULL,
    parent_phone    TEXT NOT NULL,   -- best contact mobile
    parent_email    TEXT NOT NULL,   -- best contact email

    -- Location
    suburb          TEXT,
    city            TEXT,

    -- Classification / attribution
    source          TEXT NOT NULL DEFAULT 'power-game',
    program         TEXT NOT NULL DEFAULT 'The Power Game Program',
    utm_source      TEXT,
    utm_medium      TEXT,
    utm_campaign    TEXT,
    page_referrer   TEXT
);

CREATE INDEX IF NOT EXISTS idx_power_game_inquiries_created_at ON public.power_game_inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_power_game_inquiries_email      ON public.power_game_inquiries (parent_email);

ALTER TABLE public.power_game_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.power_game_inquiries;
CREATE POLICY "Enable insert for anonymous users"
    ON public.power_game_inquiries
    FOR INSERT
    TO public
    WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read for authenticated users only" ON public.power_game_inquiries;
CREATE POLICY "Enable read for authenticated users only"
    ON public.power_game_inquiries
    FOR SELECT
    TO authenticated
    USING (true);

COMMENT ON TABLE public.power_game_inquiries IS 'Inquiries for The Power Game Program from the /power-game-program landing page. Public anon insert, authenticated (admin) read.';
