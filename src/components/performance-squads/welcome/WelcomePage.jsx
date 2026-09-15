import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Trophy, Wallet, ShoppingBag, KeyRound, Mail, Sparkles, Users, ShieldCheck } from 'lucide-react';
import Navbar from '../../Navbar';
import Footer from '../../Footer';
import usePageAnalytics from '../../../hooks/usePageAnalytics';
import { fadeUp, scrollTo } from '../shared';
import { WELCOME, SID, PLAYER_IMAGE, HALLA_BOL, getMissingDetails } from './welcomeConfig';
import { Pending, Eyebrow, Heading, Card, Bullets } from './welcomeShared';
import WelcomeConfirmForm from './WelcomeConfirmForm';

const MotionDiv = motion.div;

// ─────────────────────────────────────────────────────────────
// PERFORMANCE SQUAD WELCOME — /performance-squads/welcome
// HIDDEN PAGE: not linked from nav/homepage/sitemap, noindex.
//
// ONE generic page for every selected player. The player tells us their
// region in the confirm form. Benefits, pricing and membership wording follow
// the Performance Squads Membership Overview (see ./welcomeConfig.js).
// ─────────────────────────────────────────────────────────────

const SECTIONS = ['hero', 'steps', 'welcome', 'membership', 'pricing', 'season', 'fixtures', 'september-games', 'training', 'sid', 'confirm', 'kit', 'portal'];

const useNoIndex = (title) => {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = title;
        let meta = document.head.querySelector('meta[name="robots"]');
        const created = !meta;
        const previous = meta ? meta.getAttribute('content') : null;
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'robots');
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', 'noindex,nofollow');
        return () => {
            if (created) meta.remove();
            else if (previous !== null) meta.setAttribute('content', previous);
        };
    }, [title]);
};

const IconTitle = ({ icon, children }) => {
    const Icon = icon;
    return (
        <div className="flex items-center gap-3 mb-5">
            <Icon aria-hidden="true" className="w-6 h-6 text-rr-pink shrink-0" strokeWidth={2} />
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wide">{children}</h3>
        </div>
    );
};

const Step = ({ n, title, children, linkLabel, target }) => (
    <li className="bg-white/5 border border-white/12 rounded-2xl p-6 flex flex-col">
        <span aria-hidden="true" className="w-10 h-10 rounded-full bg-rr-pink text-white font-black text-lg flex items-center justify-center mb-4">
            {n}
        </span>
        <h3 className="text-xl font-black uppercase tracking-wide mb-2">
            <span className="sr-only">Step {n}: </span>{title}
        </h3>
        <p className="text-white/80 text-base font-medium leading-relaxed">{children}</p>
        {target && (
            <button
                type="button"
                onClick={() => scrollTo(target)}
                className="mt-auto pt-5 self-start inline-flex items-center gap-2 text-rr-light-pink hover:text-white font-black uppercase tracking-wider text-sm transition-colors"
            >
                {linkLabel} <ArrowRight className="w-4 h-4" />
            </button>
        )}
    </li>
);

// Training and events only. Match days live in the fixture list.
const buildTimeline = (c) => {
    const { firstTraining, sidSessions } = c.season;
    return [
        { year: firstTraining.year, when: c.confirmBy, whenPending: 'Date to be confirmed', what: 'Last day to confirm your place', highlight: true },
        { year: firstTraining.year, when: firstTraining.date, what: 'First squad training at your home centre', detail: firstTraining.time, detailPending: 'Time to be confirmed' },
        { year: sidSessions.year, when: sidSessions.when, what: 'Squad sessions with Sid Lahiri', detail: 'We will invite players to meet Sid' },
    ];
};

const Timeline = ({ rows }) => {
    const years = [...new Set(rows.map((r) => r.year))];
    return (
        <div className="space-y-8">
            {years.map((year) => (
                <div key={year}>
                    <p className="text-sm font-black tracking-[0.2em] text-white/55 mb-4">{year}</p>
                    <ol className="border-l-2 border-white/15 ml-2">
                        {rows.filter((r) => r.year === year).map((r) => (
                            <li key={`${r.when}-${r.what}`} className="relative ml-6 pb-7 last:pb-0">
                                <span
                                    aria-hidden="true"
                                    className={`absolute -left-[33px] top-1 w-4 h-4 rounded-full border-2 border-rr-pink ${r.highlight ? 'bg-rr-pink' : 'bg-rr-dark'}`}
                                />
                                <p className="text-lg sm:text-xl font-black uppercase tracking-wide leading-snug">
                                    {r.when || <Pending>{r.whenPending}</Pending>}
                                </p>
                                <p className="text-white/85 text-base font-medium leading-relaxed mt-1">{r.what}</p>
                                {r.detail ? (
                                    <p className="text-white/60 text-[15px] font-medium leading-relaxed mt-0.5">{r.detail}</p>
                                ) : r.detailPending ? (
                                    <p className="mt-1.5"><Pending>{r.detailPending}</Pending></p>
                                ) : null}
                            </li>
                        ))}
                    </ol>
                </div>
            ))}
        </div>
    );
};

