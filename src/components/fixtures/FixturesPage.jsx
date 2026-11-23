import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import PartnerStack from '../power-game/PartnerStack';
import FixtureCard from './FixtureCard';
import { FIXTURES, HAS_SAMPLES, dayLabel, upcoming, results } from './fixturesData';
import usePageAnalytics from '../../hooks/usePageAnalytics';

// /fixtures (DRAFT): upcoming matches grouped by day, and results, with a filter by competition.
const SECTIONS = ['hero', 'fixtures'];

const byDay = (list) => list.reduce((acc, f) => {
    const k = dayLabel(f.startsAt);
    (acc[k] = acc[k] || []).push(f);
    return acc;
}, {});

const FixturesPage = () => {
    usePageAnalytics('/fixtures', { sections: SECTIONS });
    useEffect(() => { window.scrollTo(0, 0); }, []);
    const [tab, setTab] = useState('upcoming');
    const [comp, setComp] = useState('All');
    const comps = useMemo(() => ['All', ...new Set(FIXTURES.map((f) => f.competition))], []);
    const list = (tab === 'upcoming' ? upcoming() : results()).filter((f) => comp === 'All' || f.competition === comp);
    const groups = byDay(list);
    const pill = (on) => `rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest transition-colors ${on ? 'bg-rr-pink text-white' : 'bg-white border border-slate-200 text-rr-dark hover:border-rr-pink'}`;

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="coaches" navLinksOverride={[]} ctaLabelOverride="EXPLORE PROGRAMS" ctaTargetOverride="fixtures" />
            <main className="flex-1 w-full overflow-hidden">
                <section id="hero" className="pt-32 md:pt-40 pb-10 bg-slate-50">
                    <div className="max-w-6xl mx-auto px-6">
                        {HAS_SAMPLES && (
                            <p className="mb-5 inline-block rounded-lg bg-amber-100 border border-amber-300 px-3 py-2 text-xs font-bold text-amber-900">
                                Draft: fixtures marked “Sample” are invented to show the layout. Not live.
                            </p>
                        )}
                        <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Rajasthan Royals Academy Melbourne</p>
                        <h1 className="text-4xl md:text-6xl font-black text-rr-dark uppercase tracking-tight">Fixtures &amp; <span className="text-rr-pink">results</span></h1>
                        <p className="text-rr-charcoal font-medium mt-4 max-w-2xl">Where and when our players are in action across Melbourne. Families and friends are welcome to come and watch.</p>
                    </div>
                </section>
                <section id="fixtures" className="py-10 md:py-14 scroll-mt-24">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <div className="flex flex-wrap items-center gap-2 mb-3" role="tablist" aria-label="Fixtures or results">
                            <button type="button" role="tab" aria-selected={tab === 'upcoming'} className={pill(tab === 'upcoming')} onClick={() => setTab('upcoming')} data-cta="fixtures-tab-upcoming">Upcoming</button>
                            <button type="button" role="tab" aria-selected={tab === 'results'} className={pill(tab === 'results')} onClick={() => setTab('results')} data-cta="fixtures-tab-results">Results</button>
                        </div>
                        {comps.length > 2 && (
                            <div className="flex flex-wrap items-center gap-2 mb-8" aria-label="Filter by competition">
                                {comps.map((c) => (
                                    <button key={c} type="button" onClick={() => setComp(c)} aria-pressed={comp === c} data-cta={`fixtures-filter-${c.toLowerCase().replace(/\s+/g, '-')}`}
                                        className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors ${comp === c ? 'bg-rr-dark text-white' : 'bg-slate-100 text-rr-charcoal hover:bg-slate-200'}`}>
                                        {c}
                                    </button>
                                ))}
                            </div>
                        )}
                        {list.length === 0 ? (
                            <p className="rounded-2xl bg-slate-50 border border-slate-200 p-6 text-rr-charcoal">
                                {tab === 'upcoming' ? 'No fixtures announced yet. Check back soon, or follow us on Instagram for match-day updates.' : 'No results yet.'}
                            </p>
                        ) : (
                            <div className="space-y-8">
                                {Object.entries(groups).map(([day, fs]) => (
                                    <div key={day}>
                                        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-rr-dark mb-3 pb-2 border-b border-slate-200">{day}</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{fs.map((f) => <FixtureCard key={f.id} f={f} />)}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <PartnerStack />
            <Footer />
        </div>
    );
};

export default FixturesPage;
