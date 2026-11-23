import React, { useEffect, useState } from 'react';
import { Plus, Minus, Check } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import PartnerStack from '../power-game/PartnerStack';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import HomeMedia from '../home-page/HomeMedia';
import CoachFinder from './CoachFinder';
import { ROUTE, HERO, TECH, STEPS } from './premiumCoachingData';
import { BowlingMap, HeatMap } from './TechVisuals';
import { useCarousel, CarouselTrack, CarouselControls } from '../india-tour-2026/ITCarousel';
import { HERO_IMAGE, MEDIA } from './premiumCoachingMedia';

// Royals Private Coaching: the premium one-to-one offer (Andy, 13 Nov 2026; tiers,
// prices, 1:2, live availability and booking added 17 Nov 2026).
// Order: Hero (Why line + What facts + CTA) → WHY different → HOW: the tech →
// HOW: the steps → WHAT: formats + coach tiers → WHAT: coaches by centre → see it
// (one mixed photo + video carousel) → book and pay. No Questions section (Andy, 18 Nov
// 2026). Live at /private-coaching (Andy, 22 Nov 2026).

const SECTIONS = ['hero', 'tech', 'how', 'coaches', 'media'];
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

// ── HOW: the tools in the lane (Andy, 23 Nov 2026: smaller, one carousel of equal cards
// people can scroll through; every picture shown whole, so Full Track can be seen) ──
const TechCardVisual = ({ t }) => {
    const isPhoto = t.visual.startsWith('photo:');
    return (
        <div className="aspect-[4/5] bg-[#0b1b4d] flex items-center justify-center overflow-hidden">
            {isPhoto
                ? <img src={t.visual.slice(6)} alt={t.caption} loading="lazy" className="w-full h-full object-cover object-center" />
                : <div className={`h-full py-3 ${t.visual === 'bowling-map' ? 'w-[58%]' : 'w-[92%]'} flex items-center`}>{t.visual === 'bowling-map' ? <BowlingMap /> : <HeatMap />}</div>}
        </div>
    );
};

const Tech = () => {
    const carousel = useCarousel(TECH.items.length);
    return (
        <section className="bg-rr-navy py-14 md:py-20 overflow-hidden">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-10 mb-7">
                    <div className="max-w-2xl">
                        <Eyebrow dark>{TECH.eyebrow}</Eyebrow>
                        <H2 dark>{TECH.title}</H2>
                    </div>
                    <p className="text-white/75 font-medium leading-relaxed md:max-w-sm text-sm md:text-base">{TECH.short}</p>
                </div>

                <CarouselTrack carousel={carousel} label="The tools in the lane">
                    {TECH.items.map((t, i) => (
                        <article key={t.key} data-slide aria-roledescription="slide" aria-label={`${i + 1} / ${TECH.items.length}: ${t.title}`}
                            className="snap-start shrink-0 w-[72%] sm:w-[40%] lg:w-[calc((100%-3rem)/4)] bg-rr-dark border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                            <TechCardVisual t={t} />
                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="text-base font-black text-white uppercase tracking-tight mb-1">{t.title}</h3>
                                <p className="text-[13px] text-white/80 font-medium leading-snug">{t.body}</p>
                                {!t.visual.startsWith('photo:') && <p className="mt-2"><span className="inline-block bg-white/15 text-white text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full">Example</span></p>}
                                {t.logos && (
                                    <div className="flex items-center gap-2 mt-3">
                                        {t.logos.map((l) => <span key={l.name} className="bg-white rounded-lg h-8 px-2.5 flex items-center"><img src={l.src} alt={l.name} className="max-h-4 w-auto" /></span>)}
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </CarouselTrack>
                <div className="lg:hidden"><CarouselControls carousel={carousel} total={TECH.items.length} prevLabel="Previous tool" nextLabel="Next tool" dark idPrefix="pc-tech" /></div>

                <ul className="mt-6 flex flex-wrap gap-2">
                    {TECH.every.map((e) => (
                        <li key={e} className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs font-semibold rounded-full px-3 py-1.5"><Check className="w-3.5 h-3.5 text-rr-light-pink shrink-0" />{e}</li>
                    ))}
                </ul>
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
    { label: 'COACHES', id: 'coaches' },
];

const PremiumCoaching = () => {
    usePageAnalytics(ROUTE, { sections: SECTIONS });
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white">
            <Navbar variant="private-coaching" navLinksOverride={NAV} ctaLabelOverride="BOOK YOUR COACH" ctaTargetOverride="coaches" />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero"><Hero /></div>
                <div id="tech" className={ANCHOR}><Tech /></div>
                <div id="how" className={ANCHOR}><How /></div>
                <div id="coaches" className={ANCHOR}><CoachFinder /></div>
                <div id="media" className={ANCHOR}>
                    <HomeMedia items={MEDIA} idPrefix="pc-media" eyebrow="Photos & videos" label="Photos and videos of Royals private coaching"
                        title={<>See it <span className="text-rr-pink">in the lane</span></>} sectionClass="py-16 md:py-20 bg-white" />
                </div>
            </main>
            <PartnerStack />
            <Footer />
        </div>
    );
};

export default PremiumCoaching;
