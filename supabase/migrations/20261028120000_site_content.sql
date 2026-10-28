-- ─────────────────────────────────────────────────────────────
-- site_content: page wording edited from the admin, one row per page
--
-- First user: the Junior Royals Editor (/rramadmin_26/junior-royals-editor),
-- row key 'junior_royals'. `content` holds only the fields staff changed, keyed
-- by path (see src/components/junior-royals-t3/jrContent.js); the page falls
-- back to the wording in code for everything else.
--
-- RLS:
--   * anon + authenticated may READ: it is the public wording of a public page.
--   * only active dashboard_users may INSERT / UPDATE / DELETE.
--
-- ROLLBACK: drop table public.site_content;  (the page shows the code wording)
-- ─────────────────────────────────────────────────────────────

create table if not exists public.site_content (
  key         text primary key,
  content     jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  text
);

alter table public.site_content enable row level security;

drop policy if exists site_content_public_read on public.site_content;
create policy site_content_public_read on public.site_content
  for select to anon, authenticated
  using (true);

drop policy if exists site_content_admin_write on public.site_content;
create policy site_content_admin_write on public.site_content
  for all to authenticated
  using (exists (
    select 1 from public.dashboard_users du
    where du.email = (auth.jwt() ->> 'email') and du.active
  ))
  with check (exists (
    select 1 from public.dashboard_users du
    where du.email = (auth.jwt() ->> 'email') and du.active
  ));
