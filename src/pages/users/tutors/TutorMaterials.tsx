import React, { useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import type { NavigationLink } from '../../../types';
import './TutorMaterials.css';

interface Material {
    id: number;
    title: string;
    type: 'pdf' | 'video' | 'doc' | 'link';
    class: string;
    uploadDate: string;
    downloads: number;
}

interface ScheduledTest {
    id: string;
    title: string;
    class: string;
    date: string;
    totalQuestions: number;
    totalSubmissions: number;
    averageScore: number;
    passRate: number;
    type: 'test' | 'assignment';
}

interface StudentPerformance {
    studentId: string;
    studentName: string;
    score: number;
    submitted: boolean;
    submittedDate?: string;
}

const TutorMaterials: React.FC = () => {
    const [selectedClass, setSelectedClass] = useState<string>('all');
    const [activeTab, setActiveTab] = useState<'materials' | 'tests'>('materials');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedTest, setSelectedTest] = useState<ScheduledTest | null>(null);
    const [showTestModal, setShowTestModal] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        title: '',
        class: '',
        type: 'pdf' as 'pdf' | 'video' | 'doc' | 'link',
        file: null as File | null,
        url: ''
    });
    const [fileName, setFileName] = useState('');

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/tutor/dashboard' },
        { label: 'My Classes', href: '/tutor/classes' },
        { label: 'Schedule', href: '/tutor/schedule' },
        { label: 'Students', href: '/tutor/students' },
        { label: 'Materials', href: '/tutor/materials' },
        { label: 'Account', href: '/tutor/account' },
    ];

    const classes = ['All Classes', 'Mathematics A', 'Physics B', 'Chemistry C'];

    const materials: Material[] = [
        {
            id: 1,
            title: 'Calculus Chapter 5 - Integration Techniques',
            type: 'pdf',
            class: 'Mathematics A',
            uploadDate: '2024-01-15',
            downloads: 45,
        },
        {
            id: 2,
            title: 'Lecture: Advanced Integration Methods',
            type: 'video',
            class: 'Mathematics A',
            uploadDate: '2024-01-14',
            downloads: 38,
        },
        {
            id: 3,
            title: 'Quantum Mechanics Notes',
            type: 'pdf',
            class: 'Physics B',
            uploadDate: '2024-01-13',
            downloads: 52,
        },
        {
            id: 4,
            title: 'Organic Chemistry Reactions Guide',
            type: 'doc',
            class: 'Chemistry C',
            uploadDate: '2024-01-12',
            downloads: 41,
        },
        {
            id: 5,
            title: 'Additional Practice Problems',
            type: 'link',
            class: 'Mathematics A',
            uploadDate: '2024-01-11',
            downloads: 29,
        },
    ];

    const scheduledTests: ScheduledTest[] = [
        {
            id: '1',
            title: 'Chapter 5 Integration Test',
            class: 'Mathematics A',
            date: '2024-01-20',
            totalQuestions: 15,
            totalSubmissions: 12,
            averageScore: 82,
            passRate: 91,
            type: 'test',
        },
        {
            id: '2',
            title: 'Calculus Practice Quiz',
            class: 'Mathematics A',
            date: '2024-01-18',
            totalQuestions: 10,
            totalSubmissions: 15,
            averageScore: 78,
            passRate: 86,
            type: 'test',
        },
        {
            id: '3',
            title: 'Physics Lab Report Assignment',
            class: 'Physics B',
            date: '2024-01-25',
            totalQuestions: 1,
            totalSubmissions: 8,
            averageScore: 85,
            passRate: 100,
            type: 'assignment',
        },
        {
            id: '4',
            title: 'Chemistry Reaction Identification',
            class: 'Chemistry C',
            date: '2024-01-22',
            totalQuestions: 20,
            totalSubmissions: 14,
            averageScore: 79,
            passRate: 78,
            type: 'test',
        },
    ];

    const testPerformanceData: { [testId: string]: StudentPerformance[] } = {
        '1': [
            { studentId: '1', studentName: 'John Doe', score: 88, submitted: true, submittedDate: '2024-01-20' },
            { studentId: '2', studentName: 'Jane Smith', score: 92, submitted: true, submittedDate: '2024-01-20' },
            { studentId: '3', studentName: 'Mike Johnson', score: 75, submitted: true, submittedDate: '2024-01-20' },
            { studentId: '5', studentName: 'Tom Brown', score: 70, submitted: true, submittedDate: '2024-01-20' },
            { studentId: '4', studentName: 'Sarah Williams', score: 95, submitted: true, submittedDate: '2024-01-20' },
        ],
    };

    const filteredMaterials = selectedClass === 'all'
        ? materials
        : materials.filter(m => m.class === selectedClass);

    const filteredTests = selectedClass === 'all'
        ? scheduledTests
        : scheduledTests.filter(t => t.class === selectedClass);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'pdf': return '📄';
            case 'video': return '🎥';
            case 'doc': return '📝';
            case 'link': return '🔗';
            default: return '📁';
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadForm({ ...uploadForm, file });
            setFileName(file.name);
        }
    };

    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!uploadForm.title || !uploadForm.class) {
            alert('Please fill in all required fields!');
            return;
        }

        if (uploadForm.type === 'link' && !uploadForm.url) {
            alert('Please enter a URL for the external link!');
            return;
        }

        if (uploadForm.type !== 'link' && !uploadForm.file) {
            alert('Please select a file to upload!');
            return;
        }

        const fileInfo = uploadForm.file
            ? `File: ${uploadForm.file.name} (${(uploadForm.file.size / 1024).toFixed(2)} KB)`
            : `URL: ${uploadForm.url}`;

        alert(`Material uploaded successfully!\n\nTitle: ${uploadForm.title}\nClass: ${uploadForm.class}\nType: ${uploadForm.type.toUpperCase()}\n${fileInfo}`);

        // Reset form
        setUploadForm({
            title: '',
            class: '',
            type: 'pdf',
            file: null,
            url: ''
        });
        setFileName('');
        setShowUploadModal(false);
    };

    return (
        <div className="tutor-materials-page">
            <Header navigationLinks={navigationLinks} />

            <div className="materials-container">
                <div className="page-header">
                    <div>
                        <h1>Course Materials</h1>
                        <p>Manage and share resources with your students</p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowUploadModal(true)}
                    >
                        + Upload Material
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="tab-navigation">
                    <button
                        className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
                        onClick={() => setActiveTab('materials')}
                    >
                        📚 Course Materials
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'tests' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tests')}
                    >
                        📝 Tests & Assignments
                    </button>
                </div>

                {/* Materials Tab */}
                {activeTab === 'materials' && (
                    <>
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

                        {/* Materials Grid */}
                        <div className="materials-grid">
                            {filteredMaterials.map(material => (
                                <div key={material.id} className="material-card">
                                    <div className="material-header">
                                        <span className="material-icon">{getTypeIcon(material.type)}</span>
                                        <div className="material-type-badge">{material.type.toUpperCase()}</div>
                                    </div>

                                    <h3>{material.title}</h3>

                                    <div className="material-meta">
                                        <span className="class-tag">{material.class}</span>
                                        <div className="material-stats">
                                            <span>📅 {material.uploadDate}</span>
                                            <span>⬇️ {material.downloads} downloads</span>
                                        </div>
                                    </div>

                                    <div className="material-actions">
                                        <button className="btn btn-outline">View</button>
                                        <button className="btn btn-outline">Edit</button>
                                        <button className="btn btn-outline delete">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Tests & Assignments Tab */}
                {activeTab === 'tests' && (
                    <>
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

                        {/* Tests Grid */}
                        <div className="tests-grid">
                            {filteredTests.map(test => (
                                <div key={test.id} className="test-card">
                                    <div className="test-header">
                                        <div>
                                            <h3>{test.title}</h3>
                                            <p className="test-class">{test.class} • {test.date}</p>
                                        </div>
                                        <span className="test-type-badge">{test.type === 'test' ? '📝 Test' : '📋 Assignment'}</span>
                                    </div>

                                    <div className="test-stats">
                                        <div className="stat">
                                            <label>Total Questions</label>
                                            <value>{test.totalQuestions}</value>
                                        </div>
                                        <div className="stat">
                                            <label>Submissions</label>
                                            <value>{test.totalSubmissions}</value>
                                        </div>
                                        <div className="stat">
                                            <label>Avg Score</label>
                                            <value>{test.averageScore}%</value>
                                        </div>
                                        <div className="stat">
                                            <label>Pass Rate</label>
                                            <value>{test.passRate}%</value>
                                        </div>
                                    </div>

                                    <div className="progress-bar-wrapper">
                                        <div className="progress-label">Pass Rate</div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${test.passRate}%`, backgroundColor: test.passRate >= 80 ? '#10b981' : '#f59e0b' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="test-actions">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => {
                                                setSelectedTest(test);
                                                setShowTestModal(true);
                                            }}
                                        >
                                            📊 View Results
                                        </button>
                                        <button className="btn btn-outline">Edit</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Upload Modal */}
                {showUploadModal && (
                    <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Upload Material</h2>
                                <button className="close-btn" onClick={() => setShowUploadModal(false)}>✕</button>
                            </div>

                            <form className="upload-form" onSubmit={handleUploadSubmit}>
                                <div className="form-group">
                                    <label>Title *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Chapter 5 Notes"
                                        value={uploadForm.title}
                                        onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Class *</label>
                                    <select
                                        value={uploadForm.class}
                                        onChange={(e) => setUploadForm({ ...uploadForm, class: e.target.value })}
                                        required
                                    >
                                        <option value="">Select class</option>
                                        {classes.slice(1).map(cls => (
                                            <option key={cls} value={cls}>{cls}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Type</label>
                                    <select
                                        value={uploadForm.type}
                                        onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value as 'pdf' | 'video' | 'doc' | 'link' })}
                                    >
                                        <option value="pdf">PDF Document</option>
                                        <option value="video">Video</option>
                                        <option value="doc">Document</option>
                                        <option value="link">External Link</option>
                                    </select>
                                </div>

                                {uploadForm.type === 'link' ? (
                                    <div className="form-group">
                                        <label>URL *</label>
                                        <input
                                            type="url"
                                            placeholder="https://example.com/resource"
                                            value={uploadForm.url}
                                            onChange={(e) => setUploadForm({ ...uploadForm, url: e.target.value })}
                                            required
                                        />
                                    </div>
                                ) : (
                                    <div className="form-group">
                                        <label>File *</label>
                                        <div className="file-upload">
                                            <input
                                                type="file"
                                                id="file-upload"
                                                onChange={handleFileChange}
                                                accept={uploadForm.type === 'pdf' ? '.pdf' : uploadForm.type === 'video' ? 'video/*' : '.doc,.docx'}
                                            />
                                            <label htmlFor="file-upload" className="file-upload-label">
                                                📎 {fileName || 'Choose File'}
                                            </label>
                                            {fileName && (
                                                <div className="file-preview">
                                                    ✓ Selected: {fileName}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="modal-actions">
                                    <button type="button" className="btn btn-outline" onClick={() => setShowUploadModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Upload
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Test Results Modal */}
                {showTestModal && selectedTest && (
                    <div className="modal-overlay" onClick={() => setShowTestModal(false)}>
                        <div className="test-results-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <div>
                                    <h2>{selectedTest.title}</h2>
                                    <p>{selectedTest.class} • {selectedTest.date}</p>
                                </div>
                                <button className="close-btn" onClick={() => setShowTestModal(false)}>✕</button>
                            </div>

                            <div className="modal-body">
                                <div className="results-summary">
                                    <div className="summary-stat">
                                        <label>Total Submissions</label>
                                        <value>{selectedTest.totalSubmissions}</value>
                                    </div>
                                    <div className="summary-stat">
                                        <label>Average Score</label>
                                        <value>{selectedTest.averageScore}%</value>
                                    </div>
                                    <div className="summary-stat">
                                        <label>Pass Rate</label>
                                        <value>{selectedTest.passRate}%</value>
                                    </div>
                                    <div className="summary-stat">
                                        <label>Questions</label>
                                        <value>{selectedTest.totalQuestions}</value>
                                    </div>
                                </div>

                                <div className="students-results">
                                    <h3>Student Performance</h3>
                                    <table className="results-table">
                                        <thead>
                                            <tr>
                                                <th>Student Name</th>
                                                <th>Score</th>
                                                <th>Status</th>
                                                <th>Submitted Date</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {testPerformanceData[selectedTest.id]?.map(student => (
                                                <tr key={student.studentId}>
                                                    <td>{student.studentName}</td>
                                                    <td>
                                                        <span className={`score-badge ${student.score >= 80 ? 'excellent' : student.score >= 60 ? 'good' : 'needs-work'}`}>
                                                            {student.score}%
                                                        </span>
                                                    </td>
                                                    <td>{student.submitted ? '✅ Submitted' : '⏳ Pending'}</td>
                                                    <td>{student.submittedDate}</td>
                                                    <td>
                                                        <div className="action-links">
                                                            <button className="link-btn">View Answers</button>
                                                            <button className="link-btn">Add Comment</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Tutor Comments Section */}
                                <div className="comments-section">
                                    <h3>Overall Feedback & Comments</h3>
                                    <textarea
                                        placeholder="Add general feedback about this test/assignment for all students..."
                                        rows={4}
                                    />
                                    <button className="btn btn-primary">Save Feedback</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default TutorMaterials;
