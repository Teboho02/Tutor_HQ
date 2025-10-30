import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import type { NavigationLink } from '../../../types';
import './StudentDashboard.css';

const StudentDashboard: React.FC = () => {
    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/student/dashboard' },
        { label: 'Live Classes', href: '/student/live-classes' },
        { label: 'Calendar', href: '/student/calendar' },
        { label: 'Materials', href: '/student/materials' },
        { label: 'Progress', href: '/student/progress' },
        { label: 'Tests', href: '/student/tests' },
        { label: 'Messages', href: '/student/messages' },
    ];

    const upcomingClasses = [
        { id: 1, subject: 'Mathematics', topic: 'Quadratic Equations', time: 'Today, 2:00 PM', tutor: 'Dr. Smith' },
        { id: 2, subject: 'Physics', topic: 'Newton\'s Laws', time: 'Tomorrow, 10:00 AM', tutor: 'Prof. Johnson' },
        { id: 3, subject: 'Chemistry', topic: 'Organic Compounds', time: 'Thursday, 3:00 PM', tutor: 'Dr. Williams' },
    ];

    const recentAssignments = [
        { id: 1, title: 'Math Assignment 5', subject: 'Mathematics', dueDate: 'Tomorrow', status: 'pending' },
        { id: 2, title: 'Physics Lab Report', subject: 'Physics', dueDate: 'In 3 days', status: 'pending' },
        { id: 3, title: 'Chemistry Quiz', subject: 'Chemistry', dueDate: 'Completed', status: 'completed', grade: '92%' },
    ];

    const quickStats = [
        { label: 'Upcoming Classes', value: '3', icon: '📚', color: '#0066ff' },
        { label: 'Pending Assignments', value: '2', icon: '📝', color: '#ff9500' },
        { label: 'Average Grade', value: '87%', icon: '⭐', color: '#34c759' },
        { label: 'Attendance', value: '95%', icon: '✅', color: '#5856d6' },
    ];

    return (
        <div className="student-dashboard-page">
            <Header navigationLinks={navigationLinks} />

            <div className="student-dashboard-container">
                <div className="dashboard-header">
                    <div className="welcome-section">
                        <h1>Welcome Back, Student!</h1>
                        <p>Here's what's happening with your classes today</p>
                    </div>
                    <div className="quick-actions">
                        <Link to="/student/live-classes" className="btn btn-primary">
                            Join Live Class
                        </Link>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="quick-stats-grid">
                    {quickStats.map((stat, index) => (
                        <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
                            <div className="stat-icon" style={{ color: stat.color }}>
                                {stat.icon}
                            </div>
                            <div className="stat-content">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="dashboard-content">
                    {/* Upcoming Classes */}
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2>Upcoming Classes</h2>
                            <Link to="/student/calendar" className="view-all-link">
                                View All →
                            </Link>
                        </div>
                        <div className="classes-list">
                            {upcomingClasses.map((classItem) => (
                                <div key={classItem.id} className="class-card">
                                    <div className="class-info">
                                        <div className="class-subject">{classItem.subject}</div>
                                        <div className="class-topic">{classItem.topic}</div>
                                        <div className="class-meta">
                                            <span className="class-time">🕒 {classItem.time}</span>
                                            <span className="class-tutor">👨‍🏫 {classItem.tutor}</span>
                                        </div>
                                    </div>
                                    <Link to="/student/live-classes" className="btn btn-outline btn-sm">
                                        Join
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Assignments */}
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2>Recent Assignments</h2>
                            <Link to="/student/materials" className="view-all-link">
                                View All →
                            </Link>
                        </div>
                        <div className="assignments-list">
                            {recentAssignments.map((assignment) => (
                                <div key={assignment.id} className="assignment-card">
                                    <div className="assignment-info">
                                        <div className="assignment-title">{assignment.title}</div>
                                        <div className="assignment-subject">{assignment.subject}</div>
                                    </div>
                                    <div className="assignment-status">
                                        {assignment.status === 'completed' ? (
                                            <>
                                                <span className="status-badge completed">Completed</span>
                                                <span className="grade">{assignment.grade}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="status-badge pending">Pending</span>
                                                <span className="due-date">Due: {assignment.dueDate}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="dashboard-section quick-links-section">
                        <h2>Quick Links</h2>
                        <div className="quick-links-grid">
                            <Link to="/student/live-classes" className="quick-link-card">
                                <span className="link-icon">📹</span>
                                <span className="link-text">Live Classes</span>
                            </Link>
                            <Link to="/student/calendar" className="quick-link-card">
                                <span className="link-icon">📅</span>
                                <span className="link-text">Calendar</span>
                            </Link>
                            <Link to="/student/materials" className="quick-link-card">
                                <span className="link-icon">📚</span>
                                <span className="link-text">Materials</span>
                            </Link>
                            <Link to="/student/progress" className="quick-link-card">
                                <span className="link-icon">📊</span>
                                <span className="link-text">Progress</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default StudentDashboard;
