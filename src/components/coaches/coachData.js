// ============================================================
// coachData.js — the Academy coaching leadership roster.
//
// Single source of truth for /coaches. Bios are the academy's
// previously published coach copy (ex Junior Royals coaches
// section), updated to the July 2026 leadership titles set by
// Alex: Director of Cricket + two regional Head Coaches.
// ============================================================

export const DIRECTOR = {
    slug: 'alex-lewis',
    name: 'Alex Lewis',
    role: 'Director of Cricket · Academy Head Coach',
    centre: 'Mickleham Indoor Sports Centre',
    region: 'All Centres · Northern Melbourne',
    img: '/assets/coaches/alex-lewis.jpg',
    imgPosition: 'object-center',
    tagline:
        'Alex leads the Academy’s program development, talent identification and the running of all three centres, and is Head Coach at the Mickleham centre. His focus is giving young players a safe place to chase their growth, without the fear of failure or judgement.',
    // Alex's coaching manifesto, adapted from the Power Game head-coach quote.
    // Reframed 22 Jul to an optimistic, inclusive tone: keep "the future of the
    // game belongs to the brave" + "good cricketers, talented kids" as a positive,
    // drop the "epidemic of conservative players / too afraid" framing, and use
    // "our goal" rather than "my job".
    quote:
        'The future of the game belongs to the brave — good cricketers, talented kids with the courage to express who they really are. Our goal is to build players brave enough to be the best version of themselves, and good enough to back it up.',
    credentials: ['Cricket Australia Level 2', 'Premier Cricket Head of Academy', 'Cricket Victoria Coach Educator'],
    // Rewritten 22 Jul to Alex's own direction: plain and honest, no slogans (he
    // rejected the "coaches the opposite of fear" framing). States his actual role —
    // Director of Cricket (program development, talent ID, all three centres) + Head
    // Coach at Mickleham — and his real focus: safe environments to grow without fear
    // of failure or judgement. See [[dont-sloganize]].
    bio: [
        'Alex has spent over 22 years coaching young cricketers through the representative pathways — hundreds of them. As Director of Cricket and Academy Head Coach he leads cricket for the Royals network in Melbourne: the talent pathway and how players progress through it, the design of the Academy’s programs across all three centres, and the standard of coaching itself — including how the coaching team is recruited and developed. At Mickleham he is Head Coach, in the nets each week.',
        'Outside the Academy he is in his fourth season as Head of Academy at Fitzroy Doncaster, a Victorian Premier Cricket club — the top grade of club cricket in the state — where he is also Head Bowling Coach and a Senior Assistant Coach with the senior side. Before that he coached the Northern Falcons in the Youth Premier League — under-16s, under-17 girls and under-18s — in the years when that was the competition players had to come through to reach Premier Cricket or state cricket. Cricket Victoria also appointed him Junior Director of Coaching for the region, a coach education role in which he delivered the Level 1 courses that qualify community coaches. He founded his own junior academy at Preston and ran it for over ten years, and has been a representative head coach across the Diamond Valley and North Metro associations.',
        'What matters most to Alex is the environment he creates — one where young players feel free to have a go, get it wrong, and get better. In his own words: let the player play, explore, make mistakes and learn. He coaches to the individual player, not to a template.',
    ],
};

export const REGIONAL_COACHES = [
    {
        slug: 'alex-thornhill',
        name: 'Alex Thornhill',
        role: 'Head Coach — Hallam · Regional Manager, South East',
        centre: 'Hallam Cricket Centre',
        region: 'South East Melbourne',
        img: '/assets/coaches/alex-thornhill.jpg',
        imgPosition: 'object-center',
        tagline:
            'Batting specialist with coaching experience across two continents — the UK county system and the Australian premier pathway.',
        credentials: ['England County System', 'Xavier College Cricket Lead', 'Fitzroy Doncaster Academy'],
        bio: [
            'A high-quality coach and a key part of the Academy’s Elite Program, Alex is a batting specialist with coaching experience across two continents — UK county cricket and the Australian premier system. He also oversees curriculum and content development for the Junior Royals program.',
            'Alex leads the Hallam centre as Head Coach and manages the Academy’s South East region. Beyond the Academy he coaches within the Fitzroy Doncaster Academy and leads the cricket program at Xavier College.',
        ],
    },
    {
        slug: 'andrew-walton',
        name: 'Andrew Walton',
        role: 'Head Coach — Williamstown · Regional Manager, East & West',
        centre: 'Williamstown — The Netz',
        region: 'East & West Melbourne',
        img: '/assets/coaches/andrew-walton.jpg',
        imgPosition: 'object-center',
        tagline:
            'Cricket Australia Level 3 High Performance coach who has developed players through to Sheffield Shield, BBL and international honours.',
        credentials: ['CA Level 3 High Performance', '15 India HP Academy Visits', 'Scotch College Director of Coaching', '10+ Years Premier Cricket Head Coach'],
        bio: [
            'A Cricket Australia Level 3 High Performance accredited coach with over a decade of Premier Cricket Head Coach experience, Andrew has developed players through to Sheffield Shield, BBL and international honours — working with the likes of Glenn Maxwell, Chris Rogers and Sam Harper.',
            'Andrew has completed 15 visits to India as a specialist coach at high-performance cricket academies in Bangalore, Mysore and Mumbai.',
            'Currently Director of Coaching at Scotch College, Andrew leads the Williamstown centre as Head Coach and manages the Academy’s East and West regions — bringing a rare blend of technical excellence and data-driven performance thinking to the Royals Academy.',
        ],
    },
];

// Bio section order: Director first, then the regional coaches.
export const ALL_COACHES = [DIRECTOR, ...REGIONAL_COACHES];
