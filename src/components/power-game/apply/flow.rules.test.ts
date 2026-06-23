// ============================================================
// flow.rules.test.ts — open-program placement rules (18 Jun 2026, funnel level).
//   • Every player is placed in their HOME age band — no auto play-up, no review.
//   • play_up is a COACH FLAG, set only for rep + graded senior; it never moves anyone.
//   Age bands (PG_BANDS): ≤14 → 12-14 · 15-16 → 14-16 · ≥17 → 17+
// ============================================================
import { describe, it, expect } from "vitest";
import { BLANK_FORM, computePlacement, type ApplyForm } from "./flow";

const mk = (dob: string, extra: Partial<ApplyForm> = {}): ApplyForm => ({
  ...BLANK_FORM,
  centre: "williamstown",
  player_name: "X",
  player_dob: dob,
  gender: "M",
  contact_phone: "04",
  contact_email: "a@b.com",
  suburb: "X",
  skill: "batting",
  batting_hand: "right",
  current_club: "CC",
  format: "t20",
  ...extra,
});

describe("age-based placement (open program)", () => {
  it("places strictly by age band", () => {
    expect(computePlacement(mk("2013-01-01")).placement.placedBand).toBe("12-14"); // 13
    expect(computePlacement(mk("2012-01-01")).placement.placedBand).toBe("12-14"); // 14
    expect(computePlacement(mk("2011-01-01")).placement.placedBand).toBe("14-16"); // 15
    expect(computePlacement(mk("2010-01-01")).placement.placedBand).toBe("14-16"); // 16
    expect(computePlacement(mk("2009-01-01")).placement.placedBand).toBe("17+"); // 17
    expect(computePlacement(mk("2001-01-01")).placement.placedBand).toBe("17+"); // 25
  });

  it("never auto-moves a player up a band, however strong — placedBand === homeBand", () => {
    const p = computePlacement(mk("2012-01-01", { rep_level: "REP-16M", club_level: "P1M" })).placement;
    expect(p.placedBand).toBe("12-14");
    expect(p.placedBand).toBe(p.homeBand);
    expect(p.requiresReview).toBe(false);
  });

  it("no player is sent to review for being below a level — everyone is placed by age", () => {
    const noHistory = computePlacement(mk("2013-01-01", { rep_level: "", club_level: "" })).placement;
    expect(noHistory.requiresReview).toBe(false);
    expect(noHistory.reviewReasons).toEqual([]);
    expect(noHistory.placedBand).toBe("12-14");
  });

  it("play_up is a coach FLAG (rep + graded senior), not a move", () => {
    const flagged = computePlacement(mk("2012-01-01", { rep_level: "REP-16M", club_level: "P1M" })).placement;
    expect(flagged.playFlag).toBe("play_up");
    expect(flagged.placedBand).toBe("12-14"); // still their home band — coach decides any move
  });
});
