// ============================================================
// Vercel Serverless Function — Reclassify a program registration
// POST /api/reclassify-registration
// Body: { id, new_program, reason? }
// ============================================================
// ADMIN-ONLY. Updates program_registrations.program in place AND
// writes a row to reclassification_audit so the change is reversible
// and traceable. Cross-table moves (program <-> shop) are intentionally
// out of scope here — they're rare and require re-pulling Stripe data.
//
// new_program must be one of: elite | junior_royals | holiday | female_kickstart
//
// Required env vars in Vercel:
//   SUPABASE_SERVICE_ROLE_KEY
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { verifyAdmin } from './_lib/verifyAdmin.js';

const SUPABASE_URL_FALLBACK = 'https://pudldzgmluwoocwxtzhw.supabase.co';
const ALLOWED_PROGRAMS = new Set(['elite', 'junior_royals', 'holiday', 'female_kickstart']);

let _supabase = null;
const getSupabase = () => {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || SUPABASE_URL_FALLBACK;
  _supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY);
  return _supabase;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let admin;
  try {
    admin = await verifyAdmin(req);
  } catch (err) {
    const isAuth = err.code === 'AUTH';
    return res.status(isAuth ? 401 : 500).json({ error: err.message });
  }

  const { id, new_program, reason } = req.body || {};
  if (!id) return res.status(400).json({ error: 'id required' });
  if (!ALLOWED_PROGRAMS.has(new_program)) {
    return res.status(400).json({ error: `new_program must be one of ${Array.from(ALLOWED_PROGRAMS).join(', ')}` });
  }

  try {
    const sb = getSupabase();

    const { data: before, error: readErr } = await sb
      .from('program_registrations')
      .select('id, program, program_variant, program_label, customer_name, customer_email, stripe_session_id')
      .eq('id', id)
      .single();
    if (readErr || !before) return res.status(404).json({ error: 'registration not found' });

    if (before.program === new_program) {
      return res.status(200).json({ ok: true, unchanged: true, message: `Already classified as ${new_program}` });
    }

    const { error: updErr } = await sb
      .from('program_registrations')
      .update({ program: new_program })
      .eq('id', id);
    if (updErr) throw new Error(`update failed: ${updErr.message}`);

    const { error: auditErr } = await sb.from('reclassification_audit').insert({
      performed_by: admin.email,
      source_table: 'program_registrations',
      source_row_id: id,
      stripe_session_id: before.stripe_session_id || null,
      field_before: { program: before.program, program_variant: before.program_variant, program_label: before.program_label },
      field_after: { program: new_program },
      reason: reason || null,
    });
    if (auditErr) {
      // Roll back the program change to keep the audit log honest.
      await sb.from('program_registrations').update({ program: before.program }).eq('id', id);
      throw new Error(`audit insert failed (rolled back): ${auditErr.message}`);
    }

    return res.status(200).json({
      ok: true,
      from: before.program,
      to: new_program,
      customer: before.customer_name,
      stripe_session_id: before.stripe_session_id,
    });
  } catch (err) {
    console.error('reclassify-registration error:', err);
    return res.status(500).json({ error: err.message });
  }
}
