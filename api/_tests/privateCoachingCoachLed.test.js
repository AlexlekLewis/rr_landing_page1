import { describe, it, expect } from 'vitest';
import { payoutsFor, sessionRowsFor } from '../_lib/privateCoachingPayouts.js';
import { coachBookingRow } from '../private-coaching-coach.js';
import { payDetails } from '../private-coaching-pay.js';
import { validateEnquiry } from '../private-coaching-enquiry.js';
import { bookingCheckout } from '../_lib/privateCoachingPayment.js';
import { COACHES } from '../../src/components/premium-coaching/premiumCoachingData.js';

const alex = COACHES.find((c) => c.slug === 'alex-thornhill');
// Example rules only (real amounts live in the database).
const RATES = [
    { payee_slug: 'coach-x', coach_slug: 'alex-thornhill', format: '1-1', amount_cents: 1000 },
    { payee_slug: 'coach-x', coach_slug: 'alex-thornhill', format: '1-2', amount_cents: 2000 },
    { payee_slug: 'venue-x', centre: 'hallam', amount_cents: 500 },
    { payee_slug: 'venue-y', centre: 'mickleham', amount_cents: 700 },
];

describe('payouts on "Turned up"', () => {
    it('pays the coach for the format and the venue for the centre', () => {
        expect(payoutsFor({ coach_slug: 'alex-thornhill', centre: 'hallam', format: '1-2' }, RATES))
            .toEqual([{ payee_slug: 'coach-x', amount_cents: 2000 }, { payee_slug: 'venue-x', amount_cents: 500 }]);
    });
    it('pays nobody it should not', () => {
        expect(payoutsFor({ coach_slug: 'someone-else', centre: 'ravenhall', format: '1-1' }, RATES)).toEqual([]);
    });
    it('one session row per session, dates when agreed', () => {
        const rows = sessionRowsFor({ id: 'b', package_sessions: 3, coach_slug: 'alex-thornhill', centre: 'hallam', format: '1-1', selected_slots: [{ date: '2026-12-01', start: '17:00' }] });
        expect(rows).toHaveLength(3);
        expect(rows[0]).toMatchObject({ seq: 1, session_date: '2026-12-01', start_time: '17:00:00' });
        expect(rows[2]).toMatchObject({ seq: 3, session_date: null });
    });
});

describe('coach records a booking', () => {
    const base = { centre: 'hallam', format: '1-1', sessions: 3, player_first_name: 'Jack', email: 'a@b.co', phone: '0412345678', times: [{ date: '2026-12-01', start: '17:00' }, { date: '2026-12-08', start: '17:00' }, { date: '2026-12-15', start: '17:00' }] };
    it('prices from the coach card', () => {
        const { row } = coachBookingRow(alex, base);
        expect(row).toMatchObject({ created_by: 'coach', package_total: 465, price_per_session: 155, pay_share: 1 });
        expect(row.selected_slots).toHaveLength(3);
    });
    it('splits a training partner session: half each, one row per family', () => {
        const out = coachBookingRow(alex, { ...base, format: '1-2', split: true, partner_first_name: 'Sam', partner_email: 's@b.co', partner_phone: '0412000000' });
        expect(out.row).toMatchObject({ pay_share: 2, price_per_session: 95, package_total: 285 });
        expect(out.partnerRow).toMatchObject({ player_first_name: 'Sam', email: 's@b.co' });
        expect(bookingCheckout(out.row).totalCents).toBe(28500);
    });
    it('refuses a centre the coach does not coach at, or no times', () => {
        expect(coachBookingRow(alex, { ...base, centre: 'mickleham' }).error).toBeTruthy();
        expect(coachBookingRow(alex, { ...base, times: [] }).error).toMatch(/times/);
    });
});

describe('pay link: governance boxes and shirt are required', () => {
    const ok = { player_first_name: 'Jack', player_last_name: 'Lee', player_age: '12', parent_name: 'Pat', email: 'a@b.co', phone: '0412345678', shirt: { has: 'yes', size: '' },
        consents: { accept_terms: true, accept_player_code: true, accept_parent_code: true, accept_social_media: true } };
    it('accepts a complete form', () => { expect(payDetails(ok).update).toMatchObject({ accept_terms: true, accept_social_media: true, shirt_size: null }); });
    it('refuses any missing box', () => {
        expect(payDetails({ ...ok, consents: { ...ok.consents, accept_player_code: false } }).errors).toHaveProperty('accept_player_code');
        expect(payDetails({ ...ok, consents: {} }).errors).toHaveProperty('accept_terms');
    });
    it('refuses an unanswered shirt question', () => { expect(payDetails({ ...ok, shirt: { has: '' } }).errors).toHaveProperty('shirt'); });
});

describe('Book now enquiry', () => {
    it('needs name, email, phone, suburb', () => {
        expect(validateEnquiry({ coach: 'alex-thornhill', parent_name: 'Pat', email: 'a@b.co', phone: '0412345678', suburb: 'Berwick' })).toEqual({});
        expect(Object.keys(validateEnquiry({ coach: 'nobody' }))).toEqual(['coach', 'parent_name', 'email', 'phone', 'suburb']);
    });
});
