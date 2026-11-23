import { describe, expect, it } from 'vitest';
import { LOCAL_WRAP, newerWrap, wrapFromFeed } from './weekendWrap';

describe('weekend wrap', () => {
    it('reads a wrap from the Power Cricket feed and ignores anything malformed', () => {
        expect(wrapFromFeed({ version: 1, wrap: LOCAL_WRAP })).toBe(LOCAL_WRAP);
        expect(wrapFromFeed({ version: 2, wrap: LOCAL_WRAP })).toBeNull();
        expect(wrapFromFeed({ version: 1, wrap: { id: 'x' } })).toBeNull();
        expect(wrapFromFeed(null)).toBeNull();
    });
    it('shows the newer weekend', () => {
        const next = { ...LOCAL_WRAP, id: '2026-11-27', to: '2026-11-29' };
        expect(newerWrap(LOCAL_WRAP, next)).toBe(next);
        expect(newerWrap(next, LOCAL_WRAP)).toBe(next);
        expect(newerWrap(LOCAL_WRAP, null)).toBe(LOCAL_WRAP);
    });
});
