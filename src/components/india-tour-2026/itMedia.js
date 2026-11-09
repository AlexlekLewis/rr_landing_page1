// ---------------------------------------------------------------------------
// /tours — the page's videos and September 2026 photos, in one place.
//
// ADDING SEPTEMBER 2026 PHOTOS (no code needed)
//   Drop the files into src/assets/india-tour-2026/september-2026/.
//   - jpg, jpeg, png or webp. Keep each under ~500 KB (about 1000–1400 px on the
//     long side) so the page stays fast on phones.
//   - mp4 or webm clips work too; they show with a play button.
//   - Files show in filename order, so number them: 06-..., 07-...
//     The first file is the big one in the gallery.
//   - Optional: add a caption and description in CAPTIONS below, keyed by the
//     filename. Without one, a general description is used and no caption shown.
//     Captions never name a person unless we are sure who it is.
//   The page shows the first GALLERY_INITIAL_COUNT items, then a
//   "Show all photos" button, so there is no limit on how many you add.
//
// ADDING A VIDEO TO THE TOP VIDEO SECTION
//   1. Put the file in /public/tours/ (e.g. public/tours/nagpur-day-1.mp4).
//      MP4 (H.264), 1080p or smaller, ideally under ~30 MB.
//   2. Optionally add a poster image (the still shown before play) next to it.
//   3. Add an entry to VIDEOS. The first is shown large. A YouTube or Vimeo
//      link works too: use `embed` instead of `src`.
//
//   { src: '/tours/nagpur-day-1.mp4', poster: '/tours/nagpur-day-1.jpg',
//     title: 'Day one in Nagpur', caption: 'Warm-up on the main ground.' }
//   { embed: 'https://www.youtube.com/embed/VIDEO_ID', title: 'Tour highlights' }
//
// While VIDEOS is empty the video section shows a "coming soon" frame.
// ---------------------------------------------------------------------------

export const VIDEOS = [];

// How many gallery items show before "Show all photos".
export const GALLERY_INITIAL_COUNT = 9;

const DEFAULT_ALT =
    'Rajasthan Royals Academy Melbourne players at the Rajasthan Royals High Performance Centre in ' +
    'Nagpur, September 2026';

// Optional caption + description per file, keyed by filename.
const CAPTIONS = {
    '01-warmup-main-ground.webp': {
        alt: 'Rajasthan Royals Academy Melbourne players warming up on the main ground at the Royals High Performance Centre, beside a banner welcoming the academy',
        caption: 'Warm-up on the main ground. The centre put up a banner to welcome us.',
    },
    '02-player-in-nets.webp': {
        alt: 'A Rajasthan Royals Academy Melbourne player waiting to bat in the nets at the centre',
        caption: 'One of our players in the nets.',
    },
    '03-coach-one-on-one.webp': {
        alt: 'A Royals coach explaining a batting point to a player in the nets',
        caption: 'One-on-one time with a Royals coach.',
    },
    '04-coach-on-ground.webp': {
        alt: 'A Royals coach giving instructions on the training ground',
        caption: 'Royals coaches ran every session.',
    },
    '05-players-lounge.webp': {
        alt: 'Rajasthan Royals Academy Melbourne players resting in the players’ lounge at the centre between sessions',
        caption: 'Between sessions in the players’ lounge, the same room the Royals players use.',
    },
};

// Every file in the folder, picked up at build time.
const files = import.meta.glob(
    '../../assets/india-tour-2026/september-2026/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP,mp4,webm,MP4}',
    { eager: true, import: 'default' },
);

export const SEPT_2026_MEDIA = Object.keys(files)
    .sort()
    .map((path) => {
        const name = path.split('/').pop();
        const meta = CAPTIONS[name] || {};
        return {
            type: /\.(mp4|webm)$/i.test(name) ? 'video' : 'image',
            src: files[path],
            alt: meta.alt || DEFAULT_ALT,
            caption: meta.caption || '',
        };
    });

// Shown behind the "coming soon" frame while VIDEOS is empty.
export const VIDEO_PLACEHOLDER_IMAGE = SEPT_2026_MEDIA[0]?.src;
