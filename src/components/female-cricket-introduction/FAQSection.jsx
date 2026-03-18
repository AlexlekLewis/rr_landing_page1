import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        q: 'Who is this program designed for?',
        a: 'Cricket Her Way is designed specifically for females aged 7 and above with little to no prior cricket experience. If your daughter has never held a bat before, this is the perfect starting point.',
    },
    {
        q: 'Does my daughter need any cricket equipment?',
        a: 'No — all equipment is provided. Bats, balls, hitting cones, and wickets are supplied by the program. We encourage participants to wear comfortable sports clothes and appropriate footwear.',
    },
    {
        q: 'Who are the coaches?',
        a: 'All sessions are delivered by a Royals accredited female coach. Coaches are trained in a learn-through-play approach and are focused on creating a positive, inclusive environment for every participant.',
    },
    {
        q: 'How many participants are in each session?',
        a: 'Sessions are structured in small groups to ensure every participant receives quality coaching and individual attention. Groups run from 10 to a maximum of 30 participants depending on location, with coach ratios adjusted accordingly.',
    },
    {
        q: 'Will parents receive updates on their child\'s progress?',
        a: 'Yes. At the conclusion of every session, coaches provide a brief update to participants and parents outlining the skills covered that week and recommended areas to practise at home.',
    },
    {
        q: 'What happens after the 8 weeks?',
        a: 'Participants completing the program will have a clear pathway into further development through the RRA Girls Kickstart pathway. Coaches will outline next steps at the conclusion of the 8 weeks.',
    },
    {
        q: 'When do sessions start?',
        a: 'Specific dates and times for both Bundoora and Hallam are currently being finalised. Register now to secure your place — you\'ll be contacted with all session details once confirmed.',
    },
    {
        q: 'Where exactly are the venues?',
        a: 'Bundoora Indoor Sports Centre is located in northern Melbourne. The Hallam venue is in south-eastern Melbourne. Full venue addresses and directions will be included in the pre-program information sent to registered families.',
    },
];

const FAQItem = ({ item, isOpen, onToggle }) => (
    <div className="border-b border-white/10 last:border-0">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between py-5 text-left gap-4 group"
        >
            <span className="text-white font-bold text-sm md:text-base group-hover:text-rr-pink transition-colors duration-200">{item.q}</span>
            <ChevronDown className={`w-5 h-5 text-rr-pink shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
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
                    <p className="text-white/70 font-medium text-sm leading-relaxed pb-5">{item.a}</p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section className="py-24 bg-rr-dark">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-6"
                    >
                        QUESTIONS <span className="text-rr-pink">ANSWERED</span>
                    </motion.h2>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/5 border border-white/10 rounded-2xl px-6 md:px-10"
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

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center text-white/50 text-sm font-medium mt-10"
                >
                    Still have questions?{' '}
                    <a href="mailto:andy.crook@rramelbourne.com" className="text-rr-pink hover:underline font-bold">
                        andy.crook@rramelbourne.com
                    </a>
                </motion.p>
            </div>
        </section>
    );
};

export default FAQSection;
