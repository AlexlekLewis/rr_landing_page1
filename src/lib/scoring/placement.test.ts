// ============================================================
// placement.test.ts — integration of the vendored engine with the Power Game
// ladder (ladder.ts) + the re-banded guardrail (guardrail.ts).
// The vendored portal suites use inline tiers; this proves OUR data + layer.
// ============================================================
import { describe, it, expect } from "vitest";
import { computeDna, type Format } from "./engine";
import { COMPETITION_TIERS, LADDER_BY_CODE, LADDER } from "./ladder";
import { placeFromDna, streamForTier } from "./guardrail";

interface F {
  dob: string;
  code: string;
  games: number;
  format: Format;
  skill: "batting" | "bowling";
  avg?: number;
  sr?: number;
  econ?: number;
  rep?: boolean;
}

function run(f: F) {
  const isBat = f.skill === "batting";
  const dna = computeDna({
    profile: {
      dob: f.dob,
      battingPositionBand: isBat ? "1-3" : null,
      bowlingRole: isBat ? null : "new_ball",
    },
    history: [{ competitionCode: f.code, mostRecentSeason: "2025/26", isRepresentativeHonour: !!f.rep }],
    stats: [
      {
        season: "2025/26",
        format: f.format,
        competitionCode: f.code,
        batMatches: isBat ? f.games : null,
        batInnings: isBat ? f.games : null,
        batAverage: isBat ? f.avg ?? null : null,
        batStrikeRate: isBat ? f.sr ?? null : null,
        bowlMatches: !isBat ? f.games : null,
        bowlAverage: !isBat ? f.avg ?? null : null,
        bowlEconomy: !isBat ? f.econ ?? null : null,
      },
    ],
    competitionTiers: COMPETITION_TIERS,
    currentSeasonStartYear: 2025,
  });
  return { dna, placement: placeFromDna(dna) };
}

describe("ladder.ts integrity", () => {
  it("has all 95 competitions with the calibration anchors intact", () => {
    expect(COMPETITION_TIERS.length).toBe(95);
    expect(LADDER.length).toBe(95);
    expect(LADDER_BY_CODE["P1M"].cti).toBe(1.0); // benchmark ceiling
    expect(LADDER_BY_CODE["EN-NR"].cti).toBe(0.1); // no-history floor
    expect(LADDER_BY_CODE["P16M"].name).toBe("Dowling Shield");
  });
});

describe("stream mapping", () => {
  it("maps tiers to sellable streams", () => {
    expect(streamForTier(5)).toBe("performance");
    expect(streamForTier(4)).toBe("performance");
    expect(streamForTier(3)).toBe("pathway");
    expect(streamForTier(2)).toBe("pathway");
    expect(streamForTier(1)).toBe("review");
    expect(streamForTier(null)).toBe("review");
  });
});

describe("Power Game placement (engine + ladder + guardrail)", () => {
  it("17yo Premier 1st XI gun → Performance, 17+, no review", () => {
    const { placement } = run({ dob: "2009-01-01", code: "P1M", games: 12, format: "t20", skill: "batting", avg: 42, sr: 145 });
    expect(placement.stream).toBe("performance");
    expect(placement.placedBand).toBe("17+");
    expect(placement.requiresReview).toBe(false);
    expect(placement.lane).toBe("Batting");
  });

  it("14yo Dowling Shield gun → Performance, PLAYS UP to 14-16 (age-safe)", () => {
    const { placement } = run({ dob: "2012-01-01", code: "P16M", games: 10, format: "t20", skill: "batting", avg: 38, sr: 150 });
    expect(placement.stream).toBe("performance");
    expect(placement.homeBand).toBe("12-14");
    expect(placement.placedBand).toBe("14-16");
    expect(placement.playFlag).toBe("play_up");
    expect(placement.requiresReview).toBe(false);
  });

  it("17yo Women's Premier 1st XI → Performance (ladder rates her Elite — calibration note for Alex)", () => {
    const { dna, placement } = run({ dob: "2009-01-01", code: "P1F", games: 11, format: "od", skill: "bowling", avg: 16, econ: 4.0 });
    expect(placement.stream).toBe("performance");
    expect(dna.abilityTier).toBeGreaterThanOrEqual(4);
    expect(placement.lane).toBe("Bowling");
  });

  it("12yo club-only → below floor → review queue, never auto-placed", () => {
    const { placement } = run({ dob: "2014-01-01", code: "CJ-12B", games: 8, format: "od", skill: "batting", avg: 25, sr: 95 });
    expect(placement.requiresReview).toBe(true);
    expect(placement.reviewReasons).toContain("below_floor");
  });

  it("21yo below-floor adult → review, placed 17+, NEVER demoted", () => {
    const { placement } = run({ dob: "2005-01-01", code: "RY-2S", games: 14, format: "t20", skill: "batting", avg: 30, sr: 110 });
    expect(placement.requiresReview).toBe(true);
    expect(placement.placedBand).toBe("17+");
  });
});
