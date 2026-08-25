-- APPLIED TO PRODUCTION 25 Aug 2026. Recorded here after the fact.
--
-- Same fault as masterclass_registrations: an INSERT policy naming only `anon`
-- meant any signed-in visitor was rejected 42501. Entries kept arriving from
-- logged-out members of the public, so nothing looked wrong.
--
-- Grants INSERT to `authenticated` as well. No read/update/delete rights added.
drop policy if exists "Allow anon insert performance squad leads"
  on public.performance_squad_leads;
drop policy if exists "Allow public insert performance squad leads"
  on public.performance_squad_leads;
create policy "Allow public insert performance squad leads"
  on public.performance_squad_leads
  for insert to anon, authenticated
  with check (true);

drop policy if exists "allow_public_insert"
  on public.junior_royals_sept_holidays_registrations;
create policy "allow_public_insert"
  on public.junior_royals_sept_holidays_registrations
  for insert to anon, authenticated
  with check (true);
