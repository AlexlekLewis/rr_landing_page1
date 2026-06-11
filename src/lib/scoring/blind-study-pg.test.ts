// ============================================================
// blind-study-pg.test.ts — Power Game placement blind study.
// ~18 realistic Victorian profiles with expected (stream / placed band / review /
// lane) reasoned from cricketing judgement BEFORE running. Asserts the engine +
// re-banded guardrail place each correctly. Prints a table for Alex to eyeball.
// Per blind-study rules: a mismatch is investigated, never silently "fixed".
// ============================================================
import { describe, it, expect } from "vitest";
import { computeDna, type Format } from "./engine";
import { COMPETITION_TIERS } from "./ladder";
import { placeFromDna } from "./guardrail";

interface Profile {
  id: string; who: string; age: number; gender: "M" | "F"; code: string; games: number; format: Format;
  batAvg?: number; batSR?: number; bowlAvg?: number; bowlEcon?: number;
  expect: { stream: string; placedBand: string; review: boolean; lane?: string; playFlag?: string | null };
}

function run(p: Profile) {
  const dob = `${new Date().getFullYear() - p.age}-01-01`;
  const dna = computeDna({
    profile: { dob, battingPositionBand: p.batAvg != null ? "1-3" : null, bowlingRole: p.bowlAvg != null ? "new_ball" : null },
    history: [{ competitionCode: p.code, mostRecentSeason: "2025/26", isRepresentativeHonour: false }],
    stats: [{
      season: "2025/26", format: p.format, competitionCode: p.code,
      batMatches: p.batAvg != null ? p.games : null, batInnings: p.batAvg != null ? p.games : null,
      batAverage: p.batAvg ?? null, batStrikeRate: p.batSR ?? null,
      bowlMatches: p.bowlAvg != null ? p.games : null, bowlAverage: p.bowlAvg ?? null, bowlEconomy: p.bowlEcon ?? null,
    }],
    competitionTiers: COMPETITION_TIERS, currentSeasonStartYear: 2025,
  });
  return { dna, placement: placeFromDna(dna) };
}

