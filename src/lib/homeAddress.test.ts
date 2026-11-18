import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { addressErrors, addressColumns, addressLine, EMPTY_ADDRESS, ADDRESS_KEYS } from './homeAddress';

// Andy, 18 Nov 2026: every sign-up asks for the family's home address so we can send
// things to people. A new sign-up form goes on this list in the same PR that builds it
// (CLAUDE.md). Live forms only: retired pages are not listed.
export const ADDRESS_SIGNUP_FORMS = [
    'src/components/junior-royals-t3/JRT3RegistrationForm.jsx',
    'src/components/september-holiday/SeptRegistrationForm.jsx',
    'src/components/little-crickets/LCRegistrationForm.jsx',
    'src/components/female-cricket-introduction/RegistrationForm.jsx',
    'src/components/spin-club/SCForm.jsx',
    'src/components/power-league/PLForm.jsx',
    'src/components/performance-squads/RegistrationForm.jsx',
    'src/components/performance-squads/welcome/WelcomeConfirmForm.jsx',
    'src/components/open-age-trial/OpenAgeRegistrationForm.jsx',
    'src/components/sid-juniors/SidJuniorsForm.jsx',
    'src/components/match-registration/MatchRegistrationForm.jsx',
    'src/components/power-game/apply/ApplyFlow.jsx',
    'src/components/power-game/returning/ExpressSignup.jsx',
];

describe('home address', () => {
    it('requires street, suburb, state and a 4-digit postcode', () => {
        expect(Object.keys(addressErrors(EMPTY_ADDRESS)).sort()).toEqual(['home_postcode', 'home_street', 'home_suburb']);
        const ok = { home_street: '12 Smith St', home_suburb: 'mickleham', home_state: 'vic', home_postcode: '3064' };
        expect(addressErrors(ok)).toEqual({});
        expect(addressErrors({ ...ok, home_postcode: '306' })).toHaveProperty('home_postcode');
        expect(addressErrors({ ...ok, home_state: 'XX' })).toHaveProperty('home_state');
    });

    it('saves four tidy columns', () => {
        const cols = addressColumns({ home_street: ' 12  Smith St ', home_suburb: 'POINT cook', home_state: 'vic', home_postcode: '3030' });
        expect(Object.keys(cols)).toEqual(ADDRESS_KEYS);
        expect(cols).toEqual({ home_street: '12 Smith St', home_suburb: 'Point Cook', home_state: 'VIC', home_postcode: '3030' });
        expect(addressLine(cols)).toBe('12 Smith St, Point Cook VIC 3030');
    });

    it.each(ADDRESS_SIGNUP_FORMS)('%s asks for and saves the home address', (file) => {
        const src = readFileSync(file, 'utf8');
        expect(src).toContain('<HomeAddressFields');
        expect(src).toMatch(/addressErrors\(/);   // blocks submit until complete
        expect(src).toMatch(/addressColumns\(/);  // saves the four columns
    });
});
