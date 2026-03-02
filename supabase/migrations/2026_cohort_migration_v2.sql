-- Supabase Migration: Create official_cohort_2026 table

CREATE TABLE IF NOT EXISTS public.official_cohort_2026 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Core Details
    player_name TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    
    -- Admin Details
    gender TEXT,
    suburb TEXT,
    shirt_name TEXT,
    size_tshirt TEXT,
    size_short TEXT,
    size_pants TEXT,
    
    -- System Fields
    player_role TEXT,
    accepted_offer BOOLEAN DEFAULT true,
    payment_plan_selected TEXT,
    payment_status TEXT DEFAULT 'pending',
    
    -- Comms Preferences
    group_chat_consent BOOLEAN,
    phone_numbers JSONB,
    preferred_comms TEXT
);

-- Enable Row Level Security
ALTER TABLE public.official_cohort_2026 ENABLE ROW LEVEL SECURITY;

-- Create policy to allow open inserts (since this is from a public landing page form)
CREATE POLICY "Enable insert for anonymous users" 
ON public.official_cohort_2026
FOR INSERT 
TO public
WITH CHECK (true);

-- Create policy to allow read access for authenticated admins only
CREATE POLICY "Enable read for authenticated users only"
ON public.official_cohort_2026
FOR SELECT
TO authenticated
USING (true);
