import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

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
            <img
                src="/assets/rr-logo-pink.png"
                alt=""
                className="absolute -right-16 bottom-20 w-auto h-[50%] object-contain opacity-[0.03] pointer-events-none z-0"
                aria-hidden="true"
            />
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="max-w-7xl mx-auto"
            >
                {/* 1. Elite Environment (Facility) */}
                <div className="mb-24">
                    <div className="text-center mb-12 space-y-4">
                        <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight">
                            The Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Environment</span>
                        </motion.h2>
                        <motion.div variants={fadeIn} className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full mt-4" />
                        <motion.p variants={fadeIn} className="text-lg text-slate-600 max-w-2xl mx-auto font-medium mt-6">
                            Train at premium facilities designed to extract maximum performance, guided by coaching staff invested in your complete development.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div variants={fadeIn} className="relative aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-slate-200 group">
                            <img
                                src="/assets/lp2/boy-stance.png"
                                alt="High Performance Coaching"
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8">
                                <h3 className="text-white text-2xl font-bold uppercase mb-2">Elite Coaching Standard</h3>
                                <p className="text-slate-200 font-medium">Direct interaction with global heads of development.</p>
                            </div>
                        </motion.div>
                        <motion.div variants={fadeIn} className="relative aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-slate-200 group">
                            <img
                                src="/assets/lp2/sooryavanshi-century-walkoff.avif"
                                alt="Premium Facilities"
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8">
                                <h3 className="text-white text-2xl font-bold uppercase mb-2">Professional Outcomes</h3>
                                <p className="text-slate-200 font-medium">Training specifically built for the modern game.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* 2. Testimonials */}
                <div>
                    <div className="text-center mb-12 space-y-4">
                        <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-black text-rr-dark uppercase tracking-tight">
                            What the <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Standards</span> Bring
                        </motion.h2>
                        <motion.div variants={fadeIn} className="w-16 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full mt-4" />
                    </div>

                    <motion.div variants={fadeIn} className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-12 relative">
                        <Quote className="absolute top-8 left-8 w-12 h-12 text-rr-pink/20" />

                        <div className="relative z-10 pl-6 md:pl-12">
                            <p className="text-xl md:text-2xl text-slate-700 font-medium italic leading-relaxed mb-8">
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
            </motion.div>
        </section>
    );
};

export default FacilityAndTestimonials;
