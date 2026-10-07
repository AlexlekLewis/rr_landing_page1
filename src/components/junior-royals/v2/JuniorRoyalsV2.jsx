import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, ChevronDown, Clock, MapPin, Users } from 'lucide-react';
import Navbar from '../../Navbar';
import Footer from '../../Footer';
import usePageAnalytics from '../../../hooks/usePageAnalytics';
import { Rich } from '../JuniorRoyalsShared';
import { MOCKUP, CENTRES, CALENDAR } from '../juniorRoyalsData';
import { PILLARS } from './jrV2Facts';
import {
    HERO, CTA, LOOP, WORRIES, HOUR, SKILL, TERM, PATH, PRICES, COMPARE, COACHES, WHERE, FORM, FAQS,
    OPEN_QUESTIONS_V2, REGION_LABEL, NEARBY, termTotal,
} from './jrV2Content';
import { LoopVisual, HourNumbers, HourRibbon, LaneDots, SkillSteps, Cues, TermRows, Scoreboards, YearStrip } from './JRV2Visuals';
import { StageJourney, BadgeBlock } from './JRV2Pathway';
import JRV2Form from './JRV2Form';
import { money } from '../juniorRoyalsData';

// ─────────────────────────────────────────────────────────────
// JUNIOR ROYALS — MOCK-UP VERSION 2 (/junior-royals on previews; version 1 is
// /junior-royals/v1). Built 7–8 Oct 2026 with the rr-page-generator skill.
//
// Order (design brief): each section past the hero is seen by about half as many
// people as the one before (on today's page: 84% hero, 24% form, 14% centres),
// so this order is also the priority order. Sections 4–7 zoom out one step at a
// time: one hour → three weeks → one term → six years.
// No entrance animation on the hero (it's the LCP element; SEO brief).
// Section ids match JRV2_NAV in Navbar.jsx.
// ─────────────────────────────────────────────────────────────

const SECTIONS = ['hero', 'matches', 'why', 'how', 'skills', 'term', 'path', 'prices', 'coaches', 'where', 'register', 'faq'];
const SCROLL_PAD = 'scroll-mt-[84px] md:scroll-mt-[112px]';
const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
const ICON = { users: Users, clock: Clock, pin: MapPin };

const Head = ({ eyebrow, title, dark }) => (
    <div className="mb-8">
        <p className={`text-xs font-black uppercase tracking-[0.25em] mb-2 ${dark ? 'text-rr-light-pink' : 'text-rr-dark'}`}>{eyebrow}</p>
        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-none ${dark ? 'text-white' : 'text-rr-dark'}`}>{title}</h2>
        <div className="w-12 h-1 bg-rr-pink mt-4" />
    </div>
);

const PrimaryButton = ({ className = '' }) => (
    <button type="button" onClick={() => go('register')}
        className={`inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 min-h-[52px] transition-colors ${className}`}>
        {CTA.primary} <ArrowRight className="w-4 h-4" />
    </button>
);

const Tick = ({ children, dark }) => (
    <li className="flex items-start gap-3">
        <Check className="w-5 h-5 text-rr-pink shrink-0 mt-0.5" strokeWidth={3} aria-hidden="true" />
        <span className={`text-[15px] sm:text-base font-medium leading-relaxed ${dark ? 'text-white/85' : 'text-rr-charcoal'}`}>{children}</span>
    </li>
);

const Section = ({ id, tone = 'white', children }) => (
    <section id={id} className={`${SCROLL_PAD} ${tone === 'dark' ? 'bg-rr-dark' : tone === 'slate' ? 'bg-slate-50' : 'bg-white'} py-14 md:py-20`}>
        <div className="max-w-5xl mx-auto px-5 sm:px-6">{children}</div>
    </section>
);

// ── Review banner (mock-up only) ──
const MockupBanner = () => {
    const [open, setOpen] = useState(false);
    if (!MOCKUP) return null;
    return (
        <div className="bg-yellow-300 text-rr-dark">
            <div className="max-w-6xl mx-auto px-5 sm:px-6 py-3">
                <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="w-full flex items-center justify-between gap-3 text-left min-h-[44px]">
                    <span className="text-sm font-bold">
                        <span className="font-black uppercase tracking-wider">Mock-up version 2, for review. Not live.</span>{' '}
                        Yellow = still to decide ({OPEN_QUESTIONS_V2.length} items). The form saves nothing.
                    </span>
                    <ChevronDown className={`w-5 h-5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                <Link to="/junior-royals/v1" data-review-only className="inline-block text-sm font-bold underline py-1">See version 1</Link>
                {open && <ol className="mt-2 mb-1 list-decimal pl-5 space-y-1 text-sm font-medium">{OPEN_QUESTIONS_V2.map((q) => <li key={q}>{q}</li>)}</ol>}
            </div>
        </div>
    );
};

