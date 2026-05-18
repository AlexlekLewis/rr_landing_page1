-- ============================================================
-- Security hardening — offer_tokens / offer_responses lockdown
-- ============================================================
-- Closes C5 + C6 from the pre-passport-onboarding security audit:
--
--   C5: anon role could INSERT into offer_tokens (proof in
--       test-token.js) — anyone could mint a valid program-
--       acceptance token and walk through the response flow.
--
--   C6: anon role could UPDATE offer_tokens by id, keyed off the
--       row id the SELECT returned. Combined with anon SELECT *,
--       this leaked applicant PII (name + email) on guess of a row
--       id, AND let any visitor flip the status of any token to
--       'attended' or 'declined'.
--
-- After this migration:
--   * RLS is enabled on both tables.
--   * NO policies are granted to anon. All public access goes
--     through POST /api/offer-token, which validates the token
--     STRING server-side and uses the service role (which bypasses
--     RLS).
--   * Active dashboard_users (authenticated role) retain full
--     access via the is_active_dashboard_user() helper defined in
--     20260518000000_security_lockdown_rls_policies.sql.
-- ============================================================

-- Drop every existing policy on these tables so we know the final
-- posture exactly. The original policies were not in repo migrations
-- (schema drift — see audit finding L8), so we can't reference them
-- by name. Use pg_policies to enumerate.
DO $$
DECLARE pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname, tablename
          FROM pg_policies
         WHERE schemaname = 'public'
           AND tablename IN ('offer_tokens', 'offer_responses')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- offer_tokens
ALTER TABLE public.offer_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_access"
    ON public.offer_tokens
    FOR ALL
    TO authenticated
    USING (public.is_active_dashboard_user())
    WITH CHECK (public.is_active_dashboard_user());

-- offer_responses
ALTER TABLE public.offer_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_access"
    ON public.offer_responses
    FOR ALL
    TO authenticated
    USING (public.is_active_dashboard_user())
    WITH CHECK (public.is_active_dashboard_user());
