import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

// Provided by CEO
const PAYMENT_LINK = 'https://buy.stripe.com/bJe14nbHP3ud91q8nN9Zm00';

const AcceptanceForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

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

    // Consents
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptPlayerCode, setAcceptPlayerCode] = useState(false);
    const [acceptParentCode, setAcceptParentCode] = useState(false);
    const [acceptSocialMedia, setAcceptSocialMedia] = useState(false);

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const isFormValid = () => {
        const hasCore = playerName.trim() && parentName.trim() && email.trim() && email.includes('@');
        const hasAdmin = gender && suburb.trim() && shirtName.trim() && sizeTshirt && sizeShort && sizePants;
        const hasComms = groupChatConsent === true ? phoneNumbers.some(p => p.value.trim()) : preferredComms.trim();
        const hasConsents = acceptTerms && acceptPlayerCode && acceptParentCode && acceptSocialMedia;

        return hasCore && hasAdmin && hasComms && hasConsents;
    };

    const addPhoneNumber = () => {
        setPhoneNumbers([...phoneNumbers, { id: Date.now(), value: '' }]);
    };

    const updatePhoneNumber = (id, value) => {
        setPhoneNumbers(phoneNumbers.map(p => p.id === id ? { ...p, value } : p));
    };

    const handlePaymentAction = async () => {
        if (!isFormValid()) {
            setSubmitError('Please complete all required fields and accept all compliance documents before proceeding.');
            // Scroll to top of form to see error
            document.getElementById('acceptance-form')?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            const validPhones = phoneNumbers.filter(p => p.value.trim()).map(p => p.value.trim());

            const payload = {
                accepted_offer: true,
                player_name: playerName.trim(),
                parent_name: parentName.trim(),
                email: email.trim().toLowerCase(),
                phone: validPhones[0] || '', // Keep primary phone for backward compatibility

                // New admin fields
                gender: gender,
                suburb: suburb.trim(),
                shirt_name: shirtName.trim(),
                size_tshirt: sizeTshirt,
                size_short: sizeShort,
                size_pants: sizePants,

                // Removed role field but setting it to empty to keep db compatibility if needed
                player_role: '',

                group_chat_consent: groupChatConsent,
                phone_numbers: validPhones,
                preferred_comms: preferredComms,

                payment_plan_selected: 'full_link_click',
                payment_status: 'pending'
            };

            // Insert into Supabase
            const { error } = await supabase.from('official_cohort_2026').insert(payload);
            if (error) throw error;

            // Fire Zapier webhook
            const webhookUrl = import.meta.env.VITE_LP3_WEBHOOK_URL;
            if (webhookUrl) {
                const formData = new URLSearchParams();
                Object.entries(payload).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
                    }
                });
                fetch(webhookUrl, { method: 'POST', body: formData }).catch(err => console.warn('Webhook warning:', err));
            }

            // Redirect to Stripe Payment Link
            window.location.href = PAYMENT_LINK;

        } catch (err) {
            console.error('Submission error:', err);
            setSubmitError('Something went wrong preparing your registration. Please try again or contact support.');
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-24 px-6 lg:px-8 relative z-10 bg-slate-50 border-t border-slate-200" id="acceptance-form">
            <motion.div initial="hidden" animate="visible" className="max-w-4xl mx-auto space-y-12">

                <div className="text-center mb-16 space-y-4">
                    <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-black text-rr-dark tracking-tight uppercase">
                        Elite Program <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Administration</span>
                    </motion.h2>
                    <motion.div variants={fadeIn} className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full mt-4" />
                </div>

                <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 md:p-12">
                    {/* Error Message */}
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
                                    <input type="radio" name="gender" value="Male Cricket" onChange={(e) => setGender(e.target.value)} className="w-4 h-4 text-rr-pink" />
                                    <span>Male Cricket</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="gender" value="Female Cricket" onChange={(e) => setGender(e.target.value)} className="w-4 h-4 text-rr-pink" />
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
                            <label className="block text-sm font-bold text-rr-dark mb-1">
                                Please confirm your sizes below: *
                            </label>
                            <p className="text-sm font-medium text-slate-500 mb-3 bg-slate-100 p-3 rounded-xl border border-slate-200">
                                <span className="text-rr-pink font-bold">Important:</span> All sizing is based on Men's fits. Please review the <a href="/assets/MENS SIZE CHART - EXPORT (2).pdf" target="_blank" className="text-rr-blue underline hover:text-rr-dark transition-colors font-bold">Apparel Size Chart</a> before selecting.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <span className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-wider">T-Shirt Size</span>
                                    <select value={sizeTshirt} onChange={(e) => setSizeTshirt(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:border-rr-pink focus:ring-1 focus:ring-rr-pink transition-all">
                                        <option value="">Select...</option>
                                        <optgroup label="Junior Sizes">
                                            <option value="Junior 18">Junior 18</option>
                                            <option value="Junior 20">Junior 20</option>
                                            <option value="Junior 22">Junior 22</option>
                                            <option value="Junior 24">Junior 24</option>
                                            <option value="Junior 26">Junior 26</option>
                                            <option value="Junior 28">Junior 28</option>
                                            <option value="Junior 30">Junior 30</option>
                                            <option value="Junior 32">Junior 32</option>
                                            <option value="Junior 34 (XXS)">Junior 34 (XXS)</option>
                                        </optgroup>
                                        <optgroup label="Senior Sizes">
                                            <option value="Senior XS (36)">Senior XS (36)</option>
                                            <option value="Senior S (38)">Senior S (38)</option>
                                            <option value="Senior M (40)">Senior M (40)</option>
                                            <option value="Senior L (42)">Senior L (42)</option>
                                            <option value="Senior XL (44)">Senior XL (44)</option>
                                            <option value="Senior 2XL (46)">Senior 2XL (46)</option>
                                            <option value="Senior 3XL (48)">Senior 3XL (48)</option>
                                            <option value="Senior 4XL (50)">Senior 4XL (50)</option>
                                            <option value="Senior 5XL (52)">Senior 5XL (52)</option>
                                        </optgroup>
                                    </select>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-wider">Short Size</span>
                                    <select value={sizeShort} onChange={(e) => setSizeShort(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:border-rr-pink focus:ring-1 focus:ring-rr-pink transition-all">
                                        <option value="">Select...</option>
                                        <optgroup label="Junior Sizes">
                                            <option value="Junior 8-10">Junior 8-10</option>
                                            <option value="Junior 12-14">Junior 12-14</option>
                                            <option value="Junior 15-16">Junior 15-16</option>
                                        </optgroup>
                                        <optgroup label="Senior Sizes">
                                            <option value="Senior S">Senior S</option>
                                            <option value="Senior M">Senior M</option>
                                            <option value="Senior L">Senior L</option>
                                            <option value="Senior XL">Senior XL</option>
                                            <option value="Senior 2XL">Senior 2XL</option>
                                        </optgroup>
                                    </select>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-wider">Pants Size</span>
                                    <select value={sizePants} onChange={(e) => setSizePants(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:border-rr-pink focus:ring-1 focus:ring-rr-pink transition-all">
                                        <option value="">Select...</option>
                                        <optgroup label="Junior Sizes">
                                            <option value="Junior 18">Junior 18</option>
                                            <option value="Junior 20">Junior 20</option>
                                            <option value="Junior 22">Junior 22</option>
                                            <option value="Junior 24">Junior 24</option>
                                            <option value="Junior 26">Junior 26</option>
                                            <option value="Junior 28">Junior 28</option>
                                        </optgroup>
                                        <optgroup label="Senior Sizes">
                                            <option value="Senior XS (28)">Senior XS (28)</option>
                                            <option value="Senior S (30)">Senior S (30)</option>
                                            <option value="Senior M (32)">Senior M (32)</option>
                                            <option value="Senior L (34)">Senior L (34)</option>
                                            <option value="Senior XL (36)">Senior XL (36)</option>
                                            <option value="Senior 2XL (38)">Senior 2XL (38)</option>
                                            <option value="Senior 3XL (40)">Senior 3XL (40)</option>
                                            <option value="Senior 4XL (42)">Senior 4XL (42)</option>
                                        </optgroup>
                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* COMMS PREF */}
                    <div className="space-y-6 mb-12 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <label className="block text-sm font-bold text-rr-dark">Are you happy to be added to a group chat as we get closer to the start of the Elite Program for regular communication? *</label>
                        <div className="flex gap-4">
                            <button onClick={() => setGroupChatConsent(true)} className={`px-6 py-2 rounded-xl border font-bold ${groupChatConsent === true ? 'bg-rr-dark text-white border-rr-dark' : 'bg-white text-slate-600 border-slate-300'}`}>Yes</button>
                            <button onClick={() => setGroupChatConsent(false)} className={`px-6 py-2 rounded-xl border font-bold ${groupChatConsent === false ? 'bg-rr-dark text-white border-rr-dark' : 'bg-white text-slate-600 border-slate-300'}`}>No</button>
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

                </div>

                {/* KUMAR VIDEO AND PAYMENT CTA */}
                <div className="bg-rr-dark text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden text-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-rr-pink/10 to-transparent"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h3 className="text-3xl font-black uppercase tracking-wide mb-6">An exciting time - Secure your place</h3>
                        <p className="text-lg text-slate-300 font-light mb-8">
                            We are delighted you will be joining the Elite Program, and our team are looking forward to working with you.
                            Our advice is embrace the experience and opportunity, as well as the Royals Way. Recently, when launching Melbourne's Rajasthan Royals Academy, Kumar Sangakkara advised players to be <span className="font-bold text-rr-pink">‘creative and curious’</span>:
                        </p>

                        <div className="mb-12">
                            <KumarVideoPlayer url="https://pudldzgmluwoocwxtzhw.supabase.co/storage/v1/object/public/Kumar%20Video%20Landing/Kumar%20Interview.mp4" />
                        </div>

                        <div className="pt-8 border-t border-white/10">
                            <h4 className="text-xl font-bold mb-4">Payment</h4>
                            <p className="text-slate-300 mb-8">
                                Payment is required to secure your place. Please find below the link to the payment page.
                            </p>

                            <div className="bg-white/10 p-6 rounded-2xl border border-white/20 mb-8 text-left">
                                <span className="inline-block px-3 py-1 bg-rr-pink text-white text-xs font-bold uppercase tracking-wider rounded-full mb-3">Bonus Offer</span>
                                <p className="text-sm font-medium">For those who pay in full and by card or Apple Pay, we will provide a 2nd training shirt and a pair of training pants, <span className="font-bold text-rr-pink">FREE OF CHARGE</span>. This is in addition to the apparel they will get as part of their investment and provided as standard.</p>
                            </div>

                            <button
                                type="button"
                                onClick={handlePaymentAction}
                                disabled={isSubmitting}
                                className={`w-full py-5 rounded-xl font-black tracking-wide text-lg text-white transition-all duration-300 uppercase ${isSubmitting ? 'bg-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-rr-pink to-rr-blue hover:shadow-xl hover:shadow-rr-pink/20 hover:scale-[1.02]'}`}
                            >
                                {isSubmitting ? 'Processing...' : 'Proceed to Checkout'}
                            </button>
                        </div>
                    </div>
                </div>

            </motion.div>
        </section>
    );
};

// Reusable compliance checkbox purely for visual consistency
const ComplianceCheckbox = ({ checked, onChange, children }) => (
    <div className="flex items-start gap-4 group">
        <label className="relative flex items-start mt-1 shrink-0 cursor-pointer">
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
            <div className={`w-6 h-6 border-2 rounded transition-all flex items-center justify-center shadow-sm ${checked ? 'bg-rr-pink border-rr-pink' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                {checked && <span className="text-xs text-white font-bold">✓</span>}
            </div>
        </label>
        <span className="text-sm text-slate-600 font-medium leading-relaxed">
            {React.Children.map(children, child => {
                if (React.isValidElement(child) && child.type === 'a') {
                    return React.cloneElement(child, {
                        ...child.props,
                        onClick: (e) => e.stopPropagation()
                    });
                }
                return child;
            })}
        </span>
    </div>
);

const KumarVideoPlayer = ({ url }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const handlePlay = () => {
        setIsPlaying(true);
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    return (
        <div className="w-full aspect-video rounded-2xl border border-white/20 shadow-2xl relative overflow-hidden bg-black group">
            <video ref={videoRef} src={url} className="absolute inset-0 w-full h-full object-cover" controls={isPlaying} playsInline poster="/assets/Kumar_Poster_Image.jpg" onEnded={() => setIsPlaying(false)} />
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center cursor-pointer z-10 bg-black/40 hover:bg-black/20 transition-all duration-300" onClick={handlePlay}>
                    <div className="w-16 h-16 bg-rr-pink/90 border border-white/30 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 shadow-lg transition-transform duration-300">
                        <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 ml-1"><polygon points="5,3 19,12 5,21" /></svg>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AcceptanceForm;
