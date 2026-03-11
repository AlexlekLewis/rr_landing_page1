-- upcoming_program_interest: visitors interested in future programs
CREATE TABLE IF NOT EXISTS upcoming_program_interest (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  age_group text,
  skill_level text,
  postcode text,
  gender_preference text,
  questions text,
  utm_source text,
  page_referrer text
);

-- general_enquiries: visitors wanting more info
CREATE TABLE IF NOT EXISTS general_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  age_group text,
  skill_level text,
  postcode text,
  gender_preference text,
  looking_for text,
  utm_source text,
  page_referrer text
);

-- programs config: drives program cards + urgency badges on homepage & program pages
CREATE TABLE IF NOT EXISTS programs_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  program_id text UNIQUE NOT NULL,
  name text NOT NULL,
  route text NOT NULL,
  description text,
  image_url text,
  is_active boolean DEFAULT true,
  urgency_type text, -- 'closing_soon' | 'limited_places' | 'spots_remaining' | 'open' | 'waitlist' | 'coming_soon'
  urgency_text text,
  spots_remaining integer,
  age_groups text[], -- e.g. ['U14','U16','U18','Adult']
  skill_levels text[], -- e.g. ['Intermediate','Advanced','Elite']
  gender text, -- 'male' | 'female' | 'mixed'
  postcode_areas text[], -- suburbs / areas served
  sort_order integer DEFAULT 0
);

-- Seed with current programs
INSERT INTO programs_config (program_id, name, route, description, image_url, is_active, urgency_type, urgency_text, spots_remaining, age_groups, skill_levels, gender, sort_order)
VALUES
  ('elite-program-2026', 'Elite Program 2026', '/eliteprogram2026', 'The flagship RRA program. 12 weeks of intensive T20 coaching, biomechanics analysis, and performance mentoring from Royals coaches.', '/assets/hero-celebration-new.jpg', true, 'limited_places', 'Limited Places Remaining', 12, ARRAY['U16','U18','Adult'], ARRAY['Advanced','Elite'], 'mixed', 1),
  ('holiday-programs', 'Holiday Programs', '/holiday-programs', '3-day holiday clinics delivered by Royals-trained coaches at top Melbourne facilities. Open to all ages and skill levels.', '/assets/cec-lanes.jpg', true, 'closing_soon', 'Registration Closing Soon', null, ARRAY['U10','U12','U14','U16'], ARRAY['Beginner','Intermediate','Advanced'], 'mixed', 2)
ON CONFLICT (program_id) DO NOTHING;
