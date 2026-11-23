// ─────────────────────────────────────────────────────────────
// HIGHLIGHTS — photos and videos for /performance-squads.
//
// Andy, 22 Nov 2026: "a video and photo section ... videos and photos of
// performance squad games and some highlights."
//
// PHOTOS live in /public/assets/performance-squads/gallery/ (1600px full image
// plus a 720px "-sm" thumbnail). Originals are in Google Drive:
//   Power League › Sept 28/29th 2026 › Images   (JT Photography)
//   Rajasthan Royals Power League November 15    (Academy phones)
// `driveId` is the original file, so a better crop can always be made.
//
// VIDEOS are the edited highlight reels in the same Drive folders. They are
// played from Google Drive (shared "anyone with the link"), loaded only when
// someone taps play, so they cost nothing until then. If a reel is ever made
// private in Drive it stops playing here: keep its sharing on, or move it to
// YouTube/self-hosted and change `embed` below.
//
// To add a match day: drop the photos in the gallery folder, add rows here.
// Every family ticked photo and video consent when they registered.
// ─────────────────────────────────────────────────────────────

const G = '/assets/performance-squads/gallery/';
const SEPT = 'Power League, September 2026';
const NOV = 'Power League, November 2026';

const photo = (slug, alt, event, credit, driveId) => ({
    slug,
    src: `${G}${slug}.jpg`,
    thumb: `${G}${slug}-sm.jpg`,
    alt,
    event,
    credit,
    driveId,
});

export const HIGHLIGHT_PHOTOS = [
    photo('pl-sept-bowler-delivery-stride', 'A Royals Academy bowler releases the ball at the crease while the batter and umpire look on and the wicketkeeper crouches behind the stumps.', SEPT, 'JT Photography', '1BSmaomS1iKNzx97L_IauV1eFOEhjuq4t'),
    photo('pl-sept-batter-sweep-shot', 'A young batter drops to one knee and swings hard through a sweep shot while a fielder watches.', SEPT, 'JT Photography', '1NBwdGJaxhT2w88aXbTj3tUiogPtkH_Qj'),
    photo('pl-sept-team-huddle', 'Junior players in pink Royals caps and purple shirts gather in a team huddle on the field.', SEPT, 'JT Photography', '1hMhZWgo0ProaEFajJO9F3qctTxH-cbjg'),
    photo('pl-sept-fast-bowler-high-arm', 'A teenage pace bowler at the top of his action with his arm high, as the non-striking batter walks past the pink stumps.', SEPT, 'JT Photography', '1NHoaF3wjuVNqr4GIxMUra_FjWgsDd6W-'),
    photo('pl-nov-coach-and-player', 'A Royals Academy coach puts an arm around a young player’s shoulder as they listen to a teammate during a match.', NOV, null, '12bHPli2rwpMfLKF1J5A5E13pRGf--rnp'),
    photo('pl-sept-fielder-girl-running', 'A girl in a pink Royals cap and sports sunglasses jogs between overs, with teammates in the background.', SEPT, 'JT Photography', '1Y_V7NwioS397lmxbA8JbsrMeLBQql_hv'),
    photo('pl-sept-bowler-gather', 'A bowler leaps into his delivery stride, ball tucked under his chin, as the umpire watches.', SEPT, 'JT Photography', '1CZqr3TiZK-rfRFx7Ylcf_EuakupbeHOS'),
    photo('pl-nov-team-huddle', 'An older Performance Squad side in purple shirts and pink caps huddles in the field to plan the next over.', NOV, null, '1BIWA08YRwVO6iv8ErEOR4emXuSO7rDRI'),
    photo('pl-sept-batter-on-drive', 'A young batter in a helmet plays a shot with the ball flying away, as a fielder and the umpire look on.', SEPT, 'JT Photography', '1yTIKDgB9HWU6RgjOAFIaTBvtIUz8Gv47'),
    photo('pl-nov-batting-partners', 'Two teenage batting partners in Royals Academy shirts talk in the middle between overs.', NOV, null, '1QLdQFu5Kzlk8sjYI60KgBhRYczuyQQ2r'),
    photo('pl-sept-batter-front-foot-drive', 'A junior batter leans into a front-foot drive, bat swinging through towards the ball.', SEPT, 'JT Photography', '1tpSqHJUB0cT-CkQ7XiEgrK5Pc8m03Ozd'),
    photo('pl-nov-batter-keeper-bowler', 'A batter lifts his bat and watches the ball coming in as the wicketkeeper crouches behind the stumps.', NOV, null, '11loeLR7Bc_fBp9hBtOvJgNuH3aEqt2sz'),
];

const driveVideo = (id, title, event, poster) => ({
    id,
    title,
    event,
    embed: `https://drive.google.com/file/d/${id}/preview`,
    // Our own photo from the same match day, shown until the reel is tapped.
    poster: `${G}${poster}-sm.jpg`,
});

export const HIGHLIGHT_VIDEOS = [
    driveVideo('16EB2LJn_7oZgmcliFFCaJJGZ6Uz1YfkB', 'Every boundary: 36 shots', NOV, 'pl-nov-batter-keeper-bowler'),
    driveVideo('1Hk25AO76KUE_GJI_xx_QRIWlsMZcqLa7', 'Every wicket: 11 dismissals', NOV, 'pl-nov-team-huddle'),
    driveVideo('1yJl03nx0E9TfB_J-f7jcDJEntMM4fpMg', 'Every six', SEPT, 'pl-sept-batter-sweep-shot'),
    driveVideo('1xwzDswyihq3FCA4CfsBUlD1qhaKNy30M', 'Every wicket', SEPT, 'pl-sept-fast-bowler-high-arm'),
];
