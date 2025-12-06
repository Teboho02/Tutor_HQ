import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import type { NavigationLink } from '../../../types';
import './ChildProgress.css';

interface Subject {
    name: string;
    grade: number;
    tests: number;
    assignments: number;
    attendance: number;
}

const ChildProgress: React.FC = () => {
    const { childId } = useParams<{ childId: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'attendance' | 'assignments'>('overview');

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/parent/dashboard' },
        { label: 'Payments', href: '/parent/payments' },
        { label: 'Schedule', href: '/parent/schedule' },
        { label: 'Account', href: '/parent/account' },
    ];

    const childData = {
        '1': { name: 'Emma Johnson', grade: 'Grade 10', avatar: 'https://i.pravatar.cc/150?img=1' },
        '2': { name: 'James Johnson', grade: 'Grade 8', avatar: 'https://i.pravatar.cc/150?img=12' },
        '3': { name: 'Sophie Johnson', grade: 'Grade 6', avatar: 'https://i.pravatar.cc/150?img=9' },
    };

    const child = childData[childId as keyof typeof childData] || childData['1'];

    const subjects: Subject[] = [
        { name: 'Mathematics', grade: 92, tests: 8, assignments: 12, attendance: 95 },
        { name: 'Physics', grade: 88, tests: 6, assignments: 10, attendance: 93 },
        { name: 'Chemistry', grade: 85, tests: 7, assignments: 11, attendance: 96 },
        { name: 'English', grade: 90, tests: 5, assignments: 14, attendance: 94 },
        { name: 'Computer Science', grade: 94, tests: 6, assignments: 13, attendance: 97 },
    ];

    const recentTests = [
        { subject: 'Mathematics', title: 'Calculus Quiz', score: 95, date: '2024-01-15' },
        { subject: 'Physics', title: 'Quantum Mechanics Test', score: 88, date: '2024-01-14' },
        { subject: 'Chemistry', title: 'Organic Chemistry Exam', score: 82, date: '2024-01-12' },
    ];

    const upcomingAssignments = [
        { subject: 'English', title: 'Shakespeare Essay', dueDate: '2024-01-20', status: 'pending' },
        { subject: 'Computer Science', title: 'Algorithm Project', dueDate: '2024-01-22', status: 'in-progress' },
        { subject: 'Mathematics', title: 'Problem Set 8', dueDate: '2024-01-18', status: 'pending' },
    ];

    const attendanceData = [
        { week: 'Week 1', present: 5, total: 5 },
        { week: 'Week 2', present: 5, total: 5 },
        { week: 'Week 3', present: 4, total: 5 },
        { week: 'Week 4', present: 5, total: 5 },
    ];

    const getGradeColor = (grade: number) => {
        if (grade >= 90) return '#10b981';
        if (grade >= 75) return '#3b82f6';
        return '#ef4444';
    };

    const getStatusColor = (status: string) => {
        if (status === 'in-progress') return '#f59e0b';
        return '#718096';
    };

    return (
        <div className="child-progress-page">
            <Header navigationLinks={navigationLinks} />

            <div className="progress-container">
                <button className="back-button" onClick={() => navigate('/parent/dashboard')}>
                    ← Back to Dashboard
                </button>

                {/* Child Header */}
                <div className="child-header">
                    <img src={child.avatar} alt={child.name} className="child-avatar-large" />
                    <div className="child-header-info">
                        <h1>{child.name}</h1>
                        <p>{child.grade}</p>
                    </div>
                    <div className="overall-stats">
                        <div className="overall-stat">
                            <span className="label">Overall Grade</span>
                            <span className="value" style={{ color: getGradeColor(89.8) }}>89.8%</span>
                        </div>
                        <div className="overall-stat">
                            <span className="label">Attendance</span>
                            <span className="value" style={{ color: '#10b981' }}>95%</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`tab ${activeTab === 'subjects' ? 'active' : ''}`}
                        onClick={() => setActiveTab('subjects')}
                    >
                        Subjects
                    </button>
                    <button
                        className={`tab ${activeTab === 'attendance' ? 'active' : ''}`}
                        onClick={() => setActiveTab('attendance')}
                    >
                        Attendance
                    </button>
                    <button
                        className={`tab ${activeTab === 'assignments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('assignments')}
                    >
                        Assignments
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="tab-content">
                        <div className="two-column-layout">
                            {/* Recent Tests */}
                            <div className="section">
                                <h2>Recent Tests</h2>
                                <div className="tests-list">
                                    {recentTests.map((test, index) => (
                                        <div key={index} className="test-item">
                                            <div>
                                                <h3>{test.title}</h3>
                                                <p>{test.subject} • {test.date}</p>
                                            </div>
                                            <span
                                                className="score-badge"
                                                style={{ background: getGradeColor(test.score) }}
                                            >
                                                {test.score}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Upcoming Assignments */}
                            <div className="section">
                                <h2>Upcoming Assignments</h2>
                                <div className="assignments-list">
                                    {upcomingAssignments.map((assignment, index) => (
                                        <div key={index} className="assignment-item">
                                            <div>
                                                <h3>{assignment.title}</h3>
                                                <p>{assignment.subject} • Due: {assignment.dueDate}</p>
                                            </div>
                                            <span
                                                className="status-badge"
                                                style={{ background: getStatusColor(assignment.status) }}
                                            >
                                                {assignment.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'subjects' && (
                    <div className="tab-content">
                        <div className="subjects-grid">
                            {subjects.map((subject, index) => (
                                <div key={index} className="subject-card">
                                    <div className="subject-header">
                                        <h3>{subject.name}</h3>
                                        <span
                                            className="grade-badge"
                                            style={{ background: getGradeColor(subject.grade) }}
                                        >
                                            {subject.grade}%
                                        </span>
                                    </div>
                                    <div className="subject-stats">
                                        <div className="stat-row">
                                            <span>Tests Completed:</span>
                                            <span>{subject.tests}</span>
                                        </div>
                                        <div className="stat-row">
                                            <span>Assignments:</span>
                                            <span>{subject.assignments}</span>
                                        </div>
                                        <div className="stat-row">
                                            <span>Attendance:</span>
                                            <span>{subject.attendance}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'attendance' && (
                    <div className="tab-content">
                        <div className="attendance-chart">
                            {attendanceData.map((week, index) => (
                                <div key={index} className="week-row">
                                    <span className="week-label">{week.week}</span>
                                    <div className="attendance-bar">
                                        <div
                                            className="attendance-fill"
                                            style={{ width: `${(week.present / week.total) * 100}%` }}
                                        />
                                    </div>
                                    <span className="attendance-ratio">{week.present}/{week.total}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'assignments' && (
                    <div className="tab-content">
                        <div className="assignments-detailed">
                            {upcomingAssignments.map((assignment, index) => (
                                <div key={index} className="assignment-card">
                                    <div className="assignment-header">
                                        <h3>{assignment.title}</h3>
                                        <span
                                            className="status-badge"
                                            style={{ background: getStatusColor(assignment.status) }}
                                        >
                                            {assignment.status}
                                        </span>
                                    </div>
                                    <div className="assignment-meta">
                                        <span>📚 {assignment.subject}</span>
                                        <span>📅 Due: {assignment.dueDate}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ChildProgress;
