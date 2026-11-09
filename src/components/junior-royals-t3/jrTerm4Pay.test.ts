import { describe, it, expect } from 'vitest';
import { JR_T4, PAY_OPTIONS, PRICE, WEEKLY_LINK, GROUPS, groupFor, ROYALS_WAY, nextSession, sessionLong, lastSessionLine, bookingOpen, breakLine } from './jrTerm4Data';
import { existsSync } from 'node:fs';
import { classifyJrT4 } from '../../../api/stripe-webhook.js';

// Alex, 19 Oct 2026: the official Term 4 payment options.
describe('Junior Royals Term 4 payments', () => {
    // Andy, 8 Nov 2026: join any week, the weekly subscription is the only way to pay.
    it('offers only the weekly subscription: $44.95 a week, $29.95 shirt, incl. GST', () => {
        expect(PRICE).toEqual({ weekly: 44.95, shirt: 29.95 });
        expect(Object.keys(PAY_OPTIONS)).toEqual(['weekly']);
        expect(PAY_OPTIONS.weekly.link).toBe(WEEKLY_LINK);
        expect(PAY_OPTIONS.weekly.detail).toContain('one each week while sessions are running');
        expect(JR_T4.priceLine).toBe('$44.95 a week, incl. GST. Join any week and pay week by week: no upfront term fee.');
        expect(JR_T4.shirtLine).toContain('$29.95 incl. GST');
        expect(JSON.stringify({ JR_T4, PAY_OPTIONS })).not.toMatch(/\$349|8 weeks|Term 4/);
    });

    it('joins at the next session; each centre has its own last session before Christmas', () => {
        const [mick, crn] = JR_T4.centres;
        expect(lastSessionLine(mick)).toBe('The last session before the Christmas break is Monday 14 December.');
        expect(lastSessionLine(crn)).toBe('The last session before the Christmas break is Wednesday 16 December.');
        // Sunday 8 Nov: next Mickleham Monday is the 9th, next Cranbourne Wednesday the 11th.
        const sun = new Date('2026-11-08T12:00:00+11:00');
        expect(sessionLong(nextSession(mick, sun))).toBe('Monday 9 November');
        expect(sessionLong(nextSession(crn, sun))).toBe('Wednesday 11 November');
        // Booking on a session night before 5pm still joins that night.
        expect(sessionLong(nextSession(mick, new Date('2026-11-09T16:00:00+11:00')))).toBe('Monday 9 November');
        expect(sessionLong(nextSession(mick, new Date('2026-11-09T18:00:00+11:00')))).toBe('Monday 16 November');
        expect(nextSession(mick, new Date('2026-12-14T18:00:00+11:00'))).toBeNull();
        expect(sessionLong(nextSession(crn, new Date('2026-12-14T18:00:00+11:00')))).toBe('Wednesday 16 December');
        expect(JR_T4.benefits.map((b) => b.head)).toContain('Join any week');
    });

    // 9 Nov 2026: the weekly direct debit starts the day a family pays, so the form must not
    // send anyone to Stripe once their centre has no session left before the break.
    it('stops taking bookings at each centre after its last session before the break', () => {
        const [mick, crn] = JR_T4.centres;
        expect(bookingOpen(mick, new Date('2026-12-14T16:59:00+11:00'))).toBe(true);
        expect(bookingOpen(mick, new Date('2026-12-14T17:01:00+11:00'))).toBe(false);
        expect(bookingOpen(crn, new Date('2026-12-14T17:01:00+11:00'))).toBe(true);
        expect(bookingOpen(crn, new Date('2026-12-16T17:01:00+11:00'))).toBe(false);
        expect(breakLine(mick)).toBe("Mondays at Mickleham are on the Christmas break, so we're not taking bookings or payments for now. Email info@rramelbourne.com and we'll tell you when sessions restart.");
    });

    // "automatic enrolment into the next term (opt out) … we will be in touch to confirm.
    // Direct debits will be cancelled at the end of the term and restart at the beginning."
    // Alex, 9 Nov 2026: "payments are paused but you keep your spot."
    it('over the holiday breaks payments pause and the player keeps their spot; opt out by email', () => {
        const all = JR_T4.renewLines.join(' ');
        expect(JR_T4.renewTitle).toBe('Holiday breaks: payments pause, you keep your spot');
        expect(all).toContain('your weekly payments are paused but you keep your spot');
        expect(all).toContain('aren\'t charged for the weeks with no sessions');
        expect(all).toContain('be in touch');
        expect(all).toContain('at least 2 weeks before sessions restart');
        expect(PAY_OPTIONS.weekly.detail).toContain('direct debit');
        expect(PAY_OPTIONS.weekly.detail).toContain('payments are paused and you keep your spot');
    });

    // Alex, 20 Oct 2026: another night can be requested — standby, no payment.
    it('a different night is a standby request with no payment', () => {
        const mick = JR_T4.centres.find((c) => c.value === 'mickleham');
        expect(JR_T4.request.why(mick)).toBe("Junior Royals at Mickleham runs on Mondays, 5:00pm – 7:00pm, for now, and we're filling those sessions first.");
        expect(JR_T4.request.note).toContain('No payment is taken');
        expect(JR_T4.request.done('Sam', 'Tuesday', mick)).toContain("we'll contact you first");
        expect(JR_T4.days).toEqual(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
    });

    // Alex, 19 Oct 2026: "I want to move Mickleham TO mondays 5-7pm" (26 Oct – 14 Dec).
    it('Mickleham runs Mondays and Cranbourne North Wednesdays, both 5:00pm – 7:00pm', () => {
        const t = Object.fromEntries(JR_T4.centres.map((c) => [c.value, [c.day, c.times, c.firstDate, c.lastDate]]));
        expect(t).toEqual({
            mickleham: ['monday', '5:00pm – 7:00pm', '2026-10-26', '2026-12-14'],
            'cranbourne-north': ['wednesday', '5:00pm – 7:00pm', '2026-10-28', '2026-12-16'],
        });
        // Every session date really falls on that centre's night.
        for (const c of JR_T4.centres) {
            for (const d of [c.firstDate, c.lastDate]) expect(sessionLong(new Date(`${d}T17:00:00+11:00`)).toLowerCase()).toContain(c.day);
        }
        expect(JR_T4.factLine).toContain('Mondays at Mickleham, Wednesdays at Cranbourne North');
        expect('monday' in JR_T4).toBe(false); // no Monday enquiry any more
    });

    it('the webhook files both products as Junior Royals Term 4, by plan', () => {
        expect(classifyJrT4([{ description: 'Rajasthan Royals Academy Term 4 Junior Royals - One-Off Payment' }, { description: 'Rajasthan Royals Academy Training Shirt (Participant Price)' }]))
            .toMatchObject({ program: 'junior_royals', program_variant: 'term_4_upfront' });
        expect(classifyJrT4([{ description: 'Rajasthan Royals Academy Term 4 Junior Royals - Weekly Payment' }]))
            .toMatchObject({ program_variant: 'term_4_weekly' });
        expect(classifyJrT4([{ description: '2026 Junior Royals Program - Term 3: Hallam' }])).toBeNull();
    });

    // Alex, 20 Oct 2026: "be clearer about the 5pm group and 6pm group"; 5pm = 7–9, 6pm = 10–12.
    it('puts ages 7–9 in the 5pm group and 10–12 in the 6pm group', () => {
        expect(GROUPS.map((g) => [g.key, g.time, g.ages])).toEqual([
            ['5pm', '5:00pm – 6:00pm', '7–9'],
            ['6pm', '6:00pm – 7:00pm', '10–12'],
        ]);
        expect([7, 8, 9].map((a) => groupFor(a)?.key)).toEqual(['5pm', '5pm', '5pm']);
        expect([10, 11, 12, '12'].map((a) => groupFor(a)?.key)).toEqual(['6pm', '6pm', '6pm', '6pm']);
        expect(groupFor(6)).toBeNull();
        expect(groupFor(13)).toBeNull();
        expect(groupFor('')).toBeNull();
        // Every age the form offers has a group.
        for (let a = JR_T4.ageMin; a <= JR_T4.ageMax; a += 1) expect(groupFor(a)).not.toBeNull();
        expect(JR_T4.groupsLine).toBe('Two one-hour groups by age: ages 7–9 train 5:00pm – 6:00pm, and ages 10–12 train 6:00pm – 7:00pm.');
        expect(JR_T4.centres.every((c) => c.groups === JR_T4.groupsLine)).toBe(true);
        expect(JR_T4.request.done('Liam', 'Tuesday', JR_T4.centres[0], GROUPS[0]))
            .toContain("Liam's request for Tuesday nights, 5:00pm – 6:00pm (the ages 7–9 group), at the Mickleham Indoor Sports Centre");
    });

    // Alex, 21 Oct 2026: the live page shows the Royals Way and badges, in the email's words.
    it('describes the Royals Way the way the Term 4 email does, with real badge artwork', () => {
        expect(ROYALS_WAY.lead).toBe('Junior Royals now runs on the Royals Way Progress Tracking and Development System. Every player has clear goals that build their cricket from the foundations up, through three phases: Discover, Develop and Elevate.');
        expect(ROYALS_WAY.steps.map((s) => s.body).join(' ')).toContain('they earn its badge and move on to the next one');
        expect(ROYALS_WAY.phases.map((p) => p.phase)).toEqual(['Discover', 'Develop', 'Elevate']);
        for (const p of ROYALS_WAY.phases) expect(existsSync(`public${p.img}`)).toBe(true);
        expect(ROYALS_WAY.note).toContain('never ranked');
        expect(JSON.stringify(ROYALS_WAY)).not.toMatch(/portal|guarantee/i);
    });
});
