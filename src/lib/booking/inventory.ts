// ============================================================
// inventory.ts — Power Game spot inventory + atomic hold/booking logic.
// In-memory implementation for the local build & stress tests. The Supabase
// adapter (Phase 4) implements the same atomicity via an advisory-locked RPC
// (pg_create_hold) so concurrent buyers can never oversell the last spot.
// ============================================================

import { SQUADS, squadsForPlacement, type Squad } from "./squads";

export type BookingStatus = "hold" | "confirmed" | "released";

export interface Booking {
  id: string;
  squadId: string;
  ref: string; // application reference
  status: BookingStatus;
  holdExpiresAt: number | null; // epoch ms; null once confirmed
  createdAt: number;
}

export interface HoldResult {
  ok: boolean;
  holdId?: string;
  reason?: "full" | "unknown_squad";
}

const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10-minute checkout hold

/** Active = a confirmed seat, or a hold that hasn't expired. These consume capacity. */
function isActive(b: Booking, now: number): boolean {
  if (b.status === "confirmed") return true;
  if (b.status === "hold") return (b.holdExpiresAt ?? 0) > now;
  return false;
}

export class InMemoryInventory {
  private squads: Map<string, Squad>;
  private bookings: Booking[] = [];
  private seq = 0;
  private locks = new Map<string, Promise<unknown>>();
  /** Test seam: forces an interleave point inside the critical section. */
  yieldFn: () => Promise<void> = () => new Promise((r) => setTimeout(r, 0));

  constructor(squads: Squad[] = SQUADS) {
    this.squads = new Map(squads.map((s) => [s.id, s]));
  }

  listSquads(): Squad[] {
    return [...this.squads.values()];
  }

  squadsFor(opts: { centre?: string; band: string; stream: string }): Squad[] {
    return squadsForPlacement(opts).filter((s) => this.squads.has(s.id));
  }

  activeCount(squadId: string, now: number = Date.now()): number {
    return this.bookings.filter((b) => b.squadId === squadId && isActive(b, now)).length;
  }

  spotsLeft(squadId: string, now: number = Date.now()): number {
    const sq = this.squads.get(squadId);
    if (!sq) return 0;
    return Math.max(0, sq.capacity - this.activeCount(squadId, now));
  }

  /** Per-squad serialisation so check-then-insert is atomic (mirrors the SQL advisory lock). */
  private async withSquadLock<T>(squadId: string, fn: () => Promise<T>): Promise<T> {
    const prev = this.locks.get(squadId) ?? Promise.resolve();
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    this.locks.set(squadId, prev.then(() => gate));
    await prev;
    try {
      return await fn();
    } finally {
      release();
    }
  }

  async createHold(p: { squadId: string; ref: string; ttlMs?: number; now?: number }): Promise<HoldResult> {
    const now = p.now ?? Date.now();
    const ttl = p.ttlMs ?? DEFAULT_TTL_MS;
    const sq = this.squads.get(p.squadId);
    if (!sq) return { ok: false, reason: "unknown_squad" };
    return this.withSquadLock(p.squadId, async () => {
      await this.yieldFn(); // simulate read latency — interleave point
      if (this.activeCount(p.squadId, now) >= sq.capacity) return { ok: false, reason: "full" };
      await this.yieldFn(); // simulate write latency
      const id = `b${++this.seq}`;
      this.bookings.push({ id, squadId: p.squadId, ref: p.ref, status: "hold", holdExpiresAt: now + ttl, createdAt: now });
      return { ok: true, holdId: id };
    });
  }

  async confirm(holdId: string): Promise<{ ok: boolean }> {
    const b = this.bookings.find((x) => x.id === holdId);
    if (!b || b.status === "released") return { ok: false };
    b.status = "confirmed";
    b.holdExpiresAt = null;
    return { ok: true };
  }

  async release(holdId: string): Promise<{ ok: boolean }> {
    const b = this.bookings.find((x) => x.id === holdId);
    if (!b) return { ok: false };
    b.status = "released";
    return { ok: true };
  }

  /** Mark expired holds released (a cron/sweeper would call this). Returns count swept. */
  async sweepExpired(now: number = Date.now()): Promise<number> {
    let n = 0;
    for (const b of this.bookings) {
      if (b.status === "hold" && (b.holdExpiresAt ?? 0) <= now) {
        b.status = "released";
        n++;
      }
    }
    return n;
  }

  /** Diagnostics. */
  confirmedCount(squadId: string): number {
    return this.bookings.filter((b) => b.squadId === squadId && b.status === "confirmed").length;
  }
}

/** App-wide singleton for the local build (the funnel UI reads/writes this). */
export const inventory = new InMemoryInventory();
