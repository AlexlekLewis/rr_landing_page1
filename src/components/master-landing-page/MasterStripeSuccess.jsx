import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Footer from '../Footer';

/* ───── Session options (matches LP3) ───── */
const SESSION_OPTIONS = {
    weekday: {
        Tuesday: [
            { id: 'wd_tue_5pm', time: '5:00 - 7:00pm', days: 'Tuesday', dayGroup: 'Weekday' },
            { id: 'wd_tue_7pm', time: '7:00 - 9:00pm', days: 'Tuesday', dayGroup: 'Weekday' }
        ],
        Thursday: [
            { id: 'wd_thu_5pm', time: '5:00 - 7:00pm', days: 'Thursday', dayGroup: 'Weekday' },
            { id: 'wd_thu_7pm', time: '7:00 - 9:00pm', days: 'Thursday', dayGroup: 'Weekday' }
        ]
    },
    weekend: {
        Saturday: [
            { id: 'we_sat_8am', time: '8:00 - 10:00am', days: 'Saturday', dayGroup: 'Weekend' },
            { id: 'we_sat_2pm', time: '2:00 - 4:00pm', days: 'Saturday', dayGroup: 'Weekend' },
            { id: 'we_sat_4pm', time: '4:00 - 6:00pm', days: 'Saturday', dayGroup: 'Weekend' }
        ],
        Sunday: [
            { id: 'we_sun_8am', time: '8:00 - 10:00am', days: 'Sunday', dayGroup: 'Weekend' },
            { id: 'we_sun_2pm', time: '2:00 - 4:00pm', days: 'Sunday', dayGroup: 'Weekend' },
            { id: 'we_sun_4pm', time: '4:00 - 6:00pm', days: 'Sunday', dayGroup: 'Weekend' }
        ]
    }
};

/* ───── Shared sub-components ───── */
const SessionCheckbox = ({ time, checked, onChange }) => (
    <label className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all w-full bg-white ${checked ? 'border-rr-pink shadow-md shadow-rr-pink/10 scale-[1.02]' : 'border-slate-200 hover:border-slate-300 shadow-sm'}`}>
        <span className={`font-bold text-lg md:text-xl ${checked ? 'text-rr-dark' : 'text-slate-600'}`}>{time}</span>
        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? 'border-rr-pink bg-rr-pink text-white' : 'border-slate-300 bg-slate-50'}`}>
            {checked && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
        </div>
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
    </label>
);

