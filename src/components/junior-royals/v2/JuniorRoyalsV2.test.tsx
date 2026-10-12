import { describe, it, expect } from 'vitest';
import { PRICE, SHIRT, NOTICE_WEEKS, PHASES, SESSION, CURRICULUM, BADGES, wednesdays2027, timeForAge } from './jrV2Facts';
import * as CONTENT from './jrV2Content';
import { termTotal, yearTotal, TERMS, V2_CENTRES, DAYS, MIN_DAYS } from './jrV2Content';
import { FORM_VALUES } from './JRV2Form';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Badge, hasArt } from './JRV2Badges';
import { JR_V2_SEO, JR_V2_JSONLD, JR_SEO_VENUES } from './jrV2Seo';
import { CENTRES } from '../juniorRoyalsData';

// Junior Royals mock-up v2, restructured 9 Oct 2026 (Alex): one price, $49.95 a
// week paid weekly in term; compulsory shirt at $29.95 (free for the first 20);
// no bulk discounts; no stage ages; Ravenhall coming soon; 2+ weekday choices.
describe('price (Alex, 9 Oct)', () => {
    it('one price: $49.95 a week, up to 6 per lane (+1 make-up), shirt $29.95', () => {
        expect(PRICE).toEqual({ perWeek: 49.95, perLane: 6, max: 7 });
        expect(SHIRT).toEqual({ memberPrice: 29.95, shopPrice: 62.95, freeForFirst: 20 });
        expect(NOTICE_WEEKS).toBe(2);
    });

    it('term and year totals are the weekly price × weeks', () => {
        expect(termTotal(10)).toBe(499.5);
        expect(termTotal(11)).toBe(549.45);
        expect(yearTotal()).toBe(1998);
        expect(TERMS.every((t) => t.sessions > 0)).toBe(true);
        expect(TERMS[0].label).toBe('Term 4, 2026');
    });

    it('no bulk / pay-ahead discounts and no group-size options left in the copy', () => {
        const text = JSON.stringify(CONTENT);
        expect(text).not.toMatch(/(pay|paid|paying)( the year| \d terms?)? ahead|save 10%|save 15%|Groups of [46]|Junior Royals [46]s/i);
    });

    it('the compulsory shirt sits next to every headline price (no drip pricing)', () => {
        expect(CONTENT.HERO.shirt).toMatch(/\$29\.95/);
        expect(CONTENT.HERO.shirt).toMatch(/compulsory/);
        expect(CONTENT.PRICES.shirt).toMatch(/\$29\.95/);
    });
});

describe('the program facts', () => {
    it('three stages, two goals each — and no ages on the stages (Alex, 9 Oct)', () => {
        expect(PHASES.map((p) => p.name)).toEqual(['Discover', 'Develop', 'Elevate']);
        PHASES.forEach((p) => {
            expect(p.canDo).toHaveLength(2);
            expect(p).not.toHaveProperty('ages');
            expect(p).not.toHaveProperty('min');
        });
        // "from age 10" is the Performance Squads invitation age (blueprint, 9 Oct), not a stage age.
        expect(JSON.stringify(CURRICULUM)).not.toMatch(/\bat (9|11|13)\b|ages? (7|8|9|11|12)\b|\d–\d/i);
    });

    it('the session is 60 minutes, 20 batting, 20 bowling', () => {
        const mins = (k: string) => SESSION.filter((s) => s.kind === k).reduce((n, s) => n + s.to - s.from, 0);
        expect(SESSION[SESSION.length - 1].to).toBe(60);
        expect(mins('bat')).toBe(20);
        expect(mins('bowl')).toBe(20);
    });

    it('2027 has 52 weeks: 40 with sessions, 12 holidays', () => {
        const w = wednesdays2027();
        expect(w).toHaveLength(52);
        expect(w.filter((x) => x.term).length).toBe(40);
    });
});

