import React, { useEffect, useRef, useState } from 'react';
let loading;
function loadWidget() {
  if (globalThis.turnstile) return Promise.resolve(globalThis.turnstile);
  if (!loading) loading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.async = true; script.defer = true;
    script.onload = () => globalThis.turnstile ? resolve(globalThis.turnstile) : reject(new Error('unavailable'));
    script.onerror = () => { loading = null; script.remove(); reject(new Error('unavailable')); };
    document.head.append(script);
  });
  return loading;
}
export default function Turnstile({ onToken, reset = 0 }) {
  const container = useRef(null), [error, setError] = useState('');
  useEffect(() => {
    const sitekey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
    let active = true, widget, api;
    if (!sitekey) return;
    loadWidget().then(loaded => {
      if (!active || !container.current) return; api = loaded;
      widget = api.render(container.current, { sitekey, theme: 'light', size: 'flexible', callback: token => { if (active) { setError(''); onToken(token); } }, 'expired-callback': () => { if (active) onToken(''); }, 'error-callback': () => { if (active) { onToken(''); setError('The security check couldn’t load. Try again when your connection is back.'); } } });
    }).catch(() => { if (active) setError('The security check couldn’t load. Try again when your connection is back.'); });
    return () => { active = false; if (api && widget !== undefined) api.remove(widget); };
  }, [reset, onToken]);
  return <div className="booking-security ph-no-capture"><p className="booking-help">Security check</p><div ref={container} />{!import.meta.env.VITE_TURNSTILE_SITE_KEY ? <p role="alert">The security check is unavailable. Submissions are temporarily closed.</p> : error ? <p role="alert">{error}</p> : null}</div>;
}
