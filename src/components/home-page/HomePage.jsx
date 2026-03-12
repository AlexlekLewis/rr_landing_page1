import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import HomeHero from './HomeHero';
import HomeTrustBar from './HomeTrustBar';
import HomeAbout from './HomeAbout';
import HomeProgramCards from './HomeProgramCards';
import HomeVideo from './HomeVideo';
import HomeCinematicBreak from './HomeCinematicBreak';
import HomeCoaches from './HomeCoaches';
import HomeFAQ from './HomeFAQ';
import HomeFinalCTA from './HomeFinalCTA';
import HomeStickyCTA from './HomeStickyCTA';
import RegisterDrawer from './RegisterDrawer';
import usePageAnalytics from '../../hooks/usePageAnalytics';

const SECTIONS = ['hero', 'trust', 'about', 'video', 'programs', 'coaches', 'faq', 'final-cta'];

const HomePage = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    usePageAnalytics('/', { sections: SECTIONS });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const openDrawer = () => setDrawerOpen(true);
    const closeDrawer = () => setDrawerOpen(false);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="home" onRegisterClick={openDrawer} />

            <main className="flex-1 w-full overflow-hidden">
                <div id="hero"><HomeHero onRegisterClick={openDrawer} /></div>
                <div id="about"><HomeAbout /></div>
                <div id="video"><HomeVideo /></div>
                <div id="programs"><HomeProgramCards onRegisterClick={openDrawer} /></div>
                <div id="coaches"><HomeCoaches /></div>
                <div id="faq"><HomeFAQ onRegisterClick={openDrawer} /></div>
            </main>

            <Footer />
            <HomeStickyCTA onRegisterClick={openDrawer} />
            <RegisterDrawer isOpen={drawerOpen} onClose={closeDrawer} />
        </div>
    );
};

export default HomePage;
