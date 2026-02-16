-- Create a migration to add new columns to applications table
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS second_email TEXT,
ADD COLUMN IF NOT EXISTS parent1_name TEXT,
ADD COLUMN IF NOT EXISTS parent1_email TEXT,
ADD COLUMN IF NOT EXISTS parent1_phone TEXT,
ADD COLUMN IF NOT EXISTS parent2_name TEXT,
ADD COLUMN IF NOT EXISTS parent2_email TEXT,
ADD COLUMN IF NOT EXISTS parent2_phone TEXT;
