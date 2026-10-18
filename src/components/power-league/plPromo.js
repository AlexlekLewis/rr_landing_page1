// ─────────────────────────────────────────────────────────────
// POWER LEAGUE OPEN INVITATION — every mention outside the page
//
// Read by: the What's On pop-up and ticker (home-page/openDaysData.js).
// Alex, 19 Oct 2026: "make sure it's on the main modal". Facts come from
// plOptions.js, so the pop-up and the page can't disagree.
//
// The pop-up checks powerLeagueOpen() and drops the row by itself when
// nominations close (Tue 20 Oct 2026, 9pm), so it never invites players to a
// game they can no longer nominate for.
//
// REVIEW 26 OCT 2026: the game was Sunday 25 October. Remove the import from
// openDaysData.js that day.
// ─────────────────────────────────────────────────────────────

import { MATCH, nominationsClosed } from './plOptions';

// True until nominations close.
export const powerLeagueOpen = (now = Date.now()) => !nominationsClosed(now);

// The ticker shows only `name` and `tag`, so the tag says who, what, when.
export const ANNOUNCEMENT = {
    key: 'power-league',
    name: 'Power League · Open Invitation',
    tag: `Ages 10–25, any club · one T20 game with our Performance Squad players · Sun 25 Oct, 12–7pm`,
    detail: `Montmorency Park · games start 12pm or 3pm · ${MATCH.fee}, only if picked · nominate by ${MATCH.closes}`,
    href: '/power-league',
    badge: 'Nominate',
    highlight: true,
};
