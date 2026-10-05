// Tests for the Program Sign-Ups sheet sync. These cover the parts that have
// actually broken in this codebase before: number/text coercion in Sheets, rows
// looking "changed" on every run, payments being attached to the wrong person
// (or silently dropped), and a tab quietly emptying because a program
// identifier drifted away from the form that writes it.
import { describe, it, expect } from 'vitest';
import {
  OPEN_TRIAL_HEADERS,
  SPIN_CLUB_HEADERS,
  SID_HEADERS,
  TOUR_HEADERS,
  PAY_HEADERS,
  PROGRAM_LABELS,
  PROGRAM_PAYMENT_LINKS,
  openTrialRow,
  spinClubRow,
  sidRow,
  sidCentre,
  tourRowFromApplication,
  tourRowFromEoi,
  payRow,
  paymentCheck,
  JR_TERM4_HEADERS,
  jrTerm4Row,
  jrTerm4CentreStatus,
  isTourEntryInWindow,
  allocatePayments,
  describeLinkHealth,
  guideLines,
} from './sync-program-signups.js';
import { sameRow, colLetter } from './_lib/sheetReconcile.js';

// ------------------------------------------------------------
// Fixtures, shaped like the real rows these tables hold.
// ------------------------------------------------------------
const trialLead = (over = {}) => ({
  id: 'oa-1',
  created_at: '2026-09-29T02:25:48.705Z',
  player_name: 'Sample Player',
  player_age: '19',
  parent_name: '',
  email: 'Player@Example.com',
  phone: '0412345678',
  club: 'Sample CC',
  preferred_centre: 'south-east-melbourne',
  program_type: 'performance-squads-open-age-2026',
  trial_sessions: 1,
  trial_session_dates: ['oa-2026-10-04'],
  ...over,
});

const spinLead = (over = {}) => ({
  id: 'sc-1',
  created_at: '2026-09-27T07:59:11.746Z',
  first_name: 'Aarav',
  last_name: 'Bhatia',
  age: 13,
  email: 'parent@example.com',
  phone: '0478603260',
  club: null,
  parent1_name: 'Mohit Bhatia',
  cricket_type: 'Leg spin',
  experience_level: 'Yes — I am in a Performance Squad',
  location: 'south',
  program: 'Spin Club South',
  bio: 'Intends to accept an offer if selected: yes',
  ...over,
});

const sidBooking = (over = {}) => ({
  id: 'sid-1',
  created_at: '2026-09-30T07:17:19.011Z',
  match_slug: 'sid-juniors-2026-10-04-cranbourne-north-request',
  match_name: 'Junior session with Siddhartha Lahiri, Sun 4 Oct 2026, Cranbourne North',
  player_name: 'Junior Player',
  player_age: 11,
  parent_name: 'A Parent',
  email: 'parent@example.com',
  phone: '0400000000',
  club: 'Sample CC',
  notes: null,
  accept_social_media: true,
  amount: null,
  ...over,
});

const jrT4 = (over = {}) => ({
  id: 'jr-1',
  created_at: '2026-09-28T02:00:00.000Z',
  player_name: 'Junior Player',
  player_age: 9,
  parent_name: 'A Parent',
  parent_email: 'parent@example.com',
  parent_phone: '0400111222',
  preferred_centre: 'mickleham',
  preferred_day: 'wednesday',
  ...over,
});

const payment = (over = {}) => ({
  sessionId: 'cs_test_1',
  paidAt: '2026-09-29T03:00:00.000Z',
  payerName: 'A Payer',
  payerEmail: 'Player@Example.com',
  amountCents: 3000,
  program: 'open-trial',
  centre: 'south-east-melbourne',
  sessions: 1,
  ...over,
});

