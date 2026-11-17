import React, { useEffect, useState } from 'react';
import { Plus, Minus, Check } from 'lucide-react';
import { VideoCard } from '../india-tour-2026/ITVideos';
import { useCarousel, CarouselTrack, CarouselControls } from '../india-tour-2026/ITCarousel';
import Navbar from '../Navbar';
import Footer from '../Footer';
import PartnerStack from '../power-game/PartnerStack';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import PremiumCoachingForm from './PremiumCoachingForm';
import PremiumCoachingGallery from './PremiumCoachingGallery';
import CoachFinder from './CoachFinder';
import {
    ROUTE, FORM_ANCHOR, HERO, TOGETHER, TECH, STEPS, FORMATS, TIERS, FAQ,
    PACKAGES, TIER_PRICES, perSession, packageTotal, money,
} from './premiumCoachingData';
import { BowlingMap, HeatMap } from './TechVisuals';
import { HERO_IMAGE, VIDEOS } from './premiumCoachingMedia';

// Royals Private Coaching: the premium one-to-one offer (Andy, 13 Nov 2026; tiers,
// prices, 1:2, live availability and booking added 17 Nov 2026).
// Order: Hero (Why line + What facts + CTA) → WHY different → HOW: the tech →
// HOW: the steps → WHAT: formats + coach tiers → WHAT: coaches by centre → see it
// (video, photos) → form → FAQ. PREVIEW ONLY: hidden route, noindex, no surfaces.

const SECTIONS = ['hero', 'tech', 'together', 'how', 'options', 'coaches', 'video', 'photos', FORM_ANCHOR, 'faq'];
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
                <p className="text-xl md:text-2xl text-white font-black leading-snug mb-4">{HERO.why}</p>
                <p className="order-4 md:order-none text-base text-white/80 font-medium leading-relaxed mb-7">{HERO.lead}</p>
                <dl className="order-5 md:order-none grid grid-cols-2 gap-x-6 gap-y-4 mb-2 md:mb-8">
                    {HERO.facts.map((f) => (
                        <div key={f.label} className="border-t border-white/25 pt-2.5">
                            <dt className="text-[11px] font-black uppercase tracking-widest text-rr-light-pink mb-1">{f.label}</dt>
                            <dd className="text-sm text-white font-semibold leading-snug">{f.value}</dd>
                        </div>
                    ))}
                </dl>
                <div className="order-3 md:order-none flex flex-col sm:flex-row gap-3 mb-8 md:mb-0">
                    <button type="button" data-cta="hero-primary" onClick={() => go(FORM_ANCHOR)}
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
                <button type="button" data-cta="together" onClick={() => go(FORM_ANCHOR)}
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

