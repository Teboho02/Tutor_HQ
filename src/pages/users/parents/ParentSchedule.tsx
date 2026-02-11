import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { parentService } from '../../../services/parent.service';
import type { NavigationLink } from '../../../types';
import './ParentSchedule.css';

interface ScheduleEvent {
    id: number;
    title: string;
    subject: string;
    teacher: string;
    child: string;
    date: string;
    time: string;
    duration: string;
    type: 'class' | 'test' | 'assignment';
}

const ParentSchedule: React.FC = () => {
    const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
    const [selectedChild, setSelectedChild] = useState<string>('all');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [children, setChildren] = useState<string[]>(['All Children']);
    const [events, setEvents] = useState<ScheduleEvent[]>([]);
    const [loading, setLoading] = useState(true);

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/parent/dashboard' },
        { label: 'Schedule', href: '/parent/schedule' },
        { label: 'Account', href: '/parent/account' },
    ];

    useEffect(() => {
        const fetchScheduleData = async () => {
            try {
                setLoading(true);
                // First get children list
                const childrenRes = await parentService.getChildren();
                if (childrenRes.success && childrenRes.data.children) {
                    const childList = childrenRes.data.children;
                    const childNames = ['All Children', ...childList.map((c: { fullName: string }) => c.fullName)];
                    setChildren(childNames);

                    // Fetch schedule for each child
                    const allEvents: ScheduleEvent[] = [];
                    let eventId = 1;
                    for (const child of childList) {
                        try {
                            const scheduleRes = await parentService.getChildSchedule(child.id);
                            if (scheduleRes.success && scheduleRes.data.schedule) {
                                for (const cls of scheduleRes.data.schedule) {
                                    const scheduledAt = new Date(cls.scheduledAt);
                                    allEvents.push({
                                        id: eventId++,
                                        title: cls.title,
                                        subject: cls.subject || 'General',
                                        teacher: cls.tutor?.name || 'TBD',
                                        child: child.fullName,
                                        date: scheduledAt.toISOString().split('T')[0],
                                        time: scheduledAt.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }),
                                        duration: cls.duration ? `${cls.duration} min` : '',
                                        type: 'class',
                                    });
                                }
                            }
                        } catch {
                            // Skip failed child schedule
                        }
                    }
                    setEvents(allEvents);
                }
            } catch {
                // Events remain empty
            } finally {
                setLoading(false);
            }
        };
        fetchScheduleData();
    }, []);

    const filteredEvents = selectedChild === 'all'
        ? events
        : events.filter(e => e.child === selectedChild);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const getEventsForDate = (date: string) => {
        return filteredEvents.filter(event => event.date === date);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
            return newDate;
        });
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'class': return '📚';
            case 'test': return '📝';
            case 'assignment': return '📄';
            default: return '📅';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'class': return '#667eea';
            case 'test': return '#f59e0b';
            case 'assignment': return '#10b981';
            default: return '#718096';
        }
    };

    const renderMonthView = () => {
        const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
        const days = [];
        const today = new Date().toISOString().split('T')[0];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = getEventsForDate(dateStr);
            const isToday = dateStr === today;

            days.push(
                <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
                    <div className="day-number">{day}</div>
                    <div className="day-events">
                        {dayEvents.slice(0, 3).map(event => (
                            <div
                                key={event.id}
                                className="day-event"
                                style={{ borderLeftColor: getTypeColor(event.type) }}
                                title={`${event.title} - ${event.child}`}
                            >
                                <span className="event-icon">{getTypeIcon(event.type)}</span>
                                <span className="event-title">{event.title}</span>
                            </div>
                        ))}
                        {dayEvents.length > 3 && (
                            <div className="more-events">+{dayEvents.length - 3} more</div>
                        )}
                    </div>
                </div>
            );
        }

        return days;
    };

    return (
        <div className="parent-schedule-page">
            <Header navigationLinks={navigationLinks} />

            <div className="schedule-container">
                <div className="page-header">
                    <h1>Schedule</h1>
                    <div className="header-actions">
                        <div className="view-toggle">
                            <button
                                className={`view-btn ${viewMode === 'month' ? 'active' : ''}`}
                                onClick={() => setViewMode('month')}
                            >
                                Month
                            </button>
                            <button
                                className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
                                onClick={() => setViewMode('week')}
                            >
                                Week
                            </button>
                            <button
                                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                List
                            </button>
                        </div>
                    </div>
                </div>

                {/* Child Filter */}
                <div className="filter-section">
                    {children.map((child, index) => (
                        <button
                            key={index}
                            className={`filter-btn ${selectedChild === (index === 0 ? 'all' : child) ? 'active' : ''}`}
                            onClick={() => setSelectedChild(index === 0 ? 'all' : child)}
                        >
                            {child}
                        </button>
                    ))}
                </div>

                {/* Calendar Navigation */}
                {(viewMode === 'month' || viewMode === 'week') && (
                    <div className="calendar-nav">
                        <button className="nav-btn" onClick={() => navigateMonth('prev')}>←</button>
                        <h2>{formatDate(currentDate)}</h2>
                        <button className="nav-btn" onClick={() => navigateMonth('next')}>→</button>
                    </div>
                )}

                {/* Month View */}
                {viewMode === 'month' && (
                    <div className="calendar-view">
                        <div className="calendar-header">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="calendar-header-day">{day}</div>
                            ))}
                        </div>
                        <div className="calendar-grid">
                            {renderMonthView()}
                        </div>
                    </div>
                )}

                {/* Week View */}
                {viewMode === 'week' && (
                    <div className="week-view">
                        <p className="view-placeholder">Week view coming soon...</p>
                    </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                    <div className="list-view">
                        {filteredEvents.map(event => (
                            <div key={event.id} className="event-card">
                                <div className="event-date">
                                    <div className="date-month">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                                    <div className="date-day">{new Date(event.date).getDate()}</div>
                                </div>
                                <div className="event-content">
                                    <div className="event-header">
                                        <h3>{event.title}</h3>
                                        <span className="event-type" style={{ background: getTypeColor(event.type) }}>
                                            {getTypeIcon(event.type)} {event.type}
                                        </span>
                                    </div>
                                    <div className="event-details">
                                        <span>👨‍🏫 {event.teacher}</span>
                                        <span>📚 {event.subject}</span>
                                        <span>👤 {event.child}</span>
                                        <span>🕐 {event.time} {event.duration && `• ${event.duration}`}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ParentSchedule;
