// @vitest-environment jsdom
// ============================================================
// ApplyFlow.test.tsx — drives the funnel end-to-end (reveal → slot → pay →
// confirmed) deterministically, and asserts the chosen spot is decremented.
// framer-motion is mocked to plain elements so AnimatePresence timing can't flake.
// ============================================================
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

vi.mock("framer-motion", async () => {
  const { createElement, forwardRef, Fragment } = await import("react");
  const strip = (p: Record<string, unknown>) => {
    const { initial, animate, exit, transition, whileInView, whileHover, whileTap, viewport, layout, ...rest } = p;
    return rest;
  };
  const motionCache: Record<string, unknown> = {};
  const motion = new Proxy({}, { get: (_t, tag: string) => (motionCache[tag] ||= forwardRef((props: Record<string, unknown>, ref) => createElement(typeof tag === "string" ? tag : "div", { ...strip(props), ref }))) });
  return { motion, AnimatePresence: ({ children }: { children: React.ReactNode }) => createElement(Fragment, null, children) };
});

// Phase B persistence is I/O — stub it so the funnel chain stays deterministic offline.
vi.mock("./submit", () => ({
  submitApplication: vi.fn(async () => ({ id: "test-app-id" })),
  buildApplicationRow: vi.fn(() => ({})),
}));

import ApplyFlow from "./ApplyFlow";
import { inventory } from "../../../lib/booking/inventory";

beforeEach(() => cleanup());

describe("ApplyFlow — full booking chain (demo deep-link)", () => {
  it("reveal → choose time → pay → confirmed, and decrements the spot", async () => {
    window.history.pushState({}, "", "/PGP2026/apply?demo=1");
    render(<ApplyFlow />);

    // Demo jumps to the reveal — time slots are shown inline below the offer card.
    await screen.findByText(/you've earned your place/i);
    expect(screen.getByText(/performance squad/i)).toBeTruthy();

    const before = inventory.spotsLeft("w-fri530-1416-perf");

    // Slots are on the same screen — pick the Friday Performance 14-16 squad.
    const slot = await screen.findByTestId("slot-w-fri530-1416-perf");
    fireEvent.click(slot);

    // No uniform flagged (demo = PERF, needs_uniform false) → the kit step is skipped; straight to Secure.
    await screen.findByText(/secure your spot/i);
    document.querySelectorAll('input[type="checkbox"]').forEach((b) => fireEvent.click(b));
    const pay = screen.getByRole("button", { name: /secure my spot/i });
    fireEvent.click(pay);

    // Confirmed.
    await screen.findByText(/you're in!/i);

    // The spot was actually taken.
    expect(inventory.spotsLeft("w-fri530-1416-perf")).toBe(before - 1);
  });

  it("review path: below-floor player gets a no-payment submit form", async () => {
    window.history.pushState({}, "", "/PGP2026/apply?demo=review");
    render(<ApplyFlow />);
    await screen.findByText(/a coach will review it/i);
    fireEvent.click(screen.getByRole("button", { name: /what happens next/i }));
    await screen.findByText(/apply for coach review/i);
    // no payment in this path
    expect(screen.queryByRole("button", { name: /secure my spot|lock my spot/i })).toBeNull();
    // consents are captured on the contact step (pre-set in the demo), so submit is ready
    const submit = screen.getByRole("button", { name: /submit my application/i }) as HTMLButtonElement;
    expect(submit.disabled).toBe(false);
    fireEvent.click(submit);
    await screen.findByText(/in our hands/i);
  });

  it("sold-out: when the matching squads are full, no slot is bookable", async () => {
    for (const id of ["w-fri530-1416-perf", "w-sat4-1416-perf"]) {
      for (let i = 0; i < 14; i++) await inventory.createHold({ squadId: id, ref: `fill-${id}-${i}` });
    }
    window.history.pushState({}, "", "/PGP2026/apply?demo=perf");
    render(<ApplyFlow />);
    await screen.findByText(/you've earned your place/i);
    // Slots are inline on the reveal screen — no separate step to navigate to.
    const fri = screen.queryByTestId("slot-w-fri530-1416-perf") as HTMLButtonElement | null;
    expect(fri && fri.disabled).toBe(true);
    expect(screen.getAllByText(/full/i).length).toBeGreaterThan(0);
  });

  it("real journey: centre → player → profile (cricket history) → confirm → reveal (no demo shortcut)", async () => {
    window.history.pushState({}, "", "/PGP2026/apply");
    render(<ApplyFlow />);
    const yr = String(new Date().getFullYear() - 14); // 14yo

    // Centre
    fireEvent.click(screen.getByRole("button", { name: /the netz/i }));
    fireEvent.click(screen.getByText("Continue"));

    // Player
    fireEvent.change(screen.getByPlaceholderText(/sam smith/i), { target: { value: "Test Player" } });
    const combos = screen.getAllByRole("combobox") as HTMLSelectElement[];
    const yearSel = combos.find((s) => [...s.options].some((o) => o.value === yr))!;
    const daySel = combos.find((s) => [...s.options].some((o) => o.value === "31"))!;
    const monthSel = combos.find((s) => s !== yearSel && s !== daySel)!;
    fireEvent.change(daySel, { target: { value: "01" } });
    fireEvent.change(monthSel, { target: { value: "01" } });
    fireEvent.change(yearSel, { target: { value: yr } });
    // 14yo is a minor → parent/guardian name is required (validateStep gates this).
    fireEvent.change(screen.getByPlaceholderText(/jane smith/i), { target: { value: "Parent Name" } });
    fireEvent.click(screen.getByText("Male"));
    fireEvent.change(screen.getByPlaceholderText(/0412/), { target: { value: "0400000000" } });
    fireEvent.change(screen.getByPlaceholderText(/hallam/i), { target: { value: "Williamstown" } });
    fireEvent.change(screen.getByPlaceholderText(/jane@/i), { target: { value: "t@e.com" } });
    // compliance now lives on the contact step — accept both checkboxes to continue
    document.querySelectorAll('input[type="checkbox"]').forEach((b) => fireEvent.click(b));
    fireEvent.click(screen.getByText("Continue"));

    // Profile — last-3-years cricket only (game profile moved to onboarding).
    fireEvent.change(screen.getByPlaceholderText(/footscray/i), { target: { value: "Williamstown CC" } });
    // Dowling Shield (a pure batter has no numbers to add now)
    const levelSel = (screen.getAllByRole("combobox") as HTMLSelectElement[]).find((s) => [...s.options].some((o) => o.value === "P16M"))!;
    fireEvent.change(levelSel, { target: { value: "P16M" } });
    fireEvent.click(screen.getByText("Continue"));

    // Confirm — "Is this correct?" review, then get the offer
    await screen.findByText(/is this correct/i);
    fireEvent.click(screen.getByRole("button", { name: /get my offer/i }));

    // Reveal (after the ~1.6s analysing beat) — 14yo Dowling → Performance, played up an
    // age group. The offer card no longer prints the band (stats grid removed); the
    // placed band is asserted at the unit level in flow.rules.test.ts. Here we confirm the
    // offer renders + the play-up signal fired.
    await new Promise((r) => setTimeout(r, 2200));
    const body = document.body.textContent || "";
    expect(body, `SCREEN: ${body.slice(0, 500)}`).toMatch(/you've earned your place/i);
    expect(body).toMatch(/performance squad/i);
    expect(body).toMatch(/playing up/i);
  }, 12000);
});
