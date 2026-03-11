import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
    {
        q: 'Who are RRA Melbourne programs designed for?',
        a: 'Our programs are designed for cricketers of all ages and skill levels — from beginners picking up a bat for the first time to advanced players looking to break into elite competition. Each program specifies its target age groups and skill levels so you can find the right fit.',
    },
    {
        q: 'What makes RRA different from other cricket academies?',
        a: 'RRA Melbourne is the official cricket development arm of the Rajasthan Royals IPL franchise. That means our programs are built on the same methodology, technology, and performance philosophy used to develop world-class T20 cricketers — biomechanics analysis, data-driven coaching, and a modern game mindset.',
    },
    {
        q: 'How do I know which program is right for my child?',
        a: 'Use the program search tool above to filter by age group, skill level, and location. If you\'re still unsure, register your interest via "Register Now" and our team will reach out to help match your child to the right program.',
    },
    {
        q: 'Are there programs for girls and women\'s cricket?',
        a: 'Yes. RRA Melbourne is committed to developing both male and female cricketers. Use the gender filter on the programs section to find women\'s or mixed programs, and keep an eye out for new female-specific programs launching soon.',
    },
    {
        q: 'What happens after I register interest?',
        a: 'Our team will contact you within 48 hours to confirm program availability, answer any questions, and guide you through the next steps — whether that\'s securing your spot in a current program or being added to the waitlist for an upcoming one.',
    },
];

const FAQItem = ({ item, isOpen, onToggle }) => (
    <div className="border-b border-slate-100 last:border-0">
        <button
            onClick={onToggle}
            className="w-full flex justify-between items-center py-5 text-left gap-4 group"
        >
            <span className="font-bold text-rr-dark text-base group-hover:text-rr-pink transition-colors">{item.q}</span>
            <ChevronDown
                className={`w-5 h-5 text-rr-charcoal/50 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-rr-pink' : ''}`}
            />
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <p className="text-rr-charcoal/80 font-medium text-sm leading-relaxed pb-5">{item.a}</p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const HomeFAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section id="faq" className="py-24 bg-slate-50">
            <div className="max-w-3xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-4">
                        COMMON <span className="text-rr-pink">QUESTIONS</span>
                    </h2>
                    <p className="text-lg text-rr-charcoal font-medium">
                        Everything you need to know before you register.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8"
                >
                    {faqs.map((item, i) => (
                        <FAQItem
                            key={i}
                            item={item}
                            isOpen={openIndex === i}
                            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                        />
                    ))}
                </motion.div>

                <div className="text-center">
                    <Link
                        to="/faq"
                        className="inline-flex items-center gap-2 font-bold text-rr-pink hover:text-rr-light-pink uppercase tracking-widest text-sm transition-colors group"
                    >
                        View All FAQs
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HomeFAQ;
