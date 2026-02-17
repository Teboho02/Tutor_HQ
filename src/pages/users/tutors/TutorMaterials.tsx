import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useToast } from '../../../components/Toast';
import { materialService } from '../../../services/material.service';
import type { Material as MaterialType } from '../../../services/material.service';
import { classService } from '../../../services/class.service';
import { testService } from '../../../services/test.service';
import type { NavigationLink } from '../../../types';
import './TutorMaterials.css';

interface ClassOption {
    id: string;
    title: string;
    subject: string;
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
    const { showToast } = useToast();
    const [selectedClass, setSelectedClass] = useState<string>('all');
    const [activeTab, setActiveTab] = useState<'materials' | 'tests'>('materials');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedTest, setSelectedTest] = useState<ScheduledTest | null>(null);
    const [showTestModal, setShowTestModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('');
    const [materials, setMaterials] = useState<MaterialType[]>([]);
    const [classes, setClasses] = useState<ClassOption[]>([]);
    const [scheduledTests, setScheduledTests] = useState<ScheduledTest[]>([]);
    const [testPerformanceData, setTestPerformanceData] = useState<{ [testId: string]: StudentPerformance[] }>({});
    const [uploadForm, setUploadForm] = useState({
        title: '',
        classId: '',
        description: '',
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

    // Fetch materials and classes on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch materials
                const materialsResponse = await materialService.getTutorMaterials();
                if (materialsResponse.success) {
                    setMaterials(materialsResponse.data.materials);
                }

                // Fetch classes for filter and upload
                const classesResponse = await classService.listClasses();
                if (classesResponse.success) {
                    interface ClassItem {
                        id: string;
                        title: string;
                        subject: string;
                    }
                    setClasses(classesResponse.data.classes.map((c: ClassItem) => ({
                        id: c.id,
                        title: c.title,
                        subject: c.subject
                    })));
                }

                // Fetch tests
                const testsResponse = await testService.getTutorTests();
                if (testsResponse.success && testsResponse.data.tests) {
                    interface TestResult {
                        id: string;
                        score: number | null;
                        percentage: number | null;
                        status: string;
                    }
                    interface RawTest {
                        id: string;
                        title: string;
                        description: string;
                        status: string;
                        total_marks: number;
                        passing_marks: number;
                        scheduled_at: string;
                        due_date: string;
                        questions: Array<Record<string, unknown>> | null;
                        classes: { id: string; title: string; subject: string } | null;
                        test_results: TestResult[];
                    }
                    const mapped: ScheduledTest[] = testsResponse.data.tests.map((t: RawTest) => {
                        const results = t.test_results || [];
                        const graded = results.filter((r: TestResult) => r.status === 'graded');
                        const avgScore = graded.length > 0
                            ? Math.round(graded.reduce((sum: number, r: TestResult) => sum + (r.percentage || 0), 0) / graded.length)
                            : 0;
                        const passRate = graded.length > 0
                            ? Math.round(graded.filter((r: TestResult) => (r.score || 0) >= (t.passing_marks || 0)).length / graded.length * 100)
                            : 0;
                        return {
                            id: t.id,
                            title: t.title,
                            class: t.classes?.title || 'Unknown',
                            date: new Date(t.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                            totalQuestions: t.questions?.length || 0,
                            totalSubmissions: results.length,
                            averageScore: avgScore,
                            passRate: passRate,
                            type: 'test' as const,
                        };
                    });
                    setScheduledTests(mapped);

                    // Build performance data per test
                    const perfData: { [testId: string]: StudentPerformance[] } = {};
                    testsResponse.data.tests.forEach((t: RawTest) => {
                        perfData[t.id] = (t.test_results || []).map((r: TestResult) => ({
                            studentId: (r as TestResult & { student_id?: string }).student_id || r.id,
                            studentName: 'Student',
                            score: r.percentage || 0,
                            submitted: true,
                            submittedDate: undefined,
                        }));
                    });
                    setTestPerformanceData(perfData);
                }
            } catch (error: unknown) {
                const err = error as { response?: { data?: { message?: string } } };
                showToast(err.response?.data?.message || 'Failed to load materials', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [showToast]);

    const classOptions = ['All Classes', ...classes.map(c => c.title)];

    const filteredMaterials = selectedClass === 'all'
        ? materials
        : materials.filter(m => m.classes?.title === selectedClass);

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

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!uploadForm.title || !uploadForm.classId) {
            showToast('Please fill in all required fields!', 'error');
            return;
        }

        if (uploadForm.type === 'link' && !uploadForm.url) {
            showToast('Please enter a URL for the external link!', 'error');
            return;
        }

        if (uploadForm.type !== 'link' && !uploadForm.file) {
            showToast('Please select a file to upload!', 'error');
            return;
        }

        try {
            setUploading(true);
            setUploadProgress(0);
            setUploadStatus('');

            let fileUrl = '';
            let fileSize = 0;

            // Upload file if not a link
            if (uploadForm.type !== 'link' && uploadForm.file) {
                const isVideo = uploadForm.file.type.startsWith('video/');
                if (isVideo) {
                    setUploadStatus('Uploading video — the server will compress it automatically. This may take a few minutes for long videos...');
                }

                const uploadResponse = await materialService.uploadFile(
                    uploadForm.file,
                    (percent) => setUploadProgress(percent)
                );
                if (uploadResponse.success) {
                    fileUrl = uploadResponse.data.fileUrl;
                    fileSize = uploadResponse.data.compression
                        ? uploadResponse.data.compression.compressedSize
                        : uploadForm.file.size;

                    // Show compression results
                    if (uploadResponse.data.compression && !uploadResponse.data.compression.skipped) {
                        const c = uploadResponse.data.compression;
                        const origMB = (c.originalSize / 1024 / 1024).toFixed(1);
                        const compMB = (c.compressedSize / 1024 / 1024).toFixed(1);
                        showToast(`Video compressed: ${origMB} MB → ${compMB} MB (${c.ratio} smaller)`, 'success');
                    }
                }
            }

            // Create material record
            const materialData = {
                title: uploadForm.title,
                description: uploadForm.description,
                classId: uploadForm.classId,
                type: uploadForm.type,
                fileUrl: uploadForm.type === 'link' ? undefined : fileUrl,
                fileName: uploadForm.file?.name,
                fileSize: fileSize,
                externalUrl: uploadForm.type === 'link' ? uploadForm.url : undefined,
            };

            const response = await materialService.createMaterial(materialData);

            if (response.success) {
                showToast('Material uploaded successfully!', 'success');

                // Add to local state
                setMaterials(prev => [response.data.material, ...prev]);

                // Reset form
                setUploadForm({
                    title: '',
                    classId: '',
                    description: '',
                    type: 'pdf',
                    file: null,
                    url: ''
                });
                setFileName('');
                setShowUploadModal(false);
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            showToast(err.response?.data?.message || 'Failed to upload material', 'error');
        } finally {
            setUploading(false);
            setUploadProgress(0);
            setUploadStatus('');
        }
    };

    const handleDeleteMaterial = async (materialId: string) => {
        if (!window.confirm('Are you sure you want to delete this material?')) return;

        try {
            const response = await materialService.deleteMaterial(materialId);
            if (response.success) {
                setMaterials(prev => prev.filter(m => m.id !== materialId));
                showToast('Material deleted successfully', 'success');
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            showToast(err.response?.data?.message || 'Failed to delete material', 'error');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="tutor-materials-page">
                <Header navigationLinks={navigationLinks} />
                <LoadingSpinner />
                <Footer />
            </div>
        );
    }

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
                            {classOptions.map((cls, index) => (
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
                            {filteredMaterials.length === 0 ? (
                                <div className="empty-state">
                                    <p>No materials uploaded yet. Click "Upload Material" to get started.</p>
                                </div>
                            ) : (
                                filteredMaterials.map(material => (
                                    <div key={material.id} className="material-card">
                                        <div className="material-header">
                                            <span className="material-icon">{getTypeIcon(material.type)}</span>
                                            <div className="material-type-badge">{material.type.toUpperCase()}</div>
                                        </div>

                                        <h3>{material.title}</h3>
                                        {material.description && (
                                            <p className="material-description">{material.description}</p>
                                        )}

                                        <div className="material-meta">
                                            <span className="class-tag">{material.classes?.title || 'Unknown Class'}</span>
                                            <div className="material-stats">
                                                <span>📅 {formatDate(material.created_at)}</span>
                                                <span>⬇️ {material.downloads} downloads</span>
                                            </div>
                                        </div>

                                        <div className="material-actions">
                                            {material.file_url && (
                                                <a href={material.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">View</a>
                                            )}
                                            {material.external_url && (
                                                <a href={material.external_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">Open Link</a>
                                            )}
                                            <button className="btn btn-outline delete" onClick={() => handleDeleteMaterial(material.id)}>Delete</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}

                {/* Tests & Assignments Tab */}
                {activeTab === 'tests' && (
                    <>
                        {/* Class Filter */}
                        <div className="class-filter">
                            {classOptions.map((cls, index) => (
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
                                            <span className="value">{test.totalQuestions}</span>
                                        </div>
                                        <div className="stat">
                                            <label>Submissions</label>
                                            <span className="value">{test.totalSubmissions}</span>
                                        </div>
                                        <div className="stat">
                                            <label>Avg Score</label>
                                            <span className="value">{test.averageScore}%</span>
                                        </div>
                                        <div className="stat">
                                            <label>Pass Rate</label>
                                            <span className="value">{test.passRate}%</span>
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
                                        value={uploadForm.classId}
                                        onChange={(e) => setUploadForm({ ...uploadForm, classId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select class</option>
                                        {classes.map(cls => (
                                            <option key={cls.id} value={cls.id}>{cls.title} - {cls.subject}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        placeholder="Brief description of the material..."
                                        value={uploadForm.description}
                                        onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                                        rows={3}
                                    />
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
                                    <button type="submit" className="btn btn-primary" disabled={uploading}>
                                        {uploading
                                            ? uploadProgress < 100
                                                ? `Uploading ${uploadProgress}%`
                                                : 'Compressing & saving...'
                                            : 'Upload'
                                        }
                                    </button>
                                    {uploading && uploadStatus && (
                                        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                                            {uploadStatus}
                                        </p>
                                    )}
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
                                        <span className="value">{selectedTest.totalSubmissions}</span>
                                    </div>
                                    <div className="summary-stat">
                                        <label>Average Score</label>
                                        <span className="value">{selectedTest.averageScore}%</span>
                                    </div>
                                    <div className="summary-stat">
                                        <label>Pass Rate</label>
                                        <span className="value">{selectedTest.passRate}%</span>
                                    </div>
                                    <div className="summary-stat">
                                        <label>Questions</label>
                                        <span className="value">{selectedTest.totalQuestions}</span>
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
