import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import StickyCTA from '../performance-squads/StickyCTA';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import LPHero from './LPHero';
import { LPMorning, LPWhere, LPFaq } from './LPSections';
import LPForm from './LPForm';
import usePlaces from './usePlaces';
import { ROUTE, CTA, FORM_ANCHOR } from './lpJrDayData';

// ─────────────────────────────────────────────────────────────
// JUNIOR ROYALS CARNIVAL AT LOWER PLENTY — /lower-plenty-junior-royals-day
//
// A free morning for players aged 7 to 12: Sunday 25 October 2026,
// 9:00am – 11:00am, Lower Plenty Cricket Club (Lower Plenty Oval South,
// Montmorency Park, Montmorency). FREE EVENT, said big (Alex, 16 Oct 2026).
// 60 places; registrations close Friday 23 October, 9:00pm.
// PUBLIC: in the Programs menu, What's On, the home list and the register
// drawer (lpJrDayPromo.js). Every fact lives in lpJrDayData.js.
//
// Order: hero (what / when / where / who / cost / button) → the morning →
// where + who runs it → the form → FAQ. Light sections except the hero and
// the form (Alex, 12 Oct 2026).
//
// The form writes to lower_plenty_junior_royals_day_registrations. The
// database caps it at 60 and closes it at 9:00pm Friday; the page reads the
// live count from lower_plenty_jr_day_places().
//
// The form section's id is "register-pay" because the shared phone sticky bar
// (performance-squads/StickyCTA.jsx) hides itself once that element is passed.
// Nothing on this page takes payment.
// ─────────────────────────────────────────────────────────────

const SECTIONS = ['hero', 'morning', 'where', FORM_ANCHOR, 'faq'];
const ANCHOR = 'scroll-mt-24 sm:scroll-mt-32';

const LowerPlentyJrDay = () => {
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
            {open && <StickyCTA label={`${CTA} · Free`} targetId={FORM_ANCHOR} />}
        </div>
    );
};

export default LowerPlentyJrDay;
