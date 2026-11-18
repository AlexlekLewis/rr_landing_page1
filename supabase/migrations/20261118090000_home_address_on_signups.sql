-- ============================================================
-- Home address on every program sign-up
-- ============================================================
-- Andy, 18 Nov 2026: "add a home address to everyone's fields because we need the
-- ability to be able to send things to people."
--
-- Every live sign-up form now asks for street / suburb / state / postcode
-- (src/components/shared/HomeAddressFields.jsx, rules in src/lib/homeAddress.js)
-- and saves them in four columns of the same names. This migration MUST be applied
-- before the form changes are deployed (CLAUDE.md), or inserts fail on unknown columns.
--
-- Also:
--   * save_sept_registration() stores the four fields (that form saves through the RPC)
--   * v_rra_home_addresses: every address any form or order has captured, newest first,
--     with the emails/phones to match it to a player
--   * v_rra_contacts gains the latest known home address per player
-- Existing anon insert grants are table-level, so the new columns need no extra grant.
-- ============================================================

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'jr_term4_waitlist','junior_royals_sept_holidays_registrations','junior_royals_bundoora',
    'junior_royals_hallam','applications','female_kickstart_2026','performance_squad_leads',
    'performance_squads_registrations','match_registrations','power_game_applications']
  LOOP
    EXECUTE format('ALTER TABLE public.%I
      ADD COLUMN IF NOT EXISTS home_street   text,
      ADD COLUMN IF NOT EXISTS home_suburb   text,
      ADD COLUMN IF NOT EXISTS home_state    text,
      ADD COLUMN IF NOT EXISTS home_postcode text', t);
    -- public forms write these: keep them sane
    EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS %I', t, t || '_home_address_len');
    EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I CHECK (
        coalesce(length(home_street),0) <= 200 AND coalesce(length(home_suburb),0) <= 80
        AND coalesce(length(home_state),0) <= 3 AND coalesce(length(home_postcode),0) <= 4)', t, t || '_home_address_len');
  END LOOP;
END $$;

-- Sept/summer holiday form saves through this RPC: carry the address through.
DO $$
DECLARE d text;
BEGIN
  d := pg_get_functiondef('public.save_sept_registration'::regproc);
  IF position('home_street' IN d) > 0 THEN RETURN; END IF;
  IF position('      page_referrer       = coalesce(t.page_referrer, p->>''page_referrer'')' IN d) = 0
     OR position('utm_source, utm_medium, utm_campaign, utm_content, utm_term, page_referrer
    ) values (' IN d) = 0
     OR position('p->>''utm_term'', p->>''page_referrer''
    );' IN d) = 0 THEN
    RAISE EXCEPTION 'save_sept_registration changed shape - review before patching';
  END IF;
  d := replace(d, '      page_referrer       = coalesce(t.page_referrer, p->>''page_referrer'')',
                  '      page_referrer       = coalesce(t.page_referrer, p->>''page_referrer''),
      home_street         = coalesce(nullif(p->>''home_street'',''), t.home_street),
      home_suburb         = coalesce(nullif(p->>''home_suburb'',''), t.home_suburb),
      home_state          = coalesce(nullif(p->>''home_state'',''), t.home_state),
      home_postcode       = coalesce(nullif(p->>''home_postcode'',''), t.home_postcode)');
  d := replace(d, 'utm_source, utm_medium, utm_campaign, utm_content, utm_term, page_referrer
    ) values (',
                  'utm_source, utm_medium, utm_campaign, utm_content, utm_term, page_referrer,
      home_street, home_suburb, home_state, home_postcode
    ) values (');
  d := replace(d, 'p->>''utm_term'', p->>''page_referrer''
    );',
                  'p->>''utm_term'', p->>''page_referrer'',
      nullif(p->>''home_street'',''), nullif(p->>''home_suburb'',''), nullif(p->>''home_state'',''), nullif(p->>''home_postcode'','')
    );');
  EXECUTE d;
END $$;

-- Every home address we hold from sign-up forms, newest first. Nothing before this
-- change captured a street address on these tables, so it starts empty and fills
-- as families sign up. (India Tour traveller addresses stay in their own private table.)
CREATE OR REPLACE VIEW public.v_rra_home_addresses WITH (security_invoker = true) AS
WITH src AS (
  SELECT 'jr_term4_waitlist' AS source_table, created_at, player_name, ARRAY[parent_email] AS emails, ARRAY[parent_phone] AS phones,
         home_street, home_suburb, home_state, home_postcode FROM jr_term4_waitlist
  UNION ALL SELECT 'junior_royals_sept_holidays_registrations', created_at, player_name, ARRAY[parent_email], ARRAY[parent_phone],
         home_street, home_suburb, home_state, home_postcode FROM junior_royals_sept_holidays_registrations
  UNION ALL SELECT 'junior_royals_bundoora', created_at, player_name, ARRAY[parent_email], ARRAY[parent_phone],
         home_street, home_suburb, home_state, home_postcode FROM junior_royals_bundoora
  UNION ALL SELECT 'junior_royals_hallam', created_at, player_name, ARRAY[parent_email], ARRAY[parent_phone],
         home_street, home_suburb, home_state, home_postcode FROM junior_royals_hallam
  UNION ALL SELECT 'applications', created_at, concat_ws(' ', first_name, last_name), ARRAY[email, parent1_email, parent2_email], ARRAY[phone, parent1_phone, parent2_phone],
         home_street, home_suburb, home_state, home_postcode FROM applications WHERE NOT coalesce(is_test,false)
  UNION ALL SELECT 'female_kickstart_2026', created_at, player_name, ARRAY[parent_email], ARRAY[parent_phone],
         home_street, home_suburb, home_state, home_postcode FROM female_kickstart_2026
  UNION ALL SELECT 'performance_squad_leads', created_at, player_name, ARRAY[email], ARRAY[phone],
         home_street, home_suburb, home_state, home_postcode FROM performance_squad_leads
  UNION ALL SELECT 'performance_squads_registrations', created_at, coalesce(nullif(player_name,''), concat_ws(' ', first_name, last_name)), ARRAY[email, parent_email], ARRAY[phone, parent_phone],
         home_street, home_suburb, home_state, home_postcode FROM performance_squads_registrations
  UNION ALL SELECT 'match_registrations', created_at, player_name, ARRAY[email], ARRAY[phone],
         home_street, home_suburb, home_state, home_postcode FROM match_registrations
  UNION ALL SELECT 'power_game_applications', created_at, player_name, ARRAY[email, parent1_email, parent2_email], ARRAY[phone, parent1_phone, parent2_phone],
         home_street, home_suburb, home_state, home_postcode FROM power_game_applications
)
SELECT source_table, created_at AS captured_at, player_name,
       (SELECT array_agg(DISTINCT rra_email_key(e)) FROM unnest(emails) e WHERE rra_email_key(e) IS NOT NULL) AS email_keys,
       (SELECT array_agg(DISTINCT rra_phone_key(p)) FROM unnest(phones) p WHERE rra_phone_key(p) IS NOT NULL) AS phone_keys,
       home_street, home_suburb, home_state, home_postcode,
       home_street || ', ' || concat_ws(' ', home_suburb, home_state, home_postcode) AS address_line
FROM src
WHERE nullif(btrim(home_street), '') IS NOT NULL;

COMMENT ON VIEW public.v_rra_home_addresses IS
 'Every home address captured by a sign-up form, newest first via captured_at. Match to a player by rra_names_compatible(player name) and email_keys/phone_keys overlap with rra_players_master.emails/phones. Private: admin only.';

-- Contacts carry the latest known address (same household email/phone, name-compatible first).
CREATE OR REPLACE VIEW public.v_rra_contacts WITH (security_invoker = true) AS
SELECT s.player_id, s.full_name AS player_name, s.current_age, s.member_status,
  CASE WHEN s.current_age >= 18 THEN 'player' ELSE 'parent' END AS contact_role,
  CASE WHEN s.current_age >= 18 THEN s.full_name ELSE coalesce(s.parent_name, 'Parent/guardian of ' || s.full_name) END AS contact_name,
  s.primary_email AS email,
  s.primary_phone AS phone,
  EXISTS (SELECT 1 FROM rra_comms_optouts o WHERE o.channel IN ('email','all') AND rra_email_key(o.address) = ANY (s.emails)) AS email_opted_out,
  EXISTS (SELECT 1 FROM rra_comms_optouts o WHERE o.channel IN ('sms','all') AND rra_phone_key(o.address) = ANY (s.phones)) AS sms_opted_out,
  (s.current_age IS NULL) AS age_unknown,
  s.current_programs, s.last_paid_program, s.suburb, s.club,
  ha.address_line AS home_address, ha.captured_at AS home_address_captured_at
FROM v_rra_member_status s
LEFT JOIN LATERAL (
  SELECT h.address_line, h.captured_at FROM v_rra_home_addresses h
  WHERE h.email_keys && s.emails OR h.phone_keys && s.phones
  ORDER BY rra_names_compatible(rra_name_key(h.player_name), rra_name_key(s.full_name)) DESC, h.captured_at DESC
  LIMIT 1) ha ON true;
