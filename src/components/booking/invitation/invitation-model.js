// Pure940 wire decoder copy, generated from sibling supabase/functions/_shared/private-card-invitation-contract.ts.
// Keep the two modules aligned; no dependency on the Admin repository at runtime.
const isSessionId = (v) => typeof v === 'string' && /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/.exec(v)?.[0] === v;
const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Melbourne', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
function melbourneDateTimeInput(value) { const parts = formatter.formatToParts(new Date(value)), part = (key) => parts.find(x => x.type === key).value; return `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}`; }
const MAX_BYTES = 262144;
const object = (v) => v !== null && typeof v === 'object' && !Array.isArray(v) && [Object.prototype, null].includes(Object.getPrototypeOf(v));
const exact = (v, required, optional = []) => object(v) && required.every(k => Object.hasOwn(v, k)) && Object.keys(v).every(k => [...required, ...optional].includes(k));
const text = (v, max, min = 0) => typeof v === 'string' && v.length <= max && v.trim().length >= min;
const int = (v, min = 0, max = Number.MAX_SAFE_INTEGER) => typeof v === 'number' && Number.isSafeInteger(v) && v >= min && v <= max;
const one = (v, values) => typeof v === 'string' && values.includes(v);
const modes = ['recorded', 'covered', 'card', 'setup'];
const states = ['checkout', 'requested', 'venue_told', 'confirmed', 'declined', 'expired', 'cancelled'];
const payments = ['checkout_pending', 'setup_pending', 'authorized', 'card_saved', 'covered', 'capture_pending', 'capture_failed', 'rest_pending', 'paid', 'owing', 'release_pending', 'released', 'reconcile'];
const priceKeys = ['per_session_cents', 'sessions', 'discount_applied', 'first_session_hold_cents', 'rest_cents', 'total_cents'];
const reasonKinds = ['horizon', 'notice', 'closure', 'centre_hours', 'coach_eligibility', 'coach_away', 'coach_hours', 'occupied'];
function bounded(value, maxBytes = MAX_BYTES, maxNodes = 12000) {
    let nodes = 0;
    function json(v, depth) {
        if (++nodes > maxNodes || depth > 16)
            return false;
        if (v === null || typeof v === 'boolean' || typeof v === 'string')
            return true;
        if (typeof v === 'number')
            return Number.isFinite(v);
        if (Array.isArray(v))
            return Object.keys(v).length === v.length && Reflect.ownKeys(v).length === v.length + 1 && v.every(x => json(x, depth + 1));
        return object(v) && Reflect.ownKeys(v).length === Object.keys(v).length && Object.values(v).every(x => json(x, depth + 1));
    }
    try {
        return json(value, 0) && new TextEncoder().encode(JSON.stringify(value)).length <= maxBytes;
    }
    catch {
        return false;
    }
}
function date(v) { return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.exec(v)?.[0] === v && Number.isFinite(Date.parse(v + 'T00:00:00Z')) && new Date(v + 'T00:00:00Z').toISOString().slice(0, 10) === v; }
function stamp(v) { return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,6})?(?:Z|[+-](?:0\d|1[0-5]):[0-5]\d)$/.exec(v)?.[0] === v && date(v.slice(0, 10)) && Number.isFinite(Date.parse(v)); }
const micros = (v) => BigInt(Date.parse(v)) * BigInt(1000) + BigInt((/\.(\d+)/.exec(v)?.[1] ?? '').padEnd(6, '0').slice(3));
const datesOnly = (v) => Array.isArray(v) && v.length <= 104 && v.every(date) && new Set(v).size === v.length && v.every((d, i) => i === 0 || d > v[i - 1]);
function dates(v) {
    return Array.isArray(v) && v.length <= 104 && v.every((d, i) => exact(d, ['date', 'starts_at', 'ends_at']) && date(d.date) && stamp(d.starts_at) && stamp(d.ends_at) && micros(d.ends_at) > micros(d.starts_at) && melbourneDateTimeInput(d.starts_at).slice(0, 10) === d.date && (i === 0 || micros(d.starts_at) > micros(v[i - 1].starts_at)));
}
function flags(v) { return Array.isArray(v) && v.length <= 104 && v.every(f => exact(f, ['date', 'kind', 'reason_plain']) && date(f.date) && f.kind === 'school_holiday' && text(f.reason_plain, 200, 1)) && new Set(v.map(f => f.date)).size === v.length; }
function alternative(v) { return exact(v, ['profile_id', 'starts_at', 'ends_at']) && isSessionId(v.profile_id) && stamp(v.starts_at) && stamp(v.ends_at) && micros(v.ends_at) > micros(v.starts_at); }
function series(v) {
    if (!exact(v, ['ready', 'requested_weeks', 'ok_dates', 'dates', 'flagged', 'blocked', 'skipped_dates', 'add_week', 'actual_sessions']) || typeof v.ready !== 'boolean' || !int(v.requested_weeks, 1, 104) || !datesOnly(v.ok_dates) || !dates(v.dates) || !flags(v.flagged) || !datesOnly(v.skipped_dates) || !(v.add_week === null || alternative(v.add_week)) || !int(v.actual_sessions, 0, 104) || !Array.isArray(v.blocked) || v.blocked.length > 104)
        return false;
    if (!v.blocked.every(b => exact(b, ['date', 'kind', 'reason_plain', 'auto_skipped'], ['alternative']) && date(b.date) && one(b.kind, reasonKinds) && text(b.reason_plain, 200, 1) && typeof b.auto_skipped === 'boolean' && b.auto_skipped === (b.kind === 'closure') && (!Object.hasOwn(b, 'alternative') || alternative(b.alternative))))
        return false;
    const ok = v.ok_dates, skipped = v.skipped_dates;
    return v.actual_sessions === v.dates.length && v.ok_dates.length === v.dates.length && v.dates.every((d, i) => d.date === ok[i] && !skipped.includes(d.date)) && new Set(v.blocked.map(b => b.date)).size === v.blocked.length && v.blocked.every(b => !ok.includes(b.date) && (!b.auto_skipped || skipped.includes(b.date))) && (!v.ready || v.actual_sessions > 0 && v.blocked.every(b => b.auto_skipped)) && v.ok_dates.length + v.skipped_dates.length + v.blocked.filter(b => !b.auto_skipped).length === v.requested_weeks;
}
function price(v, retained = false) {
    if (!exact(v, retained ? [...priceKeys, 'actual_dates', 'skipped_dates', 'flagged'] : priceKeys, retained ? ['credit_reserved_cents', 'funding_mode'] : []) || !int(v.per_session_cents, 1) || !int(v.sessions, 1, 104) || typeof v.discount_applied !== 'boolean' || !int(v.first_session_hold_cents) || !int(v.rest_cents) || !int(v.total_cents, 1))
        return false;
    const credit = v.credit_reserved_cents ?? 0;
    if (!int(credit) || !Number.isSafeInteger(v.per_session_cents * v.sessions) || v.per_session_cents * v.sessions !== v.total_cents || v.first_session_hold_cents + v.rest_cents + credit !== v.total_cents)
        return false;
    if (!retained)
        return v.first_session_hold_cents === v.per_session_cents;
    if (!dates(v.actual_dates) || v.actual_dates.length !== v.sessions || !datesOnly(v.skipped_dates) || !flags(v.flagged) || (v.funding_mode !== undefined && !one(v.funding_mode, modes)) || credit > 0 && v.funding_mode === undefined)
        return false;
    return v.funding_mode === 'covered' ? credit === v.total_cents && v.first_session_hold_cents === 0 && v.rest_cents === 0 : v.funding_mode === 'setup' ? v.first_session_hold_cents === 0 && v.rest_cents > 0 : v.first_session_hold_cents > 0;
}
const headerKeys = ['schema_version', 'invitation_id', 'proposal_version', 'expires_at', 'expires_in_seconds'];
const staffHeaderKeys = ['invitation_id', 'proposal_version', 'revision', 'phase', 'delivery_state', 'acceptance_state', 'expired', 'issuance_blocked', 'recipient_masked', 'prepared_at', 'issued_at', 'expires_at', 'request_id'];
const goals = ['batting', 't20-cricket', 'all-round-development', 'batting-technique', 'building-an-innings', 'school-cricket', 'wicketkeeping', 'top-order-batting', 'small-group-batting', 'club-batting'];
const goalList = (v) => Array.isArray(v) && v.length <= 4 && v.every(g => one(g, goals)) && new Set(v).size === v.length;
const email = (v) => text(v, 254, 5) && v === v.trim().toLowerCase() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const mask = (v) => text(v, 254, 3) && v.includes('*') && !/\s/.test(v);
const clone = (v) => structuredClone(v);
export function isCardInvitationToken(v) { return typeof v === 'string' && /^pci1\.[a-f0-9]{64}$/.exec(v)?.[0] === v; }
export function isCardInvitationReview(v) { if (typeof v !== 'string' || v.length > 128 || /^ci1\.[a-f0-9]{64}\.[0-9]{1,19}$/.exec(v)?.[0] !== v)
    return false; const n = BigInt(v.split('.')[2]); return n > BigInt(0) && n <= BigInt('9223372036854775807'); }
