import { describe, it, expect } from 'vitest';
import { bookingCheckout, partnerShirtCheckout, toStripeLineItems } from '../_lib/privateCoachingPayment.js';
import { RATE_CARDS } from '../../src/components/premium-coaching/premiumCoachingData.js';

const base = {
    coach_slug: 'alex-thornhill', centre: 'cranbourne-north', format: '1-1', package_sessions: 3, player_first_name: 'Jack',
    selected_slots: [
        { date: '2026-11-20', start: '17:00', end: '18:00', centre: 'cranbourne-north' },
        { date: '2026-11-22', start: '16:00', end: '17:00', centre: 'cranbourne-north' },
        { date: '2026-11-27', start: '17:00', end: '18:00', centre: 'cranbourne-north' },
    ],
};

describe('private coaching checkout pricing (server side)', () => {
    it('Alex Thornhill 1-to-1, 3 sessions = 3 × $155, no shirt', () => {
        const out = bookingCheckout(base);
        expect(out.error).toBeUndefined();
        expect(out.items).toHaveLength(1);
        expect(out.items[0]).toMatchObject({ unit_amount: 15500, quantity: 3 });
        expect(out.totalCents).toBe(46500);
    });

    it('Alex Thornhill training partner session (1-to-2) is $190 a session', () => {
        const out = bookingCheckout({ ...base, format: '1-2' });
        expect(out.totalCents).toBe(3 * 19000);
        expect(out.items[0].name).toContain('Training partner session');
    });

    it('adds the training shirt line with the size when ordered', () => {
        const out = bookingCheckout({ ...base, shirt_size: '32' });
        expect(out.items[1]).toMatchObject({ unit_amount: 2995, quantity: 1 });
        expect(out.items[1].description).toContain('Size 32');
        expect(out.totalCents).toBe(46500 + 2995);
    });

    it('prices each coach from their own card, else the tier table', () => {
        const one = (slug, centre) => bookingCheckout({ ...base, coach_slug: slug, centre, package_sessions: 1, selected_slots: [{ ...base.selected_slots[0], centre }] });
        expect(one('siddharth-banerjee', 'cranbourne-north').totalCents).toBe(14500);
        expect(one('mihiraj-jayasekara', 'mickleham').totalCents).toBe(14500);
        expect(bookingCheckout({ ...base, coach_slug: 'rittin-raman', centre: 'mickleham', format: '1-2', package_sessions: 1, selected_slots: [{ ...base.selected_slots[0], centre: 'mickleham' }] }).totalCents).toBe(17000);
        expect(one('jinang-shah', 'ravenhall').totalCents).toBe(14000);
        const five = bookingCheckout({ ...base, coach_slug: 'jinang-shah', centre: 'ravenhall', package_sessions: 5, selected_slots: Array.from({ length: 5 }, (_, i) => ({ date: `2026-11-2${i}`, start: '17:00', centre: 'ravenhall' })) });
        expect(five.totalCents).toBe(5 * 12000);
    });

    it('refuses what the page would never send', () => {
        expect(bookingCheckout({ ...base, selected_slots: base.selected_slots.slice(0, 2) }).error).toMatch(/3 session times/);
        expect(bookingCheckout({ ...base, package_sessions: 4 }).error).toMatch(/1, 3 or 5/);
        expect(bookingCheckout({ ...base, coach_slug: 'kavya-khatri', centre: 'ravenhall' }).error).toMatch(/can’t be booked/);
        expect(bookingCheckout({ ...base, centre: 'mickleham', selected_slots: base.selected_slots.map((s) => ({ ...s, centre: 'mickleham' })) }).error).toMatch(/doesn’t coach at that centre/);
        expect(bookingCheckout({ ...base, selected_slots: [...base.selected_slots.slice(0, 2), { ...base.selected_slots[2], centre: 'ravenhall' }] }).error).toMatch(/same centre/);
    });

    it('charges the coach own rate card, per option', () => {
        const saved = RATE_CARDS['alex-thornhill'];
        RATE_CARDS['alex-thornhill'] = { '1-1': { 1: 180, 3: 170, 5: 160 }, '1-2': { 1: 220, 3: 210, 5: 200 } };
        try {
            expect(bookingCheckout({ ...base, format: '1-1' }).totalCents).toBe(3 * 17000);
            expect(bookingCheckout({ ...base, format: '1-2' }).totalCents).toBe(3 * 21000);
            expect(bookingCheckout({ ...base, format: '1-2' }).items[0].name).toContain('Training partner session');
            expect(bookingCheckout({ ...base, format: '1-3' }).error).toMatch(/1-to-1 or 1-to-2/);
        } finally { RATE_CARDS['alex-thornhill'] = saved; }
    });

    it('partner shirt is $29.95 and Stripe line items are AUD', () => {
        expect(partnerShirtCheckout({ shirt_size: '30', player_first_name: 'Sam' }).totalCents).toBe(2995);
        const li = toStripeLineItems(bookingCheckout(base).items);
        expect(li[0].price_data.currency).toBe('aud');
    });
});
