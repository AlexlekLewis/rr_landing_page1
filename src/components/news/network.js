// News shared across the network: rramelbourne.com and Power Cricket (Andy, 14 Nov 2026: news
// and features "can sit across both the Power Cricket and also RRA Melbourne site").
// Mirrors src/lib/network-news.js on the Power Cricket site (AlexlekLewis/Power_Cricket).
//
// - Every story has `sites`: 'rra-melbourne' (this site), 'power-cricket', or both.
//   Leave it out and the story is RRA only.
// - Each site publishes a public feed of the stories it shares:
//     RRA           → https://rramelbourne.com/news-feed.json   (scripts/prerender-seo.mjs)
//     Power Cricket → https://powercricket.com.au/assets/network/news-feed.json
// - Each site reads the other's feed in the browser and shows the stories tagged for it, in
//   full, with a line saying where they came from. Only the feed file is shared: no database,
//   keys or customer data cross between the two businesses.
//
// Plain JavaScript with no imports, so the build script can use it in Node.

export const THIS_SITE = 'rra-melbourne';
export const SITES = {
    'rra-melbourne': { name: 'Rajasthan Royals Academy Melbourne', url: 'https://rramelbourne.com' },
    'power-cricket': { name: 'Power Cricket', url: 'https://powercricket.com.au' },
};
export const PARTNER_FEED_URL = 'https://powercricket.com.au/assets/network/news-feed.json';
export const FEED_FILE = 'news-feed.json';

/** Where a story appears. No `sites` means this site only. */
export const storySites = (s) => (Array.isArray(s?.sites) && s.sites.length ? s.sites : [THIS_SITE]);

/** The stories that belong on a site. */
export const forSite = (stories, site = THIS_SITE) => stories.filter((s) => storySites(s).includes(site));

const abs = (src) => (!src ? null : /^https?:/.test(src) ? src : `${SITES[THIS_SITE].url}${src}`);

/** The feed this site publishes: its stories tagged for another site. */
export const buildFeed = (stories, generatedAt = new Date().toISOString()) => ({
    version: 1,
    site: THIS_SITE,
    siteName: SITES[THIS_SITE].name,
    siteUrl: SITES[THIS_SITE].url,
    generatedAt,
    stories: stories
        .filter((s) => storySites(s).some((x) => x !== THIS_SITE))
        .map((s) => ({
            slug: s.slug,
            sites: storySites(s),
            brand: s.brand,
            type: s.type,
            publishedAt: s.publishedAt,
            title: s.title,
            excerpt: s.excerpt || '',
            body: s.body || '',
            youtubeId: s.youtubeId || null,
            heroImage: abs(s.heroImage),
            gallery: (s.gallery || []).map((g) => ({ src: abs(g.src), alt: g.alt || '' })),
            url: `${SITES[THIS_SITE].url}/news/${s.slug}`,
        })),
});

/** The partner site's stories that are tagged for this one, shaped like our own stories. */
export const storiesFromFeed = (feed, site = THIS_SITE) => {
    if (!feed || feed.version !== 1 || !Array.isArray(feed.stories)) return [];
    const from = SITES[feed.site]?.name || feed.siteName || 'our partner';
    return feed.stories
        .filter((s) => s && s.slug && s.title && Array.isArray(s.sites) && s.sites.includes(site))
        .map((s) => ({
            slug: s.slug,
            sites: s.sites,
            brand: s.brand || from,
            type: s.type === 'video' && s.youtubeId ? 'video' : 'article',
            publishedAt: String(s.publishedAt || ''),
            title: s.title,
            excerpt: s.excerpt || '',
            body: s.body || '',
            youtubeId: s.youtubeId || null,
            heroImage: s.heroImage || null,
            heroAlt: '',
            gallery: (s.gallery || []).filter((g) => g && g.src),
            // Power Cricket isn't public yet, so we don't link out to it; the story is shown here in full.
            source: feed.site === 'power-cricket'
                ? { name: 'Power Cricket', note: 'Power Cricket are proud partners of the Rajasthan Royals Academy.' }
                : { name: from, note: '' },
        }));
};
