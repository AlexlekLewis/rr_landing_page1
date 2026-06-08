-- ============================================================
-- Power Game booking system — centres, squads, applications, bookings.
-- Mirrors src/lib/booking/squads.ts (squad grid) and the InMemoryInventory
-- atomicity (pg_create_hold uses a per-squad advisory lock so concurrent
-- buyers can never oversell the last spot).
-- ============================================================

CREATE TABLE IF NOT EXISTS pg_centres (
  slug    TEXT PRIMARY KEY,
  name    TEXT NOT NULL,
  suburb  TEXT,
  address TEXT,
  active  BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS pg_squads (
  id          TEXT PRIMARY KEY,
  centre_slug TEXT NOT NULL REFERENCES pg_centres(slug),
  age_band    TEXT NOT NULL,                 -- '12-14' | '14-16' | '17+'
  stream      TEXT NOT NULL,                 -- 'performance' | 'pathway'
  day         TEXT NOT NULL,
  start_time  TEXT NOT NULL,
  end_time    TEXT NOT NULL,
  lanes       INT  NOT NULL,                 -- block lanes (ratio: 26 players / 7 lanes)
  capacity    INT  NOT NULL CHECK (capacity > 0), -- team = round(lanes × 13/7): 7→13, 5→9
  block_id    TEXT,                          -- two teams sharing a block_id = one 26-player squad
  block_label TEXT,
  sort_order  INT  DEFAULT 0,
  active      BOOLEAN DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS idx_pg_squads_lookup ON pg_squads (centre_slug, age_band, stream);

CREATE TABLE IF NOT EXISTS pg_applications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  player_name       TEXT,
  player_dob        DATE,
  gender            TEXT,
  parent_name       TEXT,
  contact_email     TEXT,
  contact_phone     TEXT,
  suburb            TEXT,
  centre_slug       TEXT REFERENCES pg_centres(slug),
  answers           JSONB,                   -- raw 7-question form input
  engine_version    TEXT,
  ability_tier      INT,
  stream            TEXT,
  home_band         TEXT,
  placed_band       TEXT,
  play_flag         TEXT,
  lane              TEXT,
  overall_score     NUMERIC,
  eligibility_status TEXT,
  requires_review   BOOLEAN DEFAULT FALSE,
  review_reasons    TEXT[] DEFAULT '{}',
  result            JSONB,                   -- full DnaResult + placement (audit)
  status            TEXT DEFAULT 'new'       -- 'new' | 'auto' | 'review' | 'booked'
);

CREATE TABLE IF NOT EXISTS pg_bookings (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  squad_id                  TEXT NOT NULL REFERENCES pg_squads(id),
  application_id            UUID REFERENCES pg_applications(id),
  status                    TEXT NOT NULL DEFAULT 'hold',  -- 'hold' | 'confirmed' | 'released'
  hold_expires_at           TIMESTAMPTZ,
  stripe_session_id         TEXT UNIQUE,
  stripe_payment_intent_id  TEXT,
  amount_total_cents        INT,
  paid_at                   TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_pg_bookings_squad ON pg_bookings (squad_id, status);

-- ── Capacity helpers ──
CREATE OR REPLACE FUNCTION pg_active_count(p_squad TEXT) RETURNS INT
LANGUAGE SQL STABLE AS $$
  SELECT COUNT(*)::INT FROM pg_bookings b
  WHERE b.squad_id = p_squad
    AND (b.status = 'confirmed' OR (b.status = 'hold' AND b.hold_expires_at > NOW()));
$$;

CREATE OR REPLACE FUNCTION pg_spots_left(p_squad TEXT) RETURNS INT
LANGUAGE SQL STABLE AS $$
  SELECT GREATEST(0, COALESCE((SELECT capacity FROM pg_squads WHERE id = p_squad), 0) - pg_active_count(p_squad));
$$;

-- ── Atomic hold: advisory lock per squad → check capacity → insert. Returns booking id or NULL if full. ──
CREATE OR REPLACE FUNCTION pg_create_hold(p_squad TEXT, p_application UUID, p_ttl_seconds INT DEFAULT 600)
RETURNS UUID
LANGUAGE plpgsql AS $$
DECLARE
  v_cap INT;
  v_active INT;
  v_id UUID;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(p_squad));   -- serialise concurrent buyers of this squad
  SELECT capacity INTO v_cap FROM pg_squads WHERE id = p_squad AND active;
  IF v_cap IS NULL THEN RETURN NULL; END IF;
  SELECT pg_active_count(p_squad) INTO v_active;
  IF v_active >= v_cap THEN RETURN NULL; END IF;
  INSERT INTO pg_bookings (squad_id, application_id, status, hold_expires_at)
  VALUES (p_squad, p_application, 'hold', NOW() + make_interval(secs => p_ttl_seconds))
  RETURNING id INTO v_id;
  RETURN v_id;
END; $$;

CREATE OR REPLACE FUNCTION pg_confirm_booking(p_booking UUID, p_session TEXT, p_pi TEXT, p_amount INT)
RETURNS BOOLEAN
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE pg_bookings SET
    status = 'confirmed', hold_expires_at = NULL,
    stripe_session_id = COALESCE(p_session, stripe_session_id),
    stripe_payment_intent_id = COALESCE(p_pi, stripe_payment_intent_id),
    amount_total_cents = COALESCE(p_amount, amount_total_cents),
    paid_at = NOW()
  WHERE id = p_booking AND status <> 'released';
  RETURN FOUND;
END; $$;

-- ── RLS ──
ALTER TABLE pg_centres      ENABLE ROW LEVEL SECURITY;
ALTER TABLE pg_squads       ENABLE ROW LEVEL SECURITY;
ALTER TABLE pg_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE pg_bookings     ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pg_centres_read"  ON pg_centres FOR SELECT USING (true);
CREATE POLICY "pg_squads_read"   ON pg_squads  FOR SELECT USING (true);
CREATE POLICY "pg_apps_insert"   ON pg_applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "pg_apps_admin"    ON pg_applications FOR SELECT TO authenticated USING (true);
-- bookings are created via the SECURITY-sensitive RPC; confirmation is service-role only (webhook).
CREATE POLICY "pg_bookings_admin" ON pg_bookings FOR SELECT TO authenticated USING (true);

-- ── Seed: 2 centres, 12 squads (mirror of squads.ts) ──
INSERT INTO pg_centres (slug, name, suburb, address) VALUES
  ('williamstown', 'The Netz', 'Williamstown', 'Williamstown VIC (address TBC)'),
  ('hallam', 'Elite Cricket Centre', 'Hallam', 'Hallam VIC (address TBC)')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO pg_squads (id, centre_slug, age_band, stream, day, start_time, end_time, lanes, capacity, block_id, block_label, sort_order) VALUES
  ('w-fri-perf-17',    'williamstown', '17+',   'performance', 'Friday',   '8:00pm',  '10:00pm', 5,  9,  'williamstown-Friday-8:00pm',    'Fri 8–10pm', 1),
  ('w-fri-perf-1416',  'williamstown', '14-16', 'performance', 'Friday',   '8:00pm',  '10:00pm', 5,  9,  'williamstown-Friday-8:00pm',    'Fri 8–10pm', 2),
  ('w-sat2-perf-1214', 'williamstown', '12-14', 'performance', 'Saturday', '2:00pm',  '4:00pm',  7,  13, 'williamstown-Saturday-2:00pm',  'Sat 2–4pm', 3),
  ('w-sat2-path-1214', 'williamstown', '12-14', 'pathway',     'Saturday', '2:00pm',  '4:00pm',  7,  13, 'williamstown-Saturday-2:00pm',  'Sat 2–4pm', 4),
  ('w-sat4-perf-1416', 'williamstown', '14-16', 'performance', 'Saturday', '4:00pm',  '6:00pm',  7,  13, 'williamstown-Saturday-4:00pm',  'Sat 4–6pm', 5),
  ('w-sat4-path-1416', 'williamstown', '14-16', 'pathway',     'Saturday', '4:00pm',  '6:00pm',  7,  13, 'williamstown-Saturday-4:00pm',  'Sat 4–6pm', 6),
  ('h-thu-perf-17',    'hallam', '17+',   'performance', 'Thursday', '8:00pm',  '10:00pm', 5,  9,  'hallam-Thursday-8:00pm',   'Thu 8–10pm', 1),
  ('h-thu-perf-1416',  'hallam', '14-16', 'performance', 'Thursday', '8:00pm',  '10:00pm', 5,  9,  'hallam-Thursday-8:00pm',   'Thu 8–10pm', 2),
  ('h-sat12-perf-1214','hallam', '12-14', 'performance', 'Saturday', '12:00pm', '2:00pm',  5,  9,  'hallam-Saturday-12:00pm',  'Sat 12–2pm', 3),
  ('h-sat12-path-1214','hallam', '12-14', 'pathway',     'Saturday', '12:00pm', '2:00pm',  5,  9,  'hallam-Saturday-12:00pm',  'Sat 12–2pm', 4),
  ('h-sat2-perf-1416', 'hallam', '14-16', 'performance', 'Saturday', '2:00pm',  '4:00pm',  5,  9,  'hallam-Saturday-2:00pm',   'Sat 2–4pm', 5),
  ('h-sat2-path-1416', 'hallam', '14-16', 'pathway',     'Saturday', '2:00pm',  '4:00pm',  5,  9,  'hallam-Saturday-2:00pm',   'Sat 2–4pm', 6)
ON CONFLICT (id) DO NOTHING;

DO $$
DECLARE v_squads INT; v_total INT;
BEGIN
  SELECT COUNT(*), COALESCE(SUM(capacity),0) INTO v_squads, v_total FROM pg_squads;
  IF v_squads <> 12 THEN RAISE EXCEPTION 'expected 12 pg_squads, found %', v_squads; END IF;
  IF v_total <> 124 THEN RAISE EXCEPTION 'expected 124 total spots, found %', v_total; END IF;
END $$;
