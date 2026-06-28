// ============================================================
// Vercel Serverless Function — Academy Reviews
//
//   GET  /api/reviews   -> public: list APPROVED reviews (safe display columns only)
//   POST /api/reviews   -> public: submit a review (lands as status='pending')
//
// Both the public read and the public write go through this function (service-role),
// because anon access to public.academy_reviews is fully disabled by RLS. Routing the
// read through here lets us return ONLY safe columns — reviewer_email / ip_hash and
// other admin-only fields never reach the browser. Moderation happens in the admin
// dashboard via the authenticated Supabase session (RLS 'authenticated' policies).
//
// Required env vars in Vercel:
//   VITE_SUPABASE_URL  (or SUPABASE_URL)
//   SUPABASE_SERVICE_ROLE_KEY
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const SUPABASE_URL_FALLBACK = 'https://pudldzgmluwoocwxtzhw.supabase.co';

// Columns safe to expose on the public wall. Everything else (email, ip_hash,
// suburb, admin_notes, moderation metadata) stays server-side.
const PUBLIC_COLUMNS = 'id, created_at, reviewer_name, reviewer_role, program, rating, title, body, featured';

let _supabase = null;
const getSupabase = () => {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || SUPABASE_URL_FALLBACK;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in Vercel env vars');
  _supabase = createClient(url, key, { auth: { persistSession: false } });
  return _supabase;
};

const setCors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const clip = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : v);

const hashIp = (req) => {
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || '';
  if (!ip) return null;
  return createHash('sha256').update(ip + '|rra-reviews').digest('hex').slice(0, 32);
};

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  // ---------- Public read: approved reviews only ----------
  if (req.method === 'GET') {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('academy_reviews')
        .select(PUBLIC_COLUMNS)
        .eq('status', 'approved')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) {
        console.error('Reviews read error', error);
        return res.status(500).json({ error: 'Failed to load reviews' });
      }

      const reviews = data || [];
      const count = reviews.length;
      const average = count
        ? Math.round((reviews.reduce((s, r) => s + (r.rating || 0), 0) / count) * 10) / 10
        : null;

      // Cache at the edge — reviews change rarely and only via moderation.
      res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');
      return res.status(200).json({ ok: true, reviews, count, average });
    } catch (e) {
      console.error('Reviews GET handler error', e);
      return res.status(500).json({ error: e.message || 'Unknown error' });
    }
  }

  // ---------- Public write: submit a review (pending) ----------
  if (req.method === 'POST') {
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }

    // Honeypot — bots fill this hidden field; humans never do.
    if (body.hp_website && String(body.hp_website).trim().length > 0) {
      return res.status(201).json({ ok: true, hp: true }); // pretend success
    }

    const reviewer_name = clip(body.reviewer_name, 80);
    const reviewText = clip(body.body, 2000);
    const rating = Number.parseInt(body.rating, 10);

    if (!reviewer_name) return res.status(400).json({ error: 'Please add your name.' });
    if (!reviewText || reviewText.length < 10) {
      return res.status(400).json({ error: 'Please write at least a sentence.' });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Please choose a star rating from 1 to 5.' });
    }
    if (body.reviewer_email && (String(body.reviewer_email).length > 120 || !String(body.reviewer_email).includes('@'))) {
      return res.status(400).json({ error: 'That email looks invalid.' });
    }

    const row = {
      reviewer_name,
      reviewer_role: clip(body.reviewer_role, 40) || null,
      program: clip(body.program, 80) || null,
      rating,
      title: clip(body.title, 120) || null,
      body: reviewText,
      reviewer_email: clip(body.reviewer_email, 120) || null,
      suburb: clip(body.suburb, 80) || null,
      consent_publish: body.consent_publish === true || body.consent_publish === 'true',
      ip_hash: hashIp(req),
      status: 'pending',
      source: 'web',
      utm_source: clip(body.utm_source, 80) || null,
      utm_medium: clip(body.utm_medium, 80) || null,
      utm_campaign: clip(body.utm_campaign, 80) || null,
      page_referrer: clip(body.page_referrer, 300) || null,
    };

    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('academy_reviews')
        .insert(row)
        .select('id, status')
        .single();

      if (error) {
        console.error('Reviews insert error', error);
        return res.status(500).json({ error: 'Could not save your review. Please try again.' });
      }
      return res.status(201).json({ ok: true, id: data.id, status: data.status });
    } catch (e) {
      console.error('Reviews POST handler error', e);
      return res.status(500).json({ error: e.message || 'Unknown error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
