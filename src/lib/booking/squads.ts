// ============================================================
// squads.ts — the canonical Power Game squad grid (OFFICIAL times, 3 centres).
//
// Source: Alex's capacity & enrolment sheet (10 Jun 2026). Every session is a
// 2-HOUR BLOCK; a 4-hour session window is two sequential blocks, younger band
// first ("older players schedule to later times").
//
// CAPACITY RATIO (Alex): a SQUAD = 26 players per 7 lanes in a 2-hour block.
// A squad = 2 mini-squads (teams): the PERFORMANCE team and the PATHWAY team.
//   squad = round(lanes × 26/7)   →  7 lanes 26 · 5 lanes 19 · 4 lanes 15
//   perf team = ceil(squad/2), pathway team = floor(squad/2)
//   →  7 lanes 13/13 · 5 lanes 10/9 · 4 lanes 8/7   (lane ratio 7:26)
// NB: a place = a seat in that mini-squad for the WHOLE 8-week block (one fixed
//     roster), not a per-week spot. "Capacity" = the enrolled roster, filled once.
//
// OFFICIAL grid (per the sheet, Netz Friday = two 2-hour blocks CONFIRMED by Alex):
//   Hallam     Thu 8–10pm (5 lanes, 17+) + Sat 12–2pm (5 lanes, 12-14) + Sat 2–4pm (4 lanes, 14-16)
//   The Netz   Fri 5:30–9:30pm (5 lanes, 2 squads) + Sat 2–4pm & 4–6pm (7 lanes)
//   Mickleham  Fri 6–8pm & 8–10pm + Sat 2–4pm & 4–6pm (7 lanes) — confirmed (facility name/address TBC).
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
  /** Groups the two teams that share one 2-hour block (= a full squad). */
  blockId: string;
  band: AgeBand;
  stream: Stream;
  day: string;
  startTime: string;
  endTime: string;
  /** Lanes available to this team's block. */
  lanes: number;
  /** Bookable team capacity (perf = ceil half, pathway = floor half of the squad). */
  capacity: number;
  blockLabel: string;
  sortOrder: number;
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

// Each RAW row is one 2-hour block (band + lanes); both stream teams are derived.
interface RawBlock {
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

const BLOCKS: RawBlock[] = [
  // ── The Netz — Williamstown (Fri 5 lanes · Sat 7 lanes). Fri = 5:30–7:30 + 7:30–9:30 (confirmed). ──
  { idBase: "w-fri530-1416", centre: "williamstown", band: "14-16", day: "Friday", startTime: "5:30pm", endTime: "7:30pm", lanes: 5, blockLabel: "Fri 5:30–7:30pm", sortOrder: 1 },
  { idBase: "w-fri730-17", centre: "williamstown", band: "17+", day: "Friday", startTime: "7:30pm", endTime: "9:30pm", lanes: 5, blockLabel: "Fri 7:30–9:30pm", sortOrder: 2 },
  { idBase: "w-sat2-1214", centre: "williamstown", band: "12-14", day: "Saturday", startTime: "2:00pm", endTime: "4:00pm", lanes: 7, blockLabel: "Sat 2–4pm", sortOrder: 3 },
  { idBase: "w-sat4-1416", centre: "williamstown", band: "14-16", day: "Saturday", startTime: "4:00pm", endTime: "6:00pm", lanes: 7, blockLabel: "Sat 4–6pm", sortOrder: 4 },

  // ── Elite Cricket Centre — Hallam (Thu 8–10pm = 5 lanes · Sat 12–2pm = 5 lanes · Sat 2–4pm = 4 lanes) ──
  { idBase: "h-thu8-17", centre: "hallam", band: "17+", day: "Thursday", startTime: "8:00pm", endTime: "10:00pm", lanes: 5, blockLabel: "Thu 8–10pm", sortOrder: 1 },
  { idBase: "h-sat12-1214", centre: "hallam", band: "12-14", day: "Saturday", startTime: "12:00pm", endTime: "2:00pm", lanes: 5, blockLabel: "Sat 12–2pm", sortOrder: 2 },
  { idBase: "h-sat2-1416", centre: "hallam", band: "14-16", day: "Saturday", startTime: "2:00pm", endTime: "4:00pm", lanes: 4, blockLabel: "Sat 2–4pm", sortOrder: 3 },

  // ── Mickleham Indoor Sports Centre — Mickleham (Fri 6–8pm + Fri 8–10pm · Sat 2–4pm + Sat 4–6pm) ──
  { idBase: "m-fri6-1416", centre: "mickleham", band: "14-16", day: "Friday", startTime: "6:00pm", endTime: "8:00pm", lanes: 7, blockLabel: "Fri 6–8pm", sortOrder: 1 },
  { idBase: "m-fri8-17", centre: "mickleham", band: "17+", day: "Friday", startTime: "8:00pm", endTime: "10:00pm", lanes: 7, blockLabel: "Fri 8–10pm", sortOrder: 2 },
  { idBase: "m-sat2-1214", centre: "mickleham", band: "12-14", day: "Saturday", startTime: "2:00pm", endTime: "4:00pm", lanes: 7, blockLabel: "Sat 2–4pm", sortOrder: 3 },
  { idBase: "m-sat4-1416", centre: "mickleham", band: "14-16", day: "Saturday", startTime: "4:00pm", endTime: "6:00pm", lanes: 7, blockLabel: "Sat 4–6pm", sortOrder: 4 },
];

export const SQUADS: Squad[] = BLOCKS.flatMap((b) =>
  (["performance", "pathway"] as Stream[]).map((stream, i) => ({
    id: `${b.idBase}-${stream === "performance" ? "perf" : "path"}`,
    centre: b.centre,
    blockId: `${b.centre}-${b.day}-${b.startTime}`,
    band: b.band,
    stream,
    day: b.day,
    startTime: b.startTime,
    endTime: b.endTime,
    lanes: b.lanes,
    capacity: teamCapacity(b.lanes, stream),
    blockLabel: b.blockLabel,
    sortOrder: b.sortOrder * 2 + i,
  })),
);

/** Squads (teams) matching a player's placement (band + stream) at an optional centre. */
export function squadsForPlacement(opts: { centre?: string; band: string; stream: string }): Squad[] {
  return SQUADS.filter(
    (s) => s.band === opts.band && s.stream === opts.stream && (!opts.centre || s.centre === opts.centre),
  ).sort((a, b) => a.sortOrder - b.sortOrder);
}
