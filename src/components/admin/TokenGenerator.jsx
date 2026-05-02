import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Upload, FileSpreadsheet, Copy, CheckCircle2, AlertCircle, RefreshCw, Lock,
    Search, Clock, XCircle, HelpCircle, ChevronDown, ChevronUp, Send
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { exportToSheet, todayISO } from './exportToSheet';
import useRealtimeSync from '../../hooks/useRealtimeSync';

const STATUS_CONFIG = {
    pending: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock },
    accepted: { label: 'Accepted', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2 },
    declined: { label: 'Declined', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle },
    expired: { label: 'Expired', color: 'text-slate-500', bg: 'bg-white/5', border: 'border-white/10', icon: Clock },
};

const TokenGenerator = () => {
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [copiedIndex, setCopiedIndex] = useState(null);

    // ── Offer History ───────────────────────────────────────────────
    const [allTokens, setAllTokens] = useState([]);
    const [responses, setResponses] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [historySearch, setHistorySearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortDir, setSortDir] = useState('desc');

    const fetchHistory = useCallback(async () => {
        const [tokensRes, responsesRes] = await Promise.all([
            supabase.from('offer_tokens').select('*').order('created_at', { ascending: false }),
            supabase.from('offer_responses').select('*').order('created_at', { ascending: false }),
        ]);
        setAllTokens(tokensRes.data || []);
        setResponses(responsesRes.data || []);
        setHistoryLoading(false);
    }, []);

    useEffect(() => { fetchHistory(); }, [fetchHistory]);
    useRealtimeSync(['offer_tokens', 'offer_responses'], fetchHistory);

    // ── Merge tokens with responses ─────────────────────────────────
    const mergedOffers = useMemo(() => {
        return allTokens.map(token => {
            const response = responses.find(r => r.token === token.token || r.offer_token_id === token.id);
            const isExpired = !response && token.status === 'pending' && new Date(token.expires_at) < new Date();
            return {
                ...token,
                response,
                displayStatus: isExpired ? 'expired' : (token.status || 'pending'),
            };
        });
    }, [allTokens, responses]);

    const filteredOffers = useMemo(() => {
        let result = mergedOffers;
        if (statusFilter !== 'all') {
            result = result.filter(o => o.displayStatus === statusFilter);
        }
        if (historySearch) {
            const q = historySearch.toLowerCase();
            result = result.filter(o =>
                o.applicant_name?.toLowerCase().includes(q) ||
                o.applicant_email?.toLowerCase().includes(q)
            );
        }
        if (sortDir === 'asc') result = [...result].reverse();
        return result;
    }, [mergedOffers, statusFilter, historySearch, sortDir]);

    const statusCounts = useMemo(() => {
        const counts = { all: mergedOffers.length, pending: 0, accepted: 0, declined: 0, expired: 0 };
        mergedOffers.forEach(o => { counts[o.displayStatus] = (counts[o.displayStatus] || 0) + 1; });
        return counts;
    }, [mergedOffers]);

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

    const [exportState, setExportState] = useState({ status: 'idle', message: '' });
    const exportToGoogleSheets = async () => {
        if (results.length === 0) return;
        const headers = ['Name', 'Email', 'Token URL', 'Status'];
        const rows = results.map(r => [r.name || '', r.email || '', r.url || '', r.status || '']);
        setExportState({ status: 'exporting', message: '' });
        try {
            const { url } = await exportToSheet({
                title: `Offer links — ${todayISO()}`,
                sheet_name: 'Offer Links',
                headers,
                rows,
            });
            setExportState({ status: 'done', message: 'Opened in new tab' });
            window.open(url, '_blank', 'noopener');
        } catch (err) {
            setExportState({ status: 'error', message: err.message });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider">OFFER MANAGER</h1>
                    <p className="text-slate-400 text-sm mt-1">Generate and track personalised offer links</p>
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
                                onClick={exportToGoogleSheets}
                                disabled={exportState.status === 'exporting'}
                                className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-60"
                                title={exportState.message}
                            >
                                <FileSpreadsheet className="w-4 h-4" />
                                {exportState.status === 'exporting' ? 'Exporting…' : 'Export to Google Sheets'}
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

            {/* ── Offer History ──────────────────────────────────────── */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-lg font-bold text-white">Offer History</h2>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={historySearch}
                                onChange={(e) => setHistorySearch(e.target.value)}
                                placeholder="Search offers..."
                                className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-rr-pink/50 w-48"
                            />
                        </div>
                        <button
                            onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
                            title="Toggle sort order"
                        >
                            {sortDir === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Status filter pills */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                    {['all', 'pending', 'accepted', 'declined', 'expired'].map(status => {
                        const config = STATUS_CONFIG[status];
                        const isActive = statusFilter === status;
                        return (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                                    isActive
                                        ? (config ? `${config.bg} ${config.border} ${config.color}` : 'bg-rr-pink/20 border-rr-pink/30 text-rr-pink')
                                        : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                {status === 'all' ? 'All' : config?.label} ({statusCounts[status] || 0})
                            </button>
                        );
                    })}
                </div>

                {/* Offers list */}
                {historyLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <svg className="animate-spin w-6 h-6 text-rr-pink" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    </div>
                ) : filteredOffers.length === 0 ? (
                    <p className="text-slate-600 text-sm text-center py-8">
                        {allTokens.length === 0 ? 'No offers generated yet' : 'No offers match your filters'}
                    </p>
                ) : (
                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                        {filteredOffers.map(offer => {
                            const config = STATUS_CONFIG[offer.displayStatus] || STATUS_CONFIG.pending;
                            const StatusIcon = config.icon;
                            return (
                                <div key={offer.id} className={`flex items-center gap-4 p-4 rounded-xl border ${config.border} ${config.bg} transition-all`}>
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${config.bg}`}>
                                        <StatusIcon className={`w-4 h-4 ${config.color}`} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-white text-sm font-bold truncate">{offer.applicant_name}</p>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${config.bg} ${config.color}`}>
                                                {config.label}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-xs truncate">{offer.applicant_email}</p>
                                        <p className="text-slate-600 text-xs mt-0.5">
                                            Sent {new Date(offer.created_at).toLocaleDateString('en-AU', { timeZone: 'Australia/Melbourne', day: '2-digit', month: 'short', year: 'numeric' })}
                                            {offer.expires_at && ` · Expires ${new Date(offer.expires_at).toLocaleDateString('en-AU', { timeZone: 'Australia/Melbourne', day: '2-digit', month: 'short' })}`}
                                        </p>
                                        {offer.response?.selected_option && (
                                            <p className="text-slate-400 text-xs mt-1">
                                                Response: Option {offer.response.selected_option}
                                                {offer.response.message && ` — "${offer.response.message}"`}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(`${window.location.origin}/offer/${offer.token}`, `history-${offer.id}`)}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-colors shrink-0"
                                        title="Copy offer link"
                                    >
                                        {copiedIndex === `history-${offer.id}` ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TokenGenerator;
