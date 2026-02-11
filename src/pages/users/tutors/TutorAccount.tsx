import React, { useState, useEffect } from 'react';
import './TutorAccount.css';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Toast from '../../../components/Toast';
import { tutorService } from '../../../services/tutor.service';
import { useAuth } from '../../../contexts/AuthContext';

interface TutorInfo {
    name: string;
    email: string;
    phone: string;
    subjectsTaught: string[];
    joinDate: string;
    qualification: string;
}

interface BankingInfo {
    accountNumber: string;
    bankName: string;
    branchCode: string;
    accountHolderName: string;
    accountType: string;
}

const TutorAccount: React.FC = () => {
    const { logout, user } = useAuth();
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showEditBanking, setShowEditBanking] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ message, type });
    };

    const hideToast = () => setToast(null);

    const [tutorInfo, setTutorInfo] = useState<TutorInfo>({
        name: '',
        email: '',
        phone: '',
        subjectsTaught: [],
        joinDate: '',
        qualification: '',
    });

    const [bankingInfo] = useState<BankingInfo>({
        accountNumber: '',
        bankName: '',
        branchCode: '',
        accountHolderName: '',
        accountType: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await tutorService.getProfile();
                if (response.success && response.data.profile) {
                    const p = response.data.profile;
                    setTutorInfo({
                        name: p.full_name || user?.name || '',
                        email: p.email || user?.email || '',
                        phone: p.phone_number || '',
                        subjectsTaught: p.subjects || [],
                        joinDate: p.created_at ? new Date(p.created_at).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' }) : '',
                        qualification: p.qualifications || '',
                    });
                }
            } catch {
                showToast('Failed to load profile', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const tutorNavigation = [
        { label: 'Dashboard', href: '/tutor/dashboard' },
        { label: 'Classes', href: '/tutor/classes' },
        { label: 'Schedule', href: '/tutor/schedule' },
        { label: 'Students', href: '/tutor/students' },
        { label: 'Materials', href: '/tutor/materials' },
        { label: 'Messages', href: '/tutor/messages' },
        { label: 'Account', href: '/tutor/account' }
    ];

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Profile updated successfully!');
        setShowEditProfile(false);
    };

    const handleSaveBanking = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Banking information updated successfully!');
        setShowEditBanking(false);
    };

    const handleSignOut = async () => {
        try {
            await logout();
            window.location.href = '/login';
        } catch {
            showToast('Failed to sign out', 'error');
        }
    };

    return (
        <div className="tutor-account-page">
            <Header navigationLinks={tutorNavigation} />

            <div className="account-container">
                <div className="account-header">
                    <h1>My Account</h1>
                    <button className="btn-sign-out" onClick={handleSignOut}>
                        Sign Out
                    </button>
                </div>

                {loading && (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p>Loading profile...</p>
                    </div>
                )}

                {!loading && (
                <>
                {/* Personal Information Section */}
                <div className="account-section">
                    <div className="section-header">
                        <h2>👤 Personal Information</h2>
                        <button className="btn-edit" onClick={() => setShowEditProfile(true)}>
                            Edit Profile
                        </button>
                    </div>

                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Full Name</span>
                            <span className="info-value">{tutorInfo.name}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Email</span>
                            <span className="info-value">{tutorInfo.email}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Phone</span>
                            <span className="info-value">{tutorInfo.phone}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Member Since</span>
                            <span className="info-value">{tutorInfo.joinDate}</span>
                        </div>
                        <div className="info-item full-width">
                            <span className="info-label">Subjects Taught</span>
                            <div className="subjects-list">
                                {tutorInfo.subjectsTaught.map((subject, index) => (
                                    <span key={index} className="subject-badge">{subject}</span>
                                ))}
                            </div>
                        </div>
                        <div className="info-item full-width">
                            <span className="info-label">Qualification</span>
                            <span className="info-value">{tutorInfo.qualification}</span>
                        </div>
                    </div>
                </div>

                {/* Banking Information Section */}
                <div className="account-section">
                    <div className="section-header">
                        <h2>🏦 Banking Information</h2>
                        <button className="btn-edit" onClick={() => setShowEditBanking(true)}>
                            Edit Banking Details
                        </button>
                    </div>

                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Account Holder Name</span>
                            <span className="info-value">{bankingInfo.accountHolderName}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Bank Name</span>
                            <span className="info-value">{bankingInfo.bankName}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Account Number</span>
                            <span className="info-value">**** **** {bankingInfo.accountNumber.slice(-4)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Branch Code</span>
                            <span className="info-value">{bankingInfo.branchCode}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Account Type</span>
                            <span className="info-value">{bankingInfo.accountType}</span>
                        </div>
                    </div>
                </div>
                </>
                )}
            </div>

            {/* Edit Profile Modal */}
            {showEditProfile && (
                <div className="modal-overlay" onClick={() => setShowEditProfile(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit Profile</h2>
                            <button className="modal-close" onClick={() => setShowEditProfile(false)}>×</button>
                        </div>
                        <form onSubmit={handleSaveProfile}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" defaultValue={tutorInfo.name} required />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" defaultValue={tutorInfo.email} required />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input type="tel" defaultValue={tutorInfo.phone} required />
                            </div>
                            <div className="form-group">
                                <label>Qualification</label>
                                <input type="text" defaultValue={tutorInfo.qualification} required />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowEditProfile(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Banking Modal */}
            {showEditBanking && (
                <div className="modal-overlay" onClick={() => setShowEditBanking(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit Banking Information</h2>
                            <button className="modal-close" onClick={() => setShowEditBanking(false)}>×</button>
                        </div>
                        <form onSubmit={handleSaveBanking}>
                            <div className="form-group">
                                <label>Account Holder Name</label>
                                <input type="text" defaultValue={bankingInfo.accountHolderName} required />
                            </div>
                            <div className="form-group">
                                <label>Bank Name</label>
                                <select defaultValue={bankingInfo.bankName} required>
                                    <option value="Standard Bank">Standard Bank</option>
                                    <option value="FNB">FNB</option>
                                    <option value="ABSA">ABSA</option>
                                    <option value="Nedbank">Nedbank</option>
                                    <option value="Capitec">Capitec</option>
                                    <option value="African Bank">African Bank</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Account Number</label>
                                <input type="text" defaultValue={bankingInfo.accountNumber} required />
                            </div>
                            <div className="form-group">
                                <label>Branch Code</label>
                                <input type="text" defaultValue={bankingInfo.branchCode} required />
                            </div>
                            <div className="form-group">
                                <label>Account Type</label>
                                <select defaultValue={bankingInfo.accountType} required>
                                    <option value="Cheque Account">Cheque Account</option>
                                    <option value="Savings Account">Savings Account</option>
                                    <option value="Transmission Account">Transmission Account</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowEditBanking(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}        </div>
    );
};

export default TutorAccount;
