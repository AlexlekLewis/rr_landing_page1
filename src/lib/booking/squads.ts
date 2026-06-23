// ============================================================
// squads.ts — the canonical Power Game squad grid (OFFICIAL times, 3 centres).
//
// Source: Alex's capacity & enrolment sheet (10 Jun 2026). Every session is a
// 2-HOUR BLOCK; a 4-hour session window is two sequential blocks, younger band
// first ("older players schedule to later times").
//
// CAPACITY RATIO (Alex): 26 players per 7 lanes in a 2-hour block.
//   squad capacity = round(lanes × 26/7) → 7→26 · 5→19 · 4→15 · 3→11 · 2→7
//
// MODEL (locked 18 Jun 2026): a SQUAD = one age group (12-14 / 14-16 / 17+).
// A 2-hour SLOT (centre + day + time) is split across TWO DIFFERENT-age squads on
// separate lanes — they share the centre but never train together. Strength is
// sorted INSIDE a squad on the day; there is NO Performance/Pathway booking split.
// Players are placed by AGE; rep+senior players are flagged for a coach play-up call.
// Time-of-day: youngest squads in the earliest slots, 17+ only in the latest, 14-16 bridges.
// NB: a place = a seat in that squad for the WHOLE 8-week block (one fixed roster).
//
// OFFICIAL grid:
//   Williamstown  Fri 5:30 (12-14 + 14-16) · Fri 7:30 (14-16 + 17+) · Sat 2–4 (12-14 + 14-16) · Sat 4–6 (14-16 + 17+)
//   Hallam        Thu 8–10 (14-16 + 17+) · Sat 2–4 (12-14 + 14-16) · Sat 4–6 (12-14 + 17+)   [12-14 = Saturday only]
//   Mickleham     Fri 6–8 (12-14 + 14-16) · Fri 8–10 (14-16 + 17+) · Sat 2–4 (12-14 + 14-16) · Sat 4–6 (14-16 + 17+)
// ============================================================

export type Stream = "performance" | "pathway";
export type AgeBand = "12-14" | "14-16" | "17+";

/** Squad ratio: 26 players per 7 lanes in a 2-hour block. */
export const PLAYERS_PER_LANE = 26 / 7;
/** Full squad (block) capacity for a given lane count — 7→26, 5→19, 4→15. */
export const squadCapacity = (lanes: number): number => Math.round(lanes * PLAYERS_PER_LANE);
/** Per-team capacity: performance team gets the ceil half, pathway the floor half. */
export const teamCapacity = (lanes: number, stream: Stream): number => {
  const squad = squadCapacity(lanes);
  return stream === "performance" ? Math.ceil(squad / 2) : Math.floor(squad / 2);
};

export interface Centre {
  slug: string;
  name: string;
  suburb: string;
  address: string;
  /** Display region for the page's Centres section (derived UI). */
  region: string;
  /** Short, sweet program date range shown on the Centres section card,
   *  e.g. "8 weeks · Jul 30 – Sep 19". Optional until confirmed per venue. */
  dateRange?: string;
  /** A future venue whose name/location/times aren't confirmed yet — selectable on
   *  the funnel to register interest, but it has no squads to book (routes to review). */
  comingSoon?: boolean;
}

export interface Squad {
  id: string;
  centre: string;
  /** All squads sharing one 2-hour slot (centre+day+time) share this blockId. */
  blockId: string;
  band: AgeBand;
  day: string;
  startTime: string;
  endTime: string;
  /** Lanes this squad trains on (its share of the slot). */
  lanes: number;
  /** Bookable capacity = round(lanes × 26/7). */
  capacity: number;
  blockLabel: string;
  sortOrder: number;
  /** @deprecated legacy perf/pathway fields — kept optional for back-compat only. */
  stream?: Stream;
  combined?: boolean;
}

// ════════════════════════════════════════════════════════════════════════════
// PLUGGING IN NEW DAYS/TIMES (e.g. confirmed Williamstown bookings, Mickleham):
// edit CENTRES + BLOCKS below — NOTHING ELSE. The page's Centres & Sessions
// section, the funnel's centre picker, the time selector, capacities and the
// allocation all derive from this file. Then update the SNAPSHOT block at the
// top of src/lib/booking/inventory.test.ts and run `npx vitest run`.
// To activate Mickleham: fill in its CENTRES entry + uncomment/edit the
// template BLOCKS rows below.
// ════════════════════════════════════════════════════════════════════════════
export const CENTRES: Centre[] = [
  { slug: "williamstown", name: "The Netz", suburb: "Williamstown", region: "West Melbourne", address: "37 Robbins Cct, Williamstown North VIC 3016", dateRange: "8 weeks · Jul 31 – Sep 19" },
  { slug: "hallam", name: "Elite Cricket Centre", suburb: "Hallam", region: "South East Melbourne", address: "8-9 Becon Ct, Hallam VIC 3803", dateRange: "8 weeks · Jul 30 – Sep 19" },
  { slug: "mickleham", name: "Mickleham Indoor Sports Centre", suburb: "Mickleham", region: "North Melbourne", address: "Mickleham VIC 3064", dateRange: "8 weeks · Jul 31 – Sep 19" },
];