// ------------------------------------------------------------
// Program identifiers. A tab that silently empties is the worst failure here,
// because it looks exactly like "nobody has signed up".
// ------------------------------------------------------------
describe('program identifiers', () => {
  it('every program has a label and a payment-link entry, even an empty one', () => {
    for (const key of Object.keys(PROGRAM_LABELS)) {
      expect(PROGRAM_PAYMENT_LINKS[key], `no payment-link entry for ${key}`).toBeDefined();
    }
    for (const key of Object.keys(PROGRAM_PAYMENT_LINKS)) {
      expect(PROGRAM_LABELS[key], `no label for ${key}`).toBeTruthy();
    }
  });

  it('only the open trial takes money online today', () => {
    // If this fails, a payment link was added — good. Update the guide tab's
    // "Only the Open Trial charges anything online" line in the same change.
    expect(Object.keys(PROGRAM_PAYMENT_LINKS['open-trial'])).toHaveLength(4);
    expect(Object.keys(PROGRAM_PAYMENT_LINKS['spin-club'])).toHaveLength(0);
    expect(Object.keys(PROGRAM_PAYMENT_LINKS['sid-juniors'])).toHaveLength(0);
    expect(Object.keys(PROGRAM_PAYMENT_LINKS['tour-interest'])).toHaveLength(0);
  });
});

// ------------------------------------------------------------
// Row shape. A row longer or shorter than its header block writes into, or
// leaves a gap in, somebody's notes column.
// ------------------------------------------------------------
describe('row width matches its header block', () => {
  it.each([
    ['open trial', openTrialRow(trialLead(), null), OPEN_TRIAL_HEADERS],
    ['spin club', spinClubRow(spinLead()), SPIN_CLUB_HEADERS],
    ['sid juniors', sidRow(sidBooking(), null), SID_HEADERS],
    ['tour (page)', tourRowFromApplication({ id: 't1' }), TOUR_HEADERS],
    ['tour (old EOI)', tourRowFromEoi({ id: 't2' }), TOUR_HEADERS],
    ['jr term 4', jrTerm4Row(jrT4()), JR_TERM4_HEADERS],
    ['payments', payRow(payment()), PAY_HEADERS],
  ])('%s', (_name, row, headers) => {
    expect(row).toHaveLength(headers.length);
  });
});

// ------------------------------------------------------------
// Sheets coercion. A phone number that loses its leading 0, or an age that
// renders as a 1900s date, is the bug this codebase keeps re-learning.
// ------------------------------------------------------------
describe('text coercion', () => {
  it('keeps the leading zero on a phone number', () => {
    const row = openTrialRow(trialLead(), null);
    expect(row[OPEN_TRIAL_HEADERS.indexOf('Phone')]).toBe("'0412345678");
  });

  it('writes age as text so Sheets cannot date-format it', () => {
    const row = openTrialRow(trialLead(), null);
    expect(row[OPEN_TRIAL_HEADERS.indexOf('Age')]).toBe("'19");
  });

  it('writes a date of birth as text', () => {
    const row = tourRowFromApplication({ id: 't1', dob: '2009-12-25' });
    expect(row[TOUR_HEADERS.indexOf('Date of Birth')]).toBe("'2009-12-25");
  });

  it('a row read back from Sheets without its apostrophes is still "unchanged"', () => {
    // This is what made an earlier sync rewrite every row on every run.
    const built = openTrialRow(trialLead(), null);
    const asSheetsReturnsIt = built.map((c) => (String(c).startsWith("'") ? String(c).slice(1) : c));
    expect(sameRow(asSheetsReturnsIt, built, OPEN_TRIAL_HEADERS.length)).toBe(true);
  });
});

