// Tag a link we hand out (WhatsApp share, email share, QR poster) so the visit
// it brings back is credited to that channel instead of showing up as "direct".
//
//   withUtm('https://rramelbourne.com/spin-club', { source: 'whatsapp', medium: 'share', campaign: 'spin-club' })
//   → https://rramelbourne.com/spin-club?utm_source=whatsapp&utm_medium=share&utm_campaign=spin-club
//
// Existing UTM values on the URL are kept (never overwritten). Relative URLs
// stay relative. Non-http(s) URLs (mailto:, tel:) are returned unchanged.
export const withUtm = (url, { source, medium, campaign, content } = {}) => {
  try {
    if (!url || typeof url !== 'string') return url;
    if (/^(mailto|tel|sms|whatsapp):/i.test(url)) return url;
    const isAbsolute = /^https?:\/\//i.test(url);
    const u = new URL(url, 'https://rramelbourne.com');
    const set = (k, v) => { if (v && !u.searchParams.get(k)) u.searchParams.set(k, v); };
    set('utm_source', source);
    set('utm_medium', medium);
    set('utm_campaign', campaign);
    set('utm_content', content);
    return isAbsolute ? u.toString() : `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return url;
  }
};
