-- SECURITY (applied to live 2026-06): export_power_game_inquiries(text) returns ALL
-- power_game_inquiries PII and had been GRANTed to anon, gated only by a static token
-- committed in a PUBLIC GitHub repo (supabase/google-sheets-sync/Code.gs) — anyone could
-- read the token and dump every inquiry. Revoke the anon/public path; restrict to
-- service_role. The Google Sheets Apps Script must be re-wired to a service_role key
-- stored in Apps Script Script Properties (never committed) to restore the sync.
REVOKE EXECUTE ON FUNCTION public.export_power_game_inquiries(text) FROM anon, public, authenticated;
GRANT EXECUTE ON FUNCTION public.export_power_game_inquiries(text) TO service_role;
