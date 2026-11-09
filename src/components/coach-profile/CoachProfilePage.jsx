import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../Footer';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import { CENTRES, COACH_ORDER, COACH_PROFILES, FIVE_AREAS } from './coachProfiles';
import { bookingMode, coachOffers, formatLength, formatLengths, formatMoney, getCatalog, sessionPriceCents } from './bookingClient';
import { Photo, SectionHead, Tick } from './CPShared';
import CPStrengths from './CPStrengths';
import CPBook from './CPBook';
import { trackCoachPageView } from './coachPixel';

// /coaches/:slug — one page per coach. Hidden until VITE_COACH_PAGES=on (App.jsx).
//
// Order (Alex, 9 Nov 2026): sell the coach as a person and as a coach, then the
// offering, which is the same for every coach (one-on-one, or a small group of
// 2 to 4 players), then the booking panel. The booking system takes over from
// there: the family picks a time the coach works and the Academy confirms it with
// the centre. Every price sits in "What it costs", after the booking panel.
//
//   hero → about (+ record) → areas → strengths → offer → book → how → prices → coaches
const SECTIONS = ['hero', 'about', 'record', 'areas', 'strengths', 'offer', 'book', 'how', 'prices', 'coaches'];

const btnPrimary = 'w-full sm:w-auto min-h-[52px] text-center bg-rr-pink hover:bg-rr-light-pink text-white text-[13px] sm:text-sm font-black uppercase tracking-wide sm:tracking-wider leading-tight px-5 sm:px-7 py-3.5 rounded-full transition-colors';
const btnSecondary = 'w-full sm:w-auto min-h-[52px] text-center bg-white border-2 border-rr-pink text-rr-pink hover:bg-rr-pink hover:text-white text-[13px] sm:text-sm font-black uppercase tracking-wide sm:tracking-wider leading-tight px-5 sm:px-7 py-3 rounded-full transition-colors';

export default function CoachProfileRoute() {
    const { slug } = useParams();
    const profile = COACH_PROFILES[slug];
    if (!profile) return <Navigate to="/coaches" replace />;
    // A fresh page per coach, so moving between coach pages logs a new page view
    // and starts with nothing chosen.
    return <CoachProfilePage key={profile.slug} profile={profile} />;
}

function CoachProfilePage({ profile }) {
    const [catalog, setCatalog] = useState(null);
    const [catalogLoading, setCatalogLoading] = useState(true);
    const [choice, setChoice] = useState({ kind: 'one_on_one', groupSize: 2 });
    const sourcePage = `/coaches/${profile.slug}`;

    usePageAnalytics(sourcePage, { sections: SECTIONS });

    useEffect(() => {
        window.scrollTo(0, 0);
        // <title> and meta tags come from <RouteSeo/> (src/seo/pageSeo.js).
        trackCoachPageView(profile);
        let live = true;
        getCatalog()
            .then((c) => { if (live) setCatalog(c); })
            .catch(() => { if (live) setCatalog(null); })
            .finally(() => { if (live) setCatalogLoading(false); });
        return () => { live = false; };
    }, [profile]);

    const catalogCoach = catalog?.coaches.find((c) => c.slug === profile.slug) || null;
    const offers = coachOffers(catalogCoach);
    const bookableCentres = catalogCoach?.centres?.length ? catalogCoach.centres : [profile.homeCentre];
    // If the coach doesn't offer what was chosen, fall back to what they do offer.
    const kind = offers[choice.kind] ? choice.kind : offers.one_on_one ? 'one_on_one' : 'group';
    const groupSize = choice.groupSize;

    // Panel chips: change the choice in place.
    const choose = (k, n) => setChoice((c) => ({ kind: k, groupSize: n || c.groupSize }));
    // Hero and offering buttons: one player, or a group of 2, then go to the panel.
    const chooseAndGo = (k) => {
        setChoice({ kind: k, groupSize: 2 });
        const el = document.getElementById('book');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            el.focus({ preventScroll: true });
        }
    };

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="coach-profile" ctaLabelOverride={`BOOK ${profile.first.toUpperCase()}`} ctaTargetOverride="book" />
            <main className="flex-1 w-full overflow-hidden pt-20 pb-24">
                <div id="hero"><Hero profile={profile} catalog={catalog} offers={offers} onChoose={chooseAndGo} /></div>
                <div id="about" className="scroll-mt-20"><About profile={profile} /></div>
                <div id="areas" className="scroll-mt-20"><Areas profile={profile} /></div>
                <div id="strengths" className="scroll-mt-20"><CPStrengths profile={profile} /></div>
                <div id="offer" className="scroll-mt-20"><Offering profile={profile} catalog={catalog} offers={offers} centres={bookableCentres} onChoose={chooseAndGo} /></div>
                <div id="book" className="scroll-mt-20 outline-none" tabIndex={-1}>
                    <CPBook
                        profile={profile}
                        catalog={catalog}
                        catalogLoading={catalogLoading}
                        catalogCoach={catalogCoach}
                        offers={offers}
                        kind={kind}
                        groupSize={groupSize}
                        onChoose={choose}
                        sourcePage={sourcePage}
                    />
                </div>
                <div id="how" className="scroll-mt-20"><HowItWorks profile={profile} /></div>
                <div id="prices" className="scroll-mt-20"><Prices profile={profile} catalog={catalog} catalogLoading={catalogLoading} offers={offers} /></div>
                <div id="coaches" className="scroll-mt-20"><OtherCoaches profile={profile} /></div>
            </main>
            <Footer />
            <StickyBar profile={profile} />
        </div>
    );
}

