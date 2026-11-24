import React, { useState, useEffect } from 'react';
import HomeMedia from './HomeMedia';
import HomeStickyCTA from './HomeStickyCTA';
import RegisterDrawer from './RegisterDrawer';
import PartnerStack from '../power-game/PartnerStack';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import { HomeHeader, WhatsOn, Banner, NewsStrip, Leadership, RoyalsWay, Store, Faq, Hire, HomeFooter } from '../home-v2/HomeV2Parts';
import HomeIntro from '../home-v2/HomeIntro';
import Newsletter from '../home-v2/Newsletter';
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

const SECTIONS = ['hero', 'news', 'video', 'photos', 'coaches', 'about', 'store', 'faq', 'newsletter', 'careers-banner'];

const HomePage = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    usePageAnalytics('/', { sections: SECTIONS });

    // No pop-up on arrival (Andy, 23 Nov 2026: "I just want you to be able to go straight to the
    // website. Let's keep pop-ups for something a bit more special"). The What's On pop-up
    // (OpenDaysModal.jsx) stays in the repo for a special occasion. A link from another page to
    // a home-page section (/#coaches) lands on that section.
    useEffect(() => {
        const id = window.location.hash.slice(1);
        if (!id) { window.scrollTo(0, 0); return undefined; }
        const t = setTimeout(() => document.getElementById(id)?.scrollIntoView(), 300);
        return () => clearTimeout(t);
    }, []);

    const openDrawer = () => setDrawerOpen(true);

    return (
        <div className="rrh min-h-screen flex flex-col selection:bg-rr-pink selection:text-white relative">
            <HomeHeader onRegister={openDrawer} />
            <WhatsOn />
            <main className="flex-1 w-full overflow-hidden">
                <Banner onRegister={openDrawer} />
                <NewsStrip />
                {/* Introducing RRA Melbourne: Sid's video (Andy, 23 Nov 2026: Option B), then photos & videos */}
                <HomeIntro />
                <div id="photos" className="scroll-mt-24"><HomeMedia /></div>
                <Leadership />
                <RoyalsWay />
                <Store />
                <Faq onRegister={openDrawer} />
                {/* Register for more information: the newsletter (Andy, 24 Nov 2026) */}
                <Newsletter source="home" />
                <Hire />
            </main>
            <PartnerStack theme="light" />
            <HomeFooter />
            <HomeStickyCTA onRegisterClick={openDrawer} />
            <RegisterDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </div>
    );
};

export default HomePage;
