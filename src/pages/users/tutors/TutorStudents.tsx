import React, { useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import type { NavigationLink } from '../../../types';
import './TutorStudents.css';

interface Student {
    id: string;
    name: string;
    email: string;
    class: string;
    attendance: number;
    avgGrade: number;
    lastActive: string;
    enrollmentDate?: string;
    phone?: string;
    testCount?: number;
    uploadCount?: number;
    achievements?: Achievement[];
    classSchedules?: ClassSchedule[];
}

interface Achievement {
    id: string;
    name: string;
    icon: string;
    unlockedDate?: string;
    description: string;
}

interface ClassSchedule {
    id: string;
    date: string;
    time: string;
    title: string;
    type: 'live' | 'test' | 'assignment';
}

const TutorStudents: React.FC = () => {
    const [selectedClass, setSelectedClass] = useState<string>('all');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [newBadgeName, setNewBadgeName] = useState('');
    const [newBadgeDescription, setNewBadgeDescription] = useState('');

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/tutor/dashboard' },
        { label: 'My Classes', href: '/tutor/classes' },
        { label: 'Schedule', href: '/tutor/schedule' },
        { label: 'Students', href: '/tutor/students' },
        { label: 'Materials', href: '/tutor/materials' },
        { label: 'Account', href: '/tutor/account' },
    ];

    const classes = ['All Students', 'Mathematics A', 'Physics B', 'Chemistry C'];

    const students: Student[] = [
        {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            class: 'Mathematics A',
            attendance: 95,
            avgGrade: 88,
            lastActive: '2 hours ago',
            enrollmentDate: '2023-09-15',
            phone: '+1 234-567-8901',
            testCount: 8,
            uploadCount: 5,
            achievements: [
                { id: '1', name: 'Fast Learner', icon: '⚡', unlockedDate: '2024-01-10', description: 'Completed 5 tests' },
                { id: '2', name: 'Perfect Score', icon: '💯', description: 'Score 100% on a test' },
            ],
            classSchedules: [
                { id: '1', date: '2024-01-20', time: '10:00 AM', title: 'Algebra II', type: 'live' },
                { id: '2', date: '2024-01-22', time: '2:00 PM', title: 'Chapter 5 Test', type: 'test' },
            ],
        },
        {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            class: 'Mathematics A',
            attendance: 92,
            avgGrade: 92,
            lastActive: '1 day ago',
            enrollmentDate: '2023-09-15',
            phone: '+1 234-567-8902',
            testCount: 10,
            uploadCount: 8,
            achievements: [
                { id: '1', name: 'Fast Learner', icon: '⚡', unlockedDate: '2024-01-08', description: 'Completed 5 tests' },
                { id: '2', name: 'Perfect Score', icon: '💯', unlockedDate: '2024-01-15', description: 'Score 100% on a test' },
                { id: '3', name: 'Consistent', icon: '📈', unlockedDate: '2024-01-18', description: 'Over 90% in 3 consecutive tests' },
            ],
            classSchedules: [
                { id: '1', date: '2024-01-20', time: '10:00 AM', title: 'Algebra II', type: 'live' },
            ],
        },
        {
            id: '3',
            name: 'Mike Johnson',
            email: 'mike@example.com',
            class: 'Physics B',
            attendance: 88,
            avgGrade: 85,
            lastActive: '3 hours ago',
            enrollmentDate: '2023-10-01',
            phone: '+1 234-567-8903',
            testCount: 6,
            uploadCount: 4,
            achievements: [
                { id: '1', name: 'Dedication', icon: '🎯', unlockedDate: '2024-01-12', description: '90%+ attendance' },
            ],
            classSchedules: [],
        },
        {
            id: '4',
            name: 'Sarah Williams',
            email: 'sarah@example.com',
            class: 'Chemistry C',
            attendance: 97,
            avgGrade: 94,
            lastActive: '30 mins ago',
            enrollmentDate: '2023-09-01',
            phone: '+1 234-567-8904',
            testCount: 12,
            uploadCount: 10,
            achievements: [
                { id: '1', name: 'Fast Learner', icon: '⚡', unlockedDate: '2024-01-05', description: 'Completed 5 tests' },
                { id: '2', name: 'Perfect Score', icon: '💯', unlockedDate: '2024-01-10', description: 'Score 100% on a test' },
                { id: '3', name: 'Consistent', icon: '📈', unlockedDate: '2024-01-15', description: 'Over 90% in 3 consecutive tests' },
                { id: '4', name: 'Dedication', icon: '🎯', unlockedDate: '2024-01-18', description: '90%+ attendance' },
            ],
            classSchedules: [
                { id: '1', date: '2024-01-20', time: '11:00 AM', title: 'Chemical Reactions', type: 'live' },
                { id: '2', date: '2024-01-23', time: '3:00 PM', title: 'Lab Report Assignment', type: 'assignment' },
            ],
        },
        {
            id: '5',
            name: 'Tom Brown',
            email: 'tom@example.com',
            class: 'Mathematics A',
            attendance: 85,
            avgGrade: 78,
            lastActive: '5 hours ago',
            enrollmentDate: '2023-10-15',
            phone: '+1 234-567-8905',
            testCount: 5,
            uploadCount: 3,
            achievements: [],
            classSchedules: [],
        },
    ];

    const filteredStudents = selectedClass === 'all'
        ? students
        : students.filter(s => s.class.toLowerCase().includes(selectedClass.toLowerCase().split(' ').slice(0, -1).join(' ')));

    return (
        <div className="tutor-students-page">
            <Header navigationLinks={navigationLinks} />

            <div className="students-container">
                <div className="page-header">
                    <div>
                        <h1>My Students</h1>
                        <p>Manage and track student performance</p>
                    </div>
                </div>

                {/* Class Filter */}
                <div className="class-filter">
                    {classes.map((cls, index) => (
                        <button
                            key={index}
                            className={`filter-btn ${selectedClass === (index === 0 ? 'all' : cls) ? 'active' : ''}`}
                            onClick={() => setSelectedClass(index === 0 ? 'all' : cls)}
                        >
                            {cls}
                        </button>
                    ))}
                </div>

                {/* Students Table */}
                <div className="students-table-wrapper">
                    <table className="students-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Class</th>
                                <th>Attendance</th>
                                <th>Avg Grade</th>
                                <th>Last Active</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(student => (
                                <tr key={student.id}>
                                    <td>
                                        <div className="student-cell">
                                            <div className="student-avatar-small">👤</div>
                                            <div>
                                                <div className="student-name">{student.name}</div>
                                                <div className="student-email">{student.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{student.class}</td>
                                    <td>
                                        <div className="progress-cell">
                                            <span>{student.attendance}%</span>
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${student.attendance}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`grade-badge ${student.avgGrade >= 90 ? 'excellent' : student.avgGrade >= 75 ? 'good' : 'average'}`}>
                                            {student.avgGrade}%
                                        </span>
                                    </td>
                                    <td>{student.lastActive}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-icon"
                                                title="View Profile"
                                                onClick={() => {
                                                    setSelectedStudent(student);
                                                    setShowProfileModal(true);
                                                }}
                                            >
                                                👤
                                            </button>
                                            <button className="btn-icon" title="Send Message">💬</button>
                                            <button className="btn-icon" title="View Progress">📊</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Student Profile Modal */}
            {showProfileModal && selectedStudent && (
                <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
                    <div className="student-profile-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Student Profile</h2>
                            <button
                                className="close-btn"
                                onClick={() => setShowProfileModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="modal-tabs">
                            <button className="tab-btn active">Profile</button>
                            <button className="tab-btn">Progress</button>
                            <button className="tab-btn">Classes</button>
                            <button className="tab-btn">Uploads</button>
                            <button className="tab-btn">Achievements</button>
                        </div>

                        {/* Profile Tab */}
                        <div className="modal-content">
                            <div className="profile-section">
                                <div className="profile-header">
                                    <div className="profile-avatar">👤</div>
                                    <div className="profile-info">
                                        <h3>{selectedStudent.name}</h3>
                                        <p className="email">{selectedStudent.email}</p>
                                        <p className="contact">{selectedStudent.phone}</p>
                                    </div>
                                </div>

                                <div className="profile-stats">
                                    <div className="stat">
                                        <label>Class</label>
                                        <value>{selectedStudent.class}</value>
                                    </div>
                                    <div className="stat">
                                        <label>Enrollment Date</label>
                                        <value>{selectedStudent.enrollmentDate}</value>
                                    </div>
                                    <div className="stat">
                                        <label>Attendance</label>
                                        <value>{selectedStudent.attendance}%</value>
                                    </div>
                                    <div className="stat">
                                        <label>Avg Grade</label>
                                        <value>{selectedStudent.avgGrade}%</value>
                                    </div>
                                    <div className="stat">
                                        <label>Tests Taken</label>
                                        <value>{selectedStudent.testCount}</value>
                                    </div>
                                    <div className="stat">
                                        <label>Uploads</label>
                                        <value>{selectedStudent.uploadCount}</value>
                                    </div>
                                </div>

                                <div className="progress-chart">
                                    <h4>Performance Trend</h4>
                                    <div className="mock-chart">
                                        <div className="chart-bar" style={{ height: '40%' }}>50%</div>
                                        <div className="chart-bar" style={{ height: '55%' }}>65%</div>
                                        <div className="chart-bar" style={{ height: '70%' }}>80%</div>
                                        <div className="chart-bar" style={{ height: '85%' }}>88%</div>
                                        <div className="chart-bar" style={{ height: '92%' }}>92%</div>
                                    </div>
                                </div>
                            </div>

                            {/* Achievements Section */}
                            <div className="achievements-section">
                                <h4>Achievements & Badges</h4>
                                <div className="achievements-grid">
                                    {selectedStudent.achievements && selectedStudent.achievements.map(achievement => (
                                        <div key={achievement.id} className="achievement-card unlocked">
                                            <div className="achievement-icon">{achievement.icon}</div>
                                            <div className="achievement-name">{achievement.name}</div>
                                            <div className="achievement-description">{achievement.description}</div>
                                            {achievement.unlockedDate && (
                                                <div className="unlock-date">Unlocked: {achievement.unlockedDate}</div>
                                            )}
                                        </div>
                                    ))}

                                    {/* Locked Achievements */}
                                    <div className="achievement-card locked">
                                        <div className="achievement-icon">🏆</div>
                                        <div className="achievement-name">Top Scorer</div>
                                        <div className="achievement-description">Score 95% or higher</div>
                                    </div>
                                    <div className="achievement-card locked">
                                        <div className="achievement-icon">🌟</div>
                                        <div className="achievement-name">Expert</div>
                                        <div className="achievement-description">Complete 20 tests</div>
                                    </div>
                                </div>

                                {/* Award Badge Form */}
                                <div className="award-badge-section">
                                    <h5>Award Custom Badge</h5>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            placeholder="Badge name (e.g., Excellent Work, Star Student)"
                                            value={newBadgeName}
                                            onChange={(e) => setNewBadgeName(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <textarea
                                            placeholder="Badge description"
                                            value={newBadgeDescription}
                                            onChange={(e) => setNewBadgeDescription(e.target.value)}
                                        />
                                    </div>
                                    <button className="btn-primary">🎁 Award Badge</button>
                                </div>
                            </div>

                            {/* Classes Section */}
                            {selectedStudent.classSchedules && selectedStudent.classSchedules.length > 0 && (
                                <div className="classes-section">
                                    <h4>Scheduled Classes</h4>
                                    <div className="classes-list">
                                        {selectedStudent.classSchedules.map(schedule => (
                                            <div key={schedule.id} className="class-item">
                                                <div className="class-type-icon">
                                                    {schedule.type === 'live' ? '🎥' : schedule.type === 'test' ? '📝' : '📋'}
                                                </div>
                                                <div className="class-details">
                                                    <div className="class-title">{schedule.title}</div>
                                                    <div className="class-time">{schedule.date} at {schedule.time}</div>
                                                </div>
                                                <button className="btn-sm">View</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Comments Section */}
                            <div className="comments-section">
                                <h4>Comments & Notes</h4>
                                <textarea
                                    placeholder="Add notes or comments about this student's progress..."
                                    rows={4}
                                />
                                <button className="btn-primary">Save Notes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default TutorStudents;
