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
        'Sets the coaching standard across all three Academy centres — what we teach, how we teach it, and what a Royals cricketer looks like at every age.',
    credentials: ['22+ Years Coaching', 'Premier Cricket Senior Assistant Coach', 'Bowling Coach'],
    bio: [
        'For over 22 years, thousands of young cricketers have had their careers heavily and positively influenced by Alex’s coaching, tactical and player management skills. He is committed to getting the technique right and putting the player first — building not just better cricketers, but sharper athletes and tougher competitors.',
        'As Director of Cricket, Alex sets the curriculum and the coaching standard across every Academy centre, and as Academy Head Coach he still leads from the floor of the nets — not from behind a desk. He is a current Premier Cricket senior assistant coach and bowling coach.',
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
