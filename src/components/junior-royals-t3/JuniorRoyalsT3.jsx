import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import PartnerStack from '../power-game/PartnerStack';
import JRT3Hero from './JRT3Hero';
import JRBenefits from './JRBenefits';
import JRGallery from './JRGallery';
import JRVideos from './JRVideos';
import JRT4RoyalsWay from './JRT4RoyalsWay';
import JRT3Coaches from './JRT3Coaches';
import JRT3Locations from './JRT3Locations';
import JRT3RegistrationForm from './JRT3RegistrationForm';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import { useJrContent } from './jrContent';

// 8 Nov 2026 (Andy): benefits first, less on the page. About the Program and the app
// section are gone; the benefits say it in six short cards.
const SECTIONS = ['hero', 'photos', 'videos', 'benefits', 'royals-way', 'locations', 'coaches', 'registration-form'];
// The nav's section links (the variant's own links still serve the archived Term 2 page).
const NAV = [
    { label: 'PHOTOS', id: 'photos' },
    { label: 'VIDEOS', id: 'videos' },
    { label: 'BENEFITS', id: 'benefits' },
    { label: 'HOW IT WORKS', id: 'royals-way' },
    { label: 'LOCATIONS', id: 'locations' },
    { label: 'COACHES', id: 'coaches' },
];

const JuniorRoyalsT3 = () => {
    usePageAnalytics('/junior-royals', { sections: SECTIONS });
    useJrContent(); // wording edited in the admin Junior Royals Editor
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="junior-royals" navLinksOverride={NAV} />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero"><JRT3Hero /></div>
                <div id="photos"><JRGallery /></div>
                <div id="videos"><JRVideos /></div>
                <div id="benefits"><JRBenefits /></div>
                <div id="royals-way"><JRT4RoyalsWay /></div>
                <div id="locations"><JRT3Locations /></div>
                <div id="coaches"><JRT3Coaches /></div>
                <div id="registration-form"><JRT3RegistrationForm /></div>
            </main>
            <PartnerStack />
            <Footer />
        </div>
    );
};

export default JuniorRoyalsT3;