const FixtureList = ({ fixtures }) => (
    <ol className="divide-y divide-white/10">
        {fixtures.map((m, i) => (
            <li key={m.date} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                <span aria-hidden="true" className="w-9 h-9 rounded-full bg-rr-pink/15 border border-rr-pink/50 text-rr-light-pink font-black text-sm flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                </span>
                <div className="min-w-0">
                    <p className="text-lg sm:text-xl font-black uppercase tracking-wide leading-snug">{m.date} <span className="text-white/45 font-bold">{m.year}</span></p>
                    <p className="text-white/85 text-base font-medium leading-relaxed mt-0.5">
                        {m.first ? 'Round 1 · Power League' : 'Power League match day'}
                    </p>
                    {m.first && (m.venueAndTime
                        ? <p className="text-white/60 text-[15px] font-medium mt-0.5">{m.venueAndTime}</p>
                        : <p className="mt-1.5"><Pending>Venue and time to be confirmed</Pending></p>)}
                    {m.note && <p className="text-white/60 text-[15px] font-medium mt-0.5">{m.note}</p>}
                </div>
            </li>
        ))}
    </ol>
);

const PriceCard = ({ label, amount, per, note, accent }) => (
    <div className={`rounded-2xl p-6 sm:p-7 border ${accent ? 'bg-rr-pink/10 border-rr-pink/50' : 'bg-white/5 border-white/12'}`}>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-rr-light-pink mb-3">{label}</p>
        <p className="text-4xl sm:text-5xl font-black leading-none mb-3">
            {amount}
            {per && <span className="text-lg sm:text-xl font-bold text-white/60"> / {per}</span>}
        </p>
        <p className="text-white/75 text-[15px] font-medium leading-relaxed">{note}</p>
    </div>
);

