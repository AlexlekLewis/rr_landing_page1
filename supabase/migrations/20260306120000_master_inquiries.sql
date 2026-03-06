-- Supabase Migration: Create master_inquiries table

CREATE TABLE IF NOT EXISTS public.master_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Inquiry Type (full_application or zoom_only)
    inquiry_type TEXT NOT NULL DEFAULT 'full_application',
    
    -- General Details
    player_name TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    
    -- Specific to full_application
    dob DATE,
    player_role TEXT,
    competition TEXT, -- Male/Female etc
    competition_history TEXT, -- Clubs/teams from this season
    
    -- Payment state (if we decide to track it here before LP3 success)
    payment_status TEXT DEFAULT 'pending'
);

-- Enable Row Level Security
ALTER TABLE public.master_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow open inserts (since this is from a public landing page form)
CREATE POLICY "Enable insert for anonymous users" 
ON public.master_inquiries
FOR INSERT 
TO public
WITH CHECK (true);

-- Create policy to allow read access for authenticated admins only
CREATE POLICY "Enable read for authenticated users only"
ON public.master_inquiries
FOR SELECT
TO authenticated
USING (true);
