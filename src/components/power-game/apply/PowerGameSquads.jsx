import React, { useState } from 'react';
import { inventory } from '../../../lib/booking/inventory';
import { applications } from '../../../lib/booking/applications';
import { CENTRE_BY_SLUG } from '../../../lib/booking/squads';

// Local ops view of squad fills + the coach review queue + bookings.
// Reads the in-memory stores (same SPA session). Production reads pg_* in Supabase.
export default function PowerGameSquads() {
  const [, force] = useState(0);
  const squads = inventory.listSquads();
  const byCentre = {};
  for (const s of squads) (byCentre[s.centre] ??= []).push(s);
  const review = applications.reviewQueue();
  const booked = applications.booked();

  return (
    <div className="min-h-screen bg-rr-dark text-white font-sans p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wide">Power Game · Squad Fills</h1>
            <p className="text-white/40 text-sm">Live capacity, the coach review queue &amp; confirmed bookings (this session)</p>
          </div>
          <button onClick={() => force((n) => n + 1)} className="text-xs font-bold bg-white/10 border border-white/15 rounded-full px-4 py-2 hover:bg-white/20">Refresh</button>
        </div>

        {Object.entries(byCentre).map(([slug, list]) => {
          const cap = list.reduce((s, q) => s + q.capacity, 0);
          const left = list.reduce((s, q) => s + inventory.spotsLeft(q.id), 0);
          return (
            <div key={slug} className="mb-8">
              <div className="flex items-baseline justify-between mb-3">
                <h2 className="text-lg font-black uppercase tracking-wide">{CENTRE_BY_SLUG[slug]?.name ?? slug}</h2>
                <span className="text-xs text-white/40 uppercase tracking-widest">{cap - left}/{cap} filled</span>
              </div>
              <div className="space-y-2">
                {list.sort((a, b) => a.sortOrder - b.sortOrder).map((q) => {
                  const spotsLeft = inventory.spotsLeft(q.id);
                  const taken = q.capacity - spotsLeft;
                  const pct = Math.round((taken / q.capacity) * 100);
                  return (
                    <div key={q.id} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="font-bold">
                          <span className={`inline-block text-[10px] font-black uppercase tracking-widest rounded px-1.5 py-0.5 mr-2 ${q.stream === 'performance' ? 'bg-rr-pink/20 text-rr-pink' : 'bg-rr-blue/20 text-rr-blue'}`}>{q.stream}</span>
                          {q.band} · {q.day} {q.startTime}–{q.endTime}
                        </span>
                        <span className={`text-xs font-black uppercase tracking-widest ${spotsLeft <= 0 ? 'text-white/40' : spotsLeft <= 3 ? 'text-rr-pink' : 'text-green-400'}`}>{taken}/{q.capacity}</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-rr" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Panel title={`Coach review queue (${review.length})`}>
            {review.length === 0 ? <Empty>No one waiting on review.</Empty> : review.map((a) => (
              <Row key={a.id} title={a.playerName || '—'} sub={`${a.stream} · ${a.placedBand} · ${(a.reviewReasons || []).join(', ') || 'review'}`} />
            ))}
          </Panel>
          <Panel title={`Confirmed bookings (${booked.length})`}>
            {booked.length === 0 ? <Empty>No bookings yet.</Empty> : booked.map((a) => (
              <Row key={a.id} title={a.playerName || '—'} sub={`${a.stream} · ${a.placedBand} · ${CENTRE_BY_SLUG[a.centre]?.name ?? a.centre}`} />
            ))}
          </Panel>
        </div>
      </div>
    </div>
  );
}

const Panel = ({ title, children }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
    <h3 className="text-sm font-black uppercase tracking-widest text-white/70 mb-3">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);
const Row = ({ title, sub }) => (
  <div className="bg-white/5 rounded-lg px-3 py-2">
    <div className="text-sm font-bold">{title}</div>
    <div className="text-xs text-white/40">{sub}</div>
  </div>
);
const Empty = ({ children }) => <div className="text-sm text-white/30 py-2">{children}</div>;
