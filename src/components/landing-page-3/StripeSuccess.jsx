import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Navbar from '../Navbar';

const StripeSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // All purchases now funnel through LP4 (Master Landing Page).
        // Stripe redirects here after payment — we always forward to the LP4 onboarding form.
        navigate('/eliteprogram2026/success', { replace: true });
    }, []);

    // Brief loading state while redirect fires
    return (
        <div className="min-h-screen bg-white">
            <Navbar variant="lp3" />
            <main className="pt-20 min-h-[80vh] flex flex-col items-center justify-center px-6">
                <Loader2 className="w-16 h-16 text-rr-pink animate-spin mb-6" />
                <h2 className="text-2xl font-black text-rr-dark uppercase tracking-wide mb-2">Confirming Payment...</h2>
                <p className="text-slate-500 text-lg">Redirecting you to complete your onboarding.</p>
            </main>
        </div>
    );
};

export default StripeSuccess;
