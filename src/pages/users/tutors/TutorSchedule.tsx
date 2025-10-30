import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import TestBuilder from '../../../components/TestBuilder';
import type { NavigationLink } from '../../../types';
import type { Question } from '../../../types/test';
import './TutorSchedule.css';

const TutorSchedule: React.FC = () => {
    const navigate = useNavigate();
    const [scheduleType, setScheduleType] = useState<'liveClass' | 'test' | 'assignment'>('liveClass');
    const [testQuestions, setTestQuestions] = useState<Question[]>([]);
    const [assignmentType, setAssignmentType] = useState<'test' | 'upload' | 'both'>('test');
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        module: '',
        date: '',
        time: '',
        duration: '60',
        description: '',
        // Test/Assignment specific
        dueDate: '',
        totalMarks: '',
        passingMarks: '',
        // File upload settings
        maxFileSize: '10',
        allowedFileTypes: '.pdf,.docx,.doc,.jpg,.jpeg,.png',
        requiresDescription: false,
    });

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/tutor/dashboard' },
        { label: 'My Classes', href: '/tutor/classes' },
        { label: 'Schedule', href: '/tutor/schedule' },
        { label: 'Students', href: '/tutor/students' },
        { label: 'Materials', href: '/tutor/materials' },
        { label: 'Messages', href: '/tutor/messages' },
        { label: 'Account', href: '/tutor/account' },
    ];

    const modules = [
        { id: '1', name: 'Mathematics A', students: 15, color: '#667eea' },
        { id: '2', name: 'Physics B', students: 12, color: '#764ba2' },
        { id: '3', name: 'Chemistry C', students: 18, color: '#f59e0b' },
        { id: '4', name: 'Biology D', students: 14, color: '#10b981' },
        { id: '5', name: 'English E', students: 20, color: '#3b82f6' },
    ];

    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation for tests
        if (scheduleType === 'test' && testQuestions.length === 0) {
            alert('Please add at least one question to the test');
            return;
        }

        // Validation for assignments with test format
        if (scheduleType === 'assignment' && (assignmentType === 'test' || assignmentType === 'both') && testQuestions.length === 0) {
            alert('Please add at least one question to the assignment');
            return;
        }

        // Calculate total points from questions for tests
        const totalPoints = scheduleType === 'test'
            ? testQuestions.reduce((sum, q) => sum + q.points, 0)
            : parseInt(formData.totalMarks);

        // Handle submission based on type
        const submissionData = {
            ...formData,
            scheduleType,
            questions: (scheduleType === 'test' || (scheduleType === 'assignment' && assignmentType !== 'upload')) ? testQuestions : undefined,
            totalPoints: (scheduleType === 'test' || (scheduleType === 'assignment' && assignmentType !== 'upload')) ? totalPoints : undefined,
            assignmentType: scheduleType === 'assignment' ? assignmentType : undefined,
            allowedFileTypes: scheduleType === 'assignment' && (assignmentType === 'upload' || assignmentType === 'both')
                ? formData.allowedFileTypes.split(',')
                : undefined,
            maxFileSize: scheduleType === 'assignment' && (assignmentType === 'upload' || assignmentType === 'both')
                ? parseInt(formData.maxFileSize)
                : undefined,
            requiresDescription: scheduleType === 'assignment' && (assignmentType === 'upload' || assignmentType === 'both')
                ? formData.requiresDescription
                : undefined,
        };

        console.log('Scheduling', scheduleType, submissionData);

        // Here you would make an API call to save the test/assignment/class
        // For now, just show success message
        alert(`${scheduleType === 'liveClass' ? 'Live Class' : scheduleType === 'test' ? 'Test' : 'Assignment'} scheduled successfully!`);
        navigate('/tutor/classes');
    };

    return (
        <div className="tutor-schedule-page">
            <Header navigationLinks={navigationLinks} />

            <div className="schedule-container">
                <div className="page-header">
                    <h1>Schedule New</h1>
                    <p>Create a live class, test, or assignment</p>
                </div>

                {/* Schedule Type Selector */}
                <div className="type-selector">
                    <button
                        className={`type-btn ${scheduleType === 'liveClass' ? 'active' : ''}`}
                        onClick={() => setScheduleType('liveClass')}
                    >
                        <span className="type-icon">📹</span>
                        <span>Live Class</span>
                    </button>
                    <button
                        className={`type-btn ${scheduleType === 'test' ? 'active' : ''}`}
                        onClick={() => setScheduleType('test')}
                    >
                        <span className="type-icon">📝</span>
                        <span>Test</span>
                    </button>
                    <button
                        className={`type-btn ${scheduleType === 'assignment' ? 'active' : ''}`}
                        onClick={() => setScheduleType('assignment')}
                    >
                        <span className="type-icon">📄</span>
                        <span>Assignment</span>
                    </button>
                </div>

                <form className="schedule-form" onSubmit={handleSubmit}>
                    {/* Basic Information */}
                    <div className="form-section">
                        <h2>Basic Information</h2>

                        <div className="form-group">
                            <label htmlFor="title">Title *</label>
                            <input
                                type="text"
                                id="title"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder={`e.g., ${scheduleType === 'liveClass' ? 'Advanced Calculus - Integration' : scheduleType === 'test' ? 'Midterm Exam' : 'Chapter 5 Problems'}`}
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

                            {scheduleType === 'liveClass' && (
                                <div className="form-group">
                                    <label htmlFor="duration">Duration *</label>
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
                            )}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="date">{scheduleType === 'liveClass' ? 'Date' : 'Start Date'} *</label>
                                <input
                                    type="date"
                                    id="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>

                            {scheduleType === 'liveClass' ? (
                                <div className="form-group">
                                    <label htmlFor="time">Time *</label>
                                    <input
                                        type="time"
                                        id="time"
                                        required
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label htmlFor="dueDate">Due Date *</label>
                                    <input
                                        type="date"
                                        id="dueDate"
                                        required
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>

                        {scheduleType !== 'liveClass' && (
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="totalMarks">Total Marks *</label>
                                    <input
                                        type="number"
                                        id="totalMarks"
                                        required
                                        value={formData.totalMarks}
                                        onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                                        placeholder="e.g., 100"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="passingMarks">Passing Marks *</label>
                                    <input
                                        type="number"
                                        id="passingMarks"
                                        required
                                        value={formData.passingMarks}
                                        onChange={(e) => setFormData({ ...formData, passingMarks: e.target.value })}
                                        placeholder="e.g., 40"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder={`Add ${scheduleType === 'liveClass' ? 'class topics and objectives' : scheduleType === 'test' ? 'test instructions and topics covered' : 'assignment instructions and requirements'}...`}
                            />
                        </div>
                    </div>

                    {/* Assignment Type Selector - Only for Assignments */}
                    {scheduleType === 'assignment' && (
                        <div className="form-section">
                            <h3>Assignment Format</h3>
                            <div className="assignment-type-selector">
                                <label className="assignment-type-option">
                                    <input
                                        type="radio"
                                        name="assignmentType"
                                        value="test"
                                        checked={assignmentType === 'test'}
                                        onChange={(e) => setAssignmentType(e.target.value as 'test' | 'upload' | 'both')}
                                    />
                                    <div className="option-content">
                                        <span className="option-icon">📝</span>
                                        <div className="option-text">
                                            <strong>Test Format</strong>
                                            <p>Students answer questions online</p>
                                        </div>
                                    </div>
                                </label>

                                <label className="assignment-type-option">
                                    <input
                                        type="radio"
                                        name="assignmentType"
                                        value="upload"
                                        checked={assignmentType === 'upload'}
                                        onChange={(e) => setAssignmentType(e.target.value as 'test' | 'upload' | 'both')}
                                    />
                                    <div className="option-content">
                                        <span className="option-icon">📤</span>
                                        <div className="option-text">
                                            <strong>File Upload</strong>
                                            <p>Students upload document files</p>
                                        </div>
                                    </div>
                                </label>

                                <label className="assignment-type-option">
                                    <input
                                        type="radio"
                                        name="assignmentType"
                                        value="both"
                                        checked={assignmentType === 'both'}
                                        onChange={(e) => setAssignmentType(e.target.value as 'test' | 'upload' | 'both')}
                                    />
                                    <div className="option-content">
                                        <span className="option-icon">📋</span>
                                        <div className="option-text">
                                            <strong>Both</strong>
                                            <p>Answer questions and upload files</p>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* File Upload Settings - Only for Upload Assignments */}
                    {scheduleType === 'assignment' && (assignmentType === 'upload' || assignmentType === 'both') && (
                        <div className="form-section">
                            <h3>File Upload Settings</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="maxFileSize">Max File Size (MB)</label>
                                    <input
                                        type="number"
                                        id="maxFileSize"
                                        value={formData.maxFileSize}
                                        onChange={(e) => setFormData({ ...formData, maxFileSize: e.target.value })}
                                        min="1"
                                        max="50"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="allowedFileTypes">Allowed File Types</label>
                                    <input
                                        type="text"
                                        id="allowedFileTypes"
                                        value={formData.allowedFileTypes}
                                        onChange={(e) => setFormData({ ...formData, allowedFileTypes: e.target.value })}
                                        placeholder=".pdf,.docx,.jpg"
                                    />
                                    <small>Comma-separated file extensions (e.g., .pdf,.docx,.jpg)</small>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.requiresDescription}
                                        onChange={(e) => setFormData({ ...formData, requiresDescription: e.target.checked })}
                                    />
                                    <span>Require text description with file upload</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Test Builder - For Tests and Test-Format Assignments */}
                    {(scheduleType === 'test' || (scheduleType === 'assignment' && (assignmentType === 'test' || assignmentType === 'both'))) && (
                        <div className="form-section">
                            <TestBuilder
                                onQuestionsChange={setTestQuestions}
                                initialQuestions={testQuestions}
                            />
                        </div>
                    )}

                    {/* Select Module */}
                    <div className="form-section">
                        <h2>Select Module</h2>
                        <p className="section-description">Choose a module to automatically include all enrolled students</p>
                        <div className="modules-grid">
                            {modules.map(module => (
                                <div
                                    key={module.id}
                                    className={`module-card ${formData.module === module.id ? 'selected' : ''}`}
                                    onClick={() => setFormData({ ...formData, module: module.id })}
                                >
                                    <div className="module-icon" style={{ background: module.color }}>
                                        �
                                    </div>
                                    <div className="module-info">
                                        <h4>{module.name}</h4>
                                        <p>{module.students} students enrolled</p>
                                    </div>
                                    {formData.module === module.id && (
                                        <div className="selected-badge">✓</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="form-actions">
                        <button type="button" className="btn btn-outline" onClick={() => navigate('/tutor/classes')}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!formData.module}
                        >
                            Schedule {scheduleType === 'liveClass' ? 'Class' : scheduleType === 'test' ? 'Test' : 'Assignment'}
                        </button>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
};

export default TutorSchedule;
