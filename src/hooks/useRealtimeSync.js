import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Subscribe to Supabase Realtime changes on one or more tables.
 * Calls `onSync` whenever any INSERT, UPDATE, or DELETE occurs on any listed table.
 *
 * @param {string[]} tables - Array of Supabase table names to watch
 * @param {Function} onSync - Callback invoked on any change (receives payload)
 *
 * Usage:
 *   useRealtimeSync(['applications', 'pipeline_entries'], fetchData);
 *   useRealtimeSync(['official_cohort_2026'], fetchCohortData);
 */
const useRealtimeSync = (tables, onSync) => {
    const channelRef = useRef(null);
    const onSyncRef = useRef(onSync);
    onSyncRef.current = onSync;

    // Stable key so we only re-subscribe when the actual table list changes
    const tablesKey = Array.isArray(tables) ? tables.slice().sort().join(',') : '';

    useEffect(() => {
        if (!tablesKey || !onSyncRef.current) return;

        // Clean up previous subscription
        if (channelRef.current) {
            supabase.removeChannel(channelRef.current);
        }

        const tableList = tablesKey.split(',');
        const channelName = `admin-rt-${Date.now()}-${tableList.join('-').substring(0, 50)}`;

        let channel = supabase.channel(channelName);

        tableList.forEach((table) => {
            channel = channel.on(
                'postgres_changes',
                { event: '*', schema: 'public', table },
                (payload) => {
                    if (onSyncRef.current) onSyncRef.current(payload);
                }
            );
        });

        channel.subscribe();
        channelRef.current = channel;

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
                channelRef.current = null;
            }
        };
    }, [tablesKey]);

    return channelRef;
};

export default useRealtimeSync;
