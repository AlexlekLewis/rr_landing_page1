import React, { useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

// Friendly 404 with the full site chrome + direct links to the main pages, so a user
// (or crawler) that lands on a dead URL always has a clear way back into the site.
//
// It also RESCUES near-miss URLs. On 26 Aug 2026 players were landing on
// /perfromace-squads (two letters transposed and an "n" dropped) and hitting this
// page instead of the trial registration form. The misspelling was not in the site
// anywhere — someone had typed the address by hand — and every one of those visits
// was a player who wanted to register and gave up instead. A typo nobody can find
// the source of should not cost a registration, so a close-enough URL now redirects
// to the page it was obviously aiming at.
const LINKS = [
    { label: 'Home', to: '/' },
    { label: 'Performance Squads', to: '/performance-squads' },
    { label: 'Junior Royals', to: '/junior-royals' },
    { label: 'Holiday Camps', to: '/junior-royals-holiday' },
    { label: 'Private Coaching', to: '/mickleham' },
    { label: 'Elite Program', to: '/elite-royals' },
    { label: 'Our Coaches', to: '/coaches' },
];

// Public routes a mistyped address could plausibly be aiming at. Keep in step with
// App.jsx — a route missing here just means its typos are not rescued, never a break.
export const KNOWN_ROUTES = [
    '/performance-squads',
    '/junior-royals',
    '/junior-royals-holiday',
    '/mickleham',
    '/elite-royals',
    '/coaches',
    '/tours',
    '/academy-shop',
    '/coaching-opportunities',
    '/reviews',
    '/privacy-policy',
    '/terms-conditions',
];

// Compare on letters and digits only, so hyphens, slashes, trailing slashes and
// capitals can't count as differences.
const slugOf = (path) => String(path || '').toLowerCase().replace(/[^a-z0-9]/g, '');

// Standard Levenshtein, two-row variant.
export const editDistance = (a, b) => {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
        const row = [i];
        for (let j = 1; j <= b.length; j++) {
            row[j] = Math.min(
                prev[j] + 1,
                row[j - 1] + 1,
                prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
            );
        }
        prev = row;
    }
    return prev[b.length];
};

// The route a mistyped path was aiming at, or null to show the 404.
//
// Two guards keep this from sending anyone somewhere they didn't ask for:
//   • the typo must be within 3 edits of a real route, and
//   • that route must be a STRICTLY better match than every other route,
//     so an ambiguous address shows the 404 rather than a coin toss.
// Very short paths are left alone entirely — at 5 characters or fewer, 3 edits is
// most of the word and almost anything "matches" something.
export const closestRoute = (pathname) => {
    const want = slugOf(pathname);
    if (want.length < 6) return null;
    let best = null;
    let bestDistance = Infinity;
    let runnerUp = Infinity;
    for (const route of KNOWN_ROUTES) {
        const d = editDistance(want, slugOf(route));
        if (d < bestDistance) {
            runnerUp = bestDistance;
            bestDistance = d;
            best = route;
        } else if (d < runnerUp) {
            runnerUp = d;
        }
    }
    return bestDistance <= 3 && bestDistance < runnerUp ? best : null;
};

const NotFound = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const rescue = closestRoute(pathname);
    if (rescue) return <Navigate to={rescue} replace />;

    return (
        <div className="min-h-screen flex flex-col bg-white text-rr-dark">
            <Navbar variant="coaches" />
            <main className="flex-1 flex items-center justify-center px-6 pt-32 pb-20">
                <div className="text-center max-w-xl">
                    <p className="text-rr-pink font-black tracking-[0.3em] uppercase text-sm">404</p>
                    <h1 className="mt-3 text-4xl md:text-5xl font-black uppercase tracking-tight">
                        Page not found
                    </h1>
                    <p className="mt-4 text-rr-charcoal/70 text-lg">
                        That page has moved or never existed. Here's where to head instead:
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        {LINKS.map((l) => (
                            <Link
                                key={l.to}
                                to={l.to}
                                className="px-5 py-2.5 rounded-full bg-rr-pink text-white font-bold text-sm hover:bg-rr-dark transition-colors"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default NotFound;
