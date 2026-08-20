import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { fadeUp, SectionHeading } from './shared';
import { FAQS } from './data';

const FAQSection = () => {
    // Accordions closed by default.
    const [open, setOpen] = useState(null);

    return (
        <section className="py-20 px-5">
            <div className="max-w-3xl mx-auto">
                <SectionHeading
                    eyebrow="Questions"
                    title="Frequently Asked"
                    sub="Anything not covered here? Email info@rramelbourne.com and we'll come back to you."
                />
                <div className="space-y-3">
                    {FAQS.map((item, i) => {
                        const isOpen = open === i;
                        return (
                            <motion.div
                                key={item.q}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={Math.min(i, 4) * 0.05}
                                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpen(isOpen ? null : i)}
                                    aria-expanded={isOpen}
                                    className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 hover:bg-white/[0.03] transition-colors"
                                >
                                    <span className="text-[15px] sm:text-base font-black uppercase tracking-wide">
                                        {item.q}
                                    </span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-rr-pink shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {isOpen && (
                                    <div className="px-6 pb-6 -mt-1">
                                        <p className="text-white/65 text-sm font-medium leading-relaxed">
                                            {item.a}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
