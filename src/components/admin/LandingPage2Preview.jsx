import React from 'react';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage2Preview = () => {
    return (
        <div className="flex flex-col h-[calc(100vh-2rem)]">
            <div className="flex items-center justify-between mb-4 shrink-0">
                <div className="flex items-center gap-4">
                    <Link to="/rramadmin_26/pages" className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-wider">PREVIEW</h1>
                        <p className="text-slate-400 text-sm">Landing Page 2 (Assessment Invite)</p>
                    </div>
                </div>
                <a
                    href="/invite"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
                >
                    <ExternalLink className="w-4 h-4" />
                    Open Live
                </a>
            </div>

            <div className="flex-1 bg-white rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl">
                <iframe
                    src="/invite"
                    className="w-full h-full border-0 absolute inset-0 bg-rr-dark"
                    title="Landing Page 2 Preview"
                />
            </div>
        </div>
    );
};

export default LandingPage2Preview;
