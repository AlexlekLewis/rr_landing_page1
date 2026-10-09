import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Cake, Check, ChevronDown, Clock, MapPin, Shirt, Users } from 'lucide-react';
import Navbar from '../../Navbar';
import Footer from '../../Footer';
import usePageAnalytics from '../../../hooks/usePageAnalytics';
import { Rich } from '../JuniorRoyalsShared';
import { MOCKUP, money } from '../juniorRoyalsData';
import { PILLARS, PRICE } from './jrV2Facts';
import {
    HERO, CTA, PROGRESS, LEARN, PATH, PRICES, COMPARE, COACHES, FORM, FAQS, OPEN_QUESTIONS_V2,
    REGION_LABEL, NEARBY, PHOTOS, V2_CENTRES, TERMS, termTotal,
} from './jrV2Content';
import { HourNumbers, HourRibbon, LaneDots, SkillSteps, Cues, YearStrip } from './JRV2Visuals';
import { StageJourney, ProgressParts, BadgeWall, Certificates } from './JRV2Pathway';
import JRV2Form from './JRV2Form';

// ─────────────────────────────────────────────────────────────
// JUNIOR ROYALS — MOCK-UP VERSION 2 (/junior-royals on previews; version 1 is
// /junior-royals/v1). Restructured 9 Oct 2026 to Alex's order:
//   1 Hero · 2 The Royals Way Progress Tracking and Development System ·
//   3 How your player learns (4 parts) · 4 Coaches at each centre · Price ·
//   5 Form · FAQ.
// More calls to action (Alex): one after every section, plus the sticky bar.
// Photos: Andy's, shown like the rest of the site (rounded tiles, no fades).
// No entrance animation on the hero (it's the LCP element; SEO brief).
// Section ids match JRV2_NAV in Navbar.jsx.
// ─────────────────────────────────────────────────────────────

const SECTIONS = ['hero', 'progress', 'learn', 'coaches', 'prices', 'register', 'faq'];
const SCROLL_PAD = 'scroll-mt-[84px] md:scroll-mt-[112px]';
const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
const ICON = { users: Cake, clock: Clock, pin: MapPin, group: Users };

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

// A call to action after every section (Alex, 9 Oct: more CTA buttons).
const CtaRow = ({ dark, className = 'mt-12' }) => (
    <div className={`${className} flex flex-col sm:flex-row sm:items-center gap-3`}>
        <PrimaryButton className="w-full sm:w-auto" />
        <p className={`text-sm font-semibold ${dark ? 'text-white/85' : 'text-rr-charcoal'}`}>{CTA.under}</p>
    </div>
);

const Tick = ({ children, dark }) => (
    <li className="flex items-start gap-3">
        <Check className="w-5 h-5 text-rr-pink shrink-0 mt-0.5" strokeWidth={3} aria-hidden="true" />
        <span className={`text-[15px] sm:text-base font-medium leading-relaxed ${dark ? 'text-white/85' : 'text-rr-charcoal'}`}>{children}</span>
    </li>
);

// Photos the way the rest of the site shows them (JRT3Overview, LCOverview):
// a rounded tile, the image filling it, a dark gradient at the foot and a short label.
const PhotoTile = ({ src, alt, label, className = 'aspect-[4/5]' }) => (
    <figure className={`relative overflow-hidden rounded-2xl ${className}`}>
        <img src={src} alt={alt} loading="lazy" decoding="async" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-rr-dark/60 to-transparent" aria-hidden="true" />
        {label && <figcaption className="absolute bottom-4 left-4 text-xs font-bold text-white/90 uppercase tracking-widest">{label}</figcaption>}
    </figure>
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
                <div className="mt-5 border-t border-white/20 pt-4">
                    <p className="whitespace-nowrap"><span className="text-white text-4xl font-black">{HERO.price}</span> <span className="text-white/90 text-base font-bold">{HERO.per}</span></p>
                    <p className="text-white/85 text-sm font-semibold mt-1">{HERO.priceNote}</p>
                    <p className="text-white text-sm font-semibold mt-2 flex items-start gap-2"><Shirt className="w-4 h-4 text-rr-light-pink shrink-0 mt-0.5" aria-hidden="true" />{HERO.shirt}</p>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <PrimaryButton className="w-full sm:w-auto" />
                    <button type="button" onClick={() => go('progress')} className="inline-flex items-center justify-center border-2 border-white/40 hover:border-white text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 min-h-[52px]">
                        {CTA.secondary}
                    </button>
                </div>
                <p className="mt-3 text-sm font-semibold text-white">{HERO.noPayment}</p>
                <p className="mt-1 text-sm font-medium text-white/80">{HERO.returning}</p>
            </div>
        </div>
    </section>
);

