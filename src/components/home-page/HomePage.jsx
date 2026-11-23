import React, { useState, useEffect } from 'react';
import HomeVideo from './HomeVideo';
import HomeMedia from './HomeMedia';
import HomeStickyCTA from './HomeStickyCTA';
import RegisterDrawer from './RegisterDrawer';
import PartnerStack from '../power-game/PartnerStack';
import OpenDaysModal from './OpenDaysModal';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import { HomeHeader, WhatsOn, Banner, NewsStrip, Leadership, RoyalsWay, Store, Faq, Hire, HomeFooter } from '../home-v2/HomeV2Parts';
import HomeFixtures from '../fixtures/HomeFixtures';
import '../home-v2/homeV2.css';

// THE HOME PAGE in the rajasthanroyals.com layout (Andy, 16 Nov 2026, from his mock-up):
// two-row pink header, What's On strip, banner carousel, news, photos & videos, leadership
// and coaching team, the Royals Way, the Power Cricket Store, FAQ, hiring, partners, footer.
// "Except I want the photo/video section to be as it currently is on the live site": the
// "Introducing RRA Melbourne" video and the "Inside the Royals Academy" carousel are the
// live components, unchanged. Sections and their data: components/home-v2/.
// The previous home page sections (HomeHero, HomeAbout, HomeProgramCards, HomeShopFeature,
// HomeCoaches, HomeFAQ, HomeCareersBanner, HomeTopBanner, OpenDaysTicket) stay in the repo;
// several still supply data to the new layout.

const SECTIONS = ['hero', 'news', 'fixtures', 'video', 'photos', 'coaches', 'about', 'store', 'faq', 'careers-banner'];
const OPEN_DAYS_KEY = 'openDaysModalDismissed';

const HomePage = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [openDaysModal, setOpenDaysModal] = useState(false);

    usePageAnalytics('/', { sections: SECTIONS });

    useEffect(() => {
        window.scrollTo(0, 0);
        // The What's On pop-up shows once per visit, as before.
        let dismissed = false;
        try { dismissed = !!sessionStorage.getItem(OPEN_DAYS_KEY); } catch { /* ignore */ }
        if (!dismissed) setOpenDaysModal(true); // eslint-disable-line react-hooks/set-state-in-effect
    }, []);

    const openDrawer = () => setDrawerOpen(true);
    const closeOpenDays = () => {
        setOpenDaysModal(false);
        try { sessionStorage.setItem(OPEN_DAYS_KEY, '1'); } catch { /* ignore */ }
    };
    const openPrograms = () => setOpenDaysModal(true);

    return (
        <div className="rrh min-h-screen flex flex-col selection:bg-rr-pink selection:text-white relative">
            <HomeHeader onRegister={openDrawer} />
            <WhatsOn onOpen={openPrograms} />
            <main className="flex-1 w-full overflow-hidden">
                <Banner onRegister={openDrawer} onPrograms={openPrograms} />
                <NewsStrip />
                {/* Fixtures (DRAFT, Andy 23 Nov 2026) */}
                <HomeFixtures />
                {/* Photos & videos: as on the live site */}
                <div id="video"><HomeVideo /></div>
                <div id="photos" className="scroll-mt-24"><HomeMedia /></div>
                <Leadership />
                <RoyalsWay />
                <Store />
                <Faq onRegister={openDrawer} />
                <Hire />
            </main>
            <PartnerStack theme="light" />
            <HomeFooter />
            <HomeStickyCTA onRegisterClick={openDrawer} />
            <RegisterDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <OpenDaysModal open={openDaysModal} onClose={closeOpenDays} />
        </div>
    );
};

export default HomePage;
