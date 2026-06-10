import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import HeroSection from './HeroSection';
import QuoteBlock from './QuoteBlock';
import VideoSection from './VideoSection';
import OverviewSection from './OverviewSection';
import FeaturesBenefits from './FeaturesBenefits';
import PricingSection from './PricingSection';
import PartnerStack from './PartnerStack';
import usePageAnalytics from '../../hooks/usePageAnalytics';

// The apply funnel renders as a full-screen overlay so applicants never leave /PGP2026.
const ApplyFlow = React.lazy(() => import('./apply/ApplyFlow'));

const SECTIONS = [
    'hero',
    'quote-1',
    'overview',
    'features-benefits',
    'quote-vaibhav',
    'video',
    'pricing',
    'academy-video',
    'apply',
    'partners',
];

const PowerGame = () => {
    usePageAnalytics('/PGP2026', { sections: SECTIONS });
    const [showApply, setShowApply] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        // Set page title for browser tab + SEO (page is hidden from nav)
        document.title = 'The Power Game Program | Rajasthan Royals Academy Melbourne';
    }, []);

    // Lock background scroll while the apply overlay is open.
    useEffect(() => {
        document.body.style.overflow = showApply ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [showApply]);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="power-game" />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero">
                    <HeroSection />
                </div>

                <div id="quote-1">
                    <QuoteBlock
                        variant="overlay"
                        imagePosition="left"
                        quote="Our job is to give players the tools to reach for power when the situation demands it — across any format of the game."
                        attribution="Alex Lewis"
                        role="Rajasthan Royals Academy Head Coach"
                        image="/assets/powergame/alex-lewis.jpg"
                        imageAlt="Alex Lewis coaching at Rajasthan Royals Academy Melbourne"
                    />
                </div>

                <div id="overview">
                    <OverviewSection />
                </div>

                <div id="features-benefits">
                    <FeaturesBenefits />
                </div>

                <div id="quote-vaibhav">
                    <QuoteBlock
                        variant="feature"
                        quote="I want to score 200 in T20s. I want to break Gayle's record."
                        attribution="Vaibhav Suryavanshi"
                        role="Rajasthan Royals"
                        image="/assets/powergame/vaibhav.jpg"
                        imageAlt="Vaibhav Suryavanshi"
                        imageFit="cover"
                        commentary="This statement, and the likelihood he will do it, has changed the game forever. There is now a new standard that every other team needs to find players to keep pace with this extraordinary talent."
                    />
                </div>

                <div id="video">
                    <VideoSection />
                </div>

                <div id="pricing">
                    <PricingSection />
                </div>

                <div id="academy-video">
                    <VideoSection
                        badge="Inside the Academy"
                        heading={<>THE ROYALS ACADEMY <span className="text-rr-pink">PROGRAM</span></>}
                        description="Go inside the Rajasthan Royals Academy program — the methodology, the environment, and what it means to develop the Royals way."
                        videoSrc="/assets/powergame/royals-academy-video.mp4"
                        posterSrc="/assets/powergame/royals-academy-poster.jpg"
                    />
                </div>

                {/* Registration IS the ability funnel (qualify → place → pay) at /PGP2026/apply. */}
                <div id="apply" className="py-20 md:py-28 bg-rr-dark text-white text-center px-5">
                    <div className="max-w-2xl mx-auto">
                        <div className="text-rr-pink font-black uppercase tracking-[0.3em] text-xs mb-3">Secure your place</div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wide mb-4">Earn your place</h2>
                        <p className="text-white/60 mb-2 max-w-xl mx-auto">Qualify on your cricket, get matched to a squad at your level &amp; venue, and lock in your spot — about three minutes.</p>
                        <p className="text-white/40 text-sm mb-8">The Power Game · 8-week block · <span className="text-white font-bold">$960</span></p>
                        <button onClick={() => setShowApply(true)} className="inline-block bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-sm rounded-full px-8 py-4 transition-all hover:shadow-[0_0_30px_rgba(229,6,149,0.5)]">
                            Start your application →
                        </button>
                        <p className="text-white/30 text-[11px] mt-4">Places are subject to meeting the program&apos;s minimum standard.</p>
                    </div>
                </div>

                <div id="partners">
                    <PartnerStack />
                </div>
            </main>
            <Footer />

            {/* Apply funnel as a full-screen overlay — keeps the applicant on /PGP2026 (no navigation). */}
            {showApply && (
                <div className="fixed inset-0 z-[100] bg-rr-dark overflow-y-auto">
                    <button
                        onClick={() => setShowApply(false)}
                        aria-label="Close application"
                        className="fixed top-4 right-4 z-[110] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-lg flex items-center justify-center transition-colors"
                    >
                        ✕
                    </button>
                    <React.Suspense fallback={<div className="min-h-screen bg-rr-dark" />}>
                        <ApplyFlow />
                    </React.Suspense>
                </div>
            )}
        </div>
    );
};

export default PowerGame;
