// Junior Royals Editor: the wording on /junior-royals that staff can change from the
// admin (/rramadmin_26/junior-royals-editor) without a code deploy.
//
// The defaults stay in jrTerm4Data.js. Edits are saved as one row in Supabase
// (site_content, key 'junior_royals') holding ONLY the fields that differ from the
// defaults, e.g. { "jr.ctaLabel": "Book Now", "rw.steps.0.head": "..." }. The page loads
// that row and lays it over JR_T4 / ROYALS_WAY. If the row is missing or Supabase is
// down, the page shows the defaults.
//
// Prices, Stripe links, dates, centres and age groups are NOT editable here: they are
// tied to the Stripe checkouts, the webhook and the sign-up sheet, so they change in code.
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { JR_T4, ROYALS_WAY } from './jrTerm4Data';

export const CONTENT_TABLE = 'site_content';
export const CONTENT_KEY = 'junior_royals';

const ROOTS = { jr: JR_T4, rw: ROYALS_WAY };

// type: 'text' (one line), 'textarea' (a paragraph) or 'list' (one item per line).
export const SECTIONS = [
    {
        title: 'Hero (top of the page)',
        fields: [
            { path: 'jr.heroEyebrow', label: 'Small line above the title', type: 'text' },
            { path: 'jr.heroTitle', label: 'Title', type: 'text' },
            { path: 'jr.heroTitleAccent', label: 'Title, pink second line', type: 'text' },
            { path: 'jr.heroSub', label: 'Subtitle', type: 'text' },
            { path: 'jr.heroLead', label: 'Intro paragraph', type: 'textarea' },
            { path: 'jr.factLine', label: 'Times and nights line', type: 'textarea' },
            { path: 'jr.renewShort', label: 'Re-enrolment line under the price', type: 'textarea' },
        ],
    },
    {
        title: 'Buttons',
        fields: [
            { path: 'jr.ctaLabel', label: 'Main button', type: 'text' },
            { path: 'jr.stickyLabel', label: 'Floating button at the bottom of the screen', type: 'text' },
            { path: 'jr.placeLine', label: 'Line under the booking button', type: 'text' },
        ],
    },
    {
        title: 'About the Program',
        fields: [
            { path: 'jr.overviewEyebrow', label: 'Small line above the heading', type: 'text' },
            { path: 'jr.overviewTitle', label: 'Heading', type: 'text' },
            { path: 'rw.about', label: 'About paragraph (first part)', type: 'textarea' },
            { path: 'jr.overviewTail', label: 'About paragraph (second part)', type: 'textarea' },
            { path: 'jr.groupPoints.5pm', label: 'Ages 7–9 group: points', type: 'list' },
            { path: 'jr.groupPoints.6pm', label: 'Ages 10–12 group: points', type: 'list' },
            { path: 'jr.olderLead', label: 'Older players line', type: 'text' },
            { path: 'jr.olderLinkLabel', label: 'Older players link', type: 'text' },
        ],
    },
    {
        title: 'Play the Royals Way',
        fields: [
            { path: 'rw.eyebrow', label: 'Small line above the heading', type: 'text' },
            { path: 'rw.title', label: 'Heading', type: 'text' },
            { path: 'rw.lead', label: 'Intro paragraph', type: 'textarea' },
            ...[0, 1, 2].flatMap((i) => [
                { path: `rw.steps.${i}.head`, label: `Step ${i + 1}: heading`, type: 'text' },
                { path: `rw.steps.${i}.body`, label: `Step ${i + 1}: text`, type: 'textarea' },
            ]),
            { path: 'rw.phasesTitle', label: 'Badges heading', type: 'text' },
            ...[0, 1, 2].map((i) => ({ path: `rw.phases.${i}.can`, label: `Badge ${i + 1} (${ROYALS_WAY.phases[i].badge}): "I can…" line`, type: 'text' })),
            { path: 'rw.note', label: 'Closing line', type: 'text' },
        ],
    },
    {
        title: 'Where & When',
        fields: [
            { path: 'jr.twoCentres', label: 'Two centres paragraph', type: 'textarea' },
            { path: 'jr.centresApart', label: 'Distance between centres', type: 'text' },
        ],
    },
    {
        title: 'Booking form',
        fields: [
            { path: 'jr.request.offeredLead', label: 'Booked night: short line', type: 'text' },
            { path: 'jr.request.title', label: 'Different night: heading', type: 'text' },
            { path: 'jr.request.lead', label: 'Different night: short line', type: 'text' },
            { path: 'jr.request.dayLabel', label: 'Different night: question', type: 'text' },
            { path: 'jr.request.button', label: 'Different night: button', type: 'text' },
            { path: 'jr.request.note', label: 'Different night: line under the button', type: 'textarea' },
            { path: 'jr.request.doneTitle', label: 'Different night: heading once sent', type: 'text' },
            { path: 'jr.renewTitle', label: 'Next term: heading', type: 'text' },
            { path: 'jr.renewLines', label: 'Next term: points', type: 'list' },
        ],
    },
];

export const FIELDS = SECTIONS.flatMap((s) => s.fields);
const BY_PATH = Object.fromEntries(FIELDS.map((f) => [f.path, f]));

const split = (path) => {
    const [root, ...keys] = path.split('.');
    return { obj: ROOTS[root], keys };
};
const read = (path) => {
    const { obj, keys } = split(path);
    return keys.reduce((o, k) => (o == null ? undefined : o[k]), obj);
};
const write = (path, value) => {
    const { obj, keys } = split(path);
    const parent = keys.slice(0, -1).reduce((o, k) => o[k], obj);
    parent[keys[keys.length - 1]] = value;
};
const clone = (v) => (Array.isArray(v) ? [...v] : v);

// The wording as shipped in jrTerm4Data.js, captured before any edits are laid over it.
export const DEFAULTS = Object.fromEntries(FIELDS.map((f) => [f.path, clone(read(f.path))]));

// Keep only known fields with a usable value of the right shape.
export const cleanEdits = (edits) => {
    const out = {};
    Object.entries(edits || {}).forEach(([path, v]) => {
        const f = BY_PATH[path];
        if (!f) return;
        if (f.type === 'list') {
            const items = Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean) : [];
            if (items.length) out[path] = items;
        } else if (typeof v === 'string' && v.trim()) {
            out[path] = v.trim();
        }
    });
    return out;
};

// Only what differs from the defaults is saved.
export const diffFromDefaults = (values) => {
    const clean = cleanEdits(values);
    return Object.fromEntries(Object.entries(clean).filter(([p, v]) => JSON.stringify(v) !== JSON.stringify(DEFAULTS[p])));
};

// Reset every field to its default, then lay the edits over it.
export const applyJrContent = (edits) => {
    const clean = cleanEdits(edits);
    FIELDS.forEach((f) => write(f.path, clone(f.path in clean ? clean[f.path] : DEFAULTS[f.path])));
};

export const fetchJrContent = async () => {
    const { data, error } = await supabase
        .from(CONTENT_TABLE)
        .select('content, updated_at, updated_by')
        .eq('key', CONTENT_KEY)
        .maybeSingle();
    if (error) throw error;
    return data;
};

let loaded = null; // one fetch per page load, shared by the page and the success page
export const useJrContent = () => {
    const [, setVersion] = useState(0);
    useEffect(() => {
        let cancelled = false;
        loaded = loaded || fetchJrContent()
            .then((row) => applyJrContent(row?.content))
            .catch((e) => console.warn('[junior-royals] using default wording:', e.message));
        loaded.then(() => { if (!cancelled) setVersion((v) => v + 1); });
        return () => { cancelled = true; };
    }, []);
};
