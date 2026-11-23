// ─────────────────────────────────────────────────────────────
// HOME PAGE, rajasthanroyals.com layout (Andy, 16 Nov 2026: "I want the page to start
// looking more like this now, except I want the photo/video section to be as it currently
// is on the live site"). Built from Andy's mock-up. Every section reads the site's own
// live content, so nothing here goes stale on its own:
//   programs (menu, banner)  → Navbar PROGRAMS_DROPDOWN, home-page/HomeHero PROGRAMS
//   What's On ticker         → home-page/openDaysData ANNOUNCEMENTS
//   news                     → news/ (newsStories.js + Power Cricket's feed)
//   photos & videos          → home-page/HomeMedia (unchanged, as on the live site)
//   leadership               → home-page/HomeCoaches + coaches/coachData (Alex Lewis)
//   Royals Way               → the "Who we are" copy that was on the home page
//   store                    → academy-shop/shopConfig PRODUCTS (names, prices, badges)
//   FAQ                      → home-page/HomeFAQ faqs
//   partners                 → power-game/PartnerStack (the one shared list)
//   footer links             → Footer PROGRAMS / ACADEMY / COMPANY
// ─────────────────────────────────────────────────────────────

import { PROGRAMS as HERO_PROGRAMS } from '../home-page/HomeHero';
import { coaches as LEADERS_TOP } from '../home-page/HomeCoaches';
import { DIRECTOR } from '../coaches/coachData';
import { PRODUCTS } from '../academy-shop/shopConfig';

// The banner: the welcome slide, then one slide per program currently on the hero list.
// Photos are chosen per program page; a program without one here uses the welcome photo.
export const SLIDE_PHOTO = {
    // One of our own players bowling (Andy, 23 Nov 2026: "a spin bowler bowling from within our
    // academy"), from a Power League match; cropped so the bowler sits right of the headline.
    '/spin-club': { src: '/assets/home/spin-club-bowler.jpg', alt: 'A Rajasthan Royals Academy Melbourne bowler gathering to bowl in a Power League match, with the umpire watching' },
    // Power League match photo (Andy, 23 Nov 2026), trimmed 40px on the left to drop a cut-off overlay logo.
    '/performance-squads': { src: '/assets/home/performance-squads-power-league.jpg', alt: 'A Power League T20 match, with Power League, rramelbourne.com and Whitewall banners on the boundary' },
    // The March Junior Royals intake (1800 x 1200, sharp): Andy, 23 Nov 2026, "a nice full image"
    // of Junior Royals at one of our centres, replacing the pixelated squad-talk video frame.
    '/junior-royals': { src: '/assets/community-coaches.jpg', alt: 'Junior Royals players and coaches at the March intake, in front of the Rajasthan Royals Academy Melbourne banners', position: '50% 62%' },
    // Sid coaching a batter in one of our Melbourne nets (Andy, 23 Nov 2026: "as it is done in Melbourne").
    '/private-coaching': { src: '/assets/home/private-coaching-sid-batter-melbourne.jpg', alt: 'Siddhartha Lahiri coaching a batter one-on-one in a Rajasthan Royals Academy Melbourne net', position: '55% 35%' },
};
export const WELCOME_SLIDE = {
    src: '/assets/hero-vs-full.jpg',
    position: '70% 30%',
    kicker: '2026 Programs now open',
    lead: 'Melbourne’s Official Rajasthan Royals Academy.',
    body: 'From elite players to beginners, we provide opportunities for male and female cricketers, players of all ages and abilities. The Royals Way has shaped IPL, global and local cricket stars — now available to cricketers across Melbourne.',
};
// High Performance Camp at the Rajasthan Royals High Performance Centre (Andy, 23 Nov 2026):
// its own slide, straight after the welcome slide, "so people can click on it and register now for
// our April tour" on the /tours page. Wording as the /tours page and the Programs menu have it.
export const HPC_CAMP_SLIDE = {
    title: 'High Performance Camp',
    line: 'Our April 2027 tour to the Rajasthan Royals High Performance Centre, India',
    href: '/tours',
    cta: 'Register Now',
    src: '/assets/home/hpc-camp-team-talk.jpg',
    alt: 'Rajasthan Royals Academy Melbourne players with Royals coaches on the ground at the Rajasthan Royals High Performance Centre',
};

