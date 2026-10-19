import { BADGES } from './jrV2Facts';

// ─────────────────────────────────────────────────────────────
// Alex's approved Discover badges (13 Oct 2026). He supplied them as one sheet,
// "Junior Royals Discover — 28 approved badges" (Master Landing Page/Junior Royals
// Badges/approved/), so each badge was cut from it into its own file with a
// see-through background: public/assets/junior-royals/badges/discover/<name>.png.
// They replace the code-drawn pictures in JRV2Badges.jsx wherever a Discover badge
// appears. Each file is about 170 px wide (the sheet's own size), so keep them at
// 96 px or smaller on the page until Alex sends the original artwork.
// ─────────────────────────────────────────────────────────────

const DIR = '/assets/junior-royals/badges/discover/';

// "Keeper’s Gloves" → "keepers-gloves", "Line Up, Hit" → "line-up-hit"
export const badgeSlug = (name) =>
    name.toLowerCase().replace(/’/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export const APPROVED_BADGES = Object.fromEntries(BADGES.discover.map((b) => [b.name, `${DIR}${badgeSlug(b.name)}.png`]));

export const approvedBadge = (name) => APPROVED_BADGES[name] || null;
