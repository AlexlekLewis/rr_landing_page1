import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import MasterHero from './MasterHero';
import TrustBar from './TrustBar';
import ProblemAgitation from './ProblemAgitation';
import CoachesSection from './CoachesSection';
import ProgramJourney from './ProgramJourney';
import TechnologyEdge from './TechnologyEdge';
import TransformationStories from './TransformationStories';
import WhoThisIsFor from './WhoThisIsFor';
import ValueStack from './ValueStack';
import MasterFAQ from './MasterFAQ';
import MasterCheckout from './MasterCheckout';
import StickyCTA from './StickyCTA';

import usePageAnalytics from '../../hooks/usePageAnalytics';

const MASTER_SECTIONS = [
    'hero', 'trust-bar', 'problem', 'coaches', 'program',
    'technology', 'stories', 'qualifying', 'value-stack',
    'faq', 'checkout'
];

const MasterLandingPage = () => {
    usePageAnalytics('/master-page', { sections: MASTER_SECTIONS });

    useEffect(() => {
        // Scroll to top on mount
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="lp2" />

            <main className="flex-1 w-full overflow-hidden">
                {/* 1. The Hero */}
                <div id="hero"><MasterHero /></div>

                {/* 2. Trust Bar */}
                <div id="trust-bar"><TrustBar /></div>

                {/* 3. Problem Agitation */}
                <div id="problem"><ProblemAgitation /></div>

                {/* 4. Coaches & Environment */}
                <div id="coaches"><CoachesSection /></div>

                {/* 5. 12-Week Program Journey */}
                <div id="program"><ProgramJourney /></div>

                {/* 6. Technology Edge */}
                <div id="technology"><TechnologyEdge /></div>

                {/* 7. Transformation Stories */}
                <div id="stories"><TransformationStories /></div>

                {/* 8. Who This Is For */}
                <div id="qualifying"><WhoThisIsFor /></div>

                {/* 9. Pathway & Value Stack */}
                <div id="value-stack"><ValueStack /></div>

                {/* 10. FAQ */}
                <div id="faq"><MasterFAQ /></div>

                {/* 11. Checkout */}
                <div id="checkout"><MasterCheckout /></div>
            </main>

            <Footer />

            {/* Sticky Mobile CTA */}
            <StickyCTA />
        </div>
    );
};

export default MasterLandingPage;
