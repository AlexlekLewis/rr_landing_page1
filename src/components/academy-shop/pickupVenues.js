// Academy Shop pickup locations — the Academy's two centres (Alex, 5 Oct 2026:
// "Hallam and Williamstown no longer exist as part of the organisation for the
// moment"). New orders can only choose these. api/_lib/pickupVenues.js holds the
// same list for Stripe checkout and the order email — change both together.
export const PICKUP_VENUES = [
    {
        id: 'mickleham',
        name: 'Mickleham Indoor Sports Centre',
        address: '3 Eclipse Drive, Mickleham VIC 3064',
    },
    {
        id: 'cranbourne-north',
        name: 'Elite Cricket Centre — Cranbourne North',
        address: '30 Medley Drive, Cranbourne North VIC 3977',
    },
];

export const PICKUP_SUMMARY = 'Mickleham Indoor Sports Centre or the Elite Cricket Centre, Cranbourne North';

// Orders placed before 5 Oct 2026 can still carry the old pickup ids (in the
// success-page link or saved in the browser). Keep showing those correctly.
const LEGACY_VENUES = {
    bundoora: { id: 'bundoora', name: 'Cutting Edge Cricket — Bundoora', address: 'Unit 7, Factory 19, Enterprise Drive, Bundoora VIC 3083' },
    hallam: { id: 'hallam', name: 'Cricket Connect — Hallam', address: '22 Technology CCT, Hallam VIC 3803' },
};

export const pickupVenueDetails = (id) => PICKUP_VENUES.find((v) => v.id === id) || LEGACY_VENUES[id] || null;
