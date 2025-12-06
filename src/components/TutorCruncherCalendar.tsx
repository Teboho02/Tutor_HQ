import React, { useEffect, useRef } from 'react';
import '../styles/TutorCruncherCalendar.css';

interface TutorCruncherCalendarProps {
    userId?: string;
    userType: 'student' | 'tutor' | 'parent';
    height?: string;
}

export const TutorCruncherCalendar: React.FC<TutorCruncherCalendarProps> = ({
    userId = 'demo-user',
    userType,
    height = '600px'
}) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        // Initialize TutorCruncher widget
        // In production, replace with actual TutorCruncher API initialization
        const initializeTutorCruncher = () => {
            console.log('TutorCruncher initialized for:', userType, userId);

            // Send configuration to iframe if needed
            if (iframeRef.current) {
                // This would be replaced with actual TutorCruncher iframe URL
                // const baseUrl = 'https://secure.tutorcruncher.com';
                // In production: const iframeUrl = `${baseUrl}/calendar/${userId}?theme=custom`;
            }
        };

        initializeTutorCruncher();

        return () => {
            console.log('TutorCruncher cleanup');
        };
    }, [userId, userType]);

    return (
        <div className="tutorcruncher-wrapper">
            <div className="tutorcruncher-header">
                <h3>📅 Schedule & Bookings</h3>
                <p className="integration-badge">
                    Powered by TutorCruncher
                </p>
            </div>

            {/* Demo placeholder - Replace with actual TutorCruncher iframe */}
            <div className="tutorcruncher-calendar" style={{ height }}>
                <div className="calendar-placeholder">
                    <div className="placeholder-icon">📅</div>
                    <h4>TutorCruncher Calendar Integration</h4>
                    <p className="placeholder-text">
                        To activate TutorCruncher calendar, add your API credentials to the environment variables:
                    </p>
                    <div className="env-instructions">
                        <code>VITE_TUTORCRUNCHER_API_KEY=your_api_key</code>
                        <code>VITE_TUTORCRUNCHER_BRANCH_ID=your_branch_id</code>
                    </div>
                    <div className="demo-features">
                        <h5>Features Available:</h5>
                        <ul>
                            <li>✅ View upcoming lessons and appointments</li>
                            <li>✅ Book new tutoring sessions</li>
                            <li>✅ Reschedule or cancel appointments</li>
                            <li>✅ Sync with Google Calendar</li>
                            <li>✅ Automated reminders and notifications</li>
                            <li>✅ View tutor availability in real-time</li>
                        </ul>
                    </div>
                    <a
                        href="https://tutorcruncher.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="setup-link"
                    >
                        Learn More About TutorCruncher →
                    </a>
                </div>

                {/* Actual iframe - uncomment when TutorCruncher is configured */}
                {/* 
                <iframe
                    ref={iframeRef}
                    src={`https://secure.tutorcruncher.com/calendar/${userId}`}
                    title="TutorCruncher Calendar"
                    className="tutorcruncher-iframe"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow="clipboard-write; encrypted-media"
                />
                */}
            </div>

            <div className="calendar-actions">
                <button className="action-btn primary">
                    🕐 Book New Session
                </button>
                <button className="action-btn secondary">
                    📋 View All Appointments
                </button>
            </div>
        </div>
    );
};
