import APPROVED_KEYS from './approvedBadgeKeys.json';
import { BADGES } from './jrV2Facts';

// ─────────────────────────────────────────────────────────────
// Alex's approved Junior Royals badges, all three phases (artwork approved 15 Oct
// 2026), each carrying the official Rajasthan Royals Academy Melbourne logo
// (approved 20 Oct 2026). Vector files, copied byte for byte from the approved
// package "Junior-Royals-All-Three-Phases-with-logo" (Master Landing Page/Junior
// Royals Badges/) — the same files the portal serves:
//   public/assets/junior-royals/badges/<key>-ribbon.svg   with the name ribbon
//   public/assets/junior-royals/badges/<key>.svg          without it
// approvedBadgeKeys.json lists the 71 keys. Wherever the page shows a badge that is
// on that list, it shows this artwork instead of a drawing from JRV2Badges.jsx.
// ─────────────────────────────────────────────────────────────

const DIR = '/assets/junior-royals/badges/';
const KEYS = new Set(APPROVED_KEYS);

// "Keeper’s Gloves" → "keepers-gloves", "Line Up, Hit" → "line-up-hit"
export const badgeSlug = (name) =>
    name.toLowerCase().replace(/’/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// The approved artwork for a badge, by name (with its ribbon), or null.
export const approvedBadge = (name) => (KEYS.has(badgeSlug(name)) ? `${DIR}${badgeSlug(name)}-ribbon.svg` : null);

// The 28 Discover badges, name → file.
export const APPROVED_BADGES = Object.fromEntries(BADGES.discover.map((b) => [b.name, approvedBadge(b.name)]));
