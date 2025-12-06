import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { PaymentRecord, TutorPayout } from '../../types/admin';
import '../../styles/AdminPayments.css';

const AdminPayments: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'student-payments' | 'tutor-payouts'>('student-payments');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Mock student payment data
    const [studentPayments] = useState<PaymentRecord[]>([
        {
            id: 'pay1',
            userId: 'student1',
            userName: 'Thabo Mabaso',
            amount: 1800,
            currency: 'ZAR',
            status: 'completed',
            method: 'payfast',
            description: 'Monthly Package - 8 Hours',
            dueDate: new Date('2025-02-01'),
            paidDate: new Date('2025-02-02'),
            reference: 'PAY-2025-001',
            createdAt: new Date('2025-01-28')
        },
        {
            id: 'pay2',
            userId: 'student2',
            userName: 'Lindiwe Nkosi',
            amount: 3200,
            currency: 'ZAR',
            status: 'overdue',
            method: 'payfast',
            description: 'Monthly Package - 16 Hours',
            dueDate: new Date('2025-01-25'),
            reference: 'PAY-2025-002',
            createdAt: new Date('2025-01-20')
        },
        {
            id: 'pay3',
            userId: 'student3',
            userName: 'Sipho Khumalo',
            amount: 6400,
            currency: 'ZAR',
            status: 'pending',
            method: 'payfast',
            description: 'Quarterly Package - 32 Hours',
            dueDate: new Date('2025-02-20'),
            reference: 'PAY-2025-003',
            createdAt: new Date('2025-02-05')
        },
        {
            id: 'pay4',
            userId: 'student4',
            userName: 'Zanele Dube',
            amount: 1800,
            currency: 'ZAR',
            status: 'overdue',
            method: 'payfast',
            description: 'Monthly Package - 8 Hours',
            dueDate: new Date('2025-01-30'),
            reference: 'PAY-2025-004',
            createdAt: new Date('2025-01-25')
        },
        {
            id: 'pay5',
            userId: 'student5',
            userName: 'Andile Moyo',
            amount: 3200,
            currency: 'ZAR',
            status: 'completed',
            method: 'bank-transfer',
            description: 'Monthly Package - 16 Hours',
            dueDate: new Date('2025-02-05'),
            paidDate: new Date('2025-02-04'),
            reference: 'PAY-2025-005',
            createdAt: new Date('2025-02-01')
        }
    ]);

    // Mock tutor payout data
    const [tutorPayouts] = useState<TutorPayout[]>([
        {
            id: 'payout1',
            tutorId: 'tutor1',
            tutorName: 'Sipho Dlamini',
            period: 'January 2025',
            totalSessions: 28,
            totalHours: 42,
            hourlyRate: 350,
            grossAmount: 14700,
            deductions: 735,
            netAmount: 13965,
            status: 'pending',
            calculatedAt: new Date('2025-02-01'),
            sessionIds: []
        },
        {
            id: 'payout2',
            tutorId: 'tutor2',
            tutorName: 'Nomsa Shabalala',
            period: 'January 2025',
            totalSessions: 35,
            totalHours: 52.5,
            hourlyRate: 400,
            grossAmount: 21000,
            deductions: 1050,
            netAmount: 19950,
            status: 'pending',
            calculatedAt: new Date('2025-02-01'),
            sessionIds: []
        },
        {
            id: 'payout3',
            tutorId: 'tutor3',
            tutorName: 'Thandi Ndlovu',
            period: 'December 2024',
            totalSessions: 30,
            totalHours: 45,
            hourlyRate: 375,
            grossAmount: 16875,
            deductions: 843.75,
            netAmount: 16031.25,
            status: 'completed',
            calculatedAt: new Date('2025-01-01'),
            paidAt: new Date('2025-01-05'),
            sessionIds: []
        }
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'overdue': return '#ef4444';
            case 'failed': return '#dc2626';
            default: return '#6b7280';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const getDaysOverdue = (dueDate: Date) => {
        const today = new Date();
        const diff = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    };

    const handleSendReminder = (payment: PaymentRecord) => {
        alert(`Payment reminder sent to ${payment.userName}`);
    };

    const handleMarkAsPaid = (payment: PaymentRecord) => {
        alert(`Payment ${payment.reference} marked as paid`);
    };

    const handleProcessPayout = (payout: TutorPayout) => {
        alert(`Payout of ${formatCurrency(payout.netAmount)} processed for ${payout.tutorName}`);
    };

    const filteredPayments = filterStatus === 'all'
        ? studentPayments
        : studentPayments.filter(p => p.status === filterStatus);

    const overdueCount = studentPayments.filter(p => p.status === 'overdue').length;
    const pendingCount = studentPayments.filter(p => p.status === 'pending').length;
    const totalOverdue = studentPayments
        .filter(p => p.status === 'overdue')
        .reduce((sum, p) => sum + p.amount, 0);
    const pendingPayouts = tutorPayouts.filter(p => p.status === 'pending').length;
    const totalPayoutsOwed = tutorPayouts
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.netAmount, 0);

    return (
        <div className="admin-payments">
            <div className="admin-header">
                <div className="admin-header-content">
                    <div className="admin-logo">
                        <h1>🎓 TutorHQ Admin</h1>
                        <span className="admin-badge">Payments</span>
                    </div>
                    <Link to="/admin" className="back-btn">← Back to Dashboard</Link>
                </div>
            </div>

            <div className="admin-main">
                <div className="admin-container">
                    <div className="page-header">
                        <h2>Payment Management</h2>
                        <p>Track student payments and process tutor payouts</p>
                    </div>

                    {/* Payment Summary Cards */}
                    <div className="summary-grid">
                        <div className="summary-card overdue">
                            <div className="summary-icon">⚠️</div>
                            <div className="summary-content">
                                <h3>Overdue Payments</h3>
                                <div className="summary-value">{overdueCount}</div>
                                <div className="summary-detail">{formatCurrency(totalOverdue)} outstanding</div>
                            </div>
                        </div>
                        <div className="summary-card pending">
                            <div className="summary-icon">⏳</div>
                            <div className="summary-content">
                                <h3>Pending Payments</h3>
                                <div className="summary-value">{pendingCount}</div>
                                <div className="summary-detail">Awaiting payment</div>
                            </div>
                        </div>
                        <div className="summary-card payouts">
                            <div className="summary-icon">💰</div>
                            <div className="summary-content">
                                <h3>Tutor Payouts Due</h3>
                                <div className="summary-value">{pendingPayouts}</div>
                                <div className="summary-detail">{formatCurrency(totalPayoutsOwed)} to process</div>
                            </div>
                        </div>
                    </div>

                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === 'student-payments' ? 'active' : ''}`}
                            onClick={() => setActiveTab('student-payments')}
                        >
                            Student Payments
                            {(overdueCount + pendingCount) > 0 && (
                                <span className="tab-badge">{overdueCount + pendingCount}</span>
                            )}
                        </button>
                        <button
                            className={`tab ${activeTab === 'tutor-payouts' ? 'active' : ''}`}
                            onClick={() => setActiveTab('tutor-payouts')}
                        >
                            Tutor Payouts
                            {pendingPayouts > 0 && (
                                <span className="tab-badge">{pendingPayouts}</span>
                            )}
                        </button>
                    </div>

                    {activeTab === 'student-payments' && (
                        <>
                            <div className="filters">
                                <button
                                    className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                                    onClick={() => setFilterStatus('all')}
                                >
                                    All ({studentPayments.length})
                                </button>
                                <button
                                    className={`filter-btn ${filterStatus === 'overdue' ? 'active' : ''}`}
                                    onClick={() => setFilterStatus('overdue')}
                                >
                                    Overdue ({overdueCount})
                                </button>
                                <button
                                    className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                                    onClick={() => setFilterStatus('pending')}
                                >
                                    Pending ({pendingCount})
                                </button>
                                <button
                                    className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
                                    onClick={() => setFilterStatus('completed')}
                                >
                                    Completed
                                </button>
                            </div>

                            <div className="payments-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            <th>Description</th>
                                            <th>Amount</th>
                                            <th>Due Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPayments.map(payment => (
                                            <tr key={payment.id} className={payment.status}>
                                                <td>
                                                    <div className="student-cell">
                                                        <div className="student-avatar">
                                                            {payment.userName.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <div className="student-name">{payment.userName}</div>
                                                            <div className="payment-ref">{payment.reference}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{payment.description}</td>
                                                <td className="amount-cell">{formatCurrency(payment.amount)}</td>
                                                <td>
                                                    <div>{payment.dueDate.toLocaleDateString('en-ZA')}</div>
                                                    {payment.status === 'overdue' && (
                                                        <div className="overdue-badge">
                                                            {getDaysOverdue(payment.dueDate)} days overdue
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    <span
                                                        className="status-pill"
                                                        style={{ background: getStatusColor(payment.status) }}
                                                    >
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        {payment.status === 'overdue' && (
                                                            <>
                                                                <button
                                                                    className="action-btn reminder"
                                                                    onClick={() => handleSendReminder(payment)}
                                                                >
                                                                    📧 Remind
                                                                </button>
                                                                <button
                                                                    className="action-btn mark-paid"
                                                                    onClick={() => handleMarkAsPaid(payment)}
                                                                >
                                                                    ✓ Mark Paid
                                                                </button>
                                                            </>
                                                        )}
                                                        {payment.status === 'pending' && (
                                                            <button
                                                                className="action-btn mark-paid"
                                                                onClick={() => handleMarkAsPaid(payment)}
                                                            >
                                                                ✓ Mark Paid
                                                            </button>
                                                        )}
                                                        {payment.status === 'completed' && (
                                                            <span className="completed-text">
                                                                Paid {payment.paidDate?.toLocaleDateString('en-ZA')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {activeTab === 'tutor-payouts' && (
                        <div className="payouts-grid">
                            {tutorPayouts.map(payout => (
                                <div key={payout.id} className={`payout-card ${payout.status}`}>
                                    <div className="payout-header">
                                        <div className="tutor-info">
                                            <div className="tutor-avatar">
                                                {payout.tutorName.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <h3>{payout.tutorName}</h3>
                                                <p>{payout.period}</p>
                                            </div>
                                        </div>
                                        <span
                                            className="status-pill"
                                            style={{ background: getStatusColor(payout.status) }}
                                        >
                                            {payout.status}
                                        </span>
                                    </div>

                                    <div className="payout-details">
                                        <div className="payout-row">
                                            <span className="label">Sessions Completed</span>
                                            <span className="value">{payout.totalSessions}</span>
                                        </div>
                                        <div className="payout-row">
                                            <span className="label">Total Hours</span>
                                            <span className="value">{payout.totalHours}h</span>
                                        </div>
                                        <div className="payout-row">
                                            <span className="label">Hourly Rate</span>
                                            <span className="value">{formatCurrency(payout.hourlyRate)}/h</span>
                                        </div>
                                        <div className="payout-row divider">
                                            <span className="label">Gross Amount</span>
                                            <span className="value">{formatCurrency(payout.grossAmount)}</span>
                                        </div>
                                        <div className="payout-row">
                                            <span className="label">Platform Fee (5%)</span>
                                            <span className="value negative">-{formatCurrency(payout.deductions)}</span>
                                        </div>
                                        <div className="payout-row total">
                                            <span className="label">Net Payout</span>
                                            <span className="value">{formatCurrency(payout.netAmount)}</span>
                                        </div>
                                    </div>

                                    {payout.status === 'pending' && (
                                        <button
                                            className="process-payout-btn"
                                            onClick={() => handleProcessPayout(payout)}
                                        >
                                            💸 Process Payout
                                        </button>
                                    )}

                                    {payout.status === 'completed' && payout.paidAt && (
                                        <div className="paid-info">
                                            ✅ Paid on {payout.paidAt.toLocaleDateString('en-ZA')}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPayments;
