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
import OpenDaysModal from './OpenDaysModal';
import OpenDaysTicket from './OpenDaysTicket';
import usePageAnalytics from '../../hooks/usePageAnalytics';

const SECTIONS = ['hero', 'trust', 'about', 'video', 'programs', 'coaches', 'faq', 'final-cta'];
const OPEN_DAYS_KEY = 'openDaysModalDismissed';

const HomePage = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [openDaysModal, setOpenDaysModal] = useState(false);
    const [openDaysTicket, setOpenDaysTicket] = useState(false);

    usePageAnalytics('/', { sections: SECTIONS });

    useEffect(() => {
        window.scrollTo(0, 0);
        // Show the open-days modal to every visitor once per session; after they
        // close it, a ticket-style reminder persists (and re-opens it on tap).
        let dismissed = false;
        try { dismissed = !!sessionStorage.getItem(OPEN_DAYS_KEY); } catch (_) { /* ignore */ }
        if (dismissed) setOpenDaysTicket(true);
        else setOpenDaysModal(true);
    }, []);

    const openDrawer = () => setDrawerOpen(true);
    const closeDrawer = () => setDrawerOpen(false);

    const closeOpenDays = () => {
        setOpenDaysModal(false);
        setOpenDaysTicket(true);
        try { sessionStorage.setItem(OPEN_DAYS_KEY, '1'); } catch (_) { /* ignore */ }
    };
    const reopenOpenDays = () => { setOpenDaysTicket(false); setOpenDaysModal(true); };
    const dismissTicket = () => setOpenDaysTicket(false);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="home" onRegisterClick={openDrawer} />
            <PowerGameTopBanner />

            <main className="flex-1 w-full overflow-hidden">
                <div id="hero"><HomeHero onRegisterClick={openDrawer} /></div>
                <div id="about"><HomeAbout /></div>
                <div id="video"><HomeVideo /></div>
                <div id="programs"><HomeProgramCards /></div>
                <div id="shop"><HomeShopFeature /></div>
                <div id="coaches"><HomeCoaches /></div>
                <div id="faq"><HomeFAQ onRegisterClick={openDrawer} /></div>
            </main>

            <Footer />
            <HomeStickyCTA onRegisterClick={openDrawer} />
            <RegisterDrawer isOpen={drawerOpen} onClose={closeDrawer} />
            <OpenDaysModal open={openDaysModal} onClose={closeOpenDays} />
            <OpenDaysTicket show={openDaysTicket && !openDaysModal} onOpen={reopenOpenDays} onDismiss={dismissTicket} />
        </div>
    );
};

export default HomePage;
