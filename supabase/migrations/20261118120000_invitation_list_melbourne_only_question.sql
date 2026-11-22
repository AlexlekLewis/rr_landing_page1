-- Invitation list: the form now asks one location question, "Do you live in
-- Melbourne?" (Andy, 18 Nov 2026), not "Do you live in Australia?" first.
-- Applied to production 18 Nov 2026, before the form change was deployed.
alter table public.invitation_list_registrations alter column lives_in_australia drop not null;
alter table public.invitation_list_registrations alter column country drop not null;
alter table public.invitation_list_registrations alter column country drop default;
comment on column public.invitation_list_registrations.lives_in_melbourne is
  'The form asks one question: "Do you live in Melbourne?" (Andy, 18 Nov 2026). true = yes, false = no.';
comment on column public.invitation_list_registrations.lives_in_australia is
  'No longer asked (18 Nov 2026). true when lives_in_melbourne is true, otherwise null.';
comment on column public.invitation_list_registrations.country is
  'Only for families who do not live in Melbourne: the state or country they typed. Null for Melbourne families.';
