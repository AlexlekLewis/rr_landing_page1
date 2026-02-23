-- Create a migration to add new columns to applications table
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS second_email TEXT,
ADD COLUMN IF NOT EXISTS parent1_name TEXT,
ADD COLUMN IF NOT EXISTS parent1_email TEXT,
ADD COLUMN IF NOT EXISTS parent1_phone TEXT,
ADD COLUMN IF NOT EXISTS parent2_name TEXT,
ADD COLUMN IF NOT EXISTS parent2_email TEXT,
ADD COLUMN IF NOT EXISTS parent2_phone TEXT;

-- Enable RLS on tables (idempotent — no-ops if already enabled)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_activity_log ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to INSERT applications via the public form
CREATE POLICY "Allow anonymous inserts" ON applications
  FOR INSERT
  WITH CHECK (true);

-- Allow anonymous users to INSERT pipeline entries (created on form submission)
CREATE POLICY "Allow anonymous inserts" ON pipeline_entries
  FOR INSERT
  WITH CHECK (true);

-- Allow anonymous users to INSERT activity log entries (created on form submission)
CREATE POLICY "Allow anonymous inserts" ON pipeline_activity_log
  FOR INSERT
  WITH CHECK (true);

-- Allow anonymous users to read back the row they just inserted (needed for .select() after insert)
CREATE POLICY "Allow anonymous to read own insert" ON applications
  FOR SELECT
  USING (true);
