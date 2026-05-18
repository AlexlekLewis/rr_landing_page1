// ============================================================
// Vercel Serverless Function — India Tour 2026 Intake Submission
// POST /api/india-tour-intake
//
// Public endpoint that accepts the intake-form JSON from
// https://rramelbourne.com/india-tour-intake.html and inserts
// a new row into public.india_tour_2026_travellers using the
// service-role key (server-side only — never exposed to client).
//
// This route exists because anon writes are globally restricted
// on this Supabase project; going through a serverless function
// lets us accept submissions without weakening RLS.
//
// Required env vars in Vercel:
//   VITE_SUPABASE_URL  (or SUPABASE_URL)
//   SUPABASE_SERVICE_ROLE_KEY
// ============================================================

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL_FALLBACK = 'https://pudldzgmluwoocwxtzhw.supabase.co';

let _supabase = null;
const getSupabase = () => {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL
           || process.env.VITE_SUPABASE_URL
           || SUPABASE_URL_FALLBACK;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in Vercel env vars');
  _supabase = createClient(url, key, { auth: { persistSession: false } });
  return _supabase;
};

// Fields that are safe to copy straight from the request body to the DB row.
// Everything else is ignored. Adding a new field requires updating this list.
const ALLOWED_FIELDS = [
  'role',
  'surname', 'given_names', 'other_names', 'dob', 'gender',
  'pob_city', 'pob_country', 'nationality', 'prev_nationality',
  'religion', 'id_marks', 'education', 'occupation', 'marital_status',
  'passport_no', 'passport_type', 'passport_country', 'passport_place',
  'passport_issue', 'passport_expiry',
  'address_street', 'address_suburb', 'address_state', 'address_postcode',
  'address_country', 'mobile', 'email',
  'father_name', 'father_nationality', 'father_prev_nationality', 'father_pob',
  'mother_name', 'mother_nationality', 'mother_prev_nationality', 'mother_pob',
  'spouse_name', 'spouse_nationality',
  'countries_10y', 'saarc_3y', 'visa_refused_details',
  'medical', 'medications', 'allergies', 'blood_group', 'diet', 'diet_notes',
  'medicare', 'private_health', 'gp_name', 'gp_phone', 'vaccinations',
  'ec1_name', 'ec1_relationship', 'ec1_mobile', 'ec1_alt', 'ec1_email', 'ec1_hours',
  'ec2_name', 'ec2_relationship', 'ec2_mobile', 'ec2_alt', 'ec2_email', 'ec2_hours',
  'ff_program', 'ff_number', 'meal', 'seat', 'kit_size', 'kit_notes',
  'p1_name', 'p1_relationship', 'p1_nationality', 'p1_id', 'p1_mobile', 'p1_email',
  'p2_name', 'p2_relationship', 'p2_nationality', 'p2_id', 'p2_mobile', 'p2_email',
  'wwcc_number', 'wwcc_expiry', 'wwcc_state',
  'sig_name', 'sig_date', 'sig_name2', 'sig_date2',
];

// Date-typed columns. Empty strings here cause Postgres to error,
// so we strip them before sending.
const DATE_FIELDS = ['dob', 'passport_issue', 'passport_expiry', 'wwcc_expiry', 'sig_date', 'sig_date2'];

const setCors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // same-origin in prod; keep open for now
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  // Honeypot — bots fill this; humans don't
  if (body.hp_website && String(body.hp_website).trim().length > 0) {
    // Pretend success so the bot moves on
    return res.status(201).json({ ok: true, hp: true });
  }

  // Validate minimum required fields
  const required = ['traveller_type', 'given_names', 'surname', 'email'];
  const missing = required.filter((f) => !body[f] || String(body[f]).trim().length === 0);
  if (missing.length) {
    return res.status(400).json({ error: 'Missing required fields', fields: missing });
  }

  // traveller_type from form is 'minor'/'adult' (radio value) OR 'player'/'staff' (canonical)
  const ttype = body.traveller_type === 'minor' ? 'player'
              : body.traveller_type === 'adult' ? 'staff'
              : (body.traveller_type === 'player' || body.traveller_type === 'staff')
                  ? body.traveller_type
                  : null;
  if (!ttype) return res.status(400).json({ error: 'Invalid traveller_type' });

  // Sanity guards
  if (String(body.given_names).length > 80) return res.status(400).json({ error: 'given_names too long' });
  if (String(body.surname).length > 80) return res.status(400).json({ error: 'surname too long' });
  if (String(body.email).length > 120 || !String(body.email).includes('@')) {
    return res.status(400).json({ error: 'invalid email' });
  }

  const nowIso = new Date().toISOString();
  const row = {
    traveller_type: ttype,
    status: 'intake_complete',
    intake_started_at: nowIso,
    intake_completed_at: nowIso,
  };

  ALLOWED_FIELDS.forEach((f) => {
    const v = body[f];
    if (v === undefined || v === null) return;
    if (typeof v === 'string' && v.trim().length === 0 && DATE_FIELDS.includes(f)) return; // skip empty dates
    if (typeof v === 'string' && v.trim().length === 0) return;
    row[f] = v;
  });

  if (body.visa_refused === 'yes' || body.visa_refused === true) row.visa_refused = true;
  if (body.visa_refused === 'no' || body.visa_refused === false) row.visa_refused = false;

  // Consent timestamps from boolean checkboxes
  if (body.c_conduct)       row.consent_conduct_at = nowIso;
  if (body.c_medical)       row.consent_medical_at = nowIso;
  if (body.c_medical_minor) row.consent_medical_minor_at = nowIso;
  if (body.c_media)         row.consent_media_at = nowIso;
  if (body.c_privacy)       row.consent_privacy_at = nowIso;

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('india_tour_2026_travellers')
      .insert(row)
      .select('id, given_names, surname, traveller_type, status, intake_completed_at')
      .single();

    if (error) {
      console.error('Supabase insert error', error);
      return res.status(500).json({ error: 'Database insert failed', detail: error.message });
    }

    // If the form included uploaded file paths, create matching document rows.
    // The actual files live in storage bucket "india-tour-passports" — file_url stores the path within the bucket.
    const uploads = body.uploads && typeof body.uploads === 'object' ? body.uploads : {};
    const UPLOAD_TO_DOC_TYPE = {
      passport_bio:   'passport_scan',
      passport_photo: 'passport_photo',
      parent1_id:     'parent1_id',
      parent2_id:     'parent2_id',
    };
    const docRows = Object.entries(uploads)
      .filter(([k, v]) => v && typeof v === 'string' && UPLOAD_TO_DOC_TYPE[k])
      .map(([k, path]) => ({
        traveller_id: data.id,
        doc_type:     UPLOAD_TO_DOC_TYPE[k],
        status:       'received',
        file_url:     path,
        received_at:  nowIso,
      }));

    let documents_created = 0;
    if (docRows.length) {
      const { error: docErr } = await supabase.from('india_tour_2026_documents').insert(docRows);
      if (docErr) {
        // Don't fail the whole submission — the traveller row is in, just log the doc issue.
        console.error('Document insert error', docErr);
      } else {
        documents_created = docRows.length;
      }
    }

    return res.status(201).json({ ok: true, id: data.id, traveller: data, documents_created });
  } catch (e) {
    console.error('Handler error', e);
    return res.status(500).json({ error: e.message || 'Unknown error' });
  }
}
