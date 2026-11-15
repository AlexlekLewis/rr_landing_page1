-- ============================================================
-- Member status, contact routing, comms log, weekly report
-- ============================================================
-- Built on the canonical registry (rra_players_master / rra_program_participation).
--
--   rra_program_terms      when each program intake runs (edit dates here)
--   rra_comms_log          every email / SMS sent to or received from a family
--   rra_comms_optouts      unsubscribes (email / sms / all) - always honoured
--   v_rra_member_status    one row per player: current / recently_lapsed /
--                          lapsed / unconverted / lead, last personal contact
--   v_rra_contacts         who to talk to: parent when under 18 (or age
--                          unknown), the player when 18+
--   rra_member_snapshots   weekly snapshot so the report can show movement
--   rra_weekly_report()    the Monday report numbers as jsonb
-- ============================================================

-- ---------- program terms ----------
CREATE TABLE IF NOT EXISTS public.rra_program_terms (
  program    text NOT NULL,
  term       text NOT NULL,
  starts_on  date NOT NULL,
  ends_on    date NOT NULL,
  confirmed  boolean NOT NULL DEFAULT false,  -- false = approximate, please confirm
  note       text,
  PRIMARY KEY (program, term)
);
ALTER TABLE public.rra_program_terms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rra_program_terms_dash ON public.rra_program_terms;
CREATE POLICY rra_program_terms_dash ON public.rra_program_terms FOR SELECT USING (is_dashboard_user());

INSERT INTO public.rra_program_terms (program, term, starts_on, ends_on, confirmed, note) VALUES
 ('junior_royals','Term 2 2026','2026-04-20','2026-06-26',false,'Vic school Term 2'),
 ('junior_royals','Term 3 2026','2026-07-13','2026-09-18',false,'Vic school Term 3'),
 ('junior_royals','Term 4 2026','2026-10-26','2026-12-16',true ,'jrTerm4Data.js first/last session'),
 ('holiday','April 2026','2026-04-07','2026-04-17',false,NULL),
 ('holiday','July 2026','2026-06-29','2026-07-10',false,NULL),
 ('holiday','Sept 2026','2026-09-21','2026-10-02',false,NULL),
 ('elite_12week','Autumn 2026 (Apr-Jul)','2026-04-20','2026-07-31',false,'12-week Elite Program'),
 ('power_game','Pre-Season 2026','2026-06-15','2026-09-30',false,NULL),
 ('performance_squads','Season 2026-27','2026-09-15','2027-04-30',true ,'Site copy: Sept 2026 - April 2027'),
 ('junior_royals_day','Lower Plenty Oct 2026','2026-10-25','2026-10-25',true ,NULL),
 ('masterclass','Sept 2026','2026-09-01','2026-09-30',false,NULL),
 ('female_kickstart','2026','2026-05-01','2026-06-30',false,NULL)
ON CONFLICT (program, term) DO NOTHING;

