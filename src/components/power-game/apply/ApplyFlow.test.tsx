// @vitest-environment jsdom
// ============================================================
// ApplyFlow.test.tsx — drives the funnel end-to-end (reveal → session → pay →
// confirmed) deterministically, and asserts the chosen spot is decremented.
// OPEN-SESSION model: no age-band squads — any 12–26 player picks any session at
// the centre. framer-motion is mocked to plain elements so timing can't flake.
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
  it("reveal → choose session → pay → confirmed, and decrements the spot", async () => {
    window.history.pushState({}, "", "/PGP2026/apply?demo=1");
    render(<ApplyFlow />);

    // Demo jumps to the reveal — sessions are open (any 12–26 player picks any time).
    await screen.findByText(/you've earned your place/i);
    expect(screen.getAllByText(/choose your session/i).length).toBeGreaterThan(0);

    const before = inventory.spotsLeft("w-fri530");

    // Sessions are inline below the offer — pick the Friday 5:30 session at The Netz.
    const slot = await screen.findByTestId("slot-w-fri530");
    fireEvent.click(slot);

    // Demo player flagged no uniform → kit step skipped → straight to Secure.
    await screen.findByText(/secure your spot/i);
    fireEvent.click(screen.getByRole("button", { name: /secure my spot/i }));

    await screen.findByText(/you're in!/i);
    expect(inventory.spotsLeft("w-fri530")).toBe(before - 1);
  });

  it("sold-out: when every session at the centre is full, no slot is bookable", async () => {
    // Fill every session at The Netz so there is genuinely nothing left to book.
    // (Full sessions render non-interactive — no `slot-` test id — and show "Full".)
    const netzSessions = ["w-fri530", "w-fri730", "w-sat2", "w-sat4"];
    for (const id of netzSessions) {
      for (let i = 0; i < 30; i++) await inventory.createHold({ squadId: id, ref: `fill-${id}-${i}` });
    }
    window.history.pushState({}, "", "/PGP2026/apply?demo=perf");
    render(<ApplyFlow />);
    await screen.findByText(/you've earned your place/i);
    expect(screen.queryByTestId("slot-w-fri530")).toBeNull(); // a full session is not bookable
    expect(screen.queryByTestId("slot-w-sat4")).toBeNull();
    expect(screen.getAllByText(/full/i).length).toBeGreaterThan(0);
  });

  it("real journey: centre → player → profile → reveal → open session picker", async () => {
    window.history.pushState({}, "", "/PGP2026/apply");
    render(<ApplyFlow />);
    const yr = String(new Date().getFullYear() - 14); // 14yo — any 12–26 age is fine

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
    fireEvent.change(screen.getByPlaceholderText(/jane smith/i), { target: { value: "Parent Name" } });
    fireEvent.click(screen.getByText("Male"));
    fireEvent.change(screen.getByPlaceholderText(/0412/), { target: { value: "0400000000" } });
    fireEvent.change(screen.getByPlaceholderText(/hallam/i), { target: { value: "Williamstown" } });
    fireEvent.change(screen.getByPlaceholderText(/jane@/i), { target: { value: "t@e.com" } });
    document.querySelectorAll('input[type="checkbox"]').forEach((b) => fireEvent.click(b));
    fireEvent.click(screen.getByText("Continue"));

    // Profile — cricket history is OPTIONAL (open program); leave it blank and continue.
    fireEvent.click(screen.getByText("Continue"));

    // Confirm → get the offer
    await screen.findByText(/is this correct/i);
    fireEvent.click(screen.getByRole("button", { name: /get my offer/i }));

    // Reveal (after the ~1.6s analysing beat) — open session picker, no age band.
    await new Promise((r) => setTimeout(r, 2200));
    const body = document.body.textContent || "";
    expect(body, `SCREEN: ${body.slice(0, 500)}`).toMatch(/you've earned your place/i);
    expect(body).toMatch(/choose your session/i);
  }, 12000);
});
