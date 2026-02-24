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
import KumarVideo from './KumarVideo';
import AcceptInvitationCTA from './AcceptInvitationCTA';
import PlayerImageStrip from './PlayerImageStrip';
import LogoDivider from './LogoDivider';

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
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white">
            <Navbar />

            <main className="flex-1 overflow-hidden relative">

                {/* --- HERO SECTION --- */}
                <section className="relative pt-32 pb-20 px-6 lg:px-8 min-h-[80vh] flex items-center justify-center z-10 bg-rr-dark text-white overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/assets/sooryavanchi-arms-raised.jpg"
                            alt="Vaibhav Sooryavanshi Celebrates Century"
                            className="w-full h-full object-cover object-[center_30%] opacity-20 mix-blend-luminosity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-rr-dark/80 via-rr-dark/90 to-rr-dark"></div>
                    </div>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="relative z-10 max-w-5xl mx-auto space-y-10"
                    >
                        <motion.h1
                            variants={fadeIn}
                            className="text-5xl md:text-8xl font-black tracking-wide leading-tight uppercase font-heading bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent text-center md:text-left drop-shadow-lg"
                        >
                            IT'S TIME TO SHINE
                        </motion.h1>

                        <motion.div variants={fadeIn} className="space-y-6 text-xl md:text-2xl text-slate-300 leading-relaxed font-light">
                            <p>
                                Thank you for taking the time to apply for a position in the <span className="text-white font-medium">Rajasthan Royals Elite Program</span>. We are pleased to provide an invitation to the next stage in the selection process.
                            </p>
                            <p className="text-lg md:text-xl">
                                As an identified player from within our scouting network, we are providing a first round invitation to attend the exclusive assessment session on the afternoon of <span className="text-white font-medium">Sunday March 1st</span> at <span className="text-white font-medium">Cutting Edge Cricket Centre</span> in Bundoora. Multiple sessions between 1.30pm and 4.30pm will be held, and should you accept the invitation to the assessment session, you will be assigned a session time which will be communicated by Friday February 27. We will also provide information on the format of the session.
                            </p>
                            <p className="text-lg md:text-xl">
                                This session will be led by <span className="text-white font-medium">Siddhartha Lahiri</span>, the Rajasthan Royals Head of International Talent Development, as well as Assistant and Performance Coach for Rajasthan, Paarl and Barbados Royals. Alongside Siddhartha, our Melbourne coaching and leadership team will also be present and working through the final selection.
                            </p>
                            <p className="text-lg md:text-xl">
                                Please now take the time to read through the information below, including the details of our world class T20 based Academy program, the times and dates that the program is scheduled to operated, the benefits of being a part of the initial intake of Melbourne’s Rajasthan Royals Academy Elite Program, as well as the pricing and payment options of this premium program.
                            </p>
                        </motion.div>

                        {/* RRA Melbourne Logo */}
                        <motion.div
                            variants={fadeIn}
                            className="flex justify-center md:justify-start pt-4"
                        >
                            <img
                                src="/assets/MELBOURNE.ai.png"
                                alt="Rajasthan Royals Academy Melbourne"
                                className="w-44 md:w-56 drop-shadow-2xl opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-500"
                            />
                        </motion.div>
                    </motion.div>
                </section>

                {/* --- NEXT STEPS SECTION --- */}
                <section className="py-24 px-6 lg:px-8 relative z-10 bg-slate-50 border-b border-slate-200">
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

                        <motion.div variants={fadeIn} className="bg-white rounded-2xl p-8 md:p-10 shadow-xl border border-slate-100 relative overflow-hidden">
                            <div className="relative z-10 space-y-6 text-lg text-slate-700 leading-relaxed font-medium text-center">
                                <p>
                                    As you have been invited to attend the assessment session, you are one step closer to the Elite Program. Melbourne’s Rajasthan Royals Academy team are considering you as a candidate with strong possibility of being offered a place.
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

                {/* Player Image Strip */}
                <PlayerImageStrip />

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

                {/* Cricket Leadership Team (Reused) */}
                <div className="bg-white py-12">
                    <Coaches />
                </div>

                {/* Beyond 12 Weeks */}
                <BeyondTwelveWeeks />

                {/* Kumar Sangakkara Video */}
                <KumarVideo />

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
