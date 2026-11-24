// ─────────────────────────────────────────────────────────────
// NEWS & FEATURES on rramelbourne.com (Andy, 14 Nov 2026: "start to post news and
// features, not just videos and photos ... so people can have a look at what's going
// on in a bit more detail"). Built to mirror the News & Features section on the Power
// Cricket site (AlexlekLewis/Power_Cricket): a story card strip on the home page, a
// /news page and a page of its own for every story, /news/<slug>, to share on socials.
//
// ADDING A STORY: add an entry at the top of NEWS_STORIES. Every story needs:
//   slug          lowercase-words-with-hyphens; it becomes rramelbourne.com/news/<slug>.
//                 Never change it once published (people will have shared the link).
//   brand         the label on the card: 'Royals Academy', 'Junior Royals',
//                 'Performance Squads', 'India Tour', 'Power League', ...
//   type          'article' (or 'video' with youtubeId)
//   publishedAt   YYYY-MM-DD; stories show newest first
//   title         the headline, ideally under ~80 characters
//   excerpt       one or two sentences for the card; must make sense on its own
//   heroImage     a LANDSCAPE photo in public/assets/news/ (cards and share previews are 16:9)
//   body          paragraphs, separated by a blank line ('\n\n')
//   gallery       optional extra photos shown under the story
//   cta           optional { label, href } button to the program the story is about
//   source        optional { name, note }: where a story was pulled in from
//   sites         where it appears: ['rra-melbourne'] (this site, the default if left out),
//                 ['power-cricket'] or ['rra-melbourne', 'power-cricket'] for both. A story tagged
//                 'power-cricket' is published in our feed (rramelbourne.com/news-feed.json) and
//                 shows on the Power Cricket site's News & features too (see network.js).
//                 Never tag a story for Power Cricket that only makes sense to Academy families.
//
// RULES (same editorial rules as Power Cricket's content/EDITORIAL_GUIDE.md):
//   - Only facts from material Andy or Alex supplied, or copy already approved on the
//     site. Never invent scores, names, quotes, dates or prices.
//   - Under-18s can be named if they are in the T20 Elite Program, Power Game Pre-Season or
//     Performance Squads (families ticked consent; Andy, 23 Nov 2026). Never name players who are
//     only in Junior Royals.
//   - Australian English. Lead with the news; short paragraphs; finish with what to do next.
//
// STORIES FROM POWER CRICKET arrive by themselves: when the Power Cricket journalist tags a
// story for 'rra-melbourne', it appears here from Power Cricket's feed (network.js), shown in
// full with a "From Power Cricket" line, with no change to this file. A story only needs
// copying in here to change its wording for our site (our copy wins on the same slug).
//
// This file is plain data on purpose: scripts/prerender-seo.mjs and src/seo/pageSeo.js
// read it in Node to give every story its own share preview.
// ─────────────────────────────────────────────────────────────

const paragraphs = (...ps) => ps.join('\n\n');
const IMG = '/assets/news';

