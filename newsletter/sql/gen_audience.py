"""Generates the newsletter audience migration from one list of contact columns.
Add a new sign-up form here (table, [columns], segment), re-run, apply as a new migration."""
SOURCES = [
 ('academy_member_subsidies',['customer_email'],'members'),
 ('academy_reviews',['reviewer_email'],'community'),
 ('applications',['email','parent1_email','parent2_email','second_email'],'pathway'),
 ('archived_applications',['email','parent1_email','parent2_email','second_email'],'pathway'),
 ('coaches_day_registrations',['email'],'coaches'),
 ('coaching_enquiries',['email'],'coaches'),
 ('coaching_opportunities_applications',['email'],'coaches'),
 ('crm_leads',['email','parent_email','parent2_email'],'leads'),
 ('elite_2026_waitlist',['email','parent1_email','parent2_email','second_email'],'pathway'),
 ('elite_program_2026_roster',['email','parent_email','parent2_email','parent3_email'],'pathway'),
 ('female_kickstart_2026',['parent_email'],'female'),
 ('general_enquiries',['email'],'leads'),
 ('hallam_junior_registrations',['parent_email'],'junior'),
 ('hallam_open_day_registrations',['parent_email'],'junior'),
 ('holiday_camp_interest',['parent_email'],'junior'),
 ('holiday_clinic_registrations',['parent_email'],'junior'),
 ('holiday_program_feedback',['respondent_email'],'junior'),
 ('india_tour_2026_deposits',['email'],'tour'),
 ('india_tour_2026_eoi',['guardian1_email','guardian2_email'],'tour'),
 ('india_tour_2026_travellers',['email','p1_email','p2_email'],'tour'),
 ('inquiries',['email','parent1_email','parent2_email'],'leads'),
 ('invitation_list_registrations',['email'],'junior'),
 ('jr_term3_hallam',['parent_email'],'junior'),
 ('jr_term3_mickleham',['parent_email'],'junior'),
 ('jr_term3_williamstown',['parent_email'],'junior'),
 ('jr_term3_payment_confirmations',['customer_email'],'junior'),
 ('jr_term4_waitlist',['parent_email'],'junior'),
 ('junior_royals_bundoora',['parent_email'],'junior'),
 ('junior_royals_hallam',['parent_email'],'junior'),
 ('junior_royals_july_holidays_registrations',['parent_email'],'junior'),
 ('junior_royals_sept_holidays_registrations',['parent_email'],'junior'),
 ('junior_royals_registrations',['parent_email'],'junior'),
 ('lower_plenty_junior_royals_day_registrations',['email'],'junior'),
 ('masterclass_registrations',['parent_email','email'],'pathway'),
 ('match_registrations',['email'],'pathway'),
 ('mickleham_junior_registrations',['parent_email'],'junior'),
 ('mickleham_open_day_registrations',['parent_email'],'junior'),
 ('official_cohort_2026',['email','parent1_email','parent2_email'],'pathway'),
 ('performance_squad_kit_orders',['email'],'pathway'),
 ('performance_squad_leads',['email'],'pathway'),
 ('performance_squads_registrations',['parent_email','email'],'pathway'),
 ('pgp_scholarship_prefill',['contact_email'],'pathway'),
 ('players',['parent_email'],'pathway'),
 ('power_game_applications',['email','parent1_email','parent2_email'],'pathway'),
 ('power_game_inquiries',['parent_email'],'pathway'),
 ('power_league_players',['email'],'pathway'),
 ('premium_private_coaching_partners',['email'],'private'),
 ('premium_private_coaching_requests',['email'],'private'),
 ('private_coaching_enquiries',['email'],'private'),
 ('private_coaching_eoi',['email'],'private'),
 ('private_coaching_waitlist',['email'],'private'),
 ('program_feedback',['respondent_email'],'pathway'),
 ('program_inductions',['email'],'pathway'),
 ('program_registrations',['customer_email'],'buyers'),
 ('rsvp_responses',['email'],'pathway'),
 ('shop_orders',['customer_email'],'buyers'),
 ('shop_orders_training',['customer_email'],'buyers'),
 ('shop_orders_ipl',['customer_email'],'buyers'),
 ('store_orders',['customer_email'],'buyers'),
 ('store_entitlements',['parent_email'],'junior'),
 ('upcoming_program_interest',['email'],'leads'),
 ('williamstown_junior_registrations',['parent_email'],'junior'),
 ('williamstown_open_day_registrations',['parent_email'],'junior'),
]
# Forms where the family explicitly unticked "send me news and offers".
OPT_OUT = [('hallam_junior_registrations','parent_email','accept_marketing'),
           ('mickleham_junior_registrations','parent_email','accept_marketing'),
           ('williamstown_junior_registrations','parent_email','accept_marketing'),
           ('program_inductions','email','accept_marketing'),
           ('invitation_list_registrations','email','marketing_opt_in'),
           ('lower_plenty_junior_royals_day_registrations','email','marketing_opt_in')]
TEST_FILTER = {'applications','holiday_clinic_registrations','junior_royals_bundoora','junior_royals_hallam','official_cohort_2026'}

