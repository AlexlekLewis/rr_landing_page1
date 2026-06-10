// ============================================================
// squad-placement.demo.test.ts — "dumbed-down form" feasibility demo
// ============================================================
// Question: can a SHORT application form (≈7 answers) still place a player into the
// right age squad + ability level using the EXISTING engine? This simulates the
// minimal form and prints the squad placement. Throwaway demo — safe to delete.
//
// Run: npx vitest run src/lib/scoring/squad-placement.demo.test.ts
// ============================================================

import { describe, it, expect } from "vitest";
import { computeDna, type CompetitionTierInput, type Format } from "./engine";

// The only ladder rows the demo references (CTI / expectedAge from migration 032).
const TIERS: CompetitionTierInput[] = [
  { code: "P1M", ctiValue: 1.0, expectedMidpointAge: 24 },
  { code: "P16M", ctiValue: 0.75, expectedMidpointAge: 14.5 }, // Dowling Shield
  { code: "REP-16M", ctiValue: 0.45, expectedMidpointAge: 15 }, // Keith Mackay (VMCU rep)
  { code: "P1F", ctiValue: 0.85, expectedMidpointAge: 22 }, // Premier 1st Women's
  { code: "CJ-14A", ctiValue: 0.35, expectedMidpointAge: 13 }, // community U14 A grade
  { code: "RY-2S", ctiValue: 0.35, expectedMidpointAge: 21 }, // country lower synthetic (below floor)
];

// ── THE ENTIRE MINIMAL FORM — this is everything we'd ask online ──
interface MiniForm {
  dob: string;                       // Q1
  levelCode: string;                 // Q2 (dropdown of the ladder)
  gamesLastSeason: number;           // Q3
  format: Format;                    // Q4 (T20 / one-day / multi-day)
  mainSkill: "batting" | "bowling" | "keeping"; // Q5
  average?: number;                  // Q6 (bat avg OR bowl avg)
  rate?: number;                     // Q7 optional (SR for bat, economy for bowl)
  ranAtRep?: boolean;                // implied by the level chosen (rep shield = yes)
}

// Translate the tiny form into the engine's input shape. Nothing else is asked of the player.
function place(form: MiniForm) {
  const isBat = form.mainSkill === "batting";
  const isBowl = form.mainSkill === "bowling";
  const statRow = {
    season: "2025/26",
    format: form.format,
    competitionCode: form.levelCode,
    ...(isBat
      ? { batMatches: form.gamesLastSeason, batInnings: form.gamesLastSeason, batAverage: form.average ?? null, batStrikeRate: form.rate ?? null }
      : isBowl
      ? { bowlMatches: form.gamesLastSeason, bowlAverage: form.average ?? null, bowlEconomy: form.rate ?? null }
      : { batMatches: form.gamesLastSeason, fieldCatches: form.average ?? null }),
  };

  const dna = computeDna({
    profile: {
      dob: form.dob,
      battingPositionBand: isBat ? "1-3" : null,
      bowlingRole: isBowl ? "first_change" : null,
    },
    history: [{ competitionCode: form.levelCode, mostRecentSeason: "2025/26", isRepresentativeHonour: !!form.ranAtRep }],
    stats: [statRow],
    competitionTiers: TIERS,
    currentSeasonStartYear: 2025,
  });

  // ── Map engine outputs → the two things Alex wants: age squad + ability level ──
  const LEVEL_NAME: Record<number, string> = { 5: "Elite / Academy", 4: "Performance", 3: "Development", 2: "Foundation", 1: "Entry" };
  return {
    ageSquad: dna.ageBand,
    level: dna.abilityTier ? `Lv${dna.abilityTier} — ${LEVEL_NAME[dna.abilityTier]}` : "—",
    lane: dna.battingScore != null && (dna.bowlingScore == null || dna.battingScore >= dna.bowlingScore) ? "Batting" : "Bowling",
    score: dna.overallScore,
    eligible: dna.eligibilityStatus,
    review: dna.needsAdminReview,
  };
}

describe("DEMO — minimal form → squad placement", () => {
  it("places 5 short-form applicants", () => {
    const applicants: { who: string; form: MiniForm }[] = [
      { who: "Gun 14yo batter (Dowling)", form: { dob: "2011-09-01", levelCode: "P16M", gamesLastSeason: 10, format: "t20", mainSkill: "batting", average: 38, rate: 150, ranAtRep: true } },
      { who: "Solid adult batter (Premier 1st)", form: { dob: "2002-01-15", levelCode: "P1M", gamesLastSeason: 12, format: "t20", mainSkill: "batting", average: 42, rate: 145 } },
      { who: "Young elite bowler (Premier W 1st)", form: { dob: "2009-01-10", levelCode: "P1F", gamesLastSeason: 11, format: "od", mainSkill: "bowling", average: 16, rate: 4.0, ranAtRep: true } },
      { who: "Average 13yo (community U14)", form: { dob: "2012-06-01", levelCode: "CJ-14A", gamesLastSeason: 8, format: "od", mainSkill: "batting", average: 22, rate: 95 } },
      { who: "Adult, never played rep (country synthetic)", form: { dob: "2004-01-10", levelCode: "RY-2S", gamesLastSeason: 14, format: "od", mainSkill: "batting", average: 35, rate: 80 } },
    ];

    const rows = ["\n══════════ MINIMAL FORM → SQUAD PLACEMENT (7 answers each) ══════════",
      "applicant                              age squad   level                     lane     score  flag"];
    for (const a of applicants) {
      const p = place(a.form);
      rows.push(
        `${a.who.padEnd(38)} ${p.ageSquad.padEnd(11)} ${p.level.padEnd(25)} ${p.lane.padEnd(8)} ${String(p.score).padStart(5)}  ${p.review ? "REVIEW (" + p.eligible + ")" : "ok"}`,
      );
    }
    // eslint-disable-next-line no-console
    console.log(rows.join("\n"));
    expect(applicants.length).toBe(5);
  });
});
