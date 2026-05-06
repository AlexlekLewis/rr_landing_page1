import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Eye, Users, Clock, TrendingUp, Monitor, Smartphone,
    ArrowDown, MousePointer, ChevronDown, Activity,
    ArrowUp, Minus
} from 'lucide-react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
    AreaChart, Area
} from 'recharts';
import { supabase } from '../../lib/supabase';

const COLORS = ['#E50695', '#1226AA', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#06B6D4', '#EF4444', '#84CC16', '#F97316'];

// Friendly labels for known page paths. Anything unknown falls back to the raw path.
const PAGE_LABELS = {
    '/': 'Splash / Home',
    '/master-page': 'Master Landing Page',
    '/LP1/2026': 'Elite Program (LP1)',
    '/eliteprogram/2026registration': 'Elite Program — legacy URL',
    '/offer/assessment': 'Offer · Assessment (LP2)',
    '/offer/acceptance': 'Offer · Acceptance (LP3)',
    '/junior-royals': 'Junior Royals',
    '/little-crickets': 'Little Crickets — legacy URL',
    '/holiday-programs': 'Holiday Programs',
    '/female-cricket-kickstart': 'Female Cricket Kickstart',
    '/femalecricketintroduction': 'Female Cricket — legacy URL',
    '/female-empowerment': 'Female Empowerment',
};

const labelFor = (path) => PAGE_LABELS[path] || path;

const sectionLabel = (id) =>
    id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const tooltipStyle = {
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '13px',
    padding: '10px 12px',
};

// ── Reusable bits ───────────────────────────────────────────────────

const formatNumber = (n) => {
    if (n == null) return '—';
    if (typeof n !== 'number') return n;
    if (n >= 10000) return `${(n / 1000).toFixed(1)}k`;
    return n.toLocaleString();
};

const Trend = ({ delta }) => {
    if (delta == null || !isFinite(delta)) return null;
    if (Math.abs(delta) < 1) {
        return (
            <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-slate-500">
                <Minus className="w-3 h-3" /> 0%
            </span>
        );
    }
    const up = delta > 0;
    const Icon = up ? ArrowUp : ArrowDown;
    return (
        <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
            <Icon className="w-3 h-3" />
            {Math.round(Math.abs(delta))}%
        </span>
    );
};

const StatCard = ({ label, value, icon: Icon, color, delta, subtext }) => (
    <div className="relative bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.05] transition-colors">
        <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}1f` }}>
                <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <Trend delta={delta} />
        </div>
        <p className="text-2xl font-black text-white leading-none">{value}</p>
        <p className="text-slate-400 text-xs mt-1.5">{label}</p>
        {subtext && <p className="text-slate-500 text-[10px] mt-0.5">{subtext}</p>}
    </div>
);

const Card = ({ title, action, children, className = '' }) => (
    <div className={`bg-white/[0.03] border border-white/10 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">{title}</h3>
            {action}
        </div>
        {children}
    </div>
);

const EmptyHint = ({ children }) => (
    <div className="flex items-center justify-center py-12">
        <p className="text-slate-600 text-xs italic">{children}</p>
    </div>
);

// ── Main component ──────────────────────────────────────────────────

