-- ─────────────────────────────────────────────────────────────
-- Invitation list registrations (Andy, 17 Nov 2026)
--
-- ONE table for every "invitation-style" campaign page: a short page shared on
-- social media where a family registers their details to go on an invitation
-- list, and the Academy gets in touch only if there is a place.
--
-- The `campaign` column says which page the row came from. The first campaign is
-- 'ravenhall-opening-session' (rramelbourne.com/ravenhall): the exclusive opening
-- session of the Rajasthan Royals Academy in Ravenhall, Melbourne's West.
-- Campaigns are configured in src/components/invitation/invitations.js.
--
-- One row = one player put forward for one invitation list. A parent who puts
-- forward two children makes two rows with the same submission_id and the same
-- contact details.
--
-- A row is NOT a place. No payment is taken. Staff decide who is invited (space,
-- then how close the family lives to the venue, then whether the player suits a
-- coaching session) and record it in `status`.
-- ─────────────────────────────────────────────────────────────

create table if not exists public.invitation_list_registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  campaign text not null,                          -- which invitation page, e.g. 'ravenhall-opening-session'
  submission_id uuid not null,                     -- same for every player sent in one form
  -- who will attend
  attendee_type text not null,                     -- 'self' = the person filling in the form | 'child' = their child
  player_first_name text not null,
  player_last_name  text not null,
  player_dob date not null,
  player_gender text,
  cricket_experience text,                         -- 'new' | 'social' | 'club' | 'representative'
  club_name text,
  -- who we contact (the parent/guardian for a child, the player for 'self')
  contact_name text not null,
  email text not null,
  phone text not null,
  -- where they live (invitations depend on distance from the venue)
  lives_in_australia boolean not null,
  lives_in_melbourne boolean,                      -- null when lives_in_australia is false
  country text not null default 'Australia',
  street_address text,                             -- optional on the form
  suburb text not null,                            -- suburb, or town/city if overseas
  postcode text,
  -- consent
  accept_terms boolean not null default false,
  marketing_opt_in boolean not null default false,
  notes text,
  -- staff use: never set by the form
  status text not null default 'registered',       -- 'registered' | 'invited' | 'confirmed' | 'declined' | 'not-invited'
  invited_at timestamptz,
  staff_notes text,
  -- attribution
  utm_source text, utm_medium text, utm_campaign text, utm_content text, page_referrer text
);

comment on table public.invitation_list_registrations is
  'Invitation lists for campaign pages (first: Ravenhall opening session, rramelbourne.com/ravenhall). '
  'One row = one player put forward for one invitation list; `campaign` says which page. A row is NOT a '
  'place and no payment is taken: staff invite based on space and distance from the venue, and record '
  'the outcome in `status`. Players sent in one form share submission_id. '
  'Synced to Google Sheet "RRA - Program Sign-Ups", one tab per campaign ("Ravenhall Invitation List - DO NOT EDIT"), every 10 min by api/sync-program-signups.js. Campaigns are configured in '
  'src/components/invitation/invitations.js.';
comment on column public.invitation_list_registrations.campaign is
  'Which invitation page the row came from. Matches the slug in src/components/invitation/invitations.js.';
comment on column public.invitation_list_registrations.attendee_type is
  'self = the person who filled in the form is the player; child = a parent/guardian registered their child.';
comment on column public.invitation_list_registrations.cricket_experience is
  'new = has not played before; social = school, backyard or social cricket; club = plays for a club; representative = representative or Premier level.';
comment on column public.invitation_list_registrations.contact_name is
  'The person we email or call: the parent/guardian for a child, the player themself when attendee_type = self.';
comment on column public.invitation_list_registrations.status is
  'Set by staff. registered = on the list, no decision yet; invited = invitation sent; confirmed = accepted; declined = family said no; not-invited = no place this time.';

create index if not exists invitation_list_campaign_created_idx
  on public.invitation_list_registrations (campaign, created_at desc);
create index if not exists invitation_list_email_idx
  on public.invitation_list_registrations (email);

-- ── RLS: the public form can INSERT. Nobody outside the service role can read,
-- update or delete. The form can never set the staff columns.
alter table public.invitation_list_registrations enable row level security;
drop policy if exists "public insert" on public.invitation_list_registrations;
create policy "public insert" on public.invitation_list_registrations
  for insert to anon, authenticated
  with check (status = 'registered' and invited_at is null and staff_notes is null);
