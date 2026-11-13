// ─────────────────────────────────────────────────────────────
// PHOTOS & VIDEOS on the home page (Andy, 13 Nov 2026), laid out like every other page
// (Andy: "It needs to be presented like we have done on every page"): a photo strip,
// then a video carousel, the same as /junior-royals and /tours.
//
// ONLY MEDIA FROM THE OTHER PAGES' CAROUSELS (Andy, 13 Nov 2026: "i only wanted photos
// from the carosels. Not anything else"). This imports the lists behind the
// carousels on other pages, so anything added there shows here too:
//   Junior Royals → JR_PHOTOS.gallery + JR_VIDEOS   (junior-royals-t3/jrTerm4Data.js)
//   India Tour    → SEPT_2026_MEDIA + VIDEOS        (india-tour-2026/itMedia.js)
// Do not hand-pick other images from the site into this section. Another program's media is added only
// when that program's page has its own photo or video carousel. With nothing
// listed, a section is hidden.
// ─────────────────────────────────────────────────────────────

import { JR_PHOTOS, JR_VIDEOS } from '../junior-royals-t3/jrTerm4Data';
import { SEPT_2026_MEDIA, VIDEOS as TOUR_VIDEOS } from '../india-tour-2026/itMedia';

const tourPhotos = SEPT_2026_MEDIA
    .filter((m) => m.type === 'image')
    .map((m) => ({ src: m.src, alt: m.alt, caption: m.caption }));

// Junior Royals first, then the India Tour; each keeps the order of its own page.
export const HOME_PHOTOS = [...JR_PHOTOS.gallery, ...tourPhotos];
export const HOME_VIDEOS = [...JR_VIDEOS, ...TOUR_VIDEOS];
