import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import FileUpload from '../../../components/FileUpload';
import { assignmentService } from '../../../services/assignment.service';
import { useAuth } from '../../../contexts/AuthContext';
import type { NavigationLink } from '../../../types';
import type { Test } from '../../../types/test';
import './SubmitAssignment.css';

const SubmitAssignment: React.FC = () => {
    const { assignmentId } = useParams<{ assignmentId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [assignment, setAssignment] = useState<Test | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/student/dashboard' },
        { label: 'Calendar', href: '/student/calendar' },
        { label: 'Materials', href: '/student/materials' },
        { label: 'Progress', href: '/student/progress' },
        { label: 'Tests', href: '/student/tests' },
        { label: 'Goals', href: '/student/goals' },
    ];

    useEffect(() => {
        const fetchAssignment = async () => {
            if (!assignmentId) return;
            try {
                setLoading(true);
                const response = await assignmentService.getAssignment(assignmentId);
                if (response.success && response.data) {
                    const a = response.data.assignment || response.data;
                    setAssignment({
                        id: a.id || assignmentId,
                        title: a.title || 'Assignment',
                        subject: a.classes?.subject || a.subject || '',
                        description: a.description || a.instructions || '',
                        tutorId: a.tutor_id || '',
                        tutorName: a.tutor_name || '',
                        scheduledDate: a.due_date || a.dueDate || '',
                        scheduledTime: '23:59',
                        duration: 0,
                        totalPoints: a.total_marks || a.totalMarks || 100,
                        questions: [],
                        studentIds: [],
                        status: a.status || 'active',
                        createdAt: a.created_at || '',
                        assignmentType: 'upload',
                        allowedFileTypes: ['.pdf', '.docx', '.doc', '.jpg', '.jpeg', '.png'],
                        maxFileSize: 10,
                        requiresDescription: true,
                    });
                }
            } catch {
                // If assignment fetch fails, show error
                setAssignment(null);
            } finally {
                setLoading(false);
            }
        };
        fetchAssignment();
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

        try {
            // Upload file first if present
            let fileUrl = '';
            if (files.length > 0) {
                const uploadRes = await assignmentService.uploadFile(files[0]);
                if (uploadRes.success) {
                    fileUrl = uploadRes.data.url || uploadRes.data.fileUrl || '';
                }
            }

            // Submit assignment
            const submitRes = await assignmentService.submitAssignment(assignment?.id || '', {
                fileUrl,
                description,
            });

            if (submitRes.success) {
                alert('Assignment submitted successfully!');
                navigate('/student/tests');
            }
        } catch {
            alert('Failed to submit assignment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
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