export const NEWS_STORIES = [
    {
        // Also in Power Cricket's feed (tagged for both sites). Andy, 25 Nov 2026; image supplied by Andy.
        slug: 'sooryavanshi-204-off-53-record-night',
        sites: ['rra-melbourne'],
        brand: 'Power Cricket',
        type: 'article',
        publishedAt: '2026-11-25',
        title: 'Sooryavanshi, 15, smashes a 28-ball hundred and 204 off 53 in a record-breaking night',
        excerpt:
            'Rajasthan Royals teenager Vaibhav Sooryavanshi hit the fastest hundred and fastest double hundred in List A history, with a world-record 28 sixes, as India A beat the UAE in Doha.',
        heroImage: `${IMG}/sooryavanshi-204-hero.jpg`,
        heroAlt: 'Vaibhav Sooryavanshi: 204 off 53 balls',
        gallery: [
            { src: `${IMG}/sooryavanshi-204-cover.jpg`, alt: 'Vaibhav Sooryavanshi, 204 off 53 balls' },
            { src: `${IMG}/sooryavanshi-204-records.jpg`, alt: 'The records: 28-ball hundred, 52-ball double hundred, 28 sixes' },
        ],
        galleryAspect: '4/5',
        body: paragraphs(
            'Vaibhav Sooryavanshi has rewritten cricket’s record books. The 15-year-old Rajasthan Royals batter hit 204 off 53 balls for India A against the UAE at the Asia Cup Rising Stars in Doha overnight, making the fastest hundred and the fastest double hundred ever scored in List A cricket.',
            'He reached 50 in 16 balls and 100 in 28, one ball quicker than Jake Fraser-McGurk’s previous record of 29. He didn’t stop there, bringing up 200 from his 52nd ball.',
            'His 204 included 28 sixes, a world record for a List A innings, and seven fours. That is 196 runs in boundaries.',
            'The UAE had made 8/249. India A raced to 3/254 in just 14.2 overs to win by seven wickets. By the time Sooryavanshi was caught off Basil Hameed in the 13th over, the chase was all but done, and Rinku Singh finished 27 not out.',
            'The win puts India A into the semi-finals.',
            'It was power hitting at its most extreme: fearless, clean striking from the first ball to the last.',
        ),
    },
    {
        // Weekend Wrap, 20-22 Nov 2026: written by the Power Cricket journalist and tagged for both sites
        // there. Kept here too so it shows on our site straight away; our copy wins on the same slug.
        slug: 'weekend-wrap-20-22-november',
        sites: ['rra-melbourne'],
        brand: 'Weekend Wrap',
        type: 'article',
        publishedAt: '2026-11-23',
        title: 'Unbeaten eighties and a five-for headline a big weekend for our players',
        excerpt:
            'Siddhant Goel and Dhruva Bezawada carried their bats in Premier Under-18s, Jake Frederiksen took 5/45 for Diamond Creek’s 1st XI, and Sridhar Srivatsan made fifties on back-to-back days.',
        heroImage: `${IMG}/weekend-wrap-20-22-nov-header.jpg`,
        heroAlt: 'Weekend Wrap, 20 to 22 November: our top performers in club cricket',
        gallery: [
            { src: `${IMG}/weekend-wrap-20-22-nov-top-knocks.jpg`, alt: 'Top knocks, 20 to 22 November' },
            { src: `${IMG}/weekend-wrap-20-22-nov-top-spells.jpg`, alt: 'Top spells, 20 to 22 November' },
        ],
        galleryAspect: '4/5',
        body: paragraphs(
            'Two unbeaten eighties in Premier Under-18 cricket and a five-wicket haul in a 1st XI led the way as players from our T20 Elite Program, Power Game Pre-Season and Performance Squads lit up Melbourne club cricket from Friday 20 to Sunday 22 November.',
            'Siddhant Goel produced the innings of the weekend, carrying his bat for 86 not out off 107 balls for Richmond against Ringwood on Sunday. Dhruva Bezawada was just as composed, finishing 81 not out off 98 as Camberwell Magpies chased down their target against Melbourne University with six wickets to spare.',
            'Ranen Gandhi ground out 75 off 129 balls in school 1st XI cricket on Saturday, an innings built on patience that set up a 23-run win. Guransh Singh followed on Sunday with 58 off 67 for Point Cook Centrals’ Sunday XI in a 102-run victory.',
            'Sridhar Parthasarathy Srivatsan had the busiest weekend of anyone. He made 52 for Burnside Springs United’s 1st XI on Saturday, then backed it up with 50 not out and two catches as Werribee’s Sunday XI cruised home by seven wickets.',
            'There were runs in the women’s game too. Anuki Dassanayake struck 50 off 71 as Greenvale Kangaroos won by five wickets in Women’s Premier Seconds, while Sahasra Pulibandla smashed 37 not out off just 19 balls, with seven fours, for Carlton. Vrishti Mangrolia added 37 not out for South Morang Lions.',
            'Syed Shayan Ahmad hit 38 off 39 and took two catches for Northcote in Premier Under-18s, Girik Wadhwa raced to 34 not out off 20 balls in Under-13s, and Tanish Singh and Dheer Chaudhari both made 33.',
            'With the ball, Jake Frederiksen was the standout. His 5/45 from eight overs bowled Diamond Creek’s 1st XI to an 18-run win over Heidelberg on Saturday. Angad Singh Pantlya was miserly for Indigos on Sunday, taking 3/13 from six overs, including two maidens, as they won by five wickets.',
            'Behind the stumps and in the field, Vishar Bellur took two catches and completed a stumping for Western Lions in Under-13s.',
        ),
    },
    {
        // Also in Power Cricket's feed (tagged for both sites). Senior game only; the junior report follows
        // when Alex sends the junior scores. Scores: FrogBox match centre, match 7753804.
        slug: 'ghotra-85-south-east-melbourne-senior-win',
        sites: ['rra-melbourne'],
        brand: 'Power League',
        type: 'article',
        publishedAt: '2026-11-15',
        title: 'Ghotra’s unbeaten 85 powers South-East Melbourne to 73-run senior win',
        excerpt:
            'Jaskaran Ghotra hit 85 not out off 56 balls as South-East Melbourne posted 6/184 and beat North Melbourne by 73 runs in the Power League senior game at Montmorency Park.',
        heroImage: `${IMG}/power-league-15-nov-ghotra-delivery-wide.jpg`,
        heroAlt: 'Jaskaran Ghotra faces a delivery at Montmorency Park, with the Power League banner behind',
        gallery: [
            { src: `${IMG}/power-league-15-nov-senior-bowler.jpg`, alt: 'A South-East Melbourne bowler in his delivery stride' },
            { src: `${IMG}/power-league-15-nov-royals-flags.jpg`, alt: 'Players talk tactics beside the Royals Academy flags' },
            { src: `${IMG}/power-league-15-nov-chase-scoreboard.jpg`, alt: 'The scoreboard during North Melbourne’s chase of 185' },
            { src: `${IMG}/power-league-15-nov-senior-quick.jpg`, alt: 'A South-East Melbourne player between overs' },
        ],
        body: paragraphs(
            'Jaskaran Ghotra hit an unbeaten 85 off 56 balls as South-East Melbourne beat North Melbourne by 73 runs in the Power League senior game at Montmorency Park’s South Oval on Sunday 15 November.',
            'South-East Melbourne won the toss, batted and made 6/184 from their 20 overs. North Melbourne were 7/111 when their innings closed after 16 overs.',
            'Ghotra came in at No.4 and batted through to the end. He hit nine fours and three sixes, and cut loose in the final overs to take South-East Melbourne past 180.',
            'Gurbir Singh set the tone at the top of the order with 37 off 23 balls, including six fours and a six, while two wickets fell at the other end. Ojas Taneja trapped him lbw, but Gurjaap Goraya kept the pressure on with 33 off 16.',
            'North Melbourne’s bowlers had their moments. Levi Templeton took 1/7 from two overs, Sanchit Dhingra 1/8 from two and Mitchel Clark 1/11 from three.',
            'Captain Ikroop Dhanoa gave the chase a fast start, hitting six fours in his 32 off 23 balls before Ghotra had him caught. Soham Sagar struck two sixes in his 27 off 20, and North Melbourne were 2/64 after eight overs.',
            'South-East Melbourne’s bowlers then took control. North Melbourne lost four wickets for 26 runs to slide from 2/64 to 6/90. Arunjit Singh (2/24) and Abhiveer Behl (2/33) shared four wickets, and Zach van der Nest picked up 1/19.',
            'Mukund finished unbeaten on 20 off just six balls, but the result had long been settled.',
        ),
    },
    {
        // Also in Power Cricket's feed (tagged for both sites there), but kept here because our
        // wording differs: approved for posting by Andy on 13 Nov 2026, text as published on Power
        // Cricket except the last sentence, which pointed to Power Cricket's squads story. That
        // story is not on this site because its full junior squads name players under 18.
        // Our copy wins over the feed's (same slug).
        slug: 'alex-lewis-power-league-round-two',
        sites: ['rra-melbourne'],
        brand: 'Power League',
        type: 'article',
        publishedAt: '2026-11-13',
        title: '“This is what they’ve been training for”: Alex Lewis on Power League’s second weekend',
        excerpt:
            'Rajasthan Royals Academy Melbourne Director of Cricket Alex Lewis previews Sunday’s Power League double-header at Montmorency Park, and the talent set to light it up.',
        heroImage: `${IMG}/power-league-alex-lewis-team-talk.jpg`,
        heroAlt: 'Alex Lewis giving a team talk to Power League players',
        gallery: [
            { src: `${IMG}/power-league-alex-lewis-huddle.jpg`, alt: 'Alex Lewis with a Power League squad in a huddle' },
            { src: `${IMG}/power-league-keeper-warm-up.jpg`, alt: 'A wicketkeeper warming up at a Power League match, with partner banners on the boundary' },
        ],
        source: { name: 'Power Cricket', note: 'Power League is run by Power Cricket, proud partners of the Rajasthan Royals Academy.' },
        body: paragraphs(
            'Power League’s second set of fixtures arrives this Sunday, and Rajasthan Royals Academy Melbourne Director of Cricket Alex Lewis can’t wait to see what the players produce.',
            'North Melbourne and South-East Melbourne meet in a senior and a junior T20 at Montmorency Park on 15 November, with both games starting at 2:00pm. The seniors play on the South Oval and the juniors on the North Oval.',
            '“The first round showed us the standard is there,” Lewis said. “Now it’s about building on it. We’ve got some seriously talented cricketers across both squads, and Sunday is their chance to show it.”',
            'The format is built for that. Power League is fast, high-intensity T20 cricket, designed to reward the skills the modern game demands: clean striking, sharp running, smart bowling at the death and fielding that wins matches.',
            '“That’s what Power League is about,” he said. “We want players to back themselves, take the game on and play with freedom. When they do, it’s brilliant to watch.”',
            'The senior match brings together two captains leading from the front: Ikroop Dhanoa for North Melbourne and Harkirat Bajwa for South-East Melbourne. On the next oval, the junior game puts the next wave of Power League talent in the spotlight.',
            '“The juniors are a real highlight for me,” Lewis said. “To see young players stepping up in a proper match-day environment, with their families watching, is exactly why we do this.”',
            '“Both squads are ready to go,” he said. “It’s going to be a great afternoon of cricket.”',
            'Play gets underway at 2:00pm at Montmorency Park, Park Lane, off Para Road, Montmorency.',
        ),
        cta: { label: 'See Performance Squads', href: '/performance-squads' },
    },
    {
        // Written from copy already approved and live on /tours (india-tour-2026/itCopy.js,
        // itMedia.js captions, Andy 10 Nov 2026). No quotes, prices or players' names.
        slug: 'inside-our-first-tour-rajasthan-royals-high-performance-centre',
        sites: ['rra-melbourne'],
        brand: 'India Tour',
        type: 'article',
        publishedAt: '2026-11-14',
        title: 'Inside our first tour to the home of the Royals',
        excerpt:
            'A week of turf nets, centre-wicket practice and one-on-one coaching at the Rajasthan Royals High Performance Centre in Nagpur. Here is what our first touring group did.',
        heroImage: `${IMG}/india-tour-warm-up-hpc-wide.jpg`,
        heroAlt: 'Rajasthan Royals Academy Melbourne players warming up in front of the Rajasthan Royals High Performance Centre in Nagpur',
        gallery: [
            { src: `${IMG}/india-tour-faiz-fazal-one-on-one.jpg`, alt: 'Faiz Fazal working one-on-one with a Rajasthan Royals Academy Melbourne batter in the nets' },
            { src: `${IMG}/india-tour-sid-trivedi-bowling.jpg`, alt: 'Siddharth Trivedi watching a young Rajasthan Royals Academy Melbourne bowler in the nets' },
            { src: `${IMG}/india-tour-sid-lahiri-nets.jpg`, alt: 'Sid Lahiri running a net session on turf' },
            { src: `${IMG}/india-tour-centre-wicket.jpg`, alt: 'A Rajasthan Royals Academy Melbourne batter on strike during centre-wicket practice on turf' },
        ],
        body: paragraphs(
            'In September 2026, our first touring group spent a week training at the Rajasthan Royals High Performance Centre in Nagpur, the home training and high performance base of the Rajasthan Royals.',
            'Over seven nights at the centre, the group had six full coaching days and played a match on turf. Days were built around turf nets and centre-wicket sessions, against the pace and spin that India is famous for.',
            'The coaching came from inside the Royals. Faiz Fazal, Indian cricket legend and former Royals cricketer, worked one-on-one with batters on everything from the grip to a plan at the crease. Siddharth Trivedi, legendary Rajasthan Royals bowler, watched every ball in the bowling nets. Somi Bhinder, resident coach at the centre, ran sessions on the training ground, and Sid Lahiri, Head of International Player Development at the Rajasthan Royals, ran net sessions on turf.',
            'A professional set-up coaches more than batting, so the plan went beyond the nets: strength and conditioning, focus under match-day pressure, hydration and recovery, and video analysis with individual feedback.',
            'Between sessions the players rested in the players’ lounge, the same room the Royals players use. There was time to see India too: members of the group went on a tiger safari.',
            'Our next tour is planned for April 2027 and runs for about ten days. Exact dates are not set yet. Register your interest and we will write to you with the dates, the price and what it includes. It costs nothing and commits you to nothing.',
        ),
        cta: { label: 'See the April 2027 tour', href: '/tours' },
    },
];
