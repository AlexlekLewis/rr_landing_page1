// ─────────────────────────────────────────────────────────────
// PHOTOS & VIDEOS on the home page (Andy, 13 Nov 2026), in ONE carousel (Andy, 13 Nov 2026:
// "I just want them all in the same scrolling section ... mixed up. Not like a library,
// but a nice looking carousel with everything pulling through").
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

const jrVideos = JR_VIDEOS.map((v) => ({ ...v, type: 'video' }));
const tourVideos = TOUR_VIDEOS.filter((v) => v.src).map((v) => ({ ...v, type: 'video' }));
const jrPhotos = JR_PHOTOS.gallery.map((ph) => ({ ...ph, type: 'image' }));
const tourPhotosTyped = tourPhotos.map((ph) => ({ ...ph, type: 'image' }));

// Take turns from each list, so the programs are mixed: [a0, b0, a1, b1, ...].
const alternate = (a, b) => {
    const out = [];
    for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
        if (i < a.length) out.push(a[i]);
        if (i < b.length) out.push(b[i]);
    }
    return out;
};

// THE MIX: Junior Royals and India Tour photos alternate, and a video drops in after
// every two photos (Junior Royals and India Tour videos alternating too), until the
// videos run out; any photos left over finish the run. The order is fixed, not random,
// so every visitor sees the same strip and nothing jumps about between visits.
const mix = (photos, videos, every = 2) => {
    const out = [];
    let v = 0;
    photos.forEach((ph, i) => {
        out.push(ph);
        if ((i + 1) % every === 0 && v < videos.length) out.push(videos[v++]);
    });
    return out.concat(videos.slice(v));
};

export const HOME_MEDIA = mix(alternate(jrPhotos, tourPhotosTyped), alternate(jrVideos, tourVideos));
