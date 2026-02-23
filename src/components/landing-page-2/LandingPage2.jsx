import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, User } from 'lucide-react';
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
import Coaches from '../Coaches';

const LandingPage2 = () => {
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
        <div className="min-h-screen bg-rr-dark text-white font-sans flex flex-col selection:bg-rr-pink selection:text-white">
            <Navbar />

            <main className="flex-1 overflow-hidden relative">
                {/* Background Ambient Glows */}
                <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-rr-pink/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-rr-blue/10 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4 pointer-events-none" />

                {/* --- HERO SECTION --- */}
                <section className="relative pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="max-w-4xl mx-auto space-y-8"
                    >
                        <motion.h1
                            variants={fadeIn}
                            className="text-5xl md:text-7xl font-black tracking-tight leading-tight uppercase font-heading bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent"
                        >
                            IT'S TIME TO SHINE
                        </motion.h1>

                        <motion.div variants={fadeIn} className="space-y-6 text-xl md:text-2xl text-slate-300 leading-relaxed font-light">
                            <p>
                                You are receiving this invitation because you were <span className="text-white font-medium">identified first</span> by our scouting and coaching network.
                            </p>
                            <p>
                                The Rajasthan Royals Academy Melbourne is building its foundation, and we are looking for players to form our exclusive <span className="text-rr-pink font-semibold">First Intake</span>.
                            </p>
                            <p className="text-lg md:text-xl">
                                We are delighted to now invite you to an exclusive assessment session on Sunday March 1st at <span className="text-white font-medium">Cutting Edge Cricket Centre</span> in Bundoora. Multiple sessions will be operated, and via email or text, by Friday February 27 we will confirm the time of the session that you have been assigned, as well as the format of the session.
                            </p>
                            <p className="text-lg md:text-xl">
                                The assessment session will form a key part of the final offers that will be made to successful applicants.
                            </p>
                            <p className="text-lg md:text-xl">
                                The session will be led by <span className="text-white font-medium">Siddhartha Lahiri</span>, the Rajasthan Royals Head of International Talent Development, as well as Assistant and Performance Coach for Rajasthan, Paarl and Barbados Royals. Alongside Siddhartha, our Melbourne coaching and leadership team will also be present and working through the final selection.
                            </p>
                        </motion.div>
                    </motion.div>
                </section>

                {/* --- NEXT STEPS SECTION --- */}
                <section className="py-20 px-6 lg:px-8 relative z-10 border-t border-white/5 bg-gradient-to-b from-transparent to-black/30">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-white mb-8">
                            What happens next?
                        </motion.h2>

                        <motion.div variants={fadeIn} className="bg-white/5 border border-rr-pink/20 rounded-2xl p-8 md:p-10 backdrop-blur-sm relative overflow-hidden group hover:border-rr-pink/40 transition-colors duration-500">
                            {/* Subtle internal glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-rr-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 space-y-6 text-lg text-slate-300 leading-relaxed">
                                <p>
                                    As you have been invited to attend the assessment session, you are one step closer to the Elite Program. Melbourne’s Rajasthan Royals Academy team are considering you as a candidate with strong possibility of being offered a place.
                                </p>
                                <p>
                                    So that you can begin to prepare for both the assessment session and the possibility of being offered a place, please find below details of the program including program content, training days & times and the cost of this premium program.
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

                {/* RRAMP DNA Profile */}
                <RrampDnaProfile />

                {/* Specialist Coaching */}
                <SpecialistCoaching />

                {/* Individual Development Plan */}
                <IndividualDevPlan />

                {/* Royals Group Connection (Reused) */}
                <div className="bg-zinc-950 py-12">
                    <RoyalsGroupConnection />
                </div>

                {/* Cricket Leadership Team (Reused) */}
                <div className="bg-black py-12">
                    <Coaches />
                </div>

                {/* Beyond 12 Weeks */}
                <BeyondTwelveWeeks />

                {/* Your Investment */}
                <YourInvestment />

                {/* RSVP Section */}
                <AssessmentRSVP />

            </main>
            <Footer />
        </div>
    );
};

export default LandingPage2;
