// ============================================================
// calibration.test.ts — prints how key competitions (esp. gendered pairs) land,
// so Alex can rule on the ladder's cross-gender scaling. NOT a pass/fail of the
// calibration itself — it pins the ladder anchors and surfaces the gender notes.
// ============================================================
import { describe, it, expect } from "vitest";
import { computeDna } from "./engine";
import { COMPETITION_TIERS, LADDER_BY_CODE } from "./ladder";
import { placeFromDna } from "./guardrail";

const L: Record<number, string> = { 5: "Elite", 4: "Performance", 3: "Development", 2: "Foundation", 1: "Entry" };

/** Pure level+age tier for a code at a representative age (no stats → neutral performance). */
function levelTier(code: string, age: number) {
  const dna = computeDna({
    profile: { dob: `${new Date().getFullYear() - age}-01-01` },
    history: [{ competitionCode: code, mostRecentSeason: "2025/26", isRepresentativeHonour: false }],
    stats: [],
    competitionTiers: COMPETITION_TIERS,
    currentSeasonStartYear: 2025,
  });
  return { dna, placement: placeFromDna(dna) };
}

describe("calibration report (review, not pass/fail)", () => {
  it("prints the gendered competition ladder as the engine places it", () => {
    const codes = [
      "P1M", "P2M", "P3M", "P4M", "P1F", "P2F", // premier senior M vs W
      "P16M", "P18M", "P18F", "P15F", // youth premier (Dowling vs Marg Jennings etc.)
      "REP-14MT", "REP-16M", "REP-17M", "REP-14F", "REP-17F", // VMCU shields M vs F
      "SD1", "SD-15", "CS-1T", "CW-1", // sub-district / community
    ];
    const lines = [
      "\n══════════ CALIBRATION — competition → tier/stream (at typical age) ══════════",
      "code      name                                  gen  cti   age  tier            stream",
    ];
    for (const code of codes) {
      const e = LADDER_BY_CODE[code];
      if (!e) continue;
      const age = Math.round(e.age ?? 14);
      const { dna, placement } = levelTier(code, age);
      lines.push(
        `${code.padEnd(9)} ${e.name.slice(0, 36).padEnd(37)} ${e.gender.padEnd(4)} ${String(e.cti).padEnd(5)} ${String(age).padStart(3)}  ${("T" + (dna.abilityTier ?? "-") + " " + L[dna.abilityTier ?? 0]).padEnd(15)} ${placement.stream}`,
      );
    }
    // eslint-disable-next-line no-console
    console.log(lines.join("\n"));

    // Surface Alex's two verbal anchors vs the ladder, as NOTES (not failures).
    const p1f = LADDER_BY_CODE["P1F"].cti, p3m = LADDER_BY_CODE["P3M"].cti, p2m = LADDER_BY_CODE["P2M"].cti;
    const mj = LADDER_BY_CODE["P15F"].cti, vmcuU14 = LADDER_BY_CODE["REP-14MT"].cti;
    // eslint-disable-next-line no-console
    console.log(
      `\nCALIBRATION NOTES (for Alex to rule on):\n` +
        `  • Anchor "Women's Prem 1st ≈ Men's Prem 3rd": ladder has P1F=${p1f} vs P3M=${p3m} (= P2M=${p2m}). Ladder rates her ~1 grade HIGHER than the anchor.\n` +
        `  • Anchor "Girls Marg Jennings ≈ Boys U14 VMCU": ladder has P15F=${mj} vs REP-14MT(U14 VMCU)=${vmcuU14}. Ladder rates Marg Jennings HIGHER.\n` +
        `  → If the anchors are canonical, lower P1F toward ~0.75 and P15F toward ~0.50 in ladder.ts / migration 032.`,
    );
    expect(true).toBe(true);
  });

  it("pins the ladder anchors that must never drift", () => {
    expect(LADDER_BY_CODE["P1M"].cti).toBe(1.0);
    expect(LADDER_BY_CODE["EN-NR"].cti).toBe(0.1);
  });
});
