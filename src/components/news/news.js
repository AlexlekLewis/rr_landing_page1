// Turns NEWS_STORIES (newsStories.js) into story cards and story pages. Same shape as the
// Power Cricket site's src/lib/news.js, so stories can move between the two.
import { NEWS_STORIES } from './newsStories';

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

/** Every story, newest first. */
export const STORIES = NEWS_STORIES.map(toStory).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

/** The latest stories, leaving out the one already on screen. */
export const latest = (count = 3, excludeId = null) => STORIES.filter((s) => s.id !== excludeId).slice(0, count);
