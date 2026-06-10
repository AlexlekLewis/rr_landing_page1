import { useEffect, useRef, useState } from "react";
import { HONEYPOT_FIELD } from "../../lib/security/bot.js";

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

/**
 * Bot defenses for a public form:
 *   - an invisible honeypot input (report its value via onHoneypot)
 *   - a Cloudflare Turnstile widget when VITE_TURNSTILE_SITE_KEY is set (report
 *     the solved token via onToken)
 *
 * When no site key is configured it renders only the honeypot and reports a null
 * token immediately, so the form stays fully usable in dev/preview. The server
 * still enforces (or skips) verification via assertHuman() in bot.js.
 */
export default function BotGuard({ onToken, onHoneypot, className = "" }) {
  const ref = useRef(null);
  const widgetId = useRef(null);
  const [, setReady] = useState(!SITE_KEY);

  useEffect(() => {
    if (!SITE_KEY) {
      onToken && onToken(null);
      return;
    }
    let cancelled = false;
    let interval = null;

    function render() {
      if (cancelled || !window.turnstile || !ref.current || widgetId.current !== null) return;
      widgetId.current = window.turnstile.render(ref.current, {
        sitekey: SITE_KEY,
        callback: (t) => onToken && onToken(t),
        "expired-callback": () => onToken && onToken(null),
        "error-callback": () => onToken && onToken(null),
      });
      setReady(true);
    }

    if (window.turnstile) {
      render();
    } else {
      let s = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
      if (!s) {
        s = document.createElement("script");
        s.src = SCRIPT_SRC;
        s.async = true;
        s.defer = true;
        document.head.appendChild(s);
      }
      s.addEventListener("load", render);
      interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          render();
        }
      }, 200);
    }

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [onToken]);

  return (
    <div className={className}>
      {/* Honeypot — off-screen, not a tab stop, hidden from screen readers. */}
      <input
        type="text"
        name={HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        onChange={(e) => onHoneypot && onHoneypot(e.target.value)}
      />
      {SITE_KEY ? <div ref={ref} /> : null}
    </div>
  );
}
