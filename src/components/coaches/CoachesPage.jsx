import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import CoachesHero from './CoachesHero';
import CoachesLeadership from './CoachesLeadership';
import CoachesMission from './CoachesMission';
import CoachesBios from './CoachesBios';
import CoachesJoin from './CoachesJoin';
import usePageAnalytics from '../../hooks/usePageAnalytics';

const SECTIONS = ['hero', 'leadership', 'mission', 'bios', 'join'];

const CoachesPage = () => {
    usePageAnalytics('/coaches', { sections: SECTIONS });

    useEffect(() => {
        window.scrollTo(0, 0);
        // <title> managed centrally by <RouteSeo/> (src/seo/pageSeo.js)
    }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="coaches" />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero">
                    <CoachesHero />
                </div>
                <div id="leadership">
                    <CoachesLeadership />
                </div>
                <div id="mission">
                    <CoachesMission />
                </div>
                <div id="bios">
                    <CoachesBios />
                </div>
                <div id="join">
                    <CoachesJoin />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CoachesPage;
