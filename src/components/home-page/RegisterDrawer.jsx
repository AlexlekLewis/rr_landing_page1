import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const AGE_GROUPS = ['U10', 'U12', 'U14', 'U16', 'U18', 'Adult'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Elite'];
const GENDER_OPTIONS = ['Male Cricket', 'Female Cricket', 'No Preference'];

const PROGRAMS = [
    { label: 'Elite Program 2026', route: '/eliteprogram2026', urgency: 'Less Than 10 Places Remaining' },
    { label: 'Holiday Programs', route: '/holiday-programs', urgency: null },
];

const InputField = ({ label, type = 'text', value, onChange, placeholder, required }) => (
    <div>
        <label className="block text-xs font-bold text-rr-charcoal uppercase tracking-widest mb-1.5">
            {label} {required && <span className="text-rr-pink">*</span>}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-rr-dark placeholder:text-slate-400 focus:outline-none focus:border-rr-pink transition-colors"
        />
    </div>
);

const SelectField = ({ label, value, onChange, options, required }) => (
    <div>
        <label className="block text-xs font-bold text-rr-charcoal uppercase tracking-widest mb-1.5">
            {label} {required && <span className="text-rr-pink">*</span>}
        </label>
        <select
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-rr-dark focus:outline-none focus:border-rr-pink transition-colors bg-white appearance-none"
        >
            <option value="">Select...</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    </div>
);

const SuccessState = ({ message, onClose }) => (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <h3 className="text-2xl font-black text-rr-dark uppercase tracking-wide mb-3">You're In!</h3>
        <p className="text-rr-charcoal font-medium mb-8">{message}</p>
        <button onClick={onClose} className="bg-rr-pink text-white font-bold uppercase tracking-widest px-8 py-3 rounded-full text-sm hover:bg-rr-light-pink transition-colors">
            Close
        </button>
    </div>
);

// PATH 1 — Register & Buy
const PathBuy = ({ onBack }) => (
    <div className="p-6 space-y-4">
        <button onClick={onBack} className="flex items-center gap-1 text-xs font-bold text-rr-charcoal/60 hover:text-rr-pink uppercase tracking-widest transition-colors mb-4">
            <ChevronLeft className="w-3 h-3" /> Back
        </button>
        <h3 className="text-xl font-black text-rr-dark uppercase tracking-wide mb-2">Choose Your Program</h3>
        <p className="text-sm text-rr-charcoal font-medium mb-6">Select a program below to go to the registration and payment page.</p>
        <div className="space-y-3">
            {PROGRAMS.map(p => (
                <Link
                    key={p.route}
                    to={p.route}
                    className="flex items-center justify-between w-full p-4 border border-slate-200 rounded-xl hover:border-rr-pink hover:bg-rr-pink/5 transition-all group"
                >
                    <div>
                        <span className="font-bold text-rr-dark text-sm uppercase tracking-wide block">{p.label}</span>
                        {p.urgency && (
                            <span className="text-xs font-bold text-rr-pink mt-0.5 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse inline-block" />
                                {p.urgency}
                            </span>
                        )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-rr-charcoal/40 group-hover:text-rr-pink group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
            ))}
        </div>
    </div>
);

// PATH 2 — Upcoming Programs
const PathUpcoming = ({ onBack, onSuccess }) => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', age_group: '', skill_level: '', postcode: '', gender_preference: '', questions: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams(window.location.search);
            const { error: err } = await supabase.from('upcoming_program_interest').insert([{
                ...form,
                utm_source: params.get('utm_source') || null,
                utm_medium: params.get('utm_medium') || null,
                utm_campaign: params.get('utm_campaign') || null,
                page_referrer: document.referrer || null,
            }]);
            if (err) throw err;
            onSuccess('We\'ll be in touch as soon as new programs are announced. Our team will match you to the right opportunity.');
        } catch {
            setError('Something went wrong. Please try again or email us directly.');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <button type="button" onClick={onBack} className="flex items-center gap-1 text-xs font-bold text-rr-charcoal/60 hover:text-rr-pink uppercase tracking-widest transition-colors mb-2">
                <ChevronLeft className="w-3 h-3" /> Back
            </button>
            <h3 className="text-xl font-black text-rr-dark uppercase tracking-wide mb-1">Register for Upcoming Programs</h3>
            <p className="text-sm text-rr-charcoal font-medium mb-4">Be first to know when new programs launch. We'll match you based on your details.</p>

            <InputField label="Full Name" value={form.name} onChange={set('name')} placeholder="Your name" required />
            <InputField label="Email" type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required />
            <InputField label="Phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="04XX XXX XXX" />
            <div className="grid grid-cols-2 gap-3">
                <SelectField label="Age Group" value={form.age_group} onChange={set('age_group')} options={AGE_GROUPS} />
                <SelectField label="Skill Level" value={form.skill_level} onChange={set('skill_level')} options={SKILL_LEVELS} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <InputField label="Postcode" value={form.postcode} onChange={set('postcode')} placeholder="3000" />
                <SelectField label="Cricket Type" value={form.gender_preference} onChange={set('gender_preference')} options={GENDER_OPTIONS} />
            </div>
            <div>
                <label className="block text-xs font-bold text-rr-charcoal uppercase tracking-widest mb-1.5">Any Questions?</label>
                <textarea
                    value={form.questions}
                    onChange={set('questions')}
                    placeholder="Ask us anything..."
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-rr-dark placeholder:text-slate-400 focus:outline-none focus:border-rr-pink transition-colors resize-none"
                />
            </div>

            {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-bold uppercase tracking-widest py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(229,6,149,0.4)] text-sm"
            >
                {loading ? 'Submitting...' : 'Register Interest'}
            </button>
        </form>
    );
};

