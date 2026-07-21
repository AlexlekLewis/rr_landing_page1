// @vitest-environment jsdom
// PowerLeagueDashboard.test.tsx — smoke-tests the Power League admin board:
// rows load from the mocked client, group into centre columns + 2.5-yr brackets,
// team-fill math counts confirmed YES players, and the status pill cycles + persists.
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup, within } from "@testing-library/react";

const mkRow = (over: Record<string, unknown>) => ({
  id: Math.random().toString(36).slice(2),
  player_name: "Player",
  dob: "2012-01-01",
  age_years: 14.5,
  age_bracket: "12.5 – 15",
  suburb: "Testville",
  centre: "Mickleham",
  centre_source: "nearest",
  whatsapp_status: "pending",
  status_note: null,
  phone: null,
  email: null,
  source_programs: ["elite_2026"],
  skill_role: null,
  bowling_type: null,
  ...over,
});

// 9 confirmed YES in Williamstown 12.5–15 → exactly one 8-a-side team + 1 spare.
const ROWS = [
  ...Array.from({ length: 9 }, (_, i) =>
    mkRow({ player_name: `W Yes ${i + 1}`, centre: "Williamstown", whatsapp_status: "yes" })),
  mkRow({ player_name: "Mick Pending", centre: "Mickleham", whatsapp_status: "pending" }),
  mkRow({ player_name: "Hallam No", centre: "Hallam", whatsapp_status: "no", age_bracket: "15 – 17.5", age_years: 16, skill_role: "pace", bowling_type: "Right-Arm Fast" }),
  mkRow({ player_name: "Lost Soul", centre: null, centre_source: "unassigned", whatsapp_status: "check", status_note: "ambiguous vote" }),
];

const updateEq = vi.fn(async () => ({ error: null }));
const update = vi.fn(() => ({ eq: updateEq }));
vi.mock("../../lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({ order: vi.fn(async () => ({ data: ROWS, error: null })) })),
      update,
    })),
  },
}));

import PowerLeagueDashboard from "./PowerLeagueDashboard";

beforeEach(() => { cleanup(); vi.clearAllMocks(); });

describe("PowerLeagueDashboard", () => {
  it("renders the three centre columns with pool/yes counts and team-fill maths", async () => {
    render(<PowerLeagueDashboard />);
    await screen.findByText("Mickleham");
    screen.getByText("Hallam");
    screen.getByText("Williamstown");

    // Stat cards: 12 pool, 9 yes, 1 no; 1 confirmed team of 8 (Williamstown).
    expect(screen.getByText("Total pool").previousSibling?.textContent).toBe("12");
    expect(screen.getByText("Confirmed YES").previousSibling?.textContent).toBe("9");
    expect(screen.getByText("Confirmed teams").previousSibling?.textContent).toBe("1");

    // Williamstown column shows 9 players all yes, 1 team of 8 confirmed.
    const wCol = screen.getByText("Williamstown").closest("div")!.parentElement!.parentElement!;
    expect(within(wCol).getByText(/9 yes/)).toBeTruthy();
    expect(wCol.textContent).toContain("1 confirmed");
  });

  it("groups players under their 2.5-year age bracket heading", async () => {
    render(<PowerLeagueDashboard />);
    await screen.findByText("Hallam No");
    const hallamCol = screen.getByText("Hallam").closest("div")!.parentElement!.parentElement!;
    expect(within(hallamCol).getByText("15 – 17.5")).toBeTruthy();
    expect(within(hallamCol).getByText("Hallam No")).toBeTruthy();
    // role chip renders next to the name
    expect(within(hallamCol).getByText("PACE")).toBeTruthy();
  });

  it("surfaces unassigned players in their own strip", async () => {
    render(<PowerLeagueDashboard />);
    await screen.findByText(/Unassigned — pick a centre/i);
    expect(screen.getByText("Lost Soul")).toBeTruthy();
  });

  it("clicking a status pill cycles pending → yes and persists via supabase", async () => {
    render(<PowerLeagueDashboard />);
    await screen.findByText("Mick Pending");
    const row = screen.getByText("Mick Pending").closest(".group")!;
    fireEvent.click(within(row as HTMLElement).getByRole("button")); // pending → yes
    expect(update).toHaveBeenCalledWith({ whatsapp_status: "yes" });
    expect(updateEq).toHaveBeenCalled();
    await within(row as HTMLElement).findByText("YES");
  });

  it("switching to 11-a-side recomputes confirmed teams (9 yes → 0 teams)", async () => {
    render(<PowerLeagueDashboard />);
    await screen.findByText("Mickleham");
    fireEvent.click(screen.getByText("11-a-side"));
    expect(screen.getByText("Confirmed teams").previousSibling?.textContent).toBe("0");
  });
});
