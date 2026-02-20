import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // Check if user is in dashboard_users table
            const { data: dashUser, error: dbError } = await supabase
                .from('dashboard_users')
                .select('*')
                .eq('email', email.toLowerCase())
                .eq('active', true)
                .single();

            if (dbError || !dashUser) {
                await supabase.auth.signOut();
                throw new Error('Access denied. You do not have dashboard permissions.');
            }

            navigate('/rramadmin_26/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-rr-dark flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background gradient orbs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-rr-pink/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-rr-blue/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-rr-pink to-rr-blue mb-6 shadow-lg shadow-rr-pink/20">
                        <Lock className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-wider">ADMIN PORTAL</h1>
                    <p className="text-slate-400 mt-2 text-sm font-medium">Rajasthan Royals Academy Melbourne</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
                        >
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-red-300 text-sm">{error}</p>
                        </motion.div>
                    )}

                    <div className="mb-5">
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="alex.lewis@rramelbourne.com"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-rr-pink focus:ring-2 focus:ring-rr-pink/20 transition-all text-sm"
                        />
                    </div>

                    <div className="mb-8">
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-rr-pink focus:ring-2 focus:ring-rr-pink/20 transition-all text-sm pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-rr-pink to-rr-blue text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-sm transition-all hover:shadow-lg hover:shadow-rr-pink/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Authenticating...
                            </span>
                        ) : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-slate-600 text-xs mt-6">
                    Authorised access only
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
