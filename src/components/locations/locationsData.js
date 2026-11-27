// ─────────────────────────────────────────────────────────────
// WHAT IS AT EACH CENTRE: programs, coaches, photos and videos (Andy, 27 Nov 2026: "feed
// through the programs that are actually available ... make sure the coaches that are in those
// locations appear there. So you pull them from the different areas of our website").
//
// Nothing here is typed twice. Each list is read from the page that owns it:
//   programs        → the Programs menu (Navbar PROGRAMS_DROPDOWN, via programs/programsData.js)
//   where they run  → each program's own data file (AT below)
//   coaches         → /coaches (coaches/coachesPageData.js)
//   photos, videos  → the Junior Royals and Private Coaching galleries, tagged by centre (TAGS)
// So a program added to the menu, a coach moved to another centre or a night that has finished
// changes these pages by itself.
// ─────────────────────────────────────────────────────────────

import { ALL_PROGRAMS } from '../programs/programsData';
import { ALL_COACHES, coachAt } from '../coaches/coachesPageData';
import { CENTRES as PC_CENTRES, COACHES as PC_COACHES } from '../premium-coaching/premiumCoachingData';
import { JR_T4, JR_PHOTOS, JR_VIDEOS, bookingOpen as jrBookingOpen, breakLine as jrBreakLine } from '../junior-royals-t3/jrTerm4Data';
import { CLUBS as SPIN_CLUBS, upcomingNights } from '../spin-club/scOptions';
import { ACTIVE_CENTRES as SQUAD_CENTRES } from '../performance-squads/data';
import { RAVENHALL } from '../invitation/invitations';
import { VENUES } from './venues';

const slugOfSuburb = (suburb) => VENUES.find((v) => v.suburb === suburb)?.slug;

// ── WHERE EACH PROGRAM RUNS ───────────────────────────────
// One entry per program in the Programs menu: (now) → [{ slug, here }], where `here` is the
// line about THIS centre (its night, its coach). A program with no centre in Melbourne (the
// India camp) returns []. A program that is between seasons returns [] too, so a centre page
// never offers something a family cannot book today.
//
// A NEW PROGRAM IN THE MENU MUST BE ADDED HERE: locations.test.ts fails until it is.
export const AT = {
    '/junior-royals': (now) => JR_T4.centres.map((c) => ({
        slug: c.value,
        here: jrBookingOpen(c, now) ? `${c.night}, ${c.times} at this centre` : jrBreakLine(c),
    })),
    // Sold one night at a time: off the centre pages once the last night has been played.
    '/spin-club': (now) => (upcomingNights(now).length ? SPIN_CLUBS.map((c) => ({
        slug: slugOfSuburb(c.suburb),
        here: `${c.name}, with ${c.coach.name}`,
    })) : []),
    '/performance-squads': () => SQUAD_CENTRES.map((c) => ({
        slug: slugOfSuburb(c.suburb),
        here: `Home of the ${c.name} squad · ${c.coachTitle}: ${c.coach}`,
    })),
    '/private-coaching': () => PC_CENTRES.map((c) => {
        const names = PC_COACHES.filter((k) => k.centres.includes(c.slug)).map((k) => k.name);
        return { slug: c.slug, here: names.length ? `Coaches at this centre: ${names.join(', ')}` : '' };
    }),
    '/tours': () => [], // India
    '/lower-plenty-junior-royals-day': () => [], // a one-day event at a club ground
};

export const programsAt = (slug, now = new Date()) => ALL_PROGRAMS.flatMap((p) => {
    const hit = (AT[p.route]?.(now) || []).find((x) => x.slug === slug);
    return hit ? [{ ...p, here: hit.here }] : [];
});

// ── COACHES ───────────────────────────────────────────────
// The /coaches list and its own "who coaches where" rule, most experienced first.
export const coachesAt = (slug) => ALL_COACHES.filter((c) => coachAt(c, slug));

