// Junior Royals: every fact on /junior-royals lives here.
// 8 Nov 2026 (Andy): no longer sold as Term 4. Join any week, weekly subscription only,
// and each centre shows its last session before the Christmas break. The notes below
// are the history behind the nights, groups and Stripe links.
//
// Source: Alex, 3 Oct 2026 (approved review), and the two Term 4 net booking
// orders (RRA-T4-2026-MIC, RRA-T4-2026-CRN): Junior Royals on WEDNESDAYS,
// 6:00pm and 7:00pm groups, at both centres (now 5:00pm and 6:00pm, see below).
//
// UPDATED Alex, 5 Oct 2026: Term 4 STARTS WEDNESDAY 28 OCTOBER (nothing runs
// before it) — 8 Wednesdays, 28 Oct – 16 Dec — and Junior Royals is now ages
// 7 to 12. Players 13 and over are pointed to Performance Squads.
// No Term 4 at Hallam or Williamstown.
//
// PAID FROM 19 OCT 2026 (Alex: "Here is the official payment options for the
// Junior Royals program"). Two Stripe Payment Links, both in live mode, both
// with the training shirt as an adjustable line (a family that already has a
// shirt sets it to 0) and a "Confirm your location" field:
//   UPFRONT  $349 for all 8 weeks ("Save $10 and pay upfront"), plink_1US8PnIo52UEA50y1mEdWz1P;
//            card, Apple Pay, Afterpay, Klarna or Zip (dashboard, 20 Oct 2026).
//   WEEKLY   $44.95 a week, a subscription: first payment the day they book,
//            then every 7 days, "cancelled following the final session of
//            Term 4". plink_1US8NNIo52UEA50y5UuUuuyo; card, Apple Pay or Klarna.
// Both links' confirmation page is Stripe's DEFAULT (20 Oct 2026), so families
// are not sent back to /junior-royals/success until that is changed in Stripe.
// Neither checkout asks for the player, so the page saves the entry first
// (jr_term4_waitlist) and sends the row id to Stripe as client_reference_id;
// api/stripe-webhook.js marks the row paid.
//
// WEEKLY: Alex confirmed both links on 20 Oct 2026 ("these links are fine … make
// sure the copy reflects the 2 payment options"). It still opens on 27 Oct:
// - Alex, 19 Oct 2026: "the stripe link for weekly payments is wrong". It must
//   not go on the page until he confirms or replaces it.
// - It opens on Tuesday 27 October (Alex: "27th"). Before then a weekly plan
//   started now would charge 9 times for 8 sessions. NOTE: that date was set
//   when both centres ran Wednesdays. Mickleham now starts Monday 26 Oct, so
//   re-check the opening date per centre when the corrected link arrives.
//
// NIGHTS (Alex, 19 Oct 2026, final): MICKLEHAM MOVES TO MONDAYS ("I want to
// move Mickleham TO mondays 5-7pm"), 8 Mondays 26 Oct – 14 Dec. CRANBOURNE NORTH
// stays on Wednesdays, 8 Wednesdays 28 Oct – 16 Dec. Both 5:00pm – 7:00pm in two
// one-hour groups by age (split fixed 20 Oct 2026: see GROUPS below). There is no
// Wednesday at Mickleham and no Monday at Cranbourne North.

// JOIN ANY WEEK, WEEKLY ONLY (8 Nov 2026): the page is no longer sold as an 8-week
// term. Families can join at any time, and the only way to pay is the weekly
// subscription. The upfront link is no longer offered on the page; it stays here
// because api/stripe-webhook.js still files earlier upfront payments.
export const UPFRONT_LINK = 'https://buy.stripe.com/14A14n4fn3ud0uU7jJ9Zm0Y';
export const WEEKLY_LINK = 'https://buy.stripe.com/7sYeVd9zH3udgtSavV9Zm0X';
// MANDATORY SHIRT (Andy, 9 Nov 2026; src/lib/kit/trainingShirt.js). WEEKLY_LINK is for players
// without a shirt: its training shirt must be LOCKED at 1 in Stripe (adjustable quantity OFF).
// GO-LIVE STEP: it is still adjustable (0–99) because the live page tells families to set it to 0;
// switch "adjustable quantity" off on plink_1US8NNIo52UEA50y5UuUuuyo the day this form goes live.
// WEEKLY_NO_SHIRT_LINK (plink_1Ua0GJIo52UEA50yubADf8P8) is the same weekly price with no
// shirt, only for families who answer "Yes, they have one" on the form.
export const WEEKLY_NO_SHIRT_LINK = 'https://buy.stripe.com/dRmfZh13b3ud5Pe9rR9Zm0Z';

