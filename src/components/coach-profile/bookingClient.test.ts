import { describe, it, expect } from "vitest";
import {
  bookingMode, buildBookUrl, coachOffers, formatDay, formatLength, formatLengths, formatMoney, formatTime,
  melbourneLocal, mockSlots, normaliseCatalog, sessionPriceCents, enquiryProblem,
} from "./bookingClient.js";

describe("bookingMode", () => {
  it("is live when the portal URL is set, mock only when asked, otherwise off", () => {
    expect(bookingMode({ VITE_PRIVATE_BOOKING_URL: "https://x.supabase.co/functions/v1" })).toBe("live");
    expect(bookingMode({ VITE_PRIVATE_BOOKING_URL: "https://x", VITE_PRIVATE_BOOKING_MOCK: "true" })).toBe("live");
    expect(bookingMode({ VITE_PRIVATE_BOOKING_MOCK: "true" })).toBe("mock");
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
  it("lists the catalog's lengths in one phrase", () => {
    expect(formatLengths([60, 90, 120])).toBe("1, 1½ or 2 hours");
    expect(formatLengths([60, 120])).toBe("1 or 2 hours");
    expect(formatLengths([90])).toBe("1½ hours");
    expect(formatLengths([])).toBe("");
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
  it("a coach page link (no goals picked) carries focus and kind but no goals", () => {
    const one = new URLSearchParams(buildBookUrl({
      centre: "mickleham", coach: "mihiraj-jayasekara", startsAt: "2026-11-11T07:30:00Z",
      minutes: 90, focus: "batting", kind: "one_on_one", groupSize: 2,
    }).split("?")[1]);
    expect(one.get("focus")).toBe("batting");
    expect(one.get("duration")).toBe("90");
    expect(one.has("kind")).toBe(false);
    expect(one.has("group_size")).toBe(false);
    expect(one.has("goals")).toBe(false);
    const group = new URLSearchParams(buildBookUrl({
      centre: "mickleham", coach: "mihiraj-jayasekara", minutes: 60, focus: "batting", kind: "group", groupSize: 2,
    }).split("?")[1]);
    expect(group.get("kind")).toBe("group");
    expect(group.get("group_size")).toBe("2");
    expect(group.has("goals")).toBe(false);
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
      coaches: [{ profile_id: "p1", slug: "ritin-raman", home_centre: "mickleham", centres: ["mickleham"] }],
    });
    expect(c.prices.hourCents).toBe(13000);
    expect(c.blockDiscount).toEqual({ minSessions: 6, percent: 10 });
    expect(c.cancellation).toEqual({ freeHours: 24, lateFeeCents: 3500 });
    expect(c.coaches[0]).toEqual({
      profileId: "p1", slug: "ritin-raman", homeCentre: "mickleham", centres: ["mickleham"],
      offers: { one_on_one: true, group: true },
    });
    expect(c.durations).toEqual([60, 90, 120]);
  });

  it("reads what each coach offers, and treats a missing flag as yes", () => {
    const c = normaliseCatalog({
      coaches: [
        { profile_id: "a", slug: "one-on-one-only", offers: { one_on_one: true, group: false } },
        { profile_id: "b", slug: "groups-only", offers: { one_on_one: false, group: true } },
        { profile_id: "c", slug: "half-tagged", offers: { group: false } },
        { profile_id: "d", slug: "untagged" },
      ],
    });
    expect(c.coaches.map((x) => x.offers)).toEqual([
      { one_on_one: true, group: false },
      { one_on_one: false, group: true },
      { one_on_one: true, group: false },
      { one_on_one: true, group: true },
    ]);
  });
});

describe("coachOffers", () => {
  it("shows both options when there's no catalog coach (bookings off, or coach not bookable)", () => {
    expect(coachOffers(null)).toEqual({ one_on_one: true, group: true });
    expect(coachOffers(undefined)).toEqual({ one_on_one: true, group: true });
  });
  it("only an explicit false switches an option off", () => {
    expect(coachOffers({ offers: { one_on_one: true, group: false } })).toEqual({ one_on_one: true, group: false });
    expect(coachOffers({ offers: { one_on_one: null, group: 0 } })).toEqual({ one_on_one: true, group: true });
  });
});

describe("mockSlots", () => {
  it("only offers weekday times 48h+ ahead that finish by 9pm Melbourne time", () => {
    const now = new Date("2026-11-03T10:00:00+11:00");
    for (const minutes of [60, 90, 120]) {
      const slots = mockSlots({ slug: "ikroop-dhanoa", minutes, now });
      expect(slots.length).toBeGreaterThan(0);
      for (const s of slots) {
        expect(new Date(s.startsAt).getTime()).toBeGreaterThanOrEqual(now.getTime() + 48 * 3600 * 1000);
        const local = melbourneLocal(s.startsAt);
        const [hh, mm] = local.slice(11).split(":").map(Number);
        expect(hh * 60 + mm).toBeGreaterThanOrEqual(16 * 60);
        expect(hh * 60 + mm + minutes).toBeLessThanOrEqual(21 * 60);
        expect(["Sat", "Sun"]).not.toContain(formatDay(s.startsAt).slice(0, 3));
      }
    }
  });
});

describe("enquiryProblem (matches the portal's public-enquiry checks)", () => {
  const ok = { playerName: "Sam", playerAge: "11", parentName: "Jo", mobile: "0412 345 678", email: "jo@example.com" };
  it("accepts a normal enquiry", () => {
    expect(enquiryProblem(ok)).toBe("");
    expect(enquiryProblem({ ...ok, mobile: "+61 (412) 345-678" })).toBe("");
    expect(enquiryProblem({ ...ok, playerAge: "19", parentName: "" })).toBe("");
  });
  it("rejects what the portal would reject", () => {
    expect(enquiryProblem({ ...ok, playerAge: "12 yrs" })).toMatch(/age/);
    expect(enquiryProblem({ ...ok, playerAge: "" })).toMatch(/age/);
    expect(enquiryProblem({ ...ok, parentName: " " })).toMatch(/parent/);
    expect(enquiryProblem({ ...ok, mobile: "0412-ABC" })).toMatch(/mobile/);
    expect(enquiryProblem({ ...ok, email: "jo@" })).toMatch(/email/);
    expect(enquiryProblem({ ...ok, playerName: "" })).toMatch(/name/);
  });
});