export const PROGRAM_SLIDES = [
    HPC_CAMP_SLIDE,
    ...HERO_PROGRAMS.map((p) => ({
        title: p.label,
        line: p.badge,
        href: p.route,
        ...(SLIDE_PHOTO[p.route] || { src: WELCOME_SLIDE.src, alt: '' }),
    })),
];

// Leadership carousel: Sid and Andy (as on the home page), then Alex Lewis.
export const LEADERS = [
    ...LEADERS_TOP.map((c) => ({ name: c.name, org: c.org, role: c.role, bio: c.bio, img: c.image })),
    {
        name: DIRECTOR.name,
        org: 'Rajasthan Royals Academy Melbourne',
        role: 'Director of Cricket and Head Coach',
        bio: DIRECTOR.tagline,
        img: DIRECTOR.img,
    },
];

// Our coaching team row (from Andy's mock-up). Headshots on the HALLA BOL! wall where we have
// them; no photo yet = initials. Each links to /coaches. The line under each name is WHERE THEY
// COACH, not their skill set (Andy, 23 Nov 2026).
export const TEAM = [
    { name: 'Alex Thornhill', line: 'Cranbourne North & Hallam', img: '/assets/coaches/alex-thornhill.jpg' },
    { name: 'Siddhartha Banerjee', line: 'Cranbourne North & Hallam', img: '/assets/coaches/siddhartha-banerjee-halla.jpg', pos: '50% 22%' }, // Andy, 23 Nov 2026
    { name: 'Ikroop Dhanoa', line: 'Mickleham', img: '/assets/coaches/ikroop-dhanoa-halla.jpg', pos: '50% 22%' },
    { name: 'Ritin Raman', line: 'Mickleham', img: '/assets/coaches/ritin-raman-halla.jpg', pos: '50% 22%' },
    { name: 'Mihiraj Jayasekara', line: 'Mickleham', img: '/assets/coaches/mihiraj-jayasekara-halla.jpg', pos: '50% 22%' },
    { name: 'Jinang Shah', line: 'Mickleham & Ravenhall', img: '/assets/coaches/jinang-shah-halla.jpg', pos: '50% 15%' },
    { name: 'Kavya Khatri', line: 'Mickleham & Ravenhall', img: null },
];

// The Royals Way in Melbourne: the "Who we are" section's own words and photos.
export const ROYALS_WAY = {
    paragraphs: [
        'Rajasthan Royals Academy Melbourne is the official cricket development arm of the Rajasthan Royals IPL franchise — bringing the same world-class coaching methodology and philosophy on the game that has shaped some of cricket’s best players and most explosive T20 talents.',
        'We believe every cricketer — regardless of age or current skill level — deserves access to an environment such as the one the Royals Academy provides. Our programs are built from the basics of cricket and expand into techniques of the modern game, guided by Royals qualified coaches who live and breathe the Royals Way.',
    ],
    tiles: [
        { src: '/assets/vaibhav-100-celebration.jpg', alt: 'Vaibhav Suryavanshi — Rajasthan Royals', title: 'Vaibhav Suryavanshi', line: 'Discovered by the Royals', pos: 'center 30%' },
        { src: '/assets/royals-2008-win.webp', alt: 'Rajasthan Royals — 2008 IPL Champions', title: '2008 IPL Champions', line: 'Led by #1 Royal — Shane Warne' },
    ],
};

// Power Cricket Store band (Andy, 9 Nov 2026: the shop with the Power Cricket logo and name).
// The IPL replica shirt is off sale (Andy, 23 Nov 2026); the training shorts take its place.
const STORE_IDS = ['training-shirt', 'training-shorts', 'pink-cap', 'fleece-jacket'];
export const STORE = STORE_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.displayPrice,
    badge: p.badge,
    img: p.images?.front,
}));
