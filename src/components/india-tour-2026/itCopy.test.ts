// ============================================================
// itCopy.test.ts — guards on the /tours copy, in both reading levels.
//
// 1. The two upcoming tours and the estimated price are what Alex set on
//    29 Sep 2026, and the tour ids (stored in applications.tour_interest)
//    don't drift.
// 2. The September 2026 camp's prices never come back as the new tours' price.
// 3. None of the banned sales phrases from the copy rules, and "player", not "child".
// ============================================================
import { describe, it, expect } from "vitest";
import {
  COPY,
  TOURS,
  TOUR_LENGTH_DAYS,
  PRICE_ESTIMATE_AUD,
  INCLUSIONS_CONFIRMED,
  fmtRangeAUD,
  ROUND_1,
  DECEMBER_TOUR_ID,
  MEMBER_PROGRAMS,
  PROGRAM_OPTIONS,
} from "./itCopy";

/** Every string in a copy variant (functions are called with a sample range). */
const allStrings = (node: unknown, out: string[] = []): string[] => {
  if (typeof node === "string") out.push(node);
  else if (typeof node === "function") out.push(String((node as (r: unknown) => unknown)({ min: 1, max: 2 })));
  else if (Array.isArray(node)) node.forEach((n) => allStrings(n, out));
  else if (node && typeof node === "object") Object.values(node).forEach((n) => allStrings(n, out));
  return out;
};

describe("the tours and the estimate", () => {
  it("names the two tours by window, with stable ids", () => {
    expect(TOURS).toEqual([
      { id: "2026-12-late-dec-jan", window: "Late December 2026 to early January 2027" },
      { id: "2027-04-april", window: "April 2027" },
    ]);
    expect(TOUR_LENGTH_DAYS).toBe(10);
  });

  it("shows the estimate as both ends of the range", () => {
    expect(PRICE_ESTIMATE_AUD).toEqual({ min: 7000, max: 8000 });
    expect(fmtRangeAUD(PRICE_ESTIMATE_AUD)).toBe("$7,000–$8,000");
  });

  it("keeps the September inclusions hidden until the new tours' inclusions are confirmed", () => {
    expect(INCLUSIONS_CONFIRMED).toBe(false);
  });
});

describe("December tour: Round 1 and member pricing (Alex, 5 Oct 2026)", () => {
  it("Round 1 belongs to the December tour and closes 11:59pm Friday 30 October 2026, Melbourne time", () => {
    expect(ROUND_1.tourId).toBe(DECEMBER_TOUR_ID);
    expect(TOURS[0].id).toBe(DECEMBER_TOUR_ID);
    expect(ROUND_1.closesAt).toBe("2026-10-30T23:59:00+11:00");
    const melb = new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Melbourne", weekday: "long", day: "numeric", month: "long", year: "numeric",
      hour: "numeric", minute: "2-digit",
    }).format(new Date(ROUND_1.closesAt));
    expect(melb).toMatch(/Friday,? 30 October 2026/);
    expect(melb).toMatch(/11:59/);
    expect(ROUND_1.closesLabel).toBe("Friday 30 October 2026");
  });

  it("member pricing names exactly the three programs, and each is a form option", () => {
    expect(MEMBER_PROGRAMS).toEqual(["12-week T20 Program", "Power Game Pre-Season", "Performance Squads"]);
    expect(PROGRAM_OPTIONS.filter((o) => o.member).map((o) => o.label)).toEqual(MEMBER_PROGRAMS);
  });
});

describe.each(["simple", "standard"] as const)("%s copy", (level) => {
  const copy = COPY[level];
  // What the page renders while INCLUSIONS_CONFIRMED is false: everything except
  // the September inclusions lists, which are kept only as the record.
  const { included, includedHeading, includedNote, notIncluded, notIncludedHeading, notIncludedNote, ...pricing } =
    copy.pricing;
  const rendered = allStrings({ ...copy, pricing }).join("\n");

  it("says the price is an estimate, per player, and that the exact price comes before anyone commits", () => {
    expect(copy.pricing.heading).toBe("About $7,000–$8,000");
    expect(copy.hero.priceLabel).toMatch(/estimated/i);
    expect(copy.hero.priceUnit).toBe("per player");
    expect(copy.hero.priceNote).toMatch(/estimate/i);
    expect(copy.pricing.intro).toMatch(/exact price/i);
  });

  it("never shows the September 2026 camp's prices or flight estimate", () => {
    expect(rendered).not.toMatch(/2,100|2,700|2,200|1,500|incl(uding)? GST/i);
  });

  it("names both tour windows and invents no dates", () => {
    expect(copy.hero.dateline).not.toMatch(/to be announced/i);
    expect(copy.hero.tourLength).toBe("About 10 days");
    // No day-of-month dates for the new tours anywhere in the rendered copy.
    expect(rendered).not.toMatch(/\b\d{1,2}(st|nd|rd|th)? (December|January|April)\b/);
  });

  it("uses none of the banned sales phrases", () => {
    expect(rendered).not.toMatch(
      /\bup to\b|from just|as little as|limited time|limited places|only a few spots|sign up early|registering early|\binvestment\b|act now|don't miss|cutting.edge|world.class|\bunlock\b|\bjourney\b/i,
    );
  });

  it('says "player", not "child"', () => {
    expect(rendered).not.toMatch(/\bchild(ren)?\b/i);
  });

  it("member pricing: no figure, says it is lower, explains the December exception and April's rule", () => {
    const m = copy.pricing.member;
    const all = allStrings(m).join("\n");
    expect(all).not.toMatch(/\$/); // no member price is set (Alex, 5 Oct 2026)
    expect(m.lead).toMatch(/lower than the standard price/);
    for (const p of MEMBER_PROGRAMS) expect(all + copy.hero.memberLine).toContain(p);
    expect(m.whyBody).toMatch(/six months/);
    expect(m.aprilNote).toMatch(/April 2027/);
    expect(m.termsLabel).toMatch(/clause 13/);
  });

  it("the hero says Melbourne", () => {
    expect(copy.hero.kicker).toMatch(/Melbourne/);
  });

  it("Round 1 copy names the date and time, and says the April tour stays open", () => {
    expect(copy.hero.countdownNote).toContain("Friday 30 October 2026 at 11:59pm Melbourne time");
    expect(copy.hero.countdownNote).toMatch(/April 2027 tour stays open/);
    expect(copy.hero.countdownClosedNote).toMatch(/April 2027/);
  });
});
