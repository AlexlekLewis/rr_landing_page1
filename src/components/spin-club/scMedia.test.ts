// scMedia.test.ts — the /spin-club carousel: every file exists, nothing is used twice,
// and every slide is described.
import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { SC_MEDIA } from "./scMedia";

const pub = (p: string) => join(__dirname, "../../../public", p);

describe("Spin Club photos and videos", () => {
  it("has enough to fill the carousel", () => {
    expect(SC_MEDIA.length).toBeGreaterThanOrEqual(8);
  });

  it("points at files that exist", () => {
    for (const m of SC_MEDIA as any[]) {
      expect(existsSync(pub(m.src)), m.src).toBe(true);
      if (m.srcSm) expect(existsSync(pub(m.srcSm)), m.srcSm).toBe(true);
      if (m.poster) expect(existsSync(pub(m.poster)), m.poster).toBe(true);
    }
  });

  it("never uses a file twice", () => {
    const srcs = SC_MEDIA.map((m: any) => m.src);
    expect(new Set(srcs).size).toBe(srcs.length);
  });

  it("describes every slide, and spells the coaches' names right", () => {
    for (const m of SC_MEDIA as any[]) {
      if (m.type === "image") expect(m.alt.length).toBeGreaterThan(10);
      else expect(m.title).toBeTruthy();
    }
    const text = JSON.stringify(SC_MEDIA);
    expect(text).not.toMatch(/Bourgeois|Harkrap|Callum Stowe/i);
  });
});
