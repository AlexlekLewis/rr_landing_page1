import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import HomeHero from './HomeHero';
import HomeTrustBar from './HomeTrustBar';
import HomeAbout from './HomeAbout';
import HomeProgramCards from './HomeProgramCards';
import HomeVideo from './HomeVideo';
import HomeShopFeature from './HomeShopFeature';
import HomeCinematicBreak from './HomeCinematicBreak';
import HomeCoaches from './HomeCoaches';
import HomeFAQ from './HomeFAQ';
import HomeFinalCTA from './HomeFinalCTA';
import HomeStickyCTA from './HomeStickyCTA';
import RegisterDrawer from './RegisterDrawer';
import PowerGameTopBanner from './PowerGameTopBanner';
import RegisterModal from '../power-game/RegisterModal';
import usePageAnalytics from '../../hooks/usePageAnalytics';

const PG_POPUP_KEY = 'pg_popup_shown';

const SECTIONS = ['hero', 'trust', 'about', 'video', 'programs', 'coaches', 'faq', 'final-cta'];

const HomePage = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [pgModalOpen, setPgModalOpen] = useState(false);

    usePageAnalytics('/', { sections: SECTIONS });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Power Game interest popup — once per session, after a short delay
    useEffect(() => {
        if (sessionStorage.getItem(PG_POPUP_KEY)) return;
        const timer = setTimeout(() => {
            setPgModalOpen(true);
            sessionStorage.setItem(PG_POPUP_KEY, '1');
        }, 8000);
        return () => clearTimeout(timer);
    }, []);

    const openDrawer = () => setDrawerOpen(true);
    const closeDrawer = () => setDrawerOpen(false);
    const openPgModal = () => setPgModalOpen(true);
    const closePgModal = () => setPgModalOpen(false);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="home" onRegisterClick={openDrawer} />
            <PowerGameTopBanner onRegisterClick={openPgModal} />

            <main className="flex-1 w-full overflow-hidden">
                <div id="hero"><HomeHero onRegisterClick={openDrawer} /></div>
                <div id="about"><HomeAbout /></div>
                <div id="video"><HomeVideo /></div>
                {/* The Power Game card (urgency_type 'coming_soon') fires onRegisterClick —
                    point it at the shared Power Game RegisterModal. */}
                <div id="programs"><HomeProgramCards onRegisterClick={openPgModal} /></div>
                <div id="shop"><HomeShopFeature /></div>
                <div id="coaches"><HomeCoaches /></div>
                <div id="faq"><HomeFAQ onRegisterClick={openDrawer} /></div>
            </main>

            <Footer />
            <HomeStickyCTA onRegisterClick={openDrawer} />
            <RegisterDrawer isOpen={drawerOpen} onClose={closeDrawer} />
            <RegisterModal isOpen={pgModalOpen} onClose={closePgModal} />
        </div>
    );
};

export default HomePage;
