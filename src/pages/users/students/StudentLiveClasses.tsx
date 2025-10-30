import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import type { NavigationLink } from '../../../types';
import './StudentLiveClasses.css';

interface LiveClass {
    id: number;
    subject: string;
    topic: string;
    tutor: string;
    startTime: string;
    duration: string;
    status: 'live' | 'upcoming' | 'ended';
    participants: number;
    maxParticipants: number;
}

const StudentLiveClasses: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'past'>('live');
    const navigate = useNavigate();

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/student/dashboard' },
        { label: 'Live Classes', href: '/student/live-classes' },
        { label: 'Calendar', href: '/student/calendar' },
        { label: 'Materials', href: '/student/materials' },
        { label: 'Progress', href: '/student/progress' },
        { label: 'Messages', href: '/student/messages' },
    ];

    const liveClasses: LiveClass[] = [
        {
            id: 1,
            subject: 'Mathematics',
            topic: 'Advanced Calculus - Integration Techniques',
            tutor: 'Dr. Sarah Smith',
            startTime: '2:00 PM',
            duration: '60 min',
            status: 'live',
            participants: 18,
            maxParticipants: 25,
        },
    ];

    const upcomingClasses: LiveClass[] = [
        {
            id: 2,
            subject: 'Physics',
            topic: 'Quantum Mechanics Fundamentals',
            tutor: 'Prof. John Johnson',
            startTime: 'Tomorrow, 10:00 AM',
            duration: '90 min',
            status: 'upcoming',
            participants: 0,
            maxParticipants: 30,
        },
        {
            id: 3,
            subject: 'Chemistry',
            topic: 'Organic Chemistry - Reaction Mechanisms',
            tutor: 'Dr. Emily Williams',
            startTime: 'Thursday, 3:00 PM',
            duration: '60 min',
            status: 'upcoming',
            participants: 0,
            maxParticipants: 20,
        },
        {
            id: 4,
            subject: 'Biology',
            topic: 'Genetics and DNA Structure',
            tutor: 'Dr. Michael Brown',
            startTime: 'Friday, 11:00 AM',
            duration: '75 min',
            status: 'upcoming',
            participants: 0,
            maxParticipants: 25,
        },
    ];

    const pastClasses: LiveClass[] = [
        {
            id: 5,
            subject: 'Mathematics',
            topic: 'Differential Equations',
            tutor: 'Dr. Sarah Smith',
            startTime: 'Yesterday, 2:00 PM',
            duration: '60 min',
            status: 'ended',
            participants: 22,
            maxParticipants: 25,
        },
        {
            id: 6,
            subject: 'Chemistry',
            topic: 'Chemical Bonding',
            tutor: 'Dr. Emily Williams',
            startTime: 'Monday, 3:00 PM',
            duration: '60 min',
            status: 'ended',
            participants: 19,
            maxParticipants: 20,
        },
    ];

    const renderClassCard = (classItem: LiveClass) => (
        <div key={classItem.id} className={`live-class-card ${classItem.status}`}>
            <div className="class-header">
                <div className="subject-badge">{classItem.subject}</div>
                {classItem.status === 'live' && <div className="live-indicator">🔴 LIVE</div>}
            </div>

            <h3 className="class-topic">{classItem.topic}</h3>

            <div className="class-details">
                <div className="detail-item">
                    <span className="detail-icon">👨‍🏫</span>
                    <span>{classItem.tutor}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-icon">🕒</span>
                    <span>{classItem.startTime}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-icon">⏱️</span>
                    <span>{classItem.duration}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-icon">👥</span>
                    <span>{classItem.participants}/{classItem.maxParticipants} participants</span>
                </div>
            </div>

            <div className="class-actions">
                {classItem.status === 'live' && (
                    <button
                        className="btn btn-primary btn-block"
                        onClick={() => navigate(`/student/video-call/${classItem.id}`)}
                    >
                        Join Now
                    </button>
                )}
                {classItem.status === 'upcoming' && (
                    <button className="btn btn-outline btn-block">Set Reminder</button>
                )}
                {classItem.status === 'ended' && (
                    <button className="btn btn-outline btn-block">View Recording</button>
                )}
            </div>
        </div>
    );

    return (
        <div className="student-live-classes-page">
            <Header navigationLinks={navigationLinks} />

            <div className="live-classes-container">
                <div className="page-header">
                    <div className="header-content">
                        <div>
                            <h1>Live Classes</h1>
                            <p>Join interactive sessions with expert tutors</p>
                        </div>
                        <button
                            className="btn btn-primary schedule-btn"
                            onClick={() => navigate('/student/schedule-class')}
                        >
                            + Schedule Class
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="classes-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'live' ? 'active' : ''}`}
                        onClick={() => setActiveTab('live')}
                    >
                        <span className="tab-icon">🔴</span>
                        Live Now ({liveClasses.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        <span className="tab-icon">📅</span>
                        Upcoming ({upcomingClasses.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
                        onClick={() => setActiveTab('past')}
                    >
                        <span className="tab-icon">📼</span>
                        Past Recordings ({pastClasses.length})
                    </button>
                </div>

                {/* Classes Grid */}
                <div className="classes-content">
                    {activeTab === 'live' && (
                        <div className="classes-grid">
                            {liveClasses.length > 0 ? (
                                liveClasses.map(renderClassCard)
                            ) : (
                                <div className="empty-state">
                                    <span className="empty-icon">📹</span>
                                    <h3>No live classes right now</h3>
                                    <p>Check back later or view upcoming classes</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'upcoming' && (
                        <div className="classes-grid">
                            {upcomingClasses.map(renderClassCard)}
                        </div>
                    )}

                    {activeTab === 'past' && (
                        <div className="classes-grid">
                            {pastClasses.map(renderClassCard)}
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="info-section">
                    <h2>How to Join a Live Class</h2>
                    <div className="info-steps">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3>Find Your Class</h3>
                            <p>Browse live or upcoming classes in your schedule</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3>Click Join Now</h3>
                            <p>When the class is live, click the "Join Now" button</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3>Start Learning</h3>
                            <p>Interact with your tutor and classmates in real-time</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default StudentLiveClasses;
