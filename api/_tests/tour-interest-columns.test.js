// The two Tour Interest columns added on 5 Oct 2026 (Alex): which of our
// programs the player has been in, and whether that makes a December entry
// eligible for member pricing. The /tours form writes both as lines in `bio`
// (src/components/india-tour-2026/ITForm.jsx → programLines).
import { describe, it, expect } from 'vitest';
import {
  TOUR_HEADERS,
  tourRowFromApplication,
  tourRowFromEoi,
} from '../sync-program-signups.js';

const DEC = '2026-12-late-dec-jan';
const APR = '2027-04-april';
const base = { id: 'x', created_at: '2026-10-05T01:00:00Z', first_name: 'Test', last_name: 'Player' };
const lastTwo = (row) => row.slice(-2);

describe('Tour Interest: programs and December member pricing', () => {
  it('appends the two columns at the end, so no existing column moves', () => {
    expect(TOUR_HEADERS.slice(-4)).toEqual([
      'Registered Via', 'Payment', 'Programs They Have Been In', 'December Member Pricing',
    ]);
    expect(tourRowFromApplication(base)).toHaveLength(TOUR_HEADERS.length);
    expect(tourRowFromEoi({ id: 'y' })).toHaveLength(TOUR_HEADERS.length);
  });

  it('shows a self-declared yes for a December entry from a member program', () => {
    const bio = 'Tours: Late December 2026 to early January 2027\n'
      + 'Programs: 12-week T20 Program; Performance Squads\n'
      + 'Player type: Already in an RRA program\n'
      + 'December tour member pricing: yes, self-declared (check before quoting)';
    expect(lastTwo(tourRowFromApplication({ ...base, tour_interest: [DEC], bio }))).toEqual([
      '12-week T20 Program; Performance Squads',
      'Yes — self-declared, check before quoting',
    ]);
  });

  it('leaves the member pricing cell empty for an April-only entry', () => {
    const bio = 'Tours: April 2027\nPrograms: none (new to the academy)';
    expect(lastTwo(tourRowFromApplication({ ...base, tour_interest: [APR], bio }))).toEqual([
      'none (new to the academy)', '',
    ]);
  });

  it('says "not asked" for entries made before the question existed', () => {
    expect(lastTwo(tourRowFromApplication({ ...base, tour_interest: [DEC], bio: 'Tours: x' }))).toEqual([
      'Not asked — entered before 5 Oct 2026', 'Not asked — entered before 5 Oct 2026',
    ]);
  });
});
