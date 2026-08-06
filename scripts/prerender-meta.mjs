// Post-build META prerender.
//
// For each public route in src/seo/pageSeo.js, emit a static dist/<route>/index.html
// whose <head> already contains the correct <title>, meta description, canonical and
// Open Graph / Twitter tags. Crawlers that DON'T run JavaScript (social scrapers like
// Facebook/LinkedIn/iMessage, and some AI engines) therefore get the right metadata
// straight from the raw HTML instead of the generic SPA shell.
//
// Dependency-free: no headless browser, so it can't break the Vercel build. Vercel
// serves dist/<route>/index.html for /<route>, taking precedence over the SPA catch-all
// rewrite (same mechanism that already serves robots.txt and sitemap.xml).
//
// Scope: META only. The page BODY stays client-rendered (Google renders JS and sees it;
// the JS runtime's <RouteSeo/> sets the identical tags, so raw and rendered agree).
// Full-body prerender would be a separate, heavier effort.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, PAGE_SEO } from '../src/seo/pageSeo.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const base = readFileSync(join(dist, 'index.html'), 'utf8');

const esc = (s) =>
    String(s)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

function headTags(path, cfg) {
    const title = cfg.title || SITE.name;
    const description = cfg.description || '';
    const canonical = SITE.baseUrl + (cfg.canonical || path);
    const image = SITE.baseUrl + (cfg.ogImage || SITE.defaultOgImage);
    return [
        `<meta name="description" content="${esc(description)}" />`,
        `<link rel="canonical" href="${esc(canonical)}" />`,
        `<meta property="og:title" content="${esc(title)}" />`,
        `<meta property="og:description" content="${esc(description)}" />`,
        `<meta property="og:url" content="${esc(canonical)}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
        `<meta property="og:image" content="${esc(image)}" />`,
        `<meta property="og:locale" content="${esc(SITE.locale)}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${esc(title)}" />`,
        `<meta name="twitter:description" content="${esc(description)}" />`,
        `<meta name="twitter:image" content="${esc(image)}" />`,
    ].join('\n    ');
}

let n = 0;
for (const [path, cfg] of Object.entries(PAGE_SEO)) {
    const title = cfg.title || SITE.name;
    const html = base
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
        .replace('</head>', `    ${headTags(path, cfg)}\n  </head>`);
    const outDir = path === '/' ? dist : join(dist, path.replace(/^\//, ''));
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), html);
    n++;
}
console.log(`[prerender-meta] wrote ${n} per-route index.html files into dist/`);
