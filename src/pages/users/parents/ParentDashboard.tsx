import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { SkeletonCard } from '../../../components/SkeletonLoader';
import { useToast } from '../../../components/Toast';
import { useAuth } from '../../../contexts/AuthContext';
import { parentService } from '../../../services/parent.service';
import type { NavigationLink } from '../../../types';
import './ParentDashboard.css';

interface Child {
    id: string;
    name: string;
    avatar: string | null;
    totalClasses: number;
    attendanceRate: number;
}

interface DashboardData {
    totalChildren: number;
    children: Child[];
}

const ParentDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedChildId, setSelectedChildId] = useState<string>('');

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/parent/dashboard' },
        { label: 'Schedule', href: '/parent/schedule' },
        { label: 'Account', href: '/parent/account' },
    ];

    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true);
            const response = await parentService.getDashboard();
            if (response.success) {
                setDashboardData(response.data);
                // Select first child by default
                if (response.data.children?.length > 0 && !selectedChildId) {
                    setSelectedChildId(response.data.children[0].id);
                }
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            showToast(err.response?.data?.message || 'Failed to load dashboard', 'error');
            setDashboardData(null);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showToast]);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const children = dashboardData?.children || [];
    const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

    const getGradeColor = (rate: number) => {
        if (rate >= 90) return '#10b981';
        if (rate >= 75) return '#3b82f6';
        return '#ef4444';
    };

    if (loading) {
        return (
            <div className="parent-dashboard-page">
                <Header navigationLinks={navigationLinks} />
                <div className="dashboard-container">
                    <div className="dashboard-header">
                        <div><h1>Loading Dashboard...</h1></div>
                    </div>
                    <div className="stats-grid">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!dashboardData || children.length === 0) {
        return (
            <div className="parent-dashboard-page">
                <Header navigationLinks={navigationLinks} />
                <div className="dashboard-container" style={{ textAlign: 'center' }}>
                    <div style={{ maxWidth: '500px', margin: '60px auto' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>👨‍👩‍👧</div>
                        <h1 style={{ marginBottom: '15px' }}>No Children Linked</h1>
                        <p style={{ color: '#666666', marginBottom: '30px' }}>
                            You haven't linked any children to your account yet. Contact support or ask your child's tutor to link them.
                        </p>
                        <button onClick={fetchDashboard} className="btn btn-primary" style={{ padding: '12px 40px' }}>
                            🔄 Retry
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="parent-dashboard-page">
            <Header navigationLinks={navigationLinks} />

            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div>
                        <h1>Welcome, {user?.fullName || 'Parent'}</h1>
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
                            <div className="child-avatar" style={{
                                width: 48, height: 48, borderRadius: '50%',
                                background: '#e0f2fe', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontSize: '1.5rem'
                            }}>
                                {child.avatar ? (
                                    <img src={child.avatar} alt={child.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : '👤'}
                            </div>
                            <div className="child-info">
                                <h3>{child.name}</h3>
                                <p>{child.totalClasses} classes</p>
                            </div>
                            <div className="child-quick-stats">
                                <span className="grade-badge" style={{ background: getGradeColor(child.attendanceRate) }}>
                                    {child.attendanceRate}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Selected Child Overview */}
                {selectedChild && (
                    <div className="selected-child-section">
                        <h2>{selectedChild.name}'s Overview</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#dcfce7' }}>✓</div>
                                <div className="stat-content">
                                    <h3>Attendance</h3>
                                    <p className="stat-value" style={{ color: getGradeColor(selectedChild.attendanceRate) }}>
                                        {selectedChild.attendanceRate}%
                                    </p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#fef3c7' }}>📅</div>
                                <div className="stat-content">
                                    <h3>Total Classes</h3>
                                    <p className="stat-value" style={{ color: '#f59e0b' }}>{selectedChild.totalClasses}</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#f3e8ff' }}>🎯</div>
                                <div className="stat-content">
                                    <h3>View Details</h3>
                                    <button
                                        className="btn btn-outline btn-sm"
                                        onClick={() => navigate(`/parent/child/${selectedChild.id}`)}
                                        style={{ marginTop: '8px' }}
                                    >
                                        Full Progress →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ParentDashboard;
