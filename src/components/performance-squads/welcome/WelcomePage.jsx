import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Trophy, Wallet, ShoppingBag, KeyRound, Mail } from 'lucide-react';
import Navbar from '../../Navbar';
import Footer from '../../Footer';
import usePageAnalytics from '../../../hooks/usePageAnalytics';
import { fadeUp, scrollTo } from '../shared';
import { getWelcomeCentre, getMissingDetails, SID } from './welcomeConfig';
import { Pending, Eyebrow, Heading, Card, Bullets } from './welcomeShared';
import WelcomeConfirmForm from './WelcomeConfirmForm';

const MotionDiv = motion.div;

// ─────────────────────────────────────────────────────────────
// PERFORMANCE SQUAD WELCOME — /performance-squads/welcome[/:centre]
// HIDDEN PAGE: not linked from nav/homepage/sitemap, noindex.
//
// Selected players arrive from the "Confirm your place" link in their welcome
// email. The copy follows that approved email, so the page and the email say
// the same things. Everything centre-specific lives in ./welcomeConfig.js.
// ─────────────────────────────────────────────────────────────

const SECTIONS = ['hero', 'steps', 'welcome', 'season', 'september-games', 'training', 'sid', 'confirm', 'kit', 'portal'];

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

const buildTimeline = (c) => {
    const { firstTraining, sidSessions, matchDays } = c.season;
    return [
        { year: firstTraining.year, when: c.confirmBy, whenPending: 'Date to be confirmed', what: 'Last day to confirm your place', highlight: true },
        { year: firstTraining.year, when: firstTraining.date, what: `First training at ${c.venue}`, detail: firstTraining.time, detailPending: 'Time to be confirmed' },
        { year: sidSessions.year, when: sidSessions.when, what: 'Sessions with Sid Lahiri', detail: 'We will invite players to meet Sid' },
        ...matchDays.map((m) => (m.first
            ? { year: m.year, when: m.date, what: 'First match day', detail: m.venueAndTime, detailPending: 'Venue and time to be confirmed' }
            : { year: m.year, when: m.date, what: 'Match day', detail: m.note || null })),
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

const NotReady = () => (
    <div className="min-h-screen bg-rr-dark text-white font-sans flex flex-col">
        <Navbar variant="performance-squads-welcome" />
        <main className="flex-1 px-5 pt-36 pb-24">
            <div className="max-w-xl mx-auto text-center">
                <h1 className="text-3xl sm:text-4xl font-black uppercase mb-4">This page is not ready yet</h1>
                <p className="text-white/75 text-base font-medium leading-relaxed">
                    Please use the link in your welcome email. Any questions? Email{' '}
                    <a href="mailto:info@rramelbourne.com" className="text-rr-light-pink underline hover:text-white">info@rramelbourne.com</a>
                </p>
            </div>
        </main>
        <Footer />
    </div>
);

const WelcomePage = () => {
    const { centre: centreParam } = useParams();
    const c = getWelcomeCentre(centreParam);

    usePageAnalytics(`/performance-squads/welcome/${c ? c.slug : 'unknown'}`, { sections: SECTIONS });
    useNoIndex(c
        ? `Welcome to the Performance Squad program | ${c.centreName} | Rajasthan Royals Academy Melbourne`
        : 'Rajasthan Royals Academy Melbourne');

    if (!c) return <NotReady />;

    const missing = getMissingDetails(c);
    const isDraft = missing.length > 0;
    const { season, septemberGames, letter } = c;
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
                    className="px-5 pt-28 pb-16 sm:pt-36 sm:pb-24"
                    style={{ backgroundImage: 'var(--image-gradient-rr)' }}
                >
                    <div className="max-w-3xl mx-auto text-center">
                        {isDraft && (
                            <div role="note" className="mb-8 rounded-xl bg-amber-300 text-rr-dark px-4 py-3 text-left text-sm font-bold leading-relaxed">
                                DRAFT FOR REVIEW. Not ready to send to families. Still to confirm: {missing.join(', ')}.
                            </div>
                        )}
                        <MotionDiv initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                            <img
                                src="/assets/MELBOURNE_OFFICIAL.png"
                                alt="Rajasthan Royals Academy Melbourne"
                                className="h-20 sm:h-28 w-auto mx-auto mb-8 brightness-0 invert"
                            />
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-white mb-4">
                                Performance Squad program · {c.centreName}
                            </p>
                            {/* Two elements on purpose: "Congratulations!" is one long word and
                                runs off a phone screen at headline size. */}
                            <p className="text-[22px] sm:text-4xl font-black uppercase tracking-wide leading-tight mb-2">
                                Congratulations!
                            </p>
                            <h1 className="text-4xl sm:text-6xl font-black uppercase leading-[1.02] mb-6">
                                You have been selected
                            </h1>
                            <p className="text-white text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto mb-8">
                                You have been selected for the Rajasthan Royals Academy Performance Squad program
                                at {c.centreName}. This is the first season of the program. We are very proud of it,
                                and excited to start it with you.
                            </p>
                            <button
                                type="button"
                                onClick={() => scrollTo('confirm')}
                                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-rr-dark font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                            >
                                Confirm your place <ArrowRight className="w-4 h-4" />
                            </button>
                            <p className="mt-6 text-white text-base font-bold leading-relaxed max-w-xl mx-auto">
                                {c.confirmBy
                                    ? <>Places go to the first players who confirm, so please confirm your place by {c.confirmBy}.</>
                                    : <>Please confirm your place by {confirmBy}</>}
                            </p>
                        </MotionDiv>
                    </div>
                </section>

                {/* ── WHAT TO DO NOW ── */}
                <section id="steps" className="px-5 py-14 sm:py-20 scroll-mt-28 lg:scroll-mt-32">
                    <div className="max-w-5xl mx-auto">
                        <Heading eyebrow="What to do now" title="3 things to do" />
                        <ol className="grid gap-4 md:grid-cols-3">
                            <Step n={1} title="Confirm your place" linkLabel="Go to step 1" target="confirm">
                                Do it by {confirmBy}. The Registration Fee is{' '}
                                {c.registrationFee || <Pending>amount to be confirmed</Pending>}.
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

                {/* ── SEASON TIMELINE ── */}
                <section id="season" className="px-5 py-14 sm:py-20 scroll-mt-28 lg:scroll-mt-32">
                    <div className="max-w-3xl mx-auto">
                        <Heading eyebrow="Your season" title="Season timeline" sub="Every match day is a Sunday." />
                        <Card>
                            <Timeline rows={buildTimeline(c)} />
                        </Card>
                    </div>
                </section>

                {/* ── SEPTEMBER GAMES ── Deliberately outside the timeline: offer only. */}
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
                                    'Power League matches can be T20, T10 or 100-ball. Each player plays about 5 or 6 matches across the season.',
                                    'Players will also be invited to special exhibition and showcase matches against other teams.',
                                    'We will tell you the team before each match.',
                                ]} />
                            </Card>
                        </div>
                        <Card className="mt-5">
                            <IconTitle icon={Wallet}>Match fees</IconTitle>
                            <div className="space-y-3 text-white/85 text-base font-medium leading-relaxed">
                                <p>You pay a match fee for each match you play. This is separate from the Registration Fee.</p>
                                <p>The fee depends on the pitch: turf (grass) or synthetic (fake grass).</p>
                                <p className="text-white font-bold">Keep your match fees paid so you can be selected.</p>
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
                                <Eyebrow>Sessions with {SID.name}</Eyebrow>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase leading-tight mb-4">
                                    We will invite players to meet Sid
                                </h2>
                                <div className="space-y-3 text-white/85 text-base font-medium leading-relaxed">
                                    <p>He is the Head of International Player Development at the Rajasthan Royals.</p>
                                    <p>He is also a performance coach for the Rajasthan Royals team in the IPL.</p>
                                    <p>He has worked with Yashasvi Jaiswal, Riyan Parag and Vaibhav Sooryavanshi.</p>
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
                            sub={<>Please do this by {confirmBy}. Fill in the player&apos;s details and agree to the 5 items below.</>}
                        />
                        <WelcomeConfirmForm centre={c} isDraft={isDraft} />
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

                {/* ── CLOSE ── */}
                <section className="px-5 pb-20 sm:pb-28 text-center">
                    <p className="text-2xl sm:text-4xl font-black uppercase tracking-wide">
                        See you on {season.firstTraining.date}!
                    </p>
                    <p className="mt-5 text-white/75 text-base font-medium">
                        <Mail aria-hidden="true" className="inline w-4 h-4 mr-2 -mt-0.5" />
                        Any questions? Email{' '}
                        <a href={`mailto:${c.contactEmail}`} className="text-rr-light-pink underline hover:text-white">{c.contactEmail}</a>
                    </p>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default WelcomePage;
