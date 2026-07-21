-- ============================================================
-- Junior Royals Term 3 — payment confirmations
-- (Applied to production 21 Jul 2026 via the Supabase MCP; this file is the
-- canonical record. Mirrors power_game_payment_confirmations.)
-- ============================================================
-- One row per piece of payment evidence for a jr_term3_* registration:
-- a Stripe Checkout Session processed by the webhook/cron reconcile, or a
-- manual confirmation (e.g. the 2–7 Jul reconciliation done from the
-- "Junior Royals" sheet's hand-marked Mickleham tab). Unmatched payments are
-- recorded too (matched_record_id null) so they surface instead of vanishing.
-- Service-role only: RLS enabled with no policies + explicit revokes.

create table if not exists public.jr_term3_payment_confirmations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  stripe_session_id text,
  stripe_payment_intent_id text,
  stripe_payment_link text,
  customer_email text,
  customer_name text,
  amount_total_cents integer,
  currency text not null default 'aud',
  program_quantity integer,
  paid_at timestamptz,
  matched_table text,
  matched_record_id uuid,
  match_method text not null default 'none', -- client_ref | email | already | sheet_manual | none
  notes text
);

-- Plain (non-partial) unique constraint so PostgREST upserts can target it;
-- multiple NULLs are allowed, which manual/sheet confirmations rely on.
do $$ begin
  alter table public.jr_term3_payment_confirmations
    add constraint jr_term3_payment_confirmations_session_key unique (stripe_session_id);
exception when duplicate_object or duplicate_table then null; end $$;

create index if not exists jr_t3_conf_email_idx on public.jr_term3_payment_confirmations (customer_email);
create index if not exists jr_t3_conf_record_idx on public.jr_term3_payment_confirmations (matched_record_id);

alter table public.jr_term3_payment_confirmations enable row level security;
revoke all on public.jr_term3_payment_confirmations from anon, authenticated;
