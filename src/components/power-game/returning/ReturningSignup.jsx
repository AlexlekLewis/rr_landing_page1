// ============================================================
// ReturningSignup (/PGP2026/returning) — link-only express re-signup for players
// ALREADY in the Academy Elite system. Thin config over the shared ExpressSignup
// engine (gate, DOB, centre + age-band session, kit + sizing, $989 checkout).
// ============================================================
import React from 'react';
import ExpressSignup from './ExpressSignup';

const RETURNING_CONFIG = {
  source: 'pgp2026-returning',
  bio: 'Returning Academy Elite player — express re-signup (compliance on file from original enrolment).',
  accessCode: import.meta?.env?.VITE_PGP_RETURNING_CODE || 'ROYALS2026',
  gateKey: 'pgp_returning_unlocked',
  docTitle: 'Re-sign up — Power Pre-Season',
  gateTitle: 'Returning players',
  gateBlurb: 'This is the private re-signup page for players already in the Academy Elite system. Enter the access code from your invite to continue.',
  headerTitle: 'Re-sign up',
  headerLead: 'You’re already in the Academy Elite system — no need to re-qualify. Confirm your details, choose your centre & session, and secure your place for the 8-week Power Pre-Season.',
  sessionNote: 'These are the session times for the player’s age group at this centre. Your coach confirms the final squad after payment.',
  fields: { gender: true, phone: true, suburb: true, parentName: true },
};

export default function ReturningSignup() {
  return <ExpressSignup config={RETURNING_CONFIG} />;
}