// ── 2. The Royals Way Progress Tracking and Development System ──
const Progress = () => (
    <section id="progress" className={`${SCROLL_PAD} py-14 md:py-20`} style={{ backgroundImage: 'var(--image-gradient-rr)' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] mb-2 text-white">{PROGRESS.eyebrow}</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[1.05] text-white max-w-4xl">{PROGRESS.title}</h2>
            <div className="w-12 h-1 bg-white mt-4 mb-6" />
            <div className="grid md:grid-cols-[1fr_18rem] gap-8 items-start">
                <div>
                    <p className="text-lg sm:text-xl text-white font-semibold leading-relaxed">{PROGRESS.lead}</p>
                    <p className="mt-3 text-[15px] font-semibold text-white"><Rich v={PROGRESS.starts} /></p>
                    <div className="mt-8"><ProgressParts /></div>
                </div>
                <PhotoTile {...PHOTOS.progress} className="aspect-[4/5] hidden md:block" />
            </div>

            <div className="mt-12 rounded-2xl bg-rr-dark p-6 sm:p-8">
                <BadgeWall />
                <p className="mt-8 text-white/90 text-[15px] font-medium leading-relaxed max-w-3xl">{PROGRESS.perYear}</p>
                <ul className="mt-4 space-y-2 max-w-3xl">
                    {PROGRESS.rules.map((r) => <Tick key={r} dark>{r}</Tick>)}
                </ul>
            </div>

            <h3 className="mt-12 mb-5 text-xl sm:text-2xl font-black uppercase tracking-tight text-white">{PROGRESS.certTitle}</h3>
            <Certificates />
            <CtaRow dark />
        </div>
    </section>
);

// ── 3. How your player learns: four parts in one section ──
const Part = ({ id, n, title, children }) => (
    <div id={id} className={`${SCROLL_PAD} pt-12 first:pt-0`}>
        <h3 className="flex items-baseline gap-3 text-2xl sm:text-3xl font-black uppercase tracking-tight text-rr-dark">
            <span className="text-rr-pink">{n}</span>{title}
        </h3>
        <div className="w-10 h-1 bg-rr-pink mt-3 mb-6" />
        {children}
    </div>
);

const Learn = () => {
    const [how, night, blocks, what] = LEARN.parts;
    return (
        <Section id="learn">
            <Head eyebrow={LEARN.eyebrow} title={LEARN.title} />
            <nav aria-label="In this section" className="flex flex-wrap gap-2 mb-10">
                {LEARN.parts.map((p) => (
                    <a key={p.id} href={`#${p.id}`} onClick={(e) => { e.preventDefault(); go(p.id); }}
                        className="inline-flex items-center gap-2 min-h-[44px] rounded-full border-2 border-slate-200 hover:border-rr-pink px-4 text-sm font-bold text-rr-dark">
                        <span className="text-rr-pink font-black">{p.n}</span>{p.title}
                    </a>
                ))}
            </nav>

            <div className="divide-y divide-slate-200 [&>*]:pb-12">
                <Part {...how}>
                    <div className="grid md:grid-cols-[1fr_16rem] gap-8 items-start">
                        <div>
                            <ul className="space-y-3">{LEARN.how.points.map((p) => <Tick key={p}><span className="text-rr-dark font-semibold">{p}</span></Tick>)}</ul>
                            <h4 className="text-lg font-black uppercase text-rr-dark mt-8 mb-4">{LEARN.how.pillarsTitle}</h4>
                            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                                {PILLARS.map((p) => (
                                    <li key={p.name} className="border-l-4 border-rr-pink pl-4">
                                        <p className="font-black text-rr-dark">{p.name}</p>
                                        <p className="text-[15px] text-rr-charcoal font-medium">{p.note}</p>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-8 text-[15px] text-rr-dark font-semibold leading-relaxed border-l-4 border-rr-blue pl-4"><Rich v={LEARN.how.matches} /></p>
                        </div>
                        <PhotoTile {...PHOTOS.how} />
                    </div>
                </Part>

                <Part {...night}>
                    <p className="text-lg text-rr-dark font-semibold mb-6">{LEARN.night.intro}</p>
                    <HourNumbers items={LEARN.night.bigNumbers} />
                    <div className="grid md:grid-cols-[1fr_auto_14rem] gap-8 mt-8 items-start">
                        <div>
                            <HourRibbon />
                            <p className="text-sm text-rr-charcoal font-medium mt-2">{LEARN.night.guide}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <LaneDots players={PRICE.perLane} label="Your player’s lane" />
                            <p className="text-[15px] text-rr-charcoal font-medium leading-relaxed mt-4 max-w-[14rem]">{LEARN.night.lane}</p>
                        </div>
                        <PhotoTile {...PHOTOS.night} />
                    </div>
                </Part>

                <Part {...blocks}>
                    <p className="text-lg text-rr-dark font-semibold mb-8 max-w-3xl">{LEARN.blocks.intro}</p>
                    <SkillSteps />
                    <div className="grid grid-cols-2 gap-4 mt-8 max-w-xl">
                        {PHOTOS.blocks.map((p) => <PhotoTile key={p.src} {...p} />)}
                    </div>
                    <p className="text-[15px] text-rr-dark font-semibold leading-relaxed mt-10 mb-5 max-w-3xl">{LEARN.blocks.cuesTitle}</p>
                    <Cues />
                </Part>

                <Part {...what}>
                    <p className="text-lg text-rr-dark font-semibold max-w-3xl">{LEARN.what.intro}</p>
                    <p className="text-[15px] text-rr-charcoal font-medium mt-2 mb-6 max-w-3xl"><Rich v={LEARN.what.placement} /></p>
                    <StageJourney />
                </Part>
            </div>
            <CtaRow className="mt-4" />
        </Section>
    );
};

// ── 4. Coaches at each centre ──
const Coaches = () => (
    <Section id="coaches" tone="slate">
        <Head eyebrow={COACHES.eyebrow} title={COACHES.title} />
        <p className="text-lg text-rr-dark font-semibold mb-8 max-w-3xl">{COACHES.intro}</p>
        <div className="grid md:grid-cols-3 gap-5">
            {V2_CENTRES.map((c) => (
                <article key={c.value} className={`rounded-2xl bg-white border-2 ${c.comingSoon ? 'border-dashed border-slate-300' : 'border-slate-200'} p-5 flex flex-col`}>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-rr-dark">{REGION_LABEL[c.value]}</p>
                    {c.comingSoon && <p className="mt-2 inline-block self-start bg-rr-pink text-white text-xs font-black uppercase tracking-wider rounded-full px-3 py-1">{COACHES.comingSoon}</p>}
                    <h3 className="text-xl font-black text-rr-dark uppercase leading-tight mt-2"><Rich v={c.venue} />{c.comingSoon ? '' : `, ${c.suburb}`}</h3>
                    <p className="text-sm text-rr-charcoal font-medium mt-1">{c.address}</p>
                    {!c.comingSoon && <p className="text-sm text-rr-charcoal font-medium">{COACHES.times}</p>}
                    <a href={c.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 mt-2 min-h-[44px] text-rr-dark font-bold text-sm underline underline-offset-4 decoration-rr-pink">
                        <MapPin className="w-4 h-4 text-rr-pink" aria-hidden="true" /> Get directions
                    </a>
                    {c.comingSoon ? (
                        <p className="text-[15px] text-rr-dark font-semibold leading-relaxed mt-3">{COACHES.comingSoonNote}</p>
                    ) : (
                        <div className="mt-4 border-t border-slate-200 pt-4">
                            <div className="flex gap-4 items-start">
                                <img src={c.coach.img} alt={c.coach.name} loading="lazy" decoding="async" className="w-16 h-16 rounded-full object-cover shrink-0" />
                                <div>
                                    <p className="text-lg font-black text-rr-dark leading-tight">{c.coach.name}</p>
                                    <p className="text-rr-dark text-xs font-bold uppercase tracking-widest mt-1"><Rich v={c.coach.jrRole} /></p>
                                </div>
                            </div>
                            <p className="text-sm text-rr-charcoal font-medium leading-relaxed mt-3">{c.coach.credentials.join(' · ')}</p>
                            <p className="text-sm font-semibold mt-3"><Rich v={COACHES.more} /></p>
                        </div>
                    )}
                    <p className="text-xs text-rr-charcoal font-medium mt-auto pt-4">{NEARBY[c.value]}</p>
                </article>
            ))}
        </div>
        <div className="grid md:grid-cols-[1fr_14rem] gap-8 mt-10 items-start">
            <div>
                <p className="text-[15px] text-rr-charcoal font-medium leading-relaxed"><Rich v={COACHES.course} /></p>
                <p className="text-[15px] text-rr-dark font-semibold leading-relaxed mt-3">{COACHES.notMeet}</p>
                <p className="text-[15px] text-rr-charcoal font-medium leading-relaxed mt-3">{COACHES.apart}</p>
            </div>
            <PhotoTile {...PHOTOS.coaches} className="aspect-[4/5] hidden md:block" />
        </div>
        <CtaRow />
    </Section>
);

// ── Price ──
const Prices = () => (
    <Section id="prices">
        <Head eyebrow={PRICES.eyebrow} title={PRICES.title} />
        <div className="grid md:grid-cols-2 gap-10">
            <div className="border-t-4 border-rr-pink pt-5">
                <p><span className="text-6xl font-black text-rr-dark">{PRICES.price}</span> <span className="text-xl font-bold text-rr-charcoal">{PRICES.per}</span></p>
                <p className="text-[15px] font-bold text-rr-dark mt-1">{PRICES.perNote}</p>
                <ul className="mt-5 space-y-2">{PRICES.includes.map((t) => <Tick key={t}><span className="font-semibold text-rr-dark">{t}</span></Tick>)}</ul>
                <div className="mt-6 rounded-2xl border-2 border-slate-200 p-5">
                    <p className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-rr-dark"><Shirt className="w-5 h-5 text-rr-pink" aria-hidden="true" />{PRICES.shirtTitle}</p>
                    <p className="text-[15px] text-rr-charcoal font-medium leading-relaxed mt-2">{PRICES.shirt}</p>
                    <p className="text-[15px] text-rr-dark font-bold leading-relaxed mt-2"><Rich v={PRICES.shirtOffer} /></p>
                </div>
            </div>
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
                    <Tick><Rich v={PRICES.cover} /></Tick>
                </ul>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mt-12">
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
                                <th className="py-2 pr-2">Term</th><th className="py-2 pr-2 text-right">Weeks</th><th className="py-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TERMS.map((c) => (
                                <tr key={c.label} className="border-b border-slate-200 align-top">
                                    <td className="py-2.5 pr-2"><span className="block font-black text-rr-dark">{c.label}</span><span className="block text-xs text-rr-charcoal font-medium">{c.dates}</span></td>
                                    <td className="py-2.5 pr-2 text-right font-bold text-rr-dark">{c.sessions}</td>
                                    <td className="py-2.5 text-right font-black text-rr-dark whitespace-nowrap">{money(termTotal(c.sessions))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="text-xs text-rr-charcoal font-medium mt-2 pb-4">{PRICES.calendarNote}</p>
                </details>
            </div>
            <div className="border-l-4 border-rr-pink pl-5">
                <h3 className="text-xl font-black uppercase text-rr-dark mb-4">{COMPARE.title}</h3>
                <ul className="border-t-2 border-rr-dark">
                    {COMPARE.rows.map((r) => (
                        <li key={r.what} className="border-b border-slate-200 py-3">
                            <p className="flex justify-between gap-3">
                                <span className={`font-bold ${r.ours ? 'text-rr-dark' : 'text-rr-charcoal'}`}>{r.what}</span>
                                <span className="font-black text-rr-dark whitespace-nowrap">{r.price} <span className="text-xs font-bold text-rr-charcoal">an hour</span></span>
                            </p>
                            <p className="text-sm font-medium text-rr-charcoal">Group size: {r.players}</p>
                        </li>
                    ))}
                </ul>
                <p className="text-xs text-rr-charcoal font-medium mt-2">{COMPARE.source} <Rich v={COMPARE.toConfirm} /></p>
            </div>
        </div>
        <CtaRow />
    </Section>
);

// ── 5. Register ──
const Register = () => (
    <section id="register" className={`${SCROLL_PAD} bg-rr-dark py-14 md:py-20`}>
        <div className="max-w-2xl mx-auto px-5 sm:px-6">
            <Head eyebrow={FORM.eyebrow} title={FORM.title} dark />
            <p className="text-lg text-white/85 font-medium leading-relaxed mb-8"><Rich v={FORM.intro} /></p>
            <JRV2Form />
        </div>
    </section>
);

// ── FAQ (native details/summary: works without JS, keyboard and screen readers) ──
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
        <CtaRow />
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
                <Progress />
                <Learn />
                <Coaches />
                <Prices />
                <Register />
                <Faq />
            </main>
            <Footer />
            <StickyBar />
        </div>
    );
};

export default JuniorRoyalsV2;
