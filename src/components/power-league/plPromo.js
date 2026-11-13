// ─────────────────────────────────────────────────────────────
// POWER LEAGUE OPEN INVITATION — every mention outside the page
//
// Read by: the What's On pop-up and ticker (home-page/openDaysData.js).
// Alex, 19 Oct 2026: "make sure it's on the main modal". Facts come from
// plOptions.js, so the pop-up and the page can't disagree.
//
// The pop-up checks powerLeagueOpen() and drops the row by itself when
// nominations close (now Tue 10 Nov 2026, 9pm), so it never invites players to a
// game they can no longer nominate for.
//
// NEW DATE (Alex, 30 Oct 2026): the 25 October game was rained out; it is now
// Sunday 15 November, games from 1pm.
// REVIEW 16 NOV 2026: remove the import from openDaysData.js after the day.
// ─────────────────────────────────────────────────────────────

import { MATCH, nominationsClosed } from './plOptions';

// True until nominations close.
export const powerLeagueOpen = (now = Date.now()) => !nominationsClosed(now);

// The ticker shows only `name` and `tag`, so the tag says who, what, when.
// Alex, 19 Oct 2026: the hook has to say plainly that they PLAY A MATCH in the
// Power League, WITH our Performance Squad players.
export const ANNOUNCEMENT = {
    key: 'power-league',
    name: 'Play in our Power League',
    tag: `Join our Performance Squad players for a T20 match · ages 10–25, any club · Sun 15 Nov`,
    detail: `Open invitation · Montmorency Park, games from 1pm · ${MATCH.fee}, only if picked · nominate by ${MATCH.closes}`,
    href: '/power-league',
    badge: 'Nominate',
    highlight: true,
};