const groupRange = (catalog) => {
    const sizes = catalog?.groupSizes?.length ? catalog.groupSizes : [2, 3, 4];
    return `${Math.min(...sizes)} to ${Math.max(...sizes)}`;
};

const directionsUrl = (centre) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${centre.name}, ${centre.address}`)}`;

function Hero({ profile, catalog, offers, onChoose }) {
    const centre = CENTRES[profile.homeCentre];
    const range = groupRange(catalog);
    const what = offers.one_on_one && offers.group
        ? `One-on-one, or a small group of ${range} players`
        : offers.group ? `Small groups of ${range} players` : 'One-on-one sessions';
    return (
        <section className="py-6 md:py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 grid gap-5 sm:gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:items-center">
                <Photo profile={profile} className="rounded-2xl aspect-[2/1] sm:aspect-[3/2] lg:aspect-[4/5] lg:order-2" />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="grid gap-3 sm:gap-4 min-w-0">
                    <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-rr-pink">Rajasthan Royals Academy Melbourne · {centre.short}</p>
                    <h1 className="text-[clamp(2.5rem,9vw,4.75rem)] font-black uppercase tracking-wide leading-[1.02] text-rr-dark">{profile.name}</h1>
                    <p className="text-[17px] font-extrabold uppercase tracking-[0.06em] text-rr-dark leading-snug">
                        Development coach · <span className="text-rr-pink">{profile.roleStrengths}</span>
                    </p>
                    <p className="text-base sm:text-lg font-medium text-rr-charcoal max-w-[38em]">{profile.heroLine || profile.intro}</p>
                    <div className="grid gap-3 sm:flex sm:flex-wrap">
                        {offers.one_on_one && (
                            <button type="button" data-cta="hero-one-on-one" onClick={() => onChoose('one_on_one')} className={btnPrimary}>
                                Book a one-on-one with {profile.first}
                            </button>
                        )}
                        {offers.group && (
                            <button type="button" data-cta="hero-small-group" onClick={() => onChoose('group')} className={offers.one_on_one ? btnSecondary : btnPrimary}>
                                Book a small group with {profile.first}
                            </button>
                        )}
                    </div>
                    <ul className="grid gap-2.5 border-t border-slate-200 pt-4 font-medium text-rr-charcoal">
                        {[
                            what,
                            `Your first session is a consultation with ${profile.first} to set the player’s plan`,
                            `Sessions of ${formatLengths(catalog?.durations || [60, 90, 120])} in an indoor net`,
                        ].map((t) => <TickItem key={t}>{t}</TickItem>)}
                        <TickItem>
                            Home centre: {centre.name}, {centre.address}.{' '}
                            <a href={directionsUrl(centre)} target="_blank" rel="noopener noreferrer" className="font-bold text-rr-blue underline underline-offset-2">Get directions</a>
                        </TickItem>
                    </ul>
                </motion.div>
            </div>
        </section>
    );
}

function TickItem({ children }) {
    return (
        <li className="flex gap-2.5 items-start min-w-0">
            <Tick />
            <span>{children}</span>
        </li>
    );
}

