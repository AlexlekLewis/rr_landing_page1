import { describe, it, expect } from "vitest";
import {
  computeDna,
  getAge,
  getAgeBand,
  computeArm,
  confidenceWeight,
  benchmarkMultiplier,
  secondaryVolumeWeight,
  normaliseSkillKey,
  type CompetitionTierInput,
  type ComputeDnaInput,
  type MatchStatsRow,
} from "./engine";
import { BENCHMARKS, KEEPING_BENCHMARK, MULT_ANCHORS } from "./benchmarks";

// ── A small slice of the ported Victorian ladder for tests ──
const TIERS: CompetitionTierInput[] = [
  { code: "P1M", ctiValue: 1.0, expectedMidpointAge: 26 }, // Premier 1st XI = ceiling
  { code: "P3M", ctiValue: 0.72, expectedMidpointAge: 24 },
  { code: "P16M", ctiValue: 0.75, expectedMidpointAge: 16 },
  { code: "REP-VMCU", ctiValue: 0.5, expectedMidpointAge: 15 }, // VMCU rep ~ floor
  { code: "ASSOC-3", ctiValue: 0.3, expectedMidpointAge: 17 }, // below rep floor
  { code: "EN-NR", ctiValue: 0.1, expectedMidpointAge: 16 }, // no history
];

// Reference "now" so age maths is deterministic across calendars.
const NOW = new Date(2026, 4, 29); // 2026-05-29

function baseInput(overrides: Partial<ComputeDnaInput> = {}): ComputeDnaInput {
  return {
    profile: { dob: "2008-01-01" }, // 18 at NOW
    history: [],
    stats: [],
    competitionTiers: TIERS,
    currentSeasonStartYear: 2025,
    ...overrides,
  };
}

describe("getAge", () => {
  it("parses ISO dates", () => {
    expect(getAge("2008-01-01", NOW)).toBe(18);
  });
  it("parses legacy DD/MM/YYYY", () => {
    expect(getAge("01/01/2008", NOW)).toBe(18);
  });
  it("respects birthday not yet reached this year", () => {
    expect(getAge("2008-12-31", NOW)).toBe(17);
  });
  it("returns null for junk", () => {
    expect(getAge("not-a-date", NOW)).toBeNull();
    expect(getAge(null, NOW)).toBeNull();
  });
});

describe("getAgeBand", () => {
  it("maps to v1 brackets", () => {
    expect(getAgeBand(13)).toBe("U11-U13");
    expect(getAgeBand(15)).toBe("U14-U16");
    expect(getAgeBand(18)).toBe("U17-U19");
    expect(getAgeBand(24)).toBe("U20+");
    expect(getAgeBand(null)).toBe("Unknown");
  });
});

describe("computeArm (ported verbatim from v1)", () => {
  it("gives 1.0 when player is exactly the expected midpoint age", () => {
    expect(computeArm(16, 16)).toBe(1.0);
  });
  it("amplifies a young player competing up (+5%/yr younger)", () => {
    // 14yo at a level whose midpoint is 18 → 1 + (18-14)*0.05 = 1.20
    expect(computeArm(14, 18)).toBe(1.2);
  });
  it("clamps the ceiling at 1.50", () => {
    // 10yo vs midpoint 26 → raw 1.80 → clamped 1.50
    expect(computeArm(10, 26)).toBe(1.5);
  });
  it("clamps the floor at 0.80", () => {
    // 30yo vs midpoint 16 → raw 0.30 → clamped 0.80
    expect(computeArm(30, 16)).toBe(0.8);
  });
  it("returns 1 when age or expected age is missing", () => {
    expect(computeArm(null, 16)).toBe(1);
    expect(computeArm(16, null)).toBe(1);
  });
});

describe("confidenceWeight (sample-size curve §5)", () => {
  it("is 0 at no games", () => {
    expect(confidenceWeight(0)).toBe(0);
  });
  it("keeps <5 games low (≤0.30)", () => {
    expect(confidenceWeight(4)).toBeLessThanOrEqual(0.3);
    expect(confidenceWeight(1)).toBeLessThan(0.1);
  });
  it("is building at 5-6 games", () => {
    expect(confidenceWeight(5)).toBeCloseTo(0.3, 5);
    expect(confidenceWeight(6)).toBeGreaterThan(0.3);
    expect(confidenceWeight(6)).toBeLessThan(0.6);
  });
  it("reaches full weight at 10+ games", () => {
    expect(confidenceWeight(10)).toBe(1);
    expect(confidenceWeight(25)).toBe(1);
  });
});

