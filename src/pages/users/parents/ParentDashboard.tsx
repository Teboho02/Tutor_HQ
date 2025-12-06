import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import type { NavigationLink } from '../../../types';
import './ParentDashboard.css';

interface Child {
    id: string;
    name: string;
    grade: string;
    avatar: string;
    overallGrade: number;
    attendance: number;
    upcomingClasses: number;
    recentActivity: string;
}

const ParentDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [selectedChildId, setSelectedChildId] = useState<string>('1');

    const parentName = 'Sarah Johnson'; // This would come from auth context

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/parent/dashboard' },
        { label: 'Payments', href: '/parent/payments' },
        { label: 'Schedule', href: '/parent/schedule' },
        { label: 'Account', href: '/parent/account' },
    ];

    const children: Child[] = [
        {
            id: '1',
            name: 'Emma Johnson',
            grade: 'Grade 10',
            avatar: 'https://i.pravatar.cc/150?img=1',
            overallGrade: 88,
            attendance: 94,
            upcomingClasses: 3,
            recentActivity: 'Submitted Chemistry assignment',
        },
        {
            id: '2',
            name: 'James Johnson',
            grade: 'Grade 8',
            avatar: 'https://i.pravatar.cc/150?img=12',
            overallGrade: 91,
            attendance: 97,
            upcomingClasses: 4,
            recentActivity: 'Completed Math quiz with 95%',
        },
        {
            id: '3',
            name: 'Sophie Johnson',
            grade: 'Grade 6',
            avatar: 'https://i.pravatar.cc/150?img=9',
            overallGrade: 85,
            attendance: 92,
            upcomingClasses: 2,
            recentActivity: 'Attended English class',
        },
    ];

    const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

    const upcomingClasses = [
        { id: 1, subject: 'Mathematics', teacher: 'Mr. Smith', time: 'Today, 2:00 PM', child: 'Emma Johnson' },
        { id: 2, subject: 'Physics', teacher: 'Dr. Wilson', time: 'Today, 4:00 PM', child: 'Emma Johnson' },
        { id: 3, subject: 'English', teacher: 'Ms. Davis', time: 'Tomorrow, 10:00 AM', child: 'James Johnson' },
        { id: 4, subject: 'Science', teacher: 'Mr. Brown', time: 'Tomorrow, 2:00 PM', child: 'Sophie Johnson' },
    ];

    const recentUpdates = [
        { type: 'grade', message: 'Emma scored 92% on Chemistry test', time: '2 hours ago' },
        { type: 'attendance', message: 'James marked present in Math class', time: '3 hours ago' },
        { type: 'assignment', message: 'Sophie submitted English homework', time: '5 hours ago' },
        { type: 'announcement', message: 'School holiday on Friday', time: '1 day ago' },
    ];

    const getGradeColor = (grade: number) => {
        if (grade >= 90) return '#10b981';
        if (grade >= 75) return '#3b82f6';
        return '#ef4444';
    };

    return (
        <div className="parent-dashboard-page">
            <Header navigationLinks={navigationLinks} />

            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div>
                        <h1>Welcome, {parentName}</h1>
                        <p>Monitor your children's academic progress</p>
                    </div>
                </div>

                {/* Children Selector */}
                <div className="children-selector">
                    {children.map(child => (
                        <div
                            key={child.id}
                            className={`child-card ${selectedChildId === child.id ? 'active' : ''}`}
                            onClick={() => setSelectedChildId(child.id)}
                        >
                            <img src={child.avatar} alt={child.name} className="child-avatar" />
                            <div className="child-info">
                                <h3>{child.name}</h3>
                                <p>{child.grade}</p>
                            </div>
                            <div className="child-quick-stats">
                                <span className="grade-badge" style={{ background: getGradeColor(child.overallGrade) }}>
                                    {child.overallGrade}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Selected Child Overview */}
                <div className="selected-child-section">
                    <h2>{selectedChild.name}'s Overview</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: '#e0f2fe' }}>📊</div>
                            <div className="stat-content">
                                <h3>Overall Grade</h3>
                                <p className="stat-value" style={{ color: getGradeColor(selectedChild.overallGrade) }}>
                                    {selectedChild.overallGrade}%
                                </p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: '#dcfce7' }}>✓</div>
                            <div className="stat-content">
                                <h3>Attendance</h3>
                                <p className="stat-value" style={{ color: '#10b981' }}>{selectedChild.attendance}%</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: '#fef3c7' }}>📅</div>
                            <div className="stat-content">
                                <h3>Upcoming Classes</h3>
                                <p className="stat-value" style={{ color: '#f59e0b' }}>{selectedChild.upcomingClasses}</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: '#f3e8ff' }}>🎯</div>
                            <div className="stat-content">
                                <h3>Recent Activity</h3>
                                <p className="stat-desc">{selectedChild.recentActivity}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/student/progress?childId=${selectedChild.id}`)}
                    >
                        View Full Progress Report
                    </button>
                </div>

                {/* All Children - Upcoming Classes */}
                <div className="section">
                    <div className="section-header">
                        <h2>Upcoming Classes (All Children)</h2>
                        <button className="btn btn-outline" onClick={() => navigate('/parent/schedule')}>
                            View Full Schedule
                        </button>
                    </div>

                    <div className="classes-list">
                        {upcomingClasses.map(cls => (
                            <div key={cls.id} className="class-item">
                                <div className="class-subject">
                                    <div className="subject-icon">{cls.subject.charAt(0)}</div>
                                    <div>
                                        <h3>{cls.subject}</h3>
                                        <p>{cls.teacher}</p>
                                    </div>
                                </div>
                                <div className="class-details">
                                    <span className="child-badge">{cls.child}</span>
                                    <span className="time-badge">{cls.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Updates */}
                <div className="section">
                    <h2>Recent Updates</h2>
                    <div className="updates-list">
                        {recentUpdates.map((update, index) => (
                            <div key={index} className="update-item">
                                <div className={`update-icon ${update.type}`}>
                                    {update.type === 'grade' && '📈'}
                                    {update.type === 'attendance' && '✓'}
                                    {update.type === 'assignment' && '📝'}
                                    {update.type === 'announcement' && '📢'}
                                </div>
                                <div className="update-content">
                                    <p>{update.message}</p>
                                    <span className="update-time">{update.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ParentDashboard;
