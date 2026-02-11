import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { parentService } from '../../../services/parent.service';
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

interface ChildInfo {
    fullName: string;
    gradeLevel: string;
    avatar: string;
}

const ChildProgress: React.FC = () => {
    const { childId } = useParams<{ childId: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'attendance'>('overview');
    const [loading, setLoading] = useState(true);
    const [childInfo, setChildInfo] = useState<ChildInfo>({ fullName: '', gradeLevel: '', avatar: '' });
    const [classes, setClasses] = useState<ClassInfo[]>([]);

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

                // Fetch child performance (has enrolled classes + attendance)
                const perfRes = await parentService.getChildPerformance(childId);
                if (perfRes.success) {
                    setClasses(perfRes.data.classes || []);
                }
            } catch {
                // Data remains empty
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [childId]);

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
                        {classes.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>No class data available yet.</p>
                        ) : (
                        <div className="two-column-layout">
                            {/* Recent Classes */}
                            <div className="section">
                                <h2>Recent Classes</h2>
                                <div className="tests-list">
                                    {completedClasses.slice(0, 5).map((cls, index) => (
                                        <div key={index} className="test-item">
                                            <div>
                                                <h3>{cls.title}</h3>
                                                <p>{cls.subject} &bull; {new Date(cls.scheduledAt).toLocaleDateString('en-ZA')}</p>
                                            </div>
                                            <span
                                                className="score-badge"
                                                style={{ background: cls.attendanceStatus === 'present' ? '#10b981' : '#ef4444' }}
                                            >
                                                {cls.attendanceStatus === 'present' ? '✓ Present' : '✗ Absent'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Upcoming Classes */}
                            <div className="section">
                                <h2>Upcoming Classes</h2>
                                <div className="assignments-list">
                                    {classes.filter(c => c.status !== 'completed').slice(0, 5).map((cls, index) => (
                                        <div key={index} className="assignment-item">
                                            <div>
                                                <h3>{cls.title}</h3>
                                                <p>{cls.subject} &bull; {new Date(cls.scheduledAt).toLocaleDateString('en-ZA')}</p>
                                            </div>
                                            <span className="status-badge" style={{ background: '#667eea' }}>
                                                Scheduled
                                            </span>
                                        </div>
                                    ))}
                                    {classes.filter(c => c.status !== 'completed').length === 0 && (
                                        <p style={{ color: '#718096' }}>No upcoming classes</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                )}

                {activeTab === 'subjects' && (
                    <div className="tab-content">
                        {subjects.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>No subject data available yet.</p>
                        ) : (
                        <div className="subjects-grid">
                            {subjects.map((subject, index) => (
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
                                    </div>
                                </div>
                            ))}
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
