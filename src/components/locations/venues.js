// ─────────────────────────────────────────────────────────────
// OUR CENTRES: one page per venue, plus /locations to search them (Andy, 27 Nov 2026: "represent
// all of our individual centre locations ... a search style map and architecture of pages that
// people can search from our own website, but also from a Google search ... cricket coaching in
// their area").
//
// ONE entry in VENUES = ONE centre page. The route, the short link, the SEO tags, the sitemap
// test and the share preview all follow from this list.
//
// Name, suburb, address and nearby suburbs come from the centre list the whole site already
// uses (premium-coaching/premiumCoachingData.js CENTRES), so an address is typed once.
// What runs at each centre, who coaches there and the photos are joined on in
// locationsData.js from the program pages' own data. Nothing about a program is typed here.
//
// Plain data only (no JSX): src/seo/pageSeo.js and scripts/prerender-seo.mjs read this file in
// Node at build time. Keep the ".js" on the import.
//
// TO ADD A CENTRE: add it to CENTRES (premiumCoachingData.js) if private coaching runs there,
// or as a `standalone` entry below if not; then add its page details to PAGES. Add the short
// link to vercel.json and the route to public/sitemap.xml (locations.test.ts fails until you do).
// ─────────────────────────────────────────────────────────────

import { CENTRES } from '../premium-coaching/premiumCoachingData.js';

export const LOCATIONS_ROUTE = '/locations';

// Page details per centre. `area` is how the rest of the site names the region
// (Junior Royals: "North Melbourne", "South-East Melbourne"; the Ravenhall invitation:
// "Melbourne's West").
const PAGES = {
    mickleham: {
        route: '/mickleham-indoor-sports-centre',
        short: ['/mickleham'],
        area: 'North Melbourne',
    },
    'cranbourne-north': {
        route: '/cranbourne-north-elite-cricket-centre',
        short: ['/cranbourne-north'],
        area: 'South-East Melbourne',
    },
    hallam: {
        route: '/hallam-elite-cricket-centre',
        short: ['/hallam'],
        area: 'South-East Melbourne',
    },
    ravenhall: {
        route: '/ravenhall-m9-sports-centre',
        // /ravenhall stays the opening-session invitation page (invitation/invitations.js)
        // until those sessions are done; this page links across to it while it is open.
        short: [],
        area: "Melbourne's West",
        invitationRoute: '/ravenhall',
    },
};

// Centres with no private coaching, so they are not in CENTRES.
// Surf Coast Cricket Club (Andy, 27 Nov 2026): COMING SOON. Nothing runs there on the site yet,
// so the page is the name and a "tell me when it starts" form, nothing else.
// TODO Andy: street address and suburb, the programs, days, times, prices and the coaches.
// When they are in, set comingSoon to false and the page fills itself in like the others.
const STANDALONE = [
    {
        slug: 'surf-coast',
        name: 'Surf Coast Cricket Club',
        suburb: 'Surf Coast',
        city: 'Victoria',
        address: null,
        near: null,
        route: '/surf-coast-cricket-club',
        short: ['/surf-coast'],
        area: 'Surf Coast, Victoria',
        comingSoon: true,
    },
];

// "30 Medley Drive, Cranbourne North VIC 3977" → { street, postcode }.
const parseAddress = (address) => {
    const m = /^(.*),\s*(.+?)\s+VIC\s+(\d{4})$/.exec(address || '');
    return m ? { street: m[1], locality: m[2], postcode: m[3] } : null;
};

// "Elite Cricket Centre" is two different buildings, so the suburb is part of the name
// wherever a centre is named on its own (Andy: "Cranbourne North Elite Cricket Centre and
// Hallam Elite Cricket Centre").
const fullName = (c) => {
    if (c.name.includes(c.suburb)) return c.name;
    return c.name === 'Elite Cricket Centre' ? `${c.suburb} ${c.name}` : `${c.name}, ${c.suburb}`;
};