const CASES: Profile[] = [
  { id: "A", who: "24yo M Premier 1st XI", age: 24, gender: "M", code: "P1M", games: 12, format: "t20", batAvg: 42, batSR: 145, expect: { stream: "performance", placedBand: "17+", review: false, lane: "Batting" } },
  { id: "B", who: "14yo M Dowling Shield gun", age: 14, gender: "M", code: "P16M", games: 10, format: "t20", batAvg: 38, batSR: 150, expect: { stream: "performance", placedBand: "14-16", review: false, playFlag: "play_up" } },
  { id: "C", who: "18yo M weak at Premier U18", age: 18, gender: "M", code: "P18M", games: 12, format: "t20", batAvg: 18, batSR: 95, expect: { stream: "pathway", placedBand: "17+", review: false } },
  { id: "D", who: "21yo M below-floor country synthetic", age: 21, gender: "M", code: "RY-2S", games: 14, format: "t20", batAvg: 30, batSR: 110, expect: { stream: "review", placedBand: "17+", review: true } },
  { id: "E", who: "12yo M club only", age: 12, gender: "M", code: "CJ-12B", games: 8, format: "od", batAvg: 25, batSR: 95, expect: { stream: "review", placedBand: "12-14", review: true } },
  { id: "F", who: "17yo F Women's Premier 1st (bowler)", age: 17, gender: "F", code: "P1F", games: 11, format: "od", bowlAvg: 16, bowlEcon: 4.0, expect: { stream: "performance", placedBand: "17+", review: false, lane: "Bowling" } },
  { id: "G", who: "15yo M VMCU Keith Mackay", age: 15, gender: "M", code: "REP-16M", games: 10, format: "t20", batAvg: 30, batSR: 120, expect: { stream: "pathway", placedBand: "14-16", review: false } },
  { id: "H", who: "16yo M gun in OPEN sub-district", age: 16, gender: "M", code: "SD1", games: 12, format: "t20", batAvg: 35, batSR: 130, expect: { stream: "performance", placedBand: "17+", review: false, playFlag: "play_up" } },
  { id: "I", who: "13yo M Russell Allen U14 VMCU", age: 13, gender: "M", code: "REP-14MT", games: 10, format: "t20", batAvg: 30, batSR: 110, expect: { stream: "pathway", placedBand: "12-14", review: false } },
  { id: "J", who: "20yo M huge avg at LOW level", age: 20, gender: "M", code: "CS-3S", games: 12, format: "t20", batAvg: 55, batSR: 140, expect: { stream: "review", placedBand: "17+", review: true } },
  { id: "K", who: "17yo M gun bowler / rabbit batter", age: 17, gender: "M", code: "P3M", games: 12, format: "t20", bowlAvg: 16, bowlEcon: 6.5, batAvg: 8, batSR: 70, expect: { stream: "performance", placedBand: "17+", review: false, lane: "Bowling" } },
  { id: "L", who: "14yo F Marg Jennings Cup", age: 14, gender: "F", code: "P15F", games: 10, format: "od", batAvg: 30, batSR: 95, expect: { stream: "pathway", placedBand: "12-14", review: false } },
  { id: "M", who: "30yo M Premier 2nd (adult outlier)", age: 30, gender: "M", code: "P2M", games: 12, format: "t20", batAvg: 30, batSR: 120, expect: { stream: "pathway", placedBand: "17+", review: true } },
  { id: "N", who: "13yo M Dowling exceptional", age: 13, gender: "M", code: "P16M", games: 10, format: "t20", batAvg: 40, batSR: 150, expect: { stream: "performance", placedBand: "14-16", review: false, playFlag: "play_up" } },
  { id: "O", who: "11yo M Des Nolan U13 rep", age: 11, gender: "M", code: "REP-13M", games: 8, format: "od", batAvg: 25, batSR: 90, expect: { stream: "review", placedBand: "12-14", review: true } },
  { id: "P", who: "16yo F Premier U18 female", age: 16, gender: "F", code: "P18F", games: 10, format: "od", batAvg: 30, batSR: 100, expect: { stream: "pathway", placedBand: "14-16", review: false } },
  { id: "Q", who: "25yo M VSDCA 1st XI", age: 25, gender: "M", code: "SD1", games: 12, format: "t20", batAvg: 40, batSR: 120, expect: { stream: "pathway", placedBand: "17+", review: false } },
  { id: "R", who: "17yo M Premier 3rd, only 3 games", age: 17, gender: "M", code: "P3M", games: 3, format: "t20", batAvg: 45, batSR: 150, expect: { stream: "performance", placedBand: "17+", review: true } },
];

describe("Power Game blind study — competitive + age-appropriate placement", () => {
  const R = new Map(CASES.map((c) => [c.id, run(c)]));

  it("prints the placement table", () => {
    const L: Record<number, string> = { 5: "Elite", 4: "Perf", 3: "Dev", 2: "Found", 1: "Entry" };
    const lines = ["\n════════ POWER GAME PLACEMENT BLIND STUDY ════════",
      "id  profile                                   tier      stream       band    lane     review  flag"];
    for (const c of CASES) {
      const { dna, placement } = R.get(c.id)!;
      lines.push(`${c.id}   ${c.who.padEnd(40)} T${dna.abilityTier ?? "-"} ${(L[dna.abilityTier ?? 0] ?? "").padEnd(6)} ${placement.stream.padEnd(12)} ${placement.placedBand.padEnd(7)} ${(placement.lane ?? "-").padEnd(8)} ${String(placement.requiresReview).padEnd(6)} ${placement.playFlag ?? ""}`);
    }
    // eslint-disable-next-line no-console
    console.log(lines.join("\n"));
    expect(R.size).toBe(18);
  });

  for (const c of CASES) {
    it(`${c.id}: ${c.who}`, () => {
      const { placement } = R.get(c.id)!;
      expect(placement.stream, "stream").toBe(c.expect.stream);
      expect(placement.placedBand, "placedBand").toBe(c.expect.placedBand);
      expect(placement.requiresReview, "requiresReview").toBe(c.expect.review);
      if (c.expect.lane) expect(placement.lane, "lane").toBe(c.expect.lane);
      if (c.expect.playFlag !== undefined) expect(placement.playFlag, "playFlag").toBe(c.expect.playFlag);
    });
  }
});
