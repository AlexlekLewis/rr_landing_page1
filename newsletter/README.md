# The Royals Report: Academy Director's fortnightly newsletter

Owner: Andy Crook (approves every issue). Built and run by the newsletter agent (Claude Code,
scheduled tasks, see "Schedule" below). Nothing is sent to families without Andy's written approval.

## 1. When we send: Tuesday, 7:30pm Melbourne time, every second week

Evidence (our own data, 24 Nov 2026):

| Day | Stripe payments (30 Apr–30 Oct 2026) | Revenue | Site sessions (last 90 days) |
|---|---|---|---|
| Mon | 57 | $57,771 | 2,901 |
| **Tue** | 46 | **$60,867** (highest) | 1,815 (lowest) |
| Wed | 52 | $55,699 | 2,311 |
| Thu | 54 | $46,562 | 2,093 |
| Fri | 28 | $18,968 | 2,785 |
| Sat | 25 | $8,121 | 2,596 |
| Sun | 34 | $20,492 | 3,100 (highest) |

* Mon–Thu = 71% of payments and 82% of revenue ($221k of $268k). Fri–Sat is where money stops.
* Families **browse** at the weekend (Sunday has the most visits) but **pay** Monday to Thursday.
  Tuesday has the most revenue from the fewest visits: it's when people decide.
* By hour, 6pm–midnight is 42% of payments and 47% of revenue; 6–9pm is the single biggest
  band. 7:30pm lands as the kids' training/dinner rush ends, with Wed and Thu (both strong
  buying days) to follow through.
* Monday is avoided on purpose: it's the busiest inbox day (weekend backlog, school and club mail).
* 76% of site visits are on phones, so the email is designed phone-first.

Test plan: issues 1–4 split the subject line 50/50 on wave 1. From issue 5, re-check the day
with real open/click/purchase data (a Sunday 7pm test against Tuesday is the one worth running).

## 2. Who it goes to: `newsletter_audience` (Supabase)

* Sent to `newsletter_recipients` = the audience minus people known only as coach job applicants.
* Every address ever registered with us: 89 email columns across every sign-up, enquiry,
  payment, waitlist and shop table, plus the canonical player registry. Lower-cased and
  de-duplicated. 1,538 addresses on 24 Nov 2026.
* **Removed automatically:** anyone in `newsletter_suppressions` (unsubscribed, bounced,
  complained, removed by hand), anyone who **unticked** a marketing box on any form
  (`newsletter_opt_outs`), deleted members, and test records. 30 removed on 24 Nov 2026.
* Player-only email columns are not used (under-18s): we write to parents/guardians.
* Adding a new form: add it to `newsletter/sql/gen_audience.py`, regenerate, apply as a
  migration. The view never writes to registration tables.
* Legal basis (Spam Act 2003): inferred consent from an existing relationship (they
  registered, enquired or bought); every email identifies Andy and the Academy, has a working
  one-click unsubscribe, and unsubscribes are honoured at once (the law allows 5 business days).
* Waves: wave 1 = contacts active in the last 6 months (940), Tuesday 7:30pm. Wave 2 = older
  contacts (598), Wednesday 7:30pm. Problems (bounces, complaints) show on the engaged half first.

## 3. Who it's from, and how it reaches the main inbox

**Recommendation: keep Andy's name and address in the From line, but send through an email
service, never from Outlook.**

* From: `Andy Crook | Royals Academy <andy.crook@rramelbourne.com>`, Reply-To: the same.
  A real person's name lifts opens, and replies are the strongest "this is wanted mail"
  signal Gmail has. 64% of the list is Gmail and 16% Yahoo, so their rules decide where we land.
* **Why not send from Outlook/M365:** 1,500 BCC'd or one-by-one messages from a personal
  mailbox trip Microsoft's outbound spam limits (and can get the mailbox blocked), carry no
  one-click unsubscribe header (Gmail and Yahoo now require it for bulk mail), can't track
  bounces, and put Andy's day-to-day email reputation at risk.
* **Service: Resend** (already used by the site for confirmation emails, `RESEND_API_KEY` in
  Vercel). Broadcasts + Audiences adds the unsubscribe header and link, bounce handling and
  scheduling. Low cost at our volume. (Mailchimp/Klaviyo are the alternative if Andy wants a
  drag-and-drop editor; this build works with either.)
* **DNS on rramelbourne.com (one-off, whoever manages the domain):**
  1. Add the domain in Resend → Domains. It gives a DKIM TXT record (`resend._domainkey`) and an
     SPF/MX pair on a `send` subdomain. Add all of them exactly as shown, then press Verify.
  2. DMARC: if there's no `_dmarc` record, add TXT `_dmarc` = `v=DMARC1; p=none; rua=mailto:dmarc@rramelbourne.com`
     (any monitored address). Move to `p=quarantine` after a month of clean reports.
  3. Check the existing SPF (TXT on the root) still includes Microsoft 365
     (`include:spf.protection.outlook.com`). Only one SPF record is allowed.
  These could not be checked from the agent's sandbox (it has no public DNS). Check them at
  mxtoolbox.com (SuperTool → DMARC / SPF / DKIM lookup).
