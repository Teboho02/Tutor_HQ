import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { NavigationLink } from '../types';
import './Tutors.css';

const Tutors: React.FC = () => {
    const navigationLinks: NavigationLink[] = [
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/main' },
        { label: 'About', href: '/about' },
        { label: 'Tutors', href: '/tutors' },
        { label: 'Contact', href: '/contact' },
    ]; const tutors = [
        {
            name: 'Dr. Sarah Johnson',
            subject: 'Mathematics',
            experience: '10+ years',
            rating: 4.9,
            students: 250,
            avatar: '👩‍🏫',
        },
        {
            name: 'Prof. Michael Chen',
            subject: 'Physics',
            experience: '8 years',
            rating: 4.8,
            students: 180,
            avatar: '👨‍🔬',
        },
        {
            name: 'Emily Rodriguez',
            subject: 'English Literature',
            experience: '7 years',
            rating: 5.0,
            students: 300,
            avatar: '👩‍💼',
        },
        {
            name: 'David Thompson',
            subject: 'Computer Science',
            experience: '12 years',
            rating: 4.9,
            students: 220,
            avatar: '👨‍💻',
        },
        {
            name: 'Dr. Lisa Wong',
            subject: 'Chemistry',
            experience: '9 years',
            rating: 4.7,
            students: 190,
            avatar: '👩‍🔬',
        },
        {
            name: 'James Patterson',
            subject: 'History',
            experience: '6 years',
            rating: 4.8,
            students: 160,
            avatar: '👨‍🎓',
        },
    ];

    return (
        <div className="tutors-page">
            <Header navigationLinks={navigationLinks} />

            <section className="tutors-hero">
                <div className="container">
                    <h1>Meet Our Expert Tutors</h1>
                    <p>Learn from certified professionals passionate about education</p>
                </div>
            </section>

            <section className="tutors-content">
                <div className="container">
                    <div className="tutors-grid">
                        {tutors.map((tutor, index) => (
                            <div key={index} className="tutor-card">
                                <div className="tutor-avatar">{tutor.avatar}</div>
                                <h3>{tutor.name}</h3>
                                <p className="tutor-subject">{tutor.subject}</p>
                                <div className="tutor-stats">
                                    <div className="tutor-stat">
                                        <span className="stat-icon">⭐</span>
                                        <span>{tutor.rating}/5.0</span>
                                    </div>
                                    <div className="tutor-stat">
                                        <span className="stat-icon">🎓</span>
                                        <span>{tutor.students}+ students</span>
                                    </div>
                                    <div className="tutor-stat">
                                        <span className="stat-icon">📚</span>
                                        <span>{tutor.experience}</span>
                                    </div>
                                </div>
                                <button className="btn btn-primary">View Profile</button>
                            </div>
                        ))}
                    </div>

                    <div className="become-tutor">
                        <div className="become-tutor-content">
                            <h2>Become a Tutor</h2>
                            <p>
                                Join our community of expert tutors and make a difference in students' lives.
                                Share your knowledge, set your own schedule, and earn while teaching.
                            </p>
                            <button className="btn btn-primary btn-lg">Apply Now</button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Tutors;