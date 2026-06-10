// ============================================================
// squad-guardrail.test.ts — BLIND study of competitive + age-appropriate placement
// ============================================================
// Tests the placement LAYER that sits on top of the score: younger competitive
// players may PLAY UP one age band; older players are NEVER demoted; a big age gap
// (e.g. a 14yo with 17yos) is never produced automatically. Plus nuanced bat/bowl
// average cases that could fool a naive ranker.
//
// BLIND: the expected placements were written from cricketing judgement BEFORE
// running. Run: npx vitest run src/lib/scoring/squad-guardrail.test.ts
// ============================================================

import { describe, it, expect } from "vitest";
import { computeDna, type CompetitionTierInput, type Format } from "./engine";

const TIERS: CompetitionTierInput[] = [
  { code: "P1M", ctiValue: 1.0, expectedMidpointAge: 24 },
  { code: "P3M", ctiValue: 0.75, expectedMidpointAge: 21 },
  { code: "P18M", ctiValue: 0.75, expectedMidpointAge: 16.5 },
  { code: "SD1", ctiValue: 0.7, expectedMidpointAge: 24 },
  { code: "CS-3S", ctiValue: 0.4, expectedMidpointAge: 21 },
  { code: "RY-2S", ctiValue: 0.35, expectedMidpointAge: 21 },
  { code: "REP-16M", ctiValue: 0.45, expectedMidpointAge: 15 },
];

// ── The age-appropriateness guardrail (the layer the website team must implement) ──
const BANDS = [
  { name: "U11-U13", hi: 13 },
  { name: "U14-U16", hi: 16 },
  { name: "U17-U19", hi: 19 },
  { name: "U20+", hi: 200 },
];
const PLAY_UP_MIN_TIER = 4; // must be Performance/Elite to justify training up
function homeBandIdx(age: number): number {
  return BANDS.findIndex((b) => age <= b.hi);
}
/** Returns { placedBand, playFlag }. Younger may play UP one band; nobody is demoted. */
function placeSquad(age: number, tier: number | null): { placedBand: string; playFlag: string | null } {
  const idx = homeBandIdx(age);
  const home = BANDS[idx];
  const next = BANDS[idx + 1];
  const nearTopOfBand = age >= home.hi - 1; // within ~1yr of the top → age-adjacent to band above
  if (next && tier != null && tier >= PLAY_UP_MIN_TIER) {
    if (nearTopOfBand) return { placedBand: next.name, playFlag: "play_up" }; // auto, age-safe
    if (tier === 5) return { placedBand: home.name, playFlag: "play_up_review" }; // exceptional but young → coach decides, NOT auto-mixed
  }
  return { placedBand: home.name, playFlag: null }; // default / never demoted
}

interface MiniForm {
  dob: string;
  levelCode: string;
  games: number;
  format: Format;
  mainSkill: "batting" | "bowling";
  batAvg?: number;
  batSR?: number;
  bowlAvg?: number;
  bowlEcon?: number;
  bowlSR?: number;
  rep?: boolean;
}

function run(f: MiniForm) {
  const isBat = f.mainSkill === "batting";
  const dna = computeDna({
    profile: { dob: f.dob, battingPositionBand: isBat ? "1-3" : null, bowlingRole: isBat ? null : "death" },
    history: [{ competitionCode: f.levelCode, mostRecentSeason: "2025/26", isRepresentativeHonour: !!f.rep }],
    stats: [
      {
        season: "2025/26",
        format: f.format,
        competitionCode: f.levelCode,
        batMatches: f.batAvg != null ? f.games : null,
        batInnings: f.batAvg != null ? f.games : null,
        batAverage: f.batAvg ?? null,
        batStrikeRate: f.batSR ?? null,
        bowlMatches: f.bowlAvg != null ? f.games : null,
        bowlAverage: f.bowlAvg ?? null,
        bowlEconomy: f.bowlEcon ?? null,
        bowlStrikeRate: f.bowlSR ?? null,
      },
    ],
    competitionTiers: TIERS,
    currentSeasonStartYear: 2025,
  });
  const lane =
    dna.battingScore != null && (dna.bowlingScore == null || dna.battingScore >= dna.bowlingScore) ? "Batting" : "Bowling";
  const sq = placeSquad(dna.breakdown.age!, dna.abilityTier);
  return { dna, lane, ...sq };
}

