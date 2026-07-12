import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { RefreshCw, Search, Mail, ChevronDown, ChevronRight, Users, BarChart3, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

// Admin response reader for the Elite Program feedback survey (/elite-feedback).
// Purpose: read EVERY answer, per family — searchable + filterable — for Alex + the
// coaching team to go through together. The sibling /rramadmin_26/feedback page is the
// analytics view (NPS, averages, win-back list); this one is the full-text reader.
// Reads public.program_feedback via the authenticated Supabase session (RLS 'authenticated').

const fmtDate = (d) => d
  ? new Date(d).toLocaleString('en-AU', { timeZone: 'Australia/Melbourne', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  : '-';

const CONTINUE = {
  signed_up: { label: 'Signed up', cls: 'bg-green-500/15 text-green-400 border-green-500/30' },
  intend: { label: 'Planning to', cls: 'bg-green-500/15 text-green-400 border-green-500/30' },
  unsure: { label: 'Not sure yet', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  no: { label: 'Not this time', cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
};
const FORMAT_LABELS = { too_much: 'Too much', just_right: 'Just right', not_enough: 'Not enough' };
const SCOUTING_LABELS = { yes: 'Yes — most sessions', sometimes: 'A few times', no: "No / didn't know" };
const OWNTIME_LABELS = { yes: 'Yes — definitely', maybe: 'Maybe', no: 'Probably not' };

// Numeric rating fields grouped for display. Only answered ones are shown per response.
const GROUPS = [
  { title: 'Overall & improvement', ratings: [
    ['rating_overall', 'Overall'], ['enjoyment', 'Enjoyment'],
    ['imp_shot_range', 'Shot range'], ['imp_batting_smart', 'Smart batting'], ['imp_bowling_smart', 'Smart bowling'],
    ['imp_power', 'Power'], ['imp_game_understanding', 'Game sense'],
  ] },
  { title: 'The three phases', ratings: [['explore_rating', 'Explore'], ['challenge_rating', 'Challenge'], ['execute_rating', 'Execute']],
    texts: [['explore_comment', 'Explore note'], ['challenge_comment', 'Challenge note'], ['execute_comment', 'Execute note']] },
  { title: 'Match Centre', ratings: [['matchcentre_rating', 'Value'], ['matchcentre_unique', 'Uniqueness']],
    texts: [['matchcentre_comment', 'Note'], ['scouting_reports_use', 'Scouting reports', SCOUTING_LABELS], ['matchcentre_own_time', 'Would use app in own time', OWNTIME_LABELS]] },
  { title: 'Format & value', ratings: [['times_rating', 'Days & times'], ['location_rating', 'Location'], ['value_rating', 'Value for money']],
    texts: [['format_fit', 'Session amount', FORMAT_LABELS], ['times_better', 'Better times']] },
  { title: 'Coaching & specialists', ratings: [
    ['coaching_rating', 'Coaching'], ['specialist_jarryd', 'Jarryd Rogers'], ['specialist_bowlstrong', 'BowlStrong'],
    ['specialist_callum', 'Callum Stow'], ['specialist_bajwa', 'Harkirat Bajwa'], ['specialist_zach', 'Zac Parr'],
    ['neuro_fitness_rating', 'NeuroVision & fitness'], ['guests_rating', 'Guest speakers'],
    ['communication_rating', 'Communication'], ['pathway_clarity', 'Pathway clarity'],
  ] },
];

const RatingPill = ({ label, value }) => (
  <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs">
    <span className="text-slate-400">{label}</span>
    <span className="text-white font-bold">{value}<span className="text-slate-500 font-normal">/5</span></span>
  </span>
);

const TextAnswer = ({ label, value }) => (
  <p className="text-sm text-slate-300 leading-relaxed">
    <span className="text-slate-500">{label}: </span>{value}
  </p>
);

const ResponseCard = ({ r, open, onToggle }) => {
  const cont = CONTINUE[r.continue_next];
  const preview = r.change_mind || r.love_most || r.would_change || r.anything_else || '';
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      {/* Header — always visible */}
      <button onClick={onToggle} className="w-full text-left p-4 md:p-5 flex items-start gap-3 hover:bg-white/5 transition-colors">
        <div className="mt-1 text-slate-500 shrink-0">{open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
            <span className="text-white font-bold">{r.player_name || '—'}</span>
            <span className="text-slate-500 text-sm">· {r.respondent_name} ({r.respondent_role || '—'})</span>
            {cont && <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${cont.cls}`}>{cont.label}</span>}
          </div>
          <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-slate-400">
            {typeof r.rating_overall === 'number' && <span className="inline-flex items-center gap-1"><Star className="w-3 h-3 text-rr-pink" /> {r.rating_overall}/5</span>}
            {typeof r.nps === 'number' && <span>NPS {r.nps}</span>}
            {r.centre && <span>{r.centre}</span>}
            <span>{fmtDate(r.created_at)}</span>
          </div>
          {!open && preview && <p className="mt-1.5 text-sm text-slate-400 line-clamp-1 italic">“{preview}”</p>}
        </div>
      </button>

      {/* Body — full answers */}
      {open && (
        <div className="px-4 md:px-5 pb-5 pt-1 border-t border-white/5 space-y-5">
          <a href={`mailto:${r.respondent_email}?subject=Your%20Royals%20Elite%20feedback`} className="inline-flex items-center gap-1.5 text-sm text-rr-light-pink hover:underline">
            <Mail className="w-3.5 h-3.5" /> {r.respondent_email}
          </a>

          {GROUPS.map((g) => {
            const pills = (g.ratings || []).filter(([k]) => typeof r[k] === 'number');
            const texts = (g.texts || []).filter(([k]) => r[k] != null && r[k] !== '');
            if (!pills.length && !texts.length) return null;
            return (
              <div key={g.title}>
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">{g.title}</p>
                {pills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {pills.map(([k, label]) => <RatingPill key={k} label={label} value={r[k]} />)}
                  </div>
                )}
                <div className="space-y-1.5">
                  {texts.map(([k, label, map]) => <TextAnswer key={k} label={label} value={map ? (map[r[k]] || r[k]) : r[k]} />)}
                </div>
              </div>
            );
          })}

          {/* Recommend & continuation */}
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Continuing into Power Game?</p>
            <div className="flex items-center gap-2 flex-wrap">
              {cont && <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cont.cls}`}>{cont.label}</span>}
              {typeof r.nps === 'number' && (
                <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs">
                  <span className="text-slate-400">Recommend (NPS)</span>
                  <span className="text-white font-bold">{r.nps}<span className="text-slate-500 font-normal">/10</span></span>
                </span>
              )}
            </div>
            {(r.stay_reasons?.length || r.stay_reason_other) && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(r.stay_reasons || []).map((s) => <span key={s} className="text-[11px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-0.5">{s}</span>)}
                {r.stay_reason_other && <span className="text-[11px] text-slate-300 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5">{r.stay_reason_other}</span>}
              </div>
            )}
            {(r.barriers?.length || r.barrier_other) && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(r.barriers || []).map((b) => <span key={b} className="text-[11px] font-semibold text-rr-light-pink bg-rr-pink/10 border border-rr-pink/20 rounded-full px-2.5 py-0.5">{b}</span>)}
                {r.barrier_other && <span className="text-[11px] text-slate-300 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5">{r.barrier_other}</span>}
              </div>
            )}
            {r.change_mind && <p className="mt-2 text-sm text-slate-300"><span className="text-slate-500">What would change their mind: </span>{r.change_mind}</p>}
          </div>

          {/* Open text */}
          {(r.love_most || r.would_change || r.anything_else) && (
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">In their words</p>
              <div className="space-y-1.5">
                {r.love_most && <TextAnswer label="Loved most" value={r.love_most} />}
                {r.would_change && <TextAnswer label="Would change" value={r.would_change} />}
                {r.anything_else && <TextAnswer label="Anything else" value={r.anything_else} />}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const FilterBtn = ({ active, onClick, children }) => (
  <button onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${active ? 'bg-rr-pink text-white' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'}`}>
    {children}
  </button>
);

const ProgramFeedbackResponses = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');   // all | continuing | leaving
  const [role, setRole] = useState('all');        // all | Parent | Player | Both
  const [openIds, setOpenIds] = useState(new Set());

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

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (needle) {
        const hay = `${r.player_name || ''} ${r.respondent_name || ''} ${r.respondent_email || ''}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      if (status === 'continuing' && !['signed_up', 'intend'].includes(r.continue_next)) return false;
      if (status === 'leaving' && !['unsure', 'no'].includes(r.continue_next)) return false;
      if (role !== 'all' && r.respondent_role !== role) return false;
      return true;
    });
  }, [rows, q, status, role]);

  const toggle = (id) => setOpenIds((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allOpen = filtered.length > 0 && filtered.every((r) => openIds.has(r.id));
  const toggleAll = () => setOpenIds(allOpen ? new Set() : new Set(filtered.map((r) => r.id)));

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-white">Feedback — Responses</h1>
          <p className="text-slate-400 mt-1 text-sm">Read every answer, per family. Looking for the numbers? See the <Link to="/rramadmin_26/feedback" className="text-rr-light-pink hover:underline">analytics dashboard</Link>.</p>
        </div>
        <button onClick={fetchAll} className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 bg-white/5 border border-white/10 hover:border-white/25 rounded-xl px-4 py-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, player or email…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rr-pink/50" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FilterBtn active={status === 'all'} onClick={() => setStatus('all')}>All</FilterBtn>
          <FilterBtn active={status === 'continuing'} onClick={() => setStatus('continuing')}>Continuing</FilterBtn>
          <FilterBtn active={status === 'leaving'} onClick={() => setStatus('leaving')}>Win-back</FilterBtn>
          <span className="w-px h-5 bg-white/10 mx-1" />
          {['all', 'Parent', 'Player', 'Both'].map((rl) => (
            <FilterBtn key={rl} active={role === rl} onClick={() => setRole(rl)}>{rl === 'all' ? 'Any' : rl}</FilterBtn>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-400"><span className="text-white font-bold">{filtered.length}</span> of {rows.length} response{rows.length === 1 ? '' : 's'}</p>
        {filtered.length > 0 && (
          <button onClick={toggleAll} className="text-xs font-bold text-slate-400 hover:text-white">{allOpen ? 'Collapse all' : 'Expand all'}</button>
        )}
      </div>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-white font-bold">No responses yet</p>
          <p className="text-slate-500 text-sm mt-1">Share <span className="text-rr-pink">rramelbourne.com/elite-feedback</span> with the cohort.</p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-slate-400 py-8 text-center">No responses match your search / filters.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => <ResponseCard key={r.id} r={r} open={openIds.has(r.id)} onToggle={() => toggle(r.id)} />)}
        </div>
      )}
    </div>
  );
};

export default ProgramFeedbackResponses;
