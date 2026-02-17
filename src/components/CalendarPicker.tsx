import React, { useState, useRef, useEffect } from 'react';
import './CalendarPicker.css';

interface CalendarPickerProps {
    value: string;               // YYYY-MM-DD
    onChange: (value: string) => void;
    label?: string;
    id?: string;
    required?: boolean;
    min?: string;                // YYYY-MM-DD — disable dates before this
    max?: string;                // YYYY-MM-DD — disable dates after this
    className?: string;
    placeholder?: string;
    error?: boolean;
}

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const pad = (n: number) => String(n).padStart(2, '0');

const toDateStr = (y: number, m: number, d: number) =>
    `${y}-${pad(m + 1)}-${pad(d)}`;

const formatDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    return `${d} ${MONTH_NAMES[m - 1]} ${y}`;
};

const CalendarPicker: React.FC<CalendarPickerProps> = ({
    value,
    onChange,
    id,
    required,
    min,
    max,
    className = '',
    placeholder = 'Select date',
    error = false,
}) => {
    const today = new Date();
    const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

    // The month being viewed in the calendar
    const initial = value ? new Date(value + 'T00:00:00') : today;
    const [viewYear, setViewYear] = useState(initial.getFullYear());
    const [viewMonth, setViewMonth] = useState(initial.getMonth());
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    // When value changes externally, sync viewed month
    useEffect(() => {
        if (value) {
            const d = new Date(value + 'T00:00:00');
            setViewYear(d.getFullYear());
            setViewMonth(d.getMonth());
        }
    }, [value]);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };

    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const goToToday = () => {
        setViewYear(today.getFullYear());
        setViewMonth(today.getMonth());
        onChange(todayStr);
        setOpen(false);
    };

    // Build calendar grid
    const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();

    const cells: { day: number; dateStr: string; currentMonth: boolean; disabled: boolean }[] = [];

    // Previous month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
        const d = daysInPrev - i;
        const m = viewMonth === 0 ? 11 : viewMonth - 1;
        const y = viewMonth === 0 ? viewYear - 1 : viewYear;
        const ds = toDateStr(y, m, d);
        cells.push({ day: d, dateStr: ds, currentMonth: false, disabled: isDisabled(ds) });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
        const ds = toDateStr(viewYear, viewMonth, d);
        cells.push({ day: d, dateStr: ds, currentMonth: true, disabled: isDisabled(ds) });
    }

    // Next month leading days — fill to complete the last row (multiple of 7)
    const totalSoFar = cells.length;
    const rowsNeeded = Math.ceil(totalSoFar / 7);
    const target = rowsNeeded * 7;
    for (let d = 1; d <= target - totalSoFar; d++) {
        const m = viewMonth === 11 ? 0 : viewMonth + 1;
        const y = viewMonth === 11 ? viewYear + 1 : viewYear;
        const ds = toDateStr(y, m, d);
        cells.push({ day: d, dateStr: ds, currentMonth: false, disabled: isDisabled(ds) });
    }

    function isDisabled(ds: string) {
        if (min && ds < min) return true;
        if (max && ds > max) return true;
        return false;
    }

    const selectDate = (ds: string) => {
        onChange(ds);
        setOpen(false);
    };

    return (
        <div className={`calendar-picker ${className}`} ref={containerRef}>
            <div
                className={`calendar-picker-input ${open ? 'focused' : ''} ${error ? 'error' : ''}`}
                onClick={() => setOpen(o => !o)}
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpen(o => !o); }}
            >
                <span className="calendar-icon">📅</span>
                <span className={`calendar-value ${value ? '' : 'placeholder'}`}>
                    {value ? formatDisplay(value) : placeholder}
                </span>
                <span className="calendar-chevron">{open ? '▲' : '▼'}</span>
                {/* Hidden native input for form validation */}
                {required && (
                    <input
                        type="text"
                        id={id}
                        value={value}
                        required
                        readOnly
                        tabIndex={-1}
                        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
                    />
                )}
            </div>

            {open && (
                <div className="calendar-dropdown">
                    <div className="calendar-header">
                        <button type="button" className="cal-nav-btn" onClick={prevMonth}>‹</button>
                        <span className="cal-month-year">
                            {MONTH_NAMES[viewMonth]} {viewYear}
                        </span>
                        <button type="button" className="cal-nav-btn" onClick={nextMonth}>›</button>
                    </div>

                    <div className="calendar-day-names">
                        {DAY_NAMES.map(d => (
                            <span key={d} className="cal-day-name">{d}</span>
                        ))}
                    </div>

                    <div className="calendar-grid">
                        {cells.map((cell, i) => (
                            <button
                                key={i}
                                type="button"
                                className={[
                                    'cal-day',
                                    !cell.currentMonth ? 'other-month' : '',
                                    cell.dateStr === value ? 'selected' : '',
                                    cell.dateStr === todayStr ? 'today' : '',
                                    cell.disabled ? 'disabled' : '',
                                ].filter(Boolean).join(' ')}
                                disabled={cell.disabled}
                                onClick={() => selectDate(cell.dateStr)}
                            >
                                {cell.day}
                            </button>
                        ))}
                    </div>

                    <div className="calendar-footer">
                        <button type="button" className="cal-today-btn" onClick={goToToday}>
                            Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarPicker;
