---
name: dev-handoff
description: Developer hand-off for any website page change on rramelbourne.com (rr_landing_page1). Builds a branded PDF with before/after screenshots (desktop and phone) of every section that changed, a table of every new or replaced image with the exact path it goes in the code and where it sits in Google Drive, the steps for the developers, and the open items. Creates the Drive folder (Content / WEBSITE DEV HANDOFFS / <date> · <page> · <title>) with the brief as a Google Doc, and stages every image there. Trigger after any page is created or changed, and on "hand-off", "handoff brief", "brief for the developers", "dev handoff", "send this to Alex/the dev team", "make the PDF for the developers".
---

# Developer hand-off (PDF + Drive folder)

Andy makes changes to a page with Claude; Alex and the development team make them live.
This skill packages a change so the team needs nothing else: **one PDF** that shows what the
page looks like before and after, and **one Google Drive folder** that holds every image, in
the place the PDF says. Andy hands over the PDF (or the folder link) and the team knows what
to do and where every file is.

Speak to Andy plainly. He isn't a developer.

## The Drive folder (always the same place and shape)

```
Content  (id 1yrRs6srR9LwJ95ecY0RmtvXar6CPXto3)
└── WEBSITE DEV HANDOFFS  (id 1HJkaA8i03nXe5K2T4zZR4YpqrDImuUt_)
    └── <YYYY-MM-DD> · <page slug> · <short title>          e.g. 2026-11-09 · junior-royals · Join any week, weekly pay, photos
        ├── 00 READ ME FIRST: <title>                         Google Doc: the brief as text, with links
        ├── <page slug>-handoff-<YYYY-MM-DD>.pdf              the hand-off PDF
        ├── 01 Images (web-ready)/public/assets/...           every new/replaced image, at its repository path
        ├── 02 Images (originals)/                            photos as supplied, full size (if any)
        ├── 03 Screenshots/                                   every before/after screenshot
        └── 04 Code patch (if the branch is missing a commit)/  only when a commit couldn't be pushed
```

`01 Images (web-ready)` mirrors the repository on purpose: a file at
`01 Images (web-ready)/public/assets/junior-royals/gallery/squad-talk.webp` goes at
`public/assets/junior-royals/gallery/squad-talk.webp` in the code. Never rename files between
the code and Drive. If the IDs above stop working, find the folders with the Drive search tool
(`title contains 'WEBSITE DEV HANDOFFS'`), and update this file.

## Steps

Scripts are in this skill's `scripts/` folder (`S=.claude/skills/dev-handoff/scripts`). Work in a
scratch folder (`W=<scratchpad>/handoff-<slug>`), never inside the repo.

### 1. Check the change is ready

- On the branch with the change, `git fetch origin main` and confirm the page builds (`npx vite build`).
- Note the branch, the latest commit, and the pull request (if any). Commits that aren't pushed
  yet are fine; step 6 handles them.
- **Paid program page? The governance boxes must be there** (`CLAUDE.md`, Andy 10 Nov 2026):
  `<GovernanceConsents>` with the four required boxes, saved in four `accept_*` columns, and the
  form listed in `src/lib/governance.test.ts`. If a new table needs the columns, the migration
  goes in the brief's steps as "apply BEFORE deploying". Missing = not ready to hand off.
- **Paid program page? The mandatory training shirt must be there** (`CLAUDE.md`, Andy 9 Nov
  2026). Check the form has `<TrainingShirtStep>`, blocks without an answer, and that the
  checkout charges the shirt for "No" without letting it be removed. If it's missing, stop and
  build it first: a paid page without it is not ready to hand off. Say in the brief's
  `checks` that it was tested, and show the step in a section screenshot.

### 2. Screenshots, before and after

```bash
node $S/capture.mjs --route /<page> --out $W/shots            # add --sections hero,benefits to limit sections
```
- AFTER = this checkout. BEFORE = `origin/main` (the live code), in a temporary worktree.
- Desktop (1440px) and phone (390px): the full page plus one shot per section (each direct
  child of `<main>` with an `id`). A page that doesn't exist on main is treated as a new page.
- If a section has no `id`, the page's sections can't be compared: give the wrappers ids
  (as `JuniorRoyalsT3.jsx` does), or pass `--sections`.

### 3. Images

```bash
node $S/images.mjs --out $W/images --originals <folder of the photos as supplied>   # --originals is optional
```
Finds every image added or replaced under `public/` compared with `origin/main`, where the
code uses it, its size, and stages copies in `$W/images/drive/` in the Drive layout.
Photos Andy attached in the chat are in `/root/.claude/uploads/<session>/`: copy them to a
folder with clear names first.

