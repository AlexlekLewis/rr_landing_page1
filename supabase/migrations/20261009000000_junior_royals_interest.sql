-- ============================================================
-- Junior Royals — Register Your Interest ($49.95 a week; Ravenhall coming soon)
-- NOT APPLIED YET. Apply to rraa-landing (pudldzgmluwoocwxtzhw) only when Alex
-- approves the new Junior Royals page taking real entries (MOCKUP = false).
-- ============================================================
-- One row = a family who wants a Junior Royals place. NO payment is taken and
-- NO place is held. Written by src/components/junior-royals/v2/JRV2Form.jsx;
-- mirrored to the "Junior Royals Interest" tab of "RRA — Program Sign-Ups" by
-- api/sync-program-signups.js every 30 minutes.
--
-- Choice columns have NO list-of-values CHECK, on purpose. From 27 Sep to
-- 5 Oct 2026 a CHECK on jr_term4_waitlist.preferred_centre silently refused
-- every Cranbourne North entry. The valid values are written in the column
-- comments below, pinned by JuniorRoyalsV2.test.tsx (FORM_VALUES), and tested
-- hourly by the form watchdog (see the end of this file). Length limits only.
--
-- Privacy: anon may INSERT only. There is NO read policy for anon or for
-- signed-in users, so only the service role (the sheet sync) can read it.
-- Player data is a first name and a date of birth: nothing else about the
-- child. Interest-only records are deleted by 30 June 2027 if the player does
-- not enrol (the page says so).

create table if not exists public.junior_royals_interest (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  parent_name text not null check (char_length(parent_name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  phone text check (char_length(phone) <= 50),
  player_name text not null check (char_length(player_name) between 1 and 200),
  player_dob date not null,
  centre text not null check (char_length(centre) <= 50),
  preferred_days text[] not null check (cardinality(preferred_days) between 2 and 5),
  preferred_time text not null check (char_length(preferred_time) <= 20),
  source text not null default 'junior-royals-v2' check (char_length(source) <= 100),
  page_referrer text check (char_length(page_referrer) <= 500),
  utm_source text check (char_length(utm_source) <= 200),
  utm_medium text check (char_length(utm_medium) <= 200),
  utm_campaign text check (char_length(utm_campaign) <= 200)
);

comment on table public.junior_royals_interest is
  'Junior Royals register-your-interest list (ages 7–12, $49.95 a week, from Wed 28 Oct 2026). One row = one family who wants a place. NO payment taken, NO place held. Written by the /junior-royals form; read only by the service role (sheet sync).';
comment on column public.junior_royals_interest.player_name is 'Player FIRST name only (data minimisation; surname is collected at enrolment).';
comment on column public.junior_royals_interest.player_dob is 'Checks the player is 7–12 (the form refuses other ages) and helps plan groups.';
comment on column public.junior_royals_interest.phone is 'Optional on the form.';
comment on column public.junior_royals_interest.centre is 'mickleham | cranbourne-north | ravenhall (coming soon: interest only)';
comment on column public.junior_royals_interest.preferred_days is 'Weekdays the player could train, at least 2 of: mon | tue | wed | thu | fri. We tell each family their day.';
comment on column public.junior_royals_interest.preferred_time is '6pm | 7pm | either';

alter table public.junior_royals_interest enable row level security;

create policy "anon can register interest in junior royals" on public.junior_royals_interest
  for insert to anon, authenticated with check (true);

revoke select, update, delete on public.junior_royals_interest from anon, authenticated;

-- ── After applying ─────────────────────────────────────────────
-- 1. Watchdog (~/.claude/scheduled-tasks/rra-form-watchdog/SKILL.md, Check C):
--    add JR-3, a rolled-back test insert for EVERY value the form can send —
--    centre (mickleham, cranbourne-north, ravenhall) × preferred_time (6pm, 7pm,
--    either), with preferred_days of 2 and of 5 days (mon..fri) — so a refused
--    value is caught within the hour.
-- 2. Set MOCKUP = false in src/components/junior-royals/juniorRoyalsData.js and
--    resolve or remove every yellow tbc() item first.
-- 3. Check the "Junior Royals Interest" tab appears in "RRA — Program Sign-Ups"
--    after the next 30-minute sync, and that a test entry lands in it.
--
-- Rollback (only while it holds no real entries, because it deletes them):
-- drop table if exists public.junior_royals_interest;
