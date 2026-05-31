-- Token-gated export of power_game_inquiries for the Google Sheets sync.
-- SECURITY DEFINER so it can read past RLS, but only when the caller passes the
-- correct shared secret. The anon key alone CANNOT read the table directly
-- (RLS still blocks that); data only comes back through this token-gated RPC.
CREATE OR REPLACE FUNCTION public.export_power_game_inquiries(p_token text)
RETURNS SETOF public.power_game_inquiries
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF p_token IS NULL OR p_token <> 'pg26_41d3a9013d39da58e110f69b5c0882e0cc5f729c151c7039' THEN
        RAISE EXCEPTION 'unauthorized';
    END IF;
    RETURN QUERY
        SELECT * FROM public.power_game_inquiries ORDER BY created_at ASC;
END;
$$;

REVOKE ALL ON FUNCTION public.export_power_game_inquiries(text) FROM public;
GRANT EXECUTE ON FUNCTION public.export_power_game_inquiries(text) TO anon, authenticated;

COMMENT ON FUNCTION public.export_power_game_inquiries(text) IS
    'Token-gated read of power_game_inquiries for the Power Game Inquiries 2026 Google Sheet sync (Apps Script polls this).';
