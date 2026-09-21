// ─────────────────────────────────────────────────────────────
// BAKE THE SOCIAL CARD INTO REAL HTML
//
// THE PROBLEM THIS SOLVES. src/seo/RouteSeo.jsx writes <title>, the meta
// description and every og:/twitter: tag from a useEffect, which means they
// only exist after React has mounted. Facebook, Instagram, WhatsApp, LinkedIn
// and iMessage do not run JavaScript when they fetch a link to preview it, so
// they see index.html's static head and nothing else. Proven against
// production: fetching rramelbourne.com/performance-squads as a Facebook
// crawler returns the generic site title and zero og tags.
//
// That is fine for a page nobody shares. It is fatal for /performance-squads-open-trial,
// whose entire distribution plan is a picture of Sid Lahiri previewing
// correctly when the link is posted.
//
// WHAT THIS DOES. After `vite build`, for each route below it copies
// dist/index.html to dist/<route>/index.html with the head tags written in.
// Vercel serves a real file before it applies the SPA rewrite, so a crawler
// hitting /performance-squads-open-trial gets HTML that already carries the tags, and a
// browser gets the same file and boots the app exactly as before.
//
// SCOPED ON PURPOSE. Only the routes in ROUTES are prerendered, so this
// changes how one page is served rather than the whole site. Add a route here
// to extend it; the tag values still come from src/seo/pageSeo.js, which stays
// the single source of truth.
//
// BEFORE THE LINK IS POSTED ANYWHERE: check the preview URL in Facebook's
// Sharing Debugger. A browser check proves nothing here, because a browser
// runs the JavaScript a crawler never will.
// ─────────────────────────────────────────────────────────────

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

const ROUTES = ['/performance-squads-open-trial'];

const escapeAttr = (s) =>
    String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

const escapeText = (s) =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const headFor = (route, cfg, site, fallback) => {
    const title = cfg.title || fallback.title;
    const description = cfg.description || fallback.description;
    const canonical = site.baseUrl + (cfg.canonical || route);
    const ogImage = site.baseUrl + (cfg.ogImage || site.defaultOgImage);
    const robots = cfg.noindex ? 'noindex, nofollow' : 'index, follow';

    const meta = [
        ['name', 'description', description],
        ['name', 'robots', robots],
        ['property', 'og:title', title],
        ['property', 'og:description', description],
        ['property', 'og:url', canonical],
        ['property', 'og:type', 'website'],
        ['property', 'og:site_name', site.name],
        ['property', 'og:image', ogImage],
        ['property', 'og:locale', site.locale],
        ['name', 'twitter:card', 'summary_large_image'],
        ['name', 'twitter:title', title],
        ['name', 'twitter:description', description],
        ['name', 'twitter:image', ogImage],
    ]
        .map(([attr, key, value]) => `  <meta ${attr}="${key}" content="${escapeAttr(value)}" />`)
        .join('\n');

    return [
        `  <title>${escapeText(title)}</title>`,
        `  <link rel="canonical" href="${escapeAttr(canonical)}" />`,
        meta,
    ].join('\n');
};

async function main() {
    const { SITE, PAGE_SEO, DEFAULT_SEO } = await import('../src/seo/pageSeo.js');

    let shell;
    try {
        shell = await readFile(join(DIST, 'index.html'), 'utf8');
    } catch {
        console.error('prerender-seo: dist/index.html not found — run vite build first.');
        process.exit(1);
    }

    for (const route of ROUTES) {
        const cfg = PAGE_SEO[route];
        if (!cfg) {
            // Loud, not silent. A route here with no config would ship a page
            // whose social card is the generic site default.
            console.error(`prerender-seo: no PAGE_SEO entry for ${route}`);
            process.exit(1);
        }

        // The shell's own <title> would otherwise sit above ours and win.
        const html = shell
            .replace(/\s*<title>[\s\S]*?<\/title>/i, '')
            .replace('</head>', `${headFor(route, cfg, SITE, DEFAULT_SEO)}\n</head>`);

        const dir = join(DIST, route.replace(/^\//, ''));
        await mkdir(dir, { recursive: true });
        await writeFile(join(dir, 'index.html'), html, 'utf8');
        console.log(`prerender-seo: wrote dist${route}/index.html`);
    }
}

main().catch((err) => {
    console.error('prerender-seo failed:', err);
    process.exit(1);
});
