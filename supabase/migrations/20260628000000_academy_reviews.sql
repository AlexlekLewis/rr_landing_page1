-- Academy Reviews — moderated testimonial wall for rramelbourne.com (/reviews).
--
-- Trust model: reviews are submitted publicly (via the /api/reviews POST serverless
-- function, service-role) and land as status='pending'. Nothing is shown on the public
-- wall until an admin approves it in /rramadmin_26/reviews. The public wall reads ONLY
-- approved rows, and ONLY through the same serverless function (safe display columns),
-- so reviewer contact details (email/ip_hash) are never exposed to anon clients.
--
-- RLS posture (matches this project's locked-down convention):
--   * NO anon policies        -> anon key cannot read or write this table at all.
--   * authenticated full CRUD -> the admin dashboard (Supabase Auth + dashboard_users) moderates.
--   * service_role            -> bypasses RLS; used by /api/reviews for public submit + public read.
CREATE TABLE IF NOT EXISTS public.academy_reviews (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  reviewer_name   text NOT NULL,
  reviewer_role   text,                       -- 'Parent', 'Player', 'Coach', etc. (free text, optional)
  program         text,                       -- which program/centre the review is about (optional)
  rating          smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title           text,
  body            text NOT NULL,
  status          text NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'approved', 'rejected')),
  featured        boolean NOT NULL DEFAULT false,   -- pin to top of the wall
  consent_publish boolean NOT NULL DEFAULT false,   -- reviewer ticked "publish my first name + review"
  -- Admin-only / never displayed publicly:
  reviewer_email  text,                        -- optional follow-up contact
  suburb          text,
  ip_hash         text,                        -- coarse abuse signal (sha-256 of ip, set server-side)
  moderated_at    timestamptz,
  moderated_by    text,
  admin_notes     text,
  -- Attribution:
  source          text DEFAULT 'web',
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  page_referrer   text
);

CREATE INDEX IF NOT EXISTS idx_academy_reviews_status_created
  ON public.academy_reviews (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_academy_reviews_featured
  ON public.academy_reviews (featured) WHERE status = 'approved';

ALTER TABLE public.academy_reviews ENABLE ROW LEVEL SECURITY;

-- Admin (any authenticated dashboard user) can read + moderate everything.
DROP POLICY IF EXISTS "reviews_authenticated_select" ON public.academy_reviews;
CREATE POLICY "reviews_authenticated_select" ON public.academy_reviews
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "reviews_authenticated_update" ON public.academy_reviews;
CREATE POLICY "reviews_authenticated_update" ON public.academy_reviews
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "reviews_authenticated_delete" ON public.academy_reviews;
CREATE POLICY "reviews_authenticated_delete" ON public.academy_reviews
  FOR DELETE TO authenticated USING (true);

-- Intentionally NO anon INSERT/SELECT policy: public submit + public read both go through
-- the service-role /api/reviews function so we control validation and which columns leak.

COMMENT ON TABLE public.academy_reviews IS
  'Moderated testimonial wall for /reviews. Public submit + public (approved) read both via the service-role /api/reviews function. Admin moderates in /rramadmin_26/reviews. anon has no direct access.';
