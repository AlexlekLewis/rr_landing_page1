// ============================================================
// MANDATORY TRAINING SHIRT — every paid program page (Andy, 9 Nov 2026):
// "on every page we ever create … the mandatory shirt ordering component that
// ensures that if they don't have a shirt they have to order it. This MUST be in
// everything either I or Alex does where it's a product based page."
//
// Every player trains in the Royals Academy training shirt. A booking form for a
// paid program asks "Does <player> already have one?" and won't continue until it
// is answered; "No" means the shirt is ordered, with a size, and charged at checkout
// where it can't be removed. Use <TrainingShirtStep> (components/shared) on the form,
// validate with shirtError(), save shirtTag() with the booking, and send families
// to a checkout that matches their answer (see CLAUDE.md, "Mandatory training shirt").
//
// Price and sizes are the same everywhere: the shop (academy-shop/sizeData.js) and
// the Power Game kit (api/_lib/uniformPricing.js UNIFORM_CATALOG.shirt) use them too.
// ============================================================
import { TOPS_SIZES, KIDS_AGE_CHART } from '../../components/academy-shop/sizeData';

export const TRAINING_SHIRT = {
    name: 'Royals Academy training shirt',
    price: 29.95, // incl. GST; Stripe price_1U3aZRIo52UEA50yAEQGEDDd ("Training Shirt (Participant Price)")
    priceLabel: '$29.95 incl. GST',
};

// Junior sizes first, then senior: one list, in the order families scan it.
export const SHIRT_SIZES = [...TOPS_SIZES.junior, ...TOPS_SIZES.senior].map((s) => s.label);

// A starting point from the kids' age chart; families can pick any size.
export const suggestedSize = (age) => {
    const a = parseInt(age, 10);
    if (!Number.isFinite(a)) return '';
    const row = KIDS_AGE_CHART.find((r) => {
        const [lo, hi] = r.age.replace(' yrs', '').split('/').map(Number);
        return a >= lo && a <= hi;
    });
    return row ? SHIRT_SIZES.find((s) => s === row.top || s.startsWith(`${row.top} `)) || '' : '';
};

// value = { has: 'yes' | 'no' | '', size: '' }
export const EMPTY_SHIRT = { has: '', size: '' };
export const needsShirt = (v) => v?.has === 'no';
export const shirtError = (v) => {
    if (v?.has !== 'yes' && v?.has !== 'no') return 'Please tell us whether your player already has a training shirt.';
    if (v.has === 'no' && !SHIRT_SIZES.includes(v.size)) return 'Please choose a shirt size.';
    return null;
};
// What is saved with the booking (e.g. in `source`): "|shirt=has" or "|shirt=order-28".
export const shirtTag = (v) => (needsShirt(v) ? `|shirt=order-${String(v.size).split(' ')[0]}` : '|shirt=has');

// PAYMENT LINK PAGES: every paid program sold through a Stripe Payment Link has a PAIR of
// links (CLAUDE.md): `withShirt` (training shirt locked at quantity 1) and `noShirt`. This picks
// the one that matches the family's answer and adds the booking id and email.
//   shirtCheckoutUrl({ withShirt: LINK_A, noShirt: LINK_B }, shirt, { id, email })
// "No" (or no answer) always gets the shirt: a booking never reaches Stripe without a shirt
// unless the family said the player already has one.
export const shirtCheckoutUrl = (links, shirt, { id, email } = {}) => {
    const u = new URL(shirt?.has === 'yes' && links.noShirt ? links.noShirt : links.withShirt);
    if (id) u.searchParams.set('client_reference_id', id);
    if (email) u.searchParams.set('prefilled_email', email);
    return u.toString();
};
