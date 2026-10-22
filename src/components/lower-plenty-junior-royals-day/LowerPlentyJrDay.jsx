import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import StickyCTA from '../performance-squads/StickyCTA';
import FinishedEventPage from '../FinishedEventPage';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import LPHero from './LPHero';
import { LPMorning, LPWhere, LPFaq } from './LPSections';
import LPForm from './LPForm';
import usePlaces from './usePlaces';
import {
    ROUTE, CTA, CTA_WITH_PRICE, FORM_ANCHOR, CONTACT_EMAIL, CANCELLED, CANCELLED_COPY, CANCELLED_SESSIONS,
} from './lpJrDayData';

// ─────────────────────────────────────────────────────────────
// JUNIOR ROYALS ARE COMING TO LOWER PLENTY — /lower-plenty-junior-royals-day
//
// CANCELLED 23 Oct 2026 (Alex): heavy rain is forecast, so the morning is
// called off. While CANCELLED is true (lpJrDayData.js) the address shows the
// shared FinishedEventPage with the cancellation notice: no form, no payment,
// noindex. The live page below is kept intact, so nothing is lost.
//
// A morning for players aged 7 to 12: Sunday 25 October 2026,
// 9:00am – 11:00am, Lower Plenty Cricket Club (Lower Plenty Oval South,
// Montmorency Park, Montmorency). $10 per player incl. GST via a Stripe
// Payment Link (Alex, 16 Oct 2026). 60 places; registrations were due to close
// Friday 23 October, 9:00pm.
// PUBLIC: in the Programs menu, What's On, the home list and the register
// drawer (lpJrDayPromo.js). Every fact lives in lpJrDayData.js.
//
// Order: hero (what / when / where / who / cost / button) → the morning →
// where + who runs it → the form → FAQ. Light sections except the hero and
// the form (Alex, 12 Oct 2026).
//
// The form writes to lower_plenty_junior_royals_day_registrations. The
// database caps it at 60 and closes it at the time in lower_plenty_jr_day_limits();
// the page reads the live count from lower_plenty_jr_day_places().
//
// The form section's id is "register-pay" because the shared phone sticky bar
// (performance-squads/StickyCTA.jsx) hides itself once that element is passed.
// ─────────────────────────────────────────────────────────────

const SECTIONS = ['hero', 'morning', 'where', FORM_ANCHOR, 'faq'];
const ANCHOR = 'scroll-mt-24 sm:scroll-mt-32';

const LowerPlentyJrDayLive = () => {
    usePageAnalytics(ROUTE, { sections: SECTIONS });
    const places = usePlaces();
    const open = places.state === 'open';

    useEffect(() => {
        // "Register another player" on the success page links to #register-pay.
        if (window.location.hash === `#${FORM_ANCHOR}`) {
            setTimeout(() => document.getElementById(FORM_ANCHOR)?.scrollIntoView({ behavior: 'smooth' }), 300);
        } else {
            window.scrollTo(0, 0);
        }
    }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar
                variant="open-age-trial"
                ctaLabelOverride={open ? CTA.toUpperCase() : 'SEE THE DETAILS'}
                ctaTargetOverride={open ? FORM_ANCHOR : 'morning'}
            />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero"><LPHero places={places} /></div>
                <div id="morning" className={ANCHOR}><LPMorning /></div>
                <div id="where" className={ANCHOR}><LPWhere /></div>
                <div id={FORM_ANCHOR} className={ANCHOR}><LPForm places={places} /></div>
                <div id="faq" className={ANCHOR}><LPFaq /></div>
            </main>
            <Footer />
            {open && <StickyCTA label={CTA_WITH_PRICE} targetId={FORM_ANCHOR} />}
        </div>
    );
};

// What the address shows while the morning is cancelled: it says so plainly,
// takes no registration and no payment, and says what to do now.
const LowerPlentyJrDayCancelled = () => (
    <FinishedEventPage
        route={ROUTE}
        navVariant="open-age-trial"
        copy={CANCELLED_COPY}
        email={CONTACT_EMAIL}
        sessions={CANCELLED_SESSIONS}
    />
);

const LowerPlentyJrDay = () => (CANCELLED ? <LowerPlentyJrDayCancelled /> : <LowerPlentyJrDayLive />);

export default LowerPlentyJrDay;
