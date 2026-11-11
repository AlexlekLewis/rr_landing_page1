import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../Footer';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import { CENTRES, FIVE_AREAS } from './coachProfiles';
import { coachMatchesCatalog, coachPageProfile, listedCoachPages } from './coachPageProfiles';
import { coachOffers, formatMoney, getCatalog, sessionPriceCents } from './bookingClient';
import { Photo, SectionHead, TickList } from './CPShared';
import CPStrengths from './CPStrengths';
import CPBook from './CPBook';
import { createFamilyOperationGate } from '../booking/family-operation-gate';
import { createFamilyPublicReader } from '../booking/family-public-reader';

// /coaches/:slug — one page per coach (Coach Pages Addendum, 3 Nov 2026).
// Development coach first (FIVE_AREAS), then the coach's own strengths, then a
// way into /book. Hidden until VITE_COACH_PAGES=on (see App.jsx).

const SECTIONS = ['hero', 'areas', 'strengths', 'record', 'how', 'prices', 'book', 'coaches'];

export default function CoachProfilePage() {
    const { slug } = useParams();
    const profile = coachPageProfile(slug);
    const [gate] = useState(createFamilyOperationGate);
    return profile ? <CoachProfileContent key={slug} profile={profile} gate={gate} /> : <Navigate to="/coaches" replace />;
}

function CoachProfileContent({ profile, gate }) {
    const slug = profile.slug;
    const reader = useMemo(() => createFamilyPublicReader(gate), [gate]);
    const [catalog, setCatalog] = useState(null);
    const [catalogLoading, setCatalogLoading] = useState(true);
    const [catalogError, setCatalogError] = useState(false);
    const [picks, setPicks] = useState([]);

    usePageAnalytics(`/coaches/${slug}`, { sections: SECTIONS });

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!profile) return undefined;
        // <title> and meta tags come from <RouteSeo/> (src/seo/pageSeo.js).
        try { if (typeof window.fbq === 'function') window.fbq('track', 'ViewContent', { content_name: profile.name, content_category: 'coach-page' }); } catch { /* never block */ }
        let live = true; const controller = new AbortController();
        getCatalog({ reader, signal: controller.signal })
            .then((c) => { if (live) setCatalog(c); })
            .catch(problem => { if (live && problem.name !== 'AbortError') { setCatalog(null); setCatalogError(true); } })
            .finally(() => { if (live) setCatalogLoading(false); });
        return () => { live = false; controller.abort(); };
    }, [slug, profile, reader]);

    const catalogCoach = catalog?.coaches.find((c) => coachMatchesCatalog(profile, c)) || null;
    const offers = coachOffers(catalogCoach);
    const toggle = (key) => setPicks((p) => (p.includes(key) ? p.filter((k) => k !== key) : [...p, key]));
    const sourcePage = `/coaches/${profile.slug}`;

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="coach-profile" ctaLabelOverride={`BOOK ${profile.first.toUpperCase()}`} ctaTargetOverride="book" />
            <main className="flex-1 w-full overflow-hidden pt-20 pb-24">
                <div id="hero"><Hero profile={profile} catalog={catalog} offers={offers} /></div>
                <div id="areas"><Areas profile={profile} /></div>
                <div id="strengths"><CPStrengths profile={profile} picks={picks} onToggle={toggle} /></div>
                <div id="record"><Record profile={profile} /></div>
                <div id="how"><HowItWorks profile={profile} /></div>
                <div id="prices"><Prices profile={profile} catalog={catalog} offers={offers} /></div>
                <div id="book" className="scroll-mt-20">
                    <CPBook profile={profile} catalog={catalog} catalogLoading={catalogLoading} catalogError={catalogError} catalogCoach={catalogCoach} picks={picks} sourcePage={sourcePage} reader={reader} operationGate={gate} />
                </div>
                <div id="coaches"><OtherCoaches profile={profile} catalog={catalog} /></div>
            </main>
            <Footer />
            <StickyBar profile={profile} catalog={catalog} picks={picks} offers={offers} />
        </div>
    );
}

function priceLine(catalog, offers) {
    const p = catalog?.prices;
    if (!p || !offers) return null;
    const bits = [];
    if (offers.one_on_one && p.hourCents) bits.push(`${formatMoney(p.hourCents)} an hour one-on-one, incl. GST`);
    const groups = offers.group ? Object.values(p.groupCents || {}).filter(Boolean) : [];
    if (groups.length) bits.push(`groups ${formatMoney(Math.min(...groups))}–${formatMoney(Math.max(...groups))} per player`);
    if (!bits.length) return null;
    if (catalog.blockDiscount) bits.push(`${catalog.blockDiscount.percent}% off when you book ${catalog.blockDiscount.minSessions} or more sessions`);
    return bits.join(' · ');
}

