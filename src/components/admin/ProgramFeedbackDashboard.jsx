import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { RefreshCw, Download, Mail, Star, TrendingUp, Users, HeartCrack, MessageSquareText } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Admin view for the Elite Program feedback + win-back survey (public /elite-feedback).
// Reads public.program_feedback via the authenticated Supabase session (RLS 'authenticated').
// Leads with the two things Alex actually needs: the recommend/NPS + satisfaction picture,
// and a contactable WIN-BACK LIST — who isn't continuing into Power Game, and exactly why.

const fmtDate = (d) => d
  ? new Date(d).toLocaleDateString('en-AU', { timeZone: 'Australia/Melbourne', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '-';

const CONTINUE_LABELS = {
  signed_up: 'Signed up',
  intend: 'Planning to',
  unsure: 'Not sure yet',
  no: 'Not this time',
};
const FORMAT_LABELS = { too_much: 'Too much', just_right: 'Just right', not_enough: 'Not enough' };
const SCOUTING_LABELS = { yes: 'Yes — most sessions', sometimes: 'A few times', no: "No / didn't know" };
const OWNTIME_LABELS = { yes: 'Yes — definitely', maybe: 'Maybe', no: 'Probably not' };

const RATING_FIELDS = [
  ['rating_overall', 'Overall'],
  ['improvement', 'Improvement'],
  ['enjoyment', 'Enjoyment'],
  ['explore_rating', 'Explore'],
  ['challenge_rating', 'Challenge'],
  ['execute_rating', 'Execute'],
  ['matchcentre_rating', 'Match Centre'],
  ['times_rating', 'Days & times'],
  ['location_rating', 'Location'],
  ['value_rating', 'Value for money'],
  ['coaching_rating', 'Coaching'],
  ['specialist_jarryd', 'Jarryd Rogers'],
  ['specialist_bowlstrong', 'BowlStrong'],
  ['specialist_callum', 'Callum Stow'],
  ['specialist_bajwa', 'Harkirat Bajwa'],
  ['specialist_zach', 'Zac Parr'],
  ['neuro_fitness_rating', 'NeuroVision & fitness'],
  ['guests_rating', 'Guest speakers'],
  ['communication_rating', 'Communication'],
  ['pathway_clarity', 'Pathway clarity'],
];

const avg = (rows, key) => {
  const vals = rows.map((r) => r[key]).filter((v) => typeof v === 'number');
  if (!vals.length) return null;
  return Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 10) / 10;
};

const StatCard = ({ label, value, sub, icon: Icon, color }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${color}22` }}>
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
    <p className="text-3xl font-black text-white leading-none">{value}</p>
    <p className="text-slate-400 text-sm font-medium mt-1.5">{label}</p>
    {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
  </div>
);

const RatingBar = ({ label, value, n }) => (
  <div className="flex items-center gap-3">
    <span className="text-slate-300 text-sm w-36 shrink-0 truncate">{label}</span>
    <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${value ? (value / 5) * 100 : 0}%`, backgroundColor: '#E11F8F' }} />
    </div>
    <span className="text-white text-sm font-bold w-10 text-right">{value ?? '—'}</span>
    <span className="text-slate-600 text-xs w-8 text-right">{n ? `n${n}` : ''}</span>
  </div>
);

