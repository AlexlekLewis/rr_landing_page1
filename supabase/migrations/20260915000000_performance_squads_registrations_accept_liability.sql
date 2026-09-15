-- Performance Squad welcome page: records that the family acknowledged the player
-- trains and plays matches at their own risk (Terms & Conditions clause 7).
-- Additive with default false; same column name the open-day registration tables use.
-- Applied to rraa-landing (pudldzgmluwoocwxtzhw) on 15 Sep 2026.
alter table public.performance_squads_registrations
  add column if not exists accept_liability boolean not null default false;

comment on column public.performance_squads_registrations.accept_liability is
  'Acknowledged the player trains and plays matches at their own risk (Terms & Conditions clause 7). Set by /performance-squads/welcome.';