function Hero({ profile, catalog, offers }) {
    const centre = CENTRES[profile.homeCentre];
    const line = priceLine(catalog, offers);
    return (
        <section className="py-6 md:py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:items-center">
                <Photo profile={profile} className="rounded-2xl aspect-[3/2] lg:aspect-[4/5] lg:order-2" />
                <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="grid gap-4 min-w-0">
                    <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-rr-pink">Rajasthan Royals Academy Melbourne · {centre.short}</p>
                    <h1 className="text-[clamp(2.5rem,9vw,4.75rem)] font-black uppercase tracking-wide leading-[1.02] text-rr-dark">{profile.name}</h1>
                    <p className="text-[17px] font-extrabold uppercase tracking-[0.06em] text-rr-dark leading-snug">
                        Development coach · <span className="text-rr-pink">{profile.roleStrengths}</span>
                    </p>
                    <p className="text-base sm:text-lg font-medium text-rr-charcoal max-w-[38em]">{profile.intro}</p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <a href="#book" className="w-full sm:w-auto text-center bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-8 py-4 rounded-full transition-colors">
                            {offers?.one_on_one || offers?.group ? `See ${profile.first}’s free times` : `Ask about coaching with ${profile.first}`}
                        </a>
                        <a href="#areas" className="text-rr-blue font-bold hover:underline">See what {profile.first} coaches ↓</a>
                    </div>
                    {line && <p className="text-[15px] font-bold text-rr-dark">{line}</p>}
                    <TickList
                        className="border-t border-slate-200 pt-4 font-medium text-rr-charcoal"
                        items={[
                            offers?.one_on_one && offers?.group ? 'One-on-one, or a small private group' : offers?.one_on_one ? 'One-on-one coaching for one player' : offers?.group ? 'Small private group coaching' : 'Ask the Academy about available session formats',
                            `Your first session is a consultation with ${profile.first} to set the player’s plan`,
                            'Sessions of 1, 1½ or 2 hours in an indoor net',
                            `Home centre: ${centre.name}, ${centre.address}`,
                        ]}
                    />
                </Motion.div>
            </div>
        </section>
    );
}

