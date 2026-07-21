import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { RefreshCw, Download, Trophy, Users, CheckCircle2, XCircle, HelpCircle, AlertTriangle, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Power League (Sept 2026) participation board.
// Reads/writes public.power_league_players (dashboard-admin RLS via is_dashboard_user()).
// Seeded 13 Jul 2026 from paid Power Game players + the Elite Program 2026 roster,
// with WhatsApp availability-poll responses ("RRA Melbourne 2026 - Official").
// Three centre columns, players grouped in 2.5-year age brackets as of 1 Sept 2026.

const CENTRES = ['Mickleham', 'Hallam', 'Williamstown'];
const BRACKETS = ['Under 12.5', '12.5 – 15', '15 – 17.5', '17.5 – 20', '20+ Open', 'Age TBC'];

const STATUS_META = {
  yes: { label: 'YES', color: '#22c55e', next: 'no' },
  no: { label: 'NO', color: '#ef4444', next: 'pending' },
  pending: { label: 'PENDING', color: '#94a3b8', next: 'yes' },
  check: { label: 'CHECK', color: '#f59e0b', next: 'yes' },
};

// Playing roles from the Elite portal data (power_league_players.skill_role).
const ROLE_META = {
  batter: { label: 'BAT', color: '#38bdf8' },
  allrounder: { label: 'ALL-R', color: '#a78bfa' },
  bowlrounder: { label: 'BWL-R', color: '#f472b6' },
  pace: { label: 'PACE', color: '#fb923c' },
  spin: { label: 'SPIN', color: '#34d399' },
  keeper: { label: 'WK', color: '#facc15' },
};

const roleTally = (players) => {
  const counts = {};
  for (const p of players) if (p.skill_role && ROLE_META[p.skill_role]) counts[p.skill_role] = (counts[p.skill_role] || 0) + 1;
  return Object.keys(ROLE_META).filter((r) => counts[r]).map((r) => `${counts[r]} ${ROLE_META[r].label}`).join(' · ');
};

const csvEscape = (v) => {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
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

const PlayerRow = ({ p, onStatus, onCentre }) => {
  const meta = STATUS_META[p.whatsapp_status] || STATUS_META.pending;
  return (
    <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-white/5 group">
      <button
        onClick={() => onStatus(p, meta.next)}
        title={`Click to set ${STATUS_META[meta.next].label}. ${p.status_note || ''}`}
        className="shrink-0 text-[10px] font-black tracking-wide rounded-full px-2 py-0.5 border transition-colors"
        style={{ color: meta.color, borderColor: `${meta.color}66`, backgroundColor: `${meta.color}14` }}
      >
        {meta.label}
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-white text-sm font-medium truncate leading-tight">
          {p.player_name}
          {p.skill_role && ROLE_META[p.skill_role] && (
            <span
              className="inline-block text-[9px] font-black tracking-wide rounded px-1 ml-1.5 border align-middle"
              style={{ color: ROLE_META[p.skill_role].color, borderColor: `${ROLE_META[p.skill_role].color}55`, backgroundColor: `${ROLE_META[p.skill_role].color}12` }}
              title={p.bowling_type && p.bowling_type !== 'N/A' ? p.bowling_type : undefined}
            >
              {ROLE_META[p.skill_role].label}
            </span>
          )}
          {p.status_note && (
            <AlertTriangle className="inline w-3 h-3 text-amber-400 ml-1 -mt-0.5" title={p.status_note} />
          )}
        </p>
        <p className="text-slate-500 text-[11px] truncate leading-tight">
          {p.age_years != null ? `${p.age_years} yrs` : 'age TBC'}
          {p.suburb ? ` · ${p.suburb}` : ''}
          {' · '}
          <span className="text-slate-400">
            {p.source_programs?.includes('power_game') ? 'PG' : ''}
            {p.source_programs?.includes('power_game') && p.source_programs?.includes('elite_2026') ? '+' : ''}
            {p.source_programs?.includes('elite_2026') ? 'Elite' : ''}
          </span>
        </p>
      </div>
      <select
        value={p.centre || ''}
        onChange={(e) => onCentre(p, e.target.value || null)}
        title="Move to another centre"
        className="shrink-0 bg-transparent text-slate-500 text-[10px] border border-white/10 rounded-md px-1 py-0.5 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
      >
        <option value="" className="bg-slate-900">—</option>
        {CENTRES.map((c) => (
          <option key={c} value={c} className="bg-slate-900">{c.slice(0, 4)}</option>
        ))}
      </select>
    </div>
  );
};

const CentreColumn = ({ name, players, teamSize, onStatus, onCentre }) => {
  const yes = players.filter((r) => r.whatsapp_status === 'yes');
  const teamsYes = Math.floor(yes.length / teamSize);
  const teamsPool = Math.floor(players.length / teamSize);
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl flex flex-col min-w-0">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rr-pink shrink-0" />
          <h3 className="text-white font-black tracking-wide uppercase text-sm truncate">{name}</h3>
        </div>
        <p className="text-slate-400 text-xs mt-1">
          {players.length} players · <span className="text-emerald-400 font-bold">{yes.length} yes</span>
        </p>
        <p className="text-slate-500 text-[11px] mt-0.5">
          Teams of {teamSize}: <span className="text-white font-bold">{teamsYes}</span> confirmed
          <span className="text-slate-600"> · {teamsPool} if full pool plays</span>
        </p>
      </div>
      <div className="p-2 space-y-3 overflow-y-auto">
        {BRACKETS.map((b) => {
          const bp = players.filter((r) => (r.age_bracket || 'Age TBC') === b);
          if (!bp.length) return null;
          const yesRows = bp.filter((r) => r.whatsapp_status === 'yes');
          const by = yesRows.length;
          const tally = roleTally(yesRows);
          return (
            <div key={b}>
              <div className="flex items-center justify-between px-2 mb-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{b}</p>
                <p className="text-[10px] text-slate-500">
                  <span className="text-emerald-400 font-bold">{by}</span>/{bp.length}
                  {by >= teamSize && <span className="text-rr-pink font-bold"> · {Math.floor(by / teamSize)} team{Math.floor(by / teamSize) > 1 ? 's' : ''}</span>}
                </p>
              </div>
              {tally && <p className="px-2 mb-1 text-[9px] text-slate-600">Yes roles: {tally}</p>}
              <div className="rounded-xl border border-white/5 divide-y divide-white/5">
                {bp.map((p) => <PlayerRow key={p.id} p={p} onStatus={onStatus} onCentre={onCentre} />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PowerLeagueDashboard = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamSize, setTeamSize] = useState(8);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('power_league_players')
      .select('*')
      .order('age_years', { ascending: true, nullsFirst: false });
    if (err) setError(err.message);
    else setRows(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateRow = useCallback(async (p, patch) => {
    setRows((rs) => rs.map((r) => (r.id === p.id ? { ...r, ...patch } : r)));
    const { error: err } = await supabase.from('power_league_players').update(patch).eq('id', p.id);
    if (err) {
      setError(`Save failed for ${p.player_name}: ${err.message}`);
      load();
    }
  }, [load]);

  const onStatus = useCallback((p, status) => updateRow(p, { whatsapp_status: status }), [updateRow]);
  const onCentre = useCallback((p, centre) => updateRow(p, { centre, centre_source: 'manual' }), [updateRow]);

  const byCentre = useMemo(() => {
    const m = Object.fromEntries(CENTRES.map((c) => [c, []]));
    const un = [];
    for (const r of rows) (r.centre && m[r.centre] ? m[r.centre] : un).push(r);
    return { m, un };
  }, [rows]);

  const totals = useMemo(() => ({
    pool: rows.length,
    yes: rows.filter((r) => r.whatsapp_status === 'yes').length,
    no: rows.filter((r) => r.whatsapp_status === 'no').length,
    pending: rows.filter((r) => r.whatsapp_status === 'pending').length,
    check: rows.filter((r) => r.whatsapp_status === 'check').length,
  }), [rows]);

  const exportCsv = () => {
    const header = ['Player', 'Centre', 'Centre source', 'Age bracket', 'Age (1 Sep 26)', 'Role', 'Bowling', 'Availability', 'Note', 'Programs', 'Suburb', 'Phone', 'Email'];
    const lines = rows.map((r) => [
      r.player_name, r.centre || 'Unassigned', r.centre_source, r.age_bracket, r.age_years ?? '',
      r.skill_role ?? '', r.bowling_type ?? '',
      r.whatsapp_status, r.status_note ?? '', (r.source_programs || []).join(' + '), r.suburb ?? '', r.phone ?? '', r.email ?? '',
    ].map(csvEscape).join(','));
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `power-league-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <RefreshCw className="w-6 h-6 text-rr-pink animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">POWER LEAGUE — SEPT 2026</h1>
          <p className="text-slate-400 text-sm mt-1">
            Paid Power Game + Elite Program 2026 members, grouped by centre and 2.5-year age brackets (age at 1 Sept 2026).
            Availability from the RRA Melbourne 2026 WhatsApp poll — click a status pill to update it as players confirm.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-white/10 overflow-hidden">
            {[8, 11].map((n) => (
              <button
                key={n}
                onClick={() => setTeamSize(n)}
                className={`px-3 py-2 text-xs font-bold ${teamSize === n ? 'bg-rr-pink text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {n}-a-side
              </button>
            ))}
          </div>
          <button onClick={load} className="p-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={exportCsv} className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs font-bold transition-colors">
            <Download className="w-4 h-4" /> CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard label="Total pool" value={totals.pool} sub="Power Game paid + Elite 2026" icon={Users} color="#38bdf8" />
        <StatCard label="Confirmed YES" value={totals.yes} sub="WhatsApp availability poll" icon={CheckCircle2} color="#22c55e" />
        <StatCard label="Not available" value={totals.no} icon={XCircle} color="#ef4444" />
        <StatCard label="No response yet" value={totals.pending} sub="chase in the group chat" icon={HelpCircle} color="#94a3b8" />
        <StatCard label="Confirmed teams" value={CENTRES.reduce((s, c) => s + Math.floor(byCentre.m[c].filter((r) => r.whatsapp_status === 'yes').length / teamSize), 0)} sub={`${teamSize}-a-side, per centre`} icon={Trophy} color="#E11F8F" />
      </div>

      {byCentre.un.length > 0 && (
        <div className="mb-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4">
          <p className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-2">Unassigned — pick a centre</p>
          <div className="rounded-xl border border-white/5 divide-y divide-white/5">
            {byCentre.un.map((p) => <PlayerRow key={p.id} p={p} onStatus={onStatus} onCentre={onCentre} />)}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {CENTRES.map((c) => (
          <CentreColumn key={c} name={c} players={byCentre.m[c]} teamSize={teamSize} onStatus={onStatus} onCentre={onCentre} />
        ))}
      </div>

      <p className="text-slate-600 text-xs mt-6">
        Centres were set from the player's purchased Power Game venue where they've paid, otherwise the nearest centre to their
        suburb (straight-line) — hover a player to move them. CHECK = a WhatsApp vote we couldn't attribute with certainty; see the ⚠ note.
      </p>
    </div>
  );
};

export default PowerLeagueDashboard;
