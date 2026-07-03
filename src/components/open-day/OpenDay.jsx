import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import OpenDayHero from './OpenDayHero';
import OpenDayForm from './OpenDayForm';
import JuniorRegisterForm from './JuniorRegisterForm';
import AnnouncementBanner from './AnnouncementBanner';
import SessionsSplit from './SessionsSplit';

const SECTIONS = ['hero', 'sessions', 'register-junior', 'register'];

// Web replica of the official poster. Two crystal-clear audiences — BOTH now
// register (Junior Royals registration added "due to popular demand"):
//   JUNIOR ROYALS (blue) — come-and-try, all skill levels, register (Ages 5–15).
//   ELITE ROYALS  (pink) — trial for a scholarship, register (Ages 11–25).
const OpenDay = ({ config }) => {
    usePageAnalytics(config.route, { sections: SECTIONS });
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="mickleham" />
            {config.announcement && (
                <AnnouncementBanner text={config.announcement.text} cta={config.announcement.cta} ctaTarget={config.announcement.ctaTarget} />
            )}
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero"><OpenDayHero config={config} hasBanner={!!config.announcement} /></div>

                {/* ── WHICH ONE ARE YOU? — the two royals, side by side ── */}
                <SessionsSplit config={config} />

                {/* ── REGISTER — Junior Royals (blue) then Elite Royals (pink) ── */}
                <JuniorRegisterForm cfg={config.junior} />
                <OpenDayForm config={config} />
            </main>
            <Footer />
        </div>
    );
};

export default OpenDay;
