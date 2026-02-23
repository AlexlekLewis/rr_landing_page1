import React, { useState, useEffect, useCallback } from 'react';
import useRealtimeSync from '../../hooks/useRealtimeSync';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Users, FileText, TrendingUp, Clock, ArrowRight,
    Kanban, Activity, CheckCircle2
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { supabase } from '../../lib/supabase';

const StatCard = ({ label, value, icon: Icon, color, subtext }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
    >
        <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${color}20` }}>
                <Icon className="w-6 h-6" style={{ color }} />
            </div>
        </div>
        <p className="text-3xl font-black text-white mb-1">{value}</p>
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        {subtext && <p className="text-slate-500 text-xs mt-1">{subtext}</p>}
    </motion.div>
);

const DashboardOverview = () => {
    const [stats, setStats] = useState({
        totalApplications: 0,
        thisWeek: 0,
        stages: [],
        recentActivity: [],
    });
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        try {
            // Fetch all applications
            const { data: apps } = await supabase
                .from('applications')
                .select('id, created_at, first_name, last_name, archived')
                .order('created_at', { ascending: false });

            const activeApps = (apps || []).filter(a => !a.archived);
            const archivedCount = (apps || []).length - activeApps.length;

            // Fetch pipeline entries with stage info
            const { data: entries } = await supabase
                .from('pipeline_entries')
                .select('stage_slug, application_id');

            // Fetch pipeline stages
            const { data: stages } = await supabase
                .from('pipeline_stages')
                .select('*')
                .order('sort_order');

            // Fetch recent activity
            const { data: activity } = await supabase
                .from('pipeline_activity_log')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(15);

            // Calculate this week's applications
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const thisWeek = activeApps.filter(a => new Date(a.created_at) > weekAgo).length;

            // Count per stage
            const stageCounts = (stages || []).map(s => ({
                ...s,
                count: (entries || []).filter(e => e.stage_slug === s.slug).length,
            }));

            setStats({
                totalApplications: activeApps.length,
                archivedCount,
                thisWeek,
                stages: stageCounts,
                recentActivity: activity || [],
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

    useRealtimeSync({ onApplicationChange: fetchDashboardData, onEntryChange: fetchDashboardData, onActivityChange: fetchDashboardData });

    const pipelineChartData = stats.stages.map(s => ({
        name: s.name.length > 15 ? s.name.substring(0, 15) + '…' : s.name,
        count: s.count,
        fill: s.color,
    }));

    const COLORS = stats.stages.map(s => s.color);

    const conversionRate = stats.totalApplications > 0
        ? ((stats.stages.find(s => s.slug === 'accepted')?.count || 0) / stats.totalApplications * 100).toFixed(1)
        : 0;

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
                <p className="text-slate-400 text-sm mt-1">Overview of applications and pipeline status</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Applications"
                    value={stats.totalApplications}
                    icon={FileText}
                    color="#3B82F6"
                    subtext={stats.archivedCount ? `${stats.archivedCount} archived` : undefined}
                />
                <StatCard
                    label="This Week"
                    value={stats.thisWeek}
                    icon={TrendingUp}
                    color="#10B981"
                    subtext="New applications"
                />
                <StatCard
                    label="Conversion Rate"
                    value={`${conversionRate}%`}
                    icon={CheckCircle2}
                    color="#8B5CF6"
                    subtext="Applied → Accepted"
                />
                <StatCard
                    label="Pipeline Stages"
                    value={stats.stages.length}
                    icon={Kanban}
                    color="#EC4899"
                />
            </div>

            {/* Pipeline Breakdown + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pipeline Bar Chart */}
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

                {/* Stage Counts */}
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

            {/* Recent Activity */}
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
