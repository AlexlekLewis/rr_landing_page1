import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plane, Users, FileCheck, FileText, ShieldCheck, Globe, CheckCircle2,
    Clock, Plus, Copy, RefreshCw, X, Search, ChevronRight, Edit3, AlertCircle,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const TZ = 'Australia/Melbourne';
const DEPARTURE = new Date('2026-06-25T00:00:00+10:00');

const fmtDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-AU', { timeZone: TZ, day: '2-digit', month: 'short', year: 'numeric' });
};

const STATUS_META = {
    invited:         { label: 'Invited',         class: 'bg-slate-500/15 text-slate-300 border-slate-500/20' },
    intake_started:  { label: 'In progress',     class: 'bg-blue-400/15 text-blue-300 border-blue-400/20' },
    intake_complete: { label: 'Intake done',     class: 'bg-fuchsia-400/15 text-fuchsia-300 border-fuchsia-400/20' },
    visa_submitted:  { label: 'Visa submitted',  class: 'bg-amber-400/15 text-amber-300 border-amber-400/20' },
    visa_approved:   { label: 'Visa approved',   class: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/20' },
    ready:           { label: 'Ready',           class: 'bg-green-500/15 text-green-300 border-green-500/20' },
    cancelled:       { label: 'Cancelled',       class: 'bg-red-500/15 text-red-300 border-red-500/20' },
};

const Pill = ({ status }) => {
    const meta = STATUS_META[status] || STATUS_META.invited;
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${meta.class}`}>
            {meta.label}
        </span>
    );
};

const Kpi = ({ icon: Icon, label, value, sub, accent = 'text-rr-pink' }) => (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
        <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${accent}`}>
            <Icon className="w-3.5 h-3.5" /> {label}
        </div>
        <div className="text-2xl font-black text-white mt-1.5 tracking-tight">{value}</div>
        <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>
    </div>
);

