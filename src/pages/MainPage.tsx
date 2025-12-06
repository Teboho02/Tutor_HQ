import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { NavigationLink } from '../types';
import './MainPage.css';

interface TabData {
    id: string;
    label: string;
    content: React.ReactNode;
}

const MainPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('student');

    const navigationLinks: NavigationLink[] = [
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/main' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
    ];

    const dashboardTabs: TabData[] = [
        {
            id: 'student',
            label: 'Student',
            content: (
                <div className="dashboard-card">
                    <div className="dashboard-header">
                        <h3>Student Dashboard</h3>
                        <button className="btn btn-primary">Schedule Class</button>
                    </div>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-value">4</div>
                            <div className="stat-label">Upcoming Sessions</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">3</div>
                            <div className="stat-label">Tests This Week</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">85%</div>
                            <div className="stat-label">Overall Progress</div>
                        </div>
                    </div>
                    <h4>Quick Access</h4>
                    <ul className="activity-list">
                        <li className="activity-item">
                            <div className="activity-icon">
                                📅
                            </div>
                            <div>
                                <p><strong>Calendar</strong></p>
                                <small>View your class schedule</small>
                            </div>
                        </li>
                        <li className="activity-item">
                            <div className="activity-icon">
                                📚
                            </div>
                            <div>
                                <p><strong>Study Materials</strong></p>
                                <small>Access notes and resources</small>
                            </div>
                        </li>
                        <li className="activity-item">
                            <div className="activity-icon">
                                📊
                            </div>
                            <div>
                                <p><strong>Progress Tracking</strong></p>
                                <small>Monitor your performance</small>
                            </div>
                        </li>
                        <li className="activity-item">
                            <div className="activity-icon">
                                📝
                            </div>
                            <div>
                                <p><strong>Tests & Assignments</strong></p>
                                <small>View and submit assignments</small>
                            </div>
                        </li>
                    </ul>
                </div>
            )
        },
        {
            id: 'parent',
            label: 'Parent',
            content: (
                <div className="dashboard-card">
                    <div className="dashboard-header">
                        <h3>Parent Dashboard</h3>
                        <button className="btn btn-primary">View Payments</button>
                    </div>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-value">2</div>
                            <div className="stat-label">Active Children</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">R3,200</div>
                            <div className="stat-label">Monthly Fees</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">8</div>
                            <div className="stat-label">Upcoming Sessions</div>
                        </div>
                    </div>
                    <h4>Children Overview</h4>
                    <ul className="activity-list">
                        <li className="activity-item">
                            <div className="activity-icon">
                                👦
                            </div>
                            <div>
                                <p><strong>Thabo Mabaso</strong> - Grade 11</p>
                                <small>Overall Grade: 76% • Attendance: 95%</small>
                            </div>
                        </li>
                        <li className="activity-item">
                            <div className="activity-icon">
                                👧
                            </div>
                            <div>
                                <p><strong>Sarah Mabaso</strong> - Grade 9</p>
                                <small>Overall Grade: 82% • Attendance: 92%</small>
                            </div>
                        </li>
                        <li className="activity-item">
                            <div className="activity-icon">
                                💳
                            </div>
                            <div>
                                <p><strong>Payment Due</strong></p>
                                <small>Next payment: R1,600 on Feb 15</small>
                            </div>
                        </li>
                    </ul>
                </div>
            )
        },
        {
            id: 'tutor',
            label: 'Tutor',
            content: (
                <div className="dashboard-card">
                    <div className="dashboard-header">
                        <h3>Tutor Dashboard</h3>
                        <button className="btn btn-primary">View Schedule</button>
                    </div>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-value">15</div>
                            <div className="stat-label">Total Students</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">R19,950</div>
                            <div className="stat-label">Pending Payout</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">5</div>
                            <div className="stat-label">Classes This Week</div>
                        </div>
                    </div>
                    <h4>Quick Actions</h4>
                    <ul className="activity-list">
                        <li className="activity-item">
                            <div className="activity-icon">
                                📅
                            </div>
                            <div>
                                <p><strong>Schedule Management</strong></p>
                                <small>View and manage your class schedule</small>
                            </div>
                        </li>
                        <li className="activity-item">
                            <div className="activity-icon">
                                👥
                            </div>
                            <div>
                                <p><strong>My Students</strong></p>
                                <small>Track student progress and performance</small>
                            </div>
                        </li>
                        <li className="activity-item">
                            <div className="activity-icon">
                                📚
                            </div>
                            <div>
                                <p><strong>Teaching Materials</strong></p>
                                <small>Upload and manage course materials</small>
                            </div>
                        </li>
                        <li className="activity-item">
                            <div className="activity-icon">
                                👤
                            </div>
                            <div>
                                <p><strong>Account Settings</strong></p>
                                <small>Update profile and banking details</small>
                            </div>
                        </li>
                    </ul>
                </div>
            )
        }
    ];

    return (
        <div className="main-page">
            <Header navigationLinks={navigationLinks} />

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1>Learn Smarter, Together</h1>
                        <p>
                            Experience the future of education with our comprehensive learning management system.
                            Connect students, tutors, and parents in one powerful platform.
                        </p>
                        <div className="hero-buttons">
                            <button className="btn btn-primary">Get Started</button>
                            <button className="btn btn-outline">Watch Demo</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features" id="features">
                <div className="container">
                    <div className="section-title">
                        <h2>Powerful Features for Every User</h2>
                        <p>Everything you need to manage, track, and enhance the learning experience</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                📹
                            </div>
                            <h3>Live Classes</h3>
                            <p>Interactive video sessions with screen sharing, whiteboard, and real-time collaboration tools.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                📋
                            </div>
                            <h3>Tests & Assignments</h3>
                            <p>Create, distribute, and grade assignments with automated scoring and detailed feedback.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                📆
                            </div>
                            <h3>Smart Scheduling</h3>
                            <p>Advanced calendar system with automatic conflict resolution and reminder notifications.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                💳
                            </div>
                            <h3>Payment Processing</h3>
                            <p>Secure payment handling with multiple payment methods and automated billing.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                📈
                            </div>
                            <h3>Progress Tracking</h3>
                            <p>Monitor student performance with detailed analytics and visual progress reports.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                👥
                            </div>
                            <h3>Parent Dashboard</h3>
                            <p>Keep parents informed about their child's academic progress and attendance.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials" id="testimonials">
                <div className="container">
                    <div className="section-title">
                        <h2>What Our Users Say</h2>
                        <p>Hear from students, parents, and tutors about their experience with Tutor HQ</p>
                    </div>
                    <div className="testimonial-grid">
                        <div className="testimonial-card">
                            <p className="testimonial-text">
                                "Tutor HQ has transformed how I manage my classes. The live session integration
                                and assignment tracking save me hours each week."
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar">LT</div>
                                <div className="author-info">
                                    <h4>Leeway Tutors</h4>
                                    <p>Math Tutor</p>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card">
                            <p className="testimonial-text">
                                "As a parent, I love being able to track my daughter's progress and communicate
                                directly with her tutors. It gives me peace of mind."
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar">MM</div>
                                <div className="author-info">
                                    <h4>Mandla Mathonsi</h4>
                                    <p>Parent</p>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card">
                            <p className="testimonial-text">
                                "The platform makes learning fun and organized. I can easily access all my
                                classes, assignments, and grades in one place."
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar">TR</div>
                                <div className="author-info">
                                    <h4>Tshepo Radebe</h4>
                                    <p>Student</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dashboard Preview */}
            <section className="dashboard-preview" id="dashboard">
                <div className="container">
                    <div className="section-title">
                        <h2>Dashboard Previews</h2>
                        <p>See how each user type experiences the platform</p>
                    </div>
                    <div className="dashboard-tabs">
                        {dashboardTabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="tab-content active">
                        {dashboardTabs.find(tab => tab.id === activeTab)?.content}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default MainPage;