-- ---------- comms log + opt-outs ----------
CREATE TABLE IF NOT EXISTS public.rra_comms_log (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          timestamptz NOT NULL DEFAULT now(),
  channel             text NOT NULL CHECK (channel IN ('email','sms','phone','whatsapp','in_person')),
  direction           text NOT NULL DEFAULT 'outbound' CHECK (direction IN ('outbound','inbound')),
  player_id           uuid REFERENCES public.rra_players_master(id) ON DELETE SET NULL,
  player_name         text,          -- kept as text: player_id is rebuilt nightly
  recipient_role      text CHECK (recipient_role IN ('parent','player','other')),
  recipient_name      text,
  to_address          text,          -- email or E.164 mobile
  from_address        text,
  subject             text,
  body                text,
  campaign            text,          -- e.g. 'newsletter-2026-11', 'term1-2027-rebook'
  kind                text NOT NULL DEFAULT 'personal' CHECK (kind IN ('personal','newsletter','transactional')),
  status              text NOT NULL DEFAULT 'sent' CHECK (status IN ('draft','queued','sent','delivered','failed','bounced','replied')),
  provider            text,          -- 'outlook', 'sms:<provider>', 'manual'
  provider_message_id text,
  sent_by             text,
  sent_at             timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS rra_comms_log_to_idx     ON public.rra_comms_log (lower(to_address));
CREATE INDEX IF NOT EXISTS rra_comms_log_player_idx ON public.rra_comms_log (player_name);
CREATE INDEX IF NOT EXISTS rra_comms_log_campaign_idx ON public.rra_comms_log (campaign);
ALTER TABLE public.rra_comms_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rra_comms_log_dash ON public.rra_comms_log;
CREATE POLICY rra_comms_log_dash ON public.rra_comms_log FOR SELECT USING (is_dashboard_user());
COMMENT ON TABLE public.rra_comms_log IS 'Every email/SMS to or from a family, sent by Andy or the comms agent. Admin read only; writes via service role.';

CREATE TABLE IF NOT EXISTS public.rra_comms_optouts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  channel     text NOT NULL CHECK (channel IN ('email','sms','all')),
  address     text NOT NULL,   -- email or phone as given
  scope       text NOT NULL DEFAULT 'marketing' CHECK (scope IN ('marketing','all')),
  reason      text,
  source      text             -- 'reply STOP', 'unsubscribe link', 'asked Andy'
);
CREATE UNIQUE INDEX IF NOT EXISTS rra_comms_optouts_uniq ON public.rra_comms_optouts (channel, lower(address), scope);
ALTER TABLE public.rra_comms_optouts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rra_comms_optouts_dash ON public.rra_comms_optouts;
CREATE POLICY rra_comms_optouts_dash ON public.rra_comms_optouts FOR SELECT USING (is_dashboard_user());

-- ---------- member status ----------
CREATE OR REPLACE VIEW public.v_rra_member_status
WITH (security_invoker = true) AS
WITH part AS (
  SELECT p.*, t.starts_on, t.ends_on,
         coalesce(t.ends_on, (p.registered_at AT TIME ZONE 'Australia/Melbourne')::date + 60) AS eff_end,
         coalesce(t.starts_on, (p.registered_at AT TIME ZONE 'Australia/Melbourne')::date)     AS eff_start
  FROM rra_program_participation p
  LEFT JOIN rra_program_terms t ON t.program = p.program AND t.term = p.term
),
paid AS (
  SELECT * FROM part
  WHERE status IN ('paid','scholarship')
    AND coalesce(enrolment_status,'active') NOT IN ('withdrawn','removed')
),
today AS (SELECT (now() AT TIME ZONE 'Australia/Melbourne')::date AS d),
contact AS (
  -- personal outbound contact we have a record of, per normalised address
  SELECT rra_email_key(a) AS k, max(pc.email_date) AS at, 'Alex mailbox' AS via
    FROM player_communications pc, unnest(pc.to_addresses) a
   WHERE pc.direction = 'sent' GROUP BY 1
  UNION ALL
  SELECT coalesce(rra_email_key(l.to_address), rra_phone_key(l.to_address)), max(l.sent_at), 'comms log'
    FROM rra_comms_log l
   WHERE l.direction = 'outbound' AND l.kind IN ('personal','newsletter')
     AND l.status IN ('sent','delivered','replied') GROUP BY 1
  UNION ALL
  SELECT rra_email_key(x), max(c.last_contacted_at), 'CRM'
    FROM crm_leads c, unnest(ARRAY[c.email, c.parent_email, c.parent2_email]) x
   WHERE c.last_contacted_at IS NOT NULL GROUP BY 1
  UNION ALL
  SELECT rra_email_key(t.primary_email), max(greatest(t.last_contact_date, t.welcome_sent_date))::timestamptz, 'Elite comms tracker'
    FROM player_comms_tracker t
   WHERE coalesce(t.last_contact_date, t.welcome_sent_date) IS NOT NULL GROUP BY 1
),
inbound AS (
  SELECT rra_email_key(pc.from_address) AS k, max(pc.email_date) AS at
    FROM player_communications pc WHERE pc.direction = 'received' GROUP BY 1
  UNION ALL
  SELECT coalesce(rra_email_key(l.from_address), rra_phone_key(l.from_address)), max(l.sent_at)
    FROM rra_comms_log l WHERE l.direction = 'inbound' GROUP BY 1
)
SELECT
  m.id AS player_id, m.full_name, m.name_variants, m.dob,
  coalesce(extract(year FROM age((SELECT d FROM today), m.dob))::int,
           m.age + extract(year FROM age((SELECT d FROM today), (m.last_seen AT TIME ZONE 'Australia/Melbourne')::date))::int
          ) AS current_age,
  m.gender, m.suburb, m.club, m.parent_name, m.primary_email, m.primary_phone, m.emails, m.phones,
  m.first_seen, m.last_seen, m.programs, m.program_count,
  cur.current_programs, cur.current_centres,
  lp.last_paid_program, lp.last_paid_end,
  coalesce(tp.total_paid_cents, 0) AS total_paid_cents,
  coalesce(tp.paid_programs, 0)    AS paid_programs,
  CASE
    WHEN cur.current_programs IS NOT NULL THEN 'current'
    WHEN lp.last_paid_end >= (SELECT d FROM today) - 120 THEN 'recently_lapsed'
    WHEN lp.last_paid_end IS NOT NULL THEN 'lapsed'
    WHEN EXISTS (SELECT 1 FROM part x WHERE x.player_id = m.id AND x.status IN ('unpaid','waitlist')) THEN 'unconverted'
    ELSE 'lead'
  END AS member_status,
  oc.last_contact_at, oc.last_contact_via,
  ic.last_inbound_at,
  (oc.last_contact_at IS NULL) AS never_contacted,
  m.needs_review
