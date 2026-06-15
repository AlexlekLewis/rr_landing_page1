// ============================================================
// scoring/engine.ts — induction (stats-only) per-skill DNA scoring engine
// ============================================================
// Implements Step 3 of docs/design/onboarding-and-scoring-spec.md §10 (SIGNED OFF).
//
// Pure TypeScript — NO Supabase, NO React, NO I/O. The caller fetches the player's
// profile, playing history, match stats and the reference ladder, then passes plain
// objects in; the engine returns a snapshot that maps 1:1 onto the players_dna table
// (migration 031). This keeps the maths unit-testable and side-effect free.
//
// THE ONE BIG RULE (spec §2): the induction score is STATS-ONLY.
//   Per-skill score = CTI(level) × ARM(age vs level) × PerformanceFactor(stats, volume-weighted)
//   - CTI × ARM is ported verbatim from v1 (the calibrated, trusted core).
//   - PerformanceFactor is NEW — it turns real runs/wickets/economy into a multiplier,
//     scaled by a sample-size confidence curve. This is the v1 gap the spec calls out:
//     "one century in one game isn't proof; ten games averaging 50 with two tons is."
// Coach/self 1–5 ratings do NOT feed this score — they join later (combine / in-program).
//
// Each of batting / bowling / keeping is scored on its OWN data and never combined for
// allocation (spec §1, §5). The "overall" score exists only for tiering.
// ============================================================

import {
  BENCHMARKS,
  KEEPING_BENCHMARK,
  STUMPING_WEIGHT,
  METRIC_WEIGHTS,
  MULT_ANCHORS,
  CONFIDENCE_CURVE,
  SECONDARY_VOLUME,
  TIER_THRESHOLDS,
  REP_FLOOR_CTI,
  FALLBACK_CTI,
  THIN_HISTORY_MATCHES,
  AGE_OUTLIER_YEARS,
  SCORE_SCALE,
  ENGINE_VERSION,
  type BenchmarkLine,
  type Format,
} from "./benchmarks";

// ============================================================
// Input / output types (plain data — map onto migration 031 columns)
// ============================================================

export type BattingPositionBand = "1-3" | "4-6" | "7-11";
export type BowlingRole = "new_ball" | "first_change" | "middle_overs" | "death";
export type BowlingType = "pace" | "spin";

/** Engine-internal skill identity (batting / bowling / keeping). */
export type SkillKey = "batting" | "bowling" | "keeping";

/** Declared seasonal volume for the secondary skill (form §4.5). */
export interface SecondaryVolumeInput {
  oversPerSeason?: number | null;
  runsPerSeason?: number | null;
  inningsPerSeason?: number | null;
}

export interface PlayerProfileInput {
  /** ISO ("YYYY-MM-DD"), JS Date, or legacy v1 "DD/MM/YYYY". */
  dob: string | Date | null;
  isKeeper?: boolean;
  battingPositionBand?: BattingPositionBand | null;
  bowlingRole?: BowlingRole | null;
  bowlingType?: BowlingType | null;
  /** free text: swing/seam/off-spin/leg-spin/orthodox + variations (carrom, wrong'un, knuckle…). */
  bowlingSubtype?: string | null;
}

export interface PlayingHistoryRow {
  competitionCode: string | null;
  /** e.g. "2024/25" — drives the 3-season eligibility window. */
  mostRecentSeason: string | null;
  isRepresentativeHonour?: boolean;
}

export interface MatchStatsRow {
  season: string;
  format: Format;
  competitionCode: string | null;

  batMatches?: number | null;
  batInnings?: number | null;
  batNotOuts?: number | null;
  batRuns?: number | null;
  batAverage?: number | null;
  batStrikeRate?: number | null;
  batHighScore?: number | null;
  batFifties?: number | null;
  batHundreds?: number | null;

  bowlMatches?: number | null;
  bowlOvers?: number | null;
  bowlWickets?: number | null;
  bowlAverage?: number | null;
  bowlEconomy?: number | null;
  bowlStrikeRate?: number | null;

  fieldCatches?: number | null;
  fieldStumpings?: number | null;
  fieldRunOuts?: number | null;
}

