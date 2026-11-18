-- ─────────────────────────────────────────────────────────────
-- Royals Private Coaching — tell the coach the moment a family books (Andy, 18 Nov 2026)
--
-- "When someone books a session ... send a message, an email or a text message or a
-- WhatsApp message directly to a coach to say that someone has booked a session and to
-- contact them."
--
-- private_coaching_coaches: one row per coach, holding how to reach them. Kept in the
-- database, NOT in the website code (the repository is public). Nobody outside the
-- service role can read it. Fill it in with SQL or the Supabase table editor:
--   insert into private_coaching_coaches (coach_slug, name, email, mobile)
--   values ('alex-thornhill', 'Alex Thornhill', '<email>', '04xx xxx xxx');
-- coach_slug must match COACHES[].slug in src/components/premium-coaching/premiumCoachingData.js.
--
-- api/notify-private-coaching-bookings.js sends the alert (email via Resend; a text
-- message too once Twilio is set up), copies the Academy inbox, and stamps
-- premium_private_coaching_requests.coach_notified_at so nobody is messaged twice.
--
-- ORDER: apply after 20261113120000_premium_private_coaching_requests.sql.
-- ROLLBACK: drop table public.private_coaching_coaches;
--           alter table public.premium_private_coaching_requests drop column coach_notified_at;
-- ─────────────────────────────────────────────────────────────

create table if not exists public.private_coaching_coaches (
  coach_slug text primary key,
  name text not null,
  email text,                                   -- where booking alerts go
  mobile text,                                  -- for a text message alert (Australian mobile)
  notify_email boolean not null default true,
  notify_sms boolean not null default true,     -- only used once Twilio is configured
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

comment on table public.private_coaching_coaches is
  'Royals Private Coaching: how to reach each coach when a family books them (email, mobile). '
  'Service role only. Read by api/notify-private-coaching-bookings.js.';

alter table public.private_coaching_coaches enable row level security;
-- no policies: only the service role (the alert job) can read or change it.

alter table public.premium_private_coaching_requests
  add column if not exists coach_notified_at timestamptz;

comment on column public.premium_private_coaching_requests.coach_notified_at is
  'When the booking alert went to the coach (and the Academy inbox). Null = not sent yet; the alert job retries.';
