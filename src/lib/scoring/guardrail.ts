// ============================================================
// guardrail.ts — Power Game age-appropriate placement layer
// ============================================================
// Sits on top of the (vendored, validated) scoring engine. Turns an engine
// DnaResult into a Power Game squad placement:
//   - age band (the SELLABLE bands: 12-14 / 14-16 / 17+, from the planning sheet)
//   - sellable ability stream (Performance / Pathway)
//   - the §8 play-up guardrail: a younger COMPETITIVE player may play up ONE band
//     (only when age-adjacent to it); an older player is NEVER demoted; a much
//     younger prodigy is flagged for coach review, never auto-mixed with older kids.
//
// The reference implementation is ported from the portal's squad-guardrail.test.ts
// (the placeSquad/BANDS logic), re-banded to the Power Game structure.
// ============================================================

import type { DnaResult } from "./engine";

export interface AgeBandDef {
  /** Display name of the band. */
  name: string;
  /** Inclusive top age of the band. */
  hi: number;
  /** true = open/adult band (includes 18+); minors are never AUTO-played-up into it. */
  adult?: boolean;
}

/**
 * Power Game sellable age bands (from the centre planning sheet + applicant demand).
 * Collapses the portal's U17-U19 + U20+ into a single "17+" open band.
 * Edit here to re-band; tests in placement.test.ts pin the behaviour.
 */
export const PG_BANDS: AgeBandDef[] = [
  { name: "12-14", hi: 14 },
  { name: "14-16", hi: 16 },
  { name: "17+", hi: 200, adult: true },
];

/** Must be Performance/Elite (engine tier ≥ this) to justify training up a band. */
export const PLAY_UP_MIN_TIER = 4;

export type Stream = "performance" | "pathway" | "review";
export type PlayFlag = "play_up" | "play_up_review" | null;

/**
 * Map the engine's ability tier (1-5) onto a Power Game sellable stream.
 *   Tier 4-5 → Performance   Tier 2-3 → Pathway   Tier 1 / null → review (below floor)
 * Tunable cut-point — recalibrate against the first intake.
 */
export function streamForTier(tier: number | null): Stream {
  if (tier == null) return "review";
  if (tier >= 4) return "performance";
  if (tier >= 2) return "pathway";
  return "review";
}

/** Index of the band a given age falls into (clamped to the last band). */
export function homeBandIdx(age: number, bands: AgeBandDef[] = PG_BANDS): number {
  const i = bands.findIndex((b) => age <= b.hi);
  return i === -1 ? bands.length - 1 : i;
}

/**
 * The age-appropriateness guardrail (spec §8). Returns the placed band + play flag.
 *   - younger + competitive (tier ≥ PLAY_UP_MIN_TIER) AND within ~1yr of the top of
 *     their band → AUTO play up one band (age-safe, ≤ ~3yr spread).
 *   - exceptional (tier 5) but too young (not near the top) → play_up_review:
 *     stays in home band, coach decides — NEVER auto-mixed with much older players.
 *   - everyone else (incl. weak older players) → stays in home band, never demoted.
 */
export function placeSquad(
  age: number,
  tier: number | null,
  bands: AgeBandDef[] = PG_BANDS,
): { placedBand: string; playFlag: PlayFlag } {
  const idx = homeBandIdx(age, bands);
  const home = bands[idx];
  const next = bands[idx + 1];
  const nearTopOfBand = age >= home.hi - 1; // within ~1yr of the top → age-adjacent to next band
  if (next && tier != null && tier >= PLAY_UP_MIN_TIER) {
    // SAFEGUARDING: never AUTO-place a minor into the open/adult band — a coach must
    // confirm any minor training in an adult squad.
    const intoAdult = !!next.adult && age < 18;
    if (nearTopOfBand && !intoAdult) return { placedBand: next.name, playFlag: "play_up" };
    if (tier === 5 || (nearTopOfBand && intoAdult)) {
      return { placedBand: home.name, playFlag: "play_up_review" };
    }
  }
  return { placedBand: home.name, playFlag: null };
}

export interface Placement {
  age: number | null;
  /** Band from age alone. */
  homeBand: string;
  /** Band the player is placed in after the guardrail (only ever ≥ homeBand). */
  placedBand: string;
  playFlag: PlayFlag;
  /** Sellable ability stream (Performance/Pathway), independent of review status. */
  stream: Stream;
  /** Best skill → which net/lane they stream into. */
  lane: "Batting" | "Bowling" | "Keeping" | null;
  /** true → coach review queue, NO instant payment (soft path). */
  requiresReview: boolean;
  reviewReasons: string[];
}

/** Pick the player's lane from the engine's per-skill scores (best skill places them). */
export function laneFromDna(dna: DnaResult): "Batting" | "Bowling" | "Keeping" | null {
  const scores: [number, "Batting" | "Bowling" | "Keeping"][] = [];
  if (dna.battingScore != null) scores.push([dna.battingScore, "Batting"]);
  if (dna.bowlingScore != null) scores.push([dna.bowlingScore, "Bowling"]);
  if (dna.keepingScore != null) scores.push([dna.keepingScore, "Keeping"]);
  if (scores.length === 0) return null;
  scores.sort((a, b) => b[0] - a[0]);
  return scores[0][1];
}

/** Full Power Game placement from an engine result. */
export function placeFromDna(dna: DnaResult): Placement {
  const age = dna.breakdown.age;
  if (age == null) {
    return {
      age: null,
      homeBand: "Unknown",
      placedBand: "Unknown",
      playFlag: null,
      stream: "review",
      lane: laneFromDna(dna),
      requiresReview: true,
      reviewReasons: ["no_dob"],
    };
  }
  const homeBand = PG_BANDS[homeBandIdx(age)].name;
  const { placedBand, playFlag } = placeSquad(age, dna.abilityTier);
  const stream = streamForTier(dna.abilityTier);

  const reviewReasons = [...dna.reviewFlags];
  if (playFlag === "play_up_review" && !reviewReasons.includes("play_up_review")) {
    reviewReasons.push("play_up_review");
  }
  const requiresReview =
    dna.needsAdminReview || stream === "review" || playFlag === "play_up_review";

  return {
    age,
    homeBand,
    placedBand,
    playFlag,
    stream,
    lane: laneFromDna(dna),
    requiresReview,
    reviewReasons,
  };
}
