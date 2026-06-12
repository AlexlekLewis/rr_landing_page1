import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import HeroSection from './HeroSection';
import QuoteBlock from './QuoteBlock';
import VideoSection from './VideoSection';
import OverviewSection from './OverviewSection';
import FeaturesBenefits from './FeaturesBenefits';
import PricingSection from './PricingSection';
import CoachesSection from './CoachesSection';
import CentresSection from './CentresSection';
import AskThePlayers from './AskThePlayers';
import PartnerStack from './PartnerStack';
import UniformSizeGuideModal from './UniformSizeGuideModal';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import { MapPin, User, ClipboardList, Sparkles, ShieldCheck, AlertTriangle, Telescope, Zap, Flame, Clock, ListChecks, Ruler, Shirt } from 'lucide-react';

// The apply funnel renders inline in the #apply section so applicants never leave /PGP2026.
const ApplyFlow = React.lazy(() => import('./apply/ApplyFlow'));

// The application process — the real five steps a player moves through in the funnel
// below. Step 3 carries the honesty warning; step 4 is the offer / review fork.
import { ACTIVE_CENTRES as PG_ACTIVE_CENTRES, CENTRES as PG_CENTRES } from '../../lib/booking/squads';

// Venue list derives from the booking grid so this copy can never go stale.
const VENUE_LIST = (() => {
    const names = PG_ACTIVE_CENTRES.map((c) => c.suburb);
    const joined = names.length > 1 ? `${names.slice(0, -1).join(', ')} or ${names[names.length - 1]}` : names[0] || '';
    return PG_CENTRES.some((c) => c.comingSoon) ? `${joined}, with a new venue coming soon` : joined;
})();

const HOW_STEPS = [
    { Icon: MapPin, title: 'Choose your venue', sub: `Pick the centre that suits you — ${VENUE_LIST}.` },
    { Icon: User, title: 'Player details', sub: 'Who’s playing, and the best way to reach you.' },
    { Icon: ClipboardList, title: 'Playing history', sub: 'Tell us the highest level you’ve played in the last three years.', note: 'Honesty is required — applications may be rejected if false information is provided (refund less processing fees).' },
    { Icon: Sparkles, title: 'Get your offer', sub: 'Accept your squad offer and choose your time — or apply for a review / request a call for more information.' },
    { Icon: ShieldCheck, title: 'Secure your spot', sub: 'Lock in your place for the 8-week phase.' },
];

// The talent we're built to discover — examples of players the rep system can miss.
const DISCOVERY_EXAMPLES = [
    { Icon: Zap, label: 'A fast bowler who needs structure' },
    { Icon: Flame, label: 'A power hitter learning to play the future' },
];

// "How easy it is" reassurance pills above the steps.
const EASY_PILLS = [
    { Icon: Clock, label: '~3 minutes' },
    { Icon: ListChecks, label: '5 steps' },
    { Icon: ShieldCheck, label: 'No payment until confirmed' },
];

// Prepare your game — what players sharpen to be ready for the season (this is
// PRE-SEASON; lead on readiness, not just "skills added"). Written in the program's
// own voice (warm, aspirational, selection-focused; matched to PricingSection /
// OverviewSection, not AI house style). The week-by-week session plan — periodisation,
// drill progressions and the testing protocol — stays OFF the public page (that's the
// IP). Partner tools (Full Track, Str8 Bat, NeuroVision) are fine; Pricing lists them.
const DEVELOP_PILLARS = [
    { name: 'Power on demand', body: 'Learn to generate genuine power on demand, and reach for it the moment a game asks the question.' },
    { name: '360° scoring', body: 'Score all around the ground so you’re never tied down or bowled to a plan — finding the boundary in every direction.' },
    { name: 'Power under pressure', body: 'Hold your method when it matters most — the skills that win finals and put you on a selector’s radar.' },
];
const DEVELOP_TRACKS = [
    { who: 'Batters', body: 'Sharpen a complete 360° shot range, orthodox through to innovative, so you walk into round one ready to score against pace and spin alike.' },
    { who: 'Bowlers', body: 'Sharpen your bowling, seam or spin — a repeatable action, a stock ball you can trust and the variations to land your plans — ready to bowl with intent from round one.' },
];

