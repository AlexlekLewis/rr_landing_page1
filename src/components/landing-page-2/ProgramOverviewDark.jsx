import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AccordionSection = ({ title, items, color = "border-rr-pink", defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`bg-white rounded-2xl border-l-4 ${color} hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200 shadow-md`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 md:p-8 flex justify-between items-center text-left focus:outline-none group"
            >
                <h3 className="text-xl md:text-2xl font-black text-rr-dark group-hover:text-rr-pink transition-colors">{title}</h3>
                <span className="text-2xl font-light text-slate-400 flex-shrink-0 ml-4 group-hover:text-rr-pink transition-colors">
                    {isOpen ? '−' : '+'}
                </span>
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
                                    <h4 className="text-base font-bold text-rr-dark mb-1">{item.title}</h4>
                                    <p className="text-slate-600 leading-relaxed text-sm font-medium">{item.content}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ProgramOverviewDark = () => {
    const sections = [
        {
            title: "CRICKET COACHING & MENTORING",
            color: "border-rr-pink",
            defaultOpen: false,
            items: [
                { title: "2 on 1", content: "Players will receive 2 on 1 coaching during particular training sessions to provide for both expert coaching and peer to peer learning, critical for the development of talented players." },
                { title: "Squad Training", content: "Each player will be allocated to a squad that is at a similar age and similar ability based on the assessment of the Academy selection team, and this squad will train together on a regular basis." },
                { title: "Specialist (Masterclass)", content: "Coaches and mentors with elite level skills will conduct masterclass sessions. The coaching team will monitor the skill set of the group and determine the appropriate masterclass." },
                { title: "Performance Analysis", content: "Primarily the Rajasthan Royals Academy Management System and Full Track, as well as other tech programs, will form the basis of our monitoring tools." },
                { title: "Video Analysis", content: "Video analysis is a cornerstone of the Elite program, providing you with instant feedback on your development as a player." },
            ]
        },
        {
            title: "MATCH PLAY / SIMULATION",
            color: "border-rr-pink",
            defaultOpen: false,
            items: [
                { title: "Matches and Match Simulation", content: "Players from the Elite Program may be invited to outdoor internal matches and match simulations, staged from time to time through the 2nd half of 2026." },
                { title: "Scenario Simulation", content: "Indoor scenario sessions will be held at Cutting Edge Cricket Centre to provide for assisting players in recognizing and navigating their way through specific match situations." },
                { title: "Power Hitting Sessions", content: "The ability to switch into a power hitting mode is a huge part of the modern game and our expert coaches have built a program heavy on building this vital skillset." }
            ]
        },
        {
            title: "ADDITIONAL SERVICES",
            color: "border-rr-blue",
            defaultOpen: false,
            items: [
                { title: "Individual Development Plans (IDP)", content: "Each player receives a personalised development plan that addresses the whole person: skills, fitness, mindset, recovery, and life." },
                { title: "Career Mentorship", content: "Critical to your development, our expert team will work with you on mapping out cricket career and development opportunities based on your skills and performance." },
                { title: "360 Player Development", content: "Sessions in nutrition, sports & performance psychology, strength & conditioning development and body management." },
                { title: "Daily Player Essentials", content: "Building routine and professional behaviors through the 'daily vitamins' of the game. We respect that the smaller things and the one percenters matter most, and your attitude towards them can make or break you over the long term." }
            ]
        },
        {
            title: "APPAREL",
            color: "border-rr-blue",
            defaultOpen: false,
            items: [
                { title: "Playing Apparel", content: "Players will receive an apparel pack, consisting of a hat, a training shirt and training shorts." },
                { title: "Additional Apparel", content: "Additional apparel items can be purchased by Academy players, including jacket and training pants. Only those competing in matches are permitted to purchase playing apparel." }
            ]
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark mb-4 uppercase">
                        What's Included <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Overview</span>
                    </h2>
                    <p className="text-lg text-slate-600 font-medium">
                        Everything you need to elevate your game, mapped out in detail.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-4">
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

export default ProgramOverviewDark;
