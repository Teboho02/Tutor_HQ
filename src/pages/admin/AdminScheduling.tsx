import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { ClassSession } from '../../types/admin';
import '../../styles/AdminScheduling.css';

const AdminScheduling: React.FC = () => {
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [autoGenerateLink, setAutoGenerateLink] = useState(true);
    const [lessonSpaceUrl, setLessonSpaceUrl] = useState('');

    // Mock sessions data
    const [sessions] = useState<ClassSession[]>([
        {
            id: 'session1',
            title: 'Mathematics - Algebra',
            subject: 'Mathematics',
            tutorId: 'tutor1',
            tutorName: 'Sipho Dlamini',
            studentIds: ['student1', 'student2'],
            date: new Date('2025-02-15'),
            startTime: '14:00',
            endTime: '15:30',
            duration: 90,
            lessonSpaceUrl: 'https://lessonspace.com/room/abc123xyz',
            status: 'scheduled',
            attendance: [],
        },
        {
            id: 'session2',
            title: 'Physical Sciences - Chemistry',
            subject: 'Physical Sciences',
            tutorId: 'tutor2',
            tutorName: 'Nomsa Shabalala',
            studentIds: ['student3', 'student4', 'student5'],
            date: new Date('2025-02-15'),
            startTime: '16:00',
            endTime: '17:00',
            duration: 60,
            lessonSpaceUrl: 'https://lessonspace.com/room/def456uvw',
            status: 'scheduled',
            attendance: [],
        },
        {
            id: 'session3',
            title: 'English - Essay Writing',
            subject: 'English',
            tutorId: 'tutor3',
            tutorName: 'Thandi Ndlovu',
            studentIds: ['student1'],
            date: new Date('2025-02-16'),
            startTime: '10:00',
            endTime: '11:00',
            duration: 60,
            status: 'scheduled',
            attendance: [],
        },
        {
            id: 'session4',
            title: 'Mathematics - Calculus',
            subject: 'Mathematics',
            tutorId: 'tutor1',
            tutorName: 'Sipho Dlamini',
            studentIds: ['student2'],
            date: new Date('2025-02-13'),
            startTime: '15:00',
            endTime: '16:30',
            duration: 90,
            lessonSpaceUrl: 'https://lessonspace.com/room/ghi789rst',
            status: 'completed',
            attendance: [
                { studentId: 'student2', status: 'present', joinedAt: new Date('2025-02-13T15:05:00'), leftAt: new Date('2025-02-13T16:28:00') }
            ],
            recordingUrl: 'https://lessonspace.com/recording/ghi789rst'
        }
    ]);

    const generateLessonSpaceUrl = () => {
        const randomId = Math.random().toString(36).substring(2, 15);
        return `https://lessonspace.com/room/${randomId}`;
    };

    const handleCreateSession = () => {
        if (autoGenerateLink && lessonSpaceUrl) {
            alert(`Class scheduled with LessonSpace URL: ${lessonSpaceUrl}`);
        } else {
            alert('Class scheduled successfully!');
        }
        setShowCreateModal(false);
        setLessonSpaceUrl('');
        setAutoGenerateLink(true);
    };

    const handleAutoGenerateToggle = (checked: boolean) => {
        setAutoGenerateLink(checked);
        if (checked) {
            // Auto-generate URL when checkbox is enabled
            setLessonSpaceUrl(generateLessonSpaceUrl());
        } else {
            setLessonSpaceUrl('');
        }
    };

    const handleCopyLink = (url: string) => {
        navigator.clipboard.writeText(url);
        alert('LessonSpace link copied to clipboard!');
    };

    const handleSendLinks = (session: ClassSession) => {
        alert(`Virtual class links sent to ${session.tutorName} and ${session.studentIds.length} student(s)`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled': return '#3b82f6';
            case 'in-progress': return '#10b981';
            case 'completed': return '#6b7280';
            case 'cancelled': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const upcomingSessions = sessions.filter(s => s.status === 'scheduled');
    const completedSessions = sessions.filter(s => s.status === 'completed');

    return (
        <div className="admin-scheduling">
            <div className="admin-header">
                <div className="admin-header-content">
                    <div className="admin-logo">
                        <h1>🎓 TutorHQ Admin</h1>
                        <span className="admin-badge">Scheduling</span>
                    </div>
                    <Link to="/admin" className="back-btn">← Back to Dashboard</Link>
                </div>
            </div>

            <div className="admin-main">
                <div className="admin-container">
                    <div className="page-header">
                        <div>
                            <h2>Class Scheduling</h2>
                            <p>Manage virtual classes with LessonSpace integration</p>
                        </div>
                        <button className="create-btn" onClick={() => setShowCreateModal(true)}>
                            ➕ Schedule New Class
                        </button>
                    </div>

                    <div className="stats-row">
                        <div className="stat-card">
                            <div className="stat-icon">📅</div>
                            <div className="stat-content">
                                <div className="stat-label">Upcoming Classes</div>
                                <div className="stat-value">{upcomingSessions.length}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">✅</div>
                            <div className="stat-content">
                                <div className="stat-label">Completed Today</div>
                                <div className="stat-value">{completedSessions.length}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🔗</div>
                            <div className="stat-content">
                                <div className="stat-label">Active Links</div>
                                <div className="stat-value">{sessions.filter(s => s.lessonSpaceUrl).length}</div>
                            </div>
                        </div>
                    </div>

                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                            onClick={() => setViewMode('calendar')}
                        >
                            📆 Calendar View
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            📋 List View
                        </button>
                    </div>

                    <div className="sessions-section">
                        <h3>Upcoming Classes</h3>
                        <div className="sessions-grid">
                            {upcomingSessions.map(session => (
                                <div key={session.id} className="session-card">
                                    <div className="session-header">
                                        <div>
                                            <h4>{session.title}</h4>
                                            <p className="session-date">
                                                {session.date.toLocaleDateString('en-ZA', { weekday: 'long', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <span
                                            className="status-badge"
                                            style={{ background: getStatusColor(session.status) }}
                                        >
                                            {session.status}
                                        </span>
                                    </div>

                                    <div className="session-details">
                                        <div className="detail-item">
                                            <span className="detail-icon">🕐</span>
                                            <span>{session.startTime} - {session.endTime} ({session.duration} min)</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-icon">👨‍🏫</span>
                                            <span>{session.tutorName}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-icon">👥</span>
                                            <span>{session.studentIds.length} student(s)</span>
                                        </div>
                                        {session.lessonSpaceUrl && (
                                            <div className="detail-item lessonspace">
                                                <span className="detail-icon">🔗</span>
                                                <a
                                                    href={session.lessonSpaceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="lessonspace-link"
                                                >
                                                    Virtual Classroom
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <div className="session-actions">
                                        {session.lessonSpaceUrl ? (
                                            <>
                                                <button
                                                    className="action-btn copy"
                                                    onClick={() => handleCopyLink(session.lessonSpaceUrl!)}
                                                >
                                                    📋 Copy Link
                                                </button>
                                                <button
                                                    className="action-btn send"
                                                    onClick={() => handleSendLinks(session)}
                                                >
                                                    📧 Send Links
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="action-btn generate"
                                                onClick={() => alert(`Generated: ${generateLessonSpaceUrl()}`)}
                                            >
                                                ✨ Generate Link
                                            </button>
                                        )}
                                        <button
                                            className="action-btn edit"
                                            onClick={() => alert('Edit session: ' + session.title)}
                                        >
                                            ✏️ Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {completedSessions.length > 0 && (
                        <div className="sessions-section">
                            <h3>Recently Completed</h3>
                            <div className="sessions-grid">
                                {completedSessions.map(session => (
                                    <div key={session.id} className="session-card completed">
                                        <div className="session-header">
                                            <div>
                                                <h4>{session.title}</h4>
                                                <p className="session-date">
                                                    {session.date.toLocaleDateString('en-ZA')}
                                                </p>
                                            </div>
                                            <span
                                                className="status-badge"
                                                style={{ background: getStatusColor(session.status) }}
                                            >
                                                {session.status}
                                            </span>
                                        </div>

                                        <div className="session-details">
                                            <div className="detail-item">
                                                <span className="detail-icon">👨‍🏫</span>
                                                <span>{session.tutorName}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-icon">✅</span>
                                                <span>Attendance: {session.attendance.length}/{session.studentIds.length}</span>
                                            </div>
                                            {session.recordingUrl && (
                                                <div className="detail-item">
                                                    <span className="detail-icon">🎥</span>
                                                    <a
                                                        href={session.recordingUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="recording-link"
                                                    >
                                                        View Recording
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Session Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Schedule New Class</h2>
                            <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Select Class</label>
                                <select>
                                    <option value="">-- Select an existing class --</option>
                                    <option>Grade 11 - Mathematics (15 students)</option>
                                    <option>Grade 10 - Physical Sciences (12 students)</option>
                                    <option>Grade 9 - Life Sciences (18 students)</option>
                                    <option>Grade 12 - English (10 students)</option>
                                    <option>Grade 11 - Accounting (14 students)</option>
                                    <option>Grade 10 - Business Studies (16 students)</option>
                                </select>
                                <small>This will assign all students in the selected class</small>
                            </div>
                            <div className="form-group">
                                <label>Class Session Title</label>
                                <input type="text" placeholder="e.g., Algebra Basics - Chapter 5" />
                                <small>Specify the topic or chapter for this session</small>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date</label>
                                    <input type="date" />
                                </div>
                                <div className="form-group">
                                    <label>Start Time</label>
                                    <input type="time" />
                                </div>
                                <div className="form-group">
                                    <label>Duration (min)</label>
                                    <input type="number" placeholder="60" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Assigned Tutor</label>
                                <select>
                                    <option>Sipho Dlamini (Mathematics, Physical Sciences)</option>
                                    <option>Nomsa Shabalala (English, Life Sciences)</option>
                                    <option>Thandi Ndlovu (Accounting, Business Studies)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={autoGenerateLink}
                                        onChange={(e) => handleAutoGenerateToggle(e.target.checked)}
                                    />
                                    <span>Auto-generate LessonSpace virtual classroom link</span>
                                </label>
                            </div>
                            {autoGenerateLink && (
                                <div className="form-group lessonspace-url-group">
                                    <label>LessonSpace Virtual Classroom URL</label>
                                    <input
                                        type="text"
                                        value={lessonSpaceUrl}
                                        onChange={(e) => setLessonSpaceUrl(e.target.value)}
                                        placeholder="https://lessonspace.com/room/..."
                                    />
                                    <small>This link will be sent to the tutor and all students</small>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={() => setShowCreateModal(false)}>
                                Cancel
                            </button>
                            <button className="submit-btn" onClick={handleCreateSession}>
                                📅 Schedule Class
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminScheduling;
