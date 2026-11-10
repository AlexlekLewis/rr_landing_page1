// ============================================================
// GOVERNANCE BOXES — every page where a family signs up AND pays for a program
// (Andy, 10 Nov 2026: "make sure that this page, and all other pages where people
// are signing up and paying for a program, that they are ticking our governance
// boxes … we need the same one we use for holiday program/previous versions of
// junior royals").
//
// The set, wording and errors are copied from the Holiday Programs form
// (holiday-programs/RegistrationForm.jsx) and Junior Royals Term 2
// (little-crickets/LCRegistrationForm.jsx). All four are REQUIRED. They are saved in
// four boolean columns of the same names, as on `applications` and the holiday tables:
//   accept_terms, accept_player_code, accept_parent_code, accept_social_media
// Render them with <GovernanceConsents> (components/shared). Full rule: CLAUDE.md.
// ============================================================

export const PLAYER_CODE_URL = '/assets/RRA_Player_Code_of_Conduct.pdf';
export const PARENT_CODE_URL = '/assets/RRA_Parent_Guardian_Code_of_Conduct.pdf';

export const GOVERNANCE_KEYS = ['accept_terms', 'accept_player_code', 'accept_parent_code', 'accept_social_media'];

export const GOVERNANCE_ERRORS = {
    accept_terms: 'You must agree to the Terms & Conditions and Privacy Policy.',
    accept_player_code: 'You must agree to the Player Code of Conduct.',
    accept_parent_code: 'You must agree to the Parent/Guardian Code of Conduct.',
    accept_social_media: 'You must confirm your consent for social media use.',
};

export const EMPTY_CONSENTS = Object.fromEntries(GOVERNANCE_KEYS.map((k) => [k, false]));

// The boxes a form must show. Programs for juniors: all four. A program that also takes
// adults (e.g. Spin Club, 10–25) passes { adult: true } for players 18 and over, who
// aren't asked the Parent/Guardian Code (same as the Open Age Trial form).
export const requiredKeys = ({ adult = false } = {}) => GOVERNANCE_KEYS.filter((k) => !(adult && k === 'accept_parent_code'));

// { accept_terms: '...', ... } for every required box not ticked; {} when all are.
export const consentErrors = (consents, opts) =>
    Object.fromEntries(requiredKeys(opts).filter((k) => consents?.[k] !== true).map((k) => [k, GOVERNANCE_ERRORS[k]]));

// The four columns for the insert, always real booleans.
export const consentColumns = (consents) => Object.fromEntries(GOVERNANCE_KEYS.map((k) => [k, consents?.[k] === true]));
