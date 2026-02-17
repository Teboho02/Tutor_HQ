
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { testService } from '../services/test.service';
import { useAuth } from '../contexts/AuthContext';

interface StudentTestResult {
    id: string;
    title: string;
    subject: string;
    teacher: string;
    scheduledDate: string;
    totalPoints: number;
    score?: number;
    percentage?: number;
    status: string;
    feedback?: string;
    submittedAt?: string;
}

const StudentTestPage: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [testResults, setTestResults] = useState<StudentTestResult[]>([]);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ message, type });
    };
    const hideToast = () => setToast(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!user?.id) return;
            try {
                setLoading(true);
                const response = await testService.getStudentResults(user.id);
                if (response.success && response.data.results) {
                    // Map backend results to StudentTestResult
                    // Backend returns: result.tests (plural, Supabase table name)
                    // with snake_case fields and nested classes.subject
                    const mapped: StudentTestResult[] = response.data.results.map((result: any) => {
                        const test = result.tests;
                        return {
                            id: test.id,
                            title: test.title,
                            subject: test.classes?.subject || 'General',
                            teacher: 'Teacher',
                            scheduledDate: test.scheduled_at || test.due_date || '',
                            totalPoints: test.total_marks || 100,
                            score: result.score,
                            percentage: result.percentage,
                            status: result.status,
                            feedback: result.feedback,
                            submittedAt: result.submitted_at,
                        };
                    });
                    setTestResults(mapped);
                }
            } catch (error: any) {
                showToast(error?.response?.data?.message || 'Failed to load test results', 'error');
                setTestResults([]);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [user]);

    return (
        <div className="student-test-page">
            <Header />
            <div className="student-test-container" style={{ minHeight: '100vh', padding: '120px 20px 40px' }}>
                <h1>My Test Results</h1>
                <p className="subtitle">View your test history, scores, and feedback</p>

                {loading ? (
                    <LoadingSpinner message="Loading test results..." />
                ) : (
                    <>
                        {testResults.length === 0 ? (
                            <div className="empty-state" style={{ textAlign: 'center', marginTop: 40 }}>
                                <span style={{ fontSize: 48 }}>📝</span>
                                <h3>No test results found</h3>
                                <p>You have not completed any tests yet.</p>
                            </div>
                        ) : (
                            <div className="test-results-list" style={{ maxWidth: 900, margin: '0 auto' }}>
                                <table className="test-results-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
                                    <thead>
                                        <tr style={{ background: '#f7fafc' }}>
                                            <th style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>Title</th>
                                            <th style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>Subject</th>
                                            <th style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>Teacher</th>
                                            <th style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>Date</th>
                                            <th style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>Score</th>
                                            <th style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>Status</th>
                                            <th style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>Feedback</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {testResults.map((result) => (
                                            <tr key={result.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: 10 }}>{result.title}</td>
                                                <td style={{ padding: 10 }}>{result.subject}</td>
                                                <td style={{ padding: 10 }}>{result.teacher}</td>
                                                <td style={{ padding: 10 }}>{result.scheduledDate ? new Date(result.scheduledDate).toLocaleDateString() : '-'}</td>
                                                <td style={{ padding: 10, fontWeight: 600 }}>
                                                    {result.score !== undefined ? `${result.score} / ${result.totalPoints}` : '-'}
                                                    {result.percentage !== undefined && (
                                                        <span style={{ marginLeft: 8, color: '#888', fontSize: 13 }}>
                                                            ({Math.round(result.percentage)}%)
                                                        </span>
                                                    )}
                                                </td>
                                                <td style={{ padding: 10 }}>
                                                    {result.status === 'graded' ? (
                                                        <span style={{ color: '#10b981', fontWeight: 600 }}>Graded</span>
                                                    ) : result.status === 'submitted' ? (
                                                        <span style={{ color: '#f59e0b', fontWeight: 600 }}>Submitted</span>
                                                    ) : (
                                                        <span style={{ color: '#888' }}>{result.status}</span>
                                                    )}
                                                </td>
                                                <td style={{ padding: 10 }}>{result.feedback || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
            <Footer />
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
};

export default StudentTestPage;