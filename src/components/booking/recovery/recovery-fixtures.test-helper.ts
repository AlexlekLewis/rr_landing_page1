import { creditFixture } from '../credit-fixtures.test-helper';
import { id } from '../fixtures.test-helper';
export const prior = id(70), nonce = id(80);
export const fields = () => creditFixture([0]).fields;
export const quote = () => ({ schema_version: 1, kind: 'lapsed_request_review', prior_request_id: prior, review: 'lr1.' + id(90), expires_at: '2026-11-09T09:10:00+11:00', price: creditFixture([0]).quote.price, dates: creditFixture([0]).quote.series_check.dates, decision_quote: creditFixture([0]).quote.decision_quote });
export function receipt(outcome = 'accepted', n = nonce) { return { schema_version: 1, receipt_state: 'found', receipt: { schema_version: 1, receipt_kind: 'original_lapsed_submission', prior_request_id: prior, nonce: n, outcome, request_id: outcome === 'accepted' ? id(71) : null, result: outcome === 'accepted' ? { request_id: id(71), state: 'checkout', payment_state: 'checkout_pending', revision: 1, funding_mode: 'card', server_now: '2026-11-09T09:00:00+11:00', expires_at: '2026-11-09T09:30:00+11:00', expires_in_seconds: 1800, dates: quote().dates, price: quote().price, checkout_state: 'preparing', checkout_url: null, confirm_by: null, call_by_plain: null } : null } }; }
export const current = () => ({ schema_version: 1, kind: 'fresh_request', prior_request_id: prior, request: null });
export const env = { VITE_APP_ENV: 'local', VITE_PRIVATE_BOOKING_URL: 'http://127.0.0.1:54321/functions/v1', VITE_PRIVATE_BOOKING_KEY: 'unit-public-key', VITE_PRIVATE_BOOKING_PAYMENT_RECOVERY_ENABLED: 'true' };
export const json = (key: string, value: unknown, status = 200) => new Response(JSON.stringify({ ok: true, [key]: value }), { status });
