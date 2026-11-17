import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AVAILABILITY_VIEW } from './premiumCoachingData';

// Live coach availability for Royals Private Coaching (Andy, 17 Nov 2026: "mirror his
// availability so that it is always live for customers"). Reads the database function
// private_coaching_open_slots() (migration 20261117120000), which returns open hours from
// today for five weeks: coach, centre, date, times. Nothing personal.
//
// One fetch per page load, shared by every component that calls the hook. Refetches when
// the tab comes back into view, so a page left open stays current.
//
// The database already refuses a coach at two centres on one night. groupByNight() checks
// again and drops any night that somehow has two centres, so the page never offers one.

let cache = null;
let inflight = null;
const listeners = new Set();

const load = async () => {
    if (inflight) return inflight;
    inflight = (async () => {
        try {
            const { data, error } = await supabase.rpc(AVAILABILITY_VIEW, { p_coach: null });
            cache = { slots: error ? [] : (data || []), error: error ? error.message : null, loaded: true };
        } catch (e) {
            cache = { slots: [], error: String(e?.message || e), loaded: true };
        }
        inflight = null;
        listeners.forEach((fn) => fn(cache));
        return cache;
    })();
    return inflight;
};

export const useAllAvailability = () => {
    const [state, setState] = useState(cache || { slots: [], error: null, loaded: false });
    useEffect(() => {
        listeners.add(setState);
        if (!cache) load();
        const onVisible = () => { if (document.visibilityState === 'visible') load(); };
        document.addEventListener('visibilitychange', onVisible);
        return () => { listeners.delete(setState); document.removeEventListener('visibilitychange', onVisible); };
    }, []);
    return state;
};

const hhmm = (t) => String(t).slice(0, 5);

export const slotKey = (s) => `${s.date}|${hhmm(s.start_time ?? s.start)}`;

// [{ date, centre, slots:[{date,start,end,centre}] }] for one coach, optionally one centre.
export const groupByNight = (slots, coachSlug, centre = null) => {
    const nights = new Map();
    for (const s of slots) {
        if (s.coach_slug !== coachSlug) continue;
        const slot = { date: s.date, start: hhmm(s.start_time), end: hhmm(s.end_time), centre: s.centre };
        if (!nights.has(s.date)) nights.set(s.date, []);
        nights.get(s.date).push(slot);
    }
    const out = [];
    for (const [date, list] of nights) {
        const centres = new Set(list.map((x) => x.centre));
        if (centres.size !== 1) continue; // never offer a night split across two centres
        const c = list[0].centre;
        if (centre && c !== centre) continue;
        out.push({ date, centre: c, slots: list.sort((a, b) => a.start.localeCompare(b.start)) });
    }
    return out.sort((a, b) => a.date.localeCompare(b.date));
};

export const nightLabel = (date) =>
    new Date(`${date}T12:00:00`).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });

export const timeLabel = (t) => {
    const [h, m] = t.split(':').map(Number);
    const ap = h >= 12 ? 'pm' : 'am';
    const h12 = ((h + 11) % 12) + 1;
    return `${h12}:${String(m).padStart(2, '0')}${ap}`;
};
