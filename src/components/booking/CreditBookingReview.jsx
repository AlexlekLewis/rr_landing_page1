import React from 'react';
import { dayLabel, money, timeLabel } from './booking-model';
import Turnstile from './Turnstile';

export default function CreditBookingReview({ quote, fields, coachName, centre, cancellation, pending = false, blocked = false, consent = false, turnstileToken = '', widgetReset = 0, onConsent, onToken, onRequest, onRefresh }) {
  if (quote?.state !== 'quoted') return <div className="booking-error" role="alert"><p>That time is no longer available. Choose another start before checking credit.</p>{onRefresh ? <button type="button" className="booking-secondary" onClick={onRefresh}>Check another quote</button> : null}</div>;
  const funding = quote.funding, mode = funding.funding_mode, needsCard = mode !== 'covered', decision = quote.decision_quote;
  return <section className="booking-stack" aria-label="Review credit request">
    <h2>Check your credit request</h2>
    <p>{coachName} · {centre?.name}</p>{centre?.address ? <p>{centre.address}</p> : null}
    <div className="booking-summary"><p>{quote.price.sessions} actual session{quote.price.sessions === 1 ? '' : 's'} · {money(quote.price.total_cents)} incl. GST</p><p>Player credit to apply: <strong>{money(funding.credit_applied_cents)}</strong></p><ul aria-label="Credit by player">{funding.players.map(player => <li key={player.ordinal}>{fields.players[player.ordinal - 1].name}: {money(player.credit_cents)} toward these sessions</li>)}</ul><p className="booking-help">This credit quote is indicative. Credit is reserved when you submit the request, and is checked again before then.</p></div>
    <ul className="booking-date-list">{quote.series_check.dates.map(date => <li key={date.date}>{dayLabel(date.date)}, {timeLabel(date.starts_at)}–{timeLabel(date.ends_at)}</li>)}{quote.series_check.skipped_dates.map(date => <li key={'skip-' + date}>{dayLabel(date)} · skipped, with no session for this date.</li>)}</ul>
    <div className="booking-notice">
      <h3>This is a request, not a booking yet</h3>
      {mode === 'covered' ? <><p>Your available player credit covers these sessions. No card is needed for this request.</p><p>The credit stays reserved while the Academy checks the coach and a net with the venue.</p></> : mode === 'setup' ? <><p>Your first session is covered by credit. No card hold is needed.</p><p>Save a card for the remaining <strong>{money(funding.rest_due_cents)}</strong>, charged after the venue confirms.</p></> : <><p>Today: a <strong>{money(funding.first_due_cents)}</strong> first-session hold is placed on your card. You are not charged.</p><p>When the venue confirms, we charge that card portion{funding.rest_due_cents > 0 ? <> and the remaining <strong>{money(funding.rest_due_cents)}</strong></> : ' for this session'} to the saved card.</p></>}
      {decision ? <><p>The Academy aims to confirm by <strong>{dayLabel(decision.confirm_by)}, {timeLabel(decision.confirm_by)} Melbourne time.</strong></p><p className="booking-help">Your request will show its final deadline after {mode === 'covered' ? 'your credit is reserved' : mode === 'setup' ? 'your card is saved' : 'the card hold'}.</p></> : <p className="booking-error" role="alert">The confirmation deadline is unavailable. Check the quote again before requesting.</p>}
    </div>
    {cancellation ? <p className="booking-policies">Cancel free at least {cancellation.free_hours} hours before a session; inside that window the cancellation fee is {money(cancellation.late_fee_cents)}. Prepaid cancelled sessions follow the player credit policy. <a href="/terms-conditions">Terms</a> · <a href="/privacy-policy">Privacy</a></p> : null}
    {needsCard ? <label className="booking-check"><input type="checkbox" checked={consent} disabled={pending || blocked} onChange={event => onConsent(event.target.checked)} />{mode === 'setup'
      ? `I agree to saving this card to charge the remaining ${money(funding.rest_due_cents)} when the venue confirms.`
      : `I agree to the ${money(funding.first_due_cents)} first-session card hold and saving this card to charge that amount${funding.rest_due_cents > 0 ? ` and the remaining ${money(funding.rest_due_cents)}` : ' for this session'} when the venue confirms.`}</label> : null}
    <Turnstile onToken={onToken} reset={widgetReset} />
    <button type="button" className="booking-primary" disabled={pending || blocked || !decision || !turnstileToken || (needsCard && !consent)} onClick={onRequest}>{pending ? 'Checking your request…' : mode === 'covered' ? 'Request using player credit' : mode === 'setup' ? 'Request and save card' : 'Request and continue to card hold'}</button>
    {onRefresh ? <button type="button" className="booking-secondary" disabled={pending || blocked} onClick={onRefresh}>Check current credit quote</button> : null}
  </section>;
}
