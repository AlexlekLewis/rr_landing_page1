// ─────────────────────────────────────────────────────────────
// JUNIOR ROYALS CARNIVAL AT LOWER PLENTY — every mention outside the page
//
// Read by: the Programs menu (Navbar.jsx), the What's On pop-up and ticker
// (home-page/openDaysData.js), the home hero list (HomeHero.jsx) and the
// register drawer (RegisterDrawer.jsx). One set of words, so they can't
// disagree. Facts come from lpJrDayData.js.
//
// REVIEW 26 OCT 2026: the morning was Sunday 25 October. Remove every import
// of this file that day (the four files above), and take /lower-plenty-
// junior-royals-day out of public/sitemap.xml.
// ─────────────────────────────────────────────────────────────

import { ROUTE, AGES, AGES_SPOKEN, SHORT_DAY, CLUB, EVENT_NAME, TIME, CLOSES } from './lpJrDayData';

export const LP_JR_DAY_ROUTE = ROUTE;

export const PROGRAM_ROW = {
    navLabel: `${EVENT_NAME} · ${AGES}`,
    navBadge: `Free Event · ${SHORT_DAY}`,
    heroLabel: `${EVENT_NAME} at Lower Plenty`,
    heroBadge: `FREE EVENT · ages ${AGES_SPOKEN} · ${SHORT_DAY}, 9–11am`,
    drawerUrgency: `FREE EVENT for ages ${AGES_SPOKEN} — ${CLUB}, ${SHORT_DAY}, 9–11am. Registrations close ${CLOSES}`,
};

// The ticker shows only `name` and `tag`, so the tag says who, where, when, cost.
export const ANNOUNCEMENT = {
    key: 'lower-plenty-junior-royals-day',
    name: `FREE EVENT: ${EVENT_NAME} at ${CLUB}`,
    tag: `Free event · ages ${AGES_SPOKEN} · ${SHORT_DAY}, ${TIME}`,
    detail: `Lower Plenty Oval South, Montmorency Park · 60 places · registrations close ${CLOSES}`,
    href: ROUTE,
    badge: 'Free · Register',
    highlight: true,
};
