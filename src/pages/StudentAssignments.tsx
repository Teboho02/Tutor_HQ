import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assignmentService } from '../services/assignment.service';
import type { Assignment } from '../services/assignment.service';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';
import './StudentAssignments.css';

type FilterType = 'all' | 'pending' | 'submitted' | 'graded';

const StudentAssignments = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
    const [filter, setFilter] = useState<FilterType>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignments = async () => {
            if (!user?.id) return;

            try {
                setLoading(true);
                const response = await assignmentService.getStudentAssignments(user.id);

                if (response.success) {
                    setAssignments(response.data.assignments);
                    setFilteredAssignments(response.data.assignments);
                }
            } catch (error: unknown) {
                const err = error as { response?: { data?: { error?: string } } };
                showToast(err.response?.data?.error || 'Failed to load assignments', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        const now = new Date();
        const filtered = assignments.filter((assignment) => {
            const submission = assignment.assignment_submissions?.[0];
            const dueDate = new Date(assignment.due_date);

            switch (filter) {
                case 'pending':
                    return !submission && dueDate > now;
                case 'submitted':
                    return submission && submission.status === 'submitted';
                case 'graded':
                    return submission && submission.status === 'graded';
                case 'all':
                default:
                    return true;
            }
        });
        setFilteredAssignments(filtered);
    }, [filter, assignments]);

    const getStatusBadge = (assignment: Assignment) => {
        const submission = assignment.assignment_submissions?.[0];
        const now = new Date();
        const dueDate = new Date(assignment.due_date);

        if (!submission) {
            if (dueDate < now) {
                return <span className="status-badge overdue">Overdue</span>;
            }
            return <span className="status-badge pending">Pending</span>;
        }

        if (submission.status === 'graded') {
            return <span className="status-badge graded">Graded</span>;
        }

        return <span className="status-badge submitted">Submitted</span>;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleViewAssignment = (assignmentId: string) => {
        navigate(`/student/assignments/${assignmentId}`);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="student-assignments">
            <div className="assignments-header">
                <h1>My Assignments</h1>
                <p className="subtitle">View and submit your class assignments</p>
            </div>

            <div className="filter-tabs">
                <button
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => setFilter('all')}
                >
                    All ({assignments.length})
                </button>
                <button
                    className={filter === 'pending' ? 'active' : ''}
                    onClick={() => setFilter('pending')}
                >
                    Pending ({assignments.filter(a => !a.assignment_submissions?.[0] && new Date(a.due_date) > new Date()).length})
                </button>
                <button
                    className={filter === 'submitted' ? 'active' : ''}
                    onClick={() => setFilter('submitted')}
                >
                    Submitted ({assignments.filter(a => a.assignment_submissions?.[0]?.status === 'submitted').length})
                </button>
                <button
                    className={filter === 'graded' ? 'active' : ''}
                    onClick={() => setFilter('graded')}
                >
                    Graded ({assignments.filter(a => a.assignment_submissions?.[0]?.status === 'graded').length})
                </button>
            </div>

            {filteredAssignments.length === 0 ? (
                <div className="empty-state">
                    <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3>No assignments found</h3>
                    <p>You don't have any {filter !== 'all' ? filter : ''} assignments yet.</p>
                </div>
            ) : (
                <div className="assignments-grid">
                    {filteredAssignments.map((assignment) => {
                        const submission = assignment.assignment_submissions?.[0];
                        const dueDate = new Date(assignment.due_date);
                        const now = new Date();
                        const isOverdue = dueDate < now && !submission;

                        return (
                            <div key={assignment.id} className={`assignment-card ${isOverdue ? 'overdue-card' : ''}`}>
                                <div className="card-header">
                                    <h3>{assignment.title}</h3>
                                    {getStatusBadge(assignment)}
                                </div>

                                <div className="card-body">
                                    <p className="assignment-description">{assignment.description || 'No description provided'}</p>

                                    <div className="assignment-meta">
                                        <div className="meta-item">
                                            <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                            <span>{assignment.classes?.subject || 'General'}</span>
                                        </div>

                                        <div className="meta-item">
                                            <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className={isOverdue ? 'overdue-text' : ''}>
                                                Due: {formatDate(assignment.due_date)}
                                            </span>
                                        </div>

                                        <div className="meta-item">
                                            <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <span>{assignment.total_marks} marks</span>
                                        </div>
                                    </div>

                                    {submission && (
                                        <div className="submission-info">
                                            {submission.status === 'graded' ? (
                                                <>
                                                    <div className="score-display">
                                                        <span className="score">{submission.score}/{assignment.total_marks}</span>
                                                        <span className="percentage">({submission.percentage}%)</span>
                                                    </div>
                                                    {submission.feedback && (
                                                        <p className="feedback">{submission.feedback}</p>
                                                    )}
                                                </>
                                            ) : (
                                                <p className="submitted-text">
                                                    Submitted on {formatDate(submission.submitted_at)}
                                                    {submission.is_late && <span className="late-badge"> (Late)</span>}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="card-footer">
                                    <button
                                        className="view-btn"
                                        onClick={() => handleViewAssignment(assignment.id)}
                                    >
                                        {submission ? 'View Submission' : 'Submit Assignment'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StudentAssignments;