// ------------------------------------------------------------
// Open trial
// ------------------------------------------------------------
describe('open trial rows', () => {
  it('turns a session id into something a coach can read', () => {
    const row = openTrialRow(trialLead(), null);
    expect(row[OPEN_TRIAL_HEADERS.indexOf('Session Dates')]).toBe('Sun 4 Oct, 1:00-2:30 PM (Cranbourne North)');
    expect(row[OPEN_TRIAL_HEADERS.indexOf('Centre')]).toBe('Cranbourne North');
  });

  it('shows an unknown session id rather than hiding it', () => {
    const row = openTrialRow(trialLead({ trial_session_dates: ['oa-2027-01-01'] }), null);
    expect(row[OPEN_TRIAL_HEADERS.indexOf('Session Dates')]).toBe('oa-2027-01-01');
  });

  it('charges $30 a session and says who has not paid', () => {
    const unpaid = openTrialRow(trialLead(), null);
    expect(unpaid[OPEN_TRIAL_HEADERS.indexOf('Fee Due (AUD)')]).toBe('$30.00');
    expect(unpaid[OPEN_TRIAL_HEADERS.indexOf('Paid in Stripe?')]).toBe('No');
    expect(unpaid[OPEN_TRIAL_HEADERS.indexOf('Payment Check')]).toBe('Not paid yet');

    const paid = openTrialRow(trialLead(), { amountCents: 3000, paidAt: '2026-09-29T03:00:00.000Z' });
    expect(paid[OPEN_TRIAL_HEADERS.indexOf('Paid in Stripe?')]).toBe('Yes');
    expect(paid[OPEN_TRIAL_HEADERS.indexOf('Amount Paid (AUD)')]).toBe('$30.00');
    expect(paid[OPEN_TRIAL_HEADERS.indexOf('Payment Check')]).toBe('OK');
  });
});

describe('paymentCheck', () => {
  it('never tells anyone to chase a family that has overpaid for a sibling', () => {
    const msg = paymentCheck(3000, { amountCents: 6000 });
    expect(msg).toContain('sibling');
    expect(msg).toContain('Check before chasing');
  });

  it('names the shortfall in dollars', () => {
    expect(paymentCheck(6000, { amountCents: 3000 })).toBe('Short $30.00 — paid $30.00 of $60.00');
  });
});

// ------------------------------------------------------------
// Spin Club
// ------------------------------------------------------------
describe('spin club rows', () => {
  it('says in words that nothing is owed', () => {
    const row = spinClubRow(spinLead());
    expect(row[SPIN_CLUB_HEADERS.indexOf('Payment')]).toBe('Nothing to pay — this is a registration of interest only');
  });

  it('names the venue, not the "north"/"south" code', () => {
    expect(spinClubRow(spinLead())[SPIN_CLUB_HEADERS.indexOf('Which Spin Club')])
      .toBe('Spin Club South — Elite Cricket Centre, Cranbourne North');
    expect(spinClubRow(spinLead({ location: 'north' }))[SPIN_CLUB_HEADERS.indexOf('Which Spin Club')])
      .toBe('Spin Club North — Mickleham Indoor Sports Centre');
  });

  it('drops the boilerplate line the form appends to every single row', () => {
    expect(spinClubRow(spinLead())[SPIN_CLUB_HEADERS.indexOf('What They Told Us')]).toBe('');
  });

  it('keeps what the parent actually wrote', () => {
    const bio = 'He bowls wrist spin.\n\nIntends to accept an offer if selected: yes';
    expect(spinClubRow(spinLead({ bio }))[SPIN_CLUB_HEADERS.indexOf('What They Told Us')])
      .toBe('He bowls wrist spin.');
  });
});

// ------------------------------------------------------------
// Juniors with Sid
// ------------------------------------------------------------
describe('sid juniors rows', () => {
  it('reads the centre out of the slug', () => {
    expect(sidCentre('sid-juniors-2026-10-04-cranbourne-north-request')).toBe('Cranbourne North');
    expect(sidCentre('sid-juniors-2026-10-05-mickleham')).toBe('Mickleham');
    expect(sidCentre(null)).toBe('');
  });

  it('never implies a place is held when only a request was made', () => {
    const row = sidRow(sidBooking(), null);
    const line = row[SID_HEADERS.indexOf('Payment')];
    expect(line).toBe('Booking request — no payment has been taken and no place is held');
  });

  it('shows a payment once a Stripe link exists and someone pays', () => {
    const row = sidRow(
      sidBooking({ match_slug: 'sid-juniors-2026-10-05-mickleham', amount: 30 }),
      { amountCents: 3000, paidAt: '2026-10-01T03:00:00.000Z' },
    );
    expect(row[SID_HEADERS.indexOf('Payment')]).toBe('Paid');
    expect(row[SID_HEADERS.indexOf('Amount Paid (AUD)')]).toBe('$30.00');
  });
});

