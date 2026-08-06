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
  '/': {
    title: 'Rajasthan Royals Academy Melbourne | Cricket Coaching',
    description:
      "Melbourne's Rajasthan Royals cricket academy — junior programs, elite squads, private coaching and holiday camps across Mickleham, Hallam & Williamstown.",
  },
  '/junior-royals': {
    title: 'Junior Cricket Coaching Melbourne | Rajasthan Royals',
    description:
      'Junior cricket coaching in Melbourne that builds real skills and confidence — structured, fun and professional. Train with Rajasthan Royals Academy.',
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
