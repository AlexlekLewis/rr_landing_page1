// ============================================================
// levels.ts — the two-layer "highest level played" model for Power Game.
//   Layer 1: REPRESENTATIVE level (PRIMARY qualifier) — floor is VMCU rep.
//   Layer 2: highest CLUB grade (secondary/context) — association senior min 2nd grade.
// Community/association club cricket ALONE does not clear the floor → coach review.
// Curated from the CTI ladder; Alex to confirm the rep-vs-club bucketing.
// ============================================================
import { LADDER_BY_CODE } from "../../../lib/scoring/ladder";

export interface LevelOption {
  code: string;
  label: string;
}
export interface LevelGroup {
  label: string;
  options: LevelOption[];
}

// ── PRIMARY: representative cricket (floor = VMCU rep) ──
export const REP_GROUPS: LevelGroup[] = [
  {
    label: "State & National pathway",
    options: [
      { code: "VP-19M", label: "Vic U19 Emerging" },
      { code: "VP-17M", label: "Vic U17 Emerging" },
      { code: "VP-19F", label: "Vic U19 Female Emerging" },
      { code: "VP-16F", label: "Vic U16 Female Emerging" },
      { code: "CA-19M", label: "U19 National Championships" },
      { code: "CA-17M", label: "U17 National Championships" },
      { code: "CA-16F", label: "U16 National Championships (F)" },
      { code: "CA-SSA15", label: "School Sport Australia U15" },
      { code: "RY-CW", label: "VCCL Country Week (Senior)" },
      { code: "RY-JCW", label: "VCCL Junior Country Week" },
    ],
  },
  {
    label: "Premier pathway",
    options: [
      { code: "P18M", label: "Premier Under-18s" },
      { code: "P18F", label: "Premier Under-18s (Female)" },
      { code: "P16M", label: "Dowling Shield (U16)" },
      { code: "P15F", label: "Marg Jennings Cup (U15 Female)" },
      { code: "SD-15", label: "JG Craig Shield (U15)" },
    ],
  },
  {
    label: "VMCU representative carnivals",
    options: [
      { code: "REP-17M", label: "Beitzel Shield (U17)" },
      { code: "REP-16M", label: "Keith Mackay Shield (U16)" },
      { code: "REP-14MT", label: "Russell Allen Shield (U14)" },
      { code: "REP-13M", label: "Des Nolan Cup (U13)" },
      { code: "REP-12M", label: "Keith Mitchell Shield (U12)" },
      { code: "REP-17F", label: "Mel Jones Shield (U17 Female)" },
      { code: "REP-14F", label: "Julie Savage Shield (U14 Female)" },
      { code: "REP-12F", label: "Claudia Fatone Shield (U12 Female)" },
    ],
  },
];

// ── SECONDARY: highest club grade (association senior min 2nd grade) ──
export const CLUB_GROUPS: LevelGroup[] = [
  {
    label: "Premier Cricket",
    options: [
      { code: "P1M", label: "Premier 1st XI" },
      { code: "P2M", label: "Premier 2nd XI" },
      { code: "P3M", label: "Premier 3rd XI" },
      { code: "P4M", label: "Premier 4th XI" },
      { code: "P1F", label: "Women's Premier 1st XI" },
      { code: "P2F", label: "Women's Premier 2nd XI" },
    ],
  },
  {
    label: "Sub-District (VSDCA / VTCA)",
    options: [
      { code: "SD1", label: "Sub-District 1st XI" },
      { code: "SD2", label: "Sub-District 2nd XI" },
      { code: "SD3", label: "Sub-District 3rd XI" },
      { code: "SD4", label: "Sub-District 4th XI" },
    ],
  },
  {
    label: "Association senior (2nd grade & up)",
    options: [
      { code: "CS-1T", label: "Association 1st XI — Turf" },
      { code: "CS-2T", label: "Association 2nd XI — Turf" },
      { code: "CS-1S", label: "Association 1st XI — Synthetic" },
      { code: "CS-2S", label: "Association 2nd XI — Synthetic" },
      { code: "CW-1", label: "Women's Association — Top grade" },
    ],
  },
];

const REP_CODES = new Set(REP_GROUPS.flatMap((g) => g.options.map((o) => o.code)));
const PREMIER_SUBDIST = new Set(["P1M", "P2M", "P3M", "P4M", "P1F", "P2F", "SD1", "SD2", "SD3", "SD4", "SD-V1", "SD-V2", "SD-V3"]);

/**
 * Clears the Power Game floor if it's representative cricket (VMCU+), Premier, or
 * Sub-District. Community/association club cricket alone does NOT clear it.
 */
export function clearsFloor(code?: string | null): boolean {
  if (!code) return false;
  return REP_CODES.has(code) || PREMIER_SUBDIST.has(code);
}

/** Of the chosen rep/club codes, the highest-CTI one — where stats are scored. */
export function primaryCode(rep?: string | null, club?: string | null): string | null {
  const codes = [rep, club].filter(Boolean) as string[];
  if (!codes.length) return null;
  return codes.sort((a, b) => (LADDER_BY_CODE[b]?.cti ?? 0) - (LADDER_BY_CODE[a]?.cti ?? 0))[0];
}

/** Filter option groups to the player's gender (keeps Mixed/M-F comps). */
export function groupsForGender(groups: LevelGroup[], gender: string): LevelGroup[] {
  return groups
    .map((g) => ({
      ...g,
      options: g.options.filter((o) => {
        const e = LADDER_BY_CODE[o.code];
        return !gender || !e || e.gender === gender || e.gender === "Mixed" || e.gender === "M/F";
      }),
    }))
    .filter((g) => g.options.length > 0);
}