const mapsUrl = (v) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([v.name, v.address || v.suburb].filter(Boolean).join(', '))}`;

// The order the centres are listed in everywhere: as the site's top bar has them (Andy, 23 Nov
// 2026), then centres that are not open yet.
const ORDER = ['mickleham', 'cranbourne-north', 'hallam', 'ravenhall'];
const rank = (v) => (ORDER.includes(v.slug) ? ORDER.indexOf(v.slug) : ORDER.length);

export const VENUES = [
    ...CENTRES.filter((c) => PAGES[c.slug]).map((c) => ({ ...c, ...PAGES[c.slug] })),
    ...STANDALONE,
].sort((a, b) => rank(a) - rank(b)).map((v) => ({
    comingSoon: false,
    short: [],
    ...v,
    fullName: fullName(v),
    nearList: v.near ? v.near.split(',').map((s) => s.trim()) : [],
    parsed: parseAddress(v.address),
    mapsUrl: mapsUrl(v),
    // No street address = no map (a pin on the suburb would send families to the wrong door).
    mapEmbed: v.address
        ? `https://www.google.com/maps?q=${encodeURIComponent(`${v.name}, ${v.address}`)}&output=embed`
        : null,
}));

export const venueBySlug = (slug) => VENUES.find((v) => v.slug === slug);

// Short links: /mickleham → /mickleham-indoor-sports-centre. Also in vercel.json redirects.
export const SHORT_LINKS = VENUES.flatMap((v) => v.short.map((from) => ({ from, to: v.route })));

// ── SEO ───────────────────────────────────────────────────
// Titles lead with what a parent types into Google: "cricket coaching <suburb>".
const seoFor = (v) => {
    const where = v.address ? `${v.fullName}, ${v.address}` : `${v.fullName}, ${v.area}`;
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SportsActivityLocation',
        name: `Rajasthan Royals Academy Melbourne at ${v.fullName}`,
        description: `Rajasthan Royals Academy cricket coaching at ${v.fullName}, ${v.area}.`,
        url: `https://rramelbourne.com${v.route}`,
        sport: 'Cricket',
        email: 'info@rramelbourne.com',
        address: {
            '@type': 'PostalAddress',
            ...(v.parsed ? { streetAddress: v.parsed.street, postalCode: v.parsed.postcode } : {}),
            addressLocality: v.parsed?.locality || v.suburb,
            addressRegion: 'VIC',
            addressCountry: 'AU',
        },
        ...(v.nearList.length ? { areaServed: [v.suburb, ...v.nearList] } : {}),
        parentOrganization: {
            '@type': 'SportsOrganization',
            name: 'Rajasthan Royals Academy Melbourne',
            url: 'https://rramelbourne.com',
        },
    };
    if (v.comingSoon) {
        return {
            title: `Cricket Coaching ${v.suburb} | Rajasthan Royals Academy`,
            description: `Rajasthan Royals Academy cricket coaching is coming to ${v.fullName}, ${v.area}. Register to hear first when programs open.`,
        };
    }
    return {
        title: `Cricket Coaching ${v.suburb} | Rajasthan Royals Academy`,
        description: `Rajasthan Royals Academy cricket coaching at ${where}. See the programs, coaches, days and times at this centre.`.slice(0, 300),
        jsonLd,
    };
};

export const LOCATIONS_SEO = {
    [LOCATIONS_ROUTE]: {
        title: 'Cricket Coaching Near You in Melbourne | Royals Academy',
        description: `Find your nearest Rajasthan Royals Academy Melbourne centre: ${VENUES.filter((v) => !v.comingSoon).map((v) => v.suburb).join(', ')}. See the programs and coaches at each one.`,
    },
    ...Object.fromEntries(VENUES.map((v) => [v.route, seoFor(v)])),
};

// For scripts/prerender-seo.mjs (real HTML head per page, so Google and link previews see it).
export const LOCATION_ROUTES = [LOCATIONS_ROUTE, ...VENUES.map((v) => v.route)];
