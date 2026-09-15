// GET /api/performance-squad-prices
// What the welcome page displays: program prices straight from Stripe, kit at
// participant prices from api/_lib/uniformPricing.js — the exact amounts the
// checkout charges. All amounts in cents.
import { getProgramPrices } from './_lib/performanceSquadPrices.js';
import { UNIFORM_CATALOG } from './_lib/uniformPricing.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    try {
        const program = await getProgramPrices();
        const kit = Object.fromEntries(
            Object.entries(UNIFORM_CATALOG).map(([key, c]) => [key, { label: c.label, cents: c.priceCents, oneSize: !!c.oneSize }]),
        );
        res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
        return res.status(200).json({
            joiningFeeCents: program.joiningFee.cents,
            squadFeeCents: program.squadFee.cents,
            squadFeeInterval: program.squadFee.interval,
            kit,
        });
    } catch (e) {
        console.error('performance-squad-prices error:', e);
        return res.status(500).json({ error: e.message });
    }
}