// ── PHOTOS AND VIDEOS, TAGGED BY CENTRE ───────────────────
// A photo is tagged to a centre only when the centre is visible in it: the "M" logo on the
// back net is Mickleham Indoor Sports Centre; the "ECC Elite Cricket Centre" boards are
// Cranbourne North (junior-royals-t3/jrTerm4Data.js). Anything we cannot place stays untagged.
//
// TO TAG A PHOTO OR VIDEO: add its file to the list for that centre. It must already be on
// the Junior Royals page (JR_PHOTOS, JR_VIDEOS) or be written out in full in EXTRA below.
// A centre with nothing tagged has no gallery.
const jr = (name) => `/assets/junior-royals/gallery/${name}.webp`;
const jrBenefit = (name) => `/assets/junior-royals/benefits/${name}.webp`;
const jrVideo = (name) => `/junior-royals/videos/${name}.mp4`;

// Media that is not in the Junior Royals lists. Wording as on the page it comes from.
const EXTRA = [
    // premium-coaching/premiumCoachingMedia.js VIDEOS
    { type: 'video', src: '/assets/premium-coaching/still-1to2-mickleham.mp4', poster: '/assets/premium-coaching/still-1to2-mickleham.jpg', title: 'Learning together', caption: 'Hands-on with one batter while a second works alongside.' },
];

export const TAGS = {
    mickleham: [
        jr('girl-batting-pull'),
        jrVideo('pull-shots'),
        jr('batting-with-coach'),
        '/assets/premium-coaching/still-1to2-mickleham.mp4',
        jr('hands-on-batting'),
    ],
    'cranbourne-north': [
        jr('coach-demo-bat'),
        jrBenefit('small-group-two-coaches'),
        jr('ecc-bowling-pair'),
        jrBenefit('warm-up-run'),
    ],
    hallam: [],
    ravenhall: [],
    'surf-coast': [],
};

// Benefit photos carry their file name as a caption on the Junior Royals page (never shown
// there), so they get a real one here.
const CAPTIONS = {
    [jrBenefit('small-group-two-coaches')]: 'Small groups, two coaches',
    [jrBenefit('warm-up-run')]: 'Warming up',
};

const POOL = [
    ...[JR_PHOTOS.hero, JR_PHOTOS.heroFeature, ...JR_PHOTOS.gallery, ...JR_PHOTOS.benefits].map((p) => ({ ...p, type: 'image' })),
    ...JR_VIDEOS.map((v) => ({ ...v, type: 'video' })),
    ...EXTRA,
];

export const mediaAt = (slug) => (TAGS[slug] || []).flatMap((src) => {
    const m = POOL.find((x) => x.src === src);
    return m ? [{ ...m, caption: CAPTIONS[src] || m.caption }] : [];
});

// ── THE CENTRE, WITH EVERYTHING JOINED ON ─────────────────
export const venueView = (v, now = new Date()) => ({
    ...v,
    programs: v.comingSoon ? [] : programsAt(v.slug, now),
    coaches: v.comingSoon ? [] : coachesAt(v.slug),
    media: mediaAt(v.slug),
    // Ravenhall's opening sessions are by invitation; the centre page links to that list while it is open.
    invitation: v.invitationRoute && RAVENHALL.route === v.invitationRoute && RAVENHALL.open ? RAVENHALL : null,
});

export const allVenues = (now = new Date()) => VENUES.map((v) => venueView(v, now));

// ── SEARCH (/locations) ───────────────────────────────────
// Matches what a family might type: a suburb, a nearby suburb, a postcode, the centre's name,
// a side of town ("north", "south east", "west"), a program or a coach.
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export const searchText = (view) => norm([
    view.name, view.fullName, view.suburb, view.area, view.region, view.address, view.near,
    ...view.programs.map((p) => p.name),
    ...view.coaches.map((c) => c.name),
].join(' '));

export const searchVenues = (views, query) => {
    const words = norm(query).split(' ').filter(Boolean);
    if (!words.length) return views;
    return views.filter((v) => {
        const text = searchText(v);
        return words.every((w) => text.includes(w));
    });
};
