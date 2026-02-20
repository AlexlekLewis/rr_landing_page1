import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, CheckCircle2, Users, X
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../../lib/supabase';
import useRealtimeSync from '../../hooks/useRealtimeSync';

// ── Melbourne Suburb Coordinates ────────────────────────────────────────────────
const SUBURB_COORDS = {
    'hawthorn': [-37.822, 145.023],
    'hawthorn east': [-37.822, 145.043],
    'cranbourne east': [-38.100, 145.297],
    'cranbourne west': [-38.099, 145.249],
    'cranbourne north': [-38.069, 145.284],
    'cranbourne': [-38.099, 145.283],
    'clyde north': [-38.103, 145.347],
    'clyde': [-38.133, 145.342],
    'bentleigh east': [-37.919, 145.060],
    'glen waverley': [-37.878, 145.163],
    'berwick': [-38.047, 145.356],
    'truganina': [-37.830, 144.737],
    'wantirna': [-37.849, 145.221],
    'diggers rest': [-37.630, 144.718],
    'donvale': [-37.795, 145.175],
    'wollert': [-37.583, 145.083],
    'officer': [-38.062, 145.415],
    'mount waverley': [-37.876, 145.123],
    'ashburton': [-37.865, 145.079],
    'eltham': [-37.714, 145.148],
    'wendouree': [-37.545, 143.826],
    'mernda': [-37.601, 145.094],
    'rowville': [-37.926, 145.237],
    'docklands': [-37.816, 144.946],
    'manor lakes': [-37.872, 144.620],
    'malvern east': [-37.872, 145.056],
    'lynbrook': [-38.055, 145.256],
    'whittlesea': [-37.516, 145.117],
    'ascot vale': [-37.776, 144.917],
    'mitcham': [-37.814, 145.191],
    'mickleham': [-37.547, 144.903],
    'doreen': [-37.596, 145.139],
    'plenty': [-37.664, 145.112],
    'narre warren south': [-38.037, 145.297],
    'narre warren': [-38.028, 145.302],
    'mordialloc': [-38.004, 145.088],
    'brighton': [-37.912, 144.993],
    'wheelers hill': [-37.899, 145.193],
    'northcote': [-37.770, 145.001],
    'carrum downs': [-38.089, 145.166],
    'dandenong north': [-37.955, 145.212],
    'fawkner': [-37.713, 144.964],
    'crib point': [-38.365, 145.213],
    'bangholme': [-38.037, 145.161],
    'donnybrook': [-37.524, 145.058],
    'vermont': [-37.836, 145.196],
    'mulgrave': [-37.923, 145.172],
    'balwyn north': [-37.791, 145.093],
    'beaumaris': [-37.987, 145.032],
    'ballarat': [-37.551, 143.847],
    'camberwell': [-37.840, 145.069],
    'malvern': [-37.857, 145.029],
    'caulfield': [-37.879, 145.028],
    'st kilda': [-37.867, 144.979],
    'south yarra': [-37.839, 144.993],
    'richmond': [-37.819, 145.001],
    'kew': [-37.808, 145.035],
    'box hill': [-37.819, 145.122],
    'frankston': [-38.143, 145.126],
    'pakenham': [-38.075, 145.488],
    'sunbury': [-37.581, 144.728],
    'werribee': [-37.901, 144.664],
    'melton': [-37.685, 144.581],
    'point cook': [-37.908, 144.753],
    'tarneit': [-37.838, 144.697],
    'caroline springs': [-37.738, 144.735],
    'craigieburn': [-37.596, 144.950],
    'south morang': [-37.650, 145.090],
    'epping': [-37.648, 145.026],
    'thomastown': [-37.682, 145.014],
    'reservoir': [-37.709, 145.005],
    'preston': [-37.746, 145.011],
    'coburg': [-37.743, 144.965],
    'brunswick': [-37.766, 144.961],
    'essendon': [-37.749, 144.916],
    'footscray': [-37.800, 144.901],
};

const MELBOURNE_CENTER = [-37.81, 144.96];

// Stage colours matching the pipeline
const STAGE_COLORS = {
    'invited': '#8B5CF6',
    'applied': '#3B82F6',
    'selected': '#F59E0B',
    'credentials_sent': '#EC4899',
    'accepted': '#10B981',
};

const AGE_BRACKETS = [
    { label: 'All', min: 0, max: 100 },
    { label: 'U13', min: 0, max: 12 },
    { label: 'U14', min: 13, max: 13 },
    { label: 'U15', min: 14, max: 14 },
    { label: 'U16', min: 15, max: 15 },
    { label: 'U17', min: 16, max: 16 },
    { label: '18+', min: 18, max: 100 },
];

// Normalise suburb text → lookup key
const normaliseSuburb = (raw) => {
    if (!raw) return null;
    return raw
        .toLowerCase()
        .trim()
        .replace(/\d{4}$/g, '')          // strip postcodes
        .replace(/,?\s*(victoria|vic|australia).*$/i, '')
        .replace(/^\d+\s+\w+\s+(st|street|cres|crescent|way|rd|road|ave|avenue|dr|drive)\s+/i, '') // strip addresses
        .replace(/\s+cricket\s+club$/i, '')
        .trim();
};

