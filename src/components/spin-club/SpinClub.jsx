import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import SCHero from './SCHero';
import SCWhatItIs from './SCWhatItIs';
import SCClubs from './SCClubs';
import SCPricing from './SCPricing';
import SCForm from './SCForm';
import usePageAnalytics from '../../hooks/usePageAnalytics';

const SECTIONS = ['hero', 'what-it-is', 'clubs', 'pricing', 'apply'];

// Anchored sections sit under a fixed navbar — offset them so a jumped-to
// heading lands below the bar instead of behind it.
const ANCHOR = 'scroll-mt-28 md:scroll-mt-32';

const SpinClub = () => {
    usePageAnalytics('/spin-club', { sections: SECTIONS });

    useEffect(() => {
        window.scrollTo(0, 0);
        // <title> managed centrally by <RouteSeo/> (src/seo/pageSeo.js)
    }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero">
                    <SCHero />
                </div>
                <div id="what-it-is" className={ANCHOR}>
                    <SCWhatItIs />
                </div>
                <div id="clubs" className={ANCHOR}>
                    <SCClubs />
                </div>
                <div id="pricing" className={ANCHOR}>
                    <SCPricing />
                </div>
                <div id="apply" className={ANCHOR}>
                    <SCForm />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SpinClub;
