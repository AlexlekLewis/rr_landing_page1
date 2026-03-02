-- Version 2 of the 2026 Cohort Tracking Table
-- Adds new fields required by the CEO revisions for LP3

-- First, let's drop the existing table and recreate it since there is no production data yet
DROP TABLE IF EXISTS "public"."official_cohort_2026";

CREATE TABLE "public"."official_cohort_2026" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "player_name" text,
    "parent_name" text,
    "email" text,
    "phone" text,
    "payment_plan_selected" text,
    "payment_status" text DEFAULT 'pending'::text,
    
    -- New fields from CEO revisions
    "accepted_offer" boolean,
    "decline_reason" text,
    "future_contact" boolean,
    "gender" text,
    "suburb" text,
    "shirt_name" text,
    "size_tshirt" text,
    "size_short" text,
    "size_pants" text,
    "player_role" text,
    "group_chat_consent" boolean,
    "phone_numbers" jsonb DEFAULT '[]'::jsonb,
    "preferred_comms" text
);

-- Set Primary Key
ALTER TABLE "public"."official_cohort_2026" ADD CONSTRAINT "official_cohort_2026_pkey" PRIMARY KEY ("id");

-- Enable Row Level Security
ALTER TABLE "public"."official_cohort_2026" ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for the public form)
CREATE POLICY "Enable insert for anonymous users" ON "public"."official_cohort_2026"
    AS PERMISSIVE FOR INSERT
    TO public
    WITH CHECK (true);

-- Allow authenticated users (admins) to view all records
CREATE POLICY "Enable read access for authenticated users" ON "public"."official_cohort_2026"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (true);
