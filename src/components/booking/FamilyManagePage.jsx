import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { dayLabel, money, timeLabel } from './booking-model';
import { familyError } from './family-client';
import { useFamilyService } from './family-context';
import { trackPrivateBooking } from './private-booking-pixel';
import './booking.css';
const FamilyRecovery = React.lazy(() => import('./recovery/FamilyRecovery'));

const dateTime = value => `${dayLabel(value)}, ${timeLabel(value)}`;
const outcomeLabels = { credit: 'Credit for the player', refund: 'Refund to the original card', move: 'Arrange a new time' };
const allowedOutcome = (item, choice) => choice === 'credit' || choice === 'move' || (choice === 'refund' && item.can_request_card_refund === true);
const noSubscribe = () => () => {};
const noRecovery = () => null;

function CancellationTerms({ preview, working, onClose, onConfirm }) {
  const [accepted, setAccepted] = useState(false), heading = useRef(null);
  useEffect(() => { heading.current?.focus(); }, []);
  return <section className="booking-notice booking-stack" aria-label="Cancellation terms">
    <h2 tabIndex={-1} ref={heading}>Check this cancellation</h2>
    <p>Free cancellation until {dateTime(preview.cancel_free_until)} Melbourne time.</p>
    <dl className="booking-stack">
      <div><dt>Cancellation fee</dt><dd>{money(preview.fee_cents)}</dd></div>
      <div><dt>Prepaid value becoming player credit</dt><dd>{money(preview.credit_cents)}</dd></div>
      {preview.fee_owing_cents > 0 ? <div><dt>Fee still owing</dt><dd>{money(preview.fee_owing_cents)}</dd></div> : null}
    </dl>
    <p>The prepaid value left after the fee becomes credit for the players. The terms are checked again when you confirm.</p>
    {preview.fee_cents > 0 ? <label className="booking-check"><input type="checkbox" checked={accepted} disabled={working} onChange={event => setAccepted(event.target.checked)} />I accept the {money(preview.fee_cents)} cancellation fee.</label> : null}
    <div className="booking-row">
      <button type="button" className="booking-primary" disabled={working || (preview.fee_cents > 0 && !accepted)} onClick={() => onConfirm(preview, accepted)}>Confirm cancellation</button>
      <button type="button" className="booking-secondary" disabled={working} onClick={onClose}>Keep this session</button>
    </div>
  </section>;
}

