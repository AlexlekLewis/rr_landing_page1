// ============================================================
// inventory.test.ts — booking integrity under concurrency.
// The headline guarantee: N buyers racing for the last spot → exactly capacity win.
// ============================================================
import { describe, it, expect } from "vitest";
import { InMemoryInventory } from "./inventory";
import { SQUADS, CENTRES, ACTIVE_CENTRES, squadsForPlacement, teamCapacity } from "./squads";

const oneSquad = [
  { id: "x", centre: "c", band: "14-16" as const, stream: "performance" as const, day: "Sat", startTime: "2pm", endTime: "4pm", capacity: 10, blockLabel: "Sat 2-4", sortOrder: 1 },
];

// ════════════════════════════════════════════════════════════════════════════
// OFFICIAL SCHEDULE SNAPSHOT — update ONLY this block when Alex confirms new
// days/times/venues in squads.ts (everything else below is derived maths).
// ════════════════════════════════════════════════════════════════════════════
const SNAPSHOT = {
  twoHourBlocks: 7,
  activeCentres: 2, // williamstown + hallam (venue-3/Mickleham TBC)
  comingSoonCentres: 1,
  weeklyCapacity: 143,
  perCentre: { williamstown: 90, hallam: 53 } as Record<string, number>,
};

describe("squad grid integrity (snapshot of the official schedule)", () => {
  it("matches the official schedule snapshot", () => {
    expect(SQUADS.length).toBe(SNAPSHOT.twoHourBlocks * 2); // 2 teams per block
    expect(ACTIVE_CENTRES.length).toBe(SNAPSHOT.activeCentres);
    expect(CENTRES.filter((c) => c.comingSoon).length).toBe(SNAPSHOT.comingSoonCentres);
    expect(SQUADS.reduce((s, q) => s + q.capacity, 0)).toBe(SNAPSHOT.weeklyCapacity);
    for (const [slug, cap] of Object.entries(SNAPSHOT.perCentre)) {
      expect(SQUADS.filter((s) => s.centre === slug).reduce((s, q) => s + q.capacity, 0), slug).toBe(cap);
    }
  });

  it("capacity is lane-driven: squad = round(lanes × 26/7), split perf-ceil / path-floor", () => {
    expect(teamCapacity(7, "performance")).toBe(13);
    expect(teamCapacity(7, "pathway")).toBe(13);
    expect(teamCapacity(5, "performance")).toBe(10); // squad 19 → 10 + 9 (sheet's mini cap 10)
    expect(teamCapacity(5, "pathway")).toBe(9);
    expect(teamCapacity(4, "performance")).toBe(8); // squad 15 → 8 + 7 (sheet's mini cap 8)
    expect(teamCapacity(4, "pathway")).toBe(7);
    expect(SQUADS.every((s) => s.capacity === teamCapacity(s.lanes, s.stream))).toBe(true);
    // coming-soon centres never have bookable squads
    for (const c of CENTRES.filter((x) => x.comingSoon)) {
      expect(SQUADS.filter((s) => s.centre === c.slug).length, c.slug).toBe(0);
      expect(squadsForPlacement({ centre: c.slug, band: "14-16", stream: "performance" }).length).toBe(0);
    }
  });

  it("two teams sharing a blockId make a full squad (26 at 7 lanes, 19 at 5, 15 at 4)", () => {
    const blocks = new Map<string, number>();
    for (const s of SQUADS) blocks.set(s.blockId, (blocks.get(s.blockId) ?? 0) + s.capacity);
    // every block has exactly two teams (performance + pathway)
    const counts = new Map<string, number>();
    for (const s of SQUADS) counts.set(s.blockId, (counts.get(s.blockId) ?? 0) + 1);
    expect([...counts.values()].every((c) => c === 2)).toBe(true);
    for (const s of SQUADS) {
      const expected = s.lanes === 7 ? 26 : s.lanes === 5 ? 19 : 15;
      expect(blocks.get(s.blockId), s.blockId).toBe(expected);
    }
  });

  it("every band has a 2-hour block at every ACTIVE centre (derived)", () => {
    for (const centre of ACTIVE_CENTRES.map((c) => c.slug)) {
      for (const band of ["12-14", "14-16", "17+"]) {
        for (const stream of ["performance", "pathway"]) {
          expect(squadsForPlacement({ centre, band, stream }).length, `${centre} ${band} ${stream}`).toBeGreaterThan(0);
        }
      }
    }
    // every block is exactly 2 hours and 12-14 never runs after 4pm starts
    expect(SQUADS.every((s) => s.blockLabel.includes("–"))).toBe(true);
  });

  it("maps a placement to the right squads", () => {
    const m = squadsForPlacement({ centre: "williamstown", band: "14-16", stream: "performance" });
    expect(m.length).toBe(2); // Fri 5:30-7:30 + Sat 4-6
    expect(m.every((s) => s.band === "14-16" && s.stream === "performance" && s.centre === "williamstown")).toBe(true);
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
