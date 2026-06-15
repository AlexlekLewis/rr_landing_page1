-- Consolidates every player submission across all landing-page tables into a
-- single normalized view, plus a deduplicated per-person rollup. Used to
-- generate the master "all applicants" sheet.
--
-- Sources unified (rows = clean, non-test, non-duplicate):
--   applications, elite_2026_waitlist, holiday_clinic_registrations,
--   junior_royals_july_holidays_registrations, power_game_applications,
--   power_game_inquiries, india_tour_2026_eoi, rsvp_responses,
--   general_enquiries, upcoming_program_interest, inquiries.
--
-- Sources intentionally NOT included to avoid double-counting:
--   junior_royals_bundoora, junior_royals_hallam, female_kickstart_2026,
--   india_tour_2026_eoi rows that already exist in applications,
--   official_cohort_2026 (selected subset of applications),
--   program_registrations (Stripe payment records, not submissions),
--   crm_leads (partial derived rollup).

DROP VIEW IF EXISTS v_unique_players_consolidated CASCADE;
DROP VIEW IF EXISTS v_all_submissions_consolidated CASCADE;

CREATE OR REPLACE VIEW v_all_submissions_consolidated AS
WITH normalized AS (
  SELECT
    'applications'::text AS source_table,
    CASE
      WHEN program_type = 'Junior Royals' THEN 'Junior Royals (Bundoora/Hallam)'
      WHEN program_type = 'female-intro' THEN 'Girls Kickstart Program'
      WHEN program_type = 'india-tour-2026-eoi' THEN 'India Tour 2026 EOI'
      WHEN program IS NOT NULL THEN program
      WHEN program_type IS NOT NULL THEN program_type
      ELSE 'Elite Program 2026 (Application)'
    END AS program,
    created_at AS applied_at,
    id::text AS source_id,
    TRIM(CONCAT_WS(' ', first_name, last_name)) AS player_name,
    first_name AS player_first_name,
    last_name AS player_last_name,
    dob AS player_dob,
    age AS player_age,
    player_gender,
    email AS player_email,
    phone AS player_phone,
    parent1_name AS parent_name,
    parent1_email AS parent_email,
    parent1_phone AS parent_phone,
    parent2_name, parent2_email, parent2_phone,
    suburb, club, experience_level,
    profile_link, history, bio, goals, cv_url,
    source, page_referrer, utm_source, utm_medium, utm_campaign,
    cricket_type,
    NULL::text AS shirt_size,
    NULL::text AS location_extra,
    NULL::text AS payment_status,
    NULL::text AS notes_extra,
    COALESCE(archived, false) AS is_archived,
    COALESCE(is_duplicate, false) AS is_duplicate,
    duplicate_of_id::text,
    COALESCE(is_test, false) AS is_test
  FROM applications

  UNION ALL
  SELECT 'elite_2026_waitlist', 'Elite Program 2026 (Waitlist)',
    created_at, id::text,
    COALESCE(NULLIF(TRIM(player_name), ''), TRIM(CONCAT_WS(' ', first_name, last_name))),
    first_name, last_name, dob, age, gender,
    email, phone,
    parent1_name, parent1_email, parent1_phone,
    parent2_name, parent2_email, parent2_phone,
    suburb, club, NULL, profile_link, history, bio, goals, cv_url,
    source, page_referrer, utm_source, utm_medium, utm_campaign,
    cricket_type, shirt_size, NULL, NULL, notes,
    false, false, NULL, false
  FROM elite_2026_waitlist

  UNION ALL
  SELECT 'holiday_clinic_registrations', 'Holiday Clinic',
    created_at, id::text,
    player_name, NULL, NULL, NULL, player_age, player_gender,
    NULL, NULL,
    parent_name, parent_email, parent_phone,
    NULL, NULL, NULL,
    suburb, primary_club, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, page_referrer, utm_source, utm_medium, utm_campaign,
    NULL, shirt_size, location, payment_status, admin_notes,
    false, COALESCE(is_duplicate, false), duplicate_of_id::text, COALESCE(is_test, false)
  FROM holiday_clinic_registrations

  UNION ALL
  SELECT 'junior_royals_july_holidays_registrations', 'Junior Royals July Holiday Camp',
    created_at, id::text,
    player_name, NULL, NULL, NULL, player_age, player_gender,
    NULL, NULL,
    parent_name, parent_email, parent_phone,
    NULL, NULL, NULL,
    suburb, primary_club, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, page_referrer, utm_source, utm_medium, utm_campaign,
    NULL, shirt_size, location, payment_status, admin_notes,
    false, false, NULL, false
  FROM junior_royals_july_holidays_registrations

  UNION ALL
  SELECT 'power_game_applications', 'Power Game Program (Application)',
    created_at, id::text,
    COALESCE(NULLIF(TRIM(player_name), ''), TRIM(CONCAT_WS(' ', first_name, last_name))),
    first_name, last_name, dob, age, NULL,
    email, phone,
    parent1_name, parent1_email, parent1_phone,
    parent2_name, parent2_email, parent2_phone,
    suburb, COALESCE(current_club, club), current_level,
    profile_link, NULL, bio, goals, cv_url,
    source, page_referrer, utm_source, utm_medium, utm_campaign,
    cricket_type, NULL, venue, payment_status, admin_notes,
    false, false, NULL, false
  FROM power_game_applications

  UNION ALL
  SELECT 'power_game_inquiries', 'Power Game Program (Inquiry)',
    created_at, id::text,
    player_name, NULL, NULL, player_dob, NULL, NULL,
    NULL, NULL,
    parent_name, parent_email, parent_phone,
    NULL, NULL, NULL,
    suburb, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    source, page_referrer, utm_source, utm_medium, utm_campaign,
    NULL, NULL, city, NULL, NULL,
    false, false, NULL, false
  FROM power_game_inquiries

  UNION ALL
  SELECT 'india_tour_2026_eoi', 'India Tour 2026 EOI',
    created_at, id::text,
    player_name, NULL, NULL, player_dob, player_age, NULL,
    player_email, player_phone,
    guardian1_name, guardian1_email, guardian1_phone,
    guardian2_name, guardian2_email, guardian2_phone,
    NULL, current_club, highest_level,
    NULL, NULL, NULL, NULL, NULL,
    source, page_referrer, utm_source, utm_medium, utm_campaign,
    NULL, NULL, NULL, NULL, NULL,
    false, false, NULL, false
  FROM india_tour_2026_eoi

  UNION ALL
  SELECT 'rsvp_responses', 'LP2 RSVP / Pre-screening',
    created_at, id::text,
    player_name, NULL, NULL, NULL, NULL, NULL,
    email, NULL,
    parent_name, email, NULL,
    NULL, NULL, NULL,
    NULL, NULL, NULL,
    NULL, NULL, NULL, excited_reason, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, option_label,
    COALESCE(archived, false), false, NULL, false
  FROM rsvp_responses

  UNION ALL
  SELECT 'general_enquiries', 'General Enquiry',
    created_at, id::text,
    name, NULL, NULL, NULL, NULL, NULL,
    email, phone,
    NULL, NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, skill_level,
    NULL, NULL, NULL, looking_for, NULL,
    NULL, page_referrer, utm_source, utm_medium, utm_campaign,
    NULL, NULL, postcode, NULL, age_group,
    false, false, NULL, false
  FROM general_enquiries

  UNION ALL
  SELECT 'upcoming_program_interest', 'Upcoming Program Interest',
    created_at, id::text,
    name, NULL, NULL, NULL, NULL, NULL,
    email, phone,
    NULL, NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, skill_level,
    NULL, NULL, NULL, questions, NULL,
    NULL, page_referrer, utm_source, utm_medium, utm_campaign,
    NULL, NULL, postcode, NULL, age_group,
    false, false, NULL, false
  FROM upcoming_program_interest

  UNION ALL
  SELECT 'inquiries', 'Generic Inquiry (legacy)',
    created_at, id::text,
    TRIM(CONCAT_WS(' ', first_name, last_name)),
    first_name, last_name, dob, age, NULL,
    email, phone,
    parent1_name, parent1_email, parent1_phone,
    parent2_name, parent2_email, parent2_phone,
    suburb, club, NULL,
    profile_link, history, bio, goals, cv_url,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    false, false, NULL, false
  FROM inquiries
)
SELECT
  source_table, program, applied_at, source_id,
  player_name, player_first_name, player_last_name,
  player_dob, player_age, player_gender,
  player_email, player_phone,
  parent_name, parent_email, parent_phone,
  parent2_name, parent2_email, parent2_phone,
  suburb, club, experience_level, cricket_type,
  shirt_size, location_extra, payment_status,
  profile_link, history, bio, goals, cv_url,
  source, page_referrer, utm_source, utm_medium, utm_campaign,
  notes_extra, is_archived, is_duplicate, duplicate_of_id, is_test,
  LOWER(NULLIF(TRIM(COALESCE(player_email, parent_email)), '')) AS dedup_email,
  REGEXP_REPLACE(COALESCE(player_phone, parent_phone, ''), '[^0-9]', '', 'g') AS dedup_phone,
  LOWER(REGEXP_REPLACE(COALESCE(player_name, ''), '[^a-zA-Z]', '', 'g')) AS dedup_name_norm
