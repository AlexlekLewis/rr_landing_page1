import { describe, it, expect } from 'vitest';
import { PRICE, SHIRT, NOTICE_WEEKS, PHASES, SESSION, CURRICULUM, BADGES, wednesdays2027, timeForAge, COME_AND_TRY, tryTime, SAMPLE_BADGES } from './jrV2Facts';
import { TRY_VALUES } from './JRV2ComeAndTry';
import { PhaseBadge, hasSampleArt } from './JRV2SampleBadges';
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
    it('says re-enrolment is automatic and when the first payment is taken, in the terms pop-up and the FAQ', () => {
        expect(CONTENT.AUTO_RENEW_LINE).toMatch(/^Re-enrolment is automatic\./);
        expect(CONTENT.FIRST_PAYMENT_LINE).toContain('on the day of your player’s first session of each term');
        const terms = JSON.stringify(CONTENT.TERMS_POPUP);
        const faqs = JSON.stringify(CONTENT.FAQS);
        [CONTENT.AUTO_RENEW_LINE, CONTENT.FIRST_PAYMENT_LINE, CONTENT.STOP_LINE].forEach((line) => {
            expect(terms).toContain(line);
            expect(faqs).toContain(line);
        });
        expect(CONTENT.FAQS.map((f) => f.q)).toContain('Do we need to enrol again each term?');
        expect(JSON.stringify(CONTENT)).not.toMatch(/week 1 of each term/i);
    });

    // Alex, 12 Oct: "how enrolment works needs to be replaced by graphics", with the
    // terms-and-conditions detail (cancellation fee and so on) in a pop-up.
    it('enrolment is a five-step graphic; the detail is in the terms pop-up', () => {
        const flow = CONTENT.PRICES.flow;
        expect(flow.map((st) => st.head)).toEqual(['Enrol once', 'First payment', 'Then weekly', 'School holidays', 'Next term']);
        flow.forEach((st) => expect(st.body.split(/\s+/).length).toBeLessThanOrEqual(10));      // a caption, not a paragraph
        expect(flow[4].body).toBe('Re-enrolment is automatic.');
        expect((CONTENT.PRICES as Record<string, unknown>).how).toBeUndefined();
        // the one line that stays on the page says how to stop and that a fee exists
        expect(CONTENT.PRICES.stopShort).toMatch(/at least 2 weeks before the next term/);
        expect(CONTENT.PRICES.stopShort).toMatch(/cancellation fee/);
        const heads = CONTENT.TERMS_POPUP.items.map((it) => it.head);
        expect(heads).toEqual(expect.arrayContaining(['Automatic re-enrolment', 'Stopping', 'Cancellation fee', 'Missed sessions', 'If your coach is away']));
        expect(JSON.stringify(CONTENT.TERMS_POPUP)).toContain('Australian Consumer Law');
    });

    // Alex, 12 Oct: clearer badges, the learning process around them, why we track,
    // and the Player Performance Portal ("where they'll receive their digital
    // badges and digital certificates … also keeps record of their journey with
    // the Royals"). He did not recognise the Benchmark Game, so it is off the page.
    it('progress section: five steps to a badge, why we track, and the portal; no Benchmark Game', () => {
        const P = CONTENT.PROGRESS;
        // Alex: "they train on a skill and once they … demonstrate that they can do that
        // skill, they get a badge and then they move on to the next one. Or they might
        // revisit it later."
        expect(P.steps.map((st) => st.head)).toEqual(['Train on one skill', 'Show the skill', 'Earn the badge', 'Move to the next skill']);
        expect(P.steps[0].body).toBe('For 3 weeks: learn it, own it, use it.');
        expect(P.steps[1].body).toContain('4 good balls out of 6, in 2 different sessions');
        expect(P.steps[3].body).toMatch(/come back to a skill later/);
        expect(P.lead).toMatch(/trains on one skill at a time/);
        expect(P.lead).toMatch(/earn its badge and move on to the next skill/);
        // The parent's question: "am I going to get what I ask for?"
        expect(P.whyTitle).toBe('How you know your player is getting what you pay for');
        expect(P.why.length).toBeGreaterThanOrEqual(4);
        // Alex, 12 Oct: the badges carry "a sense of accomplishment" and "feel self-confident as they develop and grow their game".
        const feel = P.why.map((w) => w.body).join(' ');
        expect(feel).toMatch(/sense of accomplishment/);
        expect(feel).toMatch(/self-confidence as they develop and grow their game/);
        // …and the healthy language: every player at their own rate.
        expect(feel).toMatch(/Every player develops differently\. Players grow and explore the game at their own rate\./);
        expect(CONTENT.PORTAL_NAME).toBe('Player Performance Portal');
        const portal = [P.portal.lead, ...P.portal.points.map((pt) => pt.text), P.portal.own].join(' ');
        expect(portal).toContain('gets access to the Player Performance Portal');
        expect(portal).toContain('digital badges');
        expect(portal).toContain('certificates');
        // parents can track progress, and it is the player's own development
        expect(portal).toContain('You can track your player’s progress');
        expect(portal).toContain('grow and explore the game at their own rate');
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

    // Alex, 12 Oct: "make it clear that every phase has an X number of badges and
    // we need to be clear on the three phases." His word is "phase", not "stage".
    it('three phases, 28 badges in each, 84 in all; the page says "phase", never "stage"', () => {
        expect(PHASES.map((p) => p.name)).toEqual(['Discover', 'Develop', 'Elevate']);
        expect(BADGES.perPhase).toEqual({ batting: 12, bowling: 12, fielding: 4 });
        expect(CONTENT.PHASE_BADGES).toBe(28);
        expect(BADGES.discover).toHaveLength(CONTENT.PHASE_BADGES);
        // "really all we're saying is that there are three core phases and there are 28 badges per phase"
        expect(CONTENT.PROGRESS.phasesLine.join('')).toBe('Three core phases: Discover, Develop and Elevate. 28 badges in every phase.');
        expect(CONTENT.PATH.phaseLabel(0)).toBe('Phase 1 of 3');
        const shown = (v: unknown): string => {
            if (v == null || typeof v === 'function') return '';
            if (typeof v !== 'object') return String(v);
            if (Array.isArray(v)) return v.map(shown).join(' ');
            const o = v as Record<string, unknown>;
            return o.tbc ? String(o.text) : Object.values(o).map(shown).join(' ');
        };
        expect(shown({ ...CONTENT, OPEN_QUESTIONS_V2: undefined }) + shown(PHASES) + shown(CURRICULUM)).not.toMatch(/\bstages?\b/i);
    });

    // Alex, 12 Oct: a pop-up to "register for free come and try day for the new
    // program": parent name, player name, player age, a day, email and mobile;
    // Mickleham only for now; Monday 5pm and 6pm, Wednesday 6pm and 7pm, the
    // younger players first.
    it('free come and try day: Mickleham only, two days, time set by age', () => {
        expect(COME_AND_TRY.centre).toBe('mickleham');
        expect(COME_AND_TRY.days.map((d) => d.label)).toEqual(['Monday', 'Wednesday']);
        expect([7, 9, 10, 12].map((a) => tryTime('mon', a)?.time)).toEqual(['5:00pm', '5:00pm', '6:00pm', '6:00pm']);
        expect([7, 9, 10, 12].map((a) => tryTime('wed', a)?.time)).toEqual(['6:00pm', '6:00pm', '7:00pm', '7:00pm']);
        expect(tryTime('mon', 6)).toBeNull();
        expect(tryTime('mon', 13)).toBeNull();
        expect(TRY_VALUES).toEqual({ centre: ['mickleham'], day: ['mon', 'wed'], session_time: ['5pm', '6pm', '7pm'], player_age: [7, 8, 9, 10, 11, 12] });
        expect(CONTENT.TRY.title).toBe('Free come and try day');
        expect(CONTENT.TRY.where).toContain('Mickleham only, for now');
        expect(CONTENT.TRY.dayLines).toEqual([
            'Monday: 5:00pm for players aged 7 to 9, 6:00pm for players aged 10 to 12.',
            'Wednesday: 6:00pm for players aged 7 to 9, 7:00pm for players aged 10 to 12.',
        ]);
        expect(Object.keys(CONTENT.TRY.labels)).toEqual(['parent', 'player', 'age', 'day', 'email', 'mobile']);
    });

    // Alex, 12 Oct: no "from Term 1, 2027" on badges or portal access (players get
    // access straight away), and no year-of-weeks graphic in the price section.
    it('no start date on badges or the portal, and no year graphic', () => {
        const shown = (v: unknown): string => {
            if (v == null || typeof v === 'function') return '';
            if (typeof v !== 'object') return String(v);
            if (Array.isArray(v)) return v.map(shown).join(' ');
            const o = v as Record<string, unknown>;
            return o.tbc ? String(o.text) : Object.values(o).map(shown).join(' ');
        };
        const copy = shown({ ...CONTENT, OPEN_QUESTIONS_V2: undefined, TERMS: undefined });
        expect(copy).not.toMatch(/from Term 1, 2027|start in Term 1, 2027/i);
        expect(copy).not.toMatch(/school-holiday weeks/i);
        expect((CONTENT.PRICES as Record<string, unknown>).yearTitle).toBeUndefined();
        expect(CONTENT.PRICES.calendarTitle).toBe('Every term and what it costs');
    });

    // Alex, 12 Oct: example badges describe each phase, where the phases are explained;
    // Develop and Elevate have examples too. All six come from the blueprint's two
    // "climbs" (Part IV §4 and §5); each has a picture, an "I can" and what it takes to earn it.
    it('every phase has example badges with a picture, an "I can" line and how to earn it', () => {
        expect(Object.keys(SAMPLE_BADGES)).toEqual(['discover', 'develop', 'elevate']);
        expect(SAMPLE_BADGES.discover.map((b) => b.name)).toEqual(['Rock or Step', 'Length Ladder']);
        expect(SAMPLE_BADGES.develop.map((b) => b.name)).toEqual(['Forward or Back', 'Length Box']);
        expect(SAMPLE_BADGES.elevate.map((b) => b.name)).toEqual(['Pick the Length', 'Length on Demand']);
        Object.values(SAMPLE_BADGES).flat().forEach((b) => {
            expect(hasSampleArt(b.name), `no picture for "${b.name}"`).toBe(true);
            expect(b.can.length).toBeGreaterThan(10);
            expect(b.earn.length).toBeGreaterThan(20);
        });
        // the Discover examples are real Discover badges, with the same "I can" line
        SAMPLE_BADGES.discover.forEach((b) => expect(BADGES.discover.find((d) => d.name === b.name)?.can).toBe(b.can));
        // a Develop or Elevate example draws a frame plus its own picture
        const html = renderToStaticMarkup(createElement(PhaseBadge, { name: 'Length Box', kind: 'bowl', ribbon: true }));
        expect(html).toContain('LENGTH BOX');
        expect((html.match(/<svg/g) || []).length).toBe(2);
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