export interface CompetitionTierInput {
  code: string;
  ctiValue: number;
  expectedMidpointAge: number | null;
}

export interface EngineConstantsInput {
  armSensitivityFactor?: number;
  armFloor?: number;
  armCeiling?: number;
}

export interface ComputeDnaInput {
  profile: PlayerProfileInput;
  history: PlayingHistoryRow[];
  stats: MatchStatsRow[];
  competitionTiers: CompetitionTierInput[];
  constants?: EngineConstantsInput;
  returningFromInjury?: boolean;
  /**
   * Declared secondary skill (form §4 code: "batting" | "bowling" | "wicketkeeping" |
   * "none"). Drives the §4.5 volume gate — the named skill's performance is down-weighted
   * if its declared seasonal volume is below the floor. Primary skill is never gated.
   */
  secondarySkill?: string | null;
  /** Declared seasonal volume for the secondary skill (form §4.5). */
  secondaryVolume?: SecondaryVolumeInput | null;
  /**
   * Start year of the current season (e.g. 2025 for "2025/26"). History/stats within
   * the last 3 seasons count toward eligibility. Omit to treat all rows as in-window.
   */
  currentSeasonStartYear?: number;
  engineVersion?: string;
}

export interface SkillBreakdown {
  cti: number;
  arm: number;
  /** the level the CTI/ARM came from. */
  competitionCode: string | null;
  performanceFactor: number;
  /** sample-weighted raw multiplier before confidence scaling. */
  rawMultiplier: number;
  confidence: number;
  /** total matches counted for this skill across rows. */
  sampleSize: number;
}

export type EligibilityStatus = "pending" | "eligible" | "below_floor" | "no_history";

export interface DnaResult {
  battingScore: number | null;
  battingConfidence: number | null;
  bowlingScore: number | null;
  bowlingConfidence: number | null;
  keepingScore: number | null;
  keepingConfidence: number | null;

  overallScore: number | null;
  abilityTier: 1 | 2 | 3 | 4 | 5 | null;
  ageBand: string;

  primaryBattingArchetype: string | null;
  secondaryBattingArchetype: string | null;
  primaryBowlingArchetype: string | null;
  secondaryBowlingArchetype: string | null;
  styleTags: string[];

  eligibilityStatus: EligibilityStatus;
  needsAdminReview: boolean;
  reviewFlags: string[];

  engineVersion: string;

  /** non-persisted: per-skill working for transparency / coach view / debugging. */
  breakdown: {
    age: number | null;
    batting: SkillBreakdown | null;
    bowling: SkillBreakdown | null;
    keeping: SkillBreakdown | null;
    bestSkillCcm: number;
  };
}

// ============================================================
// Small numeric helpers
// ============================================================

const round = (v: number, dp = 2): number => {
  const f = 10 ** dp;
  return Math.round(v * f) / f;
};

const num = (v: number | null | undefined): number | null =>
  v == null || Number.isNaN(v) ? null : v;

/**
 * Calendar age from date of birth. Accepts ISO ("YYYY-MM-DD"), a Date, or the legacy
 * v1 "DD/MM/YYYY" string. Returns null on anything unparseable.
 * (Ported from v1 ratingEngine.getAge, generalised for ISO/Date inputs.)
 */
export function getAge(dob: string | Date | null, now: Date = new Date()): number | null {
  if (!dob) return null;
  let birth: Date | null = null;

  if (dob instanceof Date) {
    birth = dob;
  } else if (typeof dob === "string") {
    const s = dob.trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
      // ISO YYYY-MM-DD (parse as local to avoid TZ off-by-one)
      const [y, m, d] = s.slice(0, 10).split("-").map(Number);
      birth = new Date(y, m - 1, d);
    } else if (s.includes("/")) {
      // legacy DD/MM/YYYY
      const p = s.split("/");
      if (p.length === 3) birth = new Date(Number(p[2]), Number(p[1]) - 1, Number(p[0]));
    }
  }

  if (!birth || Number.isNaN(birth.getTime())) return null;
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age--;
  return age >= 0 && age < 120 ? age : null;
}

/** Age band (v1 brackets, kept for continuity). */
export function getAgeBand(age: number | null): string {
  if (age == null) return "Unknown";
  if (age <= 13) return "U11-U13";
  if (age <= 16) return "U14-U16";
  if (age <= 19) return "U17-U19";
  return "U20+";
}

