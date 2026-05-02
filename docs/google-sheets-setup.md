# Google Sheets Export — Setup

**One-time setup, ~15 minutes.** Once done, every "Export to Google Sheets" button in the admin dashboard creates a new sheet inside a single shared Drive folder that all 3 admins can access.

The architecture: a Google Cloud **service account** has its own Google identity. The dashboard calls our `/api/export-to-sheets` endpoint which authenticates as the service account, creates a spreadsheet inside a Drive folder you've shared with that service account, writes the rows, and returns the URL.

---

## Step 1 — Create a Google Cloud project

1. Open <https://console.cloud.google.com>.
2. Top bar → project picker → **New Project**.
3. Name: `rra-melbourne-admin` (or anything). Create.
4. Make sure the new project is selected in the top bar.

## Step 2 — Enable the two APIs we need

In the search bar at the top, search and enable each:

1. **Google Sheets API** → enable.
2. **Google Drive API** → enable.

## Step 3 — Create the service account

1. Left nav → **IAM & Admin** → **Service Accounts**.
2. **+ Create Service Account**.
3. Name: `rra-admin-exports`. Click **Create and Continue**.
4. Skip "Grant this service account access to project" — no project-level roles needed. **Continue** → **Done**.
5. The new service account appears in the list. Click into it.
6. Tab **Keys** → **Add Key** → **Create new key** → **JSON** → **Create**.
7. A JSON file downloads — keep it safe. We'll paste its contents into Vercel in Step 6.
8. Note the service account's email (looks like `rra-admin-exports@rra-melbourne-admin.iam.gserviceaccount.com`). You'll need it next.

## Step 4 — Create + share the Drive folder

1. Open <https://drive.google.com> as `info@rramelbourne.com` (or any account where you want exports to live).
2. **+ New** → **New folder** → name it `RRA Admin Exports`.
3. Right-click the folder → **Share**.
4. In the "Add people and groups" field, paste the service account email from Step 3.8.
5. Permission: **Editor**. Untick "Notify people". **Send**.
6. Open the folder. Copy the **folder ID** from the URL — it's the long string after `/folders/` in `https://drive.google.com/drive/folders/<THIS_PART>`.

## Step 5 — Share the folder with each admin

Same Share dialog — add `alex.lewis@rramelbourne.com`, `andy.crook@rramelbourne.com`, and `info@rramelbourne.com` as **Viewer** (or Editor if they need to edit exports). Now anyone in the team can see exports without needing the service account.

## Step 6 — Add env vars in Vercel

Vercel → project `rr_landing_page1` → **Settings** → **Environment Variables**.

| Key | Value | Environments |
|---|---|---|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | The **entire** contents of the JSON key file from Step 3.7. Paste as a single line — Vercel handles multi-line JSON correctly when pasted into the value field. | Production, Preview, Development |
| `GOOGLE_DRIVE_EXPORT_FOLDER_ID` | The folder ID from Step 4.6. | Production, Preview, Development |

Click **Save** for each. Then **Deployments** → top deployment → ⋯ → **Redeploy** so the new env vars take effect.

## Step 7 — Test

1. Go to the admin dashboard (preview URL or production after merge).
2. Open any of: Academy Members 2026, Inquiries, Program Registrations, Shop Orders, Home Leads, etc.
3. Click **Export to Google Sheets**. A new tab should open with a fresh sheet pre-filled with the current filtered rows. The sheet lives in the `RRA Admin Exports` folder.

If the button shows an error, hover the button — the tooltip shows the message. Most common issues:
- *"GOOGLE_SERVICE_ACCOUNT_JSON env var missing"* → Step 6 not done, or deployment hadn't picked up the new env var (redeploy).
- *"File not found: <folder-id>"* → folder ID is wrong, or the service account isn't shared on the folder (Step 4.4).
- *"The caller does not have permission"* → Drive API not enabled (Step 2), or service account isn't an Editor on the folder.

---

## What gets exported

Each dashboard exports the **currently filtered** rows (whatever you can see on screen) to a new sheet. Sheet titles include today's date so it's easy to find the right one later.

| Dashboard | Sheet title format | Sheet name |
|---|---|---|
| Academy Members 2026 | `Academy Members 2026 — YYYY-MM-DD` | `Members` |
| Inquiries | `Inquiries — YYYY-MM-DD` | `Inquiries` |
| Program Registrations | `Program registrations — YYYY-MM-DD` | `Registrations` |
| Shop Orders | `Shop orders — YYYY-MM-DD` | `Orders` |
| Home Leads | `Home leads — YYYY-MM-DD` | `Leads` |
| Master Inquiries | `Master inquiries — YYYY-MM-DD` | `Inquiries` |
| LP3 Inquiries | `LP3 inquiries — YYYY-MM-DD` | `Inquiries` |
| Player Profiles | `Player profiles — YYYY-MM-DD` | `Players` |
| All Players | `All players — YYYY-MM-DD` | `Players` |
| Token Generator | `Offer links — YYYY-MM-DD` | `Offer Links` |

All sheets get bold + frozen header row.
