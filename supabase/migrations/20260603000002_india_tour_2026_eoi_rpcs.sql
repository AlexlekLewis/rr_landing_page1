-- India Tour 2026 — RPCs for the EOI page.
-- 1) Token-gated export for the Google Sheets sync (Apps Script polls this every minute).
CREATE OR REPLACE FUNCTION public.export_india_tour_2026_eoi(p_token text)
RETURNS SETOF public.india_tour_2026_eoi
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF p_token IS NULL OR p_token <> 'it26_976803fcea81a687074b255fcb09402c62619d1f9711c51e' THEN
        RAISE EXCEPTION 'unauthorized';
    END IF;
    RETURN QUERY SELECT * FROM public.india_tour_2026_eoi ORDER BY created_at ASC;
END;
$$;
REVOKE ALL ON FUNCTION public.export_india_tour_2026_eoi(text) FROM public;
GRANT EXECUTE ON FUNCTION public.export_india_tour_2026_eoi(text) TO anon, authenticated;
COMMENT ON FUNCTION public.export_india_tour_2026_eoi(text) IS 'Token-gated read of india_tour_2026_eoi for the India Tour 2026 EOI Google Sheet sync.';

-- 2) Anonymous referral-code validator that gates the private page.
--    Returns one row: (valid, member_name). Never exposes the referral list.
CREATE OR REPLACE FUNCTION public.validate_india_tour_referral(p_code text)
RETURNS TABLE(valid boolean, member_name text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
        SELECT true, r.member_name
        FROM public.india_tour_2026_referrals r
        WHERE lower(r.code) = lower(trim(p_code)) AND r.active = true
        LIMIT 1;
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::text;
    END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.validate_india_tour_referral(text) FROM public;
GRANT EXECUTE ON FUNCTION public.validate_india_tour_referral(text) TO anon, authenticated;
COMMENT ON FUNCTION public.validate_india_tour_referral(text) IS 'Anonymous gate check for /india-tour-2026: returns whether a referral code is active and the referring member name.';
