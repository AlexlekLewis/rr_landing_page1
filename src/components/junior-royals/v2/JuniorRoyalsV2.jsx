import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Award, BadgeCheck, Cake, CalendarCheck, Check, ChevronDown, ClipboardCheck, ClipboardList, Clock, Eye, FileText, GraduationCap, HeartHandshake, Layers, ListChecks, MapPin, MessageCircle, RefreshCw, Repeat, ShieldCheck, Shirt, Smile, Sprout, Sun, Target, TrendingUp, Trophy, User, Users, X } from 'lucide-react';
import Navbar from '../../Navbar';
import Footer from '../../Footer';
import usePageAnalytics from '../../../hooks/usePageAnalytics';
import { Rich } from '../JuniorRoyalsShared';
import { MOCKUP, money } from '../juniorRoyalsData';
import { PILLARS, PRICE } from './jrV2Facts';
import {
    HERO, CTA, VALUE, PROGRESS, LEARN, PATH, PRICES, PAY_NOW, TERMS_POPUP, COMPARE, COACHES, FORM, FAQS, TRY,
    REGION_LABEL, NEARBY, PHOTOS, V2_CENTRES, TERMS, termTotal,
} from './jrV2Content';
import { HourNumbers, HourRibbon, LaneDots, SkillSteps, Cues } from './JRV2Visuals';
import { StageJourney } from './JRV2Pathway';
import { PhaseBadge } from './JRV2SampleBadges';
import { ActionCards } from './JRV2ActionCards';
import JRV2Form from './JRV2Form';
import JRV2ComeAndTry, { TRY_OPEN_EVENT } from './JRV2ComeAndTry';

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

const SECTIONS = ['hero', 'progress', 'value', 'learn', 'coaches', 'prices', 'register', 'faq'];
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

// ── Review strip (mock-up only): a safety label, nothing to decide on it.
// Open decisions are sent to Alex as a separate note (Alex, 12 Oct 2026). ──
const MockupBanner = () => {
    if (!MOCKUP) return null;
    return (
        <div className="bg-yellow-300 text-rr-dark">
            <div className="max-w-6xl mx-auto px-5 sm:px-6 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                <p className="text-sm font-bold"><span className="font-black uppercase tracking-wider">Mock-up for review. Not live.</span> The form saves nothing.</p>
                <Link to="/junior-royals/v1" data-review-only className="text-sm font-bold underline py-1">See version 1</Link>
            </div>
        </div>
    );
};