// ------------------------------------------------------------
// Tour interest
// ------------------------------------------------------------
describe('tour interest rows', () => {
  it('says which form each person came through', () => {
    expect(tourRowFromApplication({ id: 't1' })[TOUR_HEADERS.indexOf('Registered Via')])
      .toBe('Tour page (rramelbourne.com/tours)');
    expect(tourRowFromEoi({ id: 't2' })[TOUR_HEADERS.indexOf('Registered Via')])
      .toContain('closed 10 Aug 2026');
  });

  it('turns tour window ids into the words on the form', () => {
    const row = tourRowFromApplication({ id: 't1', tour_interest: ['2026-12-late-dec-jan', '2027-04-april'] });
    expect(row[TOUR_HEADERS.indexOf('Tours They Want')])
      .toBe('Late December 2026 to early January 2027, April 2027');
  });

  it('never implies money has been taken', () => {
    for (const row of [tourRowFromApplication({ id: 't1' }), tourRowFromEoi({ id: 't2' })]) {
      expect(row[TOUR_HEADERS.indexOf('Payment')]).toBe('Nothing to pay — this is an expression of interest only');
    }
  });
});

// ------------------------------------------------------------
// Payment allocation. The open trial reuses the September squad-trial Stripe
// links, so an email-for-all-time total would mark October as paid off a
// September payment.
// ------------------------------------------------------------
describe('allocatePayments', () => {
  const sept = { id: 'sep', created_at: '2026-09-01T00:00:00.000Z', email: 'p@example.com', player_name: 'P', program_type: 'squads' };
  const oct = { id: 'oct', created_at: '2026-09-29T00:00:00.000Z', email: 'P@Example.com', player_name: 'P', program_type: 'performance-squads-open-age-2026' };

  it('settles each payment against one registration, not every one for that email', () => {
    const { byRecordId } = allocatePayments([sept, oct], [
      payment({ sessionId: 'cs_sep', payerEmail: 'p@example.com', paidAt: '2026-09-02T00:00:00.000Z' }),
    ]);
    expect(byRecordId.get('sep')?.amountCents).toBe(3000);
    expect(byRecordId.has('oct')).toBe(false);
  });

  it('gives a later payment to the later registration', () => {
    const { byRecordId, recordByPayment } = allocatePayments([sept, oct], [
      payment({ sessionId: 'cs_sep', payerEmail: 'p@example.com', paidAt: '2026-09-02T00:00:00.000Z' }),
      payment({ sessionId: 'cs_oct', payerEmail: 'p@example.com', paidAt: '2026-09-29T06:00:00.000Z' }),
    ]);
    expect(byRecordId.get('oct')?.amountCents).toBe(3000);
    expect(recordByPayment.get('cs_oct')?.program).toBe('performance-squads-open-age-2026');
  });

  it('matches on email case-insensitively', () => {
    const { byRecordId } = allocatePayments([oct], [payment({ payerEmail: '  PLAYER@example.COM  ', paidAt: '2026-09-30T00:00:00.000Z' })]);
    expect(byRecordId.size).toBe(0); // different address entirely — must NOT match
    const { byRecordId: hit } = allocatePayments([oct], [payment({ payerEmail: '  P@Example.COM  ', paidAt: '2026-09-30T00:00:00.000Z' })]);
    expect(hit.get('oct')?.amountCents).toBe(3000);
  });

  it('adds up two payments from the same address against the same registration', () => {
    const { byRecordId } = allocatePayments([oct], [
      payment({ sessionId: 'a', payerEmail: 'p@example.com', paidAt: '2026-09-30T00:00:00.000Z' }),
      payment({ sessionId: 'b', payerEmail: 'p@example.com', paidAt: '2026-09-30T01:00:00.000Z' }),
    ]);
    expect(byRecordId.get('oct')?.amountCents).toBe(6000);
    // The earliest payment is when they committed.
    expect(byRecordId.get('oct')?.paidAt).toBe('2026-09-30T00:00:00.000Z');
  });

  it('a payment we cannot attach is left unattached, never guessed at', () => {
    const { byRecordId, recordByPayment } = allocatePayments([oct], [payment({ payerEmail: 'someone.else@example.com' })]);
    expect(byRecordId.size).toBe(0);
    expect(recordByPayment.size).toBe(0);
  });
});

