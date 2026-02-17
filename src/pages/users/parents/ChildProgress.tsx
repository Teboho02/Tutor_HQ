import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useToast } from '../../../components/Toast';
import { parentService } from '../../../services/parent.service';
import { testService } from '../../../services/test.service';
import { assignmentService } from '../../../services/assignment.service';
import type { NavigationLink } from '../../../types';
import './ChildProgress.css';

interface ClassInfo {
    classId: string;
    title: string;
    subject: string;
    scheduledAt: string;
    duration: number;
    status: string;
    attendanceStatus: string;
    enrolledAt: string;
}

interface TestResultInfo {
    id: string;
    testTitle: string;
    subject: string;
    score: number;
    totalMarks: number;
    percentage: number;
    status: string;
    submittedAt: string;
    gradedAt: string | null;
    feedback: string | null;
}

interface AssignmentInfo {
    id: string;
    title: string;
    subject: string;
    totalMarks: number;
    dueDate: string;
    submission: {
        score: number | null;
        percentage: number | null;
        status: string;
        isLate: boolean;
        submittedAt: string;
        gradedAt: string | null;
        feedback: string | null;
    } | null;
}

interface ChildInfo {
    fullName: string;
    gradeLevel: string;
    avatar: string;
}

interface PerformanceStats {
    averageGrade: number | null;
    testAverage: number | null;
    assignmentAverage: number | null;
    completedTests: number;
    totalTests: number;
    pendingAssignments: number;
}

