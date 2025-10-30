import React, { useState } from 'react';
import './TutorAccount.css';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

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

interface PaymentRecord {
    id: number;
    date: string;
    description: string;
    amount: number;
    status: 'paid' | 'pending' | 'processing';
}

const TutorAccount: React.FC = () => {
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showEditBanking, setShowEditBanking] = useState(false);

    // Mock tutor information
    const [tutorInfo] = useState<TutorInfo>({
        name: 'Mr. John Smith',
        email: 'john.smith@tutorhq.com',
        phone: '+27 11 234 5678',
        subjectsTaught: ['Mathematics A', 'Physics B', 'Chemistry C'],
        joinDate: 'January 2023',
        qualification: 'MSc in Mathematics, PhD in Physics'
    });

    // Mock banking information
    const [bankingInfo] = useState<BankingInfo>({
        accountNumber: '1234567890',
        bankName: 'Standard Bank',
        branchCode: '051001',
        accountHolderName: 'John Smith',
        accountType: 'Cheque Account'
    });

    // Mock payment history
    const paymentHistory: PaymentRecord[] = [
        {
            id: 1,
            date: '2024-01-15',
            description: 'January 2024 - Teaching Fees (Mathematics A)',
            amount: 15000,
            status: 'paid'
        },
        {
            id: 2,
            date: '2024-01-15',
            description: 'January 2024 - Teaching Fees (Physics B)',
            amount: 12000,
            status: 'paid'
        },
        {
            id: 3,
            date: '2024-01-10',
            description: 'Bonus - Excellent Student Feedback',
            amount: 2000,
            status: 'paid'
        },
        {
            id: 4,
            date: '2024-01-05',
            description: 'December 2023 - Teaching Fees (Chemistry C)',
            amount: 18000,
            status: 'paid'
        },
        {
            id: 5,
            date: '2024-02-01',
            description: 'February 2024 - Teaching Fees (Mathematics A)',
            amount: 15000,
            status: 'processing'
        },
        {
            id: 6,
            date: '2024-02-01',
            description: 'February 2024 - Teaching Fees (Physics B)',
            amount: 12000,
            status: 'pending'
        }
    ];

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

    const handleSignOut = () => {
        alert('Signing out...');
        window.location.href = '/login';
    };

    const totalEarnings = paymentHistory
        .filter(p => p.status === 'paid')
        .reduce((sum, payment) => sum + payment.amount, 0);

    const pendingEarnings = paymentHistory
        .filter(p => p.status === 'pending' || p.status === 'processing')
        .reduce((sum, payment) => sum + payment.amount, 0);

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

                {/* Earnings Summary Section */}
                <div className="account-section">
                    <div className="section-header">
                        <h2>💰 Earnings Summary</h2>
                    </div>

                    <div className="earnings-cards">
                        <div className="earnings-card">
                            <div className="card-icon">✅</div>
                            <div className="card-content">
                                <h3>Total Paid</h3>
                                <p className="earnings-amount">R{totalEarnings.toLocaleString()}</p>
                                <span className="earnings-label">All time earnings</span>
                            </div>
                        </div>

                        <div className="earnings-card pending">
                            <div className="card-icon">⏳</div>
                            <div className="card-content">
                                <h3>Pending Payment</h3>
                                <p className="earnings-amount">R{pendingEarnings.toLocaleString()}</p>
                                <span className="earnings-label">Processing & Pending</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment History Section */}
                <div className="account-section">
                    <div className="section-header">
                        <h2>📊 Payment History</h2>
                    </div>

                    <div className="payment-history-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentHistory.map((payment) => (
                                    <tr key={payment.id}>
                                        <td>{new Date(payment.date).toLocaleDateString('en-ZA')}</td>
                                        <td>{payment.description}</td>
                                        <td className="amount">R{payment.amount.toLocaleString()}</td>
                                        <td>
                                            <span className={`status-badge status-${payment.status}`}>
                                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
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

            <Footer />
        </div>
    );
};

export default TutorAccount;
