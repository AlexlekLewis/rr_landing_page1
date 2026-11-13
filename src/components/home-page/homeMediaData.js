// ─────────────────────────────────────────────────────────────
// PHOTOS & VIDEOS on the home page (Andy, 13 Nov 2026). One row per program; open a
// row to explore its carousels, and the next row you open closes the last.
//
// ONLY MEDIA FROM THE OTHER PAGES' CAROUSELS (Andy, 13 Nov 2026: "i only wanted photos
// from the carosels. Not anything else"). Each row imports the lists behind a
// carousel on another page, so anything added there shows here too:
//   Junior Royals → JR_PHOTOS.gallery + JR_VIDEOS   (junior-royals-t3/jrTerm4Data.js)
//   India Tour    → SEPT_2026_MEDIA + VIDEOS        (india-tour-2026/itMedia.js)
// Do not hand-pick other images from the site into this section. A new program row
// is added only when that program's page has its own photo or video carousel.
// A row with nothing in it is hidden.
// ─────────────────────────────────────────────────────────────

import { JR_PHOTOS, JR_VIDEOS } from '../junior-royals-t3/jrTerm4Data';
import { SEPT_2026_MEDIA, VIDEOS as TOUR_VIDEOS } from '../india-tour-2026/itMedia';

const tourPhotos = SEPT_2026_MEDIA
    .filter((m) => m.type === 'image')
    .map((m) => ({ src: m.src, alt: m.alt, caption: m.caption }));

export const HOME_MEDIA = [
    {
        key: 'junior-royals',
        name: 'Junior Royals',
        line: 'Weekly coaching for ages 7–12 at Mickleham and Cranbourne North',
        href: '/junior-royals',
        cta: 'See Junior Royals',
        photos: JR_PHOTOS.gallery,
        videos: JR_VIDEOS,
    },
    {
        key: 'india-tour',
        name: 'India Tour',
        line: 'Our players at the Rajasthan Royals High Performance Centre, Nagpur, September 2026',
        href: '/tours',
        cta: 'See the India Tour',
        photos: tourPhotos,
        videos: TOUR_VIDEOS,
    },
].filter((prog) => prog.photos.length + prog.videos.length > 0);
