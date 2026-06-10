// ============================================================
// scoring/benchmarks.ts — calibration constants for the induction scoring engine
// ============================================================
// Source of truth: docs/design/onboarding-and-scoring-spec.md (SIGNED OFF 2026-05-29).
//   * §11 performance benchmarks — BY FORMAT ONLY (CTI already scales for level,
//     ARM already scales for age, so we do NOT re-scale benchmarks per level/age).
//   * §5 sample-size confidence curve — <5 games heavily discounted, 5-6 building,
//     10+ near-full weight.
//   * §5 tier definitions — mapped to ladder CTI anchors.
//
// These are deliberately data-here (not buried in logic) so Alex can recalibrate
// against the first real intake (the spec's week-4 / week-12 governance cadence)
// without touching the engine maths.
// ============================================================

export type Format = "t20" | "od" | "multiday";

/**
 * Per-metric performance multiplier anchors. A metric maps to a multiplier centred
 * on 1.0 at "par": below par discounts, above par boosts. The PerformanceFactor
 * blends a skill's metrics, then the confidence curve scales how far it may move
 * from 1.0 (small samples pull back toward neutral).
 *
 *   floor → 0.75 (discount)   par → 1.00 (neutral)   strong → 1.15   elite → 1.30 (ceiling)
 *
 * Values past the floor/elite thresholds clamp to those end multipliers (bounded,
 * defensible — a single freak number can't run away with the score).
 */
export const MULT_ANCHORS = {
  floor: 0.75,
  par: 1.0,
  strong: 1.15,
  elite: 1.3,
} as const;

/** A benchmark line: the four §11 thresholds in WORST→BEST order, plus direction. */
export interface BenchmarkLine {
  /** [floor, par, strong, elite] threshold values (worst → best). */
  thresholds: [number, number, number, number];
  /** true = higher value is better (batting avg/SR, dismissals); false = lower is better (economy, bowling avg/SR). */
  higherIsBetter: boolean;
}

/**
 * §11 benchmark lines. Keyed by format → metric. Thresholds are listed worst→best,
 * so for "lower is better" metrics the numbers descend.
 */
export const BENCHMARKS: Record<Format, Record<string, BenchmarkLine>> = {
  t20: {
    battingAverage: { thresholds: [18, 24, 33, 45], higherIsBetter: true },
    battingStrikeRate: { thresholds: [105, 125, 140, 160], higherIsBetter: true },
    bowlingEconomy: { thresholds: [9.5, 8.0, 7.0, 6.0], higherIsBetter: false },
    bowlingAverage: { thresholds: [34, 25, 19, 14], higherIsBetter: false },
    bowlingStrikeRate: { thresholds: [24, 18, 15, 12], higherIsBetter: false },
  },
  od: {
    battingAverage: { thresholds: [22, 30, 40, 50], higherIsBetter: true },
    battingStrikeRate: { thresholds: [70, 82, 95, 110], higherIsBetter: true },
    bowlingEconomy: { thresholds: [6.5, 5.2, 4.4, 3.6], higherIsBetter: false },
    bowlingAverage: { thresholds: [38, 28, 22, 16], higherIsBetter: false },
  },
  multiday: {
    battingAverage: { thresholds: [25, 33, 44, 55], higherIsBetter: true },
    bowlingAverage: { thresholds: [35, 27, 21, 15], higherIsBetter: false },
    bowlingEconomy: { thresholds: [4.0, 3.2, 2.7, 2.2], higherIsBetter: false },
  },
};

/** Keeping is format-agnostic (§11): weighted dismissals per match, higher better. */
export const KEEPING_BENCHMARK: BenchmarkLine = {
  thresholds: [0.4, 0.8, 1.5, 2.5],
  higherIsBetter: true,
};

/** Stumpings are a sharper keeper skill-marker than catches (§11 note). */
export const STUMPING_WEIGHT = 1.5;

/**
 * Within-skill metric blend weights (renormalised over whichever metrics are present
 * in a given row/format). Average carries the most signal; strike rate / economy add
 * the "how" of the runs/wickets.
 */
