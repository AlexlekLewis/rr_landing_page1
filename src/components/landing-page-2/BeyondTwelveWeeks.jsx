import React from 'react';
import { motion } from 'framer-motion';

const BeyondTwelveWeeks = () => {
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
        <section className="py-24 px-6 lg:px-8 relative z-10 bg-slate-50 overflow-hidden">

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="max-w-6xl mx-auto"
            >
                {/* Action Image — Approved Media/LP2 */}
                <motion.div variants={fadeIn} className="relative w-full h-40 md:aspect-video md:h-auto rounded-2xl overflow-hidden mb-8 md:mb-16 shadow-xl border border-slate-200 group">
                    <img
                        src="/assets/lp2/on-pace-off-pace.avif"
                        alt="Rajasthan Royals — Elite Performance"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </motion.div>

                <div className="text-center mb-16 space-y-4">
                    <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight">
                        Beyond <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">12 Weeks</span>
                    </motion.h2>
                    <motion.div variants={fadeIn} className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full mt-4" />
                    <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mt-6 leading-relaxed font-medium">
                        Finishing the 12-week program is just the start. You stay connected to the Rajasthan Royals eco-system and global Academy network through matches, masterclasses, additional programs, travel opportunities - and more.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Original Card 1 */}
                    <motion.div variants={fadeIn} className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 relative overflow-hidden group hover:border-rr-blue/30 transition-colors duration-500 flex flex-col items-center text-center">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rr-blue to-rr-pink rounded-t-3xl" />
                        <h3 className="text-xl font-bold text-rr-dark mb-3">Year-Round Academy Placement</h3>
                        <p className="text-slate-600 leading-relaxed font-medium">
                            Graduates of the Elite Program get priority access to our year-round Academy activities, ensuring continued development and access to our Royals coaching network.
                        </p>
                    </motion.div>

                    {/* Original Card 2 */}
                    <motion.div variants={fadeIn} className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 relative overflow-hidden group hover:border-rr-pink/30 transition-colors duration-500 flex flex-col items-center text-center">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rr-pink to-rr-blue rounded-t-3xl" />
                        <h3 className="text-xl font-bold text-rr-dark mb-3">Global Talent ID Network</h3>
                        <p className="text-slate-600 leading-relaxed font-medium">
                            Your Player DNA Profile goes into the global Rajasthan Royals talent database. Standout performers are tracked for future opportunities and potential selection into international programs.
                        </p>
                    </motion.div>

                    {/* Original Card 3 */}
                    <motion.div variants={fadeIn} className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 relative overflow-hidden group hover:border-rr-blue/30 transition-colors duration-500 flex flex-col items-center text-center">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rr-blue to-rr-pink rounded-t-3xl" />
                        <h3 className="text-xl font-bold text-rr-dark mb-3">Elite Squad Match Selection</h3>
                        <p className="text-slate-600 leading-relaxed font-medium">
                            Elite Program graduates form the pool we select from for our top squads — representing the Royals Academy in tournaments, showcase matches, and competitions.
                        </p>
                    </motion.div>

                    {/* Bullet Card 1 */}
                    <motion.div variants={fadeIn} className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 relative overflow-hidden group hover:border-rr-pink/30 transition-colors duration-500 flex flex-col items-center text-center">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rr-pink to-rr-blue rounded-t-3xl" />
                        <h3 className="text-xl font-bold text-rr-dark mb-3">Post-Program Report</h3>
                        <p className="text-slate-600 leading-relaxed font-medium">
                            Comprehensive PDF detailing technical and tactical progression, engineered to be shared with selectors and club coaches.
                        </p>
                    </motion.div>

                    {/* Bullet Card 2 */}
                    <motion.div variants={fadeIn} className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 relative overflow-hidden group hover:border-rr-blue/30 transition-colors duration-500 flex flex-col items-center text-center">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rr-blue to-rr-pink rounded-t-3xl" />
                        <h3 className="text-xl font-bold text-rr-dark mb-3">"What Next" Consultation</h3>
                        <p className="text-slate-600 leading-relaxed font-medium">
                            Personalised sit-down at the conclusion of the program providing actionable steps for the next 12 months of development.
                        </p>
                    </motion.div>

                    {/* Bullet Card 3 */}
                    <motion.div variants={fadeIn} className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 relative overflow-hidden group hover:border-rr-pink/30 transition-colors duration-500 flex flex-col items-center text-center">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rr-pink to-rr-blue rounded-t-3xl" />
                        <h3 className="text-xl font-bold text-rr-dark mb-3">The Royals Network</h3>
                        <p className="text-slate-600 leading-relaxed font-medium">
                            Direct integration into the Rajasthan Royals international development database.
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default BeyondTwelveWeeks;
