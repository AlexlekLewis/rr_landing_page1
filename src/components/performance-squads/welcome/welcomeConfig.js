// ─────────────────────────────────────────────────────────────
// PERFORMANCE SQUAD WELCOME — CONFIG
//
// The page a selected player lands on from the "Confirm your place" link
// in their welcome email. One entry per centre, so the next centre is a
// config fill-in, not a new page:
//   /performance-squads/welcome                    → DEFAULT_WELCOME_CENTRE
//   /performance-squads/welcome/mickleham
//   /performance-squads/welcome/cranbourne-north   (set active: true first)
//
// The wording on the page follows the approved welcome email. Don't add
// claims here that the email doesn't make.
//
// A value left as null is a detail that isn't confirmed yet. The page shows
// it as "to be confirmed", puts a DRAFT banner across the top listing what is
// missing, and the form saves nothing while the page is a draft. Fill every
// null and the banner goes away.
// ─────────────────────────────────────────────────────────────

export const DEFAULT_WELCOME_CENTRE = 'mickleham';

export const WELCOME_CENTRES = {
    mickleham: {
        slug: 'mickleham',
        active: true,
        // Same centre_slug the trial tables use, so confirmations line up with trials.
        dbCentreSlug: 'north-melbourne',
        centreName: 'Mickleham',
        venue: 'Mickleham Indoor Sports Centre',

        // ── Still to come from Alex ──
        confirmBy: null,         // e.g. 'Friday 25 September'
        registrationFee: null,   // e.g. '$450' — shown exactly as written
        paymentLink: null,       // Stripe Payment Link for the Registration Fee
        kitItems: [],            // e.g. ['RRA Melbourne Training Shirt', 'Academy Cap']
        // Stripe link for the uniform at the Performance Squad player price. Selected
        // players order here, NOT through the Academy Shop.
        kitOrderLink: null,

        season: {
            firstTraining: { year: 2026, date: 'Monday 5 October', time: null },
            sidSessions: { year: 2026, when: 'Early October' },
            matchDays: [
                { year: 2026, date: 'Sunday 11 October', first: true, venueAndTime: null },
                { year: 2026, date: 'Sunday 15 November' },
                // Standing rule: 24 January is always shown as the Australia Day long weekend.
                { year: 2027, date: 'Sunday 24 January', note: 'Australia Day long weekend' },
                { year: 2027, date: 'Sunday 7 March' },
                { year: 2027, date: 'Sunday 4 April' },
            ],
        },

        // Kept OUT of the season timeline on purpose: only players who get an
        // offer can play, and the offer is sent separately.
        septemberGames: {
            dates: 'Monday 28 and Tuesday 29 September',
            venue: 'North Balwyn Cricket Club, Macleay Park',
        },

        letter: {
            from: 'Alex Lewis',
            title: 'Head Coach and Director of Cricket',
            paragraphs: [
                'Our Royals Academy family in Melbourne has grown to more than 500 players across all our programs in 7 months. We had a huge response to the Performance Squad trials, and you are one of the players we selected.',
                'I have worked in cricket academy programs for more than 20 years. At the Royals, we believe this program is the most important part of how a player gets better.',
                'Playing as well in a match as you do in the nets is one of the hardest things in cricket. This program helps you build the skills to do it.',
                'Every session and every match is a chance to learn. We want you to be brave, try new things and back yourself. At the Royals, we say "Courage over comfort." It means being brave, even when something feels hard.',
            ],
        },

        contactEmail: 'alex.lewis@rramelbourne.com',
    },

    // Not live yet. Fill in from Cranbourne North's own welcome email, then set
    // active: true. Head Coach: Alex Thornhill.
    'cranbourne-north': {
        slug: 'cranbourne-north',
        active: false,
        dbCentreSlug: 'south-east-melbourne',
        centreName: 'Cranbourne North',
        venue: 'Elite Cricket Centre',
        confirmBy: null,
        registrationFee: null,
        paymentLink: null,
        kitItems: [],
        kitOrderLink: null,
        season: null,
        septemberGames: null,
        letter: null,
        contactEmail: 'info@rramelbourne.com',
    },
};

export const getWelcomeCentre = (slug) => {
    const centre = WELCOME_CENTRES[String(slug || DEFAULT_WELCOME_CENTRE).toLowerCase()];
    return centre?.active ? centre : null;
};

// Every detail the page still needs before it can go to families.
export const getMissingDetails = (c) => {
    const missing = [];
    if (!c.confirmBy) missing.push('confirm-by date');
    if (!c.season?.firstTraining?.time) missing.push('first training time');
    if (!c.season?.matchDays?.find((m) => m.first)?.venueAndTime) missing.push('first match venue and time');
    if (!c.registrationFee) missing.push('Registration Fee amount');
    if (!c.paymentLink) missing.push('Registration Fee payment link');
    if (!c.kitItems?.length) missing.push('kit list');
    if (!c.kitOrderLink) missing.push('kit order link');
    return missing;
};

// Shared by every centre.
export const SID = {
    name: 'Sid Lahiri',
    photo: '/assets/coaches/siddhartha-lahiri.jpg',
};
