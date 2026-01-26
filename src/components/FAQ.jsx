import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

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
                        <div className="pb-6 text-slate-600 leading-relaxed">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQ = () => {
    const aqs = [
        { q: "What age group is eligible?", a: "Male and female cricketers from age 10/11 through to senior cricketers in their 20’s and 30’s." },
        { q: "Where is the Academy based?", a: "Cutting Edge Indoor Cricket Centre in Bundoora, with other facilities used periodically." },
        { q: "Are trials with IPL franchises guaranteed?", a: "No. Trial opportunities are for players demonstrating exceptional skill. However, ALL members are tracked by Royals coaches." },
        { q: "Will I go to the High Performance Centre in Jaipur?", a: "Select players will be invited to attend camps at the High Performance facility in Jaipur, India." },
        { q: "Is entry guaranteed?", a: "No. Places are limited and based on merit, skills, and potential." },
        { q: "Is it only T20 cricket?", a: "70% T20 tailored, 30% traditional. The goal is to apply elite skills to all formats." },
        { q: "What if I am at the young end of the age groups?", a: "Younger players will be monitored as future talent. Trial opportunities are likely for older age groups, but younger players benefit from early exposure to Royals systems and data tracking." }
    ];

    return (
        <section className="py-24 bg-white" id="faq">
            <div className="container mx-auto px-6 max-w-4xl">
                <h2 className="text-4xl font-black text-center text-rr-dark mb-12">COMMON QUESTIONS</h2>
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 shadow-sm">
                    {aqs.map((item, i) => <FAQItem key={i} question={item.q} answer={item.a} />)}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
