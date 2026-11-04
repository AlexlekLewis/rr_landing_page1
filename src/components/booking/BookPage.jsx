import React, { useCallback, useEffect, useRef, useState } from 'react';
import { deepLink, dayLabel, emptyDraft, FOCUS_LABELS, lengthLabel, localDate, matchingSlot, money, playerProblem, recoveredIntent, requestIntent, searchIntent, timeLabel } from './booking-model';
import { createPublicClient, publicError } from './public-client';
import { clearDraft, readAttempt, readDraft, requestCheckpoint, writeAttempt, writeDraft } from './private-draft';
import AskUs from './AskUs';
import AskUsDialog from './AskUsDialog';
import BookingStatus from './BookingStatus';
import BookingReview from './BookingReview';
import PlayerDetails from './PlayerDetails';
import SeriesDates from './SeriesDates';
import SlotPicker from './SlotPicker';
import Turnstile from './Turnstile';
import './booking.css';
const titles = { where: 'Where would you like to train?', kind: 'Who’s the session for?', group: 'How many players?', focus: 'What do you want to work on?', machine: 'Use a bowling machine?', duration: 'How long would you like?', find: 'Find your time', weeks: 'How many weeks?', players: 'Who’s playing?', review: 'Check and request', recover: 'Recover your previous attempt' };
const back = d => ({ kind: 'where', group: 'kind', focus: d.kind === 'group' ? 'group' : 'kind', machine: 'focus', duration: d.focus === 'batting' ? 'machine' : 'focus', find: 'duration', weeks: 'find', players: 'weeks', review: 'players', recover: 'find' });
const firstStep = d => !d.centre ? 'where' : !d.kind ? 'kind' : d.kind === 'group' && !d.group_size ? 'group' : !d.focus ? 'focus' : !d.duration_minutes ? 'duration' : 'find';
const quoteKey = d => JSON.stringify([d.centre, d.profile_id, d.starts_at, d.kind, d.group_size, d.focus, d.machine, d.duration_minutes, d.weeks, d.skip_dates]);
export default function BookPage() {
  const [saved] = useState(() => readDraft()), [initialCheckpoint] = useState(() => requestCheckpoint()), [initialAttempt] = useState(() => readAttempt('request'));
  const [catalog, setCatalog] = useState(null), [catalogError, setCatalogError] = useState(''), [reload, setReload] = useState(0);
  const [draft, setDraft] = useState(() => saved ?? emptyDraft()), [step, setStep] = useState(initialCheckpoint ? 'status' : 'where'), [hint, setHint] = useState('');
  const [hasAttempt, setHasAttempt] = useState(() => Boolean(recoveredIntent(initialAttempt)));
  const [nearest, setNearest] = useState([]);
  const [quote, setQuote] = useState(null), [error, setError] = useState(''), [pending, setPending] = useState(false), [ask, setAsk] = useState(false);
  const [token, setToken] = useState(''), [widgetReset, setWidgetReset] = useState(0), [receipt, setReceipt] = useState(null), [checkpoint, setCheckpoint] = useState(initialCheckpoint);
  const attempt = useRef(initialAttempt), active = useRef(true), initialized = useRef(false), heading = useRef(null);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  useEffect(() => {
    let live = true; const controller = new AbortController();
    createPublicClient().catalog(controller.signal).then(data => {
      if (!live) return; setCatalog(data); setCatalogError(''); if (initialized.current) return; initialized.current = true;
      const hints = deepLink(globalThis.location.search, data), hasLink = ['centre', 'coach', 'start', 'duration', 'focus', 'kind', 'group_size', 'goals'].some(key => new URLSearchParams(globalThis.location.search).has(key));
      const next = { ...(hasLink ? emptyDraft() : saved ?? emptyDraft()), ...(hasLink ? hints : {}), consent_save_card: false };
      if (!data.centres.some(c => c.slug === next.centre)) next.centre = '';
      if (!data.coaches.some(c => c.profile_id === next.profile_id && (!next.centre || c.centres.includes(next.centre)))) { next.profile_id = ''; next.starts_at = ''; }
      if (!data.durations_minutes.includes(next.duration_minutes)) next.duration_minutes = null;
      if (!data.focus.includes(next.focus)) next.focus = '';
      if (!data.group_sizes.includes(next.group_size)) next.group_size = null;
      next.weeks = Math.min(next.weeks, data.max_weeks);
      setDraft(next); setHint(hasLink ? hints.start_hint ?? '' : '');
      if (!initialCheckpoint) setStep(firstStep(next));
    }).catch(problem => { if (live && problem.name !== 'AbortError') setCatalogError(publicError(problem)); });
    return () => { live = false; controller.abort(); };
  }, [reload, saved, initialCheckpoint]);
  useEffect(() => { if (catalog) writeDraft(draft); }, [catalog, draft]);
  useEffect(() => { heading.current?.focus(); }, [step]);
  const closeAsk = useCallback(() => setAsk(false), []);
  const update = useCallback(fields => { setDraft(d => ({ ...d, ...fields })); setError(''); }, []);
  const choose = (fields, next) => { update({ ...fields, starts_at: '', profile_id: fields.centre && fields.centre !== draft.centre ? '' : draft.profile_id, skip_dates: [], consent_save_card: false }); setQuote(null); setStep(next); };
  const dropHint = useCallback(() => setHint(''), []);
  const selectSlot = useCallback(async (profile, startsAt) => {
    if (!catalog) return;
    setPending(true); setError(''); setNearest([]);
    const next = { ...draft, profile_id: profile, starts_at: startsAt, skip_dates: [], consent_save_card: false };
    try {
      const data = await createPublicClient().slots(searchIntent(next, localDate(startsAt), localDate(startsAt), { coach: profile }));
      if (!active.current) return;
      const selected = matchingSlot(data, next);
      if (!selected) { setError('That time has just been taken. Choose another time at this centre.'); setStep('find'); return; }
      setDraft(next); setQuote({ key: quoteKey(next), slot: selected }); setStep('weeks');
    } catch (problem) { if (active.current) setError(publicError(problem)); }
    finally { if (active.current) setPending(false); }
  }, [catalog, draft]);
  const currentKey = quoteKey(draft), slot = quote?.key === currentKey ? quote.slot : null;
  useEffect(() => {
    if (step !== 'weeks' || !draft.starts_at || !draft.profile_id) return;
    let live = true; const controller = new AbortController();
    const timer = setTimeout(() => {
      createPublicClient().slots(searchIntent(draft, localDate(draft.starts_at), localDate(draft.starts_at), { coach: draft.profile_id }), controller.signal).then(data => {
        if (!live) return; const selected = matchingSlot(data, draft);
        if (selected) { setQuote({ key: currentKey, slot: selected }); setError(''); }
        else { setError('That time is no longer available. Choose another start at this centre.'); setStep('find'); }
      }).catch(problem => { if (live && problem.name !== 'AbortError') setError(publicError(problem)); });
    }, 350);
    return () => { live = false; clearTimeout(timer); controller.abort(); };
  }, [step, currentKey, draft]);
  async function review() {
    const problem = playerProblem(draft); if (problem) { setError(problem); return; }
    setPending(true); setError('');
    try {
      const result = await createPublicClient().slots(searchIntent(draft, localDate(draft.starts_at), localDate(draft.starts_at), { coach: draft.profile_id }));
      if (!active.current) return; const fresh = matchingSlot(result, draft);
      if (!fresh?.series_check.ready) { setError('One or more dates changed. Check the dates again before requesting.'); setStep('weeks'); return; }
      if (!fresh.decision_quote) { setError('The confirmation deadline is unavailable. Check the dates again before requesting.'); return; }
      setQuote({ key: currentKey, slot: fresh }); setStep('review');
    } catch (problem) { if (active.current) setError(publicError(problem)); }
    finally { if (active.current) setPending(false); }
  }
  const accept = useCallback(result => {
    if (result.request_token) { const savedCheckpoint = { request_id: result.request_id, request_token: result.request_token }; requestCheckpoint(savedCheckpoint); setCheckpoint(savedCheckpoint); }
    setReceipt(result); writeAttempt('request', null); attempt.current = null; setHasAttempt(false); setStep('status'); setError('');
  }, []);
  async function reserve(recover = false) {
    if (!token || pending) return;
    setPending(true); setError('');
    try {
      let intent = recover ? recoveredIntent(attempt.current) : slot?.decision_quote ? requestIntent(draft, slot) : null;
      if (!intent) { setError('Check the dates, player details and card permission before continuing.'); return; }
      const payload = JSON.stringify(intent), retry = attempt.current?.payload === payload;
      if (!recover && !retry) {
        const result = await createPublicClient().slots(searchIntent(draft, localDate(draft.starts_at), localDate(draft.starts_at), { coach: draft.profile_id }));
        const fresh = matchingSlot(result, draft);
        if (!active.current) return;
        if (!fresh?.series_check.ready) { setError('That time has changed. Choose another start at this centre.'); setStep('find'); return; }
        if (!fresh.decision_quote || fresh.decision_quote.kind !== slot.decision_quote.kind || Date.parse(fresh.decision_quote.confirm_by) < Date.parse(slot.decision_quote.confirm_by)) {
          setQuote({ key: currentKey, slot: fresh }); update({ consent_save_card: false }); setError('The confirmation deadline changed or is unavailable. Review it and give card permission again.'); return;
        }
        if (JSON.stringify(fresh.price) !== JSON.stringify(slot.price) || JSON.stringify(fresh.series_check.dates) !== JSON.stringify(slot.series_check.dates)) { setQuote({ key: currentKey, slot: fresh }); update({ consent_save_card: false }); setError('The dates or quote changed at the final check. Review them and give card permission again.'); return; }
        intent = requestIntent(draft, fresh);
      }
      if (!retry) { attempt.current = { nonce: crypto.randomUUID(), payload: JSON.stringify(intent) }; writeAttempt('request', attempt.current); setHasAttempt(true); }
      const result = await createPublicClient().reserve(intent, token, attempt.current.nonce);
      if (active.current) accept(result);
    } catch (problem) { if (active.current) { setError(publicError(problem)); if (problem.code === 'slot_taken') { setNearest(problem.nearest ?? []); setStep('find'); } } }
    finally { if (active.current) { setPending(false); setToken(''); setWidgetReset(n => n + 1); } }
  }
  const centre = catalog?.centres.find(c => c.slug === draft.centre), coach = catalog?.coaches.find(c => c.profile_id === draft.profile_id);
  const newRequest = useCallback(() => { requestCheckpoint(null); clearDraft(); writeAttempt('request', null); attempt.current = null; setHasAttempt(false); setCheckpoint(null); setReceipt(null); setDraft(emptyDraft()); setQuote(null); setStep('where'); setError(''); }, []);
  return <div className="private-booking ph-no-capture"><header className="booking-top"><a href="/" aria-label="Rajasthan Royals Academy Melbourne home"><img src="/assets/MELBOURNE_OFFICIAL.png" alt="Rajasthan Royals Academy Melbourne" /></a><a href="#ask-private-coaching" onClick={e => { e.preventDefault(); setAsk(true); }}>Ask us instead</a></header><main className="booking-wrap"><section className="booking-card">
    {step === 'status' ? <BookingStatus initial={receipt} checkpoint={checkpoint} onNew={newRequest} /> : <>
      <div className="booking-step-back">{step === 'where' ? <a href="/" className="booking-link">← Back to the Academy</a> : <button type="button" className="booking-link" disabled={pending} onClick={() => { setStep(back(draft)[step] ?? 'where'); setError(''); }}>← Back</button>}</div>
      <p className="booking-kicker">Private coaching · Melbourne</p><h1 ref={heading} tabIndex={-1}>{titles[step]}</h1>
      {centre && step !== 'where' ? <p className="booking-help booking-progress">{centre.name}{draft.duration_minutes ? ` · ${lengthLabel(draft.duration_minutes)}` : ''}{coach && ['weeks', 'players', 'review'].includes(step) ? ` · ${coach.display_name}` : ''}</p> : null}
      {!catalog ? <div className="booking-stack">{catalogError ? <><p className="booking-error" role="alert">{catalogError}</p><button type="button" className="booking-secondary" onClick={() => setReload(n => n + 1)}>Try the live service again</button></> : <p role="status">Loading live coaching options…</p>}</div> : <>
        {hasAttempt && step !== 'recover' ? <div className="booking-notice"><p>A previous attempt may have reached us. Recover it before starting another card hold.</p><button type="button" className="booking-link" onClick={() => setStep('recover')}>Recover my previous attempt</button></div> : null}
        {step === 'where' ? <div className="booking-grid">{catalog.centres.map(c => <button className="booking-choice" type="button" key={c.slug} onClick={() => choose({ centre: c.slug, kind: '' }, 'kind')}><strong>{c.suburb}</strong><small>{c.name}</small><small>{c.address ?? 'Address is being checked. Ask us if you need directions.'}</small></button>)}{!catalog.centres.length ? <p role="status">New private requests aren’t open at either centre right now. You can still ask us below.</p> : null}</div> : null}
        {step === 'kind' ? <div className="booking-grid"><button type="button" className="booking-choice" onClick={() => choose({ kind: 'one_on_one', group_size: null, players: [draft.players[0]] }, 'focus')}><strong>One-on-one</strong><small>One player, one coach.</small></button><button type="button" className="booking-choice" onClick={() => choose({ kind: 'group', group_size: null }, 'group')}><strong>A small group</strong><small>Train together with one coach.</small></button></div> : null}
        {step === 'group' ? <div className="booking-grid">{catalog.group_sizes.map(size => <button type="button" className="booking-choice" key={size} onClick={() => choose({ group_size: size, players: Array.from({ length: size }, (_, index) => draft.players[index] ?? { name: '', age: '' }) }, 'focus')}><strong>{size} players</strong><small>{catalog.prices.group_player_hour_cents[size] === null ? 'Price unavailable' : `${money(catalog.prices.group_player_hour_cents[size])} per player per hour, incl. GST`}</small></button>)}</div> : null}
        {step === 'focus' ? <div className="booking-grid">{catalog.focus.map(focus => <button type="button" className="booking-choice" key={focus} onClick={() => choose({ focus, machine: 'either' }, focus === 'batting' ? 'machine' : 'duration')}>{FOCUS_LABELS[focus]}</button>)}</div> : null}
        {step === 'machine' ? <div className="booking-grid">{[['yes', 'Yes, use a machine'], ['no', 'No machine'], ['either', 'Let the coach decide']].map(([machine, label]) => <button type="button" className="booking-choice" key={machine} onClick={() => choose({ machine }, 'duration')}>{label}</button>)}</div> : null}
        {step === 'duration' ? <div className="booking-grid">{catalog.durations_minutes.map(duration => { const rate = draft.kind === 'group' ? catalog.prices.group_player_hour_cents[draft.group_size] : catalog.prices.one_on_one_hour_cents; return <button type="button" className="booking-choice" disabled={rate === null} key={duration} onClick={() => choose({ duration_minutes: duration }, 'find')}><strong>{lengthLabel(duration)}</strong><small>{rate === null ? 'Price unavailable' : `${money(Math.round(rate * duration / 60))}${draft.kind === 'group' ? ' per player' : ''}, incl. GST before any block discount`}</small></button>; })}</div> : null}
        {nearest.length && step === 'find' ? <div className="booking-notice"><h2>Other times at this centre</h2><div className="booking-times">{nearest.map(a => <button className="booking-secondary" type="button" key={a.profile_id + a.starts_at} disabled={pending} onClick={() => selectSlot(a.profile_id, a.starts_at)}>{dayLabel(a.starts_at)}, {timeLabel(a.starts_at)}</button>)}</div></div> : null}
        {step === 'find' ? <SlotPicker draft={draft} catalog={catalog} hint={hint} onDropHint={dropHint} onSelect={selectSlot} pending={pending} /> : null}
        {step === 'weeks' ? <div className="booking-stack"><p>{catalog.block_discount.percent}% off every session when {catalog.block_discount.min_sessions} or more actual sessions are requested together.</p><label className="booking-field">Number of weeks<select value={draft.weeks} onChange={e => update({ weeks: Number(e.target.value), consent_save_card: false })}>{Array.from({ length: catalog.max_weeks }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1} week{i ? 's' : ''}</option>)}</select></label>{slot ? <><SeriesDates slot={slot} draft={draft} onSkip={date => update({ skip_dates: draft.skip_dates.includes(date) ? draft.skip_dates.filter(d => d !== date) : [...draft.skip_dates, date], consent_save_card: false })} onAlternative={a => selectSlot(a.profile_id, a.starts_at)} onAdd={draft.weeks < catalog.max_weeks ? () => update({ weeks: draft.weeks + 1, consent_save_card: false }) : undefined} /><button type="button" className="booking-primary" disabled={!slot.series_check.ready || pending} onClick={() => setStep('players')}>Continue with {slot.price.sessions} session{slot.price.sessions === 1 ? '' : 's'}</button></> : <p role="status">Checking every date and the block quote…</p>}</div> : null}
        {step === 'players' ? <PlayerDetails draft={draft} coachSlug={coach?.slug} onChange={update} onContinue={review} error={error} /> : null}
        {step === 'review' && slot ? <BookingReview slot={slot} draft={draft} catalog={catalog} coach={coach} centre={centre} pending={pending} token={token} widgetReset={widgetReset} onConsent={checked => update({ consent_save_card: checked })} onToken={setToken} onReserve={() => reserve(false)} /> : null}
        {step === 'recover' ? <div className="booking-stack"><p>We’ll retry the exact same attempt. This checks whether it landed and does not create a second request with a new reference.</p><Turnstile onToken={setToken} reset={widgetReset} /><button type="button" className="booking-primary" disabled={pending || !token || !hasAttempt} onClick={() => reserve(true)}>{pending ? 'Recovering…' : 'Recover my attempt'}</button></div> : null}
      </>}
      {error && step !== 'players' ? <p className="booking-error" role="alert">{error}</p> : null}
    </>}
    <div className="booking-bottom"><button className="booking-link" type="button" onClick={() => setAsk(true)}>Not sure? Ask us instead →</button></div>
  </section></main><footer className="booking-footer"><span>Your form answers stay in this tab for up to two hours.</span><button className="booking-link" type="button" onClick={() => { clearDraft(); if (step !== 'status') { setDraft(emptyDraft()); setQuote(null); setStep('where'); } }}>Clear saved form answers</button><a href="/privacy-policy">Privacy policy</a></footer>{ask ? <AskUsDialog onClose={closeAsk}><AskUs centre={draft.centre} coachProfileId={draft.profile_id} sourcePage={draft.source_page} onClose={closeAsk} /></AskUsDialog> : null}</div>;
}
