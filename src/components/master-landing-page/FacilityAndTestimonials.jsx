import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { BookCallButtonLight } from './BookCallButton';

const FacilityAndTestimonials = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <section className="py-24 px-6 lg:px-8 bg-slate-50 relative z-10 border-t border-slate-200 overflow-hidden" id="facility-testimonials">
            {/* Subtle Pink Logo Watermark */}

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="max-w-7xl mx-auto"
            >
                {/* Testimonials */}
                <div>
                    <div className="text-center mb-12 space-y-4">
                        <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-black text-rr-dark uppercase tracking-tight">
                            What the <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Standards</span> Bring
                        </motion.h2>
                        <motion.div variants={fadeIn} className="w-16 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full mt-4" />
                    </div>

                    <motion.div variants={fadeIn} className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-6 md:p-12 relative">
                        <Quote className="absolute top-6 left-6 w-8 h-8 md:w-12 md:h-12 text-rr-pink/20" />

                        <div className="relative z-10 pl-4 md:pl-12">
                            <p className="text-base md:text-2xl text-slate-700 font-medium italic leading-relaxed mb-6 md:mb-8">
                                "The professionalism and attention to detail in the Elite Program are unmatched. It isn't just a coaching clinic; it feels like a genuine high-performance setup where players are held to international standards from day one. The technical adjustments made in just a few weeks have entirely changed how my son approaches his game."
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-rr-blue to-rr-pink rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    MS
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-rr-dark">Mark S.</h4>
                                    <p className="text-sm text-rr-pink font-bold uppercase tracking-widest">Parent of Elite Pathway Player</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* CTA */}
                <div className="flex flex-col items-center gap-4 pt-14 border-t border-slate-200 mt-14">
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Nearly Full — Less than 5 places remain</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <a href="#checkout" className="group bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wide sm:tracking-widest px-5 sm:px-8 py-4 sm:py-5 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] text-xs sm:text-sm flex items-center gap-2 sm:gap-3 justify-center w-full sm:w-auto">
                            Secure Your Place Now
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </a>
                        <BookCallButtonLight />
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default FacilityAndTestimonials;
