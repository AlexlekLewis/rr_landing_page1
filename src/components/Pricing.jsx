import React from 'react';
import { motion } from 'framer-motion';

const Pricing = () => {
    const tiers = [
        {
            name: 'Development',
            price: '₹4,999',
            frequency: '/month',
            description: 'Perfect for beginners starting their journey in cricket.',
            features: [
                '2 Weekly Group Sessions',
                'Basic Technique Analysis',
                'Fitness Assessment',
                'Academy T-Shirt',
            ],
            cta: 'Start Journey',
            mostPopular: false,
        },
        {
            name: 'Performance',
            price: '₹8,999',
            frequency: '/month',
            description: 'For players ready to compete and refine their skills.',
            features: [
                '3 Weekly Sqaud Sessions',
                'Video Analysis & Feedback',
                'Strength & Conditioning Plan',
                'Match Simulation Drills',
                'Tournament Selection Priority',
            ],
            cta: 'Level Up',
            mostPopular: true,
        },
        {
            name: 'Elite',
            price: '₹14,999',
            frequency: '/month',
            description: 'The ultimate program for aspiring professionals.',
            features: [
                '4 Weekly Elite Sessions',
                '1-on-1 Personalized Coaching',
                'Full Biomechanical Analysis',
                'Nutrition & Mental Conditioning',
                'Full Training Kit',
            ],
            cta: 'Go Elite',
            mostPopular: false,
        },
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden" id="pricing">
            {/* Background Decor - Brand Gradient and Lion */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-rr-pink blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-rr-blue/10 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-rr-blue font-display font-black text-4xl sm:text-5xl uppercase tracking-wide mb-4"
                    >
                        Invest in <span className="text-rr-pink">Excellence</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-rr-dark/80 font-sans font-medium"
                    >
                        Choose the pathway that matches your ambition. World-class coaching at every level.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {tiers.map((tier, index) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative rounded-2xl p-8 h-full flex flex-col ${tier.mostPopular
                                ? 'bg-white shadow-2xl ring-2 ring-rr-pink scale-105 z-10'
                                : 'bg-gray-50 border border-gray-200 hover:border-rr-blue/30 transition-colors'
                                }`}
                        >
                            {tier.mostPopular && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <span className="bg-gradient-to-r from-rr-blue to-rr-pink text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-lg">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <h3 className={`text-2xl font-black uppercase tracking-wide mb-2 ${tier.mostPopular ? 'text-rr-pink' : 'text-rr-blue'}`}>
                                {tier.name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-6 min-h-[40px]">{tier.description}</p>

                            <div className="mb-6">
                                <span className="text-4xl font-black text-rr-dark">{tier.price}</span>
                                <span className="text-gray-500 font-medium">{tier.frequency}</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-start">
                                        <svg className={`w-5 h-5 mr-3 flex-shrink-0 ${tier.mostPopular ? 'text-rr-pink' : 'text-rr-blue'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm text-gray-700 font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-4 rounded-lg font-black uppercase tracking-wider text-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${tier.mostPopular
                                    ? 'bg-gradient-to-r from-rr-blue to-rr-pink text-white shadow-md'
                                    : 'bg-white text-rr-blue border-2 border-rr-blue/10 hover:border-rr-blue hover:text-white hover:bg-rr-blue'
                                    }`}
                            >
                                {tier.cta}
                            </button>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-gray-500 text-sm mb-4">
                        Not sure which program is right for you?
                    </p>
                    <a href="#contact" className="inline-flex items-center text-rr-pink font-bold hover:text-rr-blue transition-colors">
                        Contact our team for a consultation
                        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
