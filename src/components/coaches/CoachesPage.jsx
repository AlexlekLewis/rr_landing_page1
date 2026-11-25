import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import PartnerStack from '../power-game/PartnerStack';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import { HomeHeader, HomeFooter } from '../home-v2/HomeV2Parts';
import { ALL_COACHES, CENTRE_FILTERS, coachAt } from './coachesPageData';
import '../home-v2/homeV2.css';

// /coaches: every coach on one page, in the /programs style (Andy, 25 Nov 2026). The home-page
// coaching-team row links here. Most experienced first; tap a centre to see who coaches there.
// Data and order: coachesPageData.js.
const SECTIONS = ['coaches-hero', 'coaches-list', 'coaches-join'];

const initials = (n) => n.split(' ').map((w) => w[0]).join('');

const CoachesPage = () => {
    usePageAnalytics('/coaches', { sections: SECTIONS });
    useEffect(() => { window.scrollTo(0, 0); }, []);
    const [centre, setCentre] = useState('all');
    const shown = ALL_COACHES.filter((c) => coachAt(c, centre));
    const toList = () => document.getElementById('coaches-list')?.scrollIntoView({ behavior: 'smooth' });

    return (
        <div className="rrh min-h-screen flex flex-col selection:bg-rr-pink selection:text-white relative">
            <HomeHeader onRegister={toList} />
            <main className="flex-1 w-full overflow-hidden">
                <section className="band band-video pg-hero" id="coaches-hero">
                    <div className="wrap">
                        <span className="eyebrow">Rajasthan Royals Academy Melbourne</span>
                        <h1>OUR COACHES</h1>
                        <p>Meet the coaches who run our programs, where they coach and what they bring. Our most experienced coaches are first.</p>
                    </div>
                </section>

                <section className="strip" id="coaches-list">
                    <div className="wrap">
                        <div className="coach-filter" role="tablist" aria-label="Show coaches by centre">
                            {CENTRE_FILTERS.map((f) => (
                                <button
                                    key={f.slug}
                                    type="button"
                                    role="tab"
                                    aria-selected={centre === f.slug}
                                    className={centre === f.slug ? 'on' : ''}
                                    data-cta={`coaches-filter-${f.slug}`}
                                    onClick={() => setCentre(f.slug)}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        <div className="prog-grid">
                            {shown.map((c) => (
                                <article key={c.slug} className="prog-card coach-card" id={`coach-${c.slug}`}>
                                    <div className="prog-img coach-img">
                                        {c.img
                                            ? <img src={c.img} alt={c.name} loading="lazy" decoding="async" style={{ objectPosition: c.pos }} />
                                            : <span className="coach-initials" aria-hidden="true">{initials(c.name)}</span>}
                                    </div>
                                    <div className="prog-body">
                                        <h2>{c.name}</h2>
                                        <p className="coach-role">{c.role}</p>
                                        <p className="coach-where"><MapPin aria-hidden="true" />{c.where}</p>
                                        {c.specialism && <p className="prog-line">{c.specialism}</p>}
                                        {c.bio && <p className="prog-detail">{c.bio}</p>}
                                        {c.link && (
                                            <Link className="btn prog-btn" to={c.link} data-cta={`coaches-book-${c.slug}`}>
                                                Private coaching <ArrowRight />
                                            </Link>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="strip white" id="coaches-join">
                    <div className="wrap prog-help">
                        <div>
                            <h2>WANT TO COACH WITH US?</h2>
                            <p className="strip-sub">We're hiring coaches across Melbourne, experienced or just starting out.</p>
                        </div>
                        <Link className="btn" to="/careers" data-cta="coaches-join-careers">Apply to Coach <ArrowRight /></Link>
                    </div>
                </section>
            </main>
            <PartnerStack theme="light" />
            <HomeFooter />
        </div>
    );
};

export default CoachesPage;
