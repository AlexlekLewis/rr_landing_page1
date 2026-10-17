// ─────────────────────────────────────────────────────────────
// JUNIOR ROYALS ARE COMING TO LOWER PLENTY — every mention outside the page
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

import { ROUTE, AGES, AGES_SPOKEN, SHORT_DAY, CLUB, EVENT_NAME, TIME, CLOSES, PRICE } from './lpJrDayData';

export const LP_JR_DAY_ROUTE = ROUTE;

export const PROGRAM_ROW = {
    navLabel: `${EVENT_NAME} · ${AGES}`,
    navBadge: `$${PRICE} · ${SHORT_DAY}`,
    heroLabel: EVENT_NAME,
    heroBadge: `Ages ${AGES_SPOKEN} · ${SHORT_DAY}, 9–11am · $${PRICE}`,
    drawerUrgency: `Ages ${AGES_SPOKEN} — ${CLUB}, ${SHORT_DAY}, 9–11am, $${PRICE} incl. GST. Registrations close ${CLOSES}`,
};

// The ticker shows only `name` and `tag`, so the tag says who, where, when, cost.
export const ANNOUNCEMENT = {
    key: 'lower-plenty-junior-royals-day',
    name: EVENT_NAME,
    tag: `Ages ${AGES_SPOKEN} · ${SHORT_DAY}, ${TIME} · $${PRICE}`,
    detail: `Lower Plenty Oval South, Montmorency Park · $${PRICE} incl. GST · then stay for the Power League matches · registrations close ${CLOSES}`,
    href: ROUTE,
    badge: 'Secure your place',
    highlight: true,
};
