import { emptyDraft, GOALS, uuid } from './booking-model';
const KEY = 'rra.private-booking.tab-draft.v1';
export const DRAFT_LIFETIME = 2 * 60 * 60 * 1000;
const bounded = (value, max) => typeof value === 'string' ? value.slice(0, max) : '';
function safeDraft(raw) {
  if (!raw || typeof raw !== 'object') return emptyDraft();
  return { ...emptyDraft(), centre: ['mickleham', 'cranbourne-north'].includes(raw.centre) ? raw.centre : '', kind: ['one_on_one', 'group'].includes(raw.kind) ? raw.kind : '', group_size: [2, 3, 4].includes(raw.group_size) ? raw.group_size : null, focus: ['batting', 'pace', 'spin', 'keeping', 'allround'].includes(raw.focus) ? raw.focus : '', machine: ['yes', 'no', 'either'].includes(raw.machine) ? raw.machine : 'either', duration_minutes: [60, 90, 120].includes(raw.duration_minutes) ? raw.duration_minutes : null, profile_id: uuid(raw.profile_id) ? raw.profile_id : '', starts_at: typeof raw.starts_at === 'string' && /^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(raw.starts_at) && Number.isFinite(Date.parse(raw.starts_at)) ? raw.starts_at.slice(0, 50) : '', weeks: Number.isInteger(raw.weeks) && raw.weeks > 0 && raw.weeks <= 104 ? raw.weeks : 1, skip_dates: Array.isArray(raw.skip_dates) ? raw.skip_dates.filter(d => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)).slice(0, 104) : [], goals: Array.isArray(raw.goals) ? raw.goals.filter(key => Object.hasOwn(GOALS, key)).slice(0, 4) : [], source_page: typeof raw.source_page === 'string' && /^\/(?:book|coaches\/[a-z0-9-]+)$/.test(raw.source_page) ? raw.source_page : '/book', players: Array.isArray(raw.players) && raw.players.length > 0 ? raw.players.slice(0, 4).map(p => ({ name: bounded(p?.name, 120), age: bounded(String(p?.age ?? ''), 3) })) : [{ name: '', age: '' }], parent: { name: bounded(raw.parent?.name, 120), email: bounded(raw.parent?.email, 254), mobile: bounded(raw.parent?.mobile, 30) }, note: bounded(raw.note, 3000), consent_save_card: false };
}
export function readDraft(storage, now = Date.now(), key = KEY) {
  try { const store = storage ?? globalThis.sessionStorage, encoded = store.getItem(key); if (encoded?.length > 16384) { store.removeItem(key); return null; } const saved = JSON.parse(encoded); if (!saved || saved.version !== 1 || !Number.isFinite(saved.saved_at) || saved.saved_at > now || now - saved.saved_at > DRAFT_LIFETIME) { store.removeItem(key); return null; } return safeDraft(saved.draft); } catch { return null; }
}
export function writeDraft(draft, storage, now = Date.now(), key = KEY) {
  try { (storage ?? globalThis.sessionStorage).setItem(key, JSON.stringify({ version: 1, saved_at: now, draft: safeDraft(draft) })); return true; } catch { return false; }
}
export function clearDraft(storage, key = KEY) { try { (storage ?? globalThis.sessionStorage).removeItem(key); } catch { /* The current in-memory draft can still be cleared. */ } }
export const enquiryDraftKey = source => `${KEY}.enquiry.${source.replace(/[^a-z0-9/-]/gi, '').slice(0, 160)}`;
export function readAttempt(scope, storage, now = Date.now()) {
  try { const saved = JSON.parse((storage ?? globalThis.sessionStorage).getItem(`${KEY}.attempt.${scope}`)); return saved && Number.isFinite(saved.saved_at) && uuid(saved.nonce) && typeof saved.payload === 'string' && saved.payload.length <= 16000 && saved.saved_at <= now && now - saved.saved_at <= DRAFT_LIFETIME ? { nonce: saved.nonce, payload: saved.payload } : null; } catch { return null; }
}
export function writeAttempt(scope, attempt, storage, now = Date.now()) { try { const store = storage ?? globalThis.sessionStorage; if (!attempt) store.removeItem(`${KEY}.attempt.${scope}`); else if (uuid(attempt.nonce) && typeof attempt.payload === 'string' && attempt.payload.length <= 16000) store.setItem(`${KEY}.attempt.${scope}`, JSON.stringify({ ...attempt, saved_at: now })); } catch { /* Exact retries remain stable for this mounted form. */ } }
export function requestCheckpoint(value, storage, now = Date.now()) {
  try {
    const store = storage ?? globalThis.sessionStorage, key = KEY + '.request';
    if (value === null) { store.removeItem(key); return null; }
    if (value !== undefined) { if (!uuid(value.request_id) || typeof value.request_token !== 'string' || !/^[A-Za-z\d._~-]{16,1024}$/.test(value.request_token)) return null; store.setItem(key, JSON.stringify({ request_id: value.request_id, request_token: value.request_token, saved_at: now })); return value; }
    const encoded = store.getItem(key); if (encoded?.length > 16384) { store.removeItem(key); return null; } const saved = JSON.parse(encoded);
    if (!saved || !Number.isFinite(saved.saved_at) || !uuid(saved.request_id) || typeof saved.request_token !== 'string' || !/^[A-Za-z\d._~-]{16,1024}$/.test(saved.request_token) || saved.saved_at > now || now - saved.saved_at > DRAFT_LIFETIME) { store.removeItem(key); return null; }
    return { request_id: saved.request_id, request_token: saved.request_token };
  } catch { return null; }
}
