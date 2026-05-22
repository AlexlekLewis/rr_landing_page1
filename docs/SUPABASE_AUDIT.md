# Supabase Database Audit — `rraa-landing`

**Project**: `pudldzgmluwoocwxtzhw` ("rraa-landing", `us-west-1`, Postgres 17)
**Audit date**: 2026-05-22
**Branch**: `claude/supabase-structure-audit-l8GAw`

This is a **schema-only, high-level** audit of the entire public schema. One Supabase project hosts everything: the public landing pages, the internal academy app (`DNAProfileApp`), the CRM, the Stripe-driven shop & program registrations, the T20 stats warehouse, the session planner, the fitness program, and the India Tour ops dashboard.

---

## 1. Top-line numbers

| Item | Count |
|---|---|
| Tables (incl. backups) | 144 |
| Views | 5 |
| Edge Functions | 17 |
| Domains/subsystems | ~16 |
| Total rows in `page_analytics` alone | 171,149 (88 MB) |
| Total rows in `t20_deliveries` | 277,720 (70 MB) |

**Largest tables by disk:** `page_analytics` (88 MB) · `t20_deliveries` (70 MB) · `t20_batting_innings` (5.6 MB) · `t20_bowling_spells` (4.5 MB) · `t20_match_aggregates` (950 KB) · `t20_matches` (885 KB) · `t20_innings` (827 KB) · `applications` (696 KB) · `players` (655 KB) · `program_registrations` (630 KB) · `analytics_events` (614 KB).

Column type marker used below: `colname:type!` means `NOT NULL`; absence of `!` means nullable.

---

## 2. Security flags

### 2.1 RLS disabled (10 tables — Supabase advisory level: CRITICAL)

These are all backups; they're readable/writable with the `anon` key:

| Table | Rows |
|---|---|
| `_bk_dedupe_coach_assess_20260507` | 2 |
| `_bk_dedupe_comp_grades_20260507` | 7 |
| `_bk_dedupe_fit_enrol_20260507` | 2 |
| `_bk_dedupe_players_20260507` | 4 |
| `_bk_dedupe_program_members_20260507` | 6 |
| `_bk_dedupe_rep_alloc_20260507` | 3 |
| `_bk_dedupe_user_profiles_20260507` | 4 |
| `players_session_backup_20260505_roster` | 104 |
| `sp_players_backup_20260505_roster` | 85 |
| `sp_squad_players_backup_20260505_roster` | 176 |

Recommendation: drop these as part of restructure, or enable RLS and lock to `service_role`-only policies.

### 2.2 Other backups (RLS enabled but probably dead)

`coach_assessments_backup_20260419` (6), `sp_coach_availability_backup_20260505` (0), `sp_session_coaches_backup_20260505` (140), `sp_squad_players_backup_20260420` (2), `sp_squad_players_backup_20260421` (168).

---

## 3. Domain map (the whole picture in one place)

```
PUBLIC FORMS / LEADS                INTERNAL ACADEMY APP                          STRIPE / SHOP
─────────────────────────           ───────────────────────────                   ─────────────────────────
applications  ───►  pipeline_*      players (canonical) ◄── user_profiles         program_registrations
inquiries           crm_leads       │  program_members                            shop_orders_training
rsvp_responses      crm_*           │  competition_grades                         shop_orders_ipl
general_enquiries                   ├─ coach_assessments (legacy)                 shop_orders (empty/dead)
upcoming_program_interest           ├─ coach_assessment_items (Phase 1)           academy_member_subsidies
elite_2026_waitlist                 │  └─ assessment_item_definitions             reclassification_audit
  └─ onboarding_competition_history │  assessment_history                         offer_tokens ──► offer_responses
holiday_clinic_registrations        ├─ report_coach_allocation
female_kickstart_2026               ├─ idp_goals/focus_areas/notes
junior_royals_registrations         ├─ idp_specialist_assessments                 ANALYTICS
junior_royals_bundoora              ├─ player_performance_metrics                 ─────────────────────────
junior_royals_hallam                ├─ brock_string_assessments                   page_analytics  (88 MB)
coaching_opportunities_applications ├─ batting_reports                            page_views
                                    ├─ bowling_reports                            analytics_events
SESSION PLANNER (sp_*)              ├─ player_scores
─────────────────────────           ├─ player_communications                      EXTERNAL DATA
sp_programs / sp_phases             └─ player_comms_tracker                       ─────────────────────────
sp_squads / sp_squad_players                                                      player_stats_seasons
sp_coaches / sp_session_coaches     LEGACY SESSION SYSTEM                         player_stats_teams
sp_coach_availability               ─────────────────────────                     player_stats_games
sp_sessions / sp_session_blocks     programs ─► program_week_blocks
sp_activities                       sessions ─► session_activities ─► drills      T20 WAREHOUSE (cricsheet)
sp_session_staffing_rules           journal_prompts                               ─────────────────────────
sp_session_coaches_audit            attendance, observation_notes                 t20_matches ─► t20_innings
sp_program_members / invites        facility_zones                                t20_innings  ─► t20_deliveries
sp_assistant_threads / messages                                                   t20_batting_innings, t20_bowling_spells
sp_coaching_knowledge               REFERENCE / ENGINE                            t20_match_aggregates, t20_trend_snapshots
sp_player_moves                     ─────────────────────────                     t20_players, t20_grounds, t20_tournament_calendar
sp_players (own player list)        engine_constants, assessment_domains,         t20_sync_log
                                    domain_weights, skill_definitions,
WEEKLY REFLECTIONS                  stat_benchmarks/domain_weights/sub_weights,   INDIA TOUR 2026
─────────────────────────           competition_tiers, vccl_regions,              ─────────────────────────
weekly_reflections                  vmcu_associations,                            india_tour_2026_travellers
weekly_reflection_responses         association_competitions,                     ├─ _documents
                                    eligibility_rules                             ├─ _payments
TRIAL / OPEN DAY                                                                  ├─ _activity
─────────────────────────           AUTH / IDENTITY / RECOVERY                    └─ checklist
trial_assessments                   ─────────────────────────
trial_player_groups                 user_profiles                                 FITNESS PROGRAM
trial_session_plans                 program_members                               ─────────────────────────
                                    dashboard_users                               fitness_programs
SQUAD (legacy)                      deleted_members                               fitness_program_blocks
─────────────────────────           member_recovery                               fitness_program_enrolment
squad_groups                        password_reset_tokens                         fitness_session_logs
squad_allocations                   recovery_attempts                             fitness_badges_awarded
coach_squad_access                  registration_codes
                                                                                  COHORT / OFFER
                                                                                  ─────────────────────────
                                                                                  official_cohort_2026
                                                                                  elite_program_2026_roster
                                                                                  offer_tokens / offer_responses
```

---

## 4. Edge Functions (17)

All connect to this same project. Most run with `verify_jwt:false` (public).