export function isCardInvitationProposal(v) {
    if (!bounded(v) || !exact(v, ['centre', 'profile_id', 'starts_at', 'duration_minutes', 'weeks', 'skip_dates', 'kind', 'focus', 'machine', 'goals', 'source_page', 'players', 'staff_note'], ['group_size']) || !one(v.centre, ['mickleham', 'cranbourne-north']) || !isSessionId(v.profile_id) || !stamp(v.starts_at) || ![60, 90, 120].includes(v.duration_minutes) || !int(v.weeks, 1, 104) || !datesOnly(v.skip_dates) || !one(v.kind, ['one_on_one', 'group']) || !one(v.focus, ['batting', 'pace', 'spin', 'keeping', 'allround']) || !one(v.machine, ['yes', 'no', 'either']) || !goalList(v.goals) || !text(v.source_page, 200, 1) || !/^\/(?:[A-Za-z0-9_-]+\/?)*$/.test(v.source_page) || !text(v.staff_note, 3000) || v.staff_note !== v.staff_note.trim() || !Array.isArray(v.players) || v.players.length < 1 || v.players.length > 4)
        return false;
    return (v.kind === 'one_on_one' ? v.players.length === 1 && !Object.hasOwn(v, 'group_size') : [2, 3, 4].includes(v.group_size) && v.players.length === v.group_size) && v.players.every(p => exact(p, ['name', 'age']) && text(p.name, 120, 1) && p.name === p.name.trim() && int(p.age, 0, 120));
}
export function isCardInvitationFamilyFields(v, accept = false) { return bounded(v) && exact(v, ['parent', 'note', 'confirm_players', 'consent_save_card']) && exact(v.parent, ['name', 'email', 'phone']) && text(v.parent.name, 120, 1) && v.parent.name === v.parent.name.trim() && email(v.parent.email) && text(v.parent.phone, 30, 7) && v.parent.phone === v.parent.phone.trim() && /^[+\d ()-]+$/.test(v.parent.phone) && text(v.note, 3000) && v.note === v.note.trim() && typeof v.confirm_players === 'boolean' && typeof v.consent_save_card === 'boolean' && (!accept || v.confirm_players === true && v.consent_save_card === true); }
function header(v, ref) { return v.schema_version === 1 && isSessionId(v.invitation_id) && v.proposal_version === 1 && stamp(v.expires_at) && int(v.expires_in_seconds, 0, 86400) && (!ref || isSessionId(ref.invitation) && ref.proposalVersion === 1 && v.invitation_id === ref.invitation && v.proposal_version === ref.proposalVersion); }
export function decodeCardInvitationPreview(raw) {
    if (!bounded(raw) || !exact(raw, [...headerKeys, 'state', 'centre', 'coach', 'booking', 'participants', 'recipient_masked']) || !header(raw) || raw.state !== 'ready' || !exact(raw.centre, ['slug', 'name']) || !one(raw.centre.slug, ['mickleham', 'cranbourne-north']) || !text(raw.centre.name, 200, 1) || !exact(raw.coach, ['display_name']) || !text(raw.coach.display_name, 200, 1) || !mask(raw.recipient_masked) || !exact(raw.booking, ['starts_at', 'duration_minutes', 'weeks', 'skip_dates', 'kind', 'group_size', 'focus', 'machine', 'goals']))
        return null;
    const b = raw.booking;
    if (!stamp(b.starts_at) || ![60, 90, 120].includes(b.duration_minutes) || !int(b.weeks, 1, 104) || !datesOnly(b.skip_dates) || !one(b.kind, ['one_on_one', 'group']) || !one(b.focus, ['batting', 'pace', 'spin', 'keeping', 'allround']) || !one(b.machine, ['yes', 'no', 'either']) || !goalList(b.goals) || !Array.isArray(raw.participants) || raw.participants.length < 1 || raw.participants.length > 4 || !raw.participants.every(p => exact(p, ['first_name', 'surname_initial', 'age']) && text(p.first_name, 120, 1) && !/\s/.test(p.first_name) && (p.surname_initial === null || typeof p.surname_initial === 'string' && Array.from(p.surname_initial).length === 1 && !/\s/.test(p.surname_initial)) && int(p.age, 0, 120)) || (b.kind === 'one_on_one' ? b.group_size !== null || raw.participants.length !== 1 : ![2, 3, 4].includes(b.group_size) || raw.participants.length !== b.group_size))
        return null;
    return clone(raw);
}
export function decodeCardInvitationQuote(raw, ref) {
    if (!bounded(raw) || !object(raw) || !header(raw, ref) || !stamp(raw.as_of) || !stamp(ref.startsAt) || ![60, 90, 120].includes(ref.durationMinutes) || !int(ref.weeks, 1, 104) || !int(ref.participants, 1, 4))
        return null;
    const base = [...headerKeys, 'state', 'as_of'];
    if (raw.state === 'unavailable')
        return exact(raw, [...base, 'code']) && raw.code === 'slot_taken' ? clone(raw) : null;
    if (!exact(raw, [...base, 'price', 'series_check', 'decision_quote', 'funding', 'review', 'consent_version', 'participant_confirmation_required', 'card_consent_required']) || raw.state !== 'quoted' || !price(raw.price) || !series(raw.series_check) || !raw.series_check.ready || raw.series_check.requested_weeks !== ref.weeks || raw.price.sessions !== raw.series_check.actual_sessions || raw.series_check.add_week !== null || raw.series_check.blocked.some(b => b.alternative !== undefined) || !exact(raw.decision_quote, ['kind', 'quoted_at', 'confirm_by']) || raw.decision_quote.kind !== 'policy_quote' || !stamp(raw.decision_quote.quoted_at) || !stamp(raw.decision_quote.confirm_by) || micros(raw.decision_quote.quoted_at) !== micros(raw.as_of) || micros(raw.decision_quote.confirm_by) <= micros(raw.as_of) || !exact(raw.funding, ['funding_mode', 'first_due_cents', 'rest_due_cents', 'credit_applied_cents']) || raw.funding.funding_mode !== 'card' || raw.funding.credit_applied_cents !== 0 || raw.funding.first_due_cents !== raw.price.first_session_hold_cents || raw.funding.rest_due_cents !== raw.price.rest_cents || !isCardInvitationReview(raw.review) || raw.consent_version !== 'private_save_card_v1' || raw.participant_confirmation_required !== true || raw.card_consent_required !== true)
        return null;
    const startDay = melbourneDateTimeInput(ref.startsAt).slice(0, 10), localTime = melbourneDateTimeInput(ref.startsAt).slice(11);
    for (const d of raw.series_check.dates) {
        const days = (Date.parse(d.date + 'T00:00:00Z') - Date.parse(startDay + 'T00:00:00Z')) / 86400000;
        if (days < 0 || days >= ref.weeks * 7 || days % 7 !== 0 || melbourneDateTimeInput(d.starts_at).slice(11) !== localTime || micros(d.ends_at) - micros(d.starts_at) !== BigInt(ref.durationMinutes * 60000000) || micros(d.starts_at) <= micros(raw.as_of) || micros(raw.decision_quote.confirm_by) > micros(d.starts_at))
            return null;
    }
    for (const day of [...raw.series_check.skipped_dates, ...raw.series_check.blocked.map(b => b.date), ...raw.series_check.flagged.map(f => f.date)]) {
        const days = (Date.parse(day + 'T00:00:00Z') - Date.parse(startDay + 'T00:00:00Z')) / 86400000;
        if (days < 0 || days >= ref.weeks * 7 || days % 7 !== 0)
            return null;
    }
    return clone(raw);
}
export function decodeCardInvitationQuoteProjection(raw) {
    if (!object(raw) || !isSessionId(raw.invitation_id) || raw.proposal_version !== 1)
        return null;
    if (raw.state === 'unavailable')
        return decodeCardInvitationQuote(raw, { invitation: raw.invitation_id, proposalVersion: 1, startsAt: '2000-01-01T00:00:00Z', durationMinutes: 60, weeks: 1, participants: 1 });
    if (!object(raw.series_check) || !dates(raw.series_check.dates) || !raw.series_check.dates.length || !int(raw.series_check.requested_weeks, 1, 104))
        return null;
    const first = raw.series_check.dates[0], minutes = Number((micros(first.ends_at) - micros(first.starts_at)) / BigInt(60000000));
    if (![60, 90, 120].includes(minutes))
        return null;
    if (!series(raw.series_check))
        return null;
    const allDays = [...raw.series_check.ok_dates, ...raw.series_check.skipped_dates, ...raw.series_check.blocked.map(b => b.date)].sort(), day = allDays[0];
    if (!day)
        return null;
    const wall = day + 'T' + melbourneDateTimeInput(first.starts_at).slice(11), utc = Date.parse(wall + ':00Z');
    const offsets = new Set([-36, 0, 36].map(hours => { const instant = utc + hours * 3600000; return Date.parse(melbourneDateTimeInput(new Date(instant).toISOString()) + ':00Z') - instant; }));
    const instants = [...offsets].map(offset => new Date(utc - offset).toISOString()).filter(value => melbourneDateTimeInput(value) === wall);
    if (instants.length !== 1)
        return null;
    return decodeCardInvitationQuote(raw, { invitation: raw.invitation_id, proposalVersion: 1, startsAt: instants[0], durationMinutes: minutes, weeks: raw.series_check.requested_weeks, participants: 1 });
}
function original(raw, ref) {
    if (!bounded(raw) || !exact(raw, ['schema_version', 'receipt_kind', 'invitation_id', 'proposal_version', 'request', 'payload_verified', 'at', 'outcome', 'saved', 'canonical_submission', 'request_id', 'result']) || raw.schema_version !== 1 || raw.receipt_kind !== 'original_invitation_submission' || !isSessionId(ref.invitation) || ref.proposalVersion !== 1 || raw.invitation_id !== ref.invitation || raw.proposal_version !== ref.proposalVersion || !isSessionId(ref.nonce) || raw.request !== ref.nonce || raw.payload_verified !== true || !stamp(raw.at) || !object(raw.result))
        return null;
    const r = raw.result;
    if (raw.outcome === 'unavailable')
        return raw.saved === false && raw.canonical_submission === false && raw.request_id === null && exact(r, ['state', 'code']) && r.state === 'unavailable' && one(r.code, ['slot_taken', 'review_required', 'invitation_unavailable']) ? clone(raw) : null;
    if (raw.outcome === 'needs_review')
        return raw.saved === false && raw.canonical_submission === true && raw.request_id === null && exact(r, ['state', 'receipt', 'call_by', 'call_by_plain']) && r.state === 'needs_review' && r.receipt === ref.nonce && stamp(r.call_by) && text(r.call_by_plain, 150, 1) ? clone(raw) : null;
    if (raw.outcome !== 'accepted' || raw.saved !== true || raw.canonical_submission !== true || !isSessionId(raw.request_id) || !exact(r, ['request_id', 'state', 'payment_state', 'revision', 'funding_mode', 'price', 'dates', 'expires_at', 'expires_in_seconds', 'confirm_by', 'call_by_plain']) || r.request_id !== raw.request_id || r.state !== 'checkout' || r.payment_state !== 'checkout_pending' || !int(r.revision, 1) || r.funding_mode !== 'card' || !price(r.price, true) || !dates(r.dates) || !r.dates.length || !stamp(r.expires_at) || !int(r.expires_in_seconds, 0, 2678400) || r.confirm_by !== null || r.call_by_plain !== null)
        return null;
    const p = r.price;
    if ((p.credit_reserved_cents ?? 0) !== 0 || (p.funding_mode ?? 'card') !== 'card' || p.first_session_hold_cents !== p.per_session_cents || p.sessions !== r.dates.length || JSON.stringify(p.actual_dates) !== JSON.stringify(r.dates))
        return null;
    return clone(raw);
}
export function decodeCardInvitationOriginalReceipt(raw, ref) { if (!ref || !isSessionId(ref.invitation) || ref.proposalVersion !== 1 || !isSessionId(ref.nonce) || !bounded(raw) || !object(raw) || raw.schema_version !== 1)
    return null; if (raw.receipt_state === 'not_found')
    return exact(raw, ['schema_version', 'receipt_state']) ? clone(raw) : null; if (!exact(raw, ['schema_version', 'receipt_state', 'receipt']) || raw.receipt_state !== 'found')
    return null; const receipt = original(raw.receipt, ref); return receipt ? { schema_version: 1, receipt_state: 'found', receipt } : null; }
