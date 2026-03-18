import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        q: 'Who is this program designed for?',
        a: 'The Female Empowerment & Skill Development Program is designed for junior girls and women aged 12 and above who are already playing cricket — whether at a recreational, club, or representative level. This is not a beginner program; it\'s for players who are ready to elevate their game.',
    },
    {
        q: 'My daughter is a beginner — is this the right program?',
        a: 'This program is designed for players who are already active in cricket. If your daughter is new to the game, we recommend our Girls Kickstart Program as the ideal starting point, with a clear pathway into this program once the foundations are in place.',
    },
    {
        q: 'What does a typical session look like?',
        a: 'Sessions are structured around the six performance pillars — batting, bowling, fielding, mental strength, leadership, and game sense. Coaches adapt each session to the group, combining technical drills, scenario-based activities, and reflective discussion. The environment is high-energy, practical, and participant-driven.',
    },
    {
        q: 'Who are the coaches?',
        a: 'All sessions are delivered by highly skilled, adaptable coaches with strong technical cricket knowledge. Coaches are selected for their ability to multitask, engage participants, and encourage creativity and exploration — avoiding a rigid, one-size-fits-all approach.',
    },
    {
        q: 'What are the online seminars and how do they work?',
        a: 'Six exclusive online seminars run alongside the on-field program, covering leadership, cricket strategy, mental performance, fitness and nutrition (including insights from a dietitian), coachability, and a dedicated parent seminar. Details on timing and format will be provided to registered participants before the program begins.',
    },
    {
        q: 'What equipment do participants need to bring?',
        a: 'All coaching equipment — balls, hitting cones, wickets — is provided by the program. Participants should bring their own bat if they have one, wear comfortable cricket or sports attire, and use appropriate footwear. A full equipment list will be sent to registered families prior to the first session.',
    },
    {
        q: 'How many spots are available?',
        a: 'Session capacity is capped at 30 participants to ensure quality coaching ratios. Each cohort runs with a minimum of two coaches (up to four for larger groups). Spots are limited — register early to avoid missing out.',
    },
    {
        q: 'When does the program start and what are the session times?',
        a: 'Specific dates and session times are currently being finalised. Register now to secure your place — all confirmed schedule details will be sent directly to registered families as soon as they are available.',
    },
    {
        q: 'When is payment due?',
        a: 'Registering now holds your spot. Full payment of $599 will be confirmed and collected once the program schedule is finalised. You won\'t be charged until all details are locked in.',
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