export default function FamilyManagePage() {
  const { hasCapability, client, clear, creditEnabled = false, recovery, recoveryEnabled = false } = useFamilyService();
  const operation = useSyncExternalStore(client.subscribe, client.getSnapshot, client.getSnapshot);
  const recoveryState = useSyncExternalStore(recovery?.subscribe ?? noSubscribe, recovery?.getSnapshot ?? noRecovery, noRecovery);
  const [view, setView] = useState({ data: null, loading: true, stale: false, error: '' });
  const [reload, setReload] = useState(0), [preview, setPreview] = useState(null), [checking, setChecking] = useState('');
  const [working, setWorking] = useState(false), [actionError, setActionError] = useState(''), [receipt, setReceipt] = useState(null), [choices, setChoices] = useState({});
  const alive = useRef(true), previewController = useRef(null), busy = useRef(false), latestFamily = useRef(null);
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; previewController.current?.abort(); };
  }, []);
  useEffect(() => {
    const robots = document.querySelector('meta[name="robots"]') ?? document.head.appendChild(document.createElement('meta'));
    robots.name = 'robots'; robots.content = 'noindex, nofollow, noarchive';
    document.title = 'Your private coaching · RRA Melbourne';
  }, []);
  useEffect(() => {
    latestFamily.current = null;
    if (!hasCapability || recovery?.locked()) return;
    let active = true; const controller = new AbortController();
    client.read(controller.signal).then(data => { if (active) {
      latestFamily.current = data;
      for (const event of data.purchase_events ?? []) {
        trackPrivateBooking('Purchase', event.request_id, event.charged_cents);
      }
      setChoices(previous => Object.fromEntries(Object.entries(previous).filter(([event, choice]) =>
        data.items.some(item => item.pending_choice_event === event && allowedOutcome(item, choice)))));
      setView({ data, loading: false, stale: false, error: '' });
      setPreview(previous => previous && data.items.some(item => item.booking_id === previous.booking_id && item.state === 'confirmed') ? previous : null);
    } })
      .catch(error => { if (active) setView(previous => ({ ...previous, ...(error.code === 'family_unavailable' ? { data: null } : {}), loading: false, stale: Boolean(previous.data), error: familyError(error) })); });
    return () => { active = false; latestFamily.current = null; controller.abort(); };
  }, [hasCapability, client, reload, recovery]);

  async function checkCancellation(item) {
    if (busy.current || client.state().paused || client.state().pending) return;
    previewController.current?.abort(); const controller = new AbortController(); previewController.current = controller;
    setChecking(item.booking_id); setPreview(null); setActionError('');
    try {
      const terms = await client.preview(item.booking_id, controller.signal);
      if (!alive.current || controller.signal.aborted) return;
      if (terms.request_id !== item.request_id) throw new Error('Unavailable cancellation terms');
      setPreview(terms);
    } catch (error) {
      if (alive.current && !controller.signal.aborted) { setActionError(familyError(error)); if (error.code === 'family_unavailable') setView(previous => ({ ...previous, data: null })); }
    } finally { if (alive.current && previewController.current === controller) setChecking(''); }
  }
  const closePreview = useCallback(() => setPreview(null), []);
  function saveChoice(item) {
    if (busy.current || client.state().paused || client.state().pending) return;
    const event = item.pending_choice_event;
    const current = latestFamily.current?.items.find(value => value.booking_id === item.booking_id && value.pending_choice_event === event);
    const choice = choices[event];
    if (!event || !current || !allowedOutcome(current, choice)) return;
    return save(() => client.choose({ event_id: event, choice }));
  }
  async function save(operation) {
    if (busy.current) return;
    busy.current = true; setWorking(true); setActionError(''); setReceipt(null);
    try {
      const saved = await operation();
      if (!alive.current) return;
      latestFamily.current = null;
      setReceipt(saved); setPreview(null);
      setView(previous => ({ ...previous, loading: true, error: '', stale: true, data: previous.data ? { ...previous.data, items: previous.data.items.map(item => saved.booking_id === item.booking_id
        ? { ...item, state: 'cancelled', state_plain: 'Cancelled', cancellation_fee_cents: saved.fee_cents }
        : saved.event_id === item.pending_choice_event ? { ...item, pending_choice_event: null } : item) } : null }));
      setReload(value => value + 1);
    } catch (error) {
      if (!alive.current) return;
      setActionError(familyError(error));
      if (error.code === 'review_required') setPreview(null);
      if (error.code === 'family_unavailable') setView(previous => ({ ...previous, data: null }));
    } finally { busy.current = false; if (alive.current) setWorking(false); }
  }
  const disabled = working || operation.paused || Boolean(operation.pending) || recoveryState?.busy;
  const data = view.data;
  return <div className="private-booking ph-no-capture">
    <header className="booking-top"><strong>Rajasthan Royals Academy · Melbourne</strong><Link to="/" onClick={event => { if (clear() === false) event.preventDefault(); }}>Close private page</Link></header>
    <main className="booking-wrap booking-stack"><section className="booking-card booking-stack">
      <h1>Your private coaching</h1>
      {!hasCapability ? <><h2>Secure link unavailable</h2><p>Open the private link in your email to see your sessions and player credit.</p></> : <>
        {view.loading ? <p role="status">Checking your sessions and credit…</p> : null}
        {view.error ? <p role="alert" className="booking-error">{view.error}</p> : null}
        {actionError ? <p role="alert" className="booking-error">{actionError}</p> : null}
        {operation.paused ? <p className="booking-error" role="alert">{familyError({ code: 'rate_limited' })}</p> : null}
        {operation.pending && operation.pending.kind !== 'lapsed_request' && operation.pending.phase !== 'sending' ? <div className="booking-notice"><h2>Check your submitted choice</h2><p>We haven’t confirmed whether it was saved. Check the same submission before making another choice.</p>{['credit_request', 'card_request'].includes(operation.pending.kind) ? <Link className="booking-secondary" to={operation.pending.kind === 'credit_request' ? '/book/credit' : '/book'}>Check submitted booking request</Link> : <button type="button" className="booking-primary" disabled={working || operation.paused} onClick={() => save(() => client.retry())}>Check submitted result</button>}</div> : null}
        {receipt ? <div className="booking-notice" role="status"><h2>{receipt.booking_id ? 'Session cancelled' : 'Your choice is saved'}</h2><p>{receipt.choice === 'refund' ? 'Your refund has been requested. The Academy will confirm when it is completed.' : receipt.choice === 'move' ? 'A new time has been requested. The Academy will arrange the replacement session.' : `${money(receipt.credit_cents)} in player credit has been recorded.`}</p>{receipt.fee_cents > 0 ? <p>Cancellation fee: {money(receipt.fee_cents)}.</p> : null}{receipt.fee_owing_cents > 0 ? <p>Fee still owing: {money(receipt.fee_owing_cents)}. Contact the Academy to arrange payment.</p> : null}</div> : null}
        {data ? <>
          <section className="booking-stack" aria-label="Player credit"><h2>Player credit</h2>
            {view.stale || operation.pending ? <p>Check your updated balance before using credit.</p> : data.players.length ? <ul className="booking-date-list">{data.players.map(player => <li key={player.id}><strong>{player.name}</strong><p>Available: {money(player.available_credit_cents)}</p><p>Reserved for requests: {money(player.reserved_credit_cents)}</p></li>)}</ul> : <p>No player credit records are linked here yet.</p>}
            {creditEnabled && !disabled && !view.stale ? <Link className="booking-primary" to="/book/credit">Book with my credit</Link> : <><button type="button" className="booking-secondary" disabled>Book with my credit</button><p className="booking-help">{creditEnabled ? 'Check any submitted choice and refresh your balance before booking with credit.' : 'Contact the Academy to use your credit when booking.'}</p></>}
          </section>
          <section className="booking-stack" aria-label="Your sessions"><h2>Your sessions</h2>
            {data.items.length ? <ul className="booking-date-list">{data.items.map(item => <li key={item.booking_id}>
              <h3>{dateTime(item.starts_at)}–{timeLabel(item.ends_at)}</h3><p>{item.coach ?? 'Academy coach'} · {item.centre}</p><p><strong>{item.state_plain}</strong></p>
              {item.state === 'confirmed' && Date.parse(item.starts_at) > Date.parse(data.as_of) ? <button type="button" className="booking-secondary" disabled={disabled || Boolean(checking)} onClick={() => checkCancellation(item)}>{checking === item.booking_id ? 'Checking cancellation…' : 'Check cancellation terms'}</button> : null}
              {preview?.booking_id === item.booking_id ? <CancellationTerms key={preview.server_now + ':' + preview.fee_cents} preview={preview} working={disabled} onClose={closePreview} onConfirm={(terms, accepted) => save(() => client.cancel({ booking_id: terms.booking_id, expected_fee_cents: terms.fee_cents, accept_fee: accepted }))} /> : null}
              {item.pending_choice_event ? <fieldset className="booking-fields"><legend>Choose what happens after this cancelled session</legend><p>Your original session is cancelled. Choose player credit or help arranging a new time.{item.can_request_card_refund === true ? ' You can also request a refund to the original card.' : ''}</p>{item.can_request_card_refund !== true ? <p>Online refunds are available only for eligible original card payments. If you paid by bank transfer, contact the Academy about a refund.</p> : null}{Object.entries(outcomeLabels).filter(([choice]) => allowedOutcome(item, choice)).map(([choice, label]) => <label className="booking-check" key={choice}><input type="radio" name={'outcome-' + item.pending_choice_event} value={choice} checked={choices[item.pending_choice_event] === choice} disabled={disabled || view.loading || view.stale} onChange={() => setChoices(previous => ({ ...previous, [item.pending_choice_event]: choice }))} />{label}</label>)}<button type="button" className="booking-primary" disabled={disabled || view.loading || view.stale || !allowedOutcome(item, choices[item.pending_choice_event])} onClick={() => saveChoice(item)}>Save my choice</button></fieldset> : null}
            </li>)}</ul> : <p>No private sessions are linked here yet.</p>}
          </section>
          <p className="booking-help">Times are Melbourne time. Last checked {dateTime(data.as_of)}.</p>
          {recoveryEnabled && recovery ? <section className="booking-stack" aria-label="Payment and expired request options"><h2>Payment and expired requests</h2><p>Check a remaining payment, or review a fresh request after an expired hold. Each option is checked against your secure link.</p>{[...new Map(data.items.filter(item => ['confirmed', 'expired'].includes(item.state)).map(item => [item.request_id, item])).values()].map(item => <div className="booking-stack" key={item.request_id}><p>{item.coach ?? 'Academy coach'} · {dateTime(item.starts_at)}</p><button className="booking-secondary" type="button" disabled={disabled || view.loading || view.stale} onClick={() => { void recovery.inspect(item.request_id, item.state === 'confirmed' ? 'remaining' : 'fresh').catch(() => {}); }}>{item.state === 'confirmed' ? 'Check remaining payment' : 'Review a fresh request after expiry'}</button></div>)}</section> : null}
          {disabled ? <button className="booking-secondary" type="button" disabled>Request another session by card</button> : <Link className="booking-secondary" to="/book">Request another session by card</Link>}
        </> : !view.loading && !view.error ? <p>Open the link in your email or contact the Academy to check this booking.</p> : null}
        <button type="button" className="booking-secondary" disabled={view.loading || working || operation.paused || recoveryState?.busy || recovery?.locked()} onClick={() => { latestFamily.current = null; setView(previous => ({ ...previous, loading: true, error: '' })); setReload(value => value + 1); }}>Check latest sessions and credit</button>
      </>}
      <p><a className="booking-link" href="mailto:info@rramelbourne.com" referrerPolicy="no-referrer">Contact the Academy</a></p>
    </section>{hasCapability && recovery && (recoveryEnabled || recovery.locked()) ? <React.Suspense fallback={<p role="status">Opening the secure recovery option…</p>}><FamilyRecovery /></React.Suspense> : null}</main>
  </div>;
}
