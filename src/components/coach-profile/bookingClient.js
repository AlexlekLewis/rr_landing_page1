// ============================================================
// bookingClient.js — the coach pages' only door into the private-coaching
// booking system (Build Plan §13 + Coach Pages Addendum §3, 3 Nov 2026).
//
// The website never saves a request or an enquiry itself (Plan §3). It reads
// the catalog and free times from the portal's public edge functions, sends
// "Ask us" enquiries to `public-enquiry`, and hands bookings to /book through
// a deep link.
//
// Three modes, fixed at build time:
//   live  VITE_PRIVATE_BOOKING_URL = the portal's edge-function base
//         (https://<portal-ref>.supabase.co/functions/v1). Optional
//         VITE_PRIVATE_BOOKING_KEY = the portal's publishable key, sent as the
//         apikey / bearer header the Supabase gateway expects.
//   mock  VITE_PRIVATE_BOOKING_MOCK=true and no URL. Example data for local
//         review only. Never set in production.
//   off   neither. The page shows "opening soon" and takes nothing.
// ============================================================

const ENV = (typeof import.meta !== 'undefined' && import.meta.env) || {};

export const TIME_ZONE = 'Australia/Melbourne';

export function bookingMode(env = ENV) {
    if (env.VITE_PRIVATE_BOOKING_URL) return 'live';
    if (env.VITE_PRIVATE_BOOKING_MOCK === 'true') return 'mock';
    return 'off';
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
    return Number.isInteger(dollars) ? `$${dollars.toLocaleString('en-AU')}` : `$${dollars.toFixed(2)}`;
}

/** Plain "1 hour" / "1½ hours" / "2 hours" */
export function formatLength(minutes) {
    if (minutes === 60) return '1 hour';
    if (minutes % 60 === 30) return `${Math.floor(minutes / 60)}½ hours`;
    return `${minutes / 60} hours`;
}

/** [60, 90, 120] → "1, 1½ or 2 hours" */
export function formatLengths(durations) {
    const list = (durations || []).filter((m) => m > 0);
    if (!list.length) return '';
    if (list.length === 1) return formatLength(list[0]);
    const num = (m) => (m % 60 === 30 ? `${Math.floor(m / 60)}½` : String(m / 60));
    return `${list.slice(0, -1).map(num).join(', ')} or ${num(list[list.length - 1])} hours`;
}

/** Price of one session, in cents, for one player (Build Plan §9.1). */
export function sessionPriceCents(prices, { kind, groupSize, minutes }) {
    if (!prices) return null;
    const perHour = kind === 'group' ? prices.groupCents?.[groupSize] : prices.hourCents;
    if (perHour == null) return null;
    return Math.round((perHour * minutes) / 60);
}

/**
 * The /book deep link (Build Plan §10.1 + Addendum §3). /book checks every
 * parameter and asks normally for any it drops.
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

/**
 * What a coach offers: one-on-one, small groups, or both (Alex, 9 Nov 2026:
 * every coach is tagged with what they do). Comes from the catalog coach's
 * optional `offers: { one_on_one, group }`, which mirrors the "offers 1-on-1 /
 * offers groups" flags on coach hours (Build Plan §7.1). A missing flag means
 * yes, so a catalog without `offers` shows both. With no catalog coach at all
 * (bookings off, or the coach isn't bookable) both options are still described.
 */
