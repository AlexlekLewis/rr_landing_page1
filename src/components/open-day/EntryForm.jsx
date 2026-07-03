import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

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
        <label
            onClick={(e) => { if (!e.target.closest('a')) onChange(!checked); }}
            className="flex items-start gap-3 cursor-pointer group"
        >
            <div
                className={`mt-0.5 w-6 h-6 rounded shrink-0 border-2 flex items-center justify-center transition-all duration-200 ${checked ? 'bg-rr-pink border-rr-pink' : 'border-slate-300 bg-white group-hover:border-rr-pink'}`}
            >
                {checked && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
            <span className="text-rr-charcoal text-sm font-medium leading-relaxed">{children}</span>
        </label>
        {error && <p className="text-red-500 text-xs font-medium mt-1 ml-9">{error}</p>}
    </div>
);

const emptyForm = { player_name: '', player_age: '', parent_name: '', parent_email: '', parent_phone: '' };

const EntryForm = ({ config }) => {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState(emptyForm);
    const [attending, setAttending] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptSocialMedia, setAcceptSocialMedia] = useState(false);
    const [acceptLiability, setAcceptLiability] = useState(false);

    // Age-driven program routing: under 11s automatically register for Junior
    // Royals; 11+ choose Junior Royals or Elite. Everyone still registers.
    const ageNum = parseInt(form.player_age, 10);
    const hasAge = Number.isInteger(ageNum) && ageNum >= 1 && ageNum <= 99;
    const under11 = hasAge && ageNum < 11;
    const program = under11 ? 'junior' : attending;

    const resetAll = () => {
        setForm(emptyForm);
        setAttending('');
        setAcceptTerms(false);
        setAcceptSocialMedia(false);
        setAcceptLiability(false);
        setErrors({});
        setSubmitted(false);
    };

    const validate = () => {
        const e = {};
        if (!form.player_name.trim()) e.player_name = 'Name is required.';
        const ageNum = parseInt(form.player_age, 10);
        if (!form.player_age.trim()) e.player_age = 'Age is required.';
        else if (Number.isNaN(ageNum) || ageNum < 1 || ageNum > 99) e.player_age = 'Enter a valid age.';
        if (!form.parent_name.trim()) e.parent_name = 'Parent/guardian name is required.';
        if (!form.parent_email.trim() || !/\S+@\S+\.\S+/.test(form.parent_email)) e.parent_email = 'Valid email is required.';
        if (!form.parent_phone.trim()) e.parent_phone = 'Mobile number is required.';
        if (!under11 && !attending) e.attending = 'Please choose one.';
        if (!acceptTerms) e.acceptTerms = 'Required to enter.';
        if (!acceptSocialMedia) e.acceptSocialMedia = 'Required to enter.';
        if (!acceptLiability) e.acceptLiability = 'Required to enter.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            const utm = getUTMParams();
            const ageNum = parseInt(form.player_age, 10);
            const { error: insertError } = await supabase
                .from(config.table)
                .insert([{
                    player_name: form.player_name.trim(),
                    player_age: Number.isNaN(ageNum) ? null : ageNum,
                    parent_name: form.parent_name.trim(),
                    parent_email: form.parent_email.trim(),
                    parent_phone: form.parent_phone.trim(),
                    attending: program,
                    session: null,
                    accept_terms: acceptTerms,
                    accept_social_media: acceptSocialMedia,
                    accept_liability: acceptLiability,
                    source: config.sourceTag,
                    page_referrer: document.referrer || null,
                    ...utm,
                }]);
            if (insertError) throw insertError;
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error(`${config.slug} entry check-in error:`, err);
            setErrors({ form: 'Something went wrong. Please try again, or ask a coach for help.' });
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass = (field) =>
        `w-full bg-slate-50 border ${errors[field] ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3.5 text-rr-dark font-medium focus:outline-none focus:border-rr-pink transition-colors duration-200 text-base`;
    const labelClass = 'block text-xs font-black text-rr-dark uppercase tracking-widest mb-2';

    if (submitted) {
        const firstName = (form.player_name || '').trim().split(' ')[0] || 'You';
        return (
            <div className="bg-white rounded-2xl p-8 md:p-10 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rr-pink/10 flex items-center justify-center">
                    <svg className="w-10 h-10 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-rr-dark uppercase tracking-tight mb-3">You're checked in{firstName !== 'You' ? `, ${firstName}` : ''}!</h2>
                <p className="text-rr-charcoal font-medium max-w-md mx-auto mb-8">
                    Welcome to {config.centreName}. Head over to the coaches when you're ready — enjoy your day with the Royals.
                </p>
                <button
                    onClick={resetAll}
                    className="inline-flex items-center gap-2 bg-rr-dark hover:bg-black text-white font-black uppercase tracking-widest text-sm px-8 py-4 rounded-full transition-colors"
                >
                    Check in another person
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 md:p-10">
            <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-5">
                    <div>
                        <label className={labelClass}>Player / Attendee Full Name *</label>
                        <input name="player_name" value={form.player_name} onChange={handleChange} className={inputClass('player_name')} placeholder="e.g. Sam Smith" autoComplete="name" />
                        {errors.player_name && <p className="text-red-500 text-xs font-medium mt-1">{errors.player_name}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Age *</label>
                        <input name="player_age" value={form.player_age} onChange={handleChange} className={inputClass('player_age')} placeholder="e.g. 13" inputMode="numeric" maxLength={2} />
                        {errors.player_age && <p className="text-red-500 text-xs font-medium mt-1">{errors.player_age}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Parent / Guardian Name *</label>
                        <input name="parent_name" value={form.parent_name} onChange={handleChange} className={inputClass('parent_name')} placeholder="e.g. Jane Smith" autoComplete="name" />
                        <p className="text-rr-charcoal/50 text-xs font-medium mt-1">If the attendee is 18+, enter their own name.</p>
                        {errors.parent_name && <p className="text-red-500 text-xs font-medium mt-1">{errors.parent_name}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>Email *</label>
                            <input name="parent_email" type="email" value={form.parent_email} onChange={handleChange} className={inputClass('parent_email')} placeholder="jane@email.com" autoComplete="email" />
                            {errors.parent_email && <p className="text-red-500 text-xs font-medium mt-1">{errors.parent_email}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Mobile *</label>
                            <input name="parent_phone" type="tel" value={form.parent_phone} onChange={handleChange} className={inputClass('parent_phone')} placeholder="0412 345 678" autoComplete="tel" />
                            {errors.parent_phone && <p className="text-red-500 text-xs font-medium mt-1">{errors.parent_phone}</p>}
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Which program? *</label>
                        {under11 ? (
                            <div className="rounded-xl border-2 border-[#1226AA]/30 bg-[#1226AA]/5 px-4 py-4">
                                <p className="text-sm font-black uppercase tracking-tight text-[#1226AA]">Junior Royals 🎉</p>
                                <p className="text-[13px] font-semibold text-rr-charcoal/70 mt-1">Under 11s register as Junior Royals — you're all set. Just finish your details below.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-2.5">
                                    {[{ value: 'junior', label: 'Junior Royals', hint: 'Come & play' }, { value: 'elite', label: 'Elite', hint: 'Trial · ages 11+' }].map((opt) => {
                                        const active = attending === opt.value;
                                        return (
                                            <button
                                                type="button"
                                                key={opt.value}
                                                onClick={() => { setAttending(opt.value); if (errors.attending) setErrors((p) => ({ ...p, attending: undefined })); }}
                                                className={`rounded-xl border-2 px-2 py-3 text-center transition-all duration-150 ${active ? 'border-rr-pink bg-rr-pink/5' : 'border-slate-200 bg-white hover:border-rr-pink/50'}`}
                                            >
                                                <span className={`block text-sm font-black uppercase tracking-tight leading-tight ${active ? 'text-rr-pink' : 'text-rr-dark'}`}>{opt.label}</span>
                                                <span className="block text-[11px] font-semibold text-rr-charcoal/60 mt-0.5">{opt.hint}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {!hasAge && <p className="text-rr-charcoal/50 text-xs font-medium mt-1.5">Enter an age above — under 11s are automatically Junior Royals.</p>}
                                {errors.attending && <p className="text-red-500 text-xs font-medium mt-1">{errors.attending}</p>}
                            </>
                        )}
                    </div>
                </div>

                {/* Compliances */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                    <h3 className="text-sm font-black text-rr-dark uppercase tracking-widest mb-5">Entry Conditions — all required</h3>
                    <ComplianceCheckbox checked={acceptTerms} onChange={setAcceptTerms} error={errors.acceptTerms}>
                        I have read and agree to the{' '}
                        <a href="/terms-conditions" target="_blank" className="text-rr-pink hover:underline">Terms &amp; Conditions</a>{' '}and{' '}
                        <a href="/privacy-policy" target="_blank" className="text-rr-pink hover:underline">Privacy Policy</a>.
                    </ComplianceCheckbox>
                    <ComplianceCheckbox checked={acceptSocialMedia} onChange={setAcceptSocialMedia} error={errors.acceptSocialMedia}>
                        I consent to photos/videos featuring the attendee being used on Rajasthan Royals Academy Melbourne's social media and marketing channels.
                    </ComplianceCheckbox>
                    <ComplianceCheckbox checked={acceptLiability} onChange={setAcceptLiability} error={errors.acceptLiability}>
                        I acknowledge that cricket activities carry inherent risks. I accept responsibility for the attendee's participation and release Rajasthan Royals Academy Melbourne and its staff from liability for injury, loss or damage, except to the extent caused by their negligence, and I consent to first aid or emergency treatment if required.
                    </ComplianceCheckbox>
                </div>

                {errors.form && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-2 mb-4">
                        <p className="text-red-600 text-sm font-medium">{errors.form}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="mt-6 w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center justify-center gap-3 text-base"
                >
                    {submitting ? (
                        <>
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Checking in…
                        </>
                    ) : (
                        <>
                            Register for Entry
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default EntryForm;
