import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import HeroSection from './HeroSection';
import HallaBol from './HallaBol';
import ClinicOverview from './ClinicOverview';
import SessionWalkthrough from './SessionWalkthrough';
import CoachesSection from './CoachesSection';
import ActionImage from './ActionImage';
import PricingSection from './PricingSection';
import LocationsSection from './LocationsSection';
import JulyRegistrationForm from './JulyRegistrationForm';
import JoinTheFamily from './JoinTheFamily';
import GotAQuestion from './GotAQuestion';

import StickyCTA from './StickyCTA';
import usePageAnalytics from '../../hooks/usePageAnalytics';

const SECTIONS = [
    'hero',
    'program-overview',
    'session-walkthrough',
    'coaches',
    'pricing',
    'locations',
    'registration-form',
    'faq',
];

const HolidayPrograms = () => {
    usePageAnalytics('/junior-royals-holiday', { sections: SECTIONS });

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
                <HallaBol />
                <div id="program-overview">
                    <ClinicOverview />
                </div>
                <div id="session-walkthrough">
                    <SessionWalkthrough />
                </div>
                <div id="coaches">
                    <CoachesSection />
                </div>
                <div id="pricing">
                    <ActionImage />
                    <PricingSection />
                </div>
                <JoinTheFamily />
                <div id="locations">
                    <LocationsSection />
                </div>
                <div id="registration-form">
                    <JulyRegistrationForm />
                </div>
                <GotAQuestion />
            </main>
            <Footer />
            <StickyCTA />
        </div>
    );
};

export default HolidayPrograms;
