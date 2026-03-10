import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

// ⚠️ Update these to adjust capacity per location
const CAPACITY = {
    'cutting-edge': 40,
    'hallam': 30,
};

const AGE_OPTIONS = Array.from({ length: 8 }, (_, i) => i + 7); // 7–14

const SHIRT_SIZES = [
    { value: '6-8', label: 'Age 7–8 (Size 6–8)' },
    { value: '8-10', label: 'Age 8–10 (Size 8–10)' },
    { value: '10-12', label: 'Age 10–12 (Size 10–12)' },
    { value: '12-14', label: 'Age 12–14 (Size 12–14)' },
    { value: 'XS', label: 'Age 13–14 (Size XS)' },
    { value: 'S', label: 'Size S' },
    { value: 'M', label: 'Size M' },
    { value: 'L', label: 'Size L' },
];

const getUTMParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
        utm_source: params.get('utm_source') || null,
        utm_medium: params.get('utm_medium') || null,
        utm_campaign: params.get('utm_campaign') || null,
    };
};

const RegistrationForm = () => {
    const [counts, setCounts] = useState({ 'cutting-edge': 0, hallam: 0 });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [waitlisted, setWaitlisted] = useState(false);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        parent_name: '',
        parent_email: '',
        parent_phone: '',
        player_name: '',
        player_age: '',
        player_gender: '',
        primary_club: '',
        suburb: '',
        location: '',
        shirt_size: '',
    });

    // Fetch live capacity counts on mount
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const { data, error } = await supabase
                    .from('holiday_clinic_registrations')
                    .select('location')
                    .eq('on_waitlist', false);

                if (!error && data) {
                    const newCounts = { 'cutting-edge': 0, hallam: 0 };
                    data.forEach(row => {
                        if (newCounts[row.location] !== undefined) {
                            newCounts[row.location]++;
                        }
                    });
                    setCounts(newCounts);
                }
            } catch (err) {
                console.error('Capacity fetch failed:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCounts();
    }, []);

    const isFull = (loc) => loc && counts[loc] >= CAPACITY[loc];

    const validate = () => {
        const newErrors = {};
        if (!form.parent_name.trim()) newErrors.parent_name = 'Parent name is required.';
        if (!form.parent_email.trim() || !/\S+@\S+\.\S+/.test(form.parent_email)) newErrors.parent_email = 'Valid email is required.';
        if (!form.parent_phone.trim()) newErrors.parent_phone = 'Phone number is required.';
        if (!form.player_name.trim()) newErrors.player_name = 'Player name is required.';
        if (!form.player_age) newErrors.player_age = 'Player age is required.';
        if (!form.player_gender) newErrors.player_gender = 'Please select cricket type.';
        if (!form.primary_club.trim()) newErrors.primary_club = 'Primary club is required.';
        if (!form.suburb.trim()) newErrors.suburb = 'Suburb is required.';
        if (!form.location) newErrors.location = 'Please select a clinic location.';
        if (!form.shirt_size) newErrors.shirt_size = 'Please select a shirt size.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);

        try {
            // Re-check capacity at submission time to prevent race conditions
            const { data: freshData, error: freshError } = await supabase
                .from('holiday_clinic_registrations')
                .select('location')
                .eq('location', form.location)
                .eq('on_waitlist', false);

            const freshCount = freshData ? freshData.length : 0;
            const isNowFull = freshCount >= CAPACITY[form.location];

            const utmParams = getUTMParams();

            const payload = {
                shirt_size: form.shirt_size,
                parent_name: form.parent_name.trim(),
                parent_email: form.parent_email.trim(),
                parent_phone: form.parent_phone.trim(),
                player_name: form.player_name.trim(),
                player_age: parseInt(form.player_age, 10),
                player_gender: form.player_gender,
                primary_club: form.primary_club.trim(),
                suburb: form.suburb.trim(),
                location: form.location,
                on_waitlist: isNowFull,
                page_referrer: document.referrer || null,
                ...utmParams,
            };

            const { error: insertError } = await supabase
                .from('holiday_clinic_registrations')
                .insert([payload]);

            if (insertError) throw insertError;

            setWaitlisted(isNowFull);
            setSubmitted(true);
        } catch (err) {
            console.error('Submission error:', err);
            setErrors({ form: 'Something went wrong. Please try again or email info@rramelbourne.com.au' });
        } finally {
            setSubmitting(false);
        }
    };

    const selectedLocationFull = isFull(form.location);

    if (submitted) {
        return (
            <section id="registration-form" className="py-24 bg-rr-dark">
                <div className="max-w-2xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-2xl p-12 text-center"
                    >
                        <div className="text-6xl mb-6">{waitlisted ? '📋' : '🏏'}</div>
                        <h2 className="text-3xl font-black text-rr-dark uppercase tracking-wide mb-4">
                            {waitlisted ? 'YOU\'RE ON THE WAITLIST' : 'YOU\'RE IN!'}
                        </h2>
                        <div className="w-16 h-1 rounded-full bg-rr-pink mx-auto mb-6" />
                        {waitlisted ? (
                            <p className="text-rr-charcoal font-medium leading-relaxed">
                                That location just filled up — but don't stress. You're on the waitlist and we'll contact you at <strong>{form.parent_email}</strong> if a spot opens up.
                            </p>
                        ) : (
                            <p className="text-rr-charcoal font-medium leading-relaxed">
                                Spot secured. You'll receive a confirmation at <strong>{form.parent_email}</strong> with everything you need to know before the clinic. HALLA BOL!
                            </p>
                        )}
                    </motion.div>
                </div>
            </section>
        );
    }

    const inputClass = (field) =>
        `w-full bg-slate-50 border ${errors[field] ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-rr-dark font-medium focus:outline-none focus:border-rr-pink transition-colors duration-200 text-sm`;

    const labelClass = 'block text-xs font-black text-rr-dark uppercase tracking-widest mb-2';

    return (
        <section id="registration-form" className="py-24 bg-rr-dark">
            <div className="max-w-2xl mx-auto px-6">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Limited Spots — April 2026</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-4"
                    >
                        SECURE YOUR <span className="text-rr-pink">PLACE</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-white/70 font-medium"
                    >
                        Fill in your details below. We'll confirm your registration within 24 hours.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl p-8 md:p-10"
                >
                    <form onSubmit={handleSubmit} noValidate>
                        {/* Parent / Guardian */}
                        <div className="mb-8">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">Parent / Guardian Details</h3>
                            <div className="space-y-5">
                                <div>
                                    <label className={labelClass}>Full Name *</label>
                                    <input name="parent_name" value={form.parent_name} onChange={handleChange} className={inputClass('parent_name')} placeholder="e.g. Jane Smith" />
                                    {errors.parent_name && <p className="text-red-500 text-xs font-medium mt-1">{errors.parent_name}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Email Address *</label>
                                    <input name="parent_email" type="email" value={form.parent_email} onChange={handleChange} className={inputClass('parent_email')} placeholder="e.g. jane@email.com" />
                                    {errors.parent_email && <p className="text-red-500 text-xs font-medium mt-1">{errors.parent_email}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Phone Number *</label>
                                    <input name="parent_phone" type="tel" value={form.parent_phone} onChange={handleChange} className={inputClass('parent_phone')} placeholder="e.g. 0412 345 678" />
                                    {errors.parent_phone && <p className="text-red-500 text-xs font-medium mt-1">{errors.parent_phone}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Player Details */}
                        <div className="mb-8">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">Player Details</h3>
                            <div className="space-y-5">
                                <div>
                                    <label className={labelClass}>Player Full Name *</label>
                                    <input name="player_name" value={form.player_name} onChange={handleChange} className={inputClass('player_name')} placeholder="e.g. Liam Smith" />
                                    {errors.player_name && <p className="text-red-500 text-xs font-medium mt-1">{errors.player_name}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Player Age *</label>
                                        <select name="player_age" value={form.player_age} onChange={handleChange} className={inputClass('player_age')}>
                                            <option value="">Select age</option>
                                            {AGE_OPTIONS.map(age => (
                                                <option key={age} value={age}>{age} years old</option>
                                            ))}
                                        </select>
                                        {errors.player_age && <p className="text-red-500 text-xs font-medium mt-1">{errors.player_age}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>Cricket Type *</label>
                                        <select name="player_gender" value={form.player_gender} onChange={handleChange} className={inputClass('player_gender')}>
                                            <option value="">Select</option>
                                            <option value="male">Male Cricket</option>
                                            <option value="female">Female Cricket</option>
                                        </select>
                                        {errors.player_gender && <p className="text-red-500 text-xs font-medium mt-1">{errors.player_gender}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Primary Cricket Club *</label>
                                    <input name="primary_club" value={form.primary_club} onChange={handleChange} className={inputClass('primary_club')} placeholder="e.g. Doncaster CC" />
                                    {errors.primary_club && <p className="text-red-500 text-xs font-medium mt-1">{errors.primary_club}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Suburb Travelling From *</label>
                                    <input name="suburb" value={form.suburb} onChange={handleChange} className={inputClass('suburb')} placeholder="e.g. Doncaster East" />
                                    {errors.suburb && <p className="text-red-500 text-xs font-medium mt-1">{errors.suburb}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Shirt Size *</label>
                                    <select name="shirt_size" value={form.shirt_size} onChange={handleChange} className={inputClass('shirt_size')}>
                                        <option value="">Select size</option>
                                        {SHIRT_SIZES.map(s => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                    {errors.shirt_size && <p className="text-red-500 text-xs font-medium mt-1">{errors.shirt_size}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Clinic Selection */}
                        <div className="mb-8">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">Clinic Selection</h3>
                            <div>
                                <label className={labelClass}>Location *</label>
                                {loading ? (
                                    <div className="text-rr-charcoal text-sm font-medium">Loading availability...</div>
                                ) : (
                                    <select name="location" value={form.location} onChange={handleChange} className={inputClass('location')}>
                                        <option value="">Select a location</option>
                                        <option value="cutting-edge">
                                            Cutting Edge Cricket — Bundoora | Apr 8, 9 & 10 {isFull('cutting-edge') ? '(FULL — Waitlist)' : `(${CAPACITY['cutting-edge'] - counts['cutting-edge']} spots remaining)`}
                                        </option>
                                        <option value="hallam">
                                            Cricket Connect — Hallam | Apr 14, 15 & 16 {isFull('hallam') ? '(FULL — Waitlist)' : `(${CAPACITY['hallam'] - counts['hallam']} spots remaining)`}
                                        </option>
                                    </select>
                                )}
                                {errors.location && <p className="text-red-500 text-xs font-medium mt-1">{errors.location}</p>}

                                {/* Waitlist notice */}
                                <AnimatePresence>
                                    {selectedLocationFull && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4"
                                        >
                                            <p className="text-amber-700 text-sm font-semibold">
                                                This location is currently full. Submitting will add you to the waitlist — we'll contact you if a spot becomes available.
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Form error */}
                        {errors.form && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                <p className="text-red-600 text-sm font-medium">{errors.form}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center justify-center gap-3"
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Submitting...
                                </>
                            ) : selectedLocationFull ? (
                                'Join the Waitlist'
                            ) : (
                                <>
                                    Head to Checkout and Secure Your Place
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </>
                            )}
                        </button>

                        <p className="text-center text-rr-charcoal/50 text-xs font-medium mt-4">
                            By registering you agree to our{' '}
                            <a href="/terms-conditions" className="text-rr-pink hover:underline">Terms & Conditions</a>.
                        </p>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default RegistrationForm;
