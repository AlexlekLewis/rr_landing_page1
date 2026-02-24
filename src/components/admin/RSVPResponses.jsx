import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useRealtimeSync from '../../hooks/useRealtimeSync';
import {
    ClipboardList, Users, CheckCircle2, HelpCircle, XCircle, Clock,
    Search, ChevronDown, ChevronUp, Mail, User, Filter
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const OPTION_LABELS = {
    1: 'Yes — Available Sunday',
    2: 'Yes — Unavailable Sunday',
    3: 'Considering',
    4: 'Declined',
};

const OPTION_COLORS = {
    1: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-500' },
    2: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-500' },
    3: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-500' },
    4: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', dot: 'bg-red-500' },
};

const OPTION_ICONS = {
    1: CheckCircle2,
    2: Clock,
    3: HelpCircle,
    4: XCircle,
};

const StatCard = ({ label, value, icon: Icon, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${OPTION_COLORS[color]?.bg || 'bg-white/5'} ${OPTION_COLORS[color]?.border || 'border-white/10'} border rounded-2xl p-5`}
    >
        <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${OPTION_COLORS[color]?.bg || 'bg-white/5'}`}>
                <Icon className={`w-5 h-5 ${OPTION_COLORS[color]?.text || 'text-slate-400'}`} />
            </div>
            <span className="text-3xl font-black text-white">{value}</span>
        </div>
        <p className="text-sm text-slate-400 font-medium">{label}</p>
    </motion.div>
);

const RSVPResponses = () => {
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterOption, setFilterOption] = useState(0); // 0 = all
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);
    const [sortField, setSortField] = useState('created_at');
    const [sortDir, setSortDir] = useState('desc');

    const fetchData = useCallback(async () => {
        const { data, error } = await supabase
            .from('rsvp_responses')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) setResponses(data);
        setLoading(false);
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);
    useRealtimeSync('rsvp_responses', fetchData);

    // Computed stats
    const stats = useMemo(() => {
        const total = responses.length;
        const byOption = { 1: 0, 2: 0, 3: 0, 4: 0 };
        const timeSlots = {};

        responses.forEach(r => {
            byOption[r.selected_option] = (byOption[r.selected_option] || 0) + 1;
            if (r.selected_time) {
                timeSlots[r.selected_time] = (timeSlots[r.selected_time] || 0) + 1;
            }
        });

        return { total, byOption, timeSlots };
    }, [responses]);

    // Filtered & sorted rows
    const filteredResponses = useMemo(() => {
        let result = responses;

        if (filterOption > 0) {
            result = result.filter(r => r.selected_option === filterOption);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(r =>
                r.player_name?.toLowerCase().includes(q) ||
                r.parent_name?.toLowerCase().includes(q) ||
                r.email?.toLowerCase().includes(q)
            );
        }

        result.sort((a, b) => {
            const aVal = a[sortField] || '';
            const bVal = b[sortField] || '';
            const cmp = String(aVal).localeCompare(String(bVal));
            return sortDir === 'asc' ? cmp : -cmp;
        });

        return result;
    }, [responses, filterOption, searchQuery, sortField, sortDir]);

    const toggleSort = (field) => {
        if (sortField === field) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('desc');
        }
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return null;
        return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
    };

    const formatDate = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('en-AU', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    const renderDetailValue = (label, value) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return null;
        const display = Array.isArray(value) ? value.join(', ') : value;
        return (
            <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{label}</span>
                <span className="text-sm text-slate-300">{display}</span>
            </div>
        );
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">RSVP Responses</h1>
                    <p className="text-slate-400 text-sm mt-1">LP2 Invitation RSVP submissions — read-only view</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-white font-bold text-lg">{stats.total}</span>
                    <span className="text-slate-500 text-sm">total</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label={OPTION_LABELS[1]} value={stats.byOption[1]} icon={OPTION_ICONS[1]} color={1} />
                <StatCard label={OPTION_LABELS[2]} value={stats.byOption[2]} icon={OPTION_ICONS[2]} color={2} />
                <StatCard label={OPTION_LABELS[3]} value={stats.byOption[3]} icon={OPTION_ICONS[3]} color={3} />
                <StatCard label={OPTION_LABELS[4]} value={stats.byOption[4]} icon={OPTION_ICONS[4]} color={4} />
            </div>

            {/* Time Slot Breakdown (for Option 1) */}
            {Object.keys(stats.timeSlots).length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        Preferred Assessment Times
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(stats.timeSlots).sort().map(([time, count]) => (
                            <div key={time} className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 flex items-center gap-3">
                                <span className="text-emerald-400 font-bold text-sm">{time}</span>
                                <span className="text-white font-black text-lg">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-rr-pink/50"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterOption(0)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterOption === 0 ? 'bg-white/10 text-white' : 'bg-white/5 text-slate-500 hover:text-slate-300'}`}
                    >
                        All
                    </button>
                    {[1, 2, 3, 4].map(opt => (
                        <button
                            key={opt}
                            onClick={() => setFilterOption(opt)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${filterOption === opt
                                ? `${OPTION_COLORS[opt].bg} ${OPTION_COLORS[opt].text} border ${OPTION_COLORS[opt].border}`
                                : 'bg-white/5 text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <div className={`w-2 h-2 rounded-full ${OPTION_COLORS[opt].dot}`} />
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                {[
                                    { key: 'player_name', label: 'Player' },
                                    { key: 'parent_name', label: 'Parent' },
                                    { key: 'email', label: 'Email' },
                                    { key: 'selected_option', label: 'Option' },
                                    { key: 'created_at', label: 'Date' },
                                ].map(col => (
                                    <th
                                        key={col.key}
                                        onClick={() => toggleSort(col.key)}
                                        className="text-left px-4 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors"
                                    >
                                        <span className="flex items-center gap-1">
                                            {col.label}
                                            <SortIcon field={col.key} />
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResponses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-slate-500">
                                        No responses found
                                    </td>
                                </tr>
                            ) : (
                                filteredResponses.map((row) => {
                                    const optColor = OPTION_COLORS[row.selected_option] || OPTION_COLORS[4];
                                    const isExpanded = expandedRow === row.id;

                                    return (
                                        <React.Fragment key={row.id}>
                                            <tr
                                                onClick={() => setExpandedRow(isExpanded ? null : row.id)}
                                                className={`border-b border-white/5 cursor-pointer transition-colors ${isExpanded ? 'bg-white/5' : 'hover:bg-white/[0.03]'}`}
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-3.5 h-3.5 text-slate-500" />
                                                        <span className="text-white font-medium">{row.player_name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-slate-400">{row.parent_name}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                                                        <span className="text-slate-400">{row.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${optColor.bg} ${optColor.text} border ${optColor.border}`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${optColor.dot}`} />
                                                        {OPTION_LABELS[row.selected_option]}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(row.created_at)}</td>
                                            </tr>

                                            {/* Expanded Detail Row */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <tr>
                                                        <td colSpan={5}>
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="px-6 py-4 bg-white/[0.02] border-b border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                    {renderDetailValue('Option Label', row.option_label)}
                                                                    {renderDetailValue('Preferred Time', row.selected_time)}
                                                                    {renderDetailValue('Most Excited About', row.excited_reason)}
                                                                    {renderDetailValue('Considering Reasons', row.considering_reasons)}
                                                                    {renderDetailValue('Considering — Other', row.considering_other)}
                                                                    {renderDetailValue('Decline Reasons', row.decline_reasons)}
                                                                    {renderDetailValue('Decline — Other', row.decline_other)}
                                                                    {renderDetailValue('Terms Accepted', row.accepted_terms ? 'Yes' : 'No')}
                                                                    {renderDetailValue('Comms Accepted', row.accepted_comms ? 'Yes' : 'No')}
                                                                    {renderDetailValue('Submitted', formatDate(row.created_at))}
                                                                </div>
                                                            </motion.div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </AnimatePresence>
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RSVPResponses;
