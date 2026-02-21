import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Kanban, Table2, BarChart3, FileText,
    Settings, LogOut, ChevronLeft, ChevronRight, Menu, X, Shield, CheckCircle2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const NAV_ITEMS = [
    { label: 'Dashboard', path: '/rramadmin_26/dashboard', icon: LayoutDashboard },
    { label: 'Pipeline', path: '/rramadmin_26/pipeline', icon: Kanban },
    { label: 'Applications', path: '/rramadmin_26/applications', icon: Table2 },
    { label: 'Selection', path: '/rramadmin_26/selection', icon: CheckCircle2 },
    { label: 'Analytics', path: '/rramadmin_26/analytics', icon: BarChart3 },
    { label: 'Offer Tokens', path: '/rramadmin_26/tokens', icon: Shield },
    { label: 'Pages', path: '/rramadmin_26/pages', icon: FileText },
    { label: 'Settings', path: '/rramadmin_26/settings', icon: Settings },
];

const AdminLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [dashUser, setDashUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // --- LOCAL DEV BYPASS ---
            // Automatically logs you into the dashboard UI if on localhost
            // Note: Supabase data requests will still be anonymous unless you actually log in.
            // If you need real data, set the VITE_DEV_BYPASS=false environment variable.
            if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && import.meta.env.VITE_DEV_BYPASS !== 'false') {
                setUser({ email: 'local-dev@rra.com' });
                setDashUser({
                    id: 'dev-123',
                    email: 'local-dev@rra.com',
                    display_name: 'Local Developer',
                    role: 'super_admin',
                    active: true
                });
                setLoading(false);
                return;
            }
            // ------------------------

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

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path;
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

export default AdminLayout;
