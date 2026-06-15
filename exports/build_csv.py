#!/usr/bin/env python3
"""Assemble CSV exports of the consolidated player views from the saved
execute_sql tool-result chunks. Each chunk is a JSON-wrapped envelope:

    {"result": "Below is the result...\\n<untrusted-data-XYZ>\\n[ ... ]\\n</untrusted-data-XYZ>\\n..."}

We extract the inner JSON array, concatenate rows, and write two CSVs:
  - all_submissions.csv      (every clean submission, 1199 rows expected)
  - unique_players.csv       (deduplicated, 935 rows expected)
"""
from __future__ import annotations

import csv
import json
import os
import re
import sys
from pathlib import Path

TOOL_DIR = Path(
    "/root/.claude/projects/-home-user-rr-landing-page1/"
    "85ddbccc-b971-5eb2-9a95-e9f9569ef816/tool-results"
)
OUT_DIR = Path("/home/user/rr_landing_page1/exports")

# Filenames captured from the chunked queries, in OFFSET order.
UNIQUE_FILES = [
    "mcp-Supabase-a5c6a2cb-execute_sql-1781505042400.txt",  # offset 0
    "mcp-Supabase-a5c6a2cb-execute_sql-1781505043579.txt",  # offset 200
    "mcp-Supabase-a5c6a2cb-execute_sql-1781505046000.txt",  # offset 400
    "mcp-Supabase-a5c6a2cb-execute_sql-1781505047171.txt",  # offset 600
    "mcp-Supabase-a5c6a2cb-execute_sql-1781505048243.txt",  # offset 800
]
SUBMISSIONS_FILES = [
    "mcp-Supabase-a5c6a2cb-execute_sql-1781505054874.txt",  # offset 0
    "mcp-Supabase-a5c6a2cb-execute_sql-1781505057707.txt",  # offset 200
    "mcp-Supabase-a5c6a2cb-execute_sql-1781505059082.txt",  # offset 400
    "mcp-Supabase-a5c6a2cb-execute_sql-1781505060583.txt",  # offset 600
    "mcp-Supabase-a5c6a2cb-execute_sql-1781505062011.txt",  # offset 800
    "mcp-Supabase-a5c6a2cb-execute_sql-1781505063226.txt",  # offset 1000
]

ARRAY_RE = re.compile(r"<untrusted-data-[^>]+>\s*(\[.*?\])\s*</untrusted-data-", re.DOTALL)


def rows_from_file(path: Path) -> list[dict]:
    raw = path.read_text()
    envelope = json.loads(raw)
    text = envelope["result"] if isinstance(envelope, dict) else envelope[0]["text"]
    m = ARRAY_RE.search(text)
    if not m:
        raise RuntimeError(f"Could not find JSON array in {path}")
    return json.loads(m.group(1))


def collect(files: list[str]) -> list[dict]:
    all_rows: list[dict] = []
    for fname in files:
        chunk = rows_from_file(TOOL_DIR / fname)
        all_rows.extend(chunk)
        print(f"  + {fname}: {len(chunk)} rows")
    return all_rows


def write_csv(rows: list[dict], out_path: Path, column_order: list[str]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=column_order, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            # Normalize None -> "" for CSV cleanliness
            writer.writerow({k: ("" if row.get(k) is None else row.get(k)) for k in column_order})


UNIQUE_COLUMNS = [
    "player_name", "player_email", "player_phone", "player_dob", "player_gender",
    "parent_name", "parent_email", "parent_phone",
    "parent2_name", "parent2_email", "parent2_phone",
    "suburb", "club", "experience_level", "cricket_type",
    "all_programs_applied", "unique_programs_count", "total_submissions",
    "first_applied_at", "last_applied_at",
    "cv_url", "profile_link", "person_key",
]

SUBMISSION_COLUMNS = [
    "applied_at", "program", "source_table",
    "player_name", "player_first_name", "player_last_name",
    "player_dob", "player_age", "player_gender",
    "player_email", "player_phone",
    "parent_name", "parent_email", "parent_phone",
    "parent2_name", "parent2_email", "parent2_phone",
    "suburb", "club", "experience_level", "cricket_type",
    "shirt_size", "location_extra", "payment_status",
    "profile_link", "history", "bio", "goals", "cv_url",
    "source", "page_referrer", "utm_source", "utm_medium", "utm_campaign",
    "notes_extra", "is_archived", "is_duplicate", "duplicate_of_id", "is_test",
    "dedup_email", "dedup_phone", "dedup_name_norm",
    "source_id",
]


def main() -> int:
    print("Collecting unique-players chunks...")
    unique_rows = collect(UNIQUE_FILES)
    print(f"  total unique players: {len(unique_rows)}\n")

    print("Collecting all-submissions chunks...")
    sub_rows = collect(SUBMISSIONS_FILES)
    print(f"  total submissions: {len(sub_rows)}\n")

    write_csv(unique_rows, OUT_DIR / "unique_players.csv", UNIQUE_COLUMNS)
    write_csv(sub_rows, OUT_DIR / "all_submissions.csv", SUBMISSION_COLUMNS)

    print(f"Wrote:")
    print(f"  {OUT_DIR / 'unique_players.csv'} ({len(unique_rows)} rows)")
    print(f"  {OUT_DIR / 'all_submissions.csv'} ({len(sub_rows)} rows)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
