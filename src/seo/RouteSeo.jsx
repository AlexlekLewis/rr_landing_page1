import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE, PAGE_SEO, DEFAULT_SEO } from './pageSeo';

// Imperatively manages <title>, meta description, canonical, and Open Graph / Twitter
// tags per route — dependency-free (no react-helmet), so it's captured by the puppeteer
// prerender and matches the codebase's existing document.title idiom.
//
// Scoped to the public pages in PAGE_SEO. Routes NOT in the config are left completely
// untouched, so campaign/success/admin pages that set their own titles are unaffected.

function upsertMeta(attr, key, content) {
    if (content == null) return;
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

function upsertCanonical(href) {
    let el = document.head.querySelector('link[rel="canonical"]');
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', 'canonical');
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
}

export default function RouteSeo() {
    const { pathname } = useLocation();

    useEffect(() => {
        const cfg = PAGE_SEO[pathname];
        if (!cfg) return; // not a managed page — leave the head as-is

        const title = cfg.title || DEFAULT_SEO.title;
        const description = cfg.description || DEFAULT_SEO.description;
        const canonical = SITE.baseUrl + (cfg.canonical || pathname);
        const ogImage = SITE.baseUrl + (cfg.ogImage || SITE.defaultOgImage);

        document.title = title;
        upsertMeta('name', 'description', description);
        upsertCanonical(canonical);

        // Robots — pages flagged noindex are kept out of search results even if
        // reached directly. Managed pages without the flag get an explicit index.
        upsertMeta('name', 'robots', cfg.noindex ? 'noindex, nofollow' : 'index, follow');

        // Open Graph
        upsertMeta('property', 'og:title', title);
        upsertMeta('property', 'og:description', description);
        upsertMeta('property', 'og:url', canonical);
        upsertMeta('property', 'og:type', 'website');
        upsertMeta('property', 'og:site_name', SITE.name);
        upsertMeta('property', 'og:image', ogImage);
        upsertMeta('property', 'og:locale', SITE.locale);

        // Twitter
        upsertMeta('name', 'twitter:card', 'summary_large_image');
        upsertMeta('name', 'twitter:title', title);
        upsertMeta('name', 'twitter:description', description);
        upsertMeta('name', 'twitter:image', ogImage);
    }, [pathname]);

    return null;
}
