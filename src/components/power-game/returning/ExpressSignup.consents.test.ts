import { describe, it, expect } from 'vitest';
import { EXPRESS_CONSENTS } from './ExpressSignup';

// api/power-game-checkout.js fails closed (403) unless ALL of these consent flags are
// true. The express pages (/PGP2026/confirm, /PGP2026/returning) pay on behalf of players
// who already consented in their original application, so EXPRESS_CONSENTS must cover
// every one. Regression (Jun 2026): accept_ability_standard was added to the API gate but
// not here, so every OFFERED player was 403'd at payment ("won't let me continue").
const REQUIRED_BY_CHECKOUT_API = [
  'accept_terms',
  'accept_player_code',
  'accept_parent_code',
  'accept_social_media',
  'accept_playing_standard',
  'accept_ability_standard',
];

describe('ExpressSignup consents cover the checkout API gate', () => {
  it('sets every API-required consent to true', () => {
    for (const key of REQUIRED_BY_CHECKOUT_API) {
      expect(EXPRESS_CONSENTS[key as keyof typeof EXPRESS_CONSENTS], key).toBe(true);
    }
  });
});
