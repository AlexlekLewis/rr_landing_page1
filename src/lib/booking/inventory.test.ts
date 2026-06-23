// ============================================================
// inventory.test.ts — booking integrity under concurrency.
// The headline guarantee: N buyers racing for the last spot → exactly capacity win.
// ============================================================
import { describe, it, expect } from "vitest";
import { InMemoryInventory } from "./inventory";
import { SQUADS, CENTRES, ACTIVE_CENTRES, squadsForPlacement, squadCapacity } from "./squads";

const oneSquad = [
  { id: "x", centre: "c", band: "14-16" as const, day: "Sat", startTime: "2pm", endTime: "4pm", capacity: 10, blockLabel: "Sat 2-4", sortOrder: 1 },
];

// ════════════════════════════════════════════════════════════════════════════
// OFFICIAL SCHEDULE SNAPSHOT — update ONLY this block when Alex confirms new
// days/times/venues in squads.ts (everything else below is derived maths).
// ════════════════════════════════════════════════════════════════════════════
const SNAPSHOT = {
  totalSquads: 11, // 11 open sessions: Williamstown 4 + Hallam 3 + Mickleham 4
  activeCentres: 3, // williamstown + hallam + mickleham
  comingSoonCentres: 0,
  // Total places for the 8-WEEK BLOCK (26:7 ratio). Each squad = round(lanes × 26/7).
  blockCapacity: 261, // Williamstown 104 + Hallam 53 + Mickleham 104
  perCentre: { williamstown: 104, hallam: 53, mickleham: 104 } as Record<string, number>,
};

describe("squad grid integrity (snapshot of the official schedule)", () => {
  it("matches the official schedule snapshot", () => {
    expect(SQUADS.length).toBe(SNAPSHOT.totalSquads);
    expect(ACTIVE_CENTRES.length).toBe(SNAPSHOT.activeCentres);
    expect(CENTRES.filter((c) => c.comingSoon).length).toBe(SNAPSHOT.comingSoonCentres);
    expect(SQUADS.reduce((s, q) => s + q.capacity, 0)).toBe(SNAPSHOT.blockCapacity);
    for (const [slug, cap] of Object.entries(SNAPSHOT.perCentre)) {
      expect(SQUADS.filter((s) => s.centre === slug).reduce((s, q) => s + q.capacity, 0), slug).toBe(cap);
    }
  });

  it("capacity is lane-driven: squad = round(lanes × 26/7)", () => {
    expect(squadCapacity(7)).toBe(26);
    expect(squadCapacity(5)).toBe(19);
    expect(squadCapacity(4)).toBe(15);
    expect(squadCapacity(3)).toBe(11);
    expect(squadCapacity(2)).toBe(7);
    expect(SQUADS.every((s) => s.capacity === squadCapacity(s.lanes))).toBe(true);
    for (const c of CENTRES.filter((x) => x.comingSoon)) {
      expect(SQUADS.filter((s) => s.centre === c.slug).length, c.slug).toBe(0);
      expect(squadsForPlacement({ centre: c.slug, band: "14-16" }).length).toBe(0);
    }
  });

  it("each slot is exactly one open session (no age-band split)", () => {
    const bySlot = new Map<string, number>();
    for (const s of SQUADS) bySlot.set(s.blockId, (bySlot.get(s.blockId) ?? 0) + 1);
    for (const [slot, n] of bySlot) expect(n, slot).toBe(1);
    expect(bySlot.size).toBe(SQUADS.length); // every session is its own slot
  });

  it("every active centre offers open sessions with day options", () => {
    for (const centre of ACTIVE_CENTRES.map((c) => c.slug)) {
      expect(squadsForPlacement({ centre }).length, centre).toBeGreaterThan(0);
    }
    expect(SQUADS.every((s) => s.blockLabel.includes("–"))).toBe(true);
  });

  it("squadsForPlacement returns all of a centre's open sessions; Williamstown spans Fri + Sat", () => {
    const m = squadsForPlacement({ centre: "williamstown" });
    expect(m.every((s) => s.centre === "williamstown")).toBe(true);
    expect(m.length).toBe(4);
    expect(new Set(m.map((s) => s.day)).size).toBe(2); // Friday + Saturday
  });

  it("Hallam runs Thursday + Saturday open sessions", () => {
    const hallam = squadsForPlacement({ centre: "hallam" });
    expect(hallam.length).toBe(3);
    expect(new Set(hallam.map((s) => s.day))).toEqual(new Set(["Thursday", "Saturday"]));
  });

  it("the purchased Sat 2–4pm sessions exist at The Netz & Mickleham", () => {
    for (const centre of ["williamstown", "mickleham"]) {
      const sat24 = SQUADS.find((s) => s.centre === centre && s.day === "Saturday" && s.startTime === "2:00pm");
      expect(sat24, centre).toBeTruthy();
    }
    expect(SQUADS.some((s) => s.id === "w-sat2")).toBe(true);
    expect(SQUADS.some((s) => s.id === "m-sat2")).toBe(true);
  });
});

