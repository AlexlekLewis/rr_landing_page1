-- Migration: Add shirt_size column and update age range to 7–14
-- Date: 20260310000001

-- Add shirt_size column
ALTER TABLE holiday_clinic_registrations
    ADD COLUMN IF NOT EXISTS shirt_size TEXT;

-- Update age CHECK constraint from 7–16 to 7–14
ALTER TABLE holiday_clinic_registrations
    DROP CONSTRAINT IF EXISTS holiday_clinic_registrations_player_age_check;

ALTER TABLE holiday_clinic_registrations
    ADD CONSTRAINT holiday_clinic_registrations_player_age_check
    CHECK (player_age >= 7 AND player_age <= 14);