// ── 1. Hero ──
const Hero = () => (
    <section id="hero" className={`${SCROLL_PAD} relative overflow-hidden bg-rr-dark`}>
        <img src="/assets/little-crickets-nets.jpeg" alt="A young batter playing a drive in the indoor nets, in front of a Rajasthan Royals Academy Melbourne banner"
            fetchPriority="high" className="absolute inset-0 w-full h-full object-cover object-[75%_center]" />
        <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/90 to-rr-dark/40 md:bg-gradient-to-r md:from-rr-dark md:via-rr-dark/95 md:to-rr-dark/20" />
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 pt-10 pb-12 md:pt-16 md:pb-20">
            <div className="max-w-xl">
                <p className="text-[11px] font-black text-white uppercase tracking-[0.25em] mb-3">{HERO.eyebrow}</p>
                <h1 className="text-white uppercase font-black leading-none tracking-tight">
                    <span className="block text-4xl sm:text-6xl md:text-7xl">{HERO.title}</span>
                    <span className="block text-base sm:text-xl normal-case tracking-normal font-bold text-white/90 mt-2">{HERO.titleSub}</span>
                </h1>
                <p className="text-[17px] sm:text-xl font-semibold text-white leading-snug mt-4"><Rich v={HERO.why} /></p>
                <ul className="mt-5 space-y-2.5">
                    {HERO.facts.map((f) => {
                        const Icon = ICON[f.icon];
                        return (
                            <li key={f.k} className="flex items-start gap-3 text-white text-[15px] sm:text-base font-semibold leading-snug">
                                <Icon className="w-5 h-5 text-rr-light-pink shrink-0 mt-0.5" aria-label={f.k} />
                                <span>
                                    {f.v}
                                    {f.older && <> · <Link to={PATH.older.link.to} className="text-rr-light-pink underline underline-offset-2 font-bold">13 or older? See Performance Squads</Link></>}
                                </span>
                            </li>
                        );
                    })}
                </ul>
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/20 pt-4">
                    {HERO.options.map((o) => (
                        <div key={o.key}>
                            <p className="text-white font-black text-[15px] leading-tight">{o.name}</p>
                            <p className="text-white/85 text-sm font-semibold">{o.what}</p>
                            <p className="mt-1 whitespace-nowrap"><span className="text-white text-3xl font-black">{o.price}</span> <span className="text-white/85 text-sm font-bold">{o.per}</span></p>
                            <p className="text-white/80 text-xs font-semibold">{o.term4}</p>
                        </div>
                    ))}
                </div>
                <p className="text-white/80 text-xs font-semibold mt-3">{HERO.priceNote}</p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <PrimaryButton className="w-full sm:w-auto" />
                    <button type="button" onClick={() => go('prices')} className="inline-flex items-center justify-center border-2 border-white/40 hover:border-white text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 min-h-[52px]">
                        {CTA.secondary}
                    </button>
                </div>
                <p className="mt-3 text-sm font-semibold text-white">{HERO.noPayment}</p>
                <p className="mt-1 text-sm font-medium text-white/80">{HERO.returning}</p>
            </div>
        </div>
    </section>
);

// ── 2. Train, play, train again ──
const Matches = () => (
    <Section id="matches">
        <Head eyebrow={LOOP.eyebrow} title={LOOP.title} />
        <LoopVisual steps={LOOP.steps} />
        <p className="mt-6 text-[15px] text-rr-charcoal font-medium leading-relaxed border-l-4 border-rr-pink pl-4 max-w-3xl">{LOOP.gloss}</p>
        <p className="mt-4 text-[15px] text-rr-dark font-semibold leading-relaxed max-w-3xl"><Rich v={LOOP.notSet} /></p>
    </Section>
);

