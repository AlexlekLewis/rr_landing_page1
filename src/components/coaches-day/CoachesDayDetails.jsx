import React from 'react';
import { motion } from 'framer-motion';

const DETAILS = [
    { label: 'When', value: 'Sunday 26 July 2026', sub: '1:00pm to 4:00pm' },
    { label: 'Where', value: 'Mickleham Indoor Sports Centre', sub: '3 Eclipse Drive, Mickleham VIC 3064' },
    { label: 'Cost', value: 'Free to attend', sub: 'Our shout, start to finish' },
    { label: 'Who', value: 'Local cricket coaches', sub: 'Every level is welcome' },
];

const TAKEAWAYS = [
    'A proper look inside the Royals Way coaching methodology',
    'Practical drills and session ideas you can take straight to your own team',
    'Time on the tools alongside our coaching staff',
    'A room full of local coaches to share with and learn from',
];

const CoachesDayDetails = () => {
    return (
        <>
            {/* From the Head Coach */}
            <section id="from-the-coach" className="py-24 bg-slate-50">
                <div className="max-w-3xl mx-auto px-6">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-6 text-center"
                    >
                        A Note From The Head Coach
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6 text-rr-charcoal text-base md:text-lg font-medium leading-relaxed"
                    >
                        <p>
                            When I was coming through, the coaches who gave me their time changed everything for me. They were rarely paid much and rarely thanked, but they showed up because they loved the game and they wanted the next player to love it too.
                        </p>
                        <p>
                            I have carried that with me through every season I have coached since. And somewhere along the way I realised something. We ask so much of our coaches, yet we so rarely invest in them. We pour everything into the players and forget that the person running the session deserves to enjoy it just as much.
                        </p>
                        <p>
                            That is what this afternoon is about. It is my way of giving something back to the coaches in our community. Come and train alongside our staff, see how we bring the Royals Way to life, and share what works for you. You will leave with ideas you can use at your very next session, and a few new faces who care about the same things you do.
                        </p>
                        <p>
                            There is no sales pitch. Just an open door and a shared love of coaching. I really hope you can make it.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 pt-6 border-t border-slate-200"
                    >
                        <p className="text-rr-dark font-black uppercase tracking-wide">Alex Lewis</p>
                        <p className="text-rr-charcoal/70 text-sm font-semibold">Head Coach, Rajasthan Royals Academy Melbourne</p>
                    </motion.div>
                </div>
            </section>

            {/* Event details + takeaways */}
            <section id="details" className="py-24 bg-rr-dark relative overflow-hidden">
                <div className="absolute -top-32 -right-24 w-96 h-96 bg-rr-pink/8 rounded-full blur-[120px] pointer-events-none" />
                <div className="relative max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                        {DETAILS.map((d, i) => (
                            <motion.div
                                key={d.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.08 * i }}
                                className="bg-white/4 border border-white/10 rounded-2xl p-6"
                            >
                                <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.2em] mb-3">{d.label}</p>
                                <p className="text-white font-black leading-snug">{d.value}</p>
                                <p className="text-white/50 text-sm font-medium mt-1">{d.sub}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-4"
                        >
                            What You Will Take Away
                        </motion.h2>
                        <div className="w-12 h-px bg-gradient-to-r from-rr-pink to-rr-blue mx-auto" />
                    </div>

                    <ul className="max-w-2xl mx-auto divide-y divide-white/10">
                        {TAKEAWAYS.map((t, i) => (
                            <motion.li
                                key={t}
                                initial={{ opacity: 0, x: -12 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.06 * i }}
                                className="flex items-center gap-4 py-4"
                            >
                                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center shrink-0">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </span>
                                <span className="text-white font-medium">{t}</span>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </section>
        </>
    );
};

export default CoachesDayDetails;
