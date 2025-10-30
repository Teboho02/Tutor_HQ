import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { NavigationLink } from '../types';
import './About.css';

const About: React.FC = () => {
    const navigationLinks: NavigationLink[] = [
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/main' },
        { label: 'About', href: '/about' },
        { label: 'Tutors', href: '/tutors' },
        { label: 'Contact', href: '/contact' },
    ]; return (
        <div className="about-page">
            <Header navigationLinks={navigationLinks} />

            <section className="about-hero">
                <div className="container">
                    <h1>About Tutor HQ</h1>
                    <p>Empowering students through personalized online education</p>
                </div>
            </section>

            <section className="about-content">
                <div className="container">
                    <div className="about-grid">
                        <div className="about-text">
                            <h2>Our Mission</h2>
                            <p>
                                At Tutor HQ, we believe that every student deserves access to quality education
                                tailored to their unique learning style. Our mission is to connect students with
                                expert tutors who can provide personalized guidance and support.
                            </p>
                            <p>
                                Founded in 2020, we've helped thousands of students achieve their academic goals
                                through one-on-one tutoring, interactive live classes, and comprehensive learning
                                resources.
                            </p>
                        </div>

                        <div className="about-stats">
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

                    <div className="about-values">
                        <h2>Our Values</h2>
                        <div className="values-grid">
                            <div className="value-card">
                                <span className="value-icon">🎯</span>
                                <h3>Excellence</h3>
                                <p>We strive for excellence in everything we do, from tutor selection to platform development.</p>
                            </div>
                            <div className="value-card">
                                <span className="value-icon">🤝</span>
                                <h3>Integrity</h3>
                                <p>We maintain the highest standards of integrity in all our interactions and services.</p>
                            </div>
                            <div className="value-card">
                                <span className="value-icon">💡</span>
                                <h3>Innovation</h3>
                                <p>We continuously innovate to provide the best learning experience for our students.</p>
                            </div>
                            <div className="value-card">
                                <span className="value-icon">❤️</span>
                                <h3>Passion</h3>
                                <p>We're passionate about education and helping students reach their full potential.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;