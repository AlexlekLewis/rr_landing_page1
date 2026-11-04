import React, { useEffect, useMemo, useState } from 'react';
import { addDays, dayLabel, FOCUS_LABELS, localDate, localStart, money, searchIntent, slotAccessibleLabel, timeLabel } from './booking-model';
import { createPublicClient, publicError } from './public-client';
import CoachName from './CoachName';
export default function SlotPicker({ draft, catalog, hint, onSelect, onDropHint, pending, readClient, errorMessage = publicError }) {
  const client = useMemo(() => readClient ?? createPublicClient(), [readClient]);
  const [from, setFrom] = useState(() => hint?.slice(0, 10) || (draft.starts_at ? localDate(draft.starts_at) : localDate(new Date().toISOString())));
  const [mode, setMode] = useState(draft.profile_id ? 'coach' : 'time'), [coachId, setCoachId] = useState(draft.profile_id), [start, setStart] = useState('');
  const [notice, setNotice] = useState('');
  const [queryState, setQueryState] = useState({ data: null, error: '', loading: true }), [reload, setReload] = useState(0);
  const query = useMemo(() => searchIntent(draft, from, addDays(from, 6), { weeks: 1, skip_dates: [] }), [draft, from]);
  useEffect(() => {
    let active = true; const controller = new AbortController();
    client.slots(query, controller.signal).then(data => {
      if (!active) return;
      if (!data.by_coach.length && localDate(data.window.earliest) > query.to && !hint) { setFrom(localDate(data.window.earliest)); return; }
      setQueryState({ data, error: '', loading: false });
      if (hint) {
        const coach = data.by_coach.find(c => c.profile_id === draft.profile_id), found = coach?.slots.find(s => localStart(s.starts_at) === hint);
        onDropHint();
        if (found) void onSelect(coach.profile_id, found.starts_at);
        else { setNotice('That preview time is no longer available. Choose another free time at this centre.'); if (query.to < localDate(data.window.earliest)) { setQueryState({ data: null, error: '', loading: true }); setFrom(localDate(data.window.earliest)); } }
      }
    }).catch(error => { if (active && error.name !== 'AbortError') setQueryState({ data: null, error: errorMessage(error), loading: false }); });
    return () => { active = false; controller.abort(); };
  }, [query, reload, hint, draft.profile_id, onSelect, onDropHint, client, errorMessage]);
  const current = queryState.data, choices = (current?.by_coach ?? []).filter(c => c.slots.length);
  const coachSlug = profile => catalog.coaches.find(coach => coach.profile_id === profile)?.slug;
  const selected = choices.find(c => c.profile_id === coachId);
  const coachCount = time => new Set((mode === 'coach' && selected ? [selected] : choices).filter(coach => coach.slots.some(slot => slot.starts_at === time)).map(coach => coach.profile_id)).size;
  const starts = [...new Set((mode === 'coach' && selected ? selected.slots : choices.flatMap(c => c.slots)).map(s => s.starts_at))].sort();
  const groups = Object.groupBy(starts, localDate);
  const changeWeek = offset => { setFrom(addDays(from, offset)); setStart(''); setNotice(''); setQueryState({ data: null, error: '', loading: true }); };
  const select = (profile, time) => { setNotice(''); return onSelect(profile, time); };
  return <div className="booking-stack">
    <p className="booking-help">{FOCUS_LABELS[draft.focus]} · All times Melbourne time. Every time is checked live.</p>
    {notice ? <p className="booking-notice" role="alert">{notice}</p> : null}
    <div className="booking-tabs" role="tablist" aria-label="Find a time or coach">{[['time', 'Pick a time'], ['coach', 'Pick a coach']].map(([key, label]) => <button key={key} type="button" role="tab" aria-selected={mode === key} onClick={() => { setMode(key); setStart(''); setNotice(''); }}>{label}</button>)}</div>
    <div className="booking-row"><button className="booking-secondary" type="button" onClick={() => changeWeek(-7)} disabled={pending || from <= localDate(new Date().toISOString())}>← Previous week</button><strong>{dayLabel(from)} – {dayLabel(addDays(from, 6))}</strong><button className="booking-secondary" type="button" onClick={() => changeWeek(7)} disabled={pending || Boolean(current && addDays(from, 7) >= localDate(current.window.before))}>Next week →</button></div>
    {queryState.error ? <div className="booking-error" role="alert"><p>{queryState.error}</p><button type="button" className="booking-link" disabled={pending} onClick={() => { setQueryState({ data: null, error: '', loading: true }); setReload(n => n + 1); }}>Check again</button></div> : null}
    {queryState.loading ? <p role="status">Checking free times…</p> : !choices.length ? <div className="booking-empty"><h3>No free times in this week</h3><p>Try the next week, change what you’re looking for, or ask us below.</p></div> : <>
      {mode === 'coach' && !selected ? <div className="booking-grid">{choices.map(c => <button className="booking-choice" type="button" key={c.profile_id} onClick={() => setCoachId(c.profile_id)}><CoachName coach={c} slug={coachSlug(c.profile_id)} /><small>{c.coaches_what.map(key => FOCUS_LABELS[key]).join(' · ')}</small><small>{c.home_centre === draft.centre ? 'Home centre · ' : ''}Next free: {dayLabel(c.slots[0].starts_at)}, {timeLabel(c.slots[0].starts_at)}</small><small>{money(c.slots[0].price.total_cents)} incl. GST{draft.kind === 'group' ? ' for the group' : ''} · one session</small></button>)}</div> : <>
        {mode === 'coach' ? <div><CoachName coach={selected} slug={coachSlug(selected.profile_id)} /><button className="booking-link" type="button" onClick={() => setCoachId('')}>Choose a different coach</button></div> : null}
        {start && mode === 'time' ? <div className="booking-stack"><div><h3>{dayLabel(start)}, {timeLabel(start)}</h3><button type="button" className="booking-link" onClick={() => setStart('')}>Choose a different time</button></div><div className="booking-grid">{choices.filter(c => c.slots.some(s => s.starts_at === start)).map(c => { const slot = c.slots.find(s => s.starts_at === start); return <button className="booking-choice" type="button" disabled={pending} key={c.profile_id} onClick={() => select(c.profile_id, start)}><CoachName coach={c} slug={coachSlug(c.profile_id)} /><small>{c.coaches_what.map(key => FOCUS_LABELS[key]).join(' · ')}</small><small>{money(slot.price.total_cents)} incl. GST{draft.kind === 'group' ? ' for the group' : ''} · Choose →</small></button>; })}</div></div> : <div>{Object.entries(groups).map(([date, times]) => <section key={date} className="booking-day"><h3>{dayLabel(date)}</h3><div className="booking-times">{times.map(time => <button type="button" className="booking-time" aria-label={slotAccessibleLabel(time, coachCount(time))} key={time} disabled={pending} onClick={() => mode === 'time' ? setStart(time) : select(selected.profile_id, time)}>{timeLabel(time)}</button>)}</div></section>)}</div>}
      </>}
    </>}
    {catalog.coaches.length === 0 ? <p>No coaches are taking new private requests at the moment.</p> : null}
  </div>;
}
