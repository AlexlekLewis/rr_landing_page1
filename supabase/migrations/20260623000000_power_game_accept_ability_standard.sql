-- Open-program guardrail (23 Jun 2026): the Power Game funnel is now open to any
-- player aged 12–26 with no rep/ability gate. The sole guardrail is an acknowledgment
-- checkbox — the applicant confirms they understand that if they aren't at VMCU-or-higher
-- representative standard, the coaches may move them to a more suitable session within the
-- program, or recommend another Royals program better matched to their development.
-- Stored alongside the other compliance columns and synced to the Google Sheet.
ALTER TABLE public.power_game_applications
  ADD COLUMN IF NOT EXISTS accept_ability_standard boolean NOT NULL DEFAULT false;
