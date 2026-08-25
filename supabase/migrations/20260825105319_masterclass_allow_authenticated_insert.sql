-- APPLIED TO PRODUCTION 25 Aug 2026. Recorded here after the fact.
--
-- supabase-js sends a signed-in visitor's session JWT as the Authorization
-- bearer, so PostgREST runs the insert as role `authenticated`, not `anon`.
-- The table's only policy named `anon`, so any signed-in visitor (staff,
-- coaches, or a parent who had ever logged in on that browser) had NO
-- applicable INSERT policy and was rejected 42501 -> "Something went wrong."
-- Logged-out visitors were unaffected, which is why the failure stayed hidden.
drop policy if exists "Allow anon insert masterclass registrations"
  on public.masterclass_registrations;
drop policy if exists "Allow public insert masterclass registrations"
  on public.masterclass_registrations;

create policy "Allow public insert masterclass registrations"
  on public.masterclass_registrations
  for insert to anon, authenticated
  with check (true);
