// itMedia.test.ts — the September 2026 gallery is read from a folder, so adding
// a photo needs no code. Guard the order and that every item is usable.
import { describe, it, expect } from "vitest";
import { SEPT_2026_MEDIA, VIDEOS } from "./itMedia";

describe("September 2026 gallery", () => {
  it("loads every photo in the folder, in filename order, warm-up first", () => {
    expect(SEPT_2026_MEDIA.length).toBeGreaterThanOrEqual(5);
    expect(SEPT_2026_MEDIA[0].caption).toMatch(/Warm-up on the main ground/);
  });

  it("gives every item a source and a description", () => {
    for (const m of SEPT_2026_MEDIA) {
      expect(m.src).toBeTruthy();
      expect(m.alt.length).toBeGreaterThan(10);
      expect(["image", "video"]).toContain(m.type);
    }
  });

  it("keeps the video list as an array", () => {
    expect(Array.isArray(VIDEOS)).toBe(true);
  });
});
