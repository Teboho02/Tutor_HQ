import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useToast } from '../../../components/Toast';
import { useAuth } from '../../../contexts/AuthContext';
import { studentService } from '../../../services/student.service';
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

const StudentProgress: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
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
        { label: 'Attendance Rate', value: `${attendanceRate}%`, icon: '📅', color: '#5856d6' },
        { label: 'Classes Attended', value: `${presentCount}/${completedClasses.length}`, icon: '✅', color: '#34c759' },
        { label: 'Total Classes', value: `${attendanceHistory.length}`, icon: '📚', color: '#0066ff' },
        { label: 'Subjects', value: `${subjectMap.size}`, icon: '📊', color: '#ff9500' },
    ];

    // Recent activity from attendance
    const recentActivity = attendanceHistory
        .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
        .slice(0, 5)
        .map(record => ({
            type: 'attendance' as const,
            subject: record.subject,
            title: record.title,
            date: new Date(record.scheduledAt).toLocaleDateString('en-ZA', {
                month: 'short', day: 'numeric'
            }),
            status: record.attendanceStatus
        }));

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

                        {/* Progress Chart */}
                        {subjectProgress.length > 0 && (
                            <div className="chart-section">
                                <h2>Attendance by Subject</h2>
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
                                                    <span className={`attendance-badge ${activity.status}`}>
                                                        {activity.status}
                                                    </span>
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
