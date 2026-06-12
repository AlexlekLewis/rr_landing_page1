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

const SOURCE = (import.meta?.env?.VITE_PGP_SOURCE) || "pgp2026";

function splitName(full) {
  const parts = String(full || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts.slice(0, -1).join(" "), last: parts[parts.length - 1] };
}

function bowlLabel(t) {
  return t === "leg_spin" ? "leg spin" : t === "off_spin" ? "off spin" : t === "pace" ? "pace/seam" : t;
}

function summarise(form) {
  const bits = [];
  if (form.skill) {
    const sec = form.secondary_skill && form.secondary_skill !== "none"
      ? ` (2nd: ${form.secondary_skill}${form.secondary_skill === "bowling" && form.secondary_bowling_type ? ` — ${bowlLabel(form.secondary_bowling_type)}` : ""})`
      : "";
    bits.push(`Skill: ${form.skill}${sec}`);
  }
  if (form.batting_hand) bits.push(`Bats: ${form.batting_hand}`);
  if (form.bowling_type) bits.push(`Bowls: ${bowlLabel(form.bowling_type)}`);
  if (form.format) bits.push(`Format: ${form.format}`);
  if (form.gender) bits.push(`Gender: ${form.gender}`);
  if (form.rep_level) bits.push(`Rep ${form.rep_level}`);
  if (form.club_level) bits.push(`Club ${form.club_level}`);
  if (form.wildcard) bits.push("Wild Card — applied without a rep / graded senior level");
  return bits.join(" · ");
}

/** Map a completed funnel run → a power_game_applications row (pure; no I/O). */
export function buildApplicationRow(form, placement, squad, opts = {}) {
  const minor = isMinor(form.player_dob);
  const { first, last } = splitName(form.player_name);
  const kind = opts.kind || (placement?.requiresReview ? "capability" : "standard");
  const comingSoon = !!opts.comingSoon;
  const status =
    opts.status ||
    (kind === "standard"
      ? (opts.intent === "callback" ? "callback_requested" : (squad ? "awaiting_payment" : "placed"))
      : (comingSoon ? "venue_waitlist" : "review"));

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
    accept_terms: !!form.accept_terms,
    accept_player_code: !!form.accept_player_code,
    accept_parent_code: minor ? !!form.accept_parent_code : true,
    accept_social_media: !!form.accept_social_media,
    accept_playing_standard: !!form.accept_playing_standard,
    needs_uniform: !!(opts.uniformSelection) || !!(opts.kitSummary && opts.kitSummary.length) || !!form.needs_uniform,
    uniform_selection: opts.uniformSelection
      || (opts.kitSummary && opts.kitSummary.length ? opts.kitSummary.map((l) => `${l.name} (${l.size})`).join(", ") : ""),
    uniform_total_cents: opts.kitTotalCents || 0,
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

  // Meta Pixel — fire a Lead conversion on successful application submit.
  try {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "Lead", {
        content_name: "Power Game Program",
        content_category: "power-game-application",
      });
    }
  } catch (_) { /* never let analytics block the submit */ }

  return { id, row };
}
