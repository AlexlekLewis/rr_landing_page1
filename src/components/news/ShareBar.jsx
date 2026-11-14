import React, { useState } from 'react';
import { storyUrl } from './news';

// Copy-link and share buttons for a story (same set as the Power Cricket site).
// Links always use the live address, even from a preview.
const BUTTON = 'inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-rr-dark transition-colors hover:border-rr-pink hover:text-rr-pink';

async function copy(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        const box = document.createElement('textarea');
        box.value = text;
        box.setAttribute('readonly', '');
        box.style.position = 'fixed';
        box.style.opacity = '0';
        document.body.append(box);
        box.select();
        const ok = document.execCommand?.('copy') ?? false;
        box.remove();
        return ok;
    }
}

const ShareBar = ({ story }) => {
    const [copied, setCopied] = useState(false);
    const url = storyUrl(story.id);
    const enc = encodeURIComponent;
    const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
    return (
        <div className="flex flex-wrap items-center gap-2" aria-label="Share this story">
            <button type="button" className={BUTTON} data-cta={`news-share-copy-${story.id}`}
                onClick={async () => { if (await copy(url)) { setCopied(true); setTimeout(() => setCopied(false), 2000); } }}>
                {copied ? 'Link copied' : 'Copy link'}
            </button>
            {canShare && (
                <button type="button" className={BUTTON} data-cta={`news-share-device-${story.id}`}
                    onClick={() => navigator.share({ title: story.title, text: story.excerpt, url }).catch(() => {})}>
                    Share
                </button>
            )}
            <a className={BUTTON} data-cta={`news-share-facebook-${story.id}`} href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`} target="_blank" rel="noopener noreferrer">Facebook</a>
            <a className={BUTTON} data-cta={`news-share-whatsapp-${story.id}`} href={`https://wa.me/?text=${enc(`${story.title} ${url}`)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a className={BUTTON} data-cta={`news-share-x-${story.id}`} href={`https://x.com/intent/post?url=${enc(url)}&text=${enc(story.title)}`} target="_blank" rel="noopener noreferrer">X</a>
        </div>
    );
};

export default ShareBar;
