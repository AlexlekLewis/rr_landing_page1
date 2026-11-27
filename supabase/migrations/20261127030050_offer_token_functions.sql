-- Offer pages (/offer/:token) without table-wide access (27 Nov 2026).
--
-- The public offer page used to read offer_tokens directly and the RSVP form
-- updated it directly, which needed policies letting ANYONE read every token
-- (with applicant emails) and update any of them. These two functions do
-- exactly what the page needs for the one token in its link, nothing more.
-- Tokens are random UUIDs, so knowing one is the permission.
-- The table-wide policies are removed in 20261127030100, after the pages
-- switch to these functions.

create or replace function public.get_offer_by_token(p_token text)
returns setof public.offer_tokens
language sql stable security definer set search_path = public as $$
  select * from public.offer_tokens
  where token::text = lower(trim(coalesce(p_token, '')))
  limit 1
$$;
revoke all on function public.get_offer_by_token(text) from public;
grant execute on function public.get_offer_by_token(text) to anon, authenticated;

create or replace function public.set_offer_token_status(p_token text, p_status text)
returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if p_status not in ('attended', 'declined') then
    raise exception 'Invalid status' using errcode = '22023';
  end if;
  update public.offer_tokens
     set status = p_status, responded_at = now()
   where token::text = lower(trim(coalesce(p_token, '')));
  return found;
end
$$;
revoke all on function public.set_offer_token_status(text, text) from public;
grant execute on function public.set_offer_token_status(text, text) to anon, authenticated;
