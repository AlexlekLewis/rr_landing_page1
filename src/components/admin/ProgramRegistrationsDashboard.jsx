import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Download, ChevronDown, ChevronUp, X, MapPin, CreditCard,
    CheckCircle2, Clock, ExternalLink, RefreshCw, DollarSign, Trophy, AlertCircle, CloudDownload, Users,
    Shuffle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useRealtimeSync from '../../hooks/useRealtimeSync';

// ============================================================
// Money formatter — single source of truth.
// program_registrations.amount_*_cents columns are ALWAYS integer
// cents. There is no legacy "sometimes dollars, sometimes cents"
// ambiguity here (unlike shop_orders_*). Always divide by 100.
// ============================================================
const formatAUD = (cents) => {
    if (cents == null || cents === '') return '—';
    const value = Number(cents) / 100;
    if (Number.isNaN(value)) return '—';
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(value);
};

const TZ = 'Australia/Melbourne';

const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-AU', { timeZone: TZ, day: '2-digit', month: 'short', year: 'numeric' });
};

const formatDateTime = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-AU', { timeZone: TZ, day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const formatTime = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString('en-AU', { timeZone: TZ, hour: '2-digit', minute: '2-digit' });
};

// Display config for each program key — drives badges, filter labels, stat cards.
const PROGRAM_CONFIG = {
    elite: {
        label: 'Elite Program',
        short: 'Elite',
        accent: 'bg-rr-pink/15 text-rr-pink border-rr-pink/20',
        iconColor: 'text-rr-pink',
    },
    holiday: {
        label: 'Holiday Programs',
        short: 'Holiday',
        accent: 'bg-amber-400/15 text-amber-300 border-amber-400/20',
        iconColor: 'text-amber-300',
    },
    female_kickstart: {
        label: 'Female Cricket Kickstart',
        short: 'Female Kickstart',
        accent: 'bg-fuchsia-400/15 text-fuchsia-300 border-fuchsia-400/20',
        iconColor: 'text-fuchsia-300',
    },
    junior_royals: {
        label: 'Junior Royals',
        short: 'Junior Royals',
        accent: 'bg-blue-400/15 text-blue-300 border-blue-400/20',
        iconColor: 'text-blue-300',
    },
};

const programDisplay = (key) =>
    PROGRAM_CONFIG[key] || { label: key || 'Unknown', short: key || 'Unknown', accent: 'bg-slate-500/15 text-slate-300 border-slate-500/20', iconColor: 'text-slate-300' };

