// Tests for the Performance Squads sheet sync. These cover the parts that have
// actually broken in this codebase before: number/text coercion in Sheets, rows
// looking "changed" on every run, and payments being attached to the wrong
// player (or silently dropped).
import { describe, it, expect } from 'vitest';
import {
  REG_HEADERS,
  PAY_HEADERS,
  regRow,
  payRow,
  paymentCheck,
  colLetter,
  aggregatePaymentsByEmail,
} from './sync-performance-squads.js';

const lead = (over = {}) => ({
  id: 'reg-1',
  created_at: '2026-08-21T02:25:48.705Z',
  player_name: 'Sample Player',
  player_age: '15',
  parent_name: 'Sample Parent',
  email: 'Parent@Example.com',
  phone: '0412345678',
  club: 'Sample CC',
  playing_role: 'Batter',
  preferred_centre: 'south-east-melbourne',
  trial_sessions: 2,
  trial_session_dates: ['Sunday 6 September · 7:00–8:30 PM', 'Sunday 13 September · 7:00–8:30 PM'],
  accept_terms: true,
  accept_player_code: true,
  accept_parent_code: true,
  accept_social_media: false,
  program_type: 'performance-squads-2026',
  ...over,
});

const col = (name) => REG_HEADERS.indexOf(name);

describe('regRow', () => {
  it('writes one cell per header', () => {
    expect(regRow(lead(), null)).toHaveLength(REG_HEADERS.length);
  });

  it('keeps phone and age as text so Sheets cannot mangle them', () => {
    const r = regRow(lead(), null);
    // A leading apostrophe is what forces TEXT. Without it 0412345678 loses its
    // leading zero and becomes un-diallable, and "15" renders as a 1900 date.
    expect(r[col('Phone')]).toBe("'0412345678");
    expect(r[col('Age')]).toBe("'15");
  });

  it('charges $30 per session booked', () => {
    expect(regRow(lead({ trial_sessions: 1 }), null)[col('Trial Fee Due (AUD)')]).toBe('$30.00');
    expect(regRow(lead({ trial_sessions: 2 }), null)[col('Trial Fee Due (AUD)')]).toBe('$60.00');
  });

  it('shows an unpaid player as No with no amount', () => {
    const r = regRow(lead(), null);
    expect(r[col('Paid in Stripe?')]).toBe('No');
    expect(r[col('Amount Paid (AUD)')]).toBe('');
  });

  it('shows a paid player with the amount Stripe actually took', () => {
    const r = regRow(lead(), { amountCents: 6000, paidAt: '2026-08-22T04:00:00Z', method: 'email match' });
    expect(r[col('Paid in Stripe?')]).toBe('Yes');
    expect(r[col('Amount Paid (AUD)')]).toBe('$60.00');
    expect(r[col('Payment Matched By')]).toBe('email match');
  });

  it('renders the centre by its readable name, not the slug', () => {
    expect(regRow(lead(), null)[col('Centre')]).toBe('South-East Melbourne');
  });

  it('joins the chosen trial sessions into one readable cell', () => {
    expect(regRow(lead(), null)[col('Trial Sessions Chosen')]).toContain('Sunday 6 September');
    expect(regRow(lead(), null)[col('Trial Sessions Chosen')]).toContain('Sunday 13 September');
  });

  it('does not crash when the optional array field is missing', () => {
    expect(() => regRow(lead({ trial_session_dates: null }), null)).not.toThrow();
    expect(regRow(lead({ trial_session_dates: null }), null)[col('Trial Sessions Chosen')]).toBe('');
  });

  it('distinguishes a false consent from an unanswered one', () => {
    expect(regRow(lead({ accept_social_media: false }), null)[col('Photo/Video Consent')]).toBe('No');
    expect(regRow(lead({ accept_social_media: null }), null)[col('Photo/Video Consent')]).toBe('');
  });
});

describe('the DO NOT EDIT boundary', () => {
  it('maps a column index to the right letter', () => {
    // AD is where the safe columns start on a centre tab (29 sync columns).
    expect(colLetter(0)).toBe('A');
    expect(colLetter(25)).toBe('Z');
    expect(colLetter(26)).toBe('AA');
    expect(colLetter(28)).toBe('AC');
    expect(colLetter(REG_HEADERS.length)).toBe('AD');
  });

  // The tab is named "South-East Melbourne — DO NOT EDIT", but the Centre CELL
  // must read as a place, not carry the warning into the data.
  it('keeps the tab warning out of the centre cell', () => {
    expect(regRow(lead(), null)[col('Centre')]).toBe('South-East Melbourne');
    expect(regRow(lead(), null)[col('Centre')]).not.toContain('DO NOT EDIT');
  });

  it('keeps it out of the payments tab centre cell too', () => {
    const r = payRow({ sessionId: 'cs_1', paidAt: '2026-08-22T04:00:00Z', amountCents: 3000, centre: 'north-melbourne' });
    expect(r[PAY_HEADERS.indexOf('Centre (from payment link)')]).toBe('North Melbourne');
  });
});

