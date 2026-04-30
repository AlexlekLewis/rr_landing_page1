import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, ChevronDown, ChevronUp, Users, MessageSquare, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const TABS = [
    { key: 'upcoming', label: 'Upcoming Program Interest', icon: Users, table: 'upcoming_program_interest' },
    { key: 'enquiries', label: 'General Enquiries', icon: MessageSquare, table: 'general_enquiries' },
];

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-AU', { timeZone: 'Australia/Melbourne', day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const SortIcon = ({ sortKey, column, sortDir }) => {
    if (sortKey !== column) return null;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
};

const UPCOMING_COLS = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'age_group', label: 'Age' },
    { key: 'skill_level', label: 'Skill' },
    { key: 'postcode', label: 'Postcode' },
    { key: 'gender_preference', label: 'Cricket' },
    { key: 'questions', label: 'Questions' },
    { key: 'created_at', label: 'Date' },
];

const ENQUIRY_COLS = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'age_group', label: 'Age' },
    { key: 'skill_level', label: 'Skill' },
    { key: 'postcode', label: 'Postcode' },
    { key: 'gender_preference', label: 'Cricket' },
    { key: 'looking_for', label: 'Looking For' },
    { key: 'created_at', label: 'Date' },
];

const Tag = ({ value }) => {
    if (!value) return <span className="text-slate-400">—</span>;
    return <span className="inline-block bg-slate-100 text-rr-charcoal text-xs font-bold rounded-full px-2 py-0.5 uppercase tracking-wide">{value}</span>;
};

const LeadsTable = ({ data, columns, loading }) => {
    const [sortKey, setSortKey] = useState('created_at');
    const [sortDir, setSortDir] = useState('desc');
    const [search, setSearch] = useState('');

    const toggleSort = (key) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortKey(key); setSortDir('asc'); }
    };

    const filtered = useMemo(() => {
        let result = data;
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(r =>
                r.name?.toLowerCase().includes(q) ||
                r.email?.toLowerCase().includes(q) ||
                r.postcode?.includes(q)
            );
        }
        return [...result].sort((a, b) => {
            const av = a[sortKey], bv = b[sortKey];
            if (av == null) return 1;
            if (bv == null) return -1;
            const cmp = typeof av === 'string' ? av.localeCompare(bv) : new Date(av) - new Date(bv);
            return sortDir === 'asc' ? cmp : -cmp;
        });
    }, [data, search, sortKey, sortDir]);

    const exportCSV = () => {
        const headers = columns.map(c => c.label);
        const rows = filtered.map(r => columns.map(c => {
            const v = c.key === 'created_at' ? formatDate(r[c.key]) : (r[c.key] || '');
            return `"${v.toString().replace(/"/g, '""')}"`;
        }));
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rra-leads-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email or postcode..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-rr-pink w-72 transition-colors"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{filtered.length} records</span>
                    <button
                        onClick={exportCSV}
                        className="flex items-center gap-2 px-4 py-2.5 bg-rr-dark text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-rr-charcoal transition-colors"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                {columns.map(col => (
                                    <th
                                        key={col.key}
                                        onClick={() => toggleSort(col.key)}
                                        className="px-4 py-3 text-left text-xs font-black text-rr-charcoal uppercase tracking-widest cursor-pointer hover:text-rr-pink transition-colors whitespace-nowrap"
                                    >
                                        <span className="flex items-center gap-1">
                                            {col.label}
                                            <SortIcon sortKey={sortKey} column={col.key} sortDir={sortDir} />
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        {columns.map(c => (
                                            <td key={c.key} className="px-4 py-3">
                                                <div className="h-4 bg-slate-100 rounded animate-pulse w-24" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400 font-medium">
                                        No records found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(row => (
                                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                        {columns.map(col => (
                                            <td key={col.key} className="px-4 py-3 text-rr-charcoal font-medium max-w-[200px]">
                                                {col.key === 'created_at' ? (
                                                    <span className="text-xs text-slate-400">{formatDate(row[col.key])}</span>
                                                ) : col.key === 'email' ? (
                                                    <a href={`mailto:${row[col.key]}`} className="text-rr-pink hover:underline">{row[col.key] || '—'}</a>
                                                ) : col.key === 'age_group' || col.key === 'skill_level' || col.key === 'gender_preference' ? (
                                                    <Tag value={row[col.key]} />
                                                ) : col.key === 'questions' || col.key === 'looking_for' ? (
                                                    <span className="text-xs text-slate-500 line-clamp-2 block" title={row[col.key]}>{row[col.key] || '—'}</span>
                                                ) : (
                                                    <span>{row[col.key] || '—'}</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const HomeLeadsDashboard = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [data, setData] = useState({ upcoming: [], enquiries: [] });
    const [loading, setLoading] = useState(true);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [upcomingRes, enquiriesRes] = await Promise.all([
                supabase.from('upcoming_program_interest').select('*').order('created_at', { ascending: false }),
                supabase.from('general_enquiries').select('*').order('created_at', { ascending: false }),
            ]);
            setData({
                upcoming: upcomingRes.data || [],
                enquiries: enquiriesRes.data || [],
            });
        } catch (err) {
            console.error('Error fetching leads:', err);
        }
        setLoading(false);
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const currentTab = TABS.find(t => t.key === activeTab);
    const currentData = data[activeTab] || [];
    const currentCols = activeTab === 'upcoming' ? UPCOMING_COLS : ENQUIRY_COLS;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-rr-dark uppercase tracking-wide">Homepage Leads</h1>
                <p className="text-sm text-slate-500 font-medium mt-1">Interest registrations and enquiries from the homepage registration drawer.</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-4">
                {TABS.map(tab => {
                    const count = data[tab.key]?.length || 0;
                    const recent = data[tab.key]?.filter(r => {
                        const d = new Date(r.created_at);
                        const now = new Date();
                        return now - d < 7 * 24 * 60 * 60 * 1000;
                    }).length || 0;
                    return (
                        <motion.button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            whileHover={{ scale: 1.01 }}
                            className={`p-5 rounded-2xl border-2 text-left transition-all ${activeTab === tab.key ? 'border-rr-pink bg-rr-pink/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <tab.icon className={`w-5 h-5 ${activeTab === tab.key ? 'text-rr-pink' : 'text-slate-400'}`} />
                                {recent > 0 && (
                                    <span className="text-xs font-bold bg-green-100 text-green-700 rounded-full px-2 py-0.5">+{recent} this week</span>
                                )}
                            </div>
                            <div className="text-3xl font-black text-rr-dark">{count}</div>
                            <div className="text-xs font-bold text-rr-charcoal/60 uppercase tracking-widest mt-1">{tab.label}</div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Tab bar */}
            <div className="flex gap-2 border-b border-slate-100 pb-0">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 -mb-px ${activeTab === tab.key ? 'text-rr-pink border-rr-pink' : 'text-slate-400 border-transparent hover:text-rr-charcoal'}`}
                    >
                        {tab.label} ({data[tab.key]?.length || 0})
                    </button>
                ))}
            </div>

            {/* Table */}
            <LeadsTable data={currentData} columns={currentCols} loading={loading} />
        </div>
    );
};

export default HomeLeadsDashboard;
