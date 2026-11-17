import { describe, it, expect } from 'vitest';
import { buildAlert, auMobileDigits } from '../_lib/privateCoachingAlert.js';

const row = {
    id: '00000000-0000-4000-8000-000000000000', centre: 'ravenhall', format: '1-2', other_players: 'Sam Lee (12)',
    coach_slug: 'hamid-qadri', package_sessions: 3, price_per_session: 170, package_total: 510,
    selected_slots: [{ date: '2026-11-20', start: '17:00', end: '18:00', centre: 'ravenhall' }],
    payment_status: 'request', player_first_name: 'Test', player_last_name: 'Player', player_age: 13, focus: 'batting',
    parent_name: 'Pat Parent', email: 'pat@example.com', phone: '0412 345 678', shirt_size: '32',
};

describe('private coaching booking alert', () => {
    it('turns Australian mobiles into international digits', () => {
        expect(auMobileDigits('0412 345 678')).toBe('61412345678');
        expect(auMobileDigits('+61 412 345 678')).toBe('61412345678');
        expect(auMobileDigits('412345678')).toBe('61412345678');
        expect(auMobileDigits('')).toBe(null);
    });

    it('tells the coach who booked and gives one-tap contact links', () => {
        const a = buildAlert(row, { name: 'Hamid Qadri', email: 'coach@example.com' });
        expect(a.subject).toMatch(/New private coaching booking: Test Player/);
        expect(a.html).toContain('Hi Hamid,');
        expect(a.html).toContain('Pat Parent has booked you');
        expect(a.html).toContain('Fri, 20 Nov 5:00pm');
        expect(a.html).toContain('3 sessions × $170 = $510 incl. GST');
        expect(a.html).toContain('1-to-2 with Sam Lee (12)');
        expect(a.links.whatsapp).toMatch(/^https:\/\/wa\.me\/61412345678\?text=/);
        expect(a.links.call).toBe('tel:0412345678');
        expect(a.sms).toContain('Please contact them: 0412 345 678');
        expect(a.sms.length).toBeLessThan(320);
    });

    it('sends a booking with no coach contact on file to the Academy instead', () => {
        const a = buildAlert(row, null);
        expect(a.subject).toMatch(/no coach contact on file/);
        expect(a.html).toContain('Please pass this on');
    });

    it('escapes what the family typed', () => {
        const a = buildAlert({ ...row, notes: '<script>x</script>' }, { name: 'Hamid Qadri', email: 'c@e.com' });
        expect(a.html).not.toContain('<script>');
    });
});
