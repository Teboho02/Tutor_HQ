import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { NavigationLink } from '../types';
import './Login.css';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigationLinks: NavigationLink[] = [
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/main' },
        { label: 'About', href: '/about' },
        { label: 'Tutors', href: '/tutors' },
        { label: 'Contact', href: '/contact' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const response = await login(formData);

            // Navigate based on user role
            const user = response?.user;
            if (user) {
                switch (user.role) {
                    case 'student':
                        navigate('/student/dashboard');
                        break;
                    case 'parent':
                        navigate('/parent/dashboard');
                        break;
                    case 'tutor':
                        navigate('/tutor/dashboard');
                        break;
                    case 'admin':
                        navigate('/admin');
                        break;
                    default:
                        navigate('/dashboard');
                }
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear error when user starts typing
        if (error) setError('');
    };

    return (
        <div className="login-page">
            <Header links={navigationLinks} />

            <main className="login-main">
                <div className="login-container">
                    <div className="login-card">
                        <h1 className="login-title">Welcome Back</h1>
                        <p className="login-subtitle">Sign in to your account to continue</p>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="your@email.com"
                                    required
                                    disabled={loading || authLoading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    required
                                    disabled={loading || authLoading}
                                />
                            </div>

                            <div className="form-options">
                                <label className="remember-me">
                                    <input type="checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="forgot-password">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading || authLoading}
                            >
                                {loading || authLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="login-footer">
                            <p>
                                Don't have an account?{' '}
                                <Link to="/signup" className="signup-link">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="login-info">
                        <h2>Access Your Learning Hub</h2>
                        <ul>
                            <li>📚 Access your personalized dashboard</li>
                            <li>👥 Connect with tutors</li>
                            <li>📝 Track assignments and tests</li>
                            <li>📊 Monitor your progress</li>
                            <li>💬 Message tutors and classmates</li>
                        </ul>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Login;
