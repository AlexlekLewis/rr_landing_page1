import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import PLHero from './PLHero';
import PLWhatIs from './PLWhatIs';
import PLSquads from './PLSquads';
import PLForm from './PLForm';
import usePageAnalytics from '../../hooks/usePageAnalytics';

const SECTIONS = ['hero', 'what-is', 'squads', 'nominate'];
const ANCHOR = 'scroll-mt-28 md:scroll-mt-32';

const PowerLeague = () => {
    usePageAnalytics('/power-league', { sections: SECTIONS });
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero"><PLHero /></div>
                <div id="what-is" className={ANCHOR}><PLWhatIs /></div>
                <div id="squads" className={ANCHOR}><PLSquads /></div>
                <div id="nominate" className={ANCHOR}><PLForm /></div>
            </main>
            <Footer />
        </div>
    );
};

export default PowerLeague;
