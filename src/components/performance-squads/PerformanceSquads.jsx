import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import HeroSection from './HeroSection';
import OpportunitySection from './OpportunitySection';
import TrialsSection from './TrialsSection';
import ProgramSection from './ProgramSection';
import HighlightsSection from './HighlightsSection';
import MembershipSection from './MembershipSection';
import RegistrationForm from './RegistrationForm';
import FAQSection from './FAQSection';
import StickyCTA from './StickyCTA';
import PaymentModal from './PaymentModal';
import PartnerStack from '../power-game/PartnerStack';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import { scrollTo } from './shared';
import { MIN_AGE, MAX_AGE } from './data';
import { getUpcomingTrials, getBookableOpenAgeTrials, joinDays, dayOf } from './trialCalendar';

// ─────────────────────────────────────────────────────────────
// PERFORMANCE SQUADS — /performance-squads
//
// THE PERMANENT LANDING PAGE for the program (Alex, 2 October 2026). It says
// what the squads are now, lists the next trial dates (or "to be confirmed"),
// shows match-day highlights,
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
// Page order since 22 Nov 2026 (Andy: "reduce it in size"), 13 sections → 8:
// Hero → Trials & Centres → How It Works → Highlights → Royals Pathway →
// Membership → Register → FAQ. Who It's For, The Pathway, Coaches and the Power
// League were folded into How It Works and the FAQ.
const SECTIONS = [
    'hero',
    'trials',
    'program',
    'highlights',
    'opportunity',
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
    return { label: 'New', text: 'West Melbourne squad now open at M9 Sports Centre, Ravenhall. Trial dates to be confirmed.', target: 'trials' };
};

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
                        body={`The Rajasthan Royals Academy’s representative squads in Melbourne, for players aged ${MIN_AGE} to ${MAX_AGE}. Train every week, play T20 matches from September to April, and earn your place at a trial. Squads in North, South-East and West Melbourne.`}
                        primary={{ label: 'See Trial Dates', target: 'trials' }}
                        secondary={{ label: 'Watch Highlights', target: 'highlights' }}
                    />
                </div>
                <div id="trials" className="scroll-mt-28 lg:scroll-mt-32">
                    <TrialsSection onChooseCentre={handleChooseCentre} />
                </div>
                <div id="program" className="scroll-mt-28 lg:scroll-mt-32">
                    <ProgramSection />
                </div>
                <div id="highlights" className="scroll-mt-28 lg:scroll-mt-32">
                    <HighlightsSection />
                </div>
                <div id="opportunity" className="scroll-mt-28 lg:scroll-mt-32">
                    <OpportunitySection closing={false} />
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
            <StickyCTA label="Register Your Interest" targetId="register-pay" />
            <PaymentModal open={!!payModal} registration={payModal} onClose={() => setPayModal(null)} />
        </div>
    );
};

export default PerformanceSquads;
