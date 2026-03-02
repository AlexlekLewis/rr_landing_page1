-- Supabase Migration: Add selected_sessions to official_cohort_2026 table

ALTER TABLE public.official_cohort_2026
ADD COLUMN IF NOT EXISTS selected_sessions TEXT;
