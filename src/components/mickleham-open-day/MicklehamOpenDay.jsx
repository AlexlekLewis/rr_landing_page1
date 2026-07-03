import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import OpenDayHero from '../open-day/OpenDayHero';
import SessionsSplit from '../open-day/SessionsSplit';
import JuniorRegisterForm from '../open-day/JuniorRegisterForm';
import AnnouncementBanner from '../open-day/AnnouncementBanner';
import { MICKLEHAM_JUNIOR } from '../open-day/configs';
import MicklehamForm from './MicklehamForm';

const SECTIONS = ['hero', 'sessions', 'register-junior', 'register'];

// Mickleham now uses the SAME poster-replica template as Williamstown/Hallam
// (OpenDayHero + SessionsSplit) so all three centres look identical. The only
// differences: this is our new NORTHERN home (region NORTH, Sun 5 Jul, 12+), and
// Junior Royals registration here is FLEXIBLE ("register now, or on the day")
// since it's already been promoted as turn-up-and-play. The Elite side keeps its
// own dedicated MicklehamForm (own table, success route, welcome emails).
const MICKLEHAM = {
    route: '/PGP2026/mickleham',
    dateHeadline: 'Sunday, July 5',
    venueHeadline: 'Mickleham Indoor Sports Centre',
    address: '3 Eclipse Drive, Mickleham VIC 3064',
    region: 'NORTH',
    juniorTime: '9:00 – 10:30am',
    eliteTime: '10:30am – 12:00pm',
    juniorHint: 'Register now or on the day · ages 5–15',
    eliteHint: 'Registration required · ages 11+',
    announcement: {
        text: 'Junior Royals — due to high interest, we ask that you register now, but you can still register on the day.',
        cta: 'Register',
        ctaTarget: 'register-junior',
    },
    junior: MICKLEHAM_JUNIOR,
};

const MicklehamOpenDay = () => {
    usePageAnalytics(MICKLEHAM.route, { sections: SECTIONS });
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="mickleham" />
            <AnnouncementBanner
                text={MICKLEHAM.announcement.text}
                cta={MICKLEHAM.announcement.cta}
                ctaTarget={MICKLEHAM.announcement.ctaTarget}
            />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero"><OpenDayHero config={MICKLEHAM} hasBanner /></div>

                {/* ── WHICH ONE ARE YOU? — the two royals, side by side ── */}
                <SessionsSplit config={MICKLEHAM} eliteAges="Ages 11+" />

                {/* ── REGISTER — Junior Royals (flexible) then Elite Trial ── */}
                <JuniorRegisterForm cfg={MICKLEHAM.junior} />
                <MicklehamForm />
            </main>
            <Footer />
        </div>
    );
};

export default MicklehamOpenDay;