function Areas({ profile }) {
    return (
        <section className="py-16 md:py-24 bg-slate-50">
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

function Record({ profile }) {
    return (
        <section className="py-16 md:py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead first={`${profile.first}’s`} second="cricket" />
                {profile.quote && (
                    <blockquote className="mb-10 max-w-3xl border-l-4 border-rr-pink pl-5 text-lg font-semibold text-rr-dark">
                        “{profile.quote}”
                        <footer className="mt-2 text-sm font-bold text-rr-charcoal">{profile.name}</footer>
                    </blockquote>
                )}
                <div className="grid gap-9 lg:grid-cols-2 lg:gap-14">
                    {profile.record.map((g) => (
                        <div key={g.heading}>
                            <h3 className="text-lg font-black uppercase tracking-wide text-rr-dark pb-3 mb-1 border-b-2 border-rr-pink">{g.heading}</h3>
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
        </section>
    );
}

function HowItWorks({ profile }) {
    const centre = CENTRES[profile.homeCentre];
    const steps = [
        ['Pick a time', `Choose one of ${profile.first}’s free times, how long (1, 1½ or 2 hours) and how many weeks. One session is fine.`],
        ['Send your request', 'We put a hold on your card for the first session. You are not charged yet. This is a request, not a booking: we check the time and a net with the centre first.'],
        ['We confirm with the centre', `You’ll see the time we’ll confirm by when you request. Once the centre confirms, you’re booked, and we charge the first session and the rest of your sessions to the same card. If we can’t confirm, the hold is released and we send you other times at ${centre.short}.`],
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

function Prices({ profile, catalog, offers }) {
    const p = catalog?.prices;
    const c = catalog?.cancellation;
    const bd = catalog?.blockDiscount;
    const row = (th, td, small) => (
        <tr key={th} className="border-b border-slate-200">
            <th className="py-3.5 pr-4 text-left align-top font-semibold text-rr-charcoal">{th}{small && <small className="block text-[13px] font-medium text-slate-500 mt-0.5">{small}</small>}</th>
            <td className="py-3.5 text-right align-top font-black text-rr-dark text-lg whitespace-nowrap tabular-nums">{td}</td>
        </tr>
    );
    return (
        <section className="py-16 md:py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead first="What it" second="costs" lead="Prices are the same with every Academy coach. Single sessions are fine." />
                {p && (offers?.one_on_one || offers?.group) ? (
                    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:items-start">
                        <div className="grid gap-7">
                            {offers.one_on_one && <table className="w-full border-collapse">
                                <caption className="text-left pb-2 font-black uppercase tracking-wide text-rr-dark">One-on-one with {profile.first}</caption>
                                <tbody>
                                    {(catalog.durations || [60, 90, 120]).map((m) => row(m === 60 ? '1 hour' : m === 90 ? '1½ hours' : `${m / 60} hours`, formatMoney(sessionPriceCents(p, { kind: 'one_on_one', minutes: m }))))}
                                    {bd && row(`Book ${bd.minSessions} or more sessions together`, `${bd.percent}% off`, `Every session is ${bd.percent}% off, so one hour is ${formatMoney(Math.round(p.hourCents * (100 - bd.percent) / 100))}`)}
                                </tbody>
                            </table>}
                            {offers.group && <table className="w-full border-collapse">
                                <caption className="text-left pb-2 font-black uppercase tracking-wide text-rr-dark">Small group, train with your mates</caption>
                                <tbody>
                                    {Object.entries(p.groupCents || {}).map(([n, cents]) => row(`${n} players`, <>{formatMoney(cents)}<small className="block text-xs font-semibold text-slate-500">per player, per hour</small></>))}
                                </tbody>
                            </table>}
                            {!offers.one_on_one && bd && <p className="font-medium text-rr-charcoal">Book {bd.minSessions} or more sessions together and every actual session is {bd.percent}% off.</p>}
                            <p className="text-[13px] text-slate-500">All prices include GST.</p>
                        </div>
                        <aside className="grid gap-3.5 border-l-[3px] border-rr-pink pl-5">
                            <h3 className="text-lg font-black uppercase tracking-wide text-rr-dark">Your first session</h3>
                            <p className="font-medium text-rr-charcoal">The first session with {profile.first} is an initial consultation. {profile.first} works out where the player’s game is at and what they want to achieve, then builds a plan for the sessions you’ve booked. It costs the same as any other session.</p>
                            {c && (
                                <>
                                    <h3 className="text-lg font-black uppercase tracking-wide text-rr-dark mt-2">If you need to cancel</h3>
                                    <p className="font-medium text-rr-charcoal">Cancel more than {c.freeHours} hours before a session and there’s no fee. The session’s value becomes a credit for another session. Inside {c.freeHours} hours, a {formatMoney(c.lateFeeCents)} late-cancellation fee comes out of it and the rest becomes a credit.</p>
                                </>
                            )}
                        </aside>
                    </div>
                ) : (
                    <p className="font-medium text-rr-charcoal">Ask the Academy about available session formats and prices for {profile.first}.</p>
                )}
            </div>
        </section>
    );
}

function OtherCoaches({ profile, catalog }) {
    const others = listedCoachPages(catalog).filter(coach => coach.slug !== profile.slug);
    if (!others.length) return null;
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

function StickyBar({ profile, catalog, picks, offers }) {
    const hour = offers?.one_on_one ? catalog?.prices?.hourCents : null;
    const groups = offers?.group ? Object.values(catalog?.prices?.groupCents || {}).filter(Boolean) : [];
    const rate = hour ? `${formatMoney(hour)}/hr incl. GST` : groups.length ? `From ${formatMoney(Math.min(...groups))}/player/hr incl. GST` : null;
    const sub = [picks.length ? `${picks.length} added` : null, rate].filter(Boolean).join(' · ');
    return (
        <div className="fixed inset-x-0 bottom-0 z-40 bg-rr-dark text-white px-4 pt-2.5" style={{ paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))' }}>
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <Photo profile={profile} small className="w-[42px] h-[42px] rounded-full shrink-0" />
                    <div className="min-w-0 leading-tight">
                        <b className="block font-black uppercase tracking-wide text-sm truncate">{profile.name}</b>
                        {sub && <span className="text-xs text-slate-300 whitespace-nowrap">{sub}</span>}
                    </div>
                </div>
                <a href="#book" className="inline-flex min-h-[44px] items-center shrink-0 bg-rr-pink hover:bg-rr-light-pink rounded-full px-5 py-3 text-xs font-black uppercase tracking-widest transition-colors">{offers?.one_on_one || offers?.group ? 'Book' : 'Ask us'}</a>
            </div>
        </div>
    );
}
