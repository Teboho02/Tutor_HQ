import React, { useState, useEffect } from 'react';
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
    meetingLink?: string;
}

const TutorClasses: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
    const [allClasses, setAllClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ message, type });
    };

    const hideToast = () => setToast(null);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                setLoading(true);
                const response = await classService.listClasses();
                if (response.success && response.data.classes) {
                    const now = new Date();
                    const transformed: Class[] = response.data.classes.map((c: { id: number; title: string; subject: string; scheduled_at?: string; scheduledAt?: string; duration?: number; duration_minutes?: number; durationMinutes?: number; status?: string; enrollmentCount?: number; meetingLink?: string; meeting_link?: string }) => {
                        const scheduledAt = c.scheduled_at || c.scheduledAt || '';
                        const classDate = new Date(scheduledAt);
                        const isCompleted = c.status === 'completed' || classDate < now;
                        const today = new Date();
                        const tomorrow = new Date(today);
                        tomorrow.setDate(tomorrow.getDate() + 1);

                        let dateLabel = classDate.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' });
                        if (classDate.toDateString() === today.toDateString()) dateLabel = 'Today';
                        else if (classDate.toDateString() === tomorrow.toDateString()) dateLabel = 'Tomorrow';

                        return {
                            id: c.id,
                            title: c.title || '',
                            subject: c.subject || '',
                            date: dateLabel,
                            time: classDate.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }),
                            duration: `${c.duration || c.duration_minutes || c.durationMinutes || 60} min`,
                            students: c.enrollmentCount || 0,
                            status: isCompleted ? 'completed' as const : 'upcoming' as const,
                            meetingLink: c.meetingLink || c.meeting_link || '',
                        };
                    });
                    setAllClasses(transformed);
                }
            } catch (error: unknown) {
                const err = error as { response?: { data?: { message?: string } } };
                showToast(err.response?.data?.message || 'Failed to load classes', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const upcomingClasses = allClasses.filter(c => c.status === 'upcoming');
    const completedClasses = allClasses.filter(c => c.status === 'completed');

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
                            onClick={async () => {
                                try {
                                    const details = await classService.getClass(String(classItem.id));
                                    const link = details?.data?.meetingLink || classItem.meetingLink;
                                    if (link) {
                                        window.open(link, '_blank');
                                    } else {
                                        showToast('No meeting link set. Edit the class to add one.', 'info');
                                    }
                                } catch {
                                    showToast('Failed to get class details', 'error');
                                }
                            }}
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
                            onClick={() => showToast('Recordings feature coming soon!', 'info')}
                        >
                            View Recording
                        </button>
                        <button
                            className="btn btn-outline"
                            onClick={() => navigate('/analytics')}
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
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p>Loading classes...</p>
                    </div>
                ) : (
                    <div className="classes-grid">
                        {activeTab === 'upcoming'
                            ? (upcomingClasses.length > 0 ? upcomingClasses.map(renderClassCard) : <div className="empty-state"><p>No upcoming classes</p></div>)
                            : (completedClasses.length > 0 ? completedClasses.map(renderClassCard) : <div className="empty-state"><p>No completed classes yet</p></div>)}
                    </div>
                )}
            </div>

            <Footer />
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
};

export default TutorClasses;
