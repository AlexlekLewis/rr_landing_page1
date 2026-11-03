import React, { useEffect, useState } from 'react';
import { createPublicClient, publicError } from './public-client';
import { dayLabel, money } from './booking-model';
function addCalendar(request) {
  const stamp = iso => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '');
  const status = request.state === 'confirmed' ? 'CONFIRMED' : 'TENTATIVE';
  const events = request.dates.filter(d => d.starts_at && d.ends_at).map((d, i) => ['BEGIN:VEVENT', `UID:${request.request_id}-${i}@rramelbourne.com`, `DTSTAMP:${stamp(new Date().toISOString())}`, `DTSTART:${stamp(d.starts_at)}`, `DTEND:${stamp(d.ends_at)}`, `SUMMARY:Private coaching${status === 'TENTATIVE' ? ' request - not confirmed' : ''}`, `STATUS:${status}`, 'END:VEVENT'].join('\r\n'));
  const blob = new Blob([['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//RRA Melbourne//Private Coaching//EN', ...events, 'END:VCALENDAR', ''].join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob), link = document.createElement('a'); link.href = url; link.download = 'private-coaching.ics'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function BookingStatus({ initial, checkpoint, onNew, onUpdate }) {
  const [state, setState] = useState(() => ({ request: initial, error: '', received: performance.now() })), [reload, setReload] = useState(0), [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    let active = true, timer; const controller = new AbortController(), client = createPublicClient();
    async function check() {
      try {
        const request = await client.status(checkpoint.request_token, controller.signal);
        if (!active) return; if (request.request_id !== checkpoint.request_id) throw new Error('unavailable');
        setState({ request, error: '', received: performance.now() }); onUpdate?.(request);
        if (['checkout', 'requested', 'venue_told'].includes(request.state)) timer = setTimeout(check, request.state === 'checkout' ? 5000 : 30000);
      } catch (error) { if (active && error.name !== 'AbortError') setState(s => ({ ...s, error: publicError(error) })); }
    }
    if (checkpoint) void check();
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [checkpoint, reload, onUpdate]);
  useEffect(() => { const timer = setInterval(() => setElapsed(Math.floor((performance.now() - state.received) / 1000)), 1000); return () => clearInterval(timer); }, [state.received]);
  const request = state.request;
  if (!request) return <div className="booking-stack"><h1>Checking your request</h1><p>We’re checking the result with the Academy. A Checkout return page doesn’t confirm a booking.</p>{state.error ? <p className="booking-error" role="alert">{state.error}</p> : <p role="status">Checking…</p>}<button type="button" className="booking-secondary" onClick={() => setReload(n => n + 1)}>Check again</button></div>;
  if (request.state === 'needs_review') return <div role="status"><h1>We’ll check the details with you</h1><p>We’ll be in touch {request.call_by_plain}. No card hold has been requested and no session is confirmed.</p></div>;
  const seconds = Math.max(0, request.expires_in_seconds - elapsed), minutes = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  return <div className="booking-stack">
    <p className="booking-kicker">{request.state === 'confirmed' ? 'Venue confirmed' : 'Your request'}</p>
    <h1>{request.state === 'checkout' ? 'Finish your card hold' : request.state === 'confirmed' ? 'Your coaching is confirmed' : ['requested', 'venue_told'].includes(request.state) ? 'Request received — not booked yet' : request.state === 'expired' ? 'This request has expired' : request.state === 'declined' ? 'We couldn’t confirm this request' : 'This booking was cancelled'}</h1>
    {request.state === 'checkout' ? <><p>This time is reserved while you complete Checkout. A card hold is still needed before the Academy receives your request.</p><div className="booking-summary"><p>Card hold: <strong>{money(request.price.first_session_hold_cents)}</strong>. This step places a hold. The Academy charges after venue confirmation.</p><p>Time left to finish: <strong>{minutes}</strong></p></div>{request.checkout_url && seconds > 0 ? <a className="booking-primary" href={request.checkout_url} referrerPolicy="no-referrer">Continue to the secure card hold</a> : <p role="status">{seconds > 0 ? 'Preparing secure Checkout. Your time stays reserved until the deadline above.' : 'The Checkout deadline has passed. Checking the final state does not extend the reservation.'}</p>}<p className="booking-help">After Checkout, return here. We only show a request as received after the card hold is verified.</p></> : null}
    {['requested', 'venue_told'].includes(request.state) ? <><p>Your card hold is in place. The Academy will check the coach and a net with the venue.</p><p>{request.call_by_plain ? `We’ll confirm ${request.call_by_plain}.` : 'We’ll send the confirm-by time with your request receipt.'}</p><p>If we can’t confirm, the hold is released and we’ll offer other times at the same centre.</p></> : null}
    {request.state === 'confirmed' ? <p>The venue has confirmed your sessions. Contact the Academy if you need payment details or help managing this booking.</p> : null}
    {['declined', 'expired', 'cancelled'].includes(request.state) ? <><p>This time is no longer reserved. Contact the Academy if you need help checking a card hold, payment or credit.</p><button type="button" className="booking-primary" onClick={onNew}>Find another time</button></> : null}
    {request.dates.length ? <div><h2>Your dates</h2><ul className="booking-date-list">{request.dates.map(d => <li key={d.date}>{dayLabel(d.date)}</li>)}</ul></div> : null}
    {['requested', 'venue_told', 'confirmed'].includes(request.state) && request.dates.some(d => d.starts_at && d.ends_at) ? <button type="button" className="booking-secondary" onClick={() => addCalendar(request)}>Add {request.state === 'confirmed' ? 'sessions' : 'tentative requests'} to my calendar</button> : null}
    {state.error ? <p className="booking-error" role="alert">{state.error}</p> : null}
    <button type="button" className="booking-link" onClick={() => setReload(n => n + 1)}>Check the latest status</button>
  </div>;
}
