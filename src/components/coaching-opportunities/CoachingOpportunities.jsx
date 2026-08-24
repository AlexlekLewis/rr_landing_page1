import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import HeroSection from './HeroSection';
import RolesSection from './RolesSection';
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

const SECTIONS = [
    'hero',
    'roles',
    'about',
    'standards',
    'video',
    'hub',
    'development',
    'structure',
    'process',
    'halla-bol',
    'application-form',
];

const CoachingOpportunities = () => {
    usePageAnalytics('/careers', { sections: SECTIONS });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="holiday" />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero">
                    <HeroSection />
                </div>
                <div id="roles">
                    <RolesSection />
                </div>
                <div id="about">
                    <AboutSection />
                </div>
                <div id="standards">
                    <StandardsSection />
                </div>
                <div id="video">
                    <VideoSection />
                </div>
                <div id="hub">
                    <HubSection />
                </div>
                <div id="development">
                    <DevelopmentSection />
                </div>
                <div id="structure">
                    <StructureSection />
                </div>
                <div id="process">
                    <ProcessSection />
                </div>
                <div id="halla-bol">
                    <HallaBolCTA />
                </div>
                <div id="application-form">
                    <ApplicationForm />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CoachingOpportunities;
