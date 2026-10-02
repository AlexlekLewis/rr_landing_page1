// ─────────────────────────────────────────────────────────────
// JUNIOR SESSIONS WITH SIDDHARTHA LAHIRI — every mention outside the page
//
// The home top banner, the What's On pop-up and ticker, the Programs menu, the
// home hero list, the register drawer, the open age trial page and the
// Performance Squads welcome page all point families of players aged 8 to 16
// at /sid-juniors. Their lines are built here from one set of facts, so they
// cannot disagree with each other.
//
// The page itself keeps its own config in sidJuniorsData.js (same folder). If
// a date, time, age or price changes there, change it here too.
//
// Name rule, as on the rest of the site: "Siddhartha Lahiri" the first time a
// page names him, "Sid" after. These lines only say "Sid" where the page has
// already given his full name above them.
//
// REVIEW 6 OCT 2026: both sessions are over. Remove every mention that day.
// ─────────────────────────────────────────────────────────────

export const SID_JUNIORS_ROUTE = '/sid-juniors';
export const SID_JUNIORS_AGES = '8 to 16';
export const SID_JUNIORS_PRICE = 33; // incl. GST (Alex, 2 Oct 2026)

// The two sessions (Alex, 29 Sep 2026). `trialCentre` is the open age trial's
// centre slug, so the trial page can put the right note on the right card.
export const SID_JUNIOR_SESSIONS = [
    {
        centre: 'Cranbourne North',
        trialCentre: 'south-east-melbourne',
        day: 'Sunday 4 October',
        shortDay: 'Sun 4 Oct',
        start: '1:00pm',
        spoken: '1:00 to 2:30pm',
        // Same centre, same time as the open age trial.
        withTrial: 'at the same time as the open age trial, on separate lanes',
    },
    {
        centre: 'Mickleham',
        trialCentre: 'north-melbourne',
        day: 'Monday 5 October',
        shortDay: 'Mon 5 Oct',
        start: '4:30pm',
        spoken: '4:30 to 5:30pm',
        withTrial: 'before the open age trial',
    },
];

const [CN, MK] = SID_JUNIOR_SESSIONS;
const bothShort = `${CN.centre} ${CN.shortDay} · ${MK.centre} ${MK.shortDay}`;

// ── Home top banner: its own row, under the row that gives his full name. ──
export const BANNER = {
    lead: `Juniors ${SID_JUNIORS_AGES}`,
    text: `junior sessions with Sid at ${CN.centre} (${CN.shortDay}, ${CN.start}) and ${MK.centre} (${MK.shortDay}, ${MK.start})`,
};

// ── Programs menu, home hero list and register drawer ──
// One row in each, straight after the open age trial (the other half of the
// same visit), so the lists stay in the same order. Pink dot: bookable now.
export const PROGRAM_ROW = {
    navLabel: `Junior Sessions with Sid · ${SID_JUNIORS_AGES.replace(' to ', '-')}`,
    navBadge: 'Both Centres · 4 & 5 Oct',
    heroLabel: 'Junior Sessions with Sid',
    heroBadge: `Ages ${SID_JUNIORS_AGES} · both centres · 4 & 5 Oct`,
    drawerUrgency: `Ages ${SID_JUNIORS_AGES} — ${CN.centre} ${CN.shortDay}, ${MK.centre} ${MK.shortDay}, $${SID_JUNIORS_PRICE} a session`,
};

// ── What's On pop-up and ticker ──
// The ticker only shows `name` and `tag`, so the tag says who it is for.
export const ANNOUNCEMENT = {
    key: 'sid-juniors',
    name: 'Junior Sessions with Siddhartha Lahiri',
    tag: `Juniors ${SID_JUNIORS_AGES} · ${bothShort}`,
    detail: `Guest coach Siddhartha Lahiri · ${CN.centre} ${CN.start}, ${MK.centre} ${MK.start} · $${SID_JUNIORS_PRICE}`,
    href: SID_JUNIORS_ROUTE,
    badge: 'Book now',
};

// ── Open age trial page ──
export const TRIAL_PAGE = {
    sidSection:
        `Younger players, aged ${SID_JUNIORS_AGES}, have their own junior sessions with Sid: `
        + `${CN.centre} on ${CN.day} at ${CN.start}, ${CN.withTrial}, and ${MK.centre} on `
        + `${MK.day} at ${MK.start}, ${MK.withTrial}.`,
    linkLabel: 'See the junior sessions',
    // One line on each centre's card, keyed by the trial's centre slug.
    cardNote: {
        [CN.trialCentre]: `Juniors aged ${SID_JUNIORS_AGES}: a junior session runs at the same time, on separate lanes.`,
        [MK.trialCentre]: `Juniors aged ${SID_JUNIORS_AGES}: a junior session runs before the trial, at ${MK.start}.`,
    },
    faq: {
        q: 'Is there anything for younger players?',
        a:
            `Yes. Players aged ${SID_JUNIORS_AGES} can book a junior session with Sid: ${CN.centre} on `
            + `${CN.day}, ${CN.spoken}, at the same time as this trial but on separate lanes with their `
            + `own coaches, or ${MK.centre} on ${MK.day}, ${MK.spoken}, before the trial. `
            + `$${SID_JUNIORS_PRICE} per player. Book at rramelbourne.com/sid-juniors.`,
    },
};

// ── Performance Squads welcome page: one line in its Sid section ──
export const WELCOME_LINE =
    `Separate from the squad sessions: players aged ${SID_JUNIORS_AGES} can book a junior session `
    + `with Sid at ${CN.centre} (${CN.shortDay}, ${CN.start}) or ${MK.centre} (${MK.shortDay}, ${MK.start}).`;
