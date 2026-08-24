// ============================================================
// launchConfig.js — Mickleham 30-Day Launch Special campaign page.
//
// One place to change the offer, the deadline and the copy. The page
// at /mickleham-launch is the conversion destination for the front-desk
// flyer QR code and the Instagram link — keep the route stable.
//
// Set by Alex 29 Jul 2026: $50 consultation (normally $160), private
// coaching at Mickleham, limited to the first 30 days.
// ============================================================

// Campaign window. END_DATE is the last day the offer is honoured.
// Change these two lines to extend or re-run the campaign.
export const START_DATE = '2026-07-29';
export const END_DATE = '2026-08-28'; // 30 days from launch

export const OFFER = {
    price: '$50',
    wasPrice: '$160',
    label: '30-Day Launch Special',
    what: 'One-on-one consultation with Academy Head Coach Alex Lewis',
    // The consultation is a ONE-OFF first session, not an ongoing rate.
    // Alex 24 Aug: this has to be unmistakable so nobody reads $50 as
    // the price of regular coaching.
    oneOff: 'First session only \u2014 you do this once',
};

export const CENTRE = {
    name: 'Mickleham Indoor Sports Centre',
    address: '3 Eclipse Drive, Mickleham VIC 3064',
};

// What actually happens in the consultation — the value, in plain terms.
// Plain-English, active voice — written to be read by a 10-year-old
// or scanned in a few seconds. Keep sentences short and concrete.
export const INCLUDES = [
    'Alex looks at your game and tells you where you\u2019re at',
    'You get a plan built for you, not a copy of someone else\u2019s',
    'He picks the right coach for you',
    'You book your night \u2014 Tuesday or Friday',
];

export const STEPS = [
    { n: '01', t: 'Fill in the form', d: 'Takes two minutes. You pay nothing now.' },
    { n: '02', t: 'We call you', d: 'We\u2019ll ring in the next few days to pick a time.' },
    { n: '03', t: 'Your first session', d: 'One hour with Alex, $50. You only do this once.' },
];

// Days remaining, floored at 0. Computed client-side against END_DATE.
export const daysLeft = () => {
    const end = new Date(`${END_DATE}T23:59:59+10:00`);
    const diff = end.getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / 86400000));
};

export const endDateLabel = () => {
    const d = new Date(`${END_DATE}T12:00:00+10:00`);
    return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long' });
};
