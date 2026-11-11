import React from 'react';
import { dayLabel, money, timeLabel } from './booking-model';
export function Quote({ slot, groupSize }) {
  if (!slot) return null;
  const price = slot.price;
  const isGroup = Number.isInteger(groupSize) && groupSize >= 2 && groupSize <= 4;
  const groupShare = isGroup ? price.per_session_cents / groupSize : null;
  return <div className="booking-summary">
    <p className="booking-kicker">{price.sessions} actual session{price.sessions === 1 ? '' : 's'}{isGroup ? ' · whole group' : ''}</p>
    <p className="booking-price">{money(price.total_cents)} <span className="booking-help">incl. GST</span></p>
    <p>{money(price.per_session_cents)} per session{price.discount_applied ? ' · block discount included' : ''}.</p>
    {groupShare !== null ? <p>
      {Number.isInteger(groupShare) ? 'Per player' : 'Average per player'} · {money(Math.round(groupShare))} per session · {money(Math.round(price.total_cents / groupSize))} for the block.
    </p> : null}
    <p className="booking-help">The quote is for the dates listed below. It is checked again before you submit your request.</p>
  </div>;
}
export default function SeriesDates({ slot, draft, onSkip, onAlternative, onAdd }) {
  if (!slot) return null;
  const s = slot.series_check;
  return <div className="booking-stack"><Quote slot={slot} groupSize={draft.kind === 'group' ? draft.group_size : null} /><ul className="booking-date-list">{s.dates.map(d => { const holiday = s.flagged.find(f => f.date === d.date); return <li key={d.date}><strong>{dayLabel(d.date)}</strong>, {timeLabel(d.starts_at)}–{timeLabel(d.ends_at)}{holiday ? <><p>{holiday.reason_plain}</p>{d.starts_at === draft.starts_at ? <p className="booking-help">To skip the first session, choose a later start.</p> : onSkip ? <label className="booking-check"><input type="checkbox" checked={draft.skip_dates.includes(d.date)} onChange={() => onSkip(d.date)} />Skip this holiday week</label> : null}</> : null}</li>; })}{s.skipped_dates.filter(date => !s.blocked.some(b => b.date === date)).map(date => <li key={'skip-' + date}><strong>{dayLabel(date)}</strong><p>Skipped · no session and no charge for this date.</p>{onSkip && draft.skip_dates.includes(date) ? <button type="button" className="booking-link" onClick={() => onSkip(date)}>Include this week again</button> : null}</li>)}{s.blocked.map((b, i) => <li key={'blocked-' + b.date + i}><strong>{dayLabel(b.date)}</strong><p>{b.reason_plain}{b.auto_skipped ? ' · automatically skipped' : ''}</p>{b.alternative && onAlternative ? <button type="button" className="booking-link" onClick={() => onAlternative(b.alternative)}>Check {dayLabel(b.alternative.starts_at)} at {timeLabel(b.alternative.starts_at)} as a new start at this centre</button> : null}</li>)}</ul>{s.add_week && onAdd ? <button type="button" className="booking-secondary" onClick={onAdd}>Check an extra week at the end</button> : null}{!s.ready ? <p className="booking-error" role="alert">Some weeks can’t go ahead as chosen. Change the weeks, choose another start, or ask us. This is not a complete request yet.</p> : null}</div>;
}
