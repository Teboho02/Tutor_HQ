import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';
import {
    analyticsService,
    type StudentAnalyticsData,
    type TutorAnalyticsData,
    type ParentAnalyticsData,
    type LeaderboardEntry,
    getScoreColor,
    formatPeriod
} from '../services/analytics.service';
import type { NavigationLink } from '../types';
import './Analytics.css';

const Analytics: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30d');
    const [studentData, setStudentData] = useState<StudentAnalyticsData | null>(null);
    const [tutorData, setTutorData] = useState<TutorAnalyticsData | null>(null);
    const [parentData, setParentData] = useState<ParentAnalyticsData | null>(null);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

    const role = user?.role || 'student';

    const navigationLinks: NavigationLink[] = role === 'tutor'
        ? [
            { label: 'Dashboard', href: '/tutor/dashboard' },
            { label: 'My Classes', href: '/tutor/classes' },
            { label: 'Analytics', href: '/analytics' },
            { label: 'Account', href: '/tutor/account' },
        ]
        : role === 'parent'
            ? [
                { label: 'Dashboard', href: '/parent/dashboard' },
                { label: 'Children', href: '/parent/children' },
                { label: 'Analytics', href: '/analytics' },
            ]
            : [
                { label: 'Dashboard', href: '/student/dashboard' },
                { label: 'Progress', href: '/student/progress' },
                { label: 'Analytics', href: '/analytics' },
                { label: 'Goals', href: '/student/goals' },
            ];

    const fetchAnalytics = useCallback(async () => {
        if (!user?.id) return;

        try {
            setLoading(true);

            if (role === 'student') {
                const [analyticsResponse, leaderboardResponse] = await Promise.all([
                    analyticsService.getStudentAnalytics(user.id, period),
                    analyticsService.getLeaderboard('students', undefined, 5)
                ]);

                if (analyticsResponse.success && analyticsResponse.data) {
                    setStudentData(analyticsResponse.data);
                }
                if (leaderboardResponse.success && leaderboardResponse.data) {
                    setLeaderboard(leaderboardResponse.data.leaderboard);
                }
            } else if (role === 'tutor') {
                const response = await analyticsService.getTutorAnalytics(user.id, period);
                if (response.success && response.data) {
                    setTutorData(response.data);
                }
            } else if (role === 'parent') {
                const response = await analyticsService.getParentAnalytics(period);
                if (response.success && response.data) {
                    setParentData(response.data);
                }
            }
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            showToast(axiosError.response?.data?.message || 'Failed to load analytics', 'error');
        } finally {
            setLoading(false);
        }
    }, [user?.id, role, period, showToast]);

    useEffect(() => {
        if (user?.id) {
            fetchAnalytics();
        }
    }, [user?.id, period, fetchAnalytics]);

    if (loading) {
        return (
            <div className="analytics-page">
                <Header navigationLinks={navigationLinks} />
                <div className="analytics-container">
                    <LoadingSpinner message="Loading analytics..." />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="analytics-page">
            <Header navigationLinks={navigationLinks} />

            <div className="analytics-container">
                <div className="page-header">
                    <div className="header-content">
                        <h1>📊 Analytics Dashboard</h1>
                        <p>Track your performance and progress over time</p>
                    </div>
                    <div className="period-selector">
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="period-select"
                        >
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 3 months</option>
                            <option value="365d">Last year</option>
                        </select>
                    </div>
                </div>

                {/* Student Analytics */}
                {role === 'student' && studentData && (
                    <>
                        {/* Overview Stats */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon" style={{ color: getScoreColor(studentData.overview.overallAverage) }}>📈</div>
                                <div className="stat-info">
                                    <span className="stat-label">Overall Average</span>
                                    <span className="stat-value">{studentData.overview.overallAverage}%</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ color: '#2196F3' }}>📝</div>
                                <div className="stat-info">
                                    <span className="stat-label">Assignments</span>
                                    <span className="stat-value">{studentData.overview.assignmentsCompleted}</span>
                                    <span className="stat-subtext">Avg: {studentData.overview.avgAssignmentScore}%</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ color: '#9C27B0' }}>📋</div>
                                <div className="stat-info">
                                    <span className="stat-label">Tests</span>
                                    <span className="stat-value">{studentData.overview.testsCompleted}</span>
                                    <span className="stat-subtext">Avg: {studentData.overview.avgTestScore}%</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ color: '#4CAF50' }}>🎯</div>
                                <div className="stat-info">
                                    <span className="stat-label">Goals Completed</span>
                                    <span className="stat-value">{studentData.overview.goalsCompleted}/{studentData.overview.goalsCreated}</span>
                                    <span className="stat-subtext">{studentData.overview.goalCompletionRate}% rate</span>
                                </div>
                            </div>
                        </div>

                        {/* Performance Trend */}
                        <div className="analytics-section">
                            <h2>📈 Performance Trend</h2>
                            <div className="trend-chart">
                                {studentData.trend.map((point, index) => (
                                    <div key={index} className="trend-bar-container">
                                        <div
                                            className="trend-bar"
                                            style={{
                                                height: `${Math.max(point.avgScore, 5)}%`,
                                                backgroundColor: getScoreColor(point.avgScore)
                                            }}
                                        >
                                            <span className="bar-value">{point.avgScore}%</span>
                                        </div>
                                        <span className="bar-label">{point.week}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Leaderboard */}
                        {leaderboard.length > 0 && (
                            <div className="analytics-section">
                                <h2>🏆 Leaderboard</h2>
                                <div className="leaderboard">
                                    {leaderboard.map((entry) => (
                                        <div
                                            key={entry.studentId}
                                            className={`leaderboard-entry ${entry.studentId === user?.id ? 'current-user' : ''}`}
                                        >
                                            <span className="rank">#{entry.rank}</span>
                                            <span className="name">{entry.name}</span>
                                            <span className="score" style={{ color: getScoreColor(entry.avgScore) }}>
                                                {entry.avgScore}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Additional Stats */}
                        <div className="additional-stats">
                            <div className="stat-item">
                                <span className="stat-label">📚 Materials Viewed</span>
                                <span className="stat-value">{studentData.overview.materialsViewed}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">🎓 Total Classes</span>
                                <span className="stat-value">{studentData.overview.totalClasses}</span>
                            </div>
                        </div>
                    </>
                )}

                {/* Tutor Analytics */}
                {role === 'tutor' && tutorData && (
                    <>
                        {/* Overview Stats */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon" style={{ color: '#2196F3' }}>👥</div>
                                <div className="stat-info">
                                    <span className="stat-label">Total Students</span>
                                    <span className="stat-value">{tutorData.overview.totalStudents}</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ color: '#4CAF50' }}>📚</div>
                                <div className="stat-info">
                                    <span className="stat-label">Active Classes</span>
                                    <span className="stat-value">{tutorData.overview.activeClasses}/{tutorData.overview.totalClasses}</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ color: '#9C27B0' }}>📝</div>
                                <div className="stat-info">
                                    <span className="stat-label">Assignments</span>
                                    <span className="stat-value">{tutorData.overview.assignmentsCreated}</span>
                                    <span className="stat-subtext">{tutorData.overview.assignmentsGraded} graded</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ color: getScoreColor(tutorData.overview.avgStudentScore) }}>📈</div>
                                <div className="stat-info">
                                    <span className="stat-label">Avg Student Score</span>
                                    <span className="stat-value">{tutorData.overview.avgStudentScore}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Activity Trend */}
                        <div className="analytics-section">
                            <h2>📈 Activity Trend</h2>
                            <div className="trend-chart tutor-trend">
                                {tutorData.trend.map((point, index) => (
                                    <div key={index} className="trend-bar-container">
                                        <div className="trend-stacked-bar">
                                            <div
                                                className="bar-assignments"
                                                style={{ height: `${point.assignmentsCreated * 20}px` }}
                                                title={`${point.assignmentsCreated} assignments`}
                                            />
                                            <div
                                                className="bar-materials"
                                                style={{ height: `${point.materialsUploaded * 20}px` }}
                                                title={`${point.materialsUploaded} materials`}
                                            />
                                        </div>
                                        <span className="bar-label">{point.week}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="trend-legend">
                                <span className="legend-item"><span className="legend-color assignments"></span> Assignments</span>
                                <span className="legend-item"><span className="legend-color materials"></span> Materials</span>
                            </div>
                        </div>

                        {/* Subject Distribution */}
                        {Object.keys(tutorData.subjectDistribution).length > 0 && (
                            <div className="analytics-section">
                                <h2>📊 Subject Distribution</h2>
                                <div className="subject-distribution">
                                    {Object.entries(tutorData.subjectDistribution).map(([subject, count]) => (
                                        <div key={subject} className="subject-item">
                                            <span className="subject-name">{subject}</span>
                                            <span className="subject-count">{count} classes</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Additional Stats */}
                        <div className="additional-stats">
                            <div className="stat-item">
                                <span className="stat-label">📋 Tests Created</span>
                                <span className="stat-value">{tutorData.overview.testsCreated}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">📁 Materials Uploaded</span>
                                <span className="stat-value">{tutorData.overview.materialsUploaded}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">✅ Test Submissions</span>
                                <span className="stat-value">{tutorData.overview.totalTestSubmissions}</span>
                            </div>
                        </div>
                    </>
                )}

                {/* Parent Analytics */}
                {role === 'parent' && parentData && (
                    <>
                        <div className="analytics-section">
                            <h2>👨‍👩‍👧‍👦 Children Overview</h2>
                            {parentData.children.length === 0 ? (
                                <div className="empty-state">
                                    <p>No linked children found. Link your children to view their progress.</p>
                                </div>
                            ) : (
                                <div className="children-grid">
                                    {parentData.children.map((child) => (
                                        <div key={child.studentId} className="child-card">
                                            <h3>{child.studentName}</h3>
                                            <div className="child-stats">
                                                <div className="child-stat">
                                                    <span className="label">Average Score</span>
                                                    <span className="value" style={{ color: getScoreColor(child.avgScore) }}>
                                                        {child.avgScore}%
                                                    </span>
                                                </div>
                                                <div className="child-stat">
                                                    <span className="label">Assignments</span>
                                                    <span className="value">{child.assignmentsCompleted}</span>
                                                </div>
                                                <div className="child-stat">
                                                    <span className="label">Tests</span>
                                                    <span className="value">{child.testsCompleted}</span>
                                                </div>
                                                <div className="child-stat">
                                                    <span className="label">Goals</span>
                                                    <span className="value">{child.goalsCompleted}/{child.totalGoals}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* No Data State */}
                {!studentData && !tutorData && !parentData && (
                    <div className="empty-state">
                        <div className="empty-icon">📊</div>
                        <h3>No Analytics Data</h3>
                        <p>Start using the platform to see your analytics here!</p>
                    </div>
                )}

                <div className="period-info">
                    Showing data for: {formatPeriod(period)}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Analytics;