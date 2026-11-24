-- Newsletter / "register for more information" sign-ups (Andy, 24 Nov 2026: "a data capture simple
-- style component that is elegant ... Register for our newsletter").
-- Written by the website (anon key): insert only. Nobody can read it with the public key; staff read
-- it in Supabase. One row per email (case-insensitive): the site treats a repeat as "already on the list".

create table if not exists public.newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  first_name    text check (first_name is null or char_length(first_name) <= 80),
  email         text not null check (char_length(email) between 5 and 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  interest      text check (interest is null or char_length(interest) <= 60),
  consent       boolean not null check (consent),           -- ticked "happy to receive emails"
  source_page   text check (source_page is null or char_length(source_page) <= 200),
  utm_source    text check (utm_source is null or char_length(utm_source) <= 200),
  utm_medium    text check (utm_medium is null or char_length(utm_medium) <= 200),
  utm_campaign  text check (utm_campaign is null or char_length(utm_campaign) <= 200),
  unsubscribed_at timestamptz
);

create unique index if not exists newsletter_subscribers_email_key
  on public.newsletter_subscribers (lower(email));

alter table public.newsletter_subscribers enable row level security;

revoke all on public.newsletter_subscribers from anon, authenticated;
grant insert (first_name, email, interest, consent, source_page, utm_source, utm_medium, utm_campaign)
  on public.newsletter_subscribers to anon, authenticated;

drop policy if exists "website can add newsletter sign-ups" on public.newsletter_subscribers;
create policy "website can add newsletter sign-ups"
  on public.newsletter_subscribers for insert to anon, authenticated
  with check (consent and unsubscribed_at is null);
