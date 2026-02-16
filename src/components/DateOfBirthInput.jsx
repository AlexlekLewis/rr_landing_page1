
import React, { useState, useEffect } from 'react';

const DateOfBirthInput = ({ value, onChange, required = false }) => {
    // value is expected to be "YYYY-MM-DD" or empty string

    // Parse initial value
    const getInitialParts = () => {
        if (!value) return { day: '', month: '', year: '' };
        const parts = value.split('-');
        return {
            year: parts[0] || '',
            month: parts[1] || '',
            day: parts[2] || ''
        };
    };

    const [dateParts, setDateParts] = useState(getInitialParts());

    // Update internal state if external value changes significantly
    useEffect(() => {
        const parts = getInitialParts();
        if (parts.year !== dateParts.year || parts.month !== dateParts.month || parts.day !== dateParts.day) {
            setDateParts(parts);
        }
    }, [value]);

    const handleChange = (part, newValue) => {
        const newParts = { ...dateParts, [part]: newValue };
        setDateParts(newParts);

        // Only emit change if all parts are filled or all are empty (to allow clearing)
        // Or actually, let's just emit whatever we have, but formatted correctly if possible.
        // If incomplete, we might want to emit empty string or partial?
        // Let's stick to emitting YYYY-MM-DD if valid-ish, or verify validity.

        if (newParts.day && newParts.month && newParts.year) {
            onChange(`${newParts.year}-${newParts.month}-${newParts.day}`);
        } else if (!newParts.day && !newParts.month && !newParts.year) {
            onChange('');
        }
        // If partial, main form validation will catch "required" if it's empty string.
        // Ideally we don't emit partial strings for date input type in parent, but parent treats it as string.
    };

    // Generate arrays for dropdowns
    const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
    const months = [
        { value: '01', label: 'Jan' },
        { value: '02', label: 'Feb' },
        { value: '03', label: 'Mar' },
        { value: '04', label: 'Apr' },
        { value: '05', label: 'May' },
        { value: '06', label: 'Jun' },
        { value: '07', label: 'Jul' },
        { value: '08', label: 'Aug' },
        { value: '09', label: 'Sep' },
        { value: '10', label: 'Oct' },
        { value: '11', label: 'Nov' },
        { value: '12', label: 'Dec' }
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));

    const selectClass = "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-rr-pink focus:ring-2 focus:ring-rr-pink/20 transition-all text-rr-dark appearance-none cursor-pointer";

    return (
        <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Date of Birth {required && <span className="text-rr-pink">*</span>}
            </label>
            <div className="grid grid-cols-3 gap-3">
                <div className="relative">
                    <select
                        value={dateParts.day}
                        onChange={(e) => handleChange('day', e.target.value)}
                        className={selectClass}
                        required={required}
                    >
                        <option value="">Day</option>
                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div className="relative">
                    <select
                        value={dateParts.month}
                        onChange={(e) => handleChange('month', e.target.value)}
                        className={selectClass}
                        required={required}
                    >
                        <option value="">Month</option>
                        {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                </div>
                <div className="relative">
                    <select
                        value={dateParts.year}
                        onChange={(e) => handleChange('year', e.target.value)}
                        className={selectClass}
                        required={required}
                    >
                        <option value="">Year</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default DateOfBirthInput;
