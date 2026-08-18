-- Power Game Masterclass registrations (Sept 6 & 13, 2026 — Cranbourne North)
-- Captures every registrant (paid or not) for follow-up.

create table if not exists public.masterclass_registrations (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),

    player_name text not null,
    email text not null,
    phone text not null,
    player_age text,
    club text,

    -- Payment tracking (updated manually / via webhook later)
    paid boolean not null default false,
    paid_at timestamptz,

    -- Attribution
    page_referrer text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    utm_content text,
    utm_term text,

    program_type text not null default 'power-game-masterclass-sept-2026'
);

alter table public.masterclass_registrations enable row level security;

-- Anonymous visitors can insert (register) but not read/update/delete
create policy "Allow anon insert masterclass registrations"
    on public.masterclass_registrations
    for insert
    to anon
    with check (true);
