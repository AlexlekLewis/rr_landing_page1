-- APPLIED TO PRODUCTION 25 Aug 2026. Recorded here after the fact so the repo
-- matches the live database — without this file a rebuild from migrations
-- silently reintroduces the bug.
--
-- The masterclass form was changed to collect PARENT contact details
-- (parent_name / parent_email / parent_phone) and stopped writing the original
-- email and phone columns. Those columns were still NOT NULL, so EVERY
-- submission failed with 23502 and the registrant saw "Something went wrong."
--
-- The columns are now orphaned. Drop the constraint so the form can save; keep
-- the columns so historical rows and the sheet sync's legacy fallback survive.
alter table public.masterclass_registrations
  alter column email drop not null,
  alter column phone drop not null;
