// Photos and video for Royals Private Coaching (premium), chosen 13 Nov 2026 for one
// thing: you can clearly see ONE coach working with one player (or two or three).
//
// Honesty rule: most of the strongest one-to-one photos were taken on the Academy's
// September 2026 tour at the Rajasthan Royals High Performance Centre in India, NOT at
// our Melbourne centres. Every caption says where it was taken. Names come from the
// captions already published on /tours (india-tour-2026/itMedia.js).
//
// WANTED from Andy (replace these as they arrive): one-to-one photos and clips at
// Mickleham, Cranbourne North and M9 Ravenhall; a landscape hero; a coach and one player
// reviewing a bowling map or heat map on the iPad without burned-in captions.

import heroHandsOn from '../../assets/india-tour-2026/why-go/2-coach-hands-on.webp';
import handsOn from '../../assets/india-tour-2026/september-2026/08-coach-hands-on-batting-drill.webp';
import grip from '../../assets/india-tour-2026/september-2026/12-coach-explains-grip.webp';
import oneOnOne from '../../assets/india-tour-2026/september-2026/03-coach-one-on-one.webp';
import bowler from '../../assets/india-tour-2026/september-2026/10-bowling-coach-with-bowler.webp';
import sideBySide from '../../assets/india-tour-2026/september-2026/16-coach-and-batter-in-nets.webp';
import sidLahiri from '../../assets/india-tour-2026/september-2026/19-sid-lahiri-with-batter-in-nets.webp';
import groupOfThree from '../../assets/india-tour-2026/september-2026/11-coach-group-batting-drill.webp';
import nextDrill from '../../assets/india-tour-2026/september-2026/06-coach-and-batter-in-nets.webp';

const INDIA = 'Royals High Performance Centre, India';
const MELB = 'Mickleham, Melbourne';
// (junior-royals/gallery/batting-with-coach.webp is the same moment as the pull-shots
// clip below, so it isn't repeated in the photos.)

export const HERO_IMAGE = {
    src: heroHandsOn,
    alt: 'A Royals coach with his hands on a young batter’s hands, shaping the swing, in the nets',
};

// Gallery order: Melbourne first where we have it, then the strongest tour shots.
export const PHOTOS = [
    { src: handsOn, alt: 'A Royals coach guiding a player’s hands on the bat during a batting drill in the nets', caption: 'Hands on: a Royals coach shapes the swing.', where: INDIA },
    { src: grip, alt: 'Faiz Fazal, Indian cricket legend and former Royals cricketer, explaining the grip to a young Rajasthan Royals Academy Melbourne batter', caption: 'Faiz Fazal on the grip.', where: INDIA },
    { src: bowler, alt: 'Siddharth Trivedi, legendary Rajasthan Royals bowler, watching a young bowler walk back to his mark', caption: 'Every ball watched: Siddharth Trivedi with a young bowler.', where: INDIA },
    { src: oneOnOne, alt: 'Faiz Fazal working one-on-one with Khilesh Mamtani on a batting point in the nets', caption: 'Faiz Fazal one-on-one with Khilesh Mamtani.', where: INDIA },
    { src: groupOfThree, alt: 'A Royals coach explaining a batting drill to three players holding training bats in the nets', caption: '1-to-3: small enough for every player to get the coach.', where: INDIA },
    { src: sideBySide, alt: 'Joshua Richardson side by side with Faiz Fazal during a batting drill in the nets', caption: 'Joshua Richardson side by side with Faiz Fazal.', where: INDIA },
    { src: sidLahiri, alt: 'Siddhartha Lahiri, Head of International Player Development at the Rajasthan Royals, with a padded-up batter in the nets', caption: 'Siddhartha Lahiri with a batter before his net session.', where: INDIA },
    { src: nextDrill, alt: 'Faiz Fazal talking a padded-up batter through the next drill in the nets', caption: 'Talking it through before the next drill.', where: INDIA },
];

// All portrait (9:16-ish), muted, play on tap. Each has a poster.
// Not used on purpose: junior-royals/videos/coaching-young-batter.mp4 is the best
// one-to-one clip filmed in Melbourne, but the coach in it (Andrew Walton) is no longer
// on the roster (Alex, 5 Oct 2026). TODO Andy: use it or not?
export const VIDEOS = [
    { src: '/assets/premium-coaching/match-centre-ipad.mp4', poster: '/assets/premium-coaching/match-centre-ipad.jpg', title: 'The Match Centre', caption: 'Setting a live field on the iPad, then playing the scenario in the lane.', where: 'Melbourne' },
    { src: '/junior-royals/videos/pull-shots.mp4', poster: '/junior-royals/videos/pull-shots.jpg', title: 'Pull shots', caption: 'Jinang feeding pull shots, one batter in the lane.', where: MELB },
    { src: '/tours/somi-with-player.mp4', poster: '/tours/somi-with-player.jpg', title: 'One-on-one with Somi', caption: 'Somi Bhinder, resident coach, talks a player through his technique.', where: INDIA },
    { src: '/tours/romi-kunwar-front-shoulder.mp4', poster: '/tours/romi-kunwar-front-shoulder.jpg', title: 'The front shoulder', caption: 'Romi Bhinder and Kunwar work on his front shoulder.', where: INDIA },
];
