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
// The Open Age T20 Trial and the junior sessions with Sid finished on 4–5 Oct
// 2026 and came out on 16 Oct 2026 (ten days late — check the review dates).
//
// ORDER = nearest real deadline first. Review dates:
//   Power League       — 26 Oct 2026, the day after the game (drops out at 9pm Tue 20 Oct)
//   Performance Squads — when the next intake has dates, put them in the tag
//   Spin Club          — 26 Nov 2026, the day after the last night
//   Junior Royals T4   — 16 Dec 2026, the last Term 4 session
//
// Each item links via a full-page <a href> so the global Meta Pixel PageView
// fires on arrival at the destination. Every line has to make sense to someone
// who has never heard of us — say what the thing is, who it's for, and what
// the next step is.
import { ANNOUNCEMENT as LP_JR_DAY_ANNOUNCEMENT, lpJrDayOpen } from '../lower-plenty-junior-royals-day/lpJrDayPromo';
import { ANNOUNCEMENT as POWER_LEAGUE_ANNOUNCEMENT, powerLeagueOpen } from '../power-league/plPromo';

export const ANNOUNCEMENTS = [
    // Power League open invitation, Sun 25 Oct 2026 (Alex, 19 Oct 2026: "make sure
    // it's on the main modal"). Nearest real deadline (Tue 20 Oct, 9pm) and it drops
    // out by itself at that moment (powerLeagueOpen). REVIEW 26 OCT 2026: remove it
    // and its import.
    ...(powerLeagueOpen() ? [POWER_LEAGUE_ANNOUNCEMENT] : []),
    // Junior Royals Are Coming to Lower Plenty ($10), Sun 25 Oct 2026 (Alex, 16 Oct
    // 2026). Nearest real deadline (Fri 23 Oct, 9pm), and it drops out by itself
    // at that moment (lpJrDayOpen). REVIEW 26 OCT 2026: remove it and its import.
    ...(lpJrDayOpen() ? [LP_JR_DAY_ANNOUNCEMENT] : []),
    {
        // It says "register your interest" rather than "trials full": the
        // September trials and the open age trial are done, and a closed door on
        // the home page loses a player who would have waited.
        key: 'performance-squads',
        name: 'Performance Squads',
        tag: 'Our representative squads, players 10 to 25 · register your interest for the next intake',
        // The promise the Performance Squads page itself makes (TrialsSection).
        detail: 'Mickleham & Cranbourne North · we let you know as soon as the next trial dates are set',
        href: '/performance-squads',
        badge: 'Register interest',
    },
    {
        key: 'spin-club',
        name: 'Spin Club',
        // Sold one night at a time since 9 Oct 2026 (spin-club/scOptions.js).
        // REVIEW 26 NOV 2026 — the last night is Wed 25 Nov.
        tag: 'Spin bowlers 10 to 25 · Wednesday nights, 6:00–7:30pm, until 25 Nov · $60 a night',
        detail: 'Mickleham & Cranbourne North · book one night at a time, $60 incl. GST',
        href: '/spin-club',
        badge: 'Book a night',
    },
    {
        key: 'junior-royals-t4',
        name: 'Junior Royals · Term 4',
        // REVIEW 16 Dec 2026 — last Term 4 session. Facts: junior-royals-t3/jrTerm4Data.js.
        tag: 'Ages 7–12 · weekly coaching, Wednesdays 6:00pm – 8:00pm at Mickleham and Cranbourne North',
        detail: 'Wednesdays 28 Oct – 16 Dec · register your interest, nothing to pay now',
        href: '/junior-royals',
        badge: 'Entries open',
    },
];
