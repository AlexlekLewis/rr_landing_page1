-- ============================================================
-- Junior Royals Term 4 waitlist (applied to prod 30 Jul 2026 via MCP;
-- this file is the canonical record).
-- ============================================================
-- Captured from the sold-out /junior-royals page. Anon may INSERT only —
-- no anon select, so parent/player PII stays private (deliberately tighter
-- than the jr_term3_* tables). Admin dashboard reads via authenticated.
create table if not exists public.jr_term4_waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  parent_name text not null check (char_length(parent_name) <= 200),
  parent_email text not null check (char_length(parent_email) <= 320),
  parent_phone text check (char_length(parent_phone) <= 50),
  player_name text not null check (char_length(player_name) <= 200),
  player_age integer check (player_age between 4 and 18),
  preferred_centre text check (preferred_centre in ('mickleham','hallam','williamstown','any')),
  source text default 'junior-royals-sold-out-page' check (char_length(source) <= 100),
  utm_source text check (char_length(utm_source) <= 200),
  utm_medium text check (char_length(utm_medium) <= 200),
  utm_campaign text check (char_length(utm_campaign) <= 200),
  page_referrer text check (char_length(page_referrer) <= 500)
);
alter table public.jr_term4_waitlist enable row level security;
create policy "anon can join the term 4 waitlist" on public.jr_term4_waitlist
  for insert to anon, authenticated with check (true);
create policy "authenticated reads waitlist" on public.jr_term4_waitlist
  for select to authenticated using (true);
revoke update, delete on public.jr_term4_waitlist from anon, authenticated;
