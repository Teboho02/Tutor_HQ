import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Toast from '../../../components/Toast';
import TestBuilder from '../../../components/TestBuilder';
import CalendarPicker from '../../../components/CalendarPicker';
import { classService } from '../../../services/class.service';
import { testService } from '../../../services/test.service';
import type { NavigationLink } from '../../../types';
import type { Question } from '../../../types/test';
import './TutorSchedule.css';

interface Module {
    id: string;
    name: string;
    subject: string;
    students: number;
    color: string;
}

// Helper: today's date in YYYY-MM-DD format
const getToday = () => new Date().toISOString().split('T')[0];

const TutorSchedule: React.FC = () => {
    const navigate = useNavigate();
    const [scheduleType, setScheduleType] = useState<'liveClass' | 'test' | 'assignment'>('liveClass');
    const [testQuestions, setTestQuestions] = useState<Question[]>([]);
    const [assignmentType, setAssignmentType] = useState<'test' | 'upload' | 'both'>('test');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        module: '',
        date: getToday(),
        time: '',
        duration: '60',
        description: '',
        classLink: '',
        // Test/Assignment specific
        dueDate: getToday(),
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
        { label: 'Account', href: '/tutor/account' },
    ];

    const [modules, setModules] = useState<Module[]>([]);

    const moduleColors = ['#667eea', '#764ba2', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'];

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await classService.listClasses();
                if (response.success && response.data.classes) {
                    const fetched: Module[] = response.data.classes.map((c: { id: string; title: string; subject?: string; enrollmentCount?: number }, i: number) => ({
                        id: c.id,
                        name: c.title,
                        subject: c.subject || '',
                        students: c.enrollmentCount || 0,
                        color: moduleColors[i % moduleColors.length],
                    }));
                    setModules(fetched);
                }
            } catch {
                // Modules will remain empty
            }
        };
        fetchModules();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ message, type });
    };

    const hideToast = () => setToast(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation for tests
        if (scheduleType === 'test' && testQuestions.length === 0) {
            showToast('Please add at least one question to the test', 'error');
            return;
        }

        // Validation for assignments with test format
        if (scheduleType === 'assignment' && (assignmentType === 'test' || assignmentType === 'both') && testQuestions.length === 0) {
            showToast('Please add at least one question to the assignment', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            if (scheduleType === 'liveClass') {
                // Create a live class
                const classData = {
                    title: formData.title,
                    description: formData.description,
                    subject: formData.subject,
                    scheduledAt: `${formData.date}T${formData.time}`,
                    durationMinutes: parseInt(formData.duration),
                    meetingLink: formData.classLink,
                    sourceClassId: formData.module, // Copy students from the selected module
                };

                await classService.createClass(classData);
                showToast('Live class scheduled successfully!', 'success');
            } else if (scheduleType === 'test') {
                // Create a test
                const totalPoints = testQuestions.reduce((sum, q) => sum + q.points, 0);
                // Transform questions to match CreateTestData type requirements
                const formattedQuestions = testQuestions.map(q => ({
                    id: q.id,
                    type: q.type as string,
                    content: { text: q.content.text || '', image: q.content.image },
                    points: q.points,
                    options: q.options?.map(opt => ({
                        id: opt.id,
                        text: opt.text || '',
                        isCorrect: opt.isCorrect,
                    })),
                    correctAnswer: Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer,
                }));
                // Build valid timestamps — time input is only shown for liveClass,
                // so default to 09:00 for the start and 23:59 for the due date
                const startTime = formData.time || '09:00';
                const testData = {
                    title: formData.title,
                    description: formData.description,
                    classId: formData.module, // Using module as classId
                    totalMarks: totalPoints,
                    passingMarks: parseInt(formData.passingMarks) || Math.floor(totalPoints * 0.5),
                    scheduledAt: `${formData.date}T${startTime}:00`,
                    dueDate: formData.dueDate ? `${formData.dueDate}T23:59:59` : undefined,
                    questions: formattedQuestions,
                };

                await testService.createTest(testData);
                showToast('Test created successfully!', 'success');
            } else {
                // Assignment - not yet implemented in backend
                showToast('Assignment creation coming soon!', 'info');
            }

            // Navigate back to classes after a short delay
            setTimeout(() => navigate('/tutor/classes'), 1500);
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            showToast(axiosError.response?.data?.message || 'Failed to schedule. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
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
                    {/* Select Module — primary selection */}
                    <div className="form-section">
                        <h2>Select Module / Class *</h2>
                        <p className="section-description">Choose a module to automatically include all enrolled students</p>
                        <div className="modules-grid">
                            {modules.map(module => (
                                <div
                                    key={module.id}
                                    className={`module-card ${formData.module === module.id ? 'selected' : ''}`}
                                    onClick={() => setFormData({ ...formData, module: module.id, subject: module.subject })}
                                >
                                    <div className="module-icon" style={{ background: module.color }}>
                                        📚
                                    </div>
                                    <div className="module-info">
                                        <h4>{module.name}</h4>
                                        <p>{module.subject} • {module.students} students enrolled</p>
                                    </div>
                                    {formData.module === module.id && (
                                        <div className="selected-badge">✓</div>
                                    )}
                                </div>
                            ))}
                            {modules.length === 0 && (
                                <p className="no-modules-msg">No classes found. Create a class first in the <a href="/tutor/onboarding">Manage Students & Classes</a> page.</p>
                            )}
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="form-section">
                        <h2>Details</h2>

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

                        {scheduleType === 'liveClass' && (
                            <div className="form-row">
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
                            </div>
                        )}

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="date">{scheduleType === 'liveClass' ? 'Date' : 'Start Date'} *</label>
                                <CalendarPicker
                                    id="date"
                                    required
                                    min={getToday()}
                                    value={formData.date}
                                    onChange={(val) => setFormData({ ...formData, date: val })}
                                    placeholder="Select date"
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
                                    <CalendarPicker
                                        id="dueDate"
                                        required
                                        min={getToday()}
                                        value={formData.dueDate}
                                        onChange={(val) => setFormData({ ...formData, dueDate: val })}
                                        placeholder="Select due date"
                                    />
                                </div>
                            )}
                        </div>

                        {scheduleType === 'liveClass' && (
                            <div className="form-group">
                                <label htmlFor="classLink">Live Class Link * (Zoom, Google Meet, or Custom)</label>
                                <input
                                    type="url"
                                    id="classLink"
                                    required
                                    value={formData.classLink}
                                    onChange={(e) => setFormData({ ...formData, classLink: e.target.value })}
                                    placeholder="e.g., https://meet.google.com/abc-defg-hij or https://zoom.us/j/123456789"
                                />
                                <small>This link will be shared with all students in the module for the live class</small>
                            </div>
                        )}

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

                    {/* Submit */}
                    <div className="form-actions">
                        <button type="button" className="btn btn-outline" onClick={() => navigate('/tutor/classes')}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!formData.module || isSubmitting}
                            title={!formData.module ? 'Please select a module first' : ''}
                        >
                            {isSubmitting ? 'Scheduling...' : `Schedule ${scheduleType === 'liveClass' ? 'Class' : scheduleType === 'test' ? 'Test' : 'Assignment'}`}
                        </button>
                        {!formData.module && (
                            <p className="form-hint" style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                ⚠ Please select a module/class above before submitting
                            </p>
                        )}
                    </div>
                </form>
            </div>

            <Footer />
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
};

export default TutorSchedule;