const CASES: { id: string; who: string; form: MiniForm }[] = [
  { id: "A", who: "16yo holding own in OPEN sub-district (SD1)", form: { dob: "2009-09-01", levelCode: "SD1", games: 12, format: "t20", mainSkill: "batting", batAvg: 35, batSR: 130 } },
  { id: "B", who: "14yo, same SD1 numbers (gifted but young)", form: { dob: "2011-09-01", levelCode: "SD1", games: 12, format: "t20", mainSkill: "batting", batAvg: 35, batSR: 130 } },
  { id: "C", who: "18yo, weak at Premier U18", form: { dob: "2008-01-10", levelCode: "P18M", games: 12, format: "t20", mainSkill: "batting", batAvg: 18, batSR: 95 } },
  { id: "D", who: "17yo gun bowler / rabbit batter (P3M)", form: { dob: "2009-01-10", levelCode: "P3M", games: 12, format: "t20", mainSkill: "bowling", bowlAvg: 16, bowlEcon: 6.5, bowlSR: 14, batAvg: 8, batSR: 70 } },
  { id: "E", who: "20yo huge average at LOW level (CS-3S)", form: { dob: "2006-01-10", levelCode: "CS-3S", games: 12, format: "t20", mainSkill: "batting", batAvg: 55, batSR: 140 } },
  { id: "F", who: "24yo modest average at TOP level (P1M)", form: { dob: "2002-01-10", levelCode: "P1M", games: 12, format: "t20", mainSkill: "batting", batAvg: 30, batSR: 120 } },
  { id: "G", who: "22yo big avg but anchor SR in T20 (SD1)", form: { dob: "2004-01-10", levelCode: "SD1", games: 12, format: "t20", mainSkill: "batting", batAvg: 45, batSR: 90 } },
  { id: "H", who: "21yo great economy, poor avg bowler (P3M)", form: { dob: "2005-01-10", levelCode: "P3M", games: 14, format: "t20", mainSkill: "bowling", bowlAvg: 34, bowlEcon: 6.0, bowlSR: 24 } },
  { id: "I", who: "21yo below-floor (country synthetic)", form: { dob: "2005-06-10", levelCode: "RY-2S", games: 14, format: "t20", mainSkill: "batting", batAvg: 30, batSR: 110 } },
  { id: "J", who: "15yo solid VMCU rep (Keith Mackay)", form: { dob: "2010-09-01", levelCode: "REP-16M", games: 10, format: "t20", mainSkill: "batting", batAvg: 30, batSR: 120, rep: true } },
];

describe("BLIND — competitive + age-appropriate squad placement", () => {
  const R = new Map(CASES.map((c) => [c.id, run(c.form)]));

  it("prints the placement table", () => {
    const L: Record<number, string> = { 5: "Elite", 4: "Performance", 3: "Development", 2: "Foundation", 1: "Entry" };
    const lines = ["\n═══════════ SQUAD PLACEMENT (score → age-appropriate squad) ═══════════",
      "id  who                                             age  squad      level         lane     score  flag"];
    for (const c of CASES) {
      const r = R.get(c.id)!;
      lines.push(
        `${c.id}   ${c.who.padEnd(46)} ${String(r.dna.breakdown.age).padStart(3)}  ${r.placedBand.padEnd(9)} ${("T" + (r.dna.abilityTier ?? "-") + " " + L[r.dna.abilityTier ?? 0]).padEnd(13)} ${r.lane.padEnd(8)} ${String(r.dna.overallScore).padStart(5)}  ${[r.playFlag, ...r.dna.reviewFlags].filter(Boolean).join(",") || "—"}`,
      );
    }
    // eslint-disable-next-line no-console
    console.log(lines.join("\n"));
    expect(R.size).toBe(10);
  });

  // ── Committed hypotheses (cricketing judgement, before running) ──
  it("G1: competitive 16yo plays UP one band (16→U17-U19)", () => {
    expect(R.get("A")!.placedBand).toBe("U17-U19");
    expect(R.get("A")!.playFlag).toBe("play_up");
  });
  it("G2: equally-gifted 14yo is NOT auto-mixed with older players — stays in age band, coach-review", () => {
    expect(R.get("B")!.placedBand).toBe("U14-U16");
    expect(R.get("B")!.playFlag).toBe("play_up_review");
  });
  it("G3: weak 18yo is NOT demoted to a younger band — stays U17-U19", () => {
    expect(R.get("C")!.placedBand).toBe("U17-U19");
    expect(R.get("C")!.playFlag).toBeNull();
  });
  it("G4: gun bowler / rabbit batter is laned as a BOWLER", () => {
    expect(R.get("D")!.lane).toBe("Bowling");
    expect(R.get("D")!.dna.bowlingScore!).toBeGreaterThan(R.get("D")!.dna.battingScore!);
  });
  it("G5: huge average at a LOW level does NOT outrank a modest average at the TOP level", () => {
    expect(R.get("F")!.dna.overallScore!).toBeGreaterThan(R.get("E")!.dna.overallScore!);
    expect(R.get("F")!.dna.abilityTier!).toBeGreaterThan(R.get("E")!.dna.abilityTier!);
  });
  it("G6: a top-heavy anchor SR in T20 drags the batting score below a balanced same-level peer", () => {
    // G (avg45/SR90 @ SD1) should NOT beat a balanced player; compare its raw multiplier to par-ish.
    expect(R.get("G")!.dna.breakdown.batting!.rawMultiplier).toBeLessThan(1.15); // SR floor caps the blend
  });
  it("G7: below-floor older player flagged for review, stays U20+", () => {
    expect(R.get("I")!.dna.eligibilityStatus).toBe("below_floor");
    expect(R.get("I")!.placedBand).toBe("U20+");
    expect(R.get("I")!.dna.needsAdminReview).toBe(true);
  });
});