| Slug | Purpose | JWT |
|---|---|---|
| `create-member` | Provisions a new member (auth user + `program_members` + `user_profiles`) | false |
| `bootstrap-member` | First-time setup for an invited member | false |
| `manage-member` | Admin operations on members (rotate password, deactivate, etc.) | false |
| `create-admin-users` | Bulk-creates `dashboard_users` | false |
| `batch-create-coaches` | Bulk-creates coach members | false |
| `seed-dev-accounts` | Dev/test account seeding | false |
| `e2e-create-user` | Test helper | false |
| `t20-refresh-data` | Pulls fresh cricsheet/PlayHQ data into `t20_*` | **true** |
| `slack-notify` | Posts to Slack webhook (lead alerts, etc.) | false |
| `generate-dna-report` | Builds the Player DNA PDF report | false |
| `admin-reset-password` | Admin-initiated password reset | false |
| `send-password-reset` | User-initiated password reset (writes `password_reset_tokens`) | false |
| `complete-password-reset` | Consumes a reset token | false |
| `send-username-recovery` | Username recovery email | false |
| `set-recovery-email` | Saves recovery email to `member_recovery` | false |
| `verify-recovery-email` | Verifies recovery email token | false |
| `voice-parse-spike` | Experimental voice transcription parsing | false |

> Note: 14 of these run with `verify_jwt:false`. They must enforce their own auth/CSRF — review each as part of restructure.

---

## 5. Views (5)

| View | What it returns |
|---|---|
| `crm_analytics_summary` | Aggregate counts on `crm_leads` (total, 7d, 30d, by stage, conversion rate). |
| `india_tour_2026_readiness` | Per-traveller readiness rollup (passport valid, docs received, amount paid). |
| `ipl_orders_by_size` | Bulk-order sizes from `shop_orders_ipl` jsonb items. |
| `shop_orders_all` | UNION of `shop_orders_training` + `shop_orders_ipl` for unified dashboard. |
| `v_player_item_aggregates` | Multi-rater rollup over `coach_assessment_items` (avg score, rater count, modal statement). |

---

## 6. Tables by domain

Each row: **name** · rows · disk · PK · RLS policies (count/commands) · FK columns · key columns (cropped) · code usage.

Code usage shows files that call `supabase.from('<table>')` (anywhere in `src/`, `api/`, `scripts/`, `supabase/functions/`).

### 6.1 Auth / Identity

| Table | Rows | PK | RLS | FKs | Key columns | Code usage |
|---|---:|---|---|---|---|---|
| `user_profiles` | 173 | `id` | 6 (S/I/U) | — | `email!, full_name, avatar_url, role!, submitted` | `DNAProfileApp/auth/authHelpers.js`, `DNAProfileApp/db/adminDb.js`, `DNAProfileApp/player/PlayerOnboarding.jsx` |
| `program_members` | 161 | `id` | 8 (S/U) | — | `username!, display_name!, email!, role!, generated_password!, auth_user_id, season!, active!, credentials_sent!` | 6 files in `DNAProfileApp/*` |
| `dashboard_users` | 4 | `id` | 3 (ALL/S) | — | `email!, display_name, role!, invited_by!, active` | `admin/AdminLayout.jsx`, `admin/AdminLogin.jsx`, `admin/SettingsPanel.jsx`, 3 api files |
| `deleted_members` | 7 | `id` | 3 (D/I/S) | — | snapshot of `program_members` + `deleted_at`, `deleted_by` | `DNAProfileApp/db/adminDb.js` |
| `member_recovery` | 106 | `auth_user_id` | 1 (S) | — | `recovery_email, recovery_email_verified_at, recovery_email_token_hash, recovery_email_token_expires_at` | Edge functions only |
| `password_reset_tokens` | 15 | `token_hash` | — (service_role only) | — | `auth_user_id!, username!, expires_at!, used_at, requester_ip` | Edge fn `send-password-reset` / `complete-password-reset` |
| `recovery_attempts` | 128 | `id` | — (service_role only) | — | `email_attempted, requester_ip, attempt_type!, attempted_at!` | Edge fn (rate limiting) |
| `registration_codes` | 2 | `id` | 1 (S) | — | `code!, role!, label, max_uses!, current_uses!, expires_at, active!` | Edge fn `create-member` |

### 6.2 Landing-page lead capture (per-form tables — major dedupe candidate)

| Table | Rows | PK | RLS | FKs | Key columns | Code usage |
|---|---:|---|---|---|---|---|
| `applications` | 628 | `id` | 7 (D/I/S/U) | — | First-name/last-name/age/dob/email/phone/suburb/club/history/bio/goals/cv_url, parent1/2 fields, UTM, `archived`, `program_type`, `program`, accept_* flags | 14 files: forms (Apply, LeadModal, RegistrationForms) + admin (ApplicationsTable, KanbanBoard, SelectionAnalytics, etc.) |
| `archived_applications` | 17 | `id` | 3 (D/I/S) | — | mirror of `applications` + `archived_at, archive_reason` | none in code (manual archive) |
| `inquiries` | 3 | `id` | 2 (I/S) | — | first/last/age/email/phone/suburb/club/history/bio/goals/cv_url, parent1/2 — **subset of `applications`** | none in code |
| `rsvp_responses` | 169 | `id` | 4 (ALL/I/S/U) | — | `player_name!, parent_name!, email!, selected_option!, option_label!, selected_time, excited_reason, considering_reasons jsonb, decline_reasons jsonb, accepted_terms!, accepted_comms!, archived, future_contact` | `admin/RSVPResponses.jsx`, `admin/UnifiedPlayerDetail.jsx`, `landing-page-2/AssessmentRSVP.jsx` |
| `general_enquiries` | 9 | `id` | 2 (I/S) | — | `name!, email!, phone, age_group, skill_level, postcode, gender_preference, looking_for, UTM` | `admin/HomeLeadsDashboard.jsx`, `home-page/RegisterDrawer.jsx` |
| `upcoming_program_interest` | 21 | `id` | 2 (I/S) | — | `name!, email!, phone, age_group, skill_level, postcode, gender_preference, questions, UTM` | `admin/HomeLeadsDashboard.jsx`, `home-page/RegisterDrawer.jsx` |
| `elite_2026_waitlist` | 86 | `id` | 2 (ALL/I) | — | LP1/LP3 waitlist superset of `applications` columns + `selected_sessions, shirt_size, short_size, pant_size, shirt_name` | `master-landing-page/MasterCheckout.jsx` |
| `onboarding_competition_history` | 85 | `id` | 2 (I/S) | `waitlist_id → elite_2026_waitlist.id` | per-player competition rows captured during onboarding | `master-landing-page/MasterCheckout.jsx` |
| `holiday_clinic_registrations` | 219 | `id` | 4 (I/S) | — | parent+player+club+suburb+location, `on_waitlist!`, UTM, shirt_size, accept_* | `holiday-programs/RegistrationForm.jsx` |
| `female_kickstart_2026` | 13 | `id` | 2 (ALL/I) | — | parent+player+suburb+location+experience, UTM, payment_status | `female-cricket-introduction/RegistrationForm.jsx` |
| `junior_royals_registrations` | 0 | `id` | 2 (I/S) | — | parent+player+age+gender+suburb+group_selection+session_preference+UTM | not in code (replaced by per-venue tables) |
| `junior_royals_bundoora` | 87 | `id` | 5 (I/S/U) | — | same as above + `time_slot, requires_shirt, payment_status` | (referenced via admin views) |
| `junior_royals_hallam` | 105 | `id` | 5 (I/S/U) | — | same as `junior_royals_bundoora` | (referenced via admin views) |
| `coaching_opportunities_applications` | 0 | `id` | 3 (I/S/U) | — | full_name+email+phone+suburb+age+linkedin+WWC+specialist_discipline+cricket_cv+coaching_cv+goals+UTM | `coaching-opportunities/ApplicationForm.jsx` |
| `offer_tokens` | 2 | `id` | 5 (ALL/S/U) | `application_id → applications.id` | `token!, applicant_name!, applicant_email, status!, expires_at!, responded_at` | 6 admin files + `offer-response/*` |
| `offer_responses` | 0 | `id` | 4 (ALL/I/S) | `token_id → offer_tokens.id` | `decision!, excitement_level, primary_reason, what_excites, what_concerns, cost_factor, timing_factor, competing_programs, parent_sentiment, improvement_suggestions, additional_comments` | `admin/TokenGenerator.jsx`, `offer-response/RSVPForm.jsx` |

