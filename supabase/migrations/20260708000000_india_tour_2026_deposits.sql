-- India Tour Sept 2026 deposit submissions ($2,000 + GST = $2,200 AUD).
-- Written server-side (service role) by /api/india-tour-deposit-checkout;
-- marked paid by /api/india-tour-deposit-verify. RLS on, no anon policies —
-- same locked-down posture as india_tour_2026_travellers.

create table if not exists public.india_tour_2026_deposits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'pending_payment',            -- pending_payment | paid | cancelled
  source text not null default 'india-tour-deposit',
  key_used text,
  -- registrant (person paying / booking)
  registrant_name text,
  email text,
  mobile text,
  -- traveller / player
  player_name text,
  player_dob date,
  player_age integer,
  current_club text,
  traveller_count integer,
  accompanying text,
  notes text,
  -- consent
  consent_terms boolean not null default false,
  consent_terms_at timestamptz,
  -- money (server-authoritative): $2,000 deposit + $200 GST = $2,200 AUD
  currency text not null default 'aud',
  amount_cents integer not null default 220000,
  gst_cents integer not null default 20000,
  amount_paid_cents integer,
  -- stripe
  stripe_session_id text,
  stripe_payment_intent text,
  paid_at timestamptz,
  -- attribution
  page_referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text
);

create index if not exists idx_india_deposits_session on public.india_tour_2026_deposits (stripe_session_id);
create index if not exists idx_india_deposits_status  on public.india_tour_2026_deposits (status);
create index if not exists idx_india_deposits_email   on public.india_tour_2026_deposits (email);

alter table public.india_tour_2026_deposits enable row level security;

comment on table public.india_tour_2026_deposits is
  'India Tour Sept 2026 deposit submissions ($2,000 + GST = $2,200 AUD). Written server-side (service role) by /api/india-tour-deposit-checkout; marked paid by /api/india-tour-deposit-verify. RLS on, no anon policies.';
