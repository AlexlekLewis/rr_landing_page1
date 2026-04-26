import React from 'react';
import { motion } from 'framer-motion';

const ShopHero = () => {
  return (
    <section className="relative min-h-[45vh] flex items-end overflow-hidden bg-rr-dark">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rr-pink/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rr-blue/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Diagonal geometric accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-32 top-0 w-[600px] h-full opacity-5"
          style={{ background: 'linear-gradient(135deg, transparent 40%, #E11F8F 40%, #E11F8F 50%, transparent 50%)' }} />
      </div>

      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />

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

          <p className="text-white/60 text-lg font-medium max-w-xl mt-4">
            Official Rajasthan Royals Academy Melbourne training and replica kit. Wear the badge with pride.
          </p>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
    </section>
  );
};

export default ShopHero;
