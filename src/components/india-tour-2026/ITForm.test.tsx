// @vitest-environment jsdom
// ============================================================
// ITForm.test.tsx — the /tours expression-of-interest form.
//
// There is one upcoming tour (April 2027), pre-selected. It must reach the
// database in two forms: the tour id in
// `tour_interest` (for filtering) and a readable "Tours:" line in `bio`.
// Supabase is mocked, so nothing here touches a real database.
// ============================================================
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";

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

const insert = vi.fn(async () => ({ error: null }));
const from = vi.fn(() => ({ insert }));
vi.mock("../../lib/supabase", () => ({ supabase: { from: (table: string) => from(table) } }));

// The real date picker is three selects; a plain input keeps the test about the tours.
vi.mock("../DateOfBirthInput", async () => {
  const { createElement } = await import("react");
  return {
    default: ({ value, onChange }: { value: string; onChange: (v: string) => void }) =>
      createElement("input", { "aria-label": "Date of birth", value, onChange: (e: { target: { value: string } }) => onChange(e.target.value) }),
  };
});

import ITForm from "./ITForm";
import { COPY, TOURS } from "./itCopy";

const APR = "2027-04-april";

const fillRequiredDetails = () => {
  fireEvent.click(screen.getByRole("button", { name: /new to us/i }));
  fireEvent.change(document.querySelector('input[name="player_name"]')!, { target: { value: "Test Player" } });
  fireEvent.change(screen.getByLabelText("Date of birth"), { target: { value: "1995-01-01" } }); // over 18
  fireEvent.change(document.querySelector('input[name="current_club"]')!, { target: { value: "Test CC" } });
  fireEvent.change(document.querySelector('input[name="highest_level"]')!, { target: { value: "Sub-district" } });
  fireEvent.change(document.querySelector('select[name="primary_skill"]')!, { target: { value: "Batsman" } });
  fireEvent.change(document.querySelector('input[name="player_email"]')!, { target: { value: "player@example.com" } });
  fireEvent.change(document.querySelector('input[name="player_phone"]')!, { target: { value: "0491 570 156" } });
  // The consent box is the square next to the consent sentence.
  const consentText = screen.getByText(/I agree to be contacted by Rajasthan Royals Academy Melbourne/);
  fireEvent.click(consentText.parentElement!.querySelector("span")!);
};

const submit = () => fireEvent.click(document.querySelector('[data-cta="submit-eoi"]')!);

beforeEach(() => {
  cleanup();
  insert.mockClear();
  from.mockClear();
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  Element.prototype.scrollIntoView = vi.fn();
});

describe("ITForm — which tour", () => {
  it("labels the submit button with the page's call to action, not \"registration\"", () => {
    render(<ITForm copy={COPY.simple} />);
    const button = document.querySelector('[data-cta="submit-eoi"]') as HTMLButtonElement;
    expect(button.textContent).toContain(COPY.simple.hero.cta);
    expect(button.textContent).not.toMatch(/registration/i);
  });

  it("pre-selects the one upcoming tour: no checkbox, no December tour", () => {
    render(<ITForm copy={COPY.simple} />);
    expect(TOURS.map((t) => t.id)).toEqual([APR]);
    expect(screen.queryByRole("checkbox")).toBeNull();
    expect(screen.getByText("April 2027")).toBeTruthy();
    expect(screen.queryByText(/December/)).toBeNull();
  });

  it("records the April tour: id in tour_interest, and a readable line at the top of bio", async () => {
    render(<ITForm copy={COPY.simple} />);
    fillRequiredDetails();
    submit();

    await waitFor(() => expect(insert).toHaveBeenCalledTimes(1));
    expect(from).toHaveBeenCalledWith("applications");
    const [[rows]] = insert.mock.calls as unknown as [[Array<Record<string, unknown>>]];
    const row = rows[0];
    expect(row.tour_interest).toEqual([APR]);
    expect(row.source).toBe("india-tour-eoi");
    expect(String(row.bio).split("\n")[0]).toBe("Tours: April 2027");
    expect(String(row.bio)).toContain("Player type: New to the academy");
    expect(String(row.bio)).not.toMatch(/\$|price tier/i);

    // The thank-you names the tour and says nothing is paid or held.
    expect(await screen.findByText(/You have not paid anything, and no place is held\./)).toBeTruthy();
    expect(screen.getByText(/You have registered interest in:/)).toBeTruthy();
    expect(screen.getByText("April 2027")).toBeTruthy();
  });
});
