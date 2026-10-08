// Central SEO config for all public pages, consumed by <RouteSeo/> (react-helmet-async).
// One entry per public route. Titles target the non-branded category terms we currently
// rank for NOTHING on (per the GSC baseline: 100% branded traffic today).
//   - title:       aim <= 60 chars (Google truncates beyond ~60)
//   - description: aim <= 155 chars
//   - canonical:   optional path override (defaults to baseUrl + pathname)
//   - ogImage:     optional path override (defaults to SITE.defaultOgImage)
// Canonical URLs only: use /mickleham (not the /private-coaching 308) and /elite-royals
// as the primary for the shared Elite/PowerGame page (/PGP2026 canonicalises to it).

export const SITE = {
  name: 'Rajasthan Royals Academy Melbourne',
  baseUrl: 'https://rramelbourne.com',
  // TODO: replace with a dedicated 1200x630 social share image; using the logo as a safe default.
  defaultOgImage: '/assets/MELBOURNE_OFFICIAL.png',
  locale: 'en_AU',
};

// Fallback for any public route not explicitly listed below.
export const DEFAULT_SEO = {
  title: 'Rajasthan Royals Academy Melbourne | Cricket Coaching',
  description:
    "Melbourne's Rajasthan Royals cricket academy — junior programs, elite squads, private coaching and holiday camps.",
};

// /elite-royals and /PGP2026 render the SAME PowerGame page; /elite-royals is the canonical primary.
const ELITE = {
  title: 'Power Pre-Season: Elite Cricket Melbourne | Rajasthan Royals',
  description:
    'An 8-week elite cricket pre-season in Melbourne — build power with bat and ball and start round one ahead. For rep, Premier and pathway players.',
};

