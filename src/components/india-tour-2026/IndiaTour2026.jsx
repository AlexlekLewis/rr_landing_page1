import React, { useEffect } from 'react';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import Navbar from '../Navbar';
import Footer from '../Footer';
import PartnerStack from '../power-game/PartnerStack';
import ITHero from './ITHero';
import ITVideos from './ITVideos';
import ITBenefits from './ITBenefits';
import ITSeptember2026 from './ITSeptember2026';
import ITCoaching from './ITCoaching';
import ITAspiration from './ITAspiration';
import ITPricing from './ITPricing';
import ITForm from './ITForm';
import ITReadingToggle from './ITReadingToggle';
import { getCopy, useReadingMode } from './itCopy';

const META_DESCRIPTION =
    'Rajasthan Royals High Performance Centre Camp — coming soon. A Rajasthan Royals Academy ' +
    'Melbourne tour to the Rajasthan Royals High Performance Centre in Nagpur, India, in April 2027. ' +
    'About 10 days. Register now.';

// Any ?ref= code is still captured for attribution, but it no longer gates the
// page — this is a public program page now.
const getRefFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return (params.get('ref') || params.get('code') || '').trim();
};

const IndiaTour2026 = () => {
    usePageAnalytics('/tours', {
        sections: ['hero', 'september-2026', 'videos', 'benefits', 'coaching', 'aspiration', 'pricing', 'register'],
    });

    const { simple, showToggle, setMode } = useReadingMode();
    const copy = getCopy(simple);
    const referralCode = getRefFromUrl();

    // Public and indexable. Sets the title + description; cleans up the
    // description on unmount so it does not leak onto the next route.
    useEffect(() => {
        document.title = 'Rajasthan Royals High Performance Centre Camp, April 2027 | Rajasthan Royals Academy Melbourne';
        let meta = document.querySelector('meta[name="description"]');
        const created = !meta;
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'description';
            document.head.appendChild(meta);
        }
        const previous = meta.content;
        meta.content = META_DESCRIPTION;
        window.scrollTo(0, 0);
        return () => {
            if (created) document.head.removeChild(meta);
            else meta.content = previous;
        };
    }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="india-tour" />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero"><ITHero copy={copy} /></div>
                <div id="september-2026"><ITSeptember2026 copy={copy} /></div>
                <div id="videos"><ITVideos copy={copy} /></div>
                <div id="benefits"><ITBenefits copy={copy} /></div>
                <div id="coaching"><ITCoaching copy={copy} /></div>
                <div id="aspiration"><ITAspiration copy={copy} /></div>
                <div id="pricing"><ITPricing copy={copy} /></div>
                <div id="register"><ITForm copy={copy} referralCode={referralCode} /></div>
            </main>
            <PartnerStack />
            <Footer />
            {showToggle && <ITReadingToggle simple={simple} onChange={setMode} />}
        </div>
    );
};

export default IndiaTour2026;
