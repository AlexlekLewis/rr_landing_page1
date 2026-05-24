// ============================================================
// HolidaySubProgramDashboard — admin view for a single holiday program
// Route: /rramadmin_26/holiday/:programSlug
// ============================================================
// Driven by the holiday_program_sheets config table. Looks up the program
// by URL slug, then reads registrations from the configured source_table.
// Designed for tracking + uniform distribution: shows everyone signed up,
// what shirt size they need, who's been handed their shirt, who's paid.
//
// Adding a new holiday program is a config change, not a code change:
//   INSERT INTO holiday_program_sheets (program_slug, source_table, ...)
// → sidebar auto-picks it up + this page renders for the new slug.
// ============================================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, MapPin, Shirt, CheckCircle2, Clock, AlertCircle,
    DollarSign, Users, ExternalLink, X, Mail, Phone, ChevronDown, ChevronUp,
    Package, Calendar, FileText, ArrowLeft, RefreshCw,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useRealtimeSync from '../../hooks/useRealtimeSync';

const TZ = 'Australia/Melbourne';
const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-AU', { timeZone: TZ, day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const fmtDateTime = (iso) => iso ? new Date(iso).toLocaleString('en-AU', { timeZone: TZ, day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
const fmtAUD = (cents) => cents == null ? '—' : new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(Number(cents) / 100);

// ============================================================
// Stats card
// ============================================================
const StatCard = ({ icon: Icon, label, value, sublabel, accent = 'text-rr-pink' }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{label}</p>
            <Icon className={`w-4 h-4 ${accent}`} />
        </div>
        <p className="text-3xl font-black text-rr-dark mb-1">{value}</p>
        {sublabel && <p className="text-xs text-slate-500 font-medium">{sublabel}</p>}
    </div>
);

