export const TIME_ZONE = 'Australia/Melbourne';
export const FOCUS_LABELS = { batting: 'Batting', pace: 'Pace bowling', spin: 'Spin bowling', keeping: 'Wicketkeeping', allround: 'All-round skills' };
// Intent keys only, from PR157 coachProfiles.js. Marketing copy and pages remain there.
export const GOALS = { batting: 'Batting', 't20-cricket': 'T20 cricket', 'all-round-development': 'All-round development', 'batting-technique': 'Batting technique', 'building-an-innings': 'Building an innings', 'school-cricket': 'School cricket', wicketkeeping: 'Wicketkeeping', 'top-order-batting': 'Top-order batting', 'small-group-batting': 'Small-group batting', 'club-batting': 'Batting for club cricket' };
export const COACH_GOALS = { 'ikroop-dhanoa': ['batting', 't20-cricket', 'all-round-development'], 'alex-thornhill': ['batting-technique', 'building-an-innings', 'school-cricket'], 'ritin-raman': ['wicketkeeping', 'top-order-batting', 'all-round-development'], 'mihiraj-jayasekara': ['batting-technique', 'small-group-batting', 'club-batting'] };
export const uuid = value => typeof value === 'string' && /^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/i.test(value);
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const text = (value, max = 200) => typeof value === 'string' && value.length <= max;
const integer = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => Number.isSafeInteger(value) && value >= min && value <= max;
export const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value + 'T12:00:00Z')) && new Date(value + 'T12:00:00Z').toISOString().slice(0, 10) === value;
const instant = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value) && Number.isFinite(Date.parse(value));
export function localStart(iso) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(iso)).map(p => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}
export const localDate = iso => localStart(iso).slice(0, 10);
function dateParts(iso, full = false) {
  return Object.fromEntries(new Intl.DateTimeFormat('en-AU', { timeZone: TIME_ZONE, weekday: full ? 'long' : 'short', day: 'numeric', month: full ? 'long' : 'short', ...(full ? { year: 'numeric' } : {}) }).formatToParts(new Date(iso.length === 10 ? iso + 'T12:00:00+11:00' : iso)).map(part => [part.type, part.value]));
}
export const dayLabel = iso => { const p = dateParts(iso); return `${p.weekday} ${p.day} ${p.month}`; };
export const timeLabel = iso => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-AU', { timeZone: TIME_ZONE, hour: 'numeric', minute: '2-digit', hour12: true }).formatToParts(new Date(iso)).map(part => [part.type, part.value]));
  return `${p.hour}${p.minute === '00' ? '' : ':' + p.minute}${p.dayPeriod.toLowerCase()}`;
};
export function slotAccessibleLabel(iso, coachCount) {
  const p = dateParts(iso, true);
  return `${p.weekday} ${p.day} ${p.month} ${p.year}, ${timeLabel(iso)} Melbourne time, ${coachCount} coach${coachCount === 1 ? '' : 'es'} free`;
}
export const money = cents => integer(cents) ? new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100) : 'Price unavailable';
export const lengthLabel = minutes => ({ 60: '1 hour', 90: '1½ hours', 120: '2 hours' })[minutes] ?? `${minutes} minutes`;
export const addDays = (date, count) => new Date(Date.parse(date + 'T12:00:00Z') + count * 86400000).toISOString().slice(0, 10);
function fail() { throw new Error('unavailable'); }
export function parseCatalog(raw) {
  if (!object(raw) || !Array.isArray(raw.centres) || !Array.isArray(raw.coaches) || !Array.isArray(raw.durations_minutes) || !Array.isArray(raw.group_sizes) || !Array.isArray(raw.focus) || !object(raw.prices) || !object(raw.prices.group_player_hour_cents) || !object(raw.block_discount) || !object(raw.cancellation)) fail();
  const centres = raw.centres.map(c => { if (!object(c) || !uuid(c.id) || !['mickleham', 'cranbourne-north'].includes(c.slug) || !text(c.name, 200) || !text(c.suburb, 120) || !(c.address === null || text(c.address, 500))) fail(); return { id: c.id, slug: c.slug, name: c.name, suburb: c.suburb, address: c.address }; });
  const coaches = raw.coaches.map(c => { if (!object(c) || !uuid(c.profile_id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.slug) || !text(c.display_name, 120) || !Array.isArray(c.centres) || c.centres.some(s => !centres.some(centre => centre.slug === s)) || !Array.isArray(c.coaches_what)) fail(); return { profile_id: c.profile_id, slug: c.slug, display_name: c.display_name, home_centre: c.home_centre, centres: c.centres, coaches_what: c.coaches_what.filter(f => Object.hasOwn(FOCUS_LABELS, f)), photo_url: typeof c.photo_url === 'string' && /^https:\/\//.test(c.photo_url) ? c.photo_url : null }; });
  if (raw.durations_minutes.some(d => ![60, 90, 120].includes(d)) || !raw.durations_minutes.length || raw.group_sizes.some(g => ![2, 3, 4].includes(g)) || !raw.group_sizes.length || raw.focus.some(f => !Object.hasOwn(FOCUS_LABELS, f)) || !raw.focus.length || !integer(raw.max_weeks, 1, 104) || !integer(raw.block_discount.min_sessions, 1, 104) || !integer(raw.block_discount.percent, 0, 100) || !integer(raw.cancellation.free_hours, 0, 8760) || !integer(raw.cancellation.late_fee_cents)) fail();
  return { centres, coaches, durations_minutes: raw.durations_minutes, group_sizes: raw.group_sizes, focus: raw.focus, max_weeks: raw.max_weeks, block_discount: { min_sessions: raw.block_discount.min_sessions, percent: raw.block_discount.percent }, cancellation: { free_hours: raw.cancellation.free_hours, late_fee_cents: raw.cancellation.late_fee_cents }, prices: { one_on_one_hour_cents: integer(raw.prices.one_on_one_hour_cents, 1) ? raw.prices.one_on_one_hour_cents : null, group_player_hour_cents: Object.fromEntries(raw.group_sizes.map(g => [g, integer(raw.prices.group_player_hour_cents[g], 1) ? raw.prices.group_player_hour_cents[g] : null])) } };
}
export function parsePrice(p,{funded=false}={}) {
  const keys = ['per_session_cents', 'sessions', 'first_session_hold_cents', 'rest_cents', 'total_cents'];
  if (!object(p) || keys.some(key => !integer(p[key])) || p.sessions < 1 || p.sessions > 104 || typeof p.discount_applied !== 'boolean') fail();
  const credit=funded&&p.credit_reserved_cents!==undefined?p.credit_reserved_cents:0,mode=funded&&p.funding_mode!==undefined?p.funding_mode:'card';
  if(!integer(credit)||!['card','setup','covered','recorded'].includes(mode)||(!funded&&(p.credit_reserved_cents!==undefined||p.funding_mode!==undefined))||
     p.first_session_hold_cents+p.rest_cents+credit!==p.total_cents||p.per_session_cents*p.sessions!==p.total_cents||
     (mode==='card'&&p.first_session_hold_cents===0)||(mode==='setup'&&(p.first_session_hold_cents!==0||p.rest_cents===0||credit<p.per_session_cents))||(mode==='covered'&&(p.first_session_hold_cents!==0||p.rest_cents!==0||credit!==p.total_cents))||(credit>0&&!p.funding_mode))fail();
  return {...Object.fromEntries([...keys, 'discount_applied'].map(key => [key, p[key]])),...(p.credit_reserved_cents===undefined?{}:{credit_reserved_cents:credit}),...(p.funding_mode===undefined?{}:{funding_mode:mode})};
}
export function parseSlots(raw, centre) {
  if (!object(raw) || raw.centre !== centre || !Array.isArray(raw.by_coach) || !object(raw.window) || !instant(raw.window.earliest) || !instant(raw.window.before) || !integer(raw.window.max_weeks, 1, 104)) fail();
  const coaches = raw.by_coach.map(c => {
    if (!object(c) || !uuid(c.profile_id) || !text(c.display_name, 120) || !Array.isArray(c.slots) || !Array.isArray(c.coaches_what)) fail();
    const slots = c.slots.map(slot => {
      const s = slot.series_check;
      if (!instant(slot.starts_at) || !instant(slot.ends_at) || Date.parse(slot.ends_at) <= Date.parse(slot.starts_at) || !object(s) || typeof s.ready !== 'boolean' || !integer(s.requested_weeks, 1, 104) || !integer(s.actual_sessions, 1, 104) || !Array.isArray(s.dates) || s.dates.length !== s.actual_sessions || !Array.isArray(s.flagged) || !Array.isArray(s.blocked) || !Array.isArray(s.skipped_dates)) fail();
      const alt = a => { if (!a) return null; if (!uuid(a.profile_id) || !instant(a.starts_at) || !instant(a.ends_at)) fail(); return { profile_id: a.profile_id, starts_at: a.starts_at, ends_at: a.ends_at }; };
      const dates = s.dates.map(d => { if (!validDate(d.date) || !instant(d.starts_at) || !instant(d.ends_at)) fail(); return { date: d.date, starts_at: d.starts_at, ends_at: d.ends_at }; });
      const flagged = s.flagged.map(f => { if (!validDate(f.date) || f.kind !== 'school_holiday' || !text(f.reason_plain, 500)) fail(); return { date: f.date, kind: f.kind, reason_plain: f.reason_plain }; });
      const blocked = s.blocked.map(b => { if (!validDate(b.date) || !text(b.kind, 80) || !text(b.reason_plain, 500) || typeof b.auto_skipped !== 'boolean') fail(); return { date: b.date, kind: b.kind, reason_plain: b.reason_plain, auto_skipped: b.auto_skipped, alternative: alt(b.alternative) }; });
      if (s.skipped_dates.some(d => !validDate(d))) fail();
      const price = parsePrice(slot.price); if (price.sessions !== s.actual_sessions) fail();
      let decision_quote = null;
      if (slot.decision_quote != null) {
        const q = slot.decision_quote;
        if (!object(q) || q.kind !== 'policy_quote' || !instant(q.quoted_at) || !instant(q.confirm_by) || !s.ready || Date.parse(q.confirm_by) < Date.parse(q.quoted_at) || dates.some(date => Date.parse(q.confirm_by) > Date.parse(date.starts_at))) fail();
        decision_quote = { kind: q.kind, quoted_at: q.quoted_at, confirm_by: q.confirm_by };
      }
      return { profile_id: c.profile_id, starts_at: slot.starts_at, ends_at: slot.ends_at, price, decision_quote, series_check: { ready: s.ready, requested_weeks: s.requested_weeks, actual_sessions: s.actual_sessions, dates, flagged, blocked, skipped_dates: s.skipped_dates, add_week: alt(s.add_week) } };
    });
    return { profile_id: c.profile_id, display_name: c.display_name, home_centre: c.home_centre, coaches_what: c.coaches_what.filter(f => Object.hasOwn(FOCUS_LABELS, f)), slots };
  });
  return { centre, by_coach: coaches, window: { earliest: raw.window.earliest, before: raw.window.before, max_weeks: raw.window.max_weeks } };
}
export function deepLink(search, catalog) {
  const p = new URLSearchParams(search), out = {};
  if (catalog.centres.some(c => c.slug === p.get('centre'))) out.centre = p.get('centre');
  const coach = catalog.coaches.find(c => c.slug === p.get('coach') && (!out.centre || c.centres.includes(out.centre)));
  if (coach) out.profile_id = coach.profile_id;
  if (catalog.durations_minutes.includes(Number(p.get('duration')))) out.duration_minutes = Number(p.get('duration'));
  if (catalog.focus.includes(p.get('focus'))) out.focus = p.get('focus');
  if (['one_on_one', 'group'].includes(p.get('kind'))) out.kind = p.get('kind');
  if (out.kind === 'group' && catalog.group_sizes.includes(Number(p.get('group_size')))) out.group_size = Number(p.get('group_size'));
  if (!out.kind) out.kind = 'one_on_one';
  const start = p.get('start');
  if (start && /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d$/.test(start) && validDate(start.slice(0, 10))) out.start_hint = start;
  out.goals = [...new Set((p.get('goals') ?? '').split(',').filter(key => Object.hasOwn(GOALS, key)))].slice(0, 4);
  out.source_page = coach ? `/coaches/${coach.slug}` : '/book';
  return out;
}
export function searchIntent(draft, from, to, overrides = {}) {
  return { centre: draft.centre, from, to, kind: draft.kind, ...(draft.kind === 'group' ? { group_size: draft.group_size } : {}), focus: draft.focus, machine: draft.focus === 'batting' ? draft.machine : 'either', duration_minutes: draft.duration_minutes, weeks: draft.weeks, skip_dates: draft.skip_dates, ...overrides };
}
export function matchingSlot(result, draft) { return result?.by_coach.find(c => c.profile_id === draft.profile_id)?.slots.find(s => s.starts_at === draft.starts_at) ?? null; }
export const emptyDraft = () => ({ centre: '', kind: '', group_size: null, focus: '', machine: 'either', duration_minutes: null, profile_id: '', starts_at: '', weeks: 1, skip_dates: [], goals: [], source_page: '/book', players: [{ name: '', age: '' }], parent: { name: '', email: '', mobile: '' }, note: '', consent_save_card: false });
export function playerProblem(draft) {
  const size = draft.kind === 'group' ? draft.group_size : 1;
  if (!size || draft.players.length !== size || draft.players.some(p => !p.name.trim() || p.name.length > 120 || !/^\d{1,3}$/.test(String(p.age)) || Number(p.age) > 120)) return 'Enter every player’s name and age.';
  if ((size > 1 || draft.players.some(p => Number(p.age) < 18)) && !draft.parent.name.trim()) return 'Enter the parent or person booking’s name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.parent.email) || draft.parent.email.length > 254) return 'Enter a valid email address.';
  if (!/^[+\d ()-]{7,30}$/.test(draft.parent.mobile) || draft.parent.mobile.replace(/\D/g, '').length < 7) return 'Enter a valid mobile number.';
  return '';
}
export function requestIntent(draft, slot) {
  if (!['mickleham', 'cranbourne-north'].includes(draft.centre) || !uuid(draft.profile_id) || !instant(draft.starts_at) || !['one_on_one', 'group'].includes(draft.kind) || (draft.kind === 'group' && ![2, 3, 4].includes(draft.group_size)) || !Object.hasOwn(FOCUS_LABELS, draft.focus) || !['yes', 'no', 'either'].includes(draft.machine) || ![60, 90, 120].includes(draft.duration_minutes) || !integer(draft.weeks, 1, 104) || !Array.isArray(draft.skip_dates) || draft.skip_dates.length > 104 || draft.skip_dates.some(d => !validDate(d)) || !text(draft.note, 3000) || !text(draft.parent.name, 120) || !/^\/(?:book|coaches\/[a-z0-9-]+)$/.test(draft.source_page) || playerProblem(draft) || !slot?.series_check.ready || slot.profile_id !== draft.profile_id || slot.starts_at !== draft.starts_at || !draft.consent_save_card) return null;
  return { centre: draft.centre, profile_id: slot.profile_id, starts_at: slot.starts_at, duration_minutes: draft.duration_minutes, weeks: draft.weeks, skip_dates: [...draft.skip_dates], kind: draft.kind, ...(draft.kind === 'group' ? { group_size: draft.group_size } : {}), focus: draft.focus, machine: draft.focus === 'batting' ? draft.machine : 'either', players: draft.players.map(p => ({ name: p.name.trim(), age: Number(p.age) })), parent: { name: draft.parent.name.trim() || draft.players[0].name.trim(), email: draft.parent.email.trim(), mobile: draft.parent.mobile.trim() }, note: draft.note.trim(), goals: draft.goals.filter(key => Object.hasOwn(GOALS, key)).slice(0, 4), source_page: draft.source_page, consent_save_card: true };
}
export function recoveredIntent(attempt) {
  try {
    const raw = JSON.parse(attempt.payload);
    const draft = { ...emptyDraft(), ...Object.fromEntries(['centre', 'profile_id', 'starts_at', 'duration_minutes', 'weeks', 'skip_dates', 'kind', 'group_size', 'focus', 'machine', 'players', 'parent', 'note', 'goals', 'source_page', 'consent_save_card'].filter(key => Object.hasOwn(raw, key)).map(key => [key, raw[key]])) };
    return requestIntent(draft, { profile_id: draft.profile_id, starts_at: draft.starts_at, series_check: { ready: true } });
  } catch { return null; }
}
