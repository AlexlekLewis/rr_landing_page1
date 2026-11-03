import { expect, it } from 'vitest';
import { emptyDraft } from './booking-model';
import { clearDraft, DRAFT_LIFETIME, readAttempt, readDraft, requestCheckpoint, writeAttempt, writeDraft } from './private-draft';
import { isBookingFlowPath, isPrivateBookingPath, privateBookingAnalytics } from './booking-privacy';
import { id } from './fixtures.test-helper';
const storage = () => { const values = new Map(); return { values, getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key) }; };
it('keeps only bounded form fields in tab storage and never restores card consent', () => {
  const store = storage(); writeDraft({ ...emptyDraft(), parent: { name: 'Test Parent', email: 'test@example.test', mobile: '0400000001' }, consent_save_card: true, request_token: 'secret-token', amount_cents: 1 }, store, 1000);
  const result = readDraft(store, 1001); expect(result.parent.email).toBe('test@example.test'); expect(result.consent_save_card).toBe(false); expect(result).not.toHaveProperty('request_token'); expect(result).not.toHaveProperty('amount_cents');
  expect(JSON.stringify([...store.values.values()])).not.toContain('secret-token');
});
it('expires and clears a saved form instead of extending old PII on read', () => { const store = storage(); writeDraft(emptyDraft(), store, 1000); expect(readDraft(store, 1000 + DRAFT_LIFETIME + 1)).toBeNull(); expect(store.values.size).toBe(0); });
it('tolerates blocked storage and rejects oversized/corrupt input', () => {
  const blocked = { getItem: () => { throw new Error('disabled'); }, setItem: () => { throw new Error('disabled'); }, removeItem: () => {} }; expect(readDraft(blocked)).toBeNull(); expect(writeDraft(emptyDraft(), blocked)).toBe(false); expect(() => clearDraft(blocked)).not.toThrow();
  const store = storage(); writeDraft(emptyDraft(), store, 1000); const key = [...store.values.keys()][0]; store.setItem(key, 'x'.repeat(20000)); expect(readDraft(store, 1001)).toBeNull();
});
it('keeps an exact nonce separately and strips malformed checkpoint timestamps', () => {
  const store = storage(); writeAttempt('request', { nonce: id(1), payload: '{"test":true}' }, store, 1000); expect(readAttempt('request', store, 1001).nonce).toBe(id(1)); writeAttempt('request', null, store); expect(readAttempt('request', store, 1001)).toBeNull();
  requestCheckpoint({ request_id: id(1), request_token: 'test_scoped_request_token_123456' }, store, 1000); expect(requestCheckpoint(undefined, store, 1001).request_id).toBe(id(1)); expect(requestCheckpoint(undefined, store, 1000 + DRAFT_LIFETIME + 1)).toBeNull();
});
it.each(['/book', '/book/', '/BOOK', '/booking/private-token', '/%62ook', '/booking%2Fprivate-token', '/mickleham', '/Mickleham/', '/mickleham-launch', '/Mickleham_Launch', '/launch', '/private-coaching'])('excludes private direct/SPA paths from analytics %s', path => { expect(isPrivateBookingPath(path)).toBe(true); expect(privateBookingAnalytics({ properties: { email: 'test@example.test' } }, path)).toBeNull(); });
it('drops private referrer/URL events without changing other programme analytics', () => { expect(privateBookingAnalytics({ properties: { $referrer: 'https://rramelbourne.com/booking/secret' } }, '/junior-royals')).toBeNull(); const event = { properties: { $current_url: 'https://rramelbourne.com/junior-royals' } }; expect(privateBookingAnalytics(event, '/junior-royals')).toBe(event); });

it('booking flow omits the overlapping contact shortcut while other campaign/programme routes keep it', () => {
  for (const path of ['/book', '/BOOK/', '/%62ook', '/booking/private-token']) expect(isBookingFlowPath(path)).toBe(true);
  for (const path of ['/mickleham', '/mickleham-launch', '/junior-royals', '/launch']) expect(isBookingFlowPath(path)).toBe(false);
});
