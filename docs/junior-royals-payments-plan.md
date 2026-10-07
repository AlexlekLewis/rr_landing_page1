# Junior Royals: how payments would work (plan only, 8 Oct 2026)

Nothing here is built. It turns the pricing Alex set on 7–8 Oct 2026 into the
pieces we would need, so the build can start as soon as the open decisions
(end of this file) are made.

## What families can buy

Prices incl. GST, per session: Groups of 4 $49.95, Groups of 6 $34.95.
Discounted prices are rounded down to 5c (see `priceAhead` in
`src/components/junior-royals/v2/jrV2Content.js`).

| Way to pay | When we charge | Amount |
|---|---|---|
| By the term | Automatically, at the start of each term, until they stop | sessions in that term × full price |
| Weekly | Each Wednesday of term (enrolled for the whole term) | full price, once a week |
| 2 terms ahead | Once, up front | sessions in both terms × price less 10% |
| 4 terms (a year) ahead | Once, up front | sessions in the 4 terms × price less 15% |

Terms are different lengths (8, 10 or 11 Wednesdays), so a fixed Stripe
"recurring price" does not fit. The plan is to save the family's payment
method once and charge the right amount ourselves on the right date.

## The pieces

1. **Enrolment checkout (Stripe Checkout).** The family picks the centre,
   group, time and payment plan, then pays the first amount and saves a
   payment method in the same step: card, or Australian bank direct debit
   (BECS, with Stripe's mandate wording). Prepaid plans pay the whole amount
   here.
2. **Two new tables** (named and commented like the rest of rraa-landing):
   - `junior_royals_enrolments`: one row = one player's place (centre, group,
     time, plan, Stripe customer, status, notice date, last term).
   - `junior_royals_charges`: one row = one charge (term or week, amount,
     Stripe id, status).
3. **A daily billing job** (Vercel cron, like the sheet syncs). It charges the
   saved method:
   - term payers, on the Monday before each term starts;
   - weekly payers, each Wednesday in term;
   - prepaid families, nothing until their prepaid terms run out. Then they
     go back to "by the term" at full price unless they prepay again
     (decision 4).
   It skips anyone whose notice arrived at least 2 weeks before the term.
4. **Stripe webhook** records each payment, or each failure, against the
   charge row. BECS debits take up to 3 business days to settle, and a
   failure can arrive days later.
5. **Emails.**
   - *Before each term:* "Your place in Term 1 continues. We'll charge $X on
     DATE. To stop, email us by DATE." Sent 3 weeks before the term, so the
     2-week notice window is visible and fair. That makes the automatic
     renewal clear under Australian Consumer Law.
   - *After each charge:* a receipt.
   - *If a payment fails:* "please update your card or bank details", with a
     Stripe link to do it.
   The outbox/reminder plan in the portal docs can carry these.
6. **Admin.**
   - A Junior Royals tab in the sign-ups sheet: who is enrolled, how they pay,
     what was charged, what failed.
   - Recording a family's notice to stop.
   - A refund for prepaid families who leave early (decision 1).
7. **Sheet sync and watchdog lines** for both new tables, as for every form.

## Timing

Realistic build: about 4–6 working days, including Stripe test-mode runs of
every path (card and BECS, weekly and term, failure and retry, notice,
prepaid). Then a lawyer reads the Terms (auto-renewal, notice, refunds).
Enrolment is pencilled to open Mon 19 Oct, 11 days from today. That is tight.

**Fallback if the full build isn't ready by 19 Oct:**
- **Term 4 2026 (8 sessions):** sell it as a single up-front payment through
  the shared checkout we already have: $399.60 for Groups of 4, $279.60 for
  Groups of 6. Save the payment method in the same checkout so the place can
  roll on.
- **Term 1 2027:** switch on the rolling term debit and the weekly option.
  The first automatic charge is then early February, which gives time to
  build and test.

## Decisions needed before the build

1. **Leaving early after paying ahead.** Proposed: the terms they used are
   re-charged at full price and the rest is refunded. Approve? Lawyer to
   check.
2. **Late notice.** If a family tells us less than 2 weeks before a term, is
   that term charged? Proposed: yes, said plainly in the reminder email.
3. **Failed payments.** Proposed: retry once after 3 days. After 2 failures,
   pause the place and tell the family.
4. **When prepaid terms run out.** Proposed: roll on to "by the term" at full
   price, with the reminder email offering to prepay again.
5. **Weekly payers missing a payment mid-term.** Proposed: same as decision 3.
   They stay enrolled for the term, and we chase the amount owed.
6. **Card and BECS fees.** Proposed: absorbed (the model allows 2%). BECS is
   cheaper; we could make it the default.
7. **GST registration** confirmed (every "incl. GST" price depends on it).
