// The current "what's on" announcements for the home page, in display order.
// The School Holiday Camp sits first and is highlighted. Rendered by both the
// home-page modal (OpenDaysModal) and the ticker (OpenDaysTicket).
//
// KEEP THIS HONEST: anything listed here is being actively promoted to every
// visitor who lands on the home page, so a closed or finished program must come
// out the moment it closes. Power Game Pre-Season was removed on 6 Aug 2026
// because enrolment had closed and the modal was still selling it.
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
        detail: 'Boys & girls 7–15 · Mickleham, Hallam & Williamstown',
        href: '/junior-royals-holiday',
        badge: 'Register interest',
        highlight: true,
    },
    {
        key: 'junior-royals-t4',
        name: 'Junior Royals · Term 4',
        tag: 'Weekly coaching, Mondays or Wednesdays · October – December',
        detail: 'Boys & girls 5–17 · Mickleham, Hallam & Williamstown',
        href: '/junior-royals',
        badge: 'Entries open',
    },
    {
        key: 'india-camp',
        name: 'India High Performance Camp',
        tag: 'Train in Nagpur at the Royals’ own academy · 19–26 September',
        detail: 'Ages 14+ · Places limited · Fee excludes flights',
        href: '/tours',
        badge: 'Ages 14+',
    },
];