> **Duplication watch:** `applications` / `inquiries` / `archived_applications` / `elite_2026_waitlist` overlap heavily; `junior_royals_registrations` (empty) was split into `_bundoora` + `_hallam`; per-form leads should be unified into `crm_leads` (already partially done — see CRM section).

### 6.3 Cohort / Roster

| Table | Rows | PK | RLS | FKs | Key columns | Code usage |
|---|---:|---|---|---|---|---|
| `official_cohort_2026` | 241 | `id` | 4 (D/I/S/U) | — | superset of applications columns + `accepted_offer, payment_plan_selected, payment_status, group_chat_consent, phone_numbers jsonb, preferred_comms, selected_sessions, shirt_name, size_tshirt/short/pants, player_role, accept_playing_standard, ...` | 11 files (admin + landing-page-3 + master-landing-page) |
| `elite_program_2026_roster` | 88 | `id` | 2 (ALL/S) | — | `player_name!, is_female, is_ambassador, parent_name, parent_email, parent2_email, parent3_email, parent_phone, notes, active, source` | (none found in repo grep — likely admin-only via UI) |

### 6.4 CRM (newer system — unified)

| Table | Rows | PK | RLS | FKs | Key columns | Code usage |
|---|---:|---|---|---|---|---|
| `crm_leads` | 584 | `id` | 1 (ALL) | — | `source_type!, source_id, source_form, first_name, last_name, email, phone, parent_*, age, dob, gender, suburb, club, experience_level, stage!, priority, assigned_to, UTM, last_contacted_at, next_follow_up_at, tags jsonb, custom_fields jsonb, is_archived, archived_reason` | (admin only — no `.from('crm_leads')` in src grep; likely accessed via `master_inquiries` view name?) |
| `crm_pipeline_stages` | 14 | `id` | 2 (ALL/S) | — | `name!, slug!, sort_order!, color, description, stage_type, auto_actions jsonb` | — |
| `crm_lead_notes` | 0 | `id` | 1 (ALL) | `lead_id → crm_leads.id` | `content!, note_type, created_by` | — |
| `crm_activity_log` | 0 | `id` | 1 (ALL) | `lead_id → crm_leads.id` | `activity_type!, description, metadata jsonb, performed_by` | — |
| `crm_email_templates` | 6 | `id` | 1 (ALL) | — | `name!, subject!, body_html!, body_text, category, variables jsonb, is_active, created_by` | — |
| `crm_email_signatures` | 3 | `id` | 1 (ALL) | — | `name!, role, signature_html!, is_default` | — |
| `crm_email_log` | 0 | `id` | 1 (ALL) | `lead_id → crm_leads.id`, `template_id → crm_email_templates.id` | `to_email!, subject!, body_preview, status, sent_by, sent_at` | — |
| `crm_automations` | 3 | `id` | 1 (ALL) | — | `name!, description, trigger_type!, trigger_config jsonb!, actions jsonb!, is_active, execution_count, last_executed_at` | — |
| `crm_settings` | 5 | `id` | 1 (ALL) | — | `key!, value jsonb!` | — |
| `crm_program_registry` | 27 | `id` | 1 (ALL) | `programs_config_id → programs_config.program_id` | `program_key!, display_name!, source_table!, source_table_row_count, crm_leads_source_type, crm_leads_count, dashboard_tab, icon_name, color, is_active, is_synced_to_crm, last_scanned_at, last_sync_at` | — |
| `crm_scan_log` | 114 | `id` | 1 (ALL) | — | `scanned_at, scan_type!, tables_found, new_programs_found, new_registrations_found, details jsonb, status` | — |

> `crm_program_registry` + `crm_scan_log` look like a built-in scanner that auto-discovers per-form tables and registers them as CRM sources — relevant for restructure.

### 6.5 Pipeline (older system — likely deprecate)

| Table | Rows | PK | RLS | FKs | Key columns | Code usage |
|---|---:|---|---|---|---|---|
| `pipeline_stages` | 13 | `id` | 2 (ALL/S) | — | `name!, slug!, sort_order!, color, description, is_default` | `scripts/add_lp2_stages.js`, 6 admin files |
| `pipeline_entries` | 628 | `id` | 2 (ALL/S) | `application_id → applications.id`, `stage_slug → pipeline_stages.slug` | `notes, labels jsonb, updated_at` | 8 admin + `useAutomations.js` |
| `pipeline_activity_log` | 487 | `id` | 2 (I/S) | `application_id → applications.id` | `from_stage, to_stage!, action, notes, performed_by` | 6 admin + `useAutomations.js` |

> **Overlap:** This is the original Kanban for `applications`. `crm_leads` + `crm_pipeline_stages` is a newer, broader replacement.

### 6.6 Stripe / Payments

| Table | Rows | PK | RLS | FKs | Key columns | Code usage |
|---|---:|---|---|---|---|---|
| `program_registrations` | 250 | `id` | 3 (I/S/U) | — | `program!, program_variant, program_label, customer_*, shipping_address jsonb, items jsonb, amount_*_cents, payment_status, stripe_session_id, stripe_payment_intent_id, stripe_charge_id, card_*, receipt_url, paid_at, stripe_metadata jsonb` | `api/stripe-webhook.js`, `api/sync-programs-from-stripe.js`, `admin/ProgramRegistrationsDashboard.jsx` |
| `shop_orders_training` | 8 | `id` | 3 (I/S/U) | — | `items jsonb!, fulfillment_method!, subtotal/shipping_cost/total, payment_status, fulfillment_status, stripe_*, customer_*, pickup_venue, pickup_day, amount_*_cents, paid_at, stripe_metadata` | `api/sync-from-stripe.js`, `academy-shop/CartDrawer.jsx`, `academy-shop/ShopSuccess.jsx`, `admin/ShopOrdersDashboard.jsx` |
| `shop_orders_ipl` | 0 | `id` | 3 (I/S/U) | — | same as `_training` plus `supplier_status, supplier_order_date, estimated_delivery` | same files |
| `shop_orders` | 0 | `id` | 3 (I/S/U) | — | subset of `_training` — **legacy, empty, dead** | — |
| `academy_member_subsidies` | 1 | `id` | 2 (ALL/S) | — | `player_name!, customer_*, program!, reason, created_by, active` | — |
| `reclassification_audit` | 0 | `id` | 1 (S) | — | `performed_by!, source_table!, source_row_id!, stripe_session_id, field_before jsonb!, field_after jsonb!, reason` | — |

### 6.7 Page analytics