/**
 * Map a value onto a benchmark line's multiplier (centred on 1.0 at par). Piecewise-
 * linear across the four §11 anchors; clamps at the floor/elite end multipliers.
 */
export function benchmarkMultiplier(value: number, line: BenchmarkLine): number {
  const { thresholds, higherIsBetter } = line;
  const mults = [MULT_ANCHORS.floor, MULT_ANCHORS.par, MULT_ANCHORS.strong, MULT_ANCHORS.elite];

  // Worst-end and best-end clamps.
  const atOrBelowWorst = higherIsBetter ? value <= thresholds[0] : value >= thresholds[0];
  const atOrAboveBest = higherIsBetter ? value >= thresholds[3] : value <= thresholds[3];
  if (atOrBelowWorst) return mults[0];
  if (atOrAboveBest) return mults[3];

  for (let i = 0; i < 3; i++) {
    const lo = thresholds[i];
    const hi = thresholds[i + 1];
    const inSeg = higherIsBetter
      ? value >= lo && value <= hi
      : value <= lo && value >= hi;
    if (inSeg) {
      const pct = (value - lo) / (hi - lo); // direction-agnostic: signs cancel
      return mults[i] + pct * (mults[i + 1] - mults[i]);
    }
  }
  return MULT_ANCHORS.par; // unreachable given clamps, but safe
}

/**
 * §5 sample-size confidence curve → 0..1. <5 games low, 5-6 building, 10+ full.
 */
export function confidenceWeight(n: number): number {
  const { buildingStart, fullWeightAt, weightAtBuildingStart } = CONFIDENCE_CURVE;
  if (n <= 0) return 0;
  if (n >= fullWeightAt) return 1;
  if (n < buildingStart) {
    // 0 → weightAtBuildingStart across [0, buildingStart)
    return round((n / buildingStart) * weightAtBuildingStart, 3);
  }
  // buildingStart → fullWeightAt: weightAtBuildingStart → 1.0
  const pct = (n - buildingStart) / (fullWeightAt - buildingStart);
  return round(weightAtBuildingStart + pct * (1 - weightAtBuildingStart), 3);
}

/**
 * Normalise a form skill code (primary/secondary §4) to an engine skill key. Returns
 * null for "all_rounder" / "none" / unknown — i.e. no single declared skill to gate.
 */
export function normaliseSkillKey(v: string | null | undefined): SkillKey | null {
  if (!v) return null;
  switch (v.toLowerCase()) {
    case "batting":
      return "batting";
    case "bowling":
      return "bowling";
    case "wicketkeeping":
    case "wicketkeeper":
    case "wk_batter":
    case "keeping":
      return "keeping";
    default:
      return null;
  }
}

/**
 * §4.5 secondary-skill volume credit ∈ [floorWeight, 1]. Ramps from floorWeight (at/below
 * the floor) to 1.0 (at/above "full") for the declared seasonal volume. A null/blank
 * volume → 1.0 (no claim, no penalty). Keeping has no volume field → 1.0. The result is
 * multiplied into the secondary skill's sample-size confidence, so a thin secondary's
 * PerformanceFactor is pulled toward par on top of the §5 curve.
 */
export function secondaryVolumeWeight(
  skill: SkillKey,
  vol: SecondaryVolumeInput | null | undefined,
): number {
  if (!vol) return 1;
  const fw = SECONDARY_VOLUME.floorWeight;
  const ramp = (value: number, floor: number, full: number): number => {
    if (value >= full) return 1;
    if (value <= floor) return fw;
    return fw + ((value - floor) / (full - floor)) * (1 - fw);
  };

  if (skill === "bowling") {
    const ov = num(vol.oversPerSeason ?? null);
    if (ov == null) return 1;
    return round(ramp(ov, SECONDARY_VOLUME.bowling.floorOvers, SECONDARY_VOLUME.bowling.fullOvers), 3);
  }
  if (skill === "batting") {
    const inn = num(vol.inningsPerSeason ?? null);
    if (inn != null) {
      return round(ramp(inn, SECONDARY_VOLUME.batting.floorInnings, SECONDARY_VOLUME.batting.fullInnings), 3);
    }
    const runs = num(vol.runsPerSeason ?? null);
    if (runs != null) {
      return round(ramp(runs, SECONDARY_VOLUME.batting.floorRuns, SECONDARY_VOLUME.batting.fullRuns), 3);
    }
    return 1;
  }
  return 1; // keeping → no volume gate
}

