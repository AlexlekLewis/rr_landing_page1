import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Download, ChevronDown, ChevronUp, X, Truck, MapPin, CreditCard,
    Package, CheckCircle2, Clock, ExternalLink, RefreshCw, DollarSign, ShoppingBag, AlertCircle, Mail, CloudDownload
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useRealtimeSync from '../../hooks/useRealtimeSync';

const formatAUD = (cents) => {
    if (cents == null) return '—';
    const value = typeof cents === 'number' && cents > 1000 ? cents / 100 : Number(cents);
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(value);
};

const formatMoney = (amount) => {
    if (amount == null) return '—';
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(Number(amount));
};

const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatDateTime = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-AU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const VENUE_LABELS = {
    bundoora: 'Cutting Edge Cricket — Bundoora',
    hallam: 'Cricket Connect — Hallam',
};

const ShopOrdersDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [fulfillmentFilter, setFulfillmentFilter] = useState('all');
    const [sourceFilter, setSourceFilter] = useState('all');
    const [sortKey, setSortKey] = useState('created_at');
    const [sortDir, setSortDir] = useState('desc');
    const [selected, setSelected] = useState(null);
    const [stripeData, setStripeData] = useState(null);
    const [stripeLoading, setStripeLoading] = useState(false);
    const [stripeError, setStripeError] = useState(null);
    const [syncState, setSyncState] = useState({ status: 'idle', message: '' });

    const fetchData = useCallback(async () => {
        setError(null);
        try {
            const [trainingRes, iplRes] = await Promise.all([
                supabase.from('shop_orders_training').select('*').order('created_at', { ascending: false }),
                supabase.from('shop_orders_ipl').select('*').order('created_at', { ascending: false }),
            ]);

            if (trainingRes.error) throw trainingRes.error;
            if (iplRes.error) throw iplRes.error;

            const training = (trainingRes.data || []).map(o => ({ ...o, _source: 'training' }));
            const ipl = (iplRes.data || []).map(o => ({ ...o, _source: 'ipl' }));

            const combined = [...training, ...ipl].sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            setOrders(combined);
        } catch (err) {
            console.error('Error fetching shop orders:', err);
            setError(err.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);
    useRealtimeSync(['shop_orders_training', 'shop_orders_ipl'], fetchData);

    // Auto-sync from Stripe on dashboard open. Pulls the last 14 days of paid
    // Checkout Sessions in the background. Idempotent — already-synced orders
    // are upserted in place. Skips if a sync ran in the last 5 minutes
    // (sessionStorage guard).
    useEffect(() => {
        const SYNC_KEY = 'shop_orders_last_auto_sync';
        const last = Number(sessionStorage.getItem(SYNC_KEY) || 0);
        if (Date.now() - last < 5 * 60 * 1000) return;
        sessionStorage.setItem(SYNC_KEY, String(Date.now()));

        (async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;
                setSyncState({ status: 'syncing', message: 'Auto-syncing recent Stripe activity…' });
                const res = await fetch('/api/sync-from-stripe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify({ days: 14 }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Auto-sync failed');
                if (data.synced > 0) {
                    setSyncState({
                        status: 'done',
                        message: `Auto-sync: pulled ${data.synced} new/updated order${data.synced === 1 ? '' : 's'} from Stripe`,
                    });
                    fetchData();
                } else {
                    // Silent — nothing new to report
                    setSyncState({ status: 'idle', message: '' });
                }
            } catch (err) {
                console.warn('Stripe auto-sync failed:', err);
                setSyncState({ status: 'idle', message: '' });
            }
        })();
    }, [fetchData]);

    const stats = useMemo(() => {
        const completed = orders.filter(o => o.payment_status === 'completed');
        const revenue = completed.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
        const pending = orders.filter(o => o.payment_status !== 'completed').length;
        const unfulfilled = orders.filter(o =>
            o.payment_status === 'completed' &&
            ((o._source === 'training' && o.fulfillment_status !== 'fulfilled') ||
             (o._source === 'ipl' && o.supplier_status !== 'delivered'))
        ).length;
        return { total: orders.length, completed: completed.length, revenue, pending, unfulfilled };
    }, [orders]);

    const filtered = useMemo(() => {
        let result = orders;

        if (statusFilter !== 'all') {
            result = result.filter(o => o.payment_status === statusFilter);
        }
        if (fulfillmentFilter !== 'all') {
            result = result.filter(o => o.fulfillment_method === fulfillmentFilter);
        }
        if (sourceFilter !== 'all') {
            result = result.filter(o => o._source === sourceFilter);
        }
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(o =>
                (o.customer_name || '').toLowerCase().includes(q) ||
                (o.customer_email || '').toLowerCase().includes(q) ||
                (o.customer_phone || '').toLowerCase().includes(q) ||
                (o.stripe_session_id || '').toLowerCase().includes(q) ||
                (o.id || '').toLowerCase().includes(q)
            );
        }

        result = [...result].sort((a, b) => {
            const av = a[sortKey], bv = b[sortKey];
            if (av == null) return 1;
            if (bv == null) return -1;
            if (sortKey === 'created_at') {
                return sortDir === 'asc' ? new Date(av) - new Date(bv) : new Date(bv) - new Date(av);
            }
            const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
            return sortDir === 'asc' ? cmp : -cmp;
        });

        return result;
    }, [orders, search, statusFilter, fulfillmentFilter, sourceFilter, sortKey, sortDir]);

    const toggleSort = (key) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortKey(key); setSortDir('desc'); }
    };

    const SortIcon = ({ column }) => {
        if (sortKey !== column) return null;
        return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
    };

    const openDetail = async (order) => {
        setSelected(order);
        setStripeData(null);
        setStripeError(null);
        if (order.stripe_session_id) {
            setStripeLoading(true);
            try {
                const res = await fetch(`/api/get-stripe-payment?session_id=${encodeURIComponent(order.stripe_session_id)}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to load Stripe data');
                setStripeData(data);
            } catch (err) {
                console.error('Stripe fetch failed:', err);
                setStripeError(err.message);
            } finally {
                setStripeLoading(false);
            }
        }
    };

    const closeDetail = () => {
        setSelected(null);
        setStripeData(null);
        setStripeError(null);
    };

    const updateOrderField = async (order, field, value) => {
        const table = order._source === 'ipl' ? 'shop_orders_ipl' : 'shop_orders_training';
        try {
            const { error } = await supabase.from(table).update({ [field]: value }).eq('id', order.id);
            if (error) throw error;
            setSelected(s => s && s.id === order.id ? { ...s, [field]: value } : s);
            fetchData();
        } catch (err) {
            console.error(`Failed to update ${field}:`, err);
            alert(`Update failed: ${err.message}`);
        }
    };

    const exportCSV = () => {
        const headers = [
            'Order ID', 'Source', 'Date', 'Customer Name', 'Email', 'Phone',
            'Items', 'Fulfillment', 'Pickup Venue', 'Shipping Address',
            'Subtotal', 'Shipping', 'Total', 'Payment Status', 'Stripe Session', 'Status'
        ];
        const rows = filtered.map(o => [
            o.id,
            o._source,
            formatDate(o.created_at),
            o.customer_name || '',
            o.customer_email || '',
            o.customer_phone || '',
            (o.items || []).map(i => `${i.product_name || i.product_id} (${i.size || '—'}) x${i.quantity}`).join(' | '),
            o.fulfillment_method || '',
            o.pickup_venue ? VENUE_LABELS[o.pickup_venue] || o.pickup_venue : '',
            o.shipping_address ? `${o.shipping_address.line1 || ''}, ${o.shipping_address.city || ''} ${o.shipping_address.postal_code || ''}` : '',
            o.subtotal || '',
            o.shipping_cost || '',
            o.total || '',
            o.payment_status || '',
            o.stripe_session_id || '',
            o._source === 'ipl' ? (o.supplier_status || '') : (o.fulfillment_status || ''),
        ]);

        const csv = [headers, ...rows]
            .map(r => r.map(c => `"${(c == null ? '' : c).toString().replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shop_orders_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
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

    const syncFromStripe = async () => {
        if (!confirm('Pull every paid Stripe Checkout from the last 30 days into this dashboard?\n\nUseful after a webhook outage or to backfill historical orders. Already-synced orders are updated in place, not duplicated.')) return;
        setSyncState({ status: 'syncing', message: 'Querying Stripe…' });
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Not signed in');
            const res = await fetch('/api/sync-from-stripe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ days: 30 }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Sync failed');
            setSyncState({
                status: 'done',
                message: `Synced ${data.synced} of ${data.processed} sessions (${data.skipped} unpaid skipped${data.errors?.length ? `, ${data.errors.length} errors` : ''})`,
            });
            fetchData();
        } catch (err) {
            setSyncState({ status: 'error', message: err.message });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider">SHOP ORDERS</h1>
                    <p className="text-slate-400 text-sm mt-1">{filtered.length} of {orders.length} orders</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={syncFromStripe}
                        disabled={syncState.status === 'syncing'}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-rr-pink/20 to-rr-blue/20 border border-rr-pink/30 text-white hover:from-rr-pink/30 hover:to-rr-blue/30 transition-all text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                    >
                        {syncState.status === 'syncing' ? (
                            <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Syncing…</>
                        ) : (
                            <><CloudDownload className="w-3.5 h-3.5" /> Sync from Stripe</>
                        )}
                    </button>
                    <button
                        onClick={fetchData}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-wider"
                    >
                        <RefreshCw className="w-3.5 h-3.5" /> Refresh
                    </button>
                </div>
            </div>

            {syncState.message && (
                <div className={`rounded-xl border p-3 text-xs ${syncState.status === 'error'
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : syncState.status === 'done'
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : 'bg-blue-500/10 border-blue-500/30 text-blue-300'}`}>
                    {syncState.message}
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-red-400 text-sm font-bold">Failed to load orders</p>
                        <p className="text-red-400/70 text-xs mt-1">{error}</p>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard icon={DollarSign} label="Revenue (paid)" value={formatMoney(stats.revenue)} accent="from-green-500/20 to-emerald-500/10" iconColor="text-green-400" />
                <StatCard icon={ShoppingBag} label="Completed" value={stats.completed} accent="from-rr-pink/20 to-rr-blue/10" iconColor="text-rr-pink" />
                <StatCard icon={Clock} label="Pending payment" value={stats.pending} accent="from-amber-500/20 to-yellow-500/10" iconColor="text-amber-400" />
                <StatCard icon={Package} label="Awaiting fulfillment" value={stats.unfulfilled} accent="from-blue-500/20 to-indigo-500/10" iconColor="text-blue-400" />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name, email, phone, or Stripe session..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-rr-pink/50"
                    />
                </div>

                <FilterSelect value={statusFilter} onChange={setStatusFilter} options={[
                    { value: 'all', label: 'All payments' },
                    { value: 'completed', label: 'Paid' },
                    { value: 'pending', label: 'Pending' },
                ]} />

                <FilterSelect value={fulfillmentFilter} onChange={setFulfillmentFilter} options={[
                    { value: 'all', label: 'All fulfillment' },
                    { value: 'pickup', label: 'Pickup' },
                    { value: 'standard', label: 'Standard' },
                    { value: 'express', label: 'Express' },
                ]} />

                <FilterSelect value={sourceFilter} onChange={setSourceFilter} options={[
                    { value: 'all', label: 'All products' },
                    { value: 'training', label: 'Training kit' },
                    { value: 'ipl', label: 'IPL replica' },
                ]} />

                <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm"
                >
                    <Download className="w-4 h-4" /> Export CSV
                </button>
            </div>

            {/* Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                {[
                                    { key: 'created_at', label: 'Date' },
                                    { key: 'customer_name', label: 'Customer' },
                                    { key: '_source', label: 'Type' },
                                    { key: 'fulfillment_method', label: 'Fulfillment' },
                                    { key: 'total', label: 'Total' },
                                    { key: 'payment_status', label: 'Payment' },
                                    { key: '_status', label: 'Status' },
                                ].map(col => (
                                    <th
                                        key={col.key}
                                        onClick={() => col.key !== '_status' && toggleSort(col.key)}
                                        className={`p-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${col.key !== '_status' ? 'cursor-pointer hover:text-slate-300' : ''}`}
                                    >
                                        <span className="flex items-center gap-1">
                                            {col.label}
                                            <SortIcon column={col.key} />
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.map(order => {
                                const itemCount = (order.items || []).reduce((sum, i) => sum + (i.quantity || 0), 0);
                                return (
                                    <tr key={`${order._source}-${order.id}`}
                                        onClick={() => openDetail(order)}
                                        className="hover:bg-white/5 transition-colors cursor-pointer">
                                        <td className="p-4 text-slate-400 whitespace-nowrap">{formatDate(order.created_at)}</td>
                                        <td className="p-4">
                                            <div className="text-white font-medium truncate max-w-[200px]">{order.customer_name || '—'}</div>
                                            <div className="text-slate-500 text-xs truncate max-w-[200px]">{order.customer_email || '—'}</div>
                                        </td>
                                        <td className="p-4">
                                            <SourceBadge source={order._source} count={itemCount} />
                                        </td>
                                        <td className="p-4 text-slate-300">
                                            <FulfillmentBadge order={order} />
                                        </td>
                                        <td className="p-4 text-white font-bold whitespace-nowrap">{formatMoney(order.total)}</td>
                                        <td className="p-4">
                                            <div>
                                                <PaymentBadge status={order.payment_status} />
                                                {order.card_brand && order.card_last4 && (
                                                    <div className="text-[10px] text-slate-500 mt-1 font-mono uppercase tracking-wider">
                                                        {order.card_brand} •••• {order.card_last4}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge order={order} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-500 text-sm">No orders match your filters</p>
                    </div>
                )}
            </div>

            {/* Detail drawer */}
            <AnimatePresence>
                {selected && (
                    <OrderDetailDrawer
                        order={selected}
                        stripeData={stripeData}
                        stripeLoading={stripeLoading}
                        stripeError={stripeError}
                        onClose={closeDetail}
                        onUpdate={updateOrderField}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, accent, iconColor }) => (
    <div className={`relative bg-gradient-to-br ${accent} border border-white/10 rounded-2xl p-4 overflow-hidden`}>
        <div className="flex items-start justify-between">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-2xl font-black text-white">{value}</p>
            </div>
            <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
    </div>
);

const FilterSelect = ({ value, onChange, options }) => (
    <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 pr-9 text-white text-sm focus:outline-none focus:border-rr-pink/50 cursor-pointer"
        >
            {options.map(o => <option key={o.value} value={o.value} className="bg-slate-900">{o.label}</option>)}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
);

const SourceBadge = ({ source, count }) => (
    <div className="flex items-center gap-2">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${source === 'ipl' ? 'bg-rr-pink/15 text-rr-pink' : 'bg-rr-blue/15 text-blue-300'}`}>
            {source === 'ipl' ? 'IPL Replica' : 'Training'}
        </span>
        <span className="text-slate-500 text-xs">{count} item{count !== 1 ? 's' : ''}</span>
    </div>
);

const FulfillmentBadge = ({ order }) => {
    if (!order.fulfillment_method) return <span className="text-slate-500">—</span>;
    if (order.fulfillment_method === 'pickup') {
        return (
            <span className="inline-flex items-center gap-1.5 text-xs">
                <MapPin className="w-3.5 h-3.5 text-rr-pink" />
                <span className="text-slate-300">Pickup</span>
                {order.pickup_venue && <span className="text-slate-500">· {order.pickup_venue}</span>}
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 text-xs">
            <Truck className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-300 capitalize">{order.fulfillment_method}</span>
        </span>
    );
};

const PaymentBadge = ({ status }) => {
    const cfg = status === 'completed'
        ? { cls: 'bg-green-500/10 text-green-400', label: 'Paid' }
        : status === 'pending'
            ? { cls: 'bg-amber-500/10 text-amber-400', label: 'Pending' }
            : { cls: 'bg-slate-500/10 text-slate-400', label: status || 'Unknown' };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.cls}`}>
            {cfg.label}
        </span>
    );
};

const StatusBadge = ({ order }) => {
    const status = order._source === 'ipl' ? order.supplier_status : order.fulfillment_status;
    if (!status) return <span className="text-slate-500 text-xs">—</span>;
    const colorMap = {
        unfulfilled: 'bg-amber-500/10 text-amber-400',
        fulfilled: 'bg-green-500/10 text-green-400',
        awaiting_bulk_order: 'bg-amber-500/10 text-amber-400',
        ordered: 'bg-blue-500/10 text-blue-400',
        delivered: 'bg-green-500/10 text-green-400',
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${colorMap[status] || 'bg-slate-500/10 text-slate-400'}`}>
            {status.replace(/_/g, ' ')}
        </span>
    );
};

const OrderDetailDrawer = ({ order, stripeData, stripeLoading, stripeError, onClose, onUpdate }) => {
    const items = order.items || [];
    const isIPL = order._source === 'ipl';
    const statusField = isIPL ? 'supplier_status' : 'fulfillment_status';
    const statusOptions = isIPL
        ? ['awaiting_bulk_order', 'ordered', 'delivered']
        : ['unfulfilled', 'fulfilled'];
    const currentStatus = order[statusField];

    const [emailState, setEmailState] = useState({ status: 'idle', message: '' });
    const sendConfirmation = async () => {
        if (!order.customer_email) {
            setEmailState({ status: 'error', message: 'No customer email on this order' });
            return;
        }
        setEmailState({ status: 'sending', message: '' });
        try {
            const res = await fetch('/api/send-confirmation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: order.id, source: order._source }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Send failed');
            setEmailState({ status: 'sent', message: `Sent to ${order.customer_email}` });
        } catch (err) {
            setEmailState({ status: 'error', message: err.message });
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl bg-slate-950 border-l border-white/10 overflow-y-auto"
            >
                <div className="sticky top-0 bg-slate-950/95 backdrop-blur border-b border-white/5 p-6 flex items-center justify-between z-10">
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">
                            {isIPL ? 'IPL Replica Order' : 'Training Kit Order'}
                        </p>
                        <h2 className="text-xl font-black text-white tracking-wide">{order.customer_name || 'Unknown customer'}</h2>
                        <p className="text-slate-400 text-xs mt-1 font-mono">{order.id}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-2">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Quick status */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Payment</p>
                            <PaymentBadge status={order.payment_status} />
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">{isIPL ? 'Supplier' : 'Fulfillment'}</p>
                            <select
                                value={currentStatus || ''}
                                onChange={(e) => onUpdate(order, statusField, e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-rr-pink/50"
                            >
                                <option value="" className="bg-slate-900">Not set</option>
                                {statusOptions.map(s => <option key={s} value={s} className="bg-slate-900">{s.replace(/_/g, ' ')}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Customer */}
                    <Section title="Customer">
                        <Field label="Name" value={order.customer_name} />
                        <Field label="Email" value={order.customer_email} copyable />
                        <Field label="Phone" value={order.customer_phone} copyable />
                        <Field label="Order placed" value={formatDateTime(order.created_at)} />
                    </Section>

                    {/* Items */}
                    <Section title={`Items (${items.length})`}>
                        <div className="space-y-2">
                            {items.map((i, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                                    <div className="min-w-0">
                                        <p className="text-white font-medium text-sm truncate">{i.product_name || i.product_id}</p>
                                        <p className="text-slate-500 text-xs">
                                            Size: <span className="text-slate-300">{i.size || '—'}</span> · Qty: <span className="text-slate-300">{i.quantity}</span>
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0 ml-3">
                                        <p className="text-white text-sm font-bold">{formatMoney((i.unit_price || 0) * (i.quantity || 0))}</p>
                                        <p className="text-slate-500 text-xs">{formatMoney(i.unit_price)} ea</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* Fulfillment */}
                    <Section title="Fulfillment">
                        <Field label="Method" value={order.fulfillment_method} />
                        {order.fulfillment_method === 'pickup' && (
                            <>
                                <Field label="Pickup venue" value={order.pickup_venue ? VENUE_LABELS[order.pickup_venue] || order.pickup_venue : '—'} />
                                <Field label="Pickup day(s)" value={order.pickup_day} />
                            </>
                        )}
                        {order.shipping_address && (
                            <Field
                                label="Shipping address"
                                value={[
                                    order.shipping_address.line1,
                                    order.shipping_address.line2,
                                    `${order.shipping_address.city || ''} ${order.shipping_address.state || ''} ${order.shipping_address.postal_code || ''}`.trim(),
                                    order.shipping_address.country,
                                ].filter(Boolean).join('\n')}
                                multiline
                            />
                        )}
                    </Section>

                    {/* Totals */}
                    <Section title="Totals">
                        <Field label="Subtotal" value={formatMoney(order.subtotal)} />
                        <Field label="Shipping" value={formatMoney(order.shipping_cost)} />
                        <div className="pt-2 mt-2 border-t border-white/5">
                            <Field label="Total" value={formatMoney(order.total)} bold />
                        </div>
                    </Section>

                    {/* Confirmation email */}
                    <Section title="Confirmation Email" icon={Mail}>
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={sendConfirmation}
                                disabled={emailState.status === 'sending' || !order.customer_email}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rr-pink to-rr-blue text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50 hover:opacity-90 transition-opacity"
                            >
                                {emailState.status === 'sending' ? (
                                    <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sending…</>
                                ) : emailState.status === 'sent' ? (
                                    <><CheckCircle2 className="w-3.5 h-3.5" /> Sent</>
                                ) : (
                                    <><Mail className="w-3.5 h-3.5" /> Send confirmation email</>
                                )}
                            </button>
                            {emailState.status === 'sent' && (
                                <span className="text-green-400 text-xs">{emailState.message}</span>
                            )}
                            {emailState.status === 'error' && (
                                <span className="text-red-400 text-xs">{emailState.message}</span>
                            )}
                        </div>
                        <p className="text-slate-500 text-xs mt-2">
                            The auto-confirmation already fires on payment. Use this to resend manually.
                        </p>
                    </Section>

                    {/* Stripe — prefer persisted DB columns, fall back to live fetch */}
                    <Section title="Stripe Payment" icon={CreditCard}>
                        {!order.stripe_session_id ? (
                            <p className="text-slate-500 text-sm italic">No Stripe session linked yet — order placed but payment not completed.</p>
                        ) : (
                            <>
                                <Field label="Session ID" value={order.stripe_session_id} copyable mono />
                                <Field label="Charge ID" value={order.stripe_charge_id || stripeData?.payment?.charge_id} copyable mono />
                                <Field label="Payment intent" value={order.stripe_payment_intent_id} copyable mono />
                                <Field
                                    label="Card"
                                    value={
                                        order.card_brand && order.card_last4
                                            ? `${order.card_brand.toUpperCase()} •••• ${order.card_last4}${order.card_country ? ` (${order.card_country})` : ''}${order.card_funding ? ` · ${order.card_funding}` : ''}`
                                            : stripeData?.payment?.card_brand
                                                ? `${stripeData.payment.card_brand.toUpperCase()} •••• ${stripeData.payment.card_last4}`
                                                : '—'
                                    }
                                />
                                <Field label="Paid at" value={order.paid_at ? formatDateTime(order.paid_at) : '—'} />
                                {(order.receipt_url || stripeData?.payment?.receipt_url) && (
                                    <a href={order.receipt_url || stripeData.payment.receipt_url} target="_blank" rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 text-rr-pink hover:text-rr-pink/80 text-xs font-bold mt-2">
                                        View Stripe receipt <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}

                                <div className="pt-3 mt-3 border-t border-white/5 grid grid-cols-2 gap-2">
                                    <MiniField label="Subtotal" value={formatAUD(order.amount_subtotal_cents ?? stripeData?.amount_subtotal)} />
                                    <MiniField label="Shipping" value={formatAUD(order.amount_shipping_cents ?? stripeData?.amount_shipping)} />
                                    <MiniField label="Tax" value={formatAUD(order.amount_tax_cents ?? 0)} />
                                    <MiniField label="Total paid" value={formatAUD(order.amount_total_cents ?? stripeData?.amount_total)} bold />
                                </div>

                                <div className="flex items-center gap-3 mt-3">
                                    <a
                                        href={`https://dashboard.stripe.com/payments/${order.stripe_charge_id || order.stripe_session_id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
                                    >
                                        Open in Stripe Dashboard <ExternalLink className="w-3 h-3" />
                                    </a>
                                    {stripeLoading && <span className="text-xs text-slate-500"><RefreshCw className="w-3 h-3 inline animate-spin mr-1" />Refreshing live data…</span>}
                                    {stripeError && <span className="text-xs text-red-400">{stripeError}</span>}
                                </div>
                            </>
                        )}
                    </Section>
                </div>
            </motion.div>
        </>
    );
};

const Section = ({ title, icon: Icon, children }) => (
    <div>
        <div className="flex items-center gap-2 mb-3">
            {Icon && <Icon className="w-4 h-4 text-rr-pink" />}
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{title}</h3>
        </div>
        <div className="space-y-2">{children}</div>
    </div>
);

const Field = ({ label, value, bold, mono, multiline, copyable }) => {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };
    return (
        <div className="flex items-start justify-between gap-3 py-1">
            <span className="text-xs text-slate-500 shrink-0 pt-0.5">{label}</span>
            <span className={`text-right text-sm break-all ${bold ? 'text-white font-bold' : 'text-slate-200'} ${mono ? 'font-mono text-xs' : ''} ${multiline ? 'whitespace-pre-line' : ''}`}>
                {value || '—'}
                {copyable && value && (
                    <button onClick={copy} className="ml-2 text-slate-500 hover:text-rr-pink text-xs">
                        {copied ? <CheckCircle2 className="w-3 h-3 inline" /> : 'copy'}
                    </button>
                )}
            </span>
        </div>
    );
};

const MiniField = ({ label, value, bold }) => (
    <div className="bg-white/5 rounded-lg p-2">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{label}</p>
        <p className={`text-sm ${bold ? 'text-white font-black' : 'text-slate-200 font-medium'}`}>{value}</p>
    </div>
);

export default ShopOrdersDashboard;