export default function IndiaTour2026Dashboard() {
    const [tab, setTab] = useState('overview');
    const [travellers, setTravellers] = useState([]);
    const [checklist, setChecklist] = useState([]);
    const [docs, setDocs] = useState([]);
    const [cohort, setCohort] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [showAssign, setShowAssign] = useState(false);

    const days = Math.max(0, Math.ceil((DEPARTURE - new Date()) / 86400000));

    const load = useCallback(async () => {
        setLoading(true); setErr(null);
        try {
            const [t, c, d] = await Promise.all([
                supabase.from('india_tour_2026_travellers').select('*').order('traveller_type', { ascending: true }).order('surname', { ascending: true }),
                supabase.from('india_tour_2026_checklist').select('*').order('sort_order', { ascending: true }),
                supabase.from('india_tour_2026_documents').select('*'),
            ]);
            if (t.error) throw t.error;
            if (c.error) throw c.error;
            if (d.error) throw d.error;
            setTravellers(t.data || []); setChecklist(c.data || []); setDocs(d.data || []);
        } catch (e) { setErr(e.message); }
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const loadCohort = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('official_cohort_2026')
                .select('id,player_name,gender,age,parent1_email,parent1_phone')
                .order('player_name', { ascending: true });
            if (error) throw error;
            setCohort(data || []);
        } catch (e) { setErr(e.message); }
    }, []);

    const kpis = useMemo(() => {
        const total = travellers.length;
        const intakeDone = travellers.filter(t => t.intake_completed_at).length;
        const passportsOK = travellers.filter(t => t.passport_no && t.passport_expiry && new Date(t.passport_expiry) > new Date('2027-01-07')).length;
        const visasOK = travellers.filter(t => t.status === 'visa_approved' || t.status === 'ready').length;
        const cd = checklist.filter(c => c.status === 'done').length;
        return { total, intakeDone, passportsOK, visasOK, cd, ct: checklist.length };
    }, [travellers, checklist]);

    return (
        <div className="text-white">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-3xl mb-6"
                style={{ background: 'linear-gradient(135deg,#001D48 0%,#1226AA 45%,#E11F8F 100%)' }}>
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-rr-pink/40 blur-3xl pointer-events-none" />
                <div className="relative p-6 md:p-7 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-rr-pink shadow-[0_8px_24px_rgba(225,31,143,0.45)] flex items-center justify-center">
                            <Plane className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold tracking-[0.25em] text-pink-200 uppercase">Royals Way · Tour Manager</p>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1">India Tour 2026</h1>
                            <p className="text-pink-100 text-xs mt-1 font-medium">26 Jun → 7 Jul · Jaipur Academy · {kpis.total} of 18 travellers</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-5xl font-black leading-none tracking-tighter">{days}</div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink-200 mt-2">{days === 1 ? 'day' : 'days'} to departure</div>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                <Kpi icon={Users}        label="Travellers"      value={`${kpis.total}/18`}              sub="players + staff" />
                <Kpi icon={FileCheck}    label="Intake"          value={`${kpis.intakeDone}/${kpis.total || 0}`} sub="forms returned" accent="text-blue-400" />
                <Kpi icon={ShieldCheck}  label="Passports OK"    value={`${kpis.passportsOK}/${kpis.total || 0}`} sub="valid past Jan 2027" accent="text-amber-400" />
                <Kpi icon={Globe}        label="Visas approved"  value={`${kpis.visasOK}/${kpis.total || 0}`} sub="e-Tourist" accent="text-emerald-400" />
                <Kpi icon={CheckCircle2} label="Checklist"       value={`${kpis.cd}/${kpis.ct}`} sub={`${kpis.ct ? Math.round(100 * kpis.cd / kpis.ct) : 0}% complete`} />
                <Kpi icon={Clock}        label="Days out"        value={days} sub="to wheels up" accent="text-yellow-400" />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 mb-4 border-b border-white/5">
                {[
                    { id: 'overview',   label: 'Overview',   icon: Plane },
                    { id: 'travellers', label: 'Travellers', icon: Users },
                    { id: 'checklist',  label: 'Checklist',  icon: CheckCircle2 },
                    { id: 'documents',  label: 'Documents',  icon: FileText },
                ].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-colors ${tab === t.id ? 'text-white border-rr-pink' : 'text-slate-400 border-transparent hover:text-slate-200'}`}>
                        <t.icon className="w-4 h-4" /> {t.label}
                    </button>
                ))}
                <div className="ml-auto flex gap-2">
                    <button onClick={() => { loadCohort(); setShowAssign(true); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rr-pink hover:bg-rr-pink/90 text-white text-xs font-bold transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Assign players
                    </button>
                    <button onClick={load}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors">
                        <RefreshCw className="w-3.5 h-3.5" /> Refresh
                    </button>
                </div>
            </div>

            {err && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-2.5 rounded-xl mb-4 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {err}
                </div>
            )}

            {loading ? (
                <div className="py-20 text-center text-slate-400">Loading tour data…</div>
            ) : (
                <>
                    {tab === 'overview' && <Overview travellers={travellers} checklist={checklist} />}
                    {tab === 'travellers' && <Travellers travellers={travellers} onSelect={setSelectedId} />}
                    {tab === 'checklist' && <Checklist checklist={checklist} reload={load} />}
                    {tab === 'documents' && <Documents travellers={travellers} docs={docs} />}
                </>
            )}

            <AnimatePresence>
                {selectedId && (
                    <TravellerDrawer
                        traveller={travellers.find(t => t.id === selectedId)}
                        docs={docs.filter(d => d.traveller_id === selectedId)}
                        onClose={() => setSelectedId(null)}
                        reload={load}
                    />
                )}
                {showAssign && (
                    <AssignModal
                        cohort={cohort}
                        existing={travellers}
                        onClose={() => setShowAssign(false)}
                        onDone={() => { setShowAssign(false); load(); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
function Overview({ travellers, checklist }) {
    const sections = useMemo(() => {
        const m = {};
        checklist.forEach(c => { (m[c.section_id] ||= { id: c.section_id, title: c.section_title, items: [] }).items.push(c); });
        return Object.values(m);
    }, [checklist]);
    const next7 = checklist.filter(c => c.status !== 'done' && c.due_date && (new Date(c.due_date) - new Date()) / 86400000 <= 7).slice(0, 10);
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                <h3 className="text-sm font-black mb-4 tracking-tight">Section progress</h3>
                {sections.map(s => {
                    const done = s.items.filter(i => i.status === 'done').length;
                    const pct = s.items.length ? Math.round(100 * done / s.items.length) : 0;
                    return (
                        <div key={s.id} className="mb-3">
                            <div className="flex justify-between items-baseline mb-1.5">
                                <div className="text-xs font-bold text-white">{s.title}</div>
                                <div className="text-[11px] text-slate-500 font-medium">{done} / {s.items.length} · {pct}%</div>
                            </div>
                            <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-rr-pink to-pink-300 transition-all" style={{ width: `${pct}%` }} />
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                <h3 className="text-sm font-black mb-4 tracking-tight">Due in next 7 days</h3>
                {next7.length === 0 ? (
                    <div className="text-xs text-slate-500">Nothing due in the next 7 days.</div>
                ) : next7.map(c => (
                    <div key={c.id} className="py-2 border-b border-white/5 last:border-0 flex items-start gap-2.5">
                        <div className="w-1 h-7 bg-rr-pink rounded-full mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-white leading-snug">{c.text}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{c.section_title} · due {fmtDate(c.due_date)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
function Travellers({ travellers, onSelect }) {
    const [q, setQ] = useState('');
    const list = travellers.filter(t => {
        const name = `${t.given_names || ''} ${t.surname || ''}`.toLowerCase();
        return !q || name.includes(q.toLowerCase()) || (t.email || '').toLowerCase().includes(q.toLowerCase());
    });
    return (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-3 flex items-center gap-2 border-b border-white/5">
                <div className="relative flex-1 max-w-sm">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name or email…"
                        className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/5 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-rr-pink/50" />
                </div>
                <div className="ml-auto text-[11px] text-slate-500">{list.length} of {travellers.length}</div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white/[0.02]">
                            <th className="text-left px-4 py-3">Name</th>
                            <th className="text-left px-4 py-3">Role</th>
                            <th className="text-left px-4 py-3">Status</th>
                            <th className="text-left px-4 py-3">Passport</th>
                            <th className="text-left px-4 py-3">Intake</th>
                            <th className="text-left px-4 py-3">Updated</th>
                            <th className="px-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map(t => {
                            const pOK = t.passport_no && t.passport_expiry && new Date(t.passport_expiry) > new Date('2027-01-07');
                            return (
                                <tr key={t.id} onClick={() => onSelect(t.id)}
                                    className="border-t border-white/5 hover:bg-white/[0.03] cursor-pointer transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="font-bold text-white text-sm">{(t.given_names || t.surname) ? `${t.given_names || ''} ${t.surname || ''}`.trim() : '(name pending)'}</div>
                                        <div className="text-[11px] text-slate-500">{t.email || '—'}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-xs text-slate-300">{t.traveller_type === 'player' ? 'Player' : 'Staff'}</div>
                                        <div className="text-[11px] text-slate-500">{t.role}</div>
                                    </td>
                                    <td className="px-4 py-3"><Pill status={t.status} /></td>
                                    <td className="px-4 py-3">
                                        {t.passport_no
                                            ? <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${pOK ? 'bg-emerald-400/15 text-emerald-300 border-emerald-400/20' : 'bg-red-500/15 text-red-300 border-red-500/20'}`}>{pOK ? 'Valid' : 'Renew'}</span>
                                            : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-slate-500/15 text-slate-400 border-slate-500/20">Missing</span>}
                                    </td>
                                    <td className="px-4 py-3">
                                        {t.intake_completed_at
                                            ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-emerald-400/15 text-emerald-300 border-emerald-400/20">Complete</span>
                                            : t.intake_started_at
                                                ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-blue-400/15 text-blue-300 border-blue-400/20">Started</span>
                                                : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-slate-500/15 text-slate-400 border-slate-500/20">Not started</span>}
                                    </td>
                                    <td className="px-4 py-3 text-[11px] text-slate-500">{fmtDate(t.updated_at)}</td>
                                    <td className="px-2"><ChevronRight className="w-4 h-4 text-slate-500" /></td>
                                </tr>
                            );
                        })}
                        {list.length === 0 && (
                            <tr><td colSpan="7" className="px-4 py-12 text-center text-slate-500 text-sm">No travellers match.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
function Checklist({ checklist, reload }) {
    const sections = useMemo(() => {
        const m = {};
        checklist.forEach(c => {
            (m[c.section_id] ||= { id: c.section_id, title: c.section_title, groups: {} });
            (m[c.section_id].groups[c.group_name] ||= []).push(c);
        });
        return Object.values(m);
    }, [checklist]);

    const toggle = async (item) => {
        const next = item.status === 'done' ? 'pending' : 'done';
        try {
            const { error } = await supabase
                .from('india_tour_2026_checklist')
                .update({ status: next, completed_at: next === 'done' ? new Date().toISOString() : null })
                .eq('id', item.id);
            if (error) throw error;
            reload();
        } catch (e) { alert(e.message); }
    };

    return (
        <div className="space-y-3">
            {sections.map(s => {
                const all = Object.values(s.groups).flat();
                const done = all.filter(i => i.status === 'done').length;
                return (
                    <div key={s.id} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                        <div className="bg-rr-pink/90 px-5 py-3 flex items-center justify-between">
                            <div className="text-sm font-black tracking-tight text-white">{s.title}</div>
                            <div className="text-[11px] font-bold text-white bg-black/20 px-2.5 py-0.5 rounded-full">{done}/{all.length}</div>
                        </div>
                        <div className="p-4">
                            {Object.entries(s.groups).map(([gname, items]) => (
                                <div key={gname} className="mb-3 last:mb-0">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-rr-pink mb-1.5">{gname}</div>
                                    {items.map(it => (
                                        <div key={it.id} onClick={() => toggle(it)}
                                            className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0 cursor-pointer hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition-colors">
                                            <div className={`w-5 h-5 rounded border-2 border-rr-pink flex items-center justify-center shrink-0 mt-0.5 ${it.status === 'done' ? 'bg-rr-pink' : ''}`}>
                                                {it.status === 'done' && <CheckCircle2 className="w-3 h-3 text-white" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className={`text-sm ${it.status === 'done' ? 'text-slate-500 line-through' : 'text-white'}`}>
                                                    {(it.tags || []).map(tag => (
                                                        <span key={tag} className={`inline-block text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded mr-1.5 align-middle ${tag === 'urgent' ? 'bg-red-500 text-white' : tag === 'minors' ? 'bg-fuchsia-600 text-white' : tag === 'parents' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}`}>{tag}</span>
                                                    ))}
                                                    {it.text}
                                                </div>
                                                {it.due_date && <div className="text-[10px] text-slate-500 mt-0.5">Due {fmtDate(it.due_date)}</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
const DOC_TYPES = [
    { id: 'passport_scan',              label: 'Passport scan' },
    { id: 'passport_photo',             label: 'Passport photo' },
    { id: 'birth_certificate',          label: 'Birth cert' },
    { id: 'parental_consent_notarised', label: 'Notarised consent' },
    { id: 'evisa_approval',             label: 'e-Visa' },
    { id: 'medical_summary',            label: 'Medical' },
    { id: 'flight_eticket',             label: 'Flight ticket' },
    { id: 'insurance_policy',           label: 'Insurance' },
];

function Documents({ travellers, docs }) {
    const get = (tid, dt) => docs.find(d => d.traveller_id === tid && d.doc_type === dt);
    return (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-auto">
            <table className="w-full min-w-[900px]">
                <thead>
                    <tr className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white/[0.02]">
                        <th className="text-left px-4 py-3 sticky left-0 bg-rr-dark z-10">Traveller</th>
                        {DOC_TYPES.map(d => <th key={d.id} className="text-center px-3 py-3 whitespace-nowrap min-w-[110px]">{d.label}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {travellers.map(t => (
                        <tr key={t.id} className="border-t border-white/5">
                            <td className="px-4 py-3 sticky left-0 bg-rr-dark">
                                <div className="font-bold text-white text-sm">{(t.given_names || t.surname) ? `${t.given_names || ''} ${t.surname || ''}`.trim() : '(name pending)'}</div>
                                <div className="text-[11px] text-slate-500">{t.role}</div>
                            </td>
                            {DOC_TYPES.map(dt => {
                                const d = get(t.id, dt.id);
                                const cls = d?.status === 'verified' ? 'bg-emerald-400/15 border-emerald-400/40 text-emerald-300' :
                                    d?.status === 'received' ? 'bg-blue-400/15 border-blue-400/40 text-blue-300' :
                                        d?.status === 'rejected' ? 'bg-red-500/15 border-red-500/40 text-red-300' :
                                            'bg-white/[0.02] border-white/10 text-slate-500';
                                return (
                                    <td key={dt.id} className="px-3 py-3 text-center">
                                        <div className={`inline-flex w-7 h-7 rounded-lg items-center justify-center border ${cls}`}>
                                            {d ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3 h-3" />}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
function TravellerDrawer({ traveller, docs, onClose, reload }) {
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState(traveller);
    const [saving, setSaving] = useState(false);
    if (!traveller) return null;
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const save = async () => {
        setSaving(true);
        try {
            const { id, created_at, updated_at, intake_token, ...patch } = form;
            const { error } = await supabase.from('india_tour_2026_travellers').update(patch).eq('id', traveller.id);
            if (error) throw error;
            reload(); setEdit(false);
        } catch (e) { alert(e.message); }
        setSaving(false);
    };

    const link = `${window.location.origin}/india-tour-intake?token=${traveller.intake_token}`;
    const copy = () => { navigator.clipboard.writeText(link); alert('Link copied'); };

    const Field = ({ label, value, onChange, type = 'text' }) => (
        <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</label>
            {edit && onChange ? (
                <input type={type} value={value || ''} onChange={e => onChange(e.target.value)}
                    className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-rr-pink/50" />
            ) : (
                <div className="mt-1 text-sm text-white">{value || '—'}</div>
            )}
        </div>
    );

    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-rr-dark border-l border-white/10 z-50 overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-rr-pink">Traveller</p>
                            <h3 className="text-xl font-black text-white tracking-tight mt-1">
                                {(traveller.given_names || traveller.surname) ? `${traveller.given_names || ''} ${traveller.surname || ''}`.trim() : '(name pending)'}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">{traveller.role} · <Pill status={traveller.status} /></p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg"><X className="w-5 h-5 text-slate-400" /></button>
                    </div>

                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 mb-5">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-rr-pink mb-1.5">Parent intake link</div>
                        <div className="flex gap-2 items-center">
                            <code className="flex-1 px-2.5 py-1.5 bg-black/40 rounded-md text-[11px] text-slate-300 truncate">{link}</code>
                            <button onClick={copy} className="px-3 py-1.5 rounded-md bg-rr-pink text-white text-xs font-bold flex items-center gap-1.5 hover:bg-rr-pink/90"><Copy className="w-3 h-3" /> Copy</button>
                        </div>
                    </div>

                    <Section title="Personal">
                        <Grid>
                            <Field label="Given names" value={form.given_names} onChange={v => set('given_names', v)} />
                            <Field label="Surname" value={form.surname} onChange={v => set('surname', v)} />
                            <Field label="Date of birth" value={form.dob} onChange={v => set('dob', v)} type="date" />
                            <Field label="Gender" value={form.gender} onChange={v => set('gender', v)} />
                            <Field label="Email" value={form.email} onChange={v => set('email', v)} />
                            <Field label="Mobile" value={form.mobile} onChange={v => set('mobile', v)} />
                        </Grid>
                    </Section>

                    <Section title="Passport">
                        <Grid>
                            <Field label="Number" value={form.passport_no} onChange={v => set('passport_no', v)} />
                            <Field label="Issue date" value={form.passport_issue} onChange={v => set('passport_issue', v)} type="date" />
                            <Field label="Expiry" value={form.passport_expiry} onChange={v => set('passport_expiry', v)} type="date" />
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Valid past 7 Jan 2027</label>
                                <div className="mt-1">
                                    {form.passport_expiry
                                        ? (new Date(form.passport_expiry) > new Date('2027-01-07')
                                            ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-emerald-400/15 text-emerald-300 border-emerald-400/20">Yes</span>
                                            : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-red-500/15 text-red-300 border-red-500/20">Renew needed</span>)
                                        : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-slate-500/15 text-slate-400 border-slate-500/20">Unknown</span>}
                                </div>
                            </div>
                        </Grid>
                    </Section>

                    <Section title="Medical & dietary">
                        <Field label="Conditions" value={form.medical} onChange={v => set('medical', v)} />
                        <div className="h-2.5" />
                        <Field label="Medications" value={form.medications} onChange={v => set('medications', v)} />
                        <div className="h-2.5" />
                        <Field label="Allergies" value={form.allergies} onChange={v => set('allergies', v)} />
                        <div className="h-2.5" />
                        <Grid>
                            <Field label="Blood group" value={form.blood_group} onChange={v => set('blood_group', v)} />
                            <Field label="Diet" value={form.diet} onChange={v => set('diet', v)} />
                        </Grid>
                    </Section>

                    <Section title="Emergency contacts">
                        <div className="text-sm text-white">{form.ec1_name || '—'} <span className="text-slate-500">({form.ec1_relationship || '—'})</span> · {form.ec1_mobile || '—'}</div>
                        <div className="text-sm text-white mt-2">{form.ec2_name || '—'} <span className="text-slate-500">({form.ec2_relationship || '—'})</span> · {form.ec2_mobile || '—'}</div>
                    </Section>

                    <Section title={`Documents (${docs.length})`}>
                        {docs.length === 0 ? <div className="text-xs text-slate-500">No documents uploaded yet.</div> :
                            docs.map(d => (
                                <div key={d.id} className="flex items-center justify-between py-1.5">
                                    <span className="text-sm text-white">{d.doc_type}</span>
                                    <Pill status={d.status} />
                                </div>
                            ))}
                    </Section>

                    <div className="flex gap-2 mt-5">
                        {!edit ? (
                            <button onClick={() => setEdit(true)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rr-pink hover:bg-rr-pink/90 text-white text-sm font-bold"><Edit3 className="w-4 h-4" /> Edit</button>
                        ) : (
                            <>
                                <button onClick={save} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rr-pink hover:bg-rr-pink/90 text-white text-sm font-bold disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
                                <button onClick={() => { setForm(traveller); setEdit(false); }} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-bold">Cancel</button>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>
        </>
    );
}

const Section = ({ title, children }) => (
    <div className="mb-5">
        <div className="text-[10px] font-bold uppercase tracking-widest text-rr-pink mb-2 pb-1.5 border-b border-white/10">{title}</div>
        <div>{children}</div>
    </div>
);
const Grid = ({ children }) => <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>;

// ─────────────────────────────────────────────────────────────────
function AssignModal({ cohort, existing, onClose, onDone }) {
    const [selected, setSelected] = useState({});
    const [saving, setSaving] = useState(false);
    const assignedIds = new Set(existing.map(e => e.cohort_player_id).filter(Boolean));

    const assign = async () => {
        const ids = Object.keys(selected).filter(k => selected[k]);
        if (!ids.length) return alert('Select at least one player.');
        setSaving(true);
        try {
            const rows = ids.map(cid => {
                const c = cohort.find(x => x.id === cid);
                const parts = (c?.player_name || '').trim().split(/\s+/);
                return {
                    cohort_player_id: cid,
                    traveller_type: 'player',
                    role: 'Player',
                    status: 'invited',
                    given_names: parts[0] || '',
                    surname: parts.slice(1).join(' ') || '',
                    email: c?.parent1_email || '',
                    mobile: c?.parent1_phone || '',
                    gender: c?.gender === 'F' ? 'Female' : c?.gender === 'M' ? 'Male' : null,
                };
            });
            const { error } = await supabase.from('india_tour_2026_travellers').insert(rows);
            if (error) throw error;
            onDone();
        } catch (e) { alert(e.message); }
        setSaving(false);
    };

    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className="bg-rr-dark border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col pointer-events-auto">
                    <div className="p-5 border-b border-white/10 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-rr-pink">Assign players</p>
                            <h3 className="text-lg font-black tracking-tight mt-0.5">Select from the 2026 cohort</h3>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg"><X className="w-5 h-5 text-slate-400" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        {cohort.length === 0 ? <div className="text-slate-500 text-sm text-center py-10">Loading cohort…</div> :
                            cohort.map(p => {
                                const already = assignedIds.has(p.id);
                                return (
                                    <label key={p.id}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 ${selected[p.id] ? 'bg-rr-pink/10' : ''} ${already ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-white/5'}`}>
                                        <input type="checkbox" disabled={already} checked={!!selected[p.id]}
                                            onChange={() => setSelected(s => ({ ...s, [p.id]: !s[p.id] }))}
                                            className="w-4 h-4 accent-rr-pink" />
                                        <div className="flex-1">
                                            <div className="text-sm font-bold text-white">{p.player_name}</div>
                                            <div className="text-[11px] text-slate-500">{p.gender || '—'} · age {p.age || '—'} · {p.parent1_email || 'no email'}</div>
                                        </div>
                                        {already && <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Added</span>}
                                    </label>
                                );
                            })
                        }
                    </div>
                    <div className="p-4 border-t border-white/10 flex justify-end gap-2">
                        <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-bold">Cancel</button>
                        <button onClick={assign} disabled={saving} className="px-4 py-2 rounded-lg bg-rr-pink hover:bg-rr-pink/90 text-white text-sm font-bold disabled:opacity-50">
                            {saving ? 'Adding…' : `Add ${Object.values(selected).filter(Boolean).length} player(s)`}
                        </button>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
