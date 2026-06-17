// ============================================================
// inventory.test.ts — booking integrity under concurrency.
// The headline guarantee: N buyers racing for the last spot → exactly capacity win.
// ============================================================
import { describe, it, expect } from "vitest";
import { InMemoryInventory } from "./inventory";
import { SQUADS, CENTRES, ACTIVE_CENTRES, squadsForPlacement, teamCapacity, squadCapacity } from "./squads";

const oneSquad = [
  { id: "x", centre: "c", band: "14-16" as const, stream: "performance" as const, day: "Sat", startTime: "2pm", endTime: "4pm", capacity: 10, blockLabel: "Sat 2-4", sortOrder: 1 },
];

// ════════════════════════════════════════════════════════════════════════════
// OFFICIAL SCHEDULE SNAPSHOT — update ONLY this block when Alex confirms new
// days/times/venues in squads.ts (everything else below is derived maths).
// ════════════════════════════════════════════════════════════════════════════
const SNAPSHOT = {
  twoHourBlocks: 11, // Netz 4 + Hallam 3 + Mickleham 4
  combinedBlocks: 1, // Hallam Sat 4–6pm 12-14 = ONE combined squad (no perf/pathway split)
  activeCentres: 3, // williamstown + hallam + mickleham
  comingSoonCentres: 0,
  // Total squad places for the 8-WEEK BLOCK (lane ratio 7:26). Not a per-week number —
  // each place is one player enrolled for the whole block.
  blockCapacity: 243, // Netz 90 + Hallam 49 + Mickleham 104
  perCentre: { williamstown: 90, hallam: 49, mickleham: 104 } as Record<string, number>,
};

describe("squad grid integrity (snapshot of the official schedule)", () => {
  it("matches the official schedule snapshot", () => {
    expect(SQUADS.length).toBe(SNAPSHOT.twoHourBlocks * 2 - SNAPSHOT.combinedBlocks); // 2 teams/block, less combined squads (1 team)
    expect(ACTIVE_CENTRES.length).toBe(SNAPSHOT.activeCentres);
    expect(CENTRES.filter((c) => c.comingSoon).length).toBe(SNAPSHOT.comingSoonCentres);
    expect(SQUADS.reduce((s, q) => s + q.capacity, 0)).toBe(SNAPSHOT.blockCapacity);
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
    expect(SQUADS.every((s) => (s.combined ? s.capacity === squadCapacity(s.lanes) : s.capacity === teamCapacity(s.lanes, s.stream)))).toBe(true);
    // coming-soon centres never have bookable squads
    for (const c of CENTRES.filter((x) => x.comingSoon)) {
      expect(SQUADS.filter((s) => s.centre === c.slug).length, c.slug).toBe(0);
      expect(squadsForPlacement({ centre: c.slug, band: "14-16", stream: "performance" }).length).toBe(0);
    }
  });

  it("each block fills a full squad (26 at 7 lanes, 19 at 5, 15 at 4); split = 2 teams, combined = 1", () => {
    const blocks = new Map<string, number>();
    for (const s of SQUADS) blocks.set(s.blockId, (blocks.get(s.blockId) ?? 0) + s.capacity);
    // a split block has exactly two teams (performance + pathway); a combined block has one
    const counts = new Map<string, number>();
    const combinedBlockIds = new Set<string>();
    for (const s of SQUADS) {
      counts.set(s.blockId, (counts.get(s.blockId) ?? 0) + 1);
      if (s.combined) combinedBlockIds.add(s.blockId);
    }
    expect([...counts.entries()].every(([id, c]) => (combinedBlockIds.has(id) ? c === 1 : c === 2))).toBe(true);
    expect(combinedBlockIds.size).toBe(SNAPSHOT.combinedBlocks);
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
    // every block label is a 2-hour range (contains an en dash)
    expect(SQUADS.every((s) => s.blockLabel.includes("–"))).toBe(true);
  });

  it("maps a placement to the right squads", () => {
    const m = squadsForPlacement({ centre: "williamstown", band: "14-16", stream: "performance" });
    expect(m.length).toBe(2); // Fri 5:30-7:30 + Sat 4-6
    expect(m.every((s) => s.band === "14-16" && s.stream === "performance" && s.centre === "williamstown")).toBe(true);
  });

  it("Hallam Sat 4–6pm 12-14 is ONE combined squad (15 places), not a perf/pathway split", () => {
    const hallam1214 = SQUADS.filter((s) => s.centre === "hallam" && s.band === "12-14");
    expect(hallam1214).toHaveLength(1); // one squad, not two teams
    const squad = hallam1214[0];
    expect(squad.combined).toBe(true);
    expect(squad.capacity).toBe(squadCapacity(4)); // 15 — the full squad, NOT 8 + 7
    expect(squad.startTime).toBe("4:00pm");
    expect(squad.endTime).toBe("6:00pm");
    // both computed streams route into the SAME single squad
    const asPerf = squadsForPlacement({ centre: "hallam", band: "12-14", stream: "performance" });
    const asPath = squadsForPlacement({ centre: "hallam", band: "12-14", stream: "pathway" });
    expect(asPerf).toHaveLength(1);
    expect(asPath).toHaveLength(1);
    expect(asPerf[0].id).toBe(asPath[0].id);
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
