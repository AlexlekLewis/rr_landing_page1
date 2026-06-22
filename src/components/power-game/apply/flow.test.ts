import { describe, it, expect } from "vitest";
import { BLANK_FORM, computePlacement, validateStep, buildEngineInput, secondaryOptions, MAX_AGE, type ApplyForm } from "./flow";
import { eligibleBands } from "../../../lib/scoring/guardrail";

// Today is mocked-free, so derive DOBs from the current year to keep ages stable.
const dobForAge = (age: number) => `${new Date().getFullYear() - age}-01-01`;

const base: ApplyForm = {
  ...BLANK_FORM,
  centre: "williamstown",
  player_name: "X",
  player_dob: "2013-01-01", // ~13yo → 12-14 band
  gender: "M",
  contact_phone: "04",
  contact_email: "a@b.com",
  suburb: "X",
  skill: "batting",
  batting_hand: "right",
  current_club: "Williamstown CC",
  format: "t20",
};

describe("open-program age-based placement", () => {
  it("places every player in their HOME age band, no review — even with no rep/senior", () => {
    const { placement } = computePlacement({ ...base, rep_level: "", club_level: "" });
    expect(placement.placedBand).toBe(placement.homeBand);
    expect(placement.requiresReview).toBe(false);
    expect(placement.reviewReasons).toEqual([]);
    expect(["12-14", "14-16", "17+"]).toContain(placement.placedBand);
  });

  it("never auto-moves a player up — placedBand always equals homeBand", () => {
    const strong = computePlacement({ ...base, rep_level: "REP-16M", club_level: "P1M" }).placement;
    expect(strong.placedBand).toBe(strong.homeBand);
    expect(strong.requiresReview).toBe(false);
  });

  it("flags play_up ONLY when the player has rep AND graded senior (2nd grade & up)", () => {
    // rep + Premier senior → flagged
    expect(computePlacement({ ...base, rep_level: "REP-16M", club_level: "P1M" }).placement.playFlag).toBe("play_up");
    // rep + 2nd-grade association senior → flagged
    expect(computePlacement({ ...base, rep_level: "REP-16M", club_level: "CS-2T" }).placement.playFlag).toBe("play_up");
    // rep alone → not flagged
    expect(computePlacement({ ...base, rep_level: "REP-16M", club_level: "" }).placement.playFlag).toBeNull();
    // senior alone → not flagged
    expect(computePlacement({ ...base, rep_level: "", club_level: "P1M" }).placement.playFlag).toBeNull();
    // rep + below-2nd-grade social senior → NOT flagged (doesn't clear the senior bar)
    expect(computePlacement({ ...base, rep_level: "REP-16M", club_level: "CS-BELOW" }).placement.playFlag).toBeNull();
    // nothing → not flagged
    expect(computePlacement({ ...base, rep_level: "", club_level: "" }).placement.playFlag).toBeNull();
  });

  it("captures one engine stats row PER level (rep flagged as the representative honour)", () => {
    const input = buildEngineInput({ ...base, rep_level: "REP-16M", club_level: "P1M" });
    expect(input.stats.map((s) => s.competitionCode).sort()).toEqual(["P1M", "REP-16M"]);
    expect(input.history.find((h) => h.competitionCode === "REP-16M")!.isRepresentativeHonour).toBe(true);
    expect(input.history.find((h) => h.competitionCode === "P1M")!.isRepresentativeHonour).toBe(false);
  });

  it("profile step requires nothing — rep/senior/club are optional (open program)", () => {
    expect(validateStep("profile", { ...base, rep_level: "", club_level: "", current_club: "" })).toEqual([]);
    expect(validateStep("profile", { ...base, rep_level: "REP-16M" })).toEqual([]);
  });
});

describe("overlapping age bands — a 14yo is eligible for BOTH 12-14 and 14-16", () => {
  it("eligibleBands(age) overlaps only on the boundary year (14)", () => {
    expect(eligibleBands(13).map((b) => b.name)).toEqual(["12-14"]);
    expect(eligibleBands(14).map((b) => b.name)).toEqual(["12-14", "14-16"]);
    expect(eligibleBands(15).map((b) => b.name)).toEqual(["14-16"]);
    expect(eligibleBands(16).map((b) => b.name)).toEqual(["14-16"]);
    expect(eligibleBands(17).map((b) => b.name)).toEqual(["17+"]);
    // below the youngest band → still gets one option (youngest band)
    expect(eligibleBands(10).map((b) => b.name)).toEqual(["12-14"]);
  });

  it("computePlacement gives a 14yo both bands' session options, home band stays 12-14", () => {
    const p14 = computePlacement({ ...base, player_dob: dobForAge(14) }).placement;
    expect(p14.homeBand).toBe("12-14");
    expect(p14.placedBand).toBe("12-14");
    expect(p14.eligibleBands).toEqual(["12-14", "14-16"]);

    const p13 = computePlacement({ ...base, player_dob: dobForAge(13) }).placement;
    expect(p13.eligibleBands).toEqual(["12-14"]);

    const p15 = computePlacement({ ...base, player_dob: dobForAge(15) }).placement;
    expect(p15.eligibleBands).toEqual(["14-16"]);
  });
});

describe(`upper age limit — players over ${MAX_AGE} are blocked, 14yo and ${MAX_AGE}yo are not`, () => {
  const hasAgeError = (errs: string[]) => errs.some((m) => new RegExp(`${MAX_AGE} and under`).test(m));

  it(`blocks anyone over the cap (${MAX_AGE + 1}+) at the player step`, () => {
    expect(hasAgeError(validateStep("player", { ...base, player_dob: dobForAge(MAX_AGE + 1) }))).toBe(true);
    expect(hasAgeError(validateStep("player", { ...base, player_dob: dobForAge(50) }))).toBe(true);
  });

  it(`allows everyone up to and including ${MAX_AGE} (and 14yos)`, () => {
    expect(hasAgeError(validateStep("player", { ...base, player_dob: dobForAge(MAX_AGE) }))).toBe(false);
    expect(hasAgeError(validateStep("player", { ...base, player_dob: dobForAge(14) }))).toBe(false);
    expect(hasAgeError(validateStep("player", { ...base, player_dob: dobForAge(12) }))).toBe(false);
  });
});

describe("secondary skill options never duplicate the primary", () => {
  it("batter → bowling/wicketkeeping/none (no batting)", () => {
    expect(secondaryOptions("batting").map((o) => o.value)).toEqual(["bowling", "wicketkeeping", "none"]);
  });
  it("bowler → batting/wicketkeeping/none (no bowling)", () => {
    expect(secondaryOptions("bowling").map((o) => o.value)).toEqual(["batting", "wicketkeeping", "none"]);
  });
  it("all-rounder → wicketkeeping/none only", () => {
    expect(secondaryOptions("all_rounder").map((o) => o.value)).toEqual(["wicketkeeping", "none"]);
  });
  it("wicketkeeper → batting/bowling/none (no wicketkeeping)", () => {
    expect(secondaryOptions("wicketkeeper").map((o) => o.value)).toEqual(["batting", "bowling", "none"]);
  });
});
