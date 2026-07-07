// ============================================================
// ScholarshipSignup (/PGP2026/scholarship) — link-only express page for players
// offered a PROGRAM scholarship (e.g. 50% off the Power Pre-Season fee).
//
// Same engine as AcceptedSignup, with two differences driven by config:
//   • requireKit: true — the player MUST buy their shirt + shorts (kit is NOT free
//     here; the discount is on the program only). ExpressSignup enforces sizing.
//   • source: 'pgp2026-scholarship' — so scholarship players are distinguishable in
//     power_game_applications / the Power Game 2026 sheet, but land in the same place.
//
// The 50% comes from a Stripe promo code the player enters at checkout (the promo box
// is already enabled for these private flows). The coupon must be scoped to the program
// only (e.g. a fixed amount = half the fee) so the kit stays full price.
// ============================================================
import React from 'react';
import ExpressSignup from './ExpressSignup';

const SCHOLARSHIP_CONFIG = {
  source: 'pgp2026-scholarship',
  bio: 'Scholarship player — program scholarship (discount via promo code); kit purchased at full price.',
  accessCode: import.meta?.env?.VITE_PGP_ACCEPTED_CODE || 'SQUAD2026',
  gateKey: 'pgp_scholarship_unlocked',
  requireKit: true,
  docTitle: 'Accept your scholarship — Power Pre-Season',
  gateTitle: 'Accept your scholarship',
  gateBlurb: 'This is the private page to accept your scholarship place in the Power Pre-Season. Enter the access code from your email to continue.',
  headerTitle: 'Accept your scholarship',
  headerLead: 'You’ve been offered a scholarship place in the Power Pre-Season. Confirm a few details, choose your playing kit, and enter your scholarship code at the payment step to secure your spot.',
  sessionNote: 'These are the session times for the player’s age group at this centre. Your coach confirms the final squad after payment.',
  fields: { gender: false, phone: false, suburb: false, parentName: false },
};

export default function ScholarshipSignup() {
  return <ExpressSignup config={SCHOLARSHIP_CONFIG} />;
}
