import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { AnalyticsSummary, AdminNotification } from '../../types/admin';
import '../../styles/AdminDashboard.css';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [notifications] = useState<AdminNotification[]>([
        {
            id: '1',
            type: 'payment',
            priority: 'high',
            title: 'Overdue Payments',
            message: '5 students have overdue payments',
            timestamp: new Date(),
            read: false,
            actionUrl: '/admin/payments',
            actionLabel: 'View Payments'
        },
        {
            id: '2',
            type: 'user',
            priority: 'medium',
            title: 'Pending Approvals',
            message: '3 tutor applications awaiting review',
            timestamp: new Date(),
            read: false,
            actionUrl: '/admin/onboarding',
            actionLabel: 'Review Applications'
        }
    ]);

    // Mock analytics data
    const analytics: AnalyticsSummary = {
        totalStudents: 156,
        activeStudents: 142,
        totalTutors: 23,
        activeTutors: 21,
        totalRevenue: 1247580,
        monthlyRevenue: 156890,
        pendingPayments: 45200,
        overduePayments: 12300,
        totalSessions: 2341,
        completedSessions: 2198,
        averageAttendance: 92.5,
        studentGrowth: 15.3,
        revenueGrowth: 22.7
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const adminModules = [
        {
            id: 'onboarding',
            icon: '👥',
            title: 'Onboarding',
            description: 'Manage student & tutor applications',
            path: '/admin/onboarding',
            badge: '3',
            color: '#667eea'
        },
        {
            id: 'users',
            icon: '👤',
            title: 'User Management',
            description: 'Students, Tutors & Parents',
            path: '/admin/users',
            color: '#764ba2'
        },
        {
            id: 'scheduling',
            icon: '📅',
            title: 'Class Scheduling',
            description: 'Schedule & manage classes',
            path: '/admin/scheduling',
            color: '#f59e0b'
        },
        {
            id: 'payments',
            icon: '💰',
            title: 'Payments',
            description: 'Track payments & payouts',
            path: '/admin/payments',
            badge: '5',
            color: '#10b981'
        },
        {
            id: 'performance',
            icon: '📊',
            title: 'Performance',
            description: 'Student & class analytics',
            path: '/admin/performance',
            color: '#3b82f6'
        },
        {
            id: 'reports',
            icon: '📈',
            title: 'Reports',
            description: 'Financial & academic reports',
            path: '/admin/reports',
            color: '#8b5cf6'
        },
        {
            id: 'settings',
            icon: '⚙️',
            title: 'Settings',
            description: 'System configuration',
            path: '/admin/settings',
            color: '#6b7280'
        },
        {
            id: 'activity',
            icon: '📋',
            title: 'Activity Log',
            description: 'System activity & audit trail',
            path: '/admin/activity',
            color: '#ec4899'
        }
    ];

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="admin-dashboard">
            {/* Top Navigation */}
            <header className="admin-header">
                <div className="admin-header-content">
                    <div className="admin-logo">
                        <h1>TutorHQ Admin</h1>
                        <span className="admin-badge">CEO Dashboard</span>
                    </div>
                    <div className="admin-header-actions">
                        <button className="notification-btn">
                            🔔
                            {notifications.filter(n => !n.read).length > 0 && (
                                <span className="notification-badge">
                                    {notifications.filter(n => !n.read).length}
                                </span>
                            )}
                        </button>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="admin-main">
                <div className="admin-container">
                    {/* Welcome Section */}
                    <div className="welcome-section">
                        <h2>Welcome back, Founder 👋</h2>
                        <p>Here's what's happening with TutorHQ today</p>
                    </div>

                    {/* Key Metrics */}
                    <div className="metrics-grid">
                        <div className="metric-card revenue">
                            <div className="metric-icon">💰</div>
                            <div className="metric-content">
                                <h3>Total Revenue</h3>
                                <p className="metric-value">{formatCurrency(analytics.totalRevenue)}</p>
                                <span className="metric-trend positive">
                                    ↑ {analytics.revenueGrowth}% this month
                                </span>
                            </div>
                        </div>

                        <div className="metric-card students">
                            <div className="metric-icon">👨‍🎓</div>
                            <div className="metric-content">
                                <h3>Active Students</h3>
                                <p className="metric-value">{analytics.activeStudents}</p>
                                <span className="metric-detail">
                                    of {analytics.totalStudents} total
                                </span>
                            </div>
                        </div>

                        <div className="metric-card tutors">
                            <div className="metric-icon">👨‍🏫</div>
                            <div className="metric-content">
                                <h3>Active Tutors</h3>
                                <p className="metric-value">{analytics.activeTutors}</p>
                                <span className="metric-detail">
                                    of {analytics.totalTutors} total
                                </span>
                            </div>
                        </div>

                        <div className="metric-card sessions">
                            <div className="metric-icon">📚</div>
                            <div className="metric-content">
                                <h3>Sessions Completed</h3>
                                <p className="metric-value">{analytics.completedSessions}</p>
                                <span className="metric-detail">
                                    {analytics.averageAttendance}% attendance
                                </span>
                            </div>
                        </div>

                        <div className="metric-card pending">
                            <div className="metric-icon">⏳</div>
                            <div className="metric-content">
                                <h3>Pending Payments</h3>
                                <p className="metric-value">{formatCurrency(analytics.pendingPayments)}</p>
                                <span className="metric-detail">
                                    {formatCurrency(analytics.overduePayments)} overdue
                                </span>
                            </div>
                        </div>

                        <div className="metric-card growth">
                            <div className="metric-icon">📈</div>
                            <div className="metric-content">
                                <h3>Student Growth</h3>
                                <p className="metric-value">{analytics.studentGrowth}%</p>
                                <span className="metric-trend positive">
                                    ↑ Growing steadily
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Urgent Notifications */}
                    {notifications.filter(n => !n.read && n.priority === 'high').length > 0 && (
                        <div className="urgent-alerts">
                            <h3>🚨 Requires Attention</h3>
                            <div className="alert-list">
                                {notifications.filter(n => !n.read && n.priority === 'high').map(notif => (
                                    <div key={notif.id} className="alert-item">
                                        <div className="alert-content">
                                            <h4>{notif.title}</h4>
                                            <p>{notif.message}</p>
                                        </div>
                                        {notif.actionUrl && (
                                            <Link to={notif.actionUrl} className="alert-action">
                                                {notif.actionLabel || 'View'} →
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Admin Modules */}
                    <div className="modules-section">
                        <h3>Admin Modules</h3>
                        <div className="modules-grid">
                            {adminModules.map(module => (
                                <Link
                                    key={module.id}
                                    to={module.path}
                                    className="module-card"
                                    style={{ borderLeftColor: module.color }}
                                >
                                    <div className="module-header">
                                        <span className="module-icon" style={{ background: `${module.color}20` }}>
                                            {module.icon}
                                        </span>
                                        {module.badge && (
                                            <span className="module-badge" style={{ background: module.color }}>
                                                {module.badge}
                                            </span>
                                        )}
                                    </div>
                                    <h4>{module.title}</h4>
                                    <p>{module.description}</p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <h3>Quick Actions</h3>
                        <div className="actions-grid">
                            <button className="action-btn" onClick={() => navigate('/admin/onboarding')}>
                                <span className="action-icon">✅</span>
                                Approve Applications
                            </button>
                            <button className="action-btn" onClick={() => navigate('/admin/scheduling')}>
                                <span className="action-icon">➕</span>
                                Schedule Class
                            </button>
                            <button className="action-btn" onClick={() => navigate('/admin/payments')}>
                                <span className="action-icon">💳</span>
                                Process Payments
                            </button>
                            <button className="action-btn" onClick={() => navigate('/admin/reports')}>
                                <span className="action-icon">📊</span>
                                Generate Report
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
