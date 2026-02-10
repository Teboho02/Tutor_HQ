import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Toast from '../../../components/Toast';
import { classService } from '../../../services/class.service';
import type { NavigationLink } from '../../../types';
import './TutorClasses.css';

interface Class {
    id: number;
    title: string;
    subject: string;
    date: string;
    time: string;
    duration: string;
    students: number;
    status: 'upcoming' | 'completed';
}

const TutorClasses: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ message, type });
    };

    const hideToast = () => setToast(null);

    const handleCancelClass = async (classId: number, className: string) => {
        if (!window.confirm(`Are you sure you want to cancel "${className}"?`)) {
            return;
        }

        const reason = window.prompt('Please provide a cancellation reason:');
        if (!reason) {
            showToast('Cancellation reason is required', 'error');
            return;
        }

        try {
            const response = await classService.cancelClass(classId, reason);
            if (response.success) {
                showToast('Class cancelled successfully', 'success');
                // In production, this would refresh the class list
                // For now, the UI will update on next page load
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            showToast(err.response?.data?.message || 'Failed to cancel class', 'error');
        }
    };

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/tutor/dashboard' },
        { label: 'My Classes', href: '/tutor/classes' },
        { label: 'Schedule', href: '/tutor/schedule' },
        { label: 'Students', href: '/tutor/students' },
        { label: 'Materials', href: '/tutor/materials' },
        { label: 'Account', href: '/tutor/account' },
    ];

    const upcomingClasses: Class[] = [
        {
            id: 1,
            title: 'Advanced Calculus - Integration Techniques',
            subject: 'Mathematics',
            date: 'Today',
            time: '2:00 PM',
            duration: '60 min',
            students: 18,
            status: 'upcoming',
        },
        {
            id: 2,
            title: 'Quantum Mechanics Fundamentals',
            subject: 'Physics',
            date: 'Today',
            time: '4:00 PM',
            duration: '90 min',
            students: 15,
            status: 'upcoming',
        },
        {
            id: 3,
            title: 'Organic Chemistry - Reaction Mechanisms',
            subject: 'Chemistry',
            date: 'Tomorrow',
            time: '10:00 AM',
            duration: '60 min',
            students: 20,
            status: 'upcoming',
        },
    ];

    const completedClasses: Class[] = [
        {
            id: 4,
            title: 'Linear Algebra - Matrix Operations',
            subject: 'Mathematics',
            date: 'Yesterday',
            time: '3:00 PM',
            duration: '60 min',
            students: 22,
            status: 'completed',
        },
        {
            id: 5,
            title: 'Thermodynamics Principles',
            subject: 'Physics',
            date: '2 days ago',
            time: '1:00 PM',
            duration: '90 min',
            students: 19,
            status: 'completed',
        },
    ];

    const renderClassCard = (classItem: Class) => (
        <div key={classItem.id} className="tutor-class-card">
            <div className="class-card-header">
                <div className="subject-badge">{classItem.subject}</div>
                {classItem.status === 'upcoming' && classItem.date === 'Today' && (
                    <span className="today-badge">Today</span>
                )}
            </div>

            <h3>{classItem.title}</h3>

            <div className="class-meta">
                <div className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span>{classItem.date}</span>
                </div>
                <div className="meta-item">
                    <span className="meta-icon">🕒</span>
                    <span>{classItem.time}</span>
                </div>
                <div className="meta-item">
                    <span className="meta-icon">⏱️</span>
                    <span>{classItem.duration}</span>
                </div>
                <div className="meta-item">
                    <span className="meta-icon">👥</span>
                    <span>{classItem.students} students</span>
                </div>
            </div>

            <div className="class-card-actions">
                {classItem.status === 'upcoming' ? (
                    <>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/student/video-call/${classItem.id}`)}
                        >
                            Start Class
                        </button>
                        <button
                            className="btn btn-outline"
                            onClick={() => navigate(`/tutor/schedule?edit=${classItem.id}`)}
                        >
                            Edit
                        </button>
                        <button
                            className="btn btn-outline"
                            onClick={() => handleCancelClass(classItem.id, classItem.title)}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="btn btn-outline"
                            onClick={() => navigate(`/tutor/recordings/${classItem.id}`)}
                        >
                            View Recording
                        </button>
                        <button
                            className="btn btn-outline"
                            onClick={() => navigate(`/tutor/analytics/class/${classItem.id}`)}
                        >
                            View Report
                        </button>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <div className="tutor-classes-page">
            <Header navigationLinks={navigationLinks} />

            <div className="classes-container">
                <div className="page-header">
                    <div>
                        <h1>My Classes</h1>
                        <p>Manage your scheduled and completed classes</p>
                    </div>
                    <button
                        className="btn btn-primary schedule-new-btn"
                        onClick={() => navigate('/tutor/schedule')}
                    >
                        + Schedule New Class
                    </button>
                </div>

                {/* Tabs */}
                <div className="classes-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming ({upcomingClasses.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        Completed ({completedClasses.length})
                    </button>
                </div>

                {/* Classes Grid */}
                <div className="classes-grid">
                    {activeTab === 'upcoming'
                        ? upcomingClasses.map(renderClassCard)
                        : completedClasses.map(renderClassCard)}
                </div>
            </div>

            <Footer />
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
};

export default TutorClasses;
