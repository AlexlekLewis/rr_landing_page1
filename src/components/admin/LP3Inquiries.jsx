import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const LP3Inquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState('created_at');
    const [sortDir, setSortDir] = useState('desc');

    const fetchData = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('official_cohort_2026')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setInquiries(data || []);
        } catch (err) {
            console.error('Error fetching lp3 inquiries:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filtered = useMemo(() => {
        let result = inquiries;

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(a =>
                a.player_name?.toLowerCase().includes(q) ||
                a.parent_name?.toLowerCase().includes(q) ||
                a.email?.toLowerCase().includes(q)
            );
        }

        result = [...result].sort((a, b) => {
            const av = a[sortKey], bv = b[sortKey];
            if (av == null) return 1;
            if (bv == null) return -1;
            const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
            return sortDir === 'asc' ? cmp : -cmp;
        });

        return result;
    }, [inquiries, search, sortKey, sortDir]);

    const toggleSort = (key) => {
        if (sortKey === key) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const SortIcon = ({ column }) => {
        if (sortKey !== column) return null;
        return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
    };

    const exportCSV = () => {
        const headers = ['Player Name', 'Parent Name', 'Email', 'Phone', 'Gender', 'Suburb', 'T-Shirt', 'Shorts', 'Pants', 'Payment Status', 'Date'];
        const rows = filtered.map(a => [
            a.player_name, a.parent_name, a.email, a.phone, a.gender, a.suburb, a.size_tshirt, a.size_short, a.size_pants, a.payment_status, new Date(a.created_at).toLocaleDateString()
        ]);

        const csv = [headers, ...rows].map(r => r.map(c => `"${(c || '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lp3_acceptances_${new Date().toISOString().split('T')[0]}.csv`;
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
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider">LP3 ACCEPTANCES (COHORT)</h1>
                <p className="text-slate-400 text-sm mt-1">{filtered.length} total players registered via LP3 Acceptance</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-rr-pink/50"
                    />
                </div>

                <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            {/* Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                {[
                                    { key: 'player_name', label: 'Player Name' },
                                    { key: 'parent_name', label: 'Parent Name' },
                                    { key: 'email', label: 'Email' },
                                    { key: 'gender', label: 'Gender' },
                                    { key: 'suburb', label: 'Suburb' },
                                    { key: 'payment_status', label: 'Payment' },
                                    { key: 'created_at', label: 'Date' },
                                ].map(col => (
                                    <th
                                        key={col.key}
                                        onClick={() => toggleSort(col.key)}
                                        className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300"
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
                            {filtered.map(app => (
                                <tr key={app.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-white font-medium">{app.player_name}</td>
                                    <td className="p-4 text-slate-300">{app.parent_name}</td>
                                    <td className="p-4 text-slate-400">{app.email}</td>
                                    <td className="p-4 text-slate-400">{app.gender || '-'}</td>
                                    <td className="p-4 text-slate-400">{app.suburb}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${app.payment_status === 'success' || app.payment_status === 'paid' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                            {app.payment_status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-400">
                                        {new Date(app.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-500 text-sm">No acceptances match your filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LP3Inquiries;
