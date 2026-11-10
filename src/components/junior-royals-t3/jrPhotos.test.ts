import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { JR_PHOTOS } from './jrTerm4Data';

// Andy, 10 Nov 2026: "Please ensure that there is never a duplicate". Every photo on
// /junior-royals (hero, framed photo, photo strip) is a different file and a different shot.
describe('Junior Royals photos', () => {
    const all = [JR_PHOTOS.hero, JR_PHOTOS.heroFeature, ...JR_PHOTOS.gallery];
    const stem = (p: { src: string }) => p.src.split('/').pop()!.replace('.webp', '');

    it('never uses the same photo twice on the page', () => {
        const stems = all.map(stem);
        expect(new Set(stems).size).toBe(stems.length);
        // Same shot as girl-batting-pull, an earlier crop: never alongside it.
        expect(stems).not.toContain('girl-batting');
    });

    it('has every file, at both sizes, with alt text and a caption', () => {
        for (const p of all) {
            expect(existsSync(`public${p.src}`), p.src).toBe(true);
            expect(existsSync(`public${p.srcSm}`), p.srcSm).toBe(true);
            expect(p.alt.length).toBeGreaterThan(20);
            expect(p.caption.length).toBeGreaterThan(3);
        }
        expect(JR_PHOTOS.gallery).toHaveLength(8);
    });

    it('no other Junior Royals component hard-codes a photo', () => {
        for (const f of ['JRT3Hero.jsx', 'JRT3Locations.jsx', 'JRBenefits.jsx', 'JRT4RoyalsWay.jsx', 'JRT3Coaches.jsx']) {
            expect(readFileSync(`src/components/junior-royals-t3/${f}`, 'utf8'), f).not.toMatch(/gallery\/[a-z-]+\.webp/);
        }
    });
});
