import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import PartnerStack from '../power-game/PartnerStack';
import HeroSection from './HeroSection';
import CoachingSectionNav from './CoachingSectionNav';
import WhatItIsSection from './WhatItIsSection';
import BenefitsSection from './BenefitsSection';
import CoachesAtWorkSection from './CoachesAtWorkSection';
import HowToJoinSection from './HowToJoinSection';
import ApplicationForm from './ApplicationForm';
import usePageAnalytics from '../../hooks/usePageAnalytics';

// /careers is a coaching-only page (Andy, 13 Nov 2026). Kept deliberately short
// (Andy, 13 Nov 2026: "reduce fluff, keep the images"): what it is, the benefits,
// our coaches in action, how to become a Royals Academy coach, then the form.
const SECTIONS = ['hero', 'what-it-is', 'benefits', 'coaches-at-work', 'how-to-join', 'application-form'];

// Offsets anchor jumps so a heading is not hidden under the fixed Navbar plus the
// sticky coaching section bar.
const ANCHOR = 'scroll-mt-[124px] md:scroll-mt-[156px]';

const CoachingOpportunities = () => {
    usePageAnalytics('/careers', { sections: SECTIONS });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar
                variant="holiday"
                navLinksOverride={[]}
                ctaLabelOverride="APPLY TO COACH"
                ctaTargetOverride="application-form"
            />
            {/* overflow-x-clip, not overflow-hidden: hidden would stop the section bar sticking */}
            <main className="flex-1 w-full overflow-x-clip">
                <div id="hero"><HeroSection /></div>
                <CoachingSectionNav />
                <div id="what-it-is" className={ANCHOR}><WhatItIsSection /></div>
                <div id="benefits" className={ANCHOR}><BenefitsSection /></div>
                <div id="coaches-at-work" className={ANCHOR}><CoachesAtWorkSection /></div>
                <div id="how-to-join" className={ANCHOR}><HowToJoinSection /></div>
                <div id="application-form" className={ANCHOR}><ApplicationForm /></div>
            </main>
            <PartnerStack />
            <Footer />
        </div>
    );
};

export default CoachingOpportunities;
