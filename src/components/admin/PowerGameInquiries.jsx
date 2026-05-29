import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const fmtDate = (d) => d
    ? new Date(d).toLocaleDateString('en-AU', { timeZone: 'Australia/Melbourne', day: '2-digit', month: 'short', year: 'numeric' })
    : '-';

const calcAge = (dob) => {
    if (!dob) return '-';
    const birth = new Date(dob);
    if (isNaN(birth)) return '-';
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
};

const PowerGameInquiries = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState('created_at');
    const [sortDir, setSortDir] = useState('desc');

    const fetchData = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('power_game_inquiries')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setRows(data || []);
        } catch (err) {
            console.error('Error fetching power game inquiries:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const filtered = useMemo(() => {
        let result = rows;
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(r =>
                r.player_name?.toLowerCase().includes(q) ||
                r.parent_name?.toLowerCase().includes(q) ||
                r.parent_email?.toLowerCase().includes(q) ||
                r.parent_phone?.toLowerCase().includes(q) ||
                r.suburb?.toLowerCase().includes(q)
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
    }, [rows, search, sortKey, sortDir]);

    const toggleSort = (key) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortKey(key); setSortDir('asc'); }
    };

    const SortIcon = ({ column }) => {
        if (sortKey !== column) return null;
        return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
    };

    const exportCSV = () => {
        const headers = ['Player Name', 'DOB', 'Age', 'Parent Name', 'Mobile', 'Email', 'Suburb', 'City', 'Submitted'];
        const data = filtered.map(r => [
            r.player_name, r.player_dob, calcAge(r.player_dob), r.parent_name,
            r.parent_phone, r.parent_email, r.suburb, r.city, fmtDate(r.created_at),
        ]);
        const csv = [headers, ...data]
            .map(row => row.map(c => `"${(c ?? '').toString().replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `power_game_inquiries_${new Date().toISOString().split('T')[0]}.csv`;
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
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider">POWER GAME INQUIRIES</h1>
                <p className="text-slate-400 text-sm mt-1">{filtered.length} inquiries from The Power Game Program landing page</p>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name, email, phone, suburb..."
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

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                {[
                                    { key: 'player_name', label: 'Player' },
                                    { key: 'player_dob', label: 'DOB' },
                                    { key: 'player_dob', label: 'Age', noSort: true },
                                    { key: 'parent_name', label: 'Parent' },
                                    { key: 'parent_phone', label: 'Mobile' },
                                    { key: 'parent_email', label: 'Email' },
                                    { key: 'suburb', label: 'Suburb' },
                                    { key: 'city', label: 'City' },
                                    { key: 'created_at', label: 'Submitted' },
                                ].map((col, i) => (
                                    <th
                                        key={`${col.key}-${i}`}
                                        onClick={() => !col.noSort && toggleSort(col.key)}
                                        className={`p-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${col.noSort ? '' : 'cursor-pointer hover:text-slate-300'}`}
                                    >
                                        <span className="flex items-center gap-1">
                                            {col.label}
                                            {!col.noSort && <SortIcon column={col.key} />}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.map(r => (
                                <tr key={r.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-white font-medium">{r.player_name}</td>
                                    <td className="p-4 text-slate-400">{fmtDate(r.player_dob)}</td>
                                    <td className="p-4 text-slate-400">{calcAge(r.player_dob)}</td>
                                    <td className="p-4 text-slate-300">{r.parent_name}</td>
                                    <td className="p-4 text-slate-400">{r.parent_phone}</td>
                                    <td className="p-4 text-slate-400">{r.parent_email}</td>
                                    <td className="p-4 text-slate-400">{r.suburb || '-'}</td>
                                    <td className="p-4 text-slate-400">{r.city || '-'}</td>
                                    <td className="p-4 text-slate-400">{fmtDate(r.created_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-500 text-sm">No inquiries yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PowerGameInquiries;
