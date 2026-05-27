import React from 'react';
import { motion } from 'framer-motion';

/**
 * QuoteBlock — reusable testimonial/quote section.
 *
 * Props:
 *  - quote: string (placeholder text)
 *  - attribution: string (name)
 *  - role: string (optional sub-line)
 *  - variant: 'light' | 'dark' | 'feature'
 *  - image: string (optional, only used in 'feature' variant)
 *  - imageAlt: string
 */
const QuoteBlock = ({
    quote,
    attribution,
    role,
    variant = 'light',
    image,
    imageAlt = '',
}) => {
    const isDark = variant === 'dark';
    const isFeature = variant === 'feature';

    const bg = isDark
        ? 'bg-rr-dark'
        : isFeature
            ? 'bg-black'
            : 'bg-slate-50';

    const textColor = isDark || isFeature ? 'text-white' : 'text-rr-dark';
    const attribColor = isDark || isFeature ? 'text-rr-pink' : 'text-rr-pink';
    const roleColor = isDark || isFeature ? 'text-white/70' : 'text-rr-charcoal';

    // FEATURE variant — image + quote side-by-side
    if (isFeature) {
        return (
            <section className={`${bg} py-24 md:py-32 relative overflow-hidden`}>
                {/* subtle pink glow */}
                <div
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(circle at 30% 50%, rgba(225,31,143,0.20) 0%, rgba(0,0,0,0) 55%)',
                    }}
                />
                <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="relative"
                    >
                        <div className="aspect-[4/5] w-full bg-gradient-to-br from-rr-navy via-rr-blue/40 to-rr-pink/40 rounded-2xl overflow-hidden border border-white/10 flex items-end justify-center relative">
                            {/* radial highlight behind subject */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background:
                                        'radial-gradient(circle at 50% 55%, rgba(225,31,143,0.35) 0%, rgba(0,0,0,0) 60%)',
                                }}
                            />
                            {image ? (
                                <img
                                    src={image}
                                    alt={imageAlt}
                                    className="relative z-10 w-full h-full object-contain object-bottom"
                                />
                            ) : (
                                <div className="relative z-10 text-center p-8 m-auto">
                                    <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">
                                        Image Placeholder
                                    </div>
                                    <div className="text-white font-black text-2xl uppercase tracking-wide">
                                        {imageAlt || 'Player Photo'}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
                    >
                        <div className="text-rr-pink text-6xl md:text-8xl font-black leading-none mb-4">
                            &ldquo;
                        </div>
                        <blockquote className={`${textColor} text-xl md:text-3xl font-bold leading-snug mb-8`}>
                            {quote}
                        </blockquote>
                        <div className={`${attribColor} text-sm md:text-base font-black uppercase tracking-widest`}>
                            {attribution}
                        </div>
                        {role && (
                            <div className={`${roleColor} text-xs md:text-sm font-medium uppercase tracking-wider mt-1`}>
                                {role}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>
        );
    }

    // LIGHT / DARK variant — centered quote
    return (
        <section className={`${bg} py-20 md:py-28 relative`}>
            <div className="max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    <div className="text-rr-pink text-6xl md:text-8xl font-black leading-none mb-2">
                        &ldquo;
                    </div>
                    <blockquote className={`${textColor} text-xl md:text-3xl lg:text-4xl font-bold leading-snug mb-8 max-w-3xl mx-auto`}>
                        {quote}
                    </blockquote>
                    <div className={`${attribColor} text-sm md:text-base font-black uppercase tracking-widest`}>
                        {attribution}
                    </div>
                    {role && (
                        <div className={`${roleColor} text-xs md:text-sm font-medium uppercase tracking-wider mt-1`}>
                            {role}
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default QuoteBlock;
