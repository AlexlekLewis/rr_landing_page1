// ─────────────────────────────────────────────────────────────
// /coaches: the whole coaching team on one page, in the /programs style (Andy, 25 Nov 2026:
// "an ability to scroll through our coaches, where they're primarily located and a short bio
// ... put our most experienced coaches first").
//
// Nothing here is new copy. Bios are the wording Andy approved for Royals Private Coaching
// (premium-coaching/premiumCoachingData.js COACHES) and Alex Lewis's /coaches tagline
// (coachData.js DIRECTOR). "Where they coach" is the home-page coaching-team line
// (home-v2/homeV2Data.js TEAM, Andy 23 Nov 2026), falling back to their private-coaching centres.
//
// ORDER: the two Head Coaches, then by coaching experience. Change the order by moving a slug.
// ─────────────────────────────────────────────────────────────

import { COACHES as PC_COACHES, CENTRES, coachPath } from '../premium-coaching/premiumCoachingData';
import { TEAM } from '../home-v2/homeV2Data';
import { DIRECTOR } from './coachData';

export const ORDER = [
    'alex-lewis', // Director of Cricket, Head Coach Mickleham, 22+ years
    'alex-thornhill', // Head Coach, South-East
    'mihiraj-jayasekara', // 25+ years, academies in UAE, India, Nepal
    'siddhartha-banerjee', // 20 years, ICC-certified
    'hamid-qadri', // 8 seasons county cricket, England U19
    'ikroop-dhanoa', // Essendon First XI, Vic pathway to U19
    'rittin-raman', // MCC First XI, state representative
    'jinang-shah',
    'kavya-khatri',
];

const centreName = (slug) => CENTRES.find((c) => c.slug === slug)?.suburb || slug;
const teamLine = (name) => TEAM.find((t) => t.name === name)?.line;

const LEWIS = {
    slug: 'alex-lewis',
    name: DIRECTOR.name,
    role: 'Director of Cricket · Head Coach',
    where: 'Mickleham · leads all centres',
    centres: ['mickleham', 'cranbourne-north', 'hallam', 'ravenhall'],
    img: DIRECTOR.img,
    pos: '50% 25%',
    specialism: null,
    bio: DIRECTOR.tagline,
    link: null,
};

const fromPrivate = (c) => ({
    slug: c.slug,
    name: c.name,
    role: c.role,
    where: teamLine(c.name) || c.centres.map(centreName).join(' & '),
    centres: c.centres,
    img: c.img,
    pos: '50% 20%',
    specialism: c.specialism,
    bio: c.bio,
    // Their own Royals Private Coaching page, where one is bookable.
    link: c.bookable ? coachPath(c.slug) : null,
});

const BY_SLUG = Object.fromEntries([LEWIS, ...PC_COACHES.map(fromPrivate)].map((c) => [c.slug, c]));

export const ALL_COACHES = ORDER.map((s) => BY_SLUG[s]).filter(Boolean);

// Filter chips: only centres that have at least one coach.
export const CENTRE_FILTERS = [
    { slug: 'all', label: 'All coaches' },
    ...['mickleham', 'cranbourne-north', 'hallam', 'ravenhall']
        .filter((s) => ALL_COACHES.some((c) => c.centres.includes(s) || (c.where || '').toLowerCase().includes(centreName(s).toLowerCase())))
        .map((s) => ({ slug: s, label: centreName(s) })),
];

export const coachAt = (c, slug) => slug === 'all'
    || c.centres.includes(slug)
    || (c.where || '').toLowerCase().includes(centreName(slug).toLowerCase());