FROM rra_players_master m
LEFT JOIN LATERAL (
  SELECT string_agg(DISTINCT p.program || ' · ' || p.term, '; ') AS current_programs,
         string_agg(DISTINCT p.centre, ', ') AS current_centres
  FROM paid p
  WHERE p.player_id = m.id
    AND (SELECT d FROM today) BETWEEN p.eff_start - 45 AND p.eff_end + 21
) cur ON true
LEFT JOIN LATERAL (
  SELECT p.program || ' · ' || p.term AS last_paid_program, p.eff_end AS last_paid_end
  FROM paid p WHERE p.player_id = m.id ORDER BY p.eff_end DESC LIMIT 1
) lp ON true
LEFT JOIN LATERAL (
  SELECT sum(coalesce(p.amount_paid_cents,0))::bigint AS total_paid_cents, count(*)::int AS paid_programs
  FROM paid p WHERE p.player_id = m.id
) tp ON true
LEFT JOIN LATERAL (
  SELECT c.at AS last_contact_at, c.via AS last_contact_via
  FROM contact c WHERE c.k = ANY (m.emails) OR c.k = ANY (m.phones)
  ORDER BY c.at DESC NULLS LAST LIMIT 1
) oc ON true
LEFT JOIN LATERAL (
  SELECT max(i.at) AS last_inbound_at FROM inbound i WHERE i.k = ANY (m.emails) OR i.k = ANY (m.phones)
) ic ON true
WHERE NOT coalesce(m.is_test, false);

COMMENT ON VIEW public.v_rra_member_status IS
 'One row per real player. member_status: current (paid program running now / starting within 45 days / ended <21 days ago), recently_lapsed (last paid program ended <=120 days ago), lapsed, unconverted (registered/waitlisted, never paid), lead (enquiry/interest/free event only). never_contacted = no personal outbound contact on record (Alex mailbox sync, comms log, CRM, Elite tracker) - automated confirmations do not count.';

-- ---------- contact routing ----------
CREATE OR REPLACE VIEW public.v_rra_contacts
WITH (security_invoker = true) AS
SELECT s.player_id, s.full_name AS player_name, s.current_age, s.member_status,
  CASE WHEN s.current_age >= 18 THEN 'player' ELSE 'parent' END AS contact_role,
  CASE WHEN s.current_age >= 18 THEN s.full_name ELSE coalesce(s.parent_name, 'Parent/guardian of ' || s.full_name) END AS contact_name,
  s.primary_email AS email,
  s.primary_phone AS phone,
  EXISTS (SELECT 1 FROM rra_comms_optouts o WHERE o.channel IN ('email','all')
          AND rra_email_key(o.address) = ANY (s.emails)) AS email_opted_out,
  EXISTS (SELECT 1 FROM rra_comms_optouts o WHERE o.channel IN ('sms','all')
          AND rra_phone_key(o.address) = ANY (s.phones)) AS sms_opted_out,
  (s.current_age IS NULL) AS age_unknown,
  s.current_programs, s.last_paid_program, s.suburb, s.club
