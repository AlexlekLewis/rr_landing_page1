import React, { useState, useEffect, useMemo, useCallback } from 'react';
import useRealtimeSync from '../../hooks/useRealtimeSync';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Users, DollarSign, MessageCircle, Trophy, ArrowRight, TrendingUp, Calendar,
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts';
import { supabase } from '../../lib/supabase';

const TZ = 'Australia/Melbourne';

const formatAUD = (cents) => {
    if (cents == null) return '$0';
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(Number(cents) / 100);
};

const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-AU', { timeZone: TZ, day: '2-digit', month: 'short', year: 'numeric' });
};

const PROGRAM_DISPLAY = {
    elite:            { label: 'Elite Program',    color: '#E11F8F' },
    junior_royals:    { label: 'Junior Royals',    color: '#3B82F6' },
    holiday:          { label: 'Holiday Programs', color: '#F59E0B' },
    female_kickstart: { label: 'Female Kickstart', color: '#D946EF' },
    shop:             { label: 'Shop Order',       color: '#10B981' },
};

const StatCard = ({ label, value, icon: Icon, color, subtext, to }) => {
    const inner = (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all h-full">
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                </div>
                {to && <ArrowRight className="w-4 h-4 text-slate-600" />}
            </div>
            <p className="text-3xl font-black text-white mb-1">{value}</p>
            <p className="text-slate-400 text-sm font-medium">{label}</p>
            {subtext && <p className="text-slate-500 text-xs mt-1">{subtext}</p>}
        </div>
    );
    return to ? <Link to={to}>{inner}</Link> : <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>{inner}</motion.div>;
};