// Do the maths — what an hour of coaching costs elsewhere vs here.
// Other-program figures are typical local offers (not named); ours derives from
// $989 across 8 weeks of 2-hour sessions = 16 coaching hours.
const HOUR_MATHS = [
    { who: 'Other programs', price: '$900', detail: '6 weeks × 1.5 hrs = 9 hrs of coaching', perHour: '$100', us: false },
    { who: 'Other programs', price: '$800', detail: '7 weeks × 1 hr = 7 hrs of coaching', perHour: '$114', us: false },
    { who: 'The Power Game', price: '$989', detail: '8 weeks × 2 hrs = 16 hrs of coaching', perHour: '$62', us: true },
];

const SECTIONS = [
    'hero',
    'quote-1',
    'overview',
    'who-its-for',
    'quote-vaibhav',
    'video',
    'pricing',
    'academy-video',
    'coaches',
    'centres',
    'ask-the-players',
    'apply',
    'partners',
];

const PowerGame = () => {
    usePageAnalytics('/PGP2026', { sections: SECTIONS });
    const [showApply, setShowApply] = useState(false);
    const [showSizeGuide, setShowSizeGuide] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        // Set page title for browser tab + SEO (page is hidden from nav)
        document.title = 'The Power Game Program | Rajasthan Royals Academy Melbourne';
    }, []);

    return (
        <div className="min-h-screen bg-rr-page text-white font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="power-game" />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero">
                    <HeroSection />
                </div>

                <div id="quote-1">
                    <QuoteBlock
                        variant="overlay"
                        imagePosition="left"
                        quote="Our job is to give players the tools to reach for power when the situation demands it — across any format of the game."
                        attribution="Alex Lewis"
                        role="Rajasthan Royals Academy Head Coach"
                        image="/assets/powergame/alex-lewis.jpg"
                        imageAlt="Alex Lewis coaching at Rajasthan Royals Academy Melbourne"
                    />
                </div>

                <div id="overview">
                    <OverviewSection />
                </div>

                <div id="who-its-for">
                    <FeaturesBenefits />
                </div>

                <div id="quote-vaibhav">
                    <QuoteBlock
                        variant="feature"
                        quote="I want to score 200 in T20s. I want to break Gayle's record."
                        attribution="Vaibhav Suryavanshi"
                        role="Rajasthan Royals"
                        image="/assets/powergame/vaibhav.jpg"
                        imageAlt="Vaibhav Suryavanshi"
                        imageFit="cover"
                        commentary="This statement, and the likelihood he will do it, has changed the game forever. There is now a new standard that every other team needs to find players to keep pace with this extraordinary talent."
                    />
                </div>

                <div id="video">
                    <VideoSection />
                </div>

                <div id="pricing">
                    <PricingSection />
                </div>

                <div id="academy-video">
                    <VideoSection
                        badge="Inside the Academy"
                        heading={<>THE ROYALS ACADEMY <span className="text-rr-pink">PROGRAM</span></>}
                        description="Go inside the Rajasthan Royals Academy elite program — the methodology, the environment, and what it means to develop the Royals Way."
                        videoSrc="/assets/powergame/royals-academy-video.mp4"
                        posterSrc="/assets/powergame/royals-academy-poster.jpg"
                    />
                </div>

                <div id="coaches">
                    <CoachesSection />
                </div>

                <div id="centres">
                    <CentresSection />
                </div>

                {/* Player-voice social proof — right before the application so the quotes sell the apply. */}
                <div id="ask-the-players">
                    <AskThePlayers />
                </div>

                {/* Combined: Secure your place + How it works (process steps) + apply funnel inline */}
                <div id="apply" className="bg-rr-dark text-white scroll-mt-24">
                    {!showApply ? (
                        <div className="py-20 md:py-28 px-5">
                            <div className="max-w-5xl mx-auto text-center">
                                <div className="text-rr-pink font-black uppercase tracking-[0.3em] text-xs mb-3">How to apply</div>
                                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wide mb-4">Secure your <span className="text-rr-pink">spot</span></h2>
                                <p className="text-white/60 mb-6 max-w-xl mx-auto">Five quick questions, about three minutes. You don&apos;t pay a cent until a coach confirms your place.</p>
                                <div className="flex flex-wrap justify-center gap-2.5 mb-12">
                                    {EASY_PILLS.map((p, i) => (
                                        <span key={i} className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-full px-4 py-2 text-xs font-bold text-white/80">
                                            <p.Icon className="w-4 h-4 text-rr-pink" strokeWidth={2.4} /> {p.label}
                                        </span>
                                    ))}
                                </div>

                                <ol className="max-w-2xl mx-auto text-left">
                                    {HOW_STEPS.map((s, i) => (
                                        <li key={i} className="relative flex gap-4 sm:gap-5 pb-8 last:pb-0">
                                            {i < HOW_STEPS.length - 1 && (
                                                <span aria-hidden className="absolute left-6 top-12 bottom-0 w-px bg-gradient-to-b from-rr-pink/40 to-white/5" />
                                            )}
                                            <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-rr-dark border-2 border-rr-pink/40 text-rr-pink flex items-center justify-center">
                                                <s.Icon className="w-5 h-5" strokeWidth={2.3} />
                                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rr-pink text-white text-[10px] font-black flex items-center justify-center">{i + 1}</span>
                                            </div>
                                            <div className="flex-1 pt-1.5">
                                                <h3 className="text-base md:text-lg font-black uppercase tracking-wide text-white leading-tight">{s.title}</h3>
                                                <p className="text-white/55 text-sm mt-1 leading-snug">{s.sub}</p>
                                                {s.note && (
                                                    <div className="mt-2.5 flex items-start gap-2 bg-amber-400/10 border border-amber-400/25 rounded-lg px-3 py-2">
                                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" strokeWidth={2.4} />
                                                        <span className="text-amber-200/90 text-xs leading-snug">{s.note}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ol>

                                {/* The offer, framed as an investment in development. */}
                                <div className="mt-12 max-w-md mx-auto text-left bg-white/5 border border-white/10 rounded-2xl p-7">
                                    <div className="text-rr-pink font-black uppercase tracking-[0.2em] text-[11px] mb-2">Your 8-week investment</div>
                                    <div className="flex items-baseline gap-3 mb-1">
                                        <div className="text-5xl font-black text-white leading-none">$989</div>
                                        <div className="text-white/55 text-sm font-bold">the 8-week block</div>
                                    </div>

                                    {/* Playing uniform is a separate, required purchase — make that unmissable,
                                        with a size guide right next to it so they can choose before ordering. */}
                                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                                        <span className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/25 rounded-lg px-3 py-1.5">
                                            <Shirt className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" strokeWidth={2.4} />
                                            <span className="text-amber-200/90 text-[12px] font-bold leading-snug">Playing uniform required<span className="text-amber-300">*</span> — not included</span>
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setShowSizeGuide(true)}
                                            className="inline-flex items-center gap-1.5 text-rr-light-pink hover:text-white text-[12px] font-bold uppercase tracking-wide px-3.5 py-3 rounded-full border border-rr-light-pink/30 hover:border-rr-light-pink/60 transition-colors"
                                        >
                                            <Ruler className="w-3.5 h-3.5" />
                                            Size guide
                                        </button>
                                    </div>

                                    <div className="border-t border-white/10 my-5" />

                                    {/* Prepare your game — concept/outcome level so the actual
                                        session plan (periodisation + drill progressions) stays ours. */}
                                    <div className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-3">Prepare your game</div>
                                    <div className="flex flex-col gap-3.5">
                                        {DEVELOP_PILLARS.map((p, i) => (
                                            <div key={i} className="flex gap-3">
                                                <span className="mt-[7px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-rr-pink" />
                                                <div>
                                                    <div className="text-white font-black text-sm uppercase tracking-wide leading-tight">{p.name}</div>
                                                    <div className="text-white/55 text-[13px] leading-snug mt-0.5">{p.body}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {DEVELOP_TRACKS.map((t, i) => (
                                            <div key={i} className="bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-3">
                                                <div className="text-rr-light-pink font-black text-[11px] uppercase tracking-widest mb-1">{t.who}</div>
                                                <div className="text-white/55 text-[12px] leading-snug">{t.body}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Do the maths — cost per hour vs typical programs. */}
                                    <div className="border-t border-white/10 my-5" />
                                    <div className="text-rr-pink font-black uppercase tracking-[0.2em] text-[11px] mb-3">Do the maths — cost per hour</div>
                                    <div className="flex flex-col gap-2">
                                        {HOUR_MATHS.map((r, i) => (
                                            <div key={i} className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 border ${r.us ? 'bg-rr-pink/10 border-rr-pink/40' : 'bg-white/5 border-white/10'}`}>
                                                <div>
                                                    <div className={`text-sm font-black uppercase tracking-wide ${r.us ? 'text-white' : 'text-white/70'}`}>{r.who} · {r.price}</div>
                                                    <div className="text-[11px] text-white/45">{r.detail}</div>
                                                </div>
                                                <div className={`text-2xl font-black ${r.us ? 'text-rr-light-pink' : 'text-white/55'}`}>{r.perHour}<span className="text-[10px] font-bold text-white/40">/hr</span></div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-white/50 text-xs mt-3 font-medium">Nearly double the coaching hours — at the lowest cost per hour.</p>

                                    {/* Asterisk footnote for the required-but-not-included uniform. */}
                                    <p className="text-white/35 text-[11px] mt-4 leading-snug">
                                        <span className="text-amber-300">*</span> Mandatory uniform, purchased separately: a training shirt, shorts or pants, and a cap. The fleece jacket is optional.{' '}
                                        <button type="button" onClick={() => setShowSizeGuide(true)} className="underline decoration-white/30 underline-offset-2 hover:text-white transition-colors">
                                            View the size guide
                                        </button>{' '}
                                        before you order.
                                    </p>
                                </div>

                                {/* Discovery / review path — for talent the rep system hasn't caught yet. */}
                                <div className="mt-10 max-w-3xl mx-auto text-left bg-rr-blue/10 border border-rr-blue/30 rounded-2xl p-6 md:p-8">
                                    <div className="flex flex-col sm:flex-row items-start gap-5">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-rr-blue to-rr-pink flex items-center justify-center shadow-lg">
                                            <Telescope className="w-6 h-6 text-white" strokeWidth={2.2} />
                                        </div>
                                        <div>
                                            <div className="text-rr-pink font-black uppercase tracking-[0.25em] text-[11px] mb-2">Wild Card Selection</div>
                                            <h3 className="text-xl md:text-2xl font-black uppercase tracking-wide text-white mb-2">Think you've got it? Back yourself.</h3>
                                            <p className="text-white/60 text-sm leading-relaxed mb-5">
                                                Reps and selectors miss players every year — the right talent doesn&apos;t always show up on
                                                paper. Our Wild Card pathway is your shot. If your cricket doesn&apos;t meet the standard yet,
                                                your application isn&apos;t rejected — it goes to a real Power Game coach for review. See something
                                                in you, and they&apos;ll be in touch about the right squad for your development. No payment until
                                                your spot is confirmed.
                                            </p>
                                            <div className="flex flex-col sm:flex-row gap-2.5">
                                                {DISCOVERY_EXAMPLES.map((ex, i) => (
                                                    <div key={i} className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full pl-3 pr-4 py-2">
                                                        <ex.Icon className="w-4 h-4 text-rr-pink flex-shrink-0" strokeWidth={2.4} />
                                                        <span className="text-xs font-bold text-white/80">{ex.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10">
                                    <button onClick={() => setShowApply(true)} className="inline-flex items-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-sm rounded-full px-8 py-4 transition-all hover:shadow-[0_0_30px_rgba(229,6,149,0.5)]">
                                        Secure your spot →
                                    </button>
                                    <p className="text-white/30 text-[11px] mt-4">Every application is personally reviewed by our coaching team.</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative border-t border-white/10">
                            <div className="max-w-xl mx-auto px-5 pt-5">
                                <button onClick={() => setShowApply(false)} className="text-xs text-white/40 hover:text-white/70 uppercase tracking-widest">← Close</button>
                            </div>
                            <React.Suspense fallback={<div className="min-h-[60vh]" />}>
                                <ApplyFlow embedded />
                            </React.Suspense>
                        </div>
                    )}
                </div>

                <div id="partners">
                    <PartnerStack />
                </div>
            </main>
            <Footer />

            <UniformSizeGuideModal open={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
        </div>
    );
};

export default PowerGame;