const money = (n) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
export const PRICE = { weekly: 44.95, shirt: 29.95 };

export const PAY_OPTIONS = {
    weekly: {
        key: 'weekly',
        title: 'Pay weekly',
        amount: money(PRICE.weekly),
        per: 'a week',
        detail: 'A weekly direct debit, by card, Apple Pay or Klarna. The first payment is taken when you book, then one each week while sessions are running. Over the holiday breaks, payments are paused and you keep your spot.',
        link: WEEKLY_LINK,                 // with the shirt (locked)
        linkNoShirt: WEEKLY_NO_SHIRT_LINK, // player already has a shirt
        value: PRICE.weekly,
    },
};

// GROUPS BY AGE (Alex, 20 Oct 2026: "we also need to be clearer about the 5pm group and
// 6pm group, so parents know which group and time they are signing up for or
// requesting"; he chose 5pm = ages 7–9, 6pm = ages 10–12). Same split at both centres,
// and on any night a family asks for. The form shows the group before they pay or
// request, saves it in `source` ("|group=5pm"), and the sheet shows it. If this split
// changes, change GROUP_RULE in api/sync-program-signups.js in the same commit.
export const GROUPS = [
    { key: '5pm', time: '5:00pm – 6:00pm', ages: '7–9', min: 7, max: 9 },
    { key: '6pm', time: '6:00pm – 7:00pm', ages: '10–12', min: 10, max: 12 },
];
export const groupFor = (age) => {
    const a = parseInt(age, 10);
    return GROUPS.find((g) => a >= g.min && a <= g.max) || null;
};
const GROUPS_LINE = `Two one-hour groups by age: ages ${GROUPS[0].ages} train ${GROUPS[0].time}, and ages ${GROUPS[1].ages} train ${GROUPS[1].time}.`;

// THE ROYALS WAY, NEW THIS TERM (Alex, 20–21 Oct 2026). The same words as the Term 4
// first-chance email, so the page says what the email promises. Alex confirmed badges
// start this term (20 Oct), overriding the blueprint's "pilot Term 1 2027". Wording from
// the version 2 page (jrV2Content.js: PROGRESS.lead, the Royals Way answer, "A climb, not a
// rank", "At their own rate"); the three badges are Alex's approved artwork (one batting
// badge per phase, jrV2Facts.js SAMPLE_BADGES). No portal login is promised: Term 4
// bookings don't reach the Player Performance Portal.
export const ROYALS_WAY = {
    about: 'Cricket coaching the Royals Way for players aged 7 to 12. Each week your player trains for one hour in a small group of players their own age. We teach the whole game: batting, bowling, fielding and how to play, through games, with one clear skill to learn, one coaching point to hold on to, and a score to beat.',
    eyebrow: 'How it works',
    title: 'Play the Royals Way',
    lead: 'Junior Royals now runs on the Royals Way Progress Tracking and Development System. Every player has clear goals that build their cricket from the foundations up, through three phases: Discover, Develop and Elevate.',
    steps: [
        { head: 'One skill at a time', body: 'Your player trains on one skill at a time, with their coach.' },
        { head: 'Earn the badge', body: 'When they can do that skill, they earn its badge and move on to the next one.' },
        { head: 'Every badge is recorded', body: 'You, your player and their coach can see what has been learned and what comes next.' },
    ],
    phasesTitle: 'From the foundations up: one batting badge from each phase',
    phases: [
        { phase: 'Discover', badge: 'Rock or Step', can: 'I can step or rock back to suit the ball.', img: '/assets/junior-royals/badges/rock-or-step-ribbon.svg' },
        { phase: 'Develop', badge: 'Forward or Back', can: 'I can go forward to the full one, back to the short one.', img: '/assets/junior-royals/badges/forward-or-back-ribbon.svg' },
        { phase: 'Elevate', badge: 'Pick the Length', can: 'I can pick the length and the shot.', img: '/assets/junior-royals/badges/pick-the-length-ribbon.svg' },
    ],
    note: 'Players are never ranked against each other. Every player develops at their own rate.',
};

