// Shared helpers for the coach-led private coaching pages (no components here).
export const input = (bad) => `w-full bg-slate-50 border ${bad ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-rr-dark font-medium focus:outline-none focus:border-rr-pink text-base sm:text-sm`;
export const labelCls = 'block text-xs font-black text-rr-dark uppercase tracking-widest mb-2';
export const utm = () => {
    const p = new URLSearchParams(window.location.search);
    return { utm_source: p.get('utm_source'), utm_medium: p.get('utm_medium'), utm_campaign: p.get('utm_campaign'), utm_content: p.get('utm_content') };
};
// Australian mobile → digits for wa.me.
export const waDigits = (phone) => {
    const d = String(phone || '').replace(/\D/g, '');
    if (d.startsWith('61')) return d;
    if (d.startsWith('0')) return `61${d.slice(1)}`;
    return d;
};
export const telHref = (phone) => `tel:${String(phone || '').replace(/[^\d+]/g, '')}`;
