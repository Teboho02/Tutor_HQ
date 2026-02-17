import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('student' | 'tutor' | 'parent' | 'admin')[];
}

const roleDashboardMap: Record<string, { path: string; label: string }> = {
    student: { path: '/student/dashboard', label: 'Student Dashboard' },
    tutor: { path: '/tutor/dashboard', label: 'Tutor Dashboard' },
    parent: { path: '/parent/dashboard', label: 'Parent Dashboard' },
    admin: { path: '/admin/dashboard', label: 'Admin Dashboard' },
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                fontSize: '1.2rem',
                color: 'var(--primary-blue, #667eea)',
            }}>
                <div>Loading...</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check account approval status
    if (user.status === 'pending') {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: '#f7fafc',
                padding: '20px',
            }}>
                <div style={{
                    maxWidth: '500px',
                    textAlign: 'center',
                    background: 'white',
                    borderRadius: '16px',
                    padding: '40px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⏳</div>
                    <h1 style={{ marginBottom: '15px', color: '#2d3748' }}>Account Pending Approval</h1>
                    <p style={{ color: '#718096', marginBottom: '30px', lineHeight: '1.6' }}>
                        Your account is currently under review. An administrator will approve your account shortly.
                        You'll receive a notification once approved.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        style={{
                            padding: '12px 30px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 500,
                        }}
                    >
                        Go to Homepage
                    </button>
                </div>
            </div>
        );
    }

    if (user.status === 'rejected') {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: '#f7fafc',
                padding: '20px',
            }}>
                <div style={{
                    maxWidth: '500px',
                    textAlign: 'center',
                    background: 'white',
                    borderRadius: '16px',
                    padding: '40px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>❌</div>
                    <h1 style={{ marginBottom: '15px', color: '#2d3748' }}>Account Not Approved</h1>
                    <p style={{ color: '#718096', marginBottom: '30px', lineHeight: '1.6' }}>
                        Your account registration was not approved. Please contact the administrator for more information.
                    </p>
                    <button
                        onClick={() => window.location.href = '/contact'}
                        style={{
                            padding: '12px 30px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 500,
                        }}
                    >
                        Contact Support
                    </button>
                </div>
            </div>
        );
    }

    if (allowedRoles && !allowedRoles.includes(user.role as 'student' | 'tutor' | 'parent' | 'admin')) {
        const userDashboard = roleDashboardMap[user.role || ''];
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: '#f7fafc',
                padding: '20px',
            }}>
                <div style={{
                    maxWidth: '500px',
                    textAlign: 'center',
                    background: 'white',
                    borderRadius: '16px',
                    padding: '40px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔒</div>
                    <h1 style={{ marginBottom: '15px', color: '#2d3748' }}>Access Denied</h1>
                    <p style={{ color: '#718096', marginBottom: '10px' }}>
                        This page requires <strong>{allowedRoles.join(' or ')}</strong> access.
                    </p>
                    <p style={{ color: '#718096', marginBottom: '30px' }}>
                        You are currently signed in as <strong style={{ textTransform: 'capitalize' }}>{user.role || 'unknown'}</strong>.
                        {userDashboard ? ' Try navigating to your dashboard instead, or log out and sign in with the correct account.' : ' Please log out and sign in with the correct account.'}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {userDashboard && (
                            <Link
                                to={userDashboard.path}
                                style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                }}
                            >
                                Go to {userDashboard.label}
                            </Link>
                        )}
                        <Link
                            to="/login"
                            style={{
                                padding: '12px 24px',
                                background: 'white',
                                color: '#667eea',
                                border: '2px solid #667eea',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: 500,
                                textDecoration: 'none',
                            }}
                        >
                            Switch Account
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
