import { describe, it, expect } from "vitest";
import { BLANK_FORM, computePlacement, validateStep, buildEngineInput, secondaryOptions, type ApplyForm } from "./flow";

const base: ApplyForm = {
  ...BLANK_FORM,
  centre: "williamstown",
  player_name: "X",
  player_dob: "2009-01-01",
  gender: "M",
  contact_phone: "04",
  contact_email: "a@b.com",
  suburb: "X",
  skill: "batting",
  batting_hand: "right",
  format: "t20",
};

describe("two-layer level model + Power Game floor", () => {
  it("representative level clears the floor", () => {
    expect(computePlacement({ ...base, rep_level: "P16M" }).placement.reviewReasons).not.toContain("below_pg_floor");
  });

  it("Premier / Sub-District club clears the floor", () => {
    expect(computePlacement({ ...base, club_level: "P1M" }).placement.reviewReasons).not.toContain("below_pg_floor");
    expect(computePlacement({ ...base, club_level: "SD2" }).placement.reviewReasons).not.toContain("below_pg_floor");
  });

  it("association 2nd grade & up clears the floor; below 2nd grade → coach review", () => {
    // 2nd-grade association now qualifies — no below-floor review
    expect(computePlacement({ ...base, club_level: "CS-2T" }).placement.reviewReasons).not.toContain("below_pg_floor");
    // below 2nd grade / social → review, no instant offer
    const below = computePlacement({ ...base, club_level: "CS-BELOW" }).placement;
    expect(below.requiresReview).toBe(true);
    expect(below.reviewReasons).toContain("below_pg_floor");
  });

  it("captures one stats row PER level, rep flagged as the representative honour", () => {
    const input = buildEngineInput({ ...base, rep_level: "REP-16M", club_level: "P1M" });
    expect(input.stats.map((s) => s.competitionCode).sort()).toEqual(["P1M", "REP-16M"]);
    expect(input.history.find((h) => h.competitionCode === "REP-16M")!.isRepresentativeHonour).toBe(true);
    expect(input.history.find((h) => h.competitionCode === "P1M")!.isRepresentativeHonour).toBe(false);
    // batting average is no longer collected — batters are placed on level + age
    expect(input.stats.find((s) => s.competitionCode === "REP-16M")!.batAverage).toBeNull();
  });

  it("history step requires at least one of rep / senior level, or a Wild Card", () => {
    expect(validateStep("history", { ...base, rep_level: "", club_level: "" })).toContain(
      "Add your representative and/or senior cricket — or apply as a Wild Card below.",
    );
    // a level alone is enough — match counts and format are no longer required
    expect(validateStep("history", { ...base, rep_level: "P16M", club_level: "", format: "" })).toEqual([]);
    // Wild Card clears the requirement without any level (talent the rep system hasn't caught)
    expect(validateStep("history", { ...base, rep_level: "", club_level: "", wildcard: true })).toEqual([]);
  });

  it("Wild Card with no clearing level → coach review with a 'wildcard' reason", () => {
    const { placement } = computePlacement({ ...base, rep_level: "", club_level: "", wildcard: true });
    expect(placement.requiresReview).toBe(true);
    expect(placement.reviewReasons).toContain("wildcard");
  });

  it("Wild Card never downgrades a real qualifier (rep level still clears)", () => {
    const { placement } = computePlacement({ ...base, rep_level: "P16M", club_level: "", wildcard: true });
    expect(placement.reviewReasons).not.toContain("wildcard");
    expect(placement.reviewReasons).not.toContain("below_pg_floor");
  });
});

describe("secondary skill options never duplicate the primary", () => {
  it("batter → bowling/wicketkeeping/none (no batting)", () => {
    const v = secondaryOptions("batting").map((o) => o.value);
    expect(v).toEqual(["bowling", "wicketkeeping", "none"]);
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