// ── 3. Common worries ──
const Worries = () => (
    <Section id="why" tone="slate">
        <Head eyebrow={WORRIES.eyebrow} title={WORRIES.title} />
        <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
            {WORRIES.items.map((w) => (
                <li key={w.worry} className="border-t border-slate-300 pt-4">
                    <p className="text-lg font-black text-rr-dark">“{w.worry}”</p>
                    <p className="text-[15px] text-rr-charcoal font-medium leading-relaxed mt-1"><Rich v={w.answer} /></p>
                </li>
            ))}
        </ul>
        <div className="mt-10"><PrimaryButton /></div>
    </Section>
);

// ── 4. One night ──
const Hour = () => (
    <Section id="how">
        <Head eyebrow={HOUR.eyebrow} title={HOUR.title} />
        <p className="text-lg text-rr-dark font-semibold mb-6">{HOUR.intro}</p>
        <HourNumbers items={HOUR.bigNumbers} />
        <div className="grid md:grid-cols-[1fr_auto] gap-10 mt-8">
            <div>
                <HourRibbon />
                <p className="text-sm text-rr-charcoal font-medium mt-2">{HOUR.guide}</p>
            </div>
            <div>
                <div className="flex justify-center gap-8">
                    <LaneDots players={4} label="Junior Royals 4s" />
                    <LaneDots players={6} label="Junior Royals 6s" />
                </div>
                <p className="text-[15px] text-rr-charcoal font-medium leading-relaxed mt-4 max-w-xs">{HOUR.lane}</p>
            </div>
        </div>
    </Section>
);

// ── 5. How a skill sticks ──
const Skill = () => (
    <Section id="skills" tone="slate">
        <Head eyebrow={SKILL.eyebrow} title={SKILL.title} />
        <p className="text-lg text-rr-dark font-semibold mb-8 max-w-3xl">{SKILL.intro}</p>
        <SkillSteps />
        <p className="text-[15px] text-rr-dark font-semibold leading-relaxed mt-10 mb-5 max-w-3xl">{SKILL.cuesTitle}</p>
        <Cues />
        <p className="text-sm text-rr-charcoal font-medium mt-6">{SKILL.shortTermNote}</p>
    </Section>
);

// ── 6. One term ──
const Term = () => (
    <Section id="term">
        <Head eyebrow={TERM.eyebrow} title={TERM.title} />
        <div className="grid md:grid-cols-2 gap-10">
            <TermRows />
            <div className="space-y-5">
                <Scoreboards first={TERM.scoreFirst} last={TERM.scoreLast} note={TERM.scoreNote} />
                <p className="text-[15px] text-rr-charcoal font-medium leading-relaxed border-l-4 border-rr-pink pl-4">{TERM.benchmark}</p>
                <p className="text-[15px] text-rr-charcoal font-medium leading-relaxed border-l-4 border-rr-pink pl-4">{TERM.festival} <Rich v={TERM.familiesWatch} /> {TERM.photos}</p>
            </div>
        </div>
        <div className="mt-10"><PrimaryButton /></div>
    </Section>
);

// ── 7. Where it leads ──
const Path = () => (
    <Section id="path" tone="slate">
        <Head eyebrow={PATH.eyebrow} title={PATH.title} />
        <p className="text-lg text-rr-dark font-semibold max-w-3xl">{PATH.intro}</p>
        <p className="text-[15px] text-rr-charcoal font-medium mt-3 mb-8 max-w-3xl">{PATH.gloss} <Rich v={PATH.ageCutoff} /> <Rich v={PATH.beginners} /></p>
        <StageJourney />
        <BadgeBlock />
    </Section>
);

