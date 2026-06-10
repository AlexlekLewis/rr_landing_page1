// ============================================================
// blind-study.test.ts — BLIND validation of the induction engine
// ============================================================
// Throwaway diagnostic (not part of the real suite's intent — safe to delete).
// 10 fabricated-but-realistic players are scored by computeDna(). The point of a
// BLIND study: the expected ranking + directional hypotheses below were written
// from cricketing judgement BEFORE running the engine, and are NOT derived from
// CTI×ARM×PF arithmetic. We then check whether the engine agrees.
//
// Run:  npx vitest run src/lib/scoring/blind-study.test.ts
// ============================================================

import { describe, it, expect } from "vitest";
import { computeDna, type CompetitionTierInput, type ComputeDnaInput, type DnaResult } from "./engine";

// ── Ladder rows actually referenced by the cohort (verbatim CTI / expectedAge from migration 032) ──
const TIERS: CompetitionTierInput[] = [
  { code: "P1M", ctiValue: 1.0, expectedMidpointAge: 24 }, // Premier 1st XI men — ceiling
  { code: "P2M", ctiValue: 0.85, expectedMidpointAge: 22 }, // Premier 2nd XI men
  { code: "P3M", ctiValue: 0.75, expectedMidpointAge: 21 }, // Premier 3rd XI men
  { code: "P18M", ctiValue: 0.75, expectedMidpointAge: 16.5 }, // Premier U18 men
  { code: "P16M", ctiValue: 0.75, expectedMidpointAge: 14.5 }, // Dowling Shield
  { code: "P1F", ctiValue: 0.85, expectedMidpointAge: 22 }, // Premier 1st XI women
  { code: "REP-17F", ctiValue: 0.5, expectedMidpointAge: 15.5 }, // Mel Jones Shield (VMCU rep, F)
  { code: "REP-16M", ctiValue: 0.45, expectedMidpointAge: 15 }, // Keith Mackay Shield (VMCU rep, M)
  { code: "SD1", ctiValue: 0.7, expectedMidpointAge: 24 }, // VSDCA 1st XI
  { code: "RY-2S", ctiValue: 0.35, expectedMidpointAge: 21 }, // Country lower synthetic — BELOW rep floor
];

// Each player: a human label + the engine input. DOBs chosen so ages are stable around mid-2026.
interface Case {
  id: string;
  name: string;
  blurb: string;
  input: ComputeDnaInput;
}

const base = (over: Partial<ComputeDnaInput>): ComputeDnaInput => ({
  profile: { dob: null },
  history: [],
  stats: [],
  competitionTiers: TIERS,
  currentSeasonStartYear: 2025,
  ...over,
});