| Table | Rows | PK | RLS | Key columns | Code usage |
|---|---:|---|---|---|---|
| `page_analytics` | **171,149** (88 MB) | `id` | 2 (I/S) | `session_id!, page_path!, event_type!, event_data jsonb, referrer, user_agent, screen_width/height, device_type` | `hooks/usePageAnalytics.js`, `admin/PageAnalyticsPanel.jsx` |
| `page_views` | 0 | `id` | 3 (I/S/U) | `session_id, page_path!, page_title, referrer, UTM, device_type, browser, os, screen_*, country, time_on_page, max_scroll_depth, bounce, cta_clicks jsonb` | **dead** |
| `analytics_events` | 1,433 | `id` | 2 (I/S) | `user_id, event_type!, event_detail jsonb, session_id` | `DNAProfileApp/analytics/tracker.js`, `DNAProfileApp/db/adminDb.js`, `DNAProfileApp/shared/ErrorBoundary.jsx` |

> `page_analytics` is the single biggest table by far. Restructure candidates: introduce retention policy, archive to cold storage, partition by month, or move to PostHog (already partially set up in `.env`).

### 6.8 Players (canonical academy player record)

| Table | Rows | PK | RLS | FKs | Key columns | Code usage |
|---|---:|---|---|---|---|---|
| `players` | 106 | `id` | 7 (D/I/S/U) | — | huge: identity (name/dob/phone/email/club/role/batting_hand/bowling_type), parent fields, `voice_answers jsonb, self_ratings jsonb, ccm, highest_comp_code, top_batting_scores jsonb, top_bowling_figures jsonb, auth_user_id, height_cm, batting/bowling_position/phases jsonb, archetype primary/secondary, weekday/weekend_session, headshot_url, idp_last_viewed_at, archived_at` | 4 files: `DNAProfileApp/coach/AdminProfiles.jsx`, `db/adminDb.js`, `db/playerDb.js`, `player/PlayerPortal.jsx` |
| `sp_players` | 85 | `id` | 4 (D/I/S/U) | `program_id → sp_programs.id` | `first_name!, last_name!, squad_ids ARRAY!, cricket_type, role, batting_hand, bowling_style, skills jsonb, dob, club, email, parent_name, parent_mobile, is_active` | session-planner only |
| `t20_players` | 771 | `id` | 3 (I/S/U) | — | `name!, cricsheet_id, espn_id, batting_hand, bowling_style, role, nationality, dob, primary_team` | `supabase/functions/fetch-playhq-stats` only |
| `official_cohort_2026` | 241 | (see 6.3) | | | | |
| `elite_program_2026_roster` | 88 | (see 6.3) | | | | |

> Five different "player" tables. Real-people overlap is high. `players` is the canonical app record; `sp_players` is a session-planner-local copy; `official_cohort_2026` is the offered/enrolled list; `elite_program_2026_roster` is the current squad (sourced from Google Sheets); `t20_players` is external pro players (no overlap).

### 6.9 Assessments / IDP / Reports

| Table | Rows | PK | RLS | FKs | Key columns | Code usage |
|---|---:|---|---|---|---|---|
| `coach_assessments` | 62 | `id` | 5 (D/I/S/U) | `player_id → players.id`, `session_id → sp_sessions.id` | One row per player. Archetypes, `phase_ratings/tech_*/game_iq/mental/physical/fielding jsonb`, `overall_batting/overall_rating`, narrative, `strengths/priorities/plan_*`, `weekday/weekend_coach_*` | 3 files |
| `coach_assessment_items` | 0 | `id` | 5 (D/I/S/U) | `player_id → players.id`, `item_key → assessment_item_definitions.item_key` | Multi-rater Phase 1 redesign: `coach_id!, item_key!, score!, statement!, session_type!, session_context!, notes` | — (new) |
| `assessment_item_definitions` | 29 | `item_key` | 2 (ALL/S) | — | `section!, category, display_order!, prompt!, statement_1..5!, applies_to_role!, applies_to_session!, active!` | — |
| `assessment_domains` | 7 | `domain_id` | 2 (S) | — | `domain_name, data_tier, source_page, item_count, feeds_algorithm, notes` | reference |
| `assessment_history` | 219 | `id` | 2 (I/S) | — | `player_id!, assessment_data jsonb!, version!, created_by` | `DNAProfileApp/db/playerDb.js` |
| `report_coach_allocation` | 86 | `id` | 2 (ALL/S) | `player_id → players.id` | `primary_coach_id!, allocation_context!, notes` | — |
| `idp_goals` | 0 | `id` | 2 (ALL/S) | `program_id → programs.id` | `player_id, goal_text!, status, progress` | `DNAProfileApp/db/adminDb.js`, `db/idpDb.js` |
| `idp_focus_areas` | 0 | `id` | 2 (ALL/S) | `program_id → programs.id` | `player_id, focus_text!, coach_notes, set_by` | same |
| `idp_notes` | 0 | `id` | 1 (ALL) | `program_id → programs.id` | `player_id, note_text!, author_id, author_role` | same |
| `idp_specialist_assessments` | 0 | `id` | 2 (ALL/S) | `player_id → players.id` | `domain!, scores jsonb!, strengths jsonb!, priorities jsonb!, narrative, assessed_by, partner_name, assessed_at` | — |
| `player_performance_metrics` | 111 | `id` | 2 (ALL) | `player_id → players.id` | `metric_type!, value!, unit!, recorded_at!, recorded_by, recorded_by_role!, notes, attempt_number` (event-sourced) | — |
| `brock_string_assessments` | 1 | `id` | 5 (D/I/S/U) | `player_id → players.id` | `front_on_seconds, side_on_seconds, front_on_tags ARRAY!, side_on_tags ARRAY!, comments, recorded_by(_name), recorded_at!` | — |
| `batting_reports` | 87 | `id` | 5 (D/I/S/U) | `player_id → players.id` | `archetype, overview, strengths ARRAY!, priorities ARRAY!, focus_cues ARRAY!, published!, published_at, published_by, created_by/updated_by` | — |
| `bowling_reports` | 47 | `id` | 5 (D/I/S/U) | `player_id → players.id` | `report_type!, report_group, overview, strengths/priorities/focus_cues ARRAY!, created_by/updated_by` | — |
| `player_scores` | 0 | `id` | 4 (I/S/U) | `player_id → players.id` | `pdi, pdi_pct, grade, domain_scores jsonb, ccm, cti, sagi, sagi_label, cohort_percentile, completion_pct, trajectory, provisional, calculated_at/by` | — |
| `competition_grades` | 190 | `id` | 5 (D/I/S) | `player_id → players.id` | per-comp historical batting/bowling/fielding stats with `level, age_group, shield, team, association, matches, runs, high_score, batting_avg, overs, wickets, strike_rate, bowling_avg, economy, ...` | `DNAProfileApp/db/adminDb.js`, `db/playerDb.js` |
| `trial_assessments` | 0 | `id` | 5 (ALL/I/S/U) | `player_id → players.id` | trial-day scoring: batting/bowling/power/strike_rotation/game_awareness/decision/pressure/coachability/athleticism/fielding/catching/running, archetypes, squad_rec, overall_grade, bowling_type | — |
| `trial_player_groups` | 0 | `id` | 4 (D/I/S/U) | — | `player_id!, group_label!, session_date, checked_in*` | — |
| `trial_session_plans` | 0 | `id` | 3 (I/S/U) | — | `session_date, session_group!, rotation_data jsonb!, config jsonb!` | — |

### 6.10 Engine / Reference data (lookups)