describe("benchmarkMultiplier", () => {
  it("returns par (1.0) at the par threshold (higher-is-better)", () => {
    expect(benchmarkMultiplier(24, BENCHMARKS.t20.battingAverage)).toBeCloseTo(MULT_ANCHORS.par, 5);
  });
  it("returns the elite ceiling at/above the elite threshold", () => {
    expect(benchmarkMultiplier(45, BENCHMARKS.t20.battingAverage)).toBeCloseTo(MULT_ANCHORS.elite, 5);
    expect(benchmarkMultiplier(60, BENCHMARKS.t20.battingAverage)).toBeCloseTo(MULT_ANCHORS.elite, 5);
  });
  it("discounts below the floor", () => {
    expect(benchmarkMultiplier(10, BENCHMARKS.t20.battingAverage)).toBeCloseTo(MULT_ANCHORS.floor, 5);
  });
  it("handles lower-is-better metrics (economy)", () => {
    expect(benchmarkMultiplier(8.0, BENCHMARKS.t20.bowlingEconomy)).toBeCloseTo(MULT_ANCHORS.par, 5); // par
    expect(benchmarkMultiplier(6.0, BENCHMARKS.t20.bowlingEconomy)).toBeCloseTo(MULT_ANCHORS.elite, 5); // elite
    expect(benchmarkMultiplier(11, BENCHMARKS.t20.bowlingEconomy)).toBeCloseTo(MULT_ANCHORS.floor, 5); // worse than floor
  });
  it("interpolates linearly mid-segment", () => {
    // halfway between par(24,1.0) and strong(33,1.15) → ~1.075
    expect(benchmarkMultiplier(28.5, BENCHMARKS.t20.battingAverage)).toBeCloseTo(1.075, 3);
  });
  it("scores keeping dismissals-per-match", () => {
    expect(benchmarkMultiplier(0.8, KEEPING_BENCHMARK)).toBeCloseTo(MULT_ANCHORS.par, 5);
    expect(benchmarkMultiplier(2.5, KEEPING_BENCHMARK)).toBeCloseTo(MULT_ANCHORS.elite, 5);
  });
});

describe("computeDna — per-skill separation", () => {
  it("scores batting and bowling independently, on different levels", () => {
    const stats: MatchStatsRow[] = [
      // Bats at Premier 1st XI (CTI 1.0), strong numbers, full sample.
      {
        season: "2025/26",
        format: "t20",
        competitionCode: "P1M",
        batMatches: 12,
        batInnings: 12,
        batRuns: 480,
        batAverage: 44,
        batStrikeRate: 142,
      },
      // Bowls at VMCU rep (CTI 0.5), par-ish, full sample.
      {
        season: "2025/26",
        format: "t20",
        competitionCode: "REP-VMCU",
        bowlMatches: 12,
        bowlAverage: 25,
        bowlEconomy: 8.0,
        bowlStrikeRate: 18,
      },
    ];
    const res = computeDna(baseInput({ profile: { dob: "2008-01-01" }, stats }));

    expect(res.battingScore).not.toBeNull();
    expect(res.bowlingScore).not.toBeNull();
    // Batting at a much harder level + better performance must outrank bowling.
    expect(res.battingScore!).toBeGreaterThan(res.bowlingScore!);
    // The batting CTI came from P1M, bowling CTI from REP-VMCU — proof they're scored on their own level.
    expect(res.breakdown.batting!.cti).toBe(1.0);
    expect(res.breakdown.bowling!.cti).toBe(0.5);
  });

  it("does not produce a score for a skill with no data", () => {
    const stats: MatchStatsRow[] = [
      { season: "2025/26", format: "t20", competitionCode: "P1M", batMatches: 10, batAverage: 30, batStrikeRate: 130 },
    ];
    const res = computeDna(baseInput({ stats }));
    expect(res.battingScore).not.toBeNull();
    expect(res.bowlingScore).toBeNull();
    expect(res.keepingScore).toBeNull();
  });
});

