import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const AccordionSection = ({ title, items, color = "border-rr-pink", defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`bg-white rounded-2xl shadow-lg border-l-4 ${color} hover:shadow-xl transition-shadow duration-300 overflow-hidden`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 md:p-8 flex justify-between items-center text-left focus:outline-none group"
            >
                <h3 className="text-xl md:text-2xl font-black text-rr-dark group-hover:text-rr-pink transition-colors">{title}</h3>
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
                                    <h4 className="text-base font-bold text-rr-dark mb-1">{item.title}</h4>
                                    <p className="text-slate-600 leading-relaxed text-sm">{item.content}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ProgramOverview = () => {
    const sections = [
        {
            title: "COACHING",
            color: "border-rr-pink",
            defaultOpen: true,
            items: [
                { title: "2 on 1", content: "Players will receive 2 on 1 coaching during particular training sessions to provide for both expert coaching and peer to peer learning, critical for the development of talented players." },
                { title: "Squad Training", content: "Each player will be allocated to a squad that is at a similar age and similar ability based on the assessment of the Academy selection team, and this squad will train together on a regular basis." },
                { title: "Specialist (Masterclass)", content: "Coaches and mentors with elite level skills will conduct masterclass sessions. The coaching team will monitor the skill set of the group and determine the appropriate masterclass." },
                { title: "Individual Development Plans", content: "Each player receives a personalised development plan that addresses the whole person: skills, fitness, mindset, recovery, and life." }
            ]
        },
        {
            title: "MATCH PLAY / SIMULATION",
            color: "border-rr-pink",
            defaultOpen: true,
            items: [
                { title: "Matches and Match Simulation", content: "Players from the Elite Program may be invited to outdoor internal matches and match simulations, staged from time to time through the 2nd half of 2026." },
                { title: "Scenario Simulation", content: "Indoor scenario sessions will be held at Cutting Edge Cricket Centre to provide for assisting players in recognising and navigating their way through specific match situations." },
                { title: "Power Hitting Sessions", content: "The ability to switch into a power hitting mode is a huge part of the modern game and our expert coaches have built a program heavy on building this vital skillset." }
            ]
        },
        {
            title: "ROYALS OPPORTUNITIES",
            color: "border-rr-blue",
            defaultOpen: true,
            items: [
                { title: "Rajasthan Royals High Performance Centre", content: "Each calendar year, talented cricketers from the Elite program may be invited to the Rajasthan Royals High Performance Centre in Jaipur, India." },
                { title: "Invitation to Trial with Royals Franchises", content: "Elite players who show exceptional development and growth may be offered opportunities to trial with Rajasthan Royals, Paarl Royals or Barbados Royals." },
                { title: "Visits by Royals Coaches and Scouts", content: "From time to time, Royals coaches, scouts and franchise players will visit the Elite program to facilitate opportunities for members." }
            ]
        },
        {
            title: "PROGRAM LENGTH",
            color: "border-rr-blue",
            defaultOpen: false,
            items: [
                { title: "Intensive Period", content: "The Elite program is built for a specific purpose and as such is staged in a block of approximately 12-weeks. This high intensity program is a perfect launching pad into the 2026/27 club pre-season and representative trial periods." },
                { title: "Beyond the Elite Program", content: "The performance of players in the Elite program will be continually monitored and assessed during and after their time in the program. Depending on a player's development level and trajectory, the Rajasthan Royals Academy may make further offers to additional future programs." }
            ]
        },
        {
            title: "ADDITIONAL SERVICES",
            color: "border-ra-blue",
            defaultOpen: false,
            items: [
                { title: "Performance Analysis", content: "Primarily the Rajasthan Royals Academy Management System and Full Track, as well as other tech programs, will form the basis of our monitoring tools." },
                { title: "Career Mentorship", content: "Critical to your development, our expert team will work with you on mapping out cricket career and development opportunities based on your skills and performance." },
                { title: "Video Analysis", content: "Video analysis is a cornerstone of the Elite program, providing you with instant feedback on your development as a player." },
                { title: "360 Player Development", content: "Sessions in nutrition, sports & performance psychology, strength & conditioning development and body management." }
            ]
        },
        {
            title: "APPAREL",
            color: "border-rr-blue",
            defaultOpen: false,
            items: [
                { title: "Playing Apparel", content: "Players will receive an apparel pack, consisting of a hat, a training shirt and training shorts." },
                { title: "Additional Apparel", content: "Additional apparel items can be purchased by Academy players, including jumper, track pants, jacket. Only those competing in matches are permitted to purchase playing apparel." }
            ]
        }
    ];

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden" id="program-overview">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-rr-pink rounded-full blur-3xl" />
                <div className="absolute top-1/2 right-0 w-64 h-64 bg-ra-blue rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark mb-4">
                        ELITE PROGRAM <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-ra-blue">OVERVIEW</span>
                    </h2>
                    <p className="text-lg text-slate-600">
                        A comprehensive, professional environment designed to take your game to the next level.
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

export default ProgramOverview;
