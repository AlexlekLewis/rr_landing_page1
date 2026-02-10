import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const BonusOffer = () => {
    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #001D48 0%, #1226AA 40%, #E11F8F 100%)' }}>
            {/* Background texture */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="container mx-auto px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-block bg-white/10 backdrop-blur-sm px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-white/20 text-white">
                        Defining Success
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">
                        YOUR PATHWAY STARTS HERE
                    </h2>

                    <div className="max-w-3xl mx-auto space-y-4 mb-10">
                        <p className="text-lg md:text-xl font-medium text-white/90 leading-relaxed">
                            The Elite Program is designed to improve your game, help you excel, and get noticed on your current pathway.
                        </p>
                        <p className="text-base text-white/70 leading-relaxed">
                            Every participant gains early visibility within the Royals global scouting network.
                            Our coaches will work with you to develop the skills, mindset and match awareness
                            needed to perform at higher levels — whether that's at club, representative or professional level.
                        </p>
                        <p className="text-base text-white/70 leading-relaxed">
                            For those who consistently meet the benchmarks set by the Royals Group, opportunities
                            arise to display your skills in front of franchise decision makers in{' '}
                            <strong className="text-white">Australia, India, Barbados or South Africa</strong>.
                        </p>
                        <p className="text-base text-white/70 leading-relaxed">
                            This is about momentum, development and genuine opportunity.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button onClick={scrollToForm} variant="white">
                            APPLY TO SECURE YOUR PLACE
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default BonusOffer;
