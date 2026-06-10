-- SECURITY (applied live 2026-06): export_power_game_inquiries(text) and
-- export_india_tour_2026_eoi(text) are SECURITY DEFINER functions that return ALL
-- rows (full PII) of their tables, gated only by a static token compared inside the
-- function body. The power_game token had been committed in a PUBLIC repo
-- (supabase/google-sheets-sync/Code.gs), so anyone could read it and dump every row.
--
-- Fix: revoke the anon/public/authenticated EXECUTE path on both; restrict to
-- service_role. The hardcoded tokens are thereby neutralised (only the service_role
-- key — never committed — can call these now). The Google Sheets Apps Scripts must be
-- re-wired to a service_role key stored in Script Properties to restore the syncs.
REVOKE EXECUTE ON FUNCTION public.export_power_game_inquiries(text) FROM anon, public, authenticated;
GRANT  EXECUTE ON FUNCTION public.export_power_game_inquiries(text) TO service_role;

REVOKE EXECUTE ON FUNCTION public.export_india_tour_2026_eoi(text) FROM anon, public, authenticated;
GRANT  EXECUTE ON FUNCTION public.export_india_tour_2026_eoi(text) TO service_role;
