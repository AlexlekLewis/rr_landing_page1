-- Spin Club weekly subscription (Alex, 27 Nov 2026): $60 a week incl. GST.
-- Written by api/stripe-webhook.js via api/_lib/spinClubSubscription.js with
-- the service role. Read by dashboard admins only — these rows carry parent
-- contact details for children.

create table if not exists public.spin_club_subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  stripe_subscription_id text not null unique,
  stripe_customer_id     text,
  stripe_session_id      text,
  application_id         uuid,           -- applications.id sent by the /spin-club form
  player_name            text,
  centre                 text,           -- 'Mickleham' | 'Cranbourne North'
  parent_name            text,
  parent_email           text,
  parent_phone           text,
  status                 text not null default 'active'
                         check (status in ('active', 'paused', 'payment_failed', 'cancelled')),
  started_at             timestamptz,
  next_payment_at        timestamptz,
  paused_until           timestamptz,
  cancelled_at           timestamptz,
  notes                  text
);

create table if not exists public.spin_club_payments (
  id                     uuid primary key default gen_random_uuid(),
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  stripe_invoice_id      text not null unique,
  stripe_subscription_id text,
  stripe_customer_id     text,
  status                 text not null check (status in ('paid', 'failed')),
  billing_reason         text,
  amount_cents           integer,
  currency               text default 'aud',
  period_start           timestamptz,
  period_end             timestamptz,
  paid_at                timestamptz,
  customer_email         text,
  hosted_invoice_url     text
);

create index if not exists spin_club_payments_sub_idx on public.spin_club_payments (stripe_subscription_id, paid_at desc);

alter table public.spin_club_subscriptions enable row level security;
alter table public.spin_club_payments      enable row level security;

drop policy if exists "Dashboard admins read spin club subscriptions" on public.spin_club_subscriptions;
create policy "Dashboard admins read spin club subscriptions" on public.spin_club_subscriptions
  for select to authenticated
  using ((auth.jwt() ->> 'email') in (select email from public.dashboard_users where active = true));

drop policy if exists "Dashboard admins read spin club payments" on public.spin_club_payments;
create policy "Dashboard admins read spin club payments" on public.spin_club_payments
  for select to authenticated
  using ((auth.jwt() ->> 'email') in (select email from public.dashboard_users where active = true));

-- One row per held spot: who, where, the latest week and how it was matched.
-- security_invoker so the RLS above applies to whoever reads the view.
create or replace view public.v_spin_club_members
with (security_invoker = on) as
with norm as (
  select s.*,
         lower(regexp_replace(coalesce(s.player_name, ''), '\s+', ' ', 'g')) as name_key,
         right(regexp_replace(coalesce(s.parent_phone, ''), '\D', '', 'g'), 9) as phone9
  from public.spin_club_subscriptions s
),
last_pay as (
  select distinct on (stripe_subscription_id)
         stripe_subscription_id, status as last_payment_status, paid_at as last_paid_at,
         period_end as paid_through, amount_cents as last_amount_cents
  from public.spin_club_payments
  order by stripe_subscription_id, coalesce(period_start, paid_at, created_at) desc, created_at desc
),
paid_weeks as (
  select stripe_subscription_id, count(*) filter (where status = 'paid') as weeks_paid,
         coalesce(sum(amount_cents) filter (where status = 'paid'), 0) as total_paid_cents
  from public.spin_club_payments group by stripe_subscription_id
)
select
  n.id, n.player_name, n.centre, n.status, n.parent_name, n.parent_email, n.parent_phone,
  n.started_at, n.next_payment_at, n.paused_until, n.cancelled_at,
  lp.last_payment_status, lp.last_paid_at, lp.paid_through,
  coalesce(pw.weeks_paid, 0) as weeks_paid, coalesce(pw.total_paid_cents, 0) as total_paid_cents,
  n.application_id,
  m.id as master_player_id,
  case
    when m.id is null then 'unmatched'
    when m.name_key = n.name_key and (n.parent_email = any (m.emails) or n.phone9 = any (m.phones)) then 'name + contact'
    when n.parent_email = any (m.emails) or n.phone9 = any (m.phones) then 'contact only — check the name'
    else 'name only — check the family'
  end as master_match,
  p.id as portal_player_id,
  n.stripe_subscription_id, n.stripe_customer_id
from norm n
left join last_pay lp   on lp.stripe_subscription_id = n.stripe_subscription_id
left join paid_weeks pw on pw.stripe_subscription_id = n.stripe_subscription_id
left join lateral (
  select mm.id, mm.name_key, mm.emails, mm.phones
  from public.rra_players_master mm
  where coalesce(mm.is_test, false) = false
    and (mm.name_key = n.name_key or n.parent_email = any (mm.emails) or (n.phone9 <> '' and n.phone9 = any (mm.phones)))
  order by (mm.name_key = n.name_key) desc,
           (n.parent_email = any (mm.emails) or n.phone9 = any (mm.phones)) desc,
           mm.last_seen desc nulls last
  limit 1
) m on true
left join lateral (
  select pp.id from public.players pp
  where lower(pp.name) = n.name_key
    and (lower(pp.parent_email) = n.parent_email or lower(pp.email) = n.parent_email
         or right(regexp_replace(coalesce(pp.phone, ''), '\D', '', 'g'), 9) = n.phone9)
  limit 1
) p on true;

comment on view public.v_spin_club_members is
  'Spin Club weekly subscribers with their latest payment, matched to rra_players_master and the portal players table. Written by the Stripe webhook; see api/_lib/spinClubSubscription.js.';
