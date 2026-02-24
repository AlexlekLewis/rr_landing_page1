import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, UserCheck } from 'lucide-react';

const AccordionSection = ({ title, items, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 md:p-8 flex justify-between items-center text-left focus:outline-none group"
            >
                <div className="flex items-center gap-4">
                    <UserCheck className="w-6 h-6 text-rr-blue group-hover:text-rr-pink transition-colors" />
                    <h3 className="text-xl md:text-2xl font-black text-rr-dark group-hover:text-rr-pink transition-colors">{title}</h3>
                </div>
                {isOpen
                    ? <Minus className="w-6 h-6 text-rr-pink flex-shrink-0" />
                    : <Plus className="w-6 h-6 text-slate-400 flex-shrink-0" />
                }
            </button>
            <AnimatePresence initial={defaultOpen}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-5 border-t border-slate-100 pt-5">
                            {items.map((item, index) => (
                                <div key={index}>
                                    <h4 className="text-xl font-bold text-rr-pink mb-2">{item.title}</h4>
                                    <p className="text-slate-600 leading-relaxed font-medium">{item.content}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const IndividualDevPlan = () => {
    const sections = [
        {
            title: "INDIVIDUAL DEVELOPMENT PLAN (IDP)",
            defaultOpen: true,
            items: [
                {
                    title: "The Blueprint",
                    content: "Your IDP is not a generic template. It is a strictly personalized roadmap built from your initial assessments, designed to target your specific growth areas and amplify your unique strengths."
                },
                {
                    title: "Collaborative Goal Setting",
                    content: "We sit down with you to establish clear, measurable, and achievable goals for the 12-week block. You own the journey; we provide the expert navigation."
                },
                {
                    title: "Continuous Feedback Loop",
                    content: "Your IDP is a living document. Through our Academy Management System, performance analytics, and regular coach check-ins, your plan adapts as you evolve."
                }
            ]
        }
    ];

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10 max-w-4xl">
                <div className="space-y-4">
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08, duration: 0.5 }}
                        >
                            <AccordionSection {...section} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default IndividualDevPlan;
