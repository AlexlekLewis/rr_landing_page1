-- Coach application alerts (Andy, 14 Nov 2026: "send any coaching applications to
-- andy.crook@whitewallsport.com").
-- notified_at = when the alert email for this row was sent by
-- /api/notify-coach-applications (Vercel cron, every 10 minutes). NULL = not sent yet.
-- Rows that existed before this migration are stamped now: they went to Andy in the
-- 14 Nov 2026 coach list email, so they must not be re-sent one by one.

alter table public.coaching_opportunities_applications
  add column if not exists notified_at timestamptz;
comment on column public.coaching_opportunities_applications.notified_at is
  'When the new-application email went to Andy (api/notify-coach-applications). NULL = not sent yet.';
update public.coaching_opportunities_applications set notified_at = now() where notified_at is null;

alter table public.coaches_day_registrations
  add column if not exists notified_at timestamptz;
comment on column public.coaches_day_registrations.notified_at is
  'When the new-registration email went to Andy (api/notify-coach-applications). NULL = not sent yet.';
update public.coaches_day_registrations set notified_at = now() where notified_at is null;
