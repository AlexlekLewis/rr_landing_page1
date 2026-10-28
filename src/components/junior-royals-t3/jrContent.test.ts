import { describe, it, expect, afterEach, vi } from 'vitest';
vi.mock('../../lib/supabase', () => ({ supabase: {} }));
import { JR_T4, ROYALS_WAY } from './jrTerm4Data';
import { applyJrContent, diffFromDefaults, cleanEdits, DEFAULTS, FIELDS } from './jrContent';

describe('Junior Royals Editor content', () => {
    afterEach(() => applyJrContent({}));

    it('every editable field has a default in jrTerm4Data.js', () => {
        FIELDS.forEach((f) => expect(DEFAULTS[f.path], f.path).toBeTruthy());
    });

    it('lays saved edits over the page wording and resets the rest', () => {
        applyJrContent({ 'jr.ctaLabel': 'Book Now', 'rw.steps.1.head': 'Win the badge', 'jr.renewLines': ['One', ' ', 'Two'] });
        expect(JR_T4.ctaLabel).toBe('Book Now');
        expect(ROYALS_WAY.steps[1].head).toBe('Win the badge');
        expect(JR_T4.renewLines).toEqual(['One', 'Two']);
        applyJrContent({ 'jr.ctaLabel': 'Again' });
        expect(ROYALS_WAY.steps[1].head).toBe(DEFAULTS['rw.steps.1.head']);
        expect(JR_T4.renewLines).toEqual(DEFAULTS['jr.renewLines']);
    });

    it('ignores unknown fields, blanks and prices', () => {
        expect(cleanEdits({ 'jr.ctaLabel': '  ', 'jr.priceLine': '$1', 'x.y': 'z', 'jr.heroTitle': 5 })).toEqual({});
        applyJrContent({ 'jr.priceLine': '$1' });
        expect(JR_T4.priceLine).not.toBe('$1');
    });

    it('saves only what differs from the defaults', () => {
        expect(diffFromDefaults({ ...DEFAULTS, 'jr.heroTitle': 'NEW' })).toEqual({ 'jr.heroTitle': 'NEW' });
    });
});