function About({ profile }) {
    const about = profile.about || null;
    const facts = about?.facts?.length ? about.facts : null;
    const para = 'text-base sm:text-lg font-medium text-rr-charcoal';
    const label = 'text-[11px] font-extrabold uppercase tracking-[0.14em] text-rr-pink';
    return (
        <section className="py-16 md:py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead first="About" second={profile.first} />
                <div className={`grid gap-10 ${facts ? 'lg:grid-cols-[1.5fr_1fr] lg:gap-16 lg:items-start' : ''}`}>
                    <div className="grid gap-4 max-w-3xl min-w-0">
                        {about ? (
                            <>
                                {about.player?.length > 0 && (
                                    <>
                                        <p className={label}>{profile.first}’s game</p>
                                        {about.player.map((t) => <p key={t} className={para}>{t}</p>)}
                                    </>
                                )}
                                {about.coach?.length > 0 && (
                                    <>
                                        <p className={`${label} ${about.player?.length ? 'mt-4' : ''}`}>How {profile.first} coaches</p>
                                        {about.coach.map((t) => <p key={t} className={para}>{t}</p>)}
                                    </>
                                )}
                            </>
                        ) : (
                            <p className={para}>{profile.intro}</p>
                        )}
                        {profile.quote && (
                            <blockquote className="mt-4 border-l-4 border-rr-pink pl-5 text-lg font-semibold text-rr-dark">
                                “{profile.quote}”
                                <footer className="mt-2 text-sm font-bold text-rr-charcoal">{profile.name}</footer>
                            </blockquote>
                        )}
                    </div>
                    {facts && (
                        <dl className="grid gap-4 border-l-[3px] border-rr-pink pl-5">
                            {facts.map((f) => (
                                <div key={f.label} className="grid gap-0.5">
                                    <dt className={label}>{f.label}</dt>
                                    <dd className="font-bold text-rr-dark">{f.value}</dd>
                                </div>
                            ))}
                        </dl>
                    )}
                </div>
                <Record profile={profile} />
            </div>
        </section>
    );
}

