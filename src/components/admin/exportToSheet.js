// Shared helper: export rows to a Google Sheet via /api/export-to-sheets.
// Returns { ok, url, title } on success, throws on failure.
//
// Usage:
//   const { url } = await exportToSheet({
//     title: `Program registrations — ${todayISO()}`,
//     sheet_name: 'Registrations',
//     headers: ['Date', 'Customer', ...],
//     rows: filtered.map(r => [r.created_at, r.customer_name, ...]),
//   });
//   window.open(url, '_blank', 'noopener');

import { supabase } from '../../lib/supabase';

export const exportToSheet = async ({ title, sheet_name, headers, rows }) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not signed in');

    const res = await fetch('/api/export-to-sheets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
            title,
            sheet_name: sheet_name || 'Export',
            headers,
            // Coerce nullish to empty string so Sheets shows blank cells, not "null"
            rows: rows.map(r => r.map(c => (c == null ? '' : c))),
        }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
};

export const todayISO = () => new Date().toISOString().split('T')[0];
