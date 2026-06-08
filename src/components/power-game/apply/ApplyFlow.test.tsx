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
  const motion = new Proxy({}, { get: (_t, tag: string) => forwardRef((props: Record<string, unknown>, ref) => createElement(typeof tag === "string" ? tag : "div", { ...strip(props), ref })) });
  return { motion, AnimatePresence: ({ children }: { children: React.ReactNode }) => createElement(Fragment, null, children) };
});

import ApplyFlow from "./ApplyFlow";
import { inventory } from "../../../lib/booking/inventory";

beforeEach(() => cleanup());

describe("ApplyFlow — full booking chain (demo deep-link)", () => {
  it("reveal → choose time → pay → confirmed, and decrements the spot", async () => {
    window.history.pushState({}, "", "/PGP2026/apply?demo=1");
    render(<ApplyFlow />);

    // Demo jumps to the reveal for a 14yo Dowling gun → Performance.
    await screen.findByText(/you've earned your place/i);
    expect(screen.getByText(/performance squad/i)).toBeTruthy();

    const before = inventory.spotsLeft("w-fri-perf-1416");

    fireEvent.click(screen.getByRole("button", { name: /choose your training time/i }));

    // Slot step — pick the Friday Performance 14-16 squad.
    const slot = await screen.findByTestId("slot-w-fri-perf-1416");
    fireEvent.click(slot);

    // Secure step.
    const pay = await screen.findByRole("button", { name: /lock my spot/i });
    fireEvent.click(pay);

    // Confirmed.
    await screen.findByText(/you're in!/i);

    // The spot was actually taken.
    expect(inventory.spotsLeft("w-fri-perf-1416")).toBe(before - 1);
  });

  it("review path: a below-floor player routes to coach review with no payment", async () => {
    window.history.pushState({}, "", "/PGP2026/apply?demo=review");
    render(<ApplyFlow />);
    await screen.findByText(/a coach will review it/i);
    fireEvent.click(screen.getByRole("button", { name: /what happens next/i }));
    await screen.findByText(/you're in our hands/i);
    expect(screen.queryByRole("button", { name: /lock my spot/i })).toBeNull();
  });

  it("sold-out: when the matching squads are full, no slot is bookable", async () => {
    for (const id of ["w-fri-perf-1416", "w-sat4-perf-1416"]) {
      for (let i = 0; i < 14; i++) await inventory.createHold({ squadId: id, ref: `fill-${id}-${i}` });
    }
    window.history.pushState({}, "", "/PGP2026/apply?demo=perf");
    render(<ApplyFlow />);
    await screen.findByText(/you've earned your place/i);
    fireEvent.click(screen.getByRole("button", { name: /choose your training time/i }));
    await screen.findByText(/choose your time/i);
    const fri = screen.queryByTestId("slot-w-fri-perf-1416") as HTMLButtonElement | null;
    expect(fri && fri.disabled).toBe(true);
    expect(screen.getAllByText(/full/i).length).toBeGreaterThan(0);
  });

  it("real journey: centre → player → profile → history → reveal (no demo shortcut)", async () => {
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
    fireEvent.click(screen.getByText("Continue"));

    // Profile
    fireEvent.click(screen.getByText("Batter"));
    fireEvent.click(screen.getByText("Right"));
    fireEvent.click(screen.getByText("Continue"));

    // History — Dowling Shield, T20, 10 games, avg 38
    const levelSel = (screen.getAllByRole("combobox") as HTMLSelectElement[]).find((s) => [...s.options].some((o) => o.value === "P16M"))!;
    fireEvent.change(levelSel, { target: { value: "P16M" } });
    const fmtSel = (screen.getAllByRole("combobox") as HTMLSelectElement[]).find((s) => [...s.options].some((o) => o.value === "t20"))!;
    fireEvent.change(fmtSel, { target: { value: "t20" } });
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. 12/), { target: { value: "10" } });
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. 32/), { target: { value: "38" } });
    fireEvent.click(screen.getByText("Continue"));

    // Reveal (after the ~1.6s analysing beat) — 14yo Dowling → Performance, played up to 14-16.
    await new Promise((r) => setTimeout(r, 2200));
    const body = document.body.textContent || "";
    expect(body, `SCREEN: ${body.slice(0, 500)}`).toMatch(/you've earned your place/i);
    expect(body).toMatch(/performance squad/i);
    expect(body).toMatch(/14-16/);
  }, 12000);
});