// SESSIONS AT EACH CENTRE: weekly from the first night to the last one before the
// Christmas break. Each centre has its own last night. Sessions start at 5:00pm.
const sessionAt = (date) => new Date(`${date}T17:00:00+11:00`);
// The next session a family joining now would come to, or null after the last one.
export const nextSession = (centre, now = new Date()) => {
    const last = sessionAt(centre.lastDate);
    for (let d = sessionAt(centre.firstDate); d <= last; d = new Date(d.getTime() + 7 * 86400000)) {
        if (d > now) return d;
    }
    return null;
};
export const sessionLong = (d) => d.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Australia/Melbourne' });
export const lastSessionLine = (c) => `The last session before the Christmas break is ${c.lastSessionLong}.`;
// BOOKING CLOSES AFTER EACH CENTRE'S LAST SESSION (9 Nov 2026). The weekly direct debit
// starts the day a family pays, so after the last session before the break the form must
// not send anyone to Stripe: they would pay each week with no sessions running. It opens
// again once the restart dates are added here (firstDate / lastDate per centre).
export const bookingOpen = (centre, now = new Date()) => Boolean(nextSession(centre, now));
export const breakLine = (c) => `${c.night} at ${c.suburb} are on the Christmas break, so we're not taking bookings or payments for now. Email info@rramelbourne.com and we'll tell you when sessions restart.`;

// PHOTOS from real Junior Royals sessions (Andy, 8 Nov 2026: "show what Junior Royals is
// all about visually"). Files in public/assets/junior-royals/gallery/, each as a 900px
// .webp and a 480px "-sm" copy for phones. ECC signage = Elite Cricket Centre, Cranbourne
// North; the "M" logo = Mickleham Indoor Sports Centre.
const photo = (name, alt, caption) => ({
    src: `/assets/junior-royals/gallery/${name}.webp`,
    srcSm: `/assets/junior-royals/gallery/${name}-sm.webp`,
    alt,
    caption,
});
const benefitPhoto = (name, alt) => ({
    src: `/assets/junior-royals/benefits/${name}.webp`,
    srcSm: `/assets/junior-royals/benefits/${name}-sm.webp`,
    alt,
    caption: name,
});
export const JR_PHOTOS = {
    // NO DUPLICATES (Andy, 10 Nov 2026: "Please ensure that there is never a duplicate"): every
    // photo appears once on the page. The hero uses the two photos that aren't in the strip;
    // jrPhotos.test.ts fails if a file is used twice.
    hero: photo('batting-with-coach', 'A young batter playing a pull shot as a coach feeds the ball', 'Batting with a coach'),
    heroFeature: photo('hands-on-batting', 'A coach guiding a young batter into position while another player plays a forward defence', 'Hands-on coaching'),
    // One photo per benefit card in "Why Junior Royals", in the same order as JR_T4.benefits
    // (Andy, 10 Nov 2026: "select the right images and size them properly for the Why Junior
    // Royals section"). Cropped to 4:3 around the action, 800px + 480px .webp, in
    // public/assets/junior-royals/benefits/. None of them is used anywhere else on the page.
    benefits: [
        benefitPhoto('coach-briefing-batters', 'A coach in a COACH shirt briefing a group of padded-up young batters in the nets'),
        benefitPhoto('small-group-two-coaches', 'Two coaches talking with a small group of young batters in helmets and pads'),
        benefitPhoto('warm-up-game', 'A group of young players in a warm-up game with a coach watching'),
        benefitPhoto('bowling-arm-drill', 'Young players kneeling in a line, practising their bowling arm'),
        benefitPhoto('batter-full-shot', 'A young batter in helmet and pads playing a full shot in the nets'),
        benefitPhoto('warm-up-run', 'Smiling young players running a warm-up towards their coach'),
    ],
    // The photo strip under the hero (Andy, 10 Nov 2026: "a scrolling photo section below the
    // hero section, as we have for the /tours page"), in the order Andy sent them.
    gallery: [
        photo('squad-talk', 'A Junior Royals coach talking to a squad of young players sitting in front of a Rajasthan Royals Academy Melbourne banner', 'Learning as a squad'),
        photo('bowler-running-in', 'A young bowler running in to bowl in the nets while teammates wait their turn', 'Bowling in the nets'),
        photo('coach-watching-nets', 'A coach watching a young bowler in the nets with a batter waiting', 'Coaches in the nets'),
        photo('cones-batting-drill', 'Two young batters in helmets and pads practising a front-foot drill between coloured cones', 'Batting drills, one skill at a time'),
        photo('girl-batting-pull', 'A young girl in a helmet and pads playing a pull shot in the nets as a coach feeds the ball', 'Batting in the nets'),
        // Added 10 Nov 2026, in the order Andy sent them.
        photo('bowling-line-drill', 'A line of young players kneeling to practise their bowling arm with a coach watching', 'Bowling drills, together'),
        photo('ecc-bowling-pair', 'Two young players practising their bowling action in the nets while a coach watches', 'Bowling, one skill at a time'),
        photo('coach-demo-bat', 'A Junior Royals coach showing a group of young players how to hold the bat', 'One coaching point to hold on to'),
        // Added 10 Nov 2026. Two more Andy sent were already on the page (the lane 5 one-on-one is
        // the "Andrew Walton one-on-one" video's poster; the kneeling bowling line is bowling-line-drill).
        photo('batter-facing-bowler', 'A young batter in helmet and pads facing a bowler in the nets', 'Facing the bowler'),
        photo('ready-to-bat', 'A young player in a Rajasthan Royals Academy shirt holding his bat, ready for his turn', 'Ready to bat'),
        photo('waiting-turn-nets', 'Young players padded up and waiting their turn to bat in the nets', 'Waiting for their turn'),
        photo('grip-practice', 'Young players practising how to grip the ball with soft coloured balls', 'Learning the grip'),
    ],
};

