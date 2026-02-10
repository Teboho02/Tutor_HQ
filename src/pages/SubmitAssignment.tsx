import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assignmentService } from '../services/assignment.service';
import type { Assignment } from '../services/assignment.service';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';
import './SubmitAssignment.css';

const SubmitAssignment = () => {
    const { assignmentId } = useParams<{ assignmentId: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchAssignment = async () => {
            if (!assignmentId) return;

            try {
                setLoading(true);
                const response = await assignmentService.getAssignment(assignmentId);

                if (response.success) {
                    setAssignment(response.data.assignment);
                }
            } catch (error: unknown) {
                const err = error as { response?: { data?: { error?: string } } };
                showToast(err.response?.data?.error || 'Failed to load assignment', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assignmentId]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            showToast('File size must be less than 10MB', 'error');
            return;
        }

        // Validate file type (PDF, DOC, DOCX, images)
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
            'image/jpg'
        ];

        if (!allowedTypes.includes(file.type)) {
            showToast('Only PDF, DOC, DOCX, and image files are allowed', 'error');
            return;
        }

        setSelectedFile(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile && !description) {
            showToast('Please upload a file or provide a description', 'error');
            return;
        }

        if (!assignmentId) return;

        try {
            setSubmitting(true);

            let fileUrl = '';

            // Upload file if selected
            if (selectedFile) {
                const uploadResponse = await assignmentService.uploadFile(selectedFile);
                if (uploadResponse.success) {
                    fileUrl = uploadResponse.data.fileUrl;
                }
            }

            // Submit assignment
            const response = await assignmentService.submitAssignment(assignmentId, {
                fileUrl,
                description,
            });

            if (response.success) {
                showToast('Assignment submitted successfully!', 'success');
                setTimeout(() => {
                    navigate('/student/assignments');
                }, 2000);
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            showToast(err.response?.data?.error || 'Failed to submit assignment', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getDaysUntilDue = () => {
        if (!assignment) return 0;
        const now = new Date();
        const dueDate = new Date(assignment.due_date);
        const diff = dueDate.getTime() - now.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!assignment) {
        return (
            <div className="submit-assignment">
                <div className="error-message">Assignment not found</div>
            </div>
        );
    }

    const submission = assignment.assignment_submissions?.[0];
    const daysUntilDue = getDaysUntilDue();
    const isOverdue = daysUntilDue < 0;

    return (
        <div className="submit-assignment">
            <div className="assignment-header">
                <button className="back-btn" onClick={() => navigate('/student/assignments')}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Assignments
                </button>
                <h1>{assignment.title}</h1>
                <div className="assignment-info">
                    <span className="class-name">{assignment.classes?.title}</span>
                    <span className="separator">•</span>
                    <span className="subject">{assignment.classes?.subject}</span>
                </div>
            </div>

            <div className="assignment-content">
                <div className="assignment-details-card">
                    <div className="detail-row">
                        <div className="detail-item">
                            <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div>
                                <p className="detail-label">Due Date</p>
                                <p className={`detail-value ${isOverdue ? 'overdue' : ''}`}>
                                    {formatDate(assignment.due_date)}
                                    {isOverdue ? ' (Overdue)' : ` (${daysUntilDue} days left)`}
                                </p>
                            </div>
                        </div>

                        <div className="detail-item">
                            <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <div>
                                <p className="detail-label">Total Marks</p>
                                <p className="detail-value">{assignment.total_marks}</p>
                            </div>
                        </div>

                        {assignment.allow_late_submission && (
                            <div className="detail-item">
                                <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="detail-label">Late Submission</p>
                                    <p className="detail-value">Allowed ({assignment.late_submission_penalty}% penalty)</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {assignment.description && (
                        <div className="description-section">
                            <h3>Description</h3>
                            <p>{assignment.description}</p>
                        </div>
                    )}

                    {assignment.instructions && (
                        <div className="instructions-section">
                            <h3>Instructions</h3>
                            <p>{assignment.instructions}</p>
                        </div>
                    )}
                </div>

                {submission ? (
                    <div className="submission-card">
                        <h2>Your Submission</h2>
                        <div className="submission-details">
                            <p className="submitted-date">
                                Submitted on {formatDate(submission.submitted_at)}
                                {submission.is_late && <span className="late-badge"> (Late)</span>}
                            </p>

                            {submission.file_url && (
                                <div className="file-info">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <a href={submission.file_url} target="_blank" rel="noopener noreferrer">
                                        View Submitted File
                                    </a>
                                </div>
                            )}

                            {submission.description && (
                                <div className="submission-description">
                                    <p><strong>Description:</strong> {submission.description}</p>
                                </div>
                            )}

                            {submission.status === 'graded' ? (
                                <div className="grading-section">
                                    <div className="score-display">
                                        <div className="score-label">Your Score</div>
                                        <div className="score-value">
                                            {submission.score}/{assignment.total_marks}
                                            <span className="percentage">({submission.percentage}%)</span>
                                        </div>
                                    </div>

                                    {submission.feedback && (
                                        <div className="feedback-section">
                                            <h4>Tutor Feedback</h4>
                                            <p>{submission.feedback}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="pending-grading">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p>Awaiting grading from your tutor</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="submission-form-card">
                        <h2>Submit Assignment</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="file-upload" className="file-upload-label">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <span>{selectedFile ? selectedFile.name : 'Choose a file to upload'}</span>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        onChange={handleFileSelect}
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        className="file-input"
                                    />
                                </label>
                                <p className="file-hint">Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Additional Notes (Optional)</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Add any additional notes or comments about your submission..."
                                    rows={5}
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" onClick={() => navigate('/student/assignments')} className="cancel-btn">
                                    Cancel
                                </button>
                                <button type="submit" className="submit-btn" disabled={submitting}>
                                    {submitting ? 'Submitting...' : 'Submit Assignment'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmitAssignment;
