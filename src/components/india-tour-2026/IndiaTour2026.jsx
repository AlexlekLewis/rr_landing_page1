import React, { useEffect } from 'react';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import Navbar from '../Navbar';
import Footer from '../Footer';
import ITHero from './ITHero';
import ITAbout from './ITAbout';
import ITCoaching from './ITCoaching';
import ITAspiration from './ITAspiration';
import ITPricing from './ITPricing';
import ITForm from './ITForm';
import ITReadingToggle from './ITReadingToggle';
import { getCopy, useReadingMode } from './itCopy';

const META_DESCRIPTION =
    'High Performance Centre Camp — a Rajasthan Royals Academy Melbourne squad trains at the Royals ' +
    'High Performance Centre in Nagpur, 19–26 September 2026. Six full days of coaching. $2,100 for ' +
    'current academy players, $2,700 for players new to us, plus flights. Register your interest.';

// Any ?ref= code is still captured for attribution, but it no longer gates the
// page — this is a public program page now.
const getRefFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return (params.get('ref') || params.get('code') || '').trim();
};

const IndiaTour2026 = () => {
    usePageAnalytics('/india-tour-2026', {
        sections: ['hero', 'about', 'coaching', 'aspiration', 'pricing', 'register'],
    });

    const { simple, showToggle, setMode } = useReadingMode();
    const copy = getCopy(simple);
    const referralCode = getRefFromUrl();

    // Public and indexable. Sets the title + description; cleans up the
    // description on unmount so it does not leak onto the next route.
    useEffect(() => {
        document.title = 'High Performance Centre Camp, India 2026 | Rajasthan Royals Academy Melbourne';
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
                <div id="about"><ITAbout copy={copy} /></div>
                <div id="coaching"><ITCoaching /></div>
                <div id="aspiration"><ITAspiration /></div>
                <div id="pricing"><ITPricing copy={copy} /></div>
                <div id="register"><ITForm copy={copy} referralCode={referralCode} /></div>
            </main>
            <Footer />
            {showToggle && <ITReadingToggle simple={simple} onChange={setMode} />}
        </div>
    );
};

export default IndiaTour2026;
