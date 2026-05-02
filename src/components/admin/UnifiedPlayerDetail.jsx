import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    X, User, Phone, Mail, MapPin, Calendar, ExternalLink,
    FileText, ChevronRight, Clock, MessageSquare, Send, Tag,
    CreditCard, Shirt, CheckCircle2, XCircle, HelpCircle,
    Milestone
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatDate, formatDateLong, formatDateTime } from './dateUtils';

const DetailRow = ({ icon: Icon, label, value, isLink }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3 py-2">
            <Icon className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
            <div className="min-w-0">
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">{label}</p>
                {isLink ? (
                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-rr-pink text-sm hover:underline flex items-center gap-1">
                        {value.length > 40 ? value.substring(0, 40) + '…' : value}
                        <ExternalLink className="w-3 h-3" />
                    </a>
                ) : (
                    <p className="text-white text-sm">{value}</p>
                )}
            </div>
        </div>
    );
};

const JOURNEY_ICONS = {
    application: FileText,
    stage_move: ChevronRight,
    note: MessageSquare,
    offer_sent: Send,
    offer_accepted: CheckCircle2,
    offer_declined: XCircle,
    offer_pending: HelpCircle,
    rsvp: Calendar,
    cohort_enrolled: CheckCircle2,
    payment: CreditCard,
};

const JOURNEY_COLORS = {
    application: 'text-blue-400 bg-blue-500/10',
    stage_move: 'text-slate-400 bg-white/5',
    note: 'text-amber-400 bg-amber-500/10',
    offer_sent: 'text-purple-400 bg-purple-500/10',
    offer_accepted: 'text-emerald-400 bg-emerald-500/10',
    offer_declined: 'text-red-400 bg-red-500/10',
    offer_pending: 'text-amber-400 bg-amber-500/10',
    rsvp: 'text-cyan-400 bg-cyan-500/10',
    cohort_enrolled: 'text-emerald-400 bg-emerald-500/10',
    payment: 'text-emerald-400 bg-emerald-500/10',
};