describe("computeDna — volume weighting (the v1 gap)", () => {
  it("a single big game barely moves the score vs ten consistent games", () => {
    const oneGame = computeDna(
      baseInput({
        stats: [
          { season: "2025/26", format: "t20", competitionCode: "P1M", batMatches: 1, batAverage: 100, batStrikeRate: 200 },
        ],
      }),
    );
    const tenGames = computeDna(
      baseInput({
        stats: [
          { season: "2025/26", format: "t20", competitionCode: "P1M", batMatches: 12, batAverage: 50, batStrikeRate: 150 },
        ],
      }),
    );
    // Same level (P1M), but the 1-game player's elite numbers are discounted toward par
    // by low confidence, so the 10-game player scores clearly higher.
    expect(tenGames.battingScore!).toBeGreaterThan(oneGame.battingScore!);
    // And the 1-game elite line should land close to the par baseline (CTI×ARM×~1.0×100).
    expect(oneGame.breakdown.batting!.confidence).toBeLessThan(0.1);
    expect(oneGame.breakdown.batting!.performanceFactor).toBeLessThan(1.05);
  });

  it("the young gun out-ranks the older average player at the same level (ARM)", () => {
    const stats = (): MatchStatsRow[] => [
      { season: "2025/26", format: "t20", competitionCode: "P16M", batMatches: 12, batAverage: 35, batStrikeRate: 135 },
    ];
    const youngGun = computeDna(baseInput({ profile: { dob: "2012-01-01" }, stats: stats() })); // 14
    const older = computeDna(baseInput({ profile: { dob: "2008-01-01" }, stats: stats() })); // 18
    expect(youngGun.battingScore!).toBeGreaterThan(older.battingScore!);
    expect(youngGun.breakdown.batting!.arm).toBeGreaterThan(older.breakdown.batting!.arm);
  });
});

describe("secondaryVolumeWeight (§4.5 volume gate)", () => {
  it("gives full credit (1.0) when no volume is declared", () => {
    expect(secondaryVolumeWeight("bowling", null)).toBe(1);
    expect(secondaryVolumeWeight("bowling", {})).toBe(1);
    expect(secondaryVolumeWeight("batting", { oversPerSeason: 100 })).toBe(1); // wrong field for skill
  });
  it("floors a bowling secondary at/below the floor overs", () => {
    expect(secondaryVolumeWeight("bowling", { oversPerSeason: 10 })).toBeCloseTo(0.25, 5);
    expect(secondaryVolumeWeight("bowling", { oversPerSeason: 2 })).toBeCloseTo(0.25, 5);
  });
  it("gives full credit at/above the full overs threshold", () => {
    expect(secondaryVolumeWeight("bowling", { oversPerSeason: 40 })).toBe(1);
    expect(secondaryVolumeWeight("bowling", { oversPerSeason: 80 })).toBe(1);
  });
  it("ramps linearly between floor and full", () => {
    // midpoint of 10→40 is 25 overs → halfway between 0.25 and 1.0 = 0.625
    expect(secondaryVolumeWeight("bowling", { oversPerSeason: 25 })).toBeCloseTo(0.625, 3);
  });
  it("keys batting on innings, falling back to runs", () => {
    expect(secondaryVolumeWeight("batting", { inningsPerSeason: 4 })).toBeCloseTo(0.25, 5);
    expect(secondaryVolumeWeight("batting", { inningsPerSeason: 12 })).toBe(1);
    // innings absent → use runs
    expect(secondaryVolumeWeight("batting", { runsPerSeason: 40 })).toBeCloseTo(0.25, 5);
    expect(secondaryVolumeWeight("batting", { runsPerSeason: 200 })).toBe(1);
  });
  it("never gates keeping (no volume field)", () => {
    expect(secondaryVolumeWeight("keeping", { oversPerSeason: 0 })).toBe(1);
  });
});

describe("normaliseSkillKey", () => {
  it("maps form codes to engine skills", () => {
    expect(normaliseSkillKey("batting")).toBe("batting");
    expect(normaliseSkillKey("bowling")).toBe("bowling");
    expect(normaliseSkillKey("wicketkeeping")).toBe("keeping");
    expect(normaliseSkillKey("wk_batter")).toBe("keeping");
  });
  it("returns null for all-rounder / none / unknown / blank", () => {
    expect(normaliseSkillKey("all_rounder")).toBeNull();
    expect(normaliseSkillKey("none")).toBeNull();
    expect(normaliseSkillKey("")).toBeNull();
    expect(normaliseSkillKey(null)).toBeNull();
  });
});