/** Centres that are open for booking now (have squads). */
export const ACTIVE_CENTRES = CENTRES.filter((c) => !c.comingSoon);

export const CENTRE_BY_SLUG: Record<string, Centre> = Object.fromEntries(CENTRES.map((c) => [c.slug, c]));

// ── Program schedule ─────────────────────────────────────────────────────────
// 8 weekly sessions, every squad finishing the week of Sat 19 Sep 2026, so each
// weekday runs its OWN 8-week window (first → last occurrence). Single source for
// the page's Centres section AND the funnel's time picker — they can never disagree.
// If the program window moves, edit here only.
export interface SessionWindow {
  start: string;
  end: string;
  order: number; // Mon=1 … Sun=7, for a centre's earliest start / latest end
}
export const SESSION_DATES: Record<string, SessionWindow> = {
  Mon: { start: "Jul 27", end: "Sep 14", order: 1 },
  Tue: { start: "Jul 28", end: "Sep 15", order: 2 },
  Wed: { start: "Jul 29", end: "Sep 16", order: 3 },
  Thu: { start: "Jul 30", end: "Sep 17", order: 4 },
  Fri: { start: "Jul 31", end: "Sep 18", order: 5 },
  Sat: { start: "Aug 1", end: "Sep 19", order: 6 },
  Sun: { start: "Aug 2", end: "Sep 20", order: 7 },
};
/** The 8-week window for a given day. Accepts "Friday" or "Fri". */
export function sessionWindow(day: string): SessionWindow | null {
  return SESSION_DATES[(day || "").slice(0, 3)] || null;
}

// Each row is ONE squad = one age group on its share of a slot's lanes. A 2-hour
// SLOT (centre+day+time) holds TWO different-age squads on separate lanes. Lanes
// split per slot: 7 → 4+3 · 5 → 3+2 · 4 → 2+2. capacity = round(lanes × 26/7).
// To change days/times/ages: edit SQUAD_GRID below — NOTHING ELSE derives elsewhere.
interface RawSquad {
  idBase: string;
  centre: string;
  band: AgeBand;
  day: string;
  startTime: string;
  endTime: string;
  lanes: number;
  blockLabel: string;
  sortOrder: number;
}

