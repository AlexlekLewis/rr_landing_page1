-- v_spin_club_members: match a subscriber to their Academy record by the
-- record's name_key OR any of its name_variants (27 Nov 2026). Without this,
-- a family who types "Gurshaan Singh" on the Stripe page would not match
-- "Gurshaan singh rahal" and the nightly payments check would only flag it.

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
    when m.name_hit and (n.parent_email = any (m.emails) or n.phone9 = any (m.phones)) then 'name + contact'
    when n.parent_email = any (m.emails) or n.phone9 = any (m.phones) then 'contact only — check the name'
    else 'name only — check the family'
  end as master_match,
  p.id as portal_player_id,
  n.stripe_subscription_id, n.stripe_customer_id
from norm n
left join last_pay lp   on lp.stripe_subscription_id = n.stripe_subscription_id
left join paid_weeks pw on pw.stripe_subscription_id = n.stripe_subscription_id
left join lateral (
  select mm.id, mm.emails, mm.phones,
         (mm.name_key = n.name_key
          or n.name_key = any (select lower(regexp_replace(trim(v), '\s+', ' ', 'g')) from unnest(coalesce(mm.name_variants, '{}')) v)) as name_hit
  from public.rra_players_master mm
  where coalesce(mm.is_test, false) = false
    and (mm.name_key = n.name_key
         or n.name_key = any (select lower(regexp_replace(trim(v), '\s+', ' ', 'g')) from unnest(coalesce(mm.name_variants, '{}')) v)
         or n.parent_email = any (mm.emails)
         or (n.phone9 <> '' and n.phone9 = any (mm.phones)))
  order by (mm.name_key = n.name_key
            or n.name_key = any (select lower(regexp_replace(trim(v), '\s+', ' ', 'g')) from unnest(coalesce(mm.name_variants, '{}')) v)) desc,
           (n.parent_email = any (mm.emails) or n.phone9 = any (mm.phones)) desc,
           mm.last_seen desc nulls last
  limit 1
) m on true
left join lateral (
  select pp.id from public.players pp
  where lower(regexp_replace(trim(coalesce(pp.name, '')), '\s+', ' ', 'g')) = n.name_key
    and (lower(pp.parent_email) = n.parent_email or lower(pp.email) = n.parent_email
         or right(regexp_replace(coalesce(pp.phone, ''), '\D', '', 'g'), 9) = n.phone9)
  limit 1
) p on true;

revoke all on public.v_spin_club_members from anon;
revoke insert, update, delete, truncate on public.v_spin_club_members from authenticated;
