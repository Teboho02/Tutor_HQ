import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { NavigationLink } from '../types';
import './Signup.css';

type SignupType = 'student-parent' | 'tutor';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [signupType, setSignupType] = useState<SignupType>('student-parent');
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        // Common fields
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',

        // Student/Parent specific
        userType: 'student', // student or parent
        grade: '',
        parentEmail: '',

        // Tutor specific
        qualification: '',
        subjects: '',
        experience: '',
        bio: '',
    });

    const navigationLinks: NavigationLink[] = [
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/main' },
        { label: 'About', href: '/about' },
        { label: 'Tutors', href: '/tutors' },
        { label: 'Contact', href: '/contact' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setErrorMsg('Passwords do not match!');
            return;
        }

        if (formData.password.length < 8) {
            setErrorMsg('Password must be at least 8 characters long!');
            return;
        }

        // Determine the role
        const role = signupType === 'tutor' ? 'tutor' : (formData.userType as 'student' | 'parent');

        // Build registration data
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        const registerData: {
            email: string;
            password: string;
            fullName: string;
            role: 'student' | 'tutor' | 'parent';
            parentEmails?: string[];
            childEmails?: string[];
        } = {
            email: formData.email,
            password: formData.password,
            fullName,
            role,
        };

        // Add parent email for student signups
        if (role === 'student' && formData.parentEmail) {
            registerData.parentEmails = [formData.parentEmail];
        }

        // Add child email for parent signups
        if (role === 'parent' && formData.parentEmail) {
            registerData.childEmails = [formData.parentEmail];
        }

        setSubmitting(true);
        try {
            await register(registerData);
            // Registration successful — navigate to appropriate portal
            switch (role) {
                case 'student':
                    navigate('/student/dashboard');
                    break;
                case 'tutor':
                    navigate('/tutor/dashboard');
                    break;
                case 'parent':
                    navigate('/parent/dashboard');
                    break;
                default:
                    navigate('/login');
            }
        } catch (err: unknown) {
            const axiosError = err as { response?: { data?: { message?: string } } };
            setErrorMsg(axiosError.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="signup-page">
            <Header navigationLinks={navigationLinks} />

            <div className="signup-container">
                <div className="signup-content">
                    <div className="signup-header">
                        <h1>Join Tutor HQ</h1>
                        <p>Start your learning journey or become a tutor today</p>
                    </div>

                    {/* Signup Type Selection */}
                    <div className="signup-type-selection">
                        <button
                            type="button"
                            className={`type-btn ${signupType === 'student-parent' ? 'active' : ''}`}
                            onClick={() => setSignupType('student-parent')}
                        >
                            <span className="type-icon">🎓</span>
                            <span>Student / Parent</span>
                        </button>
                        <button
                            type="button"
                            className={`type-btn ${signupType === 'tutor' ? 'active' : ''}`}
                            onClick={() => setSignupType('tutor')}
                        >
                            <span className="type-icon">👨‍🏫</span>
                            <span>Tutor</span>
                        </button>
                    </div>

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit} className="signup-form">
                        {/* Error Message */}
                        {errorMsg && (
                            <div className="signup-error">
                                <span>⚠️ {errorMsg}</span>
                                <button type="button" onClick={() => setErrorMsg(null)} className="error-close">×</button>
                            </div>
                        )}

                        {/* Common Fields */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name *</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="John"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName">Last Name *</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address *</label>
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
                            <label htmlFor="phone">Phone Number *</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+27 12 345 6789"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="password">Password *</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Min. 8 characters"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password *</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Repeat password"
                                    required
                                />
                            </div>
                        </div>

                        {/* Student/Parent Specific Fields */}
                        {signupType === 'student-parent' && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="userType">I am a: *</label>
                                    <select
                                        id="userType"
                                        name="userType"
                                        value={formData.userType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="student">Student</option>
                                        <option value="parent">Parent</option>
                                    </select>
                                </div>

                                {formData.userType === 'student' && (
                                    <div className="form-group">
                                        <label htmlFor="grade">Grade/Year *</label>
                                        <select
                                            id="grade"
                                            name="grade"
                                            value={formData.grade}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Grade</option>
                                            <option value="8">Grade 8</option>
                                            <option value="9">Grade 9</option>
                                            <option value="10">Grade 10</option>
                                            <option value="11">Grade 11</option>
                                            <option value="12">Grade 12</option>
                                            <option value="university">University</option>
                                        </select>
                                    </div>
                                )}

                                {formData.userType === 'parent' && (
                                    <div className="form-group">
                                        <label htmlFor="parentEmail">Child's Email (Optional)</label>
                                        <input
                                            type="email"
                                            id="parentEmail"
                                            name="parentEmail"
                                            value={formData.parentEmail}
                                            onChange={handleChange}
                                            placeholder="child@example.com"
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        {/* Tutor Specific Fields */}
                        {signupType === 'tutor' && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="qualification">Highest Qualification *</label>
                                    <input
                                        type="text"
                                        id="qualification"
                                        name="qualification"
                                        value={formData.qualification}
                                        onChange={handleChange}
                                        placeholder="e.g., Bachelor's in Mathematics"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subjects">Subjects You Teach *</label>
                                    <input
                                        type="text"
                                        id="subjects"
                                        name="subjects"
                                        value={formData.subjects}
                                        onChange={handleChange}
                                        placeholder="e.g., Math, Physics, Chemistry"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="experience">Years of Experience *</label>
                                    <input
                                        type="number"
                                        id="experience"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="bio">Brief Bio *</label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Tell us about your teaching experience and approach..."
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input type="checkbox" required />
                                <span>
                                    I agree to the{' '}
                                    <Link to="/terms" target="_blank">Terms of Service</Link>
                                    {' '}and{' '}
                                    <Link to="/privacy" target="_blank">Privacy Policy</Link>
                                </span>
                            </label>
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={submitting}>
                            {submitting ? 'Creating Account...' : (signupType === 'tutor' ? 'Apply as Tutor' : 'Create Account')}
                        </button>
                    </form>

                    <div className="signup-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="login-link">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Signup;
