import { useState, useEffect } from 'react';

export interface CalendarEvent {
    id: string;
    type: 'class' | 'assignment' | 'test' | 'goal' | 'task' | 'coordinator';
    title: string;
    subject: string;
    date: Date;
    time: string;
    description?: string;
    color?: string;
    completed?: boolean;
    priority?: 'high' | 'medium' | 'low';
    location?: string;
}

/**
 * Hook to fetch and merge calendar events from multiple sources:
 * - Scheduled classes
 * - Tests and assignments
 * - Goals and deadlines
 * - Subject coordinator announcements
 */
export const useCalendarEvents = (studentId?: string) => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCalendarEvents = async () => {
            try {
                setLoading(true);

                // In a real app, you would fetch from API endpoints:
                // const classesRes = await fetch(`/api/students/${studentId}/schedule`);
                // const testsRes = await fetch(`/api/students/${studentId}/tests-assignments`);
                // const goalsRes = await fetch(`/api/students/${studentId}/goals`);
                // const coordRes = await fetch(`/api/coordinators/announcements`);

                // For now, we'll use mock data that matches the schedule structure
                const mockScheduledClasses = getMockScheduledClasses();
                const mockTests = getMockTests();
                const mockGoals = getMockGoals();
                const mockCoordinatorEvents = getMockCoordinatorEvents();

                // Merge all events
                const allEvents = [
                    ...mockScheduledClasses,
                    ...mockTests,
                    ...mockGoals,
                    ...mockCoordinatorEvents,
                ].sort((a, b) => a.date.getTime() - b.date.getTime());

                setEvents(allEvents);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch calendar events');
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCalendarEvents();
    }, [studentId]);

    return { events, loading, error };
};

// Mock data generators - replace with actual API calls
function getMockScheduledClasses(): CalendarEvent[] {
    const today = new Date();

    return [
        {
            id: 'class-1',
            type: 'class',
            title: 'Mathematics Live Class',
            subject: 'Mathematics A',
            date: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
            time: '10:00 AM',
            description: 'Advanced Calculus - Integration Techniques',
            color: '#667eea',
            location: 'Zoom Meeting',
        },
        {
            id: 'class-2',
            type: 'class',
            title: 'Physics Live Session',
            subject: 'Physics B',
            date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
            time: '2:00 PM',
            description: 'Quantum Mechanics Introduction',
            color: '#764ba2',
            location: 'Google Meet',
        },
        {
            id: 'class-3',
            type: 'class',
            title: 'Chemistry Lab Session',
            subject: 'Chemistry C',
            date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
            time: '3:00 PM',
            description: 'Organic Chemistry - Reaction Mechanisms',
            color: '#f59e0b',
            location: 'Zoom Meeting',
        },
    ];
}

function getMockTests(): CalendarEvent[] {
    const today = new Date();

    return [
        {
            id: 'test-1',
            type: 'test',
            title: 'Chapter 5 Integration Test',
            subject: 'Mathematics A',
            date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
            time: '10:00 AM',
            description: '15 questions, 1 hour duration',
            color: '#10b981',
            priority: 'high',
        },
        {
            id: 'assignment-1',
            type: 'assignment',
            title: 'Calculus Practice Problems',
            subject: 'Mathematics A',
            date: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000),
            time: '11:59 PM',
            description: 'Submit solutions to exercises 1-20',
            color: '#3b82f6',
            priority: 'medium',
        },
        {
            id: 'assignment-2',
            type: 'assignment',
            title: 'Physics Lab Report',
            subject: 'Physics B',
            date: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000),
            time: '11:59 PM',
            description: 'Complete lab report and submit',
            color: '#8b5cf6',
            priority: 'high',
        },
    ];
}

function getMockGoals(): CalendarEvent[] {
    const today = new Date();

    return [
        {
            id: 'goal-1',
            type: 'goal',
            title: 'Complete Unit 5 - Target: 90%',
            subject: 'Mathematics A',
            date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
            time: '11:59 PM',
            description: 'Personal learning goal',
            color: '#ec4899',
            priority: 'high',
        },
        {
            id: 'goal-2',
            type: 'task',
            title: 'Review Notes for Midterm',
            subject: 'Physics B',
            date: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
            time: '5:00 PM',
            description: 'Study session reminder',
            color: '#f43f5e',
            priority: 'medium',
        },
        {
            id: 'task-1',
            type: 'task',
            title: 'Submit Attendance Form',
            subject: 'Chemistry C',
            date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
            time: '3:00 PM',
            description: 'Monthly attendance verification',
            color: '#94a3b8',
            priority: 'low',
        },
    ];
}

function getMockCoordinatorEvents(): CalendarEvent[] {
    const today = new Date();

    return [
        {
            id: 'coord-1',
            type: 'coordinator',
            title: 'Mid-semester Progress Report Available',
            subject: 'Academics',
            date: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
            time: '9:00 AM',
            description: 'Check your academic progress portal',
            color: '#06b6d4',
        },
        {
            id: 'coord-2',
            type: 'coordinator',
            title: 'School Holiday - No Classes',
            subject: 'General',
            date: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000),
            time: '12:00 AM',
            description: 'All campus facilities closed',
            color: '#6366f1',
        },
        {
            id: 'coord-3',
            type: 'coordinator',
            title: 'New Scholarship Opportunity Announced',
            subject: 'Admin',
            date: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000),
            time: '10:00 AM',
            description: 'Apply now - Deadline: 2 weeks',
            color: '#14b8a6',
        },
    ];
}
