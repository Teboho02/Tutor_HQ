import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useToast } from '../../../components/Toast';
import { useAuth } from '../../../contexts/AuthContext';
import { studentService } from '../../../services/student.service';
import { testService } from '../../../services/test.service';
import { assignmentService } from '../../../services/assignment.service';
import type { NavigationLink } from '../../../types';
import './StudentProgress.css';

interface ProfileData {
    id: string;
    full_name: string;
    gradeLevel: string;
    schoolName: string;
    subjects: string[] | null;
}

interface AttendanceRecord {
    classId: string;
    title: string;
    subject: string;
    scheduledAt: string;
    status: string;
    attendanceStatus: string;
}

interface TestResult {
    id: string;
    test_id: string;
    score: number;
    percentage: number;
    status: string;
    submitted_at: string;
    graded_at: string | null;
    feedback: string | null;
    tests: {
        title: string;
        total_marks: number;
        description: string;
        classes: {
            title: string;
            subject: string;
        };
    };
}

interface AssignmentRecord {
    id: string;
    title: string;
    description: string;
    total_marks: number;
    due_date: string;
    status: string;
    classes: {
        title: string;
        subject: string;
    };
    assignment_submissions: Array<{
        id: string;
        score: number | null;
        percentage: number | null;
        status: string;
        submitted_at: string;
        is_late: boolean;
        feedback: string | null;
        graded_at: string | null;
    }>;
}

