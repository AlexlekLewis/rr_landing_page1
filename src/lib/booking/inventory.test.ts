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

describe("squad grid integrity", () => {
  it("capacity is lane-driven: 26 players / 7 lanes; team = 13 at 7 lanes, 9 at 5", () => {
    expect(SQUADS.length).toBe(12);
    expect(CENTRES.length).toBe(3); // 2 active + 1 coming-soon
    expect(ACTIVE_CENTRES.length).toBe(2);
    expect(CENTRES.filter((c) => c.comingSoon).length).toBe(1);
    expect(squadsForPlacement({ centre: "venue-3", band: "14-16", stream: "performance" }).length).toBe(0);
    expect(teamCapacity(7)).toBe(13);
    expect(teamCapacity(5)).toBe(9);
    expect(SQUADS.every((s) => s.capacity === teamCapacity(s.lanes))).toBe(true);
    expect(SQUADS.filter((s) => s.lanes === 7).every((s) => s.capacity === 13)).toBe(true);
    expect(SQUADS.filter((s) => s.lanes === 5).every((s) => s.capacity === 9)).toBe(true);
    const total = SQUADS.reduce((s, q) => s + q.capacity, 0);
    expect(total).toBe(124); // W 70 + H 54
    expect(SQUADS.filter((s) => s.centre === "williamstown").reduce((s, q) => s + q.capacity, 0)).toBe(70);
    expect(SQUADS.filter((s) => s.centre === "hallam").reduce((s, q) => s + q.capacity, 0)).toBe(54);
  });

  it("two teams sharing a blockId make a 26-player squad at 7 lanes", () => {
    const blocks = new Map<string, number>();
    for (const s of SQUADS) blocks.set(s.blockId, (blocks.get(s.blockId) ?? 0) + s.capacity);
    // every block has exactly two teams
    const counts = new Map<string, number>();
    for (const s of SQUADS) counts.set(s.blockId, (counts.get(s.blockId) ?? 0) + 1);
    expect([...counts.values()].every((c) => c === 2)).toBe(true);
    // a 7-lane block totals 26 (two teams of 13)
    const sevenLaneBlock = SQUADS.find((s) => s.lanes === 7)!.blockId;
    expect(blocks.get(sevenLaneBlock)).toBe(26);
  });

  it("maps a placement to the right squads", () => {
    const m = squadsForPlacement({ centre: "williamstown", band: "14-16", stream: "performance" });
    expect(m.length).toBe(2); // Fri 8-10 + Sat 4-6
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
