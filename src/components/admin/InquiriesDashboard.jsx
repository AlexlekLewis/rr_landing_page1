import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Download, ChevronDown, ChevronUp, X, RefreshCw,
    Users, MessageCircle, AlertCircle, Mail, Phone, MapPin, Calendar, Tag, Filter,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { exportToSheet, todayISO } from './exportToSheet';

const TZ = 'Australia/Melbourne';

const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-AU', { timeZone: TZ, day: '2-digit', month: 'short', year: 'numeric' });
};

const formatTime = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString('en-AU', { timeZone: TZ, hour: '2-digit', minute: '2-digit' });
};

// Friendly labels for source_type & stage; fall back to the raw value if unknown.
const SOURCE_LABEL = {
    elite_application: 'Elite Application',
    elite_waitlist:    'Elite Waitlist',
    holiday_clinic:    'Holiday Clinic',
    upcoming_interest: 'Upcoming Interest',
    general_enquiry:   'General Enquiry',
    girls_kickstart:   'Girls Kickstart',
};
const STAGE_LABEL = {
    new_lead:    'New Lead',
    contacted:   'Contacted',
    nurture:     'Nurturing',
    qualified:   'Qualified',
    waitlisted:  'Waitlisted',
    converted:   'Converted',
    lost_other:  'Lost (other)',
    lost_price:  'Lost (price)',
    lost_timing: 'Lost (timing)',
};
const STAGE_ACCENT = {
    new_lead:    'bg-blue-400/15 text-blue-300 border-blue-400/20',
    contacted:   'bg-amber-400/15 text-amber-300 border-amber-400/20',
    nurture:     'bg-violet-400/15 text-violet-300 border-violet-400/20',
    qualified:   'bg-emerald-400/15 text-emerald-300 border-emerald-400/20',
    waitlisted:  'bg-fuchsia-400/15 text-fuchsia-300 border-fuchsia-400/20',
    converted:   'bg-green-500/15 text-green-300 border-green-500/20',
    lost_other:  'bg-slate-500/15 text-slate-400 border-slate-500/20',
    lost_price:  'bg-red-500/15 text-red-400 border-red-500/20',
    lost_timing: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
};

