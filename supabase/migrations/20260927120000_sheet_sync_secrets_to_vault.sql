-- Google Sheets sync: take the secrets out of the function bodies.
--
-- NOT YET APPLIED to production. Create the Vault secrets below first. If they are
-- missing when this runs, the two sync triggers skip their HTTP call and log a warning.
-- Registrations still save; only the sheet sync pauses.
--
-- Vault secrets this migration reads (Dashboard -> Project Settings -> Vault, or
-- `select vault.create_secret('<value>', '<name>', '<description>');` in the SQL editor):
--   google_sheets_webhook_url     Apps Script web-app URL that notify_google_sheets() posts to
--   google_sheets_webhook_secret  shared secret that Apps Script checks in the request body
--   supabase_webhook_secret       must equal the Vercel env var SUPABASE_WEBHOOK_SECRET
--                                 (checked by /api/sync-holiday-row and the other sync endpoints)
-- Never write a secret value into this file or any other migration. This repo is public.
--
-- What changes:
--   1. notify_google_sheets() (AFTER INSERT on applications, elite_2026_waitlist,
--      official_cohort_2026) reads its URL and secret from Vault, and gets a fixed
--      search_path.
--   2. notify_sync_holiday_row() (AFTER INSERT/UPDATE on the holiday registration tables)
--      reads its x-webhook-secret header value from Vault.
--   3. export_power_game_inquiries(), export_power_game_applications() and
--      export_india_tour_2026_eoi() no longer compare p_token with a written-in token.
--      They already run for the service_role key only, because EXECUTE was revoked from
--      anon and authenticated on 2026-06-09. They now also check the caller's role
--      themselves, so a later GRANT cannot quietly reopen them. p_token stays in the
--      signature so the Apps Scripts keep working unchanged. Its value is ignored.
-- CREATE OR REPLACE keeps each function's owner, grants and triggers as they are.

create or replace function public.notify_google_sheets()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_url    text;
  v_secret text;
  payload  jsonb;
begin
  select decrypted_secret into v_url
    from vault.decrypted_secrets where name = 'google_sheets_webhook_url';
  select decrypted_secret into v_secret
    from vault.decrypted_secrets where name = 'google_sheets_webhook_secret';

  -- Never block the insert because of the sheet sync.
  if v_url is null or v_secret is null then
    raise warning 'notify_google_sheets: Vault secret google_sheets_webhook_url or google_sheets_webhook_secret is missing; % on % not sent to Google Sheets',
      TG_OP, TG_TABLE_NAME;
    return NEW;
  end if;

  payload := jsonb_build_object(
    'table', TG_TABLE_NAME,
    'event', TG_OP,
    'record', row_to_json(NEW)::jsonb,
    'timestamp', now(),
    'secret', v_secret
  );

  perform net.http_post(
    url := v_url,
    body := payload
  );

  return NEW;
end;
$function$;

comment on function public.notify_google_sheets() is
  'Posts each new row to the Google Sheets Apps Script web app. URL and shared secret come from Vault (google_sheets_webhook_url, google_sheets_webhook_secret).';

create or replace function public.notify_sync_holiday_row()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $function$
declare
  payload  jsonb;
  v_secret text;
begin
  select decrypted_secret into v_secret
    from vault.decrypted_secrets where name = 'supabase_webhook_secret';

  -- Never block the insert/update because of the sheet sync.
  if v_secret is null then
    raise warning 'notify_sync_holiday_row: Vault secret supabase_webhook_secret is missing; % on % not sent to /api/sync-holiday-row',
      TG_OP, TG_TABLE_NAME;
    return NEW;
  end if;

  payload := jsonb_build_object(
    'type',       TG_OP,
    'table',      TG_TABLE_NAME,
    'schema',     TG_TABLE_SCHEMA,
    'record',     to_jsonb(NEW),
    'old_record', case when TG_OP = 'UPDATE' then to_jsonb(OLD) else null end,
    'timestamp',  now()
  );

  perform net.http_post(
    url := 'https://rrlandingpage1.vercel.app/api/sync-holiday-row'::text,
    body := payload,
    headers := jsonb_build_object(
      'Content-Type',     'application/json',
      'x-webhook-secret', v_secret
    ),
    timeout_milliseconds := 5000
  );

  return NEW;
end;
$function$;

create or replace function public.export_power_game_inquiries(p_token text)
returns setof public.power_game_inquiries
language plpgsql
security definer
set search_path = public
as $function$
begin
    -- p_token is ignored; kept so existing callers keep working.
    if coalesce(auth.jwt() ->> 'role', '') <> 'service_role' then
        raise exception 'unauthorized';
    end if;
    return query
        select * from public.power_game_inquiries order by created_at asc;
end;
$function$;

comment on function public.export_power_game_inquiries(text) is
  'Service-role-only read of power_game_inquiries for the Power Game Inquiries 2026 Google Sheet sync. p_token is ignored.';

create or replace function public.export_power_game_applications(p_token text)
returns setof public.power_game_applications
language plpgsql
security definer
set search_path = public
as $function$
begin
    -- p_token is ignored; kept so existing callers keep working.
    if coalesce(auth.jwt() ->> 'role', '') <> 'service_role' then
        raise exception 'unauthorized';
    end if;
    return query
        select * from public.power_game_applications order by created_at asc;
end;
$function$;

comment on function public.export_power_game_applications(text) is
  'Service-role-only read of power_game_applications for the Google Sheet sync. p_token is ignored.';

create or replace function public.export_india_tour_2026_eoi(p_token text)
returns setof public.india_tour_2026_eoi
language plpgsql
security definer
set search_path = public
as $function$
begin
    -- p_token is ignored; kept so existing callers keep working.
    if coalesce(auth.jwt() ->> 'role', '') <> 'service_role' then
        raise exception 'unauthorized';
    end if;
    return query select * from public.india_tour_2026_eoi order by created_at asc;
end;
$function$;

comment on function public.export_india_tour_2026_eoi(text) is
  'Service-role-only read of india_tour_2026_eoi for the India Tour 2026 EOI Google Sheet sync. p_token is ignored.';
