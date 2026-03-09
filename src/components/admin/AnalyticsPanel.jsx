import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, MapPin, Calendar, BarChart3, Monitor } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { supabase } from '../../lib/supabase';
import useRealtimeSync from '../../hooks/useRealtimeSync';

const COLORS = ['#E50695', '#1226AA', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#06B6D4', '#EF4444'];

const normaliseSuburb = (raw) => {
    if (!raw) return null;
    return raw.toLowerCase().trim()
        .replace(/\d{4}$/g, '')
        .replace(/,?\s*(victoria|vic|australia).*$/i, '')
        .replace(/^\d+\s+\w+\s+(st|street|cres|crescent|way|rd|road|ave|avenue|dr|drive)\s+/i, '')
        .replace(/\s+cricket\s+club$/i, '')
        .trim();
};

const AnalyticsPanel = () => {
    const [applications, setApplications] = useState([]);
    const [entries, setEntries] = useState([]);
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        const [appsRes, entriesRes, stagesRes] = await Promise.all([
            supabase.from('applications').select('*').order('created_at'),
            supabase.from('pipeline_entries').select('*'),
            supabase.from('pipeline_stages').select('*').order('sort_order'),
        ]);
        setApplications((appsRes.data || []).filter(a => !a.archived));
        setEntries(entriesRes.data || []);
        setStages(stagesRes.data || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useRealtimeSync(['applications', 'pipeline_entries', 'pipeline_stages'], fetchData);

    // ── Derived Analytics ──────────────────────────────────────────────────────

    // Age distribution
    const ageData = useMemo(() => {
        const counts = {};
        applications.forEach(a => {
            const age = a.age || 'Unknown';
            counts[age] = (counts[age] || 0) + 1;
        });
        return Object.entries(counts)
            .sort(([a], [b]) => (Number(a) || 0) - (Number(b) || 0))
            .map(([age, count]) => ({ age: age.toString(), count }));
    }, [applications]);

    // Top suburbs
    const suburbData = useMemo(() => {
        const counts = {};
        applications.forEach(a => {
            const sub = normaliseSuburb(a.suburb);
            if (sub) counts[sub] = (counts[sub] || 0) + 1;
        });
        return Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 12)
            .map(([suburb, count]) => ({
                suburb: suburb.charAt(0).toUpperCase() + suburb.slice(1),
                count,
            }));
    }, [applications]);

    // Top clubs
    const clubData = useMemo(() => {
        const counts = {};
        applications.forEach(a => {
            const club = a.club?.trim();
            if (club) counts[club] = (counts[club] || 0) + 1;
        });
        return Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([club, count]) => ({ club, count }));
    }, [applications]);

    // Submissions by day (last 30 days)
    const submissionsByDay = useMemo(() => {
        const days = {};
        const now = new Date();
        for (let i = 29; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            days[key] = 0;
        }
        applications.forEach(a => {
            const key = new Date(a.created_at).toISOString().split('T')[0];
            if (days[key] !== undefined) days[key]++;
        });
        return Object.entries(days).map(([date, count]) => ({
            date: new Date(date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }),
            applications: count,
        }));
    }, [applications]);

    // Pipeline stage distribution (pie)
    const stagePieData = useMemo(() => {
        return stages.map(s => ({
            name: s.name,
            value: entries.filter(e => e.stage_slug === s.slug).length,
            color: s.color,
        })).filter(s => s.value > 0);
    }, [stages, entries]);

    // Weekly submissions
    const weeklyData = useMemo(() => {
        const weeks = {};
        applications.forEach(a => {
            const d = new Date(a.created_at);
            const weekStart = new Date(d);
            weekStart.setDate(d.getDate() - d.getDay());
            const key = weekStart.toISOString().split('T')[0];
            weeks[key] = (weeks[key] || 0) + 1;
        });
        return Object.entries(weeks)
            .map(([week, count]) => ({
                week: new Date(week).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }),
                count,
            }))
            .slice(-12);
    }, [applications]);

    // Quick stats
    const thisWeek = useMemo(() => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return applications.filter(a => new Date(a.created_at) > weekAgo).length;
    }, [applications]);

    const avgAge = useMemo(() => {
        const ages = applications.filter(a => a.age).map(a => a.age);
        return ages.length > 0 ? (ages.reduce((s, a) => s + a, 0) / ages.length).toFixed(1) : '—';
    }, [applications]);

    const uniqueSuburbs = useMemo(() => {
        return new Set(applications.map(a => normaliseSuburb(a.suburb)).filter(Boolean)).size;
    }, [applications]);

    const uniqueApplicants = useMemo(() => {
        const seen = new Set();
        return applications.filter(a => {
            const key = `${(a.first_name || '').toLowerCase().trim()}|${(a.last_name || '').toLowerCase().trim()}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        }).length;
    }, [applications]);

    const tooltipStyle = {
        backgroundColor: '#1e293b',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        color: '#fff',
        fontSize: '13px',
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
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider">FUNNEL & DEMOGRAPHICS</h1>
                <p className="text-slate-400 text-sm mt-1">Player demographics, geography, and pipeline insights</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Unique Applicants', value: uniqueApplicants, icon: Users, color: '#3B82F6' },
                    { label: 'This Week', value: thisWeek, icon: TrendingUp, color: '#10B981' },
                    { label: 'Avg Age', value: avgAge, icon: Calendar, color: '#8B5CF6' },
                    { label: 'Suburbs', value: uniqueSuburbs, icon: MapPin, color: '#EC4899' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${stat.color}20` }}>
                            <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                        </div>
                        <p className="text-2xl font-black text-white">{stat.value}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Submission Trend (30 days) */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Application Submissions — Last 30 Days</h3>
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={submissionsByDay} margin={{ left: 0, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" stroke="#64748b" fontSize={11} interval={4} />
                        <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Line type="monotone" dataKey="applications" stroke="#E50695" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Age + Suburb side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Age Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={ageData}>
                            <XAxis dataKey="age" stroke="#64748b" fontSize={12} />
                            <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                {ageData.map((_, i) => (
                                    <Cell key={i} fill={i % 2 === 0 ? '#E50695' : '#1226AA'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Top Suburbs</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={suburbData} layout="vertical" margin={{ left: 10 }}>
                            <XAxis type="number" stroke="#64748b" fontSize={12} allowDecimals={false} />
                            <YAxis dataKey="suburb" type="category" stroke="#64748b" fontSize={11} width={120} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Bar dataKey="count" fill="#8B5CF6" radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Clubs + Pipeline Stage Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Top Clubs</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={clubData} layout="vertical" margin={{ left: 10 }}>
                            <XAxis type="number" stroke="#64748b" fontSize={12} allowDecimals={false} />
                            <YAxis dataKey="club" type="category" stroke="#64748b" fontSize={10} width={130} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Bar dataKey="count" fill="#10B981" radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Pipeline Stage Distribution</h3>
                    {stagePieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={stagePieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                                    {stagePieData.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[250px]">
                            <p className="text-slate-600 text-sm">No pipeline data yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Weekly bar chart */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Weekly Submission Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                        <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="count" fill="#1226AA" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsPanel;
