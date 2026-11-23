// ─────────────────────────────────────────────────────────────
// /programs: ONE PAGE WITH EVERY PROGRAM (Andy, 23 Nov 2026: "I want a page dedicated to
// programs ... a catch-all page so people can select where they might want to go to").
// Every "View All Programs" / "Explore All Programs" button on the site lands here.
//
// The list is the Programs menu itself (Navbar PROGRAMS_DROPDOWN), so a program added to or
// taken off the menu is added to or taken off this page too. The words on each card are the
// What's On lines (home-page/openDaysData ANNOUNCEMENTS) where a program has one, otherwise
// the wording already approved on that program's own page (EXTRA below). Photos: the home-page
// banner photo for that program.
// ─────────────────────────────────────────────────────────────

import { PROGRAMS_DROPDOWN } from '../Navbar';
import { ANNOUNCEMENTS } from '../home-page/openDaysData';
import { SLIDE_PHOTO, HPC_CAMP_SLIDE } from '../home-v2/homeV2Data';

// Names, photos and wording for programs that have no What's On line.
const EXTRA = {
    '/spin-club': { name: 'Spin Club' },
    '/mickleham': {
        name: 'Private Coaching',
        // PCHero.jsx wording (the Private Coaching page).
        line: 'One-on-one and small-group coaching at Mickleham Indoor Sports Centre, led personally by Academy Head Coach Alex Lewis.',
        detail: 'Register your interest and our team will be in touch to organise a time.',
        src: '/assets/programs/private-coaching-lanes.jpg',
        alt: 'The indoor nets at Mickleham, with Rajasthan Royals Academy Melbourne banners',
        cta: 'Register Interest',
    },
    '/tours': {
        name: 'High Performance Camp · India',
        line: HPC_CAMP_SLIDE.line,
        // The tour story and /tours: "planned for April 2027 and runs for about ten days".
        detail: 'About ten days at the home of the Royals. Register your interest and we will send the dates and the price.',
        src: HPC_CAMP_SLIDE.src,
        alt: HPC_CAMP_SLIDE.alt,
        cta: 'Register Now',
    },
};

export const ALL_PROGRAMS = PROGRAMS_DROPDOWN.map((p) => {
    const a = ANNOUNCEMENTS.find((x) => x.href === p.route) || {};
    const x = EXTRA[p.route] || {};
    const photo = SLIDE_PHOTO[p.route] || {};
    return {
        route: p.route,
        name: x.name || a.name || p.label,
        badge: p.badge,
        green: /green/.test(p.badgeColor || ''),
        line: x.line || a.tag || '',
        detail: x.detail || a.detail || '',
        src: x.src || photo.src || '/assets/hero-vs-full.jpg',
        alt: x.alt || photo.alt || '',
        position: photo.position,
        cta: x.cta || 'View Program',
    };
});