// ── 8. Prices ──
const Prices = () => (
    <Section id="prices">
        <Head eyebrow={PRICES.eyebrow} title={PRICES.title} />
        <p className="text-lg text-rr-dark font-semibold mb-8 max-w-3xl">{PRICES.lead}</p>

        <div className="grid sm:grid-cols-2 gap-8 mb-10">
            {PRICES.options.map((o) => (
                <div key={o.key} className={`border-t-4 ${o.key === '4s' ? 'border-rr-pink' : 'border-rr-dark'} pt-5`}>
                    <p className="text-2xl font-black text-rr-dark leading-tight">{o.name}</p>
                    <p className="text-lg font-bold text-rr-dark">{o.what}</p>
                    <p className="mt-4"><span className="text-5xl font-black text-rr-dark">{o.price}</span> <span className="text-lg font-bold text-rr-charcoal">a session</span></p>
                    <p className="text-[15px] font-bold text-rr-dark mt-1">{o.term4}</p>
                    <ul className="mt-4 space-y-2">
                        {o.ahead.map((a) => <Tick key={a.label}><span className="font-bold text-rr-dark">{a.label}:</span> {a.price}</Tick>)}
                        <Tick>{o.coachTime}</Tick>
                        <Tick>{o.max}</Tick>
                    </ul>
                </div>
            ))}
        </div>
        <p className="text-rr-dark font-bold">{PRICES.gst} {PRICES.matchFee}</p>
        <ul className="mt-4 mb-12 space-y-2 max-w-3xl">
            <Tick><Rich v={PRICES.cover} /></Tick>
            <Tick><Rich v={PRICES.fourAvailability} /></Tick>
        </ul>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
                <h3 className="text-xl font-black uppercase text-rr-dark mb-4">{PRICES.howTitle}</h3>
                <ol className="space-y-3">
                    {PRICES.how.map((h, i) => (
                        <li key={i} className="flex gap-3">
                            <span className="text-xl font-black text-rr-pink leading-tight w-6 shrink-0">{i + 1}</span>
                            <span className="text-[15px] text-rr-dark font-medium leading-relaxed"><Rich v={h} /></span>
                        </li>
                    ))}
                </ol>
                <ul className="mt-6 space-y-3">
                    <Tick><Rich v={PRICES.makeup} /></Tick>
                    <Tick><Rich v={PRICES.leaving} /></Tick>
                    <Tick><Rich v={PRICES.currentTerm} /></Tick>
                </ul>
            </div>
            <div>
                <h3 className="text-xl font-black uppercase text-rr-dark mb-1">{PRICES.yearTitle}</h3>
                <p className="text-[15px] font-bold text-rr-dark mb-4">{PRICES.yearNote}</p>
                <YearStrip />
                <details className="group mt-8 border-y border-slate-200">
                    <summary className="list-none cursor-pointer py-4 min-h-[44px] flex justify-between items-center gap-4">
                        <h3 className="text-lg font-black uppercase text-rr-dark">{PRICES.calendarTitle}</h3>
                        <ChevronDown className="w-5 h-5 shrink-0 text-rr-charcoal transition-transform group-open:rotate-180" />
                    </summary>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b-2 border-rr-dark text-xs font-black uppercase tracking-wider text-rr-dark">
                            <th className="py-2 pr-2">Term</th><th className="py-2 pr-2 text-right">Sessions</th><th className="py-2 pr-2 text-right normal-case">4 in a lane</th><th className="py-2 text-right normal-case">6 in a lane</th>
                        </tr>
                    </thead>
                    <tbody>
                        {CALENDAR.filter((c) => !c.holiday).map((c) => (
                            <tr key={c.label} className="border-b border-slate-200 align-top">
                                <td className="py-2.5 pr-2"><span className="block font-black text-rr-dark">{c.label === 'Rest of 2026' ? 'Term 4, 2026' : c.label}</span><span className="block text-xs text-rr-charcoal font-medium">{c.dates}</span></td>
                                <td className="py-2.5 pr-2 text-right font-bold text-rr-dark">{c.sessions}</td>
                                <td className="py-2.5 pr-2 text-right font-black text-rr-dark whitespace-nowrap">{money(termTotal('4s', c.sessions))}</td>
                                <td className="py-2.5 text-right font-black text-rr-dark whitespace-nowrap">{money(termTotal('6s', c.sessions))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className="text-xs text-rr-charcoal font-medium mt-2 pb-4">Paid by the term, before discounts. {PRICES.gst}</p>
                </details>
            </div>
        </div>

        <div className="border-l-4 border-rr-pink pl-5 max-w-4xl">
            <h3 className="text-xl font-black uppercase text-rr-dark mb-4">{COMPARE.title}</h3>
            <ul className="sm:hidden border-t-2 border-rr-dark">
                {COMPARE.rows.map((r) => (
                    <li key={r.what} className="border-b border-slate-200 py-3">
                        <p className="flex justify-between gap-3">
                            <span className={`font-bold ${r.ours ? 'text-rr-dark' : 'text-rr-charcoal'}`}>{r.what}</span>
                            <span className="font-black text-rr-dark whitespace-nowrap">{r.price} <span className="text-xs font-bold text-rr-charcoal">an hour</span></span>
                        </p>
                        <p className="text-sm font-medium text-rr-charcoal">{r.players} {r.players === '1' ? 'player' : 'players'} per coach · about {r.time} of the coach’s hour each</p>
                    </li>
                ))}
            </ul>
            <div className="hidden sm:block">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b-2 border-rr-dark text-xs font-black uppercase tracking-wider text-rr-dark">
                            {COMPARE.head.map((h, i) => <th key={h} className={`py-2 pr-3 ${i ? 'text-right' : ''}`}>{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {COMPARE.rows.map((r) => (
                            <tr key={r.what} className="border-b border-slate-200">
                                <td className={`py-2.5 pr-3 font-bold ${r.ours ? 'text-rr-dark' : 'text-rr-charcoal'}`}>{r.what}</td>
                                <td className="py-2.5 pr-3 text-right font-bold text-rr-dark">{r.players}</td>
                                <td className="py-2.5 pr-3 text-right font-bold text-rr-dark whitespace-nowrap">{r.time}</td>
                                <td className="py-2.5 text-right font-black text-rr-dark whitespace-nowrap">{r.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-rr-charcoal font-medium mt-2">{COMPARE.source} <Rich v={COMPARE.toConfirm} /></p>
        </div>
        <div className="mt-10"><PrimaryButton /></div>
    </Section>
);

// ── 9. Coaches ──
const Coaches = () => (
    <Section id="coaches" tone="slate">
        <Head eyebrow={COACHES.eyebrow} title={COACHES.title} />
        <div className="grid md:grid-cols-2 gap-8 mb-8">
            {CENTRES.map(({ coach, suburb }) => (
                <div key={suburb} className="flex gap-5 items-start">
                    <img src={coach.img} alt={coach.name} loading="lazy" decoding="async" className="w-24 h-24 rounded-full object-cover shrink-0 border-2 border-white" />
                    <div>
                        <p className="text-xl font-black text-rr-dark">{coach.name}</p>
                        <p className="text-rr-dark text-xs font-bold uppercase tracking-widest mt-1 mb-2"><Rich v={coach.jrRole} /></p>
                        <p className="text-rr-charcoal text-sm font-medium leading-relaxed">{coach.credentials.join(' · ')}</p>
                    </div>
                </div>
            ))}
        </div>
        <p className="text-[15px] text-rr-charcoal font-medium leading-relaxed max-w-3xl"><Rich v={COACHES.course} /></p>
        <p className="text-[15px] text-rr-dark font-semibold leading-relaxed max-w-3xl mt-3">{COACHES.notMeet}</p>
        <h3 className="text-xl font-black uppercase text-rr-dark mt-10 mb-4">{COACHES.pillarsTitle}</h3>
        <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
            {PILLARS.map((p) => (
                <li key={p.name} className="border-l-4 border-rr-pink pl-4">
                    <p className="font-black text-rr-dark">{p.name}</p>
                    <p className="text-[15px] text-rr-charcoal font-medium">{p.note}</p>
                </li>
            ))}
        </ul>
    </Section>
);

// ── 10. Where ──
const Where = () => (
    <Section id="where">
        <Head eyebrow={WHERE.eyebrow} title={WHERE.title} />
        <div className="grid md:grid-cols-2 gap-10 mb-8">
            {CENTRES.map((c) => (
                <div key={c.value} className="border-l-4 border-rr-pink pl-5">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-rr-dark mb-1">{REGION_LABEL[c.value]}</p>
                    <h3 className="text-2xl font-black text-rr-dark uppercase leading-tight">{c.venue}, {c.suburb}</h3>
                    <p className="text-rr-charcoal font-medium mt-2">{c.address}</p>
                    <p className="text-rr-charcoal font-medium">Wednesdays from Wed 28 Oct · 6:00pm and 7:00pm groups</p>
                    <p className="text-sm text-rr-charcoal font-medium mt-2">{NEARBY[c.value]}</p>
                    <a href={c.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 mt-3 min-h-[44px] text-rr-dark font-bold text-sm underline underline-offset-4 decoration-rr-pink">
                        <MapPin className="w-4 h-4 text-rr-pink" /> Get directions
                    </a>
                </div>
            ))}
        </div>
        <p className="text-rr-charcoal font-medium">{WHERE.apart} {WHERE.newSlots}</p>
    </Section>
);

// ── 11. Register ──
const Register = () => (
    <section id="register" className={`${SCROLL_PAD} bg-rr-dark py-14 md:py-20`}>
        <div className="max-w-2xl mx-auto px-5 sm:px-6">
            <Head eyebrow={FORM.eyebrow} title={FORM.title} dark />
            <p className="text-lg text-white/85 font-medium leading-relaxed mb-8"><Rich v={FORM.intro} /></p>
            <JRV2Form />
        </div>
    </section>
);

// ── 12. FAQ (native details/summary: works without JS, keyboard and screen readers) ──
const Faq = () => (
    <Section id="faq">
        <Head eyebrow="Questions" title="Questions parents ask" />
        <div className="border-t border-slate-200">
            {FAQS.map((f) => (
                <details key={f.q} className="group border-b border-slate-200">
                    <summary className="list-none cursor-pointer py-5 min-h-[44px] flex justify-between items-center gap-4">
                        <h3 className="font-bold text-base md:text-lg text-rr-dark normal-case tracking-normal">{f.q}</h3>
                        <ChevronDown className="w-5 h-5 shrink-0 text-rr-charcoal transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="pb-5 text-rr-charcoal font-medium leading-relaxed">
                        <Rich v={f.a} />
                        {f.link && <>{' '}<Link to={f.link.to} className="text-rr-dark font-bold underline underline-offset-2 decoration-rr-pink">{f.link.label}</Link></>}
                    </p>
                </details>
            ))}
        </div>
        <p className="mt-8 text-rr-charcoal font-medium">
            Anything else? Email <a href={`mailto:${FORM.contact}`} className="text-rr-dark font-bold underline decoration-rr-pink">{FORM.contact}</a>.
        </p>
    </Section>
);

// ── Sticky bar on phones (thumb zone), hidden while the form is on screen ──
const StickyBar = () => {
    const [show, setShow] = useState(false);
    useEffect(() => {
        const on = () => {
            const reg = document.getElementById('register')?.getBoundingClientRect();
            const inForm = reg && reg.top < window.innerHeight && reg.bottom > 0;
            setShow(window.scrollY > 500 && !inForm);
        };
        on();
        window.addEventListener('scroll', on, { passive: true });
        return () => window.removeEventListener('scroll', on);
    }, []);
    return (
        <AnimatePresence>
            {show && (
                <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
                    className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-rr-dark border-t border-white/15 px-4 pt-2 pb-3 flex flex-col gap-1.5">
                    <span className="text-white text-xs font-bold text-center">{CTA.sticky}</span>
                    <button type="button" onClick={() => go('register')} className="w-full bg-rr-pink text-white font-black uppercase tracking-wider text-xs rounded-full px-5 py-3 min-h-[44px]">{CTA.primary}</button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const JuniorRoyalsV2 = () => {
    usePageAnalytics('/junior-royals', { sections: SECTIONS });
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col">
            <Navbar variant="junior-royals-v2" />
            <main className="flex-1 w-full overflow-hidden pt-[84px] md:pt-[112px]">
                <MockupBanner />
                <Hero />
                <Matches />
                <Worries />
                <Hour />
                <Skill />
                <Term />
                <Path />
                <Prices />
                <Coaches />
                <Where />
                <Register />
                <Faq />
            </main>
            <Footer />
            <StickyBar />
        </div>
    );
};

export default JuniorRoyalsV2;
