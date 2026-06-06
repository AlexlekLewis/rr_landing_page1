import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import Footer from '../Footer';
import ITHeader from './ITHeader';
import ITHero from './ITHero';
import ITAbout from './ITAbout';
import ITCoaching from './ITCoaching';
import ITAspiration from './ITAspiration';
import ITForm from './ITForm';
import ITInviteGate from './ITInviteGate';

const getRefFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return (params.get('ref') || params.get('code') || '').trim();
};

const IndiaTour2026 = () => {
    usePageAnalytics('/india-tour-2026', { sections: ['hero', 'about', 'coaching', 'aspiration', 'register'] });

    // 'checking' | 'granted' | 'denied'
    const [access, setAccess] = useState('checking');
    const [referral, setReferral] = useState({ code: '', name: '' });
    const [checking, setChecking] = useState(false);

    // Keep this page out of search engines — it is invite-only.
    useEffect(() => {
        document.title = 'India Tour 2026 | Rajasthan Royals Academy Melbourne';
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex, nofollow';
        document.head.appendChild(meta);
        window.scrollTo(0, 0);
        return () => { document.head.removeChild(meta); };
    }, []);

    const checkCode = useCallback(async (rawCode) => {
        const code = (rawCode || '').trim();
        if (!code) { setAccess('denied'); return false; }
        setChecking(true);
        try {
            const { data, error } = await supabase.rpc('validate_india_tour_referral', { p_code: code });
            const row = Array.isArray(data) ? data[0] : data;
            if (!error && row && row.valid) {
                setReferral({ code, name: row.member_name || '' });
                setAccess('granted');
                window.scrollTo(0, 0);
                return true;
            }
            setAccess('denied');
            return false;
        } catch (_) {
            setAccess('denied');
            return false;
        } finally {
            setChecking(false);
        }
    }, []);

    useEffect(() => {
        checkCode(getRefFromUrl());
    }, [checkCode]);

    // Try a code entered manually on the gate screen; reflect it in the URL.
    const handleTryCode = async (code) => {
        const ok = await checkCode(code);
        if (ok) {
            const url = new URL(window.location.href);
            url.searchParams.set('ref', code.trim());
            window.history.replaceState({}, '', url);
        }
        return ok;
    };

    if (access === 'checking') {
        return (
            <div className="min-h-screen bg-rr-dark flex items-center justify-center">
                <svg className="animate-spin w-8 h-8 text-rr-pink" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
            </div>
        );
    }

    if (access === 'denied') {
        return <ITInviteGate onTryCode={handleTryCode} checking={checking} />;
    }

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <ITHeader />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero"><ITHero referralName={referral.name} /></div>
                <div id="about"><ITAbout /></div>
                <div id="coaching"><ITCoaching /></div>
                <div id="aspiration"><ITAspiration /></div>
                <div id="register"><ITForm referralCode={referral.code} referralName={referral.name} /></div>
            </main>
            <Footer />
        </div>
    );
};

export default IndiaTour2026;
