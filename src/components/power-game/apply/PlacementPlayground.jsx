import React, { useMemo, useState } from 'react';
import { computeDna } from '../../../lib/scoring/engine';
import { COMPETITION_TIERS, LADDER } from '../../../lib/scoring/ladder';
import { placeFromDna } from '../../../lib/scoring/guardrail';

// ── Dev tool: enter the 7 answers, see the live placement. Not a public page. ──

const CURRENT_SEASON = '2025/26';
const CURRENT_SEASON_START = 2025;
const TIER_LABEL = { 5: 'Elite', 4: 'Performance', 3: 'Development', 2: 'Foundation', 1: 'Entry' };

const PRESETS = {
  '14yo Dowling gun (bat)': { dob: '2012-01-01', gender: 'M', code: 'P16M', games: 10, format: 't20', skill: 'batting', batAvg: 38, batSR: 150 },
  '17yo Premier 1st (bat)': { dob: '2009-01-01', gender: 'M', code: 'P1M', games: 12, format: 't20', skill: 'batting', batAvg: 42, batSR: 145 },
  "17yo Women's Prem 1st (bowl)": { dob: '2009-01-01', gender: 'F', code: 'P1F', games: 11, format: 'od', skill: 'bowling', bowlAvg: 16, bowlEcon: 4.0 },
  '12yo club only (bat)': { dob: '2014-01-01', gender: 'M', code: 'CJ-12B', games: 8, format: 'od', skill: 'batting', batAvg: 25, batSR: 95 },
  '16yo SD1 gun (bat)': { dob: '2010-01-01', gender: 'M', code: 'SD1', games: 12, format: 't20', skill: 'batting', batAvg: 35, batSR: 130 },
};

const BLANK = { dob: '', gender: 'M', code: '', games: 10, format: 't20', skill: 'batting', batAvg: '', batSR: '', bowlAvg: '', bowlEcon: '', fieldCatches: '', fieldStumpings: '', rep: false };

function buildInput(f) {
  const isBat = f.skill === 'batting' || f.skill === 'all_rounder';
  const isBowl = f.skill === 'bowling' || f.skill === 'all_rounder';
  const isKeep = f.skill === 'wicketkeeper';
  const n = (v) => (v === '' || v == null ? null : Number(v));
  return {
    profile: {
      dob: f.dob || null,
      isKeeper: isKeep,
      battingPositionBand: isBat ? '1-3' : null,
      bowlingRole: isBowl ? 'new_ball' : null,
    },
    history: f.code ? [{ competitionCode: f.code, mostRecentSeason: CURRENT_SEASON, isRepresentativeHonour: !!f.rep }] : [],
    stats: f.code
      ? [{
          season: CURRENT_SEASON,
          format: f.format,
          competitionCode: f.code,
          batMatches: isBat ? n(f.games) : null,
          batInnings: isBat ? n(f.games) : null,
          batAverage: isBat ? n(f.batAvg) : null,
          batStrikeRate: isBat ? n(f.batSR) : null,
          bowlMatches: isBowl ? n(f.games) : null,
          bowlAverage: isBowl ? n(f.bowlAvg) : null,
          bowlEconomy: isBowl ? n(f.bowlEcon) : null,
          fieldCatches: isKeep ? n(f.fieldCatches) : null,
          fieldStumpings: isKeep ? n(f.fieldStumpings) : null,
        }]
      : [],
    competitionTiers: COMPETITION_TIERS,
    currentSeasonStartYear: CURRENT_SEASON_START,
  };
}

const Field = ({ label, children }) => (
  <label className="block">
    <span className="block text-[11px] font-bold uppercase tracking-widest text-white/50 mb-1">{label}</span>
    {children}
  </label>
);
const inputCls = 'w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rr-pink';