| Table | Rows | PK | RLS | FKs | Key columns | Code usage |
|---|---:|---|---|---|---|---|
| `engine_constants` | 14 | `constant_key` | 4 (S/U) | — | `value, data_type, owner, review_cadence, description` | `DNAProfileApp/context/EngineContext.jsx`, `db/adminDb.js` |
| `domain_weights` | 5 | `role_id` | 3 (S/U) | — | `role_label, technical/game_iq/mental/physical/phase_weight, notes` | same |
| `skill_definitions` | 380 | `skill_name, level` | 3 (S) | — | `description!` | `db/playerDb.js` |
| `stat_benchmarks` | 20 | `cti_band, metric` | 3 (S) | — | `benchmarks jsonb!` | `db/playerDb.js` |
| `stat_domain_weights` | 3 | `age_tier` | 3 (S) | — | `t, i, m, h, ph, s` (all numeric) | `db/playerDb.js` |
| `stat_sub_weights` | 5 | `role` | 3 (S) | — | `batting, bowling, fielding` | `db/playerDb.js` |
| `competition_tiers` | 101 | `code` | 3 (S/U) | — | `tier, competition_name, shield_name, gender, age_group, format, cti_value, expected_midpoint_age, arm_sensitivity, active, notes` | `EngineContext.jsx`, `db/adminDb.js` |
| `vccl_regions` | 8 | `region_code` | 2 (S) | — | `region_name, associations, linked_premier_club, has_direct_pathway` | `EngineContext.jsx` |
| `vmcu_associations` | 19 | `abbrev` | 2 (S) | — | `full_name, type, surface, region_notes` | `EngineContext.jsx` |
| `association_competitions` | 345 | `id` | 2 (S) | `association_abbrev → vmcu_associations.abbrev`, `competition_tier_code → competition_tiers.code` | `competition_label!, gender!, age_group!, sort_order!, active!` | `EngineContext.jsx` |
| `eligibility_rules` | 6 | `competition_code` | 2 (S) | `competition_code → competition_tiers.code` | `competition_name, eligibility, excluded_from, source` | — |
| `knowledge_base` | 0 | `id` | 1 (S) | — | `slug!, title!, content!, version` | — (AI knowledge base) |
| `programs_config` | 4 | `program_id` | 1 (S) | — | `name!, description, age_groups ARRAY, skill_levels ARRAY, gender, route!, is_active, sort_order, urgency_type/label/text, image_url, image_position` | `home-page/HomeProgramCards.jsx` |

### 6.11 Legacy programs/sessions (DNAProfileApp's first session system)

| Table | Rows | PK | RLS | FKs | Key columns | Code usage |
|---|---:|---|---|---|---|---|
| `programs` | 1 | `id` | 3 (I/S/U) | — | `name!, slug!, season!, start_date, phase_labels jsonb!, edit_locked!, locked_by, locked_at, created_by` | `db/journalDb.js`, `db/programDb.js`, `PlayerPortal.jsx` |
| `program_week_blocks` | 0 | `id` | 4 (D/I/S/U) | `program_id → programs.id` | `stream!, week_start!, week_end!, theme, color, notes, sort_order!` | `db/programDb.js` |
| `sessions` | 4 | `id, id` ⚠️ duplicate PK | 4 (D/I/S/U) | `program_id → programs.id` | `week_number!, session_number!, session_date, title, objectives, total_duration_mins, notes, adjustments, coaching_points, journal_questions ARRAY` | `db/journalDb.js`, `db/programDb.js` |
| `session_activities` | 25 | `id` | 4 (D/I/S/U) | `session_id → sessions.id`, `drill_id → drills.id` | `sort_order!, custom_name, custom_description, duration_mins, zone_ids ARRAY, coaching_notes, assign_type!, assign_skill_roles/squad_ids/player_ids ARRAY, start_time_mins!` | `db/programDb.js` |
| `drills` | 20 | `id` | 3 (I/S/U) | — | `name!, short_name, category!, discipline!, difficulty, tags ARRAY, description, coaching_cues, setup_instructions, variations jsonb, success_criteria, min/max_duration_mins, min/max_players, equipment ARRAY, preferred_zones ARRAY, archived!` | `db/programDb.js` |
| `facility_zones` | 9 | `id` | 3 (I/S/U) | — | `name!, zone_type!, capacity, sort_order!` | `db/programDb.js` |
| `attendance` | 0 | `id` | 2 (ALL/S) | `session_id → sessions.id` | `player_id, status, source, marked_by` | `db/observationDb.js` |
| `observation_notes` | 0 | `id` | 2 (ALL) | `session_id → sessions.id`, `program_id → programs.id` | `player_id, coach_id, domain, skill, rating, context, free_text, tags ARRAY` | `db/observationDb.js` |
| `journal_entries` | 121 | `id` | 2 (ALL/S) | `session_id → sessions.id`, `program_id → programs.id` | `player_id, entry_type, week_number, responses jsonb!, effort_rating, enjoyment_rating` | `db/adminDb.js`, `db/journalDb.js` |
| `journal_prompts` | 0 | `id` | 2 (ALL/S) | `session_id → sessions.id` | `prompt_text!, sort_order, created_by` | `db/journalDb.js` |

> `sessions.pk_columns = "id, id"` (reported by `information_schema`) is suspicious — usually means a primary key + a separate unique constraint on `id`. Worth checking before restructure.

### 6.12 Session Planner (`sp_*` — newer & active)

