// ============================================================
// flow.ts — pure logic for the Power Game apply funnel (testable, no React).
// Maps the form → engine input → placement, and validates each step.
// ============================================================
import { computeDna, getAge, type ComputeDnaInput } from "../../../lib/scoring/engine";
import { COMPETITION_TIERS } from "../../../lib/scoring/ladder";
import { placeFromDna, type Placement } from "../../../lib/scoring/guardrail";
import { clearsFloor, isRepLevel } from "./levels";
import type { DnaResult } from "../../../lib/scoring/engine";

export const CURRENT_SEASON = "2025/26";
export const CURRENT_SEASON_START = 2025;
export const BLOCK_FEE = 989; // 8-week phase (from the planning sheet)

// Match counts are no longer collected. A player who reached a level played a season,
// so assume a typical volume — this keeps them off the engine's "thin_history" review
// gate. Placement is level×age driven, so the exact number is neutral.
const ASSUMED_MATCHES = 10;

export type MainSkill = "batting" | "bowling" | "all_rounder" | "wicketkeeper";

export interface ApplyForm {
  centre: string;
  player_name: string;
  player_dob: string;
  gender: "M" | "F" | "";
  parent_name: string;
  contact_phone: string;
  contact_email: string;
  suburb: string;
  skill: MainSkill | "";
  batting_hand: "right" | "left" | "";
  bowling_type: "pace" | "leg_spin" | "off_spin" | "";
  secondary_skill: "batting" | "bowling" | "wicketkeeping" | "none" | "";
  secondary_bowling_type: "pace" | "leg_spin" | "off_spin" | "";
  rep_level: string; // PRIMARY — representative level (VMCU rep floor)
  club_level: string; // secondary — highest club grade
  format: "t20" | "od" | "multiday" | "";
  // Per-level stats for the PRIMARY skill — captured at BOTH rep and club level.
  // (Total runs + games/matches were removed at Alex's request.)
  rep_bat_avg: string;
  rep_bowl_avg: string;
  rep_bowl_wkts: string;
  rep_catches: string;
  rep_stumpings: string;
  club_bat_avg: string;
  club_bowl_avg: string;
  club_bowl_wkts: string;
  club_catches: string;
  club_stumpings: string;
  // Compliances & permissions (captured at submission).
  accept_terms: boolean;
  accept_player_code: boolean;
  accept_parent_code: boolean;
  accept_social_media: boolean;
  accept_playing_standard: boolean;
  needs_uniform: boolean;
}

export const BLANK_FORM: ApplyForm = {
  centre: "",
  player_name: "",
  player_dob: "",
  gender: "",
  parent_name: "",
  contact_phone: "",
  contact_email: "",
  suburb: "",
  skill: "",
  batting_hand: "",
  bowling_type: "",
  secondary_skill: "",
  secondary_bowling_type: "",
  rep_level: "",
  club_level: "",
  format: "",
  rep_bat_avg: "",
  rep_bowl_avg: "",
  rep_bowl_wkts: "",
  rep_catches: "",
  rep_stumpings: "",
  club_bat_avg: "",
  club_bowl_avg: "",
  club_bowl_wkts: "",
  club_catches: "",
  club_stumpings: "",
  accept_terms: false,
  accept_player_code: false,
  accept_parent_code: false,
  accept_social_media: false,
  accept_playing_standard: false,
  needs_uniform: false,
};

const n = (v: string): number | null => (v === "" || v == null ? null : Number(v));

export function calcAge(dob: string): number | null {
  return getAge(dob || null);
}

export function isMinor(dob: string): boolean {
  const a = calcAge(dob);
  return a != null && a < 18;
}

/** Required compliances/permissions all accepted (parent code only required for minors). */
export function consentsOk(f: ApplyForm): boolean {
  const base = f.accept_terms && f.accept_player_code && f.accept_social_media && f.accept_playing_standard;
  return !!(base && (!isMinor(f.player_dob) || f.accept_parent_code));
}

/** Secondary skill options — never the same as primary; wicketkeeping is allowed. */
export function secondaryOptions(primary: string): { value: string; label: string }[] {
  const all = [
    { value: "batting", label: "Batting" },
    { value: "bowling", label: "Bowling" },
    { value: "wicketkeeping", label: "Wicketkeeping" },
  ];
  const exclude =
    primary === "all_rounder" ? ["batting", "bowling"] : primary === "wicketkeeper" ? ["wicketkeeping"] : [primary];
  return [...all.filter((o) => !exclude.includes(o.value)), { value: "none", label: "None" }];
}

