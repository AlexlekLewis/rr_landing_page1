import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { RefreshCw, Shirt, Search, PackageCheck, ClipboardCheck, AlertTriangle, Download, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  MOVE_TYPES, STATUS_LABELS, SOURCE_LABELS,
  buildStockGrid, stockTakeMoves, manualMove, lineMatches, groupByPlayer, lineSummary,
} from '../../lib/kit/uniformStock';

// Uniforms: stock, stock takes, hand-outs and player search, in one place (Andy, 19 Nov 2026).
// Stock is Alex's store_* tables (store_stock_moves → store_stock_position). Player lines come from
// store_uniform_lines() (program shirts, squad kit, shop orders, Power Game kit); hand-outs go through
// store_hand_out(), which takes the item off stock. Both are dashboard users only.

const STATUS_COLOURS = {
  to_hand_out: '#f59e0b', size_needed: '#ef4444', handed_out: '#22c55e', unpaid: '#94a3b8', cancelled: '#64748b', refunded: '#64748b',
};

const Pill = ({ status }) => (
  <span className="text-[10px] font-black tracking-wide rounded-full px-2 py-0.5 border whitespace-nowrap"
    style={{ color: STATUS_COLOURS[status], borderColor: `${STATUS_COLOURS[status]}66`, backgroundColor: `${STATUS_COLOURS[status]}14` }}>
    {STATUS_LABELS[status] || status}
  </span>
);

const Tile = ({ label, value, colour }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <p className="text-2xl font-black text-white leading-none" style={colour ? { color: colour } : undefined}>{value}</p>
    <p className="text-slate-400 text-xs font-medium mt-1.5">{label}</p>
  </div>
);

const today = () => new Date().toLocaleDateString('en-AU');
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: '2-digit' }) : '');
const csv = (v) => { const s = v == null ? '' : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };

// ── Stock tab ───────────────────────────────────────────────────────────────
const StockTab = ({ grid, variants, products, hqId, who, onSaved, moves }) => {
  const [takeFor, setTakeFor] = useState(null); // product_id being counted
  const [counts, setCounts] = useState({});
  const [form, setForm] = useState({ productId: '', variantId: '', reason: 'receipt', qty: 1, note: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const saveTake = async (block) => {
    setMsg(null);
    try {
      const rows = stockTakeMoves(block.sizes, counts, { who, date: today(), locationId: hqId });
      if (!rows.length) { setMsg({ ok: true, text: `${block.name}: counts match the list, nothing to change.` }); setTakeFor(null); return; }
      setBusy(true);
      const { error } = await supabase.from('store_stock_moves').insert(rows);
      if (error) throw error;
      setMsg({ ok: true, text: `${block.name}: stock take saved (${rows.length} size${rows.length > 1 ? 's' : ''} changed).` });
      setTakeFor(null); setCounts({}); onSaved();
    } catch (e) { setMsg({ ok: false, text: e.message }); } finally { setBusy(false); }
  };

  const saveMove = async (e) => {
    e.preventDefault(); setMsg(null);
    try {
      const row = manualMove({ ...form, variantId: form.variantId, who, locationId: hqId });
      setBusy(true);
      const { error } = await supabase.from('store_stock_moves').insert([row]);
      if (error) throw error;
      setMsg({ ok: true, text: 'Saved.' });
      setForm((f) => ({ ...f, qty: 1, note: '' })); onSaved();
    } catch (err) { setMsg({ ok: false, text: err.message }); } finally { setBusy(false); }
  };

  const sizesFor = variants.filter((v) => v.product_id === form.productId).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-6">
      {msg && <p className={`text-sm rounded-xl px-4 py-2 ${msg.ok ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>{msg.text}</p>}

      <form onSubmit={saveMove} className="bg-white/5 border border-white/10 rounded-2xl p-4 grid grid-cols-2 md:grid-cols-6 gap-2 items-end">
        <p className="col-span-2 md:col-span-6 text-white font-bold text-sm flex items-center gap-2"><Plus className="w-4 h-4 text-rr-pink" /> Record stock in or out</p>
        <select value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="col-span-2 bg-slate-900 text-white text-sm border border-white/10 rounded-lg px-2 py-2">
          {MOVE_TYPES.map((t) => <option key={t.reason} value={t.reason}>{t.label}</option>)}
        </select>
        <select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value, variantId: '' })} className="bg-slate-900 text-white text-sm border border-white/10 rounded-lg px-2 py-2">
          <option value="">Item…</option>
          {products.filter((p) => p.status === 'active').map((p) => <option key={p.id} value={p.id}>{p.short_name || p.name}</option>)}
        </select>
        <select value={form.variantId} onChange={(e) => setForm({ ...form, variantId: e.target.value })} className="bg-slate-900 text-white text-sm border border-white/10 rounded-lg px-2 py-2">
          <option value="">Size…</option>
          {sizesFor.map((v) => <option key={v.id} value={v.id}>{v.size_label}</option>)}
        </select>
        <input type="number" min="1" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} className="bg-slate-900 text-white text-sm border border-white/10 rounded-lg px-2 py-2" aria-label="Quantity" />
        <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Note (who / why)" className="col-span-2 md:col-span-5 bg-slate-900 text-white text-sm border border-white/10 rounded-lg px-2 py-2" />
        <button disabled={busy} className="bg-rr-pink text-white font-bold text-sm rounded-lg px-3 py-2 disabled:opacity-50">Save</button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {grid.map((block) => {
          const counting = takeFor === block.product_id;
          return (
            <div key={block.product_id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div>
                  <p className="text-white font-black text-sm uppercase tracking-wide">{block.name}</p>
                  <p className="text-slate-400 text-xs">{block.on_hand} on hand · {block.committed} owed to players</p>
                </div>
                {counting ? (
                  <div className="flex gap-2">
                    <button onClick={() => { setTakeFor(null); setCounts({}); }} className="text-slate-300 text-xs border border-white/20 rounded-lg px-2 py-1">Cancel</button>
                    <button disabled={busy} onClick={() => saveTake(block)} className="bg-emerald-600 text-white text-xs font-bold rounded-lg px-2 py-1 disabled:opacity-50">Save count</button>
                  </div>
                ) : (
                  <button onClick={() => { setTakeFor(block.product_id); setCounts({}); }} className="text-rr-pink text-xs font-bold border border-rr-pink/40 rounded-lg px-2 py-1 flex items-center gap-1">
                    <ClipboardCheck className="w-3.5 h-3.5" /> Stock take
                  </button>
                )}
              </div>
              <table className="w-full text-sm">
                <thead><tr className="text-slate-500 text-[11px] uppercase">
                  <th className="text-left px-4 py-1.5 font-semibold">Size</th><th className="text-right px-2 font-semibold">On hand</th>
                  <th className="text-right px-2 font-semibold">Owed</th><th className="text-right px-4 font-semibold">{counting ? 'Counted' : 'Free'}</th>
                </tr></thead>
                <tbody>
                  {block.sizes.map((s) => (
                    <tr key={s.variant_id} className="border-t border-white/5">
                      <td className="px-4 py-1 text-white">{s.size_label}</td>
                      <td className={`text-right px-2 ${s.on_hand < 0 ? 'text-red-400 font-bold' : 'text-white'}`}>{s.on_hand}</td>
                      <td className="text-right px-2 text-slate-400">{s.committed || ''}</td>
                      <td className="text-right px-4">
                        {counting ? (
                          <input type="number" min="0" inputMode="numeric" value={counts[s.variant_id] ?? ''} placeholder={String(s.on_hand)}
                            onChange={(e) => setCounts({ ...counts, [s.variant_id]: e.target.value })}
                            className="w-16 bg-slate-900 text-white text-right border border-white/15 rounded px-1 py-0.5" aria-label={`Counted ${s.size_label}`} />
                        ) : (
                          <span className={s.free < 0 ? 'text-red-400 font-bold' : 'text-slate-300'}>{s.free}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {counting && <p className="text-slate-500 text-[11px] px-4 py-2 border-t border-white/5">Type what's on the shelf. Leave a size blank to skip it.</p>}
            </div>
          );
        })}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl">
        <p className="text-white font-bold text-sm px-4 py-3 border-b border-white/10">Latest stock movements</p>
        <div className="max-h-80 overflow-auto">
          {moves.map((m) => (
            <div key={m.id} className="flex gap-3 px-4 py-1.5 border-t border-white/5 text-xs">
              <span className="text-slate-500 w-16 shrink-0">{fmtDate(m.created_at)}</span>
              <span className={`w-10 shrink-0 text-right font-bold ${m.qty > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>{m.qty > 0 ? `+${m.qty}` : m.qty}</span>
              <span className="text-white w-48 shrink-0 truncate">{m.store_variants?.store_products?.short_name || m.store_variants?.store_products?.name} {m.store_variants?.size_label}</span>
              <span className="text-slate-400 truncate">{m.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Players & orders tab ────────────────────────────────────────────────────
const PlayersTab = ({ lines, variants, products, onSaved }) => {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('to_hand_out');
  const [source, setSource] = useState('');
  const [busy, setBusy] = useState(null);
  const [msg, setMsg] = useState(null);
  const [picked, setPicked] = useState({}); // line key -> variant id for size_needed lines

  const filtered = useMemo(() => lines.filter((l) =>
    (!status || l.status === status) && (!source || l.source === source) && lineMatches(l, q)), [lines, status, source, q]);
  const groups = useMemo(() => groupByPlayer(filtered).slice(0, 200), [filtered]);
  const slugToId = useMemo(() => Object.fromEntries(products.map((p) => [p.slug, p.id])), [products]);
  const lineKey = (l) => `${l.source}|${l.source_id}|${l.line_no}`;

  const handOut = async (l, takeFromStock) => {
    const variantId = l.variant_id || picked[lineKey(l)];
    if (!variantId) { setMsg({ ok: false, text: 'Choose the size first.' }); return; }
    setBusy(lineKey(l)); setMsg(null);
    const args = { p_source: l.source, p_source_id: l.source_id, p_variant_id: variantId, p_qty: Math.max(1, l.qty - (l.handed_qty || 0)),
      p_note: `Handed out: ${l.product_name} ${l.size_label || ''} to ${l.player || 'player'}` };
    if (!takeFromStock) args.p_take_from_stock = false;
    const { error } = await supabase.rpc('store_hand_out', args);
    setBusy(null);
    if (error) setMsg({ ok: false, text: error.message }); else { setMsg({ ok: true, text: `${l.player}: ${l.product_name} marked handed out.` }); onSaved(); }
  };

  const exportCsv = () => {
    const head = ['Player', 'Parent', 'Email', 'Phone', 'Where from', 'Program', 'Centre', 'Item', 'Size', 'Qty', 'Paid', 'Status', 'Ordered'];
    const rows = filtered.map((l) => [l.player, l.contact, l.email, l.phone, SOURCE_LABELS[l.source], l.program, l.centre, l.product_name, l.size_label, l.qty, l.paid ? 'yes' : 'no', STATUS_LABELS[l.status], fmtDate(l.ordered_at)]);
    const blob = new Blob([[head, ...rows].map((r) => r.map(csv).join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `uniforms-${status || 'all'}.csv`; a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search player, parent, email, phone, size, item, centre…"
            className="w-full bg-slate-900 text-white text-sm border border-white/10 rounded-xl pl-9 pr-3 py-2" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-slate-900 text-white text-sm border border-white/10 rounded-xl px-2 py-2">
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={source} onChange={(e) => setSource(e.target.value)} className="bg-slate-900 text-white text-sm border border-white/10 rounded-xl px-2 py-2">
          <option value="">Everywhere</option>
          {Object.entries(SOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button onClick={exportCsv} className="text-slate-300 text-sm border border-white/15 rounded-xl px-3 py-2 flex items-center gap-1"><Download className="w-4 h-4" /> CSV</button>
      </div>
      {msg && <p className={`text-sm rounded-xl px-4 py-2 ${msg.ok ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>{msg.text}</p>}
      <p className="text-slate-500 text-xs">{filtered.length} item{filtered.length === 1 ? '' : 's'} · {groups.length} player{groups.length === 1 ? '' : 's'}{groups.length === 200 ? ' (first 200 shown, search to narrow)' : ''}</p>

      <div className="space-y-2">
        {groups.map((g) => (
          <div key={g.key} className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <div className="flex flex-wrap items-baseline gap-x-3 mb-1.5">
              <p className="text-white font-bold">{g.player}</p>
              <p className="text-slate-400 text-xs">{[g.contact && g.contact !== g.player ? g.contact : null, g.email, g.phone].filter(Boolean).join(' · ')}</p>
            </div>
            {g.lines.map((l) => {
              const k = lineKey(l);
              const sizeChoices = variants.filter((v) => v.product_id === slugToId[l.product_slug]).sort((a, b) => a.sort_order - b.sort_order);
              return (
                <div key={k} className="flex flex-wrap items-center gap-2 py-1 border-t border-white/5 text-sm">
                  <Pill status={l.status} />
                  <span className="text-white">{l.product_name || l.product_slug}</span>
                  <span className="text-white font-bold">{l.size_label || '—'}</span>
                  {l.qty > 1 && <span className="text-slate-400">×{l.qty}</span>}
                  <span className="text-slate-500 text-xs">{SOURCE_LABELS[l.source]} · {l.program}{l.centre ? ` · ${l.centre}` : ''} · {fmtDate(l.ordered_at)}</span>
                  {(l.status === 'to_hand_out' || l.status === 'size_needed') && (
                    <span className="ml-auto flex items-center gap-1.5">
                      {!l.variant_id && (
                        <select value={picked[k] || ''} onChange={(e) => setPicked({ ...picked, [k]: e.target.value })}
                          className="bg-slate-900 text-white text-xs border border-red-400/40 rounded-lg px-1 py-1" aria-label="Size handed out">
                          <option value="">Size?</option>
                          {sizeChoices.map((v) => <option key={v.id} value={v.id}>{v.size_label}</option>)}
                        </select>
                      )}
                      <button disabled={busy === k} onClick={() => handOut(l, true)} title="Take it off stock now"
                        className="bg-emerald-600 text-white text-xs font-bold rounded-lg px-2 py-1 disabled:opacity-50 flex items-center gap-1">
                        <PackageCheck className="w-3.5 h-3.5" /> Hand out
                      </button>
                      <button disabled={busy === k} onClick={() => handOut(l, false)} title="Already handed out before the last stock count: mark it done without taking it off stock again"
                        className="text-slate-300 text-xs border border-white/15 rounded-lg px-2 py-1 disabled:opacity-50">Already had it</button>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Page ────────────────────────────────────────────────────────────────────
const UniformsDashboard = () => {
  const [tab, setTab] = useState('stock');
  const [data, setData] = useState({ products: [], variants: [], positions: [], lines: [], moves: [], hqId: null });
  const [who, setWho] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    const [p, v, pos, lines, moves, loc, user] = await Promise.all([
      supabase.from('store_products').select('id, slug, name, short_name, status, sort_order, archived_at'),
      supabase.from('store_variants').select('id, product_id, size_label, size_group, sort_order, is_active, archived_at'),
      supabase.from('store_stock_position').select('variant_id, on_hand, committed, free'),
      supabase.rpc('store_uniform_lines'),
      supabase.from('store_stock_moves').select('id, created_at, qty, reason, note, store_variants(size_label, store_products(name, short_name))').order('created_at', { ascending: false }).limit(60),
      supabase.from('store_locations').select('id').eq('key', 'hq').maybeSingle(),
      supabase.auth.getUser(),
    ]);
    const firstError = [p, v, pos, lines, moves, loc].find((r) => r.error)?.error;
    if (firstError) setError(firstError.message);
    setData({ products: p.data || [], variants: v.data || [], positions: pos.data || [], lines: lines.data || [], moves: moves.data || [], hqId: loc.data?.id || null });
    setWho(user.data?.user?.email || '');
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const grid = useMemo(() => buildStockGrid(data.products, data.variants, data.positions), [data]);
  const summary = useMemo(() => lineSummary(data.lines), [data.lines]);
  const onHand = grid.reduce((n, b) => n + b.on_hand, 0);
  const negative = grid.flatMap((b) => b.sizes.filter((s) => s.on_hand < 0)).length;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-rr-pink/15 flex items-center justify-center"><Shirt className="w-5 h-5 text-rr-pink" /></div>
          <div>
            <h1 className="text-white text-2xl font-black uppercase tracking-wide">Uniforms</h1>
            <p className="text-slate-400 text-sm">Stock, stock takes, hand-outs and every player's kit.</p>
          </div>
        </div>
        <button onClick={load} className="text-slate-300 border border-white/15 rounded-xl px-3 py-2 text-sm flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {error && <p className="text-sm rounded-xl px-4 py-2 bg-red-500/10 text-red-300">Couldn't load everything: {error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Tile label="Items on hand" value={onHand} />
        <Tile label="To hand out" value={summary.to_hand_out} colour={STATUS_COLOURS.to_hand_out} />
        <Tile label="Need a size first" value={summary.size_needed} colour={STATUS_COLOURS.size_needed} />
        <Tile label="Handed out" value={summary.handed_out} colour={STATUS_COLOURS.handed_out} />
        <Tile label="Sizes below zero" value={negative} colour={negative ? '#ef4444' : undefined} />
      </div>
      {negative > 0 && (
        <p className="text-amber-300 text-xs flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Below zero means more has gone out than the list knew we had: do a stock take for that item.</p>
      )}

      <div className="flex gap-1 border-b border-white/10">
        {[['stock', 'Stock'], ['players', 'Players & orders']].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-2 text-sm font-bold border-b-2 -mb-px ${tab === k ? 'text-white border-rr-pink' : 'text-slate-400 border-transparent'}`}>{label}</button>
        ))}
      </div>

      {tab === 'stock'
        ? <StockTab grid={grid} variants={data.variants} products={data.products} hqId={data.hqId} who={who} onSaved={load} moves={data.moves} />
        : <PlayersTab lines={data.lines} variants={data.variants} products={data.products} onSaved={load} />}
    </div>
  );
};

export default UniformsDashboard;
