// The shared-secret check in front of every route Supabase calls. The bug this
// exists for: the old inline check was skipped entirely when
// SUPABASE_WEBHOOK_SECRET was unset, so an environment without it (Preview)
// accepted anyone's POST.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { secretsMatch, checkWebhookSecret } from './webhookSecret.js';

const SECRET = 'test-secret-not-a-real-value';
const req = (headers = {}) => ({ headers });

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('secretsMatch', () => {
  it('matches the same secret', () => {
    expect(secretsMatch(SECRET, SECRET)).toBe(true);
  });

  it('rejects a different secret of the same length', () => {
    expect(secretsMatch(SECRET.replace(/.$/, '!'), SECRET)).toBe(false);
  });

  it('rejects a shorter or longer value without throwing', () => {
    expect(secretsMatch(SECRET.slice(0, -1), SECRET)).toBe(false);
    expect(secretsMatch(`${SECRET}x`, SECRET)).toBe(false);
    expect(secretsMatch('', SECRET)).toBe(false);
  });

  // Lengths are compared as bytes, not characters: 'é' is one character but two
  // bytes, and timingSafeEqual throws if the byte lengths differ.
  it('compares byte lengths, so a multi-byte character cannot make it throw', () => {
    expect(() => secretsMatch('é', 'a')).not.toThrow();
    expect(secretsMatch('é', 'a')).toBe(false);
  });

  it('rejects anything that is not a string', () => {
    for (const got of [undefined, null, 42, [SECRET], { toString: () => SECRET }]) {
      expect(secretsMatch(got, SECRET)).toBe(false);
    }
  });
});

describe('checkWebhookSecret — secret not configured', () => {
  it('refuses with a 500 when SUPABASE_WEBHOOK_SECRET is unset', () => {
    vi.stubEnv('SUPABASE_WEBHOOK_SECRET', undefined);
    expect(checkWebhookSecret(req({ 'x-webhook-secret': SECRET }), 'test-route'))
      .toEqual({ status: 500, error: 'webhook secret not configured' });
  });

  it('treats an empty value as unset', () => {
    vi.stubEnv('SUPABASE_WEBHOOK_SECRET', '');
    expect(checkWebhookSecret(req({ 'x-webhook-secret': '' }), 'test-route'))
      .toEqual({ status: 500, error: 'webhook secret not configured' });
  });

  it('logs an error naming the route, so the misconfiguration shows up in Vercel logs', () => {
    vi.stubEnv('SUPABASE_WEBHOOK_SECRET', undefined);
    checkWebhookSecret(req(), 'test-route');
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error.mock.calls[0][0]).toContain('test-route');
    expect(console.error.mock.calls[0][0]).toContain('SUPABASE_WEBHOOK_SECRET');
  });
});

describe('checkWebhookSecret — secret configured', () => {
  beforeEach(() => vi.stubEnv('SUPABASE_WEBHOOK_SECRET', SECRET));

  it('lets the right secret through', () => {
    expect(checkWebhookSecret(req({ 'x-webhook-secret': SECRET }), 'test-route')).toBeNull();
  });

  it('refuses a request with no secret header', () => {
    expect(checkWebhookSecret(req(), 'test-route')).toEqual({ status: 401, error: 'unauthorized' });
  });

  it('refuses a request with no headers at all, rather than crashing', () => {
    expect(checkWebhookSecret({}, 'test-route')).toEqual({ status: 401, error: 'unauthorized' });
  });

  it('refuses a wrong secret, whatever its length', () => {
    for (const got of ['nope', SECRET.replace(/.$/, '!'), `${SECRET}x`]) {
      expect(checkWebhookSecret(req({ 'x-webhook-secret': got }), 'test-route'))
        .toEqual({ status: 401, error: 'unauthorized' });
    }
  });

  it('refuses the header sent twice', () => {
    expect(checkWebhookSecret(req({ 'x-webhook-secret': [SECRET, SECRET] }), 'test-route'))
      .toEqual({ status: 401, error: 'unauthorized' });
  });

  it('only reads x-webhook-secret, not another header carrying the secret', () => {
    expect(checkWebhookSecret(req({ authorization: `Bearer ${SECRET}` }), 'test-route'))
      .toEqual({ status: 401, error: 'unauthorized' });
  });

  it('never writes the secret, or what was sent, to the logs', () => {
    checkWebhookSecret(req({ 'x-webhook-secret': 'sent-value' }), 'test-route');
    const logged = [...console.warn.mock.calls, ...console.error.mock.calls].flat().join(' ');
    expect(logged).toContain('test-route');
    expect(logged).not.toContain(SECRET);
    expect(logged).not.toContain('sent-value');
  });
});
