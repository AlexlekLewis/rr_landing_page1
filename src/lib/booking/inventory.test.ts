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
  totalSquads: 22, // Williamstown 8 + Hallam 6 + Mickleham 8 (each squad = one age group on its lanes)
  activeCentres: 3, // williamstown + hallam + mickleham
  comingSoonCentres: 0,
  // Total places for the 8-WEEK BLOCK (26:7 ratio). Each squad = round(lanes × 26/7).
  blockCapacity: 258, // Williamstown 104 + Hallam 50 + Mickleham 104
  perCentre: { williamstown: 104, hallam: 50, mickleham: 104 } as Record<string, number>,
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

  it("each slot holds up to TWO squads, always of DIFFERENT age bands", () => {
    const bySlot = new Map<string, string[]>();
    for (const s of SQUADS) {
      const arr = bySlot.get(s.blockId) ?? [];
      arr.push(s.band);
      bySlot.set(s.blockId, arr);
    }
    for (const [slot, bands] of bySlot) {
      expect(bands.length, slot).toBeLessThanOrEqual(2);
      expect(new Set(bands).size, slot).toBe(bands.length); // no slot pairs two of the same age
    }
  });

  it("every age band is offered at every active centre, with day options", () => {
    for (const centre of ACTIVE_CENTRES.map((c) => c.slug)) {
      for (const band of ["12-14", "14-16", "17+"]) {
        expect(squadsForPlacement({ centre, band }).length, `${centre} ${band}`).toBeGreaterThan(0);
      }
    }
    expect(SQUADS.every((s) => s.blockLabel.includes("–"))).toBe(true);
  });

  it("squadsForPlacement returns a band's day options; 14-16 at Williamstown spans 2 days", () => {
    const m = squadsForPlacement({ centre: "williamstown", band: "14-16" });
    expect(m.every((s) => s.band === "14-16" && s.centre === "williamstown")).toBe(true);
    expect(new Set(m.map((s) => s.day)).size).toBe(2); // Friday + Saturday
  });

  it("Hallam 12-14 is Saturday-only (locked constraint); other Hallam bands get 2 days", () => {
    const distinctDays = (centre: string, band: string) =>
      new Set(squadsForPlacement({ centre, band }).map((s) => s.day)).size;
    expect(distinctDays("hallam", "12-14")).toBe(1); // Saturday only — Thu 8–10pm is too late for juniors
    expect(distinctDays("hallam", "14-16")).toBe(2); // Thu + Sat
    expect(distinctDays("hallam", "17+")).toBe(2); // Thu + Sat
  });

  it("honors the 3 existing purchases: a 12-14 Sat 2–4pm squad exists at The Netz & Mickleham", () => {
    for (const centre of ["williamstown", "mickleham"]) {
      const sat24 = SQUADS.find(
        (s) => s.centre === centre && s.band === "12-14" && s.day === "Saturday" && s.startTime === "2:00pm",
      );
      expect(sat24, centre).toBeTruthy();
    }
    expect(SQUADS.some((s) => s.id === "w-sat2-1214")).toBe(true);
    expect(SQUADS.some((s) => s.id === "m-sat2-1214")).toBe(true);
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
