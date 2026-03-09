-- Add payment_option_selected column to applications table
-- Tracks which Stripe payment option the lead clicked: 'pay_in_full' or 'flexi_pay'

ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS payment_option_selected TEXT DEFAULT NULL;

COMMENT ON COLUMN public.applications.payment_option_selected IS 'Tracks which Stripe payment option the lead clicked: pay_in_full or flexi_pay';

-- Allow anonymous users to UPDATE the payment_option_selected column
CREATE POLICY "Enable payment option update for anonymous users"
ON public.applications
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Also add payment_option_selected to official_cohort_2026 (cohort tracking table)
ALTER TABLE public.official_cohort_2026
ADD COLUMN IF NOT EXISTS payment_option_selected TEXT DEFAULT NULL;

COMMENT ON COLUMN public.official_cohort_2026.payment_option_selected IS 'Tracks which Stripe payment option the lead clicked from Master LP: pay_in_full or flexi_pay';
