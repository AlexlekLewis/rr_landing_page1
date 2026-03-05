import React from 'react';
import { motion } from 'framer-motion';

const ProblemAgitation = () => {
    // Animation variants
    const staggeredContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <section className="py-20 md:py-32 bg-white relative z-10">
            <div className="max-w-5xl mx-auto px-6">

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeUp}
                    className="text-center mb-16 md:mb-24"
                >
                    <h2 className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-wide leading-tight max-w-4xl mx-auto mb-6">
                        YOUR CHILD HAS THE TALENT.<br />
                        <span className="text-rr-pink">BUT TALENT ALONE ISN'T ENOUGH.</span>
                    </h2>
                    <p className="text-lg text-rr-charcoal font-medium max-w-2xl mx-auto">
                        The gap between a talented club player and a selected representative cricketer is wide. Here's why most traditional cricket coaching fails to bridge it.
                    </p>
                </motion.div>

                <motion.div
                    variants={staggeredContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
                >
                    {/* Problem 1 */}
                    <motion.div variants={fadeUp} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold text-rr-dark mb-4 pb-4 border-b border-slate-200">
                            The Plateau Problem
                        </h3>
                        <p className="text-rr-charcoal leading-relaxed">
                            Your child trains hard at club cricket every week. They're talented — you can see it, their coaches can see it. But the sessions repeat. The same drills, the same format. <strong className="text-rr-dark font-bold">Their development has levelled off</strong> and there's no structured plan to break through to the next level.
                        </p>
                    </motion.div>

                    {/* Problem 2 */}
                    <motion.div variants={fadeUp} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold text-rr-dark mb-4 pb-4 border-b border-slate-200">
                            The Pathway Confusion
                        </h3>
                        <p className="text-rr-charcoal leading-relaxed">
                            Representative trials come and go. State programs have waiting lists. You know your child needs more, but the pathway from 'promising club player' to <strong className="text-rr-dark font-bold">'genuine elite contender'</strong> is unclear — and no one seems to be mapping it out for them.
                        </p>
                    </motion.div>

                    {/* Problem 3 */}
                    <motion.div variants={fadeUp} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold text-rr-dark mb-4 pb-4 border-b border-slate-200">
                            The T20 Gap
                        </h3>
                        <p className="text-rr-charcoal leading-relaxed">
                            Modern cricket has changed. T20 demands a different skillset — explosive power, tactical awareness under pressure, adaptability. But <strong className="text-rr-dark font-bold">most junior coaching in Melbourne still teaches the same way it did 15 years ago.</strong> Your child is being prepared for a game that no longer exists at the elite level.
                        </p>
                    </motion.div>

                    {/* Problem 4 */}
                    <motion.div variants={fadeUp} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold text-rr-dark mb-4 pb-4 border-b border-slate-200">
                            The Data Deficit
                        </h3>
                        <p className="text-rr-charcoal leading-relaxed">
                            After every session, you ask "How did it go?" and get a vague answer. There's no measurement, no benchmarking, no individual development plan. You're investing time and money with <strong className="text-rr-dark font-bold">no visibility into whether they're actually improving</strong> — or just maintaining.
                        </p>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="mt-20 text-center"
                >
                    <h3 className="text-2xl font-bold text-rr-blue mb-8">
                        The Rajasthan Royals Academy was built to close every one of these gaps.
                    </h3>

                    <button
                        onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                        className="inline-block border-2 border-slate-300 text-rr-charcoal hover:border-rr-blue hover:text-rr-blue font-bold uppercase tracking-wide px-8 py-4 rounded-full transition-all duration-300"
                    >
                        Learn How We Fix This
                    </button>
                    <p className="mt-4 text-sm text-slate-400">Or book a 10-minute Call with our Director below.</p>
                </motion.div>

            </div>
        </section>
    );
};

export default ProblemAgitation;
