import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import HeroSection from './HeroSection';
import QuoteBlock from './QuoteBlock';
import VideoSection from './VideoSection';
import OverviewSection from './OverviewSection';
import FeaturesBenefits from './FeaturesBenefits';
import ProgramSelector from './ProgramSelector';
import PricingSection from './PricingSection';
import PartnerStack from './PartnerStack';
import usePageAnalytics from '../../hooks/usePageAnalytics';

const SECTIONS = [
    'hero',
    'quote-1',
    'overview',
    'features-benefits',
    'quote-vaibhav',
    'video',
    'pricing',
    'academy-video',
    'select-program',
    'apply',
    'partners',
];

const PowerGame = () => {
    usePageAnalytics('/PGP2026', { sections: SECTIONS });

    useEffect(() => {
        window.scrollTo(0, 0);
        // Set page title for browser tab + SEO (page is hidden from nav)
        document.title = 'The Power Game Program | Rajasthan Royals Academy Melbourne';
    }, []);

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

                <div id="select-program">
                    <ProgramSelector />
                </div>

                {/* Registration is the apply funnel (qualify → place → pay) at /PGP2026/apply. */}
                <div id="apply" className="py-20 md:py-28 bg-rr-dark text-white text-center px-5">
                    <div className="max-w-2xl mx-auto">
                        <div className="text-rr-pink font-black uppercase tracking-[0.3em] text-xs mb-3">Apply now</div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wide mb-4">Earn your place</h2>
                        <p className="text-white/60 mb-8 max-w-xl mx-auto">Qualify on your cricket, get matched to a squad at your level, and secure your spot — it takes about three minutes.</p>
                        <a href="/PGP2026/apply" className="inline-block bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-sm rounded-full px-8 py-4 transition-all hover:shadow-[0_0_30px_rgba(229,6,149,0.5)]">
                            Start your application →
                        </a>
                    </div>
                </div>

                <div id="partners">
                    <PartnerStack />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PowerGame;
