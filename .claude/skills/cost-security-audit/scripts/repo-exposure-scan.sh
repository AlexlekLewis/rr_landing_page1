#!/usr/bin/env bash
# ============================================================================
# repo-exposure-scan.sh — secrets in git/bundle + serverless endpoint posture
#
# 1. Flags secret files tracked in git (now or ever in history).
# 2. Scans tracked files + built client bundles for live secret patterns.
# 3. Prints a protection matrix for every api/*.js endpoint:
#    auth? fail-open? rate-limit? CORS *? expensive (headless browser)?
#
# Read-only. Usage: bash repo-exposure-scan.sh
# ============================================================================
set -uo pipefail
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"
FAIL=0

echo "============================================================"
echo "1. SECRET FILES TRACKED IN GIT"
echo "============================================================"
tracked_secrets="$(git ls-files | grep -iE '(^|/)\.env($|\.)|secret|credential|\.pem$|\.p12$|service[-_]?account.*\.json$' || true)"
if [[ -n "$tracked_secrets" ]]; then
  echo "🔴 Secret-looking files are TRACKED (shipped to anyone with repo access):"
  echo "$tracked_secrets" | sed 's/^/    /'
  FAIL=1
else
  echo "🟢 No secret-looking files currently tracked."
fi
# .env ever committed (even if later removed — it stays in history)
env_hist="$(git log --all --oneline -- .env 2>/dev/null | head -3 || true)"
if [[ -n "$env_hist" ]]; then
  echo "🟠 .env appears in git history (secrets in history must be rotated, not just deleted):"
  echo "$env_hist" | sed 's/^/    /'
  FAIL=1
fi
echo

echo "============================================================"
echo "2. SECRET PATTERNS IN TRACKED FILES + BUILT BUNDLES"
echo "============================================================"
# Server secrets that must NEVER appear client-side or in git.
PAT='sk_live_[0-9A-Za-z]|sk_test_[0-9A-Za-z]|rk_live_|whsec_[0-9A-Za-z]|re_[0-9A-Za-z]{10}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|"private_key"\s*:|"type"\s*:\s*"service_account"|role"\s*:\s*"service_role"'
# Search tracked source + anything under public/ and dist/ (built output).
hits="$(grep -rInE "$PAT" \
        --include='*.js' --include='*.mjs' --include='*.cjs' --include='*.ts' \
        --include='*.json' --include='*.html' --include='*.env*' \
        public dist src api 2>/dev/null \
        | grep -vE 'node_modules' || true)"
if [[ -n "$hits" ]]; then
  echo "🔴 Possible server-secret material found (review each; rotate if real):"
  echo "$hits" | cut -c1-160 | sed 's/^/    /'
  FAIL=1
else
  echo "🟢 No live server-secret patterns in tracked source or built bundles."
fi
echo "    NOTE: VITE_-prefixed values (anon key, Zapier URLs, PostHog key) are PUBLIC by"
echo "    design — they ship in the bundle. Server secrets must live ONLY in Vercel env."
echo

echo "============================================================"
echo "3. SERVERLESS ENDPOINT PROTECTION MATRIX (api/*.js)"
echo "============================================================"
printf "%-32s %-6s %-9s %-6s %-6s %-9s\n" "endpoint" "AUTH" "FAILOPEN" "RATE" "CORS*" "EXPENSIVE"
printf "%-32s %-6s %-9s %-6s %-6s %-9s\n" "--------" "----" "--------" "----" "-----" "---------"
for f in api/*.js; do
  [[ -e "$f" ]] || continue
  base="$(basename "$f")"
  auth="no"; grep -qE 'verifyAdmin|x-webhook-secret|constructEvent|getUser\(|dashboard_users' "$f" && auth="yes"
  failopen="-"; grep -qE 'const expected = process\.env|if \(expected\)' "$f" && failopen="YES"
  rate="no"; grep -qiE 'ratelimit|rate_limit|upstash|firewall|Retry-After|too many' "$f" && rate="yes"
  cors="-"; grep -qE "Allow-Origin'?,\s*'\*'|Allow-Origin\", \"\*\"|Allow-Origin['\"], ?['\"]\*" "$f" && cors="YES"
  exp="-"; grep -qiE 'puppeteer|chromium|playwright|sharp|ffmpeg' "$f" && exp="YES"
  # Flag the dangerous combo: public (no auth) + (expensive OR sends email/charges)
  mark=""
  if [[ "$auth" == "no" && ( "$exp" == "YES" || "$rate" == "no" ) ]]; then
    if grep -qiE 'puppeteer|chromium|stripe\.|sendOrderConfirmation|resend|fetch\(' "$f"; then mark="  <-- review"; FAIL=1; fi
  fi
  printf "%-32s %-6s %-9s %-6s %-6s %-9s%s\n" "$base" "$auth" "$failopen" "$rate" "$cors" "$exp" "$mark"
done
echo
echo "Legend: AUTH=has any caller check · FAILOPEN=auth skipped if env unset (fail-open)"
echo "        RATE=has rate limiting · CORS*=Allow-Origin:* · EXPENSIVE=headless browser/media"
echo "        '<-- review' = unauthenticated AND (expensive or unthrottled external/\$ calls)"
echo

if [[ "$FAIL" -ne 0 ]]; then
  echo "VERDICT: issues found above — see 🔴/🟠 and '<-- review' rows."
  exit 1
fi
echo "VERDICT: no tracked secrets and no obviously-unprotected costly endpoints."
