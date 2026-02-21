import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileSpreadsheet, Copy, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const TokenGenerator = () => {
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [copiedIndex, setCopiedIndex] = useState(null);

    // Format expected: Name, Email
    const handleProcess = async () => {
        if (!inputText.trim()) {
            setError('Please enter some data to process.');
            return;
        }

        setIsProcessing(true);
        setError(null);
        setResults([]);

        try {
            // Very basic CSV/TSV parser
            const lines = inputText.split('\n').filter(line => line.trim() !== '');
            const parsedData = lines.map(line => {
                // Handle both comma and tab separated
                const separator = line.includes('\t') ? '\t' : ',';
                const parts = line.split(separator);

                let name = '';
                let email = '';

                if (parts.length >= 2) {
                    name = parts[0].trim();
                    email = parts[1].trim();
                } else {
                    // Try to extract an email if no clear separator
                    const emailMatch = line.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
                    email = emailMatch ? emailMatch[0] : '';
                    name = line.replace(email, '').replace(/,/g, '').trim();
                }

                // remove quotes if any
                name = name.replace(/^"(.*)"$/, '$1');
                email = email.replace(/^"(.*)"$/, '$1');

                return { name, email, original: line };
            });

            // Validate and filter
            const validData = parsedData.filter(d => d.name && d.email);

            if (validData.length === 0) {
                throw new Error("Could not parse any valid Name and Email pairs. Please ensure format is 'Name, Email'.");
            }

            const newTokens = [];
            const baseUrl = window.location.origin;

            // Generate tokens in Supabase
            for (const item of validData) {
                // Set expiry to 14 days from now
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 14);

                const { data, error } = await supabase
                    .from('offer_tokens')
                    .insert([
                        {
                            applicant_name: item.name,
                            applicant_email: item.email,
                            expires_at: expiresAt.toISOString(),
                            status: 'pending'
                        }
                    ])
                    .select('token, applicant_name, applicant_email')
                    .single();

                if (error) {
                    console.error("Error creating token for", item.email, error);
                    newTokens.push({
                        ...item,
                        status: 'error',
                        message: error.message
                    });
                } else {
                    newTokens.push({
                        ...item,
                        status: 'success',
                        token: data.token,
                        url: `${baseUrl}/offer/${data.token}`
                    });
                }
            }

            setResults(newTokens);
            setInputText(''); // Clear input on success

        } catch (err) {
            console.error('Processing error:', err);
            setError(err.message || 'An error occurred while processing the data.');
        } finally {
            setIsProcessing(false);
        }
    };

    const copyToClipboard = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const exportToCSV = () => {
        if (results.length === 0) return;

        const header = "Name,Email,Token URL,Status\n";
        const rows = results.map(r => `"${r.name}","${r.email}","${r.url || ''}","${r.status}"`).join('\n');
        const csvContent = "data:text/csv;charset=utf-8," + header + rows;

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "offer_links.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider">OFFER TOKENS</h1>
                    <p className="text-slate-400 text-sm mt-1">Generate unique, secure links for the Assessment Invitation page.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Upload className="w-24 h-24" />
                    </div>

                    <h2 className="text-lg font-bold text-white mb-4 relative z-10">Bulk Generate Links</h2>

                    <div className="space-y-4 relative z-10">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Paste Data (Name, Email)
                            </label>
                            <p className="text-xs text-slate-500 mb-3">
                                Paste content directly from Excel/Google Sheets or type it in comma-separated format. One applicant per line.
                            </p>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="John Doe, john@example.com&#10;Jane Smith, jane.smith@test.com"
                                className="w-full h-48 bg-black/50 border border-white/20 rounded-xl p-4 text-white text-sm font-mono focus:border-rr-pink focus:outline-none focus:ring-1 focus:ring-rr-pink transition-all placeholder:text-slate-600"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-300">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={handleProcess}
                            disabled={isProcessing || !inputText.trim()}
                            className="w-full bg-gradient-to-r from-rr-blue to-rr-pink text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-rr-pink/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <FileSpreadsheet className="w-5 h-5" />
                                    Generate Unique Links
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Results Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col h-full"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-white">Generated Links</h2>
                        {results.length > 0 && (
                            <button
                                onClick={exportToCSV}
                                className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <FileSpreadsheet className="w-4 h-4" />
                                Export CSV
                            </button>
                        )}
                    </div>

                    {results.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-12">
                            <Lock className="w-12 h-12 opacity-20 mb-4" />
                            <p className="text-sm text-center max-w-xs">
                                Generated links will appear here. They are tied to the applicant's email and expire in 14 days.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 overflow-y-auto pr-2 max-h-[500px] custom-scrollbar">
                            {results.map((result, index) => (
                                <div key={index} className="bg-black/40 border border-white/10 rounded-xl p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold text-white text-sm">{result.name}</p>
                                            <p className="text-xs text-slate-400">{result.email}</p>
                                        </div>
                                        {result.status === 'success' ? (
                                            <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                                                Created
                                            </span>
                                        ) : (
                                            <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                                                Failed
                                            </span>
                                        )}
                                    </div>

                                    {result.status === 'success' ? (
                                        <div className="flex items-center gap-2 mt-3">
                                            <div className="bg-black/60 rounded px-3 py-2 text-xs font-mono text-slate-300 truncate flex-1 border border-white/5">
                                                {result.url}
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(result.url, index)}
                                                className="p-2 rounded bg-white/10 hover:bg-rr-pink hover:text-white transition-colors text-slate-400 shrink-0"
                                                title="Copy Link"
                                            >
                                                {copiedIndex === index ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-red-400 mt-2">{result.message}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default TokenGenerator;
