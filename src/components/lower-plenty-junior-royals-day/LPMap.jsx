import React from 'react';
import { Navigation } from 'lucide-react';
import { MAP_EMBED, MAPS_URL, WHERE, VENUE } from './lpJrDayData';

// Satellite map with a pin on Lower Plenty Oval South. Montmorency Park has two
// ovals, and families who don't know the club will otherwise go to the wrong
// one (Alex, 16 Oct 2026). Google's keyless embed; lazy so it costs nothing
// until it scrolls into view. The Get directions button opens the phone's maps
// app with the same pin as the destination.
const LPMap = ({ compact = false }) => (
    <div>
        <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <iframe
                title={WHERE.mapTitle}
                src={MAP_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className={`block w-full ${compact ? 'h-[240px]' : 'h-[300px] sm:h-[380px]'}`}
                allowFullScreen
            />
        </div>
        <p className="text-rr-charcoal text-[13px] font-medium mt-2">
            The pin is {VENUE.oval}, {VENUE.park}.
        </p>
        <a
            href={MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-rr-blue hover:bg-rr-medium-blue text-white font-black uppercase tracking-wider text-sm rounded-full px-6 py-3.5 mt-4 transition-colors"
        >
            <Navigation className="w-4 h-4" /> {WHERE.directions}
        </a>
    </div>
);

export default LPMap;