const ProgramRegistrationsDashboard = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const location = useLocation();
    const initialProgramFilter = (() => {
        const p = new URLSearchParams(location.search).get('program');
        return ['elite', 'holiday', 'female_kickstart', 'junior_royals'].includes(p) ? p : 'all';
    })();
    const [programFilter, setProgramFilter] = useState(initialProgramFilter);

    // Sync filter with URL when the user navigates between sidebar program items
    useEffect(() => {
        const p = new URLSearchParams(location.search).get('program');
        const next = ['elite', 'holiday', 'female_kickstart', 'junior_royals'].includes(p) ? p : 'all';
        setProgramFilter(next);
    }, [location.search]);
    const [timeRange, setTimeRange] = useState('all'); // 'all' | '30d' | '90d' | '365d'
    const [sortKey, setSortKey] = useState('created_at');
    const [sortDir, setSortDir] = useState('desc');
    const [selected, setSelected] = useState(null);
    const [syncState, setSyncState] = useState({ status: 'idle', message: '' });

    const fetchData = useCallback(async () => {
        setError(null);
        try {
            const { data, error } = await supabase
                .from('program_registrations')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setRows(data || []);
        } catch (err) {
            console.error('Error fetching program registrations:', err);
            setError(err.message || 'Failed to load registrations');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);
    useRealtimeSync(['program_registrations'], fetchData);

    // ============================================================
    // ARCHITECTURE NOTE — this dashboard reads only from Supabase.
    // Live data flow: customer pays on Stripe → /api/stripe-webhook →
    // program_registrations table → realtime push to this dashboard.
    //
    // Auto-sync on mount has been removed deliberately: it masked webhook
    // delivery failures and made the UI a Stripe client, which it shouldn't
    // be. For a one-off historical backfill (e.g. seeding pre-webhook data
    // or recovering a missed window) use the "Backfill from Stripe" button
    // in the header — that's the only place this dashboard ever calls
    // Stripe, and only when an admin explicitly clicks it.
    // ============================================================

    // ============================================================
    // Apply time-range filter before stats so the cards reflect the
    // user's chosen window (matching the time-toggle UX in the brief).
    // ============================================================
    const inRange = useCallback((iso) => {
        if (!iso) return false;
        if (timeRange === 'all') return true;
        const days = timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
        return new Date(iso).getTime() >= cutoff;
    }, [timeRange]);

    const ranged = useMemo(
        () => rows.filter(r => inRange(r.paid_at || r.created_at)),
        [rows, inRange]
    );

    const stats = useMemo(() => {
        const completed = ranged.filter(r => r.payment_status === 'completed');
        const pending = ranged.filter(r => r.payment_status !== 'completed');
        const revenueCents = completed.reduce((s, r) => s + (Number(r.amount_total_cents) || 0), 0);
        const pendingRevCents = pending.reduce((s, r) => s + (Number(r.amount_total_cents) || 0), 0);

        const byProgram = {};
        for (const r of completed) {
            const k = r.program || 'unknown';
            byProgram[k] = (byProgram[k] || 0) + 1;
        }

        return {
            revenueCents,
            pendingRevCents,
            registrations: completed.length,
            pending: pending.length,
            byProgram,
            uniqueCustomers: new Set(completed.map(r => (r.customer_email || '').toLowerCase()).filter(Boolean)).size,
        };
    }, [ranged]);

    const filtered = useMemo(() => {
        let result = ranged;

        if (statusFilter !== 'all') {
            result = result.filter(r => r.payment_status === statusFilter);
        }
        if (programFilter !== 'all') {
            result = result.filter(r => r.program === programFilter);
        }
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(r =>
                (r.customer_name || '').toLowerCase().includes(q) ||
                (r.customer_email || '').toLowerCase().includes(q) ||
                (r.customer_phone || '').toLowerCase().includes(q) ||
                (r.stripe_session_id || '').toLowerCase().includes(q) ||
                (r.program_label || '').toLowerCase().includes(q) ||
                (r.id || '').toLowerCase().includes(q)
            );
        }

        result = [...result].sort((a, b) => {
            const av = a[sortKey], bv = b[sortKey];
            if (av == null) return 1;
            if (bv == null) return -1;
            if (sortKey === 'created_at' || sortKey === 'paid_at') {
                return sortDir === 'asc' ? new Date(av) - new Date(bv) : new Date(bv) - new Date(av);
            }
            const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
            return sortDir === 'asc' ? cmp : -cmp;
        });

        return result;
    }, [ranged, search, statusFilter, programFilter, sortKey, sortDir]);

    // When showing all programs, group rows by program so each section in the
    // table gets its own subheader. Returns null when a specific program is
    // already filtered (no need to subhead a single-program list).
    const groupedFiltered = useMemo(() => {
        if (programFilter !== 'all') return null;
        const order = ['elite', 'holiday', 'female_kickstart', 'junior_royals'];
        const buckets = new Map();
        for (const reg of filtered) {
            const key = reg.program || 'unknown';
            if (!buckets.has(key)) buckets.set(key, []);
            buckets.get(key).push(reg);
        }
        const ordered = [];
        for (const k of order) if (buckets.has(k)) { ordered.push([k, buckets.get(k)]); buckets.delete(k); }
        for (const [k, v] of buckets) ordered.push([k, v]);
        return ordered;
    }, [filtered, programFilter]);

    const toggleSort = (key) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortKey(key); setSortDir('desc'); }
    };

    const SortIcon = ({ column }) => {
        if (sortKey !== column) return null;
        return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
    };

    const callSync = async (days) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('Not signed in');
        const res = await fetch('/api/sync-programs-from-stripe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ days }),
        });
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } catch {
            throw new Error(
                `Server returned a non-JSON response (status ${res.status}). ` +
                `This usually means STRIPE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY is not set ` +
                `for this Vercel deployment.`
            );
        }
        if (!res.ok) throw new Error(data.error || `Sync failed (HTTP ${res.status})`);
        return data;
    };

    const syncFromStripe = async () => {
        const days = parseInt(prompt('How many days of Stripe history to pull?\n\nUseful values: 14 (recent), 90 (this quarter), 365 (full year backfill).', '90') || '90', 10);
        if (!days || days < 1) return;
        setSyncState({ status: 'syncing', message: `Querying Stripe (last ${days} days)…` });
        try {
            const data = await callSync(days);
            const breakdown = data.by_program
                ? Object.entries(data.by_program)
                    .filter(([, n]) => n > 0)
                    .map(([k, n]) => `${programDisplay(k).short}: ${n}`)
                    .join(', ')
                : '';
            setSyncState({
                status: 'done',
                message: `Synced ${data.synced} of ${data.processed} sessions${breakdown ? ` (${breakdown})` : ''}${data.errors?.length ? `, ${data.errors.length} errors` : ''}`,
            });
            fetchData();
        } catch (err) {
            setSyncState({ status: 'error', message: err.message });
        }
    };

    const exportCSV = () => {
        const headers = [
            'Registration ID', 'Date', 'Paid At', 'Program', 'Variant', 'Program Label',
            'Customer Name', 'Email', 'Phone',
            'Items', 'Subtotal (AUD)', 'Total (AUD)', 'Currency', 'Payment Status',
            'Card', 'Stripe Session', 'Stripe Charge', 'Receipt URL'
        ];
        const rows2 = filtered.map(r => [
            r.id,
            formatDate(r.created_at),
            formatDate(r.paid_at),
            r.program || '',
            r.program_variant || '',
            r.program_label || '',
            r.customer_name || '',
            r.customer_email || '',
            r.customer_phone || '',
            (r.items || []).map(i => `${i.description || i.name || ''} x${i.quantity || 1}`).join(' | '),
            r.amount_subtotal_cents != null ? (r.amount_subtotal_cents / 100).toFixed(2) : '',
            r.amount_total_cents != null ? (r.amount_total_cents / 100).toFixed(2) : '',
            (r.currency || 'aud').toUpperCase(),
            r.payment_status || '',
            r.card_brand && r.card_last4 ? `${r.card_brand.toUpperCase()} ****${r.card_last4}` : '',
            r.stripe_session_id || '',
            r.stripe_charge_id || '',
            r.receipt_url || '',
        ]);

        const csv = [headers, ...rows2]
            .map(r => r.map(c => `"${(c == null ? '' : c).toString().replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `program_registrations_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <svg className="animate-spin w-8 h-8 text-rr-pink" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider">PROGRAM REGISTRATIONS</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {filtered.length} of {ranged.length} {timeRange === 'all' ? 'all-time' : `last ${timeRange}`}
                        {' · '}
                        <span className="text-slate-500">{rows.length} total in DB</span>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Time-range toggle */}
                    <div className="inline-flex bg-white/5 border border-white/10 rounded-xl p-0.5">
                        {[
                            { v: '30d', l: '30D' },
                            { v: '90d', l: '90D' },
                            { v: '365d', l: '1Y' },
                            { v: 'all', l: 'ALL' },
                        ].map(opt => (
                            <button
                                key={opt.v}
                                onClick={() => setTimeRange(opt.v)}
                                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                                    timeRange === opt.v
                                        ? 'bg-rr-pink/20 text-white'
                                        : 'text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                {opt.l}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={syncFromStripe}
                        disabled={syncState.status === 'syncing'}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-rr-pink/20 to-rr-blue/20 border border-rr-pink/30 text-white hover:from-rr-pink/30 hover:to-rr-blue/30 transition-all text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                    >
                        {syncState.status === 'syncing' ? (
                            <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Syncing…</>
                        ) : (
                            <><CloudDownload className="w-3.5 h-3.5" /> Sync from Stripe</>
                        )}
                    </button>
                    <button
                        onClick={fetchData}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-wider"
                    >
                        <RefreshCw className="w-3.5 h-3.5" /> Refresh
                    </button>
                </div>
            </div>

            {syncState.message && (
                <div className={`rounded-xl border p-3 text-xs ${syncState.status === 'error'
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : syncState.status === 'done'
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : 'bg-blue-500/10 border-blue-500/30 text-blue-300'}`}>
                    {syncState.message}
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-red-400 text-sm font-bold">Failed to load registrations</p>
                        <p className="text-red-400/70 text-xs mt-1">{error}</p>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard icon={DollarSign} label="Revenue (paid)" value={formatAUD(stats.revenueCents)} accent="from-green-500/20 to-emerald-500/10" iconColor="text-green-400" />
                <StatCard icon={Clock} label="Pending revenue" value={formatAUD(stats.pendingRevCents)} accent="from-amber-500/20 to-yellow-500/10" iconColor="text-amber-400" />
                <StatCard icon={Trophy} label="Registrations" value={stats.registrations} accent="from-rr-pink/20 to-rr-blue/10" iconColor="text-rr-pink" />
                <StatCard icon={Users} label="Unique customers" value={stats.uniqueCustomers} accent="from-blue-500/20 to-indigo-500/10" iconColor="text-blue-400" />
            </div>

            {/* Per-program breakdown */}
            {Object.keys(stats.byProgram).length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(stats.byProgram).sort((a, b) => b[1] - a[1]).map(([key, count]) => {
                        const cfg = programDisplay(key);
                        return (
                            <button
                                key={key}
                                onClick={() => setProgramFilter(programFilter === key ? 'all' : key)}
                                className={`text-left bg-white/5 border rounded-xl p-3 transition-all hover:bg-white/10 ${
                                    programFilter === key ? 'border-rr-pink/50 ring-1 ring-rr-pink/30' : 'border-white/10'
                                }`}
                            >
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{cfg.short}</p>
                                <p className="text-xl font-black text-white">{count}</p>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name, email, phone, program, or Stripe session..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-rr-pink/50"
                    />
                </div>

                <FilterSelect value={statusFilter} onChange={setStatusFilter} options={[
                    { value: 'all', label: 'All payments' },
                    { value: 'completed', label: 'Paid' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'refunded', label: 'Refunded' },
                ]} />

                <FilterSelect value={programFilter} onChange={setProgramFilter} options={[
                    { value: 'all', label: 'All programs' },
                    { value: 'elite', label: 'Elite Program' },
                    { value: 'holiday', label: 'Holiday Programs' },
                    { value: 'female_kickstart', label: 'Female Kickstart' },
                    { value: 'junior_royals', label: 'Junior Royals' },
                ]} />

                <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm"
                >
                    <Download className="w-4 h-4" /> Export CSV
                </button>
            </div>

            {/* Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                {[
                                    { key: 'created_at', label: 'Date' },
                                    { key: 'customer_name', label: 'Customer' },
                                    { key: 'program', label: 'Program' },
                                    { key: 'program_variant', label: 'Variant' },
                                    { key: 'amount_total_cents', label: 'Total' },
                                    { key: 'payment_status', label: 'Payment' },
                                    { key: '_card', label: 'Method' },
                                ].map(col => (
                                    <th
                                        key={col.key}
                                        onClick={() => col.key !== '_card' && toggleSort(col.key)}
                                        className={`p-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${col.key !== '_card' ? 'cursor-pointer hover:text-slate-300' : ''}`}
                                    >
                                        <span className="flex items-center gap-1">
                                            {col.label}
                                            <SortIcon column={col.key} />
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {(() => {
                                const renderRow = (reg) => (
                                    <tr key={reg.id}
                                        onClick={() => setSelected(reg)}
                                        className="hover:bg-white/5 transition-colors cursor-pointer">
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="text-slate-300">{formatDate(reg.created_at)}</div>
                                            <div className="text-slate-500 text-xs">{formatTime(reg.created_at)}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-white font-medium truncate max-w-[200px]">{reg.customer_name || '—'}</div>
                                            <div className="text-slate-500 text-xs truncate max-w-[200px]">{reg.customer_email || '—'}</div>
                                        </td>
                                        <td className="p-4">
                                            <ProgramBadge program={reg.program} />
                                        </td>
                                        <td className="p-4 text-slate-300 text-xs">
                                            {reg.program_variant
                                                ? <span className="font-mono">{reg.program_variant}</span>
                                                : <span className="text-slate-500">—</span>}
                                        </td>
                                        <td className="p-4 text-white font-bold whitespace-nowrap">{formatAUD(reg.amount_total_cents)}</td>
                                        <td className="p-4">
                                            <PaymentBadge status={reg.payment_status} />
                                        </td>
                                        <td className="p-4">
                                            {reg.card_brand && reg.card_last4 ? (
                                                <div className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
                                                    {reg.card_brand} •••• {reg.card_last4}
                                                </div>
                                            ) : (
                                                <span className="text-slate-500 text-xs">—</span>
                                            )}
                                        </td>
                                    </tr>
                                );

                                if (!groupedFiltered) return filtered.map(renderRow);

                                return groupedFiltered.flatMap(([programKey, regs]) => {
                                    const cfg = programDisplay(programKey);
                                    return [
                                        <tr key={`__header_${programKey}`} className="bg-white/[0.04]">
                                            <td colSpan={7} className="px-4 py-2.5">
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${cfg.accent}`}>
                                                        {cfg.label}
                                                    </span>
                                                    <span className="text-[11px] text-slate-500">
                                                        {regs.length} {regs.length === 1 ? 'registration' : 'registrations'}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>,
                                        ...regs.map(renderRow),
                                    ];
                                });
                            })()}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-500 text-sm">No registrations match your filters</p>
                    </div>
                )}
            </div>

            {/* Detail drawer */}
            <AnimatePresence>
                {selected && (
                    <RegistrationDetailDrawer
                        registration={selected}
                        onClose={() => setSelected(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, accent, iconColor }) => (
    <div className={`relative bg-gradient-to-br ${accent} border border-white/10 rounded-2xl p-4 overflow-hidden`}>
        <div className="flex items-start justify-between">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-2xl font-black text-white">{value}</p>
            </div>
            <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
    </div>
);

const FilterSelect = ({ value, onChange, options }) => (
    <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 pr-9 text-white text-sm focus:outline-none focus:border-rr-pink/50 cursor-pointer"
        >
            {options.map(o => <option key={o.value} value={o.value} className="bg-slate-900">{o.label}</option>)}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
);

const ProgramBadge = ({ program }) => {
    const cfg = programDisplay(program);
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.accent}`}>
            {cfg.short}
        </span>
    );
};

const PaymentBadge = ({ status }) => {
    const cfg = status === 'completed'
        ? { cls: 'bg-green-500/10 text-green-400', label: 'Paid' }
        : status === 'pending'
            ? { cls: 'bg-amber-500/10 text-amber-400', label: 'Pending' }
            : status === 'refunded'
                ? { cls: 'bg-slate-500/10 text-slate-400', label: 'Refunded' }
                : { cls: 'bg-slate-500/10 text-slate-400', label: status || 'Unknown' };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.cls}`}>
            {cfg.label}
        </span>
    );
};

const RegistrationDetailDrawer = ({ registration, onClose }) => {
    const r = registration;
    const items = r.items || [];
    const cfg = programDisplay(r.program);
    const addr = r.shipping_address;

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl bg-slate-950 border-l border-white/10 overflow-y-auto"
            >
                <div className="sticky top-0 bg-slate-950/95 backdrop-blur border-b border-white/5 p-6 flex items-center justify-between z-10">
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">{cfg.label}</p>
                        <h2 className="text-xl font-black text-white tracking-wide">{r.customer_name || 'Unknown customer'}</h2>
                        <p className="text-slate-400 text-xs mt-1 font-mono">{r.id}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-2">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Quick status */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Program</p>
                            <ProgramBadge program={r.program} />
                            {r.program_variant && (
                                <p className="text-slate-400 text-xs mt-2 font-mono">{r.program_variant}</p>
                            )}
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Payment</p>
                            <PaymentBadge status={r.payment_status} />
                            {r.paid_at && (
                                <p className="text-slate-400 text-xs mt-2">{formatDateTime(r.paid_at)}</p>
                            )}
                        </div>
                    </div>

                    {/* Reclassify */}
                    <ReclassifySection registration={r} />

                    {/* Customer */}
                    <Section title="Customer">
                        <Field label="Name" value={r.customer_name} />
                        <Field label="Email" value={r.customer_email} copyable />
                        <Field label="Phone" value={r.customer_phone} copyable />
                        <Field label="Registered" value={formatDateTime(r.created_at)} />
                        {r.program_label && <Field label="Program label" value={r.program_label} />}
                    </Section>

                    {/* Items */}
                    {items.length > 0 && (
                        <Section title={`Line items (${items.length})`}>
                            <div className="space-y-2">
                                {items.map((i, idx) => (
                                    <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                                        <div className="min-w-0">
                                            <p className="text-white font-medium text-sm truncate">{i.description || i.name || '—'}</p>
                                            <p className="text-slate-500 text-xs">
                                                Qty: <span className="text-slate-300">{i.quantity || 1}</span>
                                                {i.price_id && <> · <span className="font-mono text-[10px]">{i.price_id}</span></>}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0 ml-3">
                                            <p className="text-white text-sm font-bold">{formatAUD(i.total)}</p>
                                            {i.unit_price != null && <p className="text-slate-500 text-xs">{formatAUD(i.unit_price)} ea</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Address (programs rarely have one but Stripe sometimes captures it) */}
                    {addr && (
                        <Section title="Address" icon={MapPin}>
                            <Field
                                label="Address"
                                value={[
                                    addr.line1,
                                    addr.line2,
                                    `${addr.city || ''} ${addr.state || ''} ${addr.postal_code || ''}`.trim(),
                                    addr.country,
                                ].filter(Boolean).join('\n')}
                                multiline
                            />
                        </Section>
                    )}

                    {/* Totals */}
                    <Section title="Totals">
                        <Field label="Subtotal" value={formatAUD(r.amount_subtotal_cents)} />
                        <Field label="Shipping" value={formatAUD(r.amount_shipping_cents)} />
                        <Field label="Tax" value={formatAUD(r.amount_tax_cents)} />
                        <div className="pt-2 mt-2 border-t border-white/5">
                            <Field label="Total" value={formatAUD(r.amount_total_cents)} bold />
                        </div>
                    </Section>

                    {/* Stripe */}
                    <Section title="Stripe Payment" icon={CreditCard}>
                        {!r.stripe_session_id ? (
                            <p className="text-slate-500 text-sm italic">No Stripe session linked yet — registration created but payment not completed.</p>
                        ) : (
                            <>
                                <Field label="Session ID" value={r.stripe_session_id} copyable mono />
                                <Field label="Charge ID" value={r.stripe_charge_id} copyable mono />
                                <Field label="Payment intent" value={r.stripe_payment_intent_id} copyable mono />
                                <Field
                                    label="Card"
                                    value={
                                        r.card_brand && r.card_last4
                                            ? `${r.card_brand.toUpperCase()} •••• ${r.card_last4}${r.card_country ? ` (${r.card_country})` : ''}${r.card_funding ? ` · ${r.card_funding}` : ''}`
                                            : '—'
                                    }
                                />
                                <Field label="Paid at" value={r.paid_at ? formatDateTime(r.paid_at) : '—'} />
                                {r.receipt_url && (
                                    <a href={r.receipt_url} target="_blank" rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 text-rr-pink hover:text-rr-pink/80 text-xs font-bold mt-2">
                                        View Stripe receipt <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}

                                <div className="flex items-center gap-3 mt-3">
                                    <a
                                        href={`https://dashboard.stripe.com/payments/${r.stripe_charge_id || r.stripe_session_id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
                                    >
                                        Open in Stripe Dashboard <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </>
                        )}
                    </Section>

                    {/* Stripe metadata (raw) */}
                    {r.stripe_metadata && Object.keys(r.stripe_metadata).length > 0 && (
                        <Section title="Stripe Metadata">
                            <pre className="bg-black/40 border border-white/5 rounded-lg p-3 text-[11px] text-slate-300 font-mono overflow-x-auto">
{JSON.stringify(r.stripe_metadata, null, 2)}
                            </pre>
                        </Section>
                    )}
                </div>
            </motion.div>
        </>
    );
};

const Section = ({ title, icon: Icon, children }) => (
    <div>
        <div className="flex items-center gap-2 mb-3">
            {Icon && <Icon className="w-4 h-4 text-rr-pink" />}
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{title}</h3>
        </div>
        <div className="space-y-2">{children}</div>
    </div>
);

const ReclassifySection = ({ registration }) => {
    const [open, setOpen] = useState(false);
    const [target, setTarget] = useState(registration.program);
    const [reason, setReason] = useState('');
    const [state, setState] = useState({ status: 'idle', message: '' });

    const submit = async () => {
        if (target === registration.program) {
            setState({ status: 'error', message: 'Pick a different program first' });
            return;
        }
        setState({ status: 'saving', message: '' });
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Not signed in');
            const res = await fetch('/api/reclassify-registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ id: registration.id, new_program: target, reason: reason || null }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
            setState({ status: 'done', message: `Moved from ${data.from} → ${data.to}. Refresh to see updated list.` });
        } catch (err) {
            setState({ status: 'error', message: err.message });
        }
    };

    const programOptions = [
        { value: 'elite',            label: 'Elite Program' },
        { value: 'junior_royals',    label: 'Junior Royals' },
        { value: 'holiday',          label: 'Holiday Programs' },
        { value: 'female_kickstart', label: 'Female Kickstart' },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Shuffle className="w-4 h-4 text-rr-pink" />
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Reclassify</h3>
                </div>
                <button
                    onClick={() => { setOpen(o => !o); setState({ status: 'idle', message: '' }); }}
                    className="text-xs font-bold text-slate-400 hover:text-white px-2 py-1 rounded-md hover:bg-white/5"
                >
                    {open ? 'Cancel' : 'Move to different program'}
                </button>
            </div>
            {open && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
                    <p className="text-[11px] text-slate-500">
                        Currently classified as <span className="text-slate-300 font-bold">{registration.program}</span>.
                        Cross-table moves (e.g. into shop_orders) are not yet supported here — re-run "Sync from Stripe" instead.
                    </p>
                    <select
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rr-pink/50"
                    >
                        {programOptions.map(p => (
                            <option key={p.value} value={p.value} className="bg-slate-900">{p.label}{p.value === registration.program ? ' (current)' : ''}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Reason (optional, recorded in audit log)"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rr-pink/50"
                    />
                    <button
                        onClick={submit}
                        disabled={state.status === 'saving' || target === registration.program}
                        className="w-full bg-rr-pink hover:bg-rr-pink/80 text-white text-xs font-bold uppercase tracking-widest py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {state.status === 'saving' ? 'Saving…' : `Reclassify as ${target}`}
                    </button>
                    {state.message && (
                        <p className={`text-xs ${state.status === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
                            {state.message}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

const Field = ({ label, value, bold, mono, multiline, copyable }) => {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };
    return (
        <div className="flex items-start justify-between gap-3 py-1">
            <span className="text-xs text-slate-500 shrink-0 pt-0.5">{label}</span>
            <span className={`text-right text-sm break-all ${bold ? 'text-white font-bold' : 'text-slate-200'} ${mono ? 'font-mono text-xs' : ''} ${multiline ? 'whitespace-pre-line' : ''}`}>
                {value || '—'}
                {copyable && value && (
                    <button onClick={copy} className="ml-2 text-slate-500 hover:text-rr-pink text-xs">
                        {copied ? <CheckCircle2 className="w-3 h-3 inline" /> : 'copy'}
                    </button>
                )}
            </span>
        </div>
    );
};

export default ProgramRegistrationsDashboard;
