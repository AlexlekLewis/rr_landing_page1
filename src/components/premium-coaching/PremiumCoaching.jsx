import React, { useEffect, useRef, useState } from 'react';
import { Plus, Minus, MapPin, Play, Check } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import PartnerStack from '../power-game/PartnerStack';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import PremiumCoachingForm from './PremiumCoachingForm';
import {
    ROUTE, FORM_ANCHOR, HERO, WHY, TECH, STEPS, FORMATS, TIERS, CENTRES, FAQ,
    coachesAt, tierOf,
} from './premiumCoachingData';
import { HERO_IMAGE, PHOTOS, VIDEOS } from './premiumCoachingMedia';

// Royals Private Coaching: the premium one-to-one offer (Andy, 13 Nov 2026).
// Order: Hero (Why line + What facts + CTA) → WHY different → HOW: the tech →
// HOW: the steps → WHAT: formats + coach tiers → WHAT: coaches by centre → see it
// (video, photos) → form → FAQ. PREVIEW ONLY: hidden route, noindex, no surfaces.

const SECTIONS = ['hero', 'why', 'tech', 'how', 'options', 'coaches', 'video', 'photos', FORM_ANCHOR, 'faq'];
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

const Initials = ({ name }) => (
    <div className="w-full h-full flex items-center justify-center text-white text-4xl font-black" style={{ backgroundImage: 'var(--image-gradient-rr)' }}>
        {name.split(' ').map((p) => p[0]).join('')}
    </div>
);

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