const DashboardOverview = () => {
    const [registrations, setRegistrations] = useState([]);
    const [shopTraining, setShopTraining] = useState([]);
    const [shopIpl, setShopIpl] = useState([]);
    const [leads, setLeads] = useState([]);
    const [subsidies, setSubsidies] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const [regsRes, shopTRes, shopIRes, leadsRes, subRes] = await Promise.all([
                supabase.from('program_registrations').select('id, customer_email, program, amount_total_cents, paid_at').eq('payment_status', 'completed'),
                supabase.from('shop_orders_training').select('id, customer_email, total, paid_at').eq('payment_status', 'completed'),
                supabase.from('shop_orders_ipl').select('id, customer_email, total, paid_at').eq('payment_status', 'completed'),
                supabase.from('crm_leads').select('id, source_type, stage, suburb, created_at, full_name, first_name, last_name, email').eq('is_archived', false),
                supabase.from('academy_member_subsidies').select('id, player_name, program').eq('active', true),
            ]);
            setRegistrations(regsRes.data || []);
            setShopTraining(shopTRes.data || []);
            setShopIpl(shopIRes.data || []);
            setLeads(leadsRes.data || []);
            setSubsidies(subRes.data || []);
        } catch (err) {
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);
    useRealtimeSync(['program_registrations', 'shop_orders_training', 'shop_orders_ipl', 'crm_leads', 'academy_member_subsidies'], fetchData);

    const metrics = useMemo(() => {
        const now = Date.now();
        const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
        const monthStart = (() => { const d = new Date(); d.setDate(1); d.setHours(0,0,0,0); return d.getTime(); })();

        // Unique paid members across program_registrations + shop_orders_*, plus subsidies
        const memberEmails = new Set();
        for (const r of registrations) if (r.customer_email) memberEmails.add(r.customer_email.toLowerCase());
        for (const s of shopTraining) if (s.customer_email) memberEmails.add(s.customer_email.toLowerCase());
        for (const s of shopIpl) if (s.customer_email) memberEmails.add(s.customer_email.toLowerCase());
        const totalMembers = memberEmails.size + subsidies.length;

        // Revenue this month
        const inMonth = (iso) => iso && new Date(iso).getTime() >= monthStart;
        const revenueMonthCents =
            registrations.filter(r => inMonth(r.paid_at)).reduce((s, r) => s + (r.amount_total_cents || 0), 0)
            + shopTraining.filter(o => inMonth(o.paid_at)).reduce((s, o) => s + (o.total || 0), 0)
            + shopIpl.filter(o => inMonth(o.paid_at)).reduce((s, o) => s + (o.total || 0), 0);

        // New paid members this week (by paid_at)
        const inWeek = (iso) => iso && new Date(iso).getTime() >= weekAgo;
        const newPaidWeekEmails = new Set();
        for (const r of registrations) if (inWeek(r.paid_at) && r.customer_email) newPaidWeekEmails.add(r.customer_email.toLowerCase());
        for (const s of shopTraining) if (inWeek(s.paid_at) && s.customer_email) newPaidWeekEmails.add(s.customer_email.toLowerCase());
        for (const s of shopIpl) if (inWeek(s.paid_at) && s.customer_email) newPaidWeekEmails.add(s.customer_email.toLowerCase());

        const newInquiriesWeek = leads.filter(l => l.created_at && new Date(l.created_at).getTime() >= weekAgo).length;

        // Members per program (counts of paid registrations, with subsidies added)
        const byProgram = {};
        for (const r of registrations) {
            const p = r.program || 'unknown';
            byProgram[p] = byProgram[p] || new Set();
            if (r.customer_email) byProgram[p].add(r.customer_email.toLowerCase());
        }
        for (const s of subsidies) {
            byProgram[s.program] = byProgram[s.program] || new Set();
            byProgram[s.program].add(`subsidy:${s.id}`);
        }
        const programChartData = Object.entries(byProgram)
            .map(([p, set]) => ({
                program: p,
                label: PROGRAM_DISPLAY[p]?.label || p,
                color: PROGRAM_DISPLAY[p]?.color || '#94A3B8',
                count: set.size,
            }))
            .sort((a, b) => b.count - a.count);

        // Inquiry sources for the side chart
        const inquirySource = {};
        for (const l of leads) {
            const s = l.source_type || 'unknown';
            inquirySource[s] = (inquirySource[s] || 0) + 1;
        }
        const inquirySourceData = Object.entries(inquirySource)
            .map(([s, c]) => ({ source: s.replace(/_/g, ' '), count: c }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);

        // Latest paid + latest inquiries
        const latestMembers = [...registrations]
            .filter(r => r.paid_at)
            .sort((a, b) => new Date(b.paid_at) - new Date(a.paid_at))
            .slice(0, 5);
        const latestInquiries = [...leads]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);

        // Inquiry → paid conversion
        const paidEmails = new Set();
        for (const r of registrations) if (r.customer_email) paidEmails.add(r.customer_email.toLowerCase());
        const convertedInquiries = leads.filter(l =>
            (l.email && paidEmails.has(l.email.toLowerCase())) ||
            (l.parent_email && paidEmails.has(l.parent_email.toLowerCase()))
        ).length;
        const conversionRate = leads.length > 0 ? Math.round((convertedInquiries / leads.length) * 100) : 0;

        return {
            totalMembers,
            revenueMonthCents,
            newPaidWeek: newPaidWeekEmails.size,
            newInquiriesWeek,
            programChartData,
            inquirySourceData,
            latestMembers,
            latestInquiries,
            activePrograms: programChartData.filter(p => p.count > 0 && p.program !== 'shop').length,
            conversionRate,
        };
    }, [registrations, shopTraining, shopIpl, leads, subsidies]);

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

    const monthName = new Date().toLocaleDateString('en-AU', { timeZone: TZ, month: 'long', year: 'numeric' });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider">DASHBOARD</h1>
                <p className="text-slate-400 text-sm mt-1">Live snapshot — every figure sourced from Stripe payments + active subsidies.</p>
            </div>

            {/* Top KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Academy Members"
                    value={metrics.totalMembers}
                    icon={Users}
                    color="#E11F8F"
                    subtext="Paid + active subsidies"
                    to="/rramadmin_26/academy-members"
                />
                <StatCard
                    label={`Revenue — ${monthName}`}
                    value={formatAUD(metrics.revenueMonthCents)}
                    icon={DollarSign}
                    color="#10B981"
                    subtext="Programs + shop"
                />
                <StatCard
                    label="Inquiries this week"
                    value={metrics.newInquiriesWeek}
                    icon={MessageCircle}
                    color="#3B82F6"
                    subtext={`${metrics.conversionRate}% inquiry → paid overall`}
                    to="/rramadmin_26/inquiries"
                />
                <StatCard
                    label="New paid members this week"
                    value={metrics.newPaidWeek}
                    icon={TrendingUp}
                    color="#F59E0B"
                    subtext={`${metrics.activePrograms} active programs`}
                />
            </div>

            {/* Members by Program + Inquiry sources */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold text-sm uppercase tracking-wider">Members by Program</h3>
                        <Link to="/rramadmin_26/program-registrations" className="text-rr-pink text-xs font-bold hover:text-rr-light-pink">View all →</Link>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={metrics.programChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis type="number" stroke="#64748b" fontSize={12} />
                            <YAxis dataKey="label" type="category" stroke="#64748b" fontSize={12} width={140} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '13px' }}
                                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                            />
                            <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                                {metrics.programChartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold text-sm uppercase tracking-wider">Inquiry Sources</h3>
                        <Link to="/rramadmin_26/inquiries" className="text-rr-pink text-xs font-bold hover:text-rr-light-pink">View →</Link>
                    </div>
                    {metrics.inquirySourceData.length === 0 ? (
                        <p className="text-slate-500 text-sm py-12 text-center">No inquiries yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {metrics.inquirySourceData.map((s, i) => {
                                const max = metrics.inquirySourceData[0].count;
                                const pct = (s.count / max) * 100;
                                return (
                                    <div key={s.source}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-300 capitalize">{s.source}</span>
                                            <span className="text-white font-bold">{s.count}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: '#3B82F6' }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Latest activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold text-sm uppercase tracking-wider">Latest Paid Members</h3>
                        <Link to="/rramadmin_26/program-registrations" className="text-rr-pink text-xs font-bold hover:text-rr-light-pink">View all →</Link>
                    </div>
                    {metrics.latestMembers.length === 0 ? (
                        <p className="text-slate-500 text-sm py-12 text-center">No paid registrations yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {metrics.latestMembers.map(r => (
                                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                    <div className="min-w-0">
                                        <p className="text-white font-medium text-sm truncate">{r.customer_email || '—'}</p>
                                        <p className="text-slate-500 text-xs truncate">
                                            <span className="capitalize">{(PROGRAM_DISPLAY[r.program]?.label || r.program || 'unknown')}</span> · {formatDate(r.paid_at)}
                                        </p>
                                    </div>
                                    <span className="text-emerald-400 font-bold text-sm whitespace-nowrap ml-3">{formatAUD(r.amount_total_cents)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold text-sm uppercase tracking-wider">Latest Inquiries</h3>
                        <Link to="/rramadmin_26/inquiries" className="text-rr-pink text-xs font-bold hover:text-rr-light-pink">View all →</Link>
                    </div>
                    {metrics.latestInquiries.length === 0 ? (
                        <p className="text-slate-500 text-sm py-12 text-center">No inquiries yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {metrics.latestInquiries.map(l => (
                                <div key={l.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                    <div className="min-w-0">
                                        <p className="text-white font-medium text-sm truncate">
                                            {l.full_name || `${l.first_name || ''} ${l.last_name || ''}`.trim() || l.email || '—'}
                                        </p>
                                        <p className="text-slate-500 text-xs truncate capitalize">
                                            {(l.source_type || 'unknown').replace(/_/g, ' ')}
                                            {l.suburb && ` · ${l.suburb}`}
                                            · {formatDate(l.created_at)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
