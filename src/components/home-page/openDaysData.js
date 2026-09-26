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
// closed. The School Holiday Camp came out on 26 Sep 2026 (Alex). A closed
// program that is still real belongs in the nav Programs dropdown and the
// sitemap rather than here.
//
// Performance Squads STAYS (Alex, 26 Sep 2026): its September trials are done,
// but the next intake is real, so the row asks for interest instead of
// announcing a closed door. Do not drop this page from the list.
//
// ORDER = nearest real deadline first. Review dates:
//   Open Age T20 Trial — 6 Oct 2026, the day after the last session. REMOVE IT.
//   Performance Squads — when the next intake has dates, put them in the tag
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
        // Named for what it IS: the way into the Performance Squads (Alex, 26 Sep).
        name: 'Performance Squads · Open Age Trial',
        // The tag carries the two facts that decide whether a reader is eligible:
        // the age bracket, and that it runs at BOTH centres. The ticker shows
        // this line and nothing else.
        tag: 'Open age 16 to 25 · at both centres, Mickleham and Cranbourne North',
        // The modal truncates `detail` on a narrow screen, so it stays short and
        // the dates lead. Sid is at both sessions (Alex, 26 Sep 2026) — he is not
        // scheduled at Mickleham.
        detail: 'Sid Lahiri at both · Mickleham Mon 5 Oct · Cranbourne North Sun 4 Oct · $30',
        href: '/performance-squads-open-trial',
        badge: 'Book now',
        highlight: true,
    },
    {
        // The program the trial above feeds. It says "register your interest"
        // rather than "trials full": the September trials are done, and a closed
        // door on the home page loses a player who would have waited.
        key: 'performance-squads',
        name: 'Performance Squads',
        tag: 'Our representative squads, players 10 to 25 · register your interest for the next intake',
        detail: 'Mickleham & Cranbourne North · aged 16 to 25? Trial on 4 & 5 Oct',
        href: '/performance-squads',
        badge: 'Register interest',
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
