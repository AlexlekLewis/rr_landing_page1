-- ═══ Family and child data: staff only (27 Nov 2026) ═══
--
-- The gap (found 29 Sep 2026): sign-up on this project is open and
-- auto-confirmed, and ~45 tables holding parents' and children's details had
-- policies that let ANY signed-in account read them (often update/delete too):
-- applications (742 rows, most under 18), every junior/holiday/open-day
-- registration table, enquiries, inductions, feedback, squad lists…
--
-- After this, those tables are readable/editable only by Academy staff:
--   • website dashboard users (is_dashboard_user), and
--   • ACTIVE Player DNA coaches/admins (user_is_coach_or_admin — active-only
--     since 27 Nov 2026, see the DNA repo's staff_access_active_only).
-- Public forms are unaffected: they only INSERT, and insert policies are not
-- touched. Server jobs use the service key and bypass all of this.
--
-- Also: three owner-rights views with family details are closed to browser
-- accounts, and check_duplicate_email (returned a player's name for any email,
-- even to visitors) is closed. offer_tokens / offer_responses are handled in
-- 20261127030100 after the offer pages move to their own functions.

create or replace function public.is_academy_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_dashboard_user() or public.user_is_coach_or_admin();
$$;
revoke all on function public.is_academy_staff() from public, anon;
grant execute on function public.is_academy_staff() to authenticated;

-- Replace every "any signed-in account" (or "anyone") read/update/delete/all
-- policy on these tables with a staff-only one for the same command.
do $$
declare
  r record;
  tables text[] := array[
    'academy_reviews', 'applications', 'archived_applications', 'coaches_day_registrations',
    'coaching_opportunities_applications', 'general_enquiries', 'hallam_junior_registrations',
    'hallam_open_day_registrations', 'holiday_camp_interest', 'holiday_clinic_registrations',
    'holiday_program_feedback', 'india_tour_2026_eoi', 'india_tour_2026_referrals', 'inquiries',
    'jr_term3_hallam', 'jr_term3_mickleham', 'jr_term3_williamstown', 'jr_term4_waitlist',
    'junior_royals_bundoora', 'junior_royals_hallam', 'junior_royals_july_holidays_registrations',
    'junior_royals_registrations', 'junior_royals_sept_holidays_registrations',
    'mickleham_junior_registrations', 'mickleham_open_day_registrations', 'onboarding_competition_history',
    'performance_squads_registrations', 'power_game_inquiries', 'private_coaching_eoi',
    'private_coaching_waitlist', 'program_feedback', 'program_inductions', 'program_registrations',
    'rsvp_responses', 'sp_coaches', 'sp_player_moves', 'sp_squad_players', 'upcoming_program_interest',
    'williamstown_junior_registrations', 'williamstown_open_day_registrations'];
  cmd_word text;
begin
  for r in
    select c.relname as tbl, p.polname, p.polcmd::text as cmd
    from pg_policy p join pg_class c on c.oid = p.polrelid
    where c.relnamespace = 'public'::regnamespace
      and c.relname = any (tables)
      and p.polcmd in ('r', 'w', 'd', '*')
      and not ('service_role'::regrole = any (p.polroles) and array_length(p.polroles, 1) = 1)
      and (pg_get_expr(p.polqual, p.polrelid) is null
           or pg_get_expr(p.polqual, p.polrelid) = 'true'
           or pg_get_expr(p.polqual, p.polrelid) ~* '^\(?auth\.role\(\) = ''(authenticated|anon)''::text\)?$'
           or pg_get_expr(p.polqual, p.polrelid) ~* '^\(?auth\.uid\(\) IS NOT NULL\)?$')
  loop
    cmd_word := case r.cmd when 'r' then 'select' when 'w' then 'update' when 'd' then 'delete' else 'all' end;
    execute format('drop policy %I on public.%I', r.polname, r.tbl);
    execute format('drop policy if exists %I on public.%I', 'staff ' || cmd_word, r.tbl);
    if r.cmd in ('w', '*') then
      execute format('create policy %I on public.%I for %s to authenticated using (public.is_academy_staff()) with check (public.is_academy_staff())',
                     'staff ' || cmd_word, r.tbl, cmd_word);
    else
      execute format('create policy %I on public.%I for %s to authenticated using (public.is_academy_staff())',
                     'staff ' || cmd_word, r.tbl, cmd_word);
    end if;
    raise notice 'staff-only: %.% (%)', r.tbl, r.polname, cmd_word;
  end loop;
end
$$;

-- Owner-rights views with family details: browser accounts can't read them.
-- unified_people_2026 is read only by api/refresh-unified-people (service key).
alter view public.unified_people_2026 set (security_invoker = true);
alter view public.v_rra_registration_events set (security_invoker = true);
alter view public.india_tour_2026_readiness set (security_invoker = true);
revoke all on public.unified_people_2026 from anon, authenticated;
revoke all on public.v_rra_registration_events from anon, authenticated;
revoke all on public.india_tour_2026_readiness from anon, authenticated;

-- Returned a player's name for any email address, to anyone. Not called by
-- either app.
revoke execute on function public.check_duplicate_email(text) from public, anon, authenticated;
