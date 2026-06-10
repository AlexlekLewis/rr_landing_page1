// ============================================================
// allocation.ts — Power Game squad allocation (competency + safety + balance).
//
// Three reads off one application drive everything:
//   • SAFETY     → the engine's placed band (a minor never lands in 17+; a strong
//                  younger player steps up at most ONE adjacent band).
//   • CHALLENGE  → competency tier: Performance (top squad) vs Pathway (Squad 1).
//   • BALANCE    → soft per-squad quotas: ~50/50 bat/bowl (±tolerance), a spin floor,
//                  a keeper cap; all-rounders are the flex that fills the short side.
//
// A player is OFFERED the best 2–3 sessions that match (band × tier) and still have
// capacity + skill room. Ability decides the squad; live spots decide the offer; nobody
// already placed is ever re-sorted. Coaches do the final 50/50 split inside the two
// mini-squads of each performance squad — the tolerance is the room they need.
//
// NOTE: the band→session mapping below is INFERRED from Alex's schedule (older = later
// times), pending his confirmation. The capacities are the per-mini-squad sizes from
// that schedule. The allocation LOGIC is independent of the exact labels.
// ============================================================

export type Band = "12-14" | "14-16" | "17+";
export type Tier = "top" | "squad1";
export type SkillKind = "bat" | "bowl" | "allrounder" | "keeper";
export type BowlKind = "pace" | "spin" | null;

const BANDS: Band[] = ["12-14", "14-16", "17+"];
export const bandIndex = (b: Band): number => BANDS.indexOf(b);

/** Soft-quota config — Alex: 50/50 bat/bowl ±10–15%, a spinner floor, a keeper cap. */
export const QUOTA = {
  batTarget: 0.5,
  tolerance: 0.15, // top of his 10–15% range
  keeperCap: 2, // extra keepers count as batters
  minSpinners: 2, // soft floor per squad (reported, not blocked)
  balanceFloorSize: 4, // don't enforce balance until a squad has this many
};

export interface SquadDef {
  id: string;
  centre: string;
  centreName: string;
  session: string;
  band: Band;
  tier: Tier;
  capacity: number; // per mini-squad (training group)
}

// ── Squad model from the schedule (each band has a top + Squad-1 performance squad) ──
const _defs: SquadDef[] = [];
function add(centre: string, centreName: string, session: string, cap: number, bands: Band[]) {
  for (const band of bands) {
    for (const tier of ["top", "squad1"] as Tier[]) {
      _defs.push({
        id: `${centre}-${session}-${band}-${tier}`.replace(/[\s–:.]/g, "").toLowerCase(),
        centre, centreName, session, band, tier, capacity: cap,
      });
    }
  }
}
// older → later times. (14–16 gets a couple of options at Netz + Mickleham.)
add("hallam", "Hallam", "Sat 12–4pm", 10, ["12-14", "14-16"]);
add("hallam", "Hallam", "Sat 4–6pm", 8, ["17+"]);
add("williamstown", "The Netz", "Sat 2–4pm", 13, ["12-14"]);
add("williamstown", "The Netz", "Sat 4–6pm", 13, ["14-16"]);
add("williamstown", "The Netz", "Fri 7:30–9:30pm", 10, ["14-16", "17+"]);
add("mickleham", "Mickleham", "Sat 2–6pm", 13, ["12-14", "14-16"]);
add("mickleham", "Mickleham", "Fri 5:30–9:30pm", 13, ["14-16", "17+"]);

export const SQUADS: SquadDef[] = _defs;

export interface Player {
  id: string;
  band: Band;
  tier: Tier | "review";
  skill: SkillKind;
  bowl: BowlKind;
  score: number;
  centre?: string; // preferred centre
}

export interface SquadState {
  def: SquadDef;
  members: Player[];
}

export const emptyState = (): SquadState[] => SQUADS.map((def) => ({ def, members: [] }));
export const spotsLeft = (s: SquadState): number => s.def.capacity - s.members.length;

/** Bat-side / bowl-side counts. Keepers bat; all-rounders split 0.5/0.5. */
export function composition(members: Player[]) {
  let bat = 0, bowl = 0, ar = 0, keeper = 0, spin = 0, pace = 0;
  for (const m of members) {
    if (m.skill === "bat") bat++;
    else if (m.skill === "bowl") bowl++;
    else if (m.skill === "allrounder") ar++;
    else if (m.skill === "keeper") keeper++;
    if (m.bowl === "spin") spin++;
    else if (m.bowl === "pace") pace++;
  }
  const batSide = bat + keeper + 0.5 * ar; // keepers always bat
  const bowlSide = bowl + 0.5 * ar;
  const total = batSide + bowlSide;
  return { bat, bowl, ar, keeper, spin, pace, batSide, bowlSide, total };
}

/** Would adding `p` keep the squad inside the bat/bowl tolerance? (All-rounders never block.) */
export function hasSkillRoom(s: SquadState, p: Player): boolean {
  if (p.skill === "allrounder") return true;
  const c = composition([...s.members, p]);
  if (c.total < QUOTA.balanceFloorSize) return true; // too small to judge yet
  const batPct = c.batSide / c.total;
  return batPct >= QUOTA.batTarget - QUOTA.tolerance && batPct <= QUOTA.batTarget + QUOTA.tolerance;
}

/** How much this squad NEEDS the player's skill (lower = needs them more → ranked first). */
function need(s: SquadState, p: Player): number {
  const c = composition(s.members);
  if (p.skill === "bowl") return c.bowlSide - c.batSide; // negative when bowl-short
  if (p.skill === "bat" || p.skill === "keeper") return c.batSide - c.bowlSide;
  return 0; // all-rounder: neutral
}

/**
 * Best `limit` sessions for a player: same band + tier, with capacity AND skill room,
 * ranked by their chosen centre, then by where their skill is most needed, then by spots.
 */
export function offersFor(p: Player, states: SquadState[], limit = 3): SquadState[] {
  if (p.tier === "review") return [];
  const cands = states.filter(
    (s) => s.def.band === p.band && s.def.tier === p.tier && spotsLeft(s) > 0 && hasSkillRoom(s, p),
  );
  cands.sort((a, b) => {
    const ac = a.def.centre === p.centre ? 0 : 1;
    const bc = b.def.centre === p.centre ? 0 : 1;
    if (ac !== bc) return ac - bc;
    const an = need(a, p), bn = need(b, p);
    if (an !== bn) return an - bn;
    return spotsLeft(b) - spotsLeft(a);
  });
  return cands.slice(0, limit);
}

export type AssignResult =
  | { status: "placed"; squad: SquadState; offers: SquadState[] }
  | { status: "review" }
  | { status: "waitlist" };

/** Place a player into their first offer (simulates them accepting). */
export function assign(p: Player, states: SquadState[]): AssignResult {
  if (p.tier === "review") return { status: "review" };
  const offers = offersFor(p, states);
  if (!offers.length) return { status: "waitlist" };
  offers[0].members.push(p);
  return { status: "placed", squad: offers[0], offers };
}
