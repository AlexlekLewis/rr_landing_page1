import { createPublicClient, publicConfig, PublicBookingError } from '../booking/public-client';
import { addDays, parseCoachOffers, uuid } from '../booking/booking-model';
// ============================================================
// bookingClient.js — the coach pages' only door into the private-coaching
// booking system (Build Plan §13 + Coach Pages Addendum §3, 3 Nov 2026).
//
// The website never saves a request or an enquiry itself (Plan §3). It reads
// the catalog and free times from the portal's public edge functions, sends
// "Ask us" enquiries to `public-enquiry`, and hands bookings to /book through
// a deep link.
//
// Live configuration uses the existing booking client's validated public boundary.
// Missing/invalid configuration and preview mocks fail closed. This page never
// creates a request; it hands validated hints to the current /book wizard.
// ============================================================

const ENV = (typeof import.meta !== 'undefined' && import.meta.env) || {};

export const TIME_ZONE = 'Australia/Melbourne';

export function bookingMode(env = ENV) {
    try { publicConfig(env); return 'live'; } catch { return 'off'; }
}

// ---------- formatting (pure) ----------

function partsIn(iso, opts) {
    const fmt = new Intl.DateTimeFormat('en-AU', { timeZone: TIME_ZONE, ...opts });
    const out = {};
    for (const p of fmt.formatToParts(new Date(iso))) out[p.type] = p.value;
    return out;
}

