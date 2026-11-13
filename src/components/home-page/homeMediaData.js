// ─────────────────────────────────────────────────────────────
// PHOTOS & VIDEOS on the home page (Andy, 13 Nov 2026: "Images and videos on a
// carousel ... pull through images and photos from the other pages of the site to
// populate it"). One row per program; open a row to explore its carousel, and the
// next row you open closes the last (handover, 9 Nov 2026).
//
// Each program IMPORTS its media from the page that owns it, so a photo or video
// added to /junior-royals or /tours shows here too, with no second copy to keep:
//   Junior Royals      → JR_PHOTOS.gallery + JR_VIDEOS   (junior-royals-t3/jrTerm4Data.js)
//   India Tour         → SEPT_2026_MEDIA + VIDEOS        (india-tour-2026/itMedia.js)
// The other rows list files the program pages already use (paths below).
//
// RULES
//   - Real Academy photos only. The fe-*.jpeg photos on /female-empowerment are the
//     Barbados Royals women's team, not our players, so they are not used here.
//   - No repeats: nothing here may also appear elsewhere on the home page
//     (community-coaches.jpg is in "Leading the Royals Academy"). little-crickets-
//     drills.jpeg is the same photo as holiday-clinic-action.jpg, so only one is used.
//   - Captions never name a player; coaches are named.
//   - A row needs at least one photo or video, or it is hidden.
//   - `href` is the program's page. Leave it out for a program that is not running
//     (Holiday Camps), so the home page never sells something that is closed.
// ─────────────────────────────────────────────────────────────

import { JR_PHOTOS, JR_VIDEOS } from '../junior-royals-t3/jrTerm4Data';
import { SEPT_2026_MEDIA, VIDEOS as TOUR_VIDEOS } from '../india-tour-2026/itMedia';
import { SID } from '../open-age-trial/openAgeData';

const p = (src, alt, caption) => ({ src, alt, caption });

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
        photos: [
            ...JR_PHOTOS.gallery,
            // From the Junior Royals Term 2 page (little-crickets/).
            p('/assets/little-crickets-hero.jpeg', 'A Junior Royals coach kneeling with a group of young players during a drill in the indoor nets', 'Small groups, one coach'),
            p('/assets/little-crickets-nets.jpeg', 'A young batter in the nets in front of a Rajasthan Royals Academy banner', 'Batting in the nets'),
        ],
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
    {
        key: 'performance-squads',
        name: 'Performance Squads',
        line: 'Our representative squads and the coaches behind them',
        href: '/performance-squads',
        cta: 'See Performance Squads',
        photos: [
            p('/assets/performance-squads/sid-lahiri-coaching-2026.jpg', `Sid Lahiri, ${SID.title}, coaching at a Rajasthan Royals training session`, 'Sid Lahiri coaching at a Rajasthan Royals session'),
            p('/assets/performance-squads/sid-lahiri-watching-2026.jpg', `Sid Lahiri, ${SID.title}, watching a batter at a Rajasthan Royals training session`, 'Sid Lahiri watching a batter at a Royals session'),
        ],
        // From the Power Game page (power-game/PowerGame.jsx), with its own words.
        videos: [
            { src: '/assets/powergame/royals-academy-video.mp4', poster: '/assets/powergame/royals-academy-poster.jpg', title: 'Inside the Academy', caption: 'The methodology, the environment, and what it means to develop the Royals Way.' },
            { src: '/assets/powergame/andy-crook-video.mp4', poster: '/assets/powergame/andy-crook-poster.jpg', title: 'The game has changed', caption: 'Andy Crook, Academy Director, on Vaibhav Sooryavanshi and where T20 cricket is going.' },
        ],
    },
    {
        key: 'holiday-camps',
        name: 'Holiday Camps',
        line: 'Our school holiday camps for young players',
        photos: [
            p('/assets/holiday-program-group.jpg', 'A large group of young players and coaches in Royals Academy shirts, holding bats, in the indoor nets', 'The holiday camp squad'),
            p('/assets/holiday-clinic-action.jpg', 'A coach running a cone drill with young players in the indoor nets', 'Drills at a holiday camp'),
        ],
        videos: [],
    },
].filter((prog) => prog.photos.length + prog.videos.length > 0);
