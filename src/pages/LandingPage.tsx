import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { NavigationLink } from '../types';
import './LandingPage.css';

const LandingPage: React.FC = () => {
    const navigationLinks: NavigationLink[] = [
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/main' },
        { label: 'About', href: '/about' },
        { label: 'Tutors', href: '/tutors' },
        { label: 'Contact', href: '/contact' },
    ];

    return (
        <div className="landing-page">
            <Header navigationLinks={navigationLinks} />

            {/* Hero Section */}
            <section className="hero">
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
                            <button className="btn btn-primary btn-lg">
                                ▶️ Start Learning
                            </button>
                            <button className="btn btn-secondary btn-lg">
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

            {/* Features Section */}
            <section className="features" id="about">
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
                            <button className="btn btn-primary btn-lg">
                                Get Started Today
                            </button>
                            <button className="btn btn-outline btn-lg">
                                Schedule a Demo
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;