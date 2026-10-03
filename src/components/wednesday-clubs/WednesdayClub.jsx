import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import WCHero from './WCHero';
import WCWhatItIs from './WCWhatItIs';
import WCCoaches from './WCCoaches';
import WCPricing from './WCPricing';
import WCForm from './WCForm';
import usePageAnalytics from '../../hooks/usePageAnalytics';

const SECTIONS = ['hero', 'what-it-is', 'coaches', 'pricing', 'apply'];

// Anchored sections sit under a fixed navbar — offset them so a jumped-to
// heading lands below the bar instead of behind it.
const ANCHOR = 'scroll-mt-28 md:scroll-mt-32';

// One page, two clubs. Batting Club and Keeping Club share Spin Club's layout and
// philosophy; everything that differs between them is in wcOptions.js.
const WednesdayClub = ({ club }) => {
    usePageAnalytics(club.route, { sections: SECTIONS });

    useEffect(() => {
        window.scrollTo(0, 0);
        // <title> managed centrally by <RouteSeo/> (src/seo/pageSeo.js)
    }, [club.route]);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero">
                    <WCHero club={club} />
                </div>
                <div id="what-it-is" className={ANCHOR}>
                    <WCWhatItIs club={club} />
                </div>
                <div id="coaches" className={ANCHOR}>
                    <WCCoaches club={club} />
                </div>
                <div id="pricing" className={ANCHOR}>
                    <WCPricing club={club} />
                </div>
                <div id="apply" className={ANCHOR}>
                    <WCForm club={club} />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default WednesdayClub;
