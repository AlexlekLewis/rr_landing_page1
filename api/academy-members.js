// ============================================================
// Vercel Serverless Function — Academy Members 2026
// GET /api/academy-members
// ============================================================
// ADMIN-ONLY. Returns one row per unique person who is part of the
// Academy in 2026 — defined as: paid via Stripe (any program OR shop),
// OR seeded as a subsidy in academy_member_subsidies.
//
// Each row aggregates that person's program enrolments, total paid,
// payment-type breakdown, and first/last paid timestamps.
//
// The "person" key is LOWER(customer_email). Stripe payer name is used
// for display (typically the parent — admin can override per-row via the
// reclassification UI in a later iteration).
//
// Required env vars in Vercel:
//   SUPABASE_SERVICE_ROLE_KEY
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { verifyAdmin } from './_lib/verifyAdmin.js';

const SUPABASE_URL_FALLBACK = 'https://pudldzgmluwoocwxtzhw.supabase.co';

let _supabase = null;
const getSupabase = () => {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || SUPABASE_URL_FALLBACK;
  _supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY);
  return _supabase;
};

const detectPaymentType = (description = '') => {
  const d = (description || '').toLowerCase();
  if (d.includes('flexi') && d.includes('payment')) return 'installment_4pay';
  if (d.includes('payment option') || d.includes('payment plan')) return 'installment';
  if (d.includes('tailored payment')) return 'installment_tailored';
  if (d.includes('subsidised')) return 'subsidised';
  return 'one_off';
};

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await verifyAdmin(req);
  } catch (err) {
    const isAuth = err.code === 'AUTH';
    return res.status(isAuth ? 401 : 500).json({ error: err.message });
  }

  try {
    const sb = getSupabase();

    // Pull paid program registrations + paid shop orders + active subsidies +
    // every per-program roster (player_name <-> parent_email lookups).
    const [progRes, shopTrainingRes, shopIplRes, subsidyRes,
           eliteRosterRes, jrBundooraRes, jrHallamRes, holidayRes, kickstartRes] = await Promise.all([
      sb.from('program_registrations')
        .select('id, customer_name, customer_email, customer_phone, program, program_label, program_variant, items, amount_total_cents, paid_at, stripe_session_id')
        .eq('payment_status', 'completed'),
      sb.from('shop_orders_training')
        .select('id, customer_name, customer_email, customer_phone, items, total, paid_at, stripe_session_id')
        .eq('payment_status', 'completed'),
      sb.from('shop_orders_ipl')
        .select('id, customer_name, customer_email, customer_phone, items, total, paid_at, stripe_session_id')
        .eq('payment_status', 'completed'),
      sb.from('academy_member_subsidies')
        .select('id, player_name, customer_name, customer_email, customer_phone, program, reason, created_at')
        .eq('active', true),
      // Per-program rosters: player identity + parent emails. Used to resolve
      // payer email -> player name on the way out.
      sb.from('elite_program_2026_roster')
        .select('player_name, parent_name, parent_email, parent2_email, parent3_email, is_female, is_ambassador')
        .eq('active', true),
      sb.from('junior_royals_bundoora').select('player_name, parent_name, parent_email'),
      sb.from('junior_royals_hallam').select('player_name, parent_name, parent_email'),
      sb.from('holiday_clinic_registrations').select('player_name, parent_name, parent_email'),
      sb.from('female_kickstart_2026').select('player_name, parent_name, parent_email'),
    ]);

    if (progRes.error) throw new Error(`program_registrations: ${progRes.error.message}`);
    if (shopTrainingRes.error) throw new Error(`shop_orders_training: ${shopTrainingRes.error.message}`);
    if (shopIplRes.error) throw new Error(`shop_orders_ipl: ${shopIplRes.error.message}`);
    if (subsidyRes.error) throw new Error(`academy_member_subsidies: ${subsidyRes.error.message}`);
    // Roster errors are warnings, not failures — don't block the whole view.
    if (eliteRosterRes.error)  console.warn('elite roster:', eliteRosterRes.error.message);
    if (jrBundooraRes.error)   console.warn('jr bundoora:', jrBundooraRes.error.message);
    if (jrHallamRes.error)     console.warn('jr hallam:', jrHallamRes.error.message);
    if (holidayRes.error)      console.warn('holiday:', holidayRes.error.message);
    if (kickstartRes.error)    console.warn('kickstart:', kickstartRes.error.message);

    // Build email -> { player_name, source_program } lookup. One email may
    // match multiple kids (siblings), so values are arrays.
    const emailToPlayers = new Map();
    const addToLookup = (email, player_name, source_program) => {
      if (!email || !player_name) return;
      const k = email.toLowerCase().trim();
      if (!k) return;
      if (!emailToPlayers.has(k)) emailToPlayers.set(k, []);
      const list = emailToPlayers.get(k);
      if (!list.some(p => p.player_name === player_name)) {
        list.push({ player_name, source_program });
      }
    };
    for (const r of eliteRosterRes.data || []) {
      addToLookup(r.parent_email, r.player_name, 'elite');
      addToLookup(r.parent2_email, r.player_name, 'elite');
      addToLookup(r.parent3_email, r.player_name, 'elite');
    }
    for (const r of jrBundooraRes.data || [])  addToLookup(r.parent_email, r.player_name, 'junior_royals');
    for (const r of jrHallamRes.data || [])    addToLookup(r.parent_email, r.player_name, 'junior_royals');
    for (const r of holidayRes.data || [])     addToLookup(r.parent_email, r.player_name, 'holiday');
    for (const r of kickstartRes.data || [])   addToLookup(r.parent_email, r.player_name, 'female_kickstart');

    const lookupPlayer = (email, program) => {
      if (!email) return null;
      const list = emailToPlayers.get(email.toLowerCase().trim());
      if (!list || !list.length) return null;
      // Prefer same-program match (siblings + multi-program parents disambiguate)
      const exact = list.find(p => p.source_program === program);
      return (exact || list[0]).player_name;
    };

    // Bucket by lowercased email.
    const members = new Map();
    const ensure = (email, seed = {}) => {
      const key = (email || '').toLowerCase().trim();
      if (!key) return null;
      if (!members.has(key)) {
        members.set(key, {
          customer_email: key,
          customer_name: '',
          customer_phone: '',
          player_name_override: null,    // set if a subsidy seeds the row
          programs: new Set(),
          program_labels: new Set(),
          payment_types: new Set(),
          total_paid_cents: 0,
          registrations: [],
          shop_orders: [],
          subsidies: [],
          first_paid_at: null,
          last_paid_at: null,
          is_subsidised: false,
        });
      }
      const m = members.get(key);
      // First non-empty name/phone wins (Stripe rows usually have them)
      if (seed.name && !m.customer_name) m.customer_name = seed.name;
      if (seed.phone && !m.customer_phone) m.customer_phone = seed.phone;
      return m;
    };

    const touchPaidWindow = (m, isoDate) => {
      if (!isoDate) return;
      if (!m.first_paid_at || isoDate < m.first_paid_at) m.first_paid_at = isoDate;
      if (!m.last_paid_at  || isoDate > m.last_paid_at)  m.last_paid_at  = isoDate;
    };

    // --- Programs ---
    for (const r of progRes.data || []) {
      const m = ensure(r.customer_email, { name: r.customer_name, phone: r.customer_phone });
      if (!m) continue;
      m.programs.add(r.program);
      if (r.program_label) m.program_labels.add(r.program_label);
      const desc = r.items?.[0]?.description || r.program_label || '';
      m.payment_types.add(detectPaymentType(desc));
      m.total_paid_cents += Number(r.amount_total_cents) || 0;
      touchPaidWindow(m, r.paid_at);
      // Resolve player_name from per-program rosters via parent email.
      // Doesn't override an explicit subsidy name; first match wins per email.
      if (!m.player_name_override) {
        const playerName = lookupPlayer(r.customer_email, r.program);
        if (playerName) m.player_name_override = playerName;
      }
      m.registrations.push({
        id: r.id, program: r.program, label: r.program_label, variant: r.program_variant,
        amount_cents: r.amount_total_cents, paid_at: r.paid_at,
        stripe_session_id: r.stripe_session_id,
      });
    }

    // --- Shop orders (training + ipl) ---
    for (const src of [shopTrainingRes.data || [], shopIplRes.data || []]) {
      for (const o of src) {
        const m = ensure(o.customer_email, { name: o.customer_name, phone: o.customer_phone });
        if (!m) continue;
        m.programs.add('shop');
        m.payment_types.add('one_off');
        m.total_paid_cents += Number(o.total) || 0;
        touchPaidWindow(m, o.paid_at);
        m.shop_orders.push({
          id: o.id, total_cents: o.total, paid_at: o.paid_at,
          stripe_session_id: o.stripe_session_id,
        });
      }
    }

    // --- Subsidies (overrides player name display) ---
    for (const s of subsidyRes.data || []) {
      const m = ensure(s.customer_email || `subsidy:${s.id}`, { name: s.customer_name, phone: s.customer_phone });
      if (!m) continue;
      m.programs.add(s.program);
      m.payment_types.add('subsidised');
      m.is_subsidised = true;
      m.player_name_override = s.player_name;
      m.subsidies.push({
        id: s.id, program: s.program, reason: s.reason, created_at: s.created_at,
      });
    }

    // Materialise into array for response.
    const rows = Array.from(members.values()).map(m => ({
      customer_email: m.customer_email,
      customer_name: m.customer_name,
      customer_phone: m.customer_phone,
      player_name: m.player_name_override,             // null unless subsidy seeded
      display_name: m.player_name_override || m.customer_name || m.customer_email,
      programs: Array.from(m.programs).sort(),
      program_labels: Array.from(m.program_labels),
      payment_types: Array.from(m.payment_types).sort(),
      total_paid_cents: m.total_paid_cents,
      first_paid_at: m.first_paid_at,
      last_paid_at: m.last_paid_at,
      is_subsidised: m.is_subsidised,
      registrations_count: m.registrations.length,
      shop_orders_count: m.shop_orders.length,
      registrations: m.registrations,
      shop_orders: m.shop_orders,
      subsidies: m.subsidies,
    }));

    // Sort by last paid desc by default.
    rows.sort((a, b) => (b.last_paid_at || '').localeCompare(a.last_paid_at || ''));

    const summary = {
      total_members: rows.length,
      paid_members: rows.filter(r => !r.is_subsidised || r.total_paid_cents > 0).length,
      subsidised_members: rows.filter(r => r.is_subsidised).length,
      by_program: rows.reduce((acc, r) => {
        for (const p of r.programs) acc[p] = (acc[p] || 0) + 1;
        return acc;
      }, {}),
      total_revenue_cents: rows.reduce((s, r) => s + r.total_paid_cents, 0),
    };

    return res.status(200).json({ ok: true, summary, rows });
  } catch (err) {
    console.error('academy-members error:', err);
    return res.status(500).json({ error: err.message });
  }
}
