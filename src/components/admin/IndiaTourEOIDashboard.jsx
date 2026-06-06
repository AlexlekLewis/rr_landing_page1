import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Download, Copy, Check, Plus, Link as LinkIcon, Power, RefreshCw, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const fmtDate = (d) => d
    ? new Date(d).toLocaleDateString('en-AU', { timeZone: 'Australia/Melbourne', day: '2-digit', month: 'short', year: 'numeric' })
    : '-';

const slugify = (s) => (s || '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24);

const randSuffix = () => Math.random().toString(36).slice(2, 6);

const IndiaTourEOIDashboard = () => {
    const [tab, setTab] = useState('registrations');
    const [eois, setEois] = useState([]);
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [copied, setCopied] = useState(null);

    // Referral generator
    const [inputText, setInputText] = useState('');
    const [generating, setGenerating] = useState(false);
    const [genResults, setGenResults] = useState([]);
    const [genError, setGenError] = useState('');

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const linkFor = (code) => `${origin}/india-tour-2026?ref=${encodeURIComponent(code)}`;

    const fetchAll = useCallback(async () => {
        const [eoiRes, refRes] = await Promise.all([
            supabase.from('india_tour_2026_eoi').select('*').order('created_at', { ascending: false }),
            supabase.from('india_tour_2026_referrals').select('*').order('created_at', { ascending: false }),
        ]);
        if (eoiRes.error) console.error('EOI fetch error:', eoiRes.error);
        if (refRes.error) console.error('Referrals fetch error:', refRes.error);
        setEois(eoiRes.data || []);
        setReferrals(refRes.data || []);
        setLoading(false);
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const copy = (text, key) => {
        navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 1800);
    };

    // Count EOIs per referral code (case-insensitive).
    const countByCode = useMemo(() => {
        const m = {};
        eois.forEach(e => {
            const c = (e.referral_code || '').toLowerCase();
            if (c) m[c] = (m[c] || 0) + 1;
        });
        return m;
    }, [eois]);

    const filteredEois = useMemo(() => {
        if (!search) return eois;
        const q = search.toLowerCase();
        return eois.filter(r =>
            r.player_name?.toLowerCase().includes(q) ||
            r.current_club?.toLowerCase().includes(q) ||
            r.highest_level?.toLowerCase().includes(q) ||
            r.player_email?.toLowerCase().includes(q) ||
            r.guardian1_email?.toLowerCase().includes(q) ||
            r.guardian1_name?.toLowerCase().includes(q) ||
            r.referral_name?.toLowerCase().includes(q) ||
            r.referral_code?.toLowerCase().includes(q)
        );
    }, [eois, search]);

    const exportCSV = () => {
        const headers = ['Submitted', 'Player', 'DOB', 'Age', 'Club', 'Highest Level', 'Primary Skill', 'Secondary Skill', 'Over 18',
            'Player Email', 'Player Phone', 'Guardian 1', 'G1 Relationship', 'G1 Email', 'G1 Phone',
            'Guardian 2', 'G2 Email', 'G2 Phone', 'Referred By', 'Referral Code'];
        const data = filteredEois.map(r => [
            fmtDate(r.created_at), r.player_name, r.player_dob, r.player_age, r.current_club, r.highest_level,
            r.primary_skill, r.secondary_skill,
            r.is_over_18 ? 'Yes' : 'No', r.player_email, r.player_phone,
            r.guardian1_name, r.guardian1_relationship, r.guardian1_email, r.guardian1_phone,
            r.guardian2_name, r.guardian2_email, r.guardian2_phone, r.referral_name, r.referral_code,
        ]);
        const csv = [headers, ...data]
            .map(row => row.map(c => `"${(c ?? '').toString().replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `india_tour_2026_eoi_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const generateLinks = async () => {
        setGenError('');
        const lines = inputText.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) { setGenError('Enter one member per line (Name, or Name, Email).'); return; }
        setGenerating(true);
        const results = [];
        for (const line of lines) {
            const sep = line.includes('\t') ? '\t' : ',';
            const [namePart, emailPart] = line.split(sep);
            const member_name = (namePart || '').replace(/^"|"$/g, '').trim();
            const member_email = (emailPart || '').replace(/^"|"$/g, '').trim() || null;
            if (!member_name) continue;
            let code = `${slugify(member_name) || 'member'}-${randSuffix()}`;
            // Try insert; on unique-collision, retry with a fresh suffix.
            let inserted = null, lastErr = null;
            for (let attempt = 0; attempt < 3 && !inserted; attempt++) {
                const { data, error } = await supabase
                    .from('india_tour_2026_referrals')
                    .insert([{ code, member_name, member_email }])
                    .select('code, member_name')
                    .single();
                if (error) { lastErr = error; code = `${slugify(member_name) || 'member'}-${randSuffix()}`; }
                else inserted = data;
            }
            results.push(inserted
                ? { member_name, status: 'ok', code: inserted.code, url: linkFor(inserted.code) }
                : { member_name, status: 'error', message: lastErr?.message || 'Failed' });
        }
        setGenResults(results);
        setInputText('');
        setGenerating(false);
        fetchAll();
    };

    const toggleActive = async (r) => {
        await supabase.from('india_tour_2026_referrals').update({ active: !r.active }).eq('id', r.id);
        fetchAll();
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
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider">INDIA TOUR 2026 — EOIs</h1>
                    <p className="text-slate-400 text-sm mt-1">{eois.length} expressions of interest · {referrals.length} referral links</p>
                </div>
                <button onClick={fetchAll} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white text-sm transition-all">
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2">
                {[
                    { key: 'registrations', label: `Registrations (${eois.length})` },
                    { key: 'referrals', label: `Referral Links (${referrals.length})` },
                ].map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${tab === t.key ? 'bg-rr-pink/20 border-rr-pink/40 text-rr-pink' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === 'registrations' && (
                <>
                    <div className="flex flex-wrap gap-3 items-center">
                        <div className="relative flex-1 min-w-[200px] max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search player, club, email, referrer…"
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-rr-pink/50"
                            />
                        </div>
                        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm">
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        {['Player', 'Age', 'Club', 'Highest Level', 'Skills', 'Best Contact', 'Guardian', 'Referred By', 'Submitted'].map(h => (
                                            <th key={h} className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredEois.map(r => (
                                        <tr key={r.id} className="hover:bg-white/5 transition-colors align-top">
                                            <td className="p-4 text-white font-medium whitespace-nowrap">{r.player_name}</td>
                                            <td className="p-4 text-slate-400">{r.player_age ?? '-'}</td>
                                            <td className="p-4 text-slate-400 whitespace-nowrap">{r.current_club || '-'}</td>
                                            <td className="p-4 text-slate-400 max-w-[200px]">{r.highest_level || '-'}</td>
                                            <td className="p-4 text-slate-400 whitespace-nowrap">
                                                <div>{r.primary_skill || '-'}</div>
                                                {r.secondary_skill && <div className="text-slate-500 text-xs">{r.secondary_skill}</div>}
                                            </td>
                                            <td className="p-4 text-slate-400 whitespace-nowrap">
                                                <div>{r.player_email || r.guardian1_email || '-'}</div>
                                                <div className="text-slate-500 text-xs">{r.player_phone || r.guardian1_phone || ''}</div>
                                            </td>
                                            <td className="p-4 text-slate-400 whitespace-nowrap">
                                                {r.guardian1_name ? (
                                                    <div>{r.guardian1_name}<span className="text-slate-600 text-xs"> {r.guardian1_relationship ? `(${r.guardian1_relationship})` : ''}</span></div>
                                                ) : <span className="text-slate-600">—</span>}
                                            </td>
                                            <td className="p-4 text-slate-400 whitespace-nowrap">{r.referral_name || r.referral_code || '-'}</td>
                                            <td className="p-4 text-slate-400 whitespace-nowrap">{fmtDate(r.created_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredEois.length === 0 && (
                            <div className="text-center py-12"><p className="text-slate-500 text-sm">No registrations yet</p></div>
                        )}
                    </div>
                </>
            )}

            {tab === 'referrals' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Generator */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-white mb-1">Generate Member Links</h2>
                        <p className="text-xs text-slate-500 mb-4">One member per line. Format: <span className="font-mono">Name</span> or <span className="font-mono">Name, Email</span>. Each gets a unique referral link to the private page.</p>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder={"Jane Smith, jane@email.com\nRaj Patel\nThe Northcote CC group"}
                            className="w-full h-40 bg-black/40 border border-white/15 rounded-xl p-4 text-white text-sm font-mono focus:outline-none focus:border-rr-pink/60 placeholder:text-slate-600"
                        />
                        {genError && <p className="text-red-400 text-sm font-medium mt-2">{genError}</p>}
                        <button
                            onClick={generateLinks}
                            disabled={generating || !inputText.trim()}
                            className="w-full mt-3 bg-gradient-to-r from-rr-blue to-rr-pink text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-rr-pink/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {generating ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating…</> : <><Plus className="w-4 h-4" /> Generate Links</>}
                        </button>

                        {genResults.length > 0 && (
                            <div className="mt-5 space-y-2 max-h-64 overflow-y-auto pr-1">
                                {genResults.map((g, i) => (
                                    <div key={i} className="bg-black/40 border border-white/10 rounded-xl p-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-white text-sm font-bold">{g.member_name}</p>
                                            {g.status === 'ok'
                                                ? <span className="text-[10px] uppercase font-bold tracking-wider text-green-400 bg-green-500/15 px-2 py-0.5 rounded">Created</span>
                                                : <span className="text-[10px] uppercase font-bold tracking-wider text-red-400 bg-red-500/15 px-2 py-0.5 rounded">Failed</span>}
                                        </div>
                                        {g.status === 'ok' ? (
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="bg-black/60 rounded px-2 py-1.5 text-xs font-mono text-slate-300 truncate flex-1 border border-white/5">{g.url}</div>
                                                <button onClick={() => copy(g.url, `gen-${i}`)} className="p-2 rounded bg-white/10 hover:bg-rr-pink hover:text-white text-slate-400 transition-colors shrink-0">
                                                    {copied === `gen-${i}` ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        ) : <p className="text-xs text-red-400 mt-1">{g.message}</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Existing links */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-white mb-4">All Referral Links</h2>
                        {referrals.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-slate-500 py-12">
                                <LinkIcon className="w-10 h-10 opacity-20 mb-3" />
                                <p className="text-sm">No referral links yet</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                                {referrals.map(r => {
                                    const n = countByCode[(r.code || '').toLowerCase()] || 0;
                                    return (
                                        <div key={r.id} className={`rounded-xl p-3 border ${r.active ? 'bg-black/30 border-white/10' : 'bg-black/20 border-white/5 opacity-60'}`}>
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="text-white text-sm font-bold truncate">{r.member_name || r.code}</p>
                                                    <p className="text-slate-500 text-xs font-mono truncate">{r.code}</p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="inline-flex items-center gap-1 text-xs text-slate-400" title="EOIs from this link">
                                                        <Users className="w-3.5 h-3.5" /> {n}
                                                    </span>
                                                    <button onClick={() => copy(linkFor(r.code), `ref-${r.id}`)} className="p-2 rounded bg-white/10 hover:bg-rr-pink hover:text-white text-slate-400 transition-colors" title="Copy link">
                                                        {copied === `ref-${r.id}` ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                                    </button>
                                                    <button onClick={() => toggleActive(r)} className={`p-2 rounded transition-colors ${r.active ? 'bg-white/10 text-emerald-400 hover:bg-white/20' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`} title={r.active ? 'Active — click to disable' : 'Disabled — click to enable'}>
                                                        <Power className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default IndiaTourEOIDashboard;
