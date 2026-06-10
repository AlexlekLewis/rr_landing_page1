// ============================================================
// bot.js — framework-agnostic bot defenses for public lead forms.
// Pure logic (no Vite/React/Node globals) so it runs in the browser,
// in Vercel serverless functions, and under vitest. Inject `fetch` for tests.
//
// Two layers:
//   1) Honeypot — a hidden field humans never fill; bots autofill it.
//   2) Cloudflare Turnstile — server-side token verification.
//
// Both are NO-OPS until configured: if no Turnstile secret is set, verification
// passes through (so dev/preview keep working before keys exist).
// ============================================================

/** Hidden field name. Humans never see or fill it; many bots will. */
export const HONEYPOT_FIELD = "company_website";

/** True if the honeypot was filled (→ treat the submission as a bot). */
export function isHoneypotTripped(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Verify a Turnstile token with Cloudflare.
 * @param {string} token  the widget response token from the client
 * @param {{secret?: string, remoteip?: string, fetchImpl?: Function}} [opts]
 * @returns {Promise<{ok: boolean, skipped?: boolean, reason: string}>}
 *
 * No secret configured → { ok: true, skipped: true } (pass-through for dev/preview).
 */
export async function verifyTurnstileToken(token, opts = {}) {
  const { secret, remoteip, fetchImpl } = opts;
  if (!secret) return { ok: true, skipped: true, reason: "no_secret" };
  if (!token) return { ok: false, reason: "missing_token" };

  const doFetch = fetchImpl || (typeof fetch !== "undefined" ? fetch : null);
  if (!doFetch) return { ok: false, reason: "no_fetch" };

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteip) body.set("remoteip", remoteip);

  let res;
  try {
    res = await doFetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
  } catch (_e) {
    return { ok: false, reason: "verify_unreachable" };
  }

  let data;
  try {
    data = await res.json();
  } catch (_e) {
    return { ok: false, reason: "verify_bad_json" };
  }

  if (data && data.success) return { ok: true, reason: "ok" };
  const codes = (data && data["error-codes"]) || [];
  return { ok: false, reason: "cf:" + (codes.join(",") || "failed") };
}

/**
 * One-call gate for a server handler: honeypot + Turnstile.
 * @param {{token?: string, honeypot?: string, secret?: string, ip?: string, fetchImpl?: Function}} args
 */
export async function assertHuman({ token, honeypot, secret, ip, fetchImpl } = {}) {
  if (isHoneypotTripped(honeypot)) return { ok: false, reason: "honeypot" };
  return verifyTurnstileToken(token, { secret, remoteip: ip, fetchImpl });
}