const SelectionAnalytics = () => {
    const [applications, setApplications] = useState([]);
    const [entries, setEntries] = useState([]);
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [ageBracket, setAgeBracket] = useState('All');
    const [suburbFilter, setSuburbFilter] = useState('all');
    const [clubFilter, setClubFilter] = useState('all');
    const [stageFilter, setStageFilter] = useState('all');
    const [textSearch, setTextSearch] = useState('');

    // Selection
    const [selected, setSelected] = useState(new Set());
    const [approving, setApproving] = useState(false);

    const fetchData = useCallback(async () => {
        const [appsRes, entriesRes, stagesRes] = await Promise.all([
            supabase.from('applications').select('*').order('created_at', { ascending: false }),
            supabase.from('pipeline_entries').select('*'),
            supabase.from('pipeline_stages').select('*').order('sort_order'),
        ]);
        setApplications(appsRes.data || []);
        setEntries(entriesRes.data || []);
        setStages(stagesRes.data || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useRealtimeSync({ onApplicationChange: fetchData, onEntryChange: fetchData });

    const getEntry = (appId) => entries.find(e => e.application_id === appId);
    const getStage = (slug) => stages.find(s => s.slug === slug);

    // Unique suburbs & clubs for dropdowns
    const uniqueSuburbs = useMemo(() => {
        const subs = [...new Set(applications.map(a => normaliseSuburb(a.suburb)).filter(Boolean))].sort();
        return subs;
    }, [applications]);

    const uniqueClubs = useMemo(() => {
        const clubs = [...new Set(applications.map(a => a.club?.trim()).filter(Boolean))].sort();
        return clubs;
    }, [applications]);

    // Filtered applications
    const filtered = useMemo(() => {
        const bracket = AGE_BRACKETS.find(b => b.label === ageBracket) || AGE_BRACKETS[0];

        return applications.filter(app => {
            // Age filter
            if (ageBracket !== 'All') {
                const age = app.age || 0;
                if (age < bracket.min || age > bracket.max) return false;
            }

            // Suburb filter
            if (suburbFilter !== 'all') {
                if (normaliseSuburb(app.suburb) !== suburbFilter) return false;
            }

            // Club filter
            if (clubFilter !== 'all') {
                if (app.club?.trim() !== clubFilter) return false;
            }

            // Stage filter
            if (stageFilter !== 'all') {
                const entry = getEntry(app.id);
                if (entry?.stage_slug !== stageFilter) return false;
            }

            // Text search (bio, goals, history)
            if (textSearch) {
                const q = textSearch.toLowerCase();
                const searchable = `${app.bio || ''} ${app.goals || ''} ${app.history || ''} ${app.first_name || ''} ${app.last_name || ''}`.toLowerCase();
                if (!searchable.includes(q)) return false;
            }

            return true;
        });
    }, [applications, entries, ageBracket, suburbFilter, clubFilter, stageFilter, textSearch]);

    // Map data: group by suburb
    const mapPins = useMemo(() => {
        const pins = [];
        filtered.forEach(app => {
            const key = normaliseSuburb(app.suburb);
            if (!key || !SUBURB_COORDS[key]) return;
            const [lat, lng] = SUBURB_COORDS[key];
            const entry = getEntry(app.id);
            pins.push({ app, lat, lng, stage: entry?.stage_slug || 'applied' });
        });
        return pins;
    }, [filtered, entries]);



    const toggleSelect = (id) => {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleAll = () => {
        if (selected.size === filtered.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(filtered.map(a => a.id)));
        }
    };

    const handleApproveSelected = async () => {
        if (selected.size === 0) return;
        setApproving(true);

        for (const appId of selected) {
            const entry = getEntry(appId);
            if (entry && entry.stage_slug !== 'selected') {
                await supabase.from('pipeline_entries')
                    .update({ stage_slug: 'selected', updated_at: new Date().toISOString() })
                    .eq('id', entry.id);

                await supabase.from('pipeline_activity_log').insert({
                    application_id: appId,
                    from_stage: entry.stage_slug,
                    to_stage: 'selected',
                    action: 'selection_approved',
                    performed_by: 'admin',
                });
            }
        }

        setSelected(new Set());
        setApproving(false);
        // Refresh data
        const [entriesRes] = await Promise.all([
            supabase.from('pipeline_entries').select('*'),
        ]);
        setEntries(entriesRes.data || []);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <svg className="animate-spin w-8 h-8 text-rr-pink" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider">SELECTION</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {filtered.length} of {applications.length} applicants match filters
                    </p>
                </div>

                {selected.size > 0 && (
                    <motion.button
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={handleApproveSelected}
                        disabled={approving}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rr-pink to-rr-blue text-white font-bold text-sm shadow-lg shadow-rr-pink/20 hover:shadow-rr-pink/40 transition-all disabled:opacity-50"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        {approving ? 'Approving...' : `Approve ${selected.size} Selected`}
                    </motion.button>
                )}
            </div>

            {/* Filter Bar */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex flex-wrap gap-3 items-center">
                    {/* Age brackets */}
                    <div className="flex gap-1 bg-white/5 rounded-xl p-1">
                        {AGE_BRACKETS.map(b => (
                            <button
                                key={b.label}
                                onClick={() => setAgeBracket(b.label)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${ageBracket === b.label
                                    ? 'bg-rr-pink text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {b.label}
                            </button>
                        ))}
                    </div>

                    {/* Suburb dropdown */}
                    <select
                        value={suburbFilter}
                        onChange={(e) => setSuburbFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-rr-pink/50"
                    >
                        <option value="all">All Suburbs</option>
                        {uniqueSuburbs.map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                    </select>

                    {/* Club dropdown */}
                    <select
                        value={clubFilter}
                        onChange={(e) => setClubFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-rr-pink/50"
                    >
                        <option value="all">All Clubs</option>
                        {uniqueClubs.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    {/* Stage filter */}
                    <select
                        value={stageFilter}
                        onChange={(e) => setStageFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-rr-pink/50"
                    >
                        <option value="all">All Stages</option>
                        {stages.map(s => (
                            <option key={s.slug} value={s.slug}>{s.name}</option>
                        ))}
                    </select>

                    {/* Text search */}
                    <div className="relative flex-1 min-w-[180px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                        <input
                            type="text"
                            value={textSearch}
                            onChange={(e) => setTextSearch(e.target.value)}
                            placeholder="Search bio, goals, history..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-rr-pink/50"
                        />
                    </div>

                    {/* Clear filters */}
                    {(ageBracket !== 'All' || suburbFilter !== 'all' || clubFilter !== 'all' || stageFilter !== 'all' || textSearch) && (
                        <button
                            onClick={() => { setAgeBracket('All'); setSuburbFilter('all'); setClubFilter('all'); setStageFilter('all'); setTextSearch(''); }}
                            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-xs font-medium"
                        >
                            <X className="w-3 h-3" /> Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Melbourne Map */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative" style={{ height: '500px' }}>
                <MapContainer
                    center={MELBOURNE_CENTER}
                    zoom={10}
                    style={{ height: '100%', width: '100%' }}
                    className="rounded-2xl"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    {mapPins.map((pin, i) => (
                        <CircleMarker
                            key={`${pin.app.id}-${i}`}
                            center={[pin.lat, pin.lng]}
                            radius={8}
                            fillColor={STAGE_COLORS[pin.stage] || '#3B82F6'}
                            fillOpacity={0.85}
                            color="rgba(255,255,255,0.3)"
                            weight={2}
                        >
                            <Popup>
                                <div className="text-xs">
                                    <p className="font-bold">{pin.app.first_name} {pin.app.last_name}</p>
                                    <p>Age: {pin.app.age || '—'}</p>
                                    <p>Club: {pin.app.club || '—'}</p>
                                    <p>Suburb: {pin.app.suburb || '—'}</p>
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>

                {/* Map legend */}
                <div className="absolute bottom-4 left-4 z-[1000] bg-slate-900/90 backdrop-blur rounded-xl p-3 border border-white/10">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-2">Pipeline Stage</p>
                    <div className="space-y-1">
                        {stages.map(s => (
                            <div key={s.slug} className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STAGE_COLORS[s.slug] || s.color }} />
                                <span className="text-[10px] text-slate-300">{s.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Table with Selection */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="p-4 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selected.size === filtered.length && filtered.length > 0}
                                        onChange={toggleAll}
                                        className="rounded accent-rr-pink"
                                    />
                                </th>
                                <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Age</th>
                                <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Suburb</th>
                                <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Club</th>
                                <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Stage</th>
                                <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Applied</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.map(app => {
                                const entry = getEntry(app.id);
                                const stage = getStage(entry?.stage_slug);
                                const isSelected = selected.has(app.id);

                                return (
                                    <tr
                                        key={app.id}
                                        className={`transition-colors cursor-pointer ${isSelected ? 'bg-rr-pink/10' : 'hover:bg-white/5'
                                            }`}
                                        onClick={() => toggleSelect(app.id)}
                                    >
                                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleSelect(app.id)}
                                                className="rounded accent-rr-pink"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <span className="text-white font-medium">{app.first_name} {app.last_name}</span>
                                        </td>
                                        <td className="p-4 text-slate-400">{app.age || '—'}</td>
                                        <td className="p-4 text-slate-400 truncate max-w-[150px]">{app.suburb || '—'}</td>
                                        <td className="p-4 text-slate-400 truncate max-w-[150px]">{app.club || '—'}</td>
                                        <td className="p-4">
                                            <span
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                                                style={{ backgroundColor: `${stage?.color || '#6B7280'}20`, color: stage?.color || '#6B7280' }}
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stage?.color }} />
                                                {stage?.name?.length > 18 ? stage.name.substring(0, 18) + '…' : stage?.name || entry?.stage_slug || '—'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-400">
                                            {app.created_at ? new Date(app.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }) : '—'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500 text-sm">No applicants match your filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectionAnalytics;
