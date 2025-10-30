import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import type { NavigationLink } from '../../../types';
import './StudentProgress.css';

interface SubjectProgress {
    subject: string;
    icon: string;
    color: string;
    average: number;
    assignments: number;
    attendance: number;
    trend: 'up' | 'down' | 'stable';
}

interface RecentActivity {
    type: 'assignment' | 'test' | 'attendance';
    subject: string;
    title: string;
    score?: number;
    maxScore?: number;
    date: string;
}

const StudentProgress: React.FC = () => {
    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/student/dashboard' },
        { label: 'Live Classes', href: '/student/live-classes' },
        { label: 'Calendar', href: '/student/calendar' },
        { label: 'Materials', href: '/student/materials' },
        { label: 'Progress', href: '/student/progress' },
        { label: 'Tests', href: '/student/tests' },
        { label: 'Messages', href: '/student/messages' },
    ];

    const overallStats = [
        { label: 'Overall Average', value: '89.5%', icon: '📊', color: '#0066ff' },
        { label: 'Assignments Completed', value: '28/30', icon: '✅', color: '#34c759' },
        { label: 'Attendance Rate', value: '95%', icon: '📅', color: '#5856d6' },
        { label: 'Class Rank', value: '5th', icon: '🏆', color: '#ff9500' },
    ];

    const subjectProgress: SubjectProgress[] = [
        { subject: 'Mathematics', icon: '🔢', color: '#0066ff', average: 92, assignments: 8, attendance: 98, trend: 'up' },
        { subject: 'Physics', icon: '⚛️', color: '#5856d6', average: 88, assignments: 6, attendance: 95, trend: 'stable' },
        { subject: 'Chemistry', icon: '🧪', color: '#34c759', average: 90, assignments: 7, attendance: 92, trend: 'up' },
        { subject: 'Biology', icon: '🧬', color: '#ff9500', average: 87, assignments: 5, attendance: 90, trend: 'down' },
        { subject: 'English', icon: '📖', color: '#ff3b30', average: 91, assignments: 6, attendance: 97, trend: 'up' },
        { subject: 'History', icon: '🏛️', color: '#af52de', average: 86, assignments: 4, attendance: 88, trend: 'stable' },
    ];

    const recentActivity: RecentActivity[] = [
        { type: 'assignment', subject: 'Mathematics', title: 'Integration Assignment', score: 92, maxScore: 100, date: '2 days ago' },
        { type: 'test', subject: 'Physics', title: 'Mechanics Midterm', score: 88, maxScore: 100, date: '3 days ago' },
        { type: 'assignment', subject: 'Chemistry', title: 'Lab Report 3', score: 95, maxScore: 100, date: '4 days ago' },
        { type: 'attendance', subject: 'Biology', title: 'Class Attendance', date: '5 days ago' },
        { type: 'assignment', subject: 'English', title: 'Essay Submission', score: 89, maxScore: 100, date: '1 week ago' },
    ];

    const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
        switch (trend) {
            case 'up': return '📈';
            case 'down': return '📉';
            case 'stable': return '➡️';
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'assignment': return '📝';
            case 'test': return '📋';
            case 'attendance': return '✅';
            default: return '📌';
        }
    };

    return (
        <div className="student-progress-page">
            <Header navigationLinks={navigationLinks} />

            <div className="progress-container">
                <div className="page-header">
                    <h1>My Progress</h1>
                    <p>Track your academic performance and achievements</p>
                </div>

                {/* Overall Stats */}
                <div className="stats-grid">
                    {overallStats.map((stat, index) => (
                        <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
                            <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
                            <div className="stat-info">
                                <div className="stat-label">{stat.label}</div>
                                <div className="stat-value">{stat.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Progress Chart Placeholder */}
                <div className="chart-section">
                    <h2>Performance Overview</h2>
                    <div className="chart-placeholder">
                        <div className="chart-bars">
                            {subjectProgress.map((subject) => (
                                <div key={subject.subject} className="chart-bar-wrapper">
                                    <div className="chart-bar">
                                        <div
                                            className="chart-bar-fill"
                                            style={{
                                                height: `${subject.average}%`,
                                                backgroundColor: subject.color
                                            }}
                                        />
                                    </div>
                                    <div className="chart-label">{subject.icon}</div>
                                    <div className="chart-percentage">{subject.average}%</div>
                                </div>
                            ))}
                        </div>
                        <div className="chart-y-axis">
                            <span>100%</span>
                            <span>75%</span>
                            <span>50%</span>
                            <span>25%</span>
                            <span>0%</span>
                        </div>
                    </div>
                </div>

                {/* Subject Progress Cards */}
                <div className="subject-progress-section">
                    <h2>Subject-wise Progress</h2>
                    <div className="subject-progress-grid">
                        {subjectProgress.map((subject) => (
                            <div key={subject.subject} className="subject-progress-card">
                                <div className="subject-header">
                                    <div className="subject-icon-badge" style={{ backgroundColor: `${subject.color}20`, color: subject.color }}>
                                        {subject.icon}
                                    </div>
                                    <div className="subject-title">
                                        <h3>{subject.subject}</h3>
                                        <span className="trend-badge">{getTrendIcon(subject.trend)} {subject.trend}</span>
                                    </div>
                                </div>

                                <div className="subject-stats">
                                    <div className="stat-row">
                                        <span className="stat-label">Average</span>
                                        <span className="stat-value">{subject.average}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${subject.average}%`, backgroundColor: subject.color }}
                                        />
                                    </div>

                                    <div className="subject-metrics">
                                        <div className="metric">
                                            <span>📝 Assignments</span>
                                            <strong>{subject.assignments}</strong>
                                        </div>
                                        <div className="metric">
                                            <span>📅 Attendance</span>
                                            <strong>{subject.attendance}%</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="activity-section">
                    <h2>Recent Activity</h2>
                    <div className="activity-list">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="activity-item">
                                <div className="activity-icon">{getActivityIcon(activity.type)}</div>
                                <div className="activity-info">
                                    <div className="activity-header">
                                        <h4>{activity.title}</h4>
                                        {activity.score !== undefined && (
                                            <span className="activity-score">
                                                {activity.score}/{activity.maxScore} ({((activity.score / activity.maxScore!) * 100).toFixed(0)}%)
                                            </span>
                                        )}
                                    </div>
                                    <div className="activity-meta">
                                        <span className="activity-subject">{activity.subject}</span>
                                        <span className="activity-date">📅 {activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Achievements Section */}
                <div className="achievements-section">
                    <h2>Achievements</h2>
                    <div className="achievements-grid">
                        <div className="achievement-card">
                            <div className="achievement-icon">🏆</div>
                            <h4>Top Performer</h4>
                            <p>Mathematics</p>
                        </div>
                        <div className="achievement-card">
                            <div className="achievement-icon">⭐</div>
                            <h4>Perfect Attendance</h4>
                            <p>Last Month</p>
                        </div>
                        <div className="achievement-card">
                            <div className="achievement-icon">🎯</div>
                            <h4>Assignment Streak</h4>
                            <p>10 in a row</p>
                        </div>
                        <div className="achievement-card locked">
                            <div className="achievement-icon">🔒</div>
                            <h4>Class Leader</h4>
                            <p>Reach #1 Rank</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default StudentProgress;
