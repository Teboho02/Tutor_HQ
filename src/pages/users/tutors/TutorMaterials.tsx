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

const TutorMaterials: React.FC = () => {
    const [selectedClass, setSelectedClass] = useState<string>('all');
    const [showUploadModal, setShowUploadModal] = useState(false);
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
        { label: 'Messages', href: '/tutor/messages' },
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

    const filteredMaterials = selectedClass === 'all'
        ? materials
        : materials.filter(m => m.class === selectedClass);

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
            </div>

            <Footer />
        </div>
    );
};

export default TutorMaterials;
