import { describe, it, expect } from "vitest";
import {
  bookingMode, buildBookUrl, coachOffers, formatDay, formatLength, formatMoney, formatTime,
  melbourneLocal, normaliseCatalog, sessionPriceCents,
} from "./bookingClient.js";

describe("bookingMode", () => {
  it("uses only valid live configuration and fails closed for preview mocks", () => {
    expect(bookingMode({ VITE_PRIVATE_BOOKING_URL: "https://x.supabase.co/functions/v1" })).toBe("live");
    expect(bookingMode({ VITE_PRIVATE_BOOKING_URL: "https://x", VITE_PRIVATE_BOOKING_MOCK: "true" })).toBe("off");
    expect(bookingMode({ VITE_PRIVATE_BOOKING_MOCK: "true" })).toBe("off");
    expect(bookingMode({})).toBe("off");
  });
});

describe("Melbourne time", () => {
  it("formats AEDT times (November is UTC+11)", () => {
    const iso = "2026-11-10T17:00:00+11:00";
    expect(melbourneLocal(iso)).toBe("2026-11-10T17:00");
    expect(formatDay(iso)).toBe("Tue 10 Nov");
    expect(formatTime(iso)).toBe("5:00pm");
  });
  it("formats AEST times (July is UTC+10)", () => {
    expect(melbourneLocal("2026-07-07T06:30:00Z")).toBe("2026-07-07T16:30");
  });
});

describe("money and length", () => {
  it("drops cents only when whole", () => {
    expect(formatMoney(13000)).toBe("$130");
    expect(formatMoney(11750)).toBe("$117.50");
    expect(formatMoney(117000)).toBe("$1,170");
    expect(formatMoney(123456)).toBe("$1,234.56");
    expect(formatMoney(100005)).toBe("$1,000.05");
    expect(formatMoney(123456789)).toBe("$1,234,567.89");
    expect(formatMoney(1)).toBe("$0.01");
  });
  it("prices sessions by length and group size from the catalog", () => {
    const prices = { hourCents: 13000, groupCents: { 2: 7000, 3: 6000, 4: 5000 } };
    expect(sessionPriceCents(prices, { kind: "one_on_one", minutes: 90 })).toBe(19500);
    expect(sessionPriceCents(prices, { kind: "group", groupSize: 3, minutes: 120 })).toBe(12000);
    expect(sessionPriceCents(null, { kind: "one_on_one", minutes: 60 })).toBeNull();
  });
  it("writes lengths plainly", () => {
    expect(formatLength(60)).toBe("1 hour");
    expect(formatLength(90)).toBe("1½ hours");
    expect(formatLength(120)).toBe("2 hours");
  });
});

describe("buildBookUrl", () => {
  it("carries centre, coach, Melbourne start, length, focus and goals", () => {
    const url = buildBookUrl({
      centre: "mickleham", coach: "ikroop-dhanoa", startsAt: "2026-11-10T06:00:00Z",
      minutes: 60, focus: "batting", goals: ["batting", "t20-cricket"], kind: "one_on_one",
    });
    expect(url).toBe("/book?centre=mickleham&coach=ikroop-dhanoa&start=2026-11-10T17%3A00&duration=60&focus=batting&goals=batting%2Ct20-cricket");
  });
  it("adds group details and caps goals at four", () => {
    const url = buildBookUrl({ centre: "cranbourne-north", coach: "alex-thornhill", kind: "group", groupSize: 3, goals: ["a", "b", "c", "d", "e"] });
    const q = new URLSearchParams(url.split("?")[1]);
    expect(q.get("kind")).toBe("group");
    expect(q.get("group_size")).toBe("3");
    expect(q.get("goals")).toBe("a,b,c,d");
    expect(q.has("start")).toBe(false);
  });
});

describe("normaliseCatalog", () => {
  it("maps the Build Plan §13 shape", () => {
    const c = normaliseCatalog({
      prices: { one_on_one_hour_cents: 13000, group_player_hour_cents: { 2: 7000 } },
      block_discount: { min_sessions: 6, percent: 10 },
      cancellation: { free_hours: 24, late_fee_cents: 3500 },
      coaches: [{ profile_id: "p1", slug: "ritin-raman", home_centre: "mickleham", centres: ["mickleham"], offers: { one_on_one: true, group: false } }],
    });
    if (!c?.prices) throw new Error('Expected a priced catalogue');
    expect(c.prices.hourCents).toBe(13000);
    expect(c.blockDiscount).toEqual({ minSessions: 6, percent: 10 });
    expect(c.cancellation).toEqual({ freeHours: 24, lateFeeCents: 3500 });
    expect(c.coaches[0]).toEqual({ profileId: "p1", slug: "ritin-raman", homeCentre: "mickleham", centres: ["mickleham"], offers: { one_on_one: true, group: false } });
    expect(c.durations).toEqual([60, 90, 120]);
  });
});
describe('coachOffers', () => {
  it('keeps an absent catalogue coach distinct from explicit unsupported formats', () => {
    expect(coachOffers(null)).toBeNull();
    expect(coachOffers({offers:{one_on_one:false,group:false}})).toEqual({one_on_one:false,group:false});
    expect(()=>coachOffers({})).toThrow('unavailable');
  });
  it('does not convert strings or missing flags into supported formats', () => {
    for (const offers of [{ one_on_one: true }, { one_on_one: 'true', group: false }, { one_on_one: true, group: true, other: true }]) {
      expect(() => coachOffers({ offers })).toThrow();
    }
  });
});
