import React, { useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import type { NavigationLink } from '../../../types';
import './TutorDashboard.css';

interface ClassItem {
    id: number;
    subject: string;
    topic: string;
    time: string;
    students: number;
    duration: number;
    classType: '1-1' | 'group';
    classLink?: string;
    studentNames?: string[];
}

const TutorDashboard: React.FC = () => {
    const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/tutor/dashboard' },
        { label: 'My Classes', href: '/tutor/classes' },
        { label: 'Schedule', href: '/tutor/schedule' },
        { label: 'Students', href: '/tutor/students' },
        { label: 'Materials', href: '/tutor/materials' },
        { label: 'Account', href: '/tutor/account' },
    ];

    const upcomingClasses = [
        {
            id: 1,
            subject: 'Mathematics',
            topic: 'Advanced Calculus',
            time: '2:00 PM',
            students: 18,
            duration: 60,
            classType: 'group' as const,
            classLink: 'https://meet.google.com/abc-defg-hij',
            studentNames: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', '+14 more'],
        },
        {
            id: 2,
            subject: 'Physics',
            topic: 'Quantum Mechanics',
            time: '4:00 PM',
            students: 15,
            duration: 90,
            classType: '1-1' as const,
            classLink: 'https://zoom.us/j/123456789',
            studentNames: ['Emma Davis'],
        },
    ];

    const recentActivity = [
        { type: 'assignment', message: 'New assignment submitted by John Doe', time: '10 mins ago' },
        { type: 'message', message: 'Sarah Williams sent you a message', time: '1 hour ago' },
        { type: 'feedback', message: 'Feedback request from Mike Johnson', time: '2 hours ago' },
    ];

    return (
        <div className="tutor-dashboard-page">
            <Header navigationLinks={navigationLinks} />

            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div>
                        <h1>Welcome Back, Dr. Smith! 👨‍🏫</h1>
                        <p>Here's what's happening with your classes today</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            👥
                        </div>
                        <div className="stat-content">
                            <h3>Total Students</h3>
                            <p className="stat-value">127</p>
                            <span className="stat-change positive">+12 this month</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                            📚
                        </div>
                        <div className="stat-content">
                            <h3>Active Classes</h3>
                            <p className="stat-value">8</p>
                            <span className="stat-change positive">2 today</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                            ⏱️
                        </div>
                        <div className="stat-content">
                            <h3>Teaching Hours</h3>
                            <p className="stat-value">142</p>
                            <span className="stat-change positive">+8 this week</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                            ⭐
                        </div>
                        <div className="stat-content">
                            <h3>Average Rating</h3>
                            <p className="stat-value">4.8</p>
                            <span className="stat-change positive">Excellent</span>
                        </div>
                    </div>
                </div>

                <div className="dashboard-content">
                    {/* Upcoming Classes */}
                    <div className="content-section">
                        <div className="section-header">
                            <h2>Upcoming Classes</h2>
                            <a href="/tutor/classes" className="view-all-link">View All →</a>
                        </div>
                        <div className="classes-list">
                            {upcomingClasses.map((classItem) => (
                                <div key={classItem.id} className="class-item">
                                    <div className="class-info">
                                        <div className="class-subject-badge">{classItem.subject}</div>
                                        <h3>{classItem.topic}</h3>
                                        <div className="class-details">
                                            <span>🕒 {classItem.time}</span>
                                            <span>👥 {classItem.students} students</span>
                                            <span>⏱️ {classItem.duration} min</span>
                                            <span className="class-type-badge">
                                                {classItem.classType === '1-1' ? '👤 1-1' : '👥 Group'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="class-actions">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => {
                                                if (classItem.classLink) {
                                                    window.open(classItem.classLink, '_blank');
                                                } else {
                                                    alert('No class link set for this class. Please configure it in the schedule.');
                                                }
                                            }}
                                        >
                                            Start Class
                                        </button>
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => {
                                                setSelectedClass(classItem);
                                                setIsDetailsModalOpen(true);
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="content-section">
                        <div className="section-header">
                            <h2>Recent Activity</h2>
                        </div>
                        <div className="activity-list">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="activity-item">
                                    <div className={`activity-icon ${activity.type}`}>
                                        {activity.type === 'assignment' && '📝'}
                                        {activity.type === 'message' && '💬'}
                                        {activity.type === 'feedback' && '⭐'}
                                    </div>
                                    <div className="activity-content">
                                        <p>{activity.message}</p>
                                        <span className="activity-time">{activity.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="actions-grid">
                        <a href="/tutor/schedule" className="action-card">
                            <span className="action-icon">📅</span>
                            <h3>Schedule Class</h3>
                            <p>Create a new live class</p>
                        </a>
                        <a href="/tutor/materials" className="action-card">
                            <span className="action-icon">📤</span>
                            <h3>Upload Materials</h3>
                            <p>Share resources with students</p>
                        </a>
                        <a href="/tutor/students" className="action-card">
                            <span className="action-icon">👥</span>
                            <h3>View Students</h3>
                            <p>Manage your student roster</p>
                        </a>
                        <a href="/tutor/analytics" className="action-card">
                            <span className="action-icon">📊</span>
                            <h3>View Analytics</h3>
                            <p>Track class performance</p>
                        </a>
                    </div>
                </div>
            </div>

            {/* Class Details Modal */}
            {isDetailsModalOpen && selectedClass && (
                <div className="modal-overlay" onClick={() => setIsDetailsModalOpen(false)}>
                    <div className="modal-content class-details-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedClass.topic}</h2>
                            <button className="modal-close" onClick={() => setIsDetailsModalOpen(false)}>✕</button>
                        </div>

                        <div className="modal-body">
                            <div className="details-grid">
                                <div className="detail-section">
                                    <h3>📚 Class Information</h3>
                                    <p><strong>Subject:</strong> {selectedClass.subject}</p>
                                    <p><strong>Topic:</strong> {selectedClass.topic}</p>
                                    <p><strong>Class Type:</strong> {selectedClass.classType === '1-1' ? '1-1 Class' : 'Group Class'}</p>
                                </div>

                                <div className="detail-section">
                                    <h3>⏰ Schedule</h3>
                                    <p><strong>Time:</strong> {selectedClass.time}</p>
                                    <p><strong>Duration:</strong> {selectedClass.duration} minutes</p>
                                </div>

                                <div className="detail-section">
                                    <h3>👥 Students</h3>
                                    <p><strong>Total:</strong> {selectedClass.students} student{selectedClass.students !== 1 ? 's' : ''}</p>
                                    <div className="student-list">
                                        {selectedClass.studentNames?.map((name, idx) => (
                                            <span key={idx} className="student-badge">{name}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h3>🔗 Class Link</h3>
                                    {selectedClass.classLink ? (
                                        <div className="link-display">
                                            <input
                                                type="text"
                                                value={selectedClass.classLink}
                                                readOnly
                                                className="link-input"
                                            />
                                            <button
                                                className="btn btn-small"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(selectedClass.classLink!);
                                                    alert('Link copied to clipboard!');
                                                }}
                                            >
                                                📋 Copy
                                            </button>
                                            <button
                                                className="btn btn-small btn-primary"
                                                onClick={() => window.open(selectedClass.classLink!, '_blank')}
                                            >
                                                🔗 Open
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="warning-text">No class link configured. Update in schedule settings.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    if (selectedClass.classLink) {
                                        window.open(selectedClass.classLink, '_blank');
                                    }
                                }}
                            >
                                🎥 Start Class Now
                            </button>
                            <button
                                className="btn"
                                onClick={() => setIsDetailsModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default TutorDashboard;