// ============================================================
// CTI × ARM (ported verbatim from v1 ratingEngine.calcCCM)
// ============================================================

/** ARM = clamp(floor, ceiling, 1 + (expectedMidpointAge − age) × sensitivity), rounded 2dp. */
export function computeArm(
  age: number | null,
  expectedMidpointAge: number | null,
  constants?: EngineConstantsInput,
): number {
  const sens = constants?.armSensitivityFactor ?? 0.05;
  const floor = constants?.armFloor ?? 0.8;
  const ceil = constants?.armCeiling ?? 1.5;
  if (age == null || expectedMidpointAge == null) return 1;
  const rawArm = 1 + (expectedMidpointAge - age) * sens;
  return round(Math.max(floor, Math.min(ceil, rawArm)), 2);
}

// ============================================================
// Stat extraction & PerformanceFactor (NEW)
// ============================================================

interface MetricSample {
  metric: string;
  value: number;
}

/** Resolve a batting average, deriving from runs/innings if not directly supplied. */
function battingAverage(r: MatchStatsRow): number | null {
  const avg = num(r.batAverage ?? null);
  if (avg != null && avg > 0) return avg;
  const runs = num(r.batRuns ?? null);
  const inn = num(r.batInnings ?? null);
  if (runs != null && inn != null && inn > 0) {
    const dismissals = Math.max(1, inn - (num(r.batNotOuts ?? null) ?? 0));
    return round(runs / dismissals, 2);
  }
  return null;
}

/** Collect a skill's present metrics for one stats row, as {metric,value} samples. */
function battingSamples(r: MatchStatsRow): MetricSample[] {
  const out: MetricSample[] = [];
  const avg = battingAverage(r);
  if (avg != null && avg > 0) out.push({ metric: "battingAverage", value: avg });
  const sr = num(r.batStrikeRate ?? null);
  if (sr != null && sr > 0 && BENCHMARKS[r.format].battingStrikeRate) {
    out.push({ metric: "battingStrikeRate", value: sr });
  }
  return out;
}

function bowlingSamples(r: MatchStatsRow): MetricSample[] {
  const out: MetricSample[] = [];
  const avg = num(r.bowlAverage ?? null);
  if (avg != null && avg > 0 && BENCHMARKS[r.format].bowlingAverage) {
    out.push({ metric: "bowlingAverage", value: avg });
  }
  const econ = num(r.bowlEconomy ?? null);
  if (econ != null && econ > 0 && BENCHMARKS[r.format].bowlingEconomy) {
    out.push({ metric: "bowlingEconomy", value: econ });
  }
  const sr = num(r.bowlStrikeRate ?? null);
  if (sr != null && sr > 0 && BENCHMARKS[r.format].bowlingStrikeRate) {
    out.push({ metric: "bowlingStrikeRate", value: sr });
  }
  return out;
}

/** Weighted dismissals per match for one row (stumpings count for more). */
function keepingPerMatch(r: MatchStatsRow): number | null {
  const matches = rowMatches(r);
  if (matches <= 0) return null;
  const catches = num(r.fieldCatches ?? null) ?? 0;
  const stumpings = num(r.fieldStumpings ?? null) ?? 0;
  if (catches <= 0 && stumpings <= 0) return null;
  const weighted = catches + stumpings * STUMPING_WEIGHT;
  return weighted / matches;
}

/** Best available match count for a row (used for keeping + as a skill fallback). */
function rowMatches(r: MatchStatsRow): number {
  return Math.max(num(r.batMatches ?? null) ?? 0, num(r.bowlMatches ?? null) ?? 0);
}

function battingMatches(r: MatchStatsRow): number {
  return num(r.batMatches ?? null) ?? num(r.batInnings ?? null) ?? rowMatches(r);
}

