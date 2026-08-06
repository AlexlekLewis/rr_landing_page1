// The current "what's on" announcements for the home page, in display order.
// Power Game sits first (highest) and is highlighted. Rendered by both the
// home-page modal (AnnouncementsModal) and the ticker (OpenDaysTicket).
//
// NOTE: the open training days these once promoted are now archived (their
// /PGP2026/{centre} pages return 410). This list is the evergreen replacement.
// Each item links via a full-page <a href> so the global Meta Pixel PageView
// fires on arrival at the destination.
export const ANNOUNCEMENTS = [
    {
        key: 'power-game',
        name: 'Power Game Pre-Season',
        tag: 'Elite 8-week pre-season',
        detail: 'Ages 12–26 · Melbourne',
        href: '/PGP2026',
        badge: 'Enrolling now',
        highlight: true,
    },
    {
        key: 'junior-royals-t3',
        name: 'Junior Royals · Term 4',
        tag: 'Mondays & Wednesdays · Oct – Dec',
        detail: 'Mickleham · Williamstown · Hallam',
        href: '/junior-royals',
        badge: 'Entries open',
    },
    {
        key: 'india-tour',
        name: 'India Tour 2026',
        tag: 'For all Royals players 14+',
        detail: 'September 2026 · By invitation',
        href: '/india-tour-2026',
        badge: 'Ages 14+',
    },
];
