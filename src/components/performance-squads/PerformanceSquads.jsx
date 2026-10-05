import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import HeroSection from './HeroSection';
import AudienceSection from './AudienceSection';
import OpportunitySection from './OpportunitySection';
import PathwaySection from './PathwaySection';
import TrialsSection from './TrialsSection';
import CoachesSection from './CoachesSection';
import PowerLeagueSection from './PowerLeagueSection';
import ProgramSection from './ProgramSection';
import MembershipSection from './MembershipSection';
import RegistrationForm from './RegistrationForm';
import FAQSection from './FAQSection';
import StickyCTA from './StickyCTA';
import PaymentModal from './PaymentModal';
import PartnerStack from '../power-game/PartnerStack';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import { scrollTo } from './shared';
import { MIN_AGE, MAX_AGE, TRIAL_PRICE, MEMBERSHIP, getCentre, money } from './data';
import { getUpcomingTrials, getBookableOpenAgeTrials, joinDays, dayOf } from './trialCalendar';

// ─────────────────────────────────────────────────────────────
// PERFORMANCE SQUADS — /performance-squads
//
// THE PERMANENT LANDING PAGE for the program (Alex, 2 October 2026). It says
// what the squads are now, lists the next trial dates (or "to be confirmed"),
// and explains the membership: a yearly fee paid weekly, cancel any time, and
// the joining fee is paid again to come back.
//
// To update it:
//   • trial dates  → ./trialCalendar.js explains where each kind of trial lives;
//   • fees         → MEMBERSHIP and TRIAL_PRICE in ./data.js;
//   • FAQ answers  → FAQS in ./data.js (they read the same fee constants).
//
// PUBLIC AND INDEXED since 2 October 2026 (Alex): in the sitemap, prerendered
// for social previews, and its search tags live in src/seo/pageSeo.js.
// ─────────────────────────────────────────────────────────────

// Section ids are kept from the old page ('trials' = Trial Dates, 'pricing' =
// Membership) so analytics and any shared #links keep working.
const SECTIONS = [
    'hero',
    'trials',
    'program',
    'who-its-for',
    'opportunity',
    'pathway',
    'coaches',
    'power-league',
    'pricing',
    'register-pay',
    'faq',
    'partners',
];

// The strip above the hero title. Always says where trials stand right now.
const heroAnnouncement = () => {
    const openAge = getBookableOpenAgeTrials();
    if (openAge.length) {
        return { label: 'Trials open now', text: `Open Age Trial, ages 16 to 25: ${joinDays(openAge)}`, target: 'trials' };
    }
    const next = getUpcomingTrials().find((t) => !t.full);
    if (next) {
        return { label: 'Next trial', text: dayOf(next.label), target: 'trials' };
    }
    return { label: 'Next trials', text: 'Dates to be confirmed. Register your interest to hear first.', target: 'register-pay' };
};

// Hero facts — every venue, age and price read from ./data.js (3 Oct 2026).
const NORTH = getCentre('north-melbourne');
const SOUTH_EAST = getCentre('south-east-melbourne');
const HERO_BODY = `Our representative squads for players aged ${MIN_AGE}–${MAX_AGE}, at ${NORTH.venue} (${NORTH.name}) and the ${SOUTH_EAST.venue}, ${SOUTH_EAST.suburb} (${SOUTH_EAST.name}). The two centres are about 70 km apart, so choose the one you can get to every week. The 2026/27 squads start training on Monday 5 October; dates for the next trial are not set yet.`;
const HERO_PRICE_LINE = `Trial ${money(TRIAL_PRICE)} incl. GST. If you're offered a place: ${money(MEMBERSHIP.joiningFee)} joining fee, then ${money(MEMBERSHIP.weeklyFee)} a week (all incl. GST).`;
const HERO_BUTTON_NOTE = "No payment now. No place held. We'll email you the next trial dates as soon as they're set.";
const PRIMARY_LABEL = 'Register Your Interest';

const PerformanceSquads = () => {
    usePageAnalytics('/performance-squads', { sections: SECTIONS });

    // Trial card → pre-selects that centre in the registration form.
    const [selectedCentre, setSelectedCentre] = useState('');
    // Carries the submitted registration into Payments so the trial quantity matches.
    const [payModal, setPayModal] = useState(null);

    // Search title, description and robots come from src/seo/pageSeo.js via
    // <RouteSeo/>, like every other public page. This page is indexed (Alex,
    // 2 October 2026: permanent and public).
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChooseCentre = (slug) => {
        setSelectedCentre(slug);
        scrollTo('register-pay');
    };

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="performance-squads" />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero">
                    <HeroSection
                        announcement={heroAnnouncement()}
                        eyebrow="Rajasthan Royals Academy · Melbourne"
                        body={HERO_BODY}
                        priceLine={HERO_PRICE_LINE}
                        buttonNote={HERO_BUTTON_NOTE}
                        primary={{ label: PRIMARY_LABEL, target: 'register-pay' }}
                        secondary={{ label: 'How it works', target: 'pathway' }}
                    />
                </div>
                <div id="trials" className="scroll-mt-28 lg:scroll-mt-32">
                    <TrialsSection onChooseCentre={handleChooseCentre} />
                </div>
                <div id="program" className="scroll-mt-28 lg:scroll-mt-32">
                    <ProgramSection />
                </div>
                <div id="who-its-for" className="scroll-mt-28 lg:scroll-mt-32">
                    <AudienceSection />
                </div>
                <div id="opportunity" className="scroll-mt-28 lg:scroll-mt-32">
                    <OpportunitySection />
                </div>
                <div id="pathway" className="scroll-mt-28 lg:scroll-mt-32">
                    <PathwaySection />
                </div>
                <div id="coaches" className="scroll-mt-28 lg:scroll-mt-32">
                    <CoachesSection />
                </div>
                <div id="power-league" className="scroll-mt-28 lg:scroll-mt-32">
                    <PowerLeagueSection />
                </div>
                <div id="pricing" className="scroll-mt-28 lg:scroll-mt-32">
                    <MembershipSection />
                </div>
                <div id="register-pay" className="scroll-mt-28 lg:scroll-mt-32">
                    <RegistrationForm
                        selectedCentre={selectedCentre}
                        onRequestPayment={setPayModal}
                    />
                </div>
                <div id="faq" className="scroll-mt-28 lg:scroll-mt-32">
                    <FAQSection />
                </div>
                {/* Shared tiered partner stack (same source of truth as /elite-royals) */}
                <div id="partners" className="scroll-mt-28 lg:scroll-mt-32">
                    <PartnerStack theme="dark" />
                </div>
            </main>
            <Footer />
            <StickyCTA label={PRIMARY_LABEL} targetId="register-pay" />
            <PaymentModal open={!!payModal} registration={payModal} onClose={() => setPayModal(null)} />
        </div>
    );
};

export default PerformanceSquads;
