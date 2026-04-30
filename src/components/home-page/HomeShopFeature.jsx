import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomeShopFeature = () => {
    const [showBack, setShowBack] = useState(false);

    return (
        <section className="py-16 md:py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #001D48 0%, #1226AA 50%, #001D48 100%)' }}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #E11F8F 0%, transparent 50%), radial-gradient(circle at 80% 50%, #1226AA 0%, transparent 50%)' }} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Section label */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="inline-flex items-center gap-2 bg-rr-pink/20 border border-rr-pink/30 rounded-full px-4 py-1.5 mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Royals Shop</span>
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide">
                        WEAR THE <span className="text-rr-pink">ROYALS COLOURS</span>
                    </h2>
                    <p className="text-white/60 font-medium mt-3 max-w-xl mx-auto">
                        Official RRA Melbourne academy kit and IPL replica gear — now available online.
                    </p>
                </motion.div>

                {/* Featured product */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">

                    {/* Image — flip on hover */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative group cursor-pointer"
                        onMouseEnter={() => setShowBack(true)}
                        onMouseLeave={() => setShowBack(false)}
                        onClick={() => setShowBack(b => !b)}
                    >
                        {/* Glow effect */}
                        <div className="absolute -inset-4 bg-rr-pink/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 aspect-square">
                            {/* Front image */}
                            <img
                                src="/shop/training-shirt-front.png"
                                alt="RRA Melbourne Training Shirt — Front"
                                className={`w-full h-full object-contain p-6 transition-all duration-500 ${showBack ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} absolute inset-0`}
                            />
                            {/* Back image */}
                            <img
                                src="/shop/training-shirt-back.png"
                                alt="RRA Melbourne Training Shirt — Back"
                                className={`w-full h-full object-contain p-6 transition-all duration-500 ${showBack ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} absolute inset-0`}
                            />

                            {/* Flip hint */}
                            <div className="absolute bottom-4 right-4 bg-black/40 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm opacity-100 group-hover:opacity-0 transition-opacity">
                                Hover to flip →
                            </div>
                        </div>
                    </motion.div>

                    {/* Product details */}
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="flex flex-col"
                    >
                        {/* Badge */}
                        <span className="inline-flex items-center gap-2 bg-rr-blue text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full w-fit mb-6">
                            ⭐ Academy Kit — Featured Item
                        </span>

                        <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide leading-tight mb-2">
                            RRA Melbourne<br />
                            <span className="text-rr-pink">Training Shirt</span>
                        </h3>

                        <p className="text-4xl font-black text-white mb-4">$64.95</p>

                        <p className="text-white/60 font-medium leading-relaxed mb-8">
                            High-performance training shirt in official Rajasthan Royals Academy Melbourne branding. Moisture-wicking fabric built for the Australian climate — wear the colours on and off the training ground.
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {['Official Academy Branding', 'Moisture-Wicking Fabric', 'Built for Australian Climate', 'All Sizes Available'].map(f => (
                                <div key={f} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rr-pink shrink-0" />
                                    <span className="text-white/70 text-sm font-medium">{f}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/academy-shop"
                                className="bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.5)] flex items-center justify-center gap-2 group"
                            >
                                Shop Now
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link
                                to="/academy-shop"
                                className="border border-white/30 hover:border-white/60 text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                            >
                                View All Academy Kit
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HomeShopFeature;