export function coachOffers(coach) {
    const o = coach?.offers;
    return { one_on_one: o?.one_on_one !== false, group: o?.group !== false };
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

// ---------- mock data (local review only) ----------

const MOCK_CATALOG = {
    centres: [
        { id: 'mock-mickleham', slug: 'mickleham', name: 'Mickleham Indoor Sports Centre', suburb: 'Mickleham' },
        { id: 'mock-cranbourne-north', slug: 'cranbourne-north', name: 'Elite Cricket Centre', suburb: 'Cranbourne North' },
    ],
    kinds: ['one_on_one', 'group'],
    group_sizes: [2, 3, 4],
    durations_minutes: [60, 90, 120],
    focus: ['batting', 'pace', 'spin', 'keeping', 'allround'],
    block_discount: { min_sessions: 6, percent: 10 },
    prices: { one_on_one_hour_cents: 13000, group_player_hour_cents: { 2: 7000, 3: 6000, 4: 5000 } },
    cancellation: { free_hours: 24, late_fee_cents: 3500 },
    // `offers` is optional (missing = both). Example data only: real values come
    // from each coach's hours in the booking system.
    coaches: [
        { profile_id: 'mock-ikroop', slug: 'ikroop-dhanoa', home_centre: 'mickleham', centres: ['mickleham'], offers: { one_on_one: true, group: true } },
        { profile_id: 'mock-thornhill', slug: 'alex-thornhill', home_centre: 'cranbourne-north', centres: ['cranbourne-north'], offers: { one_on_one: true, group: true } },
        { profile_id: 'mock-ritin', slug: 'ritin-raman', home_centre: 'mickleham', centres: ['mickleham'], offers: { one_on_one: true, group: true } },
        { profile_id: 'mock-mihiraj', slug: 'mihiraj-jayasekara', home_centre: 'mickleham', centres: ['mickleham'], offers: { one_on_one: true, group: true } },
    ],
};

function hash(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
}

/** Melbourne wall-clock time → ISO with the right offset (AEST +10 / AEDT +11). */
function melbourneIso(dateStr, hh, mm) {
    for (const offset of ['+11:00', '+10:00']) {
        const iso = `${dateStr}T${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:00${offset}`;
        if (melbourneLocal(iso) === `${dateStr}T${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`) return iso;
    }
    return `${dateStr}T${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:00+10:00`;
}

/**
 * Example free times: weekdays only, 4–9pm Melbourne time, at least 48 hours
 * ahead, and the whole session ends by 9pm (Build Plan §5.3, §8.2).
 */
export function mockSlots({ slug, minutes = 60, days = 7, now = new Date() }) {
    const starts = [[16, 0], [16, 30], [17, 0], [17, 30], [18, 0], [18, 30], [19, 0], [19, 30], [20, 0]];
    const earliest = now.getTime() + 48 * 3600 * 1000;
    const out = [];
    const seed = hash(slug);
    for (let d = 0; d < days + 3; d++) {
        const day = new Date(now.getTime() + d * 86400000);
        const dateStr = melbourneDate(day.toISOString());
        const weekday = new Intl.DateTimeFormat('en-AU', { timeZone: TIME_ZONE, weekday: 'short' }).format(day);
        if (weekday === 'Sat' || weekday === 'Sun') continue;
        starts.forEach(([hh, mm], i) => {
            if ((seed + d * 7 + i * 3) % 5 !== 0) return; // keep roughly one in five
            if (hh * 60 + mm + minutes > 21 * 60) return;
            const startsAt = melbourneIso(dateStr, hh, mm);
            if (new Date(startsAt).getTime() < earliest) return;
            const endsAt = new Date(new Date(startsAt).getTime() + minutes * 60000).toISOString();
            out.push({ startsAt, endsAt });
        });
        if (out.length >= 8) break;
    }
    return out;
}

// ---------- network ----------

async function call(path, { method = 'GET', body, headers: extra = {}, env = ENV } = {}) {
    const base = env.VITE_PRIVATE_BOOKING_URL.replace(/\/$/, '');
    const headers = { 'content-type': 'application/json', ...extra };
    if (env.VITE_PRIVATE_BOOKING_KEY) {
        headers.apikey = env.VITE_PRIVATE_BOOKING_KEY;
        headers.authorization = `Bearer ${env.VITE_PRIVATE_BOOKING_KEY}`;
    }
    const res = await fetch(`${base}/${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
    let data = null;
    try { data = await res.json(); } catch { /* empty body */ }
    if (!res.ok) {
        // Two error shapes on the portal side: {code} (enquiry) and {ok:false, error:{code, message}} (request).
        const e = (data && data.error) || data || {};
        const err = new Error(e.message || e.code || `HTTP ${res.status}`);
        err.code = e.code;
        throw err;
    }
    return data;
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** The catalog: prices, centres, and which coaches can be booked right now. */
export async function getCatalog() {
    const mode = bookingMode();
    if (mode === 'off') return null;
    if (mode === 'mock') { await wait(150); return normaliseCatalog(MOCK_CATALOG); }
    return normaliseCatalog(await call('public-private-catalog'));
}

/** One coach's free times for the next `days` days at one centre. */
export async function getCoachSlots({ coach, centre, kind = 'one_on_one', groupSize, focus, minutes = 60, days = 7 }) {
    const mode = bookingMode();
    if (mode === 'off') return [];
    if (mode === 'mock') { await wait(200); return mockSlots({ slug: coach.slug + centre + kind + (groupSize || ''), minutes, days }); }
    const from = new Date();
    const to = new Date(from.getTime() + days * 86400000);
    const data = await call('public-private-slots', {
        method: 'POST',
        body: {
            centre,
            from: melbourneDate(from.toISOString()),
            to: melbourneDate(to.toISOString()),
            kind,
            ...(kind === 'group' ? { group_size: groupSize } : {}),
            focus,
            machine: 'either',
            duration_minutes: minutes,
            coach: coach.profileId,
            weeks: 1,
        },
    });
    const mine = (data?.by_coach || []).find((c) => c.profile_id === coach.profileId);
    return (mine?.slots || []).map((s) => ({ startsAt: s.starts_at, endsAt: s.ends_at }));
}

/** The portal's own checks on an enquiry (private-public.ts), so the form can say what's wrong. */
export function enquiryProblem({ playerName, playerAge, parentName, mobile, email }) {
    if (!String(playerName || '').trim()) return 'Please enter the player’s name.';
    const age = String(playerAge || '').trim();
    if (!/^\d{1,3}$/.test(age) || Number(age) > 120) return 'Please enter the player’s age as a number, for example 11.';
    if (Number(age) < 18 && !String(parentName || '').trim()) return 'Please enter a parent or guardian’s name.';
    const m = String(mobile || '').trim();
    if (!/^[+\d ()-]+$/.test(m) || m.replace(/\D/g, '').length < 8 || m.length > 30) return 'Please enter a mobile number using digits only, for example 0412 345 678.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email || '').trim())) return 'Please enter a valid email address.';
    return '';
}

const newKey = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

/**
 * "Ask us": goes straight to the admin Enquiries inbox (Build Plan §10.2).
 * `idempotencyKey` stays the same across retries of one submission, so a
 * double tap or a retry can't create two enquiries.
 */
export async function sendEnquiry({ centre, coach, playerName, playerAge, parentName, mobile, email, note, sourcePage, turnstileToken, honeypot, idempotencyKey = newKey() }) {
    const mode = bookingMode();
    if (mode === 'off') throw new Error('Enquiries are not open yet.');
    if (mode === 'mock') { await wait(300); return { callByPlain: 'within 24 hours' }; }
    const data = await call('public-enquiry', {
        method: 'POST',
        headers: { 'idempotency-key': idempotencyKey },
        body: {
            centre,
            coach_profile_id: coach?.profileId,
            player_name: String(playerName).trim(),
            player_age: Number(String(playerAge).trim()),
            parent_name: String(parentName || '').trim() || undefined,
            mobile: String(mobile).trim(),
            email: String(email).trim(),
            note: note || undefined,
            source_page: sourcePage,
            turnstile_token: turnstileToken || undefined,
            company_website: honeypot || undefined,
        },
    });
    return { callByPlain: data?.call_by_plain || 'within 24 hours' };
}
