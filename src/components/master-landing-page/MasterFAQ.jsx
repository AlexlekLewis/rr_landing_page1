import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "Is this program officially affiliated with the Rajasthan Royals?",
        answer: "Yes. The Rajasthan Royals Academy Australia is an official extension of the IPL franchise's global development network. The curriculum, methodology, and coaching standards are dictated directly by the Royals' Director of Cricket operations."
    },
    {
        question: "What age group is this program designed for?",
        answer: "The program is designed for youth players aged 12-17 who are currently playing club cricket and have aspirations for representative or premier squads. Training pods are grouped tightly by both age and physical maturity/skill level."
    },
    {
        question: "Does my child need to be at a certain skill level to participate?",
        answer: "We select on commitment, not just current talent. Provided your child has basic hard-ball cricket experience, we welcome players at all levels who are committed to development. The coaching adapts to individual skill levels through the DNA Profile and IDP."
    },
    {
        question: "What if my child misses a session?",
        answer: "While we strongly encourage 100% attendance to maximize the 12-week progression, we understand things come up. If a session is missed, coaches will provide the specific drills to work on independently to ensure they don't fall behind the timeline."
    },
    {
        question: "How does this fit with my child's existing club cricket?",
        answer: "This program is designed to complement, not replace, their club cricket. The T20-specific skills and individual biomechanical tweaks formulated during the week will directly enhance their weekend club performance."
    }
];

const MasterFAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-rr-dark uppercase tracking-wide mb-6">COMMON QUESTIONS</h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <button
                                className="w-full px-6 py-5 text-left flex justify-between items-center bg-white hover:bg-slate-50 transition-colors"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                aria-expanded={openIndex === index}
                            >
                                <span className="font-bold text-rr-dark md:text-lg pr-4">{faq.question}</span>
                                <span className={`shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                                    <svg className="w-5 h-5 text-rr-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </span>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-slate-100"
                                    >
                                        <div className="px-6 py-5 text-rr-charcoal leading-relaxed">{faq.answer}</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-rr-charcoal mb-4">Still have questions?</p>
                    <a
                        href="tel:0400000000" // Replace with actual number
                        className="inline-block bg-white text-rr-blue border-2 border-rr-blue hover:bg-rr-blue hover:text-white font-bold uppercase tracking-wide px-8 py-3 rounded-full transition-colors"
                    >
                        Book a 10-Minute Call
                    </a>
                </div>
            </div>
        </section>
    );
};

export default MasterFAQ;
