import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import type { NavigationLink } from '../../../types';
import './ParentAccount.css';

const ParentAccount: React.FC = () => {
    const navigate = useNavigate();
    const [showAddChildModal, setShowAddChildModal] = useState(false);
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [selectedChild, setSelectedChild] = useState<string>('');

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/parent/dashboard' },
        { label: 'Schedule', href: '/parent/schedule' },
        { label: 'Account', href: '/parent/account' },
    ];

    const parentInfo = {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+27 82 123 4567',
        address: '123 Main Street, Johannesburg, 2000',
        memberSince: 'January 2023',
    };

    const children = [
        {
            id: '1',
            name: 'Emma Johnson',
            grade: 'Grade 10',
            enrolledModules: ['Mathematics A', 'Physics B', 'Chemistry C'],
        },
        {
            id: '2',
            name: 'James Johnson',
            grade: 'Grade 8',
            enrolledModules: ['English E', 'Mathematics A'],
        },
        {
            id: '3',
            name: 'Sophie Johnson',
            grade: 'Grade 6',
            enrolledModules: ['Science D', 'English E'],
        },
    ];

    const availableModules = [
        'Mathematics A', 'Physics B', 'Chemistry C', 'Biology D',
        'English E', 'Computer Science F', 'History G', 'Geography H'
    ];

    const handleUnenroll = (childName: string, module: string) => {
        if (confirm(`Are you sure you want to unenroll ${childName} from ${module}?`)) {
            alert(`${childName} has been unenrolled from ${module}`);
        }
    };

    const handleSignOut = () => {
        navigate('/login');
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
                        <button className="btn btn-outline">Edit</button>
                    </div>

                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Full Name</span>
                            <span className="info-value">{parentInfo.name}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Email Address</span>
                            <span className="info-value">{parentInfo.email}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Phone Number</span>
                            <span className="info-value">{parentInfo.phone}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Home Address</span>
                            <span className="info-value">{parentInfo.address}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Member Since</span>
                            <span className="info-value">{parentInfo.memberSince}</span>
                        </div>
                    </div>
                </div>

                {/* Children Management */}
                <div className="section">
                    <div className="section-header">
                        <h2>My Children</h2>
                        <button className="btn btn-primary" onClick={() => setShowAddChildModal(true)}>
                            + Add Child
                        </button>
                    </div>

                    <div className="children-list">
                        {children.map(child => (
                            <div key={child.id} className="child-management-card">
                                <div className="child-management-header">
                                    <div>
                                        <h3>{child.name}</h3>
                                        <p>{child.grade}</p>
                                    </div>
                                    <div className="child-actions">
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => { setSelectedChild(child.id); setShowEnrollModal(true); }}
                                        >
                                            Enroll in Module
                                        </button>
                                        <button className="btn btn-sm btn-outline">Edit</button>
                                    </div>
                                </div>

                                <div className="enrolled-modules">
                                    <h4>Enrolled Modules:</h4>
                                    {child.enrolledModules.length > 0 ? (
                                        <div className="modules-grid">
                                            {child.enrolledModules.map((module, index) => (
                                                <div key={index} className="module-badge">
                                                    <span>{module}</span>
                                                    <button
                                                        className="unenroll-btn"
                                                        onClick={() => handleUnenroll(child.name, module)}
                                                        title="Unenroll"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="no-modules">No modules enrolled</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add Child Modal */}
                {showAddChildModal && (
                    <div className="modal-overlay" onClick={() => setShowAddChildModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Add Child</h2>
                                <button className="close-btn" onClick={() => setShowAddChildModal(false)}>✕</button>
                            </div>

                            <form className="form" onSubmit={(e) => { e.preventDefault(); alert('Child added successfully!'); setShowAddChildModal(false); }}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" placeholder="Enter child's full name" required />
                                </div>

                                <div className="form-group">
                                    <label>Grade</label>
                                    <select required>
                                        <option value="">Select grade</option>
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i} value={`Grade ${i + 1}`}>Grade {i + 1}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>ID Number</label>
                                    <input type="text" placeholder="Enter ID number" required />
                                </div>

                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input type="date" required />
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="btn btn-outline" onClick={() => setShowAddChildModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Add Child
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Enroll Modal */}
                {showEnrollModal && (
                    <div className="modal-overlay" onClick={() => setShowEnrollModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Enroll in Module</h2>
                                <button className="close-btn" onClick={() => setShowEnrollModal(false)}>✕</button>
                            </div>

                            <form className="form" onSubmit={(e) => { e.preventDefault(); alert('Child enrolled successfully!'); setShowEnrollModal(false); }}>
                                <div className="form-group">
                                    <label>Select Module</label>
                                    <select required>
                                        <option value="">Choose module</option>
                                        {availableModules.map((module, index) => (
                                            <option key={index} value={module}>{module}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Start Date</label>
                                    <input type="date" required />
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="btn btn-outline" onClick={() => setShowEnrollModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Enroll
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ParentAccount;