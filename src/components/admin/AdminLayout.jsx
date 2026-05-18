import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Kanban, Users, BarChart3, FileText,
    Settings, LogOut, ChevronLeft, ChevronRight, Menu, X,
    Send, CheckCircle2, Eye, ClipboardList, UserCheck, Shield, ChevronDown,
    UserCircle, ShoppingBag, Trophy, GraduationCap, Crown, Sun, Sparkles,
    MessageCircle, Plane
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ProgramProvider, useProgram } from './ProgramContext';

const NAV_GROUPS = [
    {
        label: 'OVERVIEW',
        items: [
            { label: 'Dashboard', path: '/rramadmin_26/dashboard', icon: LayoutDashboard },
        ],
    },
    {
        label: 'INQUIRIES',
        items: [
            { label: 'All Inquiries', path: '/rramadmin_26/inquiries', icon: MessageCircle },
            { label: 'Home Leads', path: '/rramadmin_26/home-leads', icon: Users },
        ],
    },
    {
        label: 'PLAYER MANAGEMENT',
        items: [
            { label: 'All Players', path: '/rramadmin_26/applications', icon: Users },
            // Pipeline + Selection Board temporarily hidden (unused for now).
            // Routes still exist in App.jsx so they can be re-added with a
            // single line when needed again.
        ],
    },
    {
        label: 'PROGRAM',
        items: [
            { label: 'Academy Members 2026', path: '/rramadmin_26/academy-members', icon: UserCheck },
            { label: 'Player Profiles', path: '/rramadmin_26/player-profiles', icon: UserCircle },
            { label: 'Assessments', path: '/rramadmin_26/rsvp', icon: ClipboardList },
            { label: 'Junior Royals', path: '/rramadmin_26/program-registrations?program=junior_royals', icon: GraduationCap },
            { label: 'Elite Program', path: '/rramadmin_26/program-registrations?program=elite', icon: Crown },
            { label: 'Holiday Programs', path: '/rramadmin_26/program-registrations?program=holiday', icon: Sun },
            { label: 'Female Kickstart', path: '/rramadmin_26/program-registrations?program=female_kickstart', icon: Sparkles },
        ],
    },
    {
        label: 'TOURS',
        items: [
            { label: 'India Tour 2026', path: '/rramadmin_26/india-tour-2026', icon: Plane },
        ],
    },
    {
        label: 'REVENUE',
        items: [
            { label: 'Program Registrations', path: '/rramadmin_26/program-registrations', icon: Trophy },
            { label: 'Shop Orders', path: '/rramadmin_26/shop-orders', icon: ShoppingBag },
        ],
    },
    {
        label: 'INSIGHTS',
        items: [
            { label: 'Funnel & Demographics', path: '/rramadmin_26/analytics', icon: BarChart3 },
            { label: 'Site Analytics', path: '/rramadmin_26/page-analytics', icon: Eye },
        ],
    },
    {
        label: 'TOOLS',
        items: [
            { label: 'Offer Manager', path: '/rramadmin_26/tokens', icon: Send },
            { label: 'Site Pages', path: '/rramadmin_26/pages', icon: FileText },
            { label: 'Settings', path: '/rramadmin_26/settings', icon: Settings },
        ],
    },
];

const AdminLayoutInner = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [dashUser, setDashUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedProgram, setSelectedProgram, programs, programLabel } = useProgram();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                navigate('/rramadmin_26');
                return;
            }

            setUser(session.user);

            const { data: du, error } = await supabase
                .from('dashboard_users')
                .select('*')
                .eq('email', session.user.email)
                .eq('active', true)
                .single();

            if (error || !du) {
                await supabase.auth.signOut();
                navigate('/rramadmin_26');
                return;
            }

            setDashUser(du);
        } catch (err) {
            navigate('/rramadmin_26');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/rramadmin_26');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-rr-dark flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin w-8 h-8 text-rr-pink" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-slate-400 text-sm">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const Sidebar = ({ mobile = false }) => (
        <div className={`flex flex-col h-full bg-rr-dark border-r border-white/5 ${mobile ? 'w-72' : collapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
            {/* Header */}
            <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    {(!collapsed || mobile) && (
                        <div className="min-w-0">
                            <h2 className="text-white font-black text-sm tracking-wider truncate">RRA ADMIN</h2>
                            <p className="text-slate-500 text-xs truncate">{dashUser?.role?.replace('_', ' ').toUpperCase()}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Program Selector */}
            {(!collapsed || mobile) && programs.length > 0 && (
                <div className="px-3 pt-3">
                    <div className="relative">
                        <select
                            value={selectedProgram}
                            onChange={(e) => setSelectedProgram(e.target.value)}
                            className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-rr-pink/50 cursor-pointer pr-8"
                        >
                            {programs.map(p => (
                                <option key={p.slug} value={p.slug} className="bg-slate-900">{p.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="w-3 h-3 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
                {NAV_GROUPS.map((group) => (
                    <div key={group.label}>
                        {(!collapsed || mobile) && (
                            <p className="px-3 mb-1.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                {group.label}
                            </p>
                        )}
                        {collapsed && !mobile && (
                            <div className="mx-auto mb-1.5 w-6 border-t border-white/5" />
                        )}
                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const [itemPath, itemQuery = ''] = item.path.split('?');
                                const itemProgram = new URLSearchParams(itemQuery).get('program');
                                const currentProgram = new URLSearchParams(location.search).get('program');
                                const isActive = location.pathname === itemPath
                                    && (itemProgram ? currentProgram === itemProgram : !currentProgram);
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium group ${isActive
                                            ? 'bg-gradient-to-r from-rr-pink/20 to-rr-blue/10 text-white'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-rr-pink' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                        {(!collapsed || mobile) && <span className="truncate">{item.label}</span>}
                                        {isActive && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-rr-pink shrink-0" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User & Logout */}
            <div className="p-3 border-t border-white/5">
                {(!collapsed || mobile) && (
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {dashUser?.display_name?.charAt(0) || 'A'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-white text-sm font-medium truncate">{dashUser?.display_name}</p>
                            <p className="text-slate-500 text-xs truncate">{user?.email}</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full text-sm"
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {(!collapsed || mobile) && <span>Logout</span>}
                </button>
            </div>

            {/* Collapse toggle (desktop only) */}
            {!mobile && (
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-3 border-t border-white/5 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 flex">
            {/* Desktop sidebar */}
            <div className="hidden md:flex">
                <Sidebar />
            </div>

            {/* Mobile overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.div
                            initial={{ x: -288 }}
                            animate={{ x: 0 }}
                            exit={{ x: -288 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed left-0 top-0 bottom-0 z-50 md:hidden"
                        >
                            <Sidebar mobile />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Top bar (mobile) */}
                <div className="md:hidden flex items-center justify-between p-4 bg-rr-dark border-b border-white/5">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h2 className="text-white font-black text-sm tracking-wider">RRA ADMIN</h2>
                    <div className="w-6" />
                </div>

                {/* Content */}
                <main className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

// Wrap with ProgramProvider so all child components can use useProgram()
const AdminLayout = ({ children }) => (
    <ProgramProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
    </ProgramProvider>
);

export default AdminLayout;