/** Build the engine input from the form — one stats row PER LEVEL (rep + club). */
export function buildEngineInput(f: ApplyForm): ComputeDnaInput {
  const bats = f.skill === "batting" || f.skill === "all_rounder";
  const bowls = f.skill === "bowling" || f.skill === "all_rounder";
  const keeps = f.skill === "wicketkeeper";
  const fmt = (f.format || "t20") as ComputeDnaInput["stats"][number]["format"];

  // The player's numbers AT a given level → one stats row scored at that level's CTI.
  const levelRow = (
    code: string,
    batAvg: string,
    bowlAvg: string,
    bowlWkts: string,
    catches: string,
    stumpings: string,
  ): ComputeDnaInput["stats"][number] => ({
    season: CURRENT_SEASON,
    format: fmt,
    competitionCode: code,
    // Runs + matches are no longer collected; assume a season's volume so a player who
    // reached this level isn't flagged "thin_history". Placement stays level×age driven.
    batMatches: ASSUMED_MATCHES,
    batInnings: bats ? ASSUMED_MATCHES : null,
    batAverage: bats ? n(batAvg) : null,
    batRuns: null,
    bowlMatches: bowls ? ASSUMED_MATCHES : null,
    bowlAverage: bowls ? n(bowlAvg) : null,
    bowlWickets: bowls ? n(bowlWkts) : null,
    fieldCatches: keeps ? n(catches) : null,
    fieldStumpings: keeps ? n(stumpings) : null,
  });

  const stats: ComputeDnaInput["stats"] = [];
  if (f.rep_level)
    stats.push(levelRow(f.rep_level, f.rep_bat_avg, f.rep_bowl_avg, f.rep_bowl_wkts, f.rep_catches, f.rep_stumpings));
  if (f.club_level)
    stats.push(levelRow(f.club_level, f.club_bat_avg, f.club_bowl_avg, f.club_bowl_wkts, f.club_catches, f.club_stumpings));

  return {
    profile: {
      dob: f.player_dob || null,
      isKeeper: keeps,
      battingPositionBand: bats ? "1-3" : null,
      bowlingRole: bowls ? "new_ball" : null,
      bowlingType: f.bowling_type === "pace" ? "pace" : f.bowling_type ? "spin" : null, // leg/off spin → spin for the engine
    },
    // Rep + club both inform the level; isRepresentativeHonour marks the rep one.
    history: ([f.rep_level, f.club_level].filter(Boolean) as string[]).map((code) => ({
      competitionCode: code,
      mostRecentSeason: CURRENT_SEASON,
      isRepresentativeHonour: !!f.rep_level && code === f.rep_level,
    })),
    stats,
    competitionTiers: COMPETITION_TIERS,
    secondarySkill: f.secondary_skill || null,
    currentSeasonStartYear: CURRENT_SEASON_START,
  };
}

export interface PlacementResult {
  dna: DnaResult;
  placement: Placement;
}

export function computePlacement(f: ApplyForm): PlacementResult {
  const dna = computeDna(buildEngineInput(f));
  let placement = placeFromDna(dna);

  // Alex's placement rules (10 Jun 2026):
  // 1) A strong-for-age player goes straight into the TOP tier of their own age group —
  //    no review detour. (A coach may still offer the bottom tier of the band above;
  //    that's a manual move, the flag is kept for the admin view.)
  if (placement.playFlag === "play_up_review") {
    placement = {
      ...placement,
      reviewReasons: placement.reviewReasons.filter((r) => r !== "play_up_review"),
      requiresReview: dna.needsAdminReview || placement.stream === "review",
    };
  }
  // 2) Making ANY representative level (VMCU and up) guarantees at least the lower
  //    (Pathway) squad of their age group — playing rep AT your age never drops you
  //    to review on tier alone.
  if (placement.stream === "review" && placement.age != null && isRepLevel(f.rep_level) && dna.eligibilityStatus === "eligible") {
    placement = { ...placement, stream: "pathway", requiresReview: dna.needsAdminReview };
  }

  // Power Game floor: representative cricket, Premier/Sub-District, or association senior
  // (2nd grade & up) clears it. Below 2nd grade / social cricket → coach review (no offer).
  if (!clearsFloor(f.rep_level) && !clearsFloor(f.club_level)) {
    placement = {
      ...placement,
      requiresReview: true,
      reviewReasons: Array.from(new Set([...placement.reviewReasons, "below_pg_floor"])),
    };
  }
  return { dna, placement };
}

export const STEPS = ["centre", "player", "profile", "history", "reveal", "slot", "secure"] as const;
export type Step = (typeof STEPS)[number];

const emailOk = (e: string) => /\S+@\S+\.\S+/.test(e);

/** Return a list of validation errors for a given step (empty = valid). */
export function validateStep(step: Step, f: ApplyForm): string[] {
  const e: string[] = [];
  if (step === "centre") {
    if (!f.centre) e.push("Choose a centre to continue.");
  }
  if (step === "player") {
    if (!f.player_name.trim()) e.push("Player name is required.");
    if (!f.player_dob) e.push("Date of birth is required.");
    if (!f.gender) e.push("Select a gender.");
    if (isMinor(f.player_dob) && !f.parent_name.trim()) e.push("Parent/guardian name is required for under-18s.");
    if (!f.contact_phone.trim()) e.push("A contact mobile is required.");
    if (!emailOk(f.contact_email)) e.push("A valid contact email is required.");
    if (!f.suburb.trim()) e.push("Suburb is required.");
  }
  if (step === "profile") {
    if (!f.skill) e.push("Select a main skill.");
    if ((f.skill === "batting" || f.skill === "all_rounder" || f.skill === "wicketkeeper") && !f.batting_hand)
      e.push("Select a batting hand.");
    if ((f.skill === "bowling" || f.skill === "all_rounder") && !f.bowling_type) e.push("Select a bowling type.");
  }
  if (step === "history") {
    if (!f.rep_level && !f.club_level) e.push("Add your representative and/or senior cricket — pick at least one.");
  }
  return e;
}
