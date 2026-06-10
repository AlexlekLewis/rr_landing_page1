import { describe, it, expect, vi } from "vitest";
// @ts-expect-error — plain JS module shared with the serverless API layer.
import { HONEYPOT_FIELD, isHoneypotTripped, verifyTurnstileToken, assertHuman } from "./bot.js";

describe("honeypot", () => {
  it("is clean when empty/undefined", () => {
    expect(isHoneypotTripped("")).toBe(false);
    expect(isHoneypotTripped("   ")).toBe(false);
    expect(isHoneypotTripped(undefined)).toBe(false);
  });
  it("is tripped when filled", () => {
    expect(isHoneypotTripped("http://spam.example")).toBe(true);
  });
  it("exposes a stable field name", () => {
    expect(typeof HONEYPOT_FIELD).toBe("string");
    expect(HONEYPOT_FIELD.length).toBeGreaterThan(0);
  });
});

describe("turnstile verify", () => {
  it("passes through when no secret is configured (dev/preview)", async () => {
    const r = await verifyTurnstileToken("anything", { secret: "" });
    expect(r.ok).toBe(true);
    expect(r.skipped).toBe(true);
  });
  it("fails when secret is set but token is missing", async () => {
    const r = await verifyTurnstileToken("", { secret: "s3cr3t" });
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("missing_token");
  });
  it("calls Cloudflare and honours success", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ json: async () => ({ success: true }) });
    const r = await verifyTurnstileToken("tok", { secret: "s", fetchImpl });
    expect(r.ok).toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
  it("reports Cloudflare failure with error codes", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ json: async () => ({ success: false, "error-codes": ["invalid-input-response"] }) });
    const r = await verifyTurnstileToken("tok", { secret: "s", fetchImpl });
    expect(r.ok).toBe(false);
    expect(r.reason).toContain("invalid-input-response");
  });
  it("is resilient to network errors", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error("network"));
    const r = await verifyTurnstileToken("tok", { secret: "s", fetchImpl });
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("verify_unreachable");
  });
});

describe("assertHuman gate", () => {
  it("blocks on tripped honeypot before calling Turnstile", async () => {
    const fetchImpl = vi.fn();
    const r = await assertHuman({ honeypot: "bot", token: "tok", secret: "s", fetchImpl });
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("honeypot");
    expect(fetchImpl).not.toHaveBeenCalled();
  });
  it("passes a clean human through when no secret set", async () => {
    const r = await assertHuman({ honeypot: "", token: "", secret: "" });
    expect(r.ok).toBe(true);
  });
});
