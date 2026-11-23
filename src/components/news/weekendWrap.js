// WEEKEND WRAP on the home page (Andy, 23 Nov 2026): the latest weekend's best club performances by
// players in the T20 Elite Program, Power Game Pre-Season and Performance Squads.
//
// The Power Cricket journalist writes each wrap on the Power Cricket site (src/data/weekend-wraps.js
// there) and publishes it at PARTNER_WRAP_URL. This site shows whichever is newer: that feed, or the
// copy below (kept so the section works even if the feed can't be reached). Only the feed file is
// shared: no database, keys or customer data (see network.js).
//
// Who can be named: under-18s in those three programs can be named (their families ticked the consent
// box, Andy 23 Nov 2026). Never name players who are only in Junior Royals.
import { useEffect, useState } from 'react';

export const PARTNER_WRAP_URL = 'https://powercricket.com.au/assets/network/weekend-wrap.json';

export const LOCAL_WRAP = {
    id: '2026-11-20',
    label: '20-22 November',
    from: '2026-11-20',
    to: '2026-11-22',
    storySlug: 'weekend-wrap-20-22-november',
    headline: 'Unbeaten eighties and a five-for headline a big weekend',
    knocks: [
        { name: 'Siddhant Goel', figure: '86*', detail: 'off 107 · Richmond U18 Premier · Sun' },
        { name: 'Dhruva Bezawada', figure: '81*', detail: 'off 98 · Camberwell Magpies U18 Premier · Sun' },
        { name: 'Ranen Gandhi', figure: '75', detail: 'off 129 · School 1st XI · Sat' },
        { name: 'Guransh Singh', figure: '58', detail: 'off 67 · Point Cook Centrals Sunday XI · Sun' },
        { name: 'Sridhar P. Srivatsan', figure: '52 & 50*', detail: 'Burnside Springs United 1st XI (Sat) · Werribee Sunday XI (Sun)' },
        { name: 'Anuki Dassanayake', figure: '50', detail: 'off 71 · Greenvale Kangaroos Women’s Premier 2nds · Sun' },
        { name: 'Syed Shayan Ahmad', figure: '38', detail: 'off 39 · Northcote U18 Premier · Sun' },
        { name: 'Sahasra Pulibandla', figure: '37*', detail: 'off 19 · Carlton Women’s Premier 2nds · Sun' },
    ],
    spells: [
        { name: 'Jake Frederiksen', figure: '5/45', detail: '8 overs · Diamond Creek 1st XI · Sat' },
        { name: 'Angad Singh Pantlya', figure: '3/13', detail: '6 overs, 2 maidens · Indigos 3 · Sun' },
    ],
    fielding: [{ name: 'Vishar Bellur', figure: '3', detail: '2 catches, 1 stumping · Western Lions U13 · Sun' }],
};

/** A wrap from the feed, if it's well formed. */
export const wrapFromFeed = (feed) => {
    const w = feed && feed.version === 1 ? feed.wrap : null;
    return w && w.id && w.label && Array.isArray(w.knocks) ? w : null;
};

/** The newer of two wraps (by the weekend's last day). */
export const newerWrap = (a, b) => (!a ? b : !b ? a : String(b.to) > String(a.to) ? b : a);

let request = null;
export const useWeekendWrap = () => {
    const [wrap, setWrap] = useState(LOCAL_WRAP);
    useEffect(() => {
        let alive = true;
        request ??= fetch(PARTNER_WRAP_URL, { credentials: 'omit' })
            .then((r) => (r.ok ? r.json() : null))
            .then(wrapFromFeed)
            .catch(() => null);
        request.then((remote) => { if (alive) setWrap((w) => newerWrap(w, remote)); });
        return () => { alive = false; };
    }, []);
    return wrap;
};
