import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import SidJuniorsHero from './SidJuniorsHero';
import SidJuniorsSid from './SidJuniorsSid';
import SidJuniorsSession from './SidJuniorsSession';
import SidJuniorsSupervision from './SidJuniorsSupervision';
import SidJuniorsForm from './SidJuniorsForm';
import FAQSection from '../performance-squads/FAQSection';
import StickyCTA from '../performance-squads/StickyCTA';
import PartnerStack from '../power-game/PartnerStack';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import { ROUTE, CTA, BOOKING_STATE, FAQS, FAQ_HEADING } from './sidJuniorsData';

// ─────────────────────────────────────────────────────────────
// JUNIOR SESSION WITH SID LAHIRI — /sid-juniors
//
// One hour on the lanes at Mickleham, Monday 5 October 2026, 4:30–5:30pm.
// Linked from the all-families email of 27–28 September 2026.
//
// Built to match /performance-squads-open-trial: the standard hero, the Sid
// card under it, the same FAQ component, and the performance-partners stack
// above the footer. Every fact, and every unconfirmed default, lives in
// ./sidJuniorsData.js.
//
// SAFEGUARDING (review of 27 Sep 2026): bookings stay closed until two named
// Academy coaches with verified Working with Children Checks are rostered and
// the capacity fits them. Until then the page shows everything except the
// form. The gate lives in sidJuniorsData.js.
// ─────────────────────────────────────────────────────────────

const SECTIONS = ['hero', 'sid', 'session', 'supervision', 'register-pay', 'faq', 'partners'];

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
                <div id="supervision" className="scroll-mt-28 lg:scroll-mt-32">
                    <SidJuniorsSupervision />
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
            {BOOKING_STATE === 'open' && <StickyCTA label={CTA} />}
        </div>
    );
};

export default SidJuniors;