const ChildProgress: React.FC = () => {
    const { childId } = useParams<{ childId: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'subjects' | 'attendance'>('overview');
    const [loading, setLoading] = useState(true);
    const [childInfo, setChildInfo] = useState<ChildInfo>({ fullName: '', gradeLevel: '', avatar: '' });
    const [classes, setClasses] = useState<ClassInfo[]>([]);
    const [testResults, setTestResults] = useState<TestResultInfo[]>([]);
    const [assignments, setAssignments] = useState<AssignmentInfo[]>([]);
    const [perfStats, setPerfStats] = useState<PerformanceStats>({
        averageGrade: null, testAverage: null, assignmentAverage: null,
        completedTests: 0, totalTests: 0, pendingAssignments: 0
    });

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/parent/dashboard' },
        { label: 'Schedule', href: '/parent/schedule' },
        { label: 'Account', href: '/parent/account' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            if (!childId) return;
            try {
                setLoading(true);
                // Fetch children list to get this child's name
                const childrenRes = await parentService.getChildren();
                if (childrenRes.success) {
                    const thisChild = childrenRes.data.children.find((c: { id: string }) => c.id === childId);
                    if (thisChild) {
                        setChildInfo({
                            fullName: thisChild.fullName,
                            gradeLevel: thisChild.gradeLevel || 'N/A',
                            avatar: thisChild.avatar || '',
                        });
                    }
                }

                // Fetch child performance (has enrolled classes + attendance + tests + assignments)
                const perfRes = await parentService.getChildPerformance(childId);
                if (perfRes.success) {
                    setClasses(perfRes.data.classes || []);
                    setTestResults(perfRes.data.testResults || []);
                    setAssignments(perfRes.data.assignments || []);
                    setPerfStats({
                        averageGrade: perfRes.data.averageGrade,
                        testAverage: perfRes.data.testAverage,
                        assignmentAverage: perfRes.data.assignmentAverage,
                        completedTests: perfRes.data.completedTests || 0,
                        totalTests: perfRes.data.totalTests || 0,
                        pendingAssignments: perfRes.data.pendingAssignments || 0,
                    });
                }

                // If parent endpoint didn't return test/assignment data, try direct endpoints
                if ((!perfRes.data?.testResults || perfRes.data.testResults.length === 0) ||
                    (!perfRes.data?.assignments || perfRes.data.assignments.length === 0)) {
                    const [testsRes, assignmentsRes] = await Promise.all([
                        testService.getStudentResults(childId).catch(() => null),
                        assignmentService.getStudentAssignments(childId).catch(() => null)
                    ]);

                    if (testsRes?.success && testsRes.data.results?.length > 0) {
                        const mappedTests: TestResultInfo[] = (testsRes.data.results || []).map((t: { id: string; score: number; percentage: number; status: string; submitted_at: string; graded_at: string | null; feedback: string | null; tests?: { title: string; total_marks: number; classes?: { subject: string } } }) => ({
                            id: t.id,
                            testTitle: t.tests?.title || 'Test',
                            subject: t.tests?.classes?.subject || 'General',
                            score: t.score,
                            totalMarks: t.tests?.total_marks || 0,
                            percentage: t.percentage,
                            status: t.status,
                            submittedAt: t.submitted_at,
                            gradedAt: t.graded_at,
                            feedback: t.feedback
                        }));
                        setTestResults(mappedTests);

                        // Recalculate test average
                        const graded = mappedTests.filter(t => t.percentage != null);
                        if (graded.length > 0) {
                            const avg = Math.round(graded.reduce((s, t) => s + t.percentage, 0) / graded.length);
                            setPerfStats(prev => ({
                                ...prev,
                                testAverage: avg,
                                completedTests: graded.length,
                                totalTests: mappedTests.length,
                                averageGrade: prev.assignmentAverage != null
                                    ? Math.round((avg + prev.assignmentAverage) / 2)
                                    : avg
                            }));
                        }
                    }

                    if (assignmentsRes?.success && assignmentsRes.data.assignments?.length > 0) {
                        const mappedAssignments: AssignmentInfo[] = (assignmentsRes.data.assignments || []).map((a: { id: string; title: string; total_marks: number; due_date: string; classes?: { subject: string }; assignment_submissions?: Array<{ score: number | null; percentage: number | null; status: string; is_late: boolean; submitted_at: string; graded_at: string | null; feedback: string | null }> }) => ({
                            id: a.id,
                            title: a.title,
                            subject: a.classes?.subject || 'General',
                            totalMarks: a.total_marks,
                            dueDate: a.due_date,
                            submission: a.assignment_submissions?.[0] ? {
                                score: a.assignment_submissions[0].score,
                                percentage: a.assignment_submissions[0].percentage,
                                status: a.assignment_submissions[0].status,
                                isLate: a.assignment_submissions[0].is_late,
                                submittedAt: a.assignment_submissions[0].submitted_at,
                                gradedAt: a.assignment_submissions[0].graded_at,
                                feedback: a.assignment_submissions[0].feedback
                            } : null
                        }));
                        setAssignments(mappedAssignments);

                        // Recalculate assignment average
                        const gradedA = mappedAssignments.filter(a =>
                            a.submission?.status === 'graded' && a.submission?.percentage != null
                        );
                        if (gradedA.length > 0) {
                            const avg = Math.round(gradedA.reduce((s, a) => s + (a.submission?.percentage || 0), 0) / gradedA.length);
                            setPerfStats(prev => ({
                                ...prev,
                                assignmentAverage: avg,
                                pendingAssignments: mappedAssignments.filter(a => !a.submission).length,
                                averageGrade: prev.testAverage != null
                                    ? Math.round((prev.testAverage + avg) / 2)
                                    : avg
                            }));
                        }
                    }
                }
            } catch (error: unknown) {
                const err = error as { response?: { data?: { message?: string } }; message?: string };
                const msg = err?.response?.data?.message || err?.message || 'Failed to load progress data';
                showToast(msg, 'error');
                console.error('ChildProgress fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [childId, showToast]);

    // Compute stats from real data
    const completedClasses = classes.filter(c => c.status === 'completed');
    const presentCount = completedClasses.filter(c => c.attendanceStatus === 'present').length;
    const attendanceRate = completedClasses.length > 0
        ? Math.round((presentCount / completedClasses.length) * 100)
        : 0;

    // Group by subject
    const subjectMap = new Map<string, { total: number; present: number }>();
    classes.forEach(c => {
        const subj = c.subject || 'General';
        if (!subjectMap.has(subj)) subjectMap.set(subj, { total: 0, present: 0 });
        const entry = subjectMap.get(subj)!;
        if (c.status === 'completed') {
            entry.total++;
            if (c.attendanceStatus === 'present') entry.present++;
        }
    });

    const subjects = Array.from(subjectMap.entries()).map(([name, data]) => ({
        name,
        attendance: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
        totalClasses: data.total,
        present: data.present,
    }));

    // Weekly attendance (group by week)
    const attendanceByWeek = new Map<string, { present: number; total: number }>();
    completedClasses.forEach(c => {
        const d = new Date(c.scheduledAt);
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        if (!attendanceByWeek.has(weekKey)) attendanceByWeek.set(weekKey, { present: 0, total: 0 });
        const w = attendanceByWeek.get(weekKey)!;
        w.total++;
        if (c.attendanceStatus === 'present') w.present++;
    });
    const attendanceData = Array.from(attendanceByWeek.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-4)
        .map(([, data], i) => ({ week: `Week ${i + 1}`, present: data.present, total: data.total }));

    const getGradeColor = (grade: number) => {
        if (grade >= 90) return '#10b981';
        if (grade >= 75) return '#3b82f6';
        return '#ef4444';
    };

    return (
        <div className="child-progress-page">
            <Header navigationLinks={navigationLinks} />

            <div className="progress-container">
                <button className="back-button" onClick={() => navigate('/parent/dashboard')}>
                    ← Back to Dashboard
                </button>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}><p>Loading progress...</p></div>
                ) : (
                <>
                {/* Child Header */}
                <div className="child-header">
                    {childInfo.avatar && <img src={childInfo.avatar} alt={childInfo.fullName} className="child-avatar-large" />}
                    <div className="child-header-info">
                        <h1>{childInfo.fullName || 'Student'}</h1>
                        <p>{childInfo.gradeLevel}</p>
                    </div>
                    <div className="overall-stats">
                        <div className="overall-stat">
                            <span className="label">Overall Grade</span>
                            <span className="value" style={{ color: perfStats.averageGrade != null ? getGradeColor(perfStats.averageGrade) : '#718096' }}>
                                {perfStats.averageGrade != null ? `${perfStats.averageGrade}%` : 'N/A'}
                            </span>
                        </div>
                        <div className="overall-stat">
                            <span className="label">Test Avg</span>
                            <span className="value" style={{ color: perfStats.testAverage != null ? getGradeColor(perfStats.testAverage) : '#718096' }}>
                                {perfStats.testAverage != null ? `${perfStats.testAverage}%` : 'N/A'}
                            </span>
                        </div>
                        <div className="overall-stat">
                            <span className="label">Attendance</span>
                            <span className="value" style={{ color: getGradeColor(attendanceRate) }}>{attendanceRate}%</span>
                        </div>
                        <div className="overall-stat">
                            <span className="label">Classes</span>
                            <span className="value">{classes.length}</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
                        onClick={() => setActiveTab('performance')}
                    >
                        Performance
                    </button>
                    <button
                        className={`tab ${activeTab === 'subjects' ? 'active' : ''}`}
                        onClick={() => setActiveTab('subjects')}
                    >
                        Subjects
                    </button>
                    <button
                        className={`tab ${activeTab === 'attendance' ? 'active' : ''}`}
                        onClick={() => setActiveTab('attendance')}
                    >
                        Attendance
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="tab-content">
                        {classes.length === 0 && testResults.length === 0 && assignments.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>No data available yet.</p>
                        ) : (
                        <div className="two-column-layout">
                            {/* Recent Test Results */}
                            <div className="section">
                                <h2>Recent Test Results</h2>
                                {testResults.length > 0 ? (
                                <div className="tests-list">
                                    {testResults.slice(0, 5).map((test, index) => (
                                        <div key={index} className="test-item">
                                            <div>
                                                <h3>{test.testTitle}</h3>
                                                <p>{test.subject} &bull; {new Date(test.submittedAt).toLocaleDateString('en-ZA')}</p>
                                            </div>
                                            {test.percentage != null ? (
                                                <span
                                                    className="score-badge"
                                                    style={{ background: test.percentage >= 75 ? '#10b981' : test.percentage >= 50 ? '#ff9500' : '#ef4444' }}
                                                >
                                                    {test.score}/{test.totalMarks} ({test.percentage}%)
                                                </span>
                                            ) : (
                                                <span className="score-badge" style={{ background: '#667eea' }}>Submitted</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                ) : (
                                    <p style={{ color: '#718096', padding: '1rem 0' }}>No test results yet</p>
                                )}
                            </div>

                            {/* Recent Assignments */}
                            <div className="section">
                                <h2>Recent Assignments</h2>
                                {assignments.length > 0 ? (
                                <div className="assignments-list">
                                    {assignments.slice(0, 5).map((assignment, index) => {
                                        const sub = assignment.submission;
                                        const isGraded = sub?.status === 'graded' && sub?.percentage != null;
                                        return (
                                            <div key={index} className="assignment-item">
                                                <div>
                                                    <h3>{assignment.title}</h3>
                                                    <p>{assignment.subject} &bull; Due {new Date(assignment.dueDate).toLocaleDateString('en-ZA')}
                                                        {sub?.isLate && <span style={{ color: '#ef4444', fontWeight: 600 }}> (Late)</span>}
                                                    </p>
                                                </div>
                                                {isGraded ? (
                                                    <span
                                                        className="score-badge"
                                                        style={{ background: sub.percentage! >= 75 ? '#10b981' : sub.percentage! >= 50 ? '#ff9500' : '#ef4444' }}
                                                    >
                                                        {sub.score}/{assignment.totalMarks} ({sub.percentage}%)
                                                    </span>
                                                ) : sub ? (
                                                    <span className="status-badge" style={{ background: '#667eea' }}>Submitted</span>
                                                ) : (
                                                    <span className="status-badge" style={{ background: '#ff9500' }}>Not submitted</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                ) : (
                                    <p style={{ color: '#718096', padding: '1rem 0' }}>No assignments yet</p>
                                )}
                            </div>
                        </div>
                        )}
                    </div>
                )}

                {activeTab === 'performance' && (
                    <div className="tab-content">
                        {testResults.length === 0 && assignments.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>No performance data available yet.</p>
                        ) : (
                        <>
                            {/* Performance Summary Cards */}
                            <div className="performance-summary">
                                <div className="perf-card">
                                    <span className="perf-icon">📋</span>
                                    <span className="perf-label">Test Average</span>
                                    <span className="perf-value" style={{ color: perfStats.testAverage != null ? getGradeColor(perfStats.testAverage) : '#718096' }}>
                                        {perfStats.testAverage != null ? `${perfStats.testAverage}%` : 'N/A'}
                                    </span>
                                    <span className="perf-detail">{perfStats.completedTests} of {perfStats.totalTests} graded</span>
                                </div>
                                <div className="perf-card">
                                    <span className="perf-icon">📝</span>
                                    <span className="perf-label">Assignment Average</span>
                                    <span className="perf-value" style={{ color: perfStats.assignmentAverage != null ? getGradeColor(perfStats.assignmentAverage) : '#718096' }}>
                                        {perfStats.assignmentAverage != null ? `${perfStats.assignmentAverage}%` : 'N/A'}
                                    </span>
                                    <span className="perf-detail">{perfStats.pendingAssignments} pending</span>
                                </div>
                                <div className="perf-card">
                                    <span className="perf-icon">🎯</span>
                                    <span className="perf-label">Overall Grade</span>
                                    <span className="perf-value" style={{ color: perfStats.averageGrade != null ? getGradeColor(perfStats.averageGrade) : '#718096' }}>
                                        {perfStats.averageGrade != null ? `${perfStats.averageGrade}%` : 'N/A'}
                                    </span>
                                    <span className="perf-detail">Tests + Assignments</span>
                                </div>
                            </div>

                            {/* All Test Results */}
                            {testResults.length > 0 && (
                                <div className="section perf-section">
                                    <h2>📋 All Test Results</h2>
                                    <div className="tests-list">
                                        {testResults.map((test, index) => (
                                            <div key={index} className="test-item">
                                                <div>
                                                    <h3>{test.testTitle}</h3>
                                                    <p>{test.subject} &bull; {new Date(test.submittedAt).toLocaleDateString('en-ZA')}</p>
                                                    {test.feedback && <p className="feedback-text">💬 {test.feedback}</p>}
                                                </div>
                                                {test.percentage != null ? (
                                                    <span
                                                        className="score-badge"
                                                        style={{ background: test.percentage >= 75 ? '#10b981' : test.percentage >= 50 ? '#ff9500' : '#ef4444' }}
                                                    >
                                                        {test.score}/{test.totalMarks} ({test.percentage}%)
                                                    </span>
                                                ) : (
                                                    <span className="score-badge" style={{ background: '#667eea' }}>Awaiting grade</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* All Assignments */}
                            {assignments.length > 0 && (
                                <div className="section perf-section">
                                    <h2>📝 All Assignments</h2>
                                    <div className="assignments-list">
                                        {assignments.map((assignment, index) => {
                                            const sub = assignment.submission;
                                            const isGraded = sub?.status === 'graded' && sub?.percentage != null;
                                            return (
                                                <div key={index} className="assignment-item">
                                                    <div>
                                                        <h3>{assignment.title}</h3>
                                                        <p>{assignment.subject} &bull; Due {new Date(assignment.dueDate).toLocaleDateString('en-ZA')}
                                                            {sub?.isLate && <span style={{ color: '#ef4444', fontWeight: 600 }}> (Late)</span>}
                                                        </p>
                                                        {sub?.feedback && <p className="feedback-text">💬 {sub.feedback}</p>}
                                                    </div>
                                                    {isGraded ? (
                                                        <span
                                                            className="score-badge"
                                                            style={{ background: sub.percentage! >= 75 ? '#10b981' : sub.percentage! >= 50 ? '#ff9500' : '#ef4444' }}
                                                        >
                                                            {sub.score}/{assignment.totalMarks} ({sub.percentage}%)
                                                        </span>
                                                    ) : sub ? (
                                                        <span className="status-badge" style={{ background: '#667eea' }}>Submitted</span>
                                                    ) : (
                                                        <span className="status-badge" style={{ background: '#ff9500' }}>Not submitted</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                        )}
                    </div>
                )}

                {activeTab === 'subjects' && (
                    <div className="tab-content">
                        {subjects.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>No subject data available yet.</p>
                        ) : (
                        <div className="subjects-grid">
                            {subjects.map((subject, index) => {
                                // Calculate per-subject test and assignment averages
                                const subjectTests = testResults.filter(t => t.subject === subject.name && t.percentage != null);
                                const subjectTestAvg = subjectTests.length > 0
                                    ? Math.round(subjectTests.reduce((s, t) => s + t.percentage, 0) / subjectTests.length)
                                    : null;
                                const subjectAssignments = assignments.filter(a =>
                                    a.subject === subject.name && a.submission?.status === 'graded' && a.submission?.percentage != null
                                );
                                const subjectAssignmentAvg = subjectAssignments.length > 0
                                    ? Math.round(subjectAssignments.reduce((s, a) => s + (a.submission?.percentage || 0), 0) / subjectAssignments.length)
                                    : null;

                                return (
                                    <div key={index} className="subject-card">
                                        <div className="subject-header">
                                            <h3>{subject.name}</h3>
                                            <span
                                                className="grade-badge"
                                                style={{ background: getGradeColor(subject.attendance) }}
                                            >
                                                {subject.attendance}%
                                            </span>
                                        </div>
                                        <div className="subject-stats">
                                            <div className="stat-row">
                                                <span>Classes Attended:</span>
                                                <span>{subject.present}/{subject.totalClasses}</span>
                                            </div>
                                            <div className="stat-row">
                                                <span>Attendance:</span>
                                                <span>{subject.attendance}%</span>
                                            </div>
                                            {subjectTestAvg != null && (
                                                <div className="stat-row">
                                                    <span>Test Average:</span>
                                                    <span style={{ color: getGradeColor(subjectTestAvg), fontWeight: 600 }}>
                                                        {subjectTestAvg}%
                                                    </span>
                                                </div>
                                            )}
                                            {subjectAssignmentAvg != null && (
                                                <div className="stat-row">
                                                    <span>Assignment Average:</span>
                                                    <span style={{ color: getGradeColor(subjectAssignmentAvg), fontWeight: 600 }}>
                                                        {subjectAssignmentAvg}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        )}
                    </div>
                )}

                {activeTab === 'attendance' && (
                    <div className="tab-content">
                        {attendanceData.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>No attendance data available yet.</p>
                        ) : (
                        <div className="attendance-chart">
                            {attendanceData.map((week, index) => (
                                <div key={index} className="week-row">
                                    <span className="week-label">{week.week}</span>
                                    <div className="attendance-bar">
                                        <div
                                            className="attendance-fill"
                                            style={{ width: `${(week.present / week.total) * 100}%` }}
                                        />
                                    </div>
                                    <span className="attendance-ratio">{week.present}/{week.total}</span>
                                </div>
                            ))}
                        </div>
                        )}
                    </div>
                )}
                </>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ChildProgress;
