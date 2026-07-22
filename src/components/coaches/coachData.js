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
        'Coaches the opposite of fear — courage, intent, and finding a way to win from anywhere. Twenty-two years through rep pathways, still leading from the floor of the nets.',
    // Alex's coaching manifesto, adapted from the Power Game head-coach quote.
    // Reframed 22 Jul to an optimistic, inclusive tone: keep "the future of the
    // game belongs to the brave" + "good cricketers, talented kids" as a positive,
    // drop the "epidemic of conservative players / too afraid" framing, and use
    // "our goal" rather than "my job".
    quote:
        'The future of the game belongs to the brave — good cricketers, talented kids with the courage to express who they really are. Our goal is to build players brave enough to be the best version of themselves, and good enough to back it up.',
    credentials: ['22+ Years Coaching', 'Premier Cricket Senior Assistant Coach', 'Bowling Coach'],
    // Rewritten 22 Jul from Alex's authentic coaching material (Power Game manifesto
    // + "Royals Way" philosophy): rep cricket built around the fear of getting out →
    // he coaches the opposite (courage, intent, win from anywhere); power on demand +
    // 360° game used under pressure; measured in/out, built not guessed. Replaces the
    // inherited generic "getting the technique right / player first" line Alex flagged.
    bio: [
        'For over 22 years, hundreds of young cricketers have had their game shaped by Alex’s coaching through representative pathways — built into better cricketers, sharper athletes and tougher competitors. He coaches against the grain of rep cricket: where the game has long been played around the fear of getting out, Alex coaches the opposite — courage, intent, and the skill to find a way to win from anywhere.',
        'As Director of Cricket he shapes how the Royals develop players across all three centres, but he coaches it himself — from the floor of the nets, not from behind a desk. His development is built, not guessed: players are measured in and measured out, building power on demand and a 360° game, and the confidence to use it when it matters. A current Premier Cricket senior assistant and bowling coach — technique-first, player-first, because individuality done well is what the modern game rewards.',
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
