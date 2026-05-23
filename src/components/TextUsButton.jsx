import React, { useState, useEffect } from 'react';

const SMS_NUMBER = '0421261825';
const MOBILE_MESSAGE = 'Hi - Let us know if you have a question!';
const DESKTOP_MESSAGE = 'Hi, I have a question about RRA Melbourne programs';

const TextUsButton = () => {
    const [tooltip, setTooltip] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);

    useEffect(() => {
        const sync = () => setCartOpen(document.body.classList.contains('cart-drawer-open'));
        sync();
        const observer = new MutationObserver(sync);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const handleClick = () => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const message = isMobile ? MOBILE_MESSAGE : DESKTOP_MESSAGE;
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        const separator = isIOS ? '&' : '?';
        window.open(`sms:${SMS_NUMBER}${separator}body=${encodeURIComponent(message)}`, '_self');
    };

    if (cartOpen) return null;

    return (
        <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-3">
            {tooltip && (
                <div className="bg-rr-dark text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg whitespace-nowrap">
                    Text us: {SMS_NUMBER}
                </div>
            )}
            <button
                onClick={handleClick}
                onMouseEnter={() => setTooltip(true)}
                onMouseLeave={() => setTooltip(false)}
                aria-label="Text us"
                className="flex items-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-xs px-4 py-3 rounded-full shadow-lg hover:shadow-[0_0_24px_rgba(229,6,149,0.5)] transition-all duration-300 hover:scale-105"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Text Us
            </button>
        </div>
    );
};

export default TextUsButton;
