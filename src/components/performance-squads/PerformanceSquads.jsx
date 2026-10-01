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
import { MIN_AGE, MAX_AGE } from './data';
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
// Still noindex, as it was while hidden. It is linked from the navbar now, so
// whether search engines should list it is Alex's call.
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

const PerformanceSquads = () => {
    usePageAnalytics('/performance-squads', { sections: SECTIONS });

    // Trial card → pre-selects that centre in the registration form.
    const [selectedCentre, setSelectedCentre] = useState('');
    // Carries the submitted registration into Payments so the trial quantity matches.
    const [payModal, setPayModal] = useState(null);

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
        scrollTo('register-pay');
    };

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="performance-squads" />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero">
                    <HeroSection
                        announcement={heroAnnouncement()}
                        body={`Our Performance Squads are the representative arm of the Rajasthan Royals Academy: squads of like-skilled players aged ${MIN_AGE} to ${MAX_AGE} who train together every week and play matches together from September to April. Every player earns their place at a trial.`}
                        primary={{ label: 'See Trial Dates', target: 'trials' }}
                        secondary={{ label: 'How Membership Works', target: 'pricing' }}
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
            <StickyCTA label="See Trial Dates" targetId="trials" />
            <PaymentModal open={!!payModal} registration={payModal} onClose={() => setPayModal(null)} />
        </div>
    );
};

export default PerformanceSquads;
