/* global process */
// ============================================================
// Royals Private Coaching: the pay link a coach sends a family (Andy, 22 Nov 2026,
// coach-led flow). Page: /private-coaching/pay?b=<booking id>.
//
// GET  ?b=…  → what was agreed (coach, centre, sessions, times, price) + the details the
//              coach already entered, so the family only checks and completes them.
// POST { b, player_first_name, player_last_name, player_age, parent_name, email, phone,
//        shirt: { has, size }, consents: { accept_* } }
//            → refuses unless all governance boxes are ticked (CLAUDE.md) and the shirt
//              question is answered, saves them on the booking, then opens Stripe
//              Checkout (training shirt line added when ordered). The webhook marks it
//              paid and the coach is emailed (notify-private-coaching-bookings.js).
// ============================================================
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { consentErrors, consentColumns } from '../src/lib/governance.js';
import { shirtError, shirtTag, needsShirt } from '../src/lib/kit/trainingShirt.js';
import { bookingCheckout, toStripeLineItems, successUrl, SOURCE_BOOKING } from './_lib/privateCoachingPayment.js';
import { COACHES, CENTRES, FORMAT_LABELS, ROUTE } from '../src/components/premium-coaching/premiumCoachingData.js';

const BASE_URL = process.env.VITE_APP_URL || 'https://rramelbourne.com';
const baseFor = (req) => {
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    return host && /\.vercel\.app$/.test(host) ? `https://${host}` : BASE_URL;
};
const TABLE = 'premium_private_coaching_requests';
const clean = (v, n = 120) => String(v ?? '').trim().slice(0, n);

// The family's answers → { errors } or { update } for the booking row.
export const payDetails = (b) => {
    const errors = {};
    const age = parseInt(b.player_age, 10);
    const adult = Number.isFinite(age) && age >= 18;
    if (!clean(b.player_first_name)) errors.player_first_name = 'Please enter the player’s first name.';
    if (!clean(b.player_last_name)) errors.player_last_name = 'Please enter the player’s last name.';
    if (!Number.isFinite(age) || age < 5 || age > 70) errors.player_age = 'Please enter the player’s age.';
    if (!adult && !clean(b.parent_name)) errors.parent_name = 'Please enter a parent or guardian name.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean(b.email, 200))) errors.email = 'Please enter a valid email address.';
    if (String(b.phone || '').replace(/\D/g, '').length < 8) errors.phone = 'Please enter a valid phone number.';
    const se = shirtError(b.shirt);
    if (se) errors.shirt = se;
    Object.assign(errors, consentErrors(b.consents || {}, { adult }));
    if (Object.keys(errors).length) return { errors };
    return {
        update: {
            player_first_name: clean(b.player_first_name), player_last_name: clean(b.player_last_name), player_age: age,
            parent_name: clean(b.parent_name) || null, email: clean(b.email, 200).toLowerCase(), phone: clean(b.phone, 40),
            shirt_size: needsShirt(b.shirt) ? b.shirt.size : null,
            source: `premium-private-coaching|coach${shirtTag(b.shirt)}`,
            ...consentColumns(b.consents),
        },
    };
};

export default async function handler(req, res) {
    const id = String((req.method === 'GET' ? req.query?.b : req.body?.b) || '');
    if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error: 'This link isn’t right. Please ask your coach to send it again.' });
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return res.status(503).json({ error: 'Payments are not set up yet.' });
    const sb = createClient(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://pudldzgmluwoocwxtzhw.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data: row } = await sb.from(TABLE).select('*').eq('id', id).maybeSingle();
    // Pay links are only for bookings a coach recorded; the confirmation page reads any paid booking.
    if (!row || (row.created_by !== 'coach' && !(req.method === 'GET' && row.payment_status === 'paid'))) {
        return res.status(404).json({ error: 'We couldn’t find this booking. Please ask your coach to send the link again.' });
    }
    const coach = COACHES.find((c) => c.slug === row.coach_slug);
    const centre = CENTRES.find((c) => c.slug === row.centre);
    const expired = row.payment_status !== 'paid' && row.pay_expires_at && new Date(row.pay_expires_at) < new Date();

    if (req.method === 'GET') {
        const pay = bookingCheckout(row);
        // Once paid, the confirmation page shows the coach's contact details.
        let contact = null;
        if (row.payment_status === 'paid') {
            const { data: c } = await sb.from('private_coaching_coaches').select('name, mobile, email').eq('coach_slug', row.coach_slug).eq('active', true).maybeSingle();
            if (c && (c.mobile || c.email)) contact = { mobile: c.mobile || null, email: c.email || null };
        }
        return res.status(200).json({
            contact, amountPaidCents: row.amount_paid_cents, shirtSize: row.shirt_size, createdBy: row.created_by,
            id: row.id, paid: row.payment_status === 'paid', expired,
            coach: { slug: coach?.slug, name: coach?.name, img: coach?.img },
            centre: { name: centre?.name, suburb: centre?.suburb, address: centre?.address },
            format: row.format, formatLabel: FORMAT_LABELS[row.format], share: row.pay_share, partner: row.other_players,
            sessions: row.package_sessions, per: pay.per ?? row.price_per_session, totalCents: pay.totalCents ?? null,
            times: row.selected_slots || [], timesNote: row.availability,
            details: {
                player_first_name: row.player_first_name, player_last_name: row.player_last_name, player_age: row.player_age || '',
                parent_name: row.parent_name || '', email: row.email, phone: row.phone,
            },
        });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (row.payment_status === 'paid') return res.status(409).json({ error: 'This booking is already paid. Thank you!' });
    if (expired) return res.status(410).json({ error: 'This pay link has expired. Please ask your coach for a new one.' });
    if (!process.env.STRIPE_SECRET_KEY) return res.status(503).json({ error: 'Payments are not set up yet.' });

    const out = payDetails(req.body || {});
    if (out.errors) return res.status(400).json({ error: 'Please check the items marked in red.', errors: out.errors });
    const updated = { ...row, ...out.update };
    const pay = bookingCheckout(updated.selected_slots?.length ? updated : { ...updated, availability: updated.availability || 'Agreed with coach' });
    if (pay.error) return res.status(400).json({ error: pay.error });
    await sb.from(TABLE).update({ ...out.update, payment_status: 'sent_to_stripe' }).eq('id', id);

    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const base = baseFor(req);
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: toStripeLineItems(pay.items),
            client_reference_id: id,
            customer_email: updated.email,
            metadata: { source: SOURCE_BOOKING, booking_id: id, coach: row.coach_slug, centre: row.centre, sessions: String(row.package_sessions), created_by: 'coach' },
            payment_intent_data: { transfer_group: `pc-${row.linked_booking_id || id}`, metadata: { booking_id: id } },
            success_url: successUrl(base, id),
            cancel_url: `${base}${ROUTE}/pay?b=${id}&cancelled=1`,
        });
        await sb.from(TABLE).update({ stripe_session_id: session.id }).eq('id', id);
        return res.status(200).json({ url: session.url });
    } catch (e) {
        console.error('pay checkout failed', e.message);
        return res.status(502).json({ error: 'Payment could not start. Please try again.' });
    }
}
