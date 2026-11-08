---
name: rr-page-generator
description: "RRA Melbourne page builder AND page auditor for the Rajasthan Royals Academy Melbourne website (rr_landing_page1 / rramelbourne.com). BUILD mode: run at the start of every new page — works out where it fits in the site, writes copy in the Academy's language (Andy's wording outranks Alex's), sets the section hierarchy and calls to action, and ships the page with a clearly named Supabase table, Stripe checkout when a price is shown, success + pay pages, and a Google Sheet tab that refreshes on a schedule. Built from facts: refreshes a real audience profile (device, source, attention, who registers) from the site's own analytics before designing, designs the offer first, writes plain English for a multilingual audience with tap-to-reveal detail. AUDIT mode: checks an existing page's copy, language conflicts with other pages, CTAs, hierarchy, backend wiring and promo surfaces. Trigger on 'create a page', 'build a landing page', 'new page for', 'add a program page', 'spin up a registration page', any new program/event needing a page, AND on 'audit this page', 'check the copy on /x', 'is this page consistent', 'language conflicts', 'review the landing page'."
---

# RRA Melbourne page builder + auditor

Two modes. Both start the same way (Step 0). Speak to Alex plainly — he isn't a developer.

**References** (read when the step says so — don't load them all up front):
- `references/site-structure.md` — URLs, files, routes, the 9 promo surfaces, retiring, shipping
- `references/language.md` — authority order (rules > decisions > Andy > Alex), voice, vocabulary, hierarchy, CTA rules, open decisions
- `references/glossary.json` — the vocabulary the audit script checks
- `references/backend.md` — table naming, payment, success/pay pages, Google Sheet sync
- `references/design-system.md` — colours, type, components, motion
- `references/audience.md` — the fact-based audience profile (device, source, timing, attention, who registers) + the SQL to refresh it; START HERE
- `references/offer.md` — design the offer first: outcome, who, numbers, inclusions, proof, price, risk removed, real urgency
- `references/copy-esl.md` — plain English for a multilingual audience; detail one TAP away (toggletips/accordions, no hover-only)
- `references/conversion.md` — Why → How → What page hierarchy, first-screen facts, blueprints per page type, evidence-backed conversion rules
- `references/consumer-law.md` — Australian Consumer Law: every price GST-inclusive and labelled "incl. GST", total price incl. compulsory fees, refund wording, was/now, "free"
- `references/meta-pixel.md` — Meta Pixel on every page view, form (Lead), checkout and payment (Purchase); no personal data in events
- `references/special-guests.md` — any named guest (visiting coach/player): verified résumé, first-mention rule, sales case, never-claims
- `references/guests/<slug>.md` — verified profile per guest, with sources (e.g. `guests/sid-lahiri.md`)

**Tool:** `scripts/page_audit.py` (read-only; reads `origin/main` of the repo):
```bash
S="<this skill dir>/scripts/page_audit.py"
python3 "$S" inventory            # every route, who created it, retired?, which surfaces link to it
python3 "$S" audit /route --site  # one page: banned words, off-glossary wording, claims to verify,
                                  # CTAs, headings, success/pay routes, promo links + site-wide comparison
python3 "$S" conflicts            # site-wide: how each term is written, Andy vs Alex
STRIPE_SECRET_KEY=rk_… python3 "$S" stripe-links   # every Payment Link in live code: active? redirects to a real success page?
```
Add `--fetch` to pull `origin` first. The script finds candidates; **you** still read the page
and judge. It can't see text assembled at runtime or the `programs_config` table.

Repo: `/Users/alexlewis/Documents/Claude/Projects/Player DNA CArd/rr_landing_page1`.

---

## Step 0 — Ground yourself (both modes)

1. `git -C <repo> fetch -q origin` and work from `origin/main`. Never build in the main
   checkout (it's usually dirty with someone else's work) — use a worktree off `origin/main`.
2. Run `inventory`. Note the nearest existing page to the one in question, and which pages
   are Andy's — those are your language models.
3. Read `references/language.md` §1 (authority order) and §6 (open decisions).
4. Today's date matters: anything dated before today on a live surface is a finding.
5. Refresh the audience facts (`audience.md` §4 queries, SELECT-only, aggregates) for the page
   in question: sessions, device, source, sections reached, conversion. Pages are built from
   these facts, not assumptions.

---

## BUILD mode — a new page

### B1. Ask (one group at a time; skip anything Alex already said)

**A. The basics**
1. What's it for, who is it for (ages, level), which centre(s)? (The page must make Melbourne and the centre obvious in the hero — `language.md` §4b.)
2. What happens when someone fills it in? Pick exactly one:
   - **Pays and gets a place** (fixed price) → checkout, `Secure Your Place`
   - **Registers interest, nothing held** → `Register Your Interest`
   - **Applies and is offered a place later** (selection-first, like Spin Club) → interest now, pay page for the offer email
   - **Information only** → no form
3. Public (on the nav and home page) or hidden (direct link only — invites, welcome pages)?
4. When does it close or stop being true? (Every page that can go stale needs a date.)

**B. Facts** — price per player (GST-inclusive — every displayed price says "incl. GST"; any compulsory joining fee, uniform or booking fee goes beside it — `consumer-law.md`), dates, times, venue(s), coach names, what's included,
group size / ratio, refund or swap terms. Every one goes in the page's data file. If a fact
already lives somewhere (`performance-squads/data.js`, `SID` in `openAgeData.js`), it is
imported, not retyped. Unknown facts become explicit TODOs in the plan, never invented.

**Guest?** (visiting coach, player, ambassador) → follow `special-guests.md`:
research and source their current roles, brief career, playing history and who they've
worked with into `references/guests/<slug>.md` BEFORE writing copy; show Alex the verified
profile; anything unverifiable stays off public pages.

**C. Form fields** beyond the standard set (player first/last name, DOB, gender, parent
name, email, phone, suburb, consents).

**D. Copy** — does Alex have wording, or should you draft it? Images folder?

### B2. Offer, then plan — show Alex, wait for "go ahead"

Fill the offer checklist (`offer.md` §2) first. Then:

Use `site-structure.md` §1–3 and `backend.md` §1. One short summary:

```
Page:      /<route>  (public | hidden)  — nearest existing page: /<x>
Closes:    <date> → REVIEW comments on every dated surface
Audience:  <3–5 facts from audience.md that shape this page (device, source, attention, who registers)>
Offer:     <outcome · who · numbers · inclusions · proof · price incl. GST · risk removed · real urgency>
Why:       <the one-line belief, plain words>
Sections:  Hero [Why line + What facts + CTA] → WHY … → HOW … → WHAT … → Form → FAQ
           (blueprint from conversion.md §3 — label each section Why/How/What)
CTA:       primary "<label>" (+ secondary "<label>")
Table:     public.<program_slug>_<kind> — "one row = <plain words>"
Payment:   $X per player via shared checkout → /<route>/success, /<route>/pay   (or: none — why)
           Payment Link instead? → who sets its After-payment redirect to /<route>/success (backend.md §2c)
Sheet:     new tab "<Tab name> — DO NOT EDIT" in RRA — Program Sign-Ups, every 10 min
           (or its own workbook — backend.md §4). Alex gets the direct link after merge (B7).
Surfaces:  Navbar ✔ Footer ✗ What's On ✔ … programs_config (insert inactive, flip after deploy)
Language:  canonical terms used; conflicts found + the recommendation
Missing:   <facts still needed>
```
If the page is paid and PR #104 (shared checkout) isn't on `origin/main`, say so here.

### B3. Write the copy (before the code)

Start from the Why (`conversion.md` §1): write the one-line belief first and get Alex's
nod on it, then the How, then the What. Plain English for a multilingual audience
(`copy-esl.md` §1); extra detail goes behind tap-to-reveal toggletips/accordions, never
hover-only, and never the essentials (`copy-esl.md` §2). Visual hierarchy: `conversion.md` §4b.
Follow `language.md`: Andy's voice, the vocabulary table, CLAUDE.md §1–2. Draft the copy
into the data file first (headlines, section text, FAQ, CTA labels, success-page text) so
it can be read as one piece. If tone matters, show Alex the plain draft first.

### B4. Build

- Files, route and data file: `site-structure.md` §2. Design: `design-system.md` (reuse
  Navbar/Footer/Button; no drop-shadows or translucent boxes; `bg-gradient-rr` class is dead —
  use `style={{ backgroundImage: 'var(--image-gradient-rr)' }}`).
- **Partner Stack on every public page** (Andy, 28 Oct 2026): render
  `<PartnerStack />` (`src/components/power-game/PartnerStack.jsx`) directly above
  `<Footer />` — `theme="dark"` on a dark page. Never copy the logos into a page:
  the shared component is the one list, so adding or removing a partner updates
  every page. Not on success/pay screens, checkout wizards, admin, legal or 404.
- Backend — all five, same PR (`backend.md`): **table** (named + commented + migration file),
  **payment** if priced (always active, automatic success page — §2b), **success page** (+ pay page),
  **every new Stripe Payment Link gets its success-page routing** (Stripe redirect + route +
  webhook map + `client_reference_id` — §2c; Alex, 22 Oct 2026),
  **sheet tab** in the sync, **Meta Pixel** events (`meta-pixel.md`: Lead on submit, InitiateCheckout,
  Purchase on the success page).
- Surfaces: `site-structure.md` §3. Hidden page → none of them.

### B5. Audit your own page — the gate

1. `python3 "$S" audit /<route> --site` against your branch (`--ref <branch>` after committing locally).
2. Fix every banned word and off-glossary term, or note why it stays.
3. `conversion.md` §5 — first screen on a phone answers what/who/where/when/price/button;
   Why → How → What order; 300–750 words, plain; form at minimum fields.
   Location check: Melbourne in the hero, SEO title and first Academy mention; venue + suburb + address.
   `consumer-law.md` §6 pre-ship check — every price incl. GST and labelled, real total shown.
4. Read it as a first-time parent (CLAUDE.md §1 test) and a sceptic (§2.5 test: could a
   parent check every claim, and would we be glad they did?).
5. Meta Pixel fires Lead / InitiateCheckout / Purchase on the preview (Events Manager → Test events).
   Backend QA (`backend.md` §5): test submission, test payment, sheet tab appears.
6. `npm run build` passes; verify in the preview (desktop + mobile).

### B6. Ship

Push branch → open PR → hand Alex the link with: what's live where, the table name, the
sheet tab, the CTA, every REVIEW date, open language decisions, and `programs_config`
steps to do after merge. If a new Payment Link's After-payment redirect isn't proven set
(`backend.md` §2c), list it as an open item for Alex. **Alex merges.**

**A PR is not a live page.** Say plainly in the handover that the page is NOT live until the
PR is merged, and that no poster, QR code, email or social post may point at it before then.
(19 Oct 2026: the Lower Plenty poster went out with a QR code to a page whose PR had sat
unmerged for three days. Every scan landed on the 404 page.)

### B7. After merge — prove it's live (same day)

The build isn't done until all of these are true, checked on rramelbourne.com itself:

1. **The page renders.** The SPA returns HTTP 200 even for a missing route, so `curl -I` proves
   nothing. Read the page text (browser `get_page_text`) and confirm the H1 is there, not
   "PAGE NOT FOUND".
2. **It can take a registration.** Submit one clearly labelled test entry on the LIVE page.
   Confirm the row lands in the table, then delete it (a test row holds a real place).
   **Paid:** the button reaches Stripe Checkout at the right price, with the row id as
   `client_reference_id`. Don't pay with a real card. The webhook test is `npm run test:payments`.
   **Payment Link:** its After-payment redirect goes to `/<route>/success?session_id={CHECKOUT_SESSION_ID}`
   (`stripe-links`, or Alex's screenshot) — `backend.md` §2c. Not proven = not live-ready.
3. **`programs_config`:** flip the new row on now, never before the deploy
   (`site-structure.md` §3, surface 7).
4. **The Google Sheet tab exists.** Within 10 minutes of the deploy the cron creates
   "<Tab name> — DO NOT EDIT" in RRA — Program Sign-Ups. Open it, check the headers read
   cleanly, and give Alex the direct link to that tab (`…/edit#gid=<tab id>`). If it hasn't
   appeared after one cron cycle, check the Vercel function logs for `sync-program-signups`.
5. **Every surface shows it**, and nothing finished is still showing (`site-structure.md` §3).
6. Only then hand over the poster, QR and email assets.

---

## AUDIT mode — an existing page

1. Step 0, then `python3 "$S" audit /<route> --site`.
2. Read the page's components yourself — the script misses copy built at runtime and can't
   judge meaning.
3. Check, in this order (most damaging first):
   1. **Takes money for something that isn't real** — closed program still linked on any of
      the 9 surfaces or `programs_config`; dates in the past; stale place counts.
   2. **Shows a price but can't take payment**, or has no success page — run `stripe-links`:
      every Payment Link active and redirecting to its success page, its `plink_…` id in
      `PAYMENT_LINK_PROGRAMS`, and the success route real (`backend.md` §2c).
   2c. **Meta Pixel** — Lead on the form, Purchase on the success page (paid), global PageView
      on route change, no personal data in events (`meta-pixel.md`).
   2b. **Location** — the hero and SEO say Melbourne; every venue has its suburb; two centres are
      shown as separate places (`language.md` §4b).
   2a. **Consumer law** (`consumer-law.md`) — prices without "incl. GST", compulsory fees not
      beside the headline price, "non-refundable" without the ACL carve-out, expired
      early-bird / was-now prices, "free" that isn't.
   3. **Guest claims** — every named guest checked against `guests/<slug>.md`: all current
      roles on first mention, no retired/invented titles, no unsourced "worked with", no
      attendance certainty without a refund line, no implied selection.
   4. **Claims that break CLAUDE.md §2.4** — promised selection/outcomes, a place "held"
      without payment, fake scarcity.
   5. **Banned language** and first-time-reader failures (unexplained terms, "RRA", bare numbers).
   6. **Language conflicts with other pages** — resolve with the authority order; Andy's live
      wording beats Alex's unless a rule or dated decision says otherwise.
   6b. **Plain English & disclosure** — sentence length, idioms, unexplained terms, hover-only
      content, essentials hidden behind a tap (`copy-esl.md`).
   7. **Hierarchy, Why → How → What & CTAs** — first-screen facts (`conversion.md` §2), body order, one H1, one primary label, ≤1 secondary, labels true to what the button does.
   7b. **Partner Stack** — the shared `<PartnerStack />` sits above the footer (public
      pages only); no hand-copied partner logos that can drift from it.
   8. **Backend** — table name and comment readable cold; sheet tab exists and refreshes;
      hidden pages not linked anywhere.
4. Report as a short list, most severe first. Each finding: `file:line`, what's wrong, who
   wrote the line (Andy/Alex/unknown), the fix, and which source wins. Lines Andy wrote that
   break a rule are **flagged for Alex**, not silently rewritten.
5. Offer to fix. Fixes go through B5–B6 (branch, audit, PR).

---

## Keep this skill true

When Alex or Andy makes a wording decision, update `glossary.json` (with `source`: who +
date) and `language.md` §6. When the audit flags "Andy writes X more than the canonical
form", the glossary is probably wrong — check and fix it. There are two copies of this
skill (`Master Landing Page/.claude/skills/` and `.agents/skills/`) — keep them identical.
