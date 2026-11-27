-- offer_tokens / offer_responses: staff only (27 Nov 2026).
-- Apply AFTER the offer pages use get_offer_by_token / set_offer_token_status
-- (20261127030050 + the OfferResponsePage / RSVPForm change).
--
-- Removes: anyone could read every offer token (with applicant emails) and
-- every response, and update any token's status; any signed-in account had
-- full access. Keeps: the public RSVP form can still INSERT a response.

drop policy if exists "Public can read tokens" on public.offer_tokens;
drop policy if exists "Allow public select by token" on public.offer_tokens;
drop policy if exists "Public can update token status" on public.offer_tokens;
drop policy if exists "Admins have full access to offer_tokens" on public.offer_tokens;
drop policy if exists "staff all" on public.offer_tokens;
create policy "staff all" on public.offer_tokens
  for all to authenticated using (public.is_academy_staff()) with check (public.is_academy_staff());

drop policy if exists "Allow public select responses" on public.offer_responses;
drop policy if exists "Admins have full access to offer_responses" on public.offer_responses;
drop policy if exists "staff all" on public.offer_responses;
create policy "staff all" on public.offer_responses
  for all to authenticated using (public.is_academy_staff()) with check (public.is_academy_staff());
