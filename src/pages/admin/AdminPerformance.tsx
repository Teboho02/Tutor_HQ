import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { StudentPerformance, ClassPerformance } from '../../types/admin';
import '../../styles/AdminPerformance.css';

const AdminPerformance: React.FC = () => {
    const [viewMode, setViewMode] = useState<'individual' | 'class'>('individual');

    // Mock individual student performance
    const [studentPerformances] = useState<StudentPerformance[]>([
        {
            studentId: 'student1',
            studentName: 'Thabo Mabaso',
            grade: '11',
            overallAverage: 76,
            attendanceRate: 95,
            sessionsCompleted: 42,
            subjects: [
                { name: 'Mathematics', average: 72, trend: 'improving', lastTest: { date: new Date('2025-02-10'), score: 78, maxScore: 100 }, improvement: 12 },
                { name: 'Physical Sciences', average: 78, trend: 'stable', lastTest: { date: new Date('2025-02-08'), score: 76, maxScore: 100 }, improvement: 0 },
                { name: 'Life Sciences', average: 80, trend: 'improving', lastTest: { date: new Date('2025-02-12'), score: 85, maxScore: 100 }, improvement: 8 }
            ],
            flagged: false,
            notes: 'Strong improvement in mathematics'
        },
        {
            studentId: 'student2',
            studentName: 'Lindiwe Nkosi',
            grade: '9',
            overallAverage: 82,
            attendanceRate: 92,
            sessionsCompleted: 28,
            subjects: [
                { name: 'English', average: 85, trend: 'stable', lastTest: { date: new Date('2025-02-11'), score: 84, maxScore: 100 }, improvement: 0 },
                { name: 'Mathematics', average: 80, trend: 'improving', lastTest: { date: new Date('2025-02-09'), score: 86, maxScore: 100 }, improvement: 10 },
                { name: 'Geography', average: 82, trend: 'stable', lastTest: { date: new Date('2025-02-13'), score: 80, maxScore: 100 }, improvement: -2 }
            ],
            flagged: false,
            notes: 'Consistent performer'
        },
        {
            studentId: 'student3',
            studentName: 'Sipho Khumalo',
            grade: '12',
            overallAverage: 65,
            attendanceRate: 78,
            sessionsCompleted: 15,
            subjects: [
                { name: 'Accounting', average: 62, trend: 'declining', lastTest: { date: new Date('2025-02-07'), score: 58, maxScore: 100 }, improvement: -8 },
                { name: 'Business Studies', average: 68, trend: 'stable', lastTest: { date: new Date('2025-02-08'), score: 70, maxScore: 100 }, improvement: 2 },
                { name: 'Economics', average: 65, trend: 'declining', lastTest: { date: new Date('2025-02-06'), score: 60, maxScore: 100 }, improvement: -10 }
            ],
            flagged: true,
            notes: 'Low attendance, needs intervention'
        }
    ]);

    // Mock class performance
    const [classPerformances] = useState<ClassPerformance[]>([
        {
            subject: 'Mathematics',
            grade: '11',
            averageGrade: 74,
            totalStudents: 15,
            attendanceRate: 88,
            tutorName: 'Sipho Dlamini',
            sessionCount: 24,
            studentsAbove80: 5,
            studentsBelow50: 2,
            topPerformer: { studentId: 'student5', studentName: 'Amahle Zulu', grade: 92 },
            needsAttention: [
                { studentId: 'student6', studentName: 'Bongani Sithole', grade: 45 }
            ]
        },
        {
            subject: 'Physical Sciences',
            grade: '11-12',
            averageGrade: 68,
            totalStudents: 20,
            attendanceRate: 85,
            tutorName: 'Nomsa Shabalala',
            sessionCount: 32,
            studentsAbove80: 6,
            studentsBelow50: 4,
            topPerformer: { studentId: 'student7', studentName: 'Thandeka Dube', grade: 88 },
            needsAttention: [
                { studentId: 'student8', studentName: 'Mandla Ngcobo', grade: 42 },
                { studentId: 'student9', studentName: 'Nandi Khumalo', grade: 48 }
            ]
        },
        {
            subject: 'English',
            grade: '9-10',
            averageGrade: 79,
            totalStudents: 12,
            attendanceRate: 92,
            tutorName: 'Thandi Ndlovu',
            sessionCount: 18,
            studentsAbove80: 7,
            studentsBelow50: 0,
            topPerformer: { studentId: 'student2', studentName: 'Lindiwe Nkosi', grade: 85 },
            needsAttention: []
        }
    ]);

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'improving': return '📈';
            case 'declining': return '📉';
            case 'stable': return '➡️';
            default: return '➡️';
        }
    };

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case 'improving': return '#10b981';
            case 'declining': return '#ef4444';
            case 'stable': return '#6b7280';
            default: return '#6b7280';
        }
    };

    return (
        <div className="admin-performance">
            <div className="admin-header">
                <div className="admin-header-content">
                    <div className="admin-logo">
                        <h1>🎓 TutorHQ Admin</h1>
                        <span className="admin-badge">Performance</span>
                    </div>
                    <Link to="/admin" className="back-btn">← Back to Dashboard</Link>
                </div>
            </div>

            <div className="admin-main">
                <div className="admin-container">
                    <div className="page-header">
                        <h2>Performance Analytics</h2>
                        <p>Track student progress and class effectiveness</p>
                    </div>

                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'individual' ? 'active' : ''}`}
                            onClick={() => setViewMode('individual')}
                        >
                            👤 Individual Students
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'class' ? 'active' : ''}`}
                            onClick={() => setViewMode('class')}
                        >
                            👥 Class Performance
                        </button>
                    </div>

                    {viewMode === 'individual' && (
                        <div className="students-section">
                            {studentPerformances.map(student => (
                                <div key={student.studentId} className={`performance-card ${student.flagged ? 'flagged' : ''}`}>
                                    {student.flagged && <div className="flag-banner">⚠️ Needs Attention</div>}

                                    <div className="card-header">
                                        <div className="student-info">
                                            <div className="student-avatar">
                                                {student.studentName.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <h3>{student.studentName}</h3>
                                                <p>Grade {student.grade}</p>
                                            </div>
                                        </div>
                                        <div className="overall-grade">
                                            <div className="grade-value">{student.overallAverage}%</div>
                                            <div className="grade-label">Overall</div>
                                        </div>
                                    </div>

                                    <div className="stats-grid">
                                        <div className="stat">
                                            <div className="stat-icon">📊</div>
                                            <div>
                                                <div className="stat-value">{student.overallAverage}%</div>
                                                <div className="stat-label">Average</div>
                                            </div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-icon">✅</div>
                                            <div>
                                                <div className="stat-value">{student.attendanceRate}%</div>
                                                <div className="stat-label">Attendance</div>
                                            </div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-icon">📚</div>
                                            <div>
                                                <div className="stat-value">{student.sessionsCompleted}</div>
                                                <div className="stat-label">Sessions</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="subjects-section">
                                        <h4>Subject Performance</h4>
                                        {student.subjects.map(subject => (
                                            <div key={subject.name} className="subject-row">
                                                <div className="subject-name">{subject.name}</div>
                                                <div className="subject-stats">
                                                    <span className="subject-average">{subject.average}%</span>
                                                    <span
                                                        className="subject-trend"
                                                        style={{ color: getTrendColor(subject.trend) }}
                                                    >
                                                        {getTrendIcon(subject.trend)} {subject.trend}
                                                    </span>
                                                    <span className="subject-last">
                                                        Last: {subject.lastTest ? `${subject.lastTest.score}%` : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {student.notes && (
                                        <div className="notes-section">
                                            <strong>Notes:</strong> {student.notes}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {viewMode === 'class' && (
                        <div className="classes-section">
                            {classPerformances.map((classPerf, index) => (
                                <div key={index} className="class-card">
                                    <div className="class-header">
                                        <div>
                                            <h3>{classPerf.subject}</h3>
                                            <p>Grade {classPerf.grade} • {classPerf.tutorName}</p>
                                        </div>
                                        <div className="class-average">
                                            <div className="average-value">{classPerf.averageGrade}%</div>
                                            <div className="average-label">Class Avg</div>
                                        </div>
                                    </div>

                                    <div className="class-stats">
                                        <div className="class-stat">
                                            <div className="stat-label">Total Students</div>
                                            <div className="stat-value">{classPerf.totalStudents}</div>
                                        </div>
                                        <div className="class-stat">
                                            <div className="stat-label">Sessions</div>
                                            <div className="stat-value">{classPerf.sessionCount}</div>
                                        </div>
                                        <div className="class-stat">
                                            <div className="stat-label">Attendance</div>
                                            <div className="stat-value">{classPerf.attendanceRate}%</div>
                                        </div>
                                        <div className="class-stat">
                                            <div className="stat-label">Above 80%</div>
                                            <div className="stat-value">{classPerf.studentsAbove80}</div>
                                        </div>
                                    </div>

                                    <div className="performance-breakdown">
                                        <div className="top-performer">
                                            <div className="performer-label">🏆 Top Performer</div>
                                            <div className="performer-name">{classPerf.topPerformer.studentName}</div>
                                            <div className="performer-grade">{classPerf.topPerformer.grade}%</div>
                                        </div>

                                        {classPerf.needsAttention.length > 0 && (
                                            <div className="needs-attention">
                                                <div className="attention-label">⚠️ Needs Attention</div>
                                                {classPerf.needsAttention.map(student => (
                                                    <div key={student.studentId} className="attention-student">
                                                        <span>{student.studentName}</span>
                                                        <span className="attention-grade">{student.grade}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPerformance;
