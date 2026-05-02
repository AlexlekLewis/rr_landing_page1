import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Download, ChevronDown, ChevronUp, Check, X, Archive, RotateCcw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { exportToSheet, todayISO } from './exportToSheet';
import useRealtimeSync from '../../hooks/useRealtimeSync';
import UnifiedPlayerDetail from './UnifiedPlayerDetail';

const ApplicationsTable = () => {
    const [applications, setApplications] = useState([]);
    const [entries, setEntries] = useState([]);
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [stageFilter, setStageFilter] = useState('all');
    const [sortKey, setSortKey] = useState('created_at');
    const [sortDir, setSortDir] = useState('desc');
    const [selectedApp, setSelectedApp] = useState(null);
    const [selected, setSelected] = useState(new Set());
    const [bulkStage, setBulkStage] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [viewMode, setViewMode] = useState('active'); // 'active' | 'archived'

    const fetchData = useCallback(async () => {
        const [appsRes, entriesRes, stagesRes] = await Promise.all([
            supabase.from('applications').select('*').order('created_at', { ascending: false }),
            supabase.from('pipeline_entries').select('*'),
            supabase.from('pipeline_stages').select('*').order('sort_order'),
        ]);
        setApplications(appsRes.data || []);
        setEntries(entriesRes.data || []);
        setStages(stagesRes.data || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData, refreshKey]);

    useRealtimeSync(['applications', 'pipeline_entries'], fetchData);

    const getEntry = (appId) => entries.find(e => e.application_id === appId);
    const getStage = (slug) => stages.find(s => s.slug === slug);

    const activeApps = useMemo(() => applications.filter(a => !a.archived), [applications]);
    const archivedApps = useMemo(() => applications.filter(a => a.archived), [applications]);

    const filtered = useMemo(() => {
        let result = viewMode === 'archived' ? archivedApps : activeApps;

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(a =>
                `${a.first_name} ${a.last_name}`.toLowerCase().includes(q) ||
                a.email?.toLowerCase().includes(q) ||
                a.club?.toLowerCase().includes(q)
            );
        }

        if (stageFilter !== 'all') {
            const stageAppIds = entries.filter(e => e.stage_slug === stageFilter).map(e => e.application_id);
            result = result.filter(a => stageAppIds.includes(a.id));
        }

        result = [...result].sort((a, b) => {
            const av = a[sortKey], bv = b[sortKey];
            if (av == null) return 1;
            if (bv == null) return -1;
            const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
            return sortDir === 'asc' ? cmp : -cmp;
        });

        return result;
    }, [activeApps, archivedApps, viewMode, entries, search, stageFilter, sortKey, sortDir]);

    const handleArchive = async (appId) => {
        await supabase.from('applications').update({ archived: true, archived_reason: 'Manually archived by admin' }).eq('id', appId);
        setRefreshKey(p => p + 1);
        setSelectedApp(null);
    };

    const handleRestore = async (appId) => {
        await supabase.from('applications').update({ archived: false, archived_reason: null }).eq('id', appId);
        setRefreshKey(p => p + 1);
    };

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

    const toggleSelect = (id) => {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleAll = () => {
        if (selected.size === filtered.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(filtered.map(a => a.id)));
        }
    };

    const handleBulkMove = async () => {
        if (!bulkStage || selected.size === 0) return;

        for (const appId of selected) {
            const entry = getEntry(appId);
            if (entry && entry.stage_slug !== bulkStage) {
                await supabase.from('pipeline_entries').update({ stage_slug: bulkStage, updated_at: new Date().toISOString() }).eq('id', entry.id);
                await supabase.from('pipeline_activity_log').insert({
                    application_id: appId,
                    from_stage: entry.stage_slug,
                    to_stage: bulkStage,
                    action: 'bulk_move',
                    performed_by: 'admin',
                });
            }
        }

        setSelected(new Set());
        setBulkStage('');
        setRefreshKey(p => p + 1);
    };

    const [exportState, setExportState] = useState({ status: 'idle', message: '' });
    const exportToGoogleSheets = async () => {
        const headers = ['First Name', 'Last Name', 'Age', 'Email', 'Phone', 'Club', 'Suburb', 'Stage', 'Applied Date'];
        const rows = filtered.map(a => {
            const entry = getEntry(a.id);
            const stage = getStage(entry?.stage_slug);
            return [
                a.first_name, a.last_name, a.age, a.email, a.phone, a.club, a.suburb,
                stage?.name || entry?.stage_slug || '', new Date(a.created_at).toLocaleDateString()
            ];
        });
        setExportState({ status: 'exporting', message: '' });
        try {
            const { url } = await exportToSheet({
                title: `All players — ${todayISO()}`,
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

    const handleStageUpdate = async (appId, newStage) => {
        const entry = entries.find(e => e.application_id === appId);
        if (!entry) return;

        await supabase.from('pipeline_entries').update({ stage_slug: newStage, updated_at: new Date().toISOString() }).eq('id', entry.id);
        await supabase.from('pipeline_activity_log').insert({
            application_id: appId, from_stage: entry.stage_slug, to_stage: newStage,
            action: 'manual_move', performed_by: 'admin',
        });

        setRefreshKey(p => p + 1);
        setSelectedApp(null);
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
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider">ALL PLAYERS</h1>
                <p className="text-slate-400 text-sm mt-1">{filtered.length} of {viewMode === 'archived' ? archivedApps.length : activeApps.length} {viewMode === 'archived' ? 'archived' : 'active'} players</p>
            </div>

            {/* Active / Archived toggle */}
            <div className="flex gap-2">
                <button
                    onClick={() => setViewMode('active')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'active' ? 'bg-rr-pink text-white' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'}`}
                >
                    Active ({activeApps.length})
                </button>
                <button
                    onClick={() => setViewMode('archived')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'archived' ? 'bg-amber-500 text-white' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'}`}
                >
                    <Archive className="w-4 h-4" />
                    Archived ({archivedApps.length})
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email, or club..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-rr-pink/50"
                    />
                </div>

                <select
                    value={stageFilter}
                    onChange={(e) => setStageFilter(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-rr-pink/50 appearance-none cursor-pointer"
                >
                    <option value="all">All Stages</option>
                    {stages.map(s => (
                        <option key={s.slug} value={s.slug}>{s.name}</option>
                    ))}
                </select>

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

            {/* Bulk actions */}
            {selected.size > 0 && (
                <div className="flex items-center gap-3 p-3 bg-rr-pink/10 border border-rr-pink/20 rounded-xl">
                    <span className="text-rr-pink text-sm font-medium">{selected.size} selected</span>
                    <select
                        value={bulkStage}
                        onChange={(e) => setBulkStage(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-slate-300 text-xs"
                    >
                        <option value="">Move to stage...</option>
                        {stages.map(s => (
                            <option key={s.slug} value={s.slug}>{s.name}</option>
                        ))}
                    </select>
                    <button onClick={handleBulkMove} disabled={!bulkStage} className="px-3 py-1.5 rounded-lg bg-rr-pink text-white text-xs font-bold disabled:opacity-50">
                        Move
                    </button>
                    <button onClick={() => setSelected(new Set())} className="text-slate-400 hover:text-white p-1">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="p-4 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selected.size === filtered.length && filtered.length > 0}
                                        onChange={toggleAll}
                                        className="rounded accent-rr-pink"
                                    />
                                </th>
                                {[
                                    { key: 'first_name', label: 'Name' },
                                    { key: 'age', label: 'Age' },
                                    { key: 'club', label: 'Club' },
                                    { key: 'email', label: 'Email' },
                                    { key: 'created_at', label: 'Applied' },
                                ].map(col => (
                                    <th
                                        key={col.key}
                                        onClick={() => toggleSort(col.key)}
                                        className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300"
                                    >
                                        <span className="flex items-center gap-1">
                                            {col.label}
                                            <SortIcon column={col.key} />
                                        </span>
                                    </th>
                                ))}
                                <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Stage</th>
                                <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.map(app => {
                                const entry = getEntry(app.id);
                                const stage = getStage(entry?.stage_slug);
                                return (
                                    <tr
                                        key={app.id}
                                        className="hover:bg-white/5 transition-colors cursor-pointer"
                                        onClick={() => setSelectedApp(app)}
                                    >
                                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selected.has(app.id)}
                                                onChange={() => toggleSelect(app.id)}
                                                className="rounded accent-rr-pink"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <span className="text-white font-medium">{app.first_name} {app.last_name}</span>
                                        </td>
                                        <td className="p-4 text-slate-400">{app.age}</td>
                                        <td className="p-4 text-slate-400 truncate max-w-[150px]">{app.club}</td>
                                        <td className="p-4 text-slate-400 truncate max-w-[200px]">{app.email}</td>
                                        <td className="p-4 text-slate-400">
                                            {app.created_at ? new Date(app.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }) : ''}
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: `${stage?.color}20`, color: stage?.color }}>
                                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stage?.color }} />
                                                {stage?.name?.length > 18 ? stage.name.substring(0, 18) + '…' : stage?.name || entry?.stage_slug}
                                            </span>
                                        </td>
                                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                            {viewMode === 'archived' ? (
                                                <button onClick={() => handleRestore(app.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold transition-all">
                                                    <RotateCcw className="w-3 h-3" /> Restore
                                                </button>
                                            ) : (
                                                <button onClick={() => handleArchive(app.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold transition-all">
                                                    <Archive className="w-3 h-3" /> Archive
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-500 text-sm">No applications match your filters</p>
                    </div>
                )}
            </div>

            {/* Detail panel */}
            <AnimatePresence>
                {selectedApp && (
                    <UnifiedPlayerDetail
                        application={selectedApp}
                        entry={getEntry(selectedApp.id)}
                        stages={stages}
                        onClose={() => setSelectedApp(null)}
                        onStageChange={handleStageUpdate}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ApplicationsTable;
