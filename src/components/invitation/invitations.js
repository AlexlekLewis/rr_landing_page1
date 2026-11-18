// ============================================================
// invitations.js: every "invitation list" campaign page (Andy, 17 Nov 2026).
//
// An invitation page is NOT a full landing page. It is a short page for a link
// shared on social media: what the event is, where it is, how the invitation
// list works, and a form. A family registers their details; the Academy gets in
// touch only if there is a place.
//
// ONE entry below = ONE page. To add a campaign:
//   1. Copy the RAVENHALL entry, change the slug, route and wording.
//   2. Add it to INVITATIONS at the bottom. The route, the SEO tags and the
//      share-preview (Facebook / WhatsApp) all follow from that list.
//   3. Nothing to do in the database: every campaign saves to the same table,
//      public.invitation_list_registrations, with `campaign` = the slug.
//
// Plain data only (no JSX, no imports): scripts/prerender-seo.mjs reads this
// file in Node at build time.
//
// These pages are free "register your interest" pages, so the mandatory
// training shirt and the four governance boxes (CLAUDE.md) do not apply.
// If a campaign ever takes payment, it is no longer an invitation page:
// build it with the paid-program rules instead.
// ============================================================

export const RAVENHALL = {
    slug: 'ravenhall-opening-session',     // saved in the `campaign` column: never change after launch
    route: '/ravenhall',
    // Hidden page: reached by direct link only. Kept out of Google until Andy
    // says it is public. REVIEW when the session date is set (Andy, 17 Nov 2026).
    noindex: true,
    open: true,                            // false = the form is replaced by the `closed` message

    seo: {
        title: "Exclusive Opening Session | Rajasthan Royals Academy, Melbourne's West",
        description:
            "The Rajasthan Royals Academy is opening in Ravenhall, Melbourne's West. Register for the invitation list for the exclusive opening coaching session. Places are limited.",
        ogImage: '/assets/invitation/ravenhall-coming-soon.jpg',
    },

    hero: {
        // The "Coming soon to Melbourne's West" picture from the social posts (Andy, 18 Nov
        // 2026: "use this image as people have seen this previously"). It has the logo and
        // words in it, so it is shown as it is (poster), never darkened behind the headline.
        // poster: true  = the picture is shown whole, beside the headline (above it on a phone).
        // poster: false = the picture is a dark backdrop behind the headline.
        poster: true,
        image: '/assets/invitation/ravenhall-coming-soon.webp',
        imageAlt: "The new indoor centre in Ravenhall, with the Rajasthan Royals Academy Melbourne logo and the words: Coming soon to Melbourne's West",
        badge: 'By invitation only',
        eyebrow: "Ravenhall · Melbourne's West",
        title: ['Exclusive', 'Opening Session'],
        lead:
            "The Rajasthan Royals Academy is opening in Ravenhall, in Melbourne's West, in conjunction with M9 Sports Centre. The opening coaching sessions are by invitation. Register your details to go on the invitation list.",
        footnote: 'No payment to register · Places are limited · Dates not set yet',
    },

    cta: 'Register for the Invitation List',

    // The three or four facts a visitor needs before they scroll.
    facts: [
        { label: 'What', value: 'A Rajasthan Royals Academy coaching session' },
        { label: 'Where', value: "Ravenhall, Melbourne's West" },
        { label: 'When', value: 'Dates are not set yet. We will send your session time with your invitation' },
        { label: 'Who', value: 'Players who will train on the day' },
    ],

    how: {
        eyebrow: 'How it works',
        title: 'The Invitation List',
        steps: [
            { n: '01', t: 'Register your details', d: 'It takes two minutes. Tell us who will attend and where you live. You pay nothing.' },
            { n: '02', t: 'We plan the sessions', d: 'When registrations are in, we set the session dates and times, and group players into sessions. Places depend on space and how close you live to Ravenhall.' },
            { n: '03', t: 'We send your invitation', d: 'If there is a place for you, we email or call you with your session, its date and its time. You do not need to contact us.' },
        ],
        // Andy, 18 Nov 2026: say plainly that no dates are set, or families will ask
        // "when am I doing it?". Shown under the steps and on the confirmation screen.
        dates: {
            title: 'There are no dates yet',
            body: 'We have not set the session dates or times. Once we have everyone’s details, we will plan the sessions and invite each player to a set session and time. We will contact you when that is ready, so there is no need to ask us for your time.',
        },
        // The one thing nobody may misread. Shown in a box under the steps and again above the submit button.
        notice: {
            title: 'Registering does not guarantee an invitation',
            body: 'You will only receive an invitation if there is space. We choose based on the number of places and how close you live to the venue.',
        },
    },

    // The photo and video carousel. The media itself is the Academy's shared list
    // (ACADEMY_MEDIA in home-page/homeMediaData.js): older players and Royals coaches
    // first. Remove this block and the page has no carousel.
    media: {
        eyebrow: 'Photos & videos',
        title: 'Inside the Royals Academy',
        intro: 'This is a cricket academy for players who want to improve, from juniors to open age. See our coaches and players at work.',
    },

    about: {
        eyebrow: 'The session',
        title: 'A Royals Coaching Session',
        image: '/assets/community-coaches.jpg',
        imageAlt: 'Players of different ages with their coaches after a Rajasthan Royals Academy Melbourne session',
        paragraphs: [
            'This is a real coaching session, run by Rajasthan Royals Academy Melbourne coaches. Every place is for a player who will take part.',
            'That is why the form asks who will attend, their date of birth and how much cricket they have played. It helps us plan the right session for the players we invite.',
        ],
        links: [
            { label: 'About the Academy', to: '/' },
        ],
    },

    form: {
        eyebrow: 'Invitation list',
        title: 'Register Your Details',
        intro: 'Two minutes. No payment. We will contact you if there is a place.',
        maxPlayers: 4,
        venueShort: 'Ravenhall',
        submit: 'Register for the Invitation List',
    },

    success: {
        title: "You're On The Invitation List",
        body: 'Thank you. We have your details. There are no session dates yet. Once we have everyone’s details, we will plan the sessions. If there is a place for you in Ravenhall, we will email or call you with your session, its date and its time.',
        reminder: 'Being on the list does not guarantee an invitation. Places depend on space and how close you live to the venue.',
        links: [
            { label: 'Explore the Academy', to: '/' },
            { label: 'Junior Royals', to: '/junior-royals' },
            { label: 'Performance Squads', to: '/performance-squads' },
        ],
    },

    closed: {
        title: 'The Invitation List Is Closed',
        body: 'Registrations for this session have closed. See what else is on at the Academy.',
    },

    // Meta Pixel "Lead" event: campaign name only, never a name, email or phone.
    pixelName: 'Ravenhall Opening Session: Invitation List',
};

export const INVITATIONS = [RAVENHALL];

// For src/seo/pageSeo.js and scripts/prerender-seo.mjs.
export const INVITATION_ROUTES = INVITATIONS.map((c) => c.route);
export const INVITATION_SEO = Object.fromEntries(
    INVITATIONS.map((c) => [c.route, { ...c.seo, noindex: !!c.noindex }]),
);
