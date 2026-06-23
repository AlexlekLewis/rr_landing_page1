import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

// The payoff moment — feels like an assessment that rewards the player.
// OPEN PROGRAM: every 12-16 player sees the same neutral "<band> Squad" welcome.
// 17+ players see the coach-review screen (manual allocation). Never reference
// "Performance / Pathway / Review" — that's internal-only and would offend.
export default function DnaRevealCard({ placement, centreName, onContinue, onRequestInfo }) {
  if (placement.requiresReview) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        className="relative max-w-lg mx-auto rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-br from-rr-navy via-rr-dark to-black p-8 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-rr-blue/20 border border-rr-blue/40 flex items-center justify-center mx-auto mb-5">
          <ShieldCheck className="w-8 h-8 text-rr-blue" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide mb-3">Profile received — a coach will be in touch</h2>
        <p className="text-white/70 text-sm md:text-base mb-6">
          Thanks for applying. One of our coaches will personally talk through the best session for you and confirm the next step. No payment needed yet.
        </p>
        <div className="text-xs text-white/40 uppercase tracking-widest mb-6">{centreName}</div>
        <button onClick={onContinue} className="inline-flex items-center gap-2 bg-white text-rr-dark font-black uppercase tracking-widest text-sm rounded-full px-6 py-3 hover:bg-rr-pink hover:text-white transition-colors">
          What happens next <ArrowRight className="w-4 h-4" />
        </button>
        {onRequestInfo && (
          <button onClick={onRequestInfo} className="mt-4 w-full text-center text-xs text-white/45 hover:text-white/80 uppercase tracking-widest transition-colors">
            Want more information first?
          </button>
        )}
      </motion.div>
    );
  }

  const title = `${placement.placedBand} Squad`;
  const blurb = 'One squad — the whole age group trains together at your centre.';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative max-w-lg mx-auto rounded-3xl overflow-hidden border border-rr-pink/40 bg-gradient-to-br from-rr-navy via-rr-dark to-black"
    >
      <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(225,31,143,0.30) 0%, rgba(0,0,0,0) 60%)' }} />
      <div className="relative z-10 p-8 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 bg-rr-pink/15 border border-rr-pink/40 rounded-full px-4 py-1.5 mb-5">
          <Sparkles className="w-3.5 h-3.5 text-rr-pink" />
          <span className="text-[11px] font-black text-rr-pink uppercase tracking-widest">You've earned your place</span>
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none mb-2">{title}</h2>
        <p className="text-white/60 text-sm mb-6">{blurb}</p>

        {placement.playFlag === 'play_up' && (
          <div className="flex items-center justify-center gap-2 text-rr-pink text-xs font-bold uppercase tracking-widest mb-5">
            <Zap className="w-3.5 h-3.5" /> Strong for your age — a coach may invite you to train up
          </div>
        )}

        {onContinue && (
          <button onClick={onContinue} className="w-full inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-sm rounded-full px-6 py-4 transition-all hover:shadow-[0_0_30px_rgba(229,6,149,0.5)]">
            Choose your training time <ArrowRight className="w-4 h-4" />
          </button>
        )}
        <p className="text-white/25 text-[11px] mt-3">*Squads are subject to change &mdash; we&apos;ll work with you if anything needs adjusting.</p>
      </div>
    </motion.div>
  );
}
