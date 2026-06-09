import { describe, it, expect } from "vitest";
// @ts-expect-error — plain JS module (shares logic with the funnel + API layer).
import { buildApplicationRow } from "./submit.js";

const adult = {
  player_name: "Sam Taylor Smith", player_dob: "1998-01-01", gender: "M",
  contact_email: "sam@e.com", contact_phone: "0400000000", suburb: "Williamstown",
  skill: "batting", secondary_skill: "none", format: "t20",
  rep_level: "P16M", rep_games: "10", rep_bat_avg: "38", rep_bat_runs: "420",
  club_level: "", parent_name: "",
};
const minor = { ...adult, player_name: "Jo Young", player_dob: "2013-01-01", parent_name: "Pat Young", contact_email: "pat@e.com", contact_phone: "0411111111" };
const placement = { stream: "performance", placedBand: "14-16", requiresReview: false, reviewReasons: [] };
const squad = { day: "Saturday", startTime: "2:00pm", endTime: "4:00pm" };

describe("buildApplicationRow", () => {
  it("splits a multi-word name into first/last", () => {
    const r = buildApplicationRow(adult, placement, squad, {});
    expect(r.first_name).toBe("Sam Taylor");
    expect(r.last_name).toBe("Smith");
    expect(r.player_name).toBe("Sam Taylor Smith");
  });

  it("standard placed → awaiting_payment, contact on the player for adults", () => {
    const r = buildApplicationRow(adult, placement, squad, { centreName: "The Netz" });
    expect(r.application_type).toBe("standard");
    expect(r.status).toBe("awaiting_payment");
    expect(r.email).toBe("sam@e.com");
    expect(r.parent1_email).toBe("");
    expect(r.venue).toBe("The Netz");
    expect(r.age_group).toBe("14-16");
    expect(r.session_day).toBe("Saturday");
    expect(r.session_time).toBe("2:00pm–4:00pm");
    expect(r.payment_status).toBe("pending");
    expect(typeof r.age).toBe("number");
  });

  it("minor → contact routed to parent1, player email/phone blank", () => {
    const r = buildApplicationRow(minor, placement, squad, {});
    expect(r.email).toBe("");
    expect(r.phone).toBe("");
    expect(r.parent1_name).toBe("Pat Young");
    expect(r.parent1_email).toBe("pat@e.com");
    expect(r.parent1_phone).toBe("0411111111");
  });

  it("review path → capability + review status, no squad time", () => {
    const p = { ...placement, requiresReview: true, reviewReasons: ["below_pg_floor"] };
    const r = buildApplicationRow(minor, p, null, { kind: "capability" });
    expect(r.application_type).toBe("capability");
    expect(r.status).toBe("review");
    expect(r.capability_statement).toContain("below_pg_floor");
    expect(r.session_day).toBe("");
  });

  it("coming-soon venue → capability + venue_waitlist", () => {
    const r = buildApplicationRow(adult, placement, null, { kind: "capability", comingSoon: true });
    expect(r.status).toBe("venue_waitlist");
    expect(r.capability_statement).toBe("venue_tbc_waitlist");
  });

  it("tags a distinguishable preview source", () => {
    const r = buildApplicationRow(adult, placement, squad, {});
    expect(r.source).toContain("preview");
  });

  it("records a coach-readable bio summary", () => {
    const r = buildApplicationRow(adult, placement, squad, {});
    expect(r.bio).toContain("Skill: batting");
    expect(r.bio).toContain("Rep P16M");
  });
});
