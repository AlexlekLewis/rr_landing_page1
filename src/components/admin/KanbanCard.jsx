import React from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Calendar, MapPin, User } from 'lucide-react';

const KanbanCard = ({ application, entry, onClick, onDragStart }) => {
    const name = `${application.first_name || ''} ${application.last_name || ''}`.trim() || 'Unknown';
    const labels = entry?.labels || [];
    const appliedDate = application.created_at
        ? new Date(application.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
        : '';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            draggable
            onDragStart={(e) => {
                e.dataTransfer?.setData('application/json', JSON.stringify({
                    applicationId: application.id,
                    entryId: entry?.id,
                    currentStage: entry?.stage_slug,
                }));
                if (onDragStart) onDragStart(application.id);
            }}
            onClick={() => onClick && onClick(application)}
            className="bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all group active:scale-[0.98]"
        >
            {/* Drag handle + Name */}
            <div className="flex items-start gap-2 mb-3">
                <GripVertical className="w-4 h-4 text-slate-600 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                <div className="min-w-0 flex-1">
                    <h4 className="text-white font-bold text-sm truncate">{name}</h4>
                    {application.age && (
                        <p className="text-slate-500 text-xs">Age {application.age}</p>
                    )}
                </div>
            </div>

            {/* Details */}
            <div className="space-y-1.5">
                {application.club && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <User className="w-3 h-3 shrink-0" />
                        <span className="truncate">{application.club}</span>
                    </div>
                )}
                {application.suburb && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{application.suburb}</span>
                    </div>
                )}
                {appliedDate && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span>{appliedDate}</span>
                    </div>
                )}
            </div>

            {/* Labels */}
            {labels.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                    {labels.map((label, i) => (
                        <span
                            key={i}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rr-pink/20 text-rr-pink uppercase tracking-wider"
                        >
                            {label}
                        </span>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default KanbanCard;