const StudentProgress: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
    const { user } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [profileRes, attendanceRes] = await Promise.all([
                    studentService.getProfile(),
                    studentService.getAttendance()
                ]);
                if (profileRes.success) {
                    setProfileData(profileRes.data.profile);
                }
                if (attendanceRes.success) {
                    setAttendanceHistory(attendanceRes.data.history || []);
                }

                // Fetch test results and assignments if we have user id
                if (user?.id) {
                    const [testsRes, assignmentsRes] = await Promise.all([
                        testService.getStudentResults(user.id).catch(() => null),
                        assignmentService.getStudentAssignments(user.id).catch(() => null)
                    ]);
                    if (testsRes?.success) {
                        setTestResults(testsRes.data.results || []);
                    }
                    if (assignmentsRes?.success) {
                        setAssignments(assignmentsRes.data.assignments || []);
                    }
                }
            } catch (error: unknown) {
                const err = error as { response?: { data?: { message?: string } } };
                showToast(err.response?.data?.message || 'Failed to load progress data', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/student/dashboard' },
        { label: 'Calendar', href: '/student/calendar' },
        { label: 'Materials', href: '/student/materials' },
        { label: 'Progress', href: '/student/progress' },
        { label: 'Tests', href: '/student/tests' },
        { label: 'Goals', href: '/student/goals' },
    ];

    // Calculate stats from real data
    const completedClasses = attendanceHistory.filter(a => a.status === 'completed');
    const presentCount = completedClasses.filter(a => a.attendanceStatus === 'present').length;
    const attendanceRate = completedClasses.length > 0
        ? parseFloat((presentCount / completedClasses.length * 100).toFixed(1))
        : 0;

    // Calculate test performance
    const gradedTests = testResults.filter(t => t.status === 'graded' || t.percentage != null);
    const testAverage = gradedTests.length > 0
        ? parseFloat((gradedTests.reduce((sum, t) => sum + (t.percentage || 0), 0) / gradedTests.length).toFixed(1))
        : 0;

    // Calculate assignment performance
    const gradedAssignments = assignments.filter(a =>
        a.assignment_submissions?.some(s => s.status === 'graded' && s.percentage != null)
    );
    const assignmentScores = gradedAssignments.map(a => {
        const graded = a.assignment_submissions.find(s => s.status === 'graded');
        return graded?.percentage || 0;
    });
    const assignmentAverage = assignmentScores.length > 0
        ? parseFloat((assignmentScores.reduce((sum, s) => sum + s, 0) / assignmentScores.length).toFixed(1))
        : 0;

    // Overall performance (weighted: tests 40%, assignments 40%, attendance 20%)
    const hasPerformanceData = gradedTests.length > 0 || assignmentScores.length > 0;
    const overallPerformance = hasPerformanceData
        ? parseFloat((
            (gradedTests.length > 0 ? testAverage * 0.4 : 0) +
            (assignmentScores.length > 0 ? assignmentAverage * 0.4 : 0) +
            (attendanceRate * 0.2)
        ).toFixed(1)) / (
            (gradedTests.length > 0 ? 0.4 : 0) +
            (assignmentScores.length > 0 ? 0.4 : 0) +
            0.2
        )
        : 0;

    // Pending assignments count
    const pendingAssignments = assignments.filter(a =>
        !a.assignment_submissions || a.assignment_submissions.length === 0
    ).length;

    // Group attendance by subject
    const subjectMap = new Map<string, { total: number; present: number }>();
    attendanceHistory.forEach(record => {
        const subj = record.subject || 'General';
        if (!subjectMap.has(subj)) subjectMap.set(subj, { total: 0, present: 0 });
        const entry = subjectMap.get(subj)!;
        if (record.status === 'completed') {
            entry.total++;
            if (record.attendanceStatus === 'present') entry.present++;
        }
    });

    const subjectColors = ['#0066ff', '#5856d6', '#34c759', '#ff9500', '#ff3b30', '#af52de', '#007aff', '#30b0c7'];
    const subjectIcons: Record<string, string> = {
        'Mathematics': '🔢', 'Physics': '⚛️', 'Chemistry': '🧪', 'Biology': '🧬',
        'English': '📖', 'History': '🏛️', 'Science': '🔬', 'Geography': '🌍',
    };

    const subjectProgress = Array.from(subjectMap.entries()).map(([subject, data], i) => ({
        subject,
        icon: subjectIcons[subject] || '📚',
        color: subjectColors[i % subjectColors.length],
        attendanceRate: data.total > 0 ? parseFloat((data.present / data.total * 100).toFixed(1)) : 0,
        totalClasses: data.total,
    }));

    const overallStats = [
        { label: 'Overall Score', value: hasPerformanceData ? `${Math.round(overallPerformance)}%` : 'N/A', icon: '🎯', color: '#667eea' },
        { label: 'Test Average', value: gradedTests.length > 0 ? `${testAverage}%` : 'N/A', icon: '📋', color: '#5856d6' },
        { label: 'Assignment Avg', value: assignmentScores.length > 0 ? `${assignmentAverage}%` : 'N/A', icon: '📝', color: '#34c759' },
        { label: 'Attendance Rate', value: `${attendanceRate}%`, icon: '📅', color: '#0066ff' },
        { label: 'Tests Taken', value: `${gradedTests.length}/${testResults.length}`, icon: '✅', color: '#ff9500' },
        { label: 'Pending Work', value: `${pendingAssignments}`, icon: '⏳', color: pendingAssignments > 0 ? '#ff3b30' : '#34c759' },
    ];

    // Recent activity from attendance, tests, and assignments
    type ActivityItem = {
        type: 'attendance' | 'test' | 'assignment';
        subject: string;
        title: string;
        date: string;
        sortDate: number;
        status: string;
        score?: string;
    };

    const attendanceActivities: ActivityItem[] = attendanceHistory
        .map(record => ({
            type: 'attendance' as const,
            subject: record.subject,
            title: record.title,
            date: new Date(record.scheduledAt).toLocaleDateString('en-ZA', {
                month: 'short', day: 'numeric'
            }),
            sortDate: new Date(record.scheduledAt).getTime(),
            status: record.attendanceStatus
        }));

    const testActivities: ActivityItem[] = testResults
        .map(result => ({
            type: 'test' as const,
            subject: result.tests?.classes?.subject || 'General',
            title: result.tests?.title || 'Test',
            date: new Date(result.submitted_at).toLocaleDateString('en-ZA', {
                month: 'short', day: 'numeric'
            }),
            sortDate: new Date(result.submitted_at).getTime(),
            status: result.status,
            score: result.percentage != null ? `${result.percentage}%` : undefined
        }));

    const assignmentActivities: ActivityItem[] = assignments
        .filter(a => a.assignment_submissions && a.assignment_submissions.length > 0)
        .map(a => {
            const sub = a.assignment_submissions[0];
            return {
                type: 'assignment' as const,
                subject: a.classes?.subject || 'General',
                title: a.title,
                date: new Date(sub.submitted_at).toLocaleDateString('en-ZA', {
                    month: 'short', day: 'numeric'
                }),
                sortDate: new Date(sub.submitted_at).getTime(),
                status: sub.status,
                score: sub.percentage != null ? `${sub.percentage}%` : undefined
            };
        });

    const recentActivity = [...attendanceActivities, ...testActivities, ...assignmentActivities]
        .sort((a, b) => b.sortDate - a.sortDate)
        .slice(0, 8);

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'assignment': return '📝';
            case 'test': return '📋';
            case 'attendance': return '✅';
            default: return '📌';
        }
    };

    return (
        <div className="student-progress-page">
            <Header navigationLinks={navigationLinks} />

            <div className="progress-container">
                <div className="page-header">
                    <h1>{profileData?.full_name ? `${profileData.full_name}'s Progress` : 'My Progress'}</h1>
                    <p>Track your academic performance and attendance</p>
                </div>

                {loading && (
                    <div className="loading-state">
                        <div className="spinner">⏳</div>
                        <p>Loading progress data...</p>
                    </div>
                )}

                {!loading && (
                    <>
                        {/* Overall Stats */}
                        <div className="stats-grid">
                            {overallStats.map((stat, index) => (
                                <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
                                    <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
                                    <div className="stat-info">
                                        <div className="stat-label">{stat.label}</div>
                                        <div className="stat-value">{stat.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Performance Chart - Tests & Assignments by Subject */}
                        {(gradedTests.length > 0 || assignmentScores.length > 0) && (
                            <div className="chart-section">
                                <h2>Performance by Subject</h2>
                                <div className="chart-placeholder">
                                    <div className="chart-bars">
                                        {(() => {
                                            // Group test and assignment scores by subject
                                            const perfBySubject = new Map<string, { testScores: number[]; assignmentScores: number[] }>();
                                            testResults.forEach(t => {
                                                const subj = t.tests?.classes?.subject || 'General';
                                                if (!perfBySubject.has(subj)) perfBySubject.set(subj, { testScores: [], assignmentScores: [] });
                                                if (t.percentage != null) perfBySubject.get(subj)!.testScores.push(t.percentage);
                                            });
                                            assignments.forEach(a => {
                                                const subj = a.classes?.subject || 'General';
                                                if (!perfBySubject.has(subj)) perfBySubject.set(subj, { testScores: [], assignmentScores: [] });
                                                const graded = a.assignment_submissions?.find(s => s.status === 'graded' && s.percentage != null);
                                                if (graded) perfBySubject.get(subj)!.assignmentScores.push(graded.percentage!);
                                            });
                                            return Array.from(perfBySubject.entries()).map(([subject, data], i) => {
                                                const allScores = [...data.testScores, ...data.assignmentScores];
                                                const avg = allScores.length > 0
                                                    ? Math.round(allScores.reduce((s, v) => s + v, 0) / allScores.length)
                                                    : 0;
                                                const icon = subjectIcons[subject] || '📚';
                                                const color = subjectColors[i % subjectColors.length];
                                                return (
                                                    <div key={subject} className="chart-bar-wrapper">
                                                        <div className="chart-bar">
                                                            <div
                                                                className="chart-bar-fill"
                                                                style={{ height: `${avg}%`, backgroundColor: color }}
                                                            />
                                                        </div>
                                                        <div className="chart-label">{icon}</div>
                                                        <div className="chart-percentage">{avg}%</div>
                                                    </div>
                                                );
                                            });
                                        })()}
                                    </div>
                                    <div className="chart-y-axis">
                                        <span>100%</span>
                                        <span>75%</span>
                                        <span>50%</span>
                                        <span>25%</span>
                                        <span>0%</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Test Results Section */}
                        {testResults.length > 0 && (
                            <div className="chart-section">
                                <h2>📋 Test Results</h2>
                                <div className="performance-list">
                                    {testResults.slice(0, 6).map((result, index) => (
                                        <div key={index} className="performance-item">
                                            <div className="performance-info">
                                                <h4>{result.tests?.title || 'Test'}</h4>
                                                <span className="performance-meta">
                                                    {result.tests?.classes?.subject || 'General'} &bull;
                                                    {new Date(result.submitted_at).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="performance-score">
                                                <span className="score-value" style={{ color: result.percentage >= 75 ? '#34c759' : result.percentage >= 50 ? '#ff9500' : '#ff3b30' }}>
                                                    {result.score}/{result.tests?.total_marks}
                                                </span>
                                                <span className="score-percent" style={{ background: result.percentage >= 75 ? '#34c75920' : result.percentage >= 50 ? '#ff950020' : '#ff3b3020' }}>
                                                    {result.percentage}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Assignment Grades Section */}
                        {assignments.length > 0 && (
                            <div className="chart-section">
                                <h2>📝 Assignment Grades</h2>
                                <div className="performance-list">
                                    {assignments.slice(0, 6).map((assignment, index) => {
                                        const submission = assignment.assignment_submissions?.[0];
                                        const isGraded = submission?.status === 'graded' && submission?.percentage != null;
                                        const isPending = !submission;
                                        return (
                                            <div key={index} className="performance-item">
                                                <div className="performance-info">
                                                    <h4>{assignment.title}</h4>
                                                    <span className="performance-meta">
                                                        {assignment.classes?.subject || 'General'} &bull;
                                                        Due {new Date(assignment.due_date).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}
                                                        {submission?.is_late && <span className="late-badge"> Late</span>}
                                                    </span>
                                                </div>
                                                <div className="performance-score">
                                                    {isGraded ? (
                                                        <>
                                                            <span className="score-value" style={{ color: submission.percentage! >= 75 ? '#34c759' : submission.percentage! >= 50 ? '#ff9500' : '#ff3b30' }}>
                                                                {submission.score}/{assignment.total_marks}
                                                            </span>
                                                            <span className="score-percent" style={{ background: submission.percentage! >= 75 ? '#34c75920' : submission.percentage! >= 50 ? '#ff950020' : '#ff3b3020' }}>
                                                                {submission.percentage}%
                                                            </span>
                                                        </>
                                                    ) : isPending ? (
                                                        <span className="status-badge pending">Not submitted</span>
                                                    ) : (
                                                        <span className="status-badge submitted">Submitted</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Attendance by Subject Chart */}
                        {subjectProgress.length > 0 && (
                            <div className="chart-section">
                                <h2>📅 Attendance by Subject</h2>
                                <div className="chart-placeholder">
                                    <div className="chart-bars">
                                        {subjectProgress.map((subject) => (
                                            <div key={subject.subject} className="chart-bar-wrapper">
                                                <div className="chart-bar">
                                                    <div
                                                        className="chart-bar-fill"
                                                        style={{
                                                            height: `${subject.attendanceRate}%`,
                                                            backgroundColor: subject.color
                                                        }}
                                                    />
                                                </div>
                                                <div className="chart-label">{subject.icon}</div>
                                                <div className="chart-percentage">{subject.attendanceRate}%</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="chart-y-axis">
                                        <span>100%</span>
                                        <span>75%</span>
                                        <span>50%</span>
                                        <span>25%</span>
                                        <span>0%</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Subject Progress Cards */}
                        {subjectProgress.length > 0 ? (
                            <div className="subject-progress-section">
                                <h2>Subject-wise Progress</h2>
                                <div className="subject-progress-grid">
                                    {subjectProgress.map((subject) => (
                                        <div key={subject.subject} className="subject-progress-card">
                                            <div className="subject-header">
                                                <div className="subject-icon-badge" style={{ backgroundColor: `${subject.color}20`, color: subject.color }}>
                                                    {subject.icon}
                                                </div>
                                                <div className="subject-title">
                                                    <h3>{subject.subject}</h3>
                                                </div>
                                            </div>

                                            <div className="subject-stats">
                                                <div className="stat-row">
                                                    <span className="stat-label">Attendance</span>
                                                    <span className="stat-value">{subject.attendanceRate}%</span>
                                                </div>
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill"
                                                        style={{ width: `${subject.attendanceRate}%`, backgroundColor: subject.color }}
                                                    />
                                                </div>

                                                <div className="subject-metrics">
                                                    <div className="metric">
                                                        <span>📚 Total Classes</span>
                                                        <strong>{subject.totalClasses}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="empty-section">
                                <p>No subject data available yet. Attend classes to see your progress here.</p>
                            </div>
                        )}

                        {/* Recent Activity */}
                        <div className="activity-section">
                            <h2>Recent Activity</h2>
                            {recentActivity.length > 0 ? (
                                <div className="activity-list">
                                    {recentActivity.map((activity, index) => (
                                        <div key={index} className="activity-item">
                                            <div className="activity-icon">{getActivityIcon(activity.type)}</div>
                                            <div className="activity-info">
                                                <div className="activity-header">
                                                    <h4>{activity.title}</h4>
                                                    {activity.score ? (
                                                        <span className="activity-score">{activity.score}</span>
                                                    ) : (
                                                        <span className={`attendance-badge ${activity.status}`}>
                                                            {activity.status}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="activity-meta">
                                                    <span className="activity-subject">{activity.subject}</span>
                                                    <span className="activity-date">📅 {activity.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-section">
                                    <p>No recent activity to display.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default StudentProgress;