describe('progress system and stages', () => {
    it('every stage has topics for batting, bowling and fielding, and things to work towards', () => {
        PHASES.forEach((p) => {
            const c = CURRICULUM[p.key];
            ['batting', 'bowling', 'fielding', 'byTheEnd'].forEach((k) => expect(c[k].length, `${p.key}.${k}`).toBeGreaterThan(0));
            expect(c.certificate).toMatch(new RegExp(`completed (${p.name}|Junior Royals)`));
        });
        expect(JSON.stringify(CURRICULUM)).not.toMatch(/passed|failed/i);
    });

    it('28 badges a year: one batting + one bowling per block (12 blocks) + 4 fielding', () => {
        expect(BADGES.perYear).toEqual({ batting: 12, bowling: 12, fielding: 4 });
        expect(BADGES.check).toEqual({ good: 4, of: 6, nights: 2 });
    });

    it('every Discover badge has its own artwork: 12 batting, 12 bowling, 4 fielding (Alex, 11 Oct)', () => {
        const d = BADGES.discover;
        expect(d).toHaveLength(28);
        expect(new Set(d.map((b) => b.name)).size).toBe(28);
        (['bat', 'bowl', 'field'] as const).forEach((k, i) => expect(d.filter((b) => b.kind === k)).toHaveLength([12, 12, 4][i]));
        d.forEach((b) => expect(hasArt(b.name), `no artwork for "${b.name}"`).toBe(true));
    });

    // Alex, 12 Oct: a 10-year-old must be able to tell which skill a badge is for.
    // The pictures were checked blind (no names) before this; these guards keep
    // every badge drawing, keep its name on the ribbon, and stop two badges
    // ending up as the same picture.
    it('every badge draws its own picture and carries its name on the ribbon', () => {
        const art = (svg: string) => svg.replace(/id="[^"]*"|url\(#[^)]*\)|aria-label="[^"]*"/g, '');
        const plain = BADGES.discover.map((b) => renderToStaticMarkup(createElement(Badge, { name: b.name, kind: b.kind })));
        plain.forEach((svg, i) => expect(svg.length, `"${BADGES.discover[i].name}" drew almost nothing`).toBeGreaterThan(900));
        expect(new Set(plain.map(art)).size).toBe(28);
        BADGES.discover.forEach((b) => {
            const svg = renderToStaticMarkup(createElement(Badge, { name: b.name, kind: b.kind, ribbon: true }));
            expect(svg).toContain(b.name.toUpperCase().replace(/&/g, '&amp;'));
        });
    });

    it('the four action cards each have a short summary (the detail opens on hover or tap)', () => {
        expect(CONTENT.LEARN.parts).toHaveLength(4);
        CONTENT.LEARN.parts.forEach((p) => { expect(p.summary.length).toBeGreaterThan(20); expect(p.summary.length).toBeLessThan(90); });
    });

    it('the value is spelled out for the player and for the parent', () => {
        [CONTENT.VALUE.player, CONTENT.VALUE.parent].forEach((col) => {
            expect(col.points.length).toBeGreaterThanOrEqual(4);
            col.points.forEach((pt) => { expect(pt.head).toBeTruthy(); expect(pt.body).toBeTruthy(); });
        });
    });

    // Alex, 12 Oct: "don't make up your own language if you haven't got it."
    // The Why and the Royals Way lines are quoted from the blueprint (Part I) and
    // the verified Sid profile; these guards stop a drafted line creeping back in.
    it('says who the Royals are, what the Royals Way is and where it leads, in the blueprint’s own words', () => {
        const text = (v: unknown): string => (Array.isArray(v) ? v.map(text).join('') : typeof v === 'object' && v ? (v as { text: string }).text : String(v));
        expect(text(CONTENT.VALUE.lead)).toMatch(/^Junior Royals is cricket coaching the Royals Way for players aged 7 to 12\./);
        const royals = CONTENT.VALUE.royals.items.map((it) => text(it.a)).join(' ');
        expect(CONTENT.VALUE.royals.items).toHaveLength(4);
        expect(royals).toContain('Rajasthan Royals in India’s IPL');
        expect(royals).toContain('through games, with one clear skill to learn');
        expect(royals).toContain('first six years of the Royals Player Pathway');
        expect(royals).toContain('by invitation only');
        const all = JSON.stringify(CONTENT);
        expect(all).not.toMatch(/our own coaching method|presented by|mastered/i);
        expect(all).not.toMatch(/Confirm wording|to be confirmed|to be approved|to be added/i);
    });

    it('the system has its name, and the page makes no unprovable superlatives (CLAUDE.md §2)', () => {
        expect(CONTENT.PROGRESS.title).toBe('The Royals Way Progress Tracking and Development System');
        expect(JSON.stringify(CONTENT)).not.toMatch(/second to none|unique|world-class|best in|only academy/i);
    });
});

