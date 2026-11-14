// Turns NEWS_STORIES (newsStories.js), plus any stories Power Cricket has tagged for this site
// (network.js), into story cards and story pages. Same shape as the Power Cricket site's
// src/lib/news.js, so stories can move between the two.
import { useEffect, useMemo, useState } from 'react';
import { NEWS_STORIES } from './newsStories';
import { PARTNER_FEED_URL, forSite, storiesFromFeed } from './network';

/** A story's own page, e.g. /news/inside-our-first-tour-... — the link people share. */
export const storyPath = (slug) => `/news/${encodeURIComponent(slug)}`;

/** The full web address to copy and share; always the live site, even from a preview. */
export const storyUrl = (slug) => `https://rramelbourne.com${storyPath(slug)}`;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const formatDate = (iso) => {
    const [y, m, d] = String(iso).split('-').map(Number);
    return y && m && d ? `${d} ${MONTHS[m - 1]} ${y}` : '';
};

const splitParagraphs = (text) => String(text ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

export const toStory = (s) => {
    const isVideo = s.type === 'video' && Boolean(s.youtubeId);
    return {
        ...s,
        id: s.slug,
        type: isVideo ? 'video' : 'article',
        date: formatDate(s.publishedAt),
        image: s.heroImage || (isVideo ? `https://i.ytimg.com/vi/${s.youtubeId}/hqdefault.jpg` : null),
        body: splitParagraphs(s.body),
        gallery: s.gallery || [],
    };
};

const byNewest = (a, b) => b.publishedAt.localeCompare(a.publishedAt);

/** Our own stories for this site, newest first. */
export const STORIES = forSite(NEWS_STORIES).map(toStory).sort(byNewest);

// Power Cricket's shared stories, fetched once per visit. A failed fetch just means none.
let partnerRequest = null;
let partnerCache = null;
const loadPartner = () => {
    partnerRequest ??= fetch(PARTNER_FEED_URL, { credentials: 'omit' })
        .then((res) => (res.ok ? res.json() : null))
        .then((feed) => { partnerCache = storiesFromFeed(feed).map(toStory); return partnerCache; })
        .catch(() => { partnerCache = []; return partnerCache; });
    return partnerRequest;
};

/**
 * Every story for this site: ours plus Power Cricket's tagged for us, newest first. Our own
 * story wins when both use the same slug. `ready` is false until the partner feed has answered,
 * so a story page for a partner story can wait for it instead of showing "not found".
 */
export const useStories = () => {
    const [partner, setPartner] = useState(partnerCache);
    useEffect(() => {
        if (partnerCache) return undefined;
        let alive = true;
        loadPartner().then((rows) => { if (alive) setPartner(rows); });
        return () => { alive = false; };
    }, []);
    const stories = useMemo(() => {
        const own = new Set(STORIES.map((s) => s.id));
        return [...STORIES, ...(partner || []).filter((s) => !own.has(s.id))].sort(byNewest);
    }, [partner]);
    return { stories, ready: partner !== null };
};
