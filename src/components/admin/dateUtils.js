// Shared date/time formatting helpers for the admin UI.
// Standard: en-AU locale, Australia/Melbourne timezone, DD MMM YYYY format.
// All admin-visible dates/times must go through these helpers — never call
// toLocaleDateString() or toLocaleString() directly without a timezone, or
// the rendered value depends on the viewer's browser locale/TZ.

const TZ = 'Australia/Melbourne';
const LOCALE = 'en-AU';

// "30 Apr 2026"
export const formatDate = (iso) => {
    if (!iso) return '—';
    const d = iso instanceof Date ? iso : new Date(iso);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString(LOCALE, { timeZone: TZ, day: '2-digit', month: 'short', year: 'numeric' });
};

// "30 April 2026" — long month, when there's room
export const formatDateLong = (iso) => {
    if (!iso) return '—';
    const d = iso instanceof Date ? iso : new Date(iso);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString(LOCALE, { timeZone: TZ, day: 'numeric', month: 'long', year: 'numeric' });
};

// "30 Apr" — chart axis labels and other tight contexts
export const formatDateShort = (iso) => {
    if (!iso) return '—';
    const d = iso instanceof Date ? iso : new Date(iso);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString(LOCALE, { timeZone: TZ, day: 'numeric', month: 'short' });
};

// "14:30"
export const formatTime = (iso) => {
    if (!iso) return '';
    const d = iso instanceof Date ? iso : new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString(LOCALE, { timeZone: TZ, hour: '2-digit', minute: '2-digit' });
};

// "30 Apr 2026, 14:30"
export const formatDateTime = (iso) => {
    if (!iso) return '—';
    const d = iso instanceof Date ? iso : new Date(iso);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString(LOCALE, { timeZone: TZ, day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};
