import React, { useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import type { NavigationLink } from '../../../types';
import './StudentMaterials.css';

interface Material {
    id: number;
    type: 'note' | 'video' | 'assignment';
    title: string;
    description: string;
    date: string;
    size?: string;
    duration?: string;
}

interface Grade {
    assignment: string;
    score: number;
    maxScore: number;
    date: string;
    feedback: string;
}

const StudentMaterials: React.FC = () => {
    const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
    const [activeTab, setActiveTab] = useState<'notes' | 'videos' | 'grades'>('notes');

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/student/dashboard' },
        { label: 'Live Classes', href: '/student/live-classes' },
        { label: 'Calendar', href: '/student/calendar' },
        { label: 'Materials', href: '/student/materials' },
        { label: 'Progress', href: '/student/progress' },
        { label: 'Messages', href: '/student/messages' },
    ];

    const subjects = [
        { name: 'Mathematics', icon: '🔢', color: '#0066ff' },
        { name: 'Physics', icon: '⚛️', color: '#5856d6' },
        { name: 'Chemistry', icon: '🧪', color: '#34c759' },
        { name: 'Biology', icon: '🧬', color: '#ff9500' },
        { name: 'English', icon: '📖', color: '#ff3b30' },
        { name: 'History', icon: '🏛️', color: '#af52de' },
    ];

    const materials: Record<string, Material[]> = {
        Mathematics: [
            { id: 1, type: 'note', title: 'Calculus Chapter 5 Notes', description: 'Integration techniques and applications', date: '2 days ago', size: '2.5 MB' },
            { id: 2, type: 'note', title: 'Differential Equations Summary', description: 'Quick reference guide', date: '1 week ago', size: '1.2 MB' },
            { id: 3, type: 'note', title: 'Linear Algebra Formulas', description: 'Essential formulas and theorems', date: '2 weeks ago', size: '800 KB' },
        ],
        Physics: [
            { id: 4, type: 'note', title: 'Newton\'s Laws of Motion', description: 'Comprehensive study guide', date: '3 days ago', size: '1.8 MB' },
            { id: 5, type: 'note', title: 'Thermodynamics Basics', description: 'Heat, work, and energy principles', date: '1 week ago', size: '2.1 MB' },
        ],
    };

    const videos: Record<string, Material[]> = {
        Mathematics: [
            { id: 1, type: 'video', title: 'Integration by Parts Tutorial', description: 'Step-by-step explanation with examples', date: '3 days ago', duration: '45 min' },
            { id: 2, type: 'video', title: 'Solving Differential Equations', description: 'Methods and practice problems', date: '1 week ago', duration: '60 min' },
            { id: 3, type: 'video', title: 'Matrix Operations', description: 'Addition, multiplication, and inverse', date: '2 weeks ago', duration: '38 min' },
        ],
        Physics: [
            { id: 4, type: 'video', title: 'Understanding Force and Motion', description: 'Real-world applications of Newton\'s laws', date: '4 days ago', duration: '52 min' },
            { id: 5, type: 'video', title: 'Energy Conservation Principles', description: 'Kinetic and potential energy', date: '1 week ago', duration: '41 min' },
        ],
    };

    const grades: Record<string, Grade[]> = {
        Mathematics: [
            { assignment: 'Assignment 5 - Integration', score: 92, maxScore: 100, date: '2 days ago', feedback: 'Excellent work! Clear understanding of concepts.' },
            { assignment: 'Midterm Exam', score: 88, maxScore: 100, date: '1 week ago', feedback: 'Good performance. Review differential equations.' },
            { assignment: 'Assignment 4 - Derivatives', score: 95, maxScore: 100, date: '2 weeks ago', feedback: 'Outstanding! Perfect execution.' },
        ],
        Physics: [
            { assignment: 'Lab Report 3', score: 85, maxScore: 100, date: '3 days ago', feedback: 'Good analysis. Include more data interpretation.' },
            { assignment: 'Quiz 2 - Mechanics', score: 90, maxScore: 100, date: '1 week ago', feedback: 'Very good understanding of core concepts.' },
        ],
    };

    const currentMaterials = materials[selectedSubject] || [];
    const currentVideos = videos[selectedSubject] || [];
    const currentGrades = grades[selectedSubject] || [];

    const getPercentage = (score: number, max: number) => ((score / max) * 100).toFixed(0);

    return (
        <div className="student-materials-page">
            <Header navigationLinks={navigationLinks} />

            <div className="materials-container">
                <div className="page-header">
                    <h1>Course Materials</h1>
                    <p>Access notes, videos, and track your grades</p>
                </div>

                {/* Subject Selection */}
                <div className="subjects-grid">
                    {subjects.map((subject) => (
                        <button
                            key={subject.name}
                            className={`subject-card ${selectedSubject === subject.name ? 'active' : ''}`}
                            onClick={() => setSelectedSubject(subject.name)}
                            style={{ borderColor: selectedSubject === subject.name ? subject.color : 'transparent' }}
                        >
                            <span className="subject-icon" style={{ color: subject.color }}>
                                {subject.icon}
                            </span>
                            <span className="subject-name">{subject.name}</span>
                        </button>
                    ))}
                </div>

                {/* Content Tabs */}
                <div className="content-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notes')}
                    >
                        📄 Notes ({currentMaterials.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('videos')}
                    >
                        📹 Videos ({currentVideos.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'grades' ? 'active' : ''}`}
                        onClick={() => setActiveTab('grades')}
                    >
                        📊 Grades ({currentGrades.length})
                    </button>
                </div>

                {/* Content Area */}
                <div className="materials-content">
                    {/* Notes Tab */}
                    {activeTab === 'notes' && (
                        <div className="materials-list">
                            {currentMaterials.length > 0 ? (
                                currentMaterials.map((material) => (
                                    <div key={material.id} className="material-card">
                                        <div className="material-icon">📄</div>
                                        <div className="material-info">
                                            <h3>{material.title}</h3>
                                            <p>{material.description}</p>
                                            <div className="material-meta">
                                                <span>📅 {material.date}</span>
                                                <span>📦 {material.size}</span>
                                            </div>
                                        </div>
                                        <button className="btn btn-outline btn-sm">Download</button>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <span className="empty-icon">📄</span>
                                    <p>No notes available for {selectedSubject}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Videos Tab */}
                    {activeTab === 'videos' && (
                        <div className="materials-list">
                            {currentVideos.length > 0 ? (
                                currentVideos.map((video) => (
                                    <div key={video.id} className="material-card">
                                        <div className="material-icon video-icon">📹</div>
                                        <div className="material-info">
                                            <h3>{video.title}</h3>
                                            <p>{video.description}</p>
                                            <div className="material-meta">
                                                <span>📅 {video.date}</span>
                                                <span>⏱️ {video.duration}</span>
                                            </div>
                                        </div>
                                        <button className="btn btn-primary btn-sm">Watch</button>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <span className="empty-icon">📹</span>
                                    <p>No videos available for {selectedSubject}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Grades Tab */}
                    {activeTab === 'grades' && (
                        <div className="grades-list">
                            {currentGrades.length > 0 ? (
                                currentGrades.map((grade, index) => (
                                    <div key={index} className="grade-card">
                                        <div className="grade-header">
                                            <h3>{grade.assignment}</h3>
                                            <div className="grade-score">
                                                <span className="score">{grade.score}/{grade.maxScore}</span>
                                                <span className={`percentage ${parseInt(getPercentage(grade.score, grade.maxScore)) >= 80 ? 'high' : ''}`}>
                                                    {getPercentage(grade.score, grade.maxScore)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="grade-date">📅 {grade.date}</div>
                                        <div className="grade-feedback">
                                            <strong>Feedback:</strong> {grade.feedback}
                                        </div>
                                        <div className="grade-bar">
                                            <div
                                                className="grade-fill"
                                                style={{ width: `${getPercentage(grade.score, grade.maxScore)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <span className="empty-icon">📊</span>
                                    <p>No grades available for {selectedSubject}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default StudentMaterials;
