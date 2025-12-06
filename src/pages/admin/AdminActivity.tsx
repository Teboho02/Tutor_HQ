import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { ActivityLog } from '../../types/admin';
import '../../styles/AdminActivity.css';

const AdminActivity: React.FC = () => {
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock activity log data
    const [activities] = useState<ActivityLog[]>([
        {
            id: 'log1',
            timestamp: new Date('2025-02-14T10:30:00'),
            userId: 'admin1',
            userName: 'Admin User',
            userRole: 'admin',
            action: 'Approved Student Application',
            category: 'user',
            description: 'Approved application for Thabo Mabaso'
        },
        {
            id: 'log2',
            timestamp: new Date('2025-02-14T09:15:00'),
            userId: 'admin1',
            userName: 'Admin User',
            userRole: 'admin',
            action: 'Processed Payment',
            category: 'payment',
            description: 'Marked payment PAY-2025-003 as completed (R3,200)'
        },
        {
            id: 'log3',
            timestamp: new Date('2025-02-14T08:45:00'),
            userId: 'admin1',
            userName: 'Admin User',
            userRole: 'admin',
            action: 'Scheduled Class',
            category: 'session',
            description: 'Created new class session: Mathematics - Algebra for 2025-02-15'
        },
        {
            id: 'log4',
            timestamp: new Date('2025-02-13T16:20:00'),
            userId: 'admin1',
            userName: 'Admin User',
            userRole: 'admin',
            action: 'Suspended User',
            category: 'user',
            description: 'Suspended student account: Sipho Khumalo (payment issues)'
        },
        {
            id: 'log5',
            timestamp: new Date('2025-02-13T14:10:00'),
            userId: 'tutor1',
            userName: 'Sipho Dlamini',
            userRole: 'tutor',
            action: 'Completed Session',
            category: 'session',
            description: 'Completed session: Mathematics - Calculus (90 minutes)'
        },
        {
            id: 'log6',
            timestamp: new Date('2025-02-13T11:30:00'),
            userId: 'admin1',
            userName: 'Admin User',
            userRole: 'admin',
            action: 'Updated Settings',
            category: 'system',
            description: 'Updated platform fee from 5% to 5%'
        },
        {
            id: 'log7',
            timestamp: new Date('2025-02-13T10:00:00'),
            userId: 'admin1',
            userName: 'Admin User',
            userRole: 'admin',
            action: 'Sent Payment Reminder',
            category: 'payment',
            description: 'Sent reminder to Lindiwe Nkosi for overdue payment'
        },
        {
            id: 'log8',
            timestamp: new Date('2025-02-12T15:45:00'),
            userId: 'admin1',
            userName: 'Admin User',
            userRole: 'admin',
            action: 'Generated Report',
            category: 'system',
            description: 'Generated Financial Report for January 2025'
        },
        {
            id: 'log9',
            timestamp: new Date('2025-02-12T14:20:00'),
            userId: 'admin1',
            userName: 'Admin User',
            userRole: 'admin',
            action: 'Processed Tutor Payout',
            category: 'payment',
            description: 'Processed payout for Nomsa Shabalala: R19,950'
        },
        {
            id: 'log10',
            timestamp: new Date('2025-02-12T09:00:00'),
            userId: 'admin1',
            userName: 'Admin User',
            userRole: 'admin',
            action: 'Approved Tutor Application',
            category: 'user',
            description: 'Approved tutor application for Sipho Dlamini'
        }
    ]);

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'user': return '👤';
            case 'payment': return '💰';
            case 'session': return '📚';
            case 'system': return '⚙️';
            default: return '📋';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'user': return '#3b82f6';
            case 'payment': return '#10b981';
            case 'session': return '#f59e0b';
            case 'system': return '#6b7280';
            default: return '#6b7280';
        }
    };

    const filterActivities = () => {
        let filtered = activities;

        if (filterCategory !== 'all') {
            filtered = filtered.filter(a => a.category === filterCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter(a =>
                a.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.userName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredActivities = filterActivities();

    const handleExport = () => {
        alert('Exporting activity log...');
    };

    return (
        <div className="admin-activity">
            <div className="admin-header">
                <div className="admin-header-content">
                    <div className="admin-logo">
                        <h1>🎓 TutorHQ Admin</h1>
                        <span className="admin-badge">Activity Log</span>
                    </div>
                    <Link to="/admin" className="back-btn">← Back to Dashboard</Link>
                </div>
            </div>

            <div className="admin-main">
                <div className="admin-container">
                    <div className="page-header">
                        <div>
                            <h2>Activity Log</h2>
                            <p>Track all system activities and changes</p>
                        </div>
                        <button className="export-btn" onClick={handleExport}>
                            📥 Export Log
                        </button>
                    </div>

                    <div className="filter-bar">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search activities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select
                            className="category-filter"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            <option value="user">User Management</option>
                            <option value="payment">Payments</option>
                            <option value="session">Sessions</option>
                            <option value="system">System</option>
                        </select>
                    </div>

                    <div className="activity-stats">
                        <div className="stat-pill">
                            <span className="stat-label">Total Activities</span>
                            <span className="stat-value">{activities.length}</span>
                        </div>
                        <div className="stat-pill">
                            <span className="stat-label">User Actions</span>
                            <span className="stat-value">{activities.filter(a => a.category === 'user').length}</span>
                        </div>
                        <div className="stat-pill">
                            <span className="stat-label">Payment Actions</span>
                            <span className="stat-value">{activities.filter(a => a.category === 'payment').length}</span>
                        </div>
                        <div className="stat-pill">
                            <span className="stat-label">Session Actions</span>
                            <span className="stat-value">{activities.filter(a => a.category === 'session').length}</span>
                        </div>
                    </div>

                    <div className="activity-timeline">
                        {filteredActivities.map(activity => (
                            <div key={activity.id} className="activity-item">
                                <div className="activity-time">
                                    {activity.timestamp.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                                    <div className="activity-date">
                                        {activity.timestamp.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                                <div
                                    className="activity-icon"
                                    style={{ background: getCategoryColor(activity.category) }}
                                >
                                    {getCategoryIcon(activity.category)}
                                </div>
                                <div className="activity-content">
                                    <div className="activity-header">
                                        <h4>{activity.action}</h4>
                                        <span
                                            className="category-badge"
                                            style={{ background: getCategoryColor(activity.category) }}
                                        >
                                            {activity.category}
                                        </span>
                                    </div>
                                    <p className="activity-description">{activity.description}</p>
                                    <div className="activity-meta">
                                        <span className="meta-item">
                                            👤 {activity.userName}
                                        </span>
                                        <span className="meta-item">
                                            🏷️ {activity.userRole}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredActivities.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">🔍</div>
                            <h3>No Activities Found</h3>
                            <p>Try adjusting your filters or search query</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminActivity;
