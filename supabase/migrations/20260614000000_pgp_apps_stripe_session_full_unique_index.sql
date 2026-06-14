-- Power Game create-on-payment requires INSERT ... ON CONFLICT (stripe_session_id)
-- on power_game_applications (api/stripe-webhook.js + api/power-game-verify-session.js).
-- The original index was PARTIAL (WHERE stripe_session_id IS NOT NULL), which Postgres
-- refuses as an ON CONFLICT arbiter (ERROR 42P10: there is no unique or exclusion
-- constraint matching the ON CONFLICT specification).
--
-- Convert it to a FULL unique index. NULLs are distinct in a Postgres unique index, so
-- the many pending rows with a NULL stripe_session_id are unaffected, and non-null
-- uniqueness is preserved. Mirrors the working full unique index already on
-- power_game_payment_confirmations.stripe_session_id.
DROP INDEX IF EXISTS pg_apps_stripe_session_uniq;
CREATE UNIQUE INDEX IF NOT EXISTS pg_apps_stripe_session_uniq
  ON public.power_game_applications (stripe_session_id);
