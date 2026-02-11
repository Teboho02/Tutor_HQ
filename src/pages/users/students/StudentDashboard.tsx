import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { SkeletonCard } from '../../../components/SkeletonLoader';
import { useToast } from '../../../components/Toast';
import { studentService } from '../../../services/student.service';
import type { NavigationLink } from '../../../types';
import './StudentDashboard.css';

interface DashboardData {
    studentName?: string;
    upcomingClasses?: Array<{
        id: string;
        subject: string;
        topic: string;
        time: string;
        tutor: string;
    }>;
    recentAssignments?: Array<{
        id: string;
        title: string;
        subject: string;
        status: 'completed' | 'pending';
        grade?: string;
        dueDate?: string;
    }>;
    quickStats?: Array<{
        icon: string;
        value: string | number;
        label: string;
        color: string;
    }>;
}

const StudentDashboard: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/student/dashboard' },
        { label: 'Calendar', href: '/student/calendar' },
        { label: 'Materials', href: '/student/materials' },
        { label: 'Progress', href: '/student/progress' },
        { label: 'Tests', href: '/student/tests' },
        { label: 'Goals', href: '/student/goals' },
    ];

    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true);
            const response = await studentService.getDashboard();
            if (response.success) {
                setDashboardData(response.data);
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            showToast(err.response?.data?.message || 'Failed to load dashboard', 'error');
            // Don't set fallback data - let error state show
            setDashboardData(null);
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const upcomingClasses = dashboardData?.upcomingClasses || [];
    const recentAssignments = dashboardData?.recentAssignments || [];
    const quickStats = dashboardData?.quickStats || [];

    if (loading) {
        return (
            <div className="student-dashboard-page">
                <Header navigationLinks={navigationLinks} />
                <div className="student-dashboard-container">
                    <div className="dashboard-header">
                        <div className="welcome-section">
                            <h1>Loading Dashboard...</h1>
                        </div>
                    </div>
                    <div className="quick-stats-grid">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                    <div className="dashboard-content">
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="student-dashboard-page">
            <Header navigationLinks={navigationLinks} />

            <div className="student-dashboard-container">
                <div className="dashboard-header">
                    <div className="welcome-section">
                        <h1>Welcome Back, {dashboardData?.studentName || 'Student'}! 🎓</h1>
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
