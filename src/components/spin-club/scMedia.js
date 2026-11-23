// ─────────────────────────────────────────────────────────────
// PHOTOS & VIDEOS on /spin-club (Andy, 23 Nov 2026: "images … of Harkirat Bajwa or Callum
// Stow or Alex Lewis or any person who has been bowling spin or videos or video analysis
// from the Spin Club … into a video and photo carousel that is the same as other pages.
// Spin bowling videos as well, maybe from High Performance Centre").
//
// Same carousel as the home page (home-page/HomeMedia.jsx): photos and videos mixed in one
// strip, a video plays where it is, a photo opens full screen.
//
// Photos: public/assets/spin-club/gallery/<name>.webp (900x1200) + <name>-sm.webp (480x640).
// Videos: an .mp4 + a poster .jpg, compressed like /tours (720 wide, under ~8 MB).
//
// STILL TO ADD (blocked on file size, 23 Nov 2026): Alex's own Spin Club clips in Drive,
// Content → ALEX LEWIS CAMERA CONTENT (IMG_9037–9092, 20–21 Oct 2026). Field settings,
// plans for a batter, release point. They are 45–175 MB each, over the 10 MB the Drive
// connector can download. Trim each to 10–20 s at 720p, drop the .mp4 + a poster .jpg into
// public/spin-club/videos/ and add a `video(...)` line below — those go FIRST in the list.
// Callum and Harkirat bowling, and Rane's reels, go in the same way.
// ─────────────────────────────────────────────────────────────

const G = '/assets/spin-club/gallery';

const photo = (name, alt, caption) => ({
    type: 'image',
    src: `${G}/${name}.webp`,
    srcSm: `${G}/${name}-sm.webp`,
    alt,
    caption,
});

const video = (src, poster, title, caption) => ({ type: 'video', src, poster, title, caption });

export const SC_MEDIA = [
    photo(
        'result-priyam-sharma-5-43',
        'Results card: Priyam Sharma, Spin Club Cranbourne North, took 5 wickets for 43 off 8 overs for Ormond 3rd XI against Moorabbin 3rd XI on Saturday 14 November',
        // No caption: the card carries its own words, and a caption would sit on top of them.
    ),
    photo(
        'spinner-power-league',
        'A Rajasthan Royals Academy Melbourne bowler at the top of his action in a Power League match, with the umpire watching',
        'Bowling in the Power League',
    ),
    video(
        '/tours/hpc-home-of-the-royals.mp4',
        '/tours/hpc-home-of-the-royals.jpg',
        'The Royals High Performance Centre',
        'Where Rajasthan Royals train, and where our players trained on tour.',
    ),
    photo(
        'harkirat-bajwa-australia',
        'Harkirat Bajwa in Australia colours',
        'Harkirat Bajwa, Royal Spin Coach (South): Australia Under-19 World Cup squad',
    ),
    photo(
        'mickleham-spin-lanes',
        'Lanes set up for Spin Club North at Mickleham Indoor Sports Centre, with a pink target cone on the floor',
        'Spin Club North, set up at Mickleham',
    ),
    photo(
        'sid-trivedi-with-bowler',
        'Siddharth Trivedi, legendary Rajasthan Royals bowler, watching closely as a young Rajasthan Royals Academy Melbourne bowler walks back to his mark in the nets',
        'One-on-one with Sid Trivedi at the Royals High Performance Centre',
    ),
    {
        type: 'image',
        src: '/assets/coach-callum-stow.jpg',
        alt: 'Callum Stow, Royal Spin Coach for Spin Club North',
        caption: 'Callum Stow, Royal Spin Coach (North): Melbourne Renegades',
    },
    video(
        '/tours/jake-fredericksen-to-joshua-richardson.mp4',
        '/tours/jake-fredericksen-to-joshua-richardson.jpg',
        'In the nets at the HPC',
        'Jake Fredericksen bowls to Joshua Richardson at the Royals High Performance Centre.',
    ),
    photo(
        'alex-lewis-huddle',
        'Alex Lewis, Academy Head Coach, talking to his players on the ground',
        'Alex Lewis, who built Spin Club, with his players',
    ),
    photo(
        'hpc-bowler-in-nets',
        'A Rajasthan Royals Academy Melbourne bowler delivering in the outdoor nets at the Royals High Performance Centre',
        'Bowling in the nets at the Royals High Performance Centre',
    ),
    photo(
        'alex-lewis-team-talk',
        'Alex Lewis giving a team talk in the change rooms before a match',
        'Alex Lewis: the plan before the game',
    ),
];
