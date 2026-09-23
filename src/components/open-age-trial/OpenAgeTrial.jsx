import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
// Alex's call: the standard Performance Squads hero, unchanged, with the
// Sid section carrying the story directly underneath it.
import HeroSection from '../performance-squads/HeroSection';
import SidSection from './SidSection';
import OpenAgePathway from './OpenAgePathway';
import OpenAgeTrialsSection from './OpenAgeTrialsSection';
import OpenAgeRegistrationForm from './OpenAgeRegistrationForm';
import AudienceSection from '../performance-squads/AudienceSection';
import OpportunitySection from '../performance-squads/OpportunitySection';
import CoachesSection from '../performance-squads/CoachesSection';
import PricingSection from '../performance-squads/PricingSection';
import FAQSection from '../performance-squads/FAQSection';
import StickyCTA from '../performance-squads/StickyCTA';
import PaymentModal from '../performance-squads/PaymentModal';
import PartnerStack from '../power-game/PartnerStack';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import {
    ROUTE, AUDIENCE, AUDIENCE_HEADING, TRIAL_COACHES, TRIAL_CENTRES,
    getCentre, SID, SID_CENTRE_SLUG,
    PRICING_HEADING, PRICING_FOOTNOTE, FAQS, FAQ_HEADING, DATES_CONFIRMED,
    OPPORTUNITY_LEAD, TRIAL_PRICE, MAX_TRIAL_SESSIONS, TRIAL_INCLUDES_OPEN_AGE,
} from './openAgeData';

// ─────────────────────────────────────────────────────────────
// OPEN AGE T20 TRIAL — /open-age-trial
//
// PUBLIC AND PROMOTED. Indexed, in the sitemap, in the Programs menu, with a
// real title, description and Open Graph tags from src/seo/pageSeo.js.
// There is deliberately NO noindex meta here — unlike /performance-squads,
// which hides itself. Do not copy that block in.
//
// Recruits an extra intake into the EXISTING Performance Squads: South-East
// Melbourne at Cranbourne North, and North Melbourne at Mickleham. A player
// books at ONE centre. Every new fact lives in ./openAgeData.js.
// Sections whose content is unchanged are the live Performance Squads
// components, given their content as props.
// ─────────────────────────────────────────────────────────────

// ORDER MATTERS. `pathway` runs BEFORE `opportunity` on purpose. The global
// opportunities are what a SQUAD PLACE opens up, and there are two competitive
// gates between paying a trial fee and reaching them. Putting the three steps
// first means the opportunity list reads as the destination, not the offer.
const SECTIONS = [
    'hero',
    'sid',
    'who-its-for',
    'pathway',
    'opportunity',
    'coaches',
    'trials',
    'pricing',
    'register-pay',
    'faq',
    'partners',
];

const OpenAgeTrial = () => {
    usePageAnalytics(ROUTE, { sections: SECTIONS });

    // Carries the submitted registration into the payment step so the trial
    // quantity charged matches what was booked.
    const [payModal, setPayModal] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            {/* Its own variant, not "performance-squads". That variant's CTA is
                REGISTER INTEREST pointed at #register-pay, which on this page is
                the booking panel — and while dates are pending that panel does not
                take a booking. This variant's CTA matches what the page can
                actually do today. */}
            <Navbar
                variant="open-age-trial"
                ctaLabelOverride={DATES_CONFIRMED ? 'BOOK YOUR TRIAL' : 'GET THE DATES'}
                ctaTargetOverride="register-pay"
            />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero">
                    <HeroSection />
                </div>
                <div id="sid" className="scroll-mt-28 lg:scroll-mt-32">
                    <SidSection />
                </div>
                <div id="who-its-for" className="scroll-mt-28 lg:scroll-mt-32">
                    <AudienceSection items={AUDIENCE} {...AUDIENCE_HEADING} />
                </div>
                <div id="pathway" className="scroll-mt-28 lg:scroll-mt-32">
                    <OpenAgePathway />
                </div>
                {/* Reused verbatim. The opportunity lines and the two proof cards
                    are the live, signed-off wording and are not re-edited here.
                    `lead` is the only addition, and it is this page's own sentence
                    saying these are squad opportunities, not trial outcomes. */}
                <div id="opportunity" className="scroll-mt-28 lg:scroll-mt-32">
                    <OpportunitySection lead={OPPORTUNITY_LEAD} />
                </div>
                <div id="coaches" className="scroll-mt-28 lg:scroll-mt-32">
                    <CoachesSection
                        coaches={TRIAL_COACHES}
                        eyebrow="Your Coach"
                        title="Your Squad Head Coaches"
                        // Names both, because a player trials into the squad at the
                        // centre they picked. Sid is named against HIS session only.
                        sub={`Selected players train under the head coach at the centre they trial at — ${TRIAL_CENTRES.map((c) => `${c.coach} at the ${c.venue} in ${c.suburb}`).join(', and ')}. ${SID.name} is scheduled to be at the ${getCentre(SID_CENTRE_SLUG).suburb} session.`}
                    />
                </div>
                <div id="trials" className="scroll-mt-28 lg:scroll-mt-32">
                    <OpenAgeTrialsSection />
                </div>
                {/* Stage one only. The Registration Fee for this intake has not
                    been set, so the card is hidden and the footnote says so
                    plainly rather than the page going quiet on it. */}
                <div id="pricing" className="scroll-mt-28 lg:scroll-mt-32">
                    <PricingSection
                        {...PRICING_HEADING}
                        showRegistrationStage={false}
                        trialPrice={TRIAL_PRICE}
                        maxTrialSessions={MAX_TRIAL_SESSIONS}
                        trialIncludes={TRIAL_INCLUDES_OPEN_AGE}
                        footnote={PRICING_FOOTNOTE}
                        ctaLabel={DATES_CONFIRMED ? 'Book Your Trial Place' : 'Tell Me When The Dates Land'}
                    />
                </div>
                <div id="register-pay" className="scroll-mt-28 lg:scroll-mt-32">
                    <OpenAgeRegistrationForm onRequestPayment={setPayModal} />
                </div>
                <div id="faq" className="scroll-mt-28 lg:scroll-mt-32">
                    <FAQSection items={FAQS} {...FAQ_HEADING} />
                </div>
                <div id="partners" className="scroll-mt-28 lg:scroll-mt-32">
                    <PartnerStack theme="dark" />
                </div>
            </main>
            <Footer />
            {/* Before the dates land the sticky bar still has somewhere useful to
                go: the "tell me when the dates are announced" panel. A page this
                is being promoted on cannot afford a scroll that captures nothing. */}
            <StickyCTA label={DATES_CONFIRMED ? 'Book Your Trial Place' : 'Get The Dates First'} />
            <PaymentModal open={!!payModal} registration={payModal} onClose={() => setPayModal(null)} />
        </div>
    );
};

export default OpenAgeTrial;