const PageAnalyticsPanel = () => {
    const [events, setEvents] = useState([]);
    const [prevEvents, setPrevEvents] = useState([]);
    const [pageList, setPageList] = useState([]);
    const [pageSections, setPageSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageListLoading, setPageListLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30');
    const [selectedPage, setSelectedPage] = useState(null);
    const [now, setNow] = useState(() => Date.now());

    // Keep the "live" badge and "last visit" stamp fresh — re-renders every 30s.
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 30_000);
        return () => clearInterval(id);
    }, []);

    // Fetch summary of all pages → populates dropdown
    useEffect(() => {
        let cancelled = false;
        setPageListLoading(true);
        supabase
            .rpc('page_analytics_summary', { days_back: parseInt(dateRange) })
            .then(({ data, error }) => {
                if (cancelled) return;
                if (error) {
                    console.error('[PageAnalytics] page summary error:', error);
                    setPageList([]);
                } else {
                    setPageList(data || []);
                    // Auto-select most active page if nothing selected (or current selection has no data)
                    if (data && data.length > 0) {
                        const stillValid = selectedPage && data.find(p => p.page_path === selectedPage);
                        if (!stillValid) setSelectedPage(data[0].page_path);
                    }
                }
                setPageListLoading(false);
            });
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateRange]);

    // Fetch events for selected page (current + previous period for deltas)
    const fetchData = useCallback(async () => {
        if (!selectedPage) return;
        setLoading(true);
        const days = parseInt(dateRange);
        const since = new Date();
        since.setDate(since.getDate() - days);
        const prevSince = new Date();
        prevSince.setDate(prevSince.getDate() - days * 2);

        const [curRes, prevRes, sectionRes] = await Promise.all([
            supabase
                .from('page_analytics')
                .select('*')
                .eq('page_path', selectedPage)
                .gte('created_at', since.toISOString())
                .order('created_at', { ascending: true }),
            supabase
                .from('page_analytics')
                .select('event_type, session_id, created_at')
                .eq('page_path', selectedPage)
                .gte('created_at', prevSince.toISOString())
                .lt('created_at', since.toISOString()),
            supabase
                .rpc('page_analytics_sections', { p_page_path: selectedPage, days_back: days }),
        ]);

        if (!curRes.error) setEvents(curRes.data || []);
        if (!prevRes.error) setPrevEvents(prevRes.data || []);
        if (!sectionRes.error) setPageSections(sectionRes.data || []);
        setLoading(false);
    }, [dateRange, selectedPage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // ── Derived metrics ─────────────────────────────────────────

    const pageViews = useMemo(() => events.filter(e => e.event_type === 'page_view'), [events]);
    const prevPageViews = useMemo(() => prevEvents.filter(e => e.event_type === 'page_view'), [prevEvents]);

    const uniqueSessions = useMemo(() => new Set(pageViews.map(e => e.session_id)).size, [pageViews]);
    const prevUniqueSessions = useMemo(() => new Set(prevPageViews.map(e => e.session_id)).size, [prevPageViews]);

    const todayViews = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return pageViews.filter(e => e.created_at?.startsWith(today)).length;
    }, [pageViews]);

    const thisWeekViews = useMemo(() => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return pageViews.filter(e => new Date(e.created_at) > weekAgo).length;
    }, [pageViews]);

    // Live: sessions seen in the last 5 minutes
    const liveSessions = useMemo(() => {
        const cutoff = now - 5 * 60 * 1000;
        const sids = new Set();
        events.forEach(e => {
            if (new Date(e.created_at).getTime() > cutoff) sids.add(e.session_id);
        });
        return sids.size;
    }, [events, now]);

    const avgTimeOnPage = useMemo(() => {
        const exitEvents = events.filter(e => e.event_type === 'exit' && e.event_data?.total_seconds);
        if (exitEvents.length === 0) return '—';
        const avg = exitEvents.reduce((s, e) => s + e.event_data.total_seconds, 0) / exitEvents.length;
        const mins = Math.floor(avg / 60);
        const secs = Math.round(avg % 60);
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    }, [events]);

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

    // Daily page views
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

    const deviceData = useMemo(() => {
        const counts = {};
        pageViews.forEach(e => {
            const d = e.device_type || 'unknown';
            counts[d] = (counts[d] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
    }, [pageViews]);

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

    // Section engagement — uses DYNAMIC section list from RPC, ordered by first_seen
    const sectionEngagement = useMemo(() => {
        if (pageSections.length === 0 || uniqueSessions === 0) return [];
        const top = pageSections[0]?.viewers || 1;
        return pageSections.map(s => ({
            id: s.section,
            section: sectionLabel(s.section),
            viewers: Number(s.viewers),
            pct: Math.round((Number(s.viewers) / top) * 100),
            sessionPct: uniqueSessions > 0 ? Math.round((Number(s.viewers) / uniqueSessions) * 100) : 0,
        }));
    }, [pageSections, uniqueSessions]);

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
            .map(([cta, count]) => ({ cta: cta.length > 36 ? cta.substring(0, 36) + '…' : cta, count }));
    }, [events]);

    // Conversion funnel — drives the apply-section name from real sections if present
    const funnelData = useMemo(() => {
        const applySectionId = pageSections.find(s =>
            /apply|form|register|registration|checkout|signup/i.test(s.section)
        )?.section;

        const sessionMap = {};
        events.forEach(e => {
            const sid = e.session_id;
            if (!sessionMap[sid]) sessionMap[sid] = new Set();
            sessionMap[sid].add(e.event_type);
            if (e.event_type === 'section_visible') sessionMap[sid].add(`section:${e.event_data?.section}`);
        });
        const total = Object.keys(sessionMap).length || 1;
        const sawApply = applySectionId
            ? Object.values(sessionMap).filter(s => s.has(`section:${applySectionId}`)).length
            : null;
        const formStarts = events.filter(e => e.event_type === 'form_start').length;
        const formSubmits = events.filter(e => e.event_type === 'form_submit').length;

        const steps = [
            { stage: 'Page View', count: total, pct: 100 },
        ];
        if (sawApply !== null) {
            steps.push({
                stage: `Reached ${sectionLabel(applySectionId)}`,
                count: sawApply,
                pct: Math.round((sawApply / total) * 100),
            });
        }
        steps.push({ stage: 'Started Form', count: formStarts, pct: Math.round((formStarts / total) * 100) });
        steps.push({ stage: 'Submitted', count: formSubmits, pct: Math.round((formSubmits / total) * 100) });
        return steps;
    }, [events, pageSections]);

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

    const peakHour = useMemo(() => {
        const idx = hourlyData.reduce((max, h, i) => h.views > hourlyData[max].views ? i : max, 0);
        return hourlyData[idx]?.views > 0 ? hourlyData[idx].hour : null;
    }, [hourlyData]);

    // Trend deltas (current vs previous period)
    const viewsDelta = useMemo(() => {
        if (prevPageViews.length === 0) return null;
        return ((pageViews.length - prevPageViews.length) / prevPageViews.length) * 100;
    }, [pageViews, prevPageViews]);

    const sessionsDelta = useMemo(() => {
        if (prevUniqueSessions === 0) return null;
        return ((uniqueSessions - prevUniqueSessions) / prevUniqueSessions) * 100;
    }, [uniqueSessions, prevUniqueSessions]);

    const selectedPageMeta = pageList.find(p => p.page_path === selectedPage);
    const lastSeenMins = selectedPageMeta?.last_seen
        ? Math.floor((now - new Date(selectedPageMeta.last_seen).getTime()) / 60000)
        : null;

    // ── Render ──────────────────────────────────────────────────

    if (pageListLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <svg className="animate-spin w-8 h-8 text-rr-pink" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </div>
        );
    }

    if (pageList.length === 0) {
        return (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-12 text-center">
                <Eye className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-white font-bold text-lg mb-2">No tracked pages in this range</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                    No <code className="text-slate-400">page_analytics</code> events exist in the selected window.
                    Try a wider range, or check that <code className="text-slate-400">usePageAnalytics</code> is mounted on a live page.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1.5">
                        <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider">SITE ANALYTICS</h1>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <span className="relative flex w-2 h-2">
                                <span className="animate-ping absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400"></span>
                            </span>
                            <span className="text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                                {liveSessions} live
                            </span>
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm">
                        {labelFor(selectedPage)}
                        {lastSeenMins !== null && lastSeenMins < 60 * 24 && (
                            <span className="text-slate-500"> · last visit {lastSeenMins < 1 ? 'just now' : `${lastSeenMins}m ago`}</span>
                        )}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                    <div className="relative">
                        <select
                            value={selectedPage || ''}
                            onChange={(e) => setSelectedPage(e.target.value)}
                            className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-9 py-2.5 text-slate-200 text-sm font-medium focus:outline-none focus:border-rr-pink/50 cursor-pointer min-w-[260px]"
                        >
                            {pageList.map(p => (
                                <option key={p.page_path} value={p.page_path} className="bg-slate-900">
                                    {labelFor(p.page_path)} · {formatNumber(Number(p.events))}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-9 py-2.5 text-slate-200 text-sm font-medium focus:outline-none focus:border-rr-pink/50 cursor-pointer"
                        >
                            <option value="7" className="bg-slate-900">Last 7 days</option>
                            <option value="14" className="bg-slate-900">Last 14 days</option>
                            <option value="30" className="bg-slate-900">Last 30 days</option>
                            <option value="90" className="bg-slate-900">Last 90 days</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>

            {loading && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-3">
                    <Activity className="w-4 h-4 text-rr-pink animate-pulse" />
                    <span className="text-slate-400 text-xs">Loading events for {labelFor(selectedPage)}…</span>
                </div>
            )}

            {/* KPI cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard label="Total Page Views" value={formatNumber(pageViews.length)} icon={Eye} color="#3B82F6" delta={viewsDelta} subtext={viewsDelta != null ? 'vs prior period' : null} />
                <StatCard label="Unique Sessions" value={formatNumber(uniqueSessions)} icon={Users} color="#8B5CF6" delta={sessionsDelta} subtext={sessionsDelta != null ? 'vs prior period' : null} />
                <StatCard label="Today" value={formatNumber(todayViews)} icon={TrendingUp} color="#10B981" />
                <StatCard label="This Week" value={formatNumber(thisWeekViews)} icon={TrendingUp} color="#EC4899" />
                <StatCard label="Avg Time" value={avgTimeOnPage} icon={Clock} color="#F59E0B" />
                <StatCard label="Bounce Rate" value={bounceRate} icon={ArrowDown} color="#EF4444" subtext="<10s & <25% scroll" />
            </div>

            {/* Daily Views Chart */}
            <Card title="Daily Page Views" action={peakHour && (
                <span className="text-slate-500 text-xs">Peak hour: <span className="text-slate-300 font-medium">{peakHour}</span></span>
            )}>
                {dailyViews.some(d => d.views > 0) ? (
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={dailyViews} margin={{ left: 0, right: 20, top: 5 }}>
                            <defs>
                                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#E50695" stopOpacity={0.35} />
                                    <stop offset="100%" stopColor="#E50695" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="date" stroke="#64748b" fontSize={11} interval={Math.max(0, Math.floor(dailyViews.length / 8))} />
                            <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} width={32} />
                            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: '#E50695', strokeOpacity: 0.2 }} />
                            <Area type="monotone" dataKey="views" stroke="#E50695" strokeWidth={2.5} fill="url(#viewsGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : <EmptyHint>No views in this window.</EmptyHint>}
            </Card>

            {/* Section Engagement + Scroll Depth */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Section Engagement" action={
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider">% of top section</span>
                }>
                    {sectionEngagement.length > 0 ? (
                        <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                            {sectionEngagement.map((s, i) => (
                                <div key={s.id}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-slate-300 text-xs font-medium truncate pr-3">{s.section}</span>
                                        <span className="text-slate-500 text-[11px] shrink-0 tabular-nums">
                                            {formatNumber(s.viewers)} <span className="text-slate-600">·</span> {s.sessionPct}%
                                        </span>
                                    </div>
                                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${s.pct}%` }}
                                            transition={{ duration: 0.8, delay: i * 0.04 }}
                                            className="h-full rounded-full"
                                            style={{ background: `linear-gradient(90deg, #E50695, ${COLORS[i % COLORS.length]})` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyHint>No section_visible events for this page yet.</EmptyHint>
                    )}
                </Card>

                <Card title="Scroll Depth">
                    {scrollData.some(d => d.sessions > 0) ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={scrollData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="depth" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} width={32} />
                                <Tooltip contentStyle={tooltipStyle} formatter={(val) => [val, 'Sessions']} />
                                <Bar dataKey="sessions" radius={[8, 8, 0, 0]}>
                                    {scrollData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <EmptyHint>No scroll data yet.</EmptyHint>}
                </Card>
            </div>

            {/* Device + Referrer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Device Breakdown">
                    {deviceData.length > 0 ? (
                        <div className="flex items-center gap-6">
                            <ResponsiveContainer width="50%" height={200}>
                                <PieChart>
                                    <Pie data={deviceData} cx="50%" cy="50%" outerRadius={80} innerRadius={52} dataKey="value" paddingAngle={3}>
                                        {deviceData.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipStyle} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-3 flex-1">
                                {deviceData.map((d, i) => (
                                    <div key={d.name} className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        <div className="min-w-0">
                                            <p className="text-white text-sm font-medium flex items-center gap-1.5">
                                                {d.name === 'Mobile' ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                                                {d.name}
                                            </p>
                                            <p className="text-slate-500 text-xs">{formatNumber(d.value)} views ({pageViews.length > 0 ? Math.round((d.value / pageViews.length) * 100) : 0}%)</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : <EmptyHint>No device data yet.</EmptyHint>}
                </Card>

                <Card title="Traffic Sources">
                    {referrerData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={referrerData} layout="vertical" margin={{ left: 10 }}>
                                <XAxis type="number" stroke="#64748b" fontSize={12} allowDecimals={false} />
                                <YAxis dataKey="source" type="category" stroke="#64748b" fontSize={11} width={130} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Bar dataKey="count" fill="#1226AA" radius={[0, 8, 8, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <EmptyHint>No referrer data yet.</EmptyHint>}
                </Card>
            </div>

            {/* CTA Clicks + Conversion Funnel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="CTA Clicks">
                    {ctaData.length > 0 ? (
                        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                            {ctaData.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <MousePointer className="w-4 h-4 text-rr-pink shrink-0" />
                                        <span className="text-slate-300 text-sm truncate">{item.cta}</span>
                                    </div>
                                    <span className="text-white font-bold text-sm shrink-0 ml-3 tabular-nums">{formatNumber(item.count)}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyHint>No CTA clicks. Add <code className="text-slate-500">data-cta="…"</code> to buttons to start tracking.</EmptyHint>
                    )}
                </Card>

                <Card title="Conversion Funnel">
                    <div className="space-y-3">
                        {funnelData.map((step, i) => (
                            <div key={step.stage}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-slate-300 text-sm font-medium">{step.stage}</span>
                                    <span className="text-slate-500 text-xs tabular-nums">{formatNumber(step.count)} ({step.pct}%)</span>
                                </div>
                                <div className="h-3.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${step.pct}%` }}
                                        transition={{ duration: 0.8, delay: i * 0.15 }}
                                        className="h-full rounded-full"
                                        style={{ background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i + 1) % COLORS.length]})` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Hourly Traffic */}
            <Card title="Hourly Traffic Distribution" action={
                <span className="text-slate-500 text-xs">Local time</span>
            }>
                {pageViews.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={hourlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="hour" stroke="#64748b" fontSize={10} interval={2} />
                            <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} width={32} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Bar dataKey="views" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : <EmptyHint>No views in this window.</EmptyHint>}
            </Card>
        </div>
    );
};

export default PageAnalyticsPanel;
