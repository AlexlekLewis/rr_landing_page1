import { describe, it, expect } from "vitest";
import { InMemoryApplications, confirmPowerGameBooking } from "./applications";
import { InMemoryInventory } from "./inventory";

const oneSquad = [
  { id: "x", centre: "c", band: "14-16" as const, stream: "performance" as const, day: "Sat", startTime: "2pm", endTime: "4pm", capacity: 10, blockLabel: "Sat 2-4", sortOrder: 1 },
];

const sampleApp = {
  playerName: "Sam", dob: "2012-01-01", gender: "M", contactEmail: "s@e.com", contactPhone: "04", suburb: "X", centre: "williamstown",
  abilityTier: 4, stream: "performance", homeBand: "12-14", placedBand: "14-16", playFlag: "play_up", lane: "Batting",
  overallScore: 93, eligibility: "eligible", requiresReview: false, reviewReasons: [], engineVersion: "induction-1.0", status: "auto" as const, answers: {},
};

describe("applications store", () => {
  it("creates, lists, and filters the review queue", () => {
    const a = new InMemoryApplications();
    a.create({ ...sampleApp });
    a.create({ ...sampleApp, status: "review", requiresReview: true, reviewReasons: ["below_floor"] });
    expect(a.list().length).toBe(2);
    expect(a.reviewQueue().length).toBe(1);
    expect(a.booked().length).toBe(0);
  });
});

describe("confirmPowerGameBooking", () => {
  it("confirms the held booking and marks the application booked", async () => {
    const inv = new InMemoryInventory(oneSquad);
    const apps = new InMemoryApplications();
    const app = apps.create({ ...sampleApp });
    const now = 1_000_000;
    const hold = await inv.createHold({ squadId: "x", ref: app.id, now });
    expect(hold.ok).toBe(true);

    const out = await confirmPowerGameBooking(
      { metadata: { source: "power-game", application_id: app.id, booking_id: hold.holdId!, squad_id: "x" }, payment_intent: "pi_123" },
      { inventory: inv, applications: apps },
    );
    expect(out.ok).toBe(true);
    // Spot survives the hold-expiry window because it's now confirmed.
    expect(inv.spotsLeft("x", now + 10_000_000)).toBe(9);
    expect(apps.get(app.id)!.status).toBe("booked");
    expect(apps.get(app.id)!.paymentRef).toBe("pi_123");
  });

  it("ignores non-power-game sessions", async () => {
    const inv = new InMemoryInventory(oneSquad);
    const apps = new InMemoryApplications();
    const out = await confirmPowerGameBooking({ metadata: { source: "shop" } }, { inventory: inv, applications: apps });
    expect(out.ok).toBe(false);
    expect(out.reason).toBe("not_power_game");
  });
});