// ── WHY ─────────────────────────────────────────────────
const Why = () => (
    <section className="bg-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-12 gap-10 md:gap-14">
            <div className="md:col-span-5">
                <Eyebrow>{WHY.eyebrow}</Eyebrow>
                <H2 className="mb-6">{WHY.title}</H2>
                {WHY.body.map((p) => <p key={p.slice(0, 20)} className="text-rr-charcoal font-medium leading-relaxed mb-4">{p}</p>)}
            </div>
            <div className="md:col-span-7 grid sm:grid-cols-2 gap-x-8 gap-y-7">
                {WHY.benefits.map((b) => (
                    <div key={b.title} className="border-t-2 border-rr-pink pt-4">
                        <h3 className="text-base font-black text-rr-dark uppercase tracking-wide mb-1.5">{b.title}</h3>
                        <p className="text-sm text-rr-charcoal font-medium leading-relaxed">{b.body}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// ── HOW: the tech ──────────────────────────────────────
const Tech = () => (
    <section className="bg-rr-navy py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-7">
                <Eyebrow dark>{TECH.eyebrow}</Eyebrow>
                <H2 dark className="mb-5">{TECH.title}</H2>
                <p className="text-white/80 font-medium leading-relaxed mb-10 max-w-xl">{TECH.intro}</p>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
                    {TECH.items.map((t, i) => (
                        <div key={t.key} className="border-t border-white/20 pt-4">
                            <p className="text-rr-light-pink text-xs font-black tracking-widest mb-1">0{i + 1}</p>
                            <h3 className="text-lg font-black text-white uppercase tracking-wide mb-1.5">{t.title}</h3>
                            <p className="text-sm text-white/80 font-medium leading-relaxed">{t.body}</p>
                            <Reveal dark label="More">{t.more}</Reveal>
                        </div>
                    ))}
                </div>
            </div>
            <div className="md:col-span-5 md:sticky md:top-28">
                <div className="mx-auto max-w-[320px] rounded-3xl overflow-hidden bg-black aspect-[9/16]">
                    <video src={VIDEOS[0].src} poster={VIDEOS[0].poster} muted loop playsInline autoPlay preload="metadata" className="w-full h-full object-cover" aria-label={VIDEOS[0].caption} />
                </div>
                <p className="text-center text-white/70 text-xs font-medium mt-3 max-w-[320px] mx-auto">{VIDEOS[0].caption}</p>
            </div>
        </div>
    </section>
);

// ── HOW: steps ──────────────────────────────────────────
const How = () => (
    <section className="bg-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Eyebrow>How it works</Eyebrow>
            <H2 className="mb-12">From request to first ball</H2>
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

// ── WHAT: formats + tiers ──────────────────────────────
const Options = () => (
    <section className="bg-slate-50 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Eyebrow>Your options</Eyebrow>
            <H2 className="mb-4">Choose the format. Choose the coach.</H2>
            <p className="text-rr-charcoal font-medium leading-relaxed max-w-2xl mb-12">Every format gets the same tools. The coach tier sets the price.</p>

            <div className="grid md:grid-cols-3 gap-5 mb-14">
                {FORMATS.map((f) => (
                    <div key={f.value} className="bg-white border border-slate-200 rounded-2xl p-6">
                        <p className="text-4xl font-black text-rr-pink tracking-tight mb-2">{f.label}</p>
                        <h3 className="text-base font-black text-rr-dark uppercase tracking-wide mb-1.5">{f.title}</h3>
                        <p className="text-sm text-rr-charcoal font-medium leading-relaxed">{f.body}</p>
                    </div>
                ))}
            </div>

            <h3 className="text-xl font-black text-rr-dark uppercase tracking-wide mb-5">Three tiers of Royals coach</h3>
            <div className="grid md:grid-cols-3 gap-5">
                {TIERS.map((t, i) => (
                    <div key={t.key} className={`rounded-2xl p-6 ${i === 0 ? 'text-white' : 'bg-white border border-slate-200'}`}
                        style={i === 0 ? { backgroundImage: 'var(--image-gradient-rr)' } : undefined}>
                        <p className={`text-xs font-black uppercase tracking-widest mb-2 ${i === 0 ? 'text-white/80' : 'text-rr-pink'}`}>{t.short}</p>
                        <h4 className={`text-xl font-black uppercase tracking-wide mb-2 ${i === 0 ? 'text-white' : 'text-rr-dark'}`}>{t.name}</h4>
                        <p className={`text-sm font-medium leading-relaxed mb-5 ${i === 0 ? 'text-white/85' : 'text-rr-charcoal'}`}>{t.body}</p>
                        <p className={`text-sm font-black ${i === 0 ? 'text-white' : 'text-rr-dark'}`}>
                            {t.price ? <>${t.price} <span className="font-medium">{t.unit}, incl. GST</span></> : 'Price confirmed when we book you'}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// ── WHAT: coaches by centre ────────────────────────────
const CoachCard = ({ c }) => (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
        <div className="aspect-[4/5] bg-slate-100 overflow-hidden">
            {c.img ? <img src={c.img} alt={c.name} loading="lazy" className="w-full h-full object-cover object-top" /> : <Initials name={c.name} />}
        </div>
        <div className="p-5 flex-1">
            <p className="text-[11px] font-black uppercase tracking-widest text-rr-pink mb-1">{tierOf(c.tier)?.name || 'Royals Coach'}</p>
            <h4 className="text-lg font-black text-rr-dark uppercase tracking-wide leading-tight">{c.name}</h4>
            <p className="text-xs font-bold text-slate-500 mb-3">{[c.tier ? c.role : null, c.specialism].filter(Boolean).join(' · ') || '\u00a0'}</p>
            <p className="text-sm text-rr-charcoal font-medium leading-relaxed">{c.bio || 'Full profile coming soon.'}</p>
        </div>
    </div>
);

const Coaches = ({ onPick }) => (
    <section className="bg-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Eyebrow>Coaches and centres</Eyebrow>
            <H2 className="mb-4">Three centres across Melbourne</H2>
            <p className="text-rr-charcoal font-medium leading-relaxed max-w-2xl mb-12">Pick the centre closest to you, then the coach.</p>
            <div className="space-y-16">
                {CENTRES.map((centre) => {
                    const list = coachesAt(centre.slug);
                    return (
                        <div key={centre.slug}>
                            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b-2 border-rr-dark pb-4 mb-6">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-rr-pink mb-1">
                                        {centre.region}{centre.isNew && <span className="ml-2 bg-rr-pink text-white px-2 py-0.5 rounded-full">New</span>}
                                    </p>
                                    <h3 className="text-2xl md:text-3xl font-black text-rr-dark uppercase tracking-tight">{centre.suburb}</h3>
                                    <p className="text-sm font-semibold text-rr-charcoal flex items-start gap-1.5 mt-1">
                                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-rr-pink" />
                                        <span>{centre.name}{centre.address ? ` · ${centre.address}` : `, ${centre.suburb}`}</span>
                                    </p>
                                    <p className="text-sm text-slate-500 font-medium mt-1">{centre.note}</p>
                                </div>
                                <button type="button" data-cta={`centre-${centre.slug}`} onClick={() => onPick(centre.slug)}
                                    className="self-start md:self-auto bg-rr-dark hover:bg-rr-pink text-white font-black uppercase tracking-widest text-xs px-6 py-3 rounded-full transition-colors">
                                    Request a coach in {centre.suburb}
                                </button>
                            </div>
                            {list.length > 0 ? (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {list.map((c) => <CoachCard key={c.slug} c={c} />)}
                                </div>
                            ) : (
                                <div className="rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center">
                                    <p className="font-black text-rr-dark uppercase tracking-wide mb-1">Coaches announced soon</p>
                                    <p className="text-sm text-rr-charcoal font-medium">Request now and we will match your player with a Royals coach at our West Centre.</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    </section>
);

// ── SEE IT: video ──────────────────────────────────────
const VideoCard = ({ v }) => {
    const ref = useRef(null);
    const [playing, setPlaying] = useState(false);
    const start = () => { ref.current?.play(); setPlaying(true); };
    return (
        <figure>
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16]">
                <video ref={ref} src={v.src} poster={v.poster} playsInline controls={playing} preload="none" className="w-full h-full object-cover" />
                {!playing && (
                    <button type="button" onClick={start} aria-label={`Play: ${v.title}`} className="absolute inset-0 flex items-center justify-center bg-rr-dark/30">
                        <span className="w-16 h-16 rounded-full bg-rr-pink flex items-center justify-center"><Play className="w-7 h-7 text-white fill-white ml-1" /></span>
                    </button>
                )}
            </div>
            <figcaption className="mt-3">
                <p className="text-white font-black uppercase tracking-wide text-sm">{v.title}</p>
                <p className="text-white/70 text-xs font-medium leading-snug">{v.caption}</p>
                <p className="text-rr-light-pink text-[11px] font-bold mt-0.5">{v.where}</p>
            </figcaption>
        </figure>
    );
};

const Video = () => (
    <section className="bg-rr-dark py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Eyebrow dark>See it in the lane</Eyebrow>
            <H2 dark className="mb-12">One coach. One player.</H2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {VIDEOS.map((v) => <VideoCard key={v.src} v={v} />)}
            </div>
        </div>
    </section>
);

// ── SEE IT: photos ─────────────────────────────────────
const Photos = () => (
    <section className="bg-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Eyebrow>Photos</Eyebrow>
            <H2 className="mb-12">Every ball, up close</H2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                {PHOTOS.map((p) => (
                    <figure key={p.caption}>
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100">
                            <img src={p.src} alt={p.alt} loading="lazy" className="w-full h-full object-cover" />
                        </div>
                        <figcaption className="mt-2">
                            <p className="text-sm text-rr-dark font-bold leading-snug">{p.caption}</p>
                            <p className="text-xs text-slate-500 font-medium">{p.where}</p>
                        </figcaption>
                    </figure>
                ))}
            </div>
        </div>
    </section>
);

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
    { label: 'OPTIONS', id: 'options' },
    { label: 'COACHES', id: 'coaches' },
    { label: 'FAQ', id: 'faq' },
];

const PremiumCoaching = () => {
    usePageAnalytics(ROUTE, { sections: SECTIONS });
    const [centre, setCentre] = useState('');
    const [formKey, setFormKey] = useState(0);
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const pickCentre = (slug) => {
        setCentre(slug);
        setFormKey((k) => k + 1); // remount the form with that centre chosen
        setTimeout(() => go(FORM_ANCHOR), 0);
    };

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white">
            <Navbar variant="private-coaching" navLinksOverride={NAV} ctaLabelOverride="REQUEST YOUR COACH" ctaTargetOverride={FORM_ANCHOR} />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero"><Hero /></div>
                <div id="why" className={ANCHOR}><Why /></div>
                <div id="tech" className={ANCHOR}><Tech /></div>
                <div id="how" className={ANCHOR}><How /></div>
                <div id="options" className={ANCHOR}><Options /></div>
                <div id="coaches" className={ANCHOR}><Coaches onPick={pickCentre} /></div>
                <div id="video" className={ANCHOR}><Video /></div>
                <div id="photos" className={ANCHOR}><Photos /></div>
                <div id={FORM_ANCHOR} className={ANCHOR}><PremiumCoachingForm key={formKey} initialCentre={centre} /></div>
                <div id="faq" className={ANCHOR}><Faq /></div>
            </main>
            <PartnerStack />
            <Footer />
        </div>
    );
};

export default PremiumCoaching;
