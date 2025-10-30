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
        { label: 'Tutors', href: '/tutors' },
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
                        <button className="btn btn-primary">Join Live Class</button>
                    </div>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-value">3</div>
                            <div className="stat-label">Upcoming Classes</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">2</div>
                            <div className="stat-label">Pending Assignments</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">87%</div>
                            <div className="stat-label">Average Grade</div>
                        </div>
                    </div>
                    <h4>Recent Activity</h4>
                    <ul className="activity-list">
                        <li className="activity-item">
                            <div className="activity-icon">
                                📚
                            </div>
                            <div>
                                <p><strong>Math Assignment</strong> due tomorrow</p>
                                <small>Algebra - Chapter 5</small>
                            </div>
                        </li>
                        <li className="activity-item">
                            <div className="activity-icon">
                                📹
                            </div>
                            <div>
                                <p><strong>Live Science Class</strong> at 2:00 PM</p>
                                <small>Chemistry - Organic Compounds</small>
                            </div>
                        </li>
                        <li className="activity-item">
                            <div className="activity-icon">
                                📊
                            </div>
                            <div>
                                <p><strong>History Test</strong> graded: 92%</p>
                                <small>View feedback from instructor</small>
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
                        <button className="btn btn-primary">Message Tutor</button>
                    </div>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-value">95%</div>
                            <div className="stat-label">Attendance</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">B+</div>
                            <div className="stat-label">Current Grade</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">2</div>
                            <div className="stat-label">Upcoming Tests</div>
                        </div>
                    </div>
                    <h4>Child Progress</h4>
                    <ul className="activity-list">
                        <li className="activity-item">
                            <div className="activity-icon">
                                ✅
                            </div>
                            <div>
                                <p><strong>Math Test</strong> completed: A-</p>
                                <small>Great improvement in problem solving</small>
                            </div>
                        </li>
                        <li className="activity-item">
                            <div className="activity-icon">
                                📅
                            </div>
                            <div>
                                <p><strong>Parent-Teacher Meeting</strong> scheduled</p>
                                <small>Tomorrow at 3:00 PM</small>
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
                        <button className="btn btn-primary">Start Class</button>
                    </div>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-value">12</div>
                            <div className="stat-label">Active Students</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">5</div>
                            <div className="stat-label">Classes Today</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">4.8</div>
                            <div className="stat-label">Rating</div>
                        </div>
                    </div>
                    <h4>Today's Schedule</h4>
                    <ul className="activity-list">
                        <li className="activity-item">
                            <div className="activity-icon">
                                👥
                            </div>
                            <div>
                                <p><strong>Math Class</strong> - 10:00 AM</p>
                                <small>Grade 10 - Quadratic Equations</small>
                            </div>
                        </li>
                        <li className="activity-item">
                            <div className="activity-icon">
                                📄
                            </div>
                            <div>
                                <p><strong>Grade Assignments</strong></p>
                                <small>8 assignments pending review</small>
                            </div>
                        </li>
                    </ul>
                </div>
            )
        },
        {
            id: 'admin',
            label: 'Admin',
            content: (
                <div className="dashboard-card">
                    <div className="dashboard-header">
                        <h3>Admin Dashboard</h3>
                        <button className="btn btn-primary">Generate Reports</button>
                    </div>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-value">150</div>
                            <div className="stat-label">Total Students</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">25</div>
                            <div className="stat-label">Active Tutors</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">$12.5K</div>
                            <div className="stat-label">Monthly Revenue</div>
                        </div>
                    </div>
                    <h4>System Overview</h4>
                    <ul className="activity-list">
                        <li className="activity-item">
                            <div className="activity-icon">
                                🔔
                            </div>
                            <div>
                                <p><strong>New Registration</strong></p>
                                <small>3 new students this week</small>
                            </div>
                        </li>
                        <li className="activity-item">
                            <div className="activity-icon">
                                ⚙️
                            </div>
                            <div>
                                <p><strong>System Maintenance</strong></p>
                                <small>Scheduled for Sunday 2:00 AM</small>
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