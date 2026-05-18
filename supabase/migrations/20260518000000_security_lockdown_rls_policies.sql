-- ============================================================
-- Security hardening — RLS lockdown
-- ============================================================
-- Closes three issues found in the pre-passport-onboarding
-- security audit (branch claude/security-audit-api-M9jEA):
--
--   C1: program_registrations.allow_public_update allowed any
--       anon caller to rewrite paid registrations (amount,
--       email, payment_status, etc.) via the published anon key.
--
--   C2: applications."Enable payment option update for
--       anonymous users" allowed any anon caller to rewrite
--       every applicant's PII (email, phone, cv_url, bio,
--       parent contacts) and archive rows.
--
--   C8: upcoming_program_interest / general_enquiries /
--       programs_config were created without ENABLE ROW LEVEL
--       SECURITY, leaving lead PII potentially world-readable
--       and program config tamperable depending on the live
--       project's default grants.
--
-- After this migration, all writes to the affected tables go
-- through one of:
--   * anon INSERT (for lead/form capture)               — kept
--   * authenticated UPDATE/DELETE gated by dashboard_users
--     membership (admin actions)                        — added
--   * service role (Stripe webhook + sync endpoints)    — bypasses RLS
--
-- No browser-side UPDATEs to program_registrations or applications
-- exist beyond the admin archive/unarchive in ApplicationsTable.jsx,
-- which now runs through the authenticated/dashboard_users policy.
-- ============================================================

-- ------------------------------------------------------------
-- Helper: is the current authenticated user an active dashboard admin?
-- SECURITY DEFINER so the policy doesn't recurse through dashboard_users RLS.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_active_dashboard_user()
    RETURNS boolean
    LANGUAGE sql
    SECURITY DEFINER
    STABLE
    SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.dashboard_users
        WHERE lower(email) = lower(auth.jwt() ->> 'email')
          AND active = true
    );
$$;

REVOKE EXECUTE ON FUNCTION public.is_active_dashboard_user() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.is_active_dashboard_user() TO authenticated;

-- ============================================================
-- C1 — program_registrations: drop the unconstrained public UPDATE
-- ============================================================
-- The Stripe webhook (api/stripe-webhook.js) and the admin sync
-- endpoint (api/sync-programs-from-stripe.js) both use the
-- service role and bypass RLS, so removing this policy does not
-- break any legitimate write path. The admin dashboard only
-- SELECTs from this table.

DROP POLICY IF EXISTS "allow_public_update" ON public.program_registrations;

-- ============================================================
-- C2 — applications: drop public UPDATE, replace with admin-only
-- ============================================================
-- The original policy was added to support a "set payment option
-- after Stripe redirect" flow that no longer touches the
-- applications table (that flow now updates official_cohort_2026
-- in MasterStripeSuccess.jsx). The remaining legitimate UPDATE
-- callers are admin archive/unarchive actions in
-- ApplicationsTable.jsx, which must continue to work.

DROP POLICY IF EXISTS "Enable payment option update for anonymous users"
    ON public.applications;

DROP POLICY IF EXISTS "admin_dashboard_users_update" ON public.applications;
CREATE POLICY "admin_dashboard_users_update"
    ON public.applications
    FOR UPDATE
    TO authenticated
    USING (public.is_active_dashboard_user())
    WITH CHECK (public.is_active_dashboard_user());

-- ============================================================
-- C8 — homepage_leads tables: enable RLS + explicit policies
-- ============================================================
-- These three tables were created in 20260312000000_homepage_leads.sql
-- without ENABLE ROW LEVEL SECURITY. Make the posture explicit:
--   * upcoming_program_interest / general_enquiries: anon may
--     INSERT (public lead forms in RegisterDrawer.jsx); only
--     active dashboard users may SELECT / UPDATE / DELETE.
--   * programs_config: anon may SELECT (the homepage program
--     cards render from it via HomeProgramCards.jsx); only
--     active dashboard users may write.

-- upcoming_program_interest
ALTER TABLE public.upcoming_program_interest ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_lead" ON public.upcoming_program_interest;
CREATE POLICY "anon_insert_lead"
    ON public.upcoming_program_interest
    FOR INSERT
    TO anon
    WITH CHECK (true);

DROP POLICY IF EXISTS "admin_full_access" ON public.upcoming_program_interest;
CREATE POLICY "admin_full_access"
    ON public.upcoming_program_interest
    FOR ALL
    TO authenticated
    USING (public.is_active_dashboard_user())
    WITH CHECK (public.is_active_dashboard_user());

-- general_enquiries
ALTER TABLE public.general_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_enquiry" ON public.general_enquiries;
CREATE POLICY "anon_insert_enquiry"
    ON public.general_enquiries
    FOR INSERT
    TO anon
    WITH CHECK (true);

DROP POLICY IF EXISTS "admin_full_access" ON public.general_enquiries;
CREATE POLICY "admin_full_access"
    ON public.general_enquiries
    FOR ALL
    TO authenticated
    USING (public.is_active_dashboard_user())
    WITH CHECK (public.is_active_dashboard_user());

-- programs_config
ALTER TABLE public.programs_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_active" ON public.programs_config;
CREATE POLICY "public_read_active"
    ON public.programs_config
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "admin_write" ON public.programs_config;
CREATE POLICY "admin_write"
    ON public.programs_config
    FOR ALL
    TO authenticated
    USING (public.is_active_dashboard_user())
    WITH CHECK (public.is_active_dashboard_user());
