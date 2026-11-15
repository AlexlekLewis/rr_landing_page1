-- ============================================================
-- RRA player registry: cover every sign-up form, refresh nightly
-- ============================================================
-- The canonical registry (rra_players_master / rra_program_participation)
-- is rebuilt from v_rra_registration_events by rra_refresh_all(). It had no
-- schedule and stopped at 6 Aug 2026, and the view did not know about any
-- form built after July. This migration:
--   1. adds every later form (Sept holidays, Term 4 paid, Performance
--      Squads + trials, match days, Lower Plenty day, masterclass) and the
--      lead/enquiry forms (open days, Power Game enquiries, Elite waitlist,
--      Female Kickstart) so the pipeline sees every family;
--   2. adds 'interest' / 'registered' statuses so free or enquiry rows are
--      never shown as unpaid debt;
--   3. gives the Stripe program map a paid-date window, so a Sept holiday
--      payment can no longer be matched to an April holiday registration;
--   4. schedules rra_refresh_all() nightly (02:20 Melbourne).
-- Source tables are only read, never modified. Everything the registry
-- holds is rebuilt from them plus rra_roster_overrides (Alex's confirmations).
-- ============================================================

-- safe int from free-text ages ("12", "12 years", "")
CREATE OR REPLACE FUNCTION public.rra_int_or_null(t text) RETURNS integer
LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE WHEN substring(coalesce(t,'') from '(\d{1,2})') IS NOT NULL
              THEN substring(t from '(\d{1,2})')::int END $$;

-- ---------- 1. Stripe map: paid-date windows ----------
ALTER TABLE public.rra_stripe_program_map
  ADD COLUMN IF NOT EXISTS paid_from date,
  ADD COLUMN IF NOT EXISTS paid_to   date;

UPDATE public.rra_stripe_program_map
   SET paid_to = '2026-05-31',
       note = coalesce(note,'') || ' | paid_to 31 May: later "holiday" payments are July/Sept programs'
 WHERE stripe_program = 'holiday' AND term = 'April 2026' AND paid_to IS NULL;

INSERT INTO public.rra_stripe_program_map (stripe_program, variant_pattern, program, term, centre, note)
SELECT 'female_kickstart', NULL, 'female_kickstart', '2026', NULL, 'Girls Kickstart 2026'
WHERE NOT EXISTS (SELECT 1 FROM public.rra_stripe_program_map WHERE stripe_program = 'female_kickstart');

CREATE OR REPLACE FUNCTION public.reconcile_rra_payments()
 RETURNS TABLE(matched integer, instalments_absorbed integer, orphan_payments integer, still_unpaid integer)
 LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'extensions'
AS $function$
DECLARE v_new int; v_matched int; v_absorbed int; v_orphan int; v_unpaid int;
BEGIN
  DELETE FROM rra_identity_review WHERE issue_type = 'orphan_stripe_payment';

  CREATE TEMP TABLE _pay ON COMMIT DROP AS
  SELECT pr.id AS pay_id, pr.paid_at, pr.amount_total_cents, pr.customer_name,
         pr.customer_email, pr.program_label, mp.program, mp.term, mp.centre,
         coalesce(rra_email_key(al.canonical_email), rra_email_key(pr.customer_email)) AS ekey,
         coalesce(rra_phone_key(al.canonical_phone), rra_phone_key(pr.customer_phone)) AS pkey
  FROM program_registrations pr
  JOIN rra_stripe_program_map mp
    ON mp.stripe_program = pr.program
   AND (mp.variant_pattern IS NULL OR coalesce(pr.program_variant,'') LIKE mp.variant_pattern)
   AND (mp.paid_from IS NULL OR pr.paid_at >= mp.paid_from)
   AND (mp.paid_to   IS NULL OR pr.paid_at <  mp.paid_to + 1)
  LEFT JOIN rra_contact_aliases al
    ON rra_email_key(al.alias_email) = rra_email_key(pr.customer_email)
    OR rra_phone_key(al.alias_phone)  = rra_phone_key(pr.customer_phone);

  CREATE TEMP TABLE _cand ON COMMIT DROP AS
  SELECT y.pay_id, p.id AS part_id, y.paid_at, y.amount_total_cents,
         CASE WHEN rra_names_compatible(rra_name_key(y.customer_name), m.name_key) THEN 0 ELSE 1 END AS score
  FROM _pay y
  JOIN rra_program_participation p
    ON p.program = y.program AND p.term = y.term
   AND (y.centre IS NULL OR p.centre = y.centre)
  JOIN rra_players_master m ON m.id = p.player_id
  WHERE m.emails && ARRAY[y.ekey] OR m.phones && ARRAY[y.pkey];

  CREATE TEMP TABLE _match (pay_id uuid PRIMARY KEY, part_id uuid UNIQUE,
                            paid_at timestamptz, amount_total_cents int) ON COMMIT DROP;
  LOOP
    INSERT INTO _match (pay_id, part_id, paid_at, amount_total_cents)
    SELECT pay_id, part_id, paid_at, amount_total_cents FROM (
      SELECT c.*, row_number() OVER (PARTITION BY pay_id  ORDER BY score, part_id) rn_pay,
                  row_number() OVER (PARTITION BY part_id ORDER BY score, pay_id)  rn_part
      FROM _cand c
      WHERE NOT EXISTS (SELECT 1 FROM _match x WHERE x.pay_id  = c.pay_id)
        AND NOT EXISTS (SELECT 1 FROM _match x WHERE x.part_id = c.part_id)
    ) r WHERE rn_pay = 1 AND rn_part = 1;
    GET DIAGNOSTICS v_new = ROW_COUNT;
    EXIT WHEN v_new = 0;
  END LOOP;
  SELECT count(*) INTO v_matched FROM _match;

  CREATE TEMP TABLE _absorb ON COMMIT DROP AS
  SELECT y.pay_id, mt.part_id, y.amount_total_cents
  FROM _pay y
  JOIN LATERAL (
    SELECT mm.part_id FROM rra_program_participation p2
    JOIN rra_players_master m2 ON m2.id = p2.player_id
    JOIN _match mm ON mm.part_id = p2.id
    WHERE p2.program = y.program AND p2.term = y.term
      AND (m2.emails && ARRAY[y.ekey] OR m2.phones && ARRAY[y.pkey])
    LIMIT 1) mt ON true
  WHERE NOT EXISTS (SELECT 1 FROM _match x WHERE x.pay_id = y.pay_id)
    AND (SELECT count(*) FROM rra_program_participation p3
         JOIN rra_players_master m3 ON m3.id = p3.player_id
         WHERE p3.program = y.program AND p3.term = y.term
           AND (m3.emails && ARRAY[y.ekey] OR m3.phones && ARRAY[y.pkey])) = 1;
  SELECT count(*) INTO v_absorbed FROM _absorb;

  UPDATE rra_program_participation p
     SET status = 'paid', stripe_matched = true, paid_at = mt.paid_at,
         amount_paid_cents = mt.amount_total_cents
                           + coalesce((SELECT sum(a.amount_total_cents) FROM _absorb a WHERE a.part_id = p.id), 0),
         notes = CASE WHEN EXISTS (SELECT 1 FROM _absorb a WHERE a.part_id = p.id)
                      THEN 'Payment plan: ' || (1 + (SELECT count(*) FROM _absorb a WHERE a.part_id = p.id))::text
                           || ' instalments summed' END
  FROM _match mt WHERE mt.part_id = p.id;

  SELECT count(*) INTO v_orphan FROM _pay y
   WHERE NOT EXISTS (SELECT 1 FROM _match x WHERE x.pay_id = y.pay_id)
     AND NOT EXISTS (SELECT 1 FROM _absorb a WHERE a.pay_id = y.pay_id);
  SELECT count(*) INTO v_unpaid FROM rra_program_participation WHERE status = 'unpaid';

  INSERT INTO rra_identity_review (issue_type, name_key, detail, candidates)
  SELECT 'orphan_stripe_payment', rra_name_key(y.customer_name),
         format('$%s for "%s" on %s — payer %s <%s> matches no registration form.',
                to_char(y.amount_total_cents/100.0,'FM999,990.00'), y.program_label,
                to_char(y.paid_at,'DD Mon YYYY'), y.customer_name, y.customer_email),
         ARRAY[y.customer_email]
  FROM _pay y
  WHERE NOT EXISTS (SELECT 1 FROM _match x WHERE x.pay_id = y.pay_id)
    AND NOT EXISTS (SELECT 1 FROM _absorb a WHERE a.pay_id = y.pay_id);

  RETURN QUERY SELECT v_matched, v_absorbed, v_orphan, v_unpaid;
END $function$;

-- ---------- 2. Every registration / enquiry form ----------
CREATE OR REPLACE VIEW public.v_rra_registration_events AS
 SELECT 'junior_royals_bundoora'::text AS source_table, t.id AS source_row_id,
    'junior_royals'::text AS program, 'Term 2 2026'::text AS term, 'Bundoora'::text AS centre,
    t.player_name, NULL::date AS dob, t.player_age AS age, t.player_gender AS gender, t.parent_name,
    ARRAY[t.parent_email] AS emails, ARRAY[t.parent_phone] AS phones, t.suburb, NULL::text AS club,
    t.time_slot AS session_detail, t.payment_status AS raw_payment_status, t.created_at AS registered_at,
    NULL::bigint AS inline_amount_cents, NULL::timestamptz AS inline_paid_at
   FROM junior_royals_bundoora t
  WHERE NOT coalesce(t.is_test,false) AND NOT coalesce(t.is_duplicate,false)
UNION ALL
 SELECT 'junior_royals_hallam', t.id, 'junior_royals', 'Term 2 2026', 'Hallam',
    t.player_name, NULL::date, t.player_age, t.player_gender, t.parent_name,
    ARRAY[t.parent_email], ARRAY[t.parent_phone], t.suburb, NULL::text,
    t.time_slot, t.payment_status, t.created_at, NULL::bigint, NULL::timestamptz
   FROM junior_royals_hallam t
  WHERE NOT coalesce(t.is_test,false) AND NOT coalesce(t.is_duplicate,false)
UNION ALL
 SELECT 'jr_term3_mickleham', t.id, 'junior_royals', 'Term 3 2026', 'Mickleham',
    t.player_name, NULL::date, t.player_age, t.player_gender, t.parent_name,
    ARRAY[t.parent_email], ARRAY[t.parent_phone], t.suburb, NULL::text,
    t.time_slot, t.payment_status, t.created_at, c.amt, c.pa
   FROM jr_term3_mickleham t
   LEFT JOIN LATERAL (SELECT sum(x.amount_total_cents) AS amt, max(x.paid_at) AS pa
                        FROM jr_term3_payment_confirmations x WHERE x.matched_record_id = t.id) c ON true
UNION ALL
 SELECT 'jr_term3_hallam', t.id, 'junior_royals', 'Term 3 2026', 'Hallam',
    t.player_name, NULL::date, t.player_age, t.player_gender, t.parent_name,
    ARRAY[t.parent_email], ARRAY[t.parent_phone], t.suburb, NULL::text,
    t.time_slot, t.payment_status, t.created_at, c.amt, c.pa
   FROM jr_term3_hallam t
   LEFT JOIN LATERAL (SELECT sum(x.amount_total_cents) AS amt, max(x.paid_at) AS pa
                        FROM jr_term3_payment_confirmations x WHERE x.matched_record_id = t.id) c ON true
UNION ALL
 SELECT 'jr_term3_williamstown', t.id, 'junior_royals', 'Term 3 2026', 'Williamstown',
    t.player_name, NULL::date, t.player_age, t.player_gender, t.parent_name,
    ARRAY[t.parent_email], ARRAY[t.parent_phone], t.suburb, NULL::text,
    t.time_slot, t.payment_status, t.created_at, c.amt, c.pa
   FROM jr_term3_williamstown t
   LEFT JOIN LATERAL (SELECT sum(x.amount_total_cents) AS amt, max(x.paid_at) AS pa
                        FROM jr_term3_payment_confirmations x WHERE x.matched_record_id = t.id) c ON true
UNION ALL
 -- Term 4: the waitlist table also takes the paid Term 4 bookings (paid = true)
 SELECT 'jr_term4_waitlist', t.id, 'junior_royals', 'Term 4 2026',
    nullif(initcap(t.preferred_centre),'Any'),
    t.player_name, NULL::date, t.player_age, NULL::text, t.parent_name,
    ARRAY[t.parent_email], ARRAY[t.parent_phone], NULL::text, NULL::text,
    t.preferred_day, CASE WHEN t.paid THEN 'completed' ELSE 'waitlist' END, t.created_at,
    CASE WHEN t.paid THEN t.amount_paid_cents::bigint END, CASE WHEN t.paid THEN t.paid_at END
   FROM jr_term4_waitlist t
UNION ALL
 SELECT 'mickleham_junior_registrations', t.id, 'junior_royals_interest', 'Interest Jul 2026', 'Mickleham',
    t.player_name, t.player_dob, t.player_age, t.player_gender, t.parent_name,
    ARRAY[t.parent_email], ARRAY[t.parent_phone], t.suburb, t.current_club,
    t.session, 'interest', t.created_at, NULL::bigint, NULL::timestamptz
   FROM mickleham_junior_registrations t
UNION ALL
 SELECT 'hallam_junior_registrations', t.id, 'junior_royals_interest', 'Interest Jul 2026', 'Hallam',
    t.player_name, t.player_dob, t.player_age, t.player_gender, t.parent_name,
    ARRAY[t.parent_email], ARRAY[t.parent_phone], t.suburb, t.current_club,
    t.session, 'interest', t.created_at, NULL::bigint, NULL::timestamptz
   FROM hallam_junior_registrations t
UNION ALL
 SELECT 'williamstown_junior_registrations', t.id, 'junior_royals_interest', 'Interest Jul 2026', 'Williamstown',
    t.player_name, t.player_dob, t.player_age, t.player_gender, t.parent_name,
    ARRAY[t.parent_email], ARRAY[t.parent_phone], t.suburb, t.current_club,
    t.session, 'interest', t.created_at, NULL::bigint, NULL::timestamptz
   FROM williamstown_junior_registrations t
UNION ALL
 SELECT 'holiday_clinic_registrations', t.id, 'holiday', 'April 2026',
    CASE WHEN t.location = 'cutting-edge' THEN 'Bundoora' ELSE initcap(t.location) END,
    t.player_name, NULL::date, t.player_age, t.player_gender, t.parent_name,
    ARRAY[t.parent_email], ARRAY[t.parent_phone], t.suburb, t.primary_club,
    CASE WHEN t.on_waitlist THEN 'waitlist' END,
    CASE WHEN t.on_waitlist THEN 'waitlist' ELSE t.payment_status END,
    t.created_at, NULL::bigint, NULL::timestamptz
   FROM holiday_clinic_registrations t
  WHERE NOT coalesce(t.is_test,false) AND NOT coalesce(t.is_duplicate,false)
UNION ALL
 SELECT 'junior_royals_july_holidays_registrations', t.id, 'holiday', 'July 2026',
    CASE t.location WHEN 'the-netz' THEN 'Williamstown' ELSE initcap(t.location) END,
    t.player_name, NULL::date, t.player_age, t.player_gender, t.parent_name,
    ARRAY[t.parent_email], ARRAY[t.parent_phone], t.suburb, t.primary_club,
    CASE WHEN t.on_waitlist THEN 'waitlist' END,
    CASE WHEN t.on_waitlist THEN 'waitlist' ELSE t.payment_status END,
    t.created_at, NULL::bigint, NULL::timestamptz
   FROM junior_royals_july_holidays_registrations t
UNION ALL
 SELECT 'junior_royals_sept_holidays_registrations', t.id, 'holiday', 'Sept 2026',
    initcap(replace(t.location,'-',' ')),
    t.player_name, NULL::date, t.player_age, t.player_gender, t.parent_name,
    ARRAY[t.parent_email], ARRAY[t.parent_phone], t.suburb, t.primary_club,
    CASE WHEN t.on_waitlist THEN 'waitlist' END,
    CASE WHEN t.paid THEN 'completed' WHEN t.on_waitlist THEN 'waitlist' ELSE t.payment_status END,
    t.created_at,
    CASE WHEN t.paid THEN t.amount_paid_cents::bigint END, CASE WHEN t.paid THEN t.paid_at END
   FROM junior_royals_sept_holidays_registrations t
UNION ALL
 SELECT 'elite_program_2026_roster', t.id, 'elite_12week', 'Autumn 2026 (Apr-Jul)', NULL::text,
    t.player_name, t.dob, t.age, t.gender, t.parent_name,
    ARRAY[t.email, t.parent_email, t.parent2_email, t.parent3_email], ARRAY[t.phone, t.parent_phone],
    t.suburb, t.club, concat_ws(' / ', t.weekday_session, t.weekend_session),
    t.payment_status, t.created_at, NULL::bigint, NULL::timestamptz
   FROM elite_program_2026_roster t
  WHERE coalesce(t.active, true)
UNION ALL
 SELECT 'power_game_applications', t.id, 'power_game', 'Pre-Season 2026',
    CASE t.venue WHEN 'Elite Cricket Centre' THEN 'Hallam'
                 WHEN 'Mickleham Indoor Sports Centre' THEN 'Mickleham'
                 WHEN 'The Netz' THEN 'Williamstown' END,
    t.player_name, t.dob, t.age, NULL::text, t.parent1_name,
    ARRAY[t.email, t.parent1_email, t.parent2_email], ARRAY[t.phone, t.parent1_phone, t.parent2_phone],
    t.suburb, coalesce(t.club, t.current_club),
    nullif(concat_ws(' ', t.session_day, t.session_time), ''),
    t.payment_status, t.created_at, t.amount_paid_cents::bigint, t.paid_at
   FROM power_game_applications t
UNION ALL
 -- Performance Squads season (Sept 2026 - Apr 2027): selected players
 SELECT 'performance_squads_registrations', t.id, 'performance_squads', 'Season 2026-27',
    CASE t.centre_slug WHEN 'north-melbourne' THEN 'North Melbourne'
                       WHEN 'south-east-melbourne' THEN 'South East Melbourne'
                       ELSE initcap(replace(t.centre_slug,'-',' ')) END,
    coalesce(nullif(t.player_name,''), concat_ws(' ', t.first_name, t.last_name)),
    t.dob, extract(year FROM age(t.created_at::date, t.dob))::int, t.gender, t.parent_name,
    ARRAY[t.email, t.parent_email], ARRAY[t.phone, t.parent_phone], t.suburb, t.current_club,
    nullif(concat_ws(' ', t.squad_name, t.session_day, t.session_time), ''),
    CASE WHEN t.paid_at IS NOT NULL OR t.status = 'paid' THEN 'completed' ELSE 'pending' END,
    t.created_at, t.amount_paid_cents::bigint, t.paid_at
   FROM performance_squads_registrations t
UNION ALL
 -- Performance Squads trial sign-ups and waitlist (pipeline, not paid)
 SELECT 'performance_squad_leads', t.id, 'performance_squads_trial',
    CASE WHEN t.on_waitlist THEN 'Waitlist 2026-27' ELSE 'Trials 2026' END,
    CASE t.preferred_centre WHEN 'north-melbourne' THEN 'North Melbourne'
                            WHEN 'south-east-melbourne' THEN 'South East Melbourne'
                            ELSE initcap(replace(t.preferred_centre,'-',' ')) END,
    t.player_name, NULL::date, rra_int_or_null(t.player_age), NULL::text, t.parent_name,
    ARRAY[t.email], ARRAY[t.phone], NULL::text, t.club, t.entry_type,
    CASE WHEN t.on_waitlist THEN 'waitlist' ELSE 'interest' END,
    t.created_at, NULL::bigint, NULL::timestamptz
   FROM performance_squad_leads t
UNION ALL
 SELECT 'match_registrations', t.id, 'match_day', t.match_name, NULL::text,
    t.player_name, NULL::date, t.player_age, NULL::text, t.parent_name,
    ARRAY[t.email], ARRAY[t.phone], NULL::text, t.club, t.match_slug,
    CASE WHEN t.paid THEN 'completed' ELSE 'registered' END,
    t.created_at, NULL::bigint, t.paid_at
   FROM match_registrations t
UNION ALL
 SELECT 'lower_plenty_junior_royals_day_registrations', t.id, 'junior_royals_day', 'Lower Plenty Oct 2026', 'Lower Plenty',
    concat_ws(' ', t.player_first_name, t.player_last_name), NULL::date, t.player_age::int, NULL::text, t.parent_name,
    ARRAY[t.email], ARRAY[t.phone], t.suburb, t.club_name, NULL::text,
    CASE WHEN t.paid THEN 'completed' ELSE 'pending' END,
    t.created_at, CASE WHEN t.paid THEN t.amount_paid_cents::bigint END, t.paid_at
   FROM lower_plenty_junior_royals_day_registrations t
  WHERE t.cancelled_at IS NULL
UNION ALL
 SELECT 'masterclass_registrations', t.id, 'masterclass', 'Sept 2026', NULL::text,
    t.player_name, NULL::date, rra_int_or_null(t.player_age), t.player_gender, t.parent_name,
    ARRAY[t.email, t.parent_email], ARRAY[t.phone, t.parent_phone], t.suburb, coalesce(t.primary_club, t.club),
    t.program_type, CASE WHEN t.paid THEN 'completed' ELSE 'pending' END,
    t.created_at, NULL::bigint, t.paid_at
   FROM masterclass_registrations t
UNION ALL
 SELECT 'female_kickstart_2026', t.id, 'female_kickstart', '2026', initcap(t.location),
    t.player_name, t.player_dob, NULL::int, 'Female', t.parent_name,
    ARRAY[t.parent_email], ARRAY[t.parent_phone], t.suburb, NULL::text, NULL::text,
    t.payment_status, t.created_at, NULL::bigint, NULL::timestamptz
   FROM female_kickstart_2026 t
UNION ALL
 SELECT 'mickleham_open_day_registrations', t.id, 'open_day', 'Jul 2026', 'Mickleham',
    t.player_name, t.player_dob, t.player_age, t.player_gender, t.parent_name,
    ARRAY[t.parent_email], ARRAY[t.parent_phone], t.suburb, t.current_club, t.session,
    'registered', t.created_at, NULL::bigint, NULL::timestamptz
   FROM mickleham_open_day_registrations t
UNION ALL
 SELECT 'hallam_open_day_registrations', t.id, 'open_day', 'Jul 2026', 'Hallam',
    t.player_name, t.player_dob, t.player_age, t.player_gender, t.parent_name,
    ARRAY[t.parent_email], ARRAY[t.parent_phone], t.suburb, t.current_club, t.session,
    'registered', t.created_at, NULL::bigint, NULL::timestamptz
   FROM hallam_open_day_registrations t
UNION ALL
 SELECT 'williamstown_open_day_registrations', t.id, 'open_day', 'Jul 2026', 'Williamstown',
    t.player_name, t.player_dob, t.player_age, t.player_gender, t.parent_name,
    ARRAY[t.parent_email], ARRAY[t.parent_phone], t.suburb, t.current_club, t.session,
    'registered', t.created_at, NULL::bigint, NULL::timestamptz
   FROM williamstown_open_day_registrations t
UNION ALL
 SELECT 'power_game_inquiries', t.id, 'power_game_interest', 'Enquiry 2026', NULL::text,
    t.player_name, t.player_dob, NULL::int, NULL::text, t.parent_name,
    ARRAY[t.parent_email], ARRAY[t.parent_phone], t.suburb, NULL::text, t.program,
    'interest', t.created_at, NULL::bigint, NULL::timestamptz
   FROM power_game_inquiries t
UNION ALL
 SELECT 'elite_2026_waitlist', t.id, 'elite_waitlist', 'Waitlist 2026', NULL::text,
    coalesce(nullif(t.player_name,''), concat_ws(' ', t.first_name, t.last_name)),
    t.dob, t.age, t.gender, t.parent1_name,
    ARRAY[t.email, t.parent1_email, t.parent2_email, t.second_email], ARRAY[t.phone, t.parent1_phone, t.parent2_phone],
    t.suburb, t.club, t.cricket_type, 'waitlist', t.created_at, NULL::bigint, NULL::timestamptz
   FROM elite_2026_waitlist t;

-- form archive: the newly-covered tables link exactly through participation
INSERT INTO public.rra_submission_sources (source_table, form_label, program, term, centre, date_column, link_mode) VALUES
 ('junior_royals_sept_holidays_registrations','Holiday Program Sept registration','holiday','Sept 2026',NULL,'created_at','participation'),
 ('performance_squads_registrations','Performance Squads registration','performance_squads','Season 2026-27',NULL,'created_at','participation'),
 ('performance_squad_leads','Performance Squads trial / waitlist','performance_squads_trial',NULL,NULL,'created_at','participation'),
 ('match_registrations','Match day / session registration','match_day',NULL,NULL,'created_at','participation'),
 ('lower_plenty_junior_royals_day_registrations','Lower Plenty Junior Royals Day','junior_royals_day','Lower Plenty Oct 2026','Lower Plenty','created_at','participation'),
 ('masterclass_registrations','Power Game Masterclass','masterclass','Sept 2026',NULL,'created_at','participation')
ON CONFLICT DO NOTHING;

UPDATE public.rra_submission_sources SET link_mode = 'participation'
 WHERE source_table IN ('mickleham_open_day_registrations','hallam_open_day_registrations',
                        'williamstown_open_day_registrations','power_game_inquiries',
                        'elite_2026_waitlist','female_kickstart_2026');

-- ---------- 3. statuses: interest / registered are not debt ----------
DO $$
DECLARE d text; old_case text; new_case text;
BEGIN
  d := pg_get_functiondef('public.rebuild_rra_registry'::regproc);
  old_case := $o$      WHEN v.program = 'junior_royals_interest' THEN 'interest'
      WHEN bool_or(v.raw_payment_status = 'waitlist') THEN 'waitlist'
      ELSE 'unpaid'$o$;
  new_case := $n$      WHEN v.program = 'junior_royals_interest' OR bool_and(v.raw_payment_status = 'interest') THEN 'interest'
      WHEN bool_or(v.raw_payment_status = 'waitlist') THEN 'waitlist'
      WHEN bool_and(v.raw_payment_status = 'registered') THEN 'registered'
      ELSE 'unpaid'$n$;
  IF position(old_case IN d) = 0 THEN
    RAISE EXCEPTION 'rebuild_rra_registry status CASE not found - review before patching';
  END IF;
  EXECUTE replace(d, old_case, new_case);
END $$;

-- ---------- 4. nightly refresh ----------
SELECT cron.unschedule('rra-refresh-registry')
 WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'rra-refresh-registry');
-- 15:20 UTC = 02:20 AEDT (01:20 AEST in winter)
SELECT cron.schedule('rra-refresh-registry', '20 15 * * *', $$SELECT public.rra_refresh_all();$$);
