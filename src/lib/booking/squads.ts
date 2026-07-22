// ============================================================
// squads.ts — the canonical Power Game session grid (OFFICIAL times, 3 centres).
//
// OPEN-SESSION MODEL (locked 23 Jun 2026): the program is OPEN to any player
// aged 12–26. There are NO age-band squads — a SESSION is simply one centre +
// day + time, and anyone can pick the session they want. The only cap is the
// lane-to-player ratio (26 players per 7 lanes), applied to the slot's TOTAL
// lanes. Ability is not a gate; the applicant acknowledges (one checkbox) that
// if they're not at VMCU-or-higher rep standard, coaches may move them to a more
// suitable session or recommend another Royals program. Players 11 or under are
// directed to Junior Royals; 27+ are out of range.
//
// CAPACITY: session capacity = round(lanes × 26/7) → 7→26 · 5→19 · 4→15.
// A place = a seat in that session for the WHOLE 8-week block (one fixed roster).
//
// OFFICIAL grid (total lanes per session):
//   Williamstown  Sat 2–4 (7) · Sat 4–6 (7)
//   Hallam        Sat 2–4 (5) · Sat 4–6 (4)
//   Mickleham     Sat 2–4 (7) — consolidated to the single 2–4pm session 22 Jul 2026
// ============================================================

export type Stream = "performance" | "pathway";
/** Retained for home-band display only (age is captured as info, never a gate). */
export type AgeBand = "12-14" | "14-16" | "17+";

/** Squad ratio: 26 players per 7 lanes in a 2-hour block. */
export const PLAYERS_PER_LANE = 26 / 7;
/** Full session (block) capacity for a given lane count — 7→26, 5→19, 4→15. */
export const squadCapacity = (lanes: number): number => Math.round(lanes * PLAYERS_PER_LANE);
/** @deprecated legacy perf/pathway split — kept for back-compat callers only. */
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
   *  the funnel to register interest, but it has no sessions to book (routes to review). */
  comingSoon?: boolean;
}

export interface Squad {
  id: string;
  centre: string;
  /** Slot identity (centre+day+time). With one open session per slot, id === blockId-ish. */
  blockId: string;
  day: string;
  startTime: string;
  endTime: string;
  /** Total lanes for the session. */
  lanes: number;
  /** Bookable capacity = round(lanes × 26/7). */
  capacity: number;
  blockLabel: string;
  sortOrder: number;
  /** @deprecated age is no longer a segregator — open sessions carry no band. */
  band?: AgeBand | "open";
  /** @deprecated legacy perf/pathway fields — kept optional for back-compat only. */
  stream?: Stream;
  combined?: boolean;
}

// ════════════════════════════════════════════════════════════════════════════
// PLUGGING IN NEW DAYS/TIMES: edit CENTRES + SESSION_GRID below — NOTHING ELSE.
// The page's Centres & Sessions section, the funnel's session picker, capacities
// and the cap all derive from this file. Then update the SNAPSHOT block at the
// top of src/lib/booking/inventory.test.ts and run `npx vitest run`.
// ════════════════════════════════════════════════════════════════════════════
export const CENTRES: Centre[] = [
  { slug: "williamstown", name: "The Netz", suburb: "Williamstown", region: "West Melbourne", address: "37 Robbins Cct, Williamstown North VIC 3016", dateRange: "8 weeks · Aug 1 – Sep 19" },
  { slug: "hallam", name: "Elite Cricket Centre", suburb: "Hallam", region: "South East Melbourne", address: "8-9 Becon Ct, Hallam VIC 3803", dateRange: "8 weeks · Aug 1 – Sep 19" },
  { slug: "mickleham", name: "Mickleham Indoor Sports Centre", suburb: "Mickleham", region: "North Melbourne", address: "Mickleham VIC 3064", dateRange: "8 weeks · Aug 1 – Sep 19" },
];

/** Centres that are open for booking now (have sessions). */
export const ACTIVE_CENTRES = CENTRES.filter((c) => !c.comingSoon);

export const CENTRE_BY_SLUG: Record<string, Centre> = Object.fromEntries(CENTRES.map((c) => [c.slug, c]));

// ── Program schedule ─────────────────────────────────────────────────────────
// 8 weekly sessions, every session finishing the week of Sat 19 Sep 2026, so each
// weekday runs its OWN 8-week window (first → last occurrence). Single source for
// the page's Centres section AND the funnel's time picker — they can never disagree.
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

// Each row is ONE OPEN SESSION = one centre + day + time on its full lane count.
// Any 12–26 player may pick any session; capacity = round(lanes × 26/7).
// To change days/times: edit SESSION_GRID below — NOTHING ELSE derives elsewhere.
interface RawSession {
  idBase: string;
  centre: string;
  day: string;
  startTime: string;
  endTime: string;
  lanes: number;
  blockLabel: string;
  sortOrder: number;
}

const SESSION_GRID: RawSession[] = [
  // ── The Netz — Williamstown (Sat 7 lanes) ──
  { idBase: "w-sat2",   centre: "williamstown", day: "Saturday", startTime: "2:00pm", endTime: "4:00pm", lanes: 7, blockLabel: "Sat 2–4pm", sortOrder: 1 },
  { idBase: "w-sat4",   centre: "williamstown", day: "Saturday", startTime: "4:00pm", endTime: "6:00pm", lanes: 7, blockLabel: "Sat 4–6pm", sortOrder: 2 },

  // ── Elite Cricket Centre — Hallam (Sat 2–4 = 5 lanes · Sat 4–6 = 4 lanes) ──
  { idBase: "h-sat2", centre: "hallam", day: "Saturday", startTime: "2:00pm", endTime: "4:00pm",  lanes: 5, blockLabel: "Sat 2–4pm", sortOrder: 1 },
  { idBase: "h-sat4", centre: "hallam", day: "Saturday", startTime: "4:00pm", endTime: "6:00pm",  lanes: 4, blockLabel: "Sat 4–6pm", sortOrder: 2 },

  // ── Mickleham Indoor Sports Centre — Mickleham (Sat 7 lanes) ──
  // Sat 4–6pm (m-sat4) retired 22 Jul 2026: all Mickleham players consolidated into
  // the single 2–4pm session. Existing paid m-sat4 rows in the DB are unaffected
  // (inventory answers unknown_squad; sheet sync matches by venue, not session id).
  { idBase: "m-sat2", centre: "mickleham", day: "Saturday", startTime: "2:00pm", endTime: "4:00pm",  lanes: 7, blockLabel: "Sat 2–4pm", sortOrder: 1 },
];

export const SQUADS: Squad[] = SESSION_GRID.map((r) => ({
  id: r.idBase,
  centre: r.centre,
  blockId: `${r.centre}-${r.day}-${r.startTime}`,
  day: r.day,
  startTime: r.startTime,
  endTime: r.endTime,
  lanes: r.lanes,
  capacity: squadCapacity(r.lanes),
  blockLabel: r.blockLabel,
  sortOrder: r.sortOrder,
}));

/** All OPEN sessions at a centre (day/time options). Age band is ignored — any
 *  player may pick any session. The optional `band`/`stream` args are accepted
 *  but ignored (back-compat with older call-sites). */
export function squadsForPlacement(opts: { centre?: string; band?: string; stream?: string }): Squad[] {
  return SQUADS.filter(
    (s) => !opts.centre || s.centre === opts.centre,
  ).sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Alias reading more naturally for the open-session model. */
export const sessionsForCentre = (centre?: string): Squad[] => squadsForPlacement({ centre });
