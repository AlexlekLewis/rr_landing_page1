-- India Tour — close the anonymous upload door on the passport bucket.
-- ALREADY APPLIED to the landing project (pudldzgmluwoocwxtzhw) on 27 Sep 2026, with
-- Alex's approval, as migration `drop_india_tour_anon_upload_policy`. Kept here as the record.
--
-- The open intake form (public/india-tour-intake.html, now 410) uploaded passport scans
-- straight into the private `india-tour-passports` bucket with the public anon key. The
-- form was switched off on 7 Aug 2026, but this policy still let anyone holding the anon
-- key upload files there. The bucket held only an 8-byte `_canary` test file at the time.
-- Dashboard read/delete policies are untouched.
drop policy if exists india_tour_anon_upload on storage.objects;

-- Rollback (only if an open upload path is ever deliberately rebuilt):
-- create policy india_tour_anon_upload on storage.objects
--   for insert to anon with check (bucket_id = 'india-tour-passports');