describe('paymentCheck — the sibling trap', () => {
  it('is quiet when the amount paid matches the amount due', () => {
    expect(paymentCheck(6000, { amountCents: 6000 })).toBe('OK');
  });

  it('says plainly that nobody has paid yet', () => {
    expect(paymentCheck(3000, null)).toBe('Not paid yet');
  });

  // The real case from 22 Aug 2026: one parent paid 2 x $30 from a single email
  // for two sons registered under different addresses. Without this warning the
  // second son reads as unpaid and gets chased for money already paid.
  it('warns that an overpayment probably covers a sibling', () => {
    const msg = paymentCheck(3000, { amountCents: 6000 });
    expect(msg).toContain('$30.00 more than due');
    expect(msg).toContain('sibling');
  });

  it('quantifies a short payment rather than just flagging it', () => {
    expect(paymentCheck(6000, { amountCents: 3000 })).toBe('Short $30.00 — paid $30.00 of $60.00');
  });

  it('flags a payment against a form that recorded no sessions', () => {
    expect(paymentCheck(0, { amountCents: 3000 })).toContain('no sessions');
  });
});

describe('trial session labels', () => {
  it('turns session ids into something a coach can read', () => {
    const r = regRow(lead({ trial_session_dates: ['se-2026-09-06', 'se-2026-09-13'] }), null);
    expect(r[col('Trial Sessions Chosen')]).toBe(
      'Sun 6 Sep, 7:00-8:30 PM (Cranbourne Nth) · Sun 13 Sep, 7:00-8:30 PM (Cranbourne Nth)',
    );
  });

  it('shows an unknown id rather than hiding it, so a stale mapping is visible', () => {
    const r = regRow(lead({ trial_session_dates: ['se-2027-01-01'] }), null);
    expect(r[col('Trial Sessions Chosen')]).toBe('se-2027-01-01');
  });
});

describe('aggregatePaymentsByEmail', () => {
  const pay = (over = {}) => ({
    sessionId: 'cs_1', paidAt: '2026-08-22T04:00:00Z',
    payerEmail: 'parent@example.com', amountCents: 3000, ...over,
  });

  it('matches regardless of case or surrounding whitespace', () => {
    const m = aggregatePaymentsByEmail([pay({ payerEmail: '  PARENT@Example.com ' })]);
    expect(m.get('parent@example.com').amountCents).toBe(3000);
  });

  it('sums two separate payments from the same address', () => {
    const m = aggregatePaymentsByEmail([
      pay({ sessionId: 'cs_1', amountCents: 3000 }),
      pay({ sessionId: 'cs_2', amountCents: 3000 }),
    ]);
    expect(m.get('parent@example.com').amountCents).toBe(6000);
    expect(m.get('parent@example.com').method).toBe('email match (2 payments)');
  });

  it('keeps the earliest payment date, whatever order Stripe returns them in', () => {
    const m = aggregatePaymentsByEmail([
      pay({ sessionId: 'cs_late', paidAt: '2026-08-23T00:00:00Z' }),
      pay({ sessionId: 'cs_early', paidAt: '2026-08-21T00:00:00Z' }),
    ]);
    expect(m.get('parent@example.com').paidAt).toBe('2026-08-21T00:00:00Z');
  });

  it('ignores a payment with no email rather than grouping them together', () => {
    const m = aggregatePaymentsByEmail([pay({ payerEmail: '' }), pay({ payerEmail: null })]);
    expect(m.size).toBe(0);
  });
});

describe('payRow', () => {
  it('writes one cell per header', () => {
    expect(payRow({ sessionId: 'cs_1', paidAt: '2026-08-22T04:00:00Z', amountCents: 3000 }))
      .toHaveLength(PAY_HEADERS.length);
  });

  it('says plainly when a payment matches no registration', () => {
    const r = payRow({ sessionId: 'cs_1', paidAt: '2026-08-22T04:00:00Z', amountCents: 3000, matchedId: null });
    expect(r[PAY_HEADERS.indexOf('Matched Registration')]).toMatch(/^UNMATCHED/);
  });

  it('names the player when it does match', () => {
    const r = payRow({
      sessionId: 'cs_1', paidAt: '2026-08-22T04:00:00Z', amountCents: 3000,
      matchedId: 'reg-1', matchedPlayer: 'Sample Player',
    });
    expect(r[PAY_HEADERS.indexOf('Matched Registration')]).toBe('reg-1');
    expect(r[PAY_HEADERS.indexOf('Matched Player')]).toBe('Sample Player');
  });

  it('reports the centre the payment link belongs to', () => {
    const r = payRow({ sessionId: 'cs_1', paidAt: '2026-08-22T04:00:00Z', amountCents: 6000, centre: 'north-melbourne' });
    expect(r[PAY_HEADERS.indexOf('Centre (from payment link)')]).toBe('North Melbourne');
  });
});
