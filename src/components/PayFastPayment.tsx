import React, { useState } from 'react';
import type { PayFastPaymentRequest, TutoringPackage } from '../types/payment';
import '../styles/PayFastPayment.css';

interface PayFastPaymentProps {
    packages: TutoringPackage[];
    studentName: string;
    studentEmail: string;
    onPaymentInitiated?: (paymentId: string) => void;
}

export const PayFastPayment: React.FC<PayFastPaymentProps> = ({
    packages,
    studentName,
    studentEmail,
    onPaymentInitiated
}) => {
    const [selectedPackage, setSelectedPackage] = useState<TutoringPackage | null>(null);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [formData, setFormData] = useState({
        firstName: studentName.split(' ')[0] || '',
        lastName: studentName.split(' ').slice(1).join(' ') || '',
        email: studentEmail,
        cellNumber: ''
    });

    // PayFast configuration - In production, use environment variables
    const PAYFAST_CONFIG = {
        merchantId: import.meta.env.VITE_PAYFAST_MERCHANT_ID || '10000100',
        merchantKey: import.meta.env.VITE_PAYFAST_MERCHANT_KEY || '46f0cd694581a',
        sandbox: import.meta.env.VITE_PAYFAST_SANDBOX !== 'false' // Default to sandbox
    };

    // PayFast URL - will be used when form submission is implemented
    // const getPayFastUrl = () => {
    //     return PAYFAST_CONFIG.sandbox 
    //         ? 'https://sandbox.payfast.co.za/eng/process'
    //         : 'https://www.payfast.co.za/eng/process';
    // };

    const handlePackageSelect = (pkg: TutoringPackage) => {
        setSelectedPackage(pkg);
        setShowPaymentForm(true);
    };

    const generatePaymentId = () => {
        return `TUTOR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPackage) return;

        const paymentId = generatePaymentId();

        // Create PayFast payment request
        const paymentData: Partial<PayFastPaymentRequest> = {
            merchant_id: PAYFAST_CONFIG.merchantId,
            merchant_key: PAYFAST_CONFIG.merchantKey,
            return_url: `${window.location.origin}/parent/payments?status=success`,
            cancel_url: `${window.location.origin}/parent/payments?status=cancelled`,
            notify_url: `${window.location.origin}/api/payfast/notify`, // Backend webhook
            name_first: formData.firstName,
            name_last: formData.lastName,
            email_address: formData.email,
            cell_number: formData.cellNumber,
            m_payment_id: paymentId,
            amount: selectedPackage.totalPrice.toFixed(2),
            item_name: selectedPackage.name,
            item_description: selectedPackage.description
        };

        if (onPaymentInitiated) {
            onPaymentInitiated(paymentId);
        }

        // In production, this would submit to PayFast
        console.log('PayFast Payment Data:', paymentData);

        // For now, show alert
        alert(`PayFast Integration Demo\n\nPackage: ${selectedPackage.name}\nAmount: R${selectedPackage.totalPrice}\n\nTo complete integration:\n1. Add PayFast merchant credentials to .env\n2. Set up webhook endpoint for notifications\n3. Uncomment form submission code`);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR'
        }).format(price);
    };

    return (
        <div className="payfast-payment-wrapper">
            <div className="payfast-header">
                <h2>💳 Tutoring Packages</h2>
                <div className="payment-badge">
                    Powered by PayFast
                    {PAYFAST_CONFIG.sandbox && <span className="sandbox-badge">Sandbox Mode</span>}
                </div>
            </div>

            {!showPaymentForm ? (
                <div className="packages-grid">
                    {packages.map((pkg) => (
                        <div key={pkg.id} className="package-card">
                            <div className="package-header">
                                <h3>{pkg.name}</h3>
                                <p className="package-description">{pkg.description}</p>
                            </div>

                            <div className="package-details">
                                <div className="price-section">
                                    <span className="price-label">Total Price</span>
                                    <span className="price-value">{formatPrice(pkg.totalPrice)}</span>
                                    <span className="price-breakdown">
                                        {pkg.sessions} sessions × {formatPrice(pkg.pricePerSession)}
                                    </span>
                                </div>

                                <div className="package-info">
                                    <div className="info-item">
                                        <span className="info-icon">📚</span>
                                        <span>{pkg.sessions} Sessions</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-icon">⏱️</span>
                                        <span>{pkg.duration} each</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-icon">📖</span>
                                        <span>{pkg.subjects.join(', ')}</span>
                                    </div>
                                </div>

                                <div className="package-features">
                                    <h4>Includes:</h4>
                                    <ul>
                                        {pkg.features.map((feature, index) => (
                                            <li key={index}>✓ {feature}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <button
                                className="select-package-btn"
                                onClick={() => handlePackageSelect(pkg)}
                            >
                                Select Package
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="payment-form-container">
                    <button
                        className="back-btn"
                        onClick={() => {
                            setShowPaymentForm(false);
                            setSelectedPackage(null);
                        }}
                    >
                        ← Back to Packages
                    </button>

                    {selectedPackage && (
                        <>
                            <div className="selected-package-summary">
                                <h3>Selected Package: {selectedPackage.name}</h3>
                                <p className="total-amount">
                                    Total: {formatPrice(selectedPackage.totalPrice)}
                                </p>
                            </div>

                            <form onSubmit={handlePayment} className="payment-form">
                                <h4>Payment Details</h4>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="firstName">First Name *</label>
                                        <input
                                            id="firstName"
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="lastName">Last Name *</label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address *</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="cellNumber">Cell Number (Optional)</label>
                                    <input
                                        id="cellNumber"
                                        type="tel"
                                        value={formData.cellNumber}
                                        onChange={(e) => setFormData({ ...formData, cellNumber: e.target.value })}
                                        placeholder="0812345678"
                                    />
                                </div>

                                <div className="payment-info">
                                    <p>🔒 Secure payment processed by PayFast</p>
                                    <p>You will be redirected to PayFast to complete your payment</p>
                                </div>

                                <button type="submit" className="pay-now-btn">
                                    Pay Now with PayFast
                                </button>
                            </form>
                        </>
                    )}
                </div>
            )}

            <div className="payment-methods">
                <h4>Accepted Payment Methods:</h4>
                <div className="methods-icons">
                    <span className="method-badge">💳 Credit Card</span>
                    <span className="method-badge">💳 Debit Card</span>
                    <span className="method-badge">🏦 EFT</span>
                    <span className="method-badge">📱 Instant EFT</span>
                </div>
            </div>
        </div>
    );
};