// ============================================================
// Uniform Fulfillment — three sub-tabs
// ============================================================
const UniformPanel = ({ rows, onTogglePlayer }) => {
    const [view, setView] = useState('by_size'); // 'by_size' | 'by_location' | 'tracking'

    // Players who need a shirt = has_shirt is false AND a shirt_size is selected
    const playersNeedingShirt = useMemo(
        () => rows.filter(r => r.has_shirt !== true && r.shirt_size && !r.on_waitlist),
        [rows]
    );

    // ============================================================
    // BY SIZE — for the supplier order
    // ============================================================
    const bySizeBreakdown = useMemo(() => {
        const map = new Map();
        for (const r of playersNeedingShirt) {
            const key = r.shirt_size || '?';
            if (!map.has(key)) map.set(key, { size: key, total: 0, byLocation: {} });
            const entry = map.get(key);
            entry.total += 1;
            entry.byLocation[r.location] = (entry.byLocation[r.location] || 0) + 1;
        }
        return Array.from(map.values()).sort((a, b) => a.size.localeCompare(b.size, undefined, { numeric: true }));
    }, [playersNeedingShirt]);

    // ============================================================
    // BY LOCATION — distribution day pickup list
    // ============================================================
    const byLocation = useMemo(() => {
        const map = new Map();
        for (const r of playersNeedingShirt) {
            const loc = r.location || 'unknown';
            if (!map.has(loc)) map.set(loc, []);
            map.get(loc).push(r);
        }
        for (const list of map.values()) {
            list.sort((a, b) => (a.player_name || '').localeCompare(b.player_name || ''));
        }
        return Array.from(map.entries());
    }, [playersNeedingShirt]);

    const totalShirtsNeeded = playersNeedingShirt.length;
    const distributed = playersNeedingShirt.filter(r => r.shirt_distributed).length;
    const pendingDistribution = totalShirtsNeeded - distributed;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-lg font-black text-rr-dark uppercase tracking-wide flex items-center gap-2">
                        <Shirt className="w-5 h-5 text-rr-pink" /> Uniform Fulfillment
                    </h2>
                    <p className="text-sm text-slate-500 font-medium mt-0.5">
                        {totalShirtsNeeded} shirts ordered · {distributed} handed out · {pendingDistribution} pending
                    </p>
                </div>
                <div className="inline-flex bg-slate-100 rounded-full p-1 text-sm">
                    {[
                        { id: 'by_size', label: 'By Size' },
                        { id: 'by_location', label: 'By Location' },
                        { id: 'tracking', label: 'Distribution' },
                    ].map(t => (
                        <button
                            key={t.id}
                            onClick={() => setView(t.id)}
                            className={`px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-xs transition-all ${
                                view === t.id ? 'bg-rr-dark text-white shadow' : 'text-slate-600 hover:text-rr-dark'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-6">
                {view === 'by_size' && (
                    bySizeBreakdown.length === 0
                        ? <EmptyHint message="No shirts ordered yet. Once registrations come in with shirt sizes, totals will appear here." />
                        : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">
                                            <th className="py-3 pr-4">Size</th>
                                            <th className="py-3 pr-4 text-center">Total to Order</th>
                                            <th className="py-3 pr-4">Per Location</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bySizeBreakdown.map(row => (
                                            <tr key={row.size} className="border-b border-slate-100">
                                                <td className="py-3 pr-4 font-black text-rr-dark text-base">{row.size}</td>
                                                <td className="py-3 pr-4 text-center">
                                                    <span className="inline-flex items-center justify-center min-w-[2.5rem] h-8 px-3 rounded-full bg-rr-pink/10 text-rr-pink font-black">
                                                        {row.total}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-4 text-rr-charcoal">
                                                    {Object.entries(row.byLocation).map(([loc, count]) => (
                                                        <span key={loc} className="inline-flex items-center gap-1 mr-3 text-xs font-bold">
                                                            <MapPin className="w-3 h-3 text-slate-400" />
                                                            {loc} <span className="text-slate-500">×{count}</span>
                                                        </span>
                                                    ))}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="bg-slate-50 font-black">
                                            <td className="py-3 pr-4 text-rr-dark uppercase tracking-widest text-xs">Total order</td>
                                            <td className="py-3 pr-4 text-center text-rr-pink text-xl">{totalShirtsNeeded}</td>
                                            <td />
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )
                )}

                {view === 'by_location' && (
                    byLocation.length === 0
                        ? <EmptyHint message="No registrations needing shirts yet." />
                        : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {byLocation.map(([loc, list]) => (
                                    <div key={loc} className="border border-slate-200 rounded-xl p-5 bg-slate-50/30">
                                        <div className="flex items-center gap-2 mb-4">
                                            <MapPin className="w-4 h-4 text-rr-pink" />
                                            <h3 className="font-black text-rr-dark uppercase tracking-widest text-sm">{loc}</h3>
                                            <span className="ml-auto text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-1">
                                                {list.length} player{list.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <ul className="space-y-2 text-sm">
                                            {list.map(r => (
                                                <li key={r.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors">
                                                    <button
                                                        onClick={() => onTogglePlayer(r)}
                                                        className={`flex-none w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                                            r.shirt_distributed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-rr-pink bg-white'
                                                        }`}
                                                        title={r.shirt_distributed ? 'Mark as not distributed' : 'Mark as distributed'}
                                                    >
                                                        {r.shirt_distributed && <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />}
                                                    </button>
                                                    <span className={`flex-1 font-bold ${r.shirt_distributed ? 'text-slate-400 line-through' : 'text-rr-dark'}`}>
                                                        {r.player_name}
                                                    </span>
                                                    <span className="font-black text-rr-pink text-xs bg-rr-pink/10 rounded-full px-2 py-0.5">
                                                        {r.shirt_size}
                                                    </span>
                                                    <span className="text-xs text-slate-500">{r.parent_phone}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )
                )}

                {view === 'tracking' && (
                    playersNeedingShirt.length === 0
                        ? <EmptyHint message="No registrations to track yet." />
                        : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">
                                            <th className="py-3 pr-4">Done</th>
                                            <th className="py-3 pr-4">Player</th>
                                            <th className="py-3 pr-4">Location</th>
                                            <th className="py-3 pr-4">Size</th>
                                            <th className="py-3 pr-4">Distributed At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {playersNeedingShirt.map(r => (
                                            <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="py-2 pr-4">
                                                    <button
                                                        onClick={() => onTogglePlayer(r)}
                                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                                            r.shirt_distributed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-rr-pink bg-white'
                                                        }`}
                                                    >
                                                        {r.shirt_distributed && <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />}
                                                    </button>
                                                </td>
                                                <td className={`py-2 pr-4 font-bold ${r.shirt_distributed ? 'text-slate-400 line-through' : 'text-rr-dark'}`}>{r.player_name}</td>
                                                <td className="py-2 pr-4 text-rr-charcoal">{r.location}</td>
                                                <td className="py-2 pr-4 font-black text-rr-pink">{r.shirt_size}</td>
                                                <td className="py-2 pr-4 text-xs text-slate-500">{fmtDateTime(r.shirt_distributed_at)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                )}
            </div>
        </div>
    );
};

