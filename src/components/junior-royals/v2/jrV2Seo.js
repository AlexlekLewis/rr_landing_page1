// ─────────────────────────────────────────────────────────────
// Junior Royals v2 — search and social settings + structured data (schema.org
// JSON-LD), from the SEO brief (7 Oct 2026).
//
// Plain JS with explicit '.js' imports: src/seo/pageSeo.js imports this, and
// scripts/prerender-seo.mjs imports pageSeo.js in Node to bake the tags into
// dist/junior-royals/index.html (Facebook, WhatsApp and AI crawlers don't run JS).
//
// What is deliberately NOT here (SEO brief §4):
// - No `offers` while the page only takes interest. Add the Offer ($49.95 a
//   week, valueAddedTaxIncluded) when joining opens and the prices
//   are bookable — and only once GST registration is confirmed.
// - No FAQPage: several answers are still "to be confirmed", and Google stopped
//   showing FAQ rich results in 2026.
// - No ratings, reviews, phone, opening hours or a "memberOf Rajasthan Royals"
//   claim; no Hallam or Williamstown.
// Venue address fields must match CENTRES in ../juniorRoyalsData.js (tested).
// ─────────────────────────────────────────────────────────────

import { PHASES } from './jrV2Facts.js';

const SITE = 'https://rramelbourne.com';
const URL = `${SITE}/junior-royals`;

export const JR_SEO_VENUES = [
    { id: 'mickleham', name: 'Mickleham Indoor Sports Centre', street: '3 Eclipse Drive', locality: 'Mickleham', postcode: '3064', region: "Melbourne's north" },
    { id: 'cranbourne-north', name: 'Elite Cricket Centre', street: '30 Medley Drive', locality: 'Cranbourne North', postcode: '3977', region: 'South-East Melbourne' },
];

export const JR_V2_SEO = {
    title: 'Junior Cricket Coaching Melbourne, 7–12 | Rajasthan Royals',
    // Dated description: switch to the undated one after the first session (REVIEW 28 Oct 2026).
    description: 'Rajasthan Royals Academy Melbourne: cricket coaching for ages 7–12 from 28 Oct at Mickleham or Cranbourne North. Small groups, skill badges, $49.95 a week.',
    descriptionUndated: 'Weekly cricket coaching for ages 7–12 at Mickleham or Cranbourne North, Melbourne. One hour a week in small groups, with skill badges each term.',
    ogImage: '/assets/little-crickets-nets.jpeg',
};

const venueNode = (v) => ({
    '@type': 'SportsActivityLocation',
    '@id': `${SITE}/#venue-${v.id}`,
    name: v.name,
    description: `Indoor cricket venue in ${v.region} where Rajasthan Royals Academy Melbourne runs Junior Royals.`,
    address: { '@type': 'PostalAddress', streetAddress: v.street, addressLocality: v.locality, addressRegion: 'VIC', postalCode: v.postcode, addressCountry: 'AU' },
});

const phaseText = PHASES.map((p) => p.name).join(', ');

export const JR_V2_JSONLD = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'SportsOrganization',
            '@id': `${SITE}/#organization`,
            name: 'Rajasthan Royals Academy Melbourne',
            url: `${SITE}/`,
            logo: { '@type': 'ImageObject', url: `${SITE}/assets/MELBOURNE_OFFICIAL.png` },
            description: "The Rajasthan Royals' academy in Melbourne, coaching players at Mickleham and Cranbourne North.",
            sport: 'Cricket',
            email: 'info@rramelbourne.com',
            areaServed: { '@type': 'City', name: 'Melbourne' },
            location: JR_SEO_VENUES.map((v) => ({ '@id': `${SITE}/#venue-${v.id}` })),
        },
        ...JR_SEO_VENUES.map(venueNode),
        {
            '@type': 'WebPage',
            '@id': `${URL}#webpage`,
            url: URL,
            name: JR_V2_SEO.title,
            inLanguage: 'en-AU',
            about: { '@id': `${URL}#course` },
            publisher: { '@id': `${SITE}/#organization` },
        },
        {
            '@type': 'Course',
            '@id': `${URL}#course`,
            name: 'Junior Royals',
            url: URL,
            description: `Weekly one-hour cricket coaching for players aged 7 to 12 on weekday evenings in school terms, in small groups of up to 6 players per indoor net lane, each with its own coach. Every player bats and bowls every session. Skills are taught in 3-week blocks (Learn it, Own it, Use it), tracked with skill badges, a Benchmark Game each term and a progress card. Three stages: ${phaseText}.`,
            provider: { '@id': `${SITE}/#organization` },
            inLanguage: 'en-AU',
            typicalAgeRange: '7-12',
            audience: { '@type': 'PeopleAudience', suggestedMinAge: 7, suggestedMaxAge: 12 },
            teaches: ['Cricket batting', 'Cricket bowling', 'Cricket fielding'],
            hasCourseInstance: JR_SEO_VENUES.map((v) => ({
                '@type': 'CourseInstance',
                name: `Junior Royals at ${v.locality}`,
                courseMode: 'onsite',
                location: { '@id': `${SITE}/#venue-${v.id}` },
                courseSchedule: {
                    '@type': 'Schedule',
                    description: 'One-hour sessions on weekday evenings in school term, at 6:00pm or 7:00pm. Each player joins one group, on one day a week.',
                    repeatFrequency: 'P1W',
                    startDate: '2026-10-28',
                    startTime: '18:00:00',
                    endTime: '20:00:00',
                    duration: 'PT1H',
                    scheduleTimezone: 'Australia/Melbourne',
                },
            })),
        },
    ],
};
