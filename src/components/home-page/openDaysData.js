// The current "what's on" announcements for the home page, in display order.
// The School Holiday Camp sits first and is highlighted. Rendered by both the
// home-page modal (OpenDaysModal) and the ticker (OpenDaysTicket).
//
// KEEP THIS HONEST: anything listed here is being actively promoted to every
// visitor who lands on the home page, so a closed or finished program must come
// out the moment it closes. Power Game Pre-Season was removed on 6 Aug 2026
// because enrolment had closed and the modal was still selling it. The India
// High Performance Camp came out on 20 Aug 2026 for the same reason —
// applications had closed. It still sits in the nav Programs dropdown and the
// sitemap, which is where a closed-but-real program belongs.
//
// ORDER = nearest real deadline first. Review dates:
//   Holiday Camp early bird — 30 Aug 2026
//   Masterclass             — 13 Sep 2026 (remove after the second session)
//
// Each item links via a full-page <a href> so the global Meta Pixel PageView
// fires on arrival at the destination. Every line has to make sense to someone
// who has never heard of us — say what the thing is, who it's for, and what
// the next step is.
export const ANNOUNCEMENTS = [
    {
        key: 'holiday-camp',
        name: 'School Holiday Camp',
        tag: 'Three days of coaching in the September / October holidays',
        detail: 'Boys & girls 7–15 · Mickleham & Hallam',
        href: '/junior-royals-holiday',
        badge: 'Register interest',
        highlight: true,
    },
    {
        key: 'performance-squads',
        name: 'Performance Squads',
        tag: 'Trials Sat 6, Thu 11 & Sat 13 September · elite pathway for high-potential players',
        detail: 'Boys & girls · book a trial to be considered for a squad place',
        href: '/performance-squads',
        badge: 'Book a trial',
    },
    {
        key: 'junior-royals-t4',
        name: 'Junior Royals · Term 4',
        tag: 'Weekly coaching, Mondays or Wednesdays · October – December',
        detail: 'Boys & girls 5–17 · Mickleham, Hallam & Williamstown',
        href: '/junior-royals',
        badge: 'Entries open',
    },
];
