import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SkeletonCard } from '../components/SkeletonLoader';
import { useToast } from '../components/Toast';
import { parentService } from '../services/parent.service';
import type { NavigationLink } from '../types';

interface Child {
    id: string;
    name: string;
    grade: string;
    averageGrade: string;
    attendance: string;
}

interface ClassItem {
    id: string;
    subject: string;
    childName: string;
    time: string;
}

interface DashboardData {
    children: Child[];
    upcomingClasses: ClassItem[];
}

const ParentsDash: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/parent/dashboard' },
        { label: 'Children', href: '/parent/children' },
        { label: 'Schedule', href: '/parent/schedule' },
        { label: 'Account', href: '/parent/account' },
    ];

    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true);
            const response = await parentService.getDashboard();
            if (response.success) {
                setDashboardData(response.data);
            }
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            showToast(axiosError.response?.data?.message || 'Failed to load dashboard', 'error');
            // Don't set fallback data - let error state show
            setDashboardData(null);
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const children = dashboardData?.children || [];
    const upcomingClasses = dashboardData?.upcomingClasses || [];

    if (loading) {
        return (
            <div className="parents-dash">
                <Header navigationLinks={navigationLinks} />
                <div style={{ padding: '120px 20px 40px', minHeight: '100vh', maxWidth: '1200px', margin: '0 auto' }}>
                    <h1>Loading Dashboard...</h1>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="parents-dash">
                <Header navigationLinks={navigationLinks} />
                <div style={{ padding: '120px 20px 40px', minHeight: '100vh', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ maxWidth: '500px', margin: '60px auto' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⚠️</div>
                        <h1 style={{ marginBottom: '15px' }}>Failed to Load Dashboard</h1>
                        <p style={{ color: '#666666', marginBottom: '30px' }}>
                            Unable to connect to the server. Please check your internet connection and try again.
                        </p>
                        <button
                            onClick={fetchDashboard}
                            className="btn btn-primary"
                            style={{ padding: '12px 40px', fontSize: '1rem' }}
                        >
                            🔄 Retry
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="parents-dash">
            <Header navigationLinks={navigationLinks} />
            <div style={{ padding: '120px 20px 40px', minHeight: '100vh', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '30px' }}>
                    <h1>Parent Dashboard</h1>
                    <p>Monitor your children's progress and upcoming classes</p>
                </div>

                {/* Children Overview */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ marginBottom: '20px' }}>Your Children</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        {children.map((child: Child) => (
                            <div key={child.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', background: 'white' }}>
                                <h3>{child.name}</h3>
                                <p style={{ color: '#666', marginBottom: '15px' }}>{child.grade}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span>Average Grade:</span>
                                    <strong>{child.averageGrade}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Attendance:</span>
                                    <strong>{child.attendance}</strong>
                                </div>
                                <Link
                                    to={`/parent/child/${child.id}`}
                                    style={{ display: 'inline-block', marginTop: '15px', color: '#0066ff', textDecoration: 'none' }}
                                >
                                    View Details →
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Classes */}
                <div>
                    <h2 style={{ marginBottom: '20px' }}>Upcoming Classes</h2>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {upcomingClasses.map((classItem: ClassItem) => (
                            <div key={classItem.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ marginBottom: '5px' }}>{classItem.subject}</h3>
                                    <p style={{ color: '#666', marginBottom: '5px' }}>Student: {classItem.childName}</p>
                                    <p style={{ color: '#0066ff' }}>🕒 {classItem.time}</p>
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

export default ParentsDash;