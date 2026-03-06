import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Footer from '../Footer';
import Navbar from '../Navbar';

/* --- Session options (matches LP3) --- */
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

/* --- Sub-components --- */
const SessionCheckbox = ({ time, checked, onChange }) => (
    <label className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all w-full bg-white ${checked ? 'border-rr-pink shadow-md shadow-rr-pink/10 scale-[1.02]' : 'border-slate-200 hover:border-slate-300 shadow-sm'}`}>
        <span className={`font-bold text-lg md:text-xl ${checked ? 'text-rr-dark' : 'text-slate-600'}`}>{time}</span>
        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? 'border-rr-pink bg-rr-pink text-white' : 'border-slate-300 bg-slate-50'}`}>
            {checked && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
        </div>
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
    </label>
);

const SIZE_OPTIONS = [
    'Mens Extra Extra Small (XXS)',
    'Mens Extra Small (XS)',
    'Mens Small (S)',
    'Mens Medium (M)',
    'Mens Large (L)',
    'Mens Extra Large (XL)',
];

/* ===================================================
   MASTER STRIPE SUCCESS + ONBOARDING FORM
   =================================================== */
const MasterStripeSuccess = () => {
    const [paymentStatus, setPaymentStatus] = useState('processing');
    const navigate = useNavigate();

    // Onboarding form state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [onboardingComplete, setOnboardingComplete] = useState(false);

    // Core details
    const [playerName, setPlayerName] = useState('');
    const [parentName, setParentName] = useState('');
    const [email, setEmail] = useState('');

    // Administration
    const [gender, setGender] = useState('');
    const [suburb, setSuburb] = useState('');
    const [shirtName, setShirtName] = useState('');
    const [sizeTshirt, setSizeTshirt] = useState('');
    const [sizeShort, setSizeShort] = useState('');
    const [sizePants, setSizePants] = useState('');

    // Comms
    const [groupChatConsent, setGroupChatConsent] = useState(null);
    const [phoneNumbers, setPhoneNumbers] = useState([{ id: 1, value: '' }]);
    const [preferredComms, setPreferredComms] = useState('');

    // Sessions
    const [selectedSessions, setSelectedSessions] = useState([]);

    const toggleSession = (id) => {
        setSelectedSessions(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };

    const addPhoneNumber = () => {
        setPhoneNumbers([...phoneNumbers, { id: Date.now(), value: '' }]);
    };

    const updatePhoneNumber = (id, value) => {
        setPhoneNumbers(phoneNumbers.map(p => p.id === id ? { ...p, value } : p));
    };

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    /* -- Payment confirmation (same logic as StripeSuccess) -- */
    useEffect(() => {
        // LP4 flow: application was already saved to 'applications' table before Stripe.
        // No pending_registration_id to confirm — just show the onboarding form.
        // Clean up the purchase_source flag if it hasn't been cleaned up yet.
        localStorage.removeItem('purchase_source');
        setPaymentStatus('success');
    }, []);

    /* -- Form validation -- */
    const isFormValid = () => {
        const hasCore = playerName.trim() && parentName.trim() && email.trim() && email.includes('@');
        const hasAdmin = gender && suburb.trim() && shirtName.trim() && sizeTshirt && sizeShort && sizePants;
        const hasComms = groupChatConsent === true ? phoneNumbers.some(p => p.value.trim()) : (groupChatConsent === false ? preferredComms.trim() : false);

        const hasMinTotal = selectedSessions.length >= 3;
        const hasWeekday = selectedSessions.some(id => id.startsWith('wd'));
        const hasWeekend = selectedSessions.some(id => id.startsWith('we'));
        const hasValidSessions = hasMinTotal && hasWeekday && hasWeekend;

        return hasCore && hasAdmin && hasComms && hasValidSessions;
    };

    /* -- Submit onboarding to official_cohort_2026 -- */
    const handleSubmitOnboarding = async () => {
        if (!isFormValid()) {
            setSubmitError('Please complete all required fields, select at least 3 session options (with min 1 weekday and 1 weekend).');
            document.getElementById('onboarding-form')?.scrollIntoView({ behavior: 'smooth' });
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
                created_at_melb: new Date().toLocaleString('en-AU', {
                    timeZone: 'Australia/Melbourne',
                    hour12: true,
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
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
                fetch(webhookUrl, { method: 'POST', body: formData }).catch(() => { });
            }

            setOnboardingComplete(true);
        } catch (err) {
            console.error('Error submitting onboarding:', err);
            setSubmitError('Something went wrong. Please try again or contact eliteprogram@rramelbourne.com');
        } finally {
            setIsSubmitting(false);
        }
    };



    /* ------ PROCESSING STATE ------ */
    if (paymentStatus === 'processing') {
        return (
            <div className="min-h-screen bg-white">
                <Navbar variant="lp3" />
                <main className="pt-20 min-h-[80vh] flex flex-col items-center justify-center px-6">
                    <Loader2 className="w-16 h-16 text-rr-pink animate-spin mb-6" />
                    <h2 className="text-2xl font-black text-rr-dark uppercase tracking-wide mb-2">Confirming Payment...</h2>
                    <p className="text-slate-500 text-lg">Please wait while we finalize your registration.</p>
                </main>
                <Footer />
            </div>
        );
    }

    /* ------ ONBOARDING COMPLETE STATE ------ */
    if (onboardingComplete) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar variant="lp3" />
                <main className="pt-32 pb-24 flex items-center justify-center px-6 min-h-[80vh]">
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center shadow-xl shadow-slate-200/50 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rr-pink to-rr-blue"></div>
                        <div className="w-24 h-24 bg-rr-pink/10 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle2 className="w-12 h-12 text-rr-pink" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-rr-dark uppercase tracking-tight mb-4">Onboarding Complete!</h2>
                        <p className="text-lg text-slate-600 leading-relaxed mb-8 font-medium">
                            Thank you for completing your onboarding. We have everything we need to personalise your program from day one. We are thrilled to welcome you to the Rajasthan Royals Academy Melbourne.
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
                            className="bg-gradient-to-r from-rr-pink to-rr-blue text-white font-black uppercase tracking-wider px-12 py-4 rounded-2xl hover:shadow-[0_0_32px_rgba(229,6,149,0.4)] transition-shadow"
                        >
                            Return Home
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    /* ------ ERROR / NOT FOUND - still show onboarding form ------ */
    const showPaymentWarning = paymentStatus === 'error' || paymentStatus === 'not_found';

    /* ------ MAIN: CONGRATULATIONS + ONBOARDING FORM ------ */
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar variant="lp3" />
            <main className="pt-28 pb-24 px-6">
                <div className="max-w-4xl mx-auto" id="onboarding-form">

                    {/* Payment warning if applicable */}
                    {showPaymentWarning && (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-amber-800 font-medium">
                                    {paymentStatus === 'not_found'
                                        ? "We couldn't locate your pending registration details. If you just completed your payment on Stripe, don't worry \u2014 your payment receipt is your confirmation."
                                        : "There was an issue updating your registration status. If your payment went through on Stripe, you are secured."}
                                </p>
                                <p className="text-xs text-amber-600 mt-2">
                                    If you have any concerns, contact <a href="mailto:eliteprogram@rramelbourne.com" className="text-rr-pink hover:underline font-bold">eliteprogram@rramelbourne.com</a>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* -- Congratulations Header -- */}
                    <motion.div initial="hidden" animate="visible" className="text-center mb-16 space-y-4">
                        <motion.div variants={fadeIn} className="w-24 h-24 bg-rr-pink/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-12 h-12 text-rr-pink" />
                        </motion.div>
                        <motion.p variants={fadeIn} className="text-lg md:text-xl font-bold text-rr-pink mb-2">
                            Congratulations, you're a Rajasthan Royals Melbourne Academy Player!
                        </motion.p>
                        <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-black text-rr-dark tracking-tight uppercase">
                            Rajasthan Royals Melbourne{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Onboarding Form</span>
                        </motion.h2>
                        <motion.div variants={fadeIn} className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full mt-4" />
                        <motion.p variants={fadeIn} className="text-slate-500 max-w-xl mx-auto leading-relaxed mt-4">
                            Please complete the form below so we can personalise your program and get you set up from day one.
                        </motion.p>
                    </motion.div>

                    {/* -- Form Card -- */}
                    <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 md:p-12">

                        {/* Error Message */}
                        <AnimatePresence>
                            {submitError && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
                                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium text-sm flex items-start gap-3">
                                        <span className="text-xl leading-none">{'\u26A0\uFE0F'}</span>
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

                        {/* ONBOARDING INFO */}
                        <div className="space-y-6 mb-12">
                            <h3 className="text-xl font-bold text-rr-dark border-b border-slate-100 pb-2">Onboarding Information</h3>

                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-rr-dark">Do you play male or female cricket? *</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="gender" required value="Male Cricket" onChange={(e) => setGender(e.target.value)} className="w-4 h-4 text-rr-pink" />
                                        <span>Male Cricket</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="gender" required value="Female Cricket" onChange={(e) => setGender(e.target.value)} className="w-4 h-4 text-rr-pink" />
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
                                            {SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-wider">Short Size</span>
                                        <select required value={sizeShort} onChange={(e) => setSizeShort(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:border-rr-pink focus:ring-1 focus:ring-rr-pink transition-all">
                                            <option value="">Select...</option>
                                            {SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-wider">Pants Size</span>
                                        <select required value={sizePants} onChange={(e) => setSizePants(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:border-rr-pink focus:ring-1 focus:ring-rr-pink transition-all">
                                            <option value="">Select...</option>
                                            {SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* KEY DATES */}
                        <div className="space-y-6 mb-12">
                            <h3 className="text-xl font-bold text-rr-dark border-b border-slate-100 pb-2">Program Start & Key Dates</h3>
                            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
                                <ul className="space-y-8">
                                    <li className="flex gap-5 items-start">
                                        <div className="w-12 h-12 rounded-full bg-rr-pink/10 flex items-center justify-center shrink-0 border border-rr-pink/20">
                                            <span className="text-rr-pink font-bold text-lg">1</span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-rr-dark mb-2">Week of April 13th: Onboarding Week</h4>
                                            <p className="text-slate-600 leading-relaxed text-md">
                                                This is when the program officially begins. Players will receive their uniform and attend online Zoom sessions with their squad coaches.<br />
                                                We will cover everything you need to know: how the program runs day-to-day, the process for entering the center, and general daily operations.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex gap-5 items-start">
                                        <div className="w-12 h-12 rounded-full bg-rr-blue/10 flex items-center justify-center shrink-0 border border-rr-blue/20">
                                            <span className="text-rr-blue font-bold text-lg">2</span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-rr-dark mb-2">Tuesday 21st April: First Indoor Skill Session</h4>
                                            <p className="text-slate-600 leading-relaxed text-md">
                                                This marks the first official indoor skill session of the 12-week block.
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* SESSION PREFERENCES */}
                        <div className="space-y-6 mb-12">
                            <h3 className="text-xl font-bold text-rr-dark border-b border-slate-100 pb-2">Session Preferences</h3>

                            <div className="bg-white/50 border border-slate-200 rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rr-pink to-rr-blue"></div>
                                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                                    Please select a minimum of <span className="font-bold text-rr-pink">3 preferred options</span> for your weekly sessions.
                                    You <span className="font-bold underline">must</span> select at least <span className="font-bold">1 weekday</span> and <span className="font-bold">1 weekend</span> slot.
                                    <br /><span className="block mt-2 text-xs italic text-slate-500">We appreciate how busy weeknights and weekends can be for players and their families. While we need 3 preferences to help us balance the squads, our team will do our absolute best to work with you and lock in the times that suit you most.</span>
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

                        {/* COMMS PREFERENCES */}
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

                        {/* SUBMIT */}
                        <button
                            onClick={handleSubmitOnboarding}
                            disabled={isSubmitting}
                            className="w-full py-5 rounded-2xl font-black text-lg uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-rr-pink to-rr-blue text-white hover:shadow-[0_0_32px_rgba(229,6,149,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                            ) : (
                                'Complete Onboarding'
                            )}
                        </button>

                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MasterStripeSuccess;