const csvEscape = (v) => {
  if (v == null) return '';
  const s = Array.isArray(v) ? v.join(' | ') : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const ProgramFeedbackDashboard = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('program_feedback')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Feedback fetch error:', error);
    setRows(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const stats = useMemo(() => {
    const total = rows.length;
    const npsVals = rows.map((r) => r.nps).filter((v) => typeof v === 'number');
    const promoters = npsVals.filter((v) => v >= 9).length;
    const detractors = npsVals.filter((v) => v <= 6).length;
    const nps = npsVals.length ? Math.round(((promoters - detractors) / npsVals.length) * 100) : null;

    const continueCounts = { signed_up: 0, intend: 0, unsure: 0, no: 0 };
    rows.forEach((r) => { if (continueCounts[r.continue_next] != null) continueCounts[r.continue_next]++; });
    const answeredContinue = continueCounts.signed_up + continueCounts.intend + continueCounts.unsure + continueCounts.no;
    const continuing = continueCounts.signed_up + continueCounts.intend;
    const retentionPct = answeredContinue ? Math.round((continuing / answeredContinue) * 100) : null;

    // Aggregate churn barriers — the win-back intel.
    const barrierTally = {};
    rows.forEach((r) => (r.barriers || []).forEach((b) => { barrierTally[b] = (barrierTally[b] || 0) + 1; }));
    const barriers = Object.entries(barrierTally).sort((a, b) => b[1] - a[1]);

    const stayTally = {};
    rows.forEach((r) => (r.stay_reasons || []).forEach((s) => { stayTally[s] = (stayTally[s] || 0) + 1; }));
    const stayReasons = Object.entries(stayTally).sort((a, b) => b[1] - a[1]);

    return { total, nps, npsN: npsVals.length, continueCounts, retentionPct, answeredContinue, barriers, stayReasons };
  }, [rows]);

  // Contactable win-back list: everyone who's unsure / not continuing.
  const winBack = useMemo(
    () => rows.filter((r) => r.continue_next === 'unsure' || r.continue_next === 'no'),
    [rows],
  );

  const exportCsv = () => {
    const cols = [
      'created_at', 'program', 'respondent_name', 'respondent_role', 'respondent_email', 'player_name', 'centre',
      'rating_overall', 'improvement', 'enjoyment',
      'explore_rating', 'explore_comment', 'challenge_rating', 'challenge_comment', 'execute_rating', 'execute_comment',
      'matchcentre_rating', 'matchcentre_comment', 'scouting_reports_use', 'matchcentre_own_time',
      'format_fit', 'times_rating', 'times_better', 'location_rating', 'value_rating',
      'coaching_rating', 'specialist_jarryd', 'specialist_bowlstrong', 'specialist_callum', 'specialist_bajwa', 'specialist_zach',
      'neuro_fitness_rating', 'guests_rating', 'communication_rating', 'pathway_clarity',
      'nps', 'continue_next', 'stay_reasons', 'stay_reason_other', 'barriers', 'barrier_other', 'change_mind',
      'love_most', 'would_change', 'anything_else', 'consent_contact', 'id',
    ];
    const lines = [cols.join(',')];
    rows.forEach((r) => lines.push(cols.map((c) => csvEscape(r[c])).join(',')));
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elite-feedback-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Elite Program Feedback</h1>
          <p className="text-slate-400 mt-1 text-sm">How the 2026 cohort rated the program — and who to win back for Power Game.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCsv} disabled={!rows.length} className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 bg-white/5 border border-white/10 hover:border-white/25 rounded-xl px-4 py-2 disabled:opacity-40">
            <Download width={16} height={16} /> Export CSV
          </button>
          <button onClick={fetchAll} className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 bg-white/5 border border-white/10 hover:border-white/25 rounded-xl px-4 py-2">
            <RefreshCw width={16} height={16} /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
          <MessageSquareText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-white font-bold">No responses yet</p>
          <p className="text-slate-500 text-sm mt-1">Share <span className="text-rr-pink">rramelbourne.com/elite-feedback</span> with the Elite cohort.</p>
        </div>
      ) : (
        <>
          {/* Top-line stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Responses" value={stats.total} icon={Users} color="#1226AA" />
            <StatCard label="Recommend (NPS)" value={stats.nps ?? '—'} sub={`${stats.npsN} scored 0–10`} icon={TrendingUp} color="#E11F8F" />
            <StatCard label="Avg overall" value={avg(rows, 'rating_overall') ?? '—'} sub="out of 5" icon={Star} color="#E96BB0" />
            <StatCard label="Continuing to Power Game" value={stats.retentionPct != null ? `${stats.retentionPct}%` : '—'} sub={`${stats.continueCounts.signed_up + stats.continueCounts.intend} of ${stats.answeredContinue}`} icon={HeartCrack} color="#F59E0B" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Continuation split */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-black text-lg mb-4">Joining Power Game?</h2>
              <div className="space-y-3">
                {Object.entries(CONTINUE_LABELS).map(([key, label]) => {
                  const n = stats.continueCounts[key] || 0;
                  const pct = stats.answeredContinue ? Math.round((n / stats.answeredContinue) * 100) : 0;
                  const good = key === 'signed_up' || key === 'intend';
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-slate-300 text-sm w-28 shrink-0">{label}</span>
                      <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: good ? '#22C55E' : '#F59E0B' }} />
                      </div>
                      <span className="text-white text-sm font-bold w-14 text-right">{n} · {pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Why they're NOT continuing — the win-back intel */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-black text-lg mb-4">Top reasons for not continuing</h2>
              {stats.barriers.length === 0 ? (
                <p className="text-slate-500 text-sm">No barriers logged yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {stats.barriers.slice(0, 8).map(([label, n]) => {
                    const max = stats.barriers[0][1];
                    return (
                      <div key={label} className="flex items-center gap-3">
                        <span className="text-slate-300 text-xs flex-1 leading-tight">{label}</span>
                        <div className="w-24 h-2.5 rounded-full bg-white/10 overflow-hidden shrink-0">
                          <div className="h-full rounded-full" style={{ width: `${(n / max) * 100}%`, backgroundColor: '#E11F8F' }} />
                        </div>
                        <span className="text-white text-sm font-bold w-6 text-right">{n}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Average ratings across every dimension */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <h2 className="text-white font-black text-lg mb-4">Average ratings (out of 5)</h2>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
              {RATING_FIELDS.map(([key, label]) => {
                const v = avg(rows, key);
                const n = rows.filter((r) => typeof r[key] === 'number').length;
                return <RatingBar key={key} label={label} value={v} n={n} />;
              })}
            </div>
            {(() => {
              const c = { yes: 0, maybe: 0, no: 0 };
              rows.forEach((r) => { if (c[r.matchcentre_own_time] != null) c[r.matchcentre_own_time]++; });
              const total = c.yes + c.maybe + c.no;
              return total > 0 ? (
                <p className="mt-5 pt-4 border-t border-white/10 text-sm text-slate-400">
                  Would use the Match Centre app in their own time:&nbsp;
                  <span className="text-green-400 font-bold">{c.yes} yes</span> · <span className="text-amber-400 font-bold">{c.maybe} maybe</span> · <span className="text-slate-300 font-bold">{c.no} no</span>
                </p>
              ) : null;
            })()}
          </div>

          {/* WIN-BACK LIST — contactable, with reasons */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-1">
              <HeartCrack className="w-5 h-5 text-amber-400" />
              <h2 className="text-white font-black text-lg">Win-back list ({winBack.length})</h2>
            </div>
            <p className="text-slate-500 text-sm mb-5">Families who are unsure or not continuing — with their reason and contact, so you can target the right incentive.</p>
            {winBack.length === 0 ? (
              <p className="text-slate-500 text-sm">Nobody's opted out — everyone who answered is continuing. 🎉</p>
            ) : (
              <div className="space-y-3">
                {winBack.map((r) => (
                  <div key={r.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <p className="text-white font-bold">
                          {r.player_name}
                          <span className="text-slate-500 font-medium text-sm"> · {r.respondent_name} ({r.respondent_role || '—'})</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-400">
                          <a href={`mailto:${r.respondent_email}?subject=Your%20Royals%20Elite%20feedback`} className="inline-flex items-center gap-1 text-rr-light-pink hover:underline">
                            <Mail width={12} height={12} /> {r.respondent_email}
                          </a>
                          {r.centre && <span>{r.centre}</span>}
                          <span className={`font-bold ${r.continue_next === 'no' ? 'text-red-400' : 'text-amber-400'}`}>{CONTINUE_LABELS[r.continue_next]}</span>
                          {typeof r.nps === 'number' && <span>NPS {r.nps}</span>}
                          {typeof r.rating_overall === 'number' && <span>Overall {r.rating_overall}/5</span>}
                        </div>
                      </div>
                      <span className="text-slate-600 text-xs">{fmtDate(r.created_at)}</span>
                    </div>
                    {(r.barriers?.length || r.barrier_other) && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {(r.barriers || []).map((b) => (
                          <span key={b} className="text-[11px] font-semibold text-rr-light-pink bg-rr-pink/10 border border-rr-pink/20 rounded-full px-2.5 py-0.5">{b}</span>
                        ))}
                        {r.barrier_other && <span className="text-[11px] font-semibold text-slate-300 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5">{r.barrier_other}</span>}
                      </div>
                    )}
                    {r.change_mind && <p className="mt-3 text-sm text-slate-300"><span className="text-slate-500">Would change their mind: </span>{r.change_mind}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All responses */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-black text-lg mb-5">All responses ({rows.length})</h2>
            <div className="space-y-3">
              {rows.map((r) => (
                <details key={r.id} className="rounded-xl border border-white/10 bg-black/20 group">
                  <summary className="cursor-pointer list-none p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-white font-bold truncate">
                        {r.player_name}
                        <span className="text-slate-500 font-medium text-sm"> · {r.respondent_name}</span>
                      </p>
                      <p className="text-xs text-slate-500 truncate">{r.centre || '—'} · {fmtDate(r.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-xs">
                      {typeof r.rating_overall === 'number' && <span className="text-white font-bold">{r.rating_overall}/5</span>}
                      {typeof r.nps === 'number' && <span className="text-slate-400">NPS {r.nps}</span>}
                      <span className={`font-bold ${r.continue_next === 'signed_up' || r.continue_next === 'intend' ? 'text-green-400' : r.continue_next === 'no' ? 'text-red-400' : 'text-amber-400'}`}>
                        {CONTINUE_LABELS[r.continue_next] || '—'}
                      </span>
                    </div>
                  </summary>
                  <div className="px-4 pb-4 pt-1 border-t border-white/5 grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                    <a href={`mailto:${r.respondent_email}`} className="text-rr-light-pink hover:underline sm:col-span-2">{r.respondent_email}</a>
                    {RATING_FIELDS.map(([key, label]) => typeof r[key] === 'number' && (
                      <div key={key} className="flex justify-between border-b border-white/5 py-0.5">
                        <span className="text-slate-400">{label}</span><span className="text-white font-semibold">{r[key]}/5</span>
                      </div>
                    ))}
                    {r.format_fit && <div className="flex justify-between border-b border-white/5 py-0.5"><span className="text-slate-400">Format</span><span className="text-white font-semibold">{FORMAT_LABELS[r.format_fit]}</span></div>}
                    {r.scouting_reports_use && <div className="flex justify-between border-b border-white/5 py-0.5"><span className="text-slate-400">Scouting reports</span><span className="text-white font-semibold">{SCOUTING_LABELS[r.scouting_reports_use]}</span></div>}
                    {r.matchcentre_own_time && <div className="flex justify-between border-b border-white/5 py-0.5"><span className="text-slate-400">App in own time</span><span className="text-white font-semibold">{OWNTIME_LABELS[r.matchcentre_own_time]}</span></div>}
                    {[['explore_comment', 'Explore'], ['challenge_comment', 'Challenge'], ['execute_comment', 'Execute'], ['matchcentre_comment', 'Match Centre'], ['times_better', 'Better times'], ['love_most', 'Loved most'], ['would_change', 'Would change'], ['anything_else', 'Anything else'], ['change_mind', 'Change mind']].map(([key, label]) =>
                      r[key] ? <p key={key} className="sm:col-span-2 text-slate-300 mt-1"><span className="text-slate-500">{label}: </span>{r[key]}</p> : null
                    )}
                    {r.stay_reasons?.length ? <p className="sm:col-span-2 text-slate-300"><span className="text-slate-500">Staying because: </span>{r.stay_reasons.join(', ')}</p> : null}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProgramFeedbackDashboard;
