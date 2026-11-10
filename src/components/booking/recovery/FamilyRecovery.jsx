import React, { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { createFamilyPublicReader } from '../family-public-reader';
import { useFamilyService } from '../family-context';
import { creditDraftFields } from '../credit-client';
import { dayLabel, emptyDraft, FOCUS_LABELS, money, timeLabel, validDate } from '../booking-model';
import PlayerDetails from '../PlayerDetails';
import SlotPicker from '../SlotPicker';
import Turnstile from '../Turnstile';
import { recoveryError } from './recovery-client';
import './recovery.css';
const runRead = action => { void action().catch(() => {}); };

function Dates({ dates }) {
  return <ul className="booking-date-list">{dates.map(day => <li key={day.date}>{dayLabel(day.date)}, {timeLabel(day.starts_at)}–{timeLabel(day.ends_at)} Melbourne time</li>)}</ul>;
}
function CardLink({ href, disabled, children }) {
  return disabled ? <button className="booking-primary" type="button" disabled>{children}</button> : <a className="booking-primary" href={href} rel="noreferrer" referrerPolicy="no-referrer">{children}</a>;
}
function CurrentRequest({ current, busy, stale, onCheck }) {
  const request = current?.request;
  return <div className="booking-stack"><h3>Current fresh request</h3>
    <p>This is its current status. It is separate from the original submission receipt.</p>
    {request ? <><p>Status: <strong>{({ checkout: 'Awaiting card authorisation', requested: 'Awaiting the Academy', venue_told: 'Awaiting venue confirmation', confirmed: 'Confirmed', expired: 'Expired', declined: 'Declined', cancelled: 'Cancelled' })[request.state]}</strong></p><Dates dates={request.dates} />
      {request.checkout_state === 'ready' && request.checkout_url ? <CardLink href={request.checkout_url} disabled={busy || stale}>Continue the original card authorisation</CardLink> : request.state === 'checkout' ? <p>The original card page is {request.checkout_state === 'preparing' ? 'being prepared' : 'closed'}. Check its current status or contact the Academy.</p> : null}</> : <p>No accepted fresh request is linked to this expired request.</p>}
    <p className="booking-help">Returning from a card page does not confirm payment or a booking.</p>
    <button className="booking-secondary" type="button" disabled={busy} onClick={onCheck}>Check current fresh request</button>
  </div>;
}
function Balance({ value, busy, stale, onCheck }) {
  const text = { preparing: 'The Academy is preparing a secure payment option. No new payment has been submitted here.', ready: 'Pay this remaining balance once on the secure card page. This is a payment, not a new card hold.', paid: 'The booking service records this balance as paid.', expired: 'This payment page has expired. Contact the Academy for the current payment option.', review: 'The Academy needs to review this balance. Contact them before making another payment.' };
  const heading = value.state === 'paid' ? 'Recorded balance payment' : value.state === 'review' ? 'Balance under review' : 'Remaining balance';
  return <div className="booking-stack"><h3>{heading} · {money(value.amount_cents)}</h3><p>{text[value.state]}</p>
    {value.state === 'ready' ? <><p>Card page available until {dayLabel(value.expires_at)}, {timeLabel(value.expires_at)} Melbourne time.</p><CardLink href={value.checkout_url} disabled={busy || stale}>Pay {money(value.amount_cents)} remaining balance</CardLink></> : null}
    <p className="booking-help">Checking this page does not charge a card. A card-page return alone is not proof of payment.</p>
    <button className="booking-secondary" type="button" disabled={busy} onClick={onCheck}>Check remaining balance again</button>
  </div>;
}
const offeredTypes = (catalog, centre) => ['one_on_one', 'group'].filter(kind => catalog.coaches.some(coach => coach.centres.includes(centre) && coach.offers?.[kind] === true));
function sessionDefaults(catalog, centre) {
  const kind = offeredTypes(catalog, centre)[0] ?? '', group_size = kind === 'group' ? catalog.group_sizes[0] : null;
  return { centre, kind, group_size, players: Array.from({ length: kind === 'group' ? group_size : 1 }, () => ({ name: '', age: '' })), profile_id: '', starts_at: '' };
}
function FreshRequestForm({ operation, state, gate }) {
  const [catalog, setCatalog] = useState(null), [catalogError, setCatalogError] = useState('');
  const reader = useMemo(() => createFamilyPublicReader(gate), [gate]);
  useEffect(() => {
    const controller = new AbortController(); let alive = true;
    reader.catalog(controller.signal).then(data => { if (alive) setCatalog(data); }).catch(error => { if (alive && error.name !== 'AbortError') setCatalogError(recoveryError(error)); });
    return () => { alive = false; controller.abort(); };
  }, [reader]);
  if (!catalog) return <p role={catalogError ? 'alert' : 'status'}>{catalogError || 'Checking new booking options…'}</p>;
  if (!catalog.centres.length) return <p>No centres are currently taking fresh private requests. Contact the Academy for help.</p>;
  return <FreshRequestOptions operation={operation} state={state} gate={gate} catalog={catalog} reader={reader} />;
}
function FreshRequestOptions({ operation, state, gate, catalog, reader }) {
  const [draft, setDraft] = useState(() => ({ ...emptyDraft(), ...sessionDefaults(catalog, catalog.centres[0].slug), duration_minutes: catalog.durations_minutes[0], focus: catalog.focus[0] }));
  const [step, setStep] = useState('settings'), [skipText, setSkipText] = useState('');
  const [confirmed, setConfirmed] = useState(false), [token, setToken] = useState(''), [reset, setReset] = useState(0), [formError, setFormError] = useState('');
  const change = useCallback(patch => {
    if (operation.locked()) return;
    operation.invalidate(); setConfirmed(false); setToken(''); setReset(n => n + 1); setFormError('');
    setDraft(previous => ({ ...previous, ...patch, consent_save_card: false }));
  }, [operation]);
  const select = useCallback((profile_id, starts_at) => { change({ profile_id, starts_at }); setStep('details'); }, [change]);
  const noHint = useCallback(() => {}, []);
  const busy = state.busy || gate.getSnapshot().paused;
  async function review() {
    setFormError(''); setConfirmed(false); setToken(''); setReset(n => n + 1); setDraft(previous => ({ ...previous, consent_save_card: false }));
    try { await operation.quote(creditDraftFields({ ...draft, consent_save_card: false })); }
    catch (error) { setFormError(recoveryError(error)); }
  }
  async function submit() {
    setFormError('');
    try { await operation.accept(creditDraftFields(draft), confirmed, token); }
    catch (error) { setFormError(recoveryError(error)); }
  }
  return <div className="booking-stack"><h3>A fresh request after an expired hold</h3>
    <p>The old request stays expired. Choose current availability and re-enter the same players linked to your secure page. A new quote and new card permission are required.</p>
    {step === 'settings' ? <fieldset className="booking-fields" disabled={busy}><legend>New booking options</legend>
      <label>Centre<select value={draft.centre} onChange={e => change(sessionDefaults(catalog, e.target.value))}>{catalog.centres.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>
      <label>Session type<select value={draft.kind} onChange={e => { const kind = e.target.value, size = kind === 'group' ? catalog.group_sizes[0] : 1; change({ kind, group_size: kind === 'group' ? size : null, players: Array.from({ length: size }, () => ({ name: '', age: '' })) }); }}>{offeredTypes(catalog, draft.centre).map(kind => <option key={kind} value={kind}>{kind === 'one_on_one' ? 'One player' : 'Group'}</option>)}</select></label>
      {!draft.kind ? <p>No coaches currently offer fresh private requests at this centre. Try another centre or contact the Academy.</p> : null}
      {draft.kind === 'group' ? <label>Players<select value={draft.group_size} onChange={e => { const size = Number(e.target.value); change({ group_size: size, players: Array.from({ length: size }, (_, i) => draft.players[i] ?? { name: '', age: '' }) }); }}>{catalog.group_sizes.map(size => <option key={size} value={size}>{size} players</option>)}</select></label> : null}
      <label>Focus<select value={draft.focus} onChange={e => change({ focus: e.target.value })}>{catalog.focus.map(f => <option key={f} value={f}>{FOCUS_LABELS[f]}</option>)}</select></label>
      {draft.focus === 'batting' ? <label>Bowling machine<select value={draft.machine} onChange={e => change({ machine: e.target.value })}><option value="either">Either</option><option value="yes">Yes</option><option value="no">No</option></select></label> : null}
      <label>Session length<select value={draft.duration_minutes} onChange={e => change({ duration_minutes: Number(e.target.value) })}>{catalog.durations_minutes.map(n => <option key={n} value={n}>{n} minutes</option>)}</select></label>
      <label>Weekly sessions<input type="number" min="1" max={catalog.max_weeks} value={draft.weeks} onChange={e => change({ weeks: Number(e.target.value) })} /></label>
      <label>Skip dates (optional, YYYY-MM-DD separated by commas)<input value={skipText} onChange={e => { setSkipText(e.target.value); change({ skip_dates: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }); }} /></label>
      <button className="booking-primary" type="button" disabled={!draft.kind || !Number.isInteger(draft.weeks) || draft.weeks < 1 || draft.weeks > catalog.max_weeks || !draft.skip_dates.every(validDate) || new Set(draft.skip_dates).size !== draft.skip_dates.length} onClick={() => setStep('slots')}>Find a new time</button>
    </fieldset> : <><p>{catalog.centres.find(c => c.slug === draft.centre)?.name} · {FOCUS_LABELS[draft.focus]} · {draft.duration_minutes} minutes · {draft.weeks} weekly sessions</p><button className="booking-link" type="button" disabled={busy} onClick={() => { change({ profile_id: '', starts_at: '' }); setStep('settings'); }}>Change new booking options</button></>}
    {step === 'slots' ? <SlotPicker draft={draft} catalog={catalog} hint={null} onSelect={select} onDropHint={noHint} pending={busy} readClient={reader} errorMessage={recoveryError} /> : null}
    {step === 'details' ? <><p>Selected start: {dayLabel(draft.starts_at)}, {timeLabel(draft.starts_at)} Melbourne time.</p><fieldset className="booking-fields" disabled={busy} aria-label="Fresh player and contact details"><PlayerDetails draft={draft} coachSlug={catalog.coaches.find(c => c.profile_id === draft.profile_id)?.slug} onChange={change} onContinue={review} error={formError} /></fieldset></> : null}
    {state.quote ? <section className="booking-notice booking-stack" aria-label="Fresh booking quote"><h3>Review the new request</h3><Dates dates={state.quote.dates} />
      <dl><div><dt>Per session</dt><dd>{money(state.quote.price.per_session_cents)}</dd></div><div><dt>First-session card hold</dt><dd>{money(state.quote.price.first_session_hold_cents)}</dd></div><div><dt>Remaining block payment</dt><dd>{money(state.quote.price.rest_cents)}</dd></div><div><dt>Total including GST</dt><dd>{money(state.quote.price.total_cents)}</dd></div></dl>
      <p>This quote does not reserve a session. The Academy still needs to confirm the venue. No player credit is applied.</p>
      <p className="booking-help">Current review expires at {timeLabel(state.quote.expires_at)} Melbourne time. Availability and the deadline are checked again when you submit.</p>
      {state.quote.decision_quote ? <p>The current venue decision deadline is {dayLabel(state.quote.decision_quote.confirm_by)}, {timeLabel(state.quote.decision_quote.confirm_by)} Melbourne time.</p> : null}
      <label className="booking-check"><input type="checkbox" checked={confirmed} disabled={busy} onChange={e => setConfirmed(e.target.checked)} />I confirm the players, contact details, dates and price for this new request.</label>
      <label className="booking-check"><input type="checkbox" checked={draft.consent_save_card} disabled={busy} onChange={e => setDraft(previous => ({ ...previous, consent_save_card: e.target.checked }))} />I agree to authorise the first-session hold and save my card for the remaining block payment after the venue is confirmed.</label>
      <Turnstile onToken={setToken} reset={reset} />
      <button className="booking-primary" type="button" disabled={busy || !confirmed || !draft.consent_save_card || !token} onClick={submit}>Submit this fresh request</button>
    </section> : null}
    {formError && step !== 'details' ? <p className="booking-error" role="alert">{formError}</p> : null}
  </div>;
}

/** Mounted in the existing capability-protected management page. No URL carries an intent. */
export default function FamilyRecovery() {
  const { recovery: operation, gate } = useFamilyService();
  const state = useSyncExternalStore(operation.subscribe, operation.getSnapshot, operation.getSnapshot);
  const visit = useSyncExternalStore(gate.subscribe, gate.getSnapshot, gate.getSnapshot);
  if (!state.selected) return null;
  const disabled = state.busy || visit.paused;
  return <section className="booking-card booking-stack booking-recovery ph-no-capture" aria-label="Secure booking recovery">
    <h2>{state.mode === 'remaining' ? 'Check a remaining payment' : 'Fresh booking after an expired hold'}</h2>
    {state.error ? <p className="booking-error" role="alert">{recoveryError({ code: state.error })}</p> : null}
    {state.busy ? <p role="status">{state.phase === 'unknown' ? 'Submitting and checking the original receipt…' : 'Checking the booking service…'}</p> : null}
    {state.phase === 'unknown' ? <div className="booking-notice"><h3>Original submission not confirmed</h3><p>Keep this page open. The original fields and submission number are retained privately. Read that receipt before editing or making another request.</p><button className="booking-primary" type="button" disabled={disabled} onClick={() => runRead(() => operation.readOriginal())}>Read original fresh-request receipt</button></div> : null}
    {state.balance ? <Balance value={state.balance} busy={disabled} stale={Boolean(state.error)} onCheck={() => runRead(() => operation.inspect(state.selected, 'remaining'))} /> : null}
    {['draft', 'quoted'].includes(state.phase) ? <FreshRequestForm key={state.selected} operation={operation} state={state} gate={gate} /> : null}
    {state.phase === 'receipt' ? <div className="booking-notice booking-stack"><h3>Original fresh-request receipt</h3>
      <p>{state.receipt.receipt.outcome === 'accepted' ? 'Your fresh request was saved. The old request remains expired. Check the current request to continue its original card authorisation.' : state.receipt.receipt.outcome === 'needs_review' ? 'The Academy needs to review the player or contact match. No new booking request or card hold was created.' : 'These sessions were unavailable. No new request was saved under this submission.'}</p>
      {state.receipt.receipt.outcome === 'accepted' ? <button className="booking-primary" type="button" disabled={disabled} onClick={() => runRead(() => operation.current())}>Check current fresh request</button> : state.receipt.receipt.outcome === 'unavailable' ? <button className="booking-secondary" type="button" disabled={disabled} onClick={() => runRead(() => operation.inspect(state.selected, 'fresh'))}>Start a new review</button> : null}
    </div> : null}
    {state.phase === 'current' ? <CurrentRequest current={state.current} busy={disabled} stale={Boolean(state.error)} onCheck={() => runRead(() => operation.current())} /> : null}
    <button className="booking-secondary" type="button" disabled={disabled || operation.locked()} onClick={() => operation.close()}>Close this option</button>
  </section>;
}
