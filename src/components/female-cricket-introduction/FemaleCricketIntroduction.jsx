import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import HeroSection from './HeroSection';
import ProgramOverview from './ProgramOverview';
import ProgramStructure from './ProgramStructure';
import CoachesSection from './CoachesSection';
import LocationsSection from './LocationsSection';
import PricingSection from './PricingSection';
import RegistrationForm from './RegistrationForm';
import FAQSection from './FAQSection';
import StickyCTA from './StickyCTA';
import usePageAnalytics from '../../hooks/usePageAnalytics';

const SECTIONS = [
    'hero',
    'program-overview',
    'program-structure',
    'coaches',
    'locations',
    'pricing',
    'registration-form',
    'faq',
];

const FemaleCricketIntroduction = () => {
    usePageAnalytics('/femalecricketintroduction', { sections: SECTIONS });

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
                <div id="program-overview">
                    <ProgramOverview />
                </div>
                <div id="program-structure">
                    <ProgramStructure />
                </div>
                <div id="coaches">
                    <CoachesSection />
                </div>
                <div id="locations">
                    <LocationsSection />
                </div>
                <div id="pricing">
                    <PricingSection />
                </div>
                <div id="registration-form">
                    <RegistrationForm />
                </div>
                <div id="faq">
                    <FAQSection />
                </div>
            </main>
            <Footer />
            <StickyCTA />
        </div>
    );
};

export default FemaleCricketIntroduction;
