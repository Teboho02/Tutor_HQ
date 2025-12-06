import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { OnboardingRequest } from '../../types/admin';
import '../../styles/AdminOnboarding.css';

const AdminOnboarding: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'students' | 'tutors'>('students');
    const [selectedRequest, setSelectedRequest] = useState<OnboardingRequest | null>(null);
    const [actionNotes, setActionNotes] = useState('');

    // Mock data for pending applications
    const [studentRequests, setStudentRequests] = useState<OnboardingRequest[]>([
        {
            id: '1',
            userId: 'pending-s1',
            type: 'student',
            status: 'pending',
            createdAt: new Date('2025-02-10'),
            personalInfo: {
                firstName: 'Thabo',
                lastName: 'Mabaso',
                email: 'thabo.mabaso@email.com',
                phone: '+27 71 234 5678',
                dateOfBirth: new Date('2007-03-15'),
                idNumber: '0703155678089',
                address: '123 Long Street, Cape Town',
            },
            studentInfo: {
                grade: 11,
                school: 'Cape Town High School',
                subjects: ['Mathematics', 'Physical Sciences', 'Life Sciences'],
                learningGoals: 'Improve math and science grades for university entrance'
            },
            documents: [
                {
                    id: 'doc1',
                    type: 'id',
                    name: 'ID_Document.pdf',
                    url: '/documents/id_thabo.pdf',
                    uploadedAt: new Date('2025-02-10'),
                    verified: false
                },
                {
                    id: 'doc2',
                    type: 'report',
                    name: 'Latest_Report_Card.pdf',
                    url: '/documents/report_thabo.pdf',
                    uploadedAt: new Date('2025-02-10'),
                    verified: false
                }
            ]
        },
        {
            id: '2',
            userId: 'pending-s2',
            type: 'student',
            status: 'pending',
            createdAt: new Date('2025-02-11'),
            personalInfo: {
                firstName: 'Lindiwe',
                lastName: 'Nkosi',
                email: 'lindiwe.nkosi@email.com',
                phone: '+27 82 345 6789',
                dateOfBirth: new Date('2009-07-22'),
                idNumber: '0907225678090',
                address: '456 Main Road, Johannesburg',
            },
            studentInfo: {
                grade: 9,
                school: 'Johannesburg Academy',
                subjects: ['English', 'Mathematics', 'Geography'],
                learningGoals: 'Build confidence in mathematics and English writing'
            },
            documents: [
                {
                    id: 'doc3',
                    type: 'id',
                    name: 'ID_Copy.pdf',
                    url: '/documents/id_lindiwe.pdf',
                    uploadedAt: new Date('2025-02-11'),
                    verified: false
                }
            ]
        }
    ]);

    const [tutorRequests, setTutorRequests] = useState<OnboardingRequest[]>([
        {
            id: '3',
            userId: 'pending-t1',
            type: 'tutor',
            status: 'pending',
            createdAt: new Date('2025-02-09'),
            personalInfo: {
                firstName: 'Sipho',
                lastName: 'Dlamini',
                email: 'sipho.dlamini@email.com',
                phone: '+27 83 456 7890',
                dateOfBirth: new Date('1995-11-08'),
                idNumber: '9511085678091',
                address: '789 Oak Avenue, Durban',
            },
            tutorInfo: {
                subjects: ['Mathematics', 'Physical Sciences'],
                grades: [10, 11, 12],
                qualifications: ['BSc Mathematics, University of Cape Town', 'PGCE Secondary Education'],
                experience: '3 years teaching at private high school',
                hourlyRate: 350,
                availability: {
                    monday: [{ start: '14:00', end: '19:00' }],
                    tuesday: [{ start: '14:00', end: '19:00' }],
                    wednesday: [{ start: '14:00', end: '19:00' }],
                    thursday: [{ start: '14:00', end: '19:00' }],
                    friday: [{ start: '14:00', end: '18:00' }],
                    saturday: [{ start: '09:00', end: '13:00' }],
                    sunday: []
                }
            },
            documents: [
                {
                    id: 'doc4',
                    type: 'id',
                    name: 'ID_Document.pdf',
                    url: '/documents/id_sipho.pdf',
                    uploadedAt: new Date('2025-02-09'),
                    verified: false
                },
                {
                    id: 'doc5',
                    type: 'qualification',
                    name: 'BSc_Degree.pdf',
                    url: '/documents/degree_sipho.pdf',
                    uploadedAt: new Date('2025-02-09'),
                    verified: false
                },
                {
                    id: 'doc6',
                    type: 'qualification',
                    name: 'PGCE_Certificate.pdf',
                    url: '/documents/pgce_sipho.pdf',
                    uploadedAt: new Date('2025-02-09'),
                    verified: false
                }
            ]
        }
    ]);

    const handleApprove = (request: OnboardingRequest) => {
        if (request.type === 'student') {
            setStudentRequests(prev => prev.filter(r => r.id !== request.id));
        } else {
            setTutorRequests(prev => prev.filter(r => r.id !== request.id));
        }
        setSelectedRequest(null);
        setActionNotes('');
        alert(`${request.personalInfo.firstName} ${request.personalInfo.lastName} has been approved and will receive a welcome email.`);
    };

    const handleReject = (request: OnboardingRequest) => {
        if (actionNotes.trim() === '') {
            alert('Please provide a reason for rejection.');
            return;
        }
        if (request.type === 'student') {
            setStudentRequests(prev => prev.filter(r => r.id !== request.id));
        } else {
            setTutorRequests(prev => prev.filter(r => r.id !== request.id));
        }
        setSelectedRequest(null);
        setActionNotes('');
        alert(`Application rejected. ${request.personalInfo.firstName} will be notified.`);
    };

    const renderApplicationCard = (request: OnboardingRequest) => (
        <div key={request.id} className="application-card">
            <div className="application-header">
                <div className="applicant-info">
                    <div className="applicant-avatar">
                        {request.personalInfo.firstName[0]}{request.personalInfo.lastName[0]}
                    </div>
                    <div>
                        <h3>{request.personalInfo.firstName} {request.personalInfo.lastName}</h3>
                        <p className="application-date">
                            Applied {request.createdAt.toLocaleDateString('en-ZA')}
                        </p>
                    </div>
                </div>
                <span className={`status-badge ${request.status}`}>
                    {request.status}
                </span>
            </div>

            <div className="application-details">
                <div className="detail-row">
                    <span className="detail-icon">📧</span>
                    <span>{request.personalInfo.email}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-icon">📱</span>
                    <span>{request.personalInfo.phone}</span>
                </div>
                {request.studentInfo && (
                    <>
                        <div className="detail-row">
                            <span className="detail-icon">🏫</span>
                            <span>Grade {request.studentInfo.grade} - {request.studentInfo.school}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-icon">📚</span>
                            <span>{request.studentInfo.subjects.join(', ')}</span>
                        </div>
                    </>
                )}
                {request.tutorInfo && (
                    <>
                        <div className="detail-row">
                            <span className="detail-icon">🎓</span>
                            <span>{request.tutorInfo.subjects.join(', ')} (Grades {request.tutorInfo.grades.join(', ')})</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-icon">💰</span>
                            <span>R{request.tutorInfo.hourlyRate}/hour</span>
                        </div>
                    </>
                )}
                <div className="detail-row">
                    <span className="detail-icon">📎</span>
                    <span>{request.documents?.length || 0} document(s) uploaded</span>
                </div>
            </div>

            <button
                className="review-btn"
                onClick={() => setSelectedRequest(request)}
            >
                Review Application
            </button>
        </div>
    );

    return (
        <div className="admin-onboarding">
            <div className="admin-header">
                <div className="admin-header-content">
                    <div className="admin-logo">
                        <h1>🎓 TutorHQ Admin</h1>
                        <span className="admin-badge">Onboarding</span>
                    </div>
                    <Link to="/admin" className="back-btn">← Back to Dashboard</Link>
                </div>
            </div>

            <div className="admin-main">
                <div className="admin-container">
                    <div className="page-header">
                        <h2>Application Management</h2>
                        <p>Review and approve student and tutor applications</p>
                    </div>

                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === 'students' ? 'active' : ''}`}
                            onClick={() => setActiveTab('students')}
                        >
                            Student Applications
                            {studentRequests.length > 0 && (
                                <span className="tab-badge">{studentRequests.length}</span>
                            )}
                        </button>
                        <button
                            className={`tab ${activeTab === 'tutors' ? 'active' : ''}`}
                            onClick={() => setActiveTab('tutors')}
                        >
                            Tutor Applications
                            {tutorRequests.length > 0 && (
                                <span className="tab-badge">{tutorRequests.length}</span>
                            )}
                        </button>
                    </div>

                    <div className="applications-grid">
                        {activeTab === 'students' && (
                            studentRequests.length > 0 ? (
                                studentRequests.map(renderApplicationCard)
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-icon">✅</div>
                                    <h3>No Pending Student Applications</h3>
                                    <p>All student applications have been reviewed.</p>
                                </div>
                            )
                        )}
                        {activeTab === 'tutors' && (
                            tutorRequests.length > 0 ? (
                                tutorRequests.map(renderApplicationCard)
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-icon">✅</div>
                                    <h3>No Pending Tutor Applications</h3>
                                    <p>All tutor applications have been reviewed.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Application Review Modal */}
            {selectedRequest && (
                <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Review Application</h2>
                            <button
                                className="close-btn"
                                onClick={() => setSelectedRequest(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="applicant-section">
                                <h3>Personal Information</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Full Name</span>
                                        <span className="info-value">
                                            {selectedRequest.personalInfo.firstName} {selectedRequest.personalInfo.lastName}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Email</span>
                                        <span className="info-value">{selectedRequest.personalInfo.email}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Phone</span>
                                        <span className="info-value">{selectedRequest.personalInfo.phone}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">ID Number</span>
                                        <span className="info-value">{selectedRequest.personalInfo.idNumber}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Address</span>
                                        <span className="info-value">{selectedRequest.personalInfo.address}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Date of Birth</span>
                                        <span className="info-value">
                                            {selectedRequest.personalInfo.dateOfBirth.toLocaleDateString('en-ZA')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {selectedRequest.studentInfo && (
                                <div className="applicant-section">
                                    <h3>Academic Information</h3>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <span className="info-label">Grade</span>
                                            <span className="info-value">Grade {selectedRequest.studentInfo.grade}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">School</span>
                                            <span className="info-value">{selectedRequest.studentInfo.school}</span>
                                        </div>
                                        <div className="info-item full-width">
                                            <span className="info-label">Subjects</span>
                                            <span className="info-value">{selectedRequest.studentInfo.subjects.join(', ')}</span>
                                        </div>
                                        <div className="info-item full-width">
                                            <span className="info-label">Learning Goals</span>
                                            <span className="info-value">{selectedRequest.studentInfo.learningGoals}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedRequest.tutorInfo && (
                                <div className="applicant-section">
                                    <h3>Tutor Information</h3>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <span className="info-label">Subjects</span>
                                            <span className="info-value">{selectedRequest.tutorInfo.subjects.join(', ')}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Grades</span>
                                            <span className="info-value">Grades {selectedRequest.tutorInfo.grades.join(', ')}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Hourly Rate</span>
                                            <span className="info-value">R{selectedRequest.tutorInfo.hourlyRate}/hour</span>
                                        </div>
                                        <div className="info-item full-width">
                                            <span className="info-label">Qualifications</span>
                                            <span className="info-value">{selectedRequest.tutorInfo.qualifications.join(' | ')}</span>
                                        </div>
                                        <div className="info-item full-width">
                                            <span className="info-label">Experience</span>
                                            <span className="info-value">{selectedRequest.tutorInfo.experience}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="applicant-section">
                                <h3>Documents</h3>
                                <div className="documents-list">
                                    {selectedRequest.documents?.map(doc => (
                                        <div key={doc.id} className="document-item">
                                            <span className="doc-icon">📄</span>
                                            <div className="doc-info">
                                                <span className="doc-name">{doc.name}</span>
                                                <span className="doc-type">{doc.type}</span>
                                            </div>
                                            <button className="doc-view-btn">View</button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="applicant-section">
                                <h3>Admin Notes</h3>
                                <textarea
                                    className="notes-textarea"
                                    placeholder="Add notes or reason for rejection..."
                                    value={actionNotes}
                                    onChange={(e) => setActionNotes(e.target.value)}
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="reject-btn"
                                onClick={() => handleReject(selectedRequest)}
                            >
                                ❌ Reject Application
                            </button>
                            <button
                                className="approve-btn"
                                onClick={() => handleApprove(selectedRequest)}
                            >
                                ✅ Approve Application
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOnboarding;
