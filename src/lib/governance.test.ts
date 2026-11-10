import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { consentErrors, consentColumns, requiredKeys, EMPTY_CONSENTS, GOVERNANCE_KEYS, PLAYER_CODE_URL, PARENT_CODE_URL } from './governance';
import { existsSync } from 'node:fs';

// Andy, 10 Nov 2026: every page where people sign up AND pay for a program ticks the governance
// boxes, the same ones as Holiday Programs and the earlier Junior Royals. A new paid program form
// goes on this list in the same PR that builds it (CLAUDE.md).
const PAID_SIGNUP_FORMS = [
    'src/components/junior-royals-t3/JRT3RegistrationForm.jsx',
    'src/components/spin-club/SCForm.jsx',
    'src/components/holiday-programs/RegistrationForm.jsx',
    'src/components/holiday-programs/JulyRegistrationForm.jsx',
    'src/components/september-holiday/RegistrationForm.jsx',
    'src/components/september-holiday/SeptRegistrationForm.jsx',
    'src/components/little-crickets/LCRegistrationForm.jsx',
    'src/components/female-cricket-introduction/RegistrationForm.jsx',
    'src/components/sid-juniors/SidJuniorsForm.jsx',
    'src/components/match-registration/MatchRegistrationForm.jsx',
    'src/components/performance-squads/RegistrationForm.jsx',
    'src/components/performance-squads/welcome/WelcomeConfirmForm.jsx',
    'src/components/power-game/PowerGameApplication.jsx',
    'src/components/power-game/apply/ApplyFlow.jsx',
    'src/components/power-game/returning/ExpressSignup.jsx',
    'src/components/power-game-masterclass/PowerGameMasterclass.jsx',
    'src/components/power-league/PLForm.jsx',
    'src/components/open-age-trial/OpenAgeRegistrationForm.jsx',
];

describe('governance boxes', () => {
    it('requires all four for juniors; adults skip only the Parent/Guardian Code', () => {
        expect(Object.keys(consentErrors(EMPTY_CONSENTS))).toEqual(GOVERNANCE_KEYS);
        const all = Object.fromEntries(GOVERNANCE_KEYS.map((k) => [k, true]));
        expect(consentErrors(all)).toEqual({});
        expect(consentErrors({ ...all, accept_social_media: false })).toEqual({ accept_social_media: 'You must confirm your consent for social media use.' });
        expect(requiredKeys({ adult: true })).toEqual(['accept_terms', 'accept_player_code', 'accept_social_media']);
        expect(consentErrors({ ...all, accept_parent_code: false }, { adult: true })).toEqual({});
        expect(consentColumns({ accept_terms: true })).toEqual({ accept_terms: true, accept_player_code: false, accept_parent_code: false, accept_social_media: false });
    });

    it('links to the real Code of Conduct documents', () => {
        expect(existsSync(`public${PLAYER_CODE_URL}`)).toBe(true);
        expect(existsSync(`public${PARENT_CODE_URL}`)).toBe(true);
    });

    it.each(PAID_SIGNUP_FORMS)('%s asks and saves the governance boxes', (file) => {
        const src = readFileSync(file, 'utf8');
        const shared = src.includes('<GovernanceConsents');
        if (shared) {
            expect(src).toMatch(/consentErrors\(/);   // blocks submit until ticked
            expect(src).toMatch(/consentColumns\(/);  // saves the four columns
        } else {
            for (const k of ['accept_terms', 'accept_player_code', 'accept_social_media']) expect(src).toContain(k);
            expect(src).toMatch(/accept_parent_code/);
        }
        // A Code of Conduct link must open the Code, not the Terms page.
        expect(src).not.toMatch(/href="\/terms-conditions"[^>]*>\s*(Player|Parent\/Guardian) Code of Conduct/);
    });
});
