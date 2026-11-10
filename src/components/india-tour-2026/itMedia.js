// ---------------------------------------------------------------------------
// /tours — the page's videos and September 2026 photos, in one place.
//
// ADDING SEPTEMBER 2026 PHOTOS (no code needed)
//   Drop the files into src/assets/india-tour-2026/september-2026/.
//   - jpg, jpeg, png or webp. Keep each under ~500 KB (about 1000–1400 px on the
//     long side) so the page stays fast on phones.
//   - mp4 or webm clips work too; they show with a play button.
//   - Files show in filename order, so number them: 06-..., 07-...
//     The first file is the first slide in the carousel.
//   - Optional: add a caption and description in CAPTIONS below, keyed by the
//     filename. Without one, a general description is used and no caption shown.
//     Captions never name a person unless we are sure who it is.
//   They appear in a swipeable carousel, so there is no limit on how many you add.
//   - Never add a repeat. Check new photos first:
//       python3 scripts/check-photo-duplicates.py new1.jpg new2.jpg
//     It compares what the pictures look like, so a resized or re-sent copy is
//     still caught. Skip anything it marks DUPLICATE.
//
// ADDING A VIDEO TO THE VIDEO CAROUSEL
//   1. Upload it (Supabase storage like the home page video, or /public/tours/).
//      Portrait 9:16 suits the player best. MP4 (H.264), ideally under ~30 MB.
//   2. Optionally add a poster image (the still shown before play) next to it.
//   3. Add an entry to VIDEOS. They show in a swipeable carousel, in list order.
//      A YouTube or Vimeo link works too: use `embed` instead of `src`.
//
//   { src: '/tours/nagpur-day-1.mp4', poster: '/tours/nagpur-day-1.jpg',
//     title: 'Day one in Nagpur', caption: 'Warm-up on the main ground.' }
//   { embed: 'https://www.youtube.com/embed/VIDEO_ID', title: 'Tour highlights' }
//
// With VIDEOS empty the video section is hidden.
// ---------------------------------------------------------------------------

// The home page intro video (Sid Lahiri) is the first one until tour videos arrive.
export const VIDEOS = [
    {
        src: 'https://pudldzgmluwoocwxtzhw.supabase.co/storage/v1/object/public/RRAM%20MAIN/General%20Coaching%20Edit%20RR%20Sid%20V2.mov',
        poster: '/assets/intro-video-poster.jpg',
        title: 'Meet Siddhartha Lahiri',
        caption: 'Head of International Player Development and Performance Coach, Rajasthan Royals.',
    },
];

const DEFAULT_ALT =
    'Rajasthan Royals Academy Melbourne players at the Rajasthan Royals High Performance Centre in ' +
    'Nagpur, September 2026';

// Optional caption + description per file, keyed by filename.
const CAPTIONS = {
    '01-warmup-main-ground.webp': {
        alt: 'Rajasthan Royals Academy Melbourne players warming up on the main ground at the Rajasthan Royals High Performance Centre, beside a banner welcoming the academy',
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
        alt: 'Somi Bhinder, resident fast bowling coach at the Rajasthan Royals High Performance Centre, giving instructions on the training ground',
        caption: 'Somi Bhinder, the centre\u2019s resident fast bowling coach, running the session.',
    },
    '05-players-lounge.webp': {
        alt: 'Rajasthan Royals Academy Melbourne players resting in the players’ lounge at the centre between sessions',
        caption: 'Between sessions in the players’ lounge, the same room the Royals players use.',
    },
    '06-coach-and-batter-in-nets.webp': {
        alt: 'Indian cricket legend and former Royals cricketer Faiz Fazal talking a padded-up batter through the next drill in the nets',
        caption: 'Talking it through with Faiz Fazal, Indian cricket legend and former Royals cricketer.',
    },
    '07-bowler-in-nets.webp': {
        alt: 'A Rajasthan Royals Academy Melbourne player bowling in the nets at the centre',
        caption: 'Bowling in the nets at the centre.',
    },
    '08-coach-hands-on-batting-drill.webp': {
        alt: 'A Royals coach guiding a player\u2019s hands on the bat during a batting drill in the nets',
        caption: 'Hands-on coaching: a Royals coach shapes the swing.',
    },
    '09-player-batting-drill.webp': {
        alt: 'A Rajasthan Royals Academy Melbourne player in his stance during a batting drill in the nets',
        caption: 'Putting it into practice in a batting drill.',
    },
    '10-bowling-coach-with-bowler.webp': {
        alt: 'Siddharth Trivedi, legendary Rajasthan Royals bowler, watching closely as a young Rajasthan Royals Academy Melbourne bowler walks back to his mark in the nets',
        caption: 'Every ball watched: one-on-one with Siddharth Trivedi, legendary Rajasthan Royals bowler.',
    },
    '11-coach-group-batting-drill.webp': {
        alt: 'A Royals coach explaining a batting drill to three Rajasthan Royals Academy Melbourne players holding training bats in the nets',
        caption: 'Small groups, so every player gets the coach\u2019s attention.',
    },
    '12-coach-explains-grip.webp': {
        alt: 'Faiz Fazal, Indian cricket legend and former Royals cricketer, explaining the grip to a young Rajasthan Royals Academy Melbourne batter in the nets',
        caption: 'Getting the basics right: Faiz Fazal on the grip.',
    },
    '13-warm-up-in-front-of-hpc.webp': {
        alt: 'Rajasthan Royals Academy Melbourne players warming up in a line on the main ground in front of the Rajasthan Royals High Performance Centre building',
        caption: 'Warming up in front of the Rajasthan Royals High Performance Centre.',
    },
    '14-centre-wicket-practice.webp': {
        alt: 'A Rajasthan Royals Academy Melbourne batter on strike during centre-wicket practice on a turf pitch at the centre',
        caption: 'Centre-wicket practice on turf, in a game-like setting.',
    },
    '15-coach-watches-batting-drill.webp': {
        alt: 'A Royals coach watching a Rajasthan Royals Academy Melbourne player work through a batting footwork drill in the nets',
        caption: 'A Royals coach watching every movement in a footwork drill.',
    },
    '16-coach-and-batter-in-nets.webp': {
        alt: 'A Royals coach standing beside a Rajasthan Royals Academy Melbourne player during a batting drill in the nets',
        caption: 'Side by side with a Royals coach in the nets.',
    },
    // Coaches named here were identified by Andy (10 Nov 2026), including photos 04, 06, 10 and 12. Only name someone the
    // Academy has identified; never guess from a face.
    '17-sid-trivedi-sets-up-drill.webp': {
        alt: 'Siddharth (Sid) Trivedi, legendary Rajasthan Royals bowler, pointing across the nets as he sets up a drill, under the Rajasthan Royals High Performance Centre banner',
        caption: 'Sid Trivedi setting up the next drill.',
    },
    '18-faiz-fazal-with-batter.webp': {
        alt: 'Faiz Fazal, Indian cricket legend and former Royals cricketer, talking a padded-up batter through his plan on the ground',
        caption: 'Faiz Fazal talking a batter through his plan.',
    },
    '19-sid-lahiri-with-batter-in-nets.webp': {
        alt: 'Siddhartha Lahiri, Head of International Player Development at the Rajasthan Royals, with a padded-up batter in the nets',
        caption: 'Sid Lahiri with a batter before his net session.',
    },
    '20-sid-lahiri-runs-net-session.webp': {
        alt: 'Siddhartha Lahiri running a net session for Rajasthan Royals Academy Melbourne batters on a turf pitch',
        caption: 'Sid Lahiri running a net session on turf.',
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

