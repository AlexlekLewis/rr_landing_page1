// ============================================================
// submit.js — Phase B capture: write a completed funnel run into the canonical
// power_game_applications table (the one the Elite Player Portal ingests). The
// funnel's in-memory model still drives spot-availability UX; THIS is the real
// persistence.
//
// RLS: anon may INSERT but not SELECT power_game_applications, so we generate the
// row id client-side (crypto.randomUUID) rather than reading it back, and pass
// that id into Stripe checkout metadata so the webhook can flip the row to paid.
//
// Preview rows are tagged via `source` (VITE_PGP_SOURCE, default *-preview) so
// test data is trivially distinguishable and purgeable. Set VITE_PGP_SOURCE to
// "pgp2026" at production go-live.
// ============================================================
import { calcAge, isMinor } from "./flow";
// NOTE: the supabase client is imported lazily inside submitApplication() so that
// buildApplicationRow (pure) stays importable in tests without instantiating a
// client (createClient throws when env vars are absent).

const SOURCE = (import.meta?.env?.VITE_PGP_SOURCE) || "pgp2026-funnel-preview";

function splitName(full) {
  const parts = String(full || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts.slice(0, -1).join(" "), last: parts[parts.length - 1] };
}

function summarise(form) {
  const bits = [];
  if (form.skill) bits.push(`Skill: ${form.skill}${form.secondary_skill && form.secondary_skill !== "none" ? ` (2nd: ${form.secondary_skill})` : ""}`);
  if (form.batting_hand) bits.push(`Bats: ${form.batting_hand}`);
  if (form.bowling_type) bits.push(`Bowls: ${form.bowling_type}`);
  if (form.format) bits.push(`Format: ${form.format}`);
  if (form.gender) bits.push(`Gender: ${form.gender}`);
  if (form.rep_level) bits.push(`Rep ${form.rep_level}: ${form.rep_games || 0} games, bat avg ${form.rep_bat_avg || "—"} (${form.rep_bat_runs || "—"} runs), bowl avg ${form.rep_bowl_avg || "—"} (${form.rep_bowl_wkts || "—"} wkts)`);
  if (form.club_level) bits.push(`Club ${form.club_level}: ${form.club_games || 0} games, bat avg ${form.club_bat_avg || "—"} (${form.club_bat_runs || "—"} runs), bowl avg ${form.club_bowl_avg || "—"} (${form.club_bowl_wkts || "—"} wkts)`);
  return bits.join(" · ");
}

/** Map a completed funnel run → a power_game_applications row (pure; no I/O). */
export function buildApplicationRow(form, placement, squad, opts = {}) {
  const minor = isMinor(form.player_dob);
  const { first, last } = splitName(form.player_name);
  const kind = opts.kind || (placement?.requiresReview ? "capability" : "standard");
  const comingSoon = !!opts.comingSoon;
  const status =
    kind === "standard"
      ? (squad ? "awaiting_payment" : "placed")
      : (comingSoon ? "venue_waitlist" : "review");

  return {
    first_name: first,
    last_name: last,
    player_name: form.player_name || "",
    dob: form.player_dob || null,
    age: calcAge(form.player_dob),
    cricket_type: form.gender === "F" ? "Female" : form.gender === "M" ? "Male" : null,
    email: minor ? "" : (form.contact_email || ""),
    phone: minor ? "" : (form.contact_phone || ""),
    suburb: form.suburb || "",
    club: form.club_level || "",
    bio: summarise(form),
    parent1_name: minor ? (form.parent_name || "") : "",
    parent1_email: minor ? (form.contact_email || "") : "",
    parent1_phone: minor ? (form.contact_phone || "") : "",
    venue: opts.centreName || form.centre || "",
    age_group: placement?.placedBand || "",
    session_day: squad?.day || "",
    session_time: squad ? `${squad.startTime}–${squad.endTime}` : "",
    phase: "pgp2026",
    application_type: kind, // 'standard' (auto-placed) | 'capability' (review/waitlist)
    current_level: [form.rep_level, form.club_level].filter(Boolean).join(" / "),
    capability_statement:
      kind === "capability"
        ? (comingSoon ? "venue_tbc_waitlist" : (placement?.reviewReasons?.join(", ") || "coach_review"))
        : "",
    payment_status: "pending",
    status,
    source: SOURCE,
  };
}

/** Insert the row into power_game_applications; returns the client-generated id. */
export async function submitApplication(form, placement, squad, opts = {}) {
  const row = buildApplicationRow(form, placement, squad, opts);
  const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : undefined;
  const payload = id ? { id, ...row } : row;
  const { supabase } = await import("../../../lib/supabase");
  const { error } = await supabase.from("power_game_applications").insert([payload]);
  if (error) throw error;
  return { id, row };
}