describe("atomic holds — no oversell under concurrency", () => {
  it("50 racing buyers for a 10-spot squad → exactly 10 win, 40 get 'full'", async () => {
    const inv = new InMemoryInventory(oneSquad);
    const now = 1_000_000;
    const results = await Promise.all(
      Array.from({ length: 50 }, (_, i) => inv.createHold({ squadId: "x", ref: `app${i}`, now })),
    );
    const won = results.filter((r) => r.ok).length;
    const full = results.filter((r) => !r.ok && r.reason === "full").length;
    expect(won).toBe(10);
    expect(full).toBe(40);
    expect(inv.spotsLeft("x", now)).toBe(0);
    expect(inv.activeCount("x", now)).toBe(10);
  });

  it("never oversells even across many repeated races", async () => {
    for (let trial = 0; trial < 5; trial++) {
      const inv = new InMemoryInventory(oneSquad);
      const now = 2_000_000 + trial;
      await Promise.all(Array.from({ length: 30 }, (_, i) => inv.createHold({ squadId: "x", ref: `t${trial}-${i}`, now })));
      expect(inv.activeCount("x", now)).toBeLessThanOrEqual(10);
      expect(inv.spotsLeft("x", now)).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("hold lifecycle", () => {
  it("expired holds free the spot back up", async () => {
    const inv = new InMemoryInventory(oneSquad);
    const t0 = 1_000_000;
    for (let i = 0; i < 10; i++) await inv.createHold({ squadId: "x", ref: `a${i}`, ttlMs: 1000, now: t0 });
    expect(inv.spotsLeft("x", t0)).toBe(0);
    // a new buyer at t0 is locked out...
    expect((await inv.createHold({ squadId: "x", ref: "late", now: t0 })).ok).toBe(false);
    // ...but after the holds expire, capacity returns
    const later = t0 + 2000;
    expect(inv.spotsLeft("x", later)).toBe(10);
    const swept = await inv.sweepExpired(later);
    expect(swept).toBe(10); // only the 10 inserted holds; the locked-out buyer was never inserted
  });

  it("confirmed holds keep the spot; released holds free it", async () => {
    const inv = new InMemoryInventory(oneSquad);
    const now = 5_000_000;
    const h = await inv.createHold({ squadId: "x", ref: "buyer", ttlMs: 1000, now });
    expect(h.ok).toBe(true);
    await inv.confirm(h.holdId!);
    // confirmed survives expiry window
    expect(inv.spotsLeft("x", now + 999_999)).toBe(9);
    expect(inv.confirmedCount("x")).toBe(1);
    // release frees it
    await inv.release(h.holdId!);
    expect(inv.spotsLeft("x", now)).toBe(10);
  });
});