FROM normalized;

CREATE OR REPLACE VIEW v_unique_players_consolidated AS
WITH base AS (
  SELECT *,
    COALESCE(
      'e:' || dedup_email,
      'p:' || NULLIF(dedup_phone, ''),
      'n:' || NULLIF(dedup_name_norm, '')
    ) AS person_key
  FROM v_all_submissions_consolidated
  WHERE is_test = false AND is_duplicate = false
),
agg AS (
  SELECT
    person_key,
    string_agg(DISTINCT program, ' | ' ORDER BY program) AS all_programs_applied,
    COUNT(*) AS total_submissions,
    COUNT(DISTINCT program) AS unique_programs_count,
    MIN(applied_at) AS first_applied_at,
    MAX(applied_at) AS last_applied_at,
    MAX(player_name) FILTER (WHERE player_name IS NOT NULL AND player_name <> '') AS player_name,
    MAX(player_email) FILTER (WHERE player_email IS NOT NULL AND player_email <> '') AS player_email,
    MAX(player_phone) FILTER (WHERE player_phone IS NOT NULL AND player_phone <> '') AS player_phone,
    MAX(player_dob) AS player_dob,
    MAX(player_gender) FILTER (WHERE player_gender IS NOT NULL AND player_gender <> '') AS player_gender,
    MAX(parent_name) FILTER (WHERE parent_name IS NOT NULL AND parent_name <> '') AS parent_name,
    MAX(parent_email) FILTER (WHERE parent_email IS NOT NULL AND parent_email <> '') AS parent_email,
    MAX(parent_phone) FILTER (WHERE parent_phone IS NOT NULL AND parent_phone <> '') AS parent_phone,
    MAX(parent2_name) FILTER (WHERE parent2_name IS NOT NULL AND parent2_name <> '') AS parent2_name,
    MAX(parent2_email) FILTER (WHERE parent2_email IS NOT NULL AND parent2_email <> '') AS parent2_email,
    MAX(parent2_phone) FILTER (WHERE parent2_phone IS NOT NULL AND parent2_phone <> '') AS parent2_phone,
    MAX(suburb) FILTER (WHERE suburb IS NOT NULL AND suburb <> '') AS suburb,
    MAX(club) FILTER (WHERE club IS NOT NULL AND club <> '') AS club,
    MAX(experience_level) FILTER (WHERE experience_level IS NOT NULL AND experience_level <> '') AS experience_level,
    MAX(cricket_type) FILTER (WHERE cricket_type IS NOT NULL AND cricket_type <> '') AS cricket_type,
    MAX(cv_url) FILTER (WHERE cv_url IS NOT NULL AND cv_url <> '') AS cv_url,
    MAX(profile_link) FILTER (WHERE profile_link IS NOT NULL AND profile_link <> '') AS profile_link
  FROM base
  WHERE person_key IS NOT NULL
  GROUP BY person_key
)
SELECT
  person_key,
  player_name, player_email, player_phone, player_dob, player_gender,
  parent_name, parent_email, parent_phone,
  parent2_name, parent2_email, parent2_phone,
  suburb, club, experience_level, cricket_type,
  cv_url, profile_link,
  all_programs_applied, unique_programs_count, total_submissions,
  first_applied_at, last_applied_at
FROM agg;

-- PII protection: views must respect RLS on the underlying tables and
-- must NOT be exposed via the anon/authenticated PostgREST roles.
ALTER VIEW v_all_submissions_consolidated SET (security_invoker = true);
ALTER VIEW v_unique_players_consolidated SET (security_invoker = true);
REVOKE ALL ON v_all_submissions_consolidated FROM anon, authenticated;
REVOKE ALL ON v_unique_players_consolidated FROM anon, authenticated;
GRANT SELECT ON v_all_submissions_consolidated TO service_role;
GRANT SELECT ON v_unique_players_consolidated TO service_role;