// PATH 3 — More Information
const PathMoreInfo = ({ onBack, onSuccess }) => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', age_group: '', skill_level: '', postcode: '', gender_preference: '', looking_for: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams(window.location.search);
            const { error: err } = await supabase.from('general_enquiries').insert([{
                ...form,
                utm_source: params.get('utm_source') || null,
                utm_medium: params.get('utm_medium') || null,
                utm_campaign: params.get('utm_campaign') || null,
                page_referrer: document.referrer || null,
            }]);
            if (err) throw err;
            onSuccess('Thanks for reaching out. One of our team will be in touch within 48 hours to help find the right program for you.');
        } catch {
            setError('Something went wrong. Please try again or email us directly.');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <button type="button" onClick={onBack} className="flex items-center gap-1 text-xs font-bold text-rr-charcoal/60 hover:text-rr-pink uppercase tracking-widest transition-colors mb-2">
                <ChevronLeft className="w-3 h-3" /> Back
            </button>
            <h3 className="text-xl font-black text-rr-dark uppercase tracking-wide mb-1">Get More Information</h3>
            <p className="text-sm text-rr-charcoal font-medium mb-4">Tell us about yourself and what you're looking for — we'll find the right fit.</p>

            <InputField label="Full Name" value={form.name} onChange={set('name')} placeholder="Your name" required />
            <InputField label="Email" type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required />
            <InputField label="Phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="04XX XXX XXX" />
            <div className="grid grid-cols-2 gap-3">
                <SelectField label="Age Group" value={form.age_group} onChange={set('age_group')} options={AGE_GROUPS} />
                <SelectField label="Skill Level" value={form.skill_level} onChange={set('skill_level')} options={SKILL_LEVELS} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <InputField label="Postcode" value={form.postcode} onChange={set('postcode')} placeholder="3000" />
                <SelectField label="Cricket Type" value={form.gender_preference} onChange={set('gender_preference')} options={GENDER_OPTIONS} />
            </div>
            <div>
                <label className="block text-xs font-bold text-rr-charcoal uppercase tracking-widest mb-1.5">What Are You Looking For?</label>
                <textarea
                    value={form.looking_for}
                    onChange={set('looking_for')}
                    placeholder="Tell us about your goals, current level, or any specific questions..."
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-rr-dark placeholder:text-slate-400 focus:outline-none focus:border-rr-pink transition-colors resize-none"
                />
            </div>

            {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-bold uppercase tracking-widest py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(229,6,149,0.4)] text-sm"
            >
                {loading ? 'Submitting...' : 'Send Enquiry'}
            </button>
        </form>
    );
};

// Main Drawer
const RegisterDrawer = ({ isOpen, onClose }) => {
    const [path, setPath] = useState(null); // null = home, 'buy' | 'upcoming' | 'info'
    const [successMessage, setSuccessMessage] = useState(null);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            // Reset state after close animation
            const t = setTimeout(() => { setPath(null); setSuccessMessage(null); }, 300);
            return () => clearTimeout(t);
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleSuccess = (msg) => setSuccessMessage(msg);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-rr-dark/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-3">
                                <img src="/assets/MELBOURNE_OFFICIAL.png" alt="RRA" className="h-8 w-auto object-contain" style={{ filter: 'brightness(0)' }} />
                            </div>
                            <button
                                onClick={onClose}
                                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4 text-rr-charcoal" />
                            </button>
                        </div>

                        {/* Content */}
                        {successMessage ? (
                            <SuccessState message={successMessage} onClose={onClose} />
                        ) : path === 'buy' ? (
                            <PathBuy onBack={() => setPath(null)} />
                        ) : path === 'upcoming' ? (
                            <PathUpcoming onBack={() => setPath(null)} onSuccess={handleSuccess} />
                        ) : path === 'info' ? (
                            <PathMoreInfo onBack={() => setPath(null)} onSuccess={handleSuccess} />
                        ) : (
                            // Home — choose path
                            <div className="p-6">
                                <h2 className="text-2xl font-black text-rr-dark uppercase tracking-wide mb-2">Register Now</h2>
                                <p className="text-sm text-rr-charcoal font-medium mb-8">How can we help you today?</p>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => setPath('buy')}
                                        className="w-full text-left p-5 rounded-2xl border-2 border-rr-pink bg-rr-pink/5 hover:bg-rr-pink/10 transition-all group"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-black text-rr-dark uppercase tracking-wide mb-1">Register & Buy</p>
                                                <p className="text-xs text-rr-charcoal/70 font-medium">Secure your place in a current program</p>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-rr-pink shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setPath('upcoming')}
                                        className="w-full text-left p-5 rounded-2xl border-2 border-rr-blue/20 bg-rr-blue/5 hover:bg-rr-blue/10 transition-all group"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-black text-rr-dark uppercase tracking-wide mb-1">Register for Upcoming Programs</p>
                                                <p className="text-xs text-rr-charcoal/70 font-medium">Be first to know when new programs launch</p>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-rr-blue shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setPath('info')}
                                        className="w-full text-left p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all group"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-black text-rr-dark uppercase tracking-wide mb-1">Register for More Information</p>
                                                <p className="text-xs text-rr-charcoal/70 font-medium">Tell us your goals — we'll find the right fit</p>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-rr-charcoal/40 shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default RegisterDrawer;