describe("computeDna — secondary volume gate end-to-end", () => {
  // A genuine batter who also bowled a thin handful of good overs at the same level.
  const stats = (): MatchStatsRow[] => [
    { season: "2025/26", format: "t20", competitionCode: "P1M", batMatches: 12, batAverage: 45, batStrikeRate: 150,
      bowlMatches: 12, bowlAverage: 16, bowlEconomy: 6.5, bowlStrikeRate: 14 },
  ];

  it("down-weights a low-volume declared secondary's score vs an ungated run", () => {
    const ungated = computeDna(baseInput({ stats: stats() }));
    const gated = computeDna(
      baseInput({
        stats: stats(),
        secondarySkill: "bowling",
        secondaryVolume: { oversPerSeason: 5 }, // below the 10-over floor
      }),
    );
    // The gated bowling score is pulled toward its level/age par baseline.
    expect(gated.bowlingScore!).toBeLessThan(ungated.bowlingScore!);
    expect(gated.breakdown.bowling!.confidence).toBeLessThan(ungated.breakdown.bowling!.confidence);
    // Batting (the primary) is untouched.
    expect(gated.battingScore).toBe(ungated.battingScore);
    expect(gated.reviewFlags).toContain("low_secondary_volume");
  });

  it("never drops the secondary below its level baseline (only neutralises the boost)", () => {
    const gated = computeDna(
      baseInput({
        stats: stats(),
        secondarySkill: "bowling",
        secondaryVolume: { oversPerSeason: 5 },
      }),
    );
    const b = gated.breakdown.bowling!;
    // performanceFactor heads toward par (1.0); strong bowling numbers mean it stays ≥ ~1.0,
    // never below the floor multiplier.
    expect(b.performanceFactor).toBeGreaterThan(0.99);
    expect(b.performanceFactor).toBeLessThan(ungatedFactor());
    function ungatedFactor(): number {
      return computeDna(baseInput({ stats: stats() })).breakdown.bowling!.performanceFactor;
    }
  });

  it("leaves the secondary alone when volume clears the full threshold", () => {
    const ungated = computeDna(baseInput({ stats: stats() }));
    const fullVol = computeDna(
      baseInput({
        stats: stats(),
        secondarySkill: "bowling",
        secondaryVolume: { oversPerSeason: 60 },
      }),
    );
    expect(fullVol.bowlingScore).toBe(ungated.bowlingScore);
    expect(fullVol.reviewFlags).not.toContain("low_secondary_volume");
  });

  it("does not flag when the gated skill was never scored", () => {
    // Declares bowling secondary + thin volume, but there are NO bowling stats.
    const res = computeDna(
      baseInput({
        stats: [{ season: "2025/26", format: "t20", competitionCode: "P1M", batMatches: 12, batAverage: 40, batStrikeRate: 140 }],
        secondarySkill: "bowling",
        secondaryVolume: { oversPerSeason: 2 },
      }),
    );
    expect(res.bowlingScore).toBeNull();
    expect(res.reviewFlags).not.toContain("low_secondary_volume");
  });
});

describe("computeDna — tiering", () => {
  it("places a Premier 1st XI player in tier 5", () => {
    const res = computeDna(
      baseInput({
        profile: { dob: "2002-01-01" }, // 24, near P1M midpoint → ARM ~1.0
        stats: [
          { season: "2025/26", format: "t20", competitionCode: "P1M", batMatches: 12, batAverage: 40, batStrikeRate: 140 },
        ],
      }),
    );
    expect(res.abilityTier).toBe(5);
  });

  it("places a VMCU-rep-only player in a lower tier", () => {
    const res = computeDna(
      baseInput({
        profile: { dob: "2008-01-01" },
        stats: [
          { season: "2025/26", format: "t20", competitionCode: "REP-VMCU", batMatches: 12, batAverage: 28, batStrikeRate: 120 },
        ],
      }),
    );
    expect(res.abilityTier).not.toBeNull();
    expect(res.abilityTier!).toBeLessThanOrEqual(3);
  });
});

describe("computeDna — eligibility (soft flag, E-1)", () => {
  it("flags a player with no history at all as no_history + review", () => {
    const res = computeDna(baseInput({ history: [], stats: [] }));
    expect(res.eligibilityStatus).toBe("no_history");
    expect(res.needsAdminReview).toBe(true);
    expect(res.reviewFlags).toContain("no_history");
  });

  it("marks a recent VMCU-rep player eligible", () => {
    const res = computeDna(
      baseInput({
        history: [{ competitionCode: "REP-VMCU", mostRecentSeason: "2025/26", isRepresentativeHonour: true }],
        stats: [
          { season: "2025/26", format: "t20", competitionCode: "REP-VMCU", batMatches: 12, batAverage: 30, batStrikeRate: 125 },
        ],
      }),
    );
    expect(res.eligibilityStatus).toBe("eligible");
  });

  it("flags a sub-rep player below_floor (but still produces a score)", () => {
    const res = computeDna(
      baseInput({
        history: [{ competitionCode: "ASSOC-3", mostRecentSeason: "2025/26", isRepresentativeHonour: false }],
        stats: [
          { season: "2025/26", format: "t20", competitionCode: "ASSOC-3", batMatches: 12, batAverage: 30, batStrikeRate: 125 },
        ],
      }),
    );
    expect(res.eligibilityStatus).toBe("below_floor");
    expect(res.reviewFlags).toContain("below_floor");
    expect(res.battingScore).not.toBeNull(); // soft flag — never blocks scoring
  });

  it("does not count an out-of-window rep season toward eligibility", () => {
    const res = computeDna(
      baseInput({
        currentSeasonStartYear: 2025, // window = 2023/24 .. 2025/26
        history: [{ competitionCode: "REP-VMCU", mostRecentSeason: "2020/21", isRepresentativeHonour: true }],
        stats: [
          { season: "2020/21", format: "t20", competitionCode: "REP-VMCU", batMatches: 12, batAverage: 30, batStrikeRate: 125 },
        ],
      }),
    );
    expect(res.eligibilityStatus).toBe("below_floor");
  });
});

