import { useEffect, useState } from 'react';

// Live prices for the welcome page, from /api/performance-squad-prices: the
// Joining Fee and weekly Squad Fee straight from Stripe, kit at participant
// prices. Displayed amounts are therefore exactly what checkout charges.
// Until the fetch lands (or if it fails) the last-known amounts below are shown.

export const FALLBACK = {
    joiningFeeCents: 14900,
    squadFeeCents: 2995,
    kit: {
        shirt: { cents: 2995 },
        pants: { cents: 3700 },
        shorts: { cents: 3500 },
        cap: { cents: 2500 },
        jacket: { cents: 4900 },
    },
};

export const fmt = (cents) => `$${(cents / 100).toFixed(2)}`;

let cached = null;

export default function usePrices() {
    const [prices, setPrices] = useState(cached || FALLBACK);
    useEffect(() => {
        if (cached) return;
        let alive = true;
        fetch('/api/performance-squad-prices')
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))))
            .then((d) => {
                if (!alive || !d?.joiningFeeCents || !d?.squadFeeCents) return;
                cached = { ...FALLBACK, ...d, kit: { ...FALLBACK.kit, ...(d.kit || {}) } };
                setPrices(cached);
            })
            .catch(() => { /* keep fallback */ });
        return () => { alive = false; };
    }, []);
    return prices;
}
