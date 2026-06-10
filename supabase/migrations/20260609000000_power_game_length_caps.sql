-- Abuse mitigation (applied live 2026-06): both power_game_* tables allow public
-- anon INSERT (lead forms). Cap text-field lengths so a script can't dump multi-MB
-- payloads to bloat storage/egress. NOT VALID = applies to new inserts/updates only;
-- existing rows are trusted (all small). Caps are generous; no legitimate submission
-- is rejected.
ALTER TABLE public.power_game_inquiries
  ADD CONSTRAINT pg_inq_len_caps CHECK (
    length(player_name)   <= 200  AND
    length(parent_name)   <= 200  AND
    length(parent_phone)  <= 50   AND
    length(parent_email)  <= 320  AND
    length(suburb)        <= 200  AND
    length(city)          <= 200  AND
    length(source)        <= 100  AND
    length(program)       <= 200  AND
    length(utm_source)    <= 200  AND
    length(utm_medium)    <= 200  AND
    length(utm_campaign)  <= 200  AND
    length(page_referrer) <= 2048
  ) NOT VALID;

ALTER TABLE public.power_game_applications
  ADD CONSTRAINT pg_app_len_caps CHECK (
    length(first_name)           <= 200   AND
    length(last_name)            <= 200   AND
    length(player_name)          <= 300   AND
    length(cricket_type)         <= 100   AND
    length(email)                <= 320   AND
    length(phone)                <= 50    AND
    length(suburb)               <= 200   AND
    length(profile_link)         <= 2048  AND
    length(club)                 <= 500   AND
    length(bio)                  <= 10000 AND
    length(goals)                <= 10000 AND
    length(cv_url)               <= 2048  AND
    length(parent1_name)         <= 200   AND
    length(parent1_email)        <= 320   AND
    length(parent1_phone)        <= 50    AND
    length(parent2_name)         <= 200   AND
    length(parent2_email)        <= 320   AND
    length(parent2_phone)        <= 50    AND
    length(venue)                <= 200   AND
    length(age_group)            <= 100   AND
    length(session_day)          <= 100   AND
    length(session_time)         <= 100   AND
    length(phase)                <= 100   AND
    length(payment_status)       <= 50    AND
    length(stripe_session_id)    <= 200   AND
    length(receipt_url)          <= 2048  AND
    length(status)               <= 50    AND
    length(admin_notes)          <= 10000 AND
    length(source)               <= 100   AND
    length(utm_source)           <= 200   AND
    length(utm_medium)           <= 200   AND
    length(utm_campaign)         <= 200   AND
    length(page_referrer)        <= 2048  AND
    length(application_type)     <= 50    AND
    length(current_level)        <= 500   AND
    length(capability_statement) <= 10000
  ) NOT VALID;
