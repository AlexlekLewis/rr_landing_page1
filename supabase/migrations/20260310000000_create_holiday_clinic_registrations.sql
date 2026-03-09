-- Migration: Create holiday_clinic_registrations table
-- Date: 20260310000000
-- Page: /holiday-programs/
-- Routing: Option B — dedicated table only (does not feed into main applications dashboard)

CREATE TABLE IF NOT EXISTS holiday_clinic_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Parent / Guardian
    parent_name TEXT NOT NULL,
    parent_email TEXT NOT NULL,
    parent_phone TEXT NOT NULL,

    -- Player
    player_name TEXT NOT NULL,
    player_age INTEGER NOT NULL CHECK (player_age >= 7 AND player_age <= 16),
    player_gender TEXT NOT NULL CHECK (player_gender IN ('male', 'female')),
    primary_club TEXT NOT NULL,
    suburb TEXT NOT NULL,

    -- Clinic selection
    location TEXT NOT NULL CHECK (location IN ('cutting-edge', 'hallam')),

    -- Capacity / waitlist
    on_waitlist BOOLEAN NOT NULL DEFAULT FALSE,

    -- UTM / analytics tracking
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    page_referrer TEXT
);

-- Indexes for common admin queries
CREATE INDEX IF NOT EXISTS idx_hcr_location ON holiday_clinic_registrations (location);
CREATE INDEX IF NOT EXISTS idx_hcr_on_waitlist ON holiday_clinic_registrations (on_waitlist);
CREATE INDEX IF NOT EXISTS idx_hcr_created_at ON holiday_clinic_registrations (created_at DESC);

-- Row Level Security
ALTER TABLE holiday_clinic_registrations ENABLE ROW LEVEL SECURITY;

-- Anonymous users: INSERT only (public registration form)
CREATE POLICY "allow_public_insert" ON holiday_clinic_registrations
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Authenticated users (admin): full SELECT access
CREATE POLICY "allow_authenticated_select" ON holiday_clinic_registrations
    FOR SELECT
    TO authenticated
    USING (true);
