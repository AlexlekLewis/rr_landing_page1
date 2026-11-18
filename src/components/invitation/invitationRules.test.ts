import { describe, it, expect } from 'vitest';
// @ts-ignore plain JS modules
import { validate, buildRows, ageFromDob, EMPTY_FORM, emptyPlayer } from './invitationRules.js';
// @ts-ignore
import { INVITATIONS } from './invitations.js';

const TODAY = new Date(2026, 10, 17);
const child = { ...emptyPlayer(), first_name: 'Arjun', last_name: 'Sharma', dob: '2014-03-02', experience: 'club', club_name: 'Caroline Springs CC' };
const good = {
    ...EMPTY_FORM, attendee_type: 'child', contact_name: 'Priya Sharma', email: ' Priya@Example.com ', phone: '0400 000 000',
    in_australia: 'yes', in_melbourne: 'yes', suburb: 'Caroline Springs', postcode: '3023', accept_terms: true,
};

describe('invitation list form', () => {
    it('works out age from a date of birth', () => {
        expect(ageFromDob('2014-03-02', TODAY)).toBe(12);
        expect(ageFromDob('2014-11-18', TODAY)).toBe(11);
        expect(ageFromDob('2014-02-31', TODAY)).toBeNull();
        expect(ageFromDob('', TODAY)).toBeNull();
    });

    it('accepts a complete form', () => {
        expect(validate(good, [child], TODAY)).toEqual({});
    });

    it('blocks an empty form, one message per missing answer', () => {
        const e = validate(EMPTY_FORM, [emptyPlayer()], TODAY);
        for (const k of ['attendee_type', 'p0_first_name', 'p0_last_name', 'p0_dob', 'p0_experience', 'email', 'phone', 'in_australia', 'accept_terms']) {
            expect(e[k], k).toBeTruthy();
        }
    });

    it('will not let an under-18 register as "me"', () => {
        const e = validate({ ...good, attendee_type: 'self' }, [child], TODAY);
        expect(e.p0_dob).toMatch(/parent or guardian/);
    });

    it('asks Australians for suburb and a 4-digit postcode, and overseas families for country and city', () => {
        expect(validate({ ...good, postcode: '30' }, [child], TODAY).postcode).toBeTruthy();
        expect(validate({ ...good, in_melbourne: '' }, [child], TODAY).in_melbourne).toBeTruthy();
        const overseas = { ...good, in_australia: 'no', in_melbourne: '', postcode: '', suburb: '', country: '' };
        const e = validate(overseas, [child], TODAY);
        expect(e.country).toBeTruthy();
        expect(e.suburb).toBeTruthy();
        expect(e.postcode).toBeUndefined();
    });

    it('saves one row per player, sharing the contact details and submission id', () => {
        const sibling = { ...child, first_name: 'Meera', dob: '2016-07-09', experience: 'new', club_name: '' };
        const rows = buildRows('ravenhall-opening-session', good, [child, sibling], { submissionId: 'abc', attribution: { utm_source: 'instagram' } });
        expect(rows).toHaveLength(2);
        expect(rows[0]).toMatchObject({
            campaign: 'ravenhall-opening-session', submission_id: 'abc', attendee_type: 'child',
            player_first_name: 'Arjun', contact_name: 'Priya Sharma', email: 'priya@example.com',
            lives_in_australia: true, lives_in_melbourne: true, country: 'Australia', suburb: 'Caroline Springs', postcode: '3023',
            accept_terms: true, utm_source: 'instagram',
        });
        expect(rows[1].player_first_name).toBe('Meera');
        expect(rows[1].club_name).toBeNull();
        // The form must never set the staff columns: the database refuses the row if it does.
        for (const r of rows) for (const k of ['status', 'invited_at', 'staff_notes']) expect(k in r).toBe(false);
    });

    it('uses the player as the contact when an adult registers themself', () => {
        const adult = { ...child, dob: '1998-01-01' };
        const [row] = buildRows('x', { ...good, attendee_type: 'self', contact_name: '' }, [adult], { submissionId: 'abc' });
        expect(row.contact_name).toBe('Arjun Sharma');
    });
});

describe('invitation campaigns', () => {
    it('every campaign has a unique slug and route, and says an invitation is not guaranteed', () => {
        const slugs = INVITATIONS.map((c: any) => c.slug);
        const routes = INVITATIONS.map((c: any) => c.route);
        expect(new Set(slugs).size).toBe(slugs.length);
        expect(new Set(routes).size).toBe(routes.length);
        for (const c of INVITATIONS as any[]) {
            expect(c.route.startsWith('/invite')).toBe(false); // /invite returns 410 Gone (vercel.json)
            expect(c.how.notice.title).toMatch(/does not guarantee/i);
            expect(c.success.reminder).toMatch(/does not guarantee/i);
        }
    });

    it('Ravenhall: says no dates are set, so nobody asks "when am I doing it?" (Andy, 18 Nov 2026)', () => {
        const c: any = INVITATIONS[0];
        expect(c.how.dates.title).toMatch(/no dates yet/i);
        expect(c.facts.find((f: any) => f.label === 'When').value).toMatch(/not set yet/i);
        expect(c.success.body).toMatch(/no session dates yet/i);
    });

    it('Ravenhall: the venue is named the way Andy asked (17 Nov 2026)', () => {
        const text = JSON.stringify(INVITATIONS[0]);
        expect(text).toContain("Ravenhall, in Melbourne's West, in conjunction with M9 Sports Centre");
        // M9 is only ever "in conjunction with": the venue is called Ravenhall.
        expect(text.match(/M9/g)).toHaveLength(1);
    });
});
