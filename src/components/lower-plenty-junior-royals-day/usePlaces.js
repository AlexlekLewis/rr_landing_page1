import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { PLACES_RPC, CAPACITY, CLOSES_AT_ISO } from './lpJrDayData';

// How many of the 60 places are left, read from the database (counts only —
// the function returns no names). The database also refuses an insert once
// the event is full or closed, so this is for the page's words, not the guard.
//
// state: 'open' | 'full' | 'closed'
// left:  number, or null while loading / if the count could not be read
export const closedByClock = () => Date.now() >= new Date(CLOSES_AT_ISO).getTime();

const usePlaces = () => {
    const [places, setPlaces] = useState({
        left: null,
        capacity: CAPACITY,
        state: closedByClock() ? 'closed' : 'open',
    });

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { data, error } = await supabase.rpc(PLACES_RPC);
                if (error) throw error;
                if (cancelled || !data) return;
                const capacity = Number(data.capacity) || CAPACITY;
                const left = Math.max(0, capacity - Number(data.taken || 0));
                const closed = closedByClock() || (data.closes_at && Date.now() >= new Date(data.closes_at).getTime());
                setPlaces({
                    left,
                    capacity,
                    state: closed ? 'closed' : left <= 0 ? 'full' : 'open',
                });
            } catch (err) {
                // Never block a parent on a failed count: the database still
                // enforces the cap when they submit.
                console.warn('Lower Plenty places count unavailable:', err?.message || err);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    return places;
};

export const placesLine = (p) => {
    if (p.state === 'closed') return 'Registrations have closed';
    if (p.state === 'full') return `All ${p.capacity} places are taken`;
    if (p.left == null) return `${p.capacity} places`;
    return `${p.left} of ${p.capacity} places left`;
};

export default usePlaces;
