import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const LEVEL_OPTIONS = [
    'Junior / local club',
    'Senior club (sub-district / turf)',
    'District / Premier Cricket',
    'State / representative',
    'First class / professional',
    'Other',
];

const COACH_LEVELS = ['Junior', 'Senior', 'Both'];

const EVENT = {
    title: 'An Afternoon for Coaches | Rajasthan Royals Academy',
    location: 'The Mickleham Centre, 3 Eclipse Dr, Mickleham VIC 3064',
    // Sunday 26 July 2026, 1:00-4:00 PM Melbourne time (AEST, UTC+10)
    startUTC: '20260726T030000Z',
    endUTC: '20260726T060000Z',
    description: 'A free afternoon with the Rajasthan Royals Academy coaching team at our new home in Mickleham. Come for the whole afternoon, or drop in when you can.',
};

const googleCalendarUrl =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${encodeURIComponent(EVENT.title)}` +
    `&dates=${EVENT.startUTC}/${EVENT.endUTC}` +
    `&location=${encodeURIComponent(EVENT.location)}` +
    `&details=${encodeURIComponent(EVENT.description)}`;

const icsHref =
    'data:text/calendar;charset=utf-8,' +
    encodeURIComponent(
        [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Rajasthan Royals Academy Melbourne//Coaches Day//EN',
            'BEGIN:VEVENT',
            'UID:coaches-day-2026@rramelbourne.com',
            'DTSTAMP:20260713T000000Z',
            `DTSTART:${EVENT.startUTC}`,
            `DTEND:${EVENT.endUTC}`,
            `SUMMARY:${EVENT.title}`,
            `LOCATION:${EVENT.location.replace(/,/g, '\\,')}`,
            `DESCRIPTION:${EVENT.description.replace(/,/g, '\\,')}`,
            'END:VEVENT',
            'END:VCALENDAR',
        ].join('\r\n')
    );

const getUTMParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
        utm_source: params.get('utm_source') || null,
        utm_medium: params.get('utm_medium') || null,
        utm_campaign: params.get('utm_campaign') || null,
    };
};

const ComplianceCheckbox = ({ checked, onChange, error, children }) => (
    <div className="mb-4">
        <label className="flex items-start gap-3 cursor-pointer group">
            <div
                onClick={() => onChange(!checked)}
                className={`mt-0.5 w-5 h-5 rounded shrink-0 border-2 flex items-center justify-center transition-all duration-200 ${checked ? 'bg-rr-pink border-rr-pink' : 'border-slate-300 bg-white group-hover:border-rr-pink'}`}
            >
                {checked && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
            <span className="text-rr-charcoal text-sm font-medium leading-relaxed">{children}</span>
        </label>
        {error && <p className="text-red-500 text-xs font-medium mt-1 ml-8">{error}</p>}
    </div>
);

const CoachesDayForm = () => {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [coachLevel, setCoachLevel] = useState('');

    const [form, setForm] = useState({
        coach_name: '',
        email: '',
        phone: '',
        club_teams: '',
        playing_history: '',
        highest_level: '',
        love_coaching: '',
        hope_to_learn: '',
    });

    const validate = () => {
        const e = {};
        if (!form.coach_name.trim()) e.coach_name = 'Please tell us your name.';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'A valid email is required.';
        if (!acceptTerms) e.acceptTerms = 'Please agree so we can hold your spot.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);

        try {
            const utm = getUTMParams();
            const coachingRoles = [coachLevel, form.club_teams.trim()].filter(Boolean).join(' | ');
            const payload = {
                coach_name: form.coach_name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim() || null,
                coaching_roles: coachingRoles || null,
                highest_level: form.highest_level || null,
                playing_history: form.playing_history.trim() || null,
                love_coaching: form.love_coaching.trim() || null,
                hope_to_learn: form.hope_to_learn.trim() || null,
                accept_terms: acceptTerms,
                source: 'coaches-day-site',
                page_referrer: document.referrer || null,
                ...utm,
            };

            const { error: insertError } = await supabase
                .from('coaches_day_registrations')
                .insert([payload]);

            if (insertError) throw insertError;

            setSubmitted(true);
            window.scrollTo({ top: (document.getElementById('registration-form')?.offsetTop || 80) - 80, behavior: 'smooth' });
        } catch (err) {
            console.error('Coaches Day submission error:', err);
            setErrors({ form: 'Something went wrong. Please try again, or email coaches@rramelbourne.com.' });
        } finally {
            setSubmitting(false);
        }
    };

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
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-black text-rr-dark uppercase tracking-wide mb-4">
                            You&rsquo;re In!
                        </h2>
                        <div className="w-16 h-1 rounded-full bg-rr-pink mx-auto mb-6" />
                        <p className="text-rr-charcoal font-medium leading-relaxed mb-8">
                            See you on <strong>Sunday 26 July</strong> at <strong>The Mickleham Centre</strong>. Thanks{' '}
                            <strong>{form.coach_name.split(' ')[0]}</strong>, your spot is registered and we&rsquo;ll send
                            anything you need to <strong>{form.email}</strong> before the day.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                            <a
                                href={googleCalendarUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 border border-slate-200 hover:border-rr-pink text-rr-dark text-xs font-bold uppercase tracking-widest rounded-full px-5 py-3 transition-colors"
                            >
                                <svg className="w-4 h-4 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Add to Google Calendar
                            </a>
                            <a
                                href={icsHref}
                                download="royals-afternoon-for-coaches.ics"
                                className="inline-flex items-center gap-2 border border-slate-200 hover:border-rr-pink text-rr-dark text-xs font-bold uppercase tracking-widest rounded-full px-5 py-3 transition-colors"
                            >
                                <svg className="w-4 h-4 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Apple / Outlook (.ics)
                            </a>
                        </div>
                        <p className="text-rr-charcoal/70 text-sm font-medium">
                            Anything in the meantime, email{' '}
                            <a href="mailto:coaches@rramelbourne.com" className="text-rr-pink hover:underline font-bold">
                                coaches@rramelbourne.com
                            </a>
                        </p>
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
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Free · Sunday 26 July</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-4"
                    >
                        Register Your <span className="text-rr-pink">Spot</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-white/70 font-medium"
                    >
                        Tell us a little about yourself and your coaching. It helps us shape the afternoon around the people in the room.
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

                        {/* About you */}
                        <div className="mb-8">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">
                                About You
                            </h3>
                            <div className="space-y-5">
                                <div>
                                    <label className={labelClass}>Your Name *</label>
                                    <input name="coach_name" value={form.coach_name} onChange={handleChange} className={inputClass('coach_name')} placeholder="e.g. Alex Lewis" />
                                    {errors.coach_name && <p className="text-red-500 text-xs font-medium mt-1">{errors.coach_name}</p>}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Email *</label>
                                        <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass('email')} placeholder="e.g. you@email.com" />
                                        {errors.email && <p className="text-red-500 text-xs font-medium mt-1">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>Mobile</label>
                                        <input name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClass('phone')} placeholder="e.g. 0412 345 678" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Your coaching */}
                        <div className="mb-8">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">
                                Your Coaching
                            </h3>
                            <div className="space-y-5">
                                <div>
                                    <label className={labelClass}>Do You Coach Juniors Or Seniors?</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {COACH_LEVELS.map((opt) => (
                                            <button
                                                type="button"
                                                key={opt}
                                                onClick={() => setCoachLevel(coachLevel === opt ? '' : opt)}
                                                className={`rounded-xl border px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors duration-200 ${coachLevel === opt ? 'bg-rr-pink border-rr-pink text-white' : 'bg-slate-50 border-slate-200 text-rr-charcoal hover:border-rr-pink'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Club &amp; Teams</label>
                                    <input name="club_teams" value={form.club_teams} onChange={handleChange} className={inputClass('club_teams')} placeholder="e.g. Craigieburn CC, U14s and 2nd XI" />
                                </div>
                            </div>
                        </div>

                        {/* Your cricket */}
                        <div className="mb-8">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">
                                Your Cricket
                            </h3>
                            <div className="space-y-5">
                                <div>
                                    <label className={labelClass}>Highest Level You&rsquo;ve Played</label>
                                    <select name="highest_level" value={form.highest_level} onChange={handleChange} className={inputClass('highest_level')}>
                                        <option value="">Select the closest fit</option>
                                        {LEVEL_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>A Bit About Your Cricket Background</label>
                                    <textarea name="playing_history" value={form.playing_history} onChange={handleChange} rows={2} className={inputClass('playing_history')} placeholder="Where you played, the clubs you turned out for, anything you are proud of." />
                                </div>
                            </div>
                        </div>

                        {/* In your words */}
                        <div className="mb-8">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">
                                In Your Words
                            </h3>
                            <div className="space-y-5">
                                <div>
                                    <label className={labelClass}>What Do You Love About Coaching?</label>
                                    <textarea name="love_coaching" value={form.love_coaching} onChange={handleChange} rows={2} className={inputClass('love_coaching')} placeholder="The bit that keeps you coming back." />
                                </div>
                                <div>
                                    <label className={labelClass}>What Do You Hope To Get Out Of The Day?</label>
                                    <textarea name="hope_to_learn" value={form.hope_to_learn} onChange={handleChange} rows={2} className={inputClass('hope_to_learn')} placeholder="Tell us what would make the afternoon worth your while." />
                                </div>
                            </div>
                        </div>

                        {/* Consent */}
                        <div className="mb-8 pt-6 border-t border-slate-100">
                            <ComplianceCheckbox checked={acceptTerms} onChange={setAcceptTerms} error={errors.acceptTerms}>
                                I&rsquo;m happy for the Rajasthan Royals Academy Melbourne to contact me about this event. See our{' '}
                                <a href="/terms-conditions" target="_blank" className="text-rr-pink hover:underline">Terms &amp; Conditions</a>{' '}
                                and{' '}
                                <a href="/privacy-policy" target="_blank" className="text-rr-pink hover:underline">Privacy Policy</a>.
                            </ComplianceCheckbox>
                        </div>

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
                                    Registering...
                                </>
                            ) : (
                                <>
                                    Register My Spot
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default CoachesDayForm;