const SQUAD_GRID: RawSquad[] = [
  // ── The Netz — Williamstown (Fri 7 lanes · Sat 7 lanes) ──
  { idBase: "w-fri530-1214", centre: "williamstown", band: "12-14", day: "Friday",   startTime: "5:30pm", endTime: "7:30pm", lanes: 4, blockLabel: "Fri 5:30–7:30pm", sortOrder: 1 },
  { idBase: "w-fri530-1416", centre: "williamstown", band: "14-16", day: "Friday",   startTime: "5:30pm", endTime: "7:30pm", lanes: 3, blockLabel: "Fri 5:30–7:30pm", sortOrder: 2 },
  { idBase: "w-fri730-1416", centre: "williamstown", band: "14-16", day: "Friday",   startTime: "7:30pm", endTime: "9:30pm", lanes: 4, blockLabel: "Fri 7:30–9:30pm", sortOrder: 3 },
  { idBase: "w-fri730-17",   centre: "williamstown", band: "17+",   day: "Friday",   startTime: "7:30pm", endTime: "9:30pm", lanes: 3, blockLabel: "Fri 7:30–9:30pm", sortOrder: 4 },
  { idBase: "w-sat2-1214",   centre: "williamstown", band: "12-14", day: "Saturday", startTime: "2:00pm", endTime: "4:00pm", lanes: 4, blockLabel: "Sat 2–4pm", sortOrder: 5 }, // PURCHASED slot — keep id
  { idBase: "w-sat2-1416",   centre: "williamstown", band: "14-16", day: "Saturday", startTime: "2:00pm", endTime: "4:00pm", lanes: 3, blockLabel: "Sat 2–4pm", sortOrder: 6 },
  { idBase: "w-sat4-1416",   centre: "williamstown", band: "14-16", day: "Saturday", startTime: "4:00pm", endTime: "6:00pm", lanes: 4, blockLabel: "Sat 4–6pm", sortOrder: 7 },
  { idBase: "w-sat4-17",     centre: "williamstown", band: "17+",   day: "Saturday", startTime: "4:00pm", endTime: "6:00pm", lanes: 3, blockLabel: "Sat 4–6pm", sortOrder: 8 },

  // ── Elite Cricket Centre — Hallam (Thu 5 lanes · Sat 2–4 = 5 lanes · Sat 4–6 = 4 lanes). 12-14 = Saturday only (Thu is too late for juniors). ──
  { idBase: "h-thu8-1416", centre: "hallam", band: "14-16", day: "Thursday", startTime: "8:00pm", endTime: "10:00pm", lanes: 3, blockLabel: "Thu 8–10pm", sortOrder: 1 },
  { idBase: "h-thu8-17",   centre: "hallam", band: "17+",   day: "Thursday", startTime: "8:00pm", endTime: "10:00pm", lanes: 2, blockLabel: "Thu 8–10pm", sortOrder: 2 },
  { idBase: "h-sat2-1214", centre: "hallam", band: "12-14", day: "Saturday", startTime: "2:00pm", endTime: "4:00pm", lanes: 3, blockLabel: "Sat 2–4pm", sortOrder: 3 },
  { idBase: "h-sat2-1416", centre: "hallam", band: "14-16", day: "Saturday", startTime: "2:00pm", endTime: "4:00pm", lanes: 2, blockLabel: "Sat 2–4pm", sortOrder: 4 },
  { idBase: "h-sat4-1214", centre: "hallam", band: "12-14", day: "Saturday", startTime: "4:00pm", endTime: "6:00pm", lanes: 2, blockLabel: "Sat 4–6pm", sortOrder: 5 },
  { idBase: "h-sat4-17",   centre: "hallam", band: "17+",   day: "Saturday", startTime: "4:00pm", endTime: "6:00pm", lanes: 2, blockLabel: "Sat 4–6pm", sortOrder: 6 },

  // ── Mickleham Indoor Sports Centre — Mickleham (Fri 7 lanes · Sat 7 lanes) ──
  { idBase: "m-fri6-1214", centre: "mickleham", band: "12-14", day: "Friday",   startTime: "6:00pm", endTime: "8:00pm",  lanes: 4, blockLabel: "Fri 6–8pm", sortOrder: 1 },
  { idBase: "m-fri6-1416", centre: "mickleham", band: "14-16", day: "Friday",   startTime: "6:00pm", endTime: "8:00pm",  lanes: 3, blockLabel: "Fri 6–8pm", sortOrder: 2 },
  { idBase: "m-fri8-1416", centre: "mickleham", band: "14-16", day: "Friday",   startTime: "8:00pm", endTime: "10:00pm", lanes: 4, blockLabel: "Fri 8–10pm", sortOrder: 3 },
  { idBase: "m-fri8-17",   centre: "mickleham", band: "17+",   day: "Friday",   startTime: "8:00pm", endTime: "10:00pm", lanes: 3, blockLabel: "Fri 8–10pm", sortOrder: 4 },
  { idBase: "m-sat2-1214", centre: "mickleham", band: "12-14", day: "Saturday", startTime: "2:00pm", endTime: "4:00pm",  lanes: 4, blockLabel: "Sat 2–4pm", sortOrder: 5 }, // PURCHASED slot — keep id
  { idBase: "m-sat2-1416", centre: "mickleham", band: "14-16", day: "Saturday", startTime: "2:00pm", endTime: "4:00pm",  lanes: 3, blockLabel: "Sat 2–4pm", sortOrder: 6 },
  { idBase: "m-sat4-1416", centre: "mickleham", band: "14-16", day: "Saturday", startTime: "4:00pm", endTime: "6:00pm",  lanes: 4, blockLabel: "Sat 4–6pm", sortOrder: 7 },
  { idBase: "m-sat4-17",   centre: "mickleham", band: "17+",   day: "Saturday", startTime: "4:00pm", endTime: "6:00pm",  lanes: 3, blockLabel: "Sat 4–6pm", sortOrder: 8 },
];

export const SQUADS: Squad[] = SQUAD_GRID.map((r) => ({
  id: r.idBase,
  centre: r.centre,
  blockId: `${r.centre}-${r.day}-${r.startTime}`,
  band: r.band,
  day: r.day,
  startTime: r.startTime,
  endTime: r.endTime,
  lanes: r.lanes,
  capacity: squadCapacity(r.lanes),
  blockLabel: r.blockLabel,
  sortOrder: r.sortOrder,
}));

/** Squads matching a player's AGE BAND at an optional centre — i.e. the day/time
 *  options for that squad. Strength is sorted inside the squad, so there's no
 *  stream filter; the optional `stream` arg is accepted but ignored (back-compat). */
export function squadsForPlacement(opts: { centre?: string; band: string; stream?: string }): Squad[] {
  return SQUADS.filter(
    (s) => s.band === opts.band && (!opts.centre || s.centre === opts.centre),
  ).sort((a, b) => a.sortOrder - b.sortOrder);
}
