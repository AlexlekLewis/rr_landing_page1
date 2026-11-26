-- ─────────────────────────────────────────────────────────────
-- Lower Plenty Junior Royals Day: CANCELLED (Alex, 23 Oct 2026), so take its
-- card off the home page.
--
-- The home page's "Find your program" cards are the rows of programs_config
-- where is_active = true (HomeProgramCards.jsx). This row was the first card,
-- with a "View Program" button. One row, matched by its exact program_id.
-- Nothing is deleted: the row stays, switched off.
--
-- ROLLBACK (puts the card back):
--   update public.programs_config set is_active = true
--    where program_id = 'lower-plenty-junior-royals-day-2026';
-- ─────────────────────────────────────────────────────────────

update public.programs_config
   set is_active = false
 where program_id = 'lower-plenty-junior-royals-day-2026'
   and is_active = true;
