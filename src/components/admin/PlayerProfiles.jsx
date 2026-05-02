import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Download, ChevronDown, ChevronUp, ExternalLink,
    Activity, AlertCircle, CheckCircle2, RefreshCw, X, User
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { exportToSheet, todayISO } from './exportToSheet';
import useRealtimeSync from '../../hooks/useRealtimeSync';
import PlayerProfileDetail from './PlayerProfileDetail';

/* ── Stats status badge ─────────────────────────────────── */
const StatsStatus = ({ hasStats, seasonCount }) => {
    if (!hasStats) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-500">
                <AlertCircle className="w-3 h-3" /> No stats
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" /> {seasonCount} season{seasonCount !== 1 ? 's' : ''}
        </span>
    );
};

const PlayerProfiles = () => {
    const [players, setPlayers] = useState([]);
    const [statsIndex, setStatsIndex] = useState({});  // cohort_id → { count, seasons }
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [cricketTypeFilter, setCricketTypeFilter] = useState('all');
    const [statsFilter, setStatsFilter] = useState('all'); // 'all' | 'has_stats' | 'no_stats'
    const [sortKey, setSortKey] = useState('player_name');
    const [sortDir, setSortDir] = useState('asc');
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    /* ── Fetch cohort + stats summary ────────────────────── */
    const fetchData = useCallback(async () => {
        try {
            const [cohortRes, seasonsRes] = await Promise.all([
                supabase
                    .from('official_cohort_2026')
                    .select('*')
                    .order('player_name', { ascending: true }),
                supabase
                    .from('player_stats_seasons')
                    .select('id, cohort_id, season_name'),
            ]);

            setPlayers(cohortRes.data || []);

            // Build stats index: how many seasons does each player have?
            const idx = {};
            (seasonsRes.data || []).forEach(s => {
                if (!idx[s.cohort_id]) idx[s.cohort_id] = { count: 0, seasons: [] };
                idx[s.cohort_id].count++;
                idx[s.cohort_id].seasons.push(s.season_name);
            });
            setStatsIndex(idx);
        } catch (err) {
            console.error('Error fetching player profiles:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useRealtimeSync(['official_cohort_2026', 'player_stats_seasons'], fetchData);

    /* ── Filter & sort ───────────────────────────────────── */
    const filtered = useMemo(() => {
        let result = players;

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(p =>
                p.player_name?.toLowerCase().includes(q) ||
                p.first_name?.toLowerCase().includes(q) ||
                p.last_name?.toLowerCase().includes(q) ||
                p.club?.toLowerCase().includes(q) ||
                p.suburb?.toLowerCase().includes(q) ||
                p.parent1_email?.toLowerCase().includes(q) ||
                p.player_email?.toLowerCase().includes(q)
            );
        }

        if (cricketTypeFilter !== 'all') {
            result = result.filter(p => p.cricket_type === cricketTypeFilter);
        }

        if (statsFilter === 'has_stats') {
            result = result.filter(p => statsIndex[p.id]?.count > 0);
        } else if (statsFilter === 'no_stats') {
            result = result.filter(p => !statsIndex[p.id]?.count);
        }

        result = [...result].sort((a, b) => {
            let av = a[sortKey], bv = b[sortKey];
            if (sortKey === 'stats') {
                av = statsIndex[a.id]?.count || 0;
                bv = statsIndex[b.id]?.count || 0;
            }
            if (av == null) return 1;
            if (bv == null) return -1;
            const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
            return sortDir === 'asc' ? cmp : -cmp;
        });

        return result;
    }, [players, search, cricketTypeFilter, statsFilter, statsIndex, sortKey, sortDir]);

    /* ── Sort toggle ─────────────────────────────────────── */
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

    /* ── CSV export ──────────────────────────────────────── */
    const [exportState, setExportState] = useState({ status: 'idle', message: '' });
    const exportToGoogleSheets = async () => {
        const headers = ['Player Name', 'Age', 'Club', 'Suburb', 'Cricket Type', 'Profile Link', 'Stats Seasons', 'Payment Status', 'Enrolled'];
        const rows = filtered.map(p => [
            p.player_name,
            p.age,
            p.club,
            p.suburb,
            p.cricket_type,
            p.profile_link,
            statsIndex[p.id]?.count || 0,
            p.payment_status,
            new Date(p.created_at).toLocaleDateString(),
        ]);
        setExportState({ status: 'exporting', message: '' });
        try {
            const { url } = await exportToSheet({
                title: `Player profiles — ${todayISO()}`,
                sheet_name: 'Players',
                headers,
                rows,
            });
            setExportState({ status: 'done', message: 'Opened in new tab' });
            window.open(url, '_blank', 'noopener');
        } catch (err) {
            setExportState({ status: 'error', message: err.message });
        }
    };

    /* ── Unique cricket types for filter ──────────────────── */
    const cricketTypes = useMemo(() => {
        const types = new Set(players.map(p => p.cricket_type).filter(Boolean));
        return Array.from(types).sort();
    }, [players]);

    /* ── Loading state ───────────────────────────────────── */
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

    const statsCount = Object.values(statsIndex).filter(v => v.count > 0).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider">PLAYER PROFILES</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {filtered.length} player{filtered.length !== 1 ? 's' : ''} in cohort
                        <span className="text-slate-600 mx-2">·</span>
                        <span className="text-emerald-400">{statsCount} with stats</span>
                    </p>
                </div>
            </div>

            {/* Filters bar */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name, club, suburb, email..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-rr-pink/50"
                    />
                </div>

                {/* Cricket type filter */}
                <div className="relative">
                    <select
                        value={cricketTypeFilter}
                        onChange={(e) => setCricketTypeFilter(e.target.value)}
                        className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-8 text-white text-sm focus:outline-none focus:border-rr-pink/50 cursor-pointer"
                    >
                        <option value="all" className="bg-slate-900">All Types</option>
                        {cricketTypes.map(t => (
                            <option key={t} value={t} className="bg-slate-900">{t}</option>
                        ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Stats filter */}
                <div className="relative">
                    <select
                        value={statsFilter}
                        onChange={(e) => setStatsFilter(e.target.value)}
                        className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-8 text-white text-sm focus:outline-none focus:border-rr-pink/50 cursor-pointer"
                    >
                        <option value="all" className="bg-slate-900">All Players</option>
                        <option value="has_stats" className="bg-slate-900">Has Stats</option>
                        <option value="no_stats" className="bg-slate-900">No Stats</option>
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <button
                    onClick={exportToGoogleSheets}
                    disabled={exportState.status === 'exporting'}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm disabled:opacity-60"
                    title={exportState.message}
                >
                    <Download className="w-4 h-4" />
                    {exportState.status === 'exporting' ? 'Exporting…' : 'Export to Google Sheets'}
                </button>
            </div>

            {/* Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                {[
                                    { key: 'player_name', label: 'Player' },
                                    { key: 'age', label: 'Age' },
                                    { key: 'club', label: 'Club' },
                                    { key: 'suburb', label: 'Suburb' },
                                    { key: 'cricket_type', label: 'Type' },
                                    { key: 'stats', label: 'Stats' },
                                    { key: 'profile_link', label: 'Profile' },
                                    { key: 'payment_status', label: 'Payment' },
                                ].map(col => (
                                    <th
                                        key={col.key}
                                        onClick={() => toggleSort(col.key)}
                                        className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300 whitespace-nowrap"
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
                            {filtered.map(player => {
                                const stats = statsIndex[player.id];
                                return (
                                    <motion.tr
                                        key={player.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-white/5 transition-colors cursor-pointer"
                                        onClick={() => setSelectedPlayer(player)}
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rr-pink/30 to-rr-blue/30 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                    {player.first_name?.charAt(0)}{player.last_name?.charAt(0)}
                                                </div>
                                                <span className="text-white font-medium">{player.player_name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-400">{player.age || '-'}</td>
                                        <td className="p-4 text-slate-300">{player.club || '-'}</td>
                                        <td className="p-4 text-slate-400">{player.suburb || '-'}</td>
                                        <td className="p-4 text-slate-400">{player.cricket_type || '-'}</td>
                                        <td className="p-4">
                                            <StatsStatus hasStats={stats?.count > 0} seasonCount={stats?.count || 0} />
                                        </td>
                                        <td className="p-4">
                                            {player.profile_link ? (
                                                <a
                                                    href={player.profile_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="text-rr-pink hover:underline flex items-center gap-1 text-xs"
                                                >
                                                    View <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ) : (
                                                <span className="text-slate-600 text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                player.payment_status === 'success' || player.payment_status === 'paid'
                                                    ? 'bg-green-500/10 text-green-400'
                                                    : 'bg-amber-500/10 text-amber-400'
                                            }`}>
                                                {player.payment_status || 'pending'}
                                            </span>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-12">
                        <User className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500 text-sm">No players match your filters</p>
                    </div>
                )}
            </div>

            {/* Player detail slide-out */}
            <AnimatePresence>
                {selectedPlayer && (
                    <PlayerProfileDetail
                        player={selectedPlayer}
                        onClose={() => setSelectedPlayer(null)}
                        onStatsUpdated={fetchData}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default PlayerProfiles;
