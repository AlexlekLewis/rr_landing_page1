import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Eye, Globe, FileText, Lock } from 'lucide-react';

const PAGES = [
    {
        name: 'Coming Soon Splash',
        path: '/',
        status: 'live',
        description: 'Landing splash page with countdown',
        icon: Globe,
    },
    {
        name: 'Elite Program Registration',
        path: '/eliteprogram/2026registration',
        status: 'live',
        description: 'Full landing page with application form',
        icon: FileText,
    },
    {
        name: 'Elite Program Registration (Alt)',
        path: '/eliteprogram/2026registrations',
        status: 'live',
        description: 'Alternate URL for the registration page',
        icon: FileText,
    },
    {
        name: 'Privacy Policy',
        path: '/privacy-policy',
        status: 'live',
        description: 'Legal privacy policy page',
        icon: Lock,
    },
    {
        name: 'Terms & Conditions',
        path: '/terms-conditions',
        status: 'live',
        description: 'Legal terms and conditions page',
        icon: Lock,
    },
    {
        name: 'Admin Portal',
        path: '/rramadmin_26',
        status: 'live',
        description: 'Admin dashboard login',
        icon: Lock,
    },
];

const PagesManager = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider">PAGES</h1>
                <p className="text-slate-400 text-sm mt-1">All pages on rramelbourne.com</p>
            </div>

            <div className="space-y-3">
                {PAGES.map((page, i) => {
                    const Icon = page.icon;
                    return (
                        <motion.div
                            key={page.path}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] transition-all group"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                        <Icon className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm">{page.name}</h3>
                                        <p className="text-slate-500 text-xs mt-0.5 font-mono">{page.path}</p>
                                        <p className="text-slate-400 text-xs mt-1">{page.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${page.status === 'live'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${page.status === 'live' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                                        {page.status === 'live' ? 'Live' : 'Draft'}
                                    </span>
                                    <a
                                        href={page.path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Future CMS note */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <Globe className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-white font-bold text-sm mb-2">Page Editor Coming Soon</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                    Content management, page creation, and live editing will be available in a future update.
                </p>
            </div>
        </div>
    );
};

export default PagesManager;
