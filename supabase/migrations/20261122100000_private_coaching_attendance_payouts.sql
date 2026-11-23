-- Royals Private Coaching: attendance check-in and payout release (Andy, 22 Nov 2026).
--
-- The family pays the whole booking upfront (Stripe Checkout, as before). Each paid
-- booking becomes one row per session. After a session the coach opens their private
-- check-in link and ticks "Turned up"; that releases the session's payouts:
--   * the coach's pay for that session, and
--   * the venue's lane hire (Elite Cricket Centre for Cranbourne North / Hallam),
-- each as a Stripe Connect transfer to the payee's own Stripe account when it is
-- connected (otherwise the payout waits as 'pending' until it is). The Academy keeps
-- the rest. "No-show" releases nothing and is flagged for the Academy to decide.
--
-- Amounts live ONLY in private_coaching_payout_rates (service role only). They are
-- never written into the repo, which is public: rows are added with SQL by the Academy.
-- All four tables have RLS on and no policies: only the API (service role) reads them.

alter table public.premium_private_coaching_requests
    add column if not exists stripe_payment_intent text;

-- Who gets paid: coaches and venues.
create table if not exists public.private_coaching_payees (
    slug               text primary key,                 -- 'alex-thornhill', 'elite-cricket-centre'
    kind               text not null check (kind in ('coach', 'venue')),
    name               text not null,
    stripe_account_id  text,                             -- acct_… once connected
    checkin_token      text unique,                      -- coaches: secret for their check-in link
    active             boolean not null default true,
    created_at         timestamptz not null default now()
);

-- What each payee gets per attended session. A rule matches a session when every
-- non-null field (coach_slug, centre, format) equals the session's.
create table if not exists public.private_coaching_payout_rates (
    id            uuid primary key default gen_random_uuid(),
    payee_slug    text not null references public.private_coaching_payees(slug),
    coach_slug    text,
    centre        text,
    format        text check (format is null or format in ('1-1', '1-2')),
    amount_cents  integer not null check (amount_cents >= 0),
    active        boolean not null default true,
    note          text,
    created_at    timestamptz not null default now()
);

-- One row per session in a paid booking.
create table if not exists public.private_coaching_sessions (
    id            uuid primary key default gen_random_uuid(),
    booking_id    uuid not null references public.premium_private_coaching_requests(id) on delete cascade,
    seq           smallint not null,                     -- 1..package_sessions
    coach_slug    text not null,
    centre        text not null,
    format        text not null,
    session_date  date,                                  -- null until the coach sets the time
    start_time    time,
    status        text not null default 'scheduled' check (status in ('scheduled', 'attended', 'no_show')),
    marked_at     timestamptz,
    created_at    timestamptz not null default now(),
    unique (booking_id, seq)
);
create index if not exists private_coaching_sessions_coach on public.private_coaching_sessions (coach_slug, status);

-- One row per payee per attended session.
create table if not exists public.private_coaching_payouts (
    id                  uuid primary key default gen_random_uuid(),
    session_id          uuid not null references public.private_coaching_sessions(id) on delete cascade,
    payee_slug          text not null references public.private_coaching_payees(slug),
    amount_cents        integer not null,
    status              text not null default 'pending' check (status in ('pending', 'transferred', 'failed')),
    stripe_transfer_id  text,
    error               text,
    created_at          timestamptz not null default now(),
    transferred_at      timestamptz,
    unique (session_id, payee_slug)
);

alter table public.private_coaching_payees       enable row level security;
alter table public.private_coaching_payout_rates enable row level security;
alter table public.private_coaching_sessions     enable row level security;
alter table public.private_coaching_payouts      enable row level security;
