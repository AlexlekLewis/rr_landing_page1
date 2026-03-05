import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import MasterHero from './MasterHero';
import TrustBar from './TrustBar';
import CoachesSection from './CoachesSection';
import ProgramJourney from './ProgramJourney';
import ValueStack from './ValueStack';
import MasterFAQ from './MasterFAQ';
import MasterCheckout from './MasterCheckout';
import StickyCTA from './StickyCTA';

import TheRoyalsWay from '../landing-page-2/TheRoyalsWay';
import ProgramAtAGlance from '../landing-page-2/ProgramAtAGlance';
import SpecialistCoaching from '../landing-page-2/SpecialistCoaching';
import BeyondTwelveWeeks from '../landing-page-2/BeyondTwelveWeeks';
import RrampDnaProfile from '../landing-page-2/RrampDnaProfile';
import TheDreamAndPathway from './TheDreamAndPathway';
import SessionWalkthrough from './SessionWalkthrough';
import FacilityAndTestimonials from './FacilityAndTestimonials';

import usePageAnalytics from '../../hooks/usePageAnalytics';

const MASTER_SECTIONS = [
    'hero', 'trust-bar', 'dream-pathway', 'program-at-a-glance', 'program',
    'specialist-coaching', 'the-royals-way', 'session-walkthrough', 'technology',
    'coaches', 'facility', 'beyond-12-weeks', 'value-stack', 'faq', 'checkout'
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

                {/* 3. The Dream & Pathway */}
                <div id="dream-pathway"><TheDreamAndPathway /></div>

                {/* 4. The Methodology (The Science & The Setup) */}
                <div id="program-at-a-glance"><ProgramAtAGlance /></div>

                {/* 5. 12-Week Program Journey */}
                <div id="program"><ProgramJourney /></div>

                <div id="specialist-coaching"><SpecialistCoaching /></div>
                <div id="the-royals-way"><TheRoyalsWay /></div>
                <div id="session-walkthrough"><SessionWalkthrough /></div>

                {/* 6. Technology Edge (RRAM DNA PROFILE) */}
                <div id="technology"><RrampDnaProfile /></div>

                {/* 7. The Environment & The Coaches */}
                <div id="coaches"><CoachesSection /></div>
                <div id="facility"><FacilityAndTestimonials /></div>

                {/* 8. The Value Stack & Investment */}
                <div id="beyond-12-weeks"><BeyondTwelveWeeks /></div>
                <div id="value-stack"><ValueStack /></div>

                {/* 9. FAQ */}
                <div id="faq"><MasterFAQ /></div>

                {/* 10. Checkout */}
                <div id="checkout"><MasterCheckout /></div>
            </main>

            <Footer />

            {/* Sticky Mobile CTA */}
            <StickyCTA />
        </div>
    );
};

export default MasterLandingPage;
