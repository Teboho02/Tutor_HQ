import React, { useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import type { NavigationLink } from '../../../types';
import './ParentPayments.css';

interface Payment {
    id: number;
    date: string;
    description: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    child: string;
    invoiceNumber: string;
}

const ParentPayments: React.FC = () => {
    const [selectedChild, setSelectedChild] = useState<string>('all');
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/parent/dashboard' },
        { label: 'Messages', href: '/parent/messages' },
        { label: 'Payments', href: '/parent/payments' },
        { label: 'Schedule', href: '/parent/schedule' },
        { label: 'My Account', href: '/parent/account' },
    ];

    const payments: Payment[] = [
        {
            id: 1,
            date: '2024-01-15',
            description: 'Mathematics A - Monthly Tuition',
            amount: 4500.00,
            status: 'paid',
            child: 'Emma Johnson',
            invoiceNumber: 'INV-2024-001',
        },
        {
            id: 2,
            date: '2024-01-15',
            description: 'English E - Monthly Tuition',
            amount: 4000.00,
            status: 'paid',
            child: 'James Johnson',
            invoiceNumber: 'INV-2024-002',
        },
        {
            id: 3,
            date: '2024-01-20',
            description: 'Science Lab Materials Fee',
            amount: 750.00,
            status: 'pending',
            child: 'Sophie Johnson',
            invoiceNumber: 'INV-2024-003',
        },
        {
            id: 4,
            date: '2024-01-10',
            description: 'Physics B - Monthly Tuition',
            amount: 4250.00,
            status: 'paid',
            child: 'Emma Johnson',
            invoiceNumber: 'INV-2024-004',
        },
        {
            id: 5,
            date: '2024-01-05',
            description: 'Registration Fee',
            amount: 1000.00,
            status: 'overdue',
            child: 'James Johnson',
            invoiceNumber: 'INV-2024-005',
        },
    ];

    const handleDownloadInvoice = (invoiceNumber: string) => {
        alert(`Downloading invoice ${invoiceNumber}...`);
        // In a real app, this would trigger a PDF download
    };

    const handlePayNow = (payment: Payment) => {
        setShowPaymentModal(true);
        alert(`Processing payment of R${payment.amount.toFixed(2)} for ${payment.description}`);
        // In a real app, this would open a payment gateway
    };

    const children = ['All Children', 'Emma Johnson', 'James Johnson', 'Sophie Johnson'];

    const filteredPayments = selectedChild === 'all'
        ? payments
        : payments.filter(p => p.child === selectedChild);

    const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
    const totalOverdue = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'overdue': return '#ef4444';
            default: return '#718096';
        }
    };

    return (
        <div className="parent-payments-page">
            <Header navigationLinks={navigationLinks} />

            <div className="payments-container">
                <div className="page-header">
                    <div>
                        <h1>Payments & Billing</h1>
                        <p>Manage your tuition payments and invoices</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowPaymentModal(true)}>Make Payment</button>
                </div>

                {/* Summary Cards */}
                <div className="summary-grid">
                    <div className="summary-card">
                        <div className="summary-icon" style={{ background: '#dcfce7' }}>✓</div>
                        <div className="summary-content">
                            <h3>Total Paid</h3>
                            <p className="summary-amount" style={{ color: '#10b981' }}>
                                R{totalPaid.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-icon" style={{ background: '#fef3c7' }}>⏳</div>
                        <div className="summary-content">
                            <h3>Pending</h3>
                            <p className="summary-amount" style={{ color: '#f59e0b' }}>
                                R{totalPending.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-icon" style={{ background: '#fee2e2' }}>⚠️</div>
                        <div className="summary-content">
                            <h3>Overdue</h3>
                            <p className="summary-amount" style={{ color: '#ef4444' }}>
                                R{totalOverdue.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="filter-section">
                    <div className="filter-buttons">
                        {children.map((child, index) => (
                            <button
                                key={index}
                                className={`filter-btn ${selectedChild === (index === 0 ? 'all' : child) ? 'active' : ''}`}
                                onClick={() => setSelectedChild(index === 0 ? 'all' : child)}
                            >
                                {child}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Payments Table */}
                <div className="payments-table-container">
                    <table className="payments-table">
                        <thead>
                            <tr>
                                <th>Invoice</th>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Child</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map(payment => (
                                <tr key={payment.id}>
                                    <td>
                                        <span className="invoice-number">{payment.invoiceNumber}</span>
                                    </td>
                                    <td>{payment.date}</td>
                                    <td className="description-cell">{payment.description}</td>
                                    <td>
                                        <span className="child-badge">{payment.child}</span>
                                    </td>
                                    <td className="amount-cell">R{payment.amount.toFixed(2)}</td>
                                    <td>
                                        <span
                                            className="status-badge"
                                            style={{ background: getStatusColor(payment.status) }}
                                        >
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="action-btn"
                                                title="Download Invoice"
                                                onClick={() => handleDownloadInvoice(payment.invoiceNumber)}
                                            >
                                                📥
                                            </button>
                                            {payment.status !== 'paid' && (
                                                <button
                                                    className="action-btn"
                                                    title="Pay Now"
                                                    onClick={() => handlePayNow(payment)}
                                                >
                                                    💳
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Payment Modal */}
                {showPaymentModal && (
                    <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Make Payment</h2>
                                <button className="close-btn" onClick={() => setShowPaymentModal(false)}>✕</button>
                            </div>

                            <form className="payment-form" onSubmit={(e) => { e.preventDefault(); alert('Payment processed!'); setShowPaymentModal(false); }}>
                                <div className="form-group">
                                    <label>Select Child</label>
                                    <select required>
                                        <option value="">Choose child</option>
                                        {children.slice(1).map(child => (
                                            <option key={child} value={child}>{child}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Payment Type</label>
                                    <select required>
                                        <option value="">Select type</option>
                                        <option value="tuition">Monthly Tuition</option>
                                        <option value="materials">Materials Fee</option>
                                        <option value="registration">Registration Fee</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Amount (ZAR)</label>
                                    <input type="number" placeholder="0.00" required step="0.01" />
                                </div>

                                <div className="form-group">
                                    <label>Payment Method</label>
                                    <select required>
                                        <option value="">Select method</option>
                                        <option value="card">Credit/Debit Card</option>
                                        <option value="eft">EFT</option>
                                        <option value="instant">Instant EFT</option>
                                    </select>
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="btn btn-outline" onClick={() => setShowPaymentModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Process Payment
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Floating Action Button */}
                <button 
                    className="floating-payment-btn" 
                    onClick={() => setShowPaymentModal(true)}
                    title="Make New Payment"
                >
                    💳
                </button>
            </div>

            <Footer />
        </div>
    );
};

export default ParentPayments;
