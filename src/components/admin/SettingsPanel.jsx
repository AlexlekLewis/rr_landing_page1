import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Palette, GripVertical, Trash2, Plus, Save, Users, Shield,
    UserPlus, Check, X, AlertTriangle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const SUPER_ADMIN_EMAIL = 'alex.lewis@rramelbourne.com';

const SettingsPanel = () => {
    const [activeTab, setActiveTab] = useState('pipeline');
    const [stages, setStages] = useState([]);
    const [dashUsers, setDashUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newStage, setNewStage] = useState({ name: '', color: '#6B7280' });
    const [showAddStage, setShowAddStage] = useState(false);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserName, setNewUserName] = useState('');
    const [newUserRole, setNewUserRole] = useState('viewer');
    const [showAddUser, setShowAddUser] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setCurrentUser(session?.user);

        const [stagesRes, usersRes] = await Promise.all([
            supabase.from('pipeline_stages').select('*').order('sort_order'),
            supabase.from('dashboard_users').select('*').order('created_at'),
        ]);

        setStages(stagesRes.data || []);
        setDashUsers(usersRes.data || []);
        setLoading(false);
    };

    const isSuperAdmin = currentUser?.email === SUPER_ADMIN_EMAIL;

    // --- Pipeline Stage Management ---
    const handleStageNameChange = (slug, newName) => {
        setStages(prev => prev.map(s => s.slug === slug ? { ...s, name: newName } : s));
    };

    const handleStageColorChange = (slug, color) => {
        setStages(prev => prev.map(s => s.slug === slug ? { ...s, color } : s));
    };

    const handleSaveStage = async (stage) => {
        setSaving(true);
        await supabase.from('pipeline_stages').update({ name: stage.name, color: stage.color }).eq('id', stage.id);
        setSaving(false);
    };

    const handleAddStage = async () => {
        if (!newStage.name.trim()) return;
        setSaving(true);

        const slug = newStage.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        const maxOrder = Math.max(...stages.map(s => s.sort_order), -1);

        const { data, error } = await supabase.from('pipeline_stages').insert({
            name: newStage.name.trim(),
            slug,
            sort_order: maxOrder + 1,
            color: newStage.color,
        }).select().single();

        if (!error && data) {
            setStages(prev => [...prev, data]);
            setNewStage({ name: '', color: '#6B7280' });
            setShowAddStage(false);
        }
        setSaving(false);
    };

    const handleDeleteStage = async (stage) => {
        if (!confirm(`Delete "${stage.name}"? Cards in this stage will need to be moved first.`)) return;

        // Check if any entries use this stage
        const { count } = await supabase.from('pipeline_entries').select('*', { count: 'exact', head: true }).eq('stage_slug', stage.slug);

        if (count > 0) {
            alert(`Cannot delete: ${count} applications are in this stage. Move them first.`);
            return;
        }

        await supabase.from('pipeline_stages').delete().eq('id', stage.id);
        setStages(prev => prev.filter(s => s.id !== stage.id));
    };

    const handleSetDefault = async (slug) => {
        await supabase.from('pipeline_stages').update({ is_default: false }).neq('slug', slug);
        await supabase.from('pipeline_stages').update({ is_default: true }).eq('slug', slug);
        setStages(prev => prev.map(s => ({ ...s, is_default: s.slug === slug })));
    };

    // --- User Management ---
    const handleAddUser = async () => {
        if (!newUserEmail.trim()) return;
        setSaving(true);

        const { data, error } = await supabase.from('dashboard_users').insert({
            email: newUserEmail.trim().toLowerCase(),
            display_name: newUserName.trim() || null,
            role: newUserRole,
            invited_by: currentUser?.email || 'admin',
        }).select().single();

        if (!error && data) {
            setDashUsers(prev => [...prev, data]);
            setNewUserEmail('');
            setNewUserName('');
            setNewUserRole('viewer');
            setShowAddUser(false);
        } else if (error) {
            alert(error.message);
        }
        setSaving(false);
    };

    const handleToggleUserActive = async (user) => {
        if (user.email === SUPER_ADMIN_EMAIL) return;
        const newActive = !user.active;
        await supabase.from('dashboard_users').update({ active: newActive }).eq('id', user.id);
        setDashUsers(prev => prev.map(u => u.id === user.id ? { ...u, active: newActive } : u));
    };

    const handleChangeUserRole = async (user, newRole) => {
        if (user.email === SUPER_ADMIN_EMAIL) return;
        await supabase.from('dashboard_users').update({ role: newRole }).eq('id', user.id);
        setDashUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <svg className="animate-spin w-8 h-8 text-rr-pink" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider">SETTINGS</h1>
                <p className="text-slate-400 text-sm mt-1">Manage pipeline stages and user access</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white/5 rounded-xl p-1">
                <button
                    onClick={() => setActiveTab('pipeline')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'pipeline' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                >
                    <Palette className="w-4 h-4" />
                    Pipeline Stages
                </button>
                {isSuperAdmin && (
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <Shield className="w-4 h-4" />
                        User Access
                    </button>
                )}
            </div>

            {/* Pipeline Settings */}
            {activeTab === 'pipeline' && (
                <div className="space-y-3">
                    {stages.map((stage, i) => (
                        <div key={stage.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 group">
                            <div className="flex items-center gap-4">
                                <GripVertical className="w-4 h-4 text-slate-600 cursor-grab shrink-0" />

                                {/* Color picker */}
                                <div className="relative shrink-0">
                                    <input
                                        type="color"
                                        value={stage.color}
                                        onChange={(e) => handleStageColorChange(stage.slug, e.target.value)}
                                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent appearance-none"
                                        style={{ backgroundColor: stage.color }}
                                    />
                                </div>

                                {/* Name */}
                                <input
                                    type="text"
                                    value={stage.name}
                                    onChange={(e) => handleStageNameChange(stage.slug, e.target.value)}
                                    className="flex-1 bg-transparent text-white font-medium text-sm focus:outline-none border-b border-transparent focus:border-rr-pink/50 pb-0.5"
                                />

                                {/* Default badge */}
                                {stage.is_default ? (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold uppercase shrink-0">Default</span>
                                ) : (
                                    <button
                                        onClick={() => handleSetDefault(stage.slug)}
                                        className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-500 hover:text-slate-300 font-semibold uppercase shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Set Default
                                    </button>
                                )}

                                {/* Save */}
                                <button
                                    onClick={() => handleSaveStage(stage)}
                                    className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-green-400 hover:bg-green-500/10 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Save className="w-4 h-4" />
                                </button>

                                {/* Delete */}
                                <button
                                    onClick={() => handleDeleteStage(stage)}
                                    className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-slate-600 text-xs mt-2 ml-14 font-mono">{stage.slug}</p>
                        </div>
                    ))}

                    {/* Add stage */}
                    {showAddStage ? (
                        <div className="bg-white/5 border border-rr-pink/30 rounded-2xl p-5">
                            <div className="flex items-center gap-4">
                                <input
                                    type="color"
                                    value={newStage.color}
                                    onChange={(e) => setNewStage(p => ({ ...p, color: e.target.value }))}
                                    className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                                />
                                <input
                                    type="text"
                                    value={newStage.name}
                                    onChange={(e) => setNewStage(p => ({ ...p, name: e.target.value }))}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddStage()}
                                    placeholder="Stage name..."
                                    className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-slate-500"
                                    autoFocus
                                />
                                <button onClick={handleAddStage} disabled={saving} className="p-2 rounded-lg bg-rr-pink/20 text-rr-pink hover:bg-rr-pink/30">
                                    <Check className="w-4 h-4" />
                                </button>
                                <button onClick={() => setShowAddStage(false)} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAddStage(true)}
                            className="w-full py-4 rounded-2xl border-2 border-dashed border-white/10 text-slate-500 hover:border-rr-pink/30 hover:text-rr-pink transition-all flex items-center justify-center gap-2 text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Add Pipeline Stage
                        </button>
                    )}
                </div>
            )}

            {/* User Access Management */}
            {activeTab === 'users' && isSuperAdmin && (
                <div className="space-y-3">
                    {dashUsers.map(user => (
                        <div key={user.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 group">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${user.role === 'super_admin' ? 'bg-gradient-to-br from-rr-pink to-rr-blue' : 'bg-white/10'
                                        }`}>
                                        {user.display_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white font-medium text-sm truncate">{user.display_name || user.email}</p>
                                        <p className="text-slate-500 text-xs truncate">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    {user.email === SUPER_ADMIN_EMAIL ? (
                                        <span className="text-xs px-2.5 py-1 rounded-full bg-rr-pink/20 text-rr-pink font-bold">OWNER</span>
                                    ) : (
                                        <>
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleChangeUserRole(user, e.target.value)}
                                                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-slate-300 text-xs"
                                            >
                                                <option value="admin">Admin</option>
                                                <option value="viewer">Viewer</option>
                                            </select>

                                            <button
                                                onClick={() => handleToggleUserActive(user)}
                                                className={`px-3 py-1 rounded-lg text-xs font-semibold ${user.active
                                                        ? 'bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400'
                                                        : 'bg-red-500/20 text-red-400 hover:bg-green-500/20 hover:text-green-400'
                                                    } transition-all`}
                                            >
                                                {user.active ? 'Active' : 'Disabled'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <p className="text-slate-600 text-xs mt-2 ml-13">
                                Invited by {user.invited_by} · {new Date(user.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    ))}

                    {/* Add user */}
                    {showAddUser ? (
                        <div className="bg-white/5 border border-rr-pink/30 rounded-2xl p-5 space-y-3">
                            <input
                                type="email"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                placeholder="Email address..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-rr-pink/50"
                                autoFocus
                            />
                            <input
                                type="text"
                                value={newUserName}
                                onChange={(e) => setNewUserName(e.target.value)}
                                placeholder="Display name (optional)..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-rr-pink/50"
                            />
                            <div className="flex items-center gap-3">
                                <select
                                    value={newUserRole}
                                    onChange={(e) => setNewUserRole(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-300 text-sm flex-1"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                                <button onClick={handleAddUser} disabled={saving || !newUserEmail.trim()} className="px-4 py-2.5 rounded-xl bg-rr-pink text-white text-sm font-bold disabled:opacity-50">
                                    Add User
                                </button>
                                <button onClick={() => setShowAddUser(false)} className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAddUser(true)}
                            className="w-full py-4 rounded-2xl border-2 border-dashed border-white/10 text-slate-500 hover:border-rr-pink/30 hover:text-rr-pink transition-all flex items-center justify-center gap-2 text-sm font-medium"
                        >
                            <UserPlus className="w-4 h-4" />
                            Invite User
                        </button>
                    )}

                    {/* Warning */}
                    <div className="flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                        <p className="text-slate-400 text-xs">
                            Users must have a Supabase Auth account to log in. Adding them here grants access but doesn't create their account — they need to be registered separately.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPanel;
