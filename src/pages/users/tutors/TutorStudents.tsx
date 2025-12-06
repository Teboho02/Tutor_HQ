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
}

const TutorStudents: React.FC = () => {
    const [selectedClass, setSelectedClass] = useState<string>('all');

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
        },
        {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            class: 'Mathematics A',
            attendance: 92,
            avgGrade: 92,
            lastActive: '1 day ago',
        },
        {
            id: '3',
            name: 'Mike Johnson',
            email: 'mike@example.com',
            class: 'Physics B',
            attendance: 88,
            avgGrade: 85,
            lastActive: '3 hours ago',
        },
        {
            id: '4',
            name: 'Sarah Williams',
            email: 'sarah@example.com',
            class: 'Chemistry C',
            attendance: 97,
            avgGrade: 94,
            lastActive: '30 mins ago',
        },
        {
            id: '5',
            name: 'Tom Brown',
            email: 'tom@example.com',
            class: 'Mathematics A',
            attendance: 85,
            avgGrade: 78,
            lastActive: '5 hours ago',
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
                                            <button className="btn-icon" title="View Profile">👤</button>
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

            <Footer />
        </div>
    );
};

export default TutorStudents;