function bowlingMatches(r: MatchStatsRow): number {
  return num(r.bowlMatches ?? null) ?? rowMatches(r);
}

/** Blend a row's metric multipliers using the format weights (renormalised over present metrics). */
function blendRowMultiplier(format: Format, skill: "batting" | "bowling", samples: MetricSample[]): number | null {
  if (samples.length === 0) return null;
  const weights = METRIC_WEIGHTS[format][skill];
  let acc = 0;
  let wsum = 0;
  for (const s of samples) {
    const line = BENCHMARKS[format][s.metric];
    const w = weights[s.metric];
    if (!line || w == null) continue;
    acc += benchmarkMultiplier(s.value, line) * w;
    wsum += w;
  }
  return wsum > 0 ? acc / wsum : null;
}

interface PerfAccumulator {
  weightedMultSum: number; // Σ rowMultiplier × rowMatches
  matchSum: number; // Σ rowMatches
  /** highest CTI among contributing rows + its expected midpoint age. */
  bestCti: number;
  bestExpectedAge: number | null;
  bestCode: string | null;
}

function emptyAcc(): PerfAccumulator {
  return { weightedMultSum: 0, matchSum: 0, bestCti: 0, bestExpectedAge: null, bestCode: null };
}

function tierFor(code: string | null, tiers: Map<string, CompetitionTierInput>): CompetitionTierInput | null {
  if (!code) return null;
  return tiers.get(code) ?? null;
}

/**
 * Build a skill's PerformanceFactor + the CTI/ARM it should be scored at.
 * Volume-weights row multipliers by that skill's matches, then scales toward par (1.0)
 * by the sample-size confidence curve.
 */
function scoreSkill(
  skill: "batting" | "bowling" | "keeping",
  stats: MatchStatsRow[],
  tiers: Map<string, CompetitionTierInput>,
  age: number | null,
  constants: EngineConstantsInput | undefined,
  fallback: { cti: number; expectedAge: number | null; code: string | null },
  /** §4.5 secondary-volume credit (0..1) folded into the confidence. 1 = no gate. */
  confidenceMultiplier = 1,
): SkillBreakdown | null {
  const acc = emptyAcc();

  for (const r of stats) {
    let rowMult: number | null = null;
    let matches = 0;

    if (skill === "batting") {
      rowMult = blendRowMultiplier(r.format, "batting", battingSamples(r));
      matches = battingMatches(r);
    } else if (skill === "bowling") {
      rowMult = blendRowMultiplier(r.format, "bowling", bowlingSamples(r));
      matches = bowlingMatches(r);
    } else {
      const perMatch = keepingPerMatch(r);
      if (perMatch != null) rowMult = benchmarkMultiplier(perMatch, KEEPING_BENCHMARK);
      matches = rowMatches(r);
    }

    if (rowMult == null || matches <= 0) continue;

    acc.weightedMultSum += rowMult * matches;
    acc.matchSum += matches;

    const t = tierFor(r.competitionCode, tiers);
    if (t && t.ctiValue > acc.bestCti) {
      acc.bestCti = t.ctiValue;
      acc.bestExpectedAge = t.expectedMidpointAge;
      acc.bestCode = t.code;
    }
  }

  if (acc.matchSum <= 0) return null;

  // CTI/ARM for this skill: the level it was performed at, else the player's
  // overall-highest level (history), else the peaks-only baseline.
  let cti = acc.bestCti;
  let expectedAge = acc.bestExpectedAge;
  let code = acc.bestCode;
  if (cti <= 0) {
    if (fallback.cti > 0) {
      cti = fallback.cti;
      expectedAge = fallback.expectedAge;
      code = fallback.code;
    } else {
      cti = FALLBACK_CTI;
      expectedAge = null;
      code = null;
    }
  }

  const arm = computeArm(age, expectedAge, constants);
  const rawMultiplier = acc.weightedMultSum / acc.matchSum;
  // §5 sample-size confidence, further dampened by the §4.5 secondary-volume credit.
  const confidence = round(confidenceWeight(acc.matchSum) * confidenceMultiplier, 3);
  // Pull toward par (1.0) when confidence is low (spec §5).
  const performanceFactor = 1 + (rawMultiplier - 1) * confidence;

  return {
    cti: round(cti, 3),
    arm,
    competitionCode: code,
    performanceFactor: round(performanceFactor, 4),
    rawMultiplier: round(rawMultiplier, 4),
    confidence,
    sampleSize: acc.matchSum,
  };
}

