import React, { useState, useEffect, useCallback } from 'react';
import useRealtimeSync from '../../hooks/useRealtimeSync';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Users, FileText, TrendingUp, ArrowRight,
    Kanban, Activity, CheckCircle2, Send, UserCheck, ChevronRight
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell
} from 'recharts';
import { supabase } from '../../lib/supabase';

const COHORT_TARGET = 20;

const StatCard = ({ label, value, icon: Icon, color, subtext }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
    >
        <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                <Icon className="w-6 h-6" style={{ color }} />
            </div>
        </div>
        <p className="text-3xl font-black text-white mb-1">{value}</p>
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        {subtext && <p className="text-slate-500 text-xs mt-1">{subtext}</p>}
    </motion.div>
);

const FunnelStep = ({ label, value, subtitle, color, conversionRate, isLast }) => (
    <div className="flex-1 min-w-0">
        <div className="relative">
            <div className="rounded-2xl p-4 border transition-all" style={{ backgroundColor: `${color}10`, borderColor: `${color}30` }}>
                <p className="text-3xl font-black text-white mb-0.5">{value}</p>
                <p className="text-sm font-bold" style={{ color }}>{label}</p>
                {subtitle && <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>}
            </div>
            {!isLast && conversionRate !== null && (
                <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 items-center">
                    <div className="bg-slate-800 border border-white/10 rounded-lg px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                        {conversionRate}%
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-600 -ml-0.5" />
                </div>
            )}
        </div>
    </div>
);