export const PAGE_SEO = {
  // Spin Club — ANNOUNCED 26 Sep 2026 (Alex): it is in the nav, the home-page
  // modal and the ticker, so the noindex came off and the route went into the
  // sitemap. A page we promote to every visitor should not be hidden from search.
  '/spin-club': {
    title: 'Spin Bowling Coaching Melbourne | Royals Spin Club',
    description:
      'A Wednesday night club for spin bowlers aged 10 to 25, at Mickleham and Cranbourne North. Run by Rajasthan Royals Academy Melbourne. Sign up one night at a time.',
  },
  // Junior sessions with Siddhartha Lahiri: Cranbourne North Sun 4 Oct and
  // Mickleham Mon 5 Oct 2026 (src/components/sid-juniors). Linked from the
  // all-families email, so the card matters when a parent forwards it:
  // scripts/prerender-seo.mjs bakes these tags into dist/sid-juniors/index.html.
  // Ages, dates and price are confirmed. Sid is the guest coach, and his
  // attendance is "scheduled", never certain, as everywhere on the page. The
  // first sentence carries the facts, so a truncated snippet still has them.
  '/sid-juniors': {
    title: 'Junior Sessions with Siddhartha Lahiri | Royals Academy',
    description:
      'Junior coaching for players aged 8 to 16 at Cranbourne North (Sun 4 Oct, 1:00–2:30pm) and Mickleham (Mon 5 Oct, 4:30–5:30pm), $30 a session. Siddhartha Lahiri, Head of International Player Development and Performance Coach at the Rajasthan Royals, is scheduled as guest coach at both.',
    ogImage: '/assets/performance-squads/sid-lahiri-coaching-2026.jpg',
  },
  '/': {
    title: 'Rajasthan Royals Academy Melbourne | Cricket Coaching',
    description:
      "Melbourne's Rajasthan Royals cricket academy — junior programs, Performance Squads, private coaching and holiday camps in North and South-East Melbourne.",
  },
  // REVIEW 16 Dec 2026 — Term 4 facts in the description. Prerendered by
  // scripts/prerender-seo.mjs so shared links get a preview card.
  '/junior-royals': {
    title: 'Junior Cricket Coaching Melbourne | Rajasthan Royals',
    description:
      'Junior Royals Term 4: weekly cricket coaching for ages 7–12, Wednesdays 6–8pm, 28 Oct – 16 Dec, at Mickleham and Cranbourne North, Melbourne. Register your interest.',
  },
  '/elite-royals': { ...ELITE },
  '/PGP2026': { ...ELITE, canonical: '/elite-royals' },
  '/mickleham': {
    title: 'Private Cricket Coaching Melbourne | Rajasthan Royals',
    description:
      '1-to-1 and small-group private cricket coaching in Melbourne (Mickleham). Personalised batting, bowling and fielding with Royals coaches.',
  },
  '/junior-royals-holiday': {
    title: 'Holiday Cricket Programs Melbourne | Rajasthan Royals',
    description:
      'School-holiday cricket camps in Melbourne — skills, games and fun for young cricketers, run by Rajasthan Royals Academy.',
  },
  '/power-game-masterclass': {
    title: 'Power Hitting Masterclass Melbourne | Rajasthan Royals',
    description:
      'A two-session power-hitting masterclass in Melbourne for cricketers aged 14 and up — mechanics, bat swing, video analysis and exit velocity testing.',
    noindex: true,
  },
  // Private link, handed out by Alex to current Academy players who cannot make a
  // trial date. Deliberately NOT in the sitemap and not linked from any page, and
  // noindex so it stays out of search results if the address ever gets shared.
  // The Performance Squads' permanent landing page (Alex, 2 October 2026):
  // trial dates, the program and membership. Public and indexed. Kept generic
  // on purpose — no dates — because the trial dates on the page change.
  // scripts/prerender-seo.mjs bakes these tags into dist/performance-squads/index.html.
  '/performance-squads': {
    title: 'Cricket Performance Squads Melbourne | Rajasthan Royals',
    description:
      'Rajasthan Royals Academy Performance Squads for players 10 to 25 in North and South-East Melbourne. Weekly training, T20 matches, trial dates, membership.',
    ogImage: '/assets/performance-squads/selected-player-fist-pump.png',
  },
  // It must not be discoverable: it is a no-fee route into the squads sitting
  // beside a paid one, so anyone finding it organically would skip the trial fee.
  // Deliberately NOT added to robots.txt — that file is public, so listing the
  // path there would advertise the very URL we are trying to keep quiet.
  '/performance-squads/interest': {
    title: "Can't Make a Trial? | Performance Squads | Rajasthan Royals Academy",
    description:
      'For current Rajasthan Royals Academy players who cannot attend a September Performance Squads trial.',
    noindex: true,
  },
  // Open age T20 trials at Cranbourne North and Mickleham, headlined by
  // Siddhartha Lahiri, Head of International Player Development and Performance
  // Coach at the Rajasthan Royals — both roles, in the same words as the page and
  // the posters (Alex, 27 September 2026). PUBLIC AND PROMOTED, so no noindex here: the
  // whole point is that it is found and shared. Copy is the source of truth in
  // src/components/open-age-trial/openAgeData.js (SEO) and mirrored here.
  // These tags reach a social crawler ONLY because scripts/prerender-seo.mjs
  // bakes this route's head into dist/performance-squads-open-trial/index.html at build time.
  // RouteSeo alone runs in JavaScript, which no crawler executes.
  // NOTE: the Sid photo is portrait (900x1349) and social cards are wide, so it
  // crops. Swap ogImage for a 1200x630 crop when one exists.
  // "is coming to", never "is at" — his attendance is scheduled, not certain,
  // and the page hedges it in four places. The card must not out-promise it.
  // Sid is coming to BOTH sessions (Alex, 26 September 2026).
  '/performance-squads-open-trial': {
    title: 'Open Age T20 Trials, Mickleham & Cranbourne North | Royals',
    description:
      'Open age T20 trials, players 16 to 25. Mickleham Mon 5 Oct, 5:30 PM, $30 a session (Cranbourne North Sun 4 Oct is full). Siddhartha Lahiri, Head of International Player Development and Performance Coach at the Rajasthan Royals, is coming to both.',
    ogImage: '/assets/performance-squads/sid-lahiri-riyan-parag.jpg',
  },
  '/coaches': {
    title: 'Our Cricket Coaches | Rajasthan Royals Academy',
    description:
      'Meet the Rajasthan Royals Academy Melbourne coaching team — experienced, accredited coaches developing players The Royals Way.',
  },
  '/academy-shop': {
    title: 'Cricket Academy Shop | Rajasthan Royals Melbourne',
    description:
      'The official Rajasthan Royals Academy Melbourne shop — training kit, playing uniform and academy merchandise.',
  },
  '/coaching-opportunities': {
    title: 'Cricket Coaching Jobs Melbourne | Rajasthan Royals',
    description:
      "Coach at one of Australia's most progressive cricket academies. Explore coaching opportunities with Rajasthan Royals Academy Melbourne.",
  },
  '/reviews': {
    title: 'Reviews | Rajasthan Royals Academy Melbourne',
    description:
      'What Melbourne families say about Rajasthan Royals Academy — read reviews from our cricket coaching community.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Rajasthan Royals Academy Melbourne',
    description:
      'How Rajasthan Royals Academy Melbourne collects, uses and protects your personal information.',
  },
  '/terms-conditions': {
    title: 'Terms & Conditions | Rajasthan Royals Academy',
    description:
      'The terms and conditions for using the Rajasthan Royals Academy Melbourne website and programs.',
  },
};