export const METRIC_WEIGHTS: Record<Format, { batting: Record<string, number>; bowling: Record<string, number> }> = {
  t20: {
    batting: { battingAverage: 0.6, battingStrikeRate: 0.4 },
    bowling: { bowlingAverage: 0.4, bowlingEconomy: 0.35, bowlingStrikeRate: 0.25 },
  },
  od: {
    batting: { battingAverage: 0.6, battingStrikeRate: 0.4 },
    bowling: { bowlingAverage: 0.55, bowlingEconomy: 0.45 },
  },
  multiday: {
    batting: { battingAverage: 1.0 },
    bowling: { bowlingAverage: 0.6, bowlingEconomy: 0.4 },
  },
};

/**
 * §5 sample-size confidence curve. Returns a 0..1 weight that scales how far the
 * PerformanceFactor may move from par (1.0).
 *   n < 5   → low (≤0.30) — a single big score barely moves the rank.
 *   5 ≤ n < 10 → building (0.30 → 1.0).
 *   n ≥ 10  → 1.0 (stats carry full weight).
 */
export const CONFIDENCE_CURVE = {
  buildingStart: 5,
  fullWeightAt: 10,
  /** confidence at exactly buildingStart games (the "5-6 building" floor). */
  weightAtBuildingStart: 0.3,
} as const;

/**
 * §5 tier definitions, mapped to ladder CTI anchors. Driven by the player's best
 * skill's CCM (= CTI × ARM) so level + age-relativity place them, exactly as the
 * spec's ladder-anchored table intends. Listed high → low; first match wins.
 */
export const TIER_THRESHOLDS: { tier: 1 | 2 | 3 | 4 | 5; minCcm: number }[] = [
  { tier: 5, minCcm: 0.85 }, // P1M/P2M + CA-*/VP-* (0.85–1.00)
  { tier: 4, minCcm: 0.72 }, // P3M–P4M / P16M–P18M (~0.72–0.75)
  { tier: 3, minCcm: 0.6 }, // Dowling / U18 Premier / strong senior local
  { tier: 2, minCcm: 0.45 }, // VMCU, approaching JG Craig / Dowling
  { tier: 1, minCcm: 0 }, // No higher than VMCU rep floor
];

/**
 * Eligibility floor (spec §3): a player must have played representative cricket
 * (VMCU rep shields or higher) in the last 3 seasons. REP-* sits ~0.40–0.55 on the
 * ladder, so the recent-best CTI must clear this to be auto-eligible. Soft flag only
 * (E-1) — below this lands in the admin review queue, never a hard block.
 */
export const REP_FLOOR_CTI = 0.4;

/** When a skill has stats but no resolvable competition CTI, peaks-only baseline (mirrors v1). */
export const FALLBACK_CTI = 0.3;

/**
 * §4.5 secondary-skill volume gate. A player's DECLARED secondary skill only earns
 * full performance credit if they actually did enough of it across a season. Below the
 * floor, that skill's performance is pulled back toward its level/age baseline so a
 * handful of lucky overs/innings can't inflate the rank — ON TOP of the sample-size
 * confidence curve (§5). Never drops a skill below its level; only neutralises an
 * undeserved boost. Tunable here (cricketing judgement — recalibrate vs first intake).
 *
 *   floorWeight = credit retained at/below the floor (0 = fully neutralised, 1 = none).
 *   bowling: <floorOvers/season = occasional; ≥fullOvers = a genuine bowling option.
 *   batting: keyed on innings if present, else runs.
 */
export const SECONDARY_VOLUME = {
  floorWeight: 0.25,
  bowling: { floorOvers: 10, fullOvers: 40 },
  batting: { floorInnings: 4, fullInnings: 12, floorRuns: 40, fullRuns: 200 },
} as const;

/** Total matches below this across all stats → "thin history" review flag (spec §4.8). */
export const THIN_HISTORY_MATCHES = 5;

/** Player older than expected-midpoint-age by this many years → "age outlier" flag (may be playing down → inflated stats). */
export const AGE_OUTLIER_YEARS = 3;

/** Display scale: CTI × ARM × PerformanceFactor is ~0.06–2.0; ×100 gives a readable 6–195 score. */
export const SCORE_SCALE = 100;

export const ENGINE_VERSION = "induction-1.0";
