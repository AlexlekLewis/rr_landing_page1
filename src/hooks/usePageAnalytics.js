import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Comprehensive page analytics tracker.
 *
 * Tracks: page_view, scroll_depth, section_visible, cta_click,
 *         time_on_page, form_start, form_submit, exit
 *
 * Usage:
 *   const { trackEvent } = usePageAnalytics('/eliteprogram/2026registration', {
 *     sections: ['hero', 'intro', 'features', 'apply'],
 *     ctaSelectors: ['[data-cta]', '.apply-btn'],
 *   });
 */

const getSessionId = () => {
    let sid = sessionStorage.getItem('rra_sid');
    if (!sid) {
        sid = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        sessionStorage.setItem('rra_sid', sid);
    }
    return sid;
};

const getDeviceType = (w) => {
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
};

const usePageAnalytics = (pagePath, options = {}) => {
    const { sections = [], ctaSelectors = [] } = options;
    const sessionId = useRef(getSessionId());
    const firedScrollDepths = useRef(new Set());
    const firedTimeMilestones = useRef(new Set());
    const firedSections = useRef(new Set());
    const startTimeRef = useRef(Date.now());
    const mounted = useRef(false);

    // Queue-based batching for performance
    const queue = useRef([]);
    const flushTimer = useRef(null);

    const flushQueue = useCallback(async () => {
        if (queue.current.length === 0) return;
        const batch = [...queue.current];
        queue.current = [];

        try {
            await supabase.from('page_analytics').insert(batch);
        } catch (err) {
            console.error('[Analytics] flush error:', err);
        }
    }, []);

    const enqueue = useCallback((eventType, eventData = {}) => {
        const row = {
            session_id: sessionId.current,
            page_path: pagePath,
            event_type: eventType,
            event_data: eventData,
            referrer: document.referrer || null,
            user_agent: navigator.userAgent,
            screen_width: window.innerWidth,
            screen_height: window.innerHeight,
            device_type: getDeviceType(window.innerWidth),
        };

        // Critical events flush immediately
        if (eventType === 'page_view' || eventType === 'form_submit') {
            supabase.from('page_analytics').insert([row]).then(() => { }).catch(() => { });
            return;
        }

        queue.current.push(row);

        // Auto-flush after 2 seconds or if batch reaches 3
        clearTimeout(flushTimer.current);
        if (queue.current.length >= 3) {
            flushQueue();
        } else {
            flushTimer.current = setTimeout(flushQueue, 2000);
        }
    }, [pagePath, flushQueue]);

    // Immediate track (for critical events like page_view)
    const trackEvent = useCallback((eventType, eventData = {}) => {
        enqueue(eventType, eventData);
    }, [enqueue]);

    useEffect(() => {
        if (mounted.current) return;
        mounted.current = true;

        // ─── 1. Page View ───────────────────────────────────────
        enqueue('page_view', {
            referrer: document.referrer,
            url: window.location.href,
            timestamp: new Date().toISOString(),
        });

        // ─── 2. Scroll Depth Tracking ───────────────────────────
        const milestones = [10, 25, 50, 75, 90, 100];
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight <= 0) return;
            const pct = Math.round((scrollTop / docHeight) * 100);

            for (const m of milestones) {
                if (pct >= m && !firedScrollDepths.current.has(m)) {
                    firedScrollDepths.current.add(m);
                    enqueue('scroll_depth', { depth: m });
                }
            }
        };

        let scrollRaf;
        const throttledScroll = () => {
            cancelAnimationFrame(scrollRaf);
            scrollRaf = requestAnimationFrame(handleScroll);
        };
        window.addEventListener('scroll', throttledScroll, { passive: true });

        // ─── 3. Section Visibility (IntersectionObserver) ───────
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !firedSections.current.has(entry.target.id)) {
                        firedSections.current.add(entry.target.id);
                        enqueue('section_visible', {
                            section: entry.target.id,
                            timestamp: new Date().toISOString(),
                        });
                    }
                });
            },
            { threshold: 0.3 }
        );

        // Observe after a short delay to let DOM render
        const observeTimer = setTimeout(() => {
            sections.forEach((sectionId) => {
                const el = document.getElementById(sectionId);
                if (el) observer.observe(el);
            });
        }, 1000);

        // ─── 4. CTA Click Tracking ──────────────────────────────
        const handleCtaClick = (e) => {
            const target = e.target.closest('[data-cta]');
            if (target) {
                enqueue('cta_click', {
                    cta: target.dataset.cta || target.textContent?.trim().substring(0, 60),
                    section: target.closest('[id]')?.id || 'unknown',
                });
            }
        };
        document.addEventListener('click', handleCtaClick);

        // ─── 5. Time on Page Milestones ─────────────────────────
        const timeMilestones = [10, 30, 60, 120, 300]; // seconds
        const timeInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
            for (const m of timeMilestones) {
                if (elapsed >= m && !firedTimeMilestones.current.has(m)) {
                    firedTimeMilestones.current.add(m);
                    enqueue('time_on_page', { seconds: m });
                }
            }
        }, 5000);

        // ─── 6. Exit Tracking ───────────────────────────────────
        const handleBeforeUnload = () => {
            const totalSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
            const exitRow = {
                session_id: sessionId.current,
                page_path: pagePath,
                event_type: 'exit',
                event_data: { total_seconds: totalSeconds, max_scroll: Math.max(...firedScrollDepths.current, 0) },
                referrer: document.referrer || null,
                user_agent: navigator.userAgent,
                screen_width: window.innerWidth,
                screen_height: window.innerHeight,
                device_type: getDeviceType(window.innerWidth),
            };
            const payload = [exitRow, ...queue.current];
            queue.current = [];

            // Use fetch with keepalive (works like sendBeacon but supports headers)
            const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/page_analytics`;
            const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
            if (anonKey && payload.length > 0) {
                try {
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': anonKey,
                            'Authorization': `Bearer ${anonKey}`,
                            'Prefer': 'return=minimal',
                        },
                        body: JSON.stringify(payload),
                        keepalive: true,
                    }).catch(() => { });
                } catch { /* best effort */ }
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        // ─── Cleanup ────────────────────────────────────────────
        return () => {
            window.removeEventListener('scroll', throttledScroll);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('click', handleCtaClick);
            clearInterval(timeInterval);
            clearTimeout(observeTimer);
            clearTimeout(flushTimer.current);
            cancelAnimationFrame(scrollRaf);
            observer.disconnect();
            flushQueue();
        };
    }, [pagePath, sections, enqueue, flushQueue]);

    return { trackEvent };
};

export default usePageAnalytics;
