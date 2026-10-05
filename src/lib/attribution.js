// First-touch attribution — where did this visitor come from?
//
// On the first page of a browser session we store, in sessionStorage under
// `rra_attr`: the UTM tags, Meta / Google click ids, the landing page and the
// referrer. It is never overwritten later in the session, so a family who lands
// from an Instagram ad, browses three pages and then registers is still
// credited to the ad (today ~47% of registrants have no source because the form
// page itself had no UTMs).
//
// PRIVACY: the landing page keeps only an allow-list of query params (UTMs and
// non-personal page params). Tokens, passcodes, emails or anything else in the
// URL are dropped.

const KEY = 'rra_attr';

// Query params that are safe to keep in a stored/sent URL: campaign tags and
// non-personal page selectors. Everything else is stripped.
const SAFE_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'program', 'centre', 'venue', 'session', 'ref', 'read',
];

/** pathname + only the allow-listed query params. */
export const safePath = (pathname = '/', search = '') => {
  try {
    const src = new URLSearchParams(search || '');
    const out = new URLSearchParams();
    for (const k of SAFE_PARAMS) {
      const v = src.get(k);
      if (v) out.set(k, v.slice(0, 100));
    }
    const qs = out.toString();
    return `${pathname || '/'}${qs ? `?${qs}` : ''}`;
  } catch {
    return pathname || '/';
  }
};

const readStore = () => {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Store first-touch attribution if this session has none yet. Safe to call on
 * every load — it never overwrites. Returns the stored (or existing) object.
 */
export const captureAttribution = () => {
  try {
    if (typeof window === 'undefined') return null;
    const existing = readStore();
    if (existing) return existing;
    const p = new URLSearchParams(window.location.search || '');
    const get = (k) => (p.get(k) || '').slice(0, 200) || null;
    const attr = {
      utm_source: get('utm_source'),
      utm_medium: get('utm_medium'),
      utm_campaign: get('utm_campaign'),
      utm_content: get('utm_content'),
      utm_term: get('utm_term'),
      fbclid: get('fbclid'),
      gclid: get('gclid'),
      landing_page: safePath(window.location.pathname, window.location.search),
      first_referrer: (typeof document !== 'undefined' && document.referrer) || null,
      captured_at: new Date().toISOString(),
    };
    sessionStorage.setItem(KEY, JSON.stringify(attr));
    return attr;
  } catch {
    return null;
  }
};

/** The stored first-touch attribution, or {} if none / storage blocked. */
export const getAttribution = () => readStore() || {};

const FILLABLE = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const isEmpty = (v) => v === null || v === undefined || v === '';

/**
 * Columns that exist on every table written by a form that builds its UTMs
 * conditionally (only adds a key when the URL has it): performance_squad_leads,
 * match_registrations. Checked against information_schema on 6 Oct 2026.
 */
export const LEAD_ATTR_COLUMNS = [...FILLABLE, 'page_referrer'];

/**
 * Fill a form row's attribution columns from first-touch attribution when the
 * row has them empty (the form page itself carried no UTMs).
 *
 * By default only keys ALREADY PRESENT in `row` are touched — it never adds a
 * key, so it can never send a column the table doesn't have. Pass `columns`
 * (a list of columns known to exist on the table) to allow adding those keys
 * when absent. Values the form already got from its own URL always win.
 */
export const fillAttribution = (row, columns) => {
  try {
    if (!row || typeof row !== 'object') return row;
    const a = getAttribution();
    const out = { ...row };
    const allowed = (k) => k in out || (Array.isArray(columns) && columns.includes(k));
    for (const k of FILLABLE) {
      if (allowed(k) && isEmpty(out[k]) && a[k]) out[k] = a[k];
    }
    if (allowed('page_referrer') && isEmpty(out.page_referrer) && a.first_referrer) {
      out.page_referrer = a.first_referrer;
    }
    return out;
  } catch {
    return row;
  }
};