const WelcomePage = () => {
    const c = WELCOME;

    usePageAnalytics('/performance-squads/welcome', { sections: SECTIONS });
    useNoIndex('Welcome to the Performance Squad program | Rajasthan Royals Academy Melbourne');

    const missing = getMissingDetails(c);
    const isDraft = missing.length > 0;
    const { season, septemberGames, letter, pricing, benefits, squadDna, selection, memberPricing } = c;
    const confirmBy = c.confirmBy || <Pending>date to be confirmed</Pending>;

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans flex flex-col selection:bg-rr-pink selection:text-white">
            <Navbar variant="performance-squads-welcome" />

            <main className="flex-1 w-full overflow-hidden">
                {/* ── HERO ── Navbar is fixed and overlays the page; the top padding clears it. */}
                {/* Gradient via the theme variable: the bg-gradient-rr class compiles to no CSS
                    in Tailwind v4 (--image-* is not a theme namespace). */}
                <section
                    id="hero"
                    className="relative px-5 pt-24 pb-0 sm:pt-36 overflow-hidden"
                    style={{ backgroundImage: 'var(--image-gradient-rr)' }}
                >
                    {/* Royals rampant lion, white stroke — one of the three approved lion
                        variants (opacity can vary). Sits behind the player artwork. */}
                    <img
                        src="/assets/rr-rampant-lion-white.png"
                        alt=""
                        aria-hidden="true"
                        className="pointer-events-none select-none absolute z-0 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-[8%] bottom-[-6%] lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 h-[62%] sm:h-[70%] lg:h-[88%] w-auto max-w-none opacity-20 lg:opacity-30"
                    />
                    <div className="relative max-w-6xl mx-auto">
                        {isDraft && (
                            <div role="note" className="mb-8 rounded-xl bg-amber-300 text-rr-dark px-4 py-3 text-left text-sm font-bold leading-relaxed max-w-3xl">
                                DRAFT FOR REVIEW. Not ready to send to families. Still to confirm: {missing.join(', ')}.
                            </div>
                        )}
                        <div className="grid lg:grid-cols-[1fr_380px] gap-4 lg:gap-6 items-end">
                            <MotionDiv initial="hidden" animate="visible" variants={fadeUp} custom={0} className="pb-6 sm:pb-10 lg:pb-24 text-center lg:text-left">
                                <img
                                    src="/assets/MELBOURNE_OFFICIAL.png"
                                    alt="Rajasthan Royals Academy Melbourne"
                                    className="h-20 sm:h-24 w-auto mx-auto lg:mx-0 mb-8 brightness-0 invert"
                                />
                                <p className="text-[11px] sm:text-sm font-black uppercase tracking-[0.16em] sm:tracking-[0.2em] text-white mb-4">
                                    Performance Squad · Season 2026/27
                                </p>
                                {/* Two elements on purpose: "Congratulations!" is one long word and
                                    runs off a phone screen at headline size. */}
                                <p className="text-[22px] sm:text-4xl font-black uppercase tracking-wide leading-tight mb-2">
                                    Congratulations!
                                </p>
                                <h1 className="text-[42px] sm:text-6xl lg:text-7xl font-black uppercase leading-[0.98] mb-6">
                                    You have<br className="hidden sm:block" /> been selected
                                </h1>
                                <p className="text-white text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-4">
                                    You are one of the players selected for the Rajasthan Royals Academy Melbourne
                                    Performance Squad. This is the first season of the program. We are very proud of it,
                                    and excited to start it with you.
                                </p>
                                <p className="text-white/85 text-base sm:text-lg font-black uppercase tracking-wide mb-8">
                                    Train as a squad, play as a squad — the Royals way.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => scrollTo('confirm')}
                                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-rr-dark font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                                >
                                    Confirm your place <ArrowRight className="w-4 h-4" />
                                </button>
                                <p className="mt-6 text-white text-base font-bold leading-relaxed max-w-xl mx-auto lg:mx-0">
                                    {c.confirmBy
                                        ? <>Places go to the first players who confirm, so please confirm your place by {c.confirmBy}.</>
                                        : <>Please confirm your place by {confirmBy}</>}
                                </p>
                            </MotionDiv>

                            {/* Selected-player artwork: sits on the hero floor, bleeds off the bottom edge. */}
                            <MotionDiv
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
                                className="relative flex justify-center lg:justify-end"
                            >
                                <img
                                    src={PLAYER_IMAGE}
                                    alt="A Rajasthan Royals player celebrating with a double fist pump"
                                    className="w-[300px] sm:w-[340px] lg:w-[380px] h-auto drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)] -mb-3"
                                />
                            </MotionDiv>
                        </div>
                    </div>
                </section>

                {/* ── WHAT TO DO NOW ── */}
                <section id="steps" className="px-5 py-14 sm:py-20 scroll-mt-28 lg:scroll-mt-32">
                    <div className="max-w-5xl mx-auto">
                        <Heading eyebrow="What to do now" title="3 things to do" />
                        <ol className="grid gap-4 md:grid-cols-3">
                            <Step n={1} title="Confirm your place" linkLabel="Go to step 1" target="confirm">
                                Do it by {confirmBy}. Tell us the region you were selected in, then pay the{' '}
                                {pricing.joiningFee.amount} Joining Fee to lock in your place.
                            </Step>
                            <Step n={2} title="Order your kit" linkLabel="See what you need" target="kit">
                                Use the kit link on this page. It has the price for Performance Squad players.
                            </Step>
                            <Step n={3} title="Set up the player portal">
                                We will send you a login for our player portal. Setting it up takes about 10 minutes.
                            </Step>
                        </ol>
                    </div>
                </section>

                {/* ── WELCOME LETTER ── */}
                {letter && (
                    <section id="welcome" className="px-5 py-14 sm:py-20 bg-white/[0.02] scroll-mt-28 lg:scroll-mt-32">
                        <div className="max-w-3xl mx-auto">
                            <Heading eyebrow="Welcome" title={`A message from ${letter.from}`} />
                            <Card>
                                <div className="space-y-5">
                                    {letter.paragraphs.map((p) => (
                                        <p key={p.slice(0, 40)} className="text-white/85 text-base sm:text-lg font-medium leading-relaxed">{p}</p>
                                    ))}
                                </div>
                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <p className="text-lg font-black uppercase tracking-wide">{letter.from}</p>
                                    <p className="text-white/65 text-base font-medium">{letter.title}</p>
                                    <p className="text-white/65 text-base font-medium">Rajasthan Royals Academy Melbourne</p>
                                </div>
                            </Card>
                        </div>
                    </section>
                )}

                {/* ── MEMBERSHIP BENEFITS ── Wording follows the Membership Overview 01–06. */}
                <section id="membership" className="px-5 py-14 sm:py-20 scroll-mt-28 lg:scroll-mt-32">
                    <div className="max-w-5xl mx-auto">
                        <Heading
                            eyebrow="Your membership"
                            title="What your squad place includes"
                            sub="Year round. Cancel anytime."
                        />
                        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {benefits.map((b, i) => (
                                <li key={b.title} className="bg-white/5 border border-white/12 rounded-2xl p-6">
                                    <span className="block text-rr-light-pink font-black text-sm tracking-[0.2em] mb-3">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <h3 className="text-lg font-black uppercase tracking-wide leading-snug mb-2">{b.title}</h3>
                                    <p className="text-white/80 text-[15px] font-medium leading-relaxed">{b.body}</p>
                                </li>
                            ))}
                        </ol>
                        <div className="grid gap-4 md:grid-cols-2 mt-4">
                            <Card>
                                <IconTitle icon={Users}>Squad DNA</IconTitle>
                                <p className="text-4xl sm:text-5xl font-black leading-none mb-3">
                                    {squadDna.ages} <span className="text-base font-bold text-white/60 tracking-wider uppercase">years old</span>
                                </p>
                                <p className="text-white/80 text-[15px] font-medium leading-relaxed">{squadDna.body}</p>
                                <p className="text-rr-light-pink font-black text-[15px] mt-2">{squadDna.highlight}</p>
                            </Card>
                            <Card>
                                <IconTitle icon={ShieldCheck}>Selection eligibility</IconTitle>
                                <p className="text-white/85 text-base font-medium leading-relaxed">{selection.body}</p>
                                <p className="text-white/60 text-[15px] font-medium leading-relaxed mt-3">{selection.note}</p>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* ── PRICING ── First intake pricing from the Membership Overview. */}
                <section id="pricing" className="px-5 py-14 sm:py-20 bg-white/[0.02] scroll-mt-28 lg:scroll-mt-32">
                    <div className="max-w-5xl mx-auto">
                        <Heading eyebrow="First intake pricing" title="Membership fees" />
                        <div className="grid gap-4 md:grid-cols-3">
                            <PriceCard label="Joining fee" amount={pricing.joiningFee.amount} note={pricing.joiningFee.note} accent />
                            <PriceCard label="Squad fee" amount={pricing.squadFee.amount} per={pricing.squadFee.per} note={pricing.squadFee.note} />
                            <PriceCard label="Match fees" amount={pricing.matchFees.amount} note={pricing.matchFees.note} />
                        </div>
                        <div className="mt-4 rounded-2xl border-l-4 border-rr-pink bg-white/5 p-6 sm:p-8">
                            <p className="text-xl sm:text-2xl font-black leading-snug mb-2">{memberPricing.lead}</p>
                            <p className="text-white/80 text-base font-medium leading-relaxed">{memberPricing.body}</p>
                            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mt-6">
                                {memberPricing.programs.map((p) => (
                                    <li key={p.name} className="border-t border-white/15 pt-3">
                                        <p className="font-black text-base leading-snug">{p.name}</p>
                                        <p className="text-rr-light-pink text-sm font-bold mt-1">{p.when}</p>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-white/60 text-sm font-medium leading-relaxed mt-6">
                                {memberPricing.note} {pricing.cancel}
                            </p>
                        </div>
                    </div>
                </section>

                {/* ── SEASON TIMELINE ── Training and events only; matches are the fixture list. */}
                <section id="season" className="px-5 py-14 sm:py-20 scroll-mt-28 lg:scroll-mt-32">
                    <div className="max-w-3xl mx-auto">
                        <Heading eyebrow="Your season" title="Training and key dates" />
                        <Card>
                            <Timeline rows={buildTimeline(c)} />
                        </Card>
                    </div>
                </section>

                {/* ── POWER LEAGUE FIXTURES ── */}
                <section id="fixtures" className="px-5 pb-14 sm:pb-20 scroll-mt-28 lg:scroll-mt-32">
                    <div className="max-w-3xl mx-auto">
                        <Card className="border-rr-pink/40">
                            <div className="mb-7">
                                <Eyebrow className="mb-4">Match days</Eyebrow>
                                <img
                                    src="/assets/power-league-logo-rra.png"
                                    alt="Power League"
                                    className="h-14 sm:h-16 w-auto mb-3"
                                />
                                <h2 className="text-2xl sm:text-3xl font-black uppercase leading-tight">Fixtures · Season 2026/27</h2>
                            </div>
                            <FixtureList fixtures={c.fixtures} />
                            <div className="mt-7 flex items-start gap-3 rounded-xl bg-rr-pink/15 border border-rr-pink/50 p-4 sm:p-5">
                                <Sparkles aria-hidden="true" className="w-5 h-5 text-rr-light-pink shrink-0 mt-0.5" />
                                <p className="text-white font-bold text-[15px] sm:text-base leading-relaxed">{c.moreFixtures}</p>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* ── SEPTEMBER GAMES ── Deliberately outside the fixture list: offer only. */}
                {septemberGames && (
                    <section id="september-games" className="px-5 pb-14 sm:pb-20 scroll-mt-28 lg:scroll-mt-32">
                        <div className="max-w-3xl mx-auto rounded-2xl border-2 border-rr-light-pink/60 bg-rr-pink/10 p-6 sm:p-8">
                            <h2 className="text-2xl sm:text-3xl font-black uppercase leading-tight mb-5">
                                September games: only if you get an offer
                            </h2>
                            <Bullets items={[
                                `${septemberGames.dates}: T20 matches at ${septemberGames.venue}.`,
                                <>Players who confirm their place early <strong className="text-white font-black">may</strong> get an offer to play, at a special price.</>,
                                'Only players with an offer can play. If you get an offer, we will send it to you separately.',
                                <>Confirm your place by {confirmBy} to be considered.</>,
                            ]} />
                        </div>
                    </section>
                )}

                {/* ── TRAINING, MATCHES, MATCH FEES ── */}
                <section id="training" className="px-5 py-14 sm:py-20 bg-white/[0.02] scroll-mt-28 lg:scroll-mt-32">
                    <div className="max-w-5xl mx-auto">
                        <Heading eyebrow="How the program works" title="Training and matches" />
                        <div className="grid gap-5 md:grid-cols-2">
                            <Card>
                                <IconTitle icon={Target}>How we train</IconTitle>
                                <Bullets items={[
                                    'Our training is squad-based and player-driven. Players lead their own learning, and our coaches guide them.',
                                    'Each session has 90 minutes of focused work on our training system. It is also flexible, so players can work on the parts of their game that matter most to them.',
                                    'In a lot of club coaching, the head coach decides everything. Young players do not get to learn how to train, how to improve and how to think for themselves.',
                                ]} />
                            </Card>
                            <Card>
                                <IconTitle icon={Trophy}>Matches</IconTitle>
                                <Bullets items={[
                                    'Our first match is early, so we can see how everyone is playing.',
                                    'Play 5–10 T20 match days across the season, circa. average 1 a month from September to April. Performance dependant.',
                                    'Squad players are eligible for selection in Power League and External Showcase matches.',
                                    'Selection is at the coaching staff\'s discretion. Not every player plays every game. We will tell you the team before each match.',
                                ]} />
                            </Card>
                        </div>
                        <Card className="mt-5">
                            <IconTitle icon={Wallet}>Match fees</IconTitle>
                            <div className="space-y-3 text-white/85 text-base font-medium leading-relaxed">
                                <p>You pay a match fee for each match you play. It is set for each fixture and covers standard match day costs. This is separate from the Joining Fee and the weekly Squad Fee.</p>
                                <p>The fee depends on the pitch: turf (grass) or synthetic (fake grass).</p>
                                <p className="text-white font-bold">All players must remain financial to be eligible for selection.</p>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* ── SID LAHIRI ── Not every player is invited: "We will invite players to meet Sid", never "every player". */}
                <section id="sid" className="px-5 py-14 sm:py-20 scroll-mt-28 lg:scroll-mt-32">
                    <div className="max-w-4xl mx-auto">
                        <Card className="grid gap-6 sm:gap-8 sm:grid-cols-[200px_1fr] items-center">
                            <img
                                src={SID.photo}
                                alt={SID.name}
                                loading="lazy"
                                className="w-40 h-40 sm:w-[200px] sm:h-[200px] rounded-2xl object-cover object-top mx-auto"
                            />
                            <div>
                                <Eyebrow>Squad sessions with {SID.name}</Eyebrow>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase leading-tight mb-4">
                                    We will invite players to meet Sid
                                </h2>
                                <div className="space-y-3 text-white/85 text-base font-medium leading-relaxed">
                                    <p>He is the Head of International Player Development at the Rajasthan Royals.</p>
                                    <p>He is also a performance coach for the Rajasthan Royals team in the IPL.</p>
                                    <p>He has worked with Yashasvi Jaiswal, Riyan Parag and Vaibhav Sooryavanshi.</p>
                                    <p>Other Royals and guest coaches and players will join from time to time, online and in person.</p>
                                    <p className="text-white/65">When: {season.sidSessions.when}.</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* ── STEP 1: CONFIRM ── */}
                <section id="confirm" className="px-5 py-14 sm:py-20 bg-white/[0.02] scroll-mt-28 lg:scroll-mt-32">
                    <div className="max-w-2xl mx-auto">
                        <Heading
                            eyebrow="Step 1"
                            title="Confirm your place"
                            sub={<>Please do this by {confirmBy}. Tell us the region you were selected in, fill in the player&apos;s details and agree to the 5 items below.</>}
                        />
                        <WelcomeConfirmForm config={c} isDraft={isDraft} />
                    </div>
                </section>

                {/* ── STEP 2: KIT ── */}
                <section id="kit" className="px-5 py-14 sm:py-20 scroll-mt-28 lg:scroll-mt-32">
                    <div className="max-w-2xl mx-auto">
                        <Heading
                            eyebrow="Step 2"
                            title="Order your kit"
                            sub="Please use the kit link below, not the Academy Shop. This link has the price for Performance Squad players."
                        />
                        <Card>
                            <IconTitle icon={ShoppingBag}>You need</IconTitle>
                            {c.kitItems.length
                                ? <Bullets items={c.kitItems} />
                                : <p><Pending>Kit list to be confirmed</Pending></p>}
                            {c.kitOrderLink ? (
                                // Same tab on purpose: in-app browsers (Instagram especially) silently block new tabs.
                                <a
                                    href={c.kitOrderLink}
                                    className="mt-7 w-full sm:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-[13px] sm:text-sm rounded-full px-5 sm:px-8 py-4 transition-colors"
                                >
                                    Order your kit <ArrowRight className="w-4 h-4" />
                                </a>
                            ) : (
                                <p className="mt-7"><Pending>Kit order link to be confirmed</Pending></p>
                            )}
                            <p className="text-white/55 text-sm font-medium mt-3">Payments are processed by Stripe.</p>
                        </Card>
                    </div>
                </section>

                {/* ── STEP 3: PORTAL ── */}
                <section id="portal" className="px-5 pb-14 sm:pb-20 scroll-mt-28 lg:scroll-mt-32">
                    <div className="max-w-2xl mx-auto">
                        <Card className="text-center">
                            <KeyRound aria-hidden="true" className="w-8 h-8 text-rr-pink mx-auto mb-4" />
                            <Eyebrow>Step 3</Eyebrow>
                            <h2 className="text-2xl sm:text-3xl font-black uppercase leading-tight mb-3">Your player portal</h2>
                            <p className="text-white/85 text-base font-medium leading-relaxed">
                                We will send you a login for our player portal. Setting it up takes about 10 minutes.
                            </p>
                        </Card>
                    </div>
                </section>

                {/* ── CLOSE ── Royals sign-off: brand gradient, stroke lion, Halla Bol. */}
                <section
                    className="relative px-5 py-20 sm:py-28 text-center overflow-hidden"
                    style={{ backgroundImage: 'var(--image-gradient-rr)' }}
                >
                    <img
                        src="/assets/rr-rampant-lion-white.png"
                        alt=""
                        aria-hidden="true"
                        className="pointer-events-none select-none absolute z-0 left-[-18%] sm:left-[-2%] lg:left-[6%] top-1/2 -translate-y-1/2 h-[120%] w-auto max-w-none opacity-20 lg:opacity-30"
                    />
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <img
                            src={HALLA_BOL}
                            alt="Halla Bol!"
                            className="h-24 sm:h-32 w-auto mx-auto mb-8 drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]"
                        />
                        <p className="text-2xl sm:text-4xl font-black uppercase tracking-wide">
                            See you on {season.firstTraining.date}!
                        </p>
                        <p className="mt-5 text-white/90 text-base font-medium">
                            <Mail aria-hidden="true" className="inline w-4 h-4 mr-2 -mt-0.5" />
                            Any questions? Email{' '}
                            <a href={`mailto:${c.contactEmail}`} className="text-white underline hover:text-white/80">{c.contactEmail}</a>
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default WelcomePage;
