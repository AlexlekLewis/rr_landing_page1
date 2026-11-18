import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import PartnerStack from '../power-game/PartnerStack';
import InvitationForm from './InvitationForm';
import usePageAnalytics from '../../hooks/usePageAnalytics';

// One short "invitation list" page, drawn entirely from a campaign entry in
// invitations.js. Hero → how the list works → what the session is → form.
// To make a new page, add a campaign there: do not copy this file.

const scrollToForm = () => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });

const Arrow = () => (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

const HeroText = ({ hero, cta, wide = false }) => (
    <>
        <div className="inline-flex items-center gap-2.5 border border-white/40 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-rr-pink shrink-0" />
            <span className="text-xs font-black text-white uppercase tracking-widest">{hero.badge}</span>
        </div>

        <p className="text-xs md:text-sm font-bold text-rr-light-pink uppercase tracking-[0.25em] mb-3">
            Rajasthan Royals Academy · {hero.eyebrow}
        </p>

        <h1 className={`text-[2.5rem] font-black text-white uppercase tracking-tighter leading-[0.92] mb-5 ${wide ? 'md:text-7xl lg:text-8xl' : 'md:text-6xl lg:text-7xl'}`}>
            {hero.title.map((line) => <span key={line} className="block">{line}</span>)}
        </h1>

        <p className={`text-base md:text-lg text-white/90 font-semibold leading-relaxed mb-8 ${wide ? 'max-w-2xl mx-auto md:text-xl' : 'max-w-xl mx-auto md:mx-0'}`}>
            {hero.lead}
        </p>

        <button
            onClick={scrollToForm}
            className="bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-sm md:text-base px-8 md:px-10 py-5 rounded-full transition-colors duration-300 inline-flex items-center gap-3"
        >
            {cta}
            <Arrow />
        </button>

        <p className="text-white/60 text-sm font-medium mt-5">{hero.footnote}</p>
    </>
);

const InvitationPage = ({ campaign }) => {
    const { hero, facts, how, about, cta } = campaign;
    usePageAnalytics(campaign.route, { sections: ['hero', 'how', 'about', 'register'] });

    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white">
            <Navbar variant="open-age-trial" ctaLabelOverride="REGISTER" ctaTargetOverride="register" />

            <main className="flex-1 w-full overflow-hidden">
                {/* HERO: what it is, where it is, one button */}
                {hero.poster ? (
                    <section id="hero" className="bg-rr-dark">
                        <div className="max-w-6xl mx-auto md:px-6 pt-20 md:pt-36 md:pb-16 grid grid-cols-1 md:grid-cols-2 md:gap-12 items-center">
                            {/* The picture people have already seen, shown as it is. On a phone it is
                                trimmed to its lower part, where the logo and the words are. */}
                            <img
                                src={hero.image}
                                alt={hero.imageAlt}
                                className="w-full aspect-[5/4] md:aspect-[4/5] object-cover object-bottom md:rounded-2xl md:order-2"
                            />
                            <div className="px-6 md:px-0 py-9 md:py-0 text-center md:text-left">
                                <HeroText hero={hero} cta={cta} />
                            </div>
                        </div>
                    </section>
                ) : (
                    <section id="hero" className="relative flex items-center overflow-hidden bg-rr-dark">
                        <div className="absolute inset-0">
                            <img src={hero.image} alt={hero.imageAlt} className="w-full h-full object-cover object-center" />
                            <div className="absolute inset-0 bg-rr-dark/75" />
                            <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/70 to-rr-dark/40" />
                        </div>
                        <div className="relative w-full max-w-4xl mx-auto px-6 pt-36 md:pt-48 pb-16 md:pb-24 text-center">
                            <HeroText hero={hero} cta={cta} wide />
                        </div>
                    </section>
                )}

                {/* FACTS */}
                <section className="bg-rr-navy">
                    <dl className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                        {facts.map((f) => (
                            <div key={f.label}>
                                <dt className="text-[11px] font-bold text-rr-light-pink uppercase tracking-[0.25em] mb-1">{f.label}</dt>
                                <dd className="text-white font-bold leading-snug">{f.value}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                {/* HOW THE LIST WORKS */}
                <section id="how" className="bg-white py-16 md:py-24">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-10">
                            <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">{how.eyebrow}</p>
                            <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none">{how.title}</h2>
                        </div>

                        <ol className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                            {how.steps.map((s) => (
                                <li key={s.n} className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                                    <p className="text-3xl font-black text-rr-pink mb-3" aria-hidden="true">{s.n}</p>
                                    <h3 className="text-lg font-black text-rr-dark uppercase tracking-wide mb-2">{s.t}</h3>
                                    <p className="text-[15px] text-rr-charcoal font-medium leading-relaxed">{s.d}</p>
                                </li>
                            ))}
                        </ol>

                        <div className="border-l-4 border-rr-pink bg-pink-50 rounded-r-2xl p-6">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-wide mb-1.5">{how.notice.title}</h3>
                            <p className="text-rr-charcoal font-medium leading-relaxed">{how.notice.body}</p>
                        </div>
                    </div>
                </section>

                {/* THE SESSION */}
                <section id="about" className="bg-slate-50 py-16 md:py-24">
                    <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <img
                            src={about.image}
                            alt={about.imageAlt}
                            loading="lazy"
                            className="w-full aspect-[4/5] md:aspect-[4/5] max-h-[520px] object-cover rounded-2xl"
                        />
                        <div>
                            <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">{about.eyebrow}</p>
                            <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6">{about.title}</h2>
                            {about.paragraphs.map((p) => (
                                <p key={p} className="text-lg text-rr-charcoal font-medium leading-relaxed mb-4">{p}</p>
                            ))}
                            <button
                                onClick={scrollToForm}
                                className="mt-3 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-sm px-8 py-4 rounded-full transition-colors duration-300"
                            >
                                {cta}
                            </button>
                            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                                {about.links.map((l) => (
                                    <Link key={l.to} to={l.to} className="text-sm font-bold text-rr-blue underline underline-offset-4 hover:text-rr-pink">
                                        {l.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <InvitationForm campaign={campaign} />
            </main>

            <PartnerStack />
            <Footer />
        </div>
    );
};

export default InvitationPage;