FROM v_rra_member_status s;

COMMENT ON VIEW public.v_rra_contacts IS
 'Who to talk to for each player: the parent/guardian when under 18 or age unknown, the player when 18+. Respect email_opted_out / sms_opted_out for marketing; one family can have several children, so dedupe by email before a newsletter.';

-- ---------- weekly snapshots + report ----------
CREATE TABLE IF NOT EXISTS public.rra_member_snapshots (
  snapshot_date date NOT NULL,
  player_id     uuid NOT NULL,
  name_key      text,
  member_status text NOT NULL,
  PRIMARY KEY (snapshot_date, player_id)
);
ALTER TABLE public.rra_member_snapshots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rra_member_snapshots_dash ON public.rra_member_snapshots;
CREATE POLICY rra_member_snapshots_dash ON public.rra_member_snapshots FOR SELECT USING (is_dashboard_user());

CREATE OR REPLACE FUNCTION public.rra_weekly_report(p_take_snapshot boolean DEFAULT true)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public','extensions'
AS $$
DECLARE
  v_today date := (now() AT TIME ZONE 'Australia/Melbourne')::date;
  v_prev  date;
  r jsonb;
BEGIN
  -- player_id changes on every rebuild, so movement is tracked by name_key
  SELECT max(snapshot_date) INTO v_prev FROM rra_member_snapshots WHERE snapshot_date < v_today;

  SELECT jsonb_build_object(
    'as_of', v_today,
    'previous_snapshot', v_prev,
    'registry_last_rebuilt', (SELECT max(updated_at) FROM rra_players_master),
    'totals', (SELECT jsonb_object_agg(member_status, n) FROM
                 (SELECT member_status, count(*) n FROM v_rra_member_status GROUP BY 1) x),
    'people_total', (SELECT count(*) FROM v_rra_member_status),
    'current_by_program', (SELECT jsonb_agg(x ORDER BY n DESC) FROM (
        SELECT p.program, p.term, count(DISTINCT p.player_id) n
        FROM v_rra_member_status s JOIN rra_program_participation p ON p.player_id = s.player_id
        JOIN rra_program_terms t ON t.program = p.program AND t.term = p.term
        WHERE s.member_status = 'current' AND p.status IN ('paid','scholarship')
          AND coalesce(p.enrolment_status,'active') NOT IN ('withdrawn','removed')
          AND v_today BETWEEN t.starts_on - 45 AND t.ends_on + 21
        GROUP BY 1,2) x),
    'current_by_centre', (SELECT jsonb_agg(x ORDER BY n DESC) FROM (
        SELECT coalesce(current_centres,'(no centre)') centre, count(*) n
        FROM v_rra_member_status WHERE member_status='current' GROUP BY 1) x),
    'current_age_split', (SELECT jsonb_build_object(
        'under_18', count(*) FILTER (WHERE current_age < 18),
        'adult_18_plus', count(*) FILTER (WHERE current_age >= 18),
        'unknown', count(*) FILTER (WHERE current_age IS NULL))
        FROM v_rra_member_status WHERE member_status='current'),
    'top_suburbs_current', (SELECT jsonb_agg(x) FROM (
        SELECT initcap(lower(btrim(suburb))) suburb, count(*) n FROM v_rra_member_status
        WHERE member_status='current' AND nullif(btrim(suburb),'') IS NOT NULL
        GROUP BY 1 ORDER BY 2 DESC LIMIT 10) x),
    'top_suburbs_all', (SELECT jsonb_agg(x) FROM (
        SELECT initcap(lower(btrim(suburb))) suburb, count(*) n FROM v_rra_member_status
        WHERE nullif(btrim(suburb),'') IS NOT NULL
        GROUP BY 1 ORDER BY 2 DESC LIMIT 10) x),
    'last_7_days', jsonb_build_object(
        'new_registrations', (SELECT count(*) FROM rra_program_participation WHERE registered_at >= now() - interval '7 days'),
        'new_people', (SELECT count(*) FROM v_rra_member_status WHERE first_seen >= now() - interval '7 days'),
        'payments', (SELECT count(*) FROM rra_program_participation WHERE paid_at >= now() - interval '7 days'),
        'revenue_cents', (SELECT coalesce(sum(amount_paid_cents),0) FROM rra_program_participation WHERE paid_at >= now() - interval '7 days'),
        'by_program', (SELECT jsonb_agg(x) FROM (SELECT program, term, status, count(*) n FROM rra_program_participation
                        WHERE registered_at >= now() - interval '7 days' GROUP BY 1,2,3 ORDER BY 4 DESC) x)),
    'never_contacted', (SELECT jsonb_object_agg(member_status, n) FROM
        (SELECT member_status, count(*) n FROM v_rra_member_status WHERE never_contacted GROUP BY 1) x),
    'never_contacted_recent_signups', (SELECT jsonb_agg(x) FROM (
        SELECT full_name, member_status, coalesce(current_programs, last_paid_program, array_to_string(programs, ', ')) programs,
               (first_seen AT TIME ZONE 'Australia/Melbourne')::date first_seen
        FROM v_rra_member_status
        WHERE never_contacted AND member_status IN ('unconverted','lead','current')
          AND first_seen >= now() - interval '60 days'
        ORDER BY first_seen DESC LIMIT 25) x),
    'recently_lapsed_list', (SELECT jsonb_agg(x) FROM (
        SELECT full_name, last_paid_program, last_paid_end, current_age, suburb,
               (last_contact_at AT TIME ZONE 'Australia/Melbourne')::date last_contact
        FROM v_rra_member_status WHERE member_status = 'recently_lapsed'
        ORDER BY total_paid_cents DESC, last_paid_end DESC LIMIT 25) x),
    'movement', CASE WHEN v_prev IS NULL THEN NULL ELSE (SELECT jsonb_build_object(
        'became_current', count(*) FILTER (WHERE s.member_status='current' AND coalesce(o.member_status,'new') <> 'current'),
        'dropped_from_current', count(*) FILTER (WHERE o.member_status='current' AND s.member_status <> 'current'),
        'dropped_names', (SELECT jsonb_agg(s2.full_name) FROM v_rra_member_status s2
                          JOIN rra_players_master m2 ON m2.id = s2.player_id
                          JOIN rra_member_snapshots o2 ON o2.snapshot_date = v_prev AND o2.name_key = m2.name_key
                          WHERE o2.member_status='current' AND s2.member_status <> 'current'),
        'brand_new_people', count(*) FILTER (WHERE o.name_key IS NULL))
      FROM v_rra_member_status s JOIN rra_players_master m ON m.id = s.player_id
      LEFT JOIN rra_member_snapshots o ON o.snapshot_date = v_prev AND o.name_key = m.name_key) END,
    'data_health', jsonb_build_object(
        'open_identity_reviews', (SELECT count(*) FROM rra_identity_review WHERE NOT resolved),
        'orphan_stripe_payments', (SELECT count(*) FROM rra_identity_review WHERE NOT resolved AND issue_type='orphan_stripe_payment'),
        'unpaid_registrations_in_current_terms', (SELECT count(*) FROM rra_program_participation p
            JOIN rra_program_terms t ON t.program=p.program AND t.term=p.term
            WHERE p.status='unpaid' AND v_today BETWEEN t.starts_on - 45 AND t.ends_on),
        'alex_mailbox_last_synced', (SELECT max(synced_at) FROM player_communications),
        'comms_logged_last_7_days', (SELECT count(*) FROM rra_comms_log WHERE sent_at >= now() - interval '7 days'),
        'unconfirmed_term_dates', (SELECT count(*) FROM rra_program_terms WHERE NOT confirmed))
  ) INTO r;

  IF p_take_snapshot THEN
    INSERT INTO rra_member_snapshots (snapshot_date, player_id, name_key, member_status)
    SELECT v_today, s.player_id, m.name_key, s.member_status
    FROM v_rra_member_status s JOIN rra_players_master m ON m.id = s.player_id
    ON CONFLICT (snapshot_date, player_id) DO UPDATE SET member_status = EXCLUDED.member_status;
  END IF;
  RETURN r;
END $$;

REVOKE ALL ON FUNCTION public.rra_weekly_report(boolean) FROM PUBLIC, anon, authenticated;
