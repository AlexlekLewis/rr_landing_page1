import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import PartnerStack from '../power-game/PartnerStack';
import NewsCard from './NewsCard';
import { useStories } from './news';
import usePageAnalytics from '../../hooks/usePageAnalytics';

// /news: every story, newest first. The newest is the big featured card. Stories: newsStories.js.
const SECTIONS = ['hero', 'stories', 'programs'];

export const ProgramsCta = () => (
    <section id="programs-cta" className="py-16 md:py-20 bg-rr-dark scroll-mt-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Play the Royals Way</p>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Find your <span className="text-rr-pink">program</span></h2>
            <p className="text-white/70 font-medium mt-4 max-w-xl mx-auto">Junior coaching, representative squads, private coaching and tours, across Melbourne.</p>
            <a href="/programs" data-cta="news-explore-programs"
                className="mt-8 inline-flex items-center bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-sm rounded-full px-8 py-4 transition-colors">
                Explore programs
            </a>
        </div>
    </section>
);

const NewsPage = () => {
    usePageAnalytics('/news', { sections: SECTIONS });
    useEffect(() => { window.scrollTo(0, 0); }, []);
    const { stories } = useStories();
    const [lead, ...rest] = stories;

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="coaches" navLinksOverride={[]} ctaLabelOverride="EXPLORE PROGRAMS" ctaTargetOverride="programs-cta" />
            <main className="flex-1 w-full overflow-hidden">
                <section id="hero" className="pt-32 md:pt-40 pb-10 bg-slate-50">
                    <div className="max-w-6xl mx-auto px-6">
                        <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Rajasthan Royals Academy Melbourne</p>
                        <h1 className="text-4xl md:text-6xl font-black text-rr-dark uppercase tracking-tight">News &amp; <span className="text-rr-pink">features</span></h1>
                        <p className="text-rr-charcoal font-medium mt-4 max-w-2xl">What is happening across our programs, our players and the wider Royals family.</p>
                    </div>
                </section>
                <section id="stories" className="py-12 md:py-16">
                    <div className="max-w-6xl mx-auto px-6 space-y-6">
                        {lead ? <NewsCard story={lead} lead /> : <p className="text-rr-charcoal">No stories yet. Check back soon.</p>}
                        {rest.length > 0 && (
                            <div className={`grid grid-cols-1 sm:grid-cols-2 ${rest.length >= 3 ? 'lg:grid-cols-3' : ''} gap-5`}>
                                {rest.map((s) => <NewsCard key={s.id} story={s} />)}
                            </div>
                        )}
                        <p className="pt-2 text-sm text-rr-charcoal/70">
                            Looking for photos and videos? They are on the <Link to="/#photos" className="font-bold text-rr-pink hover:underline">home page</Link>.
                        </p>
                    </div>
                </section>
                <ProgramsCta />
            </main>
            <PartnerStack />
            <Footer />
        </div>
    );
};

export default NewsPage;
