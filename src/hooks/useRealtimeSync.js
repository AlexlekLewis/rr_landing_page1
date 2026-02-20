import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Supabase Realtime hook — subscribes to postgres changes on
 * applications, pipeline_entries, and pipeline_activity_log.
 *
 * Usage:
 *   useRealtimeSync({ onApplicationChange, onEntryChange, onActivityChange });
 *
 * Each callback receives (payload) with payload.eventType and payload.new / payload.old.
 */
const useRealtimeSync = ({ onApplicationChange, onEntryChange, onActivityChange } = {}) => {
    const channelRef = useRef(null);

    const subscribe = useCallback(() => {
        // Clean up previous subscription
        if (channelRef.current) {
            supabase.removeChannel(channelRef.current);
        }

        const channel = supabase
            .channel('admin-dashboard-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'applications' },
                (payload) => {
                    if (onApplicationChange) onApplicationChange(payload);
                }
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'pipeline_entries' },
                (payload) => {
                    if (onEntryChange) onEntryChange(payload);
                }
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'pipeline_activity_log' },
                (payload) => {
                    if (onActivityChange) onActivityChange(payload);
                }
            )
            .subscribe();

        channelRef.current = channel;
    }, [onApplicationChange, onEntryChange, onActivityChange]);

    useEffect(() => {
        subscribe();

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
            }
        };
    }, [subscribe]);

    return channelRef;
};

export default useRealtimeSync;
