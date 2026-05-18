import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    X, User, Phone, Mail, MapPin, Calendar, ExternalLink,
    FileText, ChevronRight, Clock, MessageSquare, Send, Tag
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import CVLink from './CVLink';

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

const ApplicationDetail = ({ application, entry, stages, onClose, onStageChange }) => {
    const [activeTab, setActiveTab] = useState('info');
    const [activityLog, setActivityLog] = useState([]);
    const [noteText, setNoteText] = useState('');
    const [loadingNote, setLoadingNote] = useState(false);
    const [labels, setLabels] = useState(entry?.labels || []);
    const [newLabel, setNewLabel] = useState('');

    const name = `${application.first_name || ''} ${application.last_name || ''}`.trim();
    const currentStage = stages.find(s => s.slug === entry?.stage_slug);

    useEffect(() => {
        fetchActivity();
    }, [application.id]);

    const fetchActivity = async () => {
        const { data } = await supabase
            .from('pipeline_activity_log')
            .select('*')
            .eq('application_id', application.id)
            .order('created_at', { ascending: false });
        setActivityLog(data || []);
    };

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
        { id: 'activity', label: 'Activity' },
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
                            <p className="text-slate-400 text-sm mt-1">
                                Applied {application.created_at ? new Date(application.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                            </p>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Stage badge */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10" style={{ backgroundColor: `${currentStage?.color}20` }}>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentStage?.color }} />
                            <span className="text-white text-xs font-bold">{currentStage?.name || entry?.stage_slug}</span>
                        </div>
                        {/* Stage move buttons */}
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
                <div className="flex border-b border-white/5">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab.id
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

                    {activeTab === 'cricket' && (
                        <div className="space-y-1">
                            <DetailRow icon={User} label="Current Club(s)" value={application.club} />
                            <DetailRow icon={ExternalLink} label="Play Cricket Profile" value={application.profile_link} isLink={!!application.profile_link} />
                            <CVLink stored={application.cv_url} />
                            {application.history && (
                                <div className="pt-4 border-t border-white/5 mt-4">
                                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Representative History</p>
                                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{application.history}</p>
                                </div>
                            )}
                        </div>
                    )}

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
                                                {new Date(item.created_at).toLocaleString()} · {item.performed_by}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {activityLog.length === 0 && (
                                    <p className="text-slate-600 text-sm text-center py-4">No activity yet</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default ApplicationDetail;