const skillScore = (b: SkillBreakdown): number => round(b.cti * b.arm * b.performanceFactor * SCORE_SCALE, 2);

// ============================================================
// Eligibility + review flags (spec §3, §4.8) — soft flags only (E-1)
// ============================================================

/** Parse "YYYY/YY" or "YYYY" → start year. */
function seasonStartYear(season: string | null): number | null {
  if (!season) return null;
  const m = season.match(/^(\d{4})/);
  return m ? Number(m[1]) : null;
}

function isWithinWindow(season: string | null, currentStartYear?: number): boolean {
  if (currentStartYear == null) return true; // no window supplied → treat all as recent
  const y = seasonStartYear(season);
  if (y == null) return true; // unknown season → don't exclude
  return y >= currentStartYear - 2; // current + previous two = last 3 seasons
}

// ============================================================
// Archetype derivation (spec §6) — OUTPUTS of the data, never inputs
// ============================================================
// Induction has limited signal (role/position + strike rate), so we derive a single
// PRIMARY archetype per skill from the form's role fields + headline tempo. Secondary
// archetypes + richer style come from the combine / coach assessment (left null here).

function bestStrikeRate(stats: MatchStatsRow[]): number | null {
  let best: number | null = null;
  for (const r of stats) {
    const sr = num(r.batStrikeRate ?? null);
    if (sr != null && sr > 0 && (best == null || sr > best)) best = sr;
  }
  return best;
}

function deriveBattingArchetype(
  profile: PlayerProfileInput,
  stats: MatchStatsRow[],
  hasBatting: boolean,
): { primary: string | null; tags: string[] } {
  if (!hasBatting) return { primary: null, tags: [] };
  const band = profile.battingPositionBand ?? null;
  const sr = bestStrikeRate(stats);
  const tags: string[] = [];
  const highTempo = sr != null && sr >= 150;
  const veryHighTempo = sr != null && sr >= 165;
  if (highTempo) tags.push("high_strike_rate");

  let primary: string;
  if (band === "1-3") {
    primary = highTempo ? "Powerplay Aggressor" : "Anchor / Accumulator";
  } else if (band === "4-6") {
    primary = veryHighTempo ? "Power Hitter" : "Tempo Controller (Helmsman)";
  } else if (band === "7-11") {
    primary = highTempo ? "The Finisher" : "Strike Rotator";
  } else {
    // No band recorded — infer from tempo alone.
    primary = veryHighTempo ? "Power Hitter" : highTempo ? "Powerplay Aggressor" : "Anchor / Accumulator";
  }
  if (veryHighTempo && primary !== "Power Hitter") tags.push("power_threat");
  return { primary, tags };
}

function deriveBowlingArchetype(
  profile: PlayerProfileInput,
  hasBowling: boolean,
): { primary: string | null; tags: string[] } {
  if (!hasBowling) return { primary: null, tags: [] };
  const role = profile.bowlingRole ?? null;
  const type = profile.bowlingType ?? null;
  const subtype = (profile.bowlingSubtype ?? "").toLowerCase();
  const tags: string[] = [];
  if (type) tags.push(type);

  const isMystery = /carrom|wrong|knuckle|mystery|doosra/.test(subtype);
  if (isMystery) tags.push("big_variations");

  let primary: string;
  if (isMystery && type === "spin") {
    primary = "Mystery / All-Phase Spinner";
  } else if (role === "death") {
    primary = "Death Specialist";
    tags.push("death_specialist");
  } else if (role === "new_ball") {
    primary = type === "spin" ? "Powerplay Spinner" : "New-Ball Striker";
  } else if (role === "middle_overs" || role === "first_change") {
    if (type === "spin") {
      primary = "Spin Controller"; // induction can't yet split control vs attack reliably
    } else {
      primary = "Middle-Overs Enforcer";
    }
  } else {
    // No role recorded — fall back on type.
    primary = type === "spin" ? "Spin Controller" : "Middle-Overs Enforcer";
  }
  return { primary, tags };
}

