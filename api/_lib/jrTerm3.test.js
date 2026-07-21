import { describe, it, expect } from 'vitest';
import {
  parseJrT3Ref, isJrT3Session, classifyJrT3, jrT3ProgramQuantity, JR_T3_SINCE,
} from './jrTerm3.js';

const T3_PRICE = 'price_1TMFh5Io52UEA50yrjh0rz92';
const UUID = 'a5c474d5-112f-4d38-9b8b-3b751f49e2a2';

describe('parseJrT3Ref', () => {
  it('parses a valid centre + uuid ref', () => {
    expect(parseJrT3Ref(`jrt3-mickleham-${UUID}`)).toEqual({ table: 'jr_term3_mickleham', id: UUID });
    expect(parseJrT3Ref(`JRT3-HALLAM-${UUID.toUpperCase()}`)).toEqual({ table: 'jr_term3_hallam', id: UUID });
  });
  it('rejects unknown centres, bare uuids and junk', () => {
    expect(parseJrT3Ref(`jrt3-bundoora-${UUID}`)).toBeNull();
    expect(parseJrT3Ref(UUID)).toBeNull(); // legacy Power Game style ref must not be claimed
    expect(parseJrT3Ref('jrt3-mickleham-not-a-uuid')).toBeNull();
    expect(parseJrT3Ref(null)).toBeNull();
  });
});

describe('isJrT3Session', () => {
  const t3Item = { description: '2026 Junior Royals Program - Term 3: Hallam, Mickleham, Williamstown North', price_id: T3_PRICE, quantity: 1 };

  it('matches by client_reference_id regardless of items', () => {
    expect(isJrT3Session({ client_reference_id: `jrt3-williamstown-${UUID}` }, [])).toBe(true);
  });
  it('matches by "junior royals" + "term 3" in the line description', () => {
    expect(isJrT3Session({ created: 0 }, [{ description: 'Junior Royals TERM 3 Early Bird' }])).toBe(true);
  });
  it('matches the shared price ID only after the Term 3 launch', () => {
    expect(isJrT3Session({ created: JR_T3_SINCE + 1 }, [{ description: 'renamed later', price_id: T3_PRICE }])).toBe(true);
    // a genuine Term 2 Hallam session predates the launch and keeps its old name
    expect(isJrT3Session({ created: JR_T3_SINCE - 86400 }, [{ description: 'Junior Royals — 2026 Term 2, Hallam (Cricket Connect)', price_id: T3_PRICE }])).toBe(false);
  });
  it('ignores unrelated sessions', () => {
    expect(isJrT3Session({ created: JR_T3_SINCE + 1 }, [{ description: 'Power Pre-Season Block', price_id: 'price_x' }])).toBe(false);
    expect(isJrT3Session({ created: JR_T3_SINCE + 1 }, [])).toBe(false);
  });
  it('the shirt add-on alone does not classify as T3', () => {
    expect(isJrT3Session({ created: JR_T3_SINCE + 1 }, [{ description: '2026 Rajasthan Royals Academy Melbourne - Training Shirt (Special Price Participant ONLY)', price_id: 'price_1TMFZsIo52UEA50yH1yEXZs3' }])).toBe(false);
  });

  it('classifyJrT3 labels from the first line item', () => {
    expect(classifyJrT3([t3Item])).toEqual({
      program: 'junior_royals',
      program_variant: 'term_3',
      program_label: t3Item.description,
    });
  });
});

describe('jrT3ProgramQuantity', () => {
  it('counts only the program line, not add-ons', () => {
    expect(jrT3ProgramQuantity([
      { price_id: T3_PRICE, quantity: 2 },
      { price_id: 'price_1TMFZsIo52UEA50yH1yEXZs3', quantity: 2 }, // shirts
    ])).toBe(2);
  });
  it('defaults to 1 when the program line is absent (ref-matched sessions)', () => {
    expect(jrT3ProgramQuantity([])).toBe(1);
  });
});
