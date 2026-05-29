import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DateOfBirthInput from '../DateOfBirthInput';

const SOURCE_TAG = 'power-game';
const PROGRAM_LABEL = 'The Power Game Program';

const getUTMParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
        utm_source: params.get('utm_source') || null,
        utm_medium: params.get('utm_medium') || null,
        utm_campaign: params.get('utm_campaign') || null,
    };
};

const calcAge = (dob) => {
    if (!dob) return null;
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
};

const InputField = ({ label, type = 'text', placeholder, name, value, onChange, error, required = false }) => (
    <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
            {label} {required && <span className="text-rr-pink">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full bg-slate-50 border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rr-pink/20 transition-all text-rr-dark placeholder-slate-400 ${error ? 'border-red-400' : 'border-slate-200 focus:border-rr-pink'}`}
        />
        {error && <p className="text-red-500 text-xs font-medium mt-1">{error}</p>}
    </div>
);

const ComingSoonBanner = () => (
    <div className="shrink-0">
        {/* Pink "Coming Soon" band */}
        <div className="bg-rr-pink px-6 py-5 text-center">
            <h2 className="text-white font-black uppercase tracking-tight leading-none text-3xl sm:text-4xl italic">
                Coming Soon
            </h2>
            <p className="text-white/95 font-semibold uppercase tracking-wide text-[11px] sm:text-xs mt-2">
                To <span className="font-black">Melbourne</span> Venues in July 2026
            </p>
        </div>

        {/* Blue "presents" band with wordmark */}
        <div className="bg-rr-blue px-6 py-5 flex items-center gap-4">
            <img
                src="/assets/Logo_White_Transparent.png"
                alt="Rajasthan Royals Academy Melbourne"
                className="h-16 w-auto shrink-0"
            />
            <div className="min-w-0">
                <p className="text-white/70 font-bold uppercase tracking-[0.25em] text-[10px] mb-1">
                    Presents...
                </p>
                <div className="leading-[0.85]">
                    <span className="block text-white/80 font-bold uppercase tracking-widest text-[10px]">The</span>
                    <span className="block text-white font-black uppercase tracking-tight text-3xl sm:text-4xl">
                        Power<span className="text-rr-pink">Game</span>
                    </span>
                    <span className="block text-white/80 font-bold uppercase tracking-[0.3em] text-[10px] mt-1">Program</span>
                </div>
            </div>
        </div>
    </div>
);

const RegisterModal = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({
        player_name: '',
        player_dob: '',
        parent_name: '',
        parent_phone: '',
        parent_email: '',
        suburb: '',
        city: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error' | null

    if (!isOpen) return null;

    const playerAge = calcAge(form.player_dob);
    const isMinor = playerAge !== null && playerAge < 18;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const validate = () => {
        const next = {};
        if (!form.player_name.trim()) next.player_name = 'Player name is required.';
        if (isMinor && !form.parent_name.trim()) next.parent_name = 'Parent/guardian name is required.';
        if (!form.parent_phone.trim()) next.parent_phone = 'Mobile number is required.';
        if (!form.parent_email.trim() || !/\S+@\S+\.\S+/.test(form.parent_email)) next.parent_email = 'Valid email is required.';
        if (!form.suburb.trim()) next.suburb = 'Suburb is required.';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setStatus(null);

        try {
            const payload = {
                source: SOURCE_TAG,
                program: PROGRAM_LABEL,
                player_name: form.player_name.trim(),
                player_dob: form.player_dob || null,
                parent_name: form.parent_name.trim(),
                parent_phone: form.parent_phone.trim(),
                parent_email: form.parent_email.trim(),
                suburb: form.suburb.trim(),
                city: form.city.trim() || null,
                page_referrer: document.referrer || null,
                ...getUTMParams(),
            };

            const { error: insertError } = await supabase
                .from('power_game_inquiries')
                .insert([payload]);

            if (insertError) throw insertError;

            setStatus('success');
            setForm({
                player_name: '',
                player_dob: '',
                parent_name: '',
                parent_phone: '',
                parent_email: '',
                suburb: '',
                city: '',
            });
        } catch (err) {
            console.error('Power Game inquiry submission error:', err);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
                    >
                        {/* Close button (over banner) */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <ComingSoonBanner />

                        {/* Body */}
                        <div className="p-5 overflow-y-auto relative custom-scrollbar">
                            <p className="text-center text-rr-charcoal text-sm font-medium mb-5">
                                Register your interest below and we'll be first to let you know venues, dates &amp; squads.
                            </p>

                            {/* Success / error overlay */}
                            <AnimatePresence>
                                {(status === 'success' || status === 'error') && (
                                    <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-white/95 backdrop-blur-md">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                            className="text-center w-full"
                                        >
                                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                                                {status === 'success'
                                                    ? <Check className="w-8 h-8 text-green-600" />
                                                    : <AlertCircle className="w-8 h-8 text-red-600" />}
                                            </div>
                                            <h3 className="text-2xl font-black text-rr-dark mb-2 uppercase">
                                                {status === 'success' ? "You're On The List!" : 'Oops!'}
                                            </h3>
                                            <p className="text-slate-600 mb-6 text-sm px-4">
                                                {status === 'success'
                                                    ? "Thanks for registering your interest in The Power Game Program. We'll be in touch as soon as details are confirmed."
                                                    : 'Something went wrong submitting your details. Please try again.'}
                                            </p>
                                            <button
                                                onClick={() => { status === 'success' ? onClose() : setStatus(null); }}
                                                className="w-3/4 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest py-3 rounded-full transition-colors text-sm"
                                            >
                                                {status === 'success' ? 'Done' : 'Try Again'}
                                            </button>
                                        </motion.div>
                                    </div>
                                )}
                            </AnimatePresence>

                            <form id="power-game-form" onSubmit={handleSubmit} noValidate className="space-y-4">
                                <InputField label="Player's Full Name" name="player_name" value={form.player_name} onChange={handleChange} error={errors.player_name} placeholder="e.g. Sam Smith" required />

                                <DateOfBirthInput
                                    value={form.player_dob}
                                    onChange={(v) => setForm(prev => ({ ...prev, player_dob: v }))}
                                />

                                <div className="pt-2 border-t border-slate-100" />

                                <AnimatePresence initial={false}>
                                    {isMinor && (
                                        <motion.div
                                            key="parent-name"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-4">
                                                <InputField label="Parent / Guardian Name" name="parent_name" value={form.parent_name} onChange={handleChange} error={errors.parent_name} placeholder="e.g. Jane Smith" required />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <InputField label="Best Contact Mobile" type="tel" name="parent_phone" value={form.parent_phone} onChange={handleChange} error={errors.parent_phone} placeholder="e.g. 0412 345 678" required />
                                <InputField label="Best Contact Email" type="email" name="parent_email" value={form.parent_email} onChange={handleChange} error={errors.parent_email} placeholder="e.g. jane@email.com" required />

                                <div className="grid grid-cols-2 gap-3">
                                    <InputField label="Suburb" name="suburb" value={form.suburb} onChange={handleChange} error={errors.suburb} placeholder="e.g. Hallam" required />
                                    <InputField label="City" name="city" value={form.city} onChange={handleChange} placeholder="e.g. Melbourne" />
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        {status !== 'success' && (
                            <div className="p-5 border-t border-slate-100 shrink-0">
                                <button
                                    type="submit"
                                    form="power-game-form"
                                    disabled={loading}
                                    className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-3.5 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)]"
                                >
                                    {loading ? 'Submitting...' : 'Register Interest'}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RegisterModal;
