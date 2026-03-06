import React from 'react';
import { motion } from 'framer-motion';

const DEPOSIT_URL = 'https://buy.stripe.com/6oU3cvfY58Ox91q9rR9Zm05';
const FULL_URL    = 'https://buy.stripe.com/bJe14nbHP3ud91q8nN9Zm00';

const MasterCheckout = () => (
    <section className="py-24 bg-rr-dark relative overflow-hidden" id="checkout">

        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rr-pink/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rr-blue/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />

        <div className="max-w-4xl mx-auto px-6 relative z-10">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-14"
            >
                <img src="/assets/Crest.png" alt="Royal Crest" className="h-16 mx-auto mb-6 brightness-0 invert opacity-80" />
                <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Secure Your Place</p>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
                    Complete Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Application</span>
                </h2>
                <p className="text-white/50 font-medium max-w-xl mx-auto leading-relaxed">
                    Secure your spot in the Season 1 Elite intake. Select your preferred payment option below to proceed.
                </p>
                {/* Deadline banner */}
                <div className="inline-flex items-center gap-2 bg-rr-pink/15 border border-rr-pink/40 rounded-full px-4 py-2.5 mt-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
                    <span className="text-[10px] sm:text-xs font-bold text-rr-pink uppercase tracking-wide sm:tracking-widest">
                        Entry closes 5pm · March 20, 2026 — or when full
                    </span>
                </div>
            </motion.div>

            {/* Please Note box */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-rr-blue/10 border border-rr-blue/30 rounded-2xl p-6 mb-8"
            >
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-rr-blue shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wide mb-2">Please Note — Program Eligibility</h4>
                        <p className="text-sm text-white/60 leading-relaxed">
                            The Rajasthan Royals Academy Elite Program is designed for cricketers <span className="text-white font-bold">11 years of age or older</span> who possess a demonstrated skill set and competitive playing experience. This is a high-performance environment, not a learn-to-play program.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Player Details Form */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.12 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
            >
                <h4 className="text-sm font-black text-white uppercase tracking-wide mb-1">Player Details</h4>
                <p className="text-xs text-white/40 mb-6">Please complete before proceeding to payment.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Parent Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Parent / Guardian Full Name</label>
                        <input
                            type="text"
                            placeholder="Jane Doe"
                            className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-rr-pink/60 focus:bg-white/8 transition-colors"
                        />
                    </div>

                    {/* Contact Number */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Best Contact Number</label>
                        <input
                            type="tel"
                            placeholder="0400 000 000"
                            className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-rr-pink/60 focus:bg-white/8 transition-colors"
                        />
                    </div>

                    {/* Email — full width */}
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Email Address</label>
                        <input
                            type="email"
                            placeholder="jane@example.com"
                            className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-rr-pink/60 focus:bg-white/8 transition-colors"
                        />
                    </div>

                    {/* Divider */}
                    <div className="md:col-span-2 border-t border-white/10 my-1" />

                    {/* Player Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Player Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-rr-pink/60 focus:bg-white/8 transition-colors"
                        />
                    </div>

                    {/* Date of Birth */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Date of Birth</label>
                        <input
                            type="date"
                            className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white/70 focus:outline-none focus:border-rr-pink/60 focus:bg-white/8 transition-colors"
                        />
                    </div>

                    {/* Primary Role — full width */}
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Primary Playing Role</label>
                        <select className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white/70 focus:outline-none focus:border-rr-pink/60 transition-colors appearance-none">
                            <option value="" className="bg-rr-dark">Select Role…</option>
                            <option value="batter" className="bg-rr-dark">Batter</option>
                            <option value="pace-bowler" className="bg-rr-dark">Pace Bowler</option>
                            <option value="spin-bowler" className="bg-rr-dark">Spin Bowler</option>
                            <option value="all-rounder" className="bg-rr-dark">All-Rounder</option>
                            <option value="wicket-keeper" className="bg-rr-dark">Wicket-Keeper</option>
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Highest level played */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
            >
                <h4 className="text-sm font-black text-white uppercase tracking-wide mb-4">
                    Highest Level the Cricketer Has Played
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                        'School Cricket',
                        'Club — Junior',
                        'Club — Senior',
                        'District / Representative',
                        'State Age Group',
                        'State / National',
                    ].map((level) => (
                        <label key={level} className="flex items-center gap-2 cursor-pointer group">
                            <input type="radio" name="level" value={level}
                                className="w-4 h-4 accent-rr-pink shrink-0" />
                            <span className="text-xs font-medium text-white/60 group-hover:text-white/90 transition-colors leading-tight">{level}</span>
                        </label>
                    ))}
                </div>
            </motion.div>

            {/* Payment buttons */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
            >
                {/* Pay in Full */}
                <a
                    href={FULL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-rr-pink to-rr-blue p-px rounded-2xl overflow-hidden hover:shadow-[0_0_32px_rgba(229,6,149,0.4)] transition-shadow duration-300"
                >
                    <div className="w-full bg-rr-dark group-hover:bg-rr-dark/80 transition-colors rounded-2xl px-6 py-7 flex flex-col items-center gap-2 text-center">
                        <span className="text-[10px] font-bold text-rr-pink uppercase tracking-[0.25em]">Best Value</span>
                        <span className="text-2xl font-black text-white uppercase tracking-tight">Pay in Full</span>
                        <span className="text-white/50 text-sm font-medium">$2,995 — Includes free training kit</span>
                        <div className="mt-2 flex items-center gap-2 bg-rr-pink/20 px-4 py-2 rounded-full">
                            <svg className="w-4 h-4 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">Secure Now</span>
                        </div>
                    </div>
                </a>

                {/* Deposit+ */}
                <a
                    href={DEPOSIT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white/20 to-white/5 p-px rounded-2xl overflow-hidden hover:from-rr-blue hover:to-rr-pink hover:shadow-[0_0_32px_rgba(0,112,240,0.3)] transition-all duration-300"
                >
                    <div className="w-full bg-rr-dark group-hover:bg-rr-dark/80 transition-colors rounded-2xl px-6 py-7 flex flex-col items-center gap-2 text-center">
                        <span className="text-[10px] font-bold text-rr-blue uppercase tracking-[0.25em]">Flexible</span>
                        <span className="text-2xl font-black text-white uppercase tracking-tight">Deposit+</span>
                        <span className="text-white/50 text-sm font-medium">50% now · 50% before first session</span>
                        <div className="mt-2 flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                            <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Secure Now</span>
                        </div>
                    </div>
                </a>
            </motion.div>

            {/* Afterpay note */}
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="text-center text-white/40 text-xs font-medium mb-8"
            >
                Afterpay also available at checkout. Questions about payment?{' '}
                <a href="mailto:eliteprogram@rramelbourne.com" className="text-rr-blue hover:text-white transition-colors underline underline-offset-2">Contact us.</a>
            </motion.p>

            {/* Onboarding confirmation */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex items-start gap-4"
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wide mb-1">What Happens After Payment?</h4>
                    <p className="text-sm text-white/55 leading-relaxed">
                        Once payment has been made, you will be directed to our onboarding form to complete the onboarding process. This ensures we have everything we need to personalise your program from day one.
                    </p>
                </div>
            </motion.div>

            {/* FAQ link */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="text-center mb-10"
            >
                <p className="text-white/40 text-sm">
                    Have questions before you apply?{' '}
                    <a href="#faq" className="text-rr-pink font-bold hover:text-white transition-colors underline underline-offset-2">
                        View our Frequently Asked Questions ↓
                    </a>
                </p>
            </motion.div>

            {/* Disclaimer */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="border border-white/10 rounded-2xl p-6"
            >
                <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-3">Important Disclaimer</h4>
                <p className="text-xs text-white/35 leading-relaxed">
                    RRA Melbourne reserves the right to decline an application to the Elite Program if it is deemed that the applicant would not benefit from the program, or if there are safety concerns for the applicant or other participants. In such cases, the player or customer will receive a full refund of the amount paid, minus any third-party fees and charges applied at the time of transaction.
                </p>
            </motion.div>

        </div>
    </section>
);

export default MasterCheckout;
