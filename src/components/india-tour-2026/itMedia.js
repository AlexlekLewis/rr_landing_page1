// ---------------------------------------------------------------------------
// /tours — the page's videos and September 2026 photos, in one place.
//
// HOW TO ADD A VIDEO
//   1. Put the file in /public/tours/ (e.g. public/tours/nagpur-day-1.mp4).
//      Keep it web-sized: MP4 (H.264), 1080p or smaller, ideally under ~30 MB.
//   2. Optionally add a poster image (the still shown before play) next to it.
//   3. Add an entry below. The first video in VIDEOS is the big one at the top.
//      A YouTube or Vimeo link works too: use `embed` instead of `src`.
//
//   { src: '/tours/nagpur-day-1.mp4', poster: '/tours/nagpur-day-1.jpg',
//     title: 'Day one in Nagpur', caption: 'Warm-up on the main ground.' }
//   { embed: 'https://www.youtube.com/embed/VIDEO_ID', title: 'Tour highlights' }
//
// While VIDEOS is empty the video section shows a "coming soon" frame.
//
// SEPTEMBER 2026 GALLERY: same idea. Photos are imported from src/assets so the
// build optimises them; videos can sit in /public/tours/ and use type: 'video'.
// Captions never name a person unless we are sure who it is.
// ---------------------------------------------------------------------------

import warmup from '../../assets/india-tour-2026/sep26-warmup-main-ground.webp';
import playerNets from '../../assets/india-tour-2026/sep26-player-in-nets.webp';
import coachOneOnOne from '../../assets/india-tour-2026/sep26-coach-one-on-one.webp';
import coachGround from '../../assets/india-tour-2026/sep26-coach-on-ground.webp';
import lounge from '../../assets/india-tour-2026/sep26-players-lounge.webp';

export const VIDEOS = [];

// Shown behind the "coming soon" frame while VIDEOS is empty.
export const VIDEO_PLACEHOLDER_IMAGE = warmup;

export const SEPT_2026_MEDIA = [
    {
        type: 'image',
        src: warmup,
        alt: 'Rajasthan Royals Academy Melbourne players warming up on the main ground at the Royals High Performance Centre, beside a banner welcoming the academy',
        caption: 'Warm-up on the main ground. The centre put up a banner to welcome us.',
    },
    {
        type: 'image',
        src: playerNets,
        alt: 'A Rajasthan Royals Academy Melbourne player waiting to bat in the nets at the centre',
        caption: 'One of our players in the nets.',
    },
    {
        type: 'image',
        src: coachOneOnOne,
        alt: 'A Royals coach explaining a batting point to a player in the nets',
        caption: 'One-on-one time with a Royals coach.',
    },
    {
        type: 'image',
        src: coachGround,
        alt: 'A Royals coach giving instructions on the training ground',
        caption: 'Royals coaches ran every session.',
    },
    {
        type: 'image',
        src: lounge,
        alt: 'Rajasthan Royals Academy Melbourne players resting in the players’ lounge at the centre between sessions',
        caption: 'Between sessions in the players’ lounge, the same room the Royals players use.',
    },
];
