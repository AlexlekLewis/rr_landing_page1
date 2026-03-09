import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, X } from 'lucide-react';
import Button from './Button';
import { supabase } from '../lib/supabase';

const StatusModal = ({ type, isOpen, onClose }) => {
    const isSuccess = type === 'success';
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-white/90 backdrop-blur-md rounded-2xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="text-center w-full"
                    >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
                            {isSuccess ? (
                                <Check className="w-8 h-8 text-green-600" />
                            ) : (
                                <AlertCircle className="w-8 h-8 text-red-600" />
                            )}
                        </div>
                        <h3 className="text-2xl font-black text-rr-dark mb-2">
                            {isSuccess ? 'RECEIVED!' : 'OOPS!'}
                        </h3>
                        <p className="text-slate-600 mb-6 text-sm px-4">
                            {isSuccess
                                ? "Thank you for registering your interest. We'll be in touch."
                                : "Something went wrong submitting your details. Please try again."}
                        </p>
                        <Button onClick={onClose} className="w-3/4 text-sm py-3">
                            {isSuccess ? 'AWESOME' : 'TRY AGAIN'}
                        </Button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const InputField = ({ label, type = "text", placeholder, name, value, onChange, required = false }) => (
    <div className="mb-4">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
            {label} {required && <span className="text-rr-pink">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rr-pink focus:ring-2 focus:ring-rr-pink/20 transition-all text-rr-dark placeholder-slate-400"
        />
    </div>
);

const LeadModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        suburb: '',
        clubs: '',
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success', 'error', null

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const { error: insertError } = await supabase
                .from('applications')
                .insert([{
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    age: formData.age ? parseInt(formData.age) : null,
                    suburb: formData.suburb,
                    club: formData.clubs,
                    bio: `Gender: ${formData.gender} (Lead from Splash Page)`,
                    source: 'splash_page'
                }]);

            if (insertError) throw insertError;

            setStatus('success');
            setFormData({
                firstName: '',
                lastName: '',
                age: '',
                gender: '',
                suburb: '',
                clubs: ''
            });

        } catch (error) {
            console.error('Error submitting application:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
                            <div>
                                <h3 className="text-xl font-black text-rr-dark">REGISTER INTEREST</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">Join the waitlist</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body (scrollable) */}
                        <div className="p-5 overflow-y-auto relative custom-scrollbar">
                            <StatusModal
                                type={status}
                                isOpen={status === 'success' || status === 'error'}
                                onClose={() => {
                                    if (status === 'success') {
                                        setStatus(null);
                                        onClose();
                                    } else {
                                        setStatus(null);
                                    }
                                }}
                            />

                            <form id="lead-form" onSubmit={handleSubmit} className="space-y-1">
                                <div className="grid grid-cols-2 gap-3">
                                    <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                                    <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <InputField label="Age" type="number" name="age" value={formData.age} onChange={handleChange} required />

                                    <div className="mb-4">
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                                            Gender <span className="text-rr-pink">*</span>
                                        </label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rr-pink focus:ring-2 focus:ring-rr-pink/20 transition-all text-rr-dark appearance-none"
                                        >
                                            <option value="" disabled>Select gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                            <option value="Prefer not to say">Prefer not to say</option>
                                        </select>
                                    </div>
                                </div>

                                <InputField label="Suburb" name="suburb" value={formData.suburb} onChange={handleChange} required />
                                <InputField label="Current Club(s)" name="clubs" value={formData.clubs} onChange={handleChange} required />
                            </form>
                        </div>

                        {/* Footer */}
                        {status !== 'success' && (
                            <div className="p-5 border-t border-slate-100 shrink-0">
                                <Button type="submit" form="lead-form" className="w-full py-3.5" disabled={loading}>
                                    {loading ? 'SUBMITTING...' : 'LEARN MORE'}
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LeadModal;
