// Every route Supabase calls must refuse a request without the shared secret,
// including when the secret was never configured (a Preview deployment has no
// SUPABASE_WEBHOOK_SECRET). A refused request must never reach Google Sheets or
// the database: both are mocked here, so one that got through would show up as
// a call.
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import holidayRow from '../sync-holiday-row.js';
import squadRow from '../sync-performance-squad-row.js';
import powerGameRow from '../sync-power-game-row.js';
import refreshPeople from '../refresh-unified-people.js';

vi.mock('googleapis', () => ({
  google: { auth: { GoogleAuth: vi.fn() }, sheets: vi.fn(), drive: vi.fn() },
}));
vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn() }));

const SECRET = 'test-secret-not-a-real-value';

// A well-formed webhook payload — the kind a route would go on to write.
const WRITE = { type: 'UPDATE', table: 'holiday_clinic_registrations', record: { id: 'reg-1' } };

// [route, handler, what the route answers once it is past the secret check].
// An empty body proves the check was passed: each route's next step refuses it
// without touching anything outside.
const ROUTES = [
  ['sync-holiday-row', holidayRow, { status: 400, error: 'invalid payload' }],
  ['sync-performance-squad-row', squadRow, { status: 400, error: 'invalid payload' }],
  ['sync-power-game-row', powerGameRow, { status: 400, error: 'invalid payload' }],
  // No payload to check here; its next step needs Google credentials, which
  // these tests leave unset.
  ['refresh-unified-people', refreshPeople, { status: 500, error: 'GOOGLE_SERVICE_ACCOUNT_JSON missing' }],
];

const call = async (handler, { method = 'POST', headers = {}, body = WRITE } = {}) => {
  const res = {
    statusCode: null,
    payload: undefined,
    status(code) { this.statusCode = code; return this; },
    json(p) { this.payload = p; return this; },
  };
  await handler({ method, headers, body }, res);
  return res;
};

const expectNothingTouched = () => {
  expect(google.auth.GoogleAuth).not.toHaveBeenCalled();
  expect(google.sheets).not.toHaveBeenCalled();
  expect(createClient).not.toHaveBeenCalled();
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.stubEnv('GOOGLE_SERVICE_ACCOUNT_JSON', undefined);
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe.each(ROUTES)('/api/%s', (_route, handler, pastTheCheck) => {
  it('refuses everything with a 500 when SUPABASE_WEBHOOK_SECRET is not set', async () => {
    vi.stubEnv('SUPABASE_WEBHOOK_SECRET', undefined);
    const res = await call(handler, { headers: { 'x-webhook-secret': 'anything' } });
    expect(res.statusCode).toBe(500);
    expect(res.payload).toEqual({ error: 'webhook secret not configured' });
    expectNothingTouched();
  });

  it('refuses a request with no secret', async () => {
    vi.stubEnv('SUPABASE_WEBHOOK_SECRET', SECRET);
    const res = await call(handler);
    expect(res.statusCode).toBe(401);
    expect(res.payload).toEqual({ error: 'unauthorized' });
    expectNothingTouched();
  });

  it('refuses a wrong secret', async () => {
    vi.stubEnv('SUPABASE_WEBHOOK_SECRET', SECRET);
    const res = await call(handler, { headers: { 'x-webhook-secret': SECRET.replace(/.$/, '!') } });
    expect(res.statusCode).toBe(401);
    expect(res.payload).toEqual({ error: 'unauthorized' });
    expectNothingTouched();
  });

  it('lets the right secret through to the route itself', async () => {
    vi.stubEnv('SUPABASE_WEBHOOK_SECRET', SECRET);
    const res = await call(handler, { headers: { 'x-webhook-secret': SECRET }, body: {} });
    expect(res.statusCode).toBe(pastTheCheck.status);
    expect(res.payload).toEqual({ error: pastTheCheck.error });
  });
});

// refresh-unified-people answers GET as well as POST, so the check has to cover both.
it('/api/refresh-unified-people refuses a GET without the secret too', async () => {
  vi.stubEnv('SUPABASE_WEBHOOK_SECRET', undefined);
  expect((await call(refreshPeople, { method: 'GET' })).payload)
    .toEqual({ error: 'webhook secret not configured' });
  vi.stubEnv('SUPABASE_WEBHOOK_SECRET', SECRET);
  expect((await call(refreshPeople, { method: 'GET' })).payload).toEqual({ error: 'unauthorized' });
  expectNothingTouched();
});

// The old inline check read the env var itself and was skipped when it was
// empty. A route copying that pattern would reopen the hole, so only the shared
// helper (api/_lib/webhookSecret.js) may read it.
it('no route reads SUPABASE_WEBHOOK_SECRET itself', () => {
  const apiDir = fileURLToPath(new URL('..', import.meta.url));
  const offenders = readdirSync(apiDir)
    .filter((f) => f.endsWith('.js'))
    .filter((f) => readFileSync(path.join(apiDir, f), 'utf8').includes('process.env.SUPABASE_WEBHOOK_SECRET'));
  expect(offenders).toEqual([]);
});
