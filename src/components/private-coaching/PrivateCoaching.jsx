import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import PCHero from './PCHero';
import PCAlex from './PCAlex';
import PCHowItWorks from './PCHowItWorks';
import PCPricing from './PCPricing';
import PCForm from './PCForm';
import usePageAnalytics from '../../hooks/usePageAnalytics';

const SECTIONS = ['hero', 'meet', 'how-it-works', 'pricing', 'eoi-form'];

// Anchored sections sit under a fixed navbar — offset them so a jumped-to
// heading lands below the bar instead of behind it.
const ANCHOR = 'scroll-mt-28 md:scroll-mt-32';

const PrivateCoaching = () => {
    usePageAnalytics('/mickleham', { sections: SECTIONS });

    useEffect(() => {
        window.scrollTo(0, 0);
        // <title> managed centrally by <RouteSeo/> (src/seo/pageSeo.js)
    }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="private-coaching" />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero">
                    <PCHero />
                </div>
                <div id="meet" className={ANCHOR}>
                    <PCAlex />
                </div>
                <div id="how-it-works" className={ANCHOR}>
                    <PCHowItWorks />
                </div>
                <div id="pricing" className={ANCHOR}>
                    <PCPricing />
                </div>
                <div id="eoi-form" className={ANCHOR}>
                    <PCForm />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivateCoaching;
