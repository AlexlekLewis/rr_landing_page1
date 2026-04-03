import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import LCHero from './LCHero';
import LCOverview from './LCOverview';
import LCLocations from './LCLocations';
import LCRegistrationForm from './LCRegistrationForm';
import LCStickyCTA from './LCStickyCTA';
import usePageAnalytics from '../../hooks/usePageAnalytics';

const SECTIONS = [
    'hero',
    'program-overview',
    'locations',
    'registration-form',
];

const LittleCrickets = () => {
    usePageAnalytics('/junior-royals', { sections: SECTIONS });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="junior-royals" />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero">
                    <LCHero />
                </div>
                <div id="program-overview">
                    <LCOverview />
                </div>
                <div id="locations">
                    <LCLocations />
                </div>
                <div id="registration-form">
                    <LCRegistrationForm />
                </div>
            </main>
            <Footer />
            <LCStickyCTA />
        </div>
    );
};

export default LittleCrickets;