describe('payments tab', () => {
  it('spells out an unmatched payment instead of leaving a blank', () => {
    const row = payRow({ ...payment(), matchedId: null });
    expect(row[PAY_HEADERS.indexOf('Matched To')]).toContain('UNMATCHED');
  });

  it('carries the matched program, so open-trial money is distinguishable from squad money', () => {
    const row = payRow({ ...payment(), matchedId: 'oct', matchedPlayer: 'P', matchedProgram: 'performance-squads-open-age-2026' });
    expect(row[PAY_HEADERS.indexOf('Which Program the Match Belongs To')]).toBe('performance-squads-open-age-2026');
  });
});

// ------------------------------------------------------------
// Payment-link health. A configured URL Stripe has never heard of takes money
// nowhere, and the player quietly gives up. Silence is the dangerous outcome.
// ------------------------------------------------------------
describe('describeLinkHealth', () => {
  const urls = Object.keys(PROGRAM_PAYMENT_LINKS['open-trial']);
  const live = (list) => ({
    ids: new Map(list.map((u, i) => [`plink_${i}`, { url: u, program: 'open-trial', centre: 'south-east-melbourne', sessions: 1 }])),
    inactive: [],
  });

  it('calls a link Stripe does not have BROKEN', () => {
    const lines = describeLinkHealth(live(urls.slice(1)));
    expect(lines.filter((l) => l.includes('BROKEN'))).toHaveLength(1);
  });

  it('calls a switched-off link out too', () => {
    const lines = describeLinkHealth({ ...live(urls), inactive: [urls[0]] });
    expect(lines.filter((l) => l.includes('TURNED OFF'))).toHaveLength(1);
  });

  it('says "working" only for links Stripe actually returned', () => {
    const lines = describeLinkHealth(live(urls));
    expect(lines.every((l) => l.endsWith('working.'))).toBe(true);
  });
});

// ------------------------------------------------------------
// The guide tab tells people where their notes are safe. A stale figure here
// sends someone to type into a column that gets overwritten.
// ------------------------------------------------------------
describe('guide tab', () => {
  it('points at the first column each tab never touches', () => {
    const text = guideLines([], {}).map((r) => r[0]).join('\n');
    expect(text).toContain(`${PROGRAM_LABELS['open-trial']}: column ${colLetter(OPEN_TRIAL_HEADERS.length)} onwards`);
    expect(text).toContain(`${PROGRAM_LABELS['spin-club']}: column ${colLetter(SPIN_CLUB_HEADERS.length)} onwards`);
    expect(text).toContain(`${PROGRAM_LABELS['sid-juniors']}: column ${colLetter(SID_HEADERS.length)} onwards`);
    expect(text).toContain(`${PROGRAM_LABELS['tour-interest']}: column ${colLetter(TOUR_HEADERS.length)} onwards`);
  });

  it('reports the live counts rather than a fixed number', () => {
    const text = guideLines([], {
      openTrial: 17, spinClub: 4, sidJuniors: 9, tour: 2, tourBeforeCutoff: 22, jrTerm4: 29,
    }).map((r) => r[0]).join('\n');
    expect(text).toContain('Currently 17 sign-ups');
    expect(text).toContain('Currently 4 sign-ups');
    expect(text).toContain('Currently 9.');
    expect(text).toContain('Currently 2 entries');
    expect(text).toContain('Currently 29 entries');
  });

  it('says plainly that a Sid booking holds no place', () => {
    const text = guideLines([], {}).map((r) => r[0]).join('\n');
    expect(text).toContain('no money has been taken and no place is held');
  });
});