const EmptyHint = ({ message }) => (
    <div className="text-center py-10 text-slate-400 font-medium text-sm">{message}</div>
);

// ============================================================
// Main table row
// ============================================================
const PaymentBadge = ({ status }) => {
    const map = {
        completed: { label: 'Paid', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
        pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
    };
    const s = map[status] || { label: status || '—', cls: 'bg-slate-100 text-slate-600 border-slate-200' };
    return <span className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${s.cls}`}>{s.label}</span>;
};

const HolidaySubProgramDashboard = () => {
    const { programSlug } = useParams();
    const [config, setConfig] = useState(null);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [locationFilter, setLocationFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [selected, setSelected] = useState(null);

    // Load program config
    const loadConfig = useCallback(async () => {
        const { data, error } = await supabase
            .from('holiday_program_sheets')
            .select('*')
            .eq('program_slug', programSlug)
            .maybeSingle();
        if (error) {
            setError(error.message);
            return null;
        }
        if (!data) {
            setError(`No program config found for slug "${programSlug}". Add a row to holiday_program_sheets.`);
            return null;
        }
        setConfig(data);
        return data;
    }, [programSlug]);

    // Load registrations from the configured source_table
    const loadRows = useCallback(async (cfg) => {
        if (!cfg?.source_table) return;
        setError(null);
        const { data, error } = await supabase
            .from(cfg.source_table)
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            setError(`Could not read ${cfg.source_table}: ${error.message}`);
            setRows([]);
        } else {
            setRows(data || []);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        setLoading(true);
        loadConfig().then(cfg => { if (cfg) loadRows(cfg); });
    }, [loadConfig, loadRows]);

    // Live updates whenever the source table changes
    useRealtimeSync(config?.source_table ? [config.source_table] : [], () => {
        if (config) loadRows(config);
    });

    // ============================================================
    // Toggle shirt distribution status. UPDATE fires pg_net trigger
    // → sheet row reflects new status within seconds.
    // ============================================================
    const togglePlayer = useCallback(async (player) => {
        if (!config?.source_table) return;
        const nextValue = !player.shirt_distributed;
        // Optimistic local update so the UI feels instant
        setRows(prev => prev.map(r => r.id === player.id
            ? { ...r, shirt_distributed: nextValue, shirt_distributed_at: nextValue ? new Date().toISOString() : null }
            : r
        ));
        const { error } = await supabase
            .from(config.source_table)
            .update({
                shirt_distributed: nextValue,
                shirt_distributed_at: nextValue ? new Date().toISOString() : null,
            })
            .eq('id', player.id);
        if (error) {
            console.error('Distribution toggle failed:', error);
            setError(error.message);
            loadRows(config); // revert by refetching truth
        }
    }, [config, loadRows]);

    const saveNotes = useCallback(async (player, notes) => {
        if (!config?.source_table) return;
        setRows(prev => prev.map(r => r.id === player.id ? { ...r, admin_notes: notes } : r));
        const { error } = await supabase
            .from(config.source_table)
            .update({ admin_notes: notes })
            .eq('id', player.id);
        if (error) {
            console.error('Notes save failed:', error);
            loadRows(config);
        }
    }, [config, loadRows]);

    // ============================================================
    // Derived data — stats, locations, filtered list
    // ============================================================
    const locations = useMemo(
        () => Array.from(new Set(rows.map(r => r.location).filter(Boolean))).sort(),
        [rows]
    );

    const stats = useMemo(() => {
        const paid = rows.filter(r => r.payment_status === 'completed');
        const pending = rows.filter(r => (r.payment_status || 'pending') === 'pending' && !r.on_waitlist);
        const waitlist = rows.filter(r => r.on_waitlist);
        const revenueCents = paid.reduce((s, r) => s + (Number(r.amount_paid_cents) || 0), 0);
        return {
            total: rows.length,
            paid: paid.length,
            pending: pending.length,
            waitlist: waitlist.length,
            revenue: revenueCents,
        };
    }, [rows]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return rows.filter(r => {
            if (locationFilter !== 'all' && r.location !== locationFilter) return false;
            if (paymentFilter === 'paid' && r.payment_status !== 'completed') return false;
            if (paymentFilter === 'pending' && r.payment_status === 'completed') return false;
            if (paymentFilter === 'waitlist' && !r.on_waitlist) return false;
            if (!q) return true;
            return [r.player_name, r.parent_name, r.parent_email, r.parent_phone, r.suburb, r.primary_club]
                .some(v => (v || '').toLowerCase().includes(q));
        });
    }, [rows, search, locationFilter, paymentFilter]);

    if (loading && !config) {
        return (
            <div className="p-8 text-center text-slate-500">
                <RefreshCw className="w-6 h-6 mx-auto mb-3 animate-spin" />
                Loading program…
            </div>
        );
    }

    if (error && !config) {
        return (
            <div className="p-8">
                <div className="max-w-xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                    <p className="text-red-700 font-bold mb-2">Couldn't load program</p>
                    <p className="text-red-600 text-sm">{error}</p>
                    <Link to="/rramadmin_26/program-registrations?program=holiday" className="inline-flex items-center gap-2 mt-4 text-rr-pink font-bold hover:underline">
                        <ArrowLeft className="w-4 h-4" /> Back to Holiday Programs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* HEADER */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <Link to="/rramadmin_26/program-registrations?program=holiday"
                          className="inline-flex items-center gap-1 text-xs font-black text-slate-500 uppercase tracking-widest hover:text-rr-pink transition-colors mb-2">
                        <ArrowLeft className="w-3 h-3" /> Holiday Programs
                    </Link>
                    <h1 className="text-3xl font-black text-rr-dark uppercase tracking-tight">{config.program_label}</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        {locations.length} location{locations.length !== 1 ? 's' : ''} · syncs live to Google Sheets
                    </p>
                </div>
                {config.workbook_url && (
                    <a
                        href={config.workbook_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest px-4 py-2.5 rounded-full text-xs transition-colors"
                    >
                        Open in Google Sheets <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                )}
            </div>

            {error && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {error}
                </div>
            )}

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <StatCard icon={Users} label="Total" value={stats.total} accent="text-rr-blue" />
                <StatCard icon={CheckCircle2} label="Paid" value={stats.paid} accent="text-emerald-500" />
                <StatCard icon={Clock} label="Pending" value={stats.pending} accent="text-amber-500" />
                <StatCard icon={AlertCircle} label="Waitlist" value={stats.waitlist} accent="text-slate-500" />
                <StatCard icon={DollarSign} label="Revenue" value={fmtAUD(stats.revenue)} accent="text-rr-pink" />
            </div>

            {/* UNIFORM FULFILLMENT */}
            <UniformPanel rows={rows} onTogglePlayer={togglePlayer} />

            {/* MAIN TABLE — registrations */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 flex-wrap">
                    <h2 className="text-lg font-black text-rr-dark uppercase tracking-wide mr-auto">Registrations</h2>
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search player, parent, email…"
                            className="pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rr-pink min-w-[240px]"
                        />
                    </div>
                    <select
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rr-pink font-medium"
                    >
                        <option value="all">All locations</option>
                        {locations.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <select
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                        className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rr-pink font-medium"
                    >
                        <option value="all">All payment</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="waitlist">Waitlist</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50/60 text-xs font-black text-slate-500 uppercase tracking-widest">
                            <tr>
                                <th className="text-left py-3 px-4">Player</th>
                                <th className="text-left py-3 px-4">Age</th>
                                <th className="text-left py-3 px-4">Location</th>
                                <th className="text-left py-3 px-4">Parent</th>
                                <th className="text-left py-3 px-4">Shirt</th>
                                <th className="text-left py-3 px-4">Payment</th>
                                <th className="text-left py-3 px-4">Distributed</th>
                                <th className="text-left py-3 px-4">Submitted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={8} className="py-10 text-center text-slate-400 font-medium">No registrations match the current filters.</td></tr>
                            ) : filtered.map(r => (
                                <tr
                                    key={r.id}
                                    onClick={() => setSelected(r)}
                                    className="border-t border-slate-100 hover:bg-rr-pink/5 cursor-pointer"
                                >
                                    <td className="py-3 px-4">
                                        <p className="font-bold text-rr-dark">{r.player_name}</p>
                                        <p className="text-xs text-slate-500">{r.player_gender} · {r.primary_club || '—'}</p>
                                    </td>
                                    <td className="py-3 px-4 text-rr-charcoal">{r.player_age ?? '—'}</td>
                                    <td className="py-3 px-4">
                                        <span className="inline-flex items-center gap-1 text-xs font-bold">
                                            <MapPin className="w-3 h-3 text-slate-400" /> {r.location}
                                        </span>
                                        {r.on_waitlist && <span className="ml-2 text-[10px] font-black text-amber-600 uppercase tracking-widest">Waitlist</span>}
                                    </td>
                                    <td className="py-3 px-4">
                                        <p className="font-medium text-rr-dark">{r.parent_name}</p>
                                        <p className="text-xs text-slate-500">{r.parent_email}</p>
                                    </td>
                                    <td className="py-3 px-4">
                                        {r.has_shirt ? (
                                            <span className="text-xs font-bold text-slate-500">Already has</span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 font-black text-rr-pink text-sm">
                                                <Package className="w-3 h-3" /> {r.shirt_size || '—'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4"><PaymentBadge status={r.payment_status} /></td>
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); togglePlayer(r); }}
                                            disabled={r.has_shirt}
                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                                r.has_shirt ? 'bg-slate-100 border-slate-200 cursor-not-allowed'
                                                : r.shirt_distributed ? 'bg-emerald-500 border-emerald-500'
                                                : 'border-slate-300 hover:border-rr-pink bg-white'
                                            }`}
                                            title={r.has_shirt ? "Player has own shirt — no distribution needed" : r.shirt_distributed ? "Mark as not distributed" : "Mark as distributed"}
                                        >
                                            {r.shirt_distributed && <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />}
                                        </button>
                                    </td>
                                    <td className="py-3 px-4 text-xs text-slate-500">{fmtDate(r.created_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* DETAIL DRAWER */}
            <AnimatePresence>
                {selected && (
                    <PlayerDrawer
                        player={selected}
                        onClose={() => setSelected(null)}
                        onToggle={togglePlayer}
                        onSaveNotes={saveNotes}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// ============================================================
// Detail drawer
// ============================================================
const PlayerDrawer = ({ player, onClose, onToggle, onSaveNotes }) => {
    const [notes, setNotes] = useState(player.admin_notes || '');
    const [notesDirty, setNotesDirty] = useState(false);

    useEffect(() => {
        setNotes(player.admin_notes || '');
        setNotesDirty(false);
    }, [player.id, player.admin_notes]);

    const Row = ({ label, value }) => (
        <div className="flex justify-between gap-4 py-2 border-b border-slate-100 last:border-b-0">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{label}</span>
            <span className="text-sm text-rr-dark text-right font-medium">{value || '—'}</span>
        </div>
    );

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                onClick={onClose}
            />
            <motion.div
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
            >
                <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
                    <div>
                        <h3 className="font-black text-rr-dark uppercase tracking-wide">{player.player_name}</h3>
                        <p className="text-xs text-slate-500 font-medium">{player.location} · age {player.player_age}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-rr-dark"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Distribution toggle big button */}
                    {!player.has_shirt && player.shirt_size && (
                        <button
                            onClick={() => onToggle(player)}
                            className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                                player.shirt_distributed
                                    ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-rr-pink/5 border-rr-pink/30 hover:bg-rr-pink/10'
                            }`}
                        >
                            <div className="flex items-center gap-3 text-left">
                                <Shirt className={`w-5 h-5 ${player.shirt_distributed ? 'text-emerald-600' : 'text-rr-pink'}`} />
                                <div>
                                    <p className="font-black text-rr-dark text-sm">
                                        {player.shirt_distributed ? 'Shirt handed over' : 'Mark as distributed'}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Size <strong>{player.shirt_size}</strong>
                                        {player.shirt_distributed_at && ` · ${fmtDateTime(player.shirt_distributed_at)}`}
                                    </p>
                                </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                player.shirt_distributed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'
                            }`}>
                                {player.shirt_distributed && <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />}
                            </div>
                        </button>
                    )}

                    {/* Sections */}
                    <Section icon={Users} title="Player">
                        <Row label="Name" value={player.player_name} />
                        <Row label="Age" value={player.player_age} />
                        <Row label="Cricket type" value={player.player_gender} />
                        <Row label="Primary club" value={player.primary_club} />
                        <Row label="Suburb" value={player.suburb} />
                    </Section>

                    <Section icon={Phone} title="Parent / Guardian">
                        <Row label="Name" value={player.parent_name} />
                        <Row label="Email" value={<a href={`mailto:${player.parent_email}`} className="text-rr-pink hover:underline">{player.parent_email}</a>} />
                        <Row label="Phone" value={<a href={`tel:${player.parent_phone}`} className="text-rr-pink hover:underline">{player.parent_phone}</a>} />
                    </Section>

                    <Section icon={Shirt} title="Uniform">
                        <Row label="Already has shirt" value={player.has_shirt ? 'Yes — no shirt needed' : 'No — needs supplied'} />
                        {!player.has_shirt && <Row label="Size" value={player.shirt_size} />}
                        <Row label="Distributed" value={player.shirt_distributed ? `Yes — ${fmtDateTime(player.shirt_distributed_at)}` : 'Not yet'} />
                    </Section>

                    <Section icon={DollarSign} title="Payment">
                        <Row label="Status" value={<PaymentBadge status={player.payment_status} />} />
                        <Row label="Amount" value={fmtAUD(player.amount_paid_cents)} />
                        <Row label="Paid at" value={fmtDateTime(player.paid_at)} />
                        {player.receipt_url && <Row label="Receipt" value={<a href={player.receipt_url} target="_blank" rel="noreferrer" className="text-rr-pink hover:underline inline-flex items-center gap-1">View <ExternalLink className="w-3 h-3" /></a>} />}
                    </Section>

                    <Section icon={Calendar} title="Registration">
                        <Row label="Submitted" value={fmtDateTime(player.created_at)} />
                        <Row label="Waitlist" value={player.on_waitlist ? 'Yes' : 'No'} />
                        {player.utm_source && <Row label="UTM source" value={player.utm_source} />}
                        {player.utm_campaign && <Row label="UTM campaign" value={player.utm_campaign} />}
                    </Section>

                    <Section icon={FileText} title="Admin notes">
                        <textarea
                            value={notes}
                            onChange={(e) => { setNotes(e.target.value); setNotesDirty(true); }}
                            placeholder="Private notes for admins — allergies, pickup arrangements, etc."
                            className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rr-pink min-h-[100px]"
                        />
                        {notesDirty && (
                            <button
                                onClick={() => { onSaveNotes(player, notes); setNotesDirty(false); }}
                                className="mt-2 bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest text-xs px-4 py-2 rounded-full"
                            >
                                Save notes
                            </button>
                        )}
                    </Section>
                </div>
            </motion.div>
        </>
    );
};

const Section = ({ icon: Icon, title, children }) => (
    <div>
        <div className="flex items-center gap-2 mb-2">
            <Icon className="w-4 h-4 text-rr-pink" />
            <h4 className="text-xs font-black text-rr-dark uppercase tracking-widest">{title}</h4>
        </div>
        <div className="bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-2">
            {children}
        </div>
    </div>
);

export default HolidaySubProgramDashboard;
