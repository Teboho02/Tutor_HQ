import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Toast from '../../../components/Toast';
import { parentService } from '../../../services/parent.service';
import { useAuth } from '../../../contexts/AuthContext';
import type { NavigationLink } from '../../../types';
import './ParentAccount.css';

interface ChildData {
    id: string;
    fullName: string;
    gradeLevel: string;
    email: string;
}

const ParentAccount: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showAddChildModal, setShowAddChildModal] = useState(false);
    const [linkEmail, setLinkEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [children, setChildren] = useState<ChildData[]>([]);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ message, type });
    };
    const hideToast = () => setToast(null);

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/parent/dashboard' },
        { label: 'Schedule', href: '/parent/schedule' },
        { label: 'Account', href: '/parent/account' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await parentService.getChildren();
                if (response.success && response.data.children) {
                    setChildren(response.data.children.map((c: { id: string; fullName: string; gradeLevel: string; email: string }) => ({
                        id: c.id,
                        fullName: c.fullName,
                        gradeLevel: c.gradeLevel || 'N/A',
                        email: c.email,
                    })));
                }
            } catch (error: unknown) {
                const err = error as { response?: { data?: { message?: string } } };
                showToast(err.response?.data?.message || 'Failed to load account data', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLinkChild = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await parentService.linkChild(linkEmail);
            if (response.success) {
                showToast('Child linked successfully!', 'success');
                setShowAddChildModal(false);
                setLinkEmail('');
                // Refresh children list
                const childrenRes = await parentService.getChildren();
                if (childrenRes.success) {
                    setChildren(childrenRes.data.children.map((c: { id: string; fullName: string; gradeLevel: string; email: string }) => ({
                        id: c.id, fullName: c.fullName, gradeLevel: c.gradeLevel || 'N/A', email: c.email,
                    })));
                }
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            showToast(err.response?.data?.message || 'Failed to link child', 'error');
        }
    };

    const handleUnlinkChild = async (childId: string, childName: string) => {
        if (!confirm(`Are you sure you want to unlink ${childName}?`)) return;
        try {
            await parentService.unlinkChild(childId);
            showToast(`${childName} unlinked successfully`, 'success');
            setChildren(prev => prev.filter(c => c.id !== childId));
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            showToast(err.response?.data?.message || 'Failed to unlink child', 'error');
        }
    };

    const handleSignOut = async () => {
        try {
            await logout();
            navigate('/login');
        } catch {
            navigate('/login');
        }
    };

    return (
        <div className="parent-account-page">
            <Header navigationLinks={navigationLinks} />

            <div className="account-container">
                <div className="page-header">
                    <h1>My Account</h1>
                    <button className="btn btn-sign-out" onClick={handleSignOut}>
                        Sign Out
                    </button>
                </div>

                {/* Personal Information */}
                <div className="section">
                    <div className="section-header">
                        <h2>Personal Information</h2>
                    </div>

                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Full Name</span>
                            <span className="info-value">{user?.name || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Email Address</span>
                            <span className="info-value">{user?.email || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Children Management */}
                <div className="section">
                    <div className="section-header">
                        <h2>My Children</h2>
                        <button className="btn btn-primary" onClick={() => setShowAddChildModal(true)}>
                            + Link Child
                        </button>
                    </div>

                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '1rem' }}>Loading...</p>
                    ) : children.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '1rem', color: '#718096' }}>No children linked yet. Click "Link Child" to add a child.</p>
                    ) : (
                    <div className="children-list">
                        {children.map(child => (
                            <div key={child.id} className="child-management-card">
                                <div className="child-management-header">
                                    <div>
                                        <h3>{child.fullName}</h3>
                                        <p>{child.gradeLevel} &bull; {child.email}</p>
                                    </div>
                                    <div className="child-actions">
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => navigate(`/parent/child/${child.id}/progress`)}
                                        >
                                            View Progress
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline"
                                            style={{ color: '#ef4444' }}
                                            onClick={() => handleUnlinkChild(child.id, child.fullName)}
                                        >
                                            Unlink
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    )}
                </div>

                {/* Link Child Modal */}
                {showAddChildModal && (
                    <div className="modal-overlay" onClick={() => setShowAddChildModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Link Child</h2>
                                <button className="close-btn" onClick={() => setShowAddChildModal(false)}>✕</button>
                            </div>

                            <form className="form" onSubmit={handleLinkChild}>
                                <div className="form-group">
                                    <label>Child's Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="Enter child's registered email"
                                        value={linkEmail}
                                        onChange={(e) => setLinkEmail(e.target.value)}
                                        required
                                    />
                                    <small style={{ color: '#718096' }}>The child must already have a student account.</small>
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="btn btn-outline" onClick={() => setShowAddChildModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Link Child
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
};

export default ParentAccount;