// ------------------------------------------------------------
// Junior Royals Term 4. The danger here is not a missing row — it is a row that
// reads as normal when the centre that family chose has no Term 4 program at
// all. 16 of the 29 entries are in exactly that position.
// ------------------------------------------------------------
describe('junior royals term 4', () => {
  it('confirms the night and dates for a centre that IS running', () => {
    for (const centre of ['mickleham', 'cranbourne-north']) {
      const status = jrTerm4CentreStatus(centre);
      expect(status).toMatch(/^Yes/);
      expect(status).toContain('Wednesdays');
      expect(status).toContain('28 October to 16 December');
    }
  });

  // "Hallam" is the Cranbourne North centre under its old name (Alex, 30 Sep
  // 2026). Reading it as a closed centre would tell 12 families there is no
  // program when there is one — the single most damaging thing this tab could do.
  it('says a hallam family still has a program, but at a different venue', () => {
    const status = jrTerm4CentreStatus('hallam');
    expect(status).toMatch(/^Yes/);
    expect(status).toContain('DIFFERENT VENUE');
    expect(status).toContain('Cranbourne North');
    expect(status).toContain('before 28 October');
  });

  // The form's save-anyway fallback (5 Oct 2026): 'any' + the real centre in source.
  it('reads a fallback-saved Cranbourne North entry back as Cranbourne North', () => {
    const r = jrT4({ preferred_centre: 'any', source: 'junior-royals-term4-entry|centre=cranbourne-north' });
    expect(jrTerm4Row(r)[JR_TERM4_HEADERS.indexOf('Centre They Chose')]).toBe('Elite Cricket Centre, Cranbourne North');
    expect(jrTerm4CentreStatus('cranbourne-north')).toMatch(/^Yes/);
  });

  it('shows a hallam row under the venue they must actually attend', () => {
    const cell = jrTerm4Row(jrT4({ preferred_centre: 'hallam' }))[JR_TERM4_HEADERS.indexOf('Centre They Chose')];
    expect(cell).toContain('Cranbourne North');
    expect(cell).toContain('entered when it ran at Hallam');
  });

  it('says NO only for Williamstown, and says the family has not been told', () => {
    const status = jrTerm4CentreStatus('williamstown');
    expect(status).toMatch(/^NO/);
    expect(status).toContain('Williamstown');
    expect(status).toContain('have not been told');
  });

  it('never proposes another centre — that is Alex\'s call, not a column', () => {
    const status = jrTerm4CentreStatus('williamstown');
    expect(status).not.toMatch(/mickleham|cranbourne/i);
  });

  it('flags an unrecognised centre instead of passing it off as fine', () => {
    const status = jrTerm4CentreStatus('bundoora');
    expect(status).toContain('not one we recognise');
    expect(status).not.toMatch(/^Yes/);
  });

  it('a blank centre does not read as a working one', () => {
    expect(jrTerm4CentreStatus('')).toContain('(blank)');
    expect(jrTerm4CentreStatus(undefined)).not.toMatch(/^Yes/);
  });

  it('spells out what picking Monday actually means', () => {
    const row = jrTerm4Row(jrT4({ preferred_day: 'monday' }));
    expect(row[JR_TERM4_HEADERS.indexOf('Night They Chose')])
      .toBe('Monday — only runs if we add a second night');
  });

  it('explains a blank night rather than leaving the cell empty', () => {
    const row = jrTerm4Row(jrT4({ preferred_day: null }));
    expect(row[JR_TERM4_HEADERS.indexOf('Night They Chose')])
      .toContain('entered before the form asked');
  });

  it('never implies a place is held', () => {
    const row = jrTerm4Row(jrT4());
    expect(row[JR_TERM4_HEADERS.indexOf('Payment')])
      .toBe('Nothing to pay — an entry only. No place is held until we confirm one.');
  });

  it('names the venue rather than the slug, for closed centres too', () => {
    expect(jrTerm4Row(jrT4())[JR_TERM4_HEADERS.indexOf('Centre They Chose')])
      .toBe('Mickleham Indoor Sports Centre');
    expect(jrTerm4Row(jrT4({ preferred_centre: 'cranbourne-north' }))[JR_TERM4_HEADERS.indexOf('Centre They Chose')])
      .toBe('Elite Cricket Centre, Cranbourne North');
    expect(jrTerm4Row(jrT4({ preferred_centre: 'williamstown' }))[JR_TERM4_HEADERS.indexOf('Centre They Chose')])
      .toBe('Williamstown');
  });

  it('keeps the leading zero on the parent phone', () => {
    expect(jrTerm4Row(jrT4())[JR_TERM4_HEADERS.indexOf('Parent Phone')]).toBe("'0400111222");
  });
});

