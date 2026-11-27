import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
// @ts-expect-error plain JS data
import { VENUES, SHORT_LINKS, LOCATION_ROUTES, LOCATIONS_SEO } from './venues.js';
// @ts-expect-error plain JS data
import { AT, TAGS, mediaAt, programsAt, coachesAt, allVenues, searchVenues } from './locationsData.js';
// @ts-expect-error plain JS data
import { PROGRAMS_DROPDOWN } from '../Navbar';
// @ts-expect-error plain JS data
import { INVITATION_ROUTES } from '../invitation/invitations.js';

// Our centres (Andy, 27 Nov 2026). These tests keep the centre pages honest as the site
// changes: a new program must say where it runs, a tagged photo must exist, and every
// centre must be findable by Google (sitemap) and by its short link (vercel.json).
const ROOT = join(__dirname, '..', '..', '..');
const slugs = VENUES.map((v: any) => v.slug);

describe('centre pages', () => {
    it('has a page for every centre Andy named', () => {
        expect(VENUES.map((v: any) => v.route)).toEqual([
            '/mickleham-indoor-sports-centre',
            '/cranbourne-north-elite-cricket-centre',
            '/hallam-elite-cricket-centre',
            '/ravenhall-m9-sports-centre',
            '/surf-coast-cricket-club',
        ]);
    });

    it('names the two Elite Cricket Centres by suburb, so they are never confused', () => {
        const names = VENUES.map((v: any) => v.fullName);
        expect(new Set(names).size).toBe(names.length);
    });

    it('every program in the Programs menu says which centres it runs at', () => {
        for (const p of PROGRAMS_DROPDOWN) expect(AT, `add ${p.route} to AT in locationsData.js`).toHaveProperty([p.route]);
        for (const fn of Object.values(AT) as any[]) {
            for (const hit of fn(new Date('2026-11-27T12:00:00+11:00'))) expect(slugs).toContain(hit.slug);
        }
    });

    it('feeds programs and coaches to each centre from the program pages', () => {
        const during = new Date('2026-11-02T12:00:00+11:00'); // mid Term 4, Spin Club running
        expect(programsAt('mickleham', during).map((p: any) => p.route)).toEqual(
            expect.arrayContaining(['/junior-royals', '/spin-club', '/performance-squads', '/private-coaching']),
        );
        expect(programsAt('hallam', during).map((p: any) => p.route)).toEqual(['/private-coaching']);
        expect(programsAt('ravenhall', during).map((p: any) => p.route)).toEqual(['/private-coaching']);
        expect(programsAt('mickleham', during).map((p: any) => p.route)).not.toContain('/tours');
        for (const s of ['mickleham', 'cranbourne-north', 'hallam', 'ravenhall']) expect(coachesAt(s).length).toBeGreaterThan(0);
    });

    it('drops a program from the centre pages once its last night has been played', () => {
        const after = new Date('2026-11-27T12:00:00+11:00'); // Spin Club's last night was 25 Nov
        expect(programsAt('mickleham', after).map((p: any) => p.route)).not.toContain('/spin-club');
    });

    it('shows nothing but the sign-up on a centre that is not open yet', () => {
        const surf = allVenues().find((v: any) => v.slug === 'surf-coast');
        expect(surf.comingSoon).toBe(true);
        expect(surf.programs).toEqual([]);
        expect(surf.coaches).toEqual([]);
        expect(LOCATIONS_SEO[surf.route].jsonLd).toBeUndefined();
    });

    it('every tagged photo and video is a real file from a real gallery', () => {
        for (const slug of Object.keys(TAGS)) {
            expect(slugs).toContain(slug);
            const media = mediaAt(slug);
            expect(media.length, `a file tagged to ${slug} is not in the galleries`).toBe(TAGS[slug].length);
            for (const m of media) {
                expect(existsSync(join(ROOT, 'public', m.src)), m.src).toBe(true);
                if (m.poster) expect(existsSync(join(ROOT, 'public', m.poster)), m.poster).toBe(true);
                expect(m.type === 'video' ? m.title : m.alt).toBeTruthy();
            }
        }
        const all = Object.values(TAGS).flat();
        expect(new Set(all).size, 'a photo is tagged to two centres').toBe(all.length);
    });

    it('search finds a centre by suburb, nearby suburb, postcode, side of town, program or coach', () => {
        const views = allVenues(new Date('2026-11-02T12:00:00+11:00'));
        const find = (q: string) => searchVenues(views, q).map((v: any) => v.slug);
        expect(find('mickleham')).toEqual(['mickleham']);
        expect(find('Craigieburn')).toEqual(['mickleham']);
        expect(find('3977')).toEqual(['cranbourne-north']);
        expect(find('south east')).toEqual(['cranbourne-north', 'hallam']);
        expect(find('caroline springs')).toEqual(['ravenhall']);
        expect(find('junior royals')).toEqual(['mickleham', 'cranbourne-north']);
        expect(find('hamid')).toEqual(['ravenhall']);
        expect(find('')).toHaveLength(views.length);
        expect(find('perth')).toEqual([]);
    });
});

describe('centre pages can be found', () => {
    const sitemap = readFileSync(join(ROOT, 'public', 'sitemap.xml'), 'utf8');
    const vercel = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'));

    it('every centre page is in the sitemap and has its own SEO title', () => {
        const titles = new Set();
        for (const route of LOCATION_ROUTES) {
            expect(sitemap, route).toContain(`<loc>https://rramelbourne.com${route}</loc>`);
            const seo = LOCATIONS_SEO[route];
            expect(seo.title.length, seo.title).toBeLessThanOrEqual(60);
            expect(seo.title).toMatch(/Cricket Coaching/);
            titles.add(seo.title);
        }
        expect(titles.size).toBe(LOCATION_ROUTES.length);
    });

    it('gives Google the street address of every open centre that has one', () => {
        for (const v of VENUES.filter((x: any) => x.address)) {
            const a = LOCATIONS_SEO[v.route].jsonLd.address;
            expect(`${a.streetAddress}, ${a.addressLocality} VIC ${a.postalCode}`).toBe(v.address);
        }
    });

    it('every short suburb link redirects to its centre page, and none takes over a campaign page', () => {
        for (const l of SHORT_LINKS) {
            const r = vercel.redirects.find((x: any) => x.source === l.from);
            expect(r?.destination, `${l.from} is missing from vercel.json redirects`).toBe(l.to);
            expect(INVITATION_ROUTES).not.toContain(l.from);
        }
        expect(SHORT_LINKS.map((l: any) => l.from)).toEqual(['/mickleham', '/cranbourne-north', '/hallam', '/surf-coast']);
    });
});
