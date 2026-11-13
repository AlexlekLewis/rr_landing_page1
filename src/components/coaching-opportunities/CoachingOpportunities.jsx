import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import PartnerStack from '../power-game/PartnerStack';
import HeroSection from './HeroSection';
import CoachingSectionNav from './CoachingSectionNav';
import WhereWhenSection from './WhereWhenSection';
import RolesSection from './RolesSection';
import CoachesAtWorkSection from './CoachesAtWorkSection';
import AboutSection from './AboutSection';
import HallaBolCTA from './HallaBolCTA';
import StandardsSection from './StandardsSection';
import VideoSection from './VideoSection';
import HubSection from './HubSection';
import DevelopmentSection from './DevelopmentSection';
import StructureSection from './StructureSection';
import ProcessSection from './ProcessSection';
import ApplicationForm from './ApplicationForm';
import usePageAnalytics from '../../hooks/usePageAnalytics';

// /careers is a coaching-only page (Andy, 13 Nov 2026): coaching roles, our coaches
// at work, and one coaching application. Order: facts → roles → pathway → coaches
// at work → why → standards → development → how to apply → form.
const SECTIONS = [
    'hero',
    'where-when',
    'roles',
    'pathway',
    'coaches-at-work',
    'why-coach',
    'video',
    'standards',
    'development',
    'hub',
    'process',
    'halla-bol',
    'application-form',
];

// Offsets anchor jumps so a section heading is not hidden under the fixed Navbar
// plus the sticky coaching section bar.
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
                <div id="hero">
                    <HeroSection />
                </div>
                <CoachingSectionNav />
                <div id="where-when" className={ANCHOR}>
                    <WhereWhenSection />
                </div>
                <div id="roles" className={ANCHOR}>
                    <RolesSection />
                </div>
                <div id="pathway" className={ANCHOR}>
                    <StructureSection />
                </div>
                <div id="coaches-at-work" className={ANCHOR}>
                    <CoachesAtWorkSection />
                </div>
                <div id="why-coach" className={ANCHOR}>
                    <AboutSection />
                </div>
                <div id="video" className={ANCHOR}>
                    <VideoSection />
                </div>
                <div id="standards" className={ANCHOR}>
                    <StandardsSection />
                </div>
                <div id="development" className={ANCHOR}>
                    <DevelopmentSection />
                </div>
                <div id="hub" className={ANCHOR}>
                    <HubSection />
                </div>
                <div id="process" className={ANCHOR}>
                    <ProcessSection />
                </div>
                <div id="halla-bol">
                    <HallaBolCTA />
                </div>
                <div id="application-form" className={ANCHOR}>
                    <ApplicationForm />
                </div>
            </main>
            <PartnerStack />
            <Footer />
        </div>
    );
};

export default CoachingOpportunities;
