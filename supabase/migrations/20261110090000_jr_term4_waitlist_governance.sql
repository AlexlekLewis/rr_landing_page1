-- ─────────────────────────────────────────────────────────────
-- Junior Royals: record the four governance boxes (Andy, 10 Nov 2026)
--
-- "make sure that this page, and all other pages where people are signing up and
-- paying for a program, that they are ticking our governance boxes … the same one we
-- use for holiday program/previous versions of junior royals."
--
-- Same four columns, names and meaning as `applications` and the holiday tables:
-- Terms & Conditions + Privacy Policy, Player Code of Conduct, Parent/Guardian Code of
-- Conduct, photo/video consent. The form (JRT3RegistrationForm.jsx) requires all four.
-- Additive, default false: entries made before 10 Nov 2026 were never asked and read false.
--
-- ORDER: apply BEFORE the form that writes these columns is deployed, or inserts fail.
-- ROLLBACK: alter table public.jr_term4_waitlist drop column accept_terms,
--           drop column accept_player_code, drop column accept_parent_code,
--           drop column accept_social_media;
-- ─────────────────────────────────────────────────────────────

alter table public.jr_term4_waitlist
  add column if not exists accept_terms boolean not null default false,
  add column if not exists accept_player_code boolean not null default false,
  add column if not exists accept_parent_code boolean not null default false,
  add column if not exists accept_social_media boolean not null default false;

comment on column public.jr_term4_waitlist.accept_terms is 'Agreed to the Terms & Conditions and Privacy Policy and confirmed the details are accurate. Required from 10 Nov 2026.';
comment on column public.jr_term4_waitlist.accept_player_code is 'Agreed to the Player Code of Conduct. Required from 10 Nov 2026.';
comment on column public.jr_term4_waitlist.accept_parent_code is 'Agreed to the Parent/Guardian Code of Conduct. Required from 10 Nov 2026.';
comment on column public.jr_term4_waitlist.accept_social_media is 'Agreed to photos and videos of the player being used on the Academy''s social media and marketing. Required from 10 Nov 2026.';
