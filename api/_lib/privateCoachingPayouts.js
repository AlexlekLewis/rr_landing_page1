// Royals Private Coaching: sessions and payouts (Andy, 22 Nov 2026).
//
// The family pays the whole booking upfront. When the coach ticks "Turned up" for a
// session, that session's payouts are released: the coach's pay and the venue's lane hire,
// each a Stripe Connect transfer to the payee's own Stripe account (when connected; until
// then the payout waits as 'pending'). The Academy keeps the rest.
//
// Amounts come ONLY from private_coaching_payout_rates in the database. Nothing about
// pay is written in this repo (it is public).

// Paid booking → one session row per session (dates from the agreed times, if any).
export const sessionRowsFor = (b) => Array.from({ length: Number(b.package_sessions) || 0 }, (_, i) => {
    const s = Array.isArray(b.selected_slots) ? b.selected_slots[i] : null;
    return {
        booking_id: b.id, seq: i + 1, coach_slug: b.coach_slug, centre: b.centre, format: b.format,
        session_date: s?.date || null, start_time: s?.start ? `${String(s.start).slice(0, 5)}:00` : null,
    };
});

// Which rates apply to a session: every non-null field on the rule must match.
// One amount per payee (the most specific rule wins).
export const payoutsFor = (session, rates) => {
    const best = new Map();
    for (const r of rates) {
        if (r.active === false) continue;
        if (r.coach_slug && r.coach_slug !== session.coach_slug) continue;
        if (r.centre && r.centre !== session.centre) continue;
        if (r.format && r.format !== session.format) continue;
        const score = (r.coach_slug ? 1 : 0) + (r.centre ? 1 : 0) + (r.format ? 1 : 0);
        const cur = best.get(r.payee_slug);
        if (!cur || score > cur.score) best.set(r.payee_slug, { payee_slug: r.payee_slug, amount_cents: r.amount_cents, score });
    }
    return [...best.values()].map(({ payee_slug, amount_cents }) => ({ payee_slug, amount_cents }));
};

export async function createSessions(sb, booking) {
    const rows = sessionRowsFor(booking);
    if (rows.length) await sb.from('private_coaching_sessions').upsert(rows, { onConflict: 'booking_id,seq', ignoreDuplicates: true });
}

// The charge the family paid with, so each transfer is funded by it (source_transaction).
async function chargeFor(stripe, booking) {
    let pi = booking.stripe_payment_intent;
    if (!pi && booking.stripe_session_id) pi = (await stripe.checkout.sessions.retrieve(booking.stripe_session_id)).payment_intent;
    if (!pi) return null;
    const intent = await stripe.paymentIntents.retrieve(typeof pi === 'string' ? pi : pi.id);
    return intent.latest_charge || null;
}

// Attended session → payout rows, then a transfer for each payee with a Stripe account.
// Safe to call again: rows are unique per session+payee and transfers use idempotency keys.
export async function releasePayouts(sb, stripe, sessionId) {
    const { data: s } = await sb.from('private_coaching_sessions').select('*').eq('id', sessionId).maybeSingle();
    if (!s || s.status !== 'attended') return { released: [] };
    const { data: rates } = await sb.from('private_coaching_payout_rates').select('*').eq('active', true);
    const lines = payoutsFor(s, rates || []);
    if (lines.length) {
        await sb.from('private_coaching_payouts').upsert(lines.map((l) => ({ ...l, session_id: s.id })), { onConflict: 'session_id,payee_slug', ignoreDuplicates: true });
    }
    const { data: payouts } = await sb.from('private_coaching_payouts').select('*').eq('session_id', s.id).neq('status', 'transferred');
    if (!payouts?.length || !stripe) return { released: [], pending: payouts?.length || 0 };

    const { data: booking } = await sb.from('premium_private_coaching_requests').select('id, stripe_session_id, stripe_payment_intent, player_first_name').eq('id', s.booking_id).maybeSingle();
    const { data: payees } = await sb.from('private_coaching_payees').select('slug, stripe_account_id').in('slug', payouts.map((p) => p.payee_slug));
    const acct = Object.fromEntries((payees || []).map((p) => [p.slug, p.stripe_account_id]));
    let charge = null;
    const released = [];
    for (const p of payouts) {
        if (!acct[p.payee_slug]) continue; // not connected yet: stays pending
        try {
            if (charge === null) charge = (await chargeFor(stripe, booking)) || undefined;
            const params = {
                amount: p.amount_cents, currency: 'aud', destination: acct[p.payee_slug],
                transfer_group: `pc-${s.booking_id}`,
                description: `Royals Private Coaching: session ${s.seq} for ${booking?.player_first_name || 'player'}, ${s.session_date || ''}`.trim(),
                metadata: { session_id: s.id, booking_id: s.booking_id, payee: p.payee_slug },
            };
            let t;
            try {
                // Funded by the family's own payment where possible…
                t = await stripe.transfers.create({ ...params, source_transaction: charge }, { idempotencyKey: `pc-payout-${p.id}` });
            } catch (e) {
                // …else (e.g. a half-share payment smaller than the payout) from the Academy balance.
                if (!charge) throw e;
                t = await stripe.transfers.create(params, { idempotencyKey: `pc-payout-${p.id}-bal` });
            }
            await sb.from('private_coaching_payouts').update({ status: 'transferred', stripe_transfer_id: t.id, transferred_at: new Date().toISOString(), error: null }).eq('id', p.id);
            released.push(p.payee_slug);
        } catch (e) {
            await sb.from('private_coaching_payouts').update({ status: 'failed', error: String(e.message).slice(0, 500) }).eq('id', p.id);
        }
    }
    return { released };
}
