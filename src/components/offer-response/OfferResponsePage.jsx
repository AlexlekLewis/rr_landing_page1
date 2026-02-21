import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { AlertCircle, Loader2 } from 'lucide-react';
import Footer from '../Footer';

// Sub-components to be built next
import InvitationHero from './InvitationHero';
import ExclusiveVideo from './ExclusiveVideo';
import ProgramDetails from './ProgramDetails';
import RSVPForm from './RSVPForm';
import ConfirmationScreen from './ConfirmationScreen';

const OfferResponsePage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tokenData, setTokenData] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submissionResult, setSubmissionResult] = useState(null);

    useEffect(() => {
        validateToken();
    }, [token]);

    const validateToken = async () => {
        // Developer preview bypass (only works on localhost/development)
        if (import.meta.env.DEV && token === 'preview') {
            setTokenData({
                id: 'preview-mode',
                applicant_name: 'Alex Lewis (Preview)',
                status: 'pending'
            });
            setLoading(false);
            return;
        }

        if (!token) {
            setError('Invalid invitation link.');
            setLoading(false);
            return;
        }

        try {
            const { data, error: fetchError } = await supabase
                .from('offer_tokens')
                .select('*')
                .eq('token', token)
                .single();

            if (fetchError || !data) {
                setError('We could not find this invitation. The link may be invalid.');
                return;
            }

            // Check expiry
            if (data.expires_at && new Date(data.expires_at) < new Date()) {
                setError('This invitation link has expired.');
                return;
            }

            // Check if already responded
            if (data.status !== 'pending') {
                setIsSubmitted(true);
                // We'll show the generic accepted/declined state based on status if we wanted, 
                // but for now setting isSubmitted true hides the form.
                setSubmissionResult(data.status); // e.g. 'attended', 'declined'
            }

            setTokenData(data);
        } catch (err) {
            console.error('Error validating token:', err);
            setError('An error occurred while loading your invitation.');
        } finally {
            setLoading(false);
        }
    };

    const handleRSVPSubmit = async (responseData) => {
        // This will be called by RSVPForm
        setIsSubmitted(true);
        setSubmissionResult(responseData.decision);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-rr-dark flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-rr-pink animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-rr-dark flex items-center justify-center p-6">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md w-full text-center">
                    <AlertCircle className="w-16 h-16 text-rr-pink mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-4">Invalid Link</h2>
                    <p className="text-slate-400 font-medium mb-8">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gradient-to-r from-rr-blue to-rr-pink text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-rr-pink/20 transition-all w-full"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Minimal Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-rr-dark/90 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-center">
                    <img
                        src="/rra-white.png"
                        alt="Rajasthan Royals Academy"
                        className="h-12 w-auto object-contain cursor-pointer transition-transform hover:scale-105"
                        onClick={() => window.open('https://rramelbourne.com', '_blank')}
                    />
                </div>
            </nav>

            {/* Main Content Flow */}
            <main className="pt-20">
                {!isSubmitted ? (
                    <>
                        <InvitationHero applicantName={tokenData.applicant_name} />
                        <ExclusiveVideo applicantName={tokenData.applicant_name} />
                        <ProgramDetails />
                        <RSVPForm tokenData={tokenData} onSubmitSuccess={handleRSVPSubmit} />
                    </>
                ) : (
                    <ConfirmationScreen decision={submissionResult} applicantName={tokenData.applicant_name} />
                )}
            </main>

            <Footer />
        </div>
    );
};

export default OfferResponsePage;
