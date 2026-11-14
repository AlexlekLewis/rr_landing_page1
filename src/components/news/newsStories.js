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
//
// RULES (same editorial rules as Power Cricket's content/EDITORIAL_GUIDE.md):
//   - Only facts from material Andy or Alex supplied, or copy already approved on the
//     site. Never invent scores, names, quotes, dates or prices.
//   - Never name a junior player (under 18). Coaches and adult captains can be named.
//   - Australian English. Lead with the news; short paragraphs; finish with what to do next.
//
// PULLING STORIES IN FROM OTHER SITES: a story from another part of the network (Power
// Cricket, Power League, Power Game) is copied in here with `source`, shown in full on our
// site with a "From Power Cricket" line. powercricket.com.au is not public yet ("Coming
// soon"), so we show the story here rather than link out to it. When both sites read
// stories from Supabase, this file can pull them in automatically instead.
//
// This file is plain data on purpose: scripts/prerender-seo.mjs and src/seo/pageSeo.js
// read it in Node to give every story its own share preview.
// ─────────────────────────────────────────────────────────────

const paragraphs = (...ps) => ps.join('\n\n');
const IMG = '/assets/news';

export const NEWS_STORIES = [
    {
        // Pulled in from Power Cricket (src/data/news-stories.js, slug alex-lewis-power-league-round-two),
        // approved for posting by Andy on 13 Nov 2026. Text as published there, except the last
        // sentence: it pointed to Power Cricket's squads story, which is not on this site because
        // its full junior squads name players under 18.
        slug: 'alex-lewis-power-league-round-two',
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
