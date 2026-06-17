// ============================================================
// AcceptedSignup (/PGP2026/confirm) — link-only express confirmation for players
// who went through the MAIN funnel as a review/callback and have since been OFFERED
// a spot. They've already given us their details, so this is the lightest possible
// touch: just enough identity (name + email + DOB) to reconcile against their
// existing application, the centre they requested + their age-appropriate session,
// optional kit with sizing, and straight to the $989 checkout.
//
// Rows are tagged source='pgp2026-accepted' so the team can match the paid row back
// to the player's original review/callback record by name + DOB + email.
// ============================================================
import React from 'react';
import ExpressSignup from './ExpressSignup';

const ACCEPTED_CONFIG = {
  source: 'pgp2026-accepted',
  bio: 'Accepted review/callback player — express spot confirmation (details on file from original application).',
  accessCode: import.meta?.env?.VITE_PGP_ACCEPTED_CODE || 'SQUAD2026',
  gateKey: 'pgp_accepted_unlocked',
  docTitle: 'Confirm your spot — Power Pre-Season',
  gateTitle: 'Confirm your spot',
  gateBlurb: 'This is the private confirmation page for players we’ve offered a place. Enter the access code from your email to continue.',
  headerTitle: 'Confirm your spot',
  headerLead: 'You’ve been offered a place in the Power Pre-Season. Confirm a few details so we can match your application, pick your kit, and secure your spot — we already have the rest.',
  sessionNote: 'These are the session times for the player’s age group at this centre. Your coach confirms the final squad after payment.',
  fields: { gender: false, phone: false, suburb: false, parentName: false },
};

export default function AcceptedSignup() {
  return <ExpressSignup config={ACCEPTED_CONFIG} />;
}
