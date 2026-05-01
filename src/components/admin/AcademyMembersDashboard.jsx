import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Download, ChevronDown, ChevronUp, X, RefreshCw,
    DollarSign, Users, Trophy, AlertCircle, Heart, Crown,
    ShoppingBag, GraduationCap, Sun, Sparkles, Calendar,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const TZ = 'Australia/Melbourne';

const formatAUD = (cents) => {
    if (cents == null) return '—';
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(Number(cents) / 100);
};

const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-AU', { timeZone: TZ, day: '2-digit', month: 'short', year: 'numeric' });
};

const PROGRAM_DISPLAY = {
    elite:            { label: 'Elite Program',    short: 'Elite',    icon: Crown,           accent: 'bg-rr-pink/15 text-rr-pink border-rr-pink/20' },
    junior_royals:    { label: 'Junior Royals',    short: 'Junior',   icon: GraduationCap,   accent: 'bg-blue-400/15 text-blue-300 border-blue-400/20' },
    holiday:          { label: 'Holiday Programs', short: 'Holiday',  icon: Sun,             accent: 'bg-amber-400/15 text-amber-300 border-amber-400/20' },
    female_kickstart: { label: 'Female Kickstart', short: 'Kickstart', icon: Sparkles,       accent: 'bg-fuchsia-400/15 text-fuchsia-300 border-fuchsia-400/20' },
    shop:             { label: 'Shop Order',       short: 'Shop',     icon: ShoppingBag,     accent: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/20' },
};

const PAYMENT_TYPE_LABEL = {
    one_off:              'One-off',
    installment:          'Installment plan',
    installment_4pay:     '4-pay Flexi',
    installment_tailored: 'Tailored plan',
    subsidised:           'Subsidised',
};

const ProgramBadge = ({ program }) => {
    const cfg = PROGRAM_DISPLAY[program] || { label: program, short: program, icon: Trophy, accent: 'bg-slate-500/15 text-slate-300 border-slate-500/20' };
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${cfg.accent}`}>
            <Icon className="w-3 h-3" />
            {cfg.short}
        </span>
    );
};

const AcademyMembersDashboard = () => {
    const [rows, setRows] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [programFilter, setProgramFilter] = useState('all');
    const [paymentTypeFilter, setPaymentTypeFilter] = useState('all');
    const [sortKey, setSortKey] = useState('last_paid_at');
    const [sortDir, setSortDir] = useState('desc');
    const [selected, setSelected] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Not signed in');
            const res = await fetch('/api/academy-members', {
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
            setRows(data.rows || []);
            setSummary(data.summary || null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const filtered = useMemo(() => {
        let r = rows;
        if (programFilter !== 'all') r = r.filter(x => (x.programs || []).includes(programFilter));
        if (paymentTypeFilter !== 'all') r = r.filter(x => (x.payment_types || []).includes(paymentTypeFilter));
        if (search) {
            const q = search.toLowerCase();
            r = r.filter(x =>
                (x.display_name || '').toLowerCase().includes(q) ||
                (x.customer_name || '').toLowerCase().includes(q) ||
                (x.customer_email || '').toLowerCase().includes(q) ||
                (x.customer_phone || '').toLowerCase().includes(q) ||
                (x.player_name || '').toLowerCase().includes(q)
            );
        }
        r = [...r].sort((a, b) => {
            const av = a[sortKey], bv = b[sortKey];
            if (av == null) return 1;
            if (bv == null) return -1;
            const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
            return sortDir === 'asc' ? cmp : -cmp;
        });
        return r;
    }, [rows, search, programFilter, paymentTypeFilter, sortKey, sortDir]);

    const toggleSort = (key) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortKey(key); setSortDir('desc'); }
    };

    const SortIcon = ({ column }) => {
        if (sortKey !== column) return null;
        return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
    };

    const exportCSV = () => {
        const headers = ['Display Name', 'Stripe Payer Name', 'Email', 'Phone', 'Programs', 'Payment Types', 'Total Paid (AUD)', 'First Paid', 'Last Paid', '# Registrations', '# Shop Orders', 'Subsidised'];
        const lines = filtered.map(r => [
            r.display_name || '', r.customer_name || '', r.customer_email || '', r.customer_phone || '',
            (r.programs || []).join('|'), (r.payment_types || []).join('|'),
            (Number(r.total_paid_cents || 0) / 100).toFixed(2),
            r.first_paid_at || '', r.last_paid_at || '',
            r.registrations_count, r.shop_orders_count, r.is_subsidised ? 'yes' : 'no',
        ]);
        const csv = [headers, ...lines].map(r => r.map(c => `"${String(c == null ? '' : c).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `academy_members_${new Date().toISOString().split('T')[0]}.csv`;
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
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider">ACADEMY MEMBERS 2026</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {filtered.length} of {rows.length} members
                        <span className="text-slate-600"> · source of truth: paid in Stripe + active subsidies</span>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchData}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-wider"
                    >
                        <RefreshCw className="w-3.5 h-3.5" /> Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-red-400 text-sm font-bold">Failed to load members</p>
                        <p className="text-red-400/70 text-xs mt-1">{error}</p>
                    </div>
                </div>
            )}

            {summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatCard icon={Users} label="Total members" value={summary.total_members} accent="from-rr-pink/20 to-rr-blue/10" iconColor="text-rr-pink" />
                    <StatCard icon={DollarSign} label="Total revenue" value={formatAUD(summary.total_revenue_cents)} accent="from-green-500/20 to-emerald-500/10" iconColor="text-green-400" />
                    <StatCard icon={Trophy} label="Programs covered" value={Object.keys(summary.by_program || {}).length} accent="from-blue-500/20 to-indigo-500/10" iconColor="text-blue-400" />
                    <StatCard icon={Heart} label="Subsidised" value={summary.subsidised_members} accent="from-fuchsia-500/20 to-pink-500/10" iconColor="text-fuchsia-300" />
                </div>
            )}

            {/* Per-program breakdown */}
            {summary?.by_program && Object.keys(summary.by_program).length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.entries(summary.by_program).sort((a, b) => b[1] - a[1]).map(([key, count]) => {
                        const cfg = PROGRAM_DISPLAY[key] || { short: key, icon: Trophy };
                        const Icon = cfg.icon;
                        return (
                            <button
                                key={key}
                                onClick={() => setProgramFilter(programFilter === key ? 'all' : key)}
                                className={`text-left bg-white/5 border rounded-xl p-3 transition-all hover:bg-white/10 ${
                                    programFilter === key ? 'border-rr-pink/50 ring-1 ring-rr-pink/30' : 'border-white/10'
                                }`}
                            >
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <Icon className="w-3 h-3" /> {cfg.short || key}
                                </p>
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
                        placeholder="Search name, email, phone..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-rr-pink/50"
                    />
                </div>

                <select
                    value={programFilter}
                    onChange={(e) => setProgramFilter(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-rr-pink/50"
                >
                    <option value="all" className="bg-slate-900">All programs</option>
                    {Object.entries(PROGRAM_DISPLAY).map(([k, v]) => (
                        <option key={k} value={k} className="bg-slate-900">{v.label}</option>
                    ))}
                </select>

                <select
                    value={paymentTypeFilter}
                    onChange={(e) => setPaymentTypeFilter(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-rr-pink/50"
                >
                    <option value="all" className="bg-slate-900">All payment types</option>
                    {Object.entries(PAYMENT_TYPE_LABEL).map(([k, v]) => (
                        <option key={k} value={k} className="bg-slate-900">{v}</option>
                    ))}
                </select>

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
                                    { key: 'display_name',     label: 'Member' },
                                    { key: '_programs',        label: 'Programs' },
                                    { key: '_payment',         label: 'Payment Type' },
                                    { key: 'total_paid_cents', label: 'Total Paid' },
                                    { key: 'last_paid_at',     label: 'Last Paid' },
                                    { key: '_count',           label: 'Reg / Shop' },
                                ].map(col => (
                                    <th
                                        key={col.key}
                                        onClick={() => !col.key.startsWith('_') && toggleSort(col.key)}
                                        className={`p-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${col.key.startsWith('_') ? '' : 'cursor-pointer hover:text-slate-300'}`}
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
                            {filtered.length === 0 && (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No members match your filters.</td></tr>
                            )}
                            {filtered.map((m) => (
                                <tr key={m.customer_email}
                                    onClick={() => setSelected(m)}
                                    className="hover:bg-white/5 transition-colors cursor-pointer">
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="text-white font-medium truncate max-w-[220px]">{m.display_name || '—'}</div>
                                            {m.is_subsidised && (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border bg-fuchsia-400/15 text-fuchsia-300 border-fuchsia-400/20">
                                                    <Heart className="w-2.5 h-2.5 mr-0.5" /> Subsidy
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-slate-500 text-xs truncate max-w-[260px]">{m.customer_email || '—'}</div>
                                        {m.player_name && m.player_name !== m.customer_name && (
                                            <div className="text-slate-600 text-[11px] mt-0.5">payer: {m.customer_name || '—'}</div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                            {(m.programs || []).map(p => <ProgramBadge key={p} program={p} />)}
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-300 text-xs">
                                        {(m.payment_types || []).map(pt => PAYMENT_TYPE_LABEL[pt] || pt).join(', ')}
                                    </td>
                                    <td className="p-4 text-white font-bold whitespace-nowrap">{formatAUD(m.total_paid_cents)}</td>
                                    <td className="p-4 text-slate-400 whitespace-nowrap text-xs">{formatDate(m.last_paid_at)}</td>
                                    <td className="p-4 text-slate-400 text-xs whitespace-nowrap">{m.registrations_count} / {m.shop_orders_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail panel */}
            <AnimatePresence>
                {selected && <MemberDetail member={selected} onClose={() => setSelected(null)} />}
            </AnimatePresence>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, accent, iconColor }) => (
    <div className={`relative bg-gradient-to-br ${accent} border border-white/10 rounded-2xl p-4 overflow-hidden`}>
        <div className="flex items-start justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
        </div>
        <p className="text-2xl font-black text-white leading-tight">{value}</p>
        <p className="text-[11px] font-bold text-slate-300/70 uppercase tracking-widest mt-1">{label}</p>
    </div>
);

const MemberDetail = ({ member, onClose }) => (
    <>
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
        <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-xl bg-rr-dark z-50 overflow-y-auto"
        >
            <div className="sticky top-0 bg-rr-dark border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h2 className="font-black text-white truncate">{member.display_name || '—'}</h2>
                        {member.is_subsidised && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-fuchsia-400/15 text-fuchsia-300 border-fuchsia-400/20">
                                <Heart className="w-3 h-3 mr-1" /> Subsidy
                            </span>
                        )}
                    </div>
                    <p className="text-slate-400 text-xs truncate">{member.customer_email}</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-6 space-y-6">
                <section>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Contact</p>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1.5 text-sm">
                        <div className="flex justify-between"><span className="text-slate-500">Stripe payer</span><span className="text-white">{member.customer_name || '—'}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="text-white">{member.customer_email || '—'}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Phone</span><span className="text-white">{member.customer_phone || '—'}</span></div>
                        {member.player_name && <div className="flex justify-between"><span className="text-slate-500">Player name</span><span className="text-white">{member.player_name}</span></div>}
                    </div>
                </section>

                <section>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Programs</p>
                    <div className="flex flex-wrap gap-1.5">
                        {(member.programs || []).map(p => <ProgramBadge key={p} program={p} />)}
                    </div>
                    {member.program_labels?.length > 0 && (
                        <ul className="mt-3 space-y-1 text-xs text-slate-400">
                            {member.program_labels.map((l, i) => <li key={i}>· {l}</li>)}
                        </ul>
                    )}
                </section>

                <section>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Payment summary</p>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1.5 text-sm">
                        <div className="flex justify-between"><span className="text-slate-500">Total paid</span><span className="text-white font-bold">{formatAUD(member.total_paid_cents)}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Payment types</span><span className="text-white">{(member.payment_types || []).map(pt => PAYMENT_TYPE_LABEL[pt] || pt).join(', ') || '—'}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">First paid</span><span className="text-white">{formatDate(member.first_paid_at)}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Last paid</span><span className="text-white">{formatDate(member.last_paid_at)}</span></div>
                    </div>
                </section>

                {member.registrations?.length > 0 && (
                    <section>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Program registrations ({member.registrations.length})</p>
                        <div className="space-y-2">
                            {member.registrations.map((r) => (
                                <div key={r.id} className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs">
                                    <div className="flex items-center justify-between mb-1">
                                        <ProgramBadge program={r.program} />
                                        <span className="text-white font-bold">{formatAUD(r.amount_cents)}</span>
                                    </div>
                                    <p className="text-slate-400">{r.label || '—'}</p>
                                    <p className="text-slate-600 mt-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(r.paid_at)}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {member.shop_orders?.length > 0 && (
                    <section>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Shop orders ({member.shop_orders.length})</p>
                        <div className="space-y-2">
                            {member.shop_orders.map((o) => (
                                <div key={o.id} className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs">
                                    <div className="flex items-center justify-between">
                                        <ProgramBadge program="shop" />
                                        <span className="text-white font-bold">{formatAUD(o.total_cents)}</span>
                                    </div>
                                    <p className="text-slate-600 mt-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(o.paid_at)}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {member.subsidies?.length > 0 && (
                    <section>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Subsidies</p>
                        <div className="space-y-2">
                            {member.subsidies.map((s) => (
                                <div key={s.id} className="bg-fuchsia-500/5 border border-fuchsia-500/20 rounded-xl p-3 text-xs">
                                    <div className="flex items-center justify-between mb-1">
                                        <ProgramBadge program={s.program} />
                                        <span className="text-fuchsia-300 font-bold uppercase tracking-widest text-[10px]">Subsidy</span>
                                    </div>
                                    <p className="text-slate-300">{s.reason || '—'}</p>
                                    <p className="text-slate-600 mt-1">since {formatDate(s.created_at)}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </motion.div>
    </>
);

export default AcademyMembersDashboard;
