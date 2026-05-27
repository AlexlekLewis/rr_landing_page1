import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import HeroSection from './HeroSection';
import QuoteBlock from './QuoteBlock';
import VideoSection from './VideoSection';
import FeaturesBenefits from './FeaturesBenefits';
import SquadsSection from './SquadsSection';
import LocationsSection from './LocationsSection';
import usePageAnalytics from '../../hooks/usePageAnalytics';

const SECTIONS = [
    'hero',
    'quote-1',
    'video',
    'features-benefits',
    'quote-vaibhav',
    'squads',
    'locations',
    'quote-3',
];

const PowerGame = () => {
    usePageAnalytics('/power-game-program', { sections: SECTIONS });

    useEffect(() => {
        window.scrollTo(0, 0);
        // Set page title for browser tab + SEO (page is hidden from nav)
        document.title = 'The Power Game Program | Rajasthan Royals Academy Melbourne';
    }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero">
                    <HeroSection />
                </div>

                <div id="quote-1">
                    <QuoteBlock
                        variant="light"
                        quote="Placeholder quote one — a powerful statement from a coach or player about what the Power Game Program means for development."
                        attribution="Coach Name TBC"
                        role="Role / Title TBC"
                    />
                </div>

                <div id="video">
                    <VideoSection />
                </div>

                <div id="features-benefits">
                    <FeaturesBenefits />
                </div>

                <div id="quote-vaibhav">
                    <QuoteBlock
                        variant="feature"
                        quote="Placeholder quote from Vaibhav — to be provided. This will be the centerpiece testimonial of the program, anchoring credibility and aspiration."
                        attribution="Vaibhav Suryavanshi"
                        role="Rajasthan Royals"
                        image="/assets/powergame/vaibhav.png"
                        imageAlt="Vaibhav Suryavanshi"
                    />
                </div>

                <div id="squads">
                    <SquadsSection />
                </div>

                <div id="locations">
                    <LocationsSection />
                </div>

                <div id="quote-3">
                    <QuoteBlock
                        variant="dark"
                        quote="Placeholder quote three — a closing statement from a parent, player, or director that reinforces the impact of the program."
                        attribution="Attribution TBC"
                        role="Role TBC"
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PowerGame;
