import React from 'react';
import { motion } from 'framer-motion';

const AcceptanceHero = ({ acceptStatus, setAcceptStatus }) => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    return (
        <section id="lp3-hero" className="relative pt-32 pb-20 px-6 lg:px-8 bg-rr-dark text-white overflow-hidden min-h-[80vh] flex flex-col justify-center">
            {/* Background styling */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/assets/sooryavanchi-arms-raised.jpg"
                    alt="Celebration"
                    className="w-full h-full object-cover object-[center_30%] opacity-30 grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/80 to-rr-dark/60"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-rr-dark/80 via-transparent to-rr-dark/90"></div>
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="relative z-10 max-w-4xl mx-auto w-full text-center"
            >
                <div className="space-y-10 mb-16">
                    <motion.div variants={fadeIn}>
                        <h1 className="text-4xl md:text-6xl font-black tracking-wide leading-[1.1] uppercase font-heading bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-md mb-8">
                            Elite Program <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Offer</span>
                        </h1>
                    </motion.div>

                    <motion.div variants={fadeIn} className="flex justify-center mb-10">
                        <img
                            src="/assets/MELBOURNE_OFFICIAL.png"
                            alt="Rajasthan Royals Academy Melbourne"
                            className="h-24 md:h-32 w-auto object-contain brightness-0 invert"
                        />
                    </motion.div>

                    <motion.div variants={fadeIn} className="space-y-6 text-lg md:text-xl text-slate-200 leading-relaxed font-light max-w-3xl mx-auto bg-white/5 p-8 rounded-3xl backdrop-blur-sm border border-white/10 shadow-2xl">
                        <p>
                            Following our selection process, we are delighted to be able to offer you a position in the inaugural Rajasthan Royals Academy Melbourne Elite Program.
                        </p>
                        <p>
                            In accepting this offer you will become a foundation member of this world first Royals program!
                        </p>
                        <p className="font-semibold text-white">
                            Please take the time to work through the below information to secure and accept your place in the Elite Program.
                        </p>
                    </motion.div>
                </div>

                {/* Offer Acceptance Toggle - No Decline */}
                <motion.div variants={fadeIn} className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl text-rr-dark max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 uppercase tracking-wide">Do you accept the offer to the Rajasthan Royals Academy Melbourne Elite Program?</h2>

                    <button
                        onClick={() => setAcceptStatus('yes')}
                        className={`w-full py-6 px-10 rounded-2xl font-black tracking-wide uppercase text-xl md:text-2xl transition-all duration-300 border-2 ${acceptStatus === 'yes'
                                ? 'bg-rr-pink border-rr-pink text-white shadow-xl shadow-rr-pink/20 scale-105'
                                : 'bg-gradient-to-r from-rr-pink to-rr-blue border-transparent text-white hover:shadow-xl hover:shadow-rr-pink/20 hover:scale-105'
                            }`}
                    >
                        {acceptStatus === 'yes' ? 'OFFER ACCEPTED ✓' : 'YES, I ACCEPT'}
                    </button>

                    {/* Add celebration text when accepted */}
                    {acceptStatus === 'yes' && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 text-rr-pink font-bold text-lg"
                        >
                            Scroll down to complete your Elite Program Administration details.
                        </motion.p>
                    )}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default AcceptanceHero;
