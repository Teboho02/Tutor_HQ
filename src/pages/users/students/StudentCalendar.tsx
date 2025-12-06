import React, { useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { TutorCruncherCalendar } from '../../../components/TutorCruncherCalendar';
import type { NavigationLink } from '../../../types';
import './StudentCalendar.css';

interface CalendarEvent {
    id: number;
    type: 'class' | 'assignment' | 'test';
    title: string;
    subject: string;
    date: string;
    time: string;
    description?: string;
    dateObj?: Date;
}

const StudentCalendar: React.FC = () => {
    const [selectedView, setSelectedView] = useState<'month' | 'week' | 'list'>('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/student/dashboard' },
        { label: 'Calendar', href: '/student/calendar' },
        { label: 'Materials', href: '/student/materials' },
        { label: 'Progress', href: '/student/progress' },
        { label: 'Tests', href: '/student/tests' },
        { label: 'Goals', href: '/student/goals' },
    ];

    // Sample events with Date objects
    const allEvents: CalendarEvent[] = (() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

        const in3Days = new Date(today);
        in3Days.setDate(in3Days.getDate() + 3);

        const in4Days = new Date(today);
        in4Days.setDate(in4Days.getDate() + 4);

        const in7Days = new Date(today);
        in7Days.setDate(in7Days.getDate() + 7);

        const in10Days = new Date(today);
        in10Days.setDate(in10Days.getDate() + 10);

        return [
            {
                id: 1,
                type: 'class' as const,
                title: 'Mathematics Live Class',
                subject: 'Mathematics',
                date: 'Today',
                dateObj: today,
                time: '2:00 PM',
                description: 'Advanced Calculus - Integration Techniques',
            },
            {
                id: 2,
                type: 'assignment' as const,
                title: 'Math Assignment 5',
                subject: 'Mathematics',
                date: 'Tomorrow',
                dateObj: tomorrow,
                time: '11:59 PM',
                description: 'Complete exercises on differential equations',
            },
            {
                id: 3,
                type: 'test' as const,
                title: 'Physics Midterm',
                subject: 'Physics',
                date: '',
                dateObj: dayAfterTomorrow,
                time: '10:00 AM',
                description: 'Chapters 1-5: Mechanics and Thermodynamics',
            },
            {
                id: 4,
                type: 'class' as const,
                title: 'Chemistry Lab Session',
                subject: 'Chemistry',
                date: '',
                dateObj: dayAfterTomorrow,
                time: '3:00 PM',
                description: 'Organic Chemistry - Reaction Mechanisms',
            },
            {
                id: 5,
                type: 'assignment' as const,
                title: 'Biology Research Paper',
                subject: 'Biology',
                date: '',
                dateObj: in3Days,
                time: '11:59 PM',
                description: 'Submit 10-page paper on genetics',
            },
            {
                id: 6,
                type: 'class' as const,
                title: 'English Literature Discussion',
                subject: 'English',
                date: '',
                dateObj: in3Days,
                time: '1:00 PM',
                description: 'Analyzing Shakespeare\'s Hamlet',
            },
            {
                id: 7,
                type: 'test' as const,
                title: 'Chemistry Quiz',
                subject: 'Chemistry',
                date: '',
                dateObj: in4Days,
                time: '2:00 PM',
                description: 'Quick assessment on chemical bonding',
            },
            {
                id: 8,
                type: 'class' as const,
                title: 'Physics Lab',
                subject: 'Physics',
                date: '',
                dateObj: in7Days,
                time: '2:00 PM',
                description: 'Electromagnetic Induction Experiment',
            },
            {
                id: 9,
                type: 'assignment' as const,
                title: 'Chemistry Report',
                subject: 'Chemistry',
                date: '',
                dateObj: in10Days,
                time: '11:59 PM',
                description: 'Lab report on titration experiment',
            },
        ];
    })();

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'class': return '📚';
            case 'assignment': return '📝';
            case 'test': return '📋';
            default: return '📅';
        }
    };

    const getEventColor = (type: string) => {
        switch (type) {
            case 'class': return '#0066ff';
            case 'assignment': return '#ff9500';
            case 'test': return '#ff3b30';
            default: return '#5856d6';
        }
    };

    const formatDate = (dateObj?: Date) => {
        if (!dateObj) return '';
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (dateObj.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (dateObj.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
        }
    };

    // Month View Functions
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: (Date | null)[] = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const getEventsForDate = (date: Date | null) => {
        if (!date) return [];
        return allEvents.filter(event =>
            event.dateObj?.toDateString() === date.toDateString()
        );
    };

    const changeMonth = (direction: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    // Week View Functions
    const getWeekDays = (date: Date) => {
        const startOfWeek = new Date(date);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day;
        startOfWeek.setDate(diff);

        const weekDays: Date[] = [];
        for (let i = 0; i < 7; i++) {
            const weekDay = new Date(startOfWeek);
            weekDay.setDate(startOfWeek.getDate() + i);
            weekDays.push(weekDay);
        }
        return weekDays;
    };

    const changeWeek = (direction: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + (direction * 7));
        setCurrentDate(newDate);
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSameMonth = (date: Date) => {
        return date.getMonth() === currentDate.getMonth();
    };

    return (
        <div className="student-calendar-page">
            <Header navigationLinks={navigationLinks} />

            <div className="calendar-container">
                <div className="page-header">
                    <h1>My Calendar</h1>
                    <p>Keep track of your classes, assignments, and tests</p>
                </div>

                {/* View Selector */}
                <div className="view-selector">
                    <button
                        className={`view-btn ${selectedView === 'month' ? 'active' : ''}`}
                        onClick={() => setSelectedView('month')}
                    >
                        📅 Month View
                    </button>
                    <button
                        className={`view-btn ${selectedView === 'week' ? 'active' : ''}`}
                        onClick={() => setSelectedView('week')}
                    >
                        📆 Week View
                    </button>
                    <button
                        className={`view-btn ${selectedView === 'list' ? 'active' : ''}`}
                        onClick={() => setSelectedView('list')}
                    >
                        📋 List View
                    </button>
                </div>

                {/* Calendar Content */}
                <div className="calendar-content">
                    {/* Month View */}
                    {selectedView === 'month' && (
                        <div className="month-view">
                            <div className="month-header">
                                <button className="nav-btn" onClick={() => changeMonth(-1)}>←</button>
                                <h2>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
                                <button className="nav-btn" onClick={() => changeMonth(1)}>→</button>
                            </div>

                            <div className="calendar-weekdays">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="weekday-label">{day}</div>
                                ))}
                            </div>

                            <div className="calendar-days">
                                {getDaysInMonth(currentDate).map((date, index) => {
                                    const dayEvents = date ? getEventsForDate(date) : [];
                                    return (
                                        <div
                                            key={index}
                                            className={`calendar-day ${!date ? 'empty' : ''} ${date && isToday(date) ? 'today' : ''} ${date && !isSameMonth(date) ? 'other-month' : ''}`}
                                            onClick={() => date && setSelectedDate(date)}
                                        >
                                            {date && (
                                                <>
                                                    <div className="day-number">{date.getDate()}</div>
                                                    <div className="day-events">
                                                        {dayEvents.slice(0, 3).map(event => (
                                                            <div
                                                                key={event.id}
                                                                className="day-event-dot"
                                                                style={{ backgroundColor: getEventColor(event.type) }}
                                                                title={event.title}
                                                            >
                                                                <span className="event-dot-icon">{getEventIcon(event.type)}</span>
                                                            </div>
                                                        ))}
                                                        {dayEvents.length > 3 && (
                                                            <div className="event-more">+{dayEvents.length - 3}</div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {selectedDate && (
                                <div className="selected-date-events">
                                    <h3>Events for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                                    <div className="events-list">
                                        {getEventsForDate(selectedDate).length > 0 ? (
                                            getEventsForDate(selectedDate).map(event => (
                                                <div key={event.id} className="event-card" style={{ borderLeftColor: getEventColor(event.type) }}>
                                                    <div className="event-icon">{getEventIcon(event.type)}</div>
                                                    <div className="event-details">
                                                        <h4>{event.title}</h4>
                                                        <div className="event-meta">
                                                            <span>{event.subject}</span>
                                                            <span>{event.time}</span>
                                                        </div>
                                                        {event.description && <p>{event.description}</p>}
                                                    </div>
                                                    <span className="event-type-badge" style={{ backgroundColor: getEventColor(event.type) }}>
                                                        {event.type}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="no-events">No events scheduled for this day</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Week View */}
                    {selectedView === 'week' && (
                        <div className="week-view">
                            <div className="week-header">
                                <button className="nav-btn" onClick={() => changeWeek(-1)}>←</button>
                                <h2>
                                    {getWeekDays(currentDate)[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {' '}
                                    {getWeekDays(currentDate)[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </h2>
                                <button className="nav-btn" onClick={() => changeWeek(1)}>→</button>
                            </div>

                            <div className="week-grid">
                                {getWeekDays(currentDate).map((date, index) => {
                                    const dayEvents = getEventsForDate(date);
                                    return (
                                        <div
                                            key={index}
                                            className={`week-day ${isToday(date) ? 'today' : ''}`}
                                        >
                                            <div className="week-day-header">
                                                <div className="week-day-name">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                                <div className={`week-day-number ${isToday(date) ? 'today-number' : ''}`}>
                                                    {date.getDate()}
                                                </div>
                                            </div>
                                            <div className="week-day-events">
                                                {dayEvents.length > 0 ? (
                                                    dayEvents.map(event => (
                                                        <div
                                                            key={event.id}
                                                            className="week-event"
                                                            style={{ borderLeftColor: getEventColor(event.type), backgroundColor: `${getEventColor(event.type)}15` }}
                                                        >
                                                            <div className="week-event-time">{event.time}</div>
                                                            <div className="week-event-title">{event.title}</div>
                                                            <div className="week-event-subject">{event.subject}</div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="no-events-day">No events</div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* List View */}
                    {selectedView === 'list' && (
                        <div className="list-view">
                            <div className="events-timeline">
                                {allEvents
                                    .sort((a, b) => (a.dateObj?.getTime() || 0) - (b.dateObj?.getTime() || 0))
                                    .map((event) => (
                                        <div key={event.id} className="event-card" style={{ borderLeftColor: getEventColor(event.type) }}>
                                            <div className="event-icon">{getEventIcon(event.type)}</div>
                                            <div className="event-details">
                                                <h4>{event.title}</h4>
                                                <div className="event-meta">
                                                    <span>📅 {formatDate(event.dateObj)}</span>
                                                    <span>⏰ {event.time}</span>
                                                    <span>📚 {event.subject}</span>
                                                </div>
                                                {event.description && <p>{event.description}</p>}
                                            </div>
                                            <span className="event-type-badge" style={{ backgroundColor: getEventColor(event.type) }}>
                                                {event.type}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div className="calendar-legend">
                    <h3>Event Types</h3>
                    <div className="legend-items">
                        <div className="legend-item">
                            <span className="legend-icon" style={{ color: '#0066ff' }}>📚</span>
                            <span>Live Classes</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-icon" style={{ color: '#ff9500' }}>📝</span>
                            <span>Assignments</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-icon" style={{ color: '#ff3b30' }}>📋</span>
                            <span>Tests & Exams</span>
                        </div>
                    </div>
                </div>

                {/* TutorCruncher Integration */}
                <div className="tutorcruncher-section" style={{ marginTop: '40px' }}>
                    <TutorCruncherCalendar
                        userId="student-123"
                        userType="student"
                        height="600px"
                    />
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default StudentCalendar;