/** "2026-11-10T17:00" in Melbourne time, for the /book deep link. */
export function melbourneLocal(iso) {
    const p = partsIn(iso, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

/** "2026-11-10", the Melbourne calendar date, for grouping slots by day. */
export function melbourneDate(iso) {
    return melbourneLocal(iso).slice(0, 10);
}

/** "Tue 10 Nov" */
export function formatDay(iso) {
    const p = partsIn(iso, { weekday: 'short', day: 'numeric', month: 'short' });
    return `${p.weekday} ${p.day} ${p.month}`;
}

/** "5:00pm" */
export function formatTime(iso) {
    const p = partsIn(iso, { hour: 'numeric', minute: '2-digit', hourCycle: 'h12' });
    return `${p.hour}:${p.minute}${(p.dayPeriod || '').toLowerCase().replace(/\s|\./g, '')}`;
}

/** 13000 → "$130", 11700 → "$117", 11750 → "$117.50" */
export function formatMoney(cents) {
    if (cents == null || Number.isNaN(cents)) return '';
    const dollars = cents / 100;
    return `$${dollars.toLocaleString('en-AU', { minimumFractionDigits: Number.isInteger(dollars) ? 0 : 2, maximumFractionDigits: 2 })}`;
}

/** Plain "1 hour" / "1½ hours" / "2 hours" */
export function formatLength(minutes) {
    if (minutes === 60) return '1 hour';
    if (minutes % 60 === 30) return `${Math.floor(minutes / 60)}½ hours`;
    return `${minutes / 60} hours`;
}

/**
 * Price of one session, in cents, for one player (Build Plan §9.1).
 * @param {{ hourCents: number | null, groupCents?: Record<number, number | null> } | null} prices
 * @param {{ kind: string, groupSize?: number, minutes: number }} options
 */
export function sessionPriceCents(prices, { kind, groupSize, minutes }) {
    if (!prices) return null;
    const perHour = kind === 'group' ? prices.groupCents?.[groupSize] : prices.hourCents;
    if (perHour == null) return null;
    return Math.round((perHour * minutes) / 60);
}

/**
 * The /book deep link (Build Plan §10.1 + Addendum §3). /book checks every
 * parameter and asks normally for any it drops.
 * @param {{ centre?: string, coach?: string, startsAt?: string, minutes?: number, focus?: string, goals?: string[], kind?: string, groupSize?: number }} options
 */
export function buildBookUrl({ centre, coach, startsAt, minutes, focus, goals = [], kind, groupSize }) {
    const q = new URLSearchParams();
    if (centre) q.set('centre', centre);
    if (coach) q.set('coach', coach);
    if (startsAt) q.set('start', melbourneLocal(startsAt));
    if (minutes) q.set('duration', String(minutes));
    if (kind === 'group') {
        q.set('kind', 'group');
        if (groupSize) q.set('group_size', String(groupSize));
    }
    if (focus) q.set('focus', focus);
    if (goals.length) q.set('goals', goals.slice(0, 4).join(','));
    return `/book?${q.toString()}`;
}

// ---------- catalog ----------

// A missing legacy field is unavailable, not evidence that both formats are offered.
export function coachOffers(coach) {
    return coach == null ? null : parseCoachOffers(coach.offers);
}

/** Turn the §13 catalog into the shape the pages use. */
export function normaliseCatalog(raw) {
    if (!raw) return null;
    return {
        centres: raw.centres || [],
        durations: raw.durations_minutes || [60, 90, 120],
        groupSizes: raw.group_sizes || [2, 3, 4],
        prices: raw.prices
            ? { hourCents: raw.prices.one_on_one_hour_cents, groupCents: raw.prices.group_player_hour_cents || {} }
            : null,
        blockDiscount: raw.block_discount
            ? { minSessions: raw.block_discount.min_sessions, percent: raw.block_discount.percent }
            : null,
        // Addendum §3: the cancellation rule from private_booking_settings.
        cancellation: raw.cancellation
            ? { freeHours: raw.cancellation.free_hours, lateFeeCents: raw.cancellation.late_fee_cents }
            : null,
        coaches: (raw.coaches || []).map((c) => ({
            profileId: c.profile_id,
            slug: c.slug,
            homeCentre: c.home_centre,
            centres: c.centres || [],
            offers: coachOffers(c),
        })),
    };
}

// The existing booking client owns URL, response, timeout, privacy and rate-limit rules.
// A shared page reader also pauses Ask-us and later availability after a429.
/** @param {{ reader?: Pick<ReturnType<typeof createPublicClient>, 'catalog'>, signal?: AbortSignal, env?: Record<string, unknown> }} options */
export async function getCatalog({ reader = createPublicClient(), signal, env = ENV } = {}) {
    if (bookingMode(env) === 'off') return null;
    return normaliseCatalog(await reader.catalog(signal));
}

/** @param {{ coach: { profileId: string, centres: string[], offers: { one_on_one: boolean, group: boolean } }, centre: string, kind?: string, groupSize?: number, focus: string, minutes?: number, days?: number, now?: Date, reader?: Pick<ReturnType<typeof createPublicClient>, 'slots'>, signal?: AbortSignal, env?: Record<string, unknown> }} options */
export async function getCoachSlots({ coach, centre, kind = 'one_on_one', groupSize, focus, minutes = 60, days = 7, now = new Date(), reader = createPublicClient(), signal, env = ENV }) {
    if (bookingMode(env) === 'off') return [];
    if (!uuid(coach?.profileId) || !coach.centres?.includes(centre) || !['one_on_one', 'group'].includes(kind) || !coachOffers(coach)?.[kind] ||
        !Number.isSafeInteger(days) || days < 1 || days > 14 || ![60, 90, 120].includes(minutes)) {
        throw new PublicBookingError('invalid_request');
    }
    const from = melbourneDate(now.toISOString()), to = addDays(from, days - 1);
    const data = await reader.slots({
        centre, from, to, kind, ...(kind === 'group' ? { group_size: groupSize } : {}),
        focus, machine: 'either', duration_minutes: minutes, coach: coach.profileId, weeks: 1,
    }, signal);
    const mine = data.by_coach.find(c => c.profile_id === coach.profileId);
    return (mine?.slots || []).filter(s => s.series_check.ready && s.series_check.actual_sessions === 1 &&
        Date.parse(s.ends_at) - Date.parse(s.starts_at) === minutes * 60000 &&
        melbourneDate(s.starts_at) >= from && melbourneDate(s.starts_at) <= to)
        .map(s => ({ startsAt: s.starts_at, endsAt: s.ends_at }));
}
