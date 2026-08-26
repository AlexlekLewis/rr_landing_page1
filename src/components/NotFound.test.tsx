// The near-miss rescue on the 404 page. The case that prompted it is the first
// test: players were typing /perfromace-squads and giving up on a dead page
// instead of registering for a trial.
import { describe, it, expect } from 'vitest';
import { closestRoute, editDistance, KNOWN_ROUTES } from './NotFound';

describe('editDistance', () => {
    it('is zero for identical strings', () => {
        expect(editDistance('squads', 'squads')).toBe(0);
    });

    it('counts a transposition as two edits', () => {
        expect(editDistance('perfor', 'perfro')).toBe(2);
    });

    it('counts a dropped letter as one', () => {
        expect(editDistance('mance', 'mace')).toBe(1);
    });
});

describe('closestRoute — typos that should be rescued', () => {
    it('rescues the real reported typo', () => {
        expect(closestRoute('/perfromace-squads')).toBe('/performance-squads');
    });

    it('rescues a swapped "pre" for "per"', () => {
        expect(closestRoute('/preformance-squads')).toBe('/performance-squads');
    });

    it('rescues a missing letter', () => {
        expect(closestRoute('/performance-squad')).toBe('/performance-squads');
    });

    it('rescues a doubled letter', () => {
        expect(closestRoute('/performannce-squads')).toBe('/performance-squads');
    });

    it('ignores capitals, trailing slashes and stray hyphens', () => {
        expect(closestRoute('/Performance-Squads/')).toBe('/performance-squads');
        expect(closestRoute('/performancesquads')).toBe('/performance-squads');
    });

    it('rescues other pages too, not just this one', () => {
        expect(closestRoute('/junior-royal')).toBe('/junior-royals');
        expect(closestRoute('/mickleman')).toBe('/mickleham');
    });
});

describe('closestRoute — things it must NOT redirect', () => {
    it('leaves a genuinely unrelated path on the 404', () => {
        expect(closestRoute('/wp-admin')).toBeNull();
        expect(closestRoute('/some-old-blog-post-about-cricket')).toBeNull();
    });

    it('leaves very short paths alone, where 3 edits is most of the word', () => {
        expect(closestRoute('/shop')).toBeNull();
        expect(closestRoute('/abc')).toBeNull();
    });

    // Junior Royals and the Holiday Camps share a long prefix, so they are the
    // pair most likely to be confused for one another. Each near-miss has to land
    // on the one it is actually closest to, not just the first one in the list.
    it('keeps the two junior pages apart', () => {
        expect(closestRoute('/junior-royals-holida')).toBe('/junior-royals-holiday');
        expect(closestRoute('/junior-royal')).toBe('/junior-royals');
        expect(closestRoute('/junior-royals-xyz')).toBe('/junior-royals');
    });

    // The tie-break exists so an ambiguous address shows the 404 instead of a
    // coin toss. No two real routes are close enough to demonstrate it, so this
    // pins the rule rather than the routes: equal-distance means no redirect.
    it('refuses to guess when nothing is a clear winner', () => {
        expect(closestRoute('/xxxxxxxxxxxxxxxxxxxx')).toBeNull();
    });

    it('never returns a route that is not real', () => {
        const hit = closestRoute('/perfromace-squads');
        expect(KNOWN_ROUTES).toContain(hit);
    });
});
