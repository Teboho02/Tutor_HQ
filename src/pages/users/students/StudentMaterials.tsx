import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useToast } from '../../../components/Toast';
import { useAuth } from '../../../contexts/AuthContext';
import { materialService } from '../../../services/material.service';
import type { Material as APIMaterial } from '../../../services/material.service';
import type { NavigationLink } from '../../../types';
import './StudentMaterials.css';

interface UploadedTestScore {
    id: string;
    testName: string;
    subject: string;
    score?: number;
    maxScore?: number;
    imageUrl: string;
    uploadedDate: string;
    notes?: string;
}

const StudentMaterials: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [selectedSubject, setSelectedSubject] = useState<string>('All');
    const [activeTab, setActiveTab] = useState<'notes' | 'videos' | 'grades' | 'upload'>('notes');
    const [selectedMaterial, setSelectedMaterial] = useState<APIMaterial | null>(null);
    const [loading, setLoading] = useState(true);
    const [materials, setMaterials] = useState<APIMaterial[]>([]);
    const [uploadedScores, setUploadedScores] = useState<UploadedTestScore[]>([]);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        testName: '',
        subject: 'Mathematics',
        score: '',
        maxScore: '100',
        notes: '',
        imageFile: null as File | null
    });

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/student/dashboard' },
        { label: 'Calendar', href: '/student/calendar' },
        { label: 'Materials', href: '/student/materials' },
        { label: 'Progress', href: '/student/progress' },
        { label: 'Tests', href: '/student/tests' },
        { label: 'Goals', href: '/student/goals' },
    ];

    const subjects = [
        { name: 'All', icon: '📚', color: '#333' },
        { name: 'Mathematics', icon: '🔢', color: '#0066ff' },
        { name: 'Physics', icon: '⚛️', color: '#5856d6' },
        { name: 'Chemistry', icon: '🧪', color: '#34c759' },
        { name: 'Biology', icon: '🧬', color: '#ff9500' },
        { name: 'English', icon: '📖', color: '#ff3b30' },
        { name: 'History', icon: '🏛️', color: '#af52de' },
    ];

    // Fetch materials on mount
    useEffect(() => {
        const fetchMaterials = async () => {
            if (!user?.id) return;

            try {
                setLoading(true);
                const response = await materialService.getStudentMaterials(user.id);
                if (response.success) {
                    setMaterials(response.data.materials);
                }
            } catch (error: unknown) {
                const err = error as { response?: { data?: { error?: string } } };
                showToast(err.response?.data?.error || 'Failed to load materials', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchMaterials();
    }, [user, showToast]);

    // Filter materials by subject and type
    const filteredMaterials = materials.filter(m => {
        if (selectedSubject !== 'All' && m.classes?.subject !== selectedSubject) {
            return false;
        }
        return true;
    });

    const notesMaterials = filteredMaterials.filter(m => ['pdf', 'doc', 'slides'].includes(m.type));
    const videoMaterials = filteredMaterials.filter(m => ['video', 'audio'].includes(m.type));

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleDownload = async (material: APIMaterial) => {
        try {
            await materialService.trackDownload(material.id);
            if (material.file_url) {
                window.open(material.file_url, '_blank');
            } else if (material.external_url) {
                window.open(material.external_url, '_blank');
            }
        } catch {
            // Still allow viewing even if tracking fails
            if (material.file_url) {
                window.open(material.file_url, '_blank');
            }
        }
    };

    const getTypeIcon = (type: string) => {
        const icons: Record<string, string> = {
            pdf: '📄',
            video: '📹',
            doc: '📝',
            link: '🔗',
            image: '🖼️',
            audio: '🎵',
            slides: '📊'
        };
        return icons[type] || '📁';
    };

    if (loading) {
        return (
            <div className="student-materials-page">
                <Header navigationLinks={navigationLinks} />
                <LoadingSpinner />
                <Footer />
            </div>
        );
    }

    return (
        <div className="student-materials-page">
            <Header navigationLinks={navigationLinks} />

            <div className="materials-container">
                <div className="page-header">
                    <h1>Course Materials</h1>
                    <p>Access notes, videos, and track your grades</p>
                </div>

                {/* Subject Selection */}
                <div className="subjects-grid">
                    {subjects.map((subject) => (
                        <button
                            key={subject.name}
                            className={`subject-card ${selectedSubject === subject.name ? 'active' : ''}`}
                            onClick={() => setSelectedSubject(subject.name)}
                            style={{ borderColor: selectedSubject === subject.name ? subject.color : 'transparent' }}
                        >
                            <span className="subject-icon" style={{ color: subject.color }}>
                                {subject.icon}
                            </span>
                            <span className="subject-name">{subject.name}</span>
                        </button>
                    ))}
                </div>

                {/* Content Tabs */}
                <div className="content-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notes')}
                    >
                        📄 Notes ({notesMaterials.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('videos')}
                    >
                        📹 Videos ({videoMaterials.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        📸 School Tests ({uploadedScores.length})
                    </button>
                </div>

                {/* Content Area */}
                <div className="materials-content">
                    {/* Notes Tab */}
                    {activeTab === 'notes' && (
                        <div className="materials-list">
                            {notesMaterials.length > 0 ? (
                                notesMaterials.map((material) => (
                                    <div key={material.id} className="material-card">
                                        <div className="material-icon">{getTypeIcon(material.type)}</div>
                                        <div className="material-info">
                                            <h3>{material.title}</h3>
                                            <p>{material.description || 'No description'}</p>
                                            <div className="material-meta">
                                                <span>📅 {formatDate(material.created_at)}</span>
                                                <span>📦 {materialService.formatFileSize(material.file_size)}</span>
                                                <span className="class-tag">{material.classes?.title}</span>
                                            </div>
                                        </div>
                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => handleDownload(material)}
                                            title="Click to view/download"
                                        >
                                            View
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <span className="empty-icon">📄</span>
                                    <p>No notes available{selectedSubject !== 'All' ? ` for ${selectedSubject}` : ''}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Videos Tab */}
                    {activeTab === 'videos' && (
                        <div className="materials-list">
                            {videoMaterials.length > 0 ? (
                                videoMaterials.map((video) => (
                                    <div key={video.id} className="material-card">
                                        <div className="material-icon video-icon">{getTypeIcon(video.type)}</div>
                                        <div className="material-info">
                                            <h3>{video.title}</h3>
                                            <p>{video.description || 'No description'}</p>
                                            <div className="material-meta">
                                                <span>📅 {formatDate(video.created_at)}</span>
                                                {video.duration && <span>⏱️ {materialService.formatDuration(video.duration)}</span>}
                                                <span className="class-tag">{video.classes?.title}</span>
                                            </div>
                                        </div>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleDownload(video)}
                                        >
                                            Watch
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <span className="empty-icon">📹</span>
                                    <p>No videos available{selectedSubject !== 'All' ? ` for ${selectedSubject}` : ''}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Upload Tab */}
                    {activeTab === 'upload' && (
                        <div className="upload-section">
                            <div className="upload-header">
                                <h3>School Test Scores</h3>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setShowUploadForm(!showUploadForm)}
                                >
                                    {showUploadForm ? '✕ Cancel' : '➕ Upload Test Score'}
                                </button>
                            </div>

                            {showUploadForm && (
                                <div className="upload-form">
                                    <h4>Upload School Test Score Image</h4>
                                    <div className="form-group">
                                        <label htmlFor="testName">Test Name *</label>
                                        <input
                                            type="text"
                                            id="testName"
                                            placeholder="e.g., School Midterm Exam"
                                            value={uploadForm.testName}
                                            onChange={(e) => setUploadForm({ ...uploadForm, testName: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="testSubject">Subject</label>
                                            <select
                                                id="testSubject"
                                                value={uploadForm.subject}
                                                onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                                            >
                                                <option value="Mathematics">Mathematics</option>
                                                <option value="Physics">Physics</option>
                                                <option value="Chemistry">Chemistry</option>
                                                <option value="Biology">Biology</option>
                                                <option value="English">English</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="testScore">Score (Optional)</label>
                                            <input
                                                type="number"
                                                id="testScore"
                                                placeholder="e.g., 92"
                                                value={uploadForm.score}
                                                onChange={(e) => setUploadForm({ ...uploadForm, score: e.target.value })}
                                                min="0"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="maxScore">Max Score</label>
                                            <input
                                                type="number"
                                                id="maxScore"
                                                placeholder="e.g., 100"
                                                value={uploadForm.maxScore}
                                                onChange={(e) => setUploadForm({ ...uploadForm, maxScore: e.target.value })}
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="testNotes">Notes (Optional)</label>
                                        <textarea
                                            id="testNotes"
                                            placeholder="Add any notes about this test..."
                                            value={uploadForm.notes}
                                            onChange={(e) => setUploadForm({ ...uploadForm, notes: e.target.value })}
                                            rows={3}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="imageUpload">Upload Image * (JPG, PNG, PDF)</label>
                                        <div className="file-input-wrapper">
                                            <input
                                                type="file"
                                                id="imageUpload"
                                                accept=".jpg,.jpeg,.png,.pdf"
                                                onChange={(e) => setUploadForm({ ...uploadForm, imageFile: e.target.files?.[0] || null })}
                                            />
                                            <span className="file-label">
                                                {uploadForm.imageFile ? uploadForm.imageFile.name : 'Click to select image'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => {
                                                if (uploadForm.testName && uploadForm.imageFile) {
                                                    const newScore: UploadedTestScore = {
                                                        id: Date.now().toString(),
                                                        testName: uploadForm.testName,
                                                        subject: uploadForm.subject,
                                                        score: uploadForm.score ? parseInt(uploadForm.score) : undefined,
                                                        maxScore: uploadForm.maxScore ? parseInt(uploadForm.maxScore) : undefined,
                                                        imageUrl: URL.createObjectURL(uploadForm.imageFile),
                                                        uploadedDate: 'Just now',
                                                        notes: uploadForm.notes
                                                    };
                                                    setUploadedScores([newScore, ...uploadedScores]);
                                                    setUploadForm({
                                                        testName: '',
                                                        subject: selectedSubject,
                                                        score: '',
                                                        maxScore: '100',
                                                        notes: '',
                                                        imageFile: null
                                                    });
                                                    setShowUploadForm(false);
                                                } else {
                                                    alert('Please fill in test name and select an image');
                                                }
                                            }}
                                        >
                                            Upload
                                        </button>
                                        <button
                                            className="btn"
                                            onClick={() => setShowUploadForm(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="uploaded-scores-list">
                                {uploadedScores.length > 0 ? (
                                    uploadedScores.map((score) => (
                                        <div key={score.id} className="score-card">
                                            <div className="score-image">
                                                <img src={score.imageUrl} alt={score.testName} />
                                            </div>
                                            <div className="score-info">
                                                <h4>{score.testName}</h4>
                                                <div className="score-meta">
                                                    <span className="badge">{score.subject}</span>
                                                    <span className="date">📅 {score.uploadedDate}</span>
                                                </div>
                                                {score.score !== undefined && (
                                                    <div className="score-value">
                                                        Score: <strong>{score.score}/{score.maxScore || 100}</strong>
                                                    </div>
                                                )}
                                                {score.notes && (
                                                    <p className="score-notes">{score.notes}</p>
                                                )}
                                            </div>
                                            <button
                                                className="delete-btn"
                                                onClick={() => setUploadedScores(uploadedScores.filter(s => s.id !== score.id))}
                                                title="Delete this upload"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <span className="empty-icon">📸</span>
                                        <p>No school test scores uploaded yet</p>
                                        <small>Upload images of your school test scores so tutors can track your progress</small>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Material Viewer Modal */}
            {selectedMaterial && (
                <div className="modal-overlay" onClick={() => setSelectedMaterial(null)}>
                    <div className="modal-content material-viewer" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedMaterial.title}</h2>
                            <button className="modal-close" onClick={() => setSelectedMaterial(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="material-preview">
                                <div className="preview-icon">{getTypeIcon(selectedMaterial.type)}</div>
                                <h3>{selectedMaterial.title}</h3>
                                <p>{selectedMaterial.description}</p>
                                <div className="material-details">
                                    <span>📅 {formatDate(selectedMaterial.created_at)}</span>
                                    {selectedMaterial.file_size && <span>📦 {materialService.formatFileSize(selectedMaterial.file_size)}</span>}
                                    {selectedMaterial.duration && <span>⏱️ {materialService.formatDuration(selectedMaterial.duration)}</span>}
                                </div>
                                <p className="note-text">Screenshots are allowed for studying purposes.</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary" onClick={() => handleDownload(selectedMaterial)}>
                                {selectedMaterial.type === 'video' ? 'Watch' : 'Download'}
                            </button>
                            <button className="btn" onClick={() => setSelectedMaterial(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default StudentMaterials;