// "<first>'s cricket": the playing and Academy record, at the end of About.
function Record({ profile }) {
    return (
        <div id="record" className="mt-14 md:mt-16">
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-wide text-rr-dark mb-6">
                {profile.first}’s <span className="text-rr-pink">cricket</span>
            </h3>
            <div className="grid gap-9 lg:grid-cols-2 lg:gap-14">
                {profile.record.map((g) => (
                    <div key={g.heading}>
                        <h4 className="text-lg font-black uppercase tracking-wide text-rr-dark pb-3 mb-1 border-b-2 border-rr-pink">{g.heading}</h4>
                        <ul>
                            {g.items.map((it) => (
                                <li key={it.title} className="grid gap-1 py-4 border-b border-slate-200">
                                    <b className="font-extrabold text-rr-dark">{it.title}</b>
                                    <span className="text-[15px] font-medium text-rr-charcoal">{it.detail}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Areas({ profile }) {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead
                    first={`What ${profile.first} works on`}
                    second="with every player"
                    lead={`Every Academy coach is a development coach first. Their job is to help young players enjoy the game and get better at it. Whatever you book ${profile.first} for, these five areas are part of the coaching.`}
                />
                <div className="border-t-2 border-rr-pink">
                    {FIVE_AREAS.map((a) => (
                        <div key={a.title} className="grid gap-1.5 py-5 border-b border-slate-200 md:grid-cols-[15rem_1fr] md:gap-8 md:items-baseline">
                            <h3 className="text-lg font-black uppercase tracking-wide text-rr-dark">{a.title}</h3>
                            <p className="font-medium text-rr-charcoal max-w-[44em]">{a.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// The offering: the same for every coach (Alex, 9 Nov 2026). No prices here.
function Offering({ profile, catalog, offers, centres, onChoose }) {
    const where = centres.map((c) => CENTRES[c]?.name).filter(Boolean).join(' or ') || CENTRES[profile.homeCentre].name;
    const range = groupRange(catalog);
    const options = [
        offers.one_on_one && {
            key: 'one_on_one',
            title: 'One-on-one',
            body: [
                `The player has ${profile.first} to themselves for the whole session.`,
                'It suits a player who wants to work on one part of their game in detail.',
            ],
            button: `Book a one-on-one with ${profile.first}`,
        },
        offers.group && {
            key: 'group',
            title: `Small group (${range} players)`,
            body: [
                `${range} players train together with ${profile.first}, taking turns on the same skill. Each player pays less than for a one-on-one.`,
                'It suits friends or teammates who want to train together. You make up the group yourselves: the person booking adds the other players’ names.',
            ],
            button: `Book a small group with ${profile.first}`,
        },
    ].filter(Boolean);
    const second = options.length > 1 ? 'One-on-one or a small group' : options[0]?.key === 'group' ? `In a small group of ${range} players` : 'One-on-one';
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead
                    first={`How to train with ${profile.first}`}
                    second={second}
                    lead={`Sessions are in an indoor net at ${where}, for ${formatLengths(catalog?.durations || [60, 90, 120])}. You can book a single session or a block of weeks.`}
                />
                <div className={`grid gap-10 ${options.length > 1 ? 'md:grid-cols-2 md:gap-12' : 'max-w-3xl'}`}>
                    {options.map((o, i) => (
                        <div key={o.key} className="grid gap-4 content-start border-t-2 border-rr-pink pt-6 min-w-0">
                            {/* With one option, the section heading already names it. */}
                            {options.length > 1 && <h3 className="text-2xl font-black uppercase tracking-wide text-rr-dark">{o.title}</h3>}
                            {o.body.map((t) => <p key={t} className="font-medium text-rr-charcoal">{t}</p>)}
                            <button type="button" data-cta={`offer-${o.key}`} onClick={() => onChoose(o.key)} className={`${i === 0 ? btnPrimary : btnSecondary} mt-1 sm:justify-self-start`}>
                                {o.button}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function HowItWorks({ profile }) {
    const centre = CENTRES[profile.homeCentre];
    const steps = [
        ['Pick a time', `Choose one player or a group, how long, and one of ${profile.first}’s free times. Then choose how many weeks. One session is fine.`],
        ['Send your request', 'We put a hold on your card for the first session. You are not charged yet. This is a request, not a booking: we check the time and a net with the centre first.'],
        ['We confirm with the centre', `When you request, you’ll see the time we’ll confirm by. Once the centre confirms, you’re booked and we charge your sessions to the same card. If we can’t confirm, the hold is released and we send you other times at ${centre.short}.`],
        [`First session: consultation with ${profile.first}`, `${profile.first} watches the player train and talks through their goals, then builds the plan for the rest of the sessions you’ve booked.`],
    ];
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead first="How booking" second="works" />
                <ol className="grid gap-7 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
                    {steps.map(([title, body], i) => (
                        <li key={title} className="grid grid-cols-[3.25rem_1fr] gap-3 min-w-0">
                            <span className="text-[2.5rem] leading-none font-black text-rr-pink">{i + 1}</span>
                            <div>
                                <b className="block mb-1.5 font-black uppercase tracking-wide text-rr-dark">{title}</b>
                                <p className="font-medium text-rr-charcoal">{body}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}

// Every price on the page lives here (Alex, 9 Nov 2026). All numbers come from
// the booking catalog, never from this file.
function Prices({ profile, catalog, catalogLoading, offers }) {
    const p = catalog?.prices;
    const c = catalog?.cancellation;
    const bd = catalog?.blockDiscount;
    const durations = catalog?.durations || [60, 90, 120];
    const groups = Object.entries(p?.groupCents || {}).filter(([, cents]) => cents);
    const row = (th, td, small) => (
        <tr key={th} className="border-b border-slate-200">
            <th className="py-3.5 pr-4 text-left align-top font-semibold text-rr-charcoal">{th}{small && <small className="block text-[13px] font-medium text-slate-500 mt-0.5">{small}</small>}</th>
            <td className="py-3.5 text-right align-top font-black text-rr-dark text-lg whitespace-nowrap tabular-nums">{td}</td>
        </tr>
    );
    // A worked example for groups, from the catalog: 2 hours in a group of 3.
    const exampleGroup = groups.find(([n]) => n === '3') || groups[0];
    const exampleMinutes = durations.includes(120) ? 120 : durations[durations.length - 1];
    return (
        <section className="py-16 md:py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead first="What it" second="costs" lead="Prices are the same with every Academy coach. All prices include GST. You can book a single session." />
                {p ? (
                    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:items-start">
                        <div className="grid gap-7 min-w-0">
                            {offers.one_on_one && p.hourCents && (
                                <table className="w-full border-collapse">
                                    <caption className="text-left pb-2 font-black uppercase tracking-wide text-rr-dark">One-on-one with {profile.first}</caption>
                                    <tbody>
                                        {durations.map((m) => row(formatLength(m), `${formatMoney(sessionPriceCents(p, { kind: 'one_on_one', minutes: m }))} incl. GST`))}
                                    </tbody>
                                </table>
                            )}
                            {offers.group && groups.length > 0 && (
                                <table className="w-full border-collapse">
                                    <caption className="text-left pb-2 font-black uppercase tracking-wide text-rr-dark">Small group with {profile.first}</caption>
                                    <tbody>
                                        {groups.map(([n, cents]) => row(`Group of ${n} players`, <>{formatMoney(cents)} incl. GST<small className="block text-xs font-semibold text-slate-500">per player, per hour</small></>))}
                                    </tbody>
                                </table>
                            )}
                            <div className="grid gap-2 text-[15px] font-medium text-rr-charcoal">
                                {offers.group && exampleGroup && (
                                    <p>Longer sessions are charged by the hour. For example, {formatLength(exampleMinutes)} in a group of {exampleGroup[0]} is {formatMoney(sessionPriceCents(p, { kind: 'group', groupSize: exampleGroup[0], minutes: exampleMinutes }))} per player.</p>
                                )}
                                {bd && (
                                    <p>
                                        <b className="font-extrabold text-rr-dark">Book {bd.minSessions} or more sessions together and every session is {bd.percent}% off.</b>
                                        {offers.one_on_one && p.hourCents ? ` For example, one hour one-on-one is then ${formatMoney(Math.round(p.hourCents * (100 - bd.percent) / 100))}.` : ''}
                                    </p>
                                )}
                            </div>
                        </div>
                        <aside className="grid gap-3.5 border-l-[3px] border-rr-pink pl-5">
                            <h3 className="text-lg font-black uppercase tracking-wide text-rr-dark">Your first session</h3>
                            <p className="font-medium text-rr-charcoal">The first session with {profile.first} is a consultation. {profile.first} works out where the player’s game is at and what they want to achieve, then builds a plan for the sessions you’ve booked. It costs the same as any other session.</p>
                            {c && (
                                <>
                                    <h3 className="text-lg font-black uppercase tracking-wide text-rr-dark mt-2">If you need to cancel</h3>
                                    <p className="font-medium text-rr-charcoal">Cancel more than {c.freeHours} hours before a session and there’s no fee. The session’s value becomes a credit for another session. Inside {c.freeHours} hours, a {formatMoney(c.lateFeeCents)} late-cancellation fee comes out of it and the rest becomes a credit.</p>
                                </>
                            )}
                            <h3 className="text-lg font-black uppercase tracking-wide text-rr-dark mt-2">If we cancel</h3>
                            <p className="font-medium text-rr-charcoal">If {profile.first} or the Academy cancels a session, you choose a new time, a credit or a full refund to your card. There’s no fee.</p>
                        </aside>
                    </div>
                ) : (
                    <p className="font-medium text-rr-charcoal">{pricesPlaceholder(catalogLoading)}</p>
                )}
            </div>
        </section>
    );
}

// What "What it costs" says when there's no catalog to read prices from.
function pricesPlaceholder(catalogLoading) {
    if (bookingMode() === 'off') return 'Prices show here once private coaching bookings open.';
    if (catalogLoading) return 'Loading prices…';
    return 'We couldn’t load the prices just now. Please refresh the page, or ask us in the booking section above and we’ll call you.';
}

function OtherCoaches({ profile }) {
    const others = COACH_ORDER.filter((s) => s !== profile.slug).map((s) => COACH_PROFILES[s]);
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead first="Other Academy" second="coaches" lead="Every Academy coach is a development coach first. Here’s what each one knows best." />
                <div className="grid grid-flow-col auto-cols-[minmax(150px,44%)] gap-4 overflow-x-auto snap-x snap-mandatory pb-2 sm:grid-flow-row sm:grid-cols-3 sm:auto-cols-auto sm:overflow-visible sm:gap-7">
                    {others.map((c) => (
                        <Link key={c.slug} to={`/coaches/${c.slug}`} className="group grid gap-2 snap-start min-w-0">
                            <Photo profile={c} className="rounded-xl aspect-[3/4]" />
                            <h3 className="mt-1 text-[17px] font-black uppercase tracking-wide text-rr-dark">{c.name}</h3>
                            <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-rr-pink">{c.card.strengths}</p>
                            <p className="text-sm font-medium text-rr-charcoal">{c.card.cred}</p>
                            <span className="text-[13px] font-extrabold text-rr-blue group-hover:underline">See {c.first}’s page →</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

function StickyBar({ profile }) {
    const centre = CENTRES[profile.homeCentre];
    return (
        <div className="fixed inset-x-0 bottom-0 z-40 bg-rr-dark text-white px-4 pt-2.5" style={{ paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))' }}>
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <Photo profile={profile} small className="w-[42px] h-[42px] rounded-full shrink-0" />
                    <div className="min-w-0 leading-tight">
                        <b className="block font-black uppercase tracking-wide text-sm truncate">{profile.name}</b>
                        <span className="text-xs text-slate-300 truncate block">Development coach · {centre.short}</span>
                    </div>
                </div>
                <a href="#book" data-cta="sticky-book" className="shrink-0 bg-rr-pink hover:bg-rr-light-pink rounded-full px-5 py-3 text-xs font-black uppercase tracking-widest transition-colors">Book</a>
            </div>
        </div>
    );
}
