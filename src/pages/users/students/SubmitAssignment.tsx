import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import FileUpload from '../../../components/FileUpload';
import type { NavigationLink } from '../../../types';
import type { Test } from '../../../types/test';
import './SubmitAssignment.css';

const SubmitAssignment: React.FC = () => {
    const { assignmentId } = useParams<{ assignmentId: string }>();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState<Test | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/student/dashboard' },
        { label: 'Calendar', href: '/student/calendar' },
        { label: 'Materials', href: '/student/materials' },
        { label: 'Progress', href: '/student/progress' },
        { label: 'Tests', href: '/student/tests' },
        { label: 'Goals', href: '/student/goals' },
    ];

    useEffect(() => {
        // In production, fetch assignment from API: GET /api/assignments/${assignmentId}
        const mockAssignment: Test = {
            id: assignmentId || '1',
            title: 'Research Paper on Climate Change',
            subject: 'Environmental Science',
            description: 'Write a comprehensive research paper (5-10 pages) on the impact of climate change on ocean ecosystems. Include at least 5 peer-reviewed sources.',
            tutorId: '1',
            tutorName: 'Dr. Johnson',
            scheduledDate: '2025-11-15',
            scheduledTime: '23:59',
            duration: 0,
            totalPoints: 100,
            questions: [],
            studentIds: ['student1'],
            status: 'active',
            createdAt: '2025-10-25',
            assignmentType: 'upload',
            allowedFileTypes: ['.pdf', '.docx', '.doc'],
            maxFileSize: 10,
            requiresDescription: true,
        };

        setAssignment(mockAssignment);
    }, [assignmentId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (assignment?.requiresDescription && !description.trim()) {
            alert('Please provide a description for your submission');
            return;
        }

        if (files.length === 0) {
            alert('Please upload at least one file');
            return;
        }

        const confirmSubmit = window.confirm(
            'Are you sure you want to submit? You cannot change your submission after submitting.'
        );

        if (!confirmSubmit) return;

        setIsSubmitting(true);

        // In production, upload files and submit
        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append(`file${index}`, file);
        });
        formData.append('description', description);
        formData.append('assignmentId', assignment?.id || '');
        formData.append('studentId', 'student1'); // Get from auth context

        console.log('Submitting assignment:', {
            assignmentId: assignment?.id,
            filesCount: files.length,
            description,
        });

        // Simulate API call
        setTimeout(() => {
            alert('Assignment submitted successfully!');
            navigate('/student/tests');
        }, 1000);
    };

    if (!assignment) {
        return (
            <div className="submit-assignment-page">
                <Header navigationLinks={navigationLinks} />
                <div className="loading-container">
                    <div className="loading-spinner">⏳</div>
                    <p>Loading assignment...</p>
                </div>
                <Footer />
            </div>
        );
    }

    const dueDate = new Date(assignment.scheduledDate + ' ' + assignment.scheduledTime);
    const now = new Date();
    const isOverdue = now > dueDate;
    const timeRemaining = dueDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

    return (
        <div className="submit-assignment-page">
            <Header navigationLinks={navigationLinks} />

            <div className="assignment-container">
                {/* Assignment Header */}
                <div className="assignment-header">
                    <div className="assignment-info">
                        <h1>{assignment.title}</h1>
                        <p>{assignment.subject} • {assignment.tutorName}</p>
                    </div>
                    <div className={`due-date ${isOverdue ? 'overdue' : daysRemaining <= 3 ? 'urgent' : ''}`}>
                        <span className="due-icon">📅</span>
                        <div className="due-info">
                            <span className="due-label">Due Date</span>
                            <span className="due-value">
                                {new Date(assignment.scheduledDate).toLocaleDateString('en-ZA', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </span>
                            {!isOverdue && daysRemaining > 0 && (
                                <span className="days-remaining">{daysRemaining} days left</span>
                            )}
                            {isOverdue && <span className="overdue-text">Overdue</span>}
                        </div>
                    </div>
                </div>

                {/* Assignment Description */}
                <div className="assignment-description">
                    <h3>Instructions</h3>
                    <p>{assignment.description}</p>
                    <div className="assignment-details">
                        <div className="detail-item">
                            <span className="detail-label">Total Points:</span>
                            <span className="detail-value">{assignment.totalPoints}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Allowed File Types:</span>
                            <span className="detail-value">{assignment.allowedFileTypes?.join(', ') || 'Any'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Max File Size:</span>
                            <span className="detail-value">{assignment.maxFileSize}MB per file</span>
                        </div>
                    </div>
                </div>

                {/* Submission Form */}
                <form onSubmit={handleSubmit} className="submission-form">
                    {/* File Upload */}
                    <div className="form-section">
                        <h3>Upload Files *</h3>
                        <FileUpload
                            allowedTypes={assignment.allowedFileTypes}
                            maxFileSize={assignment.maxFileSize}
                            maxFiles={5}
                            onFilesChange={setFiles}
                        />
                    </div>

                    {/* Description (if required) */}
                    {assignment.requiresDescription && (
                        <div className="form-section">
                            <h3>Description *</h3>
                            <textarea
                                className="description-input"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Provide a brief description of your submission..."
                                rows={6}
                                required
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => navigate('/student/tests')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting || files.length === 0}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                        </button>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
};

export default SubmitAssignment;
