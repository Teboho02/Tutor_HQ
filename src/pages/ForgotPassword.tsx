import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import FormInput from '../components/FormInput';
import Toast from '../components/Toast';
import './ForgotPassword.css';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ message, type });
    };

    const hideToast = () => setToast(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            showToast('Please enter your email address', 'error');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }

        setLoading(true);

        try {
            const response = await authService.forgotPassword(email);

            if (response.success) {
                setSuccess(true);
                showToast('Password reset email sent successfully!', 'success');
            }
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            showToast(
                axiosError.response?.data?.message || 'Failed to send reset email. Please try again.',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="forgot-password-page">
                <div className="forgot-password-container">
                    <div className="forgot-password-card success-card">
                        <div className="success-icon">✅</div>
                        <h1>Check Your Email</h1>
                        <p className="success-message">
                            We've sent password reset instructions to <strong>{email}</strong>
                        </p>
                        <p className="success-info">
                            If you don't see the email, check your spam folder or wait a few minutes.
                        </p>
                        <div className="form-actions">
                            <Link to="/login" className="btn btn-primary">
                                Return to Login
                            </Link>
                        </div>
                        <div className="forgot-password-footer">
                            <p>
                                Didn't receive the email?{' '}
                                <button
                                    onClick={() => {
                                        setSuccess(false);
                                        handleSubmit({ preventDefault: () => { } } as React.FormEvent);
                                    }}
                                    className="link-btn"
                                >
                                    Resend
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
                {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
            </div>
        );
    }

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-container">
                <div className="forgot-password-card">
                    <div className="forgot-password-header">
                        <h1>Forgot Password?</h1>
                        <p>Enter your email address and we'll send you instructions to reset your password.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="forgot-password-form">
                        <FormInput
                            label="Email Address"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(value) => setEmail(value)}
                            required
                            placeholder="Enter your email"
                            disabled={loading}
                        />

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </div>
                    </form>

                    <div className="forgot-password-footer">
                        <p>
                            Remember your password?{' '}
                            <Link to="/login" className="link">
                                Back to Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
};

export default ForgotPassword;
