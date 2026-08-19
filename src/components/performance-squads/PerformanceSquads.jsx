import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import HeroSection from './HeroSection';
import PathwaySection from './PathwaySection';
import TrialsSection from './TrialsSection';
import CoachesSection from './CoachesSection';
import PowerLeagueSection from './PowerLeagueSection';
import PricingSection from './PricingSection';
import RegistrationForm from './RegistrationForm';
import PaymentsSection from './PaymentsSection';
import FAQSection from './FAQSection';
import StickyCTA from './StickyCTA';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import { scrollTo } from './shared';

// ─────────────────────────────────────────────────────────────
// PERFORMANCE SQUADS — /performance-squads
// HIDDEN PAGE: not linked from nav/homepage/sitemap, noindex.
// Direct URL only until Andy approves go-live.
//
// Players either TRIAL or are INVITED into a squad. Each squad
// fields a First XI plus additional teams assembled for Power
// League rounds and matches against external opposition.
//
// Placeholders live in ./data.js (trial dates, prices, Stripe links).
// ─────────────────────────────────────────────────────────────

const SECTIONS = [
    'hero',
    'pathway',
    'trials',
    'coaches',
    'power-league',
    'pricing',
    'registration-form',
    'payments',
    'faq',
];

const PerformanceSquads = () => {
    usePageAnalytics('/performance-squads', { sections: SECTIONS });

    // Trial card → pre-selects that centre in the registration form.
    const [selectedCentre, setSelectedCentre] = useState('');

    // ── Hidden page: noindex + title ──
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Performance Squads | Rajasthan Royals Academy Melbourne';
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex,nofollow';
        document.head.appendChild(meta);
        return () => { document.head.removeChild(meta); };
    }, []);

    const handleChooseCentre = (slug) => {
        setSelectedCentre(slug);
        scrollTo('registration-form');
    };

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="performance-squads" />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero">
                    <HeroSection />
                </div>
                <div id="pathway" className="scroll-mt-28 lg:scroll-mt-32">
                    <PathwaySection />
                </div>
                <div id="trials" className="scroll-mt-28 lg:scroll-mt-32">
                    <TrialsSection onChooseCentre={handleChooseCentre} />
                </div>
                <div id="coaches" className="scroll-mt-28 lg:scroll-mt-32">
                    <CoachesSection />
                </div>
                <div id="power-league" className="scroll-mt-28 lg:scroll-mt-32">
                    <PowerLeagueSection />
                </div>
                <div id="pricing" className="scroll-mt-28 lg:scroll-mt-32">
                    <PricingSection />
                </div>
                <div id="registration-form" className="scroll-mt-28 lg:scroll-mt-32">
                    <RegistrationForm selectedCentre={selectedCentre} />
                </div>
                <div id="payments" className="scroll-mt-28 lg:scroll-mt-32">
                    <PaymentsSection />
                </div>
                <div id="faq" className="scroll-mt-28 lg:scroll-mt-32">
                    <FAQSection />
                </div>
            </main>
            <Footer />
            <StickyCTA />
        </div>
    );
};

export default PerformanceSquads;