const Tech = () => (
    <section className="bg-rr-navy py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mb-14">
                <Eyebrow dark>{TECH.eyebrow}</Eyebrow>
                <H2 dark className="mb-5">{TECH.title}</H2>
                <p className="text-white/80 font-medium leading-relaxed">{TECH.intro}</p>
            </div>
            <div className="space-y-14 md:space-y-20">
                {TECH.items.map((t, i) => (
                    <div key={t.key} className="grid md:grid-cols-12 gap-6 md:gap-12 items-center">
                        <div className={`md:col-span-6 ${i % 2 ? 'md:order-2' : ''}`}>
                            <div className="max-w-[440px] mx-auto"><TechVisual item={t} /></div>
                        </div>
                        <div className={`md:col-span-6 ${i % 2 ? 'md:order-1' : ''}`}>
                            <p className="text-rr-light-pink text-xs font-black tracking-widest mb-1">0{i + 1}</p>
                            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-3">{t.title}</h3>
                            <p className="text-white/85 font-medium leading-relaxed">{t.body}</p>
                            <Reveal dark label="More">{t.more}</Reveal>
                            {t.logos && (
                                <div className="flex items-center gap-3 mt-5">
                                    {t.logos.map((l) => (
                                        <span key={l.name} className="bg-white rounded-xl h-14 px-4 flex items-center"><img src={l.src} alt={l.name} className="max-h-8 w-auto" /></span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-16 border-t border-white/15 pt-8">
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

// ── HOW: steps ──────────────────────────────────────────
const How = () => (
    <section className="bg-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Eyebrow>How it works</Eyebrow>
            <H2 className="mb-12">From booking to first ball</H2>
            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {STEPS.map((s, i) => (
                    <li key={s.title}>
                        <span className="inline-flex w-10 h-10 rounded-full items-center justify-center text-white font-black mb-4" style={{ backgroundImage: 'var(--image-gradient-rr)' }}>{i + 1}</span>
                        <h3 className="text-base font-black text-rr-dark uppercase tracking-wide mb-1.5">{s.title}</h3>
                        <p className="text-sm text-rr-charcoal font-medium leading-relaxed">{s.body}</p>
                    </li>
                ))}
            </ol>
        </div>
    </section>
);

// ── WHAT: formats, prices, tiers ───────────────────────
const PriceTable = () => (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-3">
            <p className="text-xs font-black uppercase tracking-widest text-rr-pink mb-1">Elite Coach prices</p>
            <p className="text-sm text-rr-charcoal font-medium">Per one-hour session, incl. GST. 1-to-1 and 1-to-2 are the same price: in a 1-to-2 the two families share it.</p>
        </div>
        <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-widest text-slate-500">
                <tr><th className="px-5 sm:px-6 py-2.5 font-black">Package</th><th className="py-2.5 font-black">Per session</th><th className="py-2.5 font-black">Total</th><th className="pr-5 sm:pr-6 py-2.5 font-black">1-to-2, each family</th></tr>
            </thead>
            <tbody>
                {PACKAGES.map((p) => {
                    const per = perSession('head', p.sessions);
                    const total = packageTotal('head', p.sessions);
                    return (
                        <tr key={p.sessions} className="border-t border-slate-100">
                            <td className="px-5 sm:px-6 py-3 font-black text-rr-dark">{p.label}</td>
                            <td className="py-3 font-bold text-rr-dark">{money(per)}</td>
                            <td className="py-3 text-rr-charcoal font-medium">{money(total)}</td>
                            <td className="pr-5 sm:pr-6 py-3 text-rr-pink font-black">{money(total / 2)}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
        <p className="px-5 sm:px-6 py-3 text-xs text-slate-500 font-medium border-t border-slate-100">Training shirt $29.95 incl. GST, only if your player doesn’t have one. Performance Coach and Academy Coach prices coming soon.</p>
    </div>
);

const Options = () => (
    <section className="bg-slate-50 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Eyebrow>Your options</Eyebrow>
            <H2 className="mb-4">Choose the coach. Bring a partner.</H2>
            <p className="text-rr-charcoal font-medium leading-relaxed max-w-2xl mb-12">Every session gets the same tools and systems. The type of coach sets the price, and 1-to-2 costs the same as 1-to-1.</p>

            <div className="grid md:grid-cols-2 gap-5 mb-10">
                {FORMATS.map((f) => (
                    <div key={f.value} className={`rounded-2xl p-6 ${f.recommended ? 'bg-rr-dark text-white' : 'bg-white border border-slate-200'}`}>
                        <div className="flex items-center gap-3 mb-2">
                            <p className={`text-4xl font-black tracking-tight ${f.recommended ? 'text-rr-light-pink' : 'text-rr-pink'}`}>{f.label}</p>
                            {f.recommended && <span className="bg-rr-pink text-white text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">We recommend</span>}
                        </div>
                        <h3 className={`text-base font-black uppercase tracking-wide mb-1.5 ${f.recommended ? 'text-white' : 'text-rr-dark'}`}>{f.title}</h3>
                        <p className={`text-sm font-medium leading-relaxed ${f.recommended ? 'text-white/80' : 'text-rr-charcoal'}`}>{f.body}</p>
                    </div>
                ))}
            </div>

            <div className="mb-14"><PriceTable /></div>

            <h3 className="text-xl font-black text-rr-dark uppercase tracking-wide mb-2">Elite, Performance and Academy Coaches</h3>
            <p className="text-sm text-rr-charcoal font-medium mb-5 max-w-2xl">Every Royals private coach is trained on the same tools and systems, and coaches every part of the game. Choose the experience that suits your player.</p>
            <div className="grid md:grid-cols-3 gap-5">
                {TIERS.map((t, i) => (
                    <div key={t.key} className={`rounded-2xl p-6 flex flex-col ${i === 0 ? 'text-white' : 'bg-white border border-slate-200'}`}
                        style={i === 0 ? { backgroundImage: 'var(--image-gradient-rr)' } : undefined}>
                        <h4 className={`text-xl font-black uppercase tracking-wide mb-2 ${i === 0 ? 'text-white' : 'text-rr-dark'}`}>{t.name}</h4>
                        <p className={`text-sm font-medium leading-relaxed mb-3 ${i === 0 ? 'text-white/90' : 'text-rr-charcoal'}`}>{t.body}</p>
                        <p className={`text-xs font-semibold leading-relaxed mb-5 ${i === 0 ? 'text-white/75' : 'text-slate-500'}`}><b>Best for:</b> {t.bestFor}</p>
                        <p className={`mt-auto text-sm font-black ${i === 0 ? 'text-white' : 'text-rr-dark'}`}>
                            {TIER_PRICES[t.key] ? <>From {money(perSession(t.key, 5))} a session <span className="font-medium">incl. GST</span></> : 'Price coming soon'}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// ── SEE IT: video ──────────────────────────────────────
// Same player and carousel as /junior-royals and /tours (Andy, 13 Nov 2026): big play
// button, play/pause + mute, one video at a time, swipe on a phone. Each caption says
// where it was filmed.
const Video = () => {
    const total = VIDEOS.length;
    const carousel = useCarousel(total);
    const [activeId, setActiveId] = useState(null);
    return (
        <section className="bg-rr-dark py-20 md:py-28 overflow-hidden">
            <div className="max-w-6xl mx-auto px-6">
                <Eyebrow dark>See it in the lane</Eyebrow>
                <H2 dark className="mb-10">One coach. One player.</H2>
                <CarouselTrack carousel={carousel} label="Videos of Royals one-to-one coaching">
                    {VIDEOS.map((v, i) => (
                        <div key={v.src} data-slide role="group" aria-roledescription="slide" aria-label={`${i + 1} / ${total}`}
                            className="snap-start shrink-0 w-[72%] sm:w-[42%] md:w-[31%] lg:w-[calc((100%-3rem)/4)]">
                            <VideoCard v={{ ...v, caption: `${v.caption} (${v.where})` }} id={i} activeId={activeId} setActiveId={setActiveId} />
                        </div>
                    ))}
                </CarouselTrack>
                <CarouselControls carousel={carousel} total={total} prevLabel="Previous video" nextLabel="Next video" dark idPrefix="pc-videos" />
            </div>
        </section>
    );
};

// ── FAQ ─────────────────────────────────────────────────
const Faq = () => {
    const [open, setOpen] = useState(0);
    return (
        <section className="bg-white py-20 md:py-28">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <Eyebrow>Questions</Eyebrow>
                <H2 className="mb-10">Before you book</H2>
                <div className="divide-y divide-slate-200 border-y border-slate-200">
                    {FAQ.map((f, i) => (
                        <div key={f.q}>
                            <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}
                                className="w-full flex items-center justify-between gap-4 py-5 text-left">
                                <span className="font-black text-rr-dark">{f.q}</span>
                                {open === i ? <Minus className="w-5 h-5 text-rr-pink shrink-0" /> : <Plus className="w-5 h-5 text-rr-pink shrink-0" />}
                            </button>
                            {open === i && <p className="pb-5 text-rr-charcoal font-medium leading-relaxed">{f.a}</p>}
                        </div>
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <button type="button" data-cta="faq-primary" onClick={() => go(FORM_ANCHOR)}
                        className="inline-flex items-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-8 py-4 rounded-full transition-colors">
                        <Check className="w-4 h-4" /> {HERO.cta}
                    </button>
                </div>
            </div>
        </section>
    );
};

const NAV = [
    { label: 'THE TECH', id: 'tech' },
    { label: 'PRICES', id: 'options' },
    { label: 'COACHES & TIMES', id: 'coaches' },
    { label: 'FAQ', id: 'faq' },
];

const PremiumCoaching = () => {
    usePageAnalytics(ROUTE, { sections: SECTIONS });
    const [pick, setPick] = useState({ centre: '', coach: '' });
    const [formKey, setFormKey] = useState(0);
    useEffect(() => { window.scrollTo(0, 0); }, []);

    // "Book Alex" / "Book in Ravenhall": open the form with that centre (and coach) chosen.
    const book = (centre, coach = '') => {
        setPick({ centre, coach });
        setFormKey((k) => k + 1); // remount the form with the choice applied
        setTimeout(() => go(FORM_ANCHOR), 0);
    };

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white">
            <Navbar variant="private-coaching" navLinksOverride={NAV} ctaLabelOverride="BOOK YOUR COACH" ctaTargetOverride={FORM_ANCHOR} />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero"><Hero /></div>
                <div id="tech" className={ANCHOR}><Tech /></div>
                <div id="together" className={ANCHOR}><Together /></div>
                <div id="how" className={ANCHOR}><How /></div>
                <div id="options" className={ANCHOR}><Options /></div>
                <div id="coaches" className={ANCHOR}><CoachFinder onBook={book} /></div>
                <div id="video" className={ANCHOR}><Video /></div>
                <div id="photos" className={ANCHOR}><PremiumCoachingGallery /></div>
                <div id={FORM_ANCHOR} className={ANCHOR}><PremiumCoachingForm key={formKey} initialCentre={pick.centre} initialCoach={pick.coach} /></div>
                <div id="faq" className={ANCHOR}><Faq /></div>
            </main>
            <PartnerStack />
            <Footer />
        </div>
    );
};

export default PremiumCoaching;
