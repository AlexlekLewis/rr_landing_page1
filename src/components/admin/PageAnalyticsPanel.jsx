import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Eye, Users, Clock, TrendingUp, Monitor, Smartphone,
    ArrowDown, MousePointer, ExternalLink, Globe
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
    AreaChart, Area, Treemap
} from 'recharts';
import { supabase } from '../../lib/supabase';

const COLORS = ['#E50695', '#1226AA', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#06B6D4', '#EF4444', '#84CC16', '#F97316'];

const SECTION_LABELS = {
    'intro': 'Introduction',
    'success-stories': 'Success Stories',
    'why-elite': 'Why Elite',
    'program': 'Program Features',
    'director': 'Director',
    'coaches': 'Coaches',
    'program-overview': 'Program Overview',
    'faq': 'FAQ',
    'bonus-offer': 'Bonus Offer',
    'apply-form': 'Application Form',
};

const SECTION_ORDER = ['intro', 'success-stories', 'why-elite', 'program', 'director', 'coaches', 'program-overview', 'faq', 'bonus-offer', 'apply-form'];

const tooltipStyle = {
    backgroundColor: '#1e293b',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '13px',
};

const StatCard = ({ label, value, icon: Icon, color, subtext }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${color}20` }}>
            <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <p className="text-2xl font-black text-white">{value}</p>
        <p className="text-slate-400 text-xs mt-0.5">{label}</p>
        {subtext && <p className="text-slate-500 text-[10px] mt-1">{subtext}</p>}
    </div>
);

const PageAnalyticsPanel = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30'); // days
    const [selectedPage, setSelectedPage] = useState('/eliteprogram/2026registration');

    const fetchData = useCallback(async () => {
        const since = new Date();
        since.setDate(since.getDate() - parseInt(dateRange));

        const { data, error } = await supabase
            .from('page_analytics')
            .select('*')
            .eq('page_path', selectedPage)
            .gte('created_at', since.toISOString())
            .order('created_at', { ascending: true });

        if (!error) setEvents(data || []);
        setLoading(false);
    }, [dateRange, selectedPage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // ── Derived Metrics ─────────────────────────────────────────

    const pageViews = useMemo(() => events.filter(e => e.event_type === 'page_view'), [events]);
    const uniqueSessions = useMemo(() => new Set(pageViews.map(e => e.session_id)).size, [pageViews]);

    const todayViews = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return pageViews.filter(e => e.created_at?.startsWith(today)).length;
    }, [pageViews]);

    const thisWeekViews = useMemo(() => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return pageViews.filter(e => new Date(e.created_at) > weekAgo).length;
    }, [pageViews]);

    // Average time on page from exit events
    const avgTimeOnPage = useMemo(() => {
        const exitEvents = events.filter(e => e.event_type === 'exit' && e.event_data?.total_seconds);
        if (exitEvents.length === 0) return '—';
        const avg = exitEvents.reduce((s, e) => s + e.event_data.total_seconds, 0) / exitEvents.length;
        const mins = Math.floor(avg / 60);
        const secs = Math.round(avg % 60);
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    }, [events]);

    // Bounce rate (sessions with exit < 10s or no scroll past 25%)
    const bounceRate = useMemo(() => {
        if (uniqueSessions === 0) return '—';
        const sessionMap = {};
        events.forEach(e => {
            if (!sessionMap[e.session_id]) sessionMap[e.session_id] = { maxScroll: 0, maxTime: 0 };
            if (e.event_type === 'scroll_depth') sessionMap[e.session_id].maxScroll = Math.max(sessionMap[e.session_id].maxScroll, e.event_data?.depth || 0);
            if (e.event_type === 'exit') sessionMap[e.session_id].maxTime = e.event_data?.total_seconds || 0;
            if (e.event_type === 'time_on_page') sessionMap[e.session_id].maxTime = Math.max(sessionMap[e.session_id].maxTime, e.event_data?.seconds || 0);
        });
        const bounces = Object.values(sessionMap).filter(s => s.maxTime < 10 && s.maxScroll < 25).length;
        return `${((bounces / uniqueSessions) * 100).toFixed(1)}%`;
    }, [events, uniqueSessions]);

    // Daily page views chart
    const dailyViews = useMemo(() => {
        const days = {};
        const daysCount = parseInt(dateRange);
        for (let i = daysCount - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days[d.toISOString().split('T')[0]] = 0;
        }
        pageViews.forEach(e => {
            const key = e.created_at?.split('T')[0];
            if (key && days[key] !== undefined) days[key]++;
        });
        return Object.entries(days).map(([date, count]) => ({
            date: new Date(date).toLocaleDateString('en-AU', { timeZone: 'Australia/Melbourne', day: 'numeric', month: 'short' }),
            views: count,
        }));
    }, [pageViews, dateRange]);

    // Device breakdown
    const deviceData = useMemo(() => {
        const counts = {};
        pageViews.forEach(e => {
            const d = e.device_type || 'unknown';
            counts[d] = (counts[d] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
    }, [pageViews]);

    // Referrer breakdown
    const referrerData = useMemo(() => {
        const counts = {};
        pageViews.forEach(e => {
            let ref = e.referrer || 'Direct';
            if (ref && ref !== 'Direct') {
                try {
                    const url = new URL(ref);
                    ref = url.hostname.replace('www.', '');
                } catch { /* keep raw */ }
            }
            counts[ref] = (counts[ref] || 0) + 1;
        });
        return Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8)
            .map(([source, count]) => ({ source, count }));
    }, [pageViews]);

    // Section engagement funnel
    const sectionEngagement = useMemo(() => {
        const sectionViews = events.filter(e => e.event_type === 'section_visible');
        const sessionSections = {};
        sectionViews.forEach(e => {
            const sid = e.session_id;
            if (!sessionSections[sid]) sessionSections[sid] = new Set();
            sessionSections[sid].add(e.event_data?.section);
        });

        return SECTION_ORDER.map((id) => {
            const count = Object.values(sessionSections).filter(s => s.has(id)).length;
            return {
                section: SECTION_LABELS[id] || id,
                id,
                viewers: count,
                pct: uniqueSessions > 0 ? Math.round((count / uniqueSessions) * 100) : 0,
            };
        });
    }, [events, uniqueSessions]);

    // Scroll depth distribution
    const scrollData = useMemo(() => {
        const depths = [10, 25, 50, 75, 90, 100];
        const sessionDepths = {};
        events.filter(e => e.event_type === 'scroll_depth').forEach(e => {
            const sid = e.session_id;
            sessionDepths[sid] = Math.max(sessionDepths[sid] || 0, e.event_data?.depth || 0);
        });
        const totalSessions = Object.keys(sessionDepths).length || 1;
        return depths.map(d => ({
            depth: `${d}%`,
            sessions: Object.values(sessionDepths).filter(v => v >= d).length,
            pct: Math.round((Object.values(sessionDepths).filter(v => v >= d).length / totalSessions) * 100),
        }));
    }, [events]);

    // CTA clicks
    const ctaData = useMemo(() => {
        const clicks = events.filter(e => e.event_type === 'cta_click');
        const counts = {};
        clicks.forEach(e => {
            const label = e.event_data?.cta || 'Unknown';
            counts[label] = (counts[label] || 0) + 1;
        });
        return Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([cta, count]) => ({ cta: cta.length > 30 ? cta.substring(0, 30) + '…' : cta, count }));
    }, [events]);

    // Conversion funnel
    const funnelData = useMemo(() => {
        const sessionMap = {};
        events.forEach(e => {
            const sid = e.session_id;
            if (!sessionMap[sid]) sessionMap[sid] = new Set();
            sessionMap[sid].add(e.event_type);
            if (e.event_type === 'section_visible') sessionMap[sid].add(`section:${e.event_data?.section}`);
        });
        const total = Object.keys(sessionMap).length || 1;
        const sawApply = Object.values(sessionMap).filter(s => s.has('section:apply-form')).length;
        const formStarts = events.filter(e => e.event_type === 'form_start').length;
        const formSubmits = events.filter(e => e.event_type === 'form_submit').length;

        return [
            { stage: 'Page View', count: total, pct: 100 },
            { stage: 'Saw Apply Section', count: sawApply, pct: Math.round((sawApply / total) * 100) },
            { stage: 'Started Form', count: formStarts, pct: Math.round((formStarts / total) * 100) },
            { stage: 'Submitted', count: formSubmits, pct: Math.round((formSubmits / total) * 100) },
        ];
    }, [events]);

    // Hourly heatmap
    const hourlyData = useMemo(() => {
        const hours = Array(24).fill(0);
        pageViews.forEach(e => {
            const h = new Date(e.created_at).getHours();
            hours[h]++;
        });
        return hours.map((count, h) => ({
            hour: `${h.toString().padStart(2, '0')}:00`,
            views: count,
        }));
    }, [pageViews]);


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
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider">SITE ANALYTICS</h1>
                    <p className="text-slate-400 text-sm mt-1">Visitor tracking & engagement insights</p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-rr-pink/50"
                    >
                        <option value="/eliteprogram/2026registration">Landing Page 1</option>
                        <option value="/offer/assessment">Landing Page 2</option>
                        <option value="/">Splash Page</option>
                    </select>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-rr-pink/50"
                    >
                        <option value="7">Last 7 days</option>
                        <option value="14">Last 14 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                    </select>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard label="Total Page Views" value={pageViews.length} icon={Eye} color="#3B82F6" />
                <StatCard label="Unique Sessions" value={uniqueSessions} icon={Users} color="#8B5CF6" />
                <StatCard label="Today" value={todayViews} icon={TrendingUp} color="#10B981" />
                <StatCard label="This Week" value={thisWeekViews} icon={TrendingUp} color="#EC4899" />
                <StatCard label="Avg Time" value={avgTimeOnPage} icon={Clock} color="#F59E0B" />
                <StatCard label="Bounce Rate" value={bounceRate} icon={ArrowDown} color="#EF4444" />
            </div>

            {/* Daily Views Chart */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Daily Page Views</h3>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={dailyViews} margin={{ left: 0, right: 20 }}>
                        <defs>
                            <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#E50695" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#E50695" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" stroke="#64748b" fontSize={11} interval={Math.floor(dailyViews.length / 8)} />
                        <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area type="monotone" dataKey="views" stroke="#E50695" strokeWidth={2.5} fill="url(#viewsGrad)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Section Engagement + Scroll Depth */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Section Engagement Funnel */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Section Engagement</h3>
                    <div className="space-y-2.5">
                        {sectionEngagement.map((s, i) => (
                            <div key={s.id} className="group">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-slate-300 text-xs font-medium">{s.section}</span>
                                    <span className="text-slate-500 text-xs">{s.viewers} sessions ({s.pct}%)</span>
                                </div>
                                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${s.pct}%` }}
                                        transition={{ duration: 0.8, delay: i * 0.05 }}
                                        className="h-full rounded-full"
                                        style={{ background: `linear-gradient(90deg, #E50695, ${COLORS[i % COLORS.length]})` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll Depth */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Scroll Depth</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={scrollData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="depth" stroke="#64748b" fontSize={12} />
                            <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                            <Tooltip contentStyle={tooltipStyle} formatter={(val, name) => [val, name === 'sessions' ? 'Sessions' : name]} />
                            <Bar dataKey="sessions" radius={[8, 8, 0, 0]}>
                                {scrollData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Device + Referrer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Device Breakdown */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Device Breakdown</h3>
                    {deviceData.length > 0 ? (
                        <div className="flex items-center gap-8">
                            <ResponsiveContainer width="50%" height={200}>
                                <PieChart>
                                    <Pie data={deviceData} cx="50%" cy="50%" outerRadius={80} innerRadius={50} dataKey="value" paddingAngle={3}>
                                        {deviceData.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipStyle} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-3">
                                {deviceData.map((d, i) => (
                                    <div key={d.name} className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        <div>
                                            <p className="text-white text-sm font-medium flex items-center gap-1.5">
                                                {d.name === 'Mobile' ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                                                {d.name}
                                            </p>
                                            <p className="text-slate-500 text-xs">{d.value} views ({pageViews.length > 0 ? Math.round((d.value / pageViews.length) * 100) : 0}%)</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-600 text-sm text-center py-12">No device data yet</p>
                    )}
                </div>

                {/* Referrer Sources */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Traffic Sources</h3>
                    {referrerData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={referrerData} layout="vertical" margin={{ left: 10 }}>
                                <XAxis type="number" stroke="#64748b" fontSize={12} allowDecimals={false} />
                                <YAxis dataKey="source" type="category" stroke="#64748b" fontSize={11} width={130} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Bar dataKey="count" fill="#1226AA" radius={[0, 8, 8, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-slate-600 text-sm text-center py-12">No referrer data yet</p>
                    )}
                </div>
            </div>

            {/* CTA Clicks + Conversion Funnel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* CTA Clicks */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">CTA Clicks</h3>
                    {ctaData.length > 0 ? (
                        <div className="space-y-3">
                            {ctaData.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <MousePointer className="w-4 h-4 text-rr-pink shrink-0" />
                                        <span className="text-slate-300 text-sm truncate">{item.cta}</span>
                                    </div>
                                    <span className="text-white font-bold text-sm shrink-0 ml-3">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-600 text-sm text-center py-12">No CTA clicks recorded yet</p>
                    )}
                </div>

                {/* Conversion Funnel */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Conversion Funnel</h3>
                    <div className="space-y-3">
                        {funnelData.map((step, i) => (
                            <div key={step.stage}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-slate-300 text-sm font-medium">{step.stage}</span>
                                    <span className="text-slate-500 text-xs">{step.count} ({step.pct}%)</span>
                                </div>
                                <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${step.pct}%` }}
                                        transition={{ duration: 0.8, delay: i * 0.15 }}
                                        className="h-full rounded-full"
                                        style={{ background: `linear-gradient(90deg, ${COLORS[i]}, ${COLORS[i + 1] || COLORS[0]})` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Hourly Traffic Heatmap */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Hourly Traffic Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={hourlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="hour" stroke="#64748b" fontSize={10} interval={2} />
                        <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="views" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* No data state */}
            {events.length === 0 && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                    <Eye className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-white font-bold text-lg mb-2">No Analytics Data Yet</h3>
                    <p className="text-slate-500 text-sm max-w-md mx-auto">
                        Page analytics will start appearing once visitors access the landing page.
                        Data is tracked automatically — no additional setup needed.
                    </p>
                </div>
            )}
        </div>
    );
};

export default PageAnalyticsPanel;
