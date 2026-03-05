import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
    {
        quote: "We were sceptical about the cost initially, but after 3 weeks it became obvious why. The coaching depth is vastly superior to any holiday clinic he's ever done. He just made his representative squad based largely on the T20 tactics he learned here.",
        author: "Mark D.",
        subtext: "Parent, Hawthorn",
        badge: "Outcome: Rep Squad Selection"
    },
    {
        quote: "The environment is intense but incredibly supportive. My daughter's bat speed and confidence against fast bowling has skyrocketed. The DNA Profile reports were fantastic to show her club coach.",
        author: "Priya S.",
        subtext: "Parent, Dandenong",
        badge: "Outcome: Enhanced Batting Power"
    },
    {
        quote: "He had plateaued at club level and was losing interest. The structure of this 12-week block completely reignited his passion. The coaches treat them like young professionals.",
        author: "David L.",
        subtext: "Parent, Essendon",
        badge: "Outcome: Reignited Passion"
    }
];

const TransformationStories = () => {
    return (
        <section className="py-24 bg-rr-dark relative border-t border-white/10">
            {/* Subtle brand overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-rr-blue/10 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-6">
                        FROM SCEPTICS TO <span className="text-rr-pink">BELIEVERS</span>
                    </h2>
                    <p className="text-lg text-slate-300 font-medium">Don't take our word for it. Hear from the parents of Season 1.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors flex flex-col justify-between">
                            <div>
                                <span className="text-4xl text-rr-light-pink font-serif absolute -translate-x-4 -translate-y-2 opacity-50">"</span>
                                <p className="text-slate-200 leading-relaxed italic mb-8 relative z-10">{t.quote}</p>
                            </div>
                            <div>
                                <div className="inline-block px-3 py-1 bg-rr-blue/20 text-rr-blue rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-rr-blue/30">
                                    {t.badge}
                                </div>
                                <h4 className="text-white font-bold">{t.author}</h4>
                                <p className="text-slate-400 text-sm">{t.subtext}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-white/80 font-medium pb-2 border-b border-white/20 inline-block">
                        Join 35+ families already enrolled and claiming their spot.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default TransformationStories;
