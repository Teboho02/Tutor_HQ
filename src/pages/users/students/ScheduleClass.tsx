import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import type { NavigationLink } from '../../../types';
import './ScheduleClass.css';

interface Student {
    id: string;
    name: string;
    email: string;
}

interface Tutor {
    id: string;
    name: string;
    subject: string;
}

const ScheduleClass: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        instructor: '',
        startTime: '',
        duration: '60',
        description: '',
        selectedStudents: [] as string[],
        selectedTutors: [] as string[],
    });

    const [isScheduling, setIsScheduling] = useState(false);

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/student/dashboard' },
        { label: 'Live Classes', href: '/student/live-classes' },
        { label: 'Calendar', href: '/student/calendar' },
        { label: 'Materials', href: '/student/materials' },
        { label: 'Progress', href: '/student/progress' },
    ];

    // Mock data - would come from API
    const availableStudents: Student[] = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
        { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
        { id: '4', name: 'Sarah Williams', email: 'sarah@example.com' },
        { id: '5', name: 'Tom Brown', email: 'tom@example.com' },
    ];

    const availableTutors: Tutor[] = [
        { id: '1', name: 'Dr. Smith', subject: 'Mathematics' },
        { id: '2', name: 'Prof. Johnson', subject: 'Physics' },
        { id: '3', name: 'Dr. Williams', subject: 'Chemistry' },
    ];

    const subjects = [
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'English',
        'History',
        'Computer Science',
    ];

    const handleStudentToggle = (studentId: string) => {
        setFormData(prev => ({
            ...prev,
            selectedStudents: prev.selectedStudents.includes(studentId)
                ? prev.selectedStudents.filter(id => id !== studentId)
                : [...prev.selectedStudents, studentId],
        }));
    };

    const handleTutorToggle = (tutorId: string) => {
        setFormData(prev => ({
            ...prev,
            selectedTutors: prev.selectedTutors.includes(tutorId)
                ? prev.selectedTutors.filter(id => id !== tutorId)
                : [...prev.selectedTutors, tutorId],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsScheduling(true);

        try {
            const response = await fetch('http://localhost:3001/api/classes/schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formData.title,
                    subject: formData.subject,
                    instructor: formData.instructor,
                    students: formData.selectedStudents,
                    tutors: formData.selectedTutors,
                    startTime: formData.startTime,
                    duration: parseInt(formData.duration),
                    description: formData.description,
                }),
            });

            const data = await response.json();

            if (data.success) {
                alert('Class scheduled successfully! Students and tutors will be notified.');
                navigate('/student/live-classes');
            } else {
                throw new Error('Failed to schedule class');
            }
        } catch (error) {
            console.error('Error scheduling class:', error);
            alert('Failed to schedule class. Please try again.');
        } finally {
            setIsScheduling(false);
        }
    };

    return (
        <div className="schedule-class-page">
            <Header navigationLinks={navigationLinks} />

            <div className="schedule-container">
                <div className="page-header">
                    <h1>Schedule Live Class</h1>
                    <p>Create and schedule a new live video class</p>
                </div>

                <form className="schedule-form" onSubmit={handleSubmit}>
                    {/* Basic Information */}
                    <div className="form-section">
                        <h2>Class Information</h2>

                        <div className="form-group">
                            <label htmlFor="title">Class Title *</label>
                            <input
                                type="text"
                                id="title"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Advanced Calculus - Integration Techniques"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="subject">Subject *</label>
                                <select
                                    id="subject"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                >
                                    <option value="">Select subject</option>
                                    {subjects.map(subject => (
                                        <option key={subject} value={subject}>{subject}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="instructor">Instructor Name *</label>
                                <input
                                    type="text"
                                    id="instructor"
                                    required
                                    value={formData.instructor}
                                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                                    placeholder="e.g., Dr. Smith"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="startTime">Start Date & Time *</label>
                                <input
                                    type="datetime-local"
                                    id="startTime"
                                    required
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="duration">Duration (minutes) *</label>
                                <select
                                    id="duration"
                                    required
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                >
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                    <option value="60">1 hour</option>
                                    <option value="90">1.5 hours</option>
                                    <option value="120">2 hours</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Add class description, topics to be covered, prerequisites, etc."
                            />
                        </div>
                    </div>

                    {/* Select Students */}
                    <div className="form-section">
                        <h2>Select Students ({formData.selectedStudents.length} selected)</h2>
                        <div className="participants-grid">
                            {availableStudents.map(student => (
                                <div
                                    key={student.id}
                                    className={`participant-card ${formData.selectedStudents.includes(student.id) ? 'selected' : ''}`}
                                    onClick={() => handleStudentToggle(student.id)}
                                >
                                    <div className="participant-avatar">👤</div>
                                    <div className="participant-info">
                                        <h4>{student.name}</h4>
                                        <p>{student.email}</p>
                                    </div>
                                    {formData.selectedStudents.includes(student.id) && (
                                        <div className="selected-badge">✓</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Select Tutors */}
                    <div className="form-section">
                        <h2>Select Additional Tutors ({formData.selectedTutors.length} selected)</h2>
                        <p className="section-note">Optional: Add co-tutors or teaching assistants</p>
                        <div className="participants-grid">
                            {availableTutors.map(tutor => (
                                <div
                                    key={tutor.id}
                                    className={`participant-card ${formData.selectedTutors.includes(tutor.id) ? 'selected' : ''}`}
                                    onClick={() => handleTutorToggle(tutor.id)}
                                >
                                    <div className="participant-avatar tutor">👨‍🏫</div>
                                    <div className="participant-info">
                                        <h4>{tutor.name}</h4>
                                        <p>{tutor.subject}</p>
                                    </div>
                                    {formData.selectedTutors.includes(tutor.id) && (
                                        <div className="selected-badge">✓</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => navigate('/student/live-classes')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isScheduling || formData.selectedStudents.length === 0}
                        >
                            {isScheduling ? 'Scheduling...' : 'Schedule Class'}
                        </button>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
};

export default ScheduleClass;
