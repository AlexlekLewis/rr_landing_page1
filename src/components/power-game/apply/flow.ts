// ============================================================
// flow.ts — pure logic for the Power Game apply funnel (testable, no React).
// Maps the form → engine input → placement, and validates each step.
// ============================================================
import { computeDna, getAge, type ComputeDnaInput } from "../../../lib/scoring/engine";
import { COMPETITION_TIERS } from "../../../lib/scoring/ladder";
import { placeFromDna, PG_BANDS, homeBandIdx, type Placement } from "../../../lib/scoring/guardrail";
import { clearsFloor, isRepLevel } from "./levels";
import type { DnaResult } from "../../../lib/scoring/engine";

export const CURRENT_SEASON = "2025/26";
export const CURRENT_SEASON_START = 2025;
export const BLOCK_FEE = 989; // 8-week phase (from the planning sheet)

// Single SHARED referral code — hand this out to coaches/members who refer.
// The applicant enters it + their referrer's name when applying; it NEVER blocks
// the application. Alex confirms referrals manually before any reward is given.
// To change the code, edit this one value.
export const REFERRAL_CODE = "NEXTROYAL26";

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
  current_club: string; // the player's actual current cricket club name(s)
  format: "t20" | "od" | "multiday" | "";
  // No performance numbers are collected (batting, bowling or keeping) — Alex's call.
  // Placement is purely level × age.
  // Compliances & permissions (captured at submission).
  accept_terms: boolean;
  accept_player_code: boolean;
  accept_parent_code: boolean;
  accept_social_media: boolean;
  accept_playing_standard: boolean;
  needs_uniform: boolean;
  // Wild Card — talent the rep system hasn't caught (no rep / graded senior cricket).
  // Lets a player apply for a coach assessment instead of claiming a level they don't have.
  wildcard?: boolean;
  // Referral (OPTIONAL) — applicant credits the coach / talent scout / player who
  // referred them. referral_code is a soft check against REFERRAL_CODE; it never blocks
  // the application or the purchase. Alex confirms manually before crediting the referrer.
  referral_code?: string;
  referred_by_name?: string;
  referred_by_role?: "elite_player" | "talent_scout" | "coach" | "";
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
  current_club: "",
  format: "",
  accept_terms: false,
  accept_player_code: false,
  accept_parent_code: false,
  accept_social_media: false,
  accept_playing_standard: false,
  needs_uniform: false,
  wildcard: false,
  referral_code: "",
  referred_by_name: "",
  referred_by_role: "",
};

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

  // No performance numbers are collected — placement is purely level × age. We still send a
  // season's assumed volume so a player who reached a level isn't flagged "thin_history".
  const levelRow = (code: string): ComputeDnaInput["stats"][number] => ({
    season: CURRENT_SEASON,
    format: fmt,
    competitionCode: code,
    batMatches: ASSUMED_MATCHES,
    batInnings: bats ? ASSUMED_MATCHES : null,
    batAverage: null,
    batRuns: null,
    bowlMatches: bowls ? ASSUMED_MATCHES : null,
    bowlAverage: null,
    bowlWickets: null,
    fieldCatches: null,
    fieldStumpings: null,
  });

  const stats: ComputeDnaInput["stats"] = [];
  if (f.rep_level) stats.push(levelRow(f.rep_level));
  if (f.club_level) stats.push(levelRow(f.club_level));

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
  // OPEN PROGRAM (17 Jun 2026): the program is built for 12-16. Anyone in that band
  // is placed in their HOME AGE BAND, full stop — they get a slot picker and pay
  // normally, regardless of cricket history. Coaches sort lanes by ability on the
  // day using the INTERNAL stream flag below (never user-visible).
  //   12-16, rep / graded senior   → internalStream='qualified'
  //   12-16, Wild Card / no history → internalStream='review'  (still pays, still books)
  //   17+                          → requiresReview=true, manual coach allocation
  //   no DOB                       → requiresReview=true (data gap)
  const dna = computeDna(buildEngineInput(f));
  const eng = placeFromDna(dna); // reused only to keep a complete, type-valid Placement object
  const age = calcAge(f.player_dob);
  const band = age != null ? PG_BANDS[homeBandIdx(age)].name : eng.homeBand;
  const playUp = isRepLevel(f.rep_level) && clearsFloor(f.club_level);
  const isAdult = age != null && age >= 17;
  const qualified = clearsFloor(f.rep_level) || clearsFloor(f.club_level);
  const internalStream: Placement["internalStream"] =
    isAdult ? "senior_review" : qualified ? "qualified" : "review";
  const placement: Placement = {
    ...eng,
    age,
    homeBand: band,
    placedBand: band, // ALWAYS the home age band — no automatic play-up
    playFlag: playUp ? "play_up" : null,
    internalStream,
    requiresReview: age == null || isAdult,
    reviewReasons:
      age == null ? ["no_dob"] : isAdult ? ["senior_review"] : [],
  };
  return { dna, placement };
}

// "profile" now carries BOTH the player's game AND their last-3-years cricket
// history (merged into one submission — Alex's call). No separate "history" step.
export const STEPS = ["centre", "player", "profile", "reveal", "slot", "kit", "secure"] as const;
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
    if (!f.gender) e.push("Let us know if you play male or female cricket.");
    if (isMinor(f.player_dob) && !f.parent_name.trim()) e.push("Parent/guardian name is required for under-18s.");
    if (!f.contact_phone.trim()) e.push("A contact mobile is required.");
    if (!emailOk(f.contact_email)) e.push("A valid contact email is required.");
    if (!f.suburb.trim()) e.push("Suburb is required.");
    if (!consentsOk(f)) e.push("Please accept the compliances to continue.");
  }
  if (step === "profile") {
    // OPEN PROGRAM: representative / senior / club details are OPTIONAL — captured only to
    // flag play-up candidates (rep + senior). Nothing here is required to apply, so any
    // player can proceed and be placed in their home age band.
  }
  return e;
}
