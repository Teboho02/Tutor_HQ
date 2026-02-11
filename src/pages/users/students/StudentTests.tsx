import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Toast from '../../../components/Toast';
import { testService } from '../../../services/test.service';
import { useAuth } from '../../../contexts/AuthContext';
import type { NavigationLink } from '../../../types';
import './StudentTests.css';

interface TestItem {
    id: string;
    title: string;
    subject: string;
    teacher: string;
    scheduledDate: string;
    scheduledTime: string;
    duration: number;
    totalPoints: number;
    status: 'upcoming' | 'available' | 'completed';
    score?: number;
    submittedAt?: string;
    type: 'test' | 'assignment';
    allowRetakes?: boolean;
    maxRetakes?: number;
    retakeHistory?: TestRetake[];
}

interface TestRetake {
    attempt: number;
    score: number;
    date: string;
    time?: string;
}

const StudentTests: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'available' | 'completed'>('all');
    const [expandedTestId, setExpandedTestId] = useState<string | null>(null);
    const [tests, setTests] = useState<TestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ message, type });
    };

    const hideToast = () => setToast(null);

    useEffect(() => {
        const fetchTests = async () => {
            if (!user?.id) return;

            try {
                setLoading(true);
                const response = await testService.getStudentResults(user.id);

                if (response.success && response.data.results) {
                    // Transform backend data to match TestItem interface
                    interface TestResult {
                        test: {
                            id: string;
                            title: string;
                            subject?: string;
                            tutorName?: string;
                            scheduledAt?: string;
                            dueDate?: string;
                            duration?: number;
                            totalMarks?: number;
                        };
                        status: string;
                        score?: number;
                        submittedAt?: string;
                    }
                    const transformedTests: TestItem[] = response.data.results.map((result: TestResult) => ({
                        id: result.test.id,
                        title: result.test.title,
                        subject: result.test.subject || 'General',
                        teacher: result.test.tutorName || 'Teacher',
                        scheduledDate: result.test.scheduledAt || result.test.dueDate || '',
                        scheduledTime: new Date(result.test.scheduledAt || result.test.dueDate || '').toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                        duration: result.test.duration || 60,
                        totalPoints: result.test.totalMarks || 100,
                        status: result.status === 'graded' ? 'completed' : result.status === 'submitted' ? 'completed' : 'available',
                        score: result.score,
                        submittedAt: result.submittedAt,
                        type: 'test',
                        allowRetakes: false,
                        maxRetakes: 0,
                    }));
                    setTests(transformedTests);
                }
            } catch (error: unknown) {
                const err = error as { response?: { data?: { message?: string } } };
                showToast(err.response?.data?.message || 'Failed to load tests', 'error');
                setTests([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTests();
    }, [user?.id]);

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/student/dashboard' },
        { label: 'Calendar', href: '/student/calendar' },
        { label: 'Materials', href: '/student/materials' },
        { label: 'Progress', href: '/student/progress' },
        { label: 'Tests', href: '/student/tests' },
        { label: 'Goals', href: '/student/goals' },
    ];

    const filteredTests = filter === 'all'
        ? tests
        : tests.filter(test => test.status === filter);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'upcoming':
                return <span className="status-badge upcoming">📅 Upcoming</span>;
            case 'available':
                return <span className="status-badge available">✅ Available Now</span>;
            case 'completed':
                return <span className="status-badge completed">✓ Completed</span>;
            default:
                return null;
        }
    };

    const getTypeIcon = (type: string) => {
        return type === 'test' ? '📝' : '📄';
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    };

    const handleTestClick = (test: TestItem) => {
        if (test.status === 'completed') {
            // Navigate to test results page
            navigate(`/student/test-results/${test.id}`);
        } else if (test.status === 'available') {
            // Check if it's an assignment with upload
            if (test.type === 'assignment') {
                // For assignments, navigate to submit page
                navigate(`/student/submit-assignment/${test.id}`);
            } else {
                // For tests, navigate to take test page
                navigate(`/student/take-test/${test.id}`);
            }
        } else {
            // Upcoming - show alert
            alert(`This ${test.type} is not yet available. It will be available on ${formatDate(test.scheduledDate)} at ${test.scheduledTime}`);
        }
    };

    const getScoreColor = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 80) return '#10b981';
        if (percentage >= 60) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="student-tests-page">
            <Header navigationLinks={navigationLinks} />

            <div className="tests-container">
                <div className="page-header">
                    <h1>My Tests & Assignments</h1>
                    <p>Track your upcoming tests and review completed work</p>
                </div>

                {/* Filter Tabs */}
                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({tests.length})
                    </button>
                    <button
                        className={`filter-tab ${filter === 'available' ? 'active' : ''}`}
                        onClick={() => setFilter('available')}
                    >
                        Available Now ({tests.filter(t => t.status === 'available').length})
                    </button>
                    <button
                        className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setFilter('upcoming')}
                    >
                        Upcoming ({tests.filter(t => t.status === 'upcoming').length})
                    </button>
                    <button
                        className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
                        onClick={() => setFilter('completed')}
                    >
                        Completed ({tests.filter(t => t.status === 'completed').length})
                    </button>
                </div>

                {loading && (
                    <div className="loading-state">
                        <div className="spinner">⏳</div>
                        <p>Loading tests...</p>
                    </div>
                )}

                {!loading && (
                    <>
                        {/* Tests Grid */}
                        <div className="tests-grid">
                            {filteredTests.length > 0 ? (
                                filteredTests.map(test => (
                                    <div key={test.id}>
                                        <div
                                            className={`test-card ${test.status}`}
                                            onClick={() => handleTestClick(test)}
                                        >
                                            <div className="test-card-header">
                                                <div className="test-icon">{getTypeIcon(test.type)}</div>
                                                {getStatusBadge(test.status)}
                                            </div>

                                            <div className="test-card-body">
                                                <h3>{test.title}</h3>
                                                <div className="test-meta">
                                                    <span className="test-subject">{test.subject}</span>
                                                    <span className="test-teacher">👨‍🏫 {test.teacher}</span>
                                                </div>

                                                <div className="test-details">
                                                    <div className="detail-item">
                                                        <span className="detail-label">📅 Date:</span>
                                                        <span className="detail-value">{formatDate(test.scheduledDate)}</span>
                                                    </div>
                                                    {test.duration > 0 && (
                                                        <div className="detail-item">
                                                            <span className="detail-label">⏱️ Duration:</span>
                                                            <span className="detail-value">{test.duration} min</span>
                                                        </div>
                                                    )}
                                                    <div className="detail-item">
                                                        <span className="detail-label">📊 Points:</span>
                                                        <span className="detail-value">{test.totalPoints}</span>
                                                    </div>
                                                </div>

                                                {test.status === 'completed' && test.score !== undefined && (
                                                    <div className="test-score">
                                                        <div className="score-display" style={{ color: getScoreColor(test.score, test.totalPoints) }}>
                                                            <span className="score">{test.score}</span>
                                                            <span className="separator">/</span>
                                                            <span className="total">{test.totalPoints}</span>
                                                        </div>
                                                        <div className="score-percentage">
                                                            {Math.round((test.score / test.totalPoints) * 100)}%
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="test-card-footer">
                                                {test.status === 'available' && (
                                                    <span className="action-text">🎯 Click to start {test.type}</span>
                                                )}
                                                {test.status === 'upcoming' && (
                                                    <span className="action-text">⏳ Available on {formatDate(test.scheduledDate)}</span>
                                                )}
                                                {test.status === 'completed' && test.allowRetakes && (
                                                    <span className="action-text">👁️ View results • 🔄 Retake available</span>
                                                )}
                                                {test.status === 'completed' && !test.allowRetakes && (
                                                    <span className="action-text">👁️ View results</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Retake History and Options */}
                                        {test.status === 'completed' && test.allowRetakes && (
                                            <div className="retake-section">
                                                <button
                                                    className="retake-toggle"
                                                    onClick={() => setExpandedTestId(expandedTestId === test.id ? null : test.id)}
                                                >
                                                    {expandedTestId === test.id ? '▼' : '▶'} Retake History & Options
                                                </button>

                                                {expandedTestId === test.id && (
                                                    <div className="retake-content">
                                                        {test.retakeHistory && test.retakeHistory.length > 0 && (
                                                            <div className="retake-history">
                                                                <h4>Attempt History</h4>
                                                                <div className="attempts-list">
                                                                    {test.retakeHistory.map((attempt) => (
                                                                        <div key={attempt.attempt} className="attempt-item">
                                                                            <div className="attempt-badge">Attempt {attempt.attempt}</div>
                                                                            <div className="attempt-info">
                                                                                <div className="attempt-score">
                                                                                    <strong>{attempt.score}/{test.totalPoints}</strong>
                                                                                    ({Math.round((attempt.score / test.totalPoints) * 100)}%)
                                                                                </div>
                                                                                <div className="attempt-date">📅 {attempt.date} {attempt.time && `at ${attempt.time}`}</div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="retake-info">
                                                            <p>
                                                                <strong>Retakes allowed:</strong> {test.maxRetakes ? `${test.retakeHistory?.length || 0}/${test.maxRetakes}` : 'Unlimited'}
                                                            </p>
                                                            {test.maxRetakes && test.retakeHistory && test.retakeHistory.length < test.maxRetakes && (
                                                                <button
                                                                    className="btn btn-primary"
                                                                    onClick={() => {
                                                                        if (test.type === 'assignment') {
                                                                            navigate(`/student/submit-assignment/${test.id}?retake=true`);
                                                                        } else {
                                                                            navigate(`/student/take-test/${test.id}?retake=true`);
                                                                        }
                                                                    }}
                                                                >
                                                                    🔄 Retake This {test.type === 'test' ? 'Test' : 'Assignment'}
                                                                </button>
                                                            )}
                                                            {test.maxRetakes && test.retakeHistory && test.retakeHistory.length >= test.maxRetakes && (
                                                                <div className="no-retakes-message">
                                                                    ⚠️ Maximum retakes ({test.maxRetakes}) reached
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-icon">📝</div>
                                    <h3>No {filter !== 'all' ? filter : ''} tests or assignments</h3>
                                    <p>You're all caught up!</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <Footer />
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
};

export default StudentTests;