const DashboardOverview = () => {
    const [stats, setStats] = useState({
        enquiries: 0,
        applied: 0,
        totalPlayers: 0,
        archivedCount: 0,
        thisWeek: { enquiries: 0, applications: 0, cohort: 0, offers: 0 },
        offeredCount: 0,
        enrolledCount: 0,
        cohortTotal: 0,
        stages: [],
        recentActivity: [],
    });
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        try {
            // ── Fetch all data sources in parallel ──────────────────────
            const [appsRes, entriesRes, stagesRes, activityRes, cohortRes, tokensRes] = await Promise.all([
                supabase.from('applications').select('id, created_at, first_name, last_name, archived, source').order('created_at', { ascending: false }),
                supabase.from('pipeline_entries').select('stage_slug, application_id'),
                supabase.from('pipeline_stages').select('*').order('sort_order'),
                supabase.from('pipeline_activity_log').select('*').order('created_at', { ascending: false }).limit(20),
                supabase.from('official_cohort_2026').select('id, created_at, player_name, payment_status, payment_option_selected'),
                supabase.from('offer_tokens').select('id, created_at, status, applicant_name'),
            ]);

            const apps = appsRes.data || [];
            const entries = entriesRes.data || [];
            const stages = stagesRes.data || [];
            const activity = activityRes.data || [];
            const cohort = cohortRes.data || [];
            const tokens = tokensRes.data || [];

            const activeApps = apps.filter(a => !a.archived);
            const archivedCount = apps.length - activeApps.length;

            // ── Funnel Metrics (source-based) ─────────────────────────────
            // Splash page leads: source = 'splash_page'
            // LP4 applications: source = 'master_landing_page' (or any non-splash)
            const enquiries = activeApps.filter(a => a.source === 'splash_page').length;
            const applied = activeApps.filter(a => a.source !== 'splash_page').length;
            const totalPlayers = activeApps.length;
            const offeredCount = tokens.length;
            const enrolledCount = cohort.filter(c => c.payment_status && c.payment_status !== 'pending').length;
            const cohortTotal = cohort.length;

            // ── This Week ───────────────────────────────────────────────
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const thisWeekApps = activeApps.filter(a => new Date(a.created_at) > weekAgo);
            const thisWeek = {
                enquiries: thisWeekApps.filter(a => a.source === 'splash_page').length,
                applications: thisWeekApps.filter(a => a.source !== 'splash_page').length,
                cohort: cohort.filter(c => new Date(c.created_at) > weekAgo).length,
                offers: tokens.filter(t => new Date(t.created_at) > weekAgo).length,
            };

            // ── Pipeline Stages ─────────────────────────────────────────
            const stageCounts = stages.map(s => ({
                ...s,
                count: entries.filter(e => e.stage_slug === s.slug).length,
            }));

            setStats({
                enquiries,
                applied,
                totalPlayers,
                archivedCount,
                thisWeek,
                offeredCount,
                enrolledCount,
                cohortTotal,
                stages: stageCounts,
                recentActivity: activity,
            });
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // ── Real-time sync across all data sources ──────────────────────────
    useRealtimeSync([
        'applications', 'pipeline_entries', 'pipeline_activity_log',
        'official_cohort_2026', 'offer_tokens'
    ], fetchDashboardData);

    // ── Derived ─────────────────────────────────────────────────────────
    const pipelineChartData = stats.stages.map(s => ({
        name: s.name.length > 15 ? s.name.substring(0, 15) + '…' : s.name,
        count: s.count,
        fill: s.color,
    }));

    const convEnqToApp = stats.enquiries > 0 ? Math.round((stats.applied / stats.enquiries) * 100) : null;
    const convAppToOffer = stats.applied > 0 ? Math.round((stats.offeredCount / stats.applied) * 100) : null;
    const convOfferToEnrol = stats.offeredCount > 0 ? Math.round((stats.enrolledCount / stats.offeredCount) * 100) : null;

    const cohortProgress = Math.min(100, Math.round((stats.enrolledCount / COHORT_TARGET) * 100));

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
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider">DASHBOARD</h1>
                <p className="text-slate-400 text-sm mt-1">Elite Program 2026 — complete funnel overview</p>
            </div>

            {/* ── Funnel ─────────────────────────────────────────────── */}
            <div>
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Player Funnel</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                    <FunnelStep label="Enquiries" value={stats.enquiries} subtitle="Splash page leads" color="#3B82F6" conversionRate={convEnqToApp} />
                    <FunnelStep label="Applied" value={stats.applied} subtitle={`${stats.totalPlayers} total incl. enquiries`} color="#8B5CF6" conversionRate={convAppToOffer} />
                    <FunnelStep label="Offered" value={stats.offeredCount} subtitle="Offers sent" color="#F59E0B" conversionRate={convOfferToEnrol} />
                    <FunnelStep label="Enrolled" value={stats.enrolledCount} subtitle={`${stats.cohortTotal} total in cohort`} color="#10B981" conversionRate={null} isLast />
                </div>
            </div>

            {/* ── Cohort Target + This Week ──────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Cohort Target */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-bold text-sm uppercase tracking-wider">Cohort Target</h3>
                        <span className="text-white font-black text-lg">{stats.enrolledCount} <span className="text-slate-500 font-normal text-sm">/ {COHORT_TARGET}</span></span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${cohortProgress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ background: cohortProgress >= 100 ? '#10B981' : 'linear-gradient(90deg, #E50695, #1226AA)' }}
                        />
                    </div>
                    <div className="flex justify-between mt-2">
                        <p className="text-slate-500 text-xs">{cohortProgress}% of target</p>
                        {stats.enrolledCount < COHORT_TARGET && (
                            <p className="text-slate-500 text-xs">{COHORT_TARGET - stats.enrolledCount} more needed</p>
                        )}
                        {stats.enrolledCount >= COHORT_TARGET && (
                            <p className="text-emerald-400 text-xs font-medium">Target reached!</p>
                        )}
                    </div>
                </div>

                {/* This Week Summary */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">This Week</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Users className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-lg leading-tight">{stats.thisWeek.enquiries}</p>
                                <p className="text-slate-500 text-xs">Enquiries</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <FileText className="w-4 h-4 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-lg leading-tight">{stats.thisWeek.applications}</p>
                                <p className="text-slate-500 text-xs">Applications</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                <Send className="w-4 h-4 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-lg leading-tight">{stats.thisWeek.offers}</p>
                                <p className="text-slate-500 text-xs">Offers sent</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <UserCheck className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-lg leading-tight">{stats.thisWeek.cohort}</p>
                                <p className="text-slate-500 text-xs">Enrolled</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Pipeline Breakdown + Stage Summary ─────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Pipeline Breakdown</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={pipelineChartData} layout="vertical" margin={{ left: 10, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis type="number" stroke="#64748b" fontSize={12} />
                            <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={120} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '13px' }}
                            />
                            <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                                {pipelineChartData.map((entry, index) => (
                                    <Cell key={index} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Stage Summary</h3>
                    <div className="space-y-3">
                        {stats.stages.map(stage => (
                            <div key={stage.slug} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: stage.color }} />
                                    <span className="text-slate-300 text-sm truncate">{stage.name}</span>
                                </div>
                                <span className="text-white font-bold text-lg">{stage.count}</span>
                            </div>
                        ))}
                    </div>
                    <Link
                        to="/rramadmin_26/pipeline"
                        className="mt-6 flex items-center justify-center gap-2 text-rr-pink hover:text-rr-light-pink text-sm font-medium transition-colors"
                    >
                        View Pipeline <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* ── Recent Activity ─────────────────────────────────────── */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Recent Activity</h3>
                {stats.recentActivity.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-8">No pipeline activity yet. Drag cards in the pipeline to get started.</p>
                ) : (
                    <div className="space-y-3">
                        {stats.recentActivity.map(item => (
                            <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                                <Activity className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-slate-300 text-sm">
                                        <span className="text-white font-medium">{item.action?.replace('_', ' ')}</span>
                                        {item.from_stage && <span> from <span className="font-medium">{item.from_stage}</span></span>}
                                        {' '}to <span className="font-medium">{item.to_stage}</span>
                                    </p>
                                    {item.notes && <p className="text-slate-500 text-xs mt-1">{item.notes}</p>}
                                    <p className="text-slate-600 text-xs mt-1">{new Date(item.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardOverview;
