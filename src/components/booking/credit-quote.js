import { parsePrice, uuid, validDate } from './booking-model';
import { FamilyOperationError } from './family-operation-gate';

const fail = () => { throw new FamilyOperationError('unavailable', 503); };
const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : fail();
const integer = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => Number.isSafeInteger(value) && value >= min && value <= max ? value : fail();
const text = (value, max = 500) => typeof value === 'string' && value.length <= max ? value : fail();
const list = (value, max = 104) => Array.isArray(value) && value.length <= max ? value : fail();
const stamp = value => typeof value === 'string' && value.length <= 40 && /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,6})?(?:Z|[+-](?:0\d|1[0-4]):[0-5]\d)$/.test(value) && validDate(value.slice(0, 10)) && Number.isFinite(Date.parse(value)) ? value : fail();
const date = value => validDate(value) ? value : fail();
const reviewShape = /^v1\.[0-9a-f]{64}\.[0-9]{1,19}$/;
export const validCreditReview = value => typeof value === 'string' && value.length <= 128 && reviewShape.exec(value)?.[0] === value;
function alternative(value) {
  if (value === null || value === undefined) return null;
  const a = object(value), starts_at = stamp(a.starts_at), ends_at = stamp(a.ends_at);
  if (!uuid(a.profile_id) || Date.parse(ends_at) <= Date.parse(starts_at)) fail();
  return { profile_id: a.profile_id, starts_at, ends_at };
}
function series(raw, fields) {
  const s = object(raw);
  if (s.ready !== true || integer(s.requested_weeks, 1, 104) !== fields.weeks) fail();
  const actual_sessions = integer(s.actual_sessions, 1, 104);
  const dates = list(s.dates).map(value => {
    const d = object(value), starts_at = stamp(d.starts_at), ends_at = stamp(d.ends_at);
    if (Date.parse(ends_at) - Date.parse(starts_at) !== fields.duration_minutes * 60000) fail();
    return { date: date(d.date), starts_at, ends_at };
  });
  if (dates.length !== actual_sessions || new Set(dates.map(d => d.date)).size !== dates.length || Date.parse(dates[0].starts_at) !== Date.parse(fields.starts_at)) fail();
  const ok_dates = list(s.ok_dates).map(date);
  const skipped_dates = list(s.skipped_dates).map(date);
  if (ok_dates.length !== dates.length || ok_dates.some((day, index) => day !== dates[index].date) || new Set(skipped_dates).size !== skipped_dates.length || dates.length + skipped_dates.length !== fields.weeks || skipped_dates.some(day => ok_dates.includes(day)) || dates.some((day, index) => index > 0 && Date.parse(day.starts_at) <= Date.parse(dates[index - 1].starts_at))) fail();
  const flagged = list(s.flagged).map(value => { const f = object(value); if (f.kind !== 'school_holiday') fail(); return { date: date(f.date), kind: f.kind, reason_plain: text(f.reason_plain) }; });
  const blocked = list(s.blocked).map(value => { const b = object(value); if (typeof b.auto_skipped !== 'boolean') fail(); return { date: date(b.date), kind: text(b.kind, 80), reason_plain: text(b.reason_plain), auto_skipped: b.auto_skipped, alternative: alternative(b.alternative) }; });
  return { ready: true, requested_weeks: s.requested_weeks, actual_sessions, ok_dates, dates, flagged, blocked, skipped_dates, add_week: alternative(s.add_week) };
}
function decision(raw, dates) {
  if (raw === null) return null;
  const d = object(raw), quoted_at = stamp(d.quoted_at), confirm_by = stamp(d.confirm_by);
  if (d.kind !== 'policy_quote' || Date.parse(confirm_by) <= Date.parse(quoted_at) || dates.some(day => Date.parse(confirm_by) > Date.parse(day.starts_at))) fail();
  return { kind: 'policy_quote', quoted_at, confirm_by };
}

export function parseCreditQuote(data, fields) {
  if (data?.ok !== true) fail();
  const q = object(data.quote), as_of = stamp(q.as_of);
  if (q.state === 'unavailable') {
    if (q.code !== 'slot_taken') fail();
    return { state: 'unavailable', code: 'slot_taken', as_of };
  }
  if (q.state !== 'quoted' || !validCreditReview(q.review) || !Array.isArray(fields.players) || fields.players.length < 1 || fields.players.length > 4) fail();
  let price; try { price = parsePrice(q.price); } catch { fail(); }
  if (price.first_session_hold_cents !== price.per_session_cents || price.rest_cents !== price.per_session_cents * (price.sessions - 1)) fail();
  const series_check = series(q.series_check, fields);
  if (price.sessions !== series_check.actual_sessions) fail();
  const f = object(q.funding), count = fields.players.length;
  if (f.indicative !== true || !['card', 'setup', 'covered'].includes(f.funding_mode)) fail();
  const first_due_cents = integer(f.first_due_cents), rest_due_cents = integer(f.rest_due_cents), credit_applied_cents = integer(f.credit_applied_cents);
  const players = list(f.players, 4).map((value, index) => {
    const p = object(value), ordinal = integer(p.ordinal, 1, count), credit_cents = integer(p.credit_cents), per_session_cents = integer(p.per_session_cents);
    if (ordinal !== index + 1 || per_session_cents !== Math.floor(price.per_session_cents / count) + (ordinal <= price.per_session_cents % count ? 1 : 0) || credit_cents > per_session_cents * price.sessions) fail();
    return { ordinal, credit_cents, per_session_cents };
  });
  const applied = players.reduce((total, p) => total + p.credit_cents, 0), firstCredit = players.reduce((total, p) => total + Math.min(p.credit_cents, p.per_session_cents), 0);
  if (players.length !== count || applied !== credit_applied_cents || first_due_cents !== price.first_session_hold_cents - firstCredit || rest_due_cents !== price.rest_cents - (applied - firstCredit) || first_due_cents + rest_due_cents + credit_applied_cents !== price.total_cents || f.funding_mode !== (first_due_cents > 0 ? 'card' : rest_due_cents > 0 ? 'setup' : 'covered')) fail();
  if ((first_due_cents > 0 && first_due_cents < 50) || (rest_due_cents > 0 && rest_due_cents < 50)) throw new FamilyOperationError('payment_limit', 400);
  return { state: 'quoted', as_of, review: q.review, price, series_check, decision_quote: decision(q.decision_quote, series_check.dates), funding: { indicative: true, funding_mode: f.funding_mode, first_due_cents, rest_due_cents, credit_applied_cents, players } };
}

/** Compare server facts for another review; clock-only later promises do not loop consent. */
export function creditReviewChanged(before, after) {
  if (before?.state !== 'quoted' || after?.state !== 'quoted') return true;
  if (JSON.stringify([before.price, before.series_check, before.funding]) !== JSON.stringify([after.price, after.series_check, after.funding])) return true;
  if (!before.decision_quote || !after.decision_quote || before.decision_quote.kind !== after.decision_quote.kind) return true;
  return Date.parse(before.decision_quote.confirm_by) <= Date.parse(after.as_of) || Date.parse(after.decision_quote.confirm_by) < Date.parse(before.decision_quote.confirm_by);
}