describe('the interest form', () => {
    it('sends only these values (the database must accept every one; add each to the watchdog)', () => {
        expect(FORM_VALUES).toEqual({
            centre: ['mickleham', 'cranbourne-north', 'ravenhall'],
            preferred_days: ['mon', 'tue', 'wed', 'thu', 'fri'],
            preferred_time: ['6pm', '7pm'],
        });
    });

    // Alex, 12 Oct: "6 p.m. is any player between the ages of seven and nine … and
    // 7pm are players between the ages of 10 and 12." The time is never asked.
    it('session time is set by age: 6:00pm for 7 to 9, 7:00pm for 10 to 12', () => {
        expect([7, 8, 9].map((a) => timeForAge(a)?.time)).toEqual(['6:00pm', '6:00pm', '6:00pm']);
        expect([10, 11, 12].map((a) => timeForAge(a)?.time)).toEqual(['7:00pm', '7:00pm', '7:00pm']);
        expect(timeForAge(6)).toBeNull();
        expect(timeForAge(13)).toBeNull();
        expect(CONTENT.TIME_LINES).toEqual(['6:00pm: players aged 7 to 9', '7:00pm: players aged 10 to 12']);
        expect(JSON.stringify(CONTENT.HERO)).toContain('6:00pm: players aged 7 to 9');
        expect(JSON.stringify(CONTENT.FORM)).not.toMatch(/timeChoices|Either/);
    });

    // Alex, 12 Oct: "The language should actually be enrol once, pay every term, on a
    // subscription." A family enrols once; the page never says "enrol for a term".
    it('says enrol once, pay every term, on a subscription, in the same words everywhere', () => {
        const line = CONTENT.SUBSCRIPTION_LINE;
        expect(line).toMatch(/^Enrol once, pay .*every term, on a subscription\.$/);
        const all = JSON.stringify(CONTENT);
        expect(all.split(line).length - 1).toBeGreaterThanOrEqual(4);   // the constant, hero, price steps, FAQ
        expect(all).not.toMatch(/enrol for (a|the) (whole )?term|term-by-term/i);
    });

    // Alex, 12 Oct: "Make sure it's clear … that re-enrolments are automatic. First
    // payment comes out the day of the first session of the term."
    it('says re-enrolment is automatic and when the first payment is taken, in the steps and the FAQ', () => {
        expect(CONTENT.AUTO_RENEW_LINE).toMatch(/^Re-enrolment is automatic\./);
        expect(CONTENT.FIRST_PAYMENT_LINE).toContain('on the day of your player’s first session of each term');
        const steps = JSON.stringify(CONTENT.PRICES.how);
        const faqs = JSON.stringify(CONTENT.FAQS);
        [CONTENT.AUTO_RENEW_LINE, CONTENT.FIRST_PAYMENT_LINE, CONTENT.STOP_LINE].forEach((line) => {
            expect(steps).toContain(line);
            expect(faqs).toContain(line);
        });
        expect(CONTENT.FAQS.map((f) => f.q)).toContain('Do we need to enrol again each term?');
        expect(JSON.stringify(CONTENT)).not.toMatch(/week 1 of each term/i);
    });

    // Alex, 12 Oct: clearer badges, the learning process around them, why we track,
    // and the Player Performance Portal ("where they'll receive their digital
    // badges and digital certificates … also keeps record of their journey with
    // the Royals"). He did not recognise the Benchmark Game, so it is off the page.
    it('progress section: five steps to a badge, why we track, and the portal; no Benchmark Game', () => {
        const P = CONTENT.PROGRESS;
        expect(P.steps.map((st) => st.name)).toEqual(['Learn it', 'Own it', 'Use it', 'The coach checks it', 'The badge is earned']);
        expect(P.why.length).toBeGreaterThanOrEqual(4);
        // Alex, 12 Oct: the badges carry "a sense of accomplishment" and "feel self-confident as they develop and grow their game".
        expect(P.feel).toMatch(/sense of accomplishment/);
        expect(P.feel).toMatch(/feel self-confident as they develop and grow their game/);
        expect(P.why[0].head).toBe('A sense of accomplishment');
        expect(CONTENT.PORTAL_NAME).toBe('Player Performance Portal');
        const portal = [P.portal.lead, ...P.portal.points].join(' ');
        expect(portal).toContain('gets access to the Player Performance Portal');
        expect(portal).toContain('digital badges');
        expect(portal).toContain('digital certificate');
        expect(portal).toContain('record of your player’s time with the Royals');
        // What a visitor can read: a tbc() value shows its text, never its review note.
        const shown = (v: unknown): string => {
            if (v == null || typeof v === 'function') return '';
            if (typeof v !== 'object') return String(v);
            if (Array.isArray(v)) return v.map(shown).join(' ');
            const o = v as Record<string, unknown>;
            return o.tbc ? String(o.text) : Object.values(o).map(shown).join(' ');
        };
        const pageCopy = shown({ ...CONTENT, OPEN_QUESTIONS_V2: undefined });
        expect(pageCopy).not.toMatch(/Benchmark|progress card/i);
        expect(JSON.stringify(JR_V2_JSONLD)).not.toMatch(/Benchmark|progress card/i);
    });

    // Alex, 12 Oct: the hero was too crowded. It goes straight to who it is for,
    // when, where and group size: no "why" line, no second button, no side links.
    it('the hero is lean: who, when (with the two times), where, groups, price', () => {
        const hero = CONTENT.HERO as Record<string, unknown>;
        expect(hero.why).toBeUndefined();
        expect(hero.returning).toBeUndefined();
        expect(CONTENT.HERO.titleSub).toBe('Cricket coaching for players aged 7 to 12');
        expect(CONTENT.HERO.facts.map((f) => f.k)).toEqual(['When', 'Where', 'Groups']);
        expect(JSON.stringify(hero).split(/\s+/).length).toBeLessThan(95);
    });

    it('asks for at least 2 weekdays, Monday to Friday', () => {
        expect(MIN_DAYS).toBe(2);
        expect(DAYS.map((d) => d.label)).toEqual(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
    });

    it('Ravenhall is shown as coming soon, at its real address', () => {
        const r = V2_CENTRES.find((c) => c.value === 'ravenhall')!;
        expect(r.comingSoon).toBe(true);
        expect(r.address).toBe('5/65 Eucumbene Drive, Ravenhall VIC 3023');
    });
});

describe('search and structured data', () => {
    it('title ≤ 60 and description ≤ 155 characters, both saying Melbourne', () => {
        expect(JR_V2_SEO.title.length).toBeLessThanOrEqual(60);
        expect(JR_V2_SEO.description.length).toBeLessThanOrEqual(155);
        expect(JR_V2_SEO.descriptionUndated.length).toBeLessThanOrEqual(155);
        expect(JR_V2_SEO.title).toMatch(/Melbourne/);
        expect(JR_V2_SEO.description).toMatch(/Melbourne/);
    });

    it('venue addresses match the centres shown on the page', () => {
        JR_SEO_VENUES.forEach((v) => {
            const c = CENTRES.find((x) => x.value === v.id)!;
            expect(c.address).toBe(`${v.street}, ${v.locality} VIC ${v.postcode}`);
        });
    });

    it('no prices in the structured data until joining opens, and no retired centres', () => {
        const json = JSON.stringify(JR_V2_JSONLD);
        expect(json).not.toMatch(/"offers"/);
        expect(json).not.toMatch(/Hallam|Williamstown/i);
        expect(() => JSON.parse(json)).not.toThrow();
    });
});

describe('copy rules (CLAUDE.md §2, language.md)', () => {
    // The shared centre records (V2_CENTRES) carry data fields the page never shows.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { V2_CENTRES: _c, RAVENHALL: _r, ...copy } = CONTENT;
    const text = JSON.stringify(copy);
    it('no banned sales words, no retired centres, no "8 weeks" note', () => {
        expect(text).not.toMatch(/\b(investment|essential|premium|economy|world-class|unlock|journey|tailored|bespoke|limited time|act now|from just|while stocks last)\b/i);
        expect(text).not.toMatch(/Hallam|Williamstown/i);
        expect(text).not.toMatch(/North Melbourne/); // an inner suburb; Mickleham is "Melbourne's north"
        expect(text).not.toMatch(/8 Wednesdays|8-week|8 weeks|8 sessions/i);
    });
    it('never promises selection, the same coach, or app notes', () => {
        // "the same coaching team" is fine; "the same coach(es)" is a promise we can't keep.
        expect(text).not.toMatch(/guarantee(d)? (a )?(place|selection)|same coach(es)?\b|app notes/i);
    });
});