| Table | Rows | PK | RLS | FKs | Key columns | Code usage |
|---|---:|---|---|---|---|---|
| `sp_programs` | 1 | `id` | 6 (D/I/S/U) | — | `name!, start_date!, end_date!, description` | session-planner UI |
| `sp_phases` | 5 | `id` | 6 (D/I/S/U) | `program_id → sp_programs.id` | `name!, description, start_date!, end_date!, goals jsonb, sort_order!` | |
| `sp_venues` | 1 | `id` | 4 (I/S/U) | — | `name!, short_name, address, lanes jsonb!` | |
| `sp_squads` | 8 | `id` | 6 (D/I/S/U) | `program_id → sp_programs.id` | `name!, colour!, description, session_days jsonb, max_players` | |
| `sp_coaches` | 19 | `id` | 2 (ALL/S) | — | `user_id, name!, email, role!, speciality, bio, avatar_url, is_active` | |
| `sp_sessions` | 96 | `id` | 7 (D/I/S/U) | `program_id → sp_programs.id`, `phase_id → sp_phases.id`, `venue_id → sp_venues.id` | `date!, start_time!, end_time!, squad_ids ARRAY, specialist_coaches jsonb, theme, status, notes` | |
| `sp_session_blocks` | 0 | `id` | 7 (D/I/S/U) | `session_id → sp_sessions.id` | `activity_id, name!, lane_start!, lane_end!, time_start!, time_end!, colour, category, tier, other_location, coaching_notes, coaching_points jsonb, player_groups jsonb, equipment jsonb, coach_assigned, sort_order` | |
| `sp_activities` | 46 | `id` | 7 (D/I/S/U) | `program_id → sp_programs.id` | `name!, category!, sub_category, description, regression/progression/elite/gamify jsonb, default_duration_mins, default_lanes, equipment jsonb, tags ARRAY, youtube_reference, constraints_cla, coaching_framework jsonb, max_balls_per_batter, between_sets_activity, created_by, is_global` | |
| `sp_session_coaches` | 140 | `id` | 4 (D/I/S/U) | `session_id → sp_sessions.id`, `coach_id → sp_coaches.id` | `user_id, role!, confirmed, notes, coach_role, hour` | |
| `sp_session_coaches_audit` | 0 | `id` | 1 (S) | — | `action!, session_id!, assignment_id, coach_id, coach_role, performed_by, performed_at!` (trigger-populated) | |
| `sp_session_staffing_rules` | 2 | `id` | 4 (D/I/S/U) | `program_id → sp_programs.id`, `squad_id → sp_squads.id` | `coach_role!, min_count!, notes` | |
| `sp_coach_availability` | 73 | `id` | 4 (D/I/S/U) | `program_id → sp_programs.id`, `session_id → sp_sessions.id` | `user_id!, date!, status!, notes` | |
| `sp_squad_players` | 176 | `id` | 5 (D/I/S/U) | `squad_id → sp_squads.id`, `player_id → players.id` | `player_name!, player_email, parent_name, parent_mobile, gender, position_number, status!, move_notes, allocated_by` | |
| `sp_player_moves` | 0 | `id` | 3 (I/S) | `from_squad_id → sp_squads.id`, `to_squad_id → sp_squads.id` | `player_name!, reason, moved_by` | |
| `sp_players` | 85 | `id` | 4 (D/I/S/U) | `program_id → sp_programs.id` | (see 6.8) | |
| `sp_program_members` | 19 | `id` | 4 (D/I/S/U) | `program_id → sp_programs.id` | `user_id!, role!, invited_by, invited_at, accepted_at, status!, display_name, phone, speciality, avatar_url` | |
| `sp_program_invites` | 0 | `id` | 4 (D/I/S/U) | `program_id → sp_programs.id` | `token!, email, role!, invited_by!, accepted_by, accepted_at, expires_at` | |
| `sp_assistant_threads` | 0 | `id` | 4 (D/I/S/U) | `session_id → sp_sessions.id` | `user_id, title` | |
| `sp_assistant_messages` | 0 | `id` | 3 (I/S/U) | `thread_id → sp_assistant_threads.id` | `role!, content!, tool_calls jsonb, actions_applied, attachments jsonb` | |
| `sp_coaching_knowledge` | 0 | `id` | 4 (D/I/S/U) | — | `category!, title!, content!, tags ARRAY, created_by, source, is_active` | |

### 6.13 Weekly reflections

| Table | Rows | PK | RLS | FKs | Key columns | Code usage |
|---|---:|---|---|---|---|---|
| `weekly_reflections` | 3 | `id` | 5 (D/I/S/U) | `program_id → sp_programs.id` | `week_number!, week_label, questions jsonb!, published_at, created_by` | — |
| `weekly_reflection_responses` | 62 | `id` | 4 (I/S/U) | `reflection_id → weekly_reflections.id`, `player_id → players.id` | `auth_user_id!, answers jsonb!, submitted_at!` | — |

### 6.14 Comms & engagement

| Table | Rows | PK | RLS | FKs | Key columns | Code usage |
|---|---:|---|---|---|---|---|
| `player_communications` | 162 | `id` | 1 (ALL) | `player_id → official_cohort_2026.id` | `player_name!, message_id!, conversation_id, subject!, body_preview, direction!, from_address!, from_name, to_addresses ARRAY!, cc_addresses ARRAY, email_account!, matched_email!, matched_contact_type, email_date!, synced_at, has_attachments, is_read, importance, action_items ARRAY, status` | — |
| `player_comms_tracker` | 80 | `id` | 1 (ALL) | `player_id → official_cohort_2026.id` | per-player checklist of welcome/dna/session/onboarding/uniform comms with `*_sent`, `*_sent_date`, `*_reply`, `*_reply_summary`, totals & engagement_level | — |

### 6.15 Squad (legacy)

| Table | Rows | PK | RLS | FKs | Key columns | Code usage |
|---|---:|---|---|---|---|---|
| `squad_groups` | 0 | `id` | 1 (ALL) | — | `name!, description, target_size, sort_order, season` | `coach/SquadAssignment.jsx`, `db/adminDb.js`, `db/squadDb.js` |
| `squad_allocations` | 0 | `id` | 1 (ALL) | `squad_id → squad_groups.id`, `player_id → players.id` | `allocated_by, notes` | `db/adminDb.js`, `db/squadDb.js` |
| `coach_squad_access` | 0 | `id` | 2 (ALL/S) | `squad_id → squad_groups.id` | `coach_id, role, assigned_at` | `db/adminDb.js`, `db/squadDb.js` |

> All empty. Likely superseded by `sp_squads` / `sp_squad_players` / `sp_session_coaches`.

### 6.16 PlayHQ player stats (external)

| Table | Rows | PK | RLS | FKs | Key columns | Code usage |
|---|---:|---|---|---|---|---|
| `player_stats_seasons` | 0 | `id` | 4 (D/I/S/U) | `cohort_id → official_cohort_2026.id` | `season_name!, season_year!, source, fetched_from_url, last_fetched_at` | `admin/PlayerProfileDetail.jsx`, `admin/PlayerProfiles.jsx`, `supabase/functions/fetch-playhq-stats` |
| `player_stats_teams` | 0 | `id` | 4 (D/I/S/U) | `season_id → player_stats_seasons.id` | `team_name!, club_name, grade, competition, level, bat_*, bowl_*, field_*` | same |
| `player_stats_games` | 0 | `id` | 4 (D/I/S/U) | `team_id → player_stats_teams.id` | `match_date, opponent, venue, result, match_type, bat_*, bowl_*, field_*` | same |

### 6.17 T20 warehouse (cricsheet)

| Table | Rows | PK | RLS | FKs | Key columns |
|---|---:|---|---|---|---|
| `t20_matches` | 1,169 | `id` | 3 (I/S/U) | `ground_id → t20_grounds.id` | `cricsheet_id, competition!, season, tier!, format!, match_date, ground_name, city, team1!, team2!, toss_winner, toss_decision, winner, result, result_type, margin, player_of_match, match_number` |
| `t20_innings` | 2,333 | `id` | 3 | `match_id → t20_matches.id` | `innings_number!, batting_team!, bowling_team!, total_runs, total_wickets, total_overs, extras, pp/middle/death_runs/wickets/overs, boundaries_4/6, dot_balls, total_balls` |
| `t20_deliveries` | **277,720** (70 MB) | `id` | 3 | `innings_id → t20_innings.id`, `match_id → t20_matches.id`, `batter_id/bowler_id → t20_players.id` | `over_number!, ball_number!, phase!, batter!, bowler!, non_striker, runs_batter, runs_extras, runs_total, extras_type, is_wicket, wicket_kind, wicket_player, is_boundary_4/6, is_dot_ball, is_legal` |
| `t20_batting_innings` | 17,638 | `id` | 3 | `innings_id, match_id, player_id` | per-batter rollup: runs/balls/4s/6s/dots/SR/dot_ball_pct/boundary_pct/balls_per_boundary, pp/middle/death splits, is_out, dismissal_kind, competition, season, tier, match_date |
| `t20_bowling_spells` | 13,846 | `id` | 3 | `innings_id, match_id, player_id` | per-bowler rollup: overs/balls/maidens/runs/wickets/economy, pp/middle/death splits, wides, no_balls, is_opening_bowler |
| `t20_match_aggregates` | 1,169 | `id` | 3 | `match_id` | per-match: 1st/2nd innings totals & PP stats, total boundaries/dots, avg SR, dot_ball_pct |
| `t20_players` | 771 | `id` | 3 | — | (see 6.8) |
| `t20_grounds` | 59 | `id` | 3 | — | `name!, city, country, cricsheet_id, avg_first/second_innings_score, bat_first_win_pct, avg_six_rate, pace/spin_friendly_rating, matches_played` |
| `t20_tournament_calendar` | 10 | `id` | 3 | — | `competition!, season!, format!, tier!, region, country, lat/long, start/end_date, status, data_source, teams` |
| `t20_trend_snapshots` | 0 | `id` | 3 | — | `snapshot_type!, competition, tier, content!, metrics jsonb` |
| `t20_sync_log` | 1 | `id` | 3 | — | `sync_type!, competition, started_at, completed_at, matches_found/new/updated, status, error_message, details jsonb` |