describe('guide tab covers term 4', () => {
  it('states the count of families whose centre is not running', () => {
    const text = guideLines([], { jrTerm4: 29, jrTerm4Closed: 4 }).map((r) => r[0]).join('\n');
    expect(text).toContain('Currently 29 entries');
    expect(text).toContain('4 entries on this tab picked it');
    expect(text).toContain('READ THE "RUNNING IN TERM 4?" COLUMN BEFORE YOU RING ANYONE');
  });

  it('tells the reader a "Hallam" row needs the venue explained, not a place found', () => {
    const text = guideLines([], {}).map((r) => r[0]).join('\n');
    expect(text).toContain('A "HALLAM" ROW STILL HAS A PROGRAM — AT A NEW VENUE');
    expect(text).toContain('told where to turn up before 28 October');
  });

  it('warns against offering another centre unprompted', () => {
    const text = guideLines([], {}).map((r) => r[0]).join('\n');
    expect(text).toContain('do not offer them another centre');
    expect(text).toContain('NO PLACE IS HELD');
  });
});

// ------------------------------------------------------------
// Tour Interest is capped to entries from 1 September 2026 (Alex, 30 Sep 2026).
// The cutoff is Melbourne midnight, not UTC — getting that wrong would silently
// include or drop anything registered on 31 August evening.
// ------------------------------------------------------------
describe('tour cutoff', () => {
  it('keeps entries from 1 September Melbourne time onward', () => {
    expect(isTourEntryInWindow('2026-09-30T02:36:17.193Z')).toBe(true);   // 30 Sep, live funnel
    expect(isTourEntryInWindow('2026-08-31T14:00:00.000Z')).toBe(true);   // 1 Sep 00:00 Melbourne
  });

  it('drops everything before it, including the closed EOI form', () => {
    expect(isTourEntryInWindow('2026-08-31T13:59:59.000Z')).toBe(false);  // 31 Aug 23:59 Melbourne
    expect(isTourEntryInWindow('2026-08-10T05:58:57.916Z')).toBe(false);  // last EOI row
    expect(isTourEntryInWindow('2026-06-03T23:48:44.937Z')).toBe(false);  // first EOI row
  });

  it('does not treat a missing date as in-window', () => {
    expect(isTourEntryInWindow(null)).toBe(false);
    expect(isTourEntryInWindow(undefined)).toBe(false);
    expect(isTourEntryInWindow('')).toBe(false);
  });

  it('the guide says how many are hidden, and that nothing was deleted', () => {
    const text = guideLines([], { tour: 2, tourBeforeCutoff: 22 }).map((r) => r[0]).join('\n');
    expect(text).toContain('THIS TAB STARTS AT 1 SEPTEMBER 2026');
    expect(text).toContain('Currently 2 entries');
    expect(text).toContain('22 people registered interest before that date');
    expect(text).toContain('Nothing has been deleted');
  });
});
