import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useRealtimeSync from '../../hooks/useRealtimeSync';
import { MELBOURNE_SUBURBS, normaliseSuburbForLookup, MELBOURNE_CENTRE } from './melbourneSuburbs';

// Bubble size: scale linearly between MIN_RADIUS and MAX_RADIUS based on count.
const MIN_RADIUS = 6;
const MAX_RADIUS = 28;

// Bubble colour: coloured by conversion rate (paid / inquiries).
// 0% red → 50% amber → 100% green.
const conversionColour = (rate) => {
    if (rate == null) return '#94a3b8'; // slate — no data
    if (rate >= 0.5) return '#10b981';  // emerald
    if (rate >= 0.25) return '#f59e0b'; // amber
    if (rate >= 0.10) return '#ef4444'; // red — leaky funnel
    return '#7c3aed';                    // violet — very low conversion
};

const MelbourneInquiryMap = () => {
    const [leads, setLeads] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const [leadsRes, regsRes] = await Promise.all([
                supabase.from('crm_leads').select('id, suburb, source_type, stage, email, parent_email').eq('is_archived', false),
                supabase.from('program_registrations').select('id, customer_email, program').eq('payment_status', 'completed'),
            ]);
            if (leadsRes.error) throw leadsRes.error;
            if (regsRes.error) throw regsRes.error;
            setLeads(leadsRes.data || []);
            setRegistrations(regsRes.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);
    useRealtimeSync(['crm_leads', 'program_registrations'], fetchData);

    // Build a set of paying-customer emails for fast O(1) lookup.
    const paidEmails = useMemo(() => {
        const s = new Set();
        for (const r of registrations) if (r.customer_email) s.add(r.customer_email.toLowerCase().trim());
        return s;
    }, [registrations]);

    // Aggregate leads by suburb. Each suburb gets {inquiries, paid, conversionRate, lat, lng, name}.
    const suburbAggregates = useMemo(() => {
        const buckets = new Map();
        let unmappedSuburbs = 0;
        let unmappedInquiries = 0;
        for (const lead of leads) {
            const norm = normaliseSuburbForLookup(lead.suburb);
            if (!norm) continue;
            const coords = MELBOURNE_SUBURBS[norm];
            if (!coords) {
                unmappedSuburbs++;
                unmappedInquiries++;
                continue;
            }
            if (!buckets.has(norm)) {
                buckets.set(norm, { name: norm, ...coords, inquiries: 0, paid: 0, sources: {} });
            }
            const b = buckets.get(norm);
            b.inquiries++;
            // paid match: either lead's own email OR parent_email matched a Stripe payer email
            const e1 = (lead.email || '').toLowerCase().trim();
            const e2 = (lead.parent_email || '').toLowerCase().trim();
            if ((e1 && paidEmails.has(e1)) || (e2 && paidEmails.has(e2))) b.paid++;
            const src = lead.source_type || 'unknown';
            b.sources[src] = (b.sources[src] || 0) + 1;
        }
        const rows = Array.from(buckets.values()).map(b => ({
            ...b,
            conversionRate: b.inquiries > 0 ? b.paid / b.inquiries : null,
        }));
        return { rows, unmappedSuburbs, unmappedInquiries };
    }, [leads, paidEmails]);

    const maxInquiries = useMemo(
        () => suburbAggregates.rows.reduce((m, r) => Math.max(m, r.inquiries), 0),
        [suburbAggregates]
    );

    const radiusFor = (count) => {
        if (maxInquiries === 0) return MIN_RADIUS;
        const t = Math.sqrt(count / maxInquiries); // sqrt softens the spread between huge + small
        return MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * t;
    };

    if (loading) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl h-[420px] flex items-center justify-center">
                <svg className="animate-spin w-7 h-7 text-rr-pink" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                    <p className="text-red-400 text-sm font-bold">Map failed to load</p>
                    <p className="text-red-400/70 text-xs mt-1">{error}</p>
                </div>
            </div>
        );
    }

    const totalInquiries = leads.length;
    const totalPaidLeads = suburbAggregates.rows.reduce((s, r) => s + r.paid, 0);
    const overallConversion = totalInquiries > 0 ? Math.round((totalPaidLeads / totalInquiries) * 100) : 0;

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rr-pink" />
                    <h3 className="text-sm font-black text-white tracking-wider uppercase">Inquiry Map — Melbourne</h3>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    <span><span className="text-white">{totalInquiries}</span> inquiries</span>
                    <span><span className="text-white">{suburbAggregates.rows.length}</span> suburbs mapped</span>
                    <span><span className="text-white">{overallConversion}%</span> overall conversion</span>
                </div>
            </div>

            <div className="h-[480px] w-full relative">
                <MapContainer
                    center={[MELBOURNE_CENTRE.lat, MELBOURNE_CENTRE.lng]}
                    zoom={MELBOURNE_CENTRE.zoom}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%', background: '#0f172a' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    {suburbAggregates.rows.map(s => (
                        <CircleMarker
                            key={s.name}
                            center={[s.lat, s.lng]}
                            radius={radiusFor(s.inquiries)}
                            pathOptions={{
                                color: conversionColour(s.conversionRate),
                                fillColor: conversionColour(s.conversionRate),
                                fillOpacity: 0.55,
                                weight: 1.5,
                            }}
                        >
                            <Tooltip direction="top" offset={[0, -4]} opacity={0.9}>
                                <div className="text-xs">
                                    <strong className="capitalize">{s.name}</strong> — {s.inquiries} inquiries
                                </div>
                            </Tooltip>
                            <Popup>
                                <div className="text-xs">
                                    <p className="font-black uppercase tracking-wider mb-1 capitalize">{s.name}</p>
                                    <p>Inquiries: <strong>{s.inquiries}</strong></p>
                                    <p>Paid: <strong>{s.paid}</strong></p>
                                    <p>Conversion: <strong>{s.conversionRate != null ? `${Math.round(s.conversionRate * 100)}%` : '—'}</strong></p>
                                    {Object.keys(s.sources).length > 0 && (
                                        <div className="mt-2 pt-2 border-t border-slate-200">
                                            <p className="font-bold mb-0.5">By source:</p>
                                            {Object.entries(s.sources).sort((a, b) => b[1] - a[1]).map(([src, n]) => (
                                                <div key={src}>· {src.replace(/_/g, ' ')}: {n}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>
            </div>

            <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between flex-wrap gap-2 text-[11px]">
                <div className="flex items-center gap-3 text-slate-400">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{background:'#10b981'}}></span>≥50%</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{background:'#f59e0b'}}></span>25–49%</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{background:'#ef4444'}}></span>10–24%</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{background:'#7c3aed'}}></span>&lt;10%</span>
                    <span className="text-slate-600">bubble = inquiry count · colour = conversion rate</span>
                </div>
                {suburbAggregates.unmappedSuburbs > 0 && (
                    <span className="text-slate-500" title="Suburbs not yet in the lookup table">
                        {suburbAggregates.unmappedInquiries} inquiries from {suburbAggregates.unmappedSuburbs} unmapped suburb{suburbAggregates.unmappedSuburbs === 1 ? '' : 's'} — add to <code>melbourneSuburbs.js</code>
                    </span>
                )}
            </div>
        </div>
    );
};

export default MelbourneInquiryMap;