> Refreshed by edge function `t20-refresh-data` (the only JWT-protected edge function).

### 6.18 India Tour 2026

| Table | Rows | PK | RLS | FKs | Key columns | Code usage |
|---|---:|---|---|---|---|---|
| `india_tour_2026_travellers` | 2 | `id` | 1 (ALL) | `cohort_player_id → official_cohort_2026.id` | 70+ cols: identity (surname/given_names/dob/gender/pob/nationality/religion/marital/education/occupation), passport (no/type/country/place/issue/expiry), address+contact, parents (father/mother/spouse names+nationalities+pob), travel history (countries_10y, saarc_3y, visa_refused), medical (medical/medications/allergies/blood_group/diet/medicare/private_health/gp/vaccinations), 2x emergency contacts, flight info (ff_program/number/meal/seat/kit), 2x parent escorts (name/relationship/nationality/id/mobile/email), WWCC, 5x consent timestamps, 2x signatures, status, intake_token | `api/india-tour-intake.js`, `admin/IndiaTour2026Dashboard.jsx` |
| `india_tour_2026_documents` | 0 | `id` | 1 (ALL) | `traveller_id → india_tour_2026_travellers.id` | `doc_type!, status!, file_url, notes, received_at, verified_at, verified_by` | same |
| `india_tour_2026_payments` | 0 | `id` | 1 (ALL) | `traveller_id → india_tour_2026_travellers.id` | `stage!, amount_aud!, invoice_ref, payment_method, paid_at, notes` | — |
| `india_tour_2026_checklist` | 56 | `id text` | 1 (ALL) | — | `section_id!, section_title!, group_name!, text!, tags ARRAY, priority!, due_date, status!, completed_at/by, notes, sort_order!` | `admin/IndiaTour2026Dashboard.jsx` |
| `india_tour_2026_activity` | 0 | `id` | 1 (ALL) | `traveller_id → india_tour_2026_travellers.id` | `activity_type!, description, metadata jsonb, performed_by` | — |

### 6.19 Fitness program

| Table | Rows | PK | RLS | FKs | Key columns |
|---|---:|---|---|---|---|
| `fitness_programs` | 1 | `id` | 4 (D/I/S/U) | — | `name!, slug!, description, total_weeks!, sessions_per_week!, activation_block jsonb!, is_active!` |
| `fitness_program_blocks` | 3 | `id` | 4 (D/I/S/U) | `program_id → fitness_programs.id` | `day_number!, day_label!, duration_minutes_target!, rest_seconds!, exercises jsonb!, applies_to_weeks ARRAY!, is_active!, display_order!` |
| `fitness_program_enrolment` | 95 | `id` | 4 (I/S/U) | `program_id → fitness_programs.id`, `player_id → players.id` | `auth_user_id!, start_date!, status!, canary_enabled!, enrolled_by` |
| `fitness_session_logs` | 115 | `id` | 7 (D/I/S/U) | `enrolment_id → fitness_program_enrolment.id`, `block_id → fitness_program_blocks.id`, `player_id → players.id` | `week_number!, day_number!, auth_user_id!, activation_done jsonb!, exercise_logs jsonb!, prescription_snapshot jsonb!, notes, modification_notes, completed_at!, logged_on_time!, catch_up_for_week, logged_by_user_id!, logged_by_role!` |
| `fitness_badges_awarded` | 0 | `id` | 4 (I/S/U) | `enrolment_id`, `qualifying_log_id → fitness_session_logs.id`, `player_id → players.id` | `auth_user_id!, badge_key!, awarded_at!, metadata jsonb!` |

### 6.20 Backups / dedupe junk (CLEANUP CANDIDATES — see §2.1)

| Table | Rows | RLS | Comment |
|---|---:|---|---|
| `_bk_dedupe_coach_assess_20260507` | 2 | ❌ | snapshot before dedupe |
| `_bk_dedupe_comp_grades_20260507` | 7 | ❌ | snapshot before dedupe |
| `_bk_dedupe_fit_enrol_20260507` | 2 | ❌ | snapshot before dedupe |
| `_bk_dedupe_players_20260507` | 4 | ❌ | snapshot before dedupe |
| `_bk_dedupe_program_members_20260507` | 6 | ❌ | snapshot before dedupe |
| `_bk_dedupe_rep_alloc_20260507` | 3 | ❌ | snapshot before dedupe |
| `_bk_dedupe_user_profiles_20260507` | 4 | ❌ | snapshot before dedupe |
| `players_session_backup_20260505_roster` | 104 | ❌ | players.weekday/weekend snapshot |
| `sp_players_backup_20260505_roster` | 85 | ❌ | sp_players snapshot |
| `sp_squad_players_backup_20260505_roster` | 176 | ❌ | sp_squad_players snapshot |
| `coach_assessments_backup_20260419` | 6 | ✅ | pre-cleanup snapshot |
| `sp_coach_availability_backup_20260505` | 0 | ✅ | pre-coach-scheduler snapshot |
| `sp_session_coaches_backup_20260505` | 140 | ✅ | pre-coach-scheduler snapshot |
| `sp_squad_players_backup_20260420` | 2 | ✅ | snapshot |
| `sp_squad_players_backup_20260421` | 168 | ✅ | snapshot |

---

## 7. Cross-table relationships (foreign key graph)

(Read as: `child.column → parent.table.column`. Only public-schema FKs.)

**Players hub**
```
players.id ◄── batting_reports.player_id
           ◄── bowling_reports.player_id
           ◄── brock_string_assessments.player_id
           ◄── coach_assessments.player_id
           ◄── coach_assessment_items.player_id
           ◄── competition_grades.player_id
           ◄── fitness_program_enrolment.player_id
           ◄── fitness_session_logs.player_id
           ◄── fitness_badges_awarded.player_id
           ◄── idp_specialist_assessments.player_id
           ◄── player_performance_metrics.player_id
           ◄── player_scores.player_id
           ◄── report_coach_allocation.player_id
           ◄── sp_squad_players.player_id
           ◄── squad_allocations.player_id
           ◄── trial_assessments.player_id
           ◄── weekly_reflection_responses.player_id
```

**Official cohort hub**
```
official_cohort_2026.id ◄── india_tour_2026_travellers.cohort_player_id
                        ◄── player_communications.player_id
                        ◄── player_comms_tracker.player_id
                        ◄── player_stats_seasons.cohort_id
```

**Applications → pipeline**
```
applications.id ◄── offer_tokens.application_id
                ◄── pipeline_activity_log.application_id
                ◄── pipeline_entries.application_id
                ◄── offer_tokens ◄── offer_responses.token_id
```

