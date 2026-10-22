// ─────────────────────────────────────────────────────────────
// JUNIOR ROYALS ARE COMING TO LOWER PLENTY — every mention outside the page
//
// Read by: the Programs menu (Navbar.jsx), the What's On pop-up and ticker
// (home-page/openDaysData.js), the home hero list (HomeHero.jsx) and the
// register drawer (RegisterDrawer.jsx). One set of words, so they can't
// disagree. Facts come from lpJrDayData.js.
//
// Also read by the home page's Special Event banner (home-page/HomeTopBanner.jsx).
//
// Every one of those surfaces checks lpJrDayOpen() and drops the event by itself
// once registrations close, so nothing keeps selling a morning nobody can book
// (19 Oct 2026). The morning was CANCELLED on 23 Oct 2026 and registrations closed
// at 8:30am that day, so every surface has already dropped it.
//
// REVIEW 26 OCT 2026: the morning would have been Sunday 25 October. Remove every
// import of this file that day (the five files above). The page is already out of
// public/sitemap.xml.
// ─────────────────────────────────────────────────────────────

import { ROUTE, AGES, AGES_SPOKEN, SHORT_DAY, CLUB, EVENT_NAME, TIME, CLOSES, CLOSES_AT_ISO, PRICE, VENUE, CTA_WITH_PRICE, CANCELLED } from './lpJrDayData';

export const LP_JR_DAY_ROUTE = ROUTE;

// True until registrations close, and never once the morning is cancelled. Promo
// surfaces show the event only while this is true.
export const lpJrDayOpen = (now = Date.now()) => !CANCELLED && now < new Date(CLOSES_AT_ISO).getTime();

export const PROGRAM_ROW = {
    navLabel: `${EVENT_NAME} · ${AGES}`,
    navBadge: `$${PRICE} · ${SHORT_DAY}`,
    heroLabel: EVENT_NAME,
    heroBadge: `Ages ${AGES_SPOKEN} · ${SHORT_DAY}, 9–11am · $${PRICE}`,
    drawerUrgency: `Ages ${AGES_SPOKEN} — ${CLUB}, ${SHORT_DAY}, 9–11am, $${PRICE} incl. GST. Registrations close ${CLOSES}`,
};

// The ticker shows only `name` and `tag`, so the tag says who, where, when, cost.
// "Everyone welcome" leads (Alex, 19 Oct 2026): any player 7 to 12, from any
// club or none, not just Lower Plenty juniors.
export const ANNOUNCEMENT = {
    key: 'lower-plenty-junior-royals-day',
    name: EVENT_NAME,
    tag: `Everyone welcome · ages ${AGES_SPOKEN}, any club or none · ${SHORT_DAY}, ${TIME} · $${PRICE}`,
    detail: `Lower Plenty Oval South, Montmorency Park · $${PRICE} incl. GST · then stay for the Power League matches · registrations close ${CLOSES}`,
    href: ROUTE,
    badge: 'Secure your place',
    highlight: true,
};

// The home page's full-width Special Event banner (HomeTopBanner.jsx).
export const BANNER = {
    title: EVENT_NAME,
    ages: `Ages ${AGES_SPOKEN}`,
    cta: CTA_WITH_PRICE,
    what: `A morning of cricket with our Academy coaches · ${SHORT_DAY}, ${TIME} · ${VENUE.oval}, ${VENUE.park}, ${VENUE.suburb} · $${PRICE} incl. GST`,
    closes: `Registrations close ${CLOSES}`,
};
