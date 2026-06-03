import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Shown when no valid referral code is present. The page is invite-only, so this
// screen explains that and lets a member with a code unlock it manually.
const ITInviteGate = ({ onTryCode, checking }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!code.trim()) { setError('Please enter your invite code.'); return; }
        const ok = await onTryCode(code);
        if (!ok) setError("That invite code wasn't recognised. Please check the link or code shared with you.");
    };

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans flex flex-col items-center justify-center px-6 relative overflow-hidden selection:bg-rr-pink selection:text-white">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-rr-pink/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rr-blue/20 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md text-center"
            >
                <img
                    src="/assets/Logo_White_Transparent.png"
                    alt="Rajasthan Royals Academy Melbourne"
                    className="h-20 w-auto mx-auto mb-8 object-contain"
                />

                <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                    <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Invitation Only</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none mb-4">
                    India Tour 2026
                </h1>
                <p className="text-white/70 font-medium leading-relaxed mb-8">
                    This registration is private and by invitation. Please open the personal link
                    shared with you by Rajasthan Royals Academy Melbourne — or enter your invite
                    code below.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        value={code}
                        onChange={(e) => { setCode(e.target.value); if (error) setError(''); }}
                        placeholder="Enter your invite code"
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 text-center text-white placeholder-white/30 focus:outline-none focus:border-rr-pink/60 focus:bg-white/10 transition-colors tracking-wide"
                    />
                    {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
                    <button
                        type="submit"
                        disabled={checking}
                        className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-3.5 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)]"
                    >
                        {checking ? 'Checking…' : 'Unlock Registration'}
                    </button>
                </form>

                <p className="text-white/40 text-sm font-medium mt-8">
                    Don't have a code? Email{' '}
                    <a href="mailto:info@rramelbourne.com" className="text-rr-pink hover:underline font-bold">
                        info@rramelbourne.com
                    </a>
                </p>
            </motion.div>
        </div>
    );
};

export default ITInviteGate;
