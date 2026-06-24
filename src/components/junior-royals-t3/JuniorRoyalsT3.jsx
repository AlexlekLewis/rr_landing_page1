import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import JRT3Hero from './JRT3Hero';
import JRT3Overview from './JRT3Overview';
import JRT3Coaches from './JRT3Coaches';
import LCApp from '../little-crickets/LCApp';
import JRT3Locations from './JRT3Locations';
import JRT3RegistrationForm from './JRT3RegistrationForm';
import JRT3StickyCTA from './JRT3StickyCTA';
import usePageAnalytics from '../../hooks/usePageAnalytics';

const SECTIONS = ['hero', 'program-overview', 'coaches', 'app', 'locations', 'registration-form'];

const JuniorRoyalsT3 = () => {
    usePageAnalytics('/junior-royals', { sections: SECTIONS });
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="junior-royals" />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero"><JRT3Hero /></div>
                <div id="program-overview"><JRT3Overview /></div>
                <div id="coaches"><JRT3Coaches /></div>
                <div id="app"><LCApp /></div>
                <div id="locations"><JRT3Locations /></div>
                <div id="registration-form"><JRT3RegistrationForm /></div>
            </main>
            <Footer />
            <JRT3StickyCTA />
        </div>
    );
};

export default JuniorRoyalsT3;
