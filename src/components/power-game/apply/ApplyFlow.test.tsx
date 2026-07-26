// @vitest-environment jsdom
// ============================================================
// ApplyFlow.test.tsx — drives the SIMPLIFIED funnel: one form → (uniform) → pay.
// No "get my offer" / "confirm details" steps, no Wild Card. Cricket is optional and
// lives on the main form. framer-motion is mocked so timing can't flake.
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

describe("ApplyFlow — clean form → pay flow", () => {
  it("seeded demo: one form → pay → confirmed, and decrements the spot", async () => {
    window.history.pushState({}, "", "/PGP2026/apply?demo=1");
    render(<ApplyFlow />);

    // Demo lands straight on the single form, with the session pre-seeded.
    await screen.findByRole("heading", { name: /your details/i });
    const before = inventory.spotsLeft("w-sat3");

    // No uniform needed → Continue goes straight to the pay screen (no offer/confirm step).
    fireEvent.click(screen.getByText("Continue"));
    await screen.findByText(/secure your spot/i);

    fireEvent.click(screen.getByRole("button", { name: /secure my spot/i }));
    await screen.findByText(/you're in!/i);
    expect(inventory.spotsLeft("w-sat3")).toBe(before - 1);
  });

  it("seeded session is full → the form can't proceed and surfaces an error", async () => {
    // Fill the seeded session (w-sat3) so the hold at checkout fails.
    for (let i = 0; i < 30; i++) await inventory.createHold({ squadId: "w-sat3", ref: `fill-${i}` });
    window.history.pushState({}, "", "/PGP2026/apply?demo=1");
    render(<ApplyFlow />);
    await screen.findByRole("heading", { name: /your details/i });
    fireEvent.click(screen.getByText("Continue"));
    await screen.findByText(/just filled/i);
  });

  it("non-seeded: centre → tap a session → lands on the one form", async () => {
    window.history.pushState({}, "", "/PGP2026/apply");
    render(<ApplyFlow />);

    // Centre step (no session chosen up front) — pick Hallam, then tap a session.
    // (Not The Netz: the previous test fills w-sat3, and a full slot renders unclickable.)
    fireEvent.click(screen.getByRole("button", { name: /elite cricket centre/i }));
    const slot = await screen.findByTestId("slot-h-sat3");
    fireEvent.click(slot);

    // Tapping a session takes them straight to the single form.
    await screen.findByRole("heading", { name: /your details/i });
  });
});