const UnifiedPlayerDetail = ({ application, entry, stages, onClose, onStageChange }) => {
    const [activeTab, setActiveTab] = useState('info');
    const [activityLog, setActivityLog] = useState([]);
    const [noteText, setNoteText] = useState('');
    const [loadingNote, setLoadingNote] = useState(false);
    const [labels, setLabels] = useState(entry?.labels || []);
    const [newLabel, setNewLabel] = useState('');

    // ── Cross-table data ────────────────────────────────────────────
    const [cohortData, setCohortData] = useState(null);
    const [offerData, setOfferData] = useState([]);
    const [rsvpData, setRsvpData] = useState([]);
    const [journey, setJourney] = useState([]);
    const [loadingExtra, setLoadingExtra] = useState(true);

    const name = `${application.first_name || ''} ${application.last_name || ''}`.trim();
    const email = application.email?.toLowerCase();
    const currentStage = stages.find(s => s.slug === entry?.stage_slug);

    // ── Fetch pipeline activity ─────────────────────────────────────
    const fetchActivity = useCallback(async () => {
        const { data } = await supabase
            .from('pipeline_activity_log')
            .select('*')
            .eq('application_id', application.id)
            .order('created_at', { ascending: false });
        setActivityLog(data || []);
    }, [application.id]);

    // ── Fetch cross-table data by email ─────────────────────────────
    const fetchCrossTableData = useCallback(async () => {
        if (!email) { setLoadingExtra(false); return; }

        try {
            const [cohortRes, tokensRes, rsvpRes] = await Promise.all([
                supabase.from('official_cohort_2026').select('*').eq('email', email).limit(1),
                supabase.from('offer_tokens').select('*').eq('applicant_email', email).order('created_at', { ascending: false }),
                supabase.from('rsvp_responses').select('*').eq('email', email).order('created_at', { ascending: false }),
            ]);

            const cohort = cohortRes.data?.[0] || null;
            const tokens = tokensRes.data || [];
            const rsvps = rsvpRes.data || [];

            setCohortData(cohort);
            setOfferData(tokens);
            setRsvpData(rsvps);
        } catch (err) {
            console.error('Error fetching cross-table data:', err);
        } finally {
            setLoadingExtra(false);
        }
    }, [email]);

    useEffect(() => {
        fetchActivity();
        fetchCrossTableData();
    }, [fetchActivity, fetchCrossTableData]);

    // ── Build journey timeline ───────────────────────────────────────
    useEffect(() => {
        const events = [];

        // Application submitted
        if (application.created_at) {
            const sourceLabel = application.source === 'splash_page' ? 'Splash enquiry' : 'Elite Program application';
            events.push({
                type: 'application',
                date: new Date(application.created_at),
                title: `${sourceLabel} submitted`,
                detail: application.source === 'splash_page' ? 'General enquiry via splash page' : 'Full application via Elite Program',
            });
        }

        // Pipeline activity (stage moves and notes)
        activityLog.forEach(item => {
            events.push({
                type: item.action === 'note_added' ? 'note' : 'stage_move',
                date: new Date(item.created_at),
                title: item.action === 'note_added'
                    ? 'Note added'
                    : `Moved to ${item.to_stage}`,
                detail: item.action === 'note_added'
                    ? item.notes
                    : `${item.from_stage || '—'} → ${item.to_stage}`,
                performer: item.performed_by,
            });
        });

        // Offers
        offerData.forEach(token => {
            events.push({
                type: 'offer_sent',
                date: new Date(token.created_at),
                title: 'Offer sent',
                detail: `Token: ${token.token?.substring(0, 8)}…`,
            });
            if (token.status === 'accepted') {
                events.push({
                    type: 'offer_accepted',
                    date: new Date(token.responded_at || token.created_at),
                    title: 'Offer accepted',
                });
            } else if (token.status === 'declined') {
                events.push({
                    type: 'offer_declined',
                    date: new Date(token.responded_at || token.created_at),
                    title: 'Offer declined',
                });
            }
        });

        // RSVPs
        rsvpData.forEach(rsvp => {
            const optionLabels = { 1: 'Available Sunday', 2: 'Unavailable Sunday', 3: 'Considering', 4: 'Declined' };
            events.push({
                type: 'rsvp',
                date: new Date(rsvp.created_at),
                title: 'Assessment RSVP',
                detail: optionLabels[rsvp.selected_option] || `Option ${rsvp.selected_option}`,
            });
        });

        // Cohort enrolment
        if (cohortData) {
            events.push({
                type: 'cohort_enrolled',
                date: new Date(cohortData.created_at),
                title: 'Enrolled in Cohort 2026',
                detail: cohortData.payment_option_selected || cohortData.payment_plan_selected || null,
            });
            if (cohortData.payment_status && cohortData.payment_status !== 'pending') {
                events.push({
                    type: 'payment',
                    date: new Date(cohortData.created_at),
                    title: `Payment ${cohortData.payment_status}`,
                    detail: cohortData.payment_option_selected || null,
                });
            }
        }

        // Sort chronologically (newest first)
        events.sort((a, b) => b.date - a.date);
        setJourney(events);
    }, [application, activityLog, offerData, rsvpData, cohortData]);

    // ── Actions ─────────────────────────────────────────────────────
    const handleAddNote = async () => {
        if (!noteText.trim()) return;
        setLoadingNote(true);

        await supabase.from('pipeline_activity_log').insert({
            application_id: application.id,
            from_stage: entry?.stage_slug,
            to_stage: entry?.stage_slug,
            action: 'note_added',
            notes: noteText.trim(),
            performed_by: 'admin',
        });

        setNoteText('');
        setLoadingNote(false);
        fetchActivity();
    };

    const handleAddLabel = async () => {
        if (!newLabel.trim()) return;
        const updated = [...labels, newLabel.trim().toLowerCase()];
        setLabels(updated);
        setNewLabel('');

        await supabase
            .from('pipeline_entries')
            .update({ labels: updated })
            .eq('id', entry?.id);
    };

    const handleRemoveLabel = async (label) => {
        const updated = labels.filter(l => l !== label);
        setLabels(updated);

        await supabase
            .from('pipeline_entries')
            .update({ labels: updated })
            .eq('id', entry?.id);
    };

    const tabs = [
        { id: 'info', label: 'Details' },
        { id: 'parents', label: 'Parents' },
        { id: 'cricket', label: 'Cricket' },
        { id: 'journey', label: 'Journey' },
        { id: 'program', label: 'Program' },
        { id: 'activity', label: 'Notes' },
    ];

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            {/* Panel */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-slate-900 border-l border-white/10 z-50 flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-black text-white">{name || 'Unknown'}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-slate-400 text-sm">
                                    {application.created_at ? formatDateLong(application.created_at) : ''}
                                </p>
                                {application.source && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-500 uppercase tracking-wider">
                                        {application.source === 'splash_page' ? 'Enquiry' : 'LP4'}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Stage + status badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {currentStage && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10" style={{ backgroundColor: `${currentStage.color}20` }}>
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentStage.color }} />
                                <span className="text-white text-xs font-bold">{currentStage.name}</span>
                            </div>
                        )}
                        {cohortData && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 text-xs font-bold">Enrolled</span>
                            </div>
                        )}
                        {cohortData?.payment_status && cohortData.payment_status !== 'pending' && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10">
                                <CreditCard className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 text-xs font-bold">Paid</span>
                            </div>
                        )}
                    </div>

                    {/* Stage move buttons */}
                    {stages.filter(s => s.slug !== entry?.stage_slug).length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap mt-3">
                            <span className="text-slate-600 text-[10px] font-bold uppercase tracking-wider mr-1">Move:</span>
                            {stages.filter(s => s.slug !== entry?.stage_slug).map(s => (
                                <button
                                    key={s.slug}
                                    onClick={() => onStageChange(application.id, s.slug)}
                                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-xs"
                                >
                                    <ChevronRight className="w-3 h-3" />
                                    {s.name.length > 15 ? s.name.substring(0, 15) + '…' : s.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Labels */}
                    <div className="flex items-center gap-2 flex-wrap mt-3">
                        {labels.map(label => (
                            <span
                                key={label}
                                onClick={() => handleRemoveLabel(label)}
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rr-pink/20 text-rr-pink uppercase tracking-wider cursor-pointer hover:bg-red-500/20 hover:text-red-400"
                                title="Click to remove"
                            >
                                {label} ×
                            </span>
                        ))}
                        <div className="flex items-center gap-1">
                            <input
                                type="text"
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddLabel()}
                                placeholder="+ add label"
                                className="bg-transparent border-none text-xs text-slate-500 placeholder-slate-600 focus:outline-none w-20"
                            />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/5 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'text-rr-pink border-b-2 border-rr-pink'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">

                    {/* ── Details Tab ───────────────────────────────── */}
                    {activeTab === 'info' && (
                        <div className="space-y-1">
                            <DetailRow icon={User} label="Full Name" value={name} />
                            <DetailRow icon={Calendar} label="Age" value={application.age?.toString()} />
                            <DetailRow icon={Calendar} label="Date of Birth" value={application.dob} />
                            <DetailRow icon={Mail} label="Email" value={application.email} />
                            <DetailRow icon={Phone} label="Phone" value={application.phone} />
                            <DetailRow icon={MapPin} label="Suburb" value={application.suburb} />
                            {application.bio && (
                                <div className="pt-4 border-t border-white/5 mt-4">
                                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Bio</p>
                                    <p className="text-slate-300 text-sm leading-relaxed">{application.bio}</p>
                                </div>
                            )}
                            {application.goals && (
                                <div className="pt-4 border-t border-white/5 mt-4">
                                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Career Goals</p>
                                    <p className="text-slate-300 text-sm leading-relaxed">{application.goals}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Parents Tab ───────────────────────────────── */}
                    {activeTab === 'parents' && (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-rr-pink text-xs font-bold uppercase tracking-wider mb-3">Parent / Guardian 1</h4>
                                <DetailRow icon={User} label="Name" value={application.parent1_name} />
                                <DetailRow icon={Mail} label="Email" value={application.parent1_email} />
                                <DetailRow icon={Phone} label="Phone" value={application.parent1_phone} />
                            </div>
                            <div>
                                <h4 className="text-rr-pink text-xs font-bold uppercase tracking-wider mb-3">Parent / Guardian 2</h4>
                                <DetailRow icon={User} label="Name" value={application.parent2_name} />
                                <DetailRow icon={Mail} label="Email" value={application.parent2_email} />
                                <DetailRow icon={Phone} label="Phone" value={application.parent2_phone} />
                            </div>
                        </div>
                    )}

                    {/* ── Cricket Tab ───────────────────────────────── */}
                    {activeTab === 'cricket' && (
                        <div className="space-y-1">
                            <DetailRow icon={User} label="Current Club(s)" value={application.club} />
                            <DetailRow icon={ExternalLink} label="Play Cricket Profile" value={application.profile_link} isLink={!!application.profile_link} />
                            {application.cv_url && (
                                <DetailRow icon={FileText} label="CV / Resume" value={application.cv_url} isLink />
                            )}
                            {application.history && (
                                <div className="pt-4 border-t border-white/5 mt-4">
                                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Representative History</p>
                                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{application.history}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Journey Tab (cross-table timeline) ─────────── */}
                    {activeTab === 'journey' && (
                        <div className="space-y-1">
                            {loadingExtra ? (
                                <div className="flex items-center justify-center py-8">
                                    <svg className="animate-spin w-6 h-6 text-rr-pink" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                </div>
                            ) : journey.length === 0 ? (
                                <p className="text-slate-600 text-sm text-center py-8">No journey events recorded</p>
                            ) : (
                                <div className="relative">
                                    {/* Timeline line */}
                                    <div className="absolute left-4 top-2 bottom-2 w-px bg-white/5" />

                                    <div className="space-y-1">
                                        {journey.map((event, i) => {
                                            const Icon = JOURNEY_ICONS[event.type] || Milestone;
                                            const colorClass = JOURNEY_COLORS[event.type] || 'text-slate-400 bg-white/5';
                                            const [textColor, bgColor] = colorClass.split(' ');
                                            return (
                                                <div key={i} className="flex gap-3 pl-0 py-2 relative">
                                                    <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center shrink-0 z-10`}>
                                                        <Icon className={`w-3.5 h-3.5 ${textColor}`} />
                                                    </div>
                                                    <div className="min-w-0 pt-1">
                                                        <p className="text-white text-sm font-medium">{event.title}</p>
                                                        {event.detail && (
                                                            <p className="text-slate-400 text-xs mt-0.5">{event.detail}</p>
                                                        )}
                                                        <p className="text-slate-600 text-xs mt-0.5">
                                                            {formatDate(event.date)}
                                                            {event.performer && ` · ${event.performer}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Program Tab (cohort/payment/sizing) ────────── */}
                    {activeTab === 'program' && (
                        <div>
                            {loadingExtra ? (
                                <div className="flex items-center justify-center py-8">
                                    <svg className="animate-spin w-6 h-6 text-rr-pink" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                </div>
                            ) : !cohortData ? (
                                <div className="text-center py-8">
                                    <p className="text-slate-500 text-sm">Not yet enrolled in a program</p>
                                    <p className="text-slate-600 text-xs mt-1">Cohort data will appear here once this player completes enrolment</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Payment */}
                                    <div>
                                        <h4 className="text-rr-pink text-xs font-bold uppercase tracking-wider mb-3">Payment</h4>
                                        <DetailRow icon={CreditCard} label="Status" value={cohortData.payment_status || 'Pending'} />
                                        <DetailRow icon={CreditCard} label="Payment Option" value={cohortData.payment_option_selected || cohortData.payment_plan_selected} />
                                    </div>

                                    {/* Sizing */}
                                    {(cohortData.size_tshirt || cohortData.size_short || cohortData.size_pants) && (
                                        <div>
                                            <h4 className="text-rr-pink text-xs font-bold uppercase tracking-wider mb-3">Kit Sizing</h4>
                                            <div className="grid grid-cols-3 gap-3">
                                                {cohortData.size_tshirt && (
                                                    <div className="bg-white/5 rounded-xl p-3 text-center">
                                                        <Shirt className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                                                        <p className="text-white text-sm font-bold">{cohortData.size_tshirt}</p>
                                                        <p className="text-slate-500 text-[10px] uppercase">T-Shirt</p>
                                                    </div>
                                                )}
                                                {cohortData.size_short && (
                                                    <div className="bg-white/5 rounded-xl p-3 text-center">
                                                        <Shirt className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                                                        <p className="text-white text-sm font-bold">{cohortData.size_short}</p>
                                                        <p className="text-slate-500 text-[10px] uppercase">Shorts</p>
                                                    </div>
                                                )}
                                                {cohortData.size_pants && (
                                                    <div className="bg-white/5 rounded-xl p-3 text-center">
                                                        <Shirt className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                                                        <p className="text-white text-sm font-bold">{cohortData.size_pants}</p>
                                                        <p className="text-slate-500 text-[10px] uppercase">Pants</p>
                                                    </div>
                                                )}
                                            </div>
                                            {cohortData.shirt_name && (
                                                <DetailRow icon={Tag} label="Shirt Name" value={cohortData.shirt_name} />
                                            )}
                                        </div>
                                    )}

                                    {/* Player Details (from cohort) */}
                                    <div>
                                        <h4 className="text-rr-pink text-xs font-bold uppercase tracking-wider mb-3">Program Details</h4>
                                        <DetailRow icon={User} label="Gender" value={cohortData.gender} />
                                        <DetailRow icon={MapPin} label="Suburb" value={cohortData.suburb} />
                                        <DetailRow icon={User} label="Player Role" value={cohortData.player_role} />
                                    </div>

                                    {/* Communications */}
                                    {(cohortData.preferred_comms || cohortData.group_chat_consent !== null) && (
                                        <div>
                                            <h4 className="text-rr-pink text-xs font-bold uppercase tracking-wider mb-3">Communications</h4>
                                            <DetailRow icon={MessageSquare} label="Preferred Channel" value={cohortData.preferred_comms} />
                                            <DetailRow icon={CheckCircle2} label="Group Chat Consent" value={cohortData.group_chat_consent ? 'Yes' : cohortData.group_chat_consent === false ? 'No' : null} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Notes Tab (activity log + add note) ────────── */}
                    {activeTab === 'activity' && (
                        <div className="space-y-4">
                            {/* Add note */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                                    placeholder="Add a note..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-rr-pink/50"
                                />
                                <button
                                    onClick={handleAddNote}
                                    disabled={loadingNote || !noteText.trim()}
                                    className="px-4 py-2.5 rounded-xl bg-rr-pink/20 text-rr-pink hover:bg-rr-pink/30 transition-all disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Timeline */}
                            <div className="space-y-3">
                                {activityLog.map(item => (
                                    <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-white/5">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                            {item.action === 'note_added' ? (
                                                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                                            ) : (
                                                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            {item.action === 'note_added' ? (
                                                <p className="text-slate-300 text-sm">{item.notes}</p>
                                            ) : (
                                                <p className="text-slate-300 text-sm">
                                                    Moved from <span className="text-white font-medium">{item.from_stage || '—'}</span> to{' '}
                                                    <span className="text-white font-medium">{item.to_stage}</span>
                                                </p>
                                            )}
                                            <p className="text-slate-600 text-xs mt-1">
                                                {formatDateTime(item.created_at)} · {item.performed_by}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {activityLog.length === 0 && (
                                    <p className="text-slate-600 text-sm text-center py-4">No notes or activity yet</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default UnifiedPlayerDetail;
