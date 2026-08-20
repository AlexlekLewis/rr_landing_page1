-- Performance Squads — trial/invite registrations (/performance-squads)
-- Hidden page (noindex, unlinked) — direct-URL traffic only for now.
-- Captures every registrant for follow-up; payment handled via Stripe
-- payment links (trial / games / training) tracked separately.

create table if not exists public.performance_squad_leads (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),

    player_name text not null,
    player_age text,
    parent_name text,
    email text not null,
    phone text not null,
    club text,

    -- north-melbourne | south-east-melbourne (west/east reserved for future)
    preferred_centre text not null,
    -- trial | invited
    entry_type text not null default 'trial',
    invite_code text,
    playing_role text,

    -- Attribution
    page_referrer text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    utm_content text,
    utm_term text,

    program_type text not null default 'performance-squads-2026'
);

alter table public.performance_squad_leads enable row level security;

-- Anonymous visitors can insert (register) but not read/update/delete
create policy "Allow anon insert performance squad leads"
    on public.performance_squad_leads
    for insert
    to anon
    with check (true);
