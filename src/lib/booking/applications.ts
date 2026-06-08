// ============================================================
// applications.ts — Power Game application records + payment confirmation.
// In-memory for the local build (the funnel writes here, the admin reads here);
// the Supabase path writes pg_applications + calls pg_confirm_booking via the
// webhook. confirmPowerGameBooking is store-agnostic so it unit-tests cleanly.
// ============================================================
import type { InMemoryInventory } from "./inventory";

export type AppStatus = "review" | "auto" | "booked";

export interface PgApplication {
  id: string;
  createdAt: number;
  playerName: string;
  dob: string;
  gender: string;
  contactEmail: string;
  contactPhone: string;
  suburb: string;
  centre: string;
  abilityTier: number | null;
  stream: string;
  homeBand: string;
  placedBand: string;
  playFlag: string | null;
  lane: string | null;
  overallScore: number | null;
  eligibility: string;
  requiresReview: boolean;
  reviewReasons: string[];
  engineVersion: string;
  status: AppStatus;
  squadId: string | null;
  bookingId: string | null;
  paymentRef: string | null;
  answers: unknown;
}

export type NewApplication = Omit<PgApplication, "id" | "createdAt" | "squadId" | "bookingId" | "paymentRef"> &
  Partial<Pick<PgApplication, "squadId" | "bookingId" | "paymentRef">>;

export class InMemoryApplications {
  private apps: PgApplication[] = [];
  private seq = 0;

  create(a: NewApplication): PgApplication {
    const rec: PgApplication = {
      squadId: null,
      bookingId: null,
      paymentRef: null,
      ...a,
      id: `pa_${++this.seq}_${Date.now()}`,
      createdAt: Date.now(),
    };
    this.apps.push(rec);
    return rec;
  }

  get(id: string): PgApplication | undefined {
    return this.apps.find((a) => a.id === id);
  }

  update(id: string, patch: Partial<PgApplication>): PgApplication | undefined {
    const a = this.get(id);
    if (a) Object.assign(a, patch);
    return a;
  }

  setStatus(id: string, status: AppStatus, patch: Partial<PgApplication> = {}): PgApplication | undefined {
    return this.update(id, { status, ...patch });
  }

  list(): PgApplication[] {
    return [...this.apps].sort((a, b) => b.createdAt - a.createdAt);
  }

  reviewQueue(): PgApplication[] {
    return this.list().filter((a) => a.requiresReview && a.status !== "booked");
  }

  booked(): PgApplication[] {
    return this.list().filter((a) => a.status === "booked");
  }
}

export const applications = new InMemoryApplications();

/** Map a funnel form + engine placement into a new application record. */
export function applicationFromPlacement(form: Record<string, any>, result: { dna: any; placement: any }, status: AppStatus): NewApplication {
  const { dna, placement } = result;
  return {
    playerName: form.player_name ?? "",
    dob: form.player_dob ?? "",
    gender: form.gender ?? "",
    contactEmail: form.contact_email ?? "",
    contactPhone: form.contact_phone ?? "",
    suburb: form.suburb ?? "",
    centre: form.centre ?? "",
    abilityTier: dna.abilityTier ?? null,
    stream: placement.stream,
    homeBand: placement.homeBand,
    placedBand: placement.placedBand,
    playFlag: placement.playFlag,
    lane: placement.lane,
    overallScore: dna.overallScore ?? null,
    eligibility: dna.eligibilityStatus,
    requiresReview: placement.requiresReview,
    reviewReasons: placement.reviewReasons ?? [],
    engineVersion: dna.engineVersion,
    status,
    answers: { ...form },
  };
}

export interface CheckoutSessionLike {
  metadata?: { source?: string; application_id?: string; booking_id?: string; squad_id?: string } | null;
  payment_intent?: string | null;
  id?: string;
}

/**
 * Confirm a Power Game booking from a paid Stripe Checkout session.
 * Store-agnostic: pass the inventory + applications stores (or Supabase-backed
 * equivalents). Returns whether it confirmed.
 */
export async function confirmPowerGameBooking(
  session: CheckoutSessionLike,
  deps: { inventory: Pick<InMemoryInventory, "confirm">; applications: Pick<InMemoryApplications, "setStatus"> },
): Promise<{ ok: boolean; reason?: string }> {
  const md = session.metadata ?? {};
  if (md.source !== "power-game") return { ok: false, reason: "not_power_game" };
  if (!md.booking_id) return { ok: false, reason: "no_booking" };
  const res = await deps.inventory.confirm(md.booking_id);
  if (!res.ok) return { ok: false, reason: "confirm_failed" };
  if (md.application_id) {
    deps.applications.setStatus(md.application_id, "booked", {
      bookingId: md.booking_id,
      squadId: md.squad_id ?? null,
      paymentRef: session.payment_intent ?? session.id ?? null,
    });
  }
  return { ok: true };
}
