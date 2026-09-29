-- India Tour — record which upcoming tour(s) a family registers interest in.
-- ALREADY APPLIED to the landing project on 29 Sep 2026 as migration
-- `applications_add_tour_interest` (version 20260929114813). Kept here as the record.
--
-- The /tours form (src/components/india-tour-2026/ITForm.jsx) now asks families to
-- pick one or both of the two upcoming tours. It stores the ids of the tours they
-- ticked here, in the order they appear on the page:
--   '2026-12-late-dec-jan'  late December 2026 to early January 2027
--   '2027-04-april'         April 2027
-- The same choice is also written as a readable "Tours:" line in `bio`.
--
-- Additive and nullable: existing rows, and every other form that writes to this
-- table, leave it NULL.
alter table public.applications
  add column if not exists tour_interest text[];

comment on column public.applications.tour_interest is
  'India Tour expressions of interest (source = india-tour-eoi): the upcoming tour(s) the family ticked, as tour ids. 2026-12-late-dec-jan = late December 2026 to early January 2027; 2027-04-april = April 2027. NULL for every other form.';

-- Rollback (only while no real answers have been captured, because it deletes them):
-- alter table public.applications drop column if exists tour_interest;
