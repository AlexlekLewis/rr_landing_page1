import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { createPublicClient, publicError } from './public-client';
import { dayLabel, money } from './booking-model';
import { creditError } from './credit-client';
function addCalendar(request) {
  const stamp = iso => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '');
  const status = request.state === 'confirmed' ? 'CONFIRMED' : 'TENTATIVE';
  const events = request.dates.filter(d => d.starts_at && d.ends_at).map((d, i) => ['BEGIN:VEVENT', `UID:${request.request_id}-${i}@rramelbourne.com`, `DTSTAMP:${stamp(new Date().toISOString())}`, `DTSTART:${stamp(d.starts_at)}`, `DTEND:${stamp(d.ends_at)}`, `SUMMARY:Private coaching${status === 'TENTATIVE' ? ' request - not confirmed' : ''}`, `STATUS:${status}`, 'END:VEVENT'].join('\r\n'));
  const blob = new Blob([['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//RRA Melbourne//Private Coaching//EN', ...events, 'END:VCALENDAR', ''].join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob), link = document.createElement('a'); link.href = url; link.download = 'private-coaching.ics'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const idleSnapshot = Object.freeze({ paused: false }), readIdle = () => idleSnapshot, subscribeIdle = () => () => {};
export default function BookingStatus({ initial, checkpoint, onNew, onUpdate, operationGate, creditMode = false }) {
  const operation = useSyncExternalStore(operationGate?.subscribe ?? subscribeIdle, operationGate?.getSnapshot ?? readIdle, readIdle);
  const [state, setState] = useState(() => ({ request: initial, error: '', received: performance.now() })), [reload, setReload] = useState(0), [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    let active = true, timer; const controller = new AbortController(), client = createPublicClient();
    async function check() {
      try {
        operationGate?.assertReadable();
        const request = await client.status(checkpoint.request_token, controller.signal);
        if (!active) return; if (request.request_id !== checkpoint.request_id) throw new Error('unavailable');
        setState({ request, error: '', received: performance.now() }); onUpdate?.(request);
        if (['checkout', 'requested', 'venue_told'].includes(request.state)) timer = setTimeout(check, request.state === 'checkout' ? 5000 : 30000);
      } catch (error) { if (error.code === 'rate_limited') operationGate?.pause(); if (active && error.name !== 'AbortError') setState(s => ({ ...s, error: operationGate || creditMode ? creditError(error) : publicError(error) })); }
    }
    if (checkpoint) void check();
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [checkpoint, reload, onUpdate, operationGate, creditMode]);
  useEffect(() => { const timer = setInterval(() => setElapsed(Math.floor((performance.now() - state.received) / 1000)), 1000); return () => clearInterval(timer); }, [state.received]);
  const request = state.request;
  if (!request) return <div className="booking-stack"><h1>Checking your request</h1><p>We’re checking the result with the Academy. A Checkout return page doesn’t confirm a booking.</p>{state.error ? <p className="booking-error" role="alert">{state.error}</p> : <p role="status">Checking…</p>}<button type="button" className="booking-secondary" disabled={operation.paused} onClick={() => setReload(n => n + 1)}>Check again</button></div>;
  if (request.state === 'needs_review') return <div role="status"><h1>We’ll check the details with you</h1><p>We’ll be in touch {request.call_by_plain}. No card hold has been requested and no session is confirmed.</p></div>;
  const funding=request.funding_mode??request.price.funding_mode??'card',setup=funding==='setup',recorded=funding==='recorded',credit=request.price.credit_reserved_cents??0;
  const seconds = Math.max(0, request.expires_in_seconds - elapsed), minutes = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  return <div className="booking-stack">
    <p className="booking-kicker">{request.state === 'confirmed' ? 'Venue confirmed' : 'Your request'}</p>
    <h1>{request.state === 'checkout' ? recorded?'The Academy is checking your booking':setup?'Finish saving your card':'Finish your card hold' : request.state === 'confirmed' ? 'Your coaching is confirmed' : ['requested', 'venue_told'].includes(request.state) ? 'Request received — not booked yet' : request.state === 'expired' ? 'This request has expired' : request.state === 'declined' ? 'We couldn’t confirm this request' : 'This booking was cancelled'}</h1>
    {request.state==='checkout'&&recorded?<><p>The Academy is handling venue confirmation and your cash or bank payment. Contact the Academy if you need help. These sessions are not confirmed yet.</p><p>Reservation time remaining: <strong>{minutes}</strong></p></>:null}
    {request.state === 'checkout'&&!recorded ? <><p>{setup?'Your first session is covered by credit. Save a card for the remaining block before the Academy receives your request.':'This time is reserved while you complete Checkout. A card hold is still needed before the Academy receives your request.'}</p><div className="booking-summary">{credit>0?<p>Credit in this request: <strong>{money(credit)}</strong>.</p>:null}{setup?<p>No first-session card hold is needed. The remaining <strong>{money(request.price.rest_cents)}</strong> is charged after venue confirmation.</p>:<p>Card hold: <strong>{money(request.price.first_session_hold_cents)}</strong>. This step places a hold. The Academy charges after venue confirmation.</p>}<p>Time left to finish: <strong>{minutes}</strong></p></div>{request.checkout_url && seconds > 0 ? <a className="booking-primary" href={request.checkout_url} referrerPolicy="no-referrer">{setup?'Continue to secure card setup':'Continue to the secure card hold'}</a> : <p role="status">{seconds > 0 ? 'Preparing secure Checkout. Your time stays reserved until the deadline above.' : 'The Checkout deadline has passed. Checking the final state does not extend the reservation.'}</p>}<p className="booking-help">After Checkout, return here. We only show a request as received after {setup?'the saved card':'the card hold'} is verified.</p></> : null}
    {['requested', 'venue_told'].includes(request.state) ? <><p>{funding==='covered'?'Your credit is reserved for this request.':setup?'Your card is saved for the remaining block; the first session uses credit.':funding==='recorded'?'The Academy is managing payment for this request.':'Your card hold is in place.'} The Academy will check the coach and a net with the venue.</p><p>{request.call_by_plain ? `We’ll confirm ${request.call_by_plain}.` : 'We’ll send the confirm-by time with your request receipt.'}</p><p>{funding==='card'?'If we can’t confirm, the hold is released and we’ll offer other times at the same centre.':'If we can’t confirm, we’ll release any reserved credit and offer other times at the same centre.'}</p></> : null}
    {request.state === 'confirmed' ? <p>The venue has confirmed your sessions. Contact the Academy if you need payment details or help managing this booking.</p> : null}
    {['declined', 'expired', 'cancelled'].includes(request.state) ? <><p>This time is no longer reserved. Contact the Academy if you need help checking a card hold, payment or credit.</p><button type="button" className="booking-primary" onClick={onNew}>Find another time</button></> : null}
    {request.dates.length ? <div><h2>Your dates</h2><ul className="booking-date-list">{request.dates.map(d => <li key={d.date}>{dayLabel(d.date)}</li>)}</ul></div> : null}
    {['requested', 'venue_told', 'confirmed'].includes(request.state) && request.dates.some(d => d.starts_at && d.ends_at) ? <button type="button" className="booking-secondary" onClick={() => addCalendar(request)}>Add {request.state === 'confirmed' ? 'sessions' : 'tentative requests'} to my calendar</button> : null}
    {state.error ? <p className="booking-error" role="alert">{state.error}</p> : null}
    <button type="button" className="booking-link" disabled={operation.paused} onClick={() => setReload(n => n + 1)}>Check the latest status</button>
  </div>;
}
