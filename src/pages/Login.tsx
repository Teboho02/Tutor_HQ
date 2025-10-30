import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { NavigationLink } from '../types';
import './Login.css';

type UserRole = 'student' | 'parent' | 'tutor';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState<UserRole>('student');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const navigationLinks: NavigationLink[] = [
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/main' },
        { label: 'About', href: '/about' },
        { label: 'Tutors', href: '/tutors' },
        { label: 'Contact', href: '/contact' },
    ];

    const roles = [
        { id: 'student' as UserRole, label: 'Student', icon: '🎓', description: 'Access courses and assignments' },
        { id: 'parent' as UserRole, label: 'Parent', icon: '👪', description: 'Monitor child progress' },
        { id: 'tutor' as UserRole, label: 'Tutor', icon: '👨‍🏫', description: 'Teach and manage classes' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.email || !formData.password) {
            alert('Please fill in all fields');
            return;
        }

        // In a real app, you would validate credentials here
        console.log('Login attempt:', { ...formData, role: selectedRole });

        // Navigate to appropriate dashboard based on role
        switch (selectedRole) {
            case 'student':
                navigate('/dashboard');
                break;
            case 'parent':
                navigate('/parents');
                break;
            case 'tutor':
                navigate('/dashboard');
                break;
            default:
                navigate('/dashboard');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="login-page">
            <Header navigationLinks={navigationLinks} />

            <div className="login-container">
                <div className="login-content">
                    <div className="login-header">
                        <h1>Welcome Back</h1>
                        <p>Sign in to continue your learning journey</p>
                    </div>

                    {/* Role Selection */}
                    <div className="role-selection">
                        <label className="role-label">I am a:</label>
                        <div className="role-grid">
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    type="button"
                                    className={`role-card ${selectedRole === role.id ? 'active' : ''}`}
                                    onClick={() => setSelectedRole(role.id)}
                                >
                                    <span className="role-icon">{role.icon}</span>
                                    <span className="role-name">{role.label}</span>
                                    <span className="role-desc">{role.description}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your.email@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="forgot-link">
                                Forgot Password?
                            </Link>
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg btn-block">
                            Sign In as {roles.find(r => r.id === selectedRole)?.label}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/signup" className="signup-link">
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="login-benefits">
                    <h2>Why Tutor HQ?</h2>
                    <div className="benefits-list">
                        <div className="benefit-item">
                            <span className="benefit-icon">📚</span>
                            <div>
                                <h3>Quality Education</h3>
                                <p>Access to expert tutors and comprehensive learning materials</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">📊</span>
                            <div>
                                <h3>Track Progress</h3>
                                <p>Monitor performance with detailed analytics and reports</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">💡</span>
                            <div>
                                <h3>Personalized Learning</h3>
                                <p>Customized learning paths tailored to individual needs</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">🎯</span>
                            <div>
                                <h3>Achieve Goals</h3>
                                <p>Set and track learning objectives with milestone tracking</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Login;
