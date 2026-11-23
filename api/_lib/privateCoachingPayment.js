// ============================================================
// Royals Private Coaching — payment at booking (Andy, 18 Nov 2026: "we need to get the
// payment on the day ... choose the time of the coach and then pay for what they want").
//
// Prices come from ONE place, each coach's rate card in premiumCoachingData.js
// (rateCardFor: RATE_CARDS, else the coach type's prices), the same card the coach's profile shows, and are worked out here on the server from the saved booking. Nothing the
// browser sends is trusted for price.
//
// 1-to-2: the booker pays the whole session price (Andy: "the booker needs to pay it all,
// and the family sort it out amongst themselves"). The second player completes their own
// form (governance + shirt) before the first session: api/private-coaching-partner.js.
//
// Training shirt (CLAUDE.md): when the family said the player has no shirt, the shirt is a
// line on the same checkout ($29.95 incl. GST, size in the description) and can't be removed.
// ============================================================
import { UNIFORM_CATALOG } from './uniformPricing.js';
import { createSessions } from './privateCoachingPayouts.js';
import { COACHES, PACKAGES, CENTRES, FORMAT_LABELS, coachPrice, PROGRAM_NAME, ROUTE } from '../../src/components/premium-coaching/premiumCoachingData.js';

export const SOURCE_BOOKING = 'premium-private-coaching';
export const SOURCE_PARTNER_SHIRT = 'premium-private-coaching-partner-shirt';
export const HOLD_MINUTES = 30; // Stripe's shortest checkout expiry is 30 minutes

const cents = (dollars) => Math.round(Number(dollars) * 100);

// Booking row → Stripe line items + total, or { error } if the row can't be paid.
export const bookingCheckout = (row) => {
    const coach = COACHES.find((c) => c.slug === row.coach_slug);
    if (!coach || !coach.bookable) return { error: 'This coach can’t be booked yet.' };
    if (!PACKAGES.some((p) => p.sessions === row.package_sessions)) return { error: 'Please choose 1, 3 or 5 sessions.' };
    if (!FORMAT_LABELS[row.format]) return { error: 'Please choose 1-to-1 or 1-to-2.' };
    // The coach's own rate card, for the option the family chose (1-to-1 or 1-to-2).
    const full = coachPrice(coach, row.format, row.package_sessions);
    if (full == null) return { error: 'No price for this coach yet.' };
    // Training partner session split between the two families: each pays half.
    const share = row.format === '1-2' && Number(row.pay_share) === 2 ? 2 : 1;
    const per = Math.round((full / share) * 100) / 100;
    const slots = Array.isArray(row.selected_slots) ? row.selected_slots : [];
    // No times online for this coach yet: the family pays, tells us what suits (row.availability), and the coach sets the times.
    if (slots.length === 0 && !String(row.availability || '').trim()) return { error: 'Please tell us the days and times that suit you.' };
    if (slots.length && slots.length !== row.package_sessions) return { error: `Please choose ${row.package_sessions} session time${row.package_sessions > 1 ? 's' : ''}.` };
    if (slots.some((s) => s.centre !== row.centre)) return { error: 'All sessions must be at the same centre.' };
    if (!coach.centres.includes(row.centre)) return { error: 'This coach doesn’t coach at that centre.' };

    const centre = CENTRES.find((c) => c.slug === row.centre);
    const fmt = row.format === '1-2' ? '1-to-2' : '1-to-1';
    const items = [{
        name: `${PROGRAM_NAME}: ${coach.name}, ${FORMAT_LABELS[row.format]}${share === 2 ? ' (your half)' : ''}`,
        description: `${row.package_sessions} × one-hour ${fmt} session${row.package_sessions > 1 ? 's' : ''} at ${centre?.suburb || row.centre}, for ${row.player_first_name}. ${slots.length ? '' : 'Times to be set with your coach. '}Sessions subject to lane availability and confirmation.`,
        unit_amount: cents(per),
        quantity: row.package_sessions,
    }];
    if (row.shirt_size) {
        items.push({
            name: UNIFORM_CATALOG.shirt.label,
            description: `Size ${String(row.shirt_size).split(' ')[0]}, ordered with this booking for ${row.player_first_name}`,
            unit_amount: UNIFORM_CATALOG.shirt.priceCents,
            quantity: 1,
        });
    }
    const totalCents = items.reduce((t, i) => t + i.unit_amount * i.quantity, 0);
    return { items, totalCents, coach, per };
};

export const partnerShirtCheckout = (partner) => ({
    items: [{
        name: UNIFORM_CATALOG.shirt.label,
        description: `Size ${String(partner.shirt_size).split(' ')[0]}, for ${partner.player_first_name} (1-to-2 training partner)`,
        unit_amount: UNIFORM_CATALOG.shirt.priceCents,
        quantity: 1,
    }],
    totalCents: UNIFORM_CATALOG.shirt.priceCents,
});

export const toStripeLineItems = (items) => items.map((i) => ({
    quantity: i.quantity,
    price_data: { currency: 'aud', unit_amount: i.unit_amount, product_data: { name: i.name, description: i.description } },
}));

export const successUrl = (base, bookingId) => `${base}${ROUTE}/success?session_id={CHECKOUT_SESSION_ID}&b=${bookingId}`;
export const partnerUrl = (base, bookingId) => `${base}${ROUTE}/partner?b=${bookingId}`;

// Webhook: a checkout for this page completed. Idempotent.
export async function handlePrivateCoachingPaid(supabase, session) {
    const src = session?.metadata?.source;
    if (src === SOURCE_BOOKING) {
        const id = session.metadata.booking_id || session.client_reference_id;
        const { data: row } = await supabase.from('premium_private_coaching_requests').select('id, selected_slots, coach_slug, centre, format, package_sessions, payment_status, linked_booking_id').eq('id', id).maybeSingle();
        if (!row) return { handled: true, note: `booking ${id} not found` };
        await supabase.from('premium_private_coaching_requests').update({
            payment_status: 'paid', paid_at: new Date().toISOString(),
            amount_paid_cents: session.amount_total ?? null, stripe_session_id: session.id,
            stripe_payment_intent: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id || null,
        }).eq('id', id);
        // One row per session, for the coach's "Turned up" ticks (and payouts).
        // (A split training partner booking keeps its sessions on the first family's row.)
        if (!row.linked_booking_id) await createSessions(supabase, row);
        // The held hours are now booked.
        await supabase.from('private_coaching_availability').update({ status: 'booked', held_until: null })
            .eq('held_by', id).in('status', ['held', 'open']);
        return { handled: true, booking: id };
    }
    if (src === SOURCE_PARTNER_SHIRT) {
        const pid = session.metadata.partner_id || session.client_reference_id;
        await supabase.from('premium_private_coaching_partners').update({ shirt_paid_at: new Date().toISOString(), stripe_session_id: session.id }).eq('id', pid);
        return { handled: true, partner: pid };
    }
    return { handled: false };
}
