import { describe, it, expect } from 'vitest';
import { bookingCheckout, partnerShirtCheckout, toStripeLineItems } from '../_lib/privateCoachingPayment.js';

const base = {
    coach_slug: 'alex-thornhill', centre: 'cranbourne-north', format: '1-1', package_sessions: 3, player_first_name: 'Jack',
    selected_slots: [
        { date: '2026-11-20', start: '17:00', end: '18:00', centre: 'cranbourne-north' },
        { date: '2026-11-22', start: '16:00', end: '17:00', centre: 'cranbourne-north' },
        { date: '2026-11-27', start: '17:00', end: '18:00', centre: 'cranbourne-north' },
    ],
};

describe('private coaching checkout pricing (server side)', () => {
    it('Elite Coach, 3 sessions = 3 × $170, no shirt', () => {
        const out = bookingCheckout(base);
        expect(out.error).toBeUndefined();
        expect(out.items).toHaveLength(1);
        expect(out.items[0]).toMatchObject({ unit_amount: 17000, quantity: 3 });
        expect(out.totalCents).toBe(51000);
    });

    it('1-to-2 costs the same as 1-to-1 (the booker pays it all)', () => {
        expect(bookingCheckout({ ...base, format: '1-2' }).totalCents).toBe(51000);
    });

    it('adds the training shirt line with the size when ordered', () => {
        const out = bookingCheckout({ ...base, shirt_size: '32' });
        expect(out.items[1]).toMatchObject({ unit_amount: 2995, quantity: 1 });
        expect(out.items[1].description).toContain('Size 32');
        expect(out.totalCents).toBe(51000 + 2995);
    });

    it('prices Performance and Academy Coaches from the same table', () => {
        const one = (slug, centre) => bookingCheckout({ ...base, coach_slug: slug, centre, package_sessions: 1, selected_slots: [{ ...base.selected_slots[0], centre }] });
        expect(one('harkirat-bajwa', 'cranbourne-north').totalCents).toBe(16000);
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

    it('partner shirt is $29.95 and Stripe line items are AUD', () => {
        expect(partnerShirtCheckout({ shirt_size: '30', player_first_name: 'Sam' }).totalCents).toBe(2995);
        const li = toStripeLineItems(bookingCheckout(base).items);
        expect(li[0].price_data.currency).toBe('aud');
    });
});
