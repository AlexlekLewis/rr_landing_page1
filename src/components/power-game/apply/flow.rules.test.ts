// ============================================================
// flow.rules.test.ts — Alex's placement rules (10 Jun 2026), funnel level.
//   1) Any rep level (VMCU+) guarantees at least the Pathway squad of their age group.
//   2) A strong-for-age player goes straight into the top tier of their own age group
//      (no review detour); moving to the band above stays a coach decision.
// ============================================================
import { describe, it, expect } from "vitest";
import { BLANK_FORM, computePlacement, type ApplyForm } from "./flow";

const form = (over: Partial<ApplyForm>): ApplyForm => ({
  ...BLANK_FORM,
  player_name: "T", suburb: "x", contact_phone: "0", contact_email: "a@b.co",
  batting_hand: "right", skill: "batting", format: "t20",
  ...over,
} as ApplyForm);
const dob = (age: number) => `${new Date().getFullYear() - age}-01-01`;

describe("rule 1 — at-age rep guarantees at least Pathway", () => {
  it("13yo Des Nolan U13 rep → 12-14 Pathway, no review", () => {
    const { placement } = computePlacement(form({ player_dob: dob(13), gender: "M", rep_level: "REP-13M" }));
    expect(placement.stream).toBe("pathway");
    expect(placement.placedBand).toBe("12-14");
    expect(placement.requiresReview).toBe(false);
  });
  it("14yo girl U12 rep ×2 → 12-14 Pathway, no review", () => {
    const { placement } = computePlacement(form({ player_dob: dob(14), gender: "F", rep_level: "REP-12F" }));
    expect(placement.stream).toBe("pathway");
    expect(placement.requiresReview).toBe(false);
  });
  it("club-only below 2nd grade still goes to coach review", () => {
    const { placement } = computePlacement(form({ player_dob: dob(13), gender: "M", club_level: "CS-BELOW" }));
    expect(placement.requiresReview).toBe(true);
  });
  it("no levels at all still goes to coach review", () => {
    const { placement } = computePlacement(form({ player_dob: dob(13), gender: "M" }));
    expect(placement.requiresReview).toBe(true);
  });
});

describe("rule 2 — strong-for-age goes to the top tier of their own age group", () => {
  it("15yo girl in Women's Premier 1st + Premier U18 → 14-16 Performance, no review", () => {
    const { placement, dna } = computePlacement(form({ player_dob: dob(15), gender: "F", rep_level: "P18F", club_level: "P1F" }));
    expect(dna.abilityTier).toBeGreaterThanOrEqual(4);
    expect(placement.placedBand).toBe("14-16");
    expect(placement.stream).toBe("performance");
    expect(placement.requiresReview).toBe(false);
  });
  it("15yo boy Dowling + Sub-District 1st XI → 14-16 Performance, no review", () => {
    const { placement, dna } = computePlacement(form({ player_dob: dob(15), gender: "M", rep_level: "P16M", club_level: "SD1" }));
    expect(dna.abilityTier).toBeGreaterThanOrEqual(4);
    expect(placement.placedBand).toBe("14-16");
    expect(placement.stream).toBe("performance");
    expect(placement.requiresReview).toBe(false);
  });
  it("16+ performance minor still auto-joins the adults (unchanged)", () => {
    const { placement } = computePlacement(form({ player_dob: dob(16), gender: "M", club_level: "P3M", rep_level: "" }));
    expect(placement.placedBand).toBe("17+");
    expect(placement.requiresReview).toBe(false);
  });
});
