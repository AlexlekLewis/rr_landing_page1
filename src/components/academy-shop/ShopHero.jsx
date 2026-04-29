import React from 'react';
import { motion } from 'framer-motion';

const ShopHero = () => {
  return (
    <section className="relative min-h-[50vh] flex items-end overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/shop/shop-hero-bg.jpeg')" }}
      />

      {/* Dark overlays — bottom-heavy so text is readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/60 to-rr-dark/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-rr-dark/60 via-transparent to-transparent" />

      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />

      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-rr-pink/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-6xl mx-auto px-6 pb-16 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
            <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Official Merchandise</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none text-white mb-4">
            Academy<br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #E11F8F, #1226AA)' }}>
              Shop
            </span>
          </h1>

          <p className="text-white/70 text-lg font-medium max-w-xl mt-4">
            Official Rajasthan Royals Academy Melbourne training and replica kit. Wear the badge with pride.
          </p>
        </motion.div>
      </div>

      {/* Bottom fade into product grid */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
    </section>
  );
};

export default ShopHero;