// VIDEOS under the photo strip (Andy, 10 Nov 2026: "add a video section such as we have done
// in the /tours page, underneath the photos section. Add these 4 videos as a starting point").
// Same player and carousel as /tours (india-tour-2026/ITVideos.jsx VideoCard). Files are in
// public/junior-royals/videos/: compressed to 720x1080 like /tours, with a poster frame (.jpg).
// To add one: put <name>.mp4 + <name>.jpg there and add an entry here. Players' names stay
// out of titles and captions; coaches are named.
const video = (name, title, caption) => ({ src: `/junior-royals/videos/${name}.mp4`, poster: `/junior-royals/videos/${name}.jpg`, title, caption });
export const JR_VIDEOS = [
    video('front-foot-defence', 'Front-foot defence', 'Sid helping out with front-foot defence'),
    video('run-out-drill', 'Run-out drill', 'A fielding drill: back up, gather, hit the stumps'),
    video('pull-shots', 'Pull shots', 'Jinang feeding pull shots in the nets'),
    video('sweep-shot', 'The sweep', 'Andrew Walton teaching the sweep'),
    // Added 10 Nov 2026 (file "v2_Hallam_JR"; filmed at the Elite Cricket Centre). Junior Royals no
    // longer runs at Hallam, so the caption doesn't name it.
    video('session-montage', 'A Junior Royals session', 'Catching, fielding and batting, all in one session'),
    // Added 10 Nov 2026 (file "AW_coaching_youngster"). Coach: Andrew Walton (Andy, 10 Nov 2026).
    video('coaching-young-batter', 'Coaching a young batter', 'Andrew Walton one-on-one with a young batter in the nets'),
    // Added 10 Nov 2026 (file "IMG_3550").
    video('bowling-machine-drill', 'Bowling machine drill', 'Batting against the bowling machine while the group runs in from the cones'),
];

