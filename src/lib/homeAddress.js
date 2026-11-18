// ============================================================
// HOME ADDRESS — every program sign-up asks for the family's home address
// (Andy, 18 Nov 2026: "add a home address to everyone's fields because we need the
// ability to be able to send things to people.")
//
// Four required fields, saved in four text columns of the same names on the
// sign-up's table:  home_street, home_suburb, home_state, home_postcode
// Render them with <HomeAddressFields> (components/shared). Full rule: CLAUDE.md.
// ============================================================

export const ADDRESS_KEYS = ['home_street', 'home_suburb', 'home_state', 'home_postcode'];

export const AU_STATES = ['VIC', 'NSW', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'];

export const ADDRESS_ERRORS = {
    home_street: 'Please enter your street address.',
    home_suburb: 'Please enter your suburb.',
    home_state: 'Please choose a state.',
    home_postcode: 'Please enter a 4-digit postcode.',
};

export const EMPTY_ADDRESS = { home_street: '', home_suburb: '', home_state: 'VIC', home_postcode: '' };

const clean = (v) => String(v ?? '').replace(/\s+/g, ' ').trim();

// { home_street: '...', ... } for every field missing or invalid; {} when the address is complete.
export const addressErrors = (a) => {
    const e = {};
    if (clean(a?.home_street).length < 3) e.home_street = ADDRESS_ERRORS.home_street;
    if (clean(a?.home_suburb).length < 2) e.home_suburb = ADDRESS_ERRORS.home_suburb;
    if (!AU_STATES.includes(clean(a?.home_state).toUpperCase())) e.home_state = ADDRESS_ERRORS.home_state;
    if (!/^\d{4}$/.test(clean(a?.home_postcode))) e.home_postcode = ADDRESS_ERRORS.home_postcode;
    return e;
};

// The four columns for the insert, trimmed; suburb title-cased, state upper-case.
export const addressColumns = (a) => ({
    home_street: clean(a?.home_street) || null,
    home_suburb: clean(a?.home_suburb).toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || null,
    home_state: clean(a?.home_state).toUpperCase() || null,
    home_postcode: clean(a?.home_postcode) || null,
});

// One line for summaries and sheets: "12 Smith St, Mickleham VIC 3064".
export const addressLine = (a) => {
    const c = addressColumns(a);
    if (!c.home_street) return '';
    return `${c.home_street}, ${[c.home_suburb, c.home_state, c.home_postcode].filter(Boolean).join(' ')}`;
};
