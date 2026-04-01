import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        q: 'What age groups are the clinics for?',
        a: 'The clinics are open to players aged 7 to 14. Players are grouped by age to ensure appropriate coaching and competitive balance across sessions.',
    },
    {
        q: 'Are the clinics available for both boys and girls?',
        a: 'Yes. We will run separate male and female cricket sessions where possible during the 4-hour period. When you register, select your player\'s cricket type and our coaches will attempt to group participants accordingly.',
    },
    {
        q: 'What should my child bring to the clinic?',
        a: 'Please bring a water bottle, morning snack and appropriate cricket footwear. Cricket gear (bat, gloves, pads) is required — shared equipment is not available.',
    },
    {
        q: 'What\'s included in the $299 registration?',
        a: 'The $299 fee covers three full days of coaching (12 hours total) and an official Rajasthan Royals training shirt. There are no hidden costs.',
    },
    {
        q: 'What is the cancellation policy?',
        a: 'If you cancel more than 3 days before the clinic start date, you\'ll receive a full refund minus payment processing fees. Cancellations within 3 days of the clinic are eligible for a 50% refund only.',
    },
    {
        q: 'Who are the coaches?',
        a: 'All RRA clinics are run by certified coaches trained in the Royals Way methodology. Full coach profiles will be confirmed and communicated to registered families prior to each clinic.',
    },
    {
        q: 'Where exactly are the venues?',
        a: 'Cutting Edge Cricket is located in Bundoora, VIC (northern Melbourne). Cricket Connect is in Hallam, VIC (south-eastern Melbourne). Exact addresses and directions are included in the information above.',
    },
    {
        q: 'Is the clinic suitable for beginners?',
        a: 'Yes. The clinic caters to all skill levels from 7 to 14. Coaches adapt sessions to each player\'s development stage — whether they\'re picking up a bat for the first time or playing representative cricket.',
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
                    <a href="mailto:info@rramelbourne.com" className="text-rr-pink hover:underline font-bold">
                        info@rramelbourne.com
                    </a>
                </motion.p>
            </div>
        </section>
    );
};

export default FAQSection;