export const JR_T4 = {
    // Page wording that used to sit in the JSX, here so the admin Junior Royals Editor
    // (admin/JuniorRoyalsEditor.jsx, jrContent.js) can change it.
    heroEyebrow: 'Rajasthan Royals Academy · Melbourne',
    heroTitle: 'JUNIOR ROYALS',
    heroTitleAccent: 'CRICKET FOR AGES 7–12',
    heroSub: 'Weekly coaching · Join any week · Pay weekly',
    // Who the program is for, above heroLead (Andy, 10 Nov 2026, his wording).
    heroFor: 'Perfect program for beginners, kids new to the game, those needing more work on the basics, friends wanting to train together, youngsters with ambition to train in our Performance Squads and players under 10 with skills wanting more training to drill their skills to a higher level.',
    heroLead: 'One hour of cricket coaching each week, in a small group of players their own age, with Rajasthan Royals Academy coaches.',
    // THE BENEFITS, short and plain (8 Nov 2026: "be clear about the benefits"), in a softer,
    // parent-facing voice (10 Nov 2026: "make this a bit more softer and customer focused").
    benefitsEyebrow: 'Why Junior Royals',
    benefitsTitle: 'Made for your child',
    benefits: [
        { head: 'Expert coaching, every week', body: 'Your child spends an hour each week with our Rajasthan Royals Academy coaches, learning in a friendly, encouraging group.' },
        { head: 'With kids their own age', body: 'Ages 7–9 train at 5:00pm and ages 10–12 at 6:00pm, so your child learns alongside players at a similar stage.' },
        { head: 'Learning through play', body: 'Batting, bowling and fielding are taught through games, so your child has fun while learning the whole game.' },
        { head: 'Confidence that grows', body: 'Your child learns one skill at a time and earns a badge for each one, so you can both see how far they have come.' },
        { head: 'Ready for Saturday cricket', body: 'What your child practises each week is what they use in their club games, so they head into Saturdays feeling ready.' },
        { head: 'Join any week', body: 'No need to wait for a new term. Book today and your child joins at the next session.' },
    ],
    ages: '7–12',
    ageMin: 7,
    ageMax: 12,
    factLine: 'Ages 7–9: 5:00pm – 6:00pm · Ages 10–12: 6:00pm – 7:00pm · Mondays at Mickleham, Wednesdays at Cranbourne North',
    groupsLine: GROUPS_LINE,
    priceLine: `${money(PRICE.weekly)} a week, incl. GST. Join any week and pay week by week: no upfront term fee.`,
    shirtLine: `Every player needs the Junior Royals training shirt. If your player doesn't have one, it's ${money(PRICE.shirt)} incl. GST, added to the first payment; tell us the size when you book.`,
    joinLine: 'Join any week: your player starts at the next session after you book.',
    ctaLabel: 'Secure Your Place',
    placeLine: 'Your place is booked once you have paid.',
    // AUTOMATIC RE-ENROLMENT, OPT-OUT (Alex, 20 Oct 2026): "it's an automatic enrolment
    // into the next term (opt out system) … we will be in touch to confirm. Direct debits
    // will be cancelled at the end of the term and restart at the beginning." The 2 weeks'
    // notice is Alex's (8 Oct 2026, NOTICE_WEEKS in the version 2 mock-up).
    // Same opt-out rules, without the word "term" (8 Nov 2026: join any week).
    // HOLIDAY BREAKS (Alex, 9 Nov 2026): "payments are paused but you keep your spot."
    // The admin team pauses each weekly subscription in Stripe (Pause payment collection,
    // Void invoices, resume date = first session back), so no one is charged for weeks off.
    renewTitle: 'Holiday breaks: payments pause, you keep your spot',
    renewLines: [
        'Over the holiday breaks, including Christmas, your weekly payments are paused but you keep your spot. You aren\'t charged for the weeks with no sessions.',
        'Payments stop after your centre\'s last session before a break and start again when sessions restart.',
        'We\'ll be in touch before sessions restart to confirm your player\'s spot.',
        'Not coming back after a break? Email info@rramelbourne.com at least 2 weeks before sessions restart and we\'ll cancel your payments.',
    ],
    // A DIFFERENT NIGHT (Alex, 20 Oct 2026): "people can select different days but need to
    // know Wednesday (Cranbourne Nth) and Monday (Mickleham) are only on offer currently and
    // if another night is requested we don't take payment, we just send them to a
    // confirmation page and to standby." We fill the nights on offer first.
    request: {
        offeredLead: 'Book and pay now.',
        title: 'A different night',
        lead: 'Request only: nothing to pay, and you go on standby.',
        why: (c) => `Junior Royals at ${c.suburb} runs on ${c.night}, ${c.times}, for now, and we're filling those sessions first.`,
        dayLabel: 'Which night would suit you?',
        button: 'Request This Night',
        note: 'No payment is taken and no place is held. You go on standby for that night.',
        doneTitle: "You're on standby",
        done: (player, day, c, g) => `We've got ${player}'s request for ${day} nights${g ? `, ${g.time} (the ages ${g.ages} group),` : ''} at the ${c.venue}, ${c.suburb}. No payment has been taken and no place is held. Junior Royals runs on ${c.night} there for now; if we open ${day} nights, we'll contact you first.`,
    },
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    renewShort: 'Over the holiday breaks your payments are paused and you keep your spot; we\'ll be in touch before sessions restart.',
    centresApart: 'The two centres are about 70 km apart, so pick the one you can get to every week.',
    // TWO CENTRES ONLY (Alex, 5 Oct 2026): "Hallam and Williamstown no longer exist
    // as part of the organisation for the moment." Don't name them on the page.
    twoCentres: 'Junior Royals runs at two centres: Mickleham Indoor Sports Centre in North Melbourne, and the Elite Cricket Centre in Cranbourne North, South-East Melbourne.',
    // Players older than 12 go to Performance Squads (Alex, 5 Oct 2026).
    // Andy, 10 Nov 2026: "If you feel your child is more advanced than the Junior Royals
    // program, please visit our Performance Squad program". Shown as
    // "<olderLead> <link: olderLinkLabel> (ages 10 to 25)." in the benefits and the form.
    olderLead: 'If you feel your child is more advanced than the Junior Royals program, please visit our',
    olderLinkLabel: 'Performance Squads program',
    olderRoute: '/performance-squads',
    centres: [
        {
            value: 'mickleham',
            region: 'North Melbourne',
            venue: 'Mickleham Indoor Sports Centre',
            suburb: 'Mickleham',
            address: 'Mickleham, VIC',
            day: 'monday',
            night: 'Mondays',
            firstDate: '2026-10-26',
            lastDate: '2026-12-14',
            lastSessionLong: 'Monday 14 December',
            mapsUrl: 'https://maps.google.com/?q=Mickleham+Indoor+Sports+Centre+VIC',
            image: '/assets/jr-bundoora.png',
            gradient: 'linear-gradient(135deg, #001D48 0%, #1226AA 40%, #E11F8F 100%)',
            // Alex, 19 Oct 2026: Mickleham moves to Mondays, 5:00pm – 7:00pm.
            times: '5:00pm – 7:00pm',
            groups: GROUPS_LINE,
        },
        {
            value: 'cranbourne-north',
            region: 'South-East Melbourne',
            venue: 'Elite Cricket Centre',
            suburb: 'Cranbourne North',
            // Street address from PR #102.
            address: '30 Medley Dr, Cranbourne North, VIC 3977',
            day: 'wednesday',
            night: 'Wednesdays',
            firstDate: '2026-10-28',
            lastDate: '2026-12-16',
            lastSessionLong: 'Wednesday 16 December',
            mapsUrl: 'https://maps.google.com/?q=Elite+Cricket+Centre+30+Medley+Dr+Cranbourne+North+VIC',
            image: '/assets/jr-bundoora.png', // unchanged from the live card
            gradient: 'linear-gradient(135deg, #001D48 0%, #1226AA 60%, #E11F8F 100%)',
            // Alex, 19 Oct 2026: "Cranbourne offering 5pm-7pm age groups balanced accordingly".
            times: '5:00pm – 7:00pm',
            groups: GROUPS_LINE,
        },
    ],
};