**CRM**
```
crm_leads.id ◄── crm_activity_log.lead_id
             ◄── crm_email_log.lead_id
             ◄── crm_lead_notes.lead_id
crm_email_templates.id ◄── crm_email_log.template_id
programs_config.program_id ◄── crm_program_registry.programs_config_id
```

**Session Planner**
```
sp_programs.id ◄── sp_phases.program_id
               ◄── sp_squads.program_id
               ◄── sp_sessions.program_id
               ◄── sp_activities.program_id
               ◄── sp_coach_availability.program_id
               ◄── sp_program_invites.program_id
               ◄── sp_program_members.program_id
               ◄── sp_players.program_id
               ◄── sp_session_staffing_rules.program_id
               ◄── weekly_reflections.program_id
sp_phases.id   ◄── sp_sessions.phase_id
sp_venues.id   ◄── sp_sessions.venue_id
sp_sessions.id ◄── sp_session_blocks.session_id
               ◄── sp_session_coaches.session_id
               ◄── sp_coach_availability.session_id
               ◄── sp_assistant_threads.session_id
               ◄── coach_assessments.session_id
sp_squads.id   ◄── sp_squad_players.squad_id
               ◄── sp_session_staffing_rules.squad_id
               ◄── sp_player_moves.from_squad_id, to_squad_id
sp_coaches.id  ◄── sp_session_coaches.coach_id
sp_assistant_threads.id ◄── sp_assistant_messages.thread_id
```

**T20**
```
t20_matches.id ◄── t20_innings.match_id
               ◄── t20_deliveries.match_id
               ◄── t20_batting_innings.match_id
               ◄── t20_bowling_spells.match_id
               ◄── t20_match_aggregates.match_id
t20_innings.id ◄── t20_deliveries.innings_id
               ◄── t20_batting_innings.innings_id
               ◄── t20_bowling_spells.innings_id
t20_players.id ◄── t20_deliveries.batter_id, bowler_id
               ◄── t20_batting_innings.player_id
               ◄── t20_bowling_spells.player_id
t20_grounds.id ◄── t20_matches.ground_id
```

**Legacy programs**
```
programs.id ◄── sessions.program_id ◄── session_activities.session_id
            ◄── program_week_blocks.program_id
            ◄── journal_entries.program_id, journal_prompts.session_id
            ◄── observation_notes.program_id
            ◄── idp_goals/idp_focus_areas/idp_notes.program_id
drills.id    ◄── session_activities.drill_id
```

**Reference data**
```
competition_tiers.code ◄── association_competitions.competition_tier_code
                       ◄── eligibility_rules.competition_code
vmcu_associations.abbrev ◄── association_competitions.association_abbrev
```

**India Tour**
```
india_tour_2026_travellers.id ◄── india_tour_2026_documents.traveller_id
                              ◄── india_tour_2026_payments.traveller_id
                              ◄── india_tour_2026_activity.traveller_id
```

**Fitness**
```
fitness_programs.id ◄── fitness_program_blocks.program_id
                    ◄── fitness_program_enrolment.program_id
fitness_program_enrolment.id ◄── fitness_session_logs.enrolment_id
                             ◄── fitness_badges_awarded.enrolment_id
fitness_program_blocks.id ◄── fitness_session_logs.block_id
fitness_session_logs.id   ◄── fitness_badges_awarded.qualifying_log_id
```

**Notable missing FKs** (referential gaps to fix in restructure):
- `crm_leads.source_id` is `uuid` but has no FK — it points to whatever per-form table `source_type` indicates. Will break under a structured migration.
- `coach_assessments.coach_id`, `coach_assessment_items.coach_id`, `report_coach_allocation.primary_coach_id` are uuids with **no FK** to `program_members` or `sp_coaches`.
- `players.auth_user_id`, `user_profiles.id`, `program_members.auth_user_id` should reference `auth.users.id` but FKs to `auth` schema aren't visible here.
- `sp_*.user_id`, `dashboard_users.id` likewise should reference `auth.users.id`.
- `program_registrations` has no FK to any program (only a `program text` slug) — same issue as `crm_leads.source_id`.
- `shop_orders_*` have no FK to `auth.users` or `players` — only `customer_email`.

---

## 8. Restructure observations (purely descriptive)

These are observations to inform planning. No changes recommended without further per-domain audit.

1. **Lead-capture sprawl** — 11 form-specific tables (`applications`, `inquiries`, `rsvp_responses`, `general_enquiries`, `upcoming_program_interest`, `elite_2026_waitlist`, `holiday_clinic_registrations`, `female_kickstart_2026`, `junior_royals_*` ×3, `coaching_opportunities_applications`). The `crm_leads` table already exists and `crm_program_registry` has a per-source mapping. Consolidating into `crm_leads` + per-form `details jsonb` is plausible.
2. **Two pipelines coexist** — old `pipeline_*` (still active, 487 activity rows) and new `crm_*` (584 leads). One is redundant.
3. **Three "player" identities** — `players` (academy app), `sp_players` (session planner), `official_cohort_2026` (enrolled cohort), with `elite_program_2026_roster` as a current-squad cache. Worth introducing a canonical `person` / `member` table that all three reference.
4. **Two assessment models running in parallel** — `coach_assessments` (62 rows, one-per-player, big jsonb blob) vs `coach_assessment_items` (0 rows, multi-rater, normalized). Phase 1 redesign is started but not in production.
5. **Two session systems** — `sessions/session_activities/drills` (4/25/20 rows, old) vs `sp_sessions/sp_session_blocks/sp_activities` (96/0/46 rows, new). Old appears mostly dead.
6. **`squad_*` legacy** — `squad_groups`, `squad_allocations`, `coach_squad_access` (all 0 rows) likely replaced by `sp_squads` / `sp_squad_players` / `sp_session_coaches`.
7. **`page_analytics` at 88 MB** — single biggest table. PostHog is already in `.env` but unused. Restructure could move ingestion to PostHog and keep DB only for funnel-relevant events.
8. **`junior_royals_registrations` empty** while `_bundoora` (87) and `_hallam` (105) are populated — per-venue split. Consider unifying with a `venue` column.
9. **`shop_orders` empty** while `_training` (8) and `_ipl` (0) carry the same shape — same per-variant split pattern.
10. **15 backup tables** in the public schema. Move to a `_archive` schema or drop after verifying source data.
11. **Missing FKs to `auth.users`** across `players.auth_user_id`, `user_profiles.id`, `program_members.auth_user_id`, `dashboard_users.id`, `sp_program_members.user_id`, etc. These are loose references and can drift.
12. **`sessions.pk_columns = "id, id"`** — likely a duplicate PK definition. Inspect before touching.
13. **`crm_leads.source_id` is unindexed text-typed reference** — at 584 rows fine, but won't scale across the per-form tables.
14. **14 edge functions run unauthenticated (`verify_jwt: false`)** — including `create-member`, `manage-member`, `admin-reset-password`, `batch-create-coaches`. They must enforce their own auth; worth verifying as part of restructure.

---

*Generated from live DB on 2026-05-22. Source queries: see `information_schema.columns`, `information_schema.table_constraints`, `pg_class`, `pg_policies`. Code-usage map: ripgrep on `\.from\(['"]<table>['"]\)` across `src/`, `api/`, `scripts/`, `supabase/functions/`.*