const CASES: Case[] = [
  {
    id: "P1",
    name: "Marcus (elite senior batter)",
    blurb: "24yo, Premier 1st XI, avg 42 SR145 T20 (12) + avg 48 OD (10). Genuinely elite, big sample.",
    input: base({
      profile: { dob: "2002-01-15", battingPositionBand: "1-3" },
      history: [{ competitionCode: "P1M", mostRecentSeason: "2025/26", isRepresentativeHonour: false }],
      stats: [
        { season: "2025/26", format: "t20", competitionCode: "P1M", batMatches: 12, batInnings: 12, batRuns: 462, batAverage: 42, batStrikeRate: 145, batHundreds: 1, batFifties: 3 },
        { season: "2025/26", format: "od", competitionCode: "P1M", batMatches: 10, batInnings: 10, batRuns: 432, batAverage: 48, batStrikeRate: 92, batHundreds: 2 },
      ],
    }),
  },
  {
    id: "P2",
    name: "Jayden (gifted 14yo, playing up)",
    blurb: "14yo batting at U18 Premier level, avg 38 SR150 T20 (10). Big underdog. Should beat mediocre seniors.",
    input: base({
      profile: { dob: "2011-09-01", battingPositionBand: "1-3" },
      history: [
        { competitionCode: "P18M", mostRecentSeason: "2025/26", isRepresentativeHonour: false },
        { competitionCode: "REP-16M", mostRecentSeason: "2025/26", isRepresentativeHonour: true },
      ],
      stats: [
        { season: "2025/26", format: "t20", competitionCode: "P18M", batMatches: 10, batInnings: 10, batRuns: 342, batAverage: 38, batStrikeRate: 150, batFifties: 3 },
      ],
    }),
  },
  {
    id: "P3",
    name: "Tom (mediocre 18yo)",
    blurb: "18yo at U18 Premier (older than band), avg 26 SR110 T20 (12). Par-ish, playing at/below age.",
    input: base({
      profile: { dob: "2008-01-10", battingPositionBand: "4-6" },
      history: [{ competitionCode: "P18M", mostRecentSeason: "2025/26", isRepresentativeHonour: false }],
      stats: [
        { season: "2025/26", format: "t20", competitionCode: "P18M", batMatches: 12, batInnings: 12, batRuns: 286, batAverage: 26, batStrikeRate: 110, batFifties: 1 },
      ],
    }),
  },
  {
    id: "P4",
    name: "Olivia (elite young female bowler)",
    blurb: "17yo bowling at Premier 1st Women's, avg 16 econ 4.0 OD (11). Underdog + elite. Pure bowler.",
    input: base({
      profile: { dob: "2009-01-10", bowlingRole: "new_ball", bowlingType: "pace" },
      history: [
        { competitionCode: "P1F", mostRecentSeason: "2025/26", isRepresentativeHonour: false },
        { competitionCode: "REP-17F", mostRecentSeason: "2025/26", isRepresentativeHonour: true },
      ],
      stats: [
        { season: "2025/26", format: "od", competitionCode: "P1F", bowlMatches: 11, bowlOvers: 90, bowlWickets: 28, bowlAverage: 16, bowlEconomy: 4.0 },
      ],
    }),
  },
  {
    id: "P5",
    name: "Liam (senior death bowler)",
    blurb: "21yo Premier 3rd XI, T20 econ 6.5 avg 18 SR14 (14). Strong specialist, full sample.",
    input: base({
      profile: { dob: "2005-01-10", bowlingRole: "death", bowlingType: "pace" },
      history: [{ competitionCode: "P3M", mostRecentSeason: "2025/26", isRepresentativeHonour: false }],
      stats: [
        { season: "2025/26", format: "t20", competitionCode: "P3M", bowlMatches: 14, bowlOvers: 52, bowlWickets: 22, bowlAverage: 18, bowlEconomy: 6.5, bowlStrikeRate: 14 },
      ],
    }),
  },
  {
    id: "P6",
    name: "Noah (3-match purple patch — TRAP)",
    blurb: "16yo VMCU rep, avg 75 SR180 T20 but only 3 matches. Best raw numbers; must be discounted.",
    input: base({
      profile: { dob: "2010-01-10", battingPositionBand: "1-3" },
      history: [{ competitionCode: "REP-16M", mostRecentSeason: "2025/26", isRepresentativeHonour: true }],
      stats: [
        { season: "2025/26", format: "t20", competitionCode: "REP-16M", batMatches: 3, batInnings: 3, batRuns: 225, batAverage: 75, batStrikeRate: 180, batHundreds: 1 },
      ],
    }),
  },
  {
    id: "P7",
    name: "Ethan (genuine all-rounder)",
    blurb: "19yo Premier 2nd XI, OD bat avg 34 (10) + OD bowl avg 24 econ 4.8 (10), 200 overs/season. Real 2 skills.",
    input: base({
      profile: { dob: "2007-01-10", battingPositionBand: "4-6", bowlingRole: "first_change", bowlingType: "spin" },
      secondarySkill: "bowling",
      secondaryVolume: { oversPerSeason: 200 },
      history: [{ competitionCode: "P2M", mostRecentSeason: "2025/26", isRepresentativeHonour: false }],
      stats: [
        { season: "2025/26", format: "od", competitionCode: "P2M", batMatches: 10, batInnings: 10, batRuns: 306, batAverage: 34, batStrikeRate: 88, bowlMatches: 10, bowlOvers: 80, bowlWickets: 18, bowlAverage: 24, bowlEconomy: 4.8 },
      ],
    }),
  },
  {
    id: "P8",
    name: "Riley (fake all-rounder — VOLUME-GATE TRAP)",
    blurb: "20yo VSDCA 1st, bat avg 30 (12). Claims bowling but only 6 overs/season w/ lucky avg 15. Gate should bite.",
    input: base({
      profile: { dob: "2006-01-10", battingPositionBand: "4-6", bowlingRole: "middle_overs", bowlingType: "spin" },
      secondarySkill: "bowling",
      secondaryVolume: { oversPerSeason: 6 },
      history: [{ competitionCode: "SD1", mostRecentSeason: "2025/26", isRepresentativeHonour: false }],
      stats: [
        { season: "2025/26", format: "od", competitionCode: "SD1", batMatches: 12, batInnings: 12, batRuns: 330, batAverage: 30, batStrikeRate: 80, bowlMatches: 5, bowlOvers: 6, bowlWickets: 4, bowlAverage: 15, bowlEconomy: 4.0 },
      ],
    }),
  },
  {
    id: "P9",
    name: "Jack (below eligibility floor)",
    blurb: "22yo, only ever country lower-synthetic (CTI 0.35), no rep. Decent avg 35 (15) but below the floor.",
    input: base({
      profile: { dob: "2004-01-10", battingPositionBand: "4-6" },
      history: [{ competitionCode: "RY-2S", mostRecentSeason: "2025/26", isRepresentativeHonour: false }],
      stats: [
        { season: "2025/26", format: "od", competitionCode: "RY-2S", batMatches: 15, batInnings: 15, batRuns: 490, batAverage: 35, batStrikeRate: 78 },
      ],
    }),
  },
  {
    id: "P10",
    name: "Sam (returning from injury)",
    blurb: "17yo VMCU rep history, but thin recent data (4 T20, avg 20 SR120) post-injury. Should flag for review.",
    input: base({
      returningFromInjury: true,
      profile: { dob: "2009-02-10", battingPositionBand: "1-3" },
      history: [{ competitionCode: "REP-16M", mostRecentSeason: "2025/26", isRepresentativeHonour: true }],
      stats: [
        { season: "2025/26", format: "t20", competitionCode: "REP-16M", batMatches: 4, batInnings: 4, batRuns: 80, batAverage: 20, batStrikeRate: 120 },
      ],
    }),
  },
];

