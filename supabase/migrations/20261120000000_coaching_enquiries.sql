-- Coaching enquiries: the light "not ready to apply, send me more information" form on
-- /careers (Andy, 20 Nov 2026). One row = one person who left their details to hear more
-- about coaching with us, without filling in the full application.
-- Emailed to Andy by /api/notify-coach-applications (notified_at), like applications.

create table if not exists public.coaching_enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  suburb text,
  role_interest text,
  accept_contact boolean not null default false,
  source text default 'careers-enquiry',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  page_referrer text,
  status text not null default 'new',
  notified_at timestamptz
);

comment on table public.coaching_enquiries is
  'One row = one person who asked for more information about coaching via the short form on rramelbourne.com/careers (not a full application). Anon insert only; read by dashboard users. Emailed to Andy by api/notify-coach-applications.';

alter table public.coaching_enquiries enable row level security;

drop policy if exists coaching_enquiries_anon_insert on public.coaching_enquiries;
create policy coaching_enquiries_anon_insert on public.coaching_enquiries
  for insert to anon with check (accept_contact = true);

drop policy if exists coaching_enquiries_dashboard_read on public.coaching_enquiries;
create policy coaching_enquiries_dashboard_read on public.coaching_enquiries
  for select to authenticated using (public.is_dashboard_user());

drop policy if exists coaching_enquiries_dashboard_update on public.coaching_enquiries;
create policy coaching_enquiries_dashboard_update on public.coaching_enquiries
  for update to authenticated using (public.is_dashboard_user());
