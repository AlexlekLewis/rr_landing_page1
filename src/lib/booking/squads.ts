// ============================================================
// squads.ts — the canonical Power Game squad grid (2 centres).
//
// CAPACITY RATIO (Alex): a SQUAD = 26 players per 7 lanes in a 2-hour block.
// A TEAM = 50% of a squad = 13 (the balanced side coaches build inside a squad).
// So capacity is LANE-DRIVEN:  team = round(lanes × 26/7 ÷ 2) = round(lanes × 13/7).
//   7 lanes → team 13 (squad 26)   ·   5 lanes → team 9 (squad 18)
//
// Each row below is a bookable TEAM (a stream×age group's slot). Two teams that
// share a `blockId` (same centre+day+time) make up one SQUAD (the 2-hour block).
// The Supabase seed in migration 20260608000000_power_game_booking.sql mirrors this.
// ============================================================

export type Stream = "performance" | "pathway";
export type AgeBand = "12-14" | "14-16" | "17+";

/** Squad ratio: 26 players per 7 lanes. */
export const PLAYERS_PER_LANE = 26 / 7;
/** Team (half a squad) capacity for a given lane count — 7→13, 5→9. */
export const teamCapacity = (lanes: number): number => Math.round((lanes * PLAYERS_PER_LANE) / 2);
/** Full squad (block) capacity for a given lane count — 7→26, 5→18. */
export const squadCapacity = (lanes: number): number => 2 * teamCapacity(lanes);

export interface Centre {
  slug: string;
  name: string;
  suburb: string;
  address: string;
  /** A future venue whose name/location/times aren't confirmed yet — selectable on
   *  the funnel to register interest, but it has no squads to book (routes to review). */
  comingSoon?: boolean;
}

export interface Squad {
  id: string;
  centre: string;
  /** Groups the two teams that share one 2-hour block (= a full squad of 26). */
  blockId: string;
  band: AgeBand;
  stream: Stream;
  day: string;
  startTime: string;
  endTime: string;
  /** Lanes available to this team's block. */
  lanes: number;
  /** Bookable team capacity = round(lanes × 13/7). */
  capacity: number;
  blockLabel: string;
  sortOrder: number;
}

export const CENTRES: Centre[] = [
  { slug: "williamstown", name: "The Netz", suburb: "Williamstown", address: "37 Robbins Cct, Williamstown North VIC 3016" },
  { slug: "hallam", name: "Elite Cricket Centre", suburb: "Hallam", address: "8-9 Becon Ct, Hallam VIC 3803" },
  // Third venue — name/location/times not confirmed yet. Captures interest only.
  { slug: "venue-3", name: "New Venue", suburb: "Location to be announced", address: "To be announced", comingSoon: true },
];

/** Centres that are open for booking now (have squads). */
export const ACTIVE_CENTRES = CENTRES.filter((c) => !c.comingSoon);

export const CENTRE_BY_SLUG: Record<string, Centre> = Object.fromEntries(CENTRES.map((c) => [c.slug, c]));

// Raw rows carry lanes; capacity + blockId are derived from the ratio below.
type RawSquad = Omit<Squad, "capacity" | "blockId">;
const RAW: RawSquad[] = [
  // ── Williamstown — The Netz ──
  { id: "w-fri-perf-17", centre: "williamstown", band: "17+", stream: "performance", day: "Friday", startTime: "8:00pm", endTime: "10:00pm", lanes: 5, blockLabel: "Fri 8–10pm", sortOrder: 1 },
  { id: "w-fri-perf-1416", centre: "williamstown", band: "14-16", stream: "performance", day: "Friday", startTime: "8:00pm", endTime: "10:00pm", lanes: 5, blockLabel: "Fri 8–10pm", sortOrder: 2 },
  { id: "w-sat2-perf-1214", centre: "williamstown", band: "12-14", stream: "performance", day: "Saturday", startTime: "2:00pm", endTime: "4:00pm", lanes: 7, blockLabel: "Sat 2–4pm", sortOrder: 3 },
  { id: "w-sat2-path-1214", centre: "williamstown", band: "12-14", stream: "pathway", day: "Saturday", startTime: "2:00pm", endTime: "4:00pm", lanes: 7, blockLabel: "Sat 2–4pm", sortOrder: 4 },
  { id: "w-sat4-perf-1416", centre: "williamstown", band: "14-16", stream: "performance", day: "Saturday", startTime: "4:00pm", endTime: "6:00pm", lanes: 7, blockLabel: "Sat 4–6pm", sortOrder: 5 },
  { id: "w-sat4-path-1416", centre: "williamstown", band: "14-16", stream: "pathway", day: "Saturday", startTime: "4:00pm", endTime: "6:00pm", lanes: 7, blockLabel: "Sat 4–6pm", sortOrder: 6 },

  // ── Hallam — Elite Cricket Centre ──
  { id: "h-thu-perf-17", centre: "hallam", band: "17+", stream: "performance", day: "Thursday", startTime: "8:00pm", endTime: "10:00pm", lanes: 5, blockLabel: "Thu 8–10pm", sortOrder: 1 },
  { id: "h-thu-perf-1416", centre: "hallam", band: "14-16", stream: "performance", day: "Thursday", startTime: "8:00pm", endTime: "10:00pm", lanes: 5, blockLabel: "Thu 8–10pm", sortOrder: 2 },
  { id: "h-sat12-perf-1214", centre: "hallam", band: "12-14", stream: "performance", day: "Saturday", startTime: "12:00pm", endTime: "2:00pm", lanes: 5, blockLabel: "Sat 12–2pm", sortOrder: 3 },
  { id: "h-sat12-path-1214", centre: "hallam", band: "12-14", stream: "pathway", day: "Saturday", startTime: "12:00pm", endTime: "2:00pm", lanes: 5, blockLabel: "Sat 12–2pm", sortOrder: 4 },
  { id: "h-sat2-perf-1416", centre: "hallam", band: "14-16", stream: "performance", day: "Saturday", startTime: "2:00pm", endTime: "4:00pm", lanes: 5, blockLabel: "Sat 2–4pm", sortOrder: 5 },
  { id: "h-sat2-path-1416", centre: "hallam", band: "14-16", stream: "pathway", day: "Saturday", startTime: "2:00pm", endTime: "4:00pm", lanes: 5, blockLabel: "Sat 2–4pm", sortOrder: 6 },
];

export const SQUADS: Squad[] = RAW.map((s) => ({
  ...s,
  blockId: `${s.centre}-${s.day}-${s.startTime}`,
  capacity: teamCapacity(s.lanes),
}));

/** Squads (teams) matching a player's placement (band + stream) at an optional centre. */
export function squadsForPlacement(opts: { centre?: string; band: string; stream: string }): Squad[] {
  return SQUADS.filter(
    (s) => s.band === opts.band && s.stream === opts.stream && (!opts.centre || s.centre === opts.centre),
  ).sort((a, b) => a.sortOrder - b.sortOrder);
}
