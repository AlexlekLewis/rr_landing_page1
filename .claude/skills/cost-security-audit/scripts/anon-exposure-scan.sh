#!/usr/bin/env bash
# ============================================================================
# anon-exposure-scan.sh — "Can a stranger download my data?"
#
# Uses the PUBLIC anon key (the one already shipped in the browser bundle) to
# probe every table/view exposed by Supabase PostgREST and report which ones
# return rows. This is the definitive client-side data-exposure test.
#
# It only ever issues HEAD requests with `Prefer: count=exact`, so it reads
# ROW COUNTS ONLY — no PII is ever fetched or printed.
#
# Usage:  bash anon-exposure-scan.sh [path/to/.env]
# Exits non-zero if any *sensitive-looking* table is anon-readable with rows.
# ============================================================================
set -euo pipefail

ENV_FILE="${1:-}"
if [[ -z "$ENV_FILE" ]]; then
  ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
  ENV_FILE="$ROOT/.env"
fi
if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: .env not found at '$ENV_FILE'. Pass the path as arg 1." >&2
  exit 2
fi

# Pull the two public values without executing the file (strip quotes + CR).
get_env() {
  grep -E "^$1=" "$ENV_FILE" | head -1 | cut -d= -f2- \
    | sed -e 's/^["'\'']//' -e 's/["'\'']$//' -e 's/\r$//'
}
URL="$(get_env VITE_SUPABASE_URL)"
ANON="$(get_env VITE_SUPABASE_ANON_KEY)"
if [[ -z "$URL" || -z "$ANON" ]]; then
  echo "ERROR: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing from $ENV_FILE" >&2
  exit 2
fi

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
echo "Target: $URL"
echo "Probing with the PUBLIC anon key (counts only, no PII fetched)…"
echo

URL="$URL" ANON="$ANON" ROOT="$ROOT" python3 - <<'PY'
import os, json, urllib.request, urllib.error, re, sys

URL  = os.environ["URL"].rstrip("/")
ANON = os.environ["ANON"]
BASE = f"{URL}/rest/v1"
HDRS = {"apikey": ANON, "Authorization": f"Bearer {ANON}"}

# Names that suggest PII / business data (vs intentional public reference data).
SENSITIVE = re.compile(
    r"lead|registration|registrations|order|member|people|person|enquir|inquir|"
    r"application|payment|traveller|traveler|communication|crm|rsvp|offer|"
    r"password|reset|token|user|player|parent|contact|email|cohort|waitlist|"
    r"kickstart|holiday|junior|elite|india_tour|profile|assessment|journal",
    re.I,
)

# Tables this app is known to hold PII/business data in — probed even if
# auto-discovery is unavailable. Extend as the schema grows.
KNOWN = {
    "program_members","holiday_clinic_registrations","junior_royals_bundoora",
    "junior_royals_hallam","junior_royals_july_holidays_registrations",
    "junior_royals_registrations","rsvp_responses","player_communications",
    "crm_leads","crm_lead_notes","crm_scan_log","crm_program_registry","crm_email_log",
    "offer_tokens","offer_responses","applications","archived_applications",
    "general_enquiries","inquiries","upcoming_program_interest","power_game_inquiries",
    "power_game_applications","india_tour_2026_eoi","india_tour_2026_travellers",
    "india_tour_2026_referrals","shop_orders","shop_orders_training","shop_orders_ipl",
    "program_registrations","female_kickstart_2026","elite_2026_waitlist",
    "official_cohort_2026","players","user_profiles","dashboard_users",
    "password_reset_tokens","recovery_attempts","trial_assessments",
}

def discover_openapi():
    req = urllib.request.Request(BASE + "/", headers=HDRS)
    with urllib.request.urlopen(req, timeout=20) as r:
        spec = json.load(r)
    defs = spec.get("definitions") or spec.get("components", {}).get("schemas", {})
    return set(defs.keys())

def discover_sql(root):
    import glob
    names, rx = set(), re.compile(
        r'create\s+table\s+(?:if\s+not\s+exists\s+)?(?:"?public"?\.)?"?([a-zA-Z0-9_]+)"?', re.I)
    for pat in (os.path.join(root,"supabase","migrations","*.sql"), os.path.join(root,"*.sql")):
        for f in glob.glob(pat):
            try: txt = open(f, encoding="utf-8", errors="ignore").read()
            except Exception: continue
            names.update(m.group(1) for m in rx.finditer(txt))
    return names

def discover():
    try:
        found = discover_openapi()
        print(f"(discovered {len(found)} objects via OpenAPI root)\n")
    except Exception:
        found = discover_sql(os.environ.get("ROOT","."))
        print(f"(OpenAPI root blocked for anon — discovered {len(found)} tables from repo "
              f"migrations + {len(KNOWN)} known names)\n")
    return sorted(found | KNOWN)

def count(table):
    """Return (http_status, visible_row_count or None) for anon, via HEAD."""
    req = urllib.request.Request(
        f"{BASE}/{table}?select=*",
        headers={**HDRS, "Prefer": "count=exact", "Range-Unit": "items", "Range": "0-0"},
        method="HEAD",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            cr = r.headers.get("Content-Range", "")
            n = cr.split("/")[-1] if "/" in cr else None
            return r.status, (int(n) if (n and n.isdigit()) else None)
    except urllib.error.HTTPError as e:
        return e.code, None
    except Exception:
        return 0, None

tables = discover()
exposed_sensitive, exposed_other, blocked, empty_or_filtered = [], [], [], []

for t in tables:
    status, n = count(t)
    readable = status in (200, 206)
    if readable and n and n > 0:
        (exposed_sensitive if SENSITIVE.search(t) else exposed_other).append((t, n))
    elif readable:
        empty_or_filtered.append((t, status))
    else:
        blocked.append((t, status))

def show(title, rows, withcount=True):
    print(title)
    if not rows:
        print("  (none)")
    for item in rows:
        if withcount:
            t, n = item; print(f"  - {t:<42} {n} rows")
        else:
            t, s = item; print(f"  - {t:<42} HTTP {s}")
    print()

print("=" * 78)
print("RESULTS — anon (public) read access")
print("=" * 78)
print()
show(f"🔴 EXPOSED — sensitive-looking, anon-readable WITH ROWS ({len(exposed_sensitive)}):",
     sorted(exposed_sensitive, key=lambda x: -x[1]))
show(f"🟠 anon-readable WITH ROWS, looks like reference/other ({len(exposed_other)}) — confirm intentional:",
     sorted(exposed_other, key=lambda x: -x[1]))
show(f"🟡 anon-readable but 0 rows visible (empty table OR RLS-filtered) ({len(empty_or_filtered)}):",
     sorted(empty_or_filtered), withcount=False)
print(f"🟢 blocked for anon (401/403/404): {len(blocked)} objects")
print()
print(f"Scanned {len(tables)} exposed objects.")
if exposed_sensitive:
    print()
    print("VERDICT: sensitive data is downloadable by anyone with the public key. FIX REQUIRED.")
    sys.exit(1)
print()
print("VERDICT: no obviously-sensitive table returned rows to anon.")
PY
