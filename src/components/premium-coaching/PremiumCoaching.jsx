import React, { useEffect, useState } from 'react';
import { Plus, Minus, Check } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import PartnerStack from '../power-game/PartnerStack';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import CoachBooking from './CoachBooking';
import HomeMedia from '../home-page/HomeMedia';
import CoachFinder from './CoachFinder';
import { ROUTE, HERO, TOGETHER, TECH, STEPS } from './premiumCoachingData';
import { BowlingMap, HeatMap } from './TechVisuals';
import { HERO_IMAGE, MEDIA } from './premiumCoachingMedia';

// Royals Private Coaching: the premium one-to-one offer (Andy, 13 Nov 2026; tiers,
// prices, 1:2, live availability and booking added 17 Nov 2026).
// Order: Hero (Why line + What facts + CTA) → WHY different → HOW: the tech →
// HOW: the steps → WHAT: formats + coach tiers → WHAT: coaches by centre → see it
// (one mixed photo + video carousel) → book and pay. No Questions section (Andy, 18 Nov
// 2026). PREVIEW ONLY: hidden route, noindex, no surfaces.

const SECTIONS = ['hero', 'tech', 'together', 'how', 'coaches', 'media'];
const ANCHOR = 'scroll-mt-24 md:scroll-mt-28';
const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const Eyebrow = ({ children, dark }) => (
    <p className={`text-xs font-black uppercase tracking-[0.3em] mb-3 ${dark ? 'text-rr-light-pink' : 'text-rr-pink'}`}>{children}</p>
);
const H2 = ({ children, dark, className = '' }) => (
    <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] ${dark ? 'text-white' : 'text-rr-dark'} ${className}`}>{children}</h2>
);

// Tap to open, never hover-only. Essentials stay outside it.
const Reveal = ({ label, children, dark }) => {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
                className={`mt-3 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest ${dark ? 'text-rr-light-pink' : 'text-rr-pink'}`}>
                {open ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />} {label}
            </button>
            {open && <p className={`mt-2 text-sm leading-relaxed font-medium ${dark ? 'text-white/75' : 'text-rr-charcoal'}`}>{children}</p>}
        </div>
    );
};

// ── HERO ────────────────────────────────────────────────
const Hero = () => (
    <section className="relative bg-rr-dark overflow-hidden">
        <div className="absolute inset-0 md:left-[38%]">
            <img src={HERO_IMAGE.src} alt={HERO_IMAGE.alt} className="w-full h-full object-cover object-center" fetchpriority="high" />
            <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/80 to-rr-dark/30 md:bg-gradient-to-r md:from-rr-dark md:via-rr-dark/40 md:to-transparent" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-14 md:pt-44 md:pb-24 min-h-[86vh] md:min-h-[80vh] flex items-end md:items-center">
            <div className="max-w-xl flex flex-col">
                <Eyebrow dark>{HERO.eyebrow}</Eyebrow>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-5">
                    {HERO.h1[0]}<br /><span className="text-rr-pink">{HERO.h1[1]}</span>
                </h1>
                <div className="order-4 md:order-none mb-6" data-pc-hero-for>
                    <p className="text-sm md:text-lg text-white font-bold mb-2">{HERO.forTitle}</p>
                    <ul className="space-y-1.5">
                        {HERO.forList.map((line) => (
                            <li key={line} className="flex items-start gap-2 text-sm md:text-base text-white/85 font-medium">
                                <svg className="w-5 h-5 mt-0.5 shrink-0 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{line}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <p className="hidden md:block text-base text-white/80 font-medium leading-relaxed mb-7">{HERO.lead}</p>
                <dl className="order-5 md:order-none grid grid-cols-2 gap-x-6 gap-y-4 mb-2 md:mb-8">
                    {HERO.facts.map((f) => (
                        <div key={f.label} className="border-t border-white/25 pt-2.5">
                            <dt className="text-[11px] font-black uppercase tracking-widest text-rr-light-pink mb-1">{f.label}</dt>
                            <dd className="text-sm text-white font-semibold leading-snug">{f.value}</dd>
                        </div>
                    ))}
                </dl>
                <div className="order-3 md:order-none flex flex-col sm:flex-row gap-3 mb-8 md:mb-0">
                    <button type="button" data-cta="hero-primary" onClick={() => go('coaches')}
                        className="bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-8 py-4 rounded-full transition-colors">
                        {HERO.cta}
                    </button>
                    <button type="button" data-cta="hero-secondary" onClick={() => go('coaches')}
                        className="text-white font-black uppercase tracking-widest px-8 py-4 rounded-full border-2 border-white/30 hover:border-white transition-colors">
                        {HERO.secondary}
                    </button>
                </div>
            </div>
        </div>
    </section>
);

// ── The belief: players learn best with other players ──
const Together = () => (
    <section className="py-16 md:py-20 text-white" style={{ backgroundImage: 'var(--image-gradient-rr)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6">
                <p className="text-xs font-black uppercase tracking-[0.3em] mb-3 text-white/80">{TOGETHER.eyebrow}</p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.95]">{TOGETHER.title}</h2>
            </div>
            <div className="md:col-span-6">
                {TOGETHER.body.map((p) => <p key={p.slice(0, 20)} className="text-white/90 font-medium leading-relaxed mb-4">{p}</p>)}
                <button type="button" data-cta="together" onClick={() => go('coaches')}
                    className="mt-2 bg-white text-rr-dark hover:bg-rr-dark hover:text-white font-black uppercase tracking-widest px-7 py-3.5 rounded-full transition-colors text-sm">
                    Book 1-to-2 with a partner
                </button>
            </div>
        </div>
    </section>
);

// ── HOW: the tools in the lane (merged "not just a lesson" + tech, Andy 18 Nov 2026) ──
const TechVisual = ({ item }) => {
    const isPhoto = item.visual.startsWith('photo:');
    return (
        <figure>
            <div className={`rounded-2xl overflow-hidden ${isPhoto ? 'bg-black' : ''}`}>
                {isPhoto && <img src={item.visual.slice(6)} alt={item.caption} loading="lazy" className="w-full h-auto block" />}
                {item.visual === 'bowling-map' && <div className="max-w-[260px] mx-auto"><BowlingMap /></div>}
                {item.visual === 'heat-map' && <HeatMap />}
            </div>
            <figcaption className="mt-2 text-xs text-white/60 font-semibold">
                {!isPhoto && <span className="inline-block bg-white/15 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mr-2">Example</span>}
                {item.caption}
            </figcaption>
        </figure>
    );
};

const Tech = () => {
    const [feature, ...rest] = TECH.items;
    return (
        <section className="bg-rr-navy py-20 md:py-28">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="max-w-3xl mb-10 md:mb-12">
                    <Eyebrow dark>{TECH.eyebrow}</Eyebrow>
                    <H2 dark className="mb-5">{TECH.title}</H2>
                    <p className="text-white/80 font-medium leading-relaxed">{TECH.intro}</p>
                </div>

                {/* The Match Centre: the one big picture */}
                <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-center mb-10 md:mb-12">
                    <div className="md:col-span-7"><TechVisual item={feature} /></div>
                    <div className="md:col-span-5">
                        <p className="text-rr-light-pink text-xs font-black tracking-widest mb-1">01</p>
                        <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-3">{feature.title}</h3>
                        <p className="text-white/85 font-medium leading-relaxed">{feature.body}</p>
                        <Reveal dark label="More">{feature.more}</Reveal>
                    </div>
                </div>

                {/* The rest: compact, same-size cards */}
                <div className="grid sm:grid-cols-3 gap-4 md:gap-5">
                    {rest.map((t, i) => (
                        <div key={t.key} className="bg-rr-dark border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                            <div className="h-44 md:h-48 bg-black flex items-center justify-center overflow-hidden">
                                {t.visual.startsWith('photo:')
                                    ? <img src={t.visual.slice(6)} alt={t.caption} loading="lazy" className="w-full h-full object-cover object-top" />
                                    : <div className={`h-full ${t.visual === 'bowling-map' ? 'w-[110px]' : 'w-[180px]'} flex items-center`}>{t.visual === 'bowling-map' ? <BowlingMap /> : <HeatMap />}</div>}
                            </div>
                            <div className="p-4 md:p-5 flex-1 flex flex-col">
                                <p className="text-rr-light-pink text-xs font-black tracking-widest mb-1">0{i + 2}</p>
                                <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1.5">{t.title}</h3>
                                <p className="text-sm text-white/80 font-medium leading-relaxed">{t.body}</p>
                                <p className="mt-2 text-[11px] text-white/50 font-semibold">
                                    {!t.visual.startsWith('photo:') && <span className="inline-block bg-white/15 text-white text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full mr-1.5">Example</span>}
                                    {t.caption}
                                </p>
                                {t.logos && (
                                    <div className="flex items-center gap-2 mt-3">
                                        {t.logos.map((l) => <span key={l.name} className="bg-white rounded-lg h-9 px-3 flex items-center"><img src={l.src} alt={l.name} className="max-h-5 w-auto" /></span>)}
                                    </div>
                                )}
                                <div className="mt-auto"><Reveal dark label="More">{t.more}</Reveal></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 border-t border-white/15 pt-7">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-rr-light-pink mb-4">And in every session</p>
                    <ul className="grid sm:grid-cols-3 gap-4">
                        {TECH.every.map((e) => (
                            <li key={e} className="flex gap-2.5 text-white font-semibold text-sm leading-snug"><Check className="w-5 h-5 text-rr-light-pink shrink-0" />{e}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

// ── HOW: steps (Andy, 18 Nov 2026: professional, no icons, the focus on the steps) ──
// Big step numbers, a short title and one sentence each. Four across on a computer,
// stacked on a phone.
const How = () => (
    <section className="bg-slate-50 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-12 md:mb-14">
                <Eyebrow>How it works</Eyebrow>
                <H2>From booking to first ball</H2>
            </div>
            <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 list-none p-0 m-0">
                {STEPS.map((s, i) => (
                    <li key={s.key} className="border-t-2 border-rr-dark pt-5">
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Step</p>
                        <p className="inline-block text-6xl md:text-7xl font-black leading-none tracking-tighter mb-4 pr-1 bg-clip-text text-transparent" style={{ backgroundImage: 'var(--image-gradient-rr)' }}>
                            {String(i + 1).padStart(2, '0')}
                        </p>
                        <h3 className="text-lg font-black text-rr-dark uppercase tracking-tight leading-tight mb-2">{s.title}</h3>
                        <p className="text-sm text-rr-charcoal font-medium leading-relaxed">{s.body}</p>
                    </li>
                ))}
            </ol>
        </div>
    </section>
);

const NAV = [
    { label: 'THE TECH', id: 'tech' },
    { label: 'COACHES & TIMES', id: 'coaches' },
];

const PremiumCoaching = () => {
    usePageAnalytics(ROUTE, { sections: SECTIONS });
    const [open, setOpen] = useState(null); // { coach, centre } while a coach's profile is open
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white">
            <Navbar variant="private-coaching" navLinksOverride={NAV} ctaLabelOverride="BOOK YOUR COACH" ctaTargetOverride="coaches" />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero"><Hero /></div>
                <div id="tech" className={ANCHOR}><Tech /></div>
                <div id="together" className={ANCHOR}><Together /></div>
                <div id="how" className={ANCHOR}><How /></div>
                <div id="coaches" className={ANCHOR}><CoachFinder onOpen={(coach, centre) => setOpen({ coach, centre })} /></div>
                <div id="media" className={ANCHOR}>
                    <HomeMedia items={MEDIA} idPrefix="pc-media" eyebrow="Photos & videos" label="Photos and videos of Royals private coaching"
                        title={<>See it <span className="text-rr-pink">in the lane</span></>} sectionClass="py-16 md:py-20 bg-white" />
                </div>
            </main>
            {open && <CoachBooking key={`${open.coach}-${open.centre}`} coachSlug={open.coach} centreSlug={open.centre} onClose={() => setOpen(null)} />}
            <PartnerStack />
            <Footer />
        </div>
    );
};

export default PremiumCoaching;
