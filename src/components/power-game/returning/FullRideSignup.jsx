// ============================================================
// FullRideSignup (/PGP2026/fullride) — 100% FULL-RIDE scholarship registration.
// No payment: reuses ExpressSignup via config.fullRide. The ?s=<token> link fixes the
// centre (one per centre) and is single-use; the player confirms name + DOB, picks a
// session and free kit sizes, and registers straight into the sheet (source
// pgp2026-fullride) with a $0 confirmed row — no Stripe.
// ============================================================
import React from 'react';
import ExpressSignup from './ExpressSignup';

const FULLRIDE_CONFIG = {
  source: 'pgp2026-fullride',
  bio: 'Full-ride scholarship player — 100% (program + kit + fees all free), no payment.',
  accessCode: import.meta?.env?.VITE_PGP_ACCEPTED_CODE || 'SQUAD2026',
  gateKey: 'pgp_fullride_unlocked',
  requireKit: true,
  fullRide: true,
  docTitle: 'Accept your full-ride scholarship — Power Pre-Season',
  gateTitle: 'Accept your scholarship',
  gateBlurb: 'This is the private page to accept your full-ride scholarship in the Power Pre-Season. Enter the access code from your email to continue.',
  headerTitle: 'Your full-ride scholarship',
  headerLead: 'You’ve been awarded a 100% full-ride scholarship — your place, playing kit and fees are all covered. Confirm the player’s name and date of birth, pick a session and kit sizes, and secure the spot. Nothing to pay.',
  sessionNote: 'These are the session times for the player’s age group at this centre. Your coach confirms the final squad after registration.',
  fields: { gender: false, phone: false, suburb: false, parentName: false },
};

export default function FullRideSignup() {
  return <ExpressSignup config={FULLRIDE_CONFIG} />;
}
