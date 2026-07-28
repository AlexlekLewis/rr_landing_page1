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
};

export const CENTRE = {
    name: 'Mickleham Indoor Sports Centre',
    address: '3 Eclipse Drive, Mickleham VIC 3064',
};

// What actually happens in the consultation — the value, in plain terms.
export const INCLUDES = [
    'A full one-on-one assessment of where your game is right now',
    'A development plan built around the player, not a template',
    'The right coach assigned to you — matched to what you need',
    'Your training nights locked in (Tuesdays or Fridays at Mickleham)',
];

export const STEPS = [
    { n: '01', t: 'Register below', d: 'Two minutes. No payment, no obligation.' },
    { n: '02', t: 'Alex calls you', d: 'Personally, in the coming days — to talk through the player.' },
    { n: '03', t: 'Book your consultation', d: '$50 while the launch special runs. Then you\'re away.' },
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
