# rramelbourne.com (rr_landing_page1)

Rules for every change to this site, whoever makes it (Andy, Alex or the development team).

## Mandatory training shirt on every paid program page

Andy, 9 Nov 2026: *"on every page we ever create … the mandatory shirt ordering component that
ensures that if they don't have a shirt they have to order it. This MUST be in everything either
I or Alex does where it's a product based page."*

**Applies to:** every page where a family pays for a program, term, squad, holiday program,
camp or session place. **Not** to: the Academy shop itself, free events, interest-only or
"register your interest" forms, tour deposits.

Every such booking form must:

1. Use `<TrainingShirtStep>` (`src/components/shared/TrainingShirtStep.jsx`): "Does <player>
   already have a Royals Academy training shirt?" Yes / No. "No" requires a size
   (size guide included). The form must not submit until `shirtError(value)` from
   `src/lib/kit/trainingShirt.js` returns null.
2. Save the answer with the booking: `shirtTag(value)` (`|shirt=has` or `|shirt=order-28`) in
   `source`, or a `shirt_size` column, and show it in the program's sign-up sheet so whoever
   hands out shirts sees the size.
3. Charge it so it can't be skipped:
   - **Server checkout** (Checkout Session built in `api/`): add the shirt line
     (`UNIFORM_CATALOG.shirt` in `api/_lib/uniformPricing.js`, $29.95 incl. GST) whenever the
     answer is "No", with the size in its description.
   - **Stripe Payment Link**: two links. One with the training shirt
     (`price_1U3aZRIo52UEA50yAEQGEDDd`) **locked at quantity 1** (adjustable quantity OFF), for
     "No"; one without it, for "Yes". Never a single link where the family can set the shirt to 0.
     Add both `plink_…` ids to `PAYMENT_LINK_PROGRAMS` in `api/stripe-webhook.js`.
4. Show the shirt in the summary before payment and on the success page ("size 28, ordered
   with this booking").

Worked example: Junior Royals (`src/components/junior-royals-t3/JRT3RegistrationForm.jsx`,
`WEEKLY_LINK` / `WEEKLY_NO_SHIRT_LINK` in `jrTerm4Data.js`). Tests:
`src/lib/kit/trainingShirt.test.ts`, `jrTerm4Pay.test.ts`.

A paid page without this is not finished: don't open the PR, hand it off or put it live.

Section numbers that skills cite (e.g. "CLAUDE.md §1") refer to the master CLAUDE.md in the
team's Master Landing Page folder, not this file.

## Skills for this site

- `rr-page-generator`: build or audit a page (copy, structure, backend, promo surfaces).
- `dev-handoff`: the developer hand-off PDF and Google Drive folder after any page change.
