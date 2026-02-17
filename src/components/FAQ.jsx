import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import Button from './Button';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-200 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex justify-between items-center text-left hover:text-rr-pink transition-colors focus:outline-none"
            >
                <span className="font-bold text-lg text-rr-dark pr-8">{question}</span>
                {isOpen ? <Minus className="w-5 h-5 text-rr-pink flex-shrink-0" /> : <Plus className="w-5 h-5 text-slate-400 flex-shrink-0" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6 text-slate-600 leading-relaxed font-medium">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQ = () => {
    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const programFaqs = [
        { q: "What age group is eligible?", a: "Male and female cricketers from age 10/11 through to senior cricketers in their 20's and 30's." },
        { q: "When does the program start and how long does it run?", a: "12 weeks starting early April 2026, with two sessions per week — one weeknight evening and one weekend session." },
        { q: "Where are sessions held?", a: "Primarily at Cutting Edge Cricket in Bundoora, Melbourne, with other facilities used periodically." },
        { q: "Is it available for female cricketers?", a: "Absolutely. Talent is talent — the Royals back emerging cricketers regardless of gender. There is a specific focus on preparing U15–U18 girls for WBBL, Women's IPL, state, and premier opportunities." },
        { q: "Is there a cost involved?", a: "Yes, there is an investment. The program is a premium, high-performance experience with access to elite coaching and resources. Specific costs will be provided upon successful application." },
        { q: "What's included in the program?", a: "Individual Development Plans, video analysis, sports psychology, nutrition, strength & conditioning coaching, official Royals apparel (hat, training shirt, shorts), and performance data reviewed by Royals Group coaches globally." },
        { q: "Is it T20 cricket?", a: "Approximately 70-80% T20 skill based, and 20-30% traditional skills. The goal is to ensure players can apply T20 skills to all formats of the game in relevant scenarios." },
    ];

    const selectionFaqs = [
        { q: "Is entry guaranteed?", a: "No. Places are limited and based on merit, skills, and potential." },
        { q: "What is the selection process?", a: "Invitation from a RR Academy Melbourne scout → Complete Application → Selection Team Reviews Applications → Possible Trial and Assessment Session → Possible Offer and Acceptance. Even if not selected in the first intake, your details stay on file — the Royals are building something long-term and the Melbourne team will begin touch regarding future programs." },
        { q: "What pathway opportunities exist?", a: "Performance-based opportunities include: potential match play against external opposition, invitation to the Royals High Performance Centre in Nagpur, trial opportunities with Rajasthan Royals (IPL), Paarl Royals (SA20), or Barbados Royals (CPL), and visits from franchise coaches and players." },
        { q: "Are trials with IPL franchises guaranteed?", a: "No. Trial opportunities are for players demonstrating exceptional skill. However, ALL members are tracked by Royals coaches." },
        { q: "Will I go to the High Performance Centre in Nagpur?", a: "Select players will be invited to attend camps at the High Performance facility in Nagpur, India." },
        { q: "What if I am at the young end of the age groups?", a: "Younger players will be monitored as future talent. Trial opportunities are likely for older age groups, but younger players benefit from early exposure to Royals systems and data tracking." },
        { q: "What happens if I'm not selected in the first intake?", a: "Your details stay on file. The Royals are building a long-term pathway in Melbourne — this is just the first intake." },
    ];

    return (
        <section className="py-24 bg-rr-dark relative" id="faq">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <h2 className="text-4xl font-black text-center text-white mb-4">COMMON QUESTIONS</h2>
                <p className="text-center text-slate-300 mb-12 font-light">Everything you need to know about the Elite Program</p>

                {/* Program Details */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-rr-pink mb-4 px-2">Program Details</h3>
                    <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
                        {programFaqs.map((item, i) => <FAQItem key={`p-${i}`} question={item.q} answer={item.a} />)}
                    </div>
                </div>

                {/* Selection & Pathways */}
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-rr-pink mb-4 px-2">Selection & Pathways</h3>
                    <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
                        {selectionFaqs.map((item, i) => <FAQItem key={`s-${i}`} question={item.q} answer={item.a} />)}
                    </div>
                </div>

                <div className="text-center mt-12">
                    <Button onClick={scrollToForm} variant="primary">
                        APPLY NOW
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
