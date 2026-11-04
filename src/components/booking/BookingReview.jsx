import React from 'react';
import { dayLabel, FOCUS_LABELS, lengthLabel, money, timeLabel } from './booking-model';
import SeriesDates from './SeriesDates';
import Turnstile from './Turnstile';

export default function BookingReview({ slot, draft, catalog, coach, centre, pending, token, widgetReset, onConsent, onToken, onReserve }) {
  const remainder = slot.price.rest_cents > 0, decision = slot.decision_quote;
  return <div className="booking-stack">
    <div className="booking-summary"><dl>
      <div><dt>Coach and centre</dt><dd>{coach?.display_name} · {centre?.name}</dd></div>
      {centre?.address ? <div><dt>Address</dt><dd>{centre.address}</dd></div> : null}
      <div><dt>First session · Melbourne time</dt><dd>{dayLabel(slot.starts_at)}, {timeLabel(slot.starts_at)}–{timeLabel(slot.ends_at)}</dd></div>
      <div><dt>Length and focus</dt><dd>{lengthLabel(draft.duration_minutes)} · {FOCUS_LABELS[draft.focus]}</dd></div>
      <div><dt>Players</dt><dd>{draft.players.map(player => `${player.name} (${player.age})`).join(', ')}</dd></div>
    </dl></div>
    <SeriesDates slot={slot} draft={draft} />
    <div className="booking-notice">
      <h2>This is a request, not a booking yet</h2>
      <p><strong>Today:</strong> a hold of {money(slot.price.first_session_hold_cents)} is placed on your card. You are not charged.</p>
      <p><strong>When the venue confirms:</strong> {remainder
        ? <>we charge the first session ({money(slot.price.first_session_hold_cents)}) and the rest of the block ({money(slot.price.rest_cents)}) to the same card.</>
        : <>we charge this session ({money(slot.price.first_session_hold_cents)}) to the same card.</>}</p>
      {decision ? <>
        <p>The Academy aims to confirm by <strong>{dayLabel(decision.confirm_by)}, {timeLabel(decision.confirm_by)} Melbourne time.</strong></p>
        <p className="booking-help">Your request will show the final deadline after the card hold.</p>
      </> : <p className="booking-error" role="alert">The confirmation deadline is unavailable. Check the dates again before requesting.</p>}
      <p>The Academy checks the coach and a net with the venue before confirming. If we can’t confirm, the hold is released and we’ll offer other times at this centre.</p>
    </div>
    <p className="booking-policies">Cancel free at least {catalog.cancellation.free_hours} hours before a session; inside that window the cancellation fee is {money(catalog.cancellation.late_fee_cents)}. Prepaid cancelled sessions follow the credit policy. <a href="/terms-conditions">Terms</a> · <a href="/privacy-policy">Privacy</a></p>
    <label className="booking-check"><input type="checkbox" checked={draft.consent_save_card} onChange={event => onConsent(event.target.checked)} />{remainder
      ? 'I agree to the first-session card hold and saving this card to charge the first session and remaining block when the venue confirms.'
      : 'I agree to the first-session card hold and saving this card to charge this session when the venue confirms.'}</label>
    <Turnstile onToken={onToken} reset={widgetReset} />
    <button type="button" className="booking-primary" disabled={pending || !token || !draft.consent_save_card || !decision} onClick={onReserve}>{pending ? 'Checking and reserving…' : 'Request and continue to card hold'}</button>
    <p className="booking-help">Your time is reserved only after the final availability check. The next screen shows the Checkout deadline.</p>
  </div>;
}