* Warm-up: our list is small and recent, so two waves on issue 1 are enough. Keep spam
  complaints under 0.1% (Gmail's hard limit is 0.3%) and hard bounces under 2%.
* Content hygiene that also matters: real text (not text in images), a plain-text part, under
  102 KB (Gmail clips longer emails, hiding the unsubscribe link), one sender name every time,
  no link shorteners, links only to rramelbourne.com and our socials.

## 4. What's in every issue (the formula)

Roughly 70% value, 30% selling. People open for the stories and buy because the program
is right there.

1. **Andy's note:** 3 short paragraphs, personal, signed with his photo.
2. **Feature:** the biggest story of the fortnight (Royals family or Academy).
3. **Our players:** two results/case studies from news (Weekend Wrap, Power League, etc.).
4. **Coming up:** 3–4 programs, each with one clear button. Lead with whatever has a deadline.
5. **Inside the Academy:** a longer story or case study with 3 big numbers.
6. **From the nets:** one practical tip (coaches can send these in).
7. **Store or offer:** seasonal (Christmas gifts, back-to-season kit).
8. **Contact:** reply to Andy, text us (`SMS_NUMBER`), info@rramelbourne.com. Footer: unsubscribe, privacy, address.

Sources, newest first: `src/components/news/newsStories.js` (+ Power Cricket's tagged feed),
`src/components/home-page/openDaysData.js` ANNOUNCEMENTS, `src/components/home-page/HomeHero.jsx`
PROGRAMS, each program's data file for facts, `src/components/academy-shop/shopConfig.js`.
**Every fact is checked against those files**; never invent results, quotes, prices or dates.
Private Coaching shows no prices (Andy, 18 Nov 2026). Don't name under-18s who aren't already
named in a published story.

Copy: plain English (many families speak English as a second language), Australian spelling,
short sentences, one idea per paragraph, buttons say exactly what happens ("Join this week").

## 5. How an issue is made (files)

```
newsletter/issues/NNN-YYYY-MM-DD.json   the content (edit this)
node newsletter/build.mjs newsletter/issues/NNN-YYYY-MM-DD.json
newsletter/out/NNN-….html               send version (absolute images, UTM links, unsubscribe tag)
newsletter/out/NNN-….txt                plain-text part
newsletter/out/NNN-….preview.html       proof with images embedded
node newsletter/send.mjs sync           audience → Resend; unsubscribes → newsletter_suppressions
node newsletter/send.mjs schedule newsletter/issues/NNN-….json --wave=1 --go
```

Links carry `utm_source=newsletter&utm_medium=email&utm_campaign=royals-report-NN&utm_content=<slot>`,
so PostHog and Stripe success pages show which block sold what.

## 6. Schedule (the newsletter agent's deadlines)

State lives in `newsletter_issues` (status: planned → drafting → proof_sent → approved →
scheduled → sent). Times are Melbourne time.

| When | Who | What |
|---|---|---|
| **Wednesday, 6 days before send** (9:47am) | agent | Report last issue's results; build the next issue; email the proof to andy.crook@whitewallsport.com; status `proof_sent`. |
| Thu–Sun | Andy | Reply to the proof email: **APPROVED**, or the changes. |
| **Monday, day before** (11:43am) | agent | Apply any changes and re-send the proof. If no answer yet, send Andy a reminder: approve by **Tuesday 3pm** or the issue moves a fortnight. |
| **Tuesday, send day** (3:13pm) | agent | If approved: `sync`, schedule wave 1 for 7:30pm and wave 2 for Wednesday 7:30pm; status `scheduled`. If not approved by 3pm: no send, status `skipped`, tell Andy. |
| Following Tuesday | agent | Results go into `newsletter_issues.results` (sends, opens, clicks, unsubscribes, bounces, and Stripe purchases with `utm_campaign`). |

Calendar (first 15 issues): 1 Dec, 15 Dec 2026 · 12 Jan, **Wed** 27 Jan (Australia Day),
9 Feb, 23 Feb, 9 Mar, 23 Mar, 6 Apr, 20 Apr, 4 May, 18 May, 1 Jun, 15 Jun, 29 Jun 2027.
29 Dec is skipped (holiday week).

## 7. Measures of success

| | Target | Why |
|---|---|---|
| Open rate | 45%+ | Warm list, personal sender. Apple Mail inflates opens; use clicks to judge. |
| Click rate | 5%+ | Sports/education newsletters average ~3%. |
| Purchases with `utm_source=newsletter` | grows issue on issue | The real goal. |
| Unsubscribes | < 0.5% per issue | Higher means too often or not relevant. |
| Spam complaints | < 0.1% | Gmail blocks bulk senders above 0.3%. |
| Hard bounces | < 2% | Old addresses get removed automatically. |

## 8. Before every send: checklist

- [ ] Every fact matches its source file; no prices for Private Coaching.
- [ ] Andy has replied APPROVED to this exact proof (latest version).
- [ ] Subject ≤ 45 characters, preheader adds to it (doesn't repeat it).
- [ ] Every button and link opens the right page (and the page is live).
- [ ] Images load from rramelbourne.com; every image has alt text.
- [ ] Footer: unsubscribe works, postal address present.
- [ ] HTML under 102 KB.
- [ ] `sync` run today (fresh unsubscribes pulled back first).
