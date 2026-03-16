import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import MasterHero from './MasterHero';
import TrustBar from './TrustBar';

import ProgramJourney from './ProgramJourney';
import ValueStack from './ValueStack';
import MasterFAQ from './MasterFAQ';
import MasterCheckout from './MasterCheckout';
import StickyCTA from './StickyCTA';

import TheRoyalsWay from '../landing-page-2/TheRoyalsWay';
import ProgramAtAGlance from '../landing-page-2/ProgramAtAGlance';
import UncoveringTalent from './UncoveringTalent';
import SpecialistCoaching from '../landing-page-2/SpecialistCoaching';
import BeyondTwelveWeeks from '../landing-page-2/BeyondTwelveWeeks';
import RrampDnaProfile from '../landing-page-2/RrampDnaProfile';
import TheDreamAndPathway from './TheDreamAndPathway';
import SessionWalkthrough from './SessionWalkthrough';
import ScreeningCallCTA from './ScreeningCallCTA';

import usePageAnalytics from '../../hooks/usePageAnalytics';

const MASTER_SECTIONS = [
    'hero', 'trust-bar', 'dream-pathway', 'program-at-a-glance', 'program',
    'specialist-coaching', 'the-royals-way', 'session-walkthrough', 'technology',
    'coaches', 'facility', 'beyond-12-weeks', 'value-stack', 'faq', 'checkout'
];

const MasterLandingPage = () => {
    usePageAnalytics('/master-page', { sections: MASTER_SECTIONS });

    useEffect(() => {
        // Scroll to top on mount
        window.scrollTo(0, 0);
    }, []);

    // Meta Pixel
    useEffect(() => {
        if (window.fbq) return; // Already loaded

        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');

        window.fbq('init', '3125499870991789');
        window.fbq('track', 'PageView');

        // Add noscript fallback
        const noscriptImg = document.createElement('img');
        noscriptImg.height = 1;
        noscriptImg.width = 1;
        noscriptImg.style.display = 'none';
        noscriptImg.src = 'https://www.facebook.com/tr?id=3125499870991789&ev=PageView&noscript=1';
        document.body.appendChild(noscriptImg);

        return () => {
            if (noscriptImg.parentNode) noscriptImg.parentNode.removeChild(noscriptImg);
        };
    }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="lp2" />

            <main className="flex-1 w-full overflow-hidden">
                {/* 1. The Hero */}
                <div id="hero"><MasterHero /></div>

                {/* 2. Trust Bar */}
                <div id="trust-bar"><TrustBar /></div>

                {/* 3. The Dream & Pathway */}
                <div id="dream-pathway"><TheDreamAndPathway /></div>

                {/* 4. The Methodology (The Science & The Setup) */}
                <div id="program-at-a-glance"><ProgramAtAGlance /></div>
                <UncoveringTalent />

                {/* 5. 12-Week Program Journey */}
                <div id="program"><ProgramJourney /></div>

                <div id="specialist-coaching"><SpecialistCoaching /></div>
                <div id="session-walkthrough"><SessionWalkthrough /></div>

                {/* 6. Technology Edge (RRAM DNA PROFILE) */}
                <div id="technology"><RrampDnaProfile /></div>

                {/* 7. The Environment */}

                {/* 8. Beyond 12 Weeks + Royals Way + Investment */}
                <div id="beyond-12-weeks"><BeyondTwelveWeeks /></div>
                <div id="the-royals-way"><TheRoyalsWay /></div>
                <div id="value-stack"><ValueStack /></div>
                <ScreeningCallCTA />

                {/* 9. Checkout */}
                <div id="checkout"><MasterCheckout /></div>

                {/* 10. FAQ */}
                <div id="faq"><MasterFAQ /></div>
            </main>

            <Footer />

            {/* Sticky Mobile CTA */}
            <StickyCTA />
        </div>
    );
};

export default MasterLandingPage;
