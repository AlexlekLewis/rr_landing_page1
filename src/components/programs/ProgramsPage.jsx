import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PartnerStack from '../power-game/PartnerStack';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import { HomeHeader, HomeFooter } from '../home-v2/HomeV2Parts';
import { WELCOME_SLIDE } from '../home-v2/homeV2Data';
import { ALL_PROGRAMS } from './programsData';
import Newsletter from '../home-v2/Newsletter';
import '../home-v2/homeV2.css';

// /programs: every program on one page, in the new home-page style (Andy, 23 Nov 2026).
// Each card goes straight to that program's own page. Data: programsData.js.
const SECTIONS = ['programs-hero', 'programs-list', 'newsletter', 'programs-help'];

const ProgramsPage = () => {
    usePageAnalytics('/programs', { sections: SECTIONS });
    useEffect(() => { window.scrollTo(0, 0); }, []);
    const toList = () => document.getElementById('programs-list')?.scrollIntoView({ behavior: 'smooth' });

    return (
        <div className="rrh min-h-screen flex flex-col selection:bg-rr-pink selection:text-white relative">
            <HomeHeader onRegister={toList} />
            <main className="flex-1 w-full overflow-hidden">
                <section className="band band-video pg-hero" id="programs-hero">
                    <div className="wrap">
                        <span className="eyebrow">Rajasthan Royals Academy Melbourne</span>
                        <h1>OUR PROGRAMS</h1>
                        <p>{WELCOME_SLIDE.body.split('. ')[0]}. Choose a program to see the days, times and prices, and to register.</p>
                    </div>
                </section>

                <section className="strip" id="programs-list">
                    <div className="wrap">
                        <div className="prog-grid">
                            {ALL_PROGRAMS.map((p) => (
                                <Link key={p.route} to={p.route} className="prog-card" data-cta={`programs-${p.route.slice(1)}`}>
                                    <div className="prog-img">
                                        <img src={p.src} alt={p.alt} loading="lazy" decoding="async" style={p.position ? { objectPosition: p.position } : undefined} />
                                        {p.badge && <span className={p.green ? 'tag green' : 'tag'}>{p.badge}</span>}
                                    </div>
                                    <div className="prog-body">
                                        <h2>{p.name}</h2>
                                        {p.line && <p className="prog-line">{p.line}</p>}
                                        {p.detail && <p className="prog-detail">{p.detail}</p>}
                                        <span className="btn prog-btn">{p.cta} <ArrowRight /></span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <Newsletter source="programs" />

                <section className="strip white" id="programs-help">
                    <div className="wrap prog-help">
                        <div>
                            <h2>NOT SURE WHICH PROGRAM IS RIGHT?</h2>
                            <p className="strip-sub">Tell us about your player and we will point you to the right program.</p>
                        </div>
                        <a className="btn" href="mailto:info@rramelbourne.com" data-cta="programs-help-email">Email info@rramelbourne.com</a>
                    </div>
                </section>
            </main>
            <PartnerStack theme="light" />
            <HomeFooter />
        </div>
    );
};

export default ProgramsPage;
