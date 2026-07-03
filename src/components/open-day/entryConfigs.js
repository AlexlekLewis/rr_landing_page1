// Per-centre configs for the simple "Register for Entry" onsite check-in.
//
// This is the QR-poster target: a fast, phone-friendly door check-in that EVERY
// attendee completes on arrival (Junior Royals and Elite Royals alike). It captures
// the minimum contact details plus the three compliances — Terms & Conditions,
// photo/media consent, and the liability/risk waiver — so the whole crowd is
// covered, not just the Elite Trial registrants.
//
// Entry rows are written into the SAME per-centre {centre}_open_day_registrations
// table as the Elite Trial sign-ups, tagged source='{centre}-open-day-entry' and
// with an `attending` value, so they flow into the same "{Centre} Open Day" Google
// Sheet tab (distinguished by the Type / Attending columns).

export const MICKLEHAM_ENTRY = {
    slug: 'mickleham',
    route: '/PGP2026/mickleham/entry',
    table: 'mickleham_open_day_registrations',
    sourceTag: 'mickleham-open-day-entry',
    centreName: 'Mickleham',
    venueHeadline: 'Mickleham Indoor Sports Centre',
    address: '3 Eclipse Drive, Mickleham VIC 3064',
    dateHeadline: 'Sunday 5 July',
};

export const WILLIAMSTOWN_ENTRY = {
    slug: 'williamstown',
    route: '/PGP2026/williamstown/entry',
    table: 'williamstown_open_day_registrations',
    sourceTag: 'williamstown-open-day-entry',
    centreName: 'Williamstown',
    venueHeadline: 'The Netz, Williamstown North',
    address: '37 Robbins Cct, Williamstown North VIC 3016',
    dateHeadline: 'Friday 10 July',
};

export const HALLAM_ENTRY = {
    slug: 'hallam',
    route: '/PGP2026/hallam/entry',
    table: 'hallam_open_day_registrations',
    sourceTag: 'hallam-open-day-entry',
    centreName: 'Hallam',
    venueHeadline: 'Elite Cricket Centre, Hallam',
    address: '8-9 Becon Ct, Hallam VIC 3803',
    dateHeadline: 'Friday 10 July',
};

// Who the attendee is here for today. Stored in the `attending` column.
export const ATTENDING_OPTIONS = [
    { value: 'junior', label: 'Junior Royals', hint: 'Come & play' },
    { value: 'elite', label: 'Elite Royals', hint: 'Trial session' },
    { value: 'both', label: 'Both / Not sure', hint: 'Here for everything' },
];
