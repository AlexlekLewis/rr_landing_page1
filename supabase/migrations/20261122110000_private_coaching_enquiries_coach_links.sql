-- Royals Private Coaching, coach-led flow (Andy, 22 Nov 2026: "replicate how the cash
-- coach economy works … simple and coach led").
--
--  1. A family reads a coach's own page (/private-coaching-<coach>) and taps Book Now.
--  2. They leave basic details → a row here. The page then shows the coach's contact
--     details, and the coach gets an email (and a text, once Twilio is set up).
--  3. The coach agrees the times with the family and the centre, then, in their own
--     coach page (secret link), records the sessions → a premium_private_coaching_requests
--     row with created_by = 'coach' → a pay link they send the family.
--  4. The family opens the pay link: player details, training shirt, the four governance
--     boxes, then pays by Stripe. The coach is told it's paid.
--
-- Enquiries hold contact details, so RLS is on with no policies: only the API (service
-- role) writes and reads them.

create table if not exists public.private_coaching_enquiries (
    id              uuid primary key default gen_random_uuid(),
    created_at      timestamptz not null default now(),
    coach_slug      text not null,
    parent_name     text not null,
    player_name     text,                 -- only if different from the parent
    email           text not null,
    phone           text not null,
    suburb          text not null,
    status          text not null default 'new' check (status in ('new', 'contacted', 'booked', 'closed')),
    coach_notified_at timestamptz,
    utm_source text, utm_medium text, utm_campaign text, utm_content text,
    page_referrer   text
);
create index if not exists private_coaching_enquiries_coach on public.private_coaching_enquiries (coach_slug, created_at desc);
alter table public.private_coaching_enquiries enable row level security;

-- Bookings the coach records for a family (the pay link).
alter table public.premium_private_coaching_requests
    add column if not exists created_by  text not null default 'family' check (created_by in ('family', 'coach')),
    add column if not exists enquiry_id  uuid references public.private_coaching_enquiries(id),
    add column if not exists pay_expires_at timestamptz;

-- Training partner sessions the coach arranges can be paid one of two ways (Andy, 22 Nov
-- 2026): one family pays all (pay_share 1; the partner family completes the partner form),
-- or each family pays half (pay_share 2): two rows, each with its own pay link, governance
-- boxes and shirt, linked by linked_booking_id. Sessions and payouts hang off the first row.
alter table public.premium_private_coaching_requests
    add column if not exists pay_share smallint not null default 1 check (pay_share in (1, 2)),
    add column if not exists linked_booking_id uuid references public.premium_private_coaching_requests(id);

-- The public form can only ever create a family's own booking.
drop policy if exists "public insert" on public.premium_private_coaching_requests;
create policy "public insert" on public.premium_private_coaching_requests for insert to anon, authenticated
    with check ((status = 'new') and (staff_notes is null) and (payment_status = any (array['request', 'sent_to_stripe']))
        and (created_by = 'family') and (enquiry_id is null) and (pay_share = 1) and (linked_booking_id is null));

-- What the family is after (Andy, 22 Nov 2026): 1-to-1, a training partner session, or not sure.
alter table public.private_coaching_enquiries
    add column if not exists format_pref text check (format_pref is null or format_pref in ('1-1', '1-2', 'not-sure'));