export default function PlacementPlayground() {
  const [f, setF] = useState({ ...PRESETS['14yo Dowling gun (bat)'] });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const comps = useMemo(
    () => LADDER.filter((e) => e.gender === f.gender || e.gender === 'Mixed' || e.gender === 'M/F'),
    [f.gender],
  );
  const grouped = useMemo(() => {
    const g = {};
    for (const e of comps) (g[e.category] ??= []).push(e);
    return g;
  }, [comps]);

  const result = useMemo(() => {
    try {
      const dna = computeDna(buildInput(f));
      return { dna, placement: placeFromDna(dna), error: null };
    } catch (e) {
      return { dna: null, placement: null, error: e.message };
    }
  }, [f]);

  const { dna, placement, error } = result;
  const isBat = f.skill === 'batting' || f.skill === 'all_rounder';
  const isBowl = f.skill === 'bowling' || f.skill === 'all_rounder';
  const isKeep = f.skill === 'wicketkeeper';

  const streamColor = placement?.stream === 'performance' ? 'bg-rr-pink' : placement?.stream === 'pathway' ? 'bg-rr-blue' : 'bg-amber-500';

  return (
    <div className="min-h-screen bg-rr-dark text-white p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-black uppercase tracking-wide">Power Game · Placement Playground</h1>
          <p className="text-white/50 text-sm">Dev tool — enter the 7 answers, see the live engine placement. Engine <code className="text-rr-pink">{dna?.engineVersion}</code></p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {Object.keys(PRESETS).map((k) => (
            <button key={k} onClick={() => setF({ ...BLANK, ...PRESETS[k] })} className="text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/15 rounded-full px-3 py-1.5">{k}</button>
          ))}
          <button onClick={() => setF({ ...BLANK })} className="text-xs font-bold bg-white/5 hover:bg-white/15 border border-white/10 rounded-full px-3 py-1.5 text-white/60">Clear</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ── Form ── */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date of birth"><input type="date" className={inputCls} value={f.dob} onChange={(e) => set('dob', e.target.value)} /></Field>
              <Field label="Gender">
                <select className={inputCls} value={f.gender} onChange={(e) => { set('gender', e.target.value); set('code', ''); }}>
                  <option value="M">Male</option><option value="F">Female</option>
                </select>
              </Field>
            </div>

            <Field label="Highest level last season">
              <select className={inputCls} value={f.code} onChange={(e) => set('code', e.target.value)}>
                <option value="">— select —</option>
                {Object.entries(grouped).map(([cat, list]) => (
                  <optgroup key={cat} label={cat}>
                    {list.map((e) => <option key={e.code} value={e.code}>{e.name} ({e.cti})</option>)}
                  </optgroup>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Games at that level"><input type="number" className={inputCls} value={f.games} onChange={(e) => set('games', e.target.value)} /></Field>
              <Field label="Format">
                <select className={inputCls} value={f.format} onChange={(e) => set('format', e.target.value)}>
                  <option value="t20">T20</option><option value="od">One-day</option><option value="multiday">Two/Multi-day</option>
                </select>
              </Field>
            </div>

            <Field label="Main skill">
              <select className={inputCls} value={f.skill} onChange={(e) => set('skill', e.target.value)}>
                <option value="batting">Batting</option><option value="bowling">Bowling</option>
                <option value="all_rounder">All-rounder</option><option value="wicketkeeper">Wicketkeeper</option>
              </select>
            </Field>

            {isBat && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Batting average"><input type="number" className={inputCls} value={f.batAvg} onChange={(e) => set('batAvg', e.target.value)} /></Field>
                <Field label="Strike rate (opt)"><input type="number" className={inputCls} value={f.batSR} onChange={(e) => set('batSR', e.target.value)} /></Field>
              </div>
            )}
            {isBowl && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Bowling average"><input type="number" className={inputCls} value={f.bowlAvg} onChange={(e) => set('bowlAvg', e.target.value)} /></Field>
                <Field label="Economy (opt)"><input type="number" className={inputCls} value={f.bowlEcon} onChange={(e) => set('bowlEcon', e.target.value)} /></Field>
              </div>
            )}
            {isKeep && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Catches"><input type="number" className={inputCls} value={f.fieldCatches} onChange={(e) => set('fieldCatches', e.target.value)} /></Field>
                <Field label="Stumpings"><input type="number" className={inputCls} value={f.fieldStumpings} onChange={(e) => set('fieldStumpings', e.target.value)} /></Field>
              </div>
            )}
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" checked={f.rep} onChange={(e) => set('rep', e.target.checked)} /> Representative honour (last 3 seasons)
            </label>
          </div>

          {/* ── Result ── */}
          <div>
            {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 text-red-200 text-sm">{error}</div>}
            {dna && placement && (
              <div className="bg-white/5 border border-white/15 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`${streamColor} text-white text-xs font-black uppercase tracking-widest rounded-full px-3 py-1`}>{placement.stream}</span>
                  {placement.requiresReview && <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-widest rounded-full px-2 py-1">Coach review</span>}
                </div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                  <Row k="Ability tier" v={`T${dna.abilityTier ?? '-'} ${TIER_LABEL[dna.abilityTier] ?? ''}`} />
                  <Row k="Lane" v={placement.lane ?? '—'} />
                  <Row k="Age" v={dna.breakdown.age ?? '—'} />
                  <Row k="Home band" v={placement.homeBand} />
                  <Row k="Placed band" v={placement.placedBand} hot={placement.placedBand !== placement.homeBand} />
                  <Row k="Play flag" v={placement.playFlag ?? '—'} />
                  <Row k="Overall score" v={dna.overallScore ?? '—'} />
                  <Row k="Eligibility" v={dna.eligibilityStatus} />
                  <Row k="Bat / Bowl / Keep" v={`${dna.battingScore ?? '–'} / ${dna.bowlingScore ?? '–'} / ${dna.keepingScore ?? '–'}`} />
                  <Row k="Archetype" v={dna.primaryBattingArchetype || dna.primaryBowlingArchetype || '—'} />
                </div>
                {placement.reviewReasons.length > 0 && (
                  <div className="mt-4 text-xs text-amber-300/90">Review: {placement.reviewReasons.join(', ')}</div>
                )}
                {dna.styleTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">{dna.styleTags.map((t) => <span key={t} className="text-[10px] bg-white/10 rounded px-2 py-0.5 text-white/60">{t}</span>)}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const Row = ({ k, v, hot }) => (
  <div>
    <div className="text-[10px] uppercase tracking-widest text-white/40">{k}</div>
    <div className={`font-bold ${hot ? 'text-rr-pink' : 'text-white'}`}>{String(v)}</div>
  </div>
);