rows = []
for t, cols, seg in SOURCES:
    w = ' where coalesce(is_test,false)=false' if t in TEST_FILTER else ''
    for c in cols:
        rows.append(f"  select {c} as raw_email, '{t}'::text as source, '{seg}'::text as segment, created_at from public.{t}{w}")
rows.append("  select unnest(emails), 'rra_players_master', 'registry', last_seen from public.rra_players_master where coalesce(is_test,false)=false")
contacts = '\n  union all\n'.join(rows)
optouts = '\n  union all\n'.join(f"  select lower(trim({e})), 'form_opt_out:{t}', created_at from public.{t} where {f} = false" for t, e, f in OPT_OUT)
optouts += "\n  union all\n  select lower(trim(payload->>'email')), 'form_opt_out:archive', submitted_at from public.rra_player_submissions where (payload->>'accept_marketing') = 'false' or (payload->>'marketing_opt_in') = 'false'"
optouts += "\n  union all\n  select lower(trim(payload->>'parent_email')), 'form_opt_out:archive', submitted_at from public.rra_player_submissions where (payload->>'accept_marketing') = 'false' or (payload->>'marketing_opt_in') = 'false'"
optouts += "\n  union all\n  select lower(trim(email)), 'deleted_member', null::timestamptz from public.deleted_members"
optouts += "\n  union all\n  select lower(trim(match_email)), 'test_record', null::timestamptz from public.rra_excluded_records"

sql = f"""-- Academy Director's newsletter: audience + suppression + issue log.
-- Generated by newsletter/sql/gen_audience.py. Do not edit the view by hand.
-- Nothing here changes any registration table: the view only reads them.

create table if not exists public.newsletter_suppressions (
  email        text primary key check (email = lower(trim(email))),
  reason       text not null check (reason in ('unsubscribed','hard_bounce','complaint','form_opt_out','manual','deleted_member','test_record')),
  source       text,
  created_at   timestamptz not null default now()
);
comment on table public.newsletter_suppressions is 'Addresses the Director''s newsletter must never be sent to: unsubscribes, hard bounces, spam complaints (synced back from the email service before every send) and manual removals. Permanent: a row is only deleted if the person re-subscribes themselves.';
alter table public.newsletter_suppressions enable row level security;
create policy newsletter_suppressions_dash_read on public.newsletter_suppressions for select to authenticated using (public.is_dashboard_user());

create table if not exists public.newsletter_issues (
  issue_no        int primary key,
  send_at         timestamptz not null,
  status          text not null default 'planned' check (status in ('planned','drafting','proof_sent','changes_requested','approved','scheduled','sent','skipped')),
  subject         text,
  preheader       text,
  proof_sent_at   timestamptz,
  approved_at     timestamptz,
  approved_note   text,
  esp_broadcast_id text,
  recipients      int,
  results         jsonb,
  notes           text,
  updated_at      timestamptz not null default now()
);
comment on table public.newsletter_issues is 'One row per fortnightly Director''s newsletter. The scheduled newsletter agent reads and updates status here: planned → proof_sent (Wed) → approved (Andy replies) → scheduled/sent (Tue 7:30pm) → results (opens, clicks, revenue) a week later.';
alter table public.newsletter_issues enable row level security;
create policy newsletter_issues_dash_read on public.newsletter_issues for select to authenticated using (public.is_dashboard_user());

create or replace view public.newsletter_opt_outs with (security_invoker = true) as
with optouts as (
{optouts}
) select distinct e as email, why as reason from optouts o(e, why, at) where e is not null;
revoke all on public.newsletter_opt_outs from anon, authenticated;

create or replace view public.newsletter_audience with (security_invoker = true) as
with contacts as (
{contacts}
), cleaned as (
  select lower(trim(raw_email)) as email, source, segment, created_at
  from contacts
  where raw_email is not null
), blocked as (
  select email from public.newsletter_suppressions
  union select email from public.newsletter_opt_outs
)
select c.email,
       array_agg(distinct c.segment order by c.segment) as segments,
       array_agg(distinct c.source order by c.source)   as sources,
       min(c.created_at) as first_seen,
       max(c.created_at) as last_seen
from cleaned c
where c.email ~ '^[a-z0-9._%+''-]+@[a-z0-9.-]+\\.[a-z]{{2,}}$'
  and c.email !~ '@(example\\.(com|org)|test\\.com|mailinator\\.com|resend\\.dev)$'
  and c.email not in (select email from blocked)
group by c.email;
comment on view public.newsletter_audience is 'Every address ever registered with the Academy (all sign-up, enquiry, payment and shop tables + the canonical player registry), lower-cased and de-duplicated, minus newsletter_suppressions, explicit form opt-outs, deleted members and test records. Player-only email columns (under-18s) are deliberately not included. Read with the service role only.';
revoke all on public.newsletter_audience from anon, authenticated;

"""
open('newsletter/sql/newsletter_audience.sql','w').write(sql)
print(len(sql), 'chars;', len(rows), 'contact columns')
