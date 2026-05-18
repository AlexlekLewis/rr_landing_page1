import React, { useState } from 'react';
import { FileText, ExternalLink, Loader2 } from 'lucide-react';
import { getSignedCVUrl } from '../../lib/storage';

// Renders the "CV / Resume" row in admin detail panes.
// `stored` is whatever sits in cv_url — either a legacy https:// URL
// (public bucket era) or a new storage path. On click we resolve to
// a short-lived signed URL via Supabase Storage and open it in a new
// tab. Doing the resolve on click (not on render) avoids minting
// signed URLs for rows the admin never opens, and lets the URL be
// short-TTL (5 min) without breaking the link.
const CVLink = ({ stored, label = 'CV / Resume' }) => {
    const [resolving, setResolving] = useState(false);
    const [error, setError] = useState(null);

    if (!stored) return null;

    const handleClick = async (e) => {
        e.preventDefault();
        setResolving(true);
        setError(null);
        try {
            const url = await getSignedCVUrl(stored);
            if (!url) throw new Error('No URL returned');
            window.open(url, '_blank', 'noopener,noreferrer');
        } catch (err) {
            console.error('Failed to resolve CV URL:', err);
            setError('Could not open');
        } finally {
            setResolving(false);
        }
    };

    const display = stored.length > 40 ? stored.substring(0, 40) + '…' : stored;

    return (
        <div className="flex items-start gap-3 py-2">
            <FileText className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
            <div className="min-w-0">
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">{label}</p>
                <a
                    href="#"
                    onClick={handleClick}
                    className="text-rr-pink text-sm hover:underline flex items-center gap-1"
                >
                    {resolving ? <Loader2 className="w-3 h-3 animate-spin" /> : display}
                    {!resolving && <ExternalLink className="w-3 h-3" />}
                </a>
                {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
            </div>
        </div>
    );
};

export default CVLink;
