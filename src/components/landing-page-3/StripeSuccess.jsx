import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../Button';
import Footer from '../Footer';

const StripeSuccess = () => {
    const [status, setStatus] = useState('processing');
    const navigate = useNavigate();

    useEffect(() => {
        const confirmPayment = async () => {
            try {
                // Get the pending registration ID from local storage
                const registrationId = localStorage.getItem('pending_registration_id');

                if (!registrationId) {
                    // No ID found, maybe they came here directly or already processed it
                    setStatus('not_found');
                    return;
                }

                // Update the payment_status in Supabase
                const { error } = await supabase
                    .from('official_cohort_2026')
                    .update({
                        payment_status: 'completed'
                    })
                    .eq('id', registrationId);

                if (error) throw error;

                // Mark as success and clean up local storage
                setStatus('success');
                localStorage.removeItem('pending_registration_id');

            } catch (err) {
                console.error('Error confirming payment:', err);
                setStatus('error');
            }
        };

        confirmPayment();
    }, []);

    // Minimal Navbar matches LP3 OfferResponsePage
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

    if (status === 'processing') {
        return (
            <div className="min-h-screen bg-white">
                {renderNav()}
                <main className="pt-20 min-h-[80vh] flex flex-col items-center justify-center px-6">
                    <Loader2 className="w-16 h-16 text-rr-pink animate-spin mb-6" />
                    <h2 className="text-2xl font-black text-rr-dark uppercase tracking-wide mb-2">Confirming Payment...</h2>
                    <p className="text-slate-500 text-lg">Please wait while we finalize your registration.</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-slate-50">
                {renderNav()}
                <main className="pt-32 pb-24 flex items-center justify-center px-6 min-h-[80vh]">
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center shadow-xl shadow-slate-200/50 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rr-pink to-rr-blue"></div>
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-rr-dark uppercase tracking-tight mb-4">Registration Complete!</h2>
                        <p className="text-lg text-slate-600 leading-relaxed mb-8 font-medium">
                            Your payment has been successfully processed and your place in the Elite Program is confirmed. We are thrilled to welcome you to the Rajasthan Royals Academy Melbourne.
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
                        <Button variant="primary" onClick={() => window.location.href = 'https://rramelbourne.com'} className="w-full sm:w-auto px-12 py-4">
                            Return Home
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // fallback for error or not_found
    return (
        <div className="min-h-screen bg-slate-50">
            {renderNav()}
            <main className="pt-32 pb-24 flex items-center justify-center px-6 min-h-[80vh]">
                <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center shadow-xl shadow-slate-200/50">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-rr-dark uppercase tracking-tight mb-4">Payment Status Unclear</h2>
                    <p className="text-lg text-slate-600 leading-relaxed mb-8">
                        {status === 'not_found'
                            ? "We couldn't locate your pending registration details. If you just completed your payment on Stripe, don't worry—your payment receipt is your confirmation."
                            : "There was an issue updating your registration status. If your payment went through on Stripe, you are secured."}
                    </p>
                    <p className="text-sm font-medium text-slate-500 bg-slate-100 p-4 rounded-xl border border-slate-200 mb-8">
                        If you have any concerns, please contact our team at <a href="mailto:info@rramelbourne.com" className="text-rr-pink hover:underline">info@rramelbourne.com</a> with your player name.
                    </p>
                    <Button variant="primary" onClick={() => window.location.href = 'https://rramelbourne.com'} className="w-full sm:w-auto px-12 py-4">
                        Return Home
                    </Button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default StripeSuccess;