const StageBadge = ({ stage }) => {
    const label = STAGE_LABEL[stage] || stage || '—';
    const accent = STAGE_ACCENT[stage] || 'bg-slate-500/15 text-slate-300 border-slate-500/20';
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${accent}`}>
            {label}
        </span>
    );
};

const InquiriesDashboard = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [sourceFilter, setSourceFilter] = useState('all');
    const [stageFilter, setStageFilter] = useState('all');
    const [showArchived, setShowArchived] = useState(false);
    const [sortKey, setSortKey] = useState('created_at');
    const [sortDir, setSortDir] = useState('desc');
    const [selected, setSelected] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('crm_leads')
                .select('id, created_at, updated_at, source_type, source_form, first_name, last_name, full_name, email, phone, parent_name, parent_email, parent_phone, age, dob, gender, suburb, club, experience_level, stage, priority, assigned_to, utm_source, utm_medium, utm_campaign, page_referrer, last_contacted_at, next_follow_up_at, tags, custom_fields, is_archived, archived_reason')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setRows(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const stats = useMemo(() => {
        const active = rows.filter(r => !r.is_archived);
        const bySource = {};
        const byStage = {};
        const bySuburb = {};
        for (const r of active) {
            const s = r.source_type || 'unknown';
            bySource[s] = (bySource[s] || 0) + 1;
            const st = r.stage || 'unknown';
            byStage[st] = (byStage[st] || 0) + 1;
            const sub = (r.suburb || '').trim();
            if (sub) bySuburb[sub] = (bySuburb[sub] || 0) + 1;
        }
        return {
            total: active.length,
            archived: rows.length - active.length,
            bySource, byStage,
            uniqueSuburbs: Object.keys(bySuburb).length,
        };
    }, [rows]);

    const filtered = useMemo(() => {
        let r = rows;
        if (!showArchived) r = r.filter(x => !x.is_archived);
        if (sourceFilter !== 'all') r = r.filter(x => x.source_type === sourceFilter);
        if (stageFilter !== 'all') r = r.filter(x => x.stage === stageFilter);
        if (search) {
            const q = search.toLowerCase();
            r = r.filter(x =>
                (x.full_name || '').toLowerCase().includes(q) ||
                (x.first_name || '').toLowerCase().includes(q) ||
                (x.last_name || '').toLowerCase().includes(q) ||
                (x.email || '').toLowerCase().includes(q) ||
                (x.parent_email || '').toLowerCase().includes(q) ||
                (x.phone || '').toLowerCase().includes(q) ||
                (x.parent_phone || '').toLowerCase().includes(q) ||
                (x.suburb || '').toLowerCase().includes(q) ||
                (x.club || '').toLowerCase().includes(q)
            );
        }
        r = [...r].sort((a, b) => {
            const av = a[sortKey], bv = b[sortKey];
            if (av == null) return 1;
            if (bv == null) return -1;
            if (sortKey === 'created_at' || sortKey === 'updated_at' || sortKey === 'last_contacted_at') {
                return sortDir === 'asc' ? new Date(av) - new Date(bv) : new Date(bv) - new Date(av);
            }
            const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
            return sortDir === 'asc' ? cmp : -cmp;
        });
        return r;
    }, [rows, search, sourceFilter, stageFilter, showArchived, sortKey, sortDir]);

    const toggleSort = (key) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortKey(key); setSortDir('desc'); }
    };
    const SortIcon = ({ column }) => {
        if (sortKey !== column) return null;
        return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
    };

    const [exportState, setExportState] = useState({ status: 'idle', message: '' });
    const exportToGoogleSheets = async () => {
        const headers = ['Date', 'Source', 'Form', 'Stage', 'Name', 'Email', 'Phone', 'Parent Name', 'Parent Email', 'Parent Phone', 'Age', 'Suburb', 'Club', 'UTM Source', 'UTM Campaign', 'Last Contacted', 'Next Follow-up', 'Archived'];
        const lines = filtered.map(r => [
            r.created_at || '', r.source_type || '', r.source_form || '', r.stage || '',
            r.full_name || `${r.first_name || ''} ${r.last_name || ''}`.trim(),
            r.email || '', r.phone || '',
            r.parent_name || '', r.parent_email || '', r.parent_phone || '',
            r.age || '', r.suburb || '', r.club || '',
            r.utm_source || '', r.utm_campaign || '',
            r.last_contacted_at || '', r.next_follow_up_at || '',
            r.is_archived ? 'yes' : 'no',
        ]);
        setExportState({ status: 'exporting', message: '' });
        try {
            const { url } = await exportToSheet({
                title: `Inquiries — ${todayISO()}`,
                sheet_name: 'Inquiries',
                headers,
                rows: lines,
            });
            setExportState({ status: 'done', message: 'Opened in new tab' });
            window.open(url, '_blank', 'noopener');
        } catch (err) {
            setExportState({ status: 'error', message: err.message });
        }
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

    const sourceOptions = Object.keys(stats.bySource).sort();
    const stageOptions = Object.keys(stats.byStage).sort();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider">INQUIRIES</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {filtered.length} of {stats.total} active inquiries
                        {stats.archived > 0 && <span className="text-slate-600"> · {stats.archived} archived</span>}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2 bg-white/5 border border-white/10 rounded-xl cursor-pointer">
                        <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} className="accent-rr-pink" />
                        Show archived
                    </label>
                    <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 text-xs font-bold uppercase tracking-wider">
                        <RefreshCw className="w-3.5 h-3.5" /> Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-red-400 text-sm font-bold">Failed to load inquiries</p>
                        <p className="text-red-400/70 text-xs mt-1">{error}</p>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard icon={MessageCircle} label="Active inquiries" value={stats.total} accent="from-rr-pink/20 to-rr-blue/10" iconColor="text-rr-pink" />
                <StatCard icon={Filter} label="Sources" value={Object.keys(stats.bySource).length} accent="from-blue-500/20 to-indigo-500/10" iconColor="text-blue-400" />
                <StatCard icon={Tag} label="Stages tracked" value={Object.keys(stats.byStage).length} accent="from-amber-500/20 to-yellow-500/10" iconColor="text-amber-400" />
                <StatCard icon={MapPin} label="Unique suburbs" value={stats.uniqueSuburbs} accent="from-emerald-500/20 to-green-500/10" iconColor="text-emerald-400" />
            </div>

            {/* By-source breakdown */}
            {Object.keys(stats.bySource).length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {Object.entries(stats.bySource).sort((a, b) => b[1] - a[1]).map(([key, count]) => (
                        <button
                            key={key}
                            onClick={() => setSourceFilter(sourceFilter === key ? 'all' : key)}
                            className={`text-left bg-white/5 border rounded-xl p-3 transition-all hover:bg-white/10 ${
                                sourceFilter === key ? 'border-rr-pink/50 ring-1 ring-rr-pink/30' : 'border-white/10'
                            }`}
                        >
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{SOURCE_LABEL[key] || key}</p>
                            <p className="text-xl font-black text-white">{count}</p>
                        </button>
                    ))}
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
                        placeholder="Search name, email, phone, suburb, club..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-rr-pink/50"
                    />
                </div>

                <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-rr-pink/50">
                    <option value="all" className="bg-slate-900">All sources</option>
                    {sourceOptions.map(s => <option key={s} value={s} className="bg-slate-900">{SOURCE_LABEL[s] || s}</option>)}
                </select>

                <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-rr-pink/50">
                    <option value="all" className="bg-slate-900">All stages</option>
                    {stageOptions.map(s => <option key={s} value={s} className="bg-slate-900">{STAGE_LABEL[s] || s}</option>)}
                </select>

                <button onClick={exportToGoogleSheets} disabled={exportState.status === 'exporting'} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 text-sm disabled:opacity-60" title={exportState.message}>
                    <Download className="w-4 h-4" /> {exportState.status === 'exporting' ? 'Exporting…' : 'Export to Google Sheets'}
                </button>
            </div>

            {/* Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                {[
                                    { key: 'created_at', label: 'Received' },
                                    { key: 'full_name',  label: 'Inquiry' },
                                    { key: 'source_type', label: 'Source' },
                                    { key: 'stage',      label: 'Stage' },
                                    { key: 'suburb',     label: 'Suburb' },
                                    { key: 'utm_source', label: 'UTM' },
                                ].map(col => (
                                    <th
                                        key={col.key}
                                        onClick={() => toggleSort(col.key)}
                                        className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300"
                                    >
                                        <span className="flex items-center gap-1">{col.label}<SortIcon column={col.key} /></span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.length === 0 && (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No inquiries match your filters.</td></tr>
                            )}
                            {filtered.map((r) => (
                                <tr key={r.id}
                                    onClick={() => setSelected(r)}
                                    className="hover:bg-white/5 transition-colors cursor-pointer">
                                    <td className="p-4 whitespace-nowrap">
                                        <div className="text-slate-300">{formatDate(r.created_at)}</div>
                                        <div className="text-slate-500 text-xs">{formatTime(r.created_at)}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-white font-medium truncate max-w-[200px]">
                                            {r.full_name || `${r.first_name || ''} ${r.last_name || ''}`.trim() || '—'}
                                        </div>
                                        <div className="text-slate-500 text-xs truncate max-w-[200px]">{r.email || r.parent_email || '—'}</div>
                                    </td>
                                    <td className="p-4 text-xs">
                                        <div className="text-slate-300">{SOURCE_LABEL[r.source_type] || r.source_type || '—'}</div>
                                        {r.source_form && <div className="text-slate-600 text-[10px] mt-0.5">{r.source_form}</div>}
                                    </td>
                                    <td className="p-4"><StageBadge stage={r.stage} /></td>
                                    <td className="p-4 text-slate-400 text-xs">{r.suburb || '—'}</td>
                                    <td className="p-4 text-slate-400 text-xs">
                                        {r.utm_source ? <span className="font-mono">{r.utm_source}</span> : <span className="text-slate-600">—</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {selected && <InquiryDetail row={selected} onClose={() => setSelected(null)} />}
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

const InquiryDetail = ({ row, onClose }) => (
    <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-xl bg-rr-dark z-50 overflow-y-auto"
        >
            <div className="sticky top-0 bg-rr-dark border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h2 className="font-black text-white truncate">{row.full_name || `${row.first_name || ''} ${row.last_name || ''}`.trim() || '—'}</h2>
                        <StageBadge stage={row.stage} />
                    </div>
                    <p className="text-slate-400 text-xs">{SOURCE_LABEL[row.source_type] || row.source_type || '—'} · {formatDate(row.created_at)} {formatTime(row.created_at)}</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-6 space-y-6">
                <Section label="Contact">
                    <Field icon={Mail} label="Email" value={row.email || '—'} />
                    <Field icon={Phone} label="Phone" value={row.phone || '—'} />
                    {row.parent_name && <Field label="Parent" value={row.parent_name} />}
                    {row.parent_email && <Field icon={Mail} label="Parent email" value={row.parent_email} />}
                    {row.parent_phone && <Field icon={Phone} label="Parent phone" value={row.parent_phone} />}
                </Section>

                <Section label="Player">
                    <Field label="Age" value={row.age || '—'} />
                    {row.dob && <Field label="DOB" value={formatDate(row.dob)} />}
                    {row.gender && <Field label="Gender" value={row.gender} />}
                    {row.experience_level && <Field label="Experience" value={row.experience_level} />}
                </Section>

                <Section label="Location">
                    <Field icon={MapPin} label="Suburb" value={row.suburb || '—'} />
                    {row.club && <Field label="Club" value={row.club} />}
                </Section>

                <Section label="Pipeline">
                    <Field label="Source form" value={row.source_form || '—'} />
                    <Field label="Stage" value={STAGE_LABEL[row.stage] || row.stage || '—'} />
                    {row.priority && <Field label="Priority" value={row.priority} />}
                    {row.assigned_to && <Field label="Assigned to" value={row.assigned_to} />}
                    {row.last_contacted_at && <Field icon={Calendar} label="Last contacted" value={formatDate(row.last_contacted_at)} />}
                    {row.next_follow_up_at && <Field icon={Calendar} label="Next follow-up" value={formatDate(row.next_follow_up_at)} />}
                </Section>

                {(row.utm_source || row.utm_campaign || row.utm_medium || row.page_referrer) && (
                    <Section label="Attribution">
                        {row.utm_source && <Field label="UTM source" value={row.utm_source} />}
                        {row.utm_medium && <Field label="UTM medium" value={row.utm_medium} />}
                        {row.utm_campaign && <Field label="UTM campaign" value={row.utm_campaign} />}
                        {row.page_referrer && <Field label="Referrer" value={row.page_referrer} />}
                    </Section>
                )}

                {Array.isArray(row.tags) && row.tags.length > 0 && (
                    <Section label="Tags">
                        <div className="flex flex-wrap gap-1.5">
                            {row.tags.map((t, i) => <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/10 text-slate-300 border border-white/20">{t}</span>)}
                        </div>
                    </Section>
                )}

                {row.is_archived && (
                    <Section label="Archived">
                        <Field label="Reason" value={row.archived_reason || '—'} />
                    </Section>
                )}
            </div>
        </motion.div>
    </>
);

const Section = ({ label, children }) => (
    <section>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1.5 text-sm">{children}</div>
    </section>
);

const Field = ({ icon: Icon, label, value }) => (
    <div className="flex justify-between items-center">
        <span className="text-slate-500 text-xs flex items-center gap-1.5">
            {Icon && <Icon className="w-3 h-3" />}
            {label}
        </span>
        <span className="text-white text-sm">{value}</span>
    </div>
);

export default InquiriesDashboard;
