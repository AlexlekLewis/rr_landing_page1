-- Migration: Expand official_cohort_2026 to be the master table for LP4 form submissions
-- All application data + onboarding data + payment tracking in one place

-- Add application-level fields
ALTER TABLE public.official_cohort_2026
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS dob DATE,
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS player_email TEXT,
ADD COLUMN IF NOT EXISTS player_phone TEXT,
ADD COLUMN IF NOT EXISTS profile_link TEXT,
ADD COLUMN IF NOT EXISTS club TEXT,
ADD COLUMN IF NOT EXISTS history TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS goals TEXT,
ADD COLUMN IF NOT EXISTS cv_url TEXT,
ADD COLUMN IF NOT EXISTS cricket_type TEXT,
ADD COLUMN IF NOT EXISTS parent1_name TEXT,
ADD COLUMN IF NOT EXISTS parent1_email TEXT,
ADD COLUMN IF NOT EXISTS parent1_phone TEXT,
ADD COLUMN IF NOT EXISTS parent2_name TEXT,
ADD COLUMN IF NOT EXISTS parent2_email TEXT,
ADD COLUMN IF NOT EXISTS parent2_phone TEXT,
ADD COLUMN IF NOT EXISTS source TEXT;

-- Add payment option tracking to both tables
ALTER TABLE public.official_cohort_2026
ADD COLUMN IF NOT EXISTS payment_option_selected TEXT DEFAULT NULL;

ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS payment_option_selected TEXT DEFAULT NULL;

-- Allow anonymous UPDATE on applications
CREATE POLICY "Enable payment option update for anonymous users"
ON public.applications
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);
