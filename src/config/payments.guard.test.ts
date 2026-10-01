// The payments guard. `npm run build` runs this before building, so a page
// that shows a price but cannot take the payment, or has no success page,
// fails the deploy. See src/config/paidPages.js for the rule.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PAID_PAGES } from './paidPages.js';
import { CHECKOUT_PRODUCTS, PAYABLE_TABLES } from '../../api/_lib/checkoutCatalog.js';
import { SESSIONS as SID_SESSIONS } from '../components/sid-juniors/sidJuniorsData.js';
import { TRIAL_SESSIONS } from '../components/open-age-trial/openAgeData.js';
import { PAYMENT_LINKS } from '../components/performance-squads/data.js';

const APP = readFileSync(fileURLToPath(new URL('../App.jsx', import.meta.url)), 'utf8');
const hasRoute = (path: string) => APP.includes(`path="${path.split('?')[0]}"`);

describe('every paid page can take payment and has a success page', () => {
    it.each(PAID_PAGES.map((p) => [p.route, p]))('%s', (_route, page) => {
        expect(hasRoute(page.route), `${page.route} is not a route in App.jsx`).toBe(true);
        expect(hasRoute(page.successRoute), `${page.route}: success page ${page.successRoute} is not a route in App.jsx`).toBe(true);
        if (page.payWith === 'checkout') {
            expect(page.products?.length, `${page.route}: lists no checkout products`).toBeGreaterThan(0);
            for (const key of page.products) {
                expect(CHECKOUT_PRODUCTS[key], `${page.route}: product ${key} is not in api/_lib/checkoutCatalog.js`).toBeTruthy();
            }
        } else {
            expect(page.payWith).toBe('paymentLinks');
        }
    });
});

describe('checkout catalogue', () => {
    it.each(Object.entries(CHECKOUT_PRODUCTS))('%s is wired end to end', (key, p) => {
        expect(Number.isInteger(p.amountCents) && p.amountCents > 0, `${key}: amountCents`).toBe(true);
        expect(PAYABLE_TABLES.has(p.table), `${key}: table ${p.table} is not in PAYABLE_TABLES (the webhook will not mark it paid)`).toBe(true);
        expect(p.slugs).toContain(p.paidSlug);
        expect(hasRoute(p.successPath), `${key}: success page ${p.successPath} is not a route`).toBe(true);
        expect(hasRoute(p.payPath), `${key}: pay page ${p.payPath} is not a route`).toBe(true);
        expect(PAID_PAGES.some((pg) => pg.products?.includes(key)), `${key}: not listed under any page in paidPages.js`).toBe(true);
    });
});

describe('Sid juniors: every bookable session takes payment at the advertised price', () => {
    it.each(SID_SESSIONS.map((s) => [s.key, s]))('%s', (_key, s) => {
        if (!s.bookingsOpen || !s.price) return;
        expect(Boolean(s.checkoutProduct || s.paymentLink), `${s.key}: $${s.price} on the page but no checkoutProduct or paymentLink`).toBe(true);
        if (s.checkoutProduct) {
            const p = CHECKOUT_PRODUCTS[s.checkoutProduct];
            expect(p, `${s.key}: ${s.checkoutProduct} missing from the catalogue`).toBeTruthy();
            expect(p.amountCents, `${s.key}: page says $${s.price}, checkout charges ${p.amountCents / 100}`).toBe(s.price * 100);
            expect(p.slugs).toContain(s.dbSlug);
            expect(p.slugs).toContain(`${s.dbSlug}-request`);
        }
    });
});

describe('open age trial: every centre with a session has a payment link', () => {
    it.each(TRIAL_SESSIONS.map((t) => [t.id, t]))('%s', (_id, t) => {
        expect(PAYMENT_LINKS[t.centre]?.trial?.[1], `${t.id}: no 1-session payment link for ${t.centre}`).toMatch(/^https:\/\/buy\.stripe\.com\//);
    });
});