### 4. Write the brief

Write `$W/brief.json`. Plain words, short lines, facts only (the house rules in
`rr-page-generator` apply: prices "incl. GST", no promises). `**bold**` and `` `code` `` work.

```json
{
  "title": "Junior Royals page: join any week, weekly pay, photos",
  "route": "/junior-royals",
  "date": "9 November 2026",
  "preparedBy": "Andy Crook",
  "preparedFor": "Alex and the development team",
  "repo": "AlexlekLewis/rr_landing_page1",
  "branch": "claude/<branch>",
  "pr": { "number": 159, "url": "https://github.com/AlexlekLewis/rr_landing_page1/pull/159" },
  "live": false,
  "driveFolder": { "path": "Content / WEBSITE DEV HANDOFFS / 2026-11-09 · junior-royals · …", "url": "<folder link from step 5>" },
  "summary": "One short paragraph: what changed and why.",
  "steps": ["What the developers do, in order: get files, review, Stripe/Supabase changes, merge, check live."],
  "changes": [{ "area": "Payment", "before": "…", "now": "…" }],
  "sections": [{ "id": "hero", "label": "Hero", "note": "What changed in this section." }],
  "imageNotes": { "public/assets/…/squad-talk.webp": "Hero background" },
  "checks": ["Tests and checks already run, with results."],
  "openItems": [{ "item": "Anything still to decide or do.", "owner": "Andy" }]
}
```
`sections` gives each screenshot section a readable name and a one-line note; include removed
sections (their ids from the BEFORE page) so the PDF says why they went.

### 5. Drive folder

With the Google Drive tools:
1. Create `<YYYY-MM-DD> · <page slug> · <short title>` inside `WEBSITE DEV HANDOFFS`, and inside it
   the four subfolders above (skip `02` with no originals, `04` with no patch).
2. Put the folder's link in `brief.json` (`driveFolder.url`) before building the PDF.
3. Create `00 READ ME FIRST: <title>` in the folder: `create_file` with `textContent` as
   markdown and `contentMimeType: text/markdown` (it becomes a Google Doc). Same content as the
   PDF's text pages: summary, what to do, where the files are, changes, images table, checks,
   open items. Read it back with `read_file_content` to confirm the text landed.

### 6. Build the PDF and the bundle

```bash
node $S/build_pdf.mjs --brief $W/brief.json --shots $W/shots --images $W/images --out $W/<slug>-handoff-<date>.pdf
python3 $S/bundle.py --pdf $W/<slug>-handoff-<date>.pdf --shots $W/shots --images $W/images --out $W/<slug>-handoff-<date>.zip [--patch <file>]
```
- The PDF: cover (status: live or not), what to do, where the files are, what changed,
  images (thumbnail, repository path, where it's used), then one landscape page per section
  (before | after desktop | after phone, tagged New / Changed / Removed), the whole page on a
  phone, checks and open items. Aim for under 5 MB. Over that, lower the shot sizes in
  `build_pdf.mjs` (`shrink(..., 1100)`).
- **Look at it before handing it over**: `pdftoppm -r 40 -png <pdf> pg`, and view the pages.
  Fix anything cut off, empty or unreadable.
- `--patch`: only when commits couldn't be pushed. Make it with
  `git format-patch --binary origin/<branch>..HEAD --stdout > <file>`.

### 7. Get the files into Drive

The Drive tools can create folders and Google Docs. They **can't upload images or the PDF**:
a file's content has to be written into the request, and photos and PDFs are megabytes.
So:
1. Send Andy the PDF and the zip (`SendUserFile`, `display: attach`).
2. Tell him, in two lines: unzip it, and drag everything inside into the Drive folder (link).
   The zip is already laid out like the folder.
3. When he says it's done, list the folder with `search_files` (`parentId = '<folder id>'`)
   and confirm the PDF and the image folders are there.

If a direct Drive upload is ever set up for this environment (a Google API credential for
`www.googleapis.com`), upload the files instead and update this step.

### 8. Hand-over message

Give Andy, plainly:
- the Drive folder link and the PDF name;
- whether it's live (it isn't until the PR is merged and deployed; no posters, QR codes or
  emails before then);
- the open items, with who owns each.

## Keep this skill true

- If the Drive folders move or are renamed, update the IDs and layout above.
- If the site's section wrappers change (`main > [id]`), update `capture.mjs`.
- The first hand-off made with this skill is the Junior Royals change of 9 Nov 2026: compare
  new PDFs against it.
