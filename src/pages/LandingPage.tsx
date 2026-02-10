import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { NavigationLink } from '../types';
import './LandingPage.css';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const navigationLinks: NavigationLink[] = [
        { label: 'Home', href: '#hero' },
        { label: 'About', href: '#about' },
        { label: 'Features', href: '#features' },
        { label: 'Contact', href: '#contact' },
    ];

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const mailtoLink = `mailto:info@tutorhq.co.za?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )}`;
        window.location.href = mailtoLink;
        setFormData({ name: '', email: '', subject: '', message: '' });
        alert('Thank you for your message! Your default email client will open.');
    };

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="landing-page">
            <Header navigationLinks={navigationLinks} />

            {/* Hero Section */}
            <section className="hero" id="hero">
                <div className="hero-content container">
                    <div className="hero-text">
                        <h1>
                            Expert <span className="highlight">Online Tutoring</span> with
                            Personalized Learning
                        </h1>
                        <p>
                            Connect with certified tutors for personalized learning experiences.
                            From K-12 to college-level subjects, we provide expert guidance
                            tailored to your learning style and pace.
                        </p>
                        <div className="hero-actions">
                            <button className="btn btn-primary btn-lg" onClick={() => navigate('/signup')}>
                                🚀 Get Started Free
                            </button>
                            <button className="btn btn-secondary btn-lg" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                                ℹ️ Learn More
                            </button>
                        </div>
                        <div className="hero-stats">
                            <div className="stat">
                                <span className="stat-number">10K+</span>
                                <span className="stat-label">Students</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">500+</span>
                                <span className="stat-label">Expert Tutors</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">98%</span>
                                <span className="stat-label">Success Rate</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="hero-card floating">
                            <div className="hero-card-header">
                                <div className="hero-card-avatar"></div>
                                <div className="hero-card-info">
                                    <h4>Sarah Johnson</h4>
                                    <p>Mathematics Tutor</p>
                                </div>
                            </div>
                            <div className="hero-card-content">
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '85%' }}></div>
                                </div>
                                <p className="progress-text">85% Course Completion</p>
                            </div>
                        </div>

                        <div className="hero-card floating" style={{ animationDelay: '0.5s' }}>
                            <div className="hero-card-icon">
                                📹
                            </div>
                            <h4>Live Classes</h4>
                            <p>Interactive sessions with real-time feedback</p>
                        </div>

                        <div className="hero-card floating" style={{ animationDelay: '1s' }}>
                            <div className="hero-card-icon success">
                                🏆
                            </div>
                            <h4>Achievements</h4>
                            <p>Track your progress and earn certificates</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section" id="about">
                <div className="container">
                    <div className="section-header">
                        <h2>About Tutor HQ</h2>
                        <p>Empowering students through personalized online education</p>
                    </div>

                    <div className="about-grid">
                        <div className="about-text">
                            <h3>Our Mission</h3>
                            <p>
                                At Tutor HQ, we believe that every student deserves access to quality education
                                tailored to their unique learning style. Our mission is to connect students with
                                expert tutors who can provide personalized guidance and support.
                            </p>
                            <p>
                                Founded in 2020, we've helped thousands of students achieve their academic goals
                                through one-on-one tutoring, interactive live classes, and comprehensive learning
                                resources. Whether you're a parent looking for support for your child or a student
                                seeking to excel in your studies, Tutor HQ is here to help you succeed.
                            </p>
                        </div>

                        <div className="about-stats-grid">
                            <div className="stat-box">
                                <h3>10,000+</h3>
                                <p>Active Students</p>
                            </div>
                            <div className="stat-box">
                                <h3>500+</h3>
                                <p>Expert Tutors</p>
                            </div>
                            <div className="stat-box">
                                <h3>98%</h3>
                                <p>Success Rate</p>
                            </div>
                            <div className="stat-box">
                                <h3>50+</h3>
                                <p>Subjects Covered</p>
                            </div>
                        </div>
                    </div>

                    <div className="values-section">
                        <h3>Our Core Values</h3>
                        <div className="values-grid">
                            <div className="value-card">
                                <span className="value-icon">🎯</span>
                                <h4>Excellence</h4>
                                <p>We strive for excellence in everything we do, from tutor selection to platform development.</p>
                            </div>
                            <div className="value-card">
                                <span className="value-icon">🤝</span>
                                <h4>Integrity</h4>
                                <p>We maintain the highest standards of integrity in all our interactions and services.</p>
                            </div>
                            <div className="value-card">
                                <span className="value-icon">💡</span>
                                <h4>Innovation</h4>
                                <p>We continuously innovate to provide the best learning experience for our students.</p>
                            </div>
                            <div className="value-card">
                                <span className="value-icon">❤️</span>
                                <h4>Passion</h4>
                                <p>We're passionate about education and helping students reach their full potential.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features" id="features">
                <div className="container">
                    <div className="section-header">
                        <h2>Why Choose Tutor HQ?</h2>
                        <p>Experience the difference with our comprehensive learning platform</p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                🎓
                            </div>
                            <h3>Expert Tutors</h3>
                            <p>Learn from certified professionals with proven track records in their subjects.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                ⏰
                            </div>
                            <h3>Flexible Scheduling</h3>
                            <p>Book sessions that fit your schedule with 24/7 availability.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                📈
                            </div>
                            <h3>Progress Tracking</h3>
                            <p>Monitor your learning journey with detailed analytics and reports.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                📱
                            </div>
                            <h3>Mobile Learning</h3>
                            <p>Access your lessons anywhere with our responsive platform.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                📜
                            </div>
                            <h3>Certifications</h3>
                            <p>Earn recognized certificates upon course completion.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                🎧
                            </div>
                            <h3>24/7 Support</h3>
                            <p>Get help whenever you need it with our dedicated support team.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Start Your Learning Journey?</h2>
                        <p>Join thousands of students who have transformed their education with Tutor HQ</p>
                        <div className="cta-actions">
                            <button className="btn btn-primary btn-lg" onClick={() => navigate('/signup')}>
                                Get Started Today
                            </button>
                            <button className="btn btn-outline btn-lg" onClick={() => navigate('/login')}>
                                Already a Member? Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section" id="contact">
                <div className="container">
                    <div className="section-header">
                        <h2>Get in Touch</h2>
                        <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                    </div>

                    <div className="contact-grid">
                        <div className="contact-info">
                            <h3>Contact Information</h3>
                            <p className="contact-intro">
                                Have questions? We're here to help. Reach out to us through any of the following channels.
                            </p>

                            <div className="contact-methods">
                                <div className="contact-method">
                                    <span className="method-icon">📧</span>
                                    <div>
                                        <h4>Email</h4>
                                        <p>info@tutorhq.co.za</p>
                                    </div>
                                </div>

                                <div className="contact-method">
                                    <span className="method-icon">📞</span>
                                    <div>
                                        <h4>Phone</h4>
                                        <p>+27 78 600-7737</p>
                                    </div>
                                </div>

                                <div className="contact-method">
                                    <span className="method-icon">📍</span>
                                    <div>
                                        <h4>Address</h4>
                                        <p>28 Wits St<br />Braam City</p>
                                    </div>
                                </div>

                                <div className="contact-method">
                                    <span className="method-icon">⏰</span>
                                    <div>
                                        <h4>Business Hours</h4>
                                        <p>Mon-Fri: 8:00 AM - 8:00 PM<br />Sat-Sun: 10:00 AM - 6:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="contact-form-container">
                            <h3>Send Us a Message</h3>
                            <form onSubmit={handleContactSubmit} className="contact-form">
                                <div className="form-group">
                                    <label htmlFor="name">Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleContactChange}
                                        required
                                        placeholder="Your full name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleContactChange}
                                        required
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">Subject *</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleContactChange}
                                        required
                                        placeholder="What is this regarding?"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Message *</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleContactChange}
                                        required
                                        rows={6}
                                        placeholder="Tell us how we can help you..."
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary btn-lg">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;