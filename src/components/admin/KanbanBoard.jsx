import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, GripVertical, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useRealtimeSync from '../../hooks/useRealtimeSync';
import KanbanCard from './KanbanCard';
import ApplicationDetail from './ApplicationDetail';

const KanbanBoard = () => {
    const [stages, setStages] = useState([]);
    const [applications, setApplications] = useState([]);
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);
    const [draggingOver, setDraggingOver] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchData = useCallback(async () => {
        try {
            const [stagesRes, appsRes, entriesRes] = await Promise.all([
                supabase.from('pipeline_stages').select('*').order('sort_order'),
                supabase.from('applications').select('*').order('created_at', { ascending: false }),
                supabase.from('pipeline_entries').select('*'),
            ]);

            setStages(stagesRes.data || []);
            setApplications(appsRes.data || []);
            setEntries(entriesRes.data || []);
        } catch (err) {
            console.error('Error fetching kanban data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData, refreshKey]);

    useRealtimeSync(['applications', 'pipeline_entries', 'pipeline_activity_log'], fetchData);

    const getEntriesForStage = (stageSlug) => {
        const stageEntryIds = entries
            .filter(e => e.stage_slug === stageSlug)
            .map(e => e.application_id);

        return applications
            .filter(app => stageEntryIds.includes(app.id))
            .map(app => ({
                application: app,
                entry: entries.find(e => e.application_id === app.id),
            }));
    };

    // Find untracked applications (no pipeline entry)
    const getUntrackedApps = () => {
        const trackedIds = entries.map(e => e.application_id);
        return applications.filter(app => !trackedIds.includes(app.id));
    };

    const handleDrop = async (e, targetStageSlug) => {
        e.preventDefault();
        setDraggingOver(null);

        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            if (data.currentStage === targetStageSlug) return;

            // Update pipeline entry
            const { error } = await supabase
                .from('pipeline_entries')
                .update({ stage_slug: targetStageSlug, updated_at: new Date().toISOString() })
                .eq('id', data.entryId);

            if (error) throw error;

            // Log activity
            await supabase.from('pipeline_activity_log').insert({
                application_id: data.applicationId,
                from_stage: data.currentStage,
                to_stage: targetStageSlug,
                action: 'manual_move',
                performed_by: 'admin',
            });

            // Refresh
            setRefreshKey(prev => prev + 1);
        } catch (err) {
            console.error('Error moving card:', err);
        }
    };

    const handleDragOver = (e, stageSlug) => {
        e.preventDefault();
        setDraggingOver(stageSlug);
    };

    const handleDragLeave = () => {
        setDraggingOver(null);
    };

    // Auto-create pipeline entries for untracked applications
    const syncUntrackedApps = async () => {
        const untracked = getUntrackedApps();
        if (untracked.length === 0) return;

        const defaultStage = stages.find(s => s.is_default)?.slug || 'applied';

        const newEntries = untracked.map(app => ({
            application_id: app.id,
            stage_slug: defaultStage,
        }));

        await supabase.from('pipeline_entries').insert(newEntries);
        setRefreshKey(prev => prev + 1);
    };

    useEffect(() => {
        if (!loading && stages.length > 0) {
            syncUntrackedApps();
        }
    }, [loading, applications.length, stages.length]);

    const handleStageUpdate = async (appId, newStage) => {
        const entry = entries.find(e => e.application_id === appId);
        if (!entry) return;

        await supabase
            .from('pipeline_entries')
            .update({ stage_slug: newStage, updated_at: new Date().toISOString() })
            .eq('id', entry.id);

        await supabase.from('pipeline_activity_log').insert({
            application_id: appId,
            from_stage: entry.stage_slug,
            to_stage: newStage,
            action: 'manual_move',
            performed_by: 'admin',
        });

        setRefreshKey(prev => prev + 1);
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider">PIPELINE</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {applications.length} applications across {stages.length} stages
                    </p>
                </div>
                <button
                    onClick={() => setRefreshKey(prev => prev + 1)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Kanban Board */}
            <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
                {stages.map(stage => {
                    const stageItems = getEntriesForStage(stage.slug);
                    const isOver = draggingOver === stage.slug;

                    return (
                        <div
                            key={stage.slug}
                            className={`flex-shrink-0 w-72 md:w-80 flex flex-col rounded-2xl border transition-all ${isOver
                                ? 'border-rr-pink/50 bg-rr-pink/5'
                                : 'border-white/10 bg-white/[0.02]'
                                }`}
                            onDragOver={(e) => handleDragOver(e, stage.slug)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, stage.slug)}
                        >
                            {/* Column Header */}
                            <div className="p-4 border-b border-white/5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                                        <h3 className="text-white font-bold text-sm truncate">{stage.name}</h3>
                                    </div>
                                    <span className="bg-white/10 text-slate-300 text-xs font-bold px-2.5 py-1 rounded-full">
                                        {stageItems.length}
                                    </span>
                                </div>
                            </div>

                            {/* Cards */}
                            <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]">
                                <AnimatePresence>
                                    {stageItems.map(({ application, entry }) => (
                                        <KanbanCard
                                            key={application.id}
                                            application={application}
                                            entry={entry}
                                            onClick={setSelectedApp}
                                        />
                                    ))}
                                </AnimatePresence>

                                {stageItems.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-slate-600 text-xs">Drop cards here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Application Detail Slide-out */}
            <AnimatePresence>
                {selectedApp && (
                    <ApplicationDetail
                        application={selectedApp}
                        entry={entries.find(e => e.application_id === selectedApp.id)}
                        stages={stages}
                        onClose={() => setSelectedApp(null)}
                        onStageChange={handleStageUpdate}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default KanbanBoard;