export function decodeCardInvitationAccept(raw, ref) { if (!object(raw) || typeof raw.replayed !== 'boolean')
    return null; const { replayed, ...rest } = raw; const parsed = original(rest, ref); return parsed ? { ...parsed, replayed } : null; }
function checkout(v) { if (typeof v !== 'string' || v.length > 4096 || /[\u0000-\u0020\u007f-\u009f]/.test(v) || /^[^#]*\?/.test(v))
    return false; try {
    const u = new URL(v);
    return u.origin === 'https://checkout.stripe.com' && !u.username && !u.password && !u.search && /^\/c\/pay\/cs_(?:test|live)_[A-Za-z0-9]+$/.test(u.pathname);
}
catch {
    return false;
} }
export function decodeCardInvitationCurrent(raw, ref) {
    if (!bounded(raw) || !object(raw) || !header(raw, ref) || raw.view_kind !== 'current_invitation_request' || raw.original_receipt !== false)
        return null;
    const base = [...headerKeys, 'view_kind', 'original_receipt', 'state', 'request_id', 'checkout_state', 'checkout_url'];
    if (raw.state === 'needs_review')
        return exact(raw, base) && raw.request_id === null && raw.checkout_state === 'none' && raw.checkout_url === null ? clone(raw) : null;
    if (!exact(raw, [...base, 'revision', 'request_state', 'payment_state']) || raw.state !== 'request' || !isSessionId(raw.request_id) || !int(raw.revision, 1) || !one(raw.request_state, states) || !one(raw.payment_state, payments) || !one(raw.checkout_state, ['preparing', 'ready', 'closed']) || !(raw.checkout_url === null || checkout(raw.checkout_url)) || (raw.checkout_state === 'ready') !== (raw.checkout_url !== null) || raw.checkout_state !== 'closed' && (raw.request_state !== 'checkout' || raw.payment_state !== 'checkout_pending' || raw.expires_in_seconds === 0) || ['setup_pending', 'card_saved', 'covered'].includes(raw.payment_state) || raw.request_state === 'checkout' && !['checkout_pending', 'reconcile'].includes(raw.payment_state) || ['requested', 'venue_told', 'confirmed'].includes(raw.request_state) && raw.payment_state === 'checkout_pending')
        return null;
    return clone(raw);
}
function staffHeader(v) {
    if (!exact(v, staffHeaderKeys) || !isSessionId(v.invitation_id) || v.proposal_version !== 1 || !int(v.revision, 1) || !one(v.phase, ['draft', 'issued', 'revoked', 'consumed']) || !one(v.delivery_state, ['not_issued', 'pending', 'claimed_unresolved', 'unknown', 'smtp_accepted', 'smtp_refused', 'reconciled_accepted']) || !one(v.acceptance_state, ['none', 'accepted', 'needs_review']) || typeof v.expired !== 'boolean' || typeof v.issuance_blocked !== 'boolean' || !mask(v.recipient_masked) || !stamp(v.prepared_at) || !(v.issued_at === null || stamp(v.issued_at)) || !(v.expires_at === null || stamp(v.expires_at)) || !(v.request_id === null || isSessionId(v.request_id)))
        return false;
    return (v.acceptance_state === 'accepted') === (v.request_id !== null) && !(v.phase === 'draft' && (v.delivery_state !== 'not_issued' || v.issued_at !== null || v.expires_at !== null || v.acceptance_state !== 'none')) && !(v.phase === 'consumed' && v.acceptance_state === 'none') && !(v.acceptance_state !== 'none' && !['consumed', 'revoked'].includes(v.phase));
}
export function decodeStaffCardInvitations(raw, ref) {
    if (!bounded(raw, 1048576, 120000) || !exact(raw, ['schema_version', 'centre_id', 'inquiry_id', 'inquiry_revision', 'complete', 'invitations']) || raw.schema_version !== 1 || !isSessionId(ref.centre) || !isSessionId(ref.inquiry) || !int(ref.inquiryRevision, 1) || raw.centre_id !== ref.centre || raw.inquiry_id !== ref.inquiry || raw.inquiry_revision !== ref.inquiryRevision || raw.complete !== true || !Array.isArray(raw.invitations) || raw.invitations.length > 1000)
        return null;
    if (!raw.invitations.every(v => { if (!exact(v, [...staffHeaderKeys, 'proposal', 'recipient']))
        return false; const { proposal, recipient, ...h } = v; return staffHeader(h) && isCardInvitationProposal(proposal) && email(recipient); }) || new Set(raw.invitations.map(v => v.invitation_id)).size !== raw.invitations.length)
        return null;
    return clone(raw);
}
function staffReceipt(raw, ref) {
    if (!bounded(raw) || !exact(raw, ['schema_version', 'receipt_kind', 'request', 'operation', 'actor_id', 'centre_id', 'inquiry_id', 'invitation_id', 'payload_verified', 'at', 'result']) || raw.schema_version !== 1 || raw.receipt_kind !== 'staff_card_invitation_command' || !isSessionId(ref.actor) || !isSessionId(ref.centre) || !isSessionId(ref.inquiry) || !isSessionId(ref.nonce) || raw.request !== ref.nonce || raw.actor_id !== ref.actor || raw.centre_id !== ref.centre || raw.inquiry_id !== ref.inquiry || !one(ref.operation, ['prepare', 'issue', 'revoke']) || raw.operation !== ref.operation || !isSessionId(raw.invitation_id) || ref.invitation !== undefined && raw.invitation_id !== ref.invitation || raw.payload_verified !== true || !stamp(raw.at) || !staffHeader(raw.result) || raw.result.invitation_id !== raw.invitation_id)
        return null;
    if (raw.operation === 'prepare' && raw.result.phase !== 'draft' || raw.operation === 'issue' && raw.result.phase !== 'issued' || raw.operation === 'revoke' && raw.result.phase !== 'revoked')
        return null;
    return clone(raw);
}
export function decodeStaffCardInvitationReceipt(raw, ref) { if (!ref || !isSessionId(ref.actor) || !isSessionId(ref.centre) || !isSessionId(ref.inquiry) || !isSessionId(ref.nonce) || !one(ref.operation, ['prepare', 'issue', 'revoke']) || (ref.invitation !== undefined && !isSessionId(ref.invitation)) || !bounded(raw) || !object(raw) || raw.schema_version !== 1)
    return null; if (raw.receipt_state === 'not_found')
    return exact(raw, ['schema_version', 'receipt_state']) ? clone(raw) : null; if (!exact(raw, ['schema_version', 'receipt_state', 'receipt']) || raw.receipt_state !== 'found')
    return null; const receipt = staffReceipt(raw.receipt, ref); return receipt ? { schema_version: 1, receipt_state: 'found', receipt } : null; }
export function decodeStaffCardInvitationWriter(raw, ref) { if (!object(raw) || typeof raw.replayed !== 'boolean')
    return null; const { replayed, ...rest } = raw; const receipt = staffReceipt(rest, ref); return receipt ? { ...receipt, replayed } : null; }