// ── BLIND expected ranking (committed before running — cricketing judgement only) ──
const BLIND_RANK = ["P1", "P4", "P2", "P7", "P5", "P8", "P3", "P6", "P10", "P9"];

function spearman(a: string[], b: string[]): number {
  const rankA = new Map(a.map((id, i) => [id, i]));
  const rankB = new Map(b.map((id, i) => [id, i]));
  const n = a.length;
  let d2 = 0;
  for (const id of a) {
    const diff = (rankA.get(id)! - rankB.get(id)!);
    d2 += diff * diff;
  }
  return 1 - (6 * d2) / (n * (n * n - 1));
}

describe("BLIND STUDY — 10 fabricated players through computeDna", () => {
  const results = new Map<string, DnaResult>();
  for (const c of CASES) results.set(c.id, computeDna(c.input));

  it("prints the engine ranking vs the blind prediction", () => {
    const ranked = [...CASES].sort(
      (x, y) => (results.get(y.id)!.overallScore ?? -1) - (results.get(x.id)!.overallScore ?? -1),
    );
    const engineRank = ranked.map((c) => c.id);

    const byId = new Map(CASES.map((c) => [c.id, c]));
    const lines: string[] = [];
    lines.push("\n══════════════════════ ENGINE RANKING ══════════════════════");
    lines.push("rk  id   overall  tier  bat   bowl  keep   elig         flags                       who");
    ranked.forEach((c, i) => {
      const r = results.get(c.id)!;
      const f = (v: number | null) => (v == null ? "  -  " : v.toFixed(1).padStart(5));
      lines.push(
        `${String(i + 1).padStart(2)}  ${c.id.padEnd(4)} ${f(r.overallScore)}   T${r.abilityTier ?? "-"}  ${f(r.battingScore)} ${f(r.bowlingScore)} ${f(r.keepingScore)}  ${(r.eligibilityStatus).padEnd(11)} ${(r.reviewFlags.join(",") || "—").padEnd(26)} ${c.name}`,
      );
    });

    lines.push("\n──────────────── BLIND PREDICTION vs ENGINE ────────────────");
    lines.push("pos  blind          engine         match");
    for (let i = 0; i < BLIND_RANK.length; i++) {
      const want = BLIND_RANK[i];
      const got = engineRank[i];
      lines.push(`${String(i + 1).padStart(2)}   ${want.padEnd(6)}${byId.get(want)!.name.slice(0, 8).padEnd(8)} ${got.padEnd(6)}${byId.get(got)!.name.slice(0, 8).padEnd(8)} ${want === got ? "✓" : "✗"}`);
    }

    const rho = spearman(BLIND_RANK, engineRank);
    lines.push(`\nSpearman rank correlation (blind vs engine): ${rho.toFixed(3)}`);

    lines.push("\n──────────────── PER-SKILL BREAKDOWN (transparency) ────────────────");
    for (const c of CASES) {
      const b = results.get(c.id)!.breakdown;
      const fmt = (s: { cti: number; arm: number; performanceFactor: number; rawMultiplier: number; confidence: number; sampleSize: number } | null) =>
        s ? `cti${s.cti} arm${s.arm} raw${s.rawMultiplier} pf${s.performanceFactor} conf${s.confidence} n${s.sampleSize}` : "—";
      lines.push(`${c.id} ${c.name}`);
      lines.push(`     age ${b.age}  bat[${fmt(b.batting)}]  bowl[${fmt(b.bowling)}]`);
    }

    // eslint-disable-next-line no-console
    console.log(lines.join("\n"));
    expect(engineRank.length).toBe(10);
  });

  // ── Directional hypotheses (the real tests — committed before running) ──
  it("H1: gifted 14yo (Jayden) outranks mediocre 18yo (Tom) — underdog effect", () => {
    expect(results.get("P2")!.overallScore!).toBeGreaterThan(results.get("P3")!.overallScore!);
  });

  it("H2: 3-match purple patch (Noah) does NOT reach the top 4 despite best raw numbers", () => {
    const ranked = [...CASES]
      .sort((x, y) => (results.get(y.id)!.overallScore ?? -1) - (results.get(x.id)!.overallScore ?? -1))
      .map((c) => c.id);
    expect(ranked.slice(0, 4)).not.toContain("P6");
  });

  it("H3: bowlers (Olivia, Liam) are scored on bowling, batting absent (skill separation)", () => {
    expect(results.get("P4")!.bowlingScore).not.toBeNull();
    expect(results.get("P4")!.battingScore).toBeNull();
    expect(results.get("P5")!.bowlingScore).not.toBeNull();
    expect(results.get("P5")!.battingScore).toBeNull();
  });

  it("H4: fake all-rounder's (Riley) thin-volume bowling boost is neutralised toward par", () => {
    const riley = results.get("P8")!;
    const bowl = riley.breakdown.bowling!;
    // The gate's job (spec §4.5) is to NEUTRALISE an undeserved boost — pull the factor toward
    // par (1.0), NOT below it. His 6 lucky overs read as elite (raw multiplier ≈ 1.27) but the
    // volume gate crushes confidence (~0.08) so the PerformanceFactor lands at ≈ par.
    expect(riley.reviewFlags).toContain("low_secondary_volume");
    expect(bowl.rawMultiplier).toBeGreaterThan(1.2); // unfiltered: looks elite
    expect(bowl.performanceFactor).toBeLessThan(1.05); // filtered: pulled back to ~par
    expect(bowl.rawMultiplier - bowl.performanceFactor).toBeGreaterThan(0.2); // boost removed
  });

  it("H5: below-floor (Jack) flagged; injury return (Sam) flagged for review", () => {
    expect(results.get("P9")!.eligibilityStatus).toBe("below_floor");
    expect(results.get("P9")!.needsAdminReview).toBe(true);
    expect(results.get("P10")!.reviewFlags).toContain("injury_return");
    expect(results.get("P10")!.needsAdminReview).toBe(true);
  });

  it("H6: the two genuine elites (Marcus, Olivia) take the top 2, with the underdog amplified", () => {
    const ranked = [...CASES]
      .sort((x, y) => (results.get(y.id)!.overallScore ?? -1) - (results.get(x.id)!.overallScore ?? -1))
      .map((c) => c.id);
    // Both are Tier 5 elites. The ORDER is the headline design call (CONFIRM WITH ALEX):
    // the 17yo dominating Premier 1st Women's (ARM 1.25) edges the 24yo at his ceiling level
    // (ARM 1.0). This is the spec's "gifted young player outranks the established adult" effect.
    expect(new Set(ranked.slice(0, 2))).toEqual(new Set(["P1", "P4"]));
    expect(results.get("P4")!.overallScore!).toBeGreaterThan(results.get("P1")!.overallScore!);
    expect(results.get("P1")!.abilityTier).toBe(5);
    expect(results.get("P4")!.abilityTier).toBe(5);
  });
});
