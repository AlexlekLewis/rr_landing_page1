// The current "what's on" announcements for the home page, in display order.
// The first entry is visually highlighted in the modal. Rendered by both the
// home-page modal (OpenDaysModal) and the ticker (OpenDaysTicket).
//
// THE TICKER ONLY SHOWS `name` AND `tag`. Anything that must reach every
// visitor — above all WHO THE THING IS FOR — belongs in the tag, not the
// detail, or the ticker never says it.
//
// KEEP THIS HONEST: anything listed here is being actively promoted to every
// visitor who lands on the home page, so a closed or full program must come out
// the moment it closes. Power Game Pre-Season came out on 6 Aug 2026 and the
// India High Performance Camp on 20 Aug 2026, both because enrolment had
// closed. Performance Squads came out on 26 Sep 2026 because its trials are
// full and the open age trial below is the way in now. The School Holiday Camp
// came out on 26 Sep 2026 (Alex). Each still sits in the nav Programs dropdown
// and the sitemap, which is where a closed-but-real program belongs.
//
// ORDER = nearest real deadline first. Review dates:
//   Open Age T20 Trial — 6 Oct 2026, the day after the last session. REMOVE IT.
//   Spin Club          — when Alex confirms the start date, put it in the tag
//   Junior Royals T4   — end of Term 4
//
// Each item links via a full-page <a href> so the global Meta Pixel PageView
// fires on arrival at the destination. Every line has to make sense to someone
// who has never heard of us — say what the thing is, who it's for, and what
// the next step is.
export const ANNOUNCEMENTS = [
    {
        key: 'open-age-trial',
        name: 'Open Age T20 Trial',
        // Sid is scheduled at the CRANBOURNE NORTH session only. Never write a
        // line here that reads as him being at both — the Mickleham players see
        // this too. Same rule as the trial page itself.
        tag: 'Open age 16 to 25 · Sid Lahiri, Rajasthan Royals Performance Coach, at the Cranbourne North session',
        detail: 'Cranbourne North Sun 4 Oct · Mickleham Mon 5 Oct · $30 a session',
        href: '/performance-squads-open-trial',
        badge: 'Book now',
        highlight: true,
    },
    {
        key: 'spin-club',
        name: 'Spin Club',
        tag: 'Spin bowlers 10 to 25 · Wednesday nights, an 8-week block',
        detail: 'Mickleham & Cranbourne North · Register your interest, nothing to pay now',
        href: '/spin-club',
        badge: 'Registering interest',
    },
    {
        key: 'junior-royals-t4',
        name: 'Junior Royals · Term 4',
        tag: 'Boys & girls 5 to 17 · weekly coaching, Mondays or Wednesdays',
        detail: 'October – December · Mickleham, Hallam & Williamstown',
        href: '/junior-royals',
        badge: 'Entries open',
    },
];