const ComplianceCheckbox = ({ checked, onChange, children }) => (
    <label className="flex items-start gap-3 cursor-pointer group py-2">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
        <div className={`w-6 h-6 border-2 rounded transition-all flex items-center justify-center shadow-sm shrink-0 mt-0.5 ${checked ? 'bg-rr-pink border-rr-pink' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
            {checked && <span className="text-xs text-white font-bold">✓</span>}
        </div>
        <span className="text-sm text-slate-600 leading-relaxed">{children}</span>
    </label>
);

/* ═══════════════════════════════════════════════════════════
   MASTER STRIPE SUCCESS — ONBOARDING FORM
   ═══════════════════════════════════════════════════════════ */
const MasterStripeSuccess = () => {
    const navigate = useNavigate();
    const [paymentStatus, setPaymentStatus] = useState('processing');

    /* ── Payment confirmation (same logic as LP3 StripeSuccess) ── */
    useEffect(() => {
        const confirmPayment = async () => {
            try {
                const registrationId = localStorage.getItem('pending_registration_id');
                if (!registrationId) {
                    // No pending ID — they may have come here directly or it was already processed
                    setPaymentStatus('ready');
                    return;
                }
                const { error } = await supabase
                    .from('official_cohort_2026')
                    .update({ payment_status: 'completed' })
                    .eq('id', registrationId);

                if (error) throw error;

                setPaymentStatus('ready');
                localStorage.removeItem('pending_registration_id');
            } catch (err) {
                console.error('Error confirming payment:', err);
                setPaymentStatus('ready'); // Still show the form even if status update fails
            }
        };
        confirmPayment();
    }, []);

    /* ── Onboarding form state (mirrors LP3 AcceptanceForm) ── */
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);

    // Core details
    const [playerName, setPlayerName] = useState('');
    const [parentName, setParentName] = useState('');
    const [email, setEmail] = useState('');

    // Administration fields
    const [gender, setGender] = useState('');
    const [suburb, setSuburb] = useState('');
    const [shirtName, setShirtName] = useState('');
    const [sizeTshirt, setSizeTshirt] = useState('');
    const [sizeShort, setSizeShort] = useState('');
    const [sizePants, setSizePants] = useState('');

    // Comms fields
    const [groupChatConsent, setGroupChatConsent] = useState(null);
    const [phoneNumbers, setPhoneNumbers] = useState([{ id: 1, value: '' }]);
    const [preferredComms, setPreferredComms] = useState('');

    // Session Availability
    const [selectedSessions, setSelectedSessions] = useState([]);
    const toggleSession = (id) => {
        setSelectedSessions(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    // Consents
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptPlayerCode, setAcceptPlayerCode] = useState(false);
    const [acceptParentCode, setAcceptParentCode] = useState(false);
    const [acceptSocialMedia, setAcceptSocialMedia] = useState(false);

    const addPhoneNumber = () => {
        setPhoneNumbers([...phoneNumbers, { id: Date.now(), value: '' }]);
    };

    const updatePhoneNumber = (id, value) => {
        setPhoneNumbers(phoneNumbers.map(p => p.id === id ? { ...p, value } : p));
    };

    /* ── Validation ── */
    const isFormValid = () => {
        const hasCore = playerName.trim() && parentName.trim() && email.trim() && email.includes('@');
        const hasAdmin = gender && suburb.trim() && shirtName.trim() && sizeTshirt && sizeShort && sizePants;
        const hasComms = groupChatConsent === true ? phoneNumbers.some(p => p.value.trim()) : (groupChatConsent === false ? preferredComms.trim() : false);
        const hasConsents = acceptTerms && acceptPlayerCode && acceptParentCode && acceptSocialMedia;

        const hasMinTotal = selectedSessions.length >= 3;
        const hasWeekday = selectedSessions.some(id => id.startsWith('wd'));
        const hasWeekend = selectedSessions.some(id => id.startsWith('we'));
        const hasValidSessions = hasMinTotal && hasWeekday && hasWeekend;

        return hasCore && hasAdmin && hasComms && hasConsents && hasValidSessions;
    };

    /* ── Submit ── */
    const handleSubmit = async () => {
        if (!isFormValid()) {
            setSubmitError('Please complete all required fields, select at least 3 session options (with min 1 weekday and 1 weekend), and accept all compliance documents.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            const validPhones = phoneNumbers.filter(p => p.value.trim()).map(p => p.value.trim());
            const generatedId = crypto.randomUUID();

            const payload = {
                id: generatedId,
                accepted_offer: true,
                player_name: playerName.trim(),
                parent_name: parentName.trim(),
                email: email.trim().toLowerCase(),
                phone: validPhones[0] || '',
                gender: gender,
                suburb: suburb.trim(),
                shirt_name: shirtName.trim(),
                size_tshirt: sizeTshirt,
                size_short: sizeShort,
                size_pants: sizePants,
                player_role: '',
                selected_sessions: selectedSessions.map(id => {
                    const allOpts = [
                        ...SESSION_OPTIONS.weekday.Tuesday,
                        ...SESSION_OPTIONS.weekday.Thursday,
                        ...SESSION_OPTIONS.weekend.Saturday,
                        ...SESSION_OPTIONS.weekend.Sunday
                    ];
                    const opt = allOpts.find(o => o.id === id);
                    return opt ? `[${opt.dayGroup}] ${opt.days}: ${opt.time}` : id;
                }).join(' | '),
                group_chat_consent: groupChatConsent,
                phone_numbers: validPhones,
                preferred_comms: preferredComms,
                payment_plan_selected: 'master_lp_purchase',
                payment_status: 'completed',
                source: 'master_landing_page',
                created_at_melb: new Date().toLocaleString('en-AU', {
                    timeZone: 'Australia/Melbourne',
                    hour12: true,
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })
            };

            const { error } = await supabase.from('official_cohort_2026').insert(payload);
            if (error) throw error;

            // Fire Zapier webhook if configured
            const webhookUrl = import.meta.env.VITE_LP3_WEBHOOK_URL;
            if (webhookUrl) {
                const formData = new URLSearchParams();
                Object.entries(payload).forEach(([key, value]) => {
                    formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value ?? ''));
                });
                fetch(webhookUrl, { method: 'POST', body: formData }).catch(() => {});
            }

            setFormSubmitted(true);
        } catch (err) {
            console.error('Onboarding submission error:', err);
            setSubmitError('Something went wrong. Please try again or contact us at eliteprogram@rramelbourne.com.');
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ── Navbar ── */
    const renderNav = () => (
        <nav className="fixed top-0 w-full z-50 bg-rr-dark/90 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-center">
                <img
                    src="/rra-white.png"
                    alt="Rajasthan Royals Academy"
                    className="h-12 w-auto object-contain cursor-pointer transition-transform hover:scale-105"
                    onClick={() => navigate('/')}
                />
            </div>
        </nav>
    );

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    /* ── Loading state ── */
    if (paymentStatus === 'processing') {
        return (
            <div className="min-h-screen bg-white">
                {renderNav()}
                <main className="pt-20 min-h-[80vh] flex flex-col items-center justify-center px-6">
                    <Loader2 className="w-16 h-16 text-rr-pink animate-spin mb-6" />
                    <h2 className="text-2xl font-black text-rr-dark uppercase tracking-wide mb-2">Confirming Payment...</h2>
                    <p className="text-slate-500 text-lg">Please wait while we finalise your registration.</p>
                </main>
                <Footer />
            </div>
        );
    }

    /* ── Form submitted success ── */
    if (formSubmitted) {
        return (
            <div className="min-h-screen bg-slate-50">
                {renderNav()}
                <main className="pt-32 pb-24 flex items-center justify-center px-6 min-h-[80vh]">
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center shadow-xl shadow-slate-200/50 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rr-pink to-rr-blue"></div>
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-rr-dark uppercase tracking-tight mb-4">Onboarding Complete!</h2>
                        <p className="text-lg text-slate-600 leading-relaxed mb-8 font-medium">
                            Your onboarding form has been submitted successfully. We now have everything we need to personalise your program from day one.
                        </p>
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-10 text-left">
                            <h4 className="font-bold text-rr-dark mb-2">What happens next?</h4>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                Keep an eye on your inbox. We will be in touch soon with full details concerning Onboarding Week (starting April 13th) and the delivery of your apparel pack.
                            </p>
                            <p className="text-rr-pink text-sm font-bold italic">
                                Note: If you paid in full today, your bonus training gear will be included in your apparel pack!
                            </p>
                        </div>
                        <button
                            onClick={() => window.location.href = 'https://rramelbourne.com'}
                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rr-pink to-rr-blue text-white font-bold uppercase tracking-wider px-12 py-4 rounded-xl hover:shadow-lg transition-shadow"
                        >
                            Return Home
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    /* ═══════ MAIN RENDER — ONBOARDING FORM ═══════ */
    return (
        <div className="min-h-screen bg-slate-50">
            {renderNav()}

            <main className="pt-28 pb-24 px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    className="max-w-4xl mx-auto space-y-12"
                >
                    {/* ── Congratulations Header ── */}
                    <div className="text-center mb-8 space-y-4">
                        <motion.div variants={fadeIn} className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </motion.div>
                        <motion.p variants={fadeIn} className="text-lg md:text-xl font-bold text-rr-pink uppercase tracking-widest">
                            Congratulations
                        </motion.p>
                        <motion.h1 variants={fadeIn} className="text-3xl md:text-5xl font-black text-rr-dark tracking-tight uppercase leading-tight">
                            You're a Rajasthan Royals<br />Melbourne Academy Player
                        </motion.h1>
                        <motion.div variants={fadeIn} className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full mt-4" />
                    </div>

                    {/* ── Form Title ── */}
                    <div className="text-center mb-4">
                        <motion.h2 variants={fadeIn} className="text-2xl md:text-4xl font-black text-rr-dark tracking-tight uppercase">
                            Rajasthan Royals Melbourne{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Onboarding Form</span>
                        </motion.h2>
                    </div>

                    {/* ── Form Card ── */}
                    <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 md:p-12">

                        {/* Error */}
                        <AnimatePresence>
                            {submitError && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
                                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium text-sm flex items-start gap-3">
                                        <span className="text-xl leading-none">⚠️</span>
                                        <p>{submitError}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* CORE DETAILS */}
                        <div className="space-y-6 mb-12">
                            <h3 className="text-xl font-bold text-rr-dark border-b border-slate-100 pb-2">Player & Guardian Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-rr-dark">Player Name *</label>
                                    <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-rr-dark">Parent / Guardian Name *</label>
                                    <input type="text" value={parentName} onChange={(e) => setParentName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-rr-dark">Contact Email *</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50" required />
                                </div>
                            </div>
                        </div>

                        {/* ADMIN DETAILS */}
                        <div className="space-y-6 mb-12">
                            <h3 className="text-xl font-bold text-rr-dark border-b border-slate-100 pb-2">Onboarding Information</h3>

                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-rr-dark">Do you play male or female cricket? *</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="gender" value="Male Cricket" checked={gender === 'Male Cricket'} onChange={(e) => setGender(e.target.value)} className="w-4 h-4 text-rr-pink accent-rr-pink" />
                                        <span>Male Cricket</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="gender" value="Female Cricket" checked={gender === 'Female Cricket'} onChange={(e) => setGender(e.target.value)} className="w-4 h-4 text-rr-pink accent-rr-pink" />
                                        <span>Female Cricket</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-2 max-w-md">
                                <label className="block text-sm font-bold text-rr-dark">What suburb or town will you primarily be travelling from? *</label>
                                <input type="text" value={suburb} onChange={(e) => setSuburb(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50" required />
                            </div>

                            <div className="space-y-2 max-w-md pt-4">
                                <label className="block text-sm font-bold text-rr-dark">We will be ordering apparel immediately. Please confirm the last name that will appear on your shirt. *</label>
                                <input type="text" value={shirtName} onChange={(e) => setShirtName(e.target.value)} placeholder="e.g. SMITH" className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 uppercase" required />
                            </div>

                            <div className="space-y-3 pt-4">
                                <label className="block text-sm font-bold text-rr-dark mb-1">Please confirm your sizes below: *</label>
                                <p className="text-sm font-medium text-slate-500 mb-3 bg-slate-100 p-3 rounded-xl border border-slate-200">
                                    <span className="text-rr-pink font-bold">Important:</span> All sizing is based on Men's fits.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <span className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-wider">T-Shirt Size</span>
                                        <select required value={sizeTshirt} onChange={(e) => setSizeTshirt(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:border-rr-pink focus:ring-1 focus:ring-rr-pink transition-all">
                                            <option value="">Select...</option>
                                            <option value="Mens Extra Extra Small (XXS)">Mens Extra Extra Small (XXS)</option>
                                            <option value="Mens Extra Small (XS)">Mens Extra Small (XS)</option>
                                            <option value="Mens Small (S)">Mens Small (S)</option>
                                            <option value="Mens Medium (M)">Mens Medium (M)</option>
                                            <option value="Mens Large (L)">Mens Large (L)</option>
                                            <option value="Mens Extra Large (XL)">Mens Extra Large (XL)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-wider">Short Size</span>
                                        <select required value={sizeShort} onChange={(e) => setSizeShort(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:border-rr-pink focus:ring-1 focus:ring-rr-pink transition-all">
                                            <option value="">Select...</option>
                                            <option value="Mens Extra Extra Small (XXS)">Mens Extra Extra Small (XXS)</option>
                                            <option value="Mens Extra Small (XS)">Mens Extra Small (XS)</option>
                                            <option value="Mens Small (S)">Mens Small (S)</option>
                                            <option value="Mens Medium (M)">Mens Medium (M)</option>
                                            <option value="Mens Large (L)">Mens Large (L)</option>
                                            <option value="Mens Extra Large (XL)">Mens Extra Large (XL)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-wider">Track Pants Size</span>
                                        <select required value={sizePants} onChange={(e) => setSizePants(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:border-rr-pink focus:ring-1 focus:ring-rr-pink transition-all">
                                            <option value="">Select...</option>
                                            <option value="Mens Extra Extra Small (XXS)">Mens Extra Extra Small (XXS)</option>
                                            <option value="Mens Extra Small (XS)">Mens Extra Small (XS)</option>
                                            <option value="Mens Small (S)">Mens Small (S)</option>
                                            <option value="Mens Medium (M)">Mens Medium (M)</option>
                                            <option value="Mens Large (L)">Mens Large (L)</option>
                                            <option value="Mens Extra Large (XL)">Mens Extra Large (XL)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SESSION AVAILABILITY */}
                        <div className="space-y-6 mb-12">
                            <h3 className="text-xl font-bold text-rr-dark border-b border-slate-100 pb-2">Session Availability</h3>
                            <div className="bg-rr-dark text-white rounded-2xl p-6 text-center mb-4">
                                <p className="text-sm font-medium leading-relaxed">
                                    Each player will be allocated <strong>one weekday session</strong> and <strong>one weekend session</strong> per week for the duration of the Elite Program.
                                    Please select <strong>at least 3 options</strong> below (minimum 1 weekday and 1 weekend) so we can allocate you the best possible schedule.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Weekday */}
                                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center">
                                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center mb-6">Weekday Session</h4>

                                    <h5 className="text-xl font-black text-rr-dark text-center mb-4 uppercase tracking-wide">Tuesday</h5>
                                    <div className="space-y-4 w-full mb-8">
                                        {SESSION_OPTIONS.weekday.Tuesday.map(session => (
                                            <SessionCheckbox key={session.id} time={session.time} checked={selectedSessions.includes(session.id)} onChange={() => toggleSession(session.id)} />
                                        ))}
                                    </div>

                                    <h5 className="text-xl font-black text-rr-dark text-center mb-4 uppercase tracking-wide">Thursday</h5>
                                    <div className="space-y-4 w-full">
                                        {SESSION_OPTIONS.weekday.Thursday.map(session => (
                                            <SessionCheckbox key={session.id} time={session.time} checked={selectedSessions.includes(session.id)} onChange={() => toggleSession(session.id)} />
                                        ))}
                                    </div>
                                    <div className="text-center mt-8 mb-2">
                                        <span className="text-xs font-bold text-slate-400 italic uppercase tracking-wider">Allocated one slot</span>
                                    </div>
                                </div>

                                {/* Weekend */}
                                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center">
                                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center mb-6">Weekend Session</h4>

                                    <h5 className="text-xl font-black text-rr-dark text-center mb-4 uppercase tracking-wide">Saturday</h5>
                                    <div className="space-y-4 w-full mb-8">
                                        {SESSION_OPTIONS.weekend.Saturday.map(session => (
                                            <SessionCheckbox key={session.id} time={session.time} checked={selectedSessions.includes(session.id)} onChange={() => toggleSession(session.id)} />
                                        ))}
                                    </div>

                                    <h5 className="text-xl font-black text-rr-dark text-center mb-4 uppercase tracking-wide">Sunday</h5>
                                    <div className="space-y-4 w-full">
                                        {SESSION_OPTIONS.weekend.Sunday.map(session => (
                                            <SessionCheckbox key={session.id} time={session.time} checked={selectedSessions.includes(session.id)} onChange={() => toggleSession(session.id)} />
                                        ))}
                                    </div>
                                    <div className="text-center mt-8 mb-2">
                                        <span className="text-xs font-bold text-slate-400 italic uppercase tracking-wider">Allocated one slot</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COMMS PREF */}
                        <div className="space-y-6 mb-12 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <label className="block text-sm font-bold text-rr-dark">Are you happy to be added to a group chat as we get closer to the start of the Elite Program for regular communication? *</label>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setGroupChatConsent(true)} className={`px-6 py-2 rounded-xl border font-bold ${groupChatConsent === true ? 'bg-rr-dark text-white border-rr-dark' : 'bg-white text-slate-600 border-slate-300'}`}>Yes</button>
                                <button type="button" onClick={() => setGroupChatConsent(false)} className={`px-6 py-2 rounded-xl border font-bold ${groupChatConsent === false ? 'bg-rr-dark text-white border-rr-dark' : 'bg-white text-slate-600 border-slate-300'}`}>No</button>
                            </div>

                            {groupChatConsent === true && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 mt-4 pt-4 border-t border-slate-200">
                                    <label className="text-sm text-slate-600 font-medium">Please provide the mobile numbers you would like added to the group chat (e.g. Player, Mother, Father)</label>
                                    {phoneNumbers.map((phone, index) => (
                                        <div key={phone.id} className="flex gap-2">
                                            <input type="tel" value={phone.value} onChange={(e) => updatePhoneNumber(phone.id, e.target.value)} placeholder={`Mobile Number ${index + 1}`} className="flex-1 border border-slate-200 rounded-xl px-4 py-3" />
                                        </div>
                                    ))}
                                    <button type="button" onClick={addPhoneNumber} className="text-sm text-rr-pink font-bold hover:underline">+ Add another number</button>
                                </motion.div>
                            )}

                            {groupChatConsent === false && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 mt-4 pt-4 border-t border-slate-200">
                                    <label className="text-sm text-slate-600 font-medium">Please let us know your preferred communication method:</label>
                                    <textarea value={preferredComms} onChange={(e) => setPreferredComms(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3" rows={3}></textarea>
                                </motion.div>
                            )}
                        </div>

                        {/* CONSENTS & COMPLIANCE */}
                        <div className="space-y-4 mb-12 border-t border-slate-100 pt-8">
                            <h3 className="text-xl font-bold text-rr-dark mb-4">Compliance & Policies</h3>

                            <ComplianceCheckbox checked={acceptTerms} onChange={setAcceptTerms}>
                                I have read and agree to the <a href="/terms-conditions" target="_blank" className="text-rr-pink hover:underline">Terms &amp; Conditions</a> and <a href="/privacy-policy" target="_blank" className="text-rr-pink hover:underline">Privacy Policy</a>. I confirm all information provided is accurate.
                            </ComplianceCheckbox>

                            <ComplianceCheckbox checked={acceptPlayerCode} onChange={setAcceptPlayerCode}>
                                I have read, understood, and agree to the <a href="/assets/RRA_Player_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">Player Code of Conduct</a>.
                            </ComplianceCheckbox>

                            <ComplianceCheckbox checked={acceptParentCode} onChange={setAcceptParentCode}>
                                I have read, understood, and agree to the <a href="/assets/RRA_Parent_Guardian_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">Parent/Guardian Code of Conduct</a>.
                            </ComplianceCheckbox>

                            <ComplianceCheckbox checked={acceptSocialMedia} onChange={setAcceptSocialMedia}>
                                I am happy for photos and videos from the program featuring the player to be used on Rajasthan Royals Academy Melbourne's social media and marketing channels.
                            </ComplianceCheckbox>
                        </div>

                        {/* SUBMIT */}
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid() || isSubmitting}
                            className={`w-full py-4 rounded-2xl font-black text-lg uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-3 ${isFormValid() && !isSubmitting
                                ? 'bg-gradient-to-r from-rr-pink to-rr-blue text-white hover:shadow-lg cursor-pointer'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Complete Onboarding'
                            )}
                        </button>
                        {!isFormValid() && (
                            <p className="text-center text-xs text-slate-400 mt-3">Please complete all required fields and accept all compliance documents.</p>
                        )}
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default MasterStripeSuccess;
