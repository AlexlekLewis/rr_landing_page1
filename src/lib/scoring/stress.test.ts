// ============================================================
// stress.test.ts — large synthetic intake swept through engine + guardrail.
// Proves the structural guarantees hold for EVERY applicant: nobody is demoted,
// no minor is auto-mixed into the adult band, below-floor always routes to review,
// play-up is at most one age-adjacent band, and nothing crashes.
// ============================================================
import { describe, it, expect } from "vitest";
import { computeDna, type Format, type MatchStatsRow } from "./engine";
import { COMPETITION_TIERS, LADDER } from "./ladder";
import { placeFromDna, PG_BANDS, type Placement } from "./guardrail";

const AGES = [10, 12, 13, 14, 15, 16, 17, 18, 21, 30];
const FORMATS: Format[] = ["t20", "od"];
const GAMES = [3, 12];
const STATS = [
  { avg: 12, sr: 90, econ: 9.5 }, // weak
  { avg: 48, sr: 165, econ: 4.0 }, // strong
];
const SKILLS: ("batting" | "bowling")[] = ["batting", "bowling"];

const bandIdx = (name: string) => PG_BANDS.findIndex((b) => b.name === name);
const ADULT_BAND = PG_BANDS.find((b) => b.adult)!.name; // "17+"

function dobForAge(age: number): string {
  // engine ages off today's clock; Jan-1 birthday is always already passed → exact age.
  const year = new Date().getFullYear() - age;
  return `${year}-01-01`;
}

function statsRow(code: string, format: Format, games: number, skill: string, s: typeof STATS[number]): MatchStatsRow {
  const isBat = skill === "batting";
  return {
    season: "2025/26",
    format,
    competitionCode: code,
    batMatches: isBat ? games : null,
    batInnings: isBat ? games : null,
    batAverage: isBat ? s.avg : null,
    batStrikeRate: isBat ? s.sr : null,
    bowlMatches: !isBat ? games : null,
    bowlAverage: !isBat ? s.avg : null,
    bowlEconomy: !isBat ? s.econ : null,
  };
}

describe("stress: structural invariants across a large synthetic intake", () => {
  const violations: string[] = [];
  const dist = { performance: 0, pathway: 0, review: 0 };
  const flags = { play_up: 0, play_up_review: 0, none: 0 };
  let count = 0;

  for (const entry of LADDER) {
    for (const age of AGES) {
      for (const format of FORMATS) {
        for (const games of GAMES) {
          for (const s of STATS) {
            for (const skill of SKILLS) {
              count++;
              let p: Placement;
              let dna;
              try {
                dna = computeDna({
                  profile: { dob: dobForAge(age), battingPositionBand: skill === "batting" ? "1-3" : null, bowlingRole: skill === "bowling" ? "new_ball" : null },
                  history: [{ competitionCode: entry.code, mostRecentSeason: "2025/26", isRepresentativeHonour: false }],
                  stats: [statsRow(entry.code, format, games, skill, s)],
                  competitionTiers: COMPETITION_TIERS,
                  currentSeasonStartYear: 2025,
                });
                p = placeFromDna(dna);
              } catch (e) {
                violations.push(`CRASH ${entry.code} age${age} ${format} g${games} ${skill}: ${(e as Error).message}`);
                continue;
              }
              const tag = `[${entry.code} age${age} ${format} g${games} ${skill} tier${dna.abilityTier}]`;

              dist[p.stream]++;
              flags[p.playFlag ?? "none"]++;

              // I1 — never demoted below home band
              if (bandIdx(p.placedBand) < bandIdx(p.homeBand)) violations.push(`${tag} demoted ${p.homeBand}->${p.placedBand}`);
              // I2 — play_up is exactly one band up and age-adjacent
              if (p.playFlag === "play_up") {
                if (bandIdx(p.placedBand) - bandIdx(p.homeBand) !== 1) violations.push(`${tag} play_up skipped >1 band`);
                const home = PG_BANDS[bandIdx(p.homeBand)];
                if (p.age! < home.hi - 1) violations.push(`${tag} play_up but not age-adjacent (age ${p.age}, band hi ${home.hi})`);
              }
              // I3 — play_up_review never auto-moves and always routes to review
              if (p.playFlag === "play_up_review") {
                if (p.placedBand !== p.homeBand) violations.push(`${tag} play_up_review moved band`);
                if (!p.requiresReview) violations.push(`${tag} play_up_review not flagged for review`);
              }
              // I4 — SAFEGUARDING: an UNDER-16 is never placed in the open/adult band.
              // (16yo performance players MAY train up with adults — Premier 3rd / Sub-District / State.)
              if (p.age! < 16 && p.placedBand === ADULT_BAND) violations.push(`${tag} under-16 placed in adult band`);
              // I5 — ineligible (below_floor / no_history) always requires review
              if (dna.eligibilityStatus !== "eligible" && !p.requiresReview) violations.push(`${tag} ineligible not review`);
              // I6 — review stream always requires review
              if (p.stream === "review" && !p.requiresReview) violations.push(`${tag} review stream not flagged`);
              // I7 — tier null/1 maps to the review stream
              if ((dna.abilityTier == null || dna.abilityTier === 1) && p.stream !== "review") violations.push(`${tag} tier<=1 not review stream`);
            }
          }
        }
      }
    }
  }

  it("places every synthetic applicant with zero invariant violations", () => {
    // eslint-disable-next-line no-console
    console.log(`\nSTRESS: ${count} applicants · streams ${JSON.stringify(dist)} · flags ${JSON.stringify(flags)} · violations ${violations.length}`);
    expect(violations.slice(0, 20)).toEqual([]);
    expect(violations.length).toBe(0);
  });

  it("is deterministic (same input → same output)", () => {
    const mk = () =>
      placeFromDna(
        computeDna({
          profile: { dob: dobForAge(14), battingPositionBand: "1-3" },
          history: [{ competitionCode: "P16M", mostRecentSeason: "2025/26", isRepresentativeHonour: false }],
          stats: [statsRow("P16M", "t20", 12, "batting", STATS[1])],
          competitionTiers: COMPETITION_TIERS,
          currentSeasonStartYear: 2025,
        }),
      );
    expect(JSON.stringify(mk())).toBe(JSON.stringify(mk()));
  });
});

describe("stress: malformed / edge inputs never crash", () => {
  const cases: [string, () => Placement][] = [
    ["null dob", () => placeFromDna(computeDna({ profile: { dob: null }, history: [], stats: [], competitionTiers: COMPETITION_TIERS }))],
    ["unknown comp code", () => placeFromDna(computeDna({ profile: { dob: "2010-01-01" }, history: [{ competitionCode: "ZZZ-NOPE", mostRecentSeason: "2025/26" }], stats: [], competitionTiers: COMPETITION_TIERS }))],
    ["no history, no stats", () => placeFromDna(computeDna({ profile: { dob: "2010-01-01" }, history: [], stats: [], competitionTiers: COMPETITION_TIERS }))],
    ["stats but no code", () => placeFromDna(computeDna({ profile: { dob: "2010-01-01" }, history: [], stats: [{ season: "2025/26", format: "t20", competitionCode: null, batMatches: 5, batAverage: 30 }], competitionTiers: COMPETITION_TIERS }))],
  ];
  for (const [name, fn] of cases) {
    it(`handles ${name}`, () => {
      const p = fn();
      expect(p).toBeTruthy();
      expect(typeof p.requiresReview).toBe("boolean");
    });
  }
});
