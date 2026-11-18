/* global process */
// ============================================================
// /api/private-coaching-partner — the second player in a 1-to-2 (Andy, 18 Nov 2026:
// "The second one, before they join any session or the first session, will need to fill
// out a form ... ticked all the boxes and accepted all the different elements").
//
//   GET  ?b=<booking id>  → what the partner page shows: the booked player's first name,
//                           coach, centre, first session; and whether the form is done.
//                           Only for a PAID 1-to-2 booking.
//   POST { b, player..., consents, shirt }
//                         → checks every governance box is ticked and the shirt question is
//                           answered, saves premium_private_coaching_partners, and if the
//                           player needs a shirt opens a Stripe checkout for it ($29.95).
// Service role only; the partners table has no public access.
// ============================================================
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { consentErrors, consentColumns } from '../src/lib/governance.js';
import { partnerShirtCheckout, toStripeLineItems, SOURCE_PARTNER_SHIRT } from './_lib/privateCoachingPayment.js';
import { COACHES, CENTRES, ROUTE } from '../src/components/premium-coaching/premiumCoachingData.js';

const BASE_URL = process.env.VITE_APP_URL || 'https://rramelbourne.com';
const baseFor = (req) => {
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    return host && /\.vercel\.app$/.test(host) ? `https://${host}` : BASE_URL;
};
const isId = (v) => /^[0-9a-f-]{36}$/i.test(String(v || ''));
const clean = (v, max = 200) => String(v ?? '').trim().slice(0, max);

export default async function handler(req, res) {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return res.status(503).json({ error: 'Not set up.' });
    const sb = createClient(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://pudldzgmluwoocwxtzhw.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
    const b = req.method === 'GET' ? req.query?.b : req.body?.b;
    if (!isId(b)) return res.status(400).json({ error: 'This link isn’t complete. Please ask the family who booked to send it again.' });

    const { data: booking } = await sb.from('premium_private_coaching_requests')
        .select('id, format, payment_status, coach_slug, centre, player_first_name, selected_slots').eq('id', b).maybeSingle();
    if (!booking || booking.format !== '1-2' || booking.payment_status !== 'paid') {
        return res.status(404).json({ error: 'We can’t find a paid 1-to-2 booking for this link. Please ask the family who booked to check it.' });
    }
    const { data: existing } = await sb.from('premium_private_coaching_partners').select('id, shirt_size, shirt_paid_at').eq('booking_id', b).maybeSingle();

    if (req.method === 'GET') {
        const coach = COACHES.find((c) => c.slug === booking.coach_slug);
        const first = (booking.selected_slots || []).map((s) => s.date).sort()[0] || null;
        return res.status(200).json({
            bookedFor: booking.player_first_name,
            coach: coach?.name || null,
            centre: CENTRES.find((c) => c.slug === booking.centre)?.suburb || booking.centre,
            firstSession: first,
            done: !!existing && (!existing.shirt_size || !!existing.shirt_paid_at),
            shirtOwing: !!existing && !!existing.shirt_size && !existing.shirt_paid_at,
        });
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const f = req.body || {};
    const age = parseInt(f.player_age, 10);
    const adult = Number.isFinite(age) && age >= 18;
    const problems = [];
    if (!clean(f.player_first_name) || !clean(f.player_last_name)) problems.push('Player name');
    if (!Number.isFinite(age) || age < 5 || age > 70) problems.push('Player age');
    if (!adult && !clean(f.parent_name)) problems.push('Parent or guardian name');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean(f.email))) problems.push('Email');
    if (clean(f.phone).replace(/\D/g, '').length < 8) problems.push('Mobile');
    if (!['yes', 'no'].includes(f.shirt?.has) || (f.shirt?.has === 'no' && !clean(f.shirt?.size, 20))) problems.push('Training shirt');
    if (Object.keys(consentErrors(f.consents, { adult })).length) problems.push('Agreements & Consent');
    if (problems.length) return res.status(400).json({ error: `Please complete: ${problems.join(', ')}.` });

    let partner = existing;
    if (!existing) {
        const { data, error } = await sb.from('premium_private_coaching_partners').insert([{
            booking_id: b,
            player_first_name: clean(f.player_first_name), player_last_name: clean(f.player_last_name), player_age: age,
            parent_name: clean(f.parent_name) || null, email: clean(f.email).toLowerCase(), phone: clean(f.phone),
            notes: clean(f.notes, 1000) || null,
            shirt_size: f.shirt.has === 'no' ? clean(f.shirt.size, 20) : null,
            ...consentColumns(f.consents),
        }]).select('id, shirt_size, shirt_paid_at').single();
        if (error) return res.status(500).json({ error: 'Something went wrong saving the form. Please try again.' });
        partner = data;
    }

    if (partner.shirt_size && !partner.shirt_paid_at) {
        if (!process.env.STRIPE_SECRET_KEY) return res.status(503).json({ error: 'Payments are not set up.' });
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const pay = partnerShirtCheckout({ ...partner, player_first_name: clean(f.player_first_name) || 'the player' });
        const base = baseFor(req);
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: toStripeLineItems(pay.items),
            client_reference_id: partner.id,
            customer_email: clean(f.email).toLowerCase() || undefined,
            metadata: { source: SOURCE_PARTNER_SHIRT, partner_id: partner.id, booking_id: b },
            success_url: `${base}${ROUTE}/partner?b=${b}&paid=1`,
            cancel_url: `${base}${ROUTE}/partner?b=${b}`,
        });
        return res.status(200).json({ ok: true, url: session.url });
    }
    return res.status(200).json({ ok: true, done: true });
}