// ── 1. Hero ──
const Hero = () => (
    <section id="hero" className={`${SCROLL_PAD} relative overflow-hidden bg-rr-dark`}>
        {/* The photo (Alex, 12 Oct 2026: "the player's behind the blend … push the image
            to the right into the four-fifths of the page"). From tablet width up the
            photo is pinned so the batter, who stands 59% across the picture, sits
            four-fifths of the way across the hero, clear of the text and of the dark
            blend. On phones the text takes the full width, so the photo stays a dim
            backdrop. */}
        <img src="/assets/little-crickets-nets.jpeg" alt="A young batter playing a drive in the indoor nets, in front of a Rajasthan Royals Academy Melbourne banner"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover object-[75%_center] md:inset-auto md:top-0 md:left-[80%] md:h-full md:w-auto md:min-w-[55%] md:max-w-none md:-translate-x-[59%] md:object-[59%_center]" />
        {/* The blend: solid behind the text, clear by the time it reaches the batter. */}
        <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/90 to-rr-dark/40 md:bg-[linear-gradient(90deg,#111921_0%,#111921_46%,rgba(17,25,33,0.72)_60%,rgba(17,25,33,0.14)_78%,rgba(17,25,33,0.1)_100%)]" />
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 pt-10 pb-12 md:pt-16 md:pb-20">
            <div className="max-w-md lg:max-w-xl">
                <p className="text-[11px] font-black text-white uppercase tracking-[0.25em] mb-3">{HERO.eyebrow}</p>
                <h1 className="text-white uppercase font-black leading-none tracking-tight">
                    <span className="block text-4xl sm:text-6xl md:text-7xl">{HERO.title}</span>
                    <span className="block text-base sm:text-xl normal-case tracking-normal font-bold text-white/90 mt-2">{HERO.titleSub}</span>
                </h1>
                <ul className="mt-6 space-y-3.5">
                    {HERO.facts.map((f) => {
                        const Icon = ICON[f.icon];
                        return (
                            <li key={f.k} className="flex items-start gap-3 text-white text-[15px] sm:text-base font-semibold leading-snug">
                                <Icon className="w-5 h-5 text-rr-light-pink shrink-0 mt-0.5" aria-label={f.k} />
                                <span>
                                    {f.v}
                                    {f.lines && f.lines.map((ln) => <span key={ln} className="block font-black text-white mt-1">{ln}</span>)}
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
                <div className="mt-6"><PrimaryButton className="w-full sm:w-auto" /></div>
                <p className="mt-3 text-sm font-semibold text-white">{HERO.noPayment}</p>
            </div>
        </div>
    </section>
);

// ── The value, for the player and for the parent (Alex, 11 Oct 2026) ──
const VALUE_ICON = { bat: Repeat, one: Target, cue: MessageCircle, game: Trophy, badge: BadgeCheck, joy: Smile, card: ClipboardList, plan: ListChecks, safe: ShieldCheck, group: Users, same: GraduationCap, place: CalendarCheck };

const ValueColumn = ({ col, accent }) => (
    <div className={`border-t-4 ${accent} pt-5`}>
        <h3 className="text-2xl font-black uppercase text-rr-dark">{col.title}</h3>
        <ul className="mt-5 space-y-5">
            {col.points.map((pt) => {
                const Icon = VALUE_ICON[pt.icon];
                return (
                    <li key={pt.head} className="flex gap-4">
                        <span className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundImage: 'var(--image-gradient-rr)' }}>
                            <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                        </span>
                        <div>
                            <p className="text-lg font-black text-rr-dark leading-tight">{pt.head}</p>
                            <p className="text-[15px] text-rr-charcoal font-medium leading-snug mt-0.5"><Rich v={pt.body} /></p>
                        </div>
                    </li>
                );
            })}
        </ul>
    </div>
);

const Value = () => (
    <Section id="value" tone="slate">
        <Head eyebrow={VALUE.eyebrow} title={VALUE.title} />
        <p className="text-lg sm:text-xl text-rr-dark font-semibold max-w-3xl leading-relaxed"><Rich v={VALUE.lead} /></p>
        <div className="mt-10 mb-12 border-t-4 border-rr-pink pt-6">
            <h3 className="text-xl sm:text-2xl font-black uppercase text-rr-dark">{VALUE.royals.title}</h3>
            <dl className="mt-5 grid md:grid-cols-2 gap-x-10 gap-y-6">
                {VALUE.royals.items.map((it) => (
                    <div key={it.q}>
                        <dt className="text-rr-pink text-sm font-black uppercase tracking-[0.15em]">{it.q}</dt>
                        <dd className="text-rr-dark text-[16px] font-medium leading-relaxed mt-1.5"><Rich v={it.a} /></dd>
                    </div>
                ))}
            </dl>
        </div>
        <div className="grid md:grid-cols-2 gap-10">
            <ValueColumn col={VALUE.player} accent="border-rr-pink" />
            <ValueColumn col={VALUE.parent} accent="border-rr-blue" />
        </div>
        <CtaRow />
    </Section>
);

// ── 2. The Royals Way Progress Tracking and Development System ──
// "The real feature of this program" (Alex, 12 Oct 2026). In order: what it is →
// how it works (the centrepiece: train on a skill, show it, earn the badge, move on)
// → how a parent knows they are getting what they pay for (quick tiles) → the
// Player Performance Portal (parents track progress; every player at their own
// rate) → the phases in one line, with a button to the example badges. Light, open
// and airy; pink accents; no gradient or dark panels.
const STEP_ICON = { train: Repeat, show: ClipboardCheck, next: ArrowRight };
const WHY_ICON = { badge: BadgeCheck, earned: ClipboardCheck, record: ClipboardList, feel: Smile, climb: TrendingUp, pace: Sprout };
const PORTAL_ICON = { badge: BadgeCheck, eye: Eye, record: ClipboardList };
const TOGETHER_ICON = { coach: GraduationCap, player: Smile, parent: HeartHandshake };
// Scroll to "How your player learns" and open its fourth card, where the phases and their example badges are.
const openPhases = () => { go('learn'); window.setTimeout(() => document.getElementById('learn-what')?.click(), 500); };

const Progress = () => (
    <Section id="progress">
        <Head eyebrow={PROGRESS.eyebrow} title={PROGRESS.title} />
        <div className="grid md:grid-cols-[1fr_18rem] gap-10 items-start">
            <p className="text-xl sm:text-2xl text-rr-dark font-semibold leading-relaxed">{PROGRESS.lead}</p>
            <PhotoTile {...PHOTOS.progress} className="aspect-[4/3] hidden md:block" />
        </div>

        {/* How it works: the centrepiece of the section. Big steps, a real badge at step 3. */}
        <div className="mt-10 rounded-3xl bg-slate-50 border-t-8 border-rr-pink px-5 py-8 sm:px-10 sm:py-12">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-rr-pink">{PROGRESS.stepsEyebrow}</p>
            <h3 className="mt-2 text-3xl sm:text-5xl font-black uppercase tracking-tight leading-none text-rr-dark">{PROGRESS.stepsTitle}</h3>
            <ol className="relative mt-10 grid gap-y-8 md:grid-cols-4 md:gap-x-5">
                <li aria-hidden="true" className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-1 rounded-full bg-rr-pink" />
                <li aria-hidden="true" className="md:hidden absolute left-12 top-12 bottom-12 w-1 -translate-x-1/2 rounded-full bg-rr-pink" />
                {PROGRESS.steps.map((st, i) => {
                    const Icon = STEP_ICON[st.icon];
                    return (
                        <li key={st.head} className="relative flex md:flex-col items-center md:text-center gap-5 md:gap-0">
                            <span className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                                {Icon
                                    ? <span className="w-24 h-24 rounded-full bg-rr-pink ring-8 ring-slate-50 flex items-center justify-center"><Icon className="w-10 h-10 text-white" strokeWidth={2.4} aria-hidden="true" /></span>
                                    : <span className="w-24 h-24 rounded-full bg-slate-50 ring-8 ring-slate-50 flex items-center justify-center"><PhaseBadge name={PROGRESS.stepsBadge} kind="bat" className="w-24 h-24" /></span>}
                                <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-rr-dark text-white text-sm font-black flex items-center justify-center">{i + 1}</span>
                            </span>
                            <span className="md:mt-5">
                                <span className="block text-rr-dark text-xl sm:text-2xl font-black uppercase leading-none">{st.head}</span>
                                <span className="block text-rr-charcoal text-base font-medium leading-snug mt-2">{st.body}</span>
                            </span>
                        </li>
                    );
                })}
            </ol>
            <ul className="mt-10 space-y-2 max-w-3xl">
                {PROGRESS.rules.map((r) => <Tick key={r}><span className="text-rr-dark font-semibold">{r}</span></Tick>)}
            </ul>
        </div>

        {/* Shared work: the coach, the player and the parent each have a part (Alex, 12 Oct). */}
        <div className="mt-16">
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight leading-none text-rr-dark">{PROGRESS.togetherTitle}</h3>
            <p className="mt-4 text-[17px] sm:text-lg font-semibold text-rr-dark leading-relaxed max-w-2xl">{PROGRESS.togetherLead}</p>
            <ol className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {PROGRESS.together.map((t) => {
                    const Icon = TOGETHER_ICON[t.icon];
                    return (
                        <li key={t.head} className="rounded-2xl border-2 border-slate-200 p-5 flex md:flex-col items-start md:items-center md:text-center gap-4">
                            <span className="w-16 h-16 rounded-full bg-rr-pink flex items-center justify-center shrink-0"><Icon className="w-8 h-8 text-white" aria-hidden="true" /></span>
                            <div>
                                <p className="text-rr-dark text-xl font-black uppercase leading-tight">{t.head}</p>
                                <p className="text-rr-charcoal text-base font-medium leading-snug mt-1.5">{t.body}</p>
                            </div>
                        </li>
                    );
                })}
            </ol>
            <p className="mt-6 border-l-4 border-rr-pink pl-4 text-[17px] sm:text-lg font-semibold text-rr-dark leading-relaxed max-w-3xl">{PROGRESS.togetherNote}</p>
        </div>

        {/* Why it matters: the question a parent asks before paying, as six quick tiles. */}
        <div className="mt-16">
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight leading-none text-rr-dark max-w-3xl">{PROGRESS.whyTitle}</h3>
            <p className="mt-4 text-[17px] sm:text-lg font-semibold text-rr-dark leading-relaxed max-w-2xl">{PROGRESS.whyLead}</p>
            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PROGRESS.why.map((w) => {
                    const Icon = WHY_ICON[w.icon];
                    return (
                        <li key={w.head} className="rounded-2xl border-2 border-slate-200 p-5 flex items-start gap-4">
                            <span className="w-14 h-14 rounded-full bg-rr-pink flex items-center justify-center shrink-0"><Icon className="w-7 h-7 text-white" aria-hidden="true" /></span>
                            <div>
                                <p className="text-rr-dark text-lg font-black uppercase leading-tight">{w.head}</p>
                                <p className="text-rr-charcoal text-[15px] sm:text-base font-medium leading-snug mt-1.5">{w.body}</p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>

        {/* The portal's role for Junior Royals: parents track progress; each player at their own rate. */}
        <div className="mt-6 rounded-3xl bg-slate-50 border-t-8 border-rr-pink px-5 py-8 sm:px-10 sm:py-10 grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div>
                <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight leading-none text-rr-dark">{PROGRESS.portalTitle}</h3>
                <p className="mt-4 text-[17px] sm:text-lg font-bold text-rr-dark leading-snug">{PROGRESS.portal.lead}</p>
                <p className="mt-5 border-l-4 border-rr-pink pl-4 text-[17px] font-semibold text-rr-dark leading-relaxed">{PROGRESS.portal.own}</p>
            </div>
            <ul className="space-y-5">
                {PROGRESS.portal.points.map((pt) => {
                    const Icon = PORTAL_ICON[pt.icon];
                    return (
                        <li key={pt.text} className="flex items-center gap-4">
                            <span className="w-14 h-14 rounded-full bg-rr-pink flex items-center justify-center shrink-0"><Icon className="w-7 h-7 text-white" aria-hidden="true" /></span>
                            <span className="text-rr-dark text-[17px] font-semibold leading-snug">{pt.text}</span>
                        </li>
                    );
                })}
            </ul>
        </div>

        {/* The phases, in one line; the detail and the example badges are in "What your player learns". */}
        <div className="mt-14 border-t border-slate-200 pt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
                <p className="text-2xl sm:text-3xl font-black text-rr-dark leading-tight">{PROGRESS.phasesLine[0]}<span className="text-rr-pink">{PROGRESS.phasesLine[1]}</span></p>
                <p className="mt-2 text-[15px] sm:text-base font-medium text-rr-charcoal leading-relaxed max-w-2xl">{PROGRESS.phasesNote}</p>
            </div>
            <button type="button" onClick={openPhases}
                className="shrink-0 inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-full border-2 border-rr-dark text-rr-dark hover:bg-rr-dark hover:text-white font-black uppercase tracking-wider text-sm transition-colors">
                {PROGRESS.phasesButton}<ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
        </div>

        <CtaRow />
    </Section>
);

// ── 3. How your player learns: four action cards (Alex, 11 Oct 2026) ──
// A short summary on each card; the detail opens on hover or click (computer) or
// on tap (phone). The visuals live inside: the hour, the 3-week block, the stages.
const LEARN_ICON = { 'learn-how': GraduationCap, 'learn-night': Clock, 'learn-blocks': Layers, 'learn-what': ListChecks };

const HowDetail = () => (
    <div className="grid md:grid-cols-[1fr_15rem] gap-8 items-start">
        <div>
            <ul className="space-y-3">{LEARN.how.points.map((p) => <Tick key={p}><span className="text-rr-dark font-semibold">{p}</span></Tick>)}</ul>
            <h4 className="text-lg font-black uppercase text-rr-dark mt-8">{LEARN.how.pillarsTitle}</h4>
            <p className="text-[15px] text-rr-charcoal font-medium mb-4">{LEARN.how.pillarsLead}</p>
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
);

const NightDetail = () => (
    <>
        <p className="text-lg text-rr-dark font-semibold mb-6">{LEARN.night.intro}</p>
        <HourNumbers items={LEARN.night.bigNumbers} />
        <div className="grid md:grid-cols-[1fr_auto_13rem] gap-8 mt-8 items-start">
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
    </>
);

const BlocksDetail = () => (
    <>
        <p className="text-lg text-rr-dark font-semibold mb-8 max-w-3xl">{LEARN.blocks.intro}</p>
        <SkillSteps />
        <p className="text-[15px] text-rr-dark font-semibold leading-relaxed mt-10 mb-5 max-w-3xl">{LEARN.blocks.cuesTitle}</p>
        <Cues />
        <div className="grid grid-cols-2 gap-4 mt-8 max-w-md">
            {PHOTOS.blocks.map((p) => <PhotoTile key={p.src} {...p} />)}
        </div>
    </>
);

const WhatDetail = () => (
    <>
        <p className="text-lg text-rr-dark font-semibold max-w-3xl">{LEARN.what.intro}</p>
        <p className="text-[15px] text-rr-charcoal font-medium mt-2 mb-6 max-w-3xl"><Rich v={LEARN.what.placement} /></p>
        <StageJourney />
    </>
);

const LEARN_DETAIL = { 'learn-how': <HowDetail />, 'learn-night': <NightDetail />, 'learn-blocks': <BlocksDetail />, 'learn-what': <WhatDetail /> };

const Learn = () => (
    <Section id="learn">
        <Head eyebrow={LEARN.eyebrow} title={LEARN.title} />
        <p className="text-lg text-rr-dark font-semibold max-w-3xl mb-8">{LEARN.lead}</p>
        <ActionCards items={LEARN.parts.map((p) => ({ ...p, Icon: LEARN_ICON[p.id], content: LEARN_DETAIL[p.id] }))} />
        <CtaRow />
    </Section>
);

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

// ── How enrolment works, as a graphic (Alex, 12 Oct 2026: "replaced by graphics …
// we don't want all of that bulk text making the site look messy"). Five steps
// in a row on a computer, down the page on a phone. The detail is in the terms
// pop-up, opened by the button underneath.
const FLOW_ICON = { enrol: ClipboardCheck, first: CalendarCheck, weekly: Repeat, holiday: Sun, renew: RefreshCw };

const TermsModal = ({ onClose }) => {
    const panelRef = useRef(null);
    const closeRef = useRef(null);
    const onCloseRef = useRef(onClose);
    useEffect(() => { onCloseRef.current = onClose; });
    // Open: lock page scroll, focus Close, Esc closes, Tab stays inside. Close: give focus back.
    useEffect(() => {
        const opener = document.activeElement;
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        const onKey = (e) => {
            if (e.key === 'Escape') { onCloseRef.current(); return; }
            if (e.key !== 'Tab' || !panelRef.current) return;
            const f = [...panelRef.current.querySelectorAll('button, a[href]')].filter((el) => !el.disabled);
            if (!f.length) return;
            if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
            else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
        };
        document.addEventListener('keydown', onKey);
        return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; opener?.focus?.(); };
    }, []);
    return createPortal(
        <div data-jr-terms-modal className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
            <div className="absolute inset-0 bg-rr-dark/80" onClick={onClose} aria-hidden="true" />
            <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="jr-terms-title"
                className="relative w-full md:max-w-2xl h-[100dvh] md:h-auto md:max-h-[90vh] overflow-y-auto bg-white md:rounded-2xl">
                <div className="sticky top-0 bg-white border-b border-slate-200 px-5 sm:px-8 py-4 flex items-start justify-between gap-4">
                    <h2 id="jr-terms-title" className="text-xl sm:text-2xl font-black uppercase text-rr-dark leading-tight">{TERMS_POPUP.title}</h2>
                    <button ref={closeRef} type="button" onClick={onClose} aria-label={TERMS_POPUP.close}
                        className="shrink-0 w-11 h-11 rounded-full bg-rr-dark text-white flex items-center justify-center">
                        <X className="w-5 h-5" strokeWidth={3} />
                    </button>
                </div>
                <div className="px-5 sm:px-8 py-6">
                    <p className="text-[15px] font-semibold text-rr-dark leading-relaxed"><Rich v={TERMS_POPUP.intro} /></p>
                    <dl className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
                        {TERMS_POPUP.items.map((it) => (
                            <div key={it.head} className="py-4">
                                <dt className="text-sm font-black uppercase tracking-[0.12em] text-rr-pink">{it.head}</dt>
                                <dd className="mt-1.5 text-[15px] sm:text-base font-medium text-rr-dark leading-relaxed"><Rich v={it.body} /></dd>
                            </div>
                        ))}
                    </dl>
                    <button type="button" onClick={onClose} className="mt-6 inline-flex items-center justify-center min-h-[48px] px-7 rounded-full border-2 border-rr-dark text-rr-dark font-black uppercase tracking-wider text-sm">{TERMS_POPUP.close}</button>
                </div>
            </div>
        </div>,
        document.body,
    );
};

const EnrolFlow = () => {
    const [terms, setTerms] = useState(false);
    return (
        <div className="mt-12 border-t border-slate-200 pt-10">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-rr-dark mb-8">{PRICES.flowTitle}</h3>
            <ol className="relative grid gap-y-6 md:grid-cols-5 md:gap-x-3">
                <li aria-hidden="true" className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-rr-pink" />
                <li aria-hidden="true" className="md:hidden absolute left-8 top-8 bottom-8 w-0.5 -translate-x-1/2 bg-rr-pink" />
                {PRICES.flow.map((st, i) => {
                    const Icon = FLOW_ICON[st.icon];
                    return (
                        <li key={st.head} className="relative flex md:flex-col items-center md:text-center gap-4 md:gap-0">
                            <span className="relative w-16 h-16 rounded-full bg-rr-pink flex items-center justify-center shrink-0 ring-8 ring-white">
                                <Icon className="w-7 h-7 text-white" aria-hidden="true" />
                                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rr-dark text-white text-xs font-black flex items-center justify-center">{i + 1}</span>
                            </span>
                            <span className="md:mt-4">
                                <span className="block text-rr-dark text-lg font-black uppercase leading-tight">{st.head}</span>
                                <span className="block text-rr-charcoal text-[15px] font-medium leading-snug mt-1">{st.body}</span>
                            </span>
                        </li>
                    );
                })}
            </ol>
            <p className="mt-8 flex items-center gap-2 text-rr-dark text-[15px] sm:text-base font-bold"><RefreshCw className="w-5 h-5 text-rr-pink shrink-0" aria-hidden="true" />{PRICES.flowRepeat}</p>
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <p className="text-rr-charcoal text-[15px] sm:text-base font-medium leading-relaxed max-w-xl">{PRICES.stopShort}</p>
                <button type="button" data-jr-terms-open onClick={() => setTerms(true)} aria-haspopup="dialog"
                    className="shrink-0 inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-full border-2 border-rr-dark text-rr-dark hover:bg-rr-dark hover:text-white font-black uppercase tracking-wider text-sm transition-colors">
                    <FileText className="w-4 h-4" aria-hidden="true" />{PRICES.termsButton}
                </button>
            </div>
            {terms && <TermsModal onClose={() => setTerms(false)} />}
        </div>
    );
};

// ── How we compare (Alex, 12 Oct 2026: "give visual precedence on how we compare
// versus other academies"). Junior Royals comes first, large and pink; the others
// are smaller and grey. Each small figure is one player in a group: for a range
// ("3 to 10") the smallest group is drawn solid and the rest faint. ──
const Figures = ({ solid, faint, ours }) => (
    <span className="flex flex-wrap gap-1" aria-hidden="true">
        {Array.from({ length: solid + faint }, (_, i) => (
            <User key={i} strokeWidth={ours ? 2.6 : 2.2}
                className={ours ? 'w-7 h-7 sm:w-8 sm:h-8 text-rr-pink' : `w-5 h-5 ${i < solid ? 'text-slate-500' : 'text-slate-300'}`} />
        ))}
    </span>
);

const Compare = () => {
    const ours = COMPARE.rows.find((r) => r.ours);
    const others = COMPARE.rows.filter((r) => !r.ours);
    return (
        <div data-jr-compare className="mt-12 border-t border-slate-200 pt-10">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-rr-dark mb-6">{COMPARE.title}</h3>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div data-jr-compare-ours className="rounded-2xl border-2 border-rr-pink overflow-hidden flex flex-col">
                    <p className="bg-rr-pink text-white px-5 sm:px-6 py-3 flex items-center gap-2 text-base font-black uppercase tracking-[0.12em]">
                        <BadgeCheck className="w-5 h-5 shrink-0" aria-hidden="true" />{ours.what}
                    </p>
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-center">
                        <Figures {...ours.figures} ours />
                        <p className="mt-3 text-xl sm:text-2xl font-black text-rr-dark leading-tight">{ours.group}</p>
                        <p className="mt-5">
                            <span className="text-4xl sm:text-5xl font-black text-rr-dark">{ours.price}</span>{' '}
                            <span className="text-lg font-bold text-rr-charcoal">{COMPARE.per}</span>{' '}
                            <span className="text-sm font-bold text-rr-charcoal whitespace-nowrap">{ours.gst}</span>
                        </p>
                    </div>
                </div>
                <ul className="grid gap-4">
                    {others.map((r) => (
                        <li key={r.what} data-jr-compare-other className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                            <p className="text-sm font-bold uppercase tracking-wider text-slate-600">{r.what}</p>
                            <div className="mt-3"><Figures {...r.figures} /></div>
                            <p className="mt-2 text-[15px] font-semibold text-slate-600">{r.group}</p>
                            <p className="mt-2 text-slate-600"><span className="text-2xl font-bold">{r.price}</span> <span className="text-sm font-semibold">{COMPARE.per}</span></p>
                        </li>
                    ))}
                </ul>
            </div>
            <p className="text-xs text-rr-charcoal font-medium mt-3">{COMPARE.source}</p>
        </div>
    );
};

// ── Every term and what it costs: a drop-down, closed until it is tapped
// (Alex, 12 Oct 2026). Native details/summary, like the FAQ. ──
const TermCosts = () => (
    <details data-jr-term-costs className="group mt-10 max-w-3xl rounded-2xl border-2 border-slate-200 open:border-rr-dark">
        <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer px-5 py-4 min-h-[60px] flex items-center justify-between gap-4">
            <h3 className="flex items-center gap-3 text-lg sm:text-xl font-black uppercase text-rr-dark leading-tight">
                <CalendarCheck className="w-5 h-5 text-rr-pink shrink-0" aria-hidden="true" />{PRICES.calendarTitle}
            </h3>
            <span className="shrink-0 w-9 h-9 rounded-full bg-rr-dark text-white flex items-center justify-center">
                <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" strokeWidth={3} aria-hidden="true" />
            </span>
        </summary>
        <div className="px-5 pb-5">
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
            <p className="text-xs text-rr-charcoal font-medium mt-2">{PRICES.calendarNote}</p>
        </div>
    </details>
);

// ── Pay now: the two Stripe links ──
const PayNow = () => (
    <div data-jr-pay className="mt-10 rounded-2xl bg-rr-dark p-6 sm:p-8">
        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">{PAY_NOW.title}</h3>
        <p className="text-white/80 text-[15px] font-medium leading-relaxed mt-2 max-w-2xl">{PAY_NOW.lead}</p>
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {PAY_NOW.options.map((o) => (
                <div key={o.key} className="rounded-xl bg-white p-5 flex flex-col">
                    <p className="text-sm font-black uppercase tracking-wider text-rr-pink">{o.head}</p>
                    <p className="mt-1"><span className="text-4xl font-black text-rr-dark">{o.price}</span> <span className="text-lg font-bold text-rr-charcoal">{o.per}</span></p>
                    <p className="text-[15px] text-rr-charcoal font-medium leading-relaxed mt-2 flex-1">{o.body}</p>
                    <a href={o.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-full bg-rr-pink text-white font-black uppercase tracking-wider text-sm hover:opacity-90">
                        {o.button}<ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </a>
                </div>
            ))}
        </div>
        <p className="text-white text-sm font-semibold mt-5 flex items-start gap-2"><Shirt className="w-4 h-4 text-rr-light-pink shrink-0 mt-0.5" aria-hidden="true" />{PAY_NOW.shirt}</p>
        <p className="text-white/70 text-xs font-medium mt-2">{PAY_NOW.secure}</p>
    </div>
);

// ── Price ──
const Prices = () => (
    <Section id="prices">
        <Head eyebrow={PRICES.eyebrow} title={PRICES.title} />
        <div className="grid md:grid-cols-2 gap-10">
            <div className="border-t-4 border-rr-pink pt-5">
                <p><span className="text-6xl font-black text-rr-dark">{PRICES.price}</span> <span className="text-xl font-bold text-rr-charcoal">{PRICES.per}</span></p>
                <p className="text-[15px] font-bold text-rr-dark mt-1">{PRICES.perNote}</p>
                <ul className="mt-5 space-y-2">{PRICES.includes.map((t, i) => <Tick key={i}><span className="font-semibold text-rr-dark"><Rich v={t} /></span></Tick>)}</ul>
            </div>
            <div className="rounded-2xl border-2 border-slate-200 p-5 self-start">
                <p className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-rr-dark"><Shirt className="w-5 h-5 text-rr-pink" aria-hidden="true" />{PRICES.shirtTitle}</p>
                <p className="text-[15px] text-rr-charcoal font-medium leading-relaxed mt-2">{PRICES.shirt}</p>
            </div>
        </div>

        <PayNow />
        <Compare />
        <EnrolFlow />
        <TermCosts />
        <CtaRow />
    </Section>
);

// ── 5. Register ──
const Register = () => (
    <section id="register" className={`${SCROLL_PAD} bg-rr-dark py-14 md:py-20`}>
        <div className="max-w-2xl mx-auto px-5 sm:px-6">
            <Head eyebrow={FORM.eyebrow} title={FORM.title} dark />
            <ol className="mb-8 space-y-4">
                {FORM.steps.map((st) => (
                    <li key={st.n} className="flex gap-4">
                        <span className="w-9 h-9 rounded-full bg-rr-pink text-white font-black flex items-center justify-center shrink-0" aria-hidden="true">{st.n}</span>
                        <p className="text-[17px] text-white font-medium leading-relaxed"><span className="font-black"><Rich v={st.when} />.</span> {st.does}</p>
                    </li>
                ))}
            </ol>
            <p className="mb-6 text-sm font-medium text-white/80">{FORM.returning}</p>
            <JRV2Form />
            {/* A family who closed the come and try pop-up can open it again here. */}
            <div className="mt-8 border-t border-white/20 pt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                <p className="text-white text-[17px] font-bold">{TRY.again.lead}</p>
                <button type="button" data-jr-try-open onClick={() => window.dispatchEvent(new Event(TRY_OPEN_EVENT))} aria-haspopup="dialog"
                    className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-full border-2 border-white text-white hover:bg-white hover:text-rr-dark font-black uppercase tracking-wider text-sm transition-colors">
                    {TRY.again.button}
                </button>
            </div>
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
                <Value />
                <Learn />
                <Coaches />
                <Prices />
                <Register />
                <Faq />
            </main>
            <Footer />
            <StickyBar />
            <JRV2ComeAndTry />
        </div>
    );
};

export default JuniorRoyalsV2;
