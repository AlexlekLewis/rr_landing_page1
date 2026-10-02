import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import SidJuniorsHero from './SidJuniorsHero';
import SidJuniorsSid from './SidJuniorsSid';
import SidJuniorsSession from './SidJuniorsSession';
import SidJuniorsForm from './SidJuniorsForm';
import FAQSection from '../performance-squads/FAQSection';
import StickyCTA from '../performance-squads/StickyCTA';
import PartnerStack from '../power-game/PartnerStack';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import { ROUTE, CTA, PAGE_STATE, FAQS, FAQ_HEADING } from './sidJuniorsData';

// ─────────────────────────────────────────────────────────────
// JUNIOR SESSIONS WITH SIDDHARTHA LAHIRI — /sid-juniors
//
// Two junior sessions, one at each centre: Cranbourne North on Sunday
// 4 October 2026 (1:00–2:30pm) and Mickleham on Monday 5 October 2026
// (4:30–5:30pm). Linked from the all-families email.
//
// Built to match /performance-squads-open-trial: the standard hero, the Sid
// card under it, the same FAQ component, and the performance-partners stack
// above the footer. Every fact, and every unconfirmed default, lives in
// ./sidJuniorsData.js.
//
// Each session opens and closes on its own switches in sidJuniorsData.js. A
// session that is not taking bookings is still shown, but cannot be chosen;
// with no session open, the page shows everything except the form.
// ─────────────────────────────────────────────────────────────

const SECTIONS = ['hero', 'sid', 'session', 'register-pay', 'faq', 'partners'];

const SidJuniors = () => {
    usePageAnalytics(ROUTE, { sections: SECTIONS });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            {/* Same chrome as the open age trial (no section links, the Programs
                menu, Home), with this page's own call to action. */}
            <Navbar
                variant="performance-squads"
                ctaLabelOverride={CTA.toUpperCase()}
                ctaTargetOverride="register-pay"
            />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero">
                    <SidJuniorsHero />
                </div>
                <div id="sid" className="scroll-mt-28 lg:scroll-mt-32">
                    <SidJuniorsSid />
                </div>
                <div id="session" className="scroll-mt-28 lg:scroll-mt-32">
                    <SidJuniorsSession />
                </div>
                <div id="register-pay" className="scroll-mt-28 lg:scroll-mt-32">
                    <SidJuniorsForm />
                </div>
                <div id="faq" className="scroll-mt-28 lg:scroll-mt-32">
                    <FAQSection items={FAQS} {...FAQ_HEADING} />
                </div>
                <div id="partners" className="scroll-mt-28 lg:scroll-mt-32">
                    <PartnerStack theme="dark" />
                </div>
            </main>
            <Footer />
            {/* Phones only, and only while there is a form to scroll to. */}
            {PAGE_STATE === 'open' && <StickyCTA label={CTA} />}
        </div>
    );
};

export default SidJuniors;
