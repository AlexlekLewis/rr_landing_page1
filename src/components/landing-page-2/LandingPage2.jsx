import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../Footer';
import AssessmentRSVP from './AssessmentRSVP';
import ProgramAtAGlance from './ProgramAtAGlance';
import PhaseEffectiveness from './PhaseEffectiveness';
import ProgramOverviewDark from './ProgramOverviewDark';
import RrampDnaProfile from './RrampDnaProfile';
import IndividualDevPlan from './IndividualDevPlan';
import SpecialistCoaching from './SpecialistCoaching';
import TheRoyalsWay from './TheRoyalsWay';
import BeyondTwelveWeeks from './BeyondTwelveWeeks';
import YourInvestment from './YourInvestment';
import RoyalsGroupConnection from '../RoyalsGroupConnection';
import AcceptInvitationCTA from './AcceptInvitationCTA';
import LogoDivider from './LogoDivider';
import usePageAnalytics from '../../hooks/usePageAnalytics';

const LP2_SECTIONS = [
    'lp2-hero', 'lp2-next-steps', 'program-at-a-glance', 'the-royals-way',
    'phase-effectiveness', 'program-overview-dark', 'dna-profile',
    'specialist-coaching', 'individual-dev-plan', 'accept-invitation',
    'beyond-twelve-weeks', 'your-investment', 'rsvp',
];

const LandingPage2 = () => {
    usePageAnalytics('/offer/assessment', { sections: LP2_SECTIONS });

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white">
            <Navbar variant="lp2" />

            <main className="flex-1 overflow-hidden relative">

                {/* --- HERO SECTION --- */}
                <section id="lp2-hero" className="relative pt-32 pb-20 px-6 lg:px-8 min-h-[70vh] md:min-h-[85vh] flex items-center z-10 bg-rr-dark text-white overflow-hidden">
                    {/* Background Image — More Opaque */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/assets/sooryavanchi-arms-raised.jpg"
                            alt="Vaibhav Sooryavanshi Celebrates Century"
                            className="w-full h-full object-cover object-[center_30%] opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-rr-dark/90 via-rr-dark/70 to-rr-dark/40"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-rr-dark/50 via-transparent to-rr-dark/90"></div>
                    </div>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="relative z-10 max-w-6xl mx-auto w-full"
                    >
                        <div className="max-w-3xl space-y-8">
                            <motion.h1
                                variants={fadeIn}
                                className="text-4xl md:text-8xl font-black tracking-wide leading-[0.95] uppercase font-heading bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-lg"
                            >
                                IT'S TIME<br />TO SHINE
                            </motion.h1>

                            <motion.p variants={fadeIn} className="text-base md:text-xl text-slate-300 leading-relaxed font-light max-w-2xl">
                                Thank you for your interest and application. You have progressed to the next stage of the <span className="text-white font-medium">Rajasthan Royals Elite Program</span> selection process — an exclusive assessment session.
                            </motion.p>

                            {/* Key Info Highlights */}
                            <motion.div variants={fadeIn} className="flex flex-wrap gap-3">
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3">
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-0.5">When</p>
                                    <p className="text-white font-bold text-sm">Sunday March 1st • 1:30–4:30pm</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3">
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-0.5">Where</p>
                                    <p className="text-white font-bold text-sm">Cutting Edge Cricket Centre, Bundoora</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3">
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-0.5">Led By</p>
                                    <p className="text-white font-bold text-sm">Siddhartha Lahiri — Head of International Player Development</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* --- NEXT STEPS SECTION --- */}
                <section id="lp2-next-steps" className="py-24 px-6 lg:px-8 relative z-10 bg-slate-50 border-b border-slate-200">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-black text-rr-dark mb-8 text-center uppercase tracking-wide">
                            What happens <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">next?</span>
                        </motion.h2>

                        {/* Action Image — LP1 Style */}
                        <motion.div variants={fadeIn} className="relative w-full h-40 md:aspect-video md:h-auto rounded-2xl overflow-hidden mb-6 md:mb-8 shadow-xl border border-slate-200 group">
                            <img
                                src="/assets/lp2/jaiswal-celebrating-100.webp"
                                alt="Yashasvi Jaiswal — Century Celebration"
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        </motion.div>

                        <motion.div variants={fadeIn} className="bg-white rounded-2xl p-8 md:p-10 shadow-xl border border-slate-100 relative overflow-hidden">
                            <div className="relative z-10 space-y-6 text-lg text-slate-700 leading-relaxed font-medium text-center">
                                <p>
                                    As you have been invited to attend the assessment session, you are one step closer to the Elite Program. Melbourne's Rajasthan Royals Academy team are considering you as a candidate with strong possibility of being offered a place.
                                </p>
                                <p>
                                    So that you can begin to prepare for both the assessment session and the possibility of being offered a place, please find below details of the program including program content, program benefits, training days & times and the cost of this premium program.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Program At A Glance */}
                <ProgramAtAGlance />

                {/* The Royals Way Philosophy */}
                <TheRoyalsWay />

                {/* Phase Effectiveness */}
                <PhaseEffectiveness />



                {/* Program Overview */}
                <ProgramOverviewDark />

                {/* Player DNA Profile */}
                <RrampDnaProfile />

                {/* Specialist Coaching */}
                <SpecialistCoaching />

                {/* Individual Development Plan */}
                <IndividualDevPlan />

                {/* Accept Invitation CTA */}
                <AcceptInvitationCTA />

                {/* Royals Group Connection (Reused) */}
                <div className="bg-slate-50 py-12">
                    <RoyalsGroupConnection />
                </div>

                {/* Beyond 12 Weeks */}
                <BeyondTwelveWeeks />

                {/* Your Investment */}
                <YourInvestment />

                {/* Accept Invitation CTA */}
                <AcceptInvitationCTA />

                {/* RSVP Section */}
                <AssessmentRSVP />

            </main>
            <Footer />
        </div>
    );
};

export default LandingPage2;