describe("computeDna — review flags", () => {
  it("flags returning-from-injury", () => {
    const res = computeDna(
      baseInput({
        returningFromInjury: true,
        history: [{ competitionCode: "P1M", mostRecentSeason: "2025/26", isRepresentativeHonour: false }],
        stats: [
          { season: "2025/26", format: "t20", competitionCode: "P1M", batMatches: 12, batAverage: 40, batStrikeRate: 140 },
        ],
      }),
    );
    expect(res.reviewFlags).toContain("injury_return");
    expect(res.needsAdminReview).toBe(true);
  });

  it("flags thin history (<5 matches)", () => {
    const res = computeDna(
      baseInput({
        history: [{ competitionCode: "REP-VMCU", mostRecentSeason: "2025/26", isRepresentativeHonour: true }],
        stats: [
          { season: "2025/26", format: "t20", competitionCode: "REP-VMCU", batMatches: 3, batAverage: 40, batStrikeRate: 140 },
        ],
      }),
    );
    expect(res.reviewFlags).toContain("thin_history");
  });
});

describe("computeDna — archetypes (outputs of the data)", () => {
  it("derives a top-order aggressor from band + high tempo", () => {
    const res = computeDna(
      baseInput({
        profile: { dob: "2008-01-01", battingPositionBand: "1-3" },
        stats: [
          { season: "2025/26", format: "t20", competitionCode: "P1M", batMatches: 12, batAverage: 35, batStrikeRate: 160 },
        ],
      }),
    );
    expect(res.primaryBattingArchetype).toBe("Powerplay Aggressor");
    expect(res.styleTags).toContain("high_strike_rate");
  });

  it("derives a death-bowling specialist from role", () => {
    const res = computeDna(
      baseInput({
        profile: { dob: "2008-01-01", bowlingRole: "death", bowlingType: "pace" },
        stats: [
          { season: "2025/26", format: "t20", competitionCode: "P1M", bowlMatches: 12, bowlAverage: 20, bowlEconomy: 7.5 },
        ],
      }),
    );
    expect(res.primaryBowlingArchetype).toBe("Death Specialist");
    expect(res.styleTags).toContain("pace");
  });

  it("derives a mystery spinner from subtype variations", () => {
    const res = computeDna(
      baseInput({
        profile: { dob: "2008-01-01", bowlingRole: "middle_overs", bowlingType: "spin", bowlingSubtype: "off-spin with carrom ball" },
        stats: [
          { season: "2025/26", format: "od", competitionCode: "P1M", bowlMatches: 12, bowlAverage: 22, bowlEconomy: 4.4 },
        ],
      }),
    );
    expect(res.primaryBowlingArchetype).toBe("Mystery / All-Phase Spinner");
    expect(res.styleTags).toContain("big_variations");
  });
});

describe("computeDna — output shape maps onto players_dna", () => {
  it("returns every persisted field", () => {
    const res = computeDna(
      baseInput({
        history: [{ competitionCode: "P1M", mostRecentSeason: "2025/26", isRepresentativeHonour: false }],
        stats: [
          { season: "2025/26", format: "t20", competitionCode: "P1M", batMatches: 12, batAverage: 40, batStrikeRate: 140 },
        ],
      }),
    );
    expect(res).toMatchObject({
      battingScore: expect.any(Number),
      battingConfidence: expect.any(Number),
      overallScore: expect.any(Number),
      abilityTier: expect.any(Number),
      ageBand: expect.any(String),
      eligibilityStatus: expect.any(String),
      needsAdminReview: expect.any(Boolean),
      engineVersion: "induction-1.0",
    });
    expect(Array.isArray(res.styleTags)).toBe(true);
    expect(Array.isArray(res.reviewFlags)).toBe(true);
  });
});
