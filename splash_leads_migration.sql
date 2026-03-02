-- Create splash_leads table for the Coming Soon page
CREATE TABLE IF NOT EXISTS public.splash_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    suburb TEXT,
    clubs TEXT
);

-- Enable RLS
ALTER TABLE public.splash_leads ENABLE ROW LEVEL SECURITY;

-- Allow insert access for anon users (if public form)
CREATE POLICY "Allow public insert to splash_leads"
ON public.splash_leads
FOR INSERT
TO public
WITH CHECK (true);

-- Allow select access for authenticated users (admin)
CREATE POLICY "Allow authenticated read to splash_leads"
ON public.splash_leads
FOR SELECT
TO authenticated
USING (true);