// ============================================================
// Main entry point
// ============================================================

export function computeDna(input: ComputeDnaInput): DnaResult {
  const { profile, history, stats, competitionTiers, constants, returningFromInjury } = input;
  const engineVersion = input.engineVersion ?? ENGINE_VERSION;

  const tiers = new Map<string, CompetitionTierInput>();
  for (const t of competitionTiers) tiers.set(t.code, t);

  const age = getAge(profile.dob);
  const ageBand = getAgeBand(age);

  // ---- Overall-highest level across ALL known codes (history + stats) → fallback CTI + tier context ----
  let overallCti = 0;
  let overallExpectedAge: number | null = null;
  let overallCode: string | null = null;
  // Oldest level the player plays (highest expected midpoint age), regardless of CTI. Used
  // ONLY for the age-outlier flag: a player is an outlier when they're too old for even the
  // most age-appropriate level they play — NOT when a lower-age (e.g. junior rep) honour
  // happens to tie/outrank a current senior level on CTI. A 21yo in Premier 3rd XI (expected
  // ~21) who also holds a Premier U18 rep honour (expected ~16.5) is not an age outlier.
  let maxExpectedAge: number | null = null;
  const considerCode = (code: string | null) => {
    const t = tierFor(code, tiers);
    if (!t) return;
    if (t.ctiValue > overallCti) {
      overallCti = t.ctiValue;
      overallExpectedAge = t.expectedMidpointAge;
      overallCode = t.code;
    }
    if (t.expectedMidpointAge != null && (maxExpectedAge == null || t.expectedMidpointAge > maxExpectedAge)) {
      maxExpectedAge = t.expectedMidpointAge;
    }
  };
  for (const h of history) considerCode(h.competitionCode);
  for (const s of stats) considerCode(s.competitionCode);

  const fallback = { cti: overallCti, expectedAge: overallExpectedAge, code: overallCode };

  // ---- §4.5 secondary-skill volume gate ----
  // The declared secondary skill's performance is dampened toward par when its declared
  // seasonal volume is below the floor (on top of the §5 sample-size curve). Primary
  // skill is never gated; keeping has no volume field so resolves to 1.0.
  const secondaryKey = normaliseSkillKey(input.secondarySkill);
  const secondaryWeight = secondaryKey ? secondaryVolumeWeight(secondaryKey, input.secondaryVolume) : 1;
  const skillConfidenceMultiplier = (skill: SkillKey): number =>
    secondaryKey === skill ? secondaryWeight : 1;

  // ---- Per-skill scoring ----
  const batting = scoreSkill("batting", stats, tiers, age, constants, fallback, skillConfidenceMultiplier("batting"));
  const bowling = scoreSkill("bowling", stats, tiers, age, constants, fallback, skillConfidenceMultiplier("bowling"));
  // Keeping is scored whenever dismissal data exists; the isKeeper profile flag is a
  // hint for the form/UI, not a gate on the score.
  const keeping = scoreSkill("keeping", stats, tiers, age, constants, fallback, skillConfidenceMultiplier("keeping"));

  const battingScore = batting ? skillScore(batting) : null;
  const bowlingScore = bowling ? skillScore(bowling) : null;
  const keepingScore = keeping ? skillScore(keeping) : null;

  // ---- Overall score + tier (best skill places the player; never combine skills) ----
  const skillCcms: number[] = [];
  if (batting) skillCcms.push(batting.cti * batting.arm);
  if (bowling) skillCcms.push(bowling.cti * bowling.arm);
  if (keeping) skillCcms.push(keeping.cti * keeping.arm);

  const scoredValues = [battingScore, bowlingScore, keepingScore].filter(
    (v): v is number => v != null,
  );

  let overallScore: number | null;
  let bestSkillCcm: number;
  if (scoredValues.length > 0) {
    overallScore = round(Math.max(...scoredValues), 2);
    bestSkillCcm = Math.max(...skillCcms);
  } else {
    // No stats scored — still place an eligible player on level × age (neutral performance).
    const arm = computeArm(age, overallExpectedAge, constants);
    bestSkillCcm = overallCti * arm;
    overallScore = overallCti > 0 ? round(bestSkillCcm * SCORE_SCALE, 2) : null;
  }

  let abilityTier: 1 | 2 | 3 | 4 | 5 | null = null;
  if (bestSkillCcm > 0) {
    abilityTier = (TIER_THRESHOLDS.find((t) => bestSkillCcm >= t.minCcm)?.tier ?? 1) as 1 | 2 | 3 | 4 | 5;
  }

  // ---- Eligibility (soft flag) ----
  let recentBestCti = 0;
  let hasRecentHistory = false;
  let hasRecentRepHonour = false;
  for (const h of history) {
    if (!isWithinWindow(h.mostRecentSeason, input.currentSeasonStartYear)) continue;
    hasRecentHistory = true;
    if (h.isRepresentativeHonour) hasRecentRepHonour = true;
    const t = tierFor(h.competitionCode, tiers);
    if (t && t.ctiValue > recentBestCti) recentBestCti = t.ctiValue;
  }
  // Stats rows also evidence recent play at a level.
  for (const s of stats) {
    if (!isWithinWindow(s.season, input.currentSeasonStartYear)) continue;
    hasRecentHistory = true;
    const t = tierFor(s.competitionCode, tiers);
    if (t && t.ctiValue > recentBestCti) recentBestCti = t.ctiValue;
  }

  let eligibilityStatus: EligibilityStatus;
  if (!hasRecentHistory && history.length === 0 && stats.length === 0) {
    eligibilityStatus = "no_history";
  } else if (hasRecentRepHonour || recentBestCti >= REP_FLOOR_CTI) {
    eligibilityStatus = "eligible";
  } else {
    eligibilityStatus = "below_floor";
  }

  // ---- Review flags (spec §4.8) ----
  const reviewFlags: string[] = [];
  if (returningFromInjury) reviewFlags.push("injury_return");
  if (eligibilityStatus === "below_floor") reviewFlags.push("below_floor");
  if (eligibilityStatus === "no_history") reviewFlags.push("no_history");

  const totalMatches = stats.reduce((sum, r) => sum + rowMatches(r), 0);
  if (eligibilityStatus !== "no_history" && totalMatches < THIN_HISTORY_MATCHES) {
    reviewFlags.push("thin_history");
  }
  // Outlier vs the OLDEST level played (maxExpectedAge), not the highest-CTI one — so an
  // age-appropriate senior level clears the flag even when a junior rep honour ties it on CTI.
  if (age != null && maxExpectedAge != null && age > maxExpectedAge + AGE_OUTLIER_YEARS) {
    reviewFlags.push("age_outlier");
  }
  // §4.5: the volume gate actually bit a *scored* secondary skill → flag for admin eyes.
  const secondaryScored =
    (secondaryKey === "batting" && batting != null) ||
    (secondaryKey === "bowling" && bowling != null) ||
    (secondaryKey === "keeping" && keeping != null);
  if (secondaryScored && secondaryWeight < 1) reviewFlags.push("low_secondary_volume");

  const needsAdminReview = reviewFlags.length > 0 || eligibilityStatus !== "eligible";

  // ---- Archetypes (outputs of the data) ----
  const bat = deriveBattingArchetype(profile, stats, batting != null);
  const bowl = deriveBowlingArchetype(profile, bowling != null);
  const styleTags = Array.from(new Set([...bat.tags, ...bowl.tags]));

  return {
    battingScore,
    battingConfidence: batting ? round(batting.confidence, 3) : null,
    bowlingScore,
    bowlingConfidence: bowling ? round(bowling.confidence, 3) : null,
    keepingScore,
    keepingConfidence: keeping ? round(keeping.confidence, 3) : null,

    overallScore,
    abilityTier,
    ageBand,

    primaryBattingArchetype: bat.primary,
    secondaryBattingArchetype: null,
    primaryBowlingArchetype: bowl.primary,
    secondaryBowlingArchetype: null,
    styleTags,

    eligibilityStatus,
    needsAdminReview,
    reviewFlags,

    engineVersion,

    breakdown: {
      age,
      batting,
      bowling,
      keeping,
      bestSkillCcm: round(bestSkillCcm, 3),
    },
  };
}
