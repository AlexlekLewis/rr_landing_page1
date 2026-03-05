import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqCategories = [
    {
        category: "Program Details & Logistics",
        items: [
            {
                question: "What age group is eligible?",
                answer: "Male and female cricketers from age 10/11 through to senior cricketers in their 20's and 30's. Training squads are grouped tightly by age, physical maturity, and skill level."
            },
            {
                question: "Is it available for female cricketers?",
                answer: "Absolutely. Talent is talent — the Royals back emerging cricketers regardless of gender. There is a specific focus on preparing U15–U18 girls for WBBL, Women's IPL, state, and premier opportunities."
            },
            {
                question: "When does the program start and what are the dates?",
                answer: "Our Onboarding Week begins on Sunday April 13th, where players will receive their apparel pack and have individual Zoom meetings with their squad coaches. The first physical training session of the 12-week program starts the following week."
            },
            {
                question: "Where are sessions held?",
                answer: "Primarily at Cutting Edge Cricket in Bundoora, Melbourne, with other superior facilities used periodically."
            },
            {
                question: "What's included in the 12-week program?",
                answer: "48+ hours of elite contact time (two 2-hour sessions per week). You receive a Player DNA Profile, an Individual Development Plan (IDP), video analysis, squad training, mental performance coaching, and an official Royals apparel kit (hat, training shirt, shorts)."
            },
            {
                question: "Is it only T20 cricket?",
                answer: "The curriculum is approximately 70-80% T20 skill based, and 20-30% traditional foundational skills. The goal is to ensure players can apply aggressive T20 skills to all formats of the game."
            },
            {
                question: "Why are players organized into squads?",
                answer: "Each player belongs to a consistent group with their own squad coach — their go-to person for the entire 12 weeks. This creates genuine peer-to-peer learning and ensures the coach truly knows their game to track progress and adjust their IDP accurately."
            },
            {
                question: "I live a long way from Bundoora. Can we request preferred session times?",
                answer: "Yes — we understand that travelling to Bundoora is a commitment. Parents and players are welcome to nominate their preferred session times and travel time will be one of the primary considerations in scheduling."
            },
            {
                question: "What if we have holidays planned during the 12-week program?",
                answer: "We track any players with pre-booked travel commitments. Where a player is set to miss several sessions, we will work with families to arrange make-up sessions on a best-endeavours basis."
            },
            {
                question: "Will you open up more slots if the Academy fills?",
                answer: "We have a firm cap on the number of players to protect the quality of the experience and ensure every player receives genuine coaching attention. If the program fills, we encourage you to join the waitlist for future intakes."
            }
        ]
    },
    {
        category: "Pathways & Selection",
        items: [
            {
                question: "What is the selection process?",
                answer: "Register Your Interest → Get Assessed remotely or in-person by Royals Coaching Staff → Be Contacted with an Official Offer or next steps. Even if not selected in the first intake, your details stay on file."
            },
            {
                question: "Is entry guaranteed?",
                answer: "No. Places are strictly capped and selection is based entirely on merit, specific skills, and raw potential."
            },
            {
                question: "What pathway opportunities exist beyond 12 weeks?",
                answer: "Performance-based opportunities include match play against external opposition, potential invitations to the Royals High Performance Centre in Nagpur (India), and assessment opportunities with the wider Royals franchise network (Rajasthan, Paarl, Barbados)."
            },
            {
                question: "Are assessments with IPL franchises guaranteed?",
                answer: "No. Assessment opportunities are for players demonstrating exceptional skill. However, ALL program members have their data tracked and monitored by Royals coaches globally."
            },
            {
                question: "What if I am at the young end of the age groups?",
                answer: "Younger players will be monitored as future talent. While direct IPL assessment opportunities are naturally geared toward older age groups, younger players accelerate their growth massively from early exposure to professional systems and data tracking."
            }
        ]
    },
    {
        category: "Fees & Investment",
        items: [
            {
                question: "Is there a cost involved?",
                answer: "Yes, this is an elite investment. The program provides a premium performance experience with access to international coaching and extensive resources."
            },
            {
                question: "Are there payment options available?",
                answer: "Yes — we want to make the program accessible. We offer AfterPay as well as internal staged payment plan options to spread the cost. Families who choose to pay in full upfront receive an additional training shirt and pants at no extra charge."
            },
            {
                question: "Are there discounted rates or scholarships?",
                answer: "At this stage, there are no discounted rates available. The pricing reflects the quality and depth of what is included — dedicated squad coaching, IDPs, specialist masterclasses, and a genuine, tangible pathway into the Royals global network."
            }
        ]
    }
];

const MasterFAQ = () => {
    // Keep track of which item is open across all categories
    // Store as a string "catIndex-itemIndex"
    const [openId, setOpenId] = useState(null);

    const toggleFaq = (catIndex, itemIndex) => {
        const id = `${catIndex}-${itemIndex}`;
        setOpenId(openId === id ? null : id);
    };

    const scrollToForm = (e) => {
        e.preventDefault();
        document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Subtle Pink Logo Watermark */}
            <img
                src="/assets/rr-logo-pink.png"
                alt=""
                className="absolute -left-12 top-1/2 -translate-y-1/2 w-auto h-[60%] object-contain opacity-[0.03] pointer-events-none z-0"
                aria-hidden="true"
            />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-rr-dark uppercase tracking-wide mb-6">COMMON QUESTIONS</h2>
                    <p className="text-lg text-rr-charcoal font-medium max-w-2xl mx-auto">
                        Everything you need to know about navigating the Elite Program, the selection process, and your future pathway.
                    </p>
                </div>

                <div className="space-y-12">
                    {faqCategories.map((categoryGroup, catIndex) => (
                        <div key={catIndex}>
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-rr-pink mb-6 px-2">
                                {categoryGroup.category}
                            </h3>
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
                                {categoryGroup.items.map((faq, itemIndex) => {
                                    const id = `${catIndex}-${itemIndex}`;
                                    const isOpen = openId === id;

                                    return (
                                        <div key={itemIndex} className="bg-white transition-colors duration-200">
                                            <button
                                                className={`w-full px-6 py-6 text-left flex justify-between items-center bg-white hover:bg-slate-50 transition-colors ${isOpen ? 'bg-slate-50/50' : ''}`}
                                                onClick={() => toggleFaq(catIndex, itemIndex)}
                                                aria-expanded={isOpen}
                                            >
                                                <span className={`font-bold md:text-lg pr-8 transition-colors ${isOpen ? 'text-rr-pink' : 'text-rr-dark'}`}>
                                                    {faq.question}
                                                </span>
                                                <span className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                                    <svg className={`w-5 h-5 ${isOpen ? 'text-rr-pink' : 'text-rr-charcoal'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </span>
                                            </button>
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden bg-slate-50/30"
                                                    >
                                                        <div className="px-6 pb-6 pt-2 text-rr-charcoal leading-relaxed font-medium">
                                                            {faq.answer}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <p className="text-rr-charcoal mb-4 font-medium">Still have questions?</p>
                    <button
                        onClick={scrollToForm}
                        className="inline-block bg-white text-rr-blue border-2 border-rr-blue hover:bg-rr-blue hover:text-white font-bold uppercase tracking-wide px-10 py-4 rounded-full transition-colors shadow-sm"
                    >
                        SECURE YOUR SPOT
                    </button>
                </div>
            </div>
        </section>
    );
};

export default MasterFAQ;
