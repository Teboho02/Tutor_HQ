import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Toast from '../../../components/Toast';
import { tutorService } from '../../../services/tutor.service';
import CalendarPicker from '../../../components/CalendarPicker';
import { classService } from '../../../services/class.service';
import type { NavigationLink } from '../../../types';
import './TutorOnboarding.css';

interface StudentItem {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    gradeLevel?: string;
    schoolName?: string;
    phone?: string;
    dateOfBirth?: string;
}

interface ClassItem {
    id: string;
    title: string;
    subject: string;
    scheduledAt: string;
    status: string;
    duration: number;
}

interface Enrollment {
    id: string;
    classId: string;
    classTitle: string;
    subject: string;
    scheduledAt: string;
    status: string;
    attendanceStatus: string;
    enrolledAt: string;
}

type ModalType = 'add-student' | 'edit-student' | 'add-class' | 'assign-class' | 'student-detail' | null;

const TutorOnboarding: React.FC = () => {
    const [students, setStudents] = useState<StudentItem[]>([]);
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [editingStudent, setEditingStudent] = useState<StudentItem | null>(null);
    const [studentEnrollments, setStudentEnrollments] = useState<Enrollment[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    // Helper: current datetime in YYYY-MM-DDTHH:MM format for datetime-local inputs
    const getNowDatetime = () => {
        const now = new Date();
        return now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0') + 'T' +
            String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0');
    };

    // Form states
    const [addStudentForm, setAddStudentForm] = useState({
        email: '', fullName: '', phoneNumber: '', gradeLevel: '', schoolName: '', dateOfBirth: '', classId: ''
    });
    const [editStudentForm, setEditStudentForm] = useState({
        fullName: '', phoneNumber: '', gradeLevel: '', schoolName: '', dateOfBirth: ''
    });
    const [addClassForm, setAddClassForm] = useState({
        title: '', subject: '', description: '', scheduledAt: getNowDatetime(), durationMinutes: 60, meetingLink: ''
    });
    const [assignClassId, setAssignClassId] = useState('');

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ message, type });
    };
    const hideToast = () => setToast(null);

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/tutor/dashboard' },
        { label: 'My Classes', href: '/tutor/classes' },
        { label: 'Schedule', href: '/tutor/schedule' },
        { label: 'Students', href: '/tutor/students' },
        { label: 'Materials', href: '/tutor/materials' },
        { label: 'Account', href: '/tutor/account' },
    ];

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [studentsRes, classesRes] = await Promise.all([
                tutorService.getStudents(),
                tutorService.getMyClasses()
            ]);

            if (studentsRes.success) {
                setStudents(studentsRes.data.students.map((s: { id: string; name: string; email: string; avatar?: string; gradeLevel?: string; schoolName?: string }) => ({
                    id: s.id,
                    name: s.name,
                    email: s.email,
                    avatar: s.avatar,
                    gradeLevel: s.gradeLevel,
                    schoolName: s.schoolName
                })));
            }

            if (classesRes.success) {
                setClasses(classesRes.data.classes);
            }
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            showToast(axiosError.response?.data?.message || 'Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Selection handlers
    const toggleStudentSelect = (id: string) => {
        setSelectedStudentIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedStudentIds.size === students.length) {
            setSelectedStudentIds(new Set());
        } else {
            setSelectedStudentIds(new Set(students.map(s => s.id)));
        }
    };

    // Open modals
    const openAddStudent = () => {
        setAddStudentForm({ email: '', fullName: '', phoneNumber: '', gradeLevel: '', schoolName: '', dateOfBirth: '', classId: '' });
        setActiveModal('add-student');
    };

    const openEditStudent = async (student: StudentItem) => {
        setEditingStudent(student);
        try {
            const res = await tutorService.getStudentDetails(student.id);
            if (res.success) {
                const s = res.data.student;
                setEditStudentForm({
                    fullName: s.name || '',
                    phoneNumber: s.phone || '',
                    gradeLevel: s.gradeLevel || '',
                    schoolName: s.schoolName || '',
                    dateOfBirth: s.dateOfBirth || ''
                });
                setStudentEnrollments(res.data.enrollments || []);
            }
        } catch {
            setEditStudentForm({
                fullName: student.name || '',
                phoneNumber: student.phone || '',
                gradeLevel: student.gradeLevel || '',
                schoolName: student.schoolName || '',
                dateOfBirth: student.dateOfBirth || ''
            });
            setStudentEnrollments([]);
        }
        setActiveModal('edit-student');
    };

    const openStudentDetail = async (student: StudentItem) => {
        setEditingStudent(student);
        try {
            const res = await tutorService.getStudentDetails(student.id);
            if (res.success) {
                setStudentEnrollments(res.data.enrollments || []);
                setEditingStudent({
                    ...student,
                    phone: res.data.student.phone,
                    gradeLevel: res.data.student.gradeLevel,
                    schoolName: res.data.student.schoolName,
                    dateOfBirth: res.data.student.dateOfBirth
                });
            }
        } catch {
            setStudentEnrollments([]);
        }
        setActiveModal('student-detail');
    };

    const openAddClass = () => {
        setAddClassForm({ title: '', subject: '', description: '', scheduledAt: getNowDatetime(), durationMinutes: 60, meetingLink: '' });
        setActiveModal('add-class');
    };

    const openAssignClass = () => {
        if (selectedStudentIds.size === 0) {
            showToast('Select at least one student first', 'info');
            return;
        }
        setAssignClassId('');
        setActiveModal('assign-class');
    };

    const closeModal = () => {
        setActiveModal(null);
        setEditingStudent(null);
        setStudentEnrollments([]);
    };

    // CRUD Actions
    const handleAddStudent = async () => {
        if (!addStudentForm.email || !addStudentForm.fullName) {
            showToast('Email and full name are required', 'error');
            return;
        }
        setSubmitting(true);
        try {
            const res = await tutorService.addStudent({
                email: addStudentForm.email,
                fullName: addStudentForm.fullName,
                phoneNumber: addStudentForm.phoneNumber || undefined,
                gradeLevel: addStudentForm.gradeLevel || undefined,
                schoolName: addStudentForm.schoolName || undefined,
                dateOfBirth: addStudentForm.dateOfBirth || undefined,
                classId: addStudentForm.classId || undefined
            });
            showToast(res.message || 'Student added successfully', 'success');
            closeModal();
            fetchData();
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            showToast(axiosError.response?.data?.message || 'Failed to add student', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateStudent = async () => {
        if (!editingStudent) return;
        setSubmitting(true);
        try {
            await tutorService.updateStudent(editingStudent.id, {
                fullName: editStudentForm.fullName || undefined,
                phoneNumber: editStudentForm.phoneNumber || undefined,
                gradeLevel: editStudentForm.gradeLevel || undefined,
                schoolName: editStudentForm.schoolName || undefined,
                dateOfBirth: editStudentForm.dateOfBirth || undefined
            });
            showToast('Student updated successfully', 'success');
            closeModal();
            fetchData();
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            showToast(axiosError.response?.data?.message || 'Failed to update student', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRemoveStudent = async (studentId: string) => {
        if (!window.confirm('Remove this student from all your classes?')) return;
        try {
            await tutorService.removeStudent(studentId);
            showToast('Student removed', 'success');
            setSelectedStudentIds(prev => {
                const next = new Set(prev);
                next.delete(studentId);
                return next;
            });
            fetchData();
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            showToast(axiosError.response?.data?.message || 'Failed to remove student', 'error');
        }
    };

    const handleBulkDelete = async () => {
        if (selectedStudentIds.size === 0) return;
        if (!window.confirm(`Remove ${selectedStudentIds.size} student(s) from all your classes?`)) return;
        try {
            await Promise.all(Array.from(selectedStudentIds).map(id => tutorService.removeStudent(id)));
            showToast(`${selectedStudentIds.size} student(s) removed`, 'success');
            setSelectedStudentIds(new Set());
            fetchData();
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            showToast(axiosError.response?.data?.message || 'Failed to remove some students', 'error');
        }
    };

    const handleAssignClass = async () => {
        if (!assignClassId) {
            showToast('Select a class to assign', 'info');
            return;
        }
        setSubmitting(true);
        try {
            await Promise.all(
                Array.from(selectedStudentIds).map(studentId =>
                    tutorService.enrollStudent(studentId, assignClassId)
                )
            );
            showToast(`${selectedStudentIds.size} student(s) assigned to class`, 'success');
            setSelectedStudentIds(new Set());
            closeModal();
            fetchData();
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            showToast(axiosError.response?.data?.message || 'Failed to assign some students', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUnenroll = async (studentId: string, classId: string) => {
        try {
            await tutorService.unenrollStudent(studentId, classId);
            showToast('Student removed from class', 'success');
            setStudentEnrollments(prev => prev.filter(e => e.classId !== classId));
            fetchData();
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            showToast(axiosError.response?.data?.message || 'Failed to remove enrollment', 'error');
        }
    };

    const handleAddClass = async () => {
        if (!addClassForm.title || !addClassForm.subject || !addClassForm.scheduledAt) {
            showToast('Title, subject, and scheduled date are required', 'error');
            return;
        }
        setSubmitting(true);
        try {
            await classService.createClass({
                title: addClassForm.title,
                subject: addClassForm.subject,
                description: addClassForm.description || undefined,
                scheduledAt: addClassForm.scheduledAt,
                durationMinutes: addClassForm.durationMinutes,
                meetingLink: addClassForm.meetingLink || undefined
            });
            showToast('Class created successfully', 'success');
            closeModal();
            fetchData();
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            showToast(axiosError.response?.data?.message || 'Failed to create class', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-ZA', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    const formatDateTime = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-ZA', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="tutor-onboarding-page">
            <Header navigationLinks={navigationLinks} />

            <div className="onboarding-container">
                <Link to="/tutor/students" className="back-link">
                    ← Back to Students
                </Link>

                <div className="onboarding-header">
                    <div>
                        <h1>Student & Class Management</h1>
                        <p>Add students, create classes, and manage enrollments</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-add-student" onClick={openAddStudent}>
                            ➕ Add Student
                        </button>
                        <button className="btn-add-class" onClick={openAddClass}>
                            📚 Create Class
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="onboarding-loading">
                        <div className="onboarding-spinner" />
                    </div>
                ) : (
                    <div className="onboarding-content">
                        {/* Students Panel */}
                        <div className="students-panel">
                            <div className="panel-header">
                                <h2>Students</h2>
                                <span className="student-count">{students.length} student{students.length !== 1 ? 's' : ''}</span>
                            </div>

                            {students.length > 0 && (
                                <div className="bulk-actions">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedStudentIds.size === students.length && students.length > 0}
                                            onChange={toggleSelectAll}
                                            style={{ width: 18, height: 18, accentColor: '#667eea' }}
                                        />
                                        Select All
                                    </label>
                                    {selectedStudentIds.size > 0 && (
                                        <>
                                            <span>{selectedStudentIds.size} selected</span>
                                            <button className="btn-bulk assign" onClick={openAssignClass}>
                                                📎 Assign to Class
                                            </button>
                                            <button className="btn-bulk delete" onClick={handleBulkDelete}>
                                                🗑️ Remove Selected
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="student-list">
                                {students.length === 0 ? (
                                    <div className="empty-students">
                                        <div className="empty-icon">👩‍🎓</div>
                                        <h3>No Students Yet</h3>
                                        <p>Click "Add Student" to get started</p>
                                    </div>
                                ) : (
                                    students.map(student => (
                                        <div
                                            key={student.id}
                                            className={`student-item ${selectedStudentIds.has(student.id) ? 'selected' : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedStudentIds.has(student.id)}
                                                onChange={() => toggleStudentSelect(student.id)}
                                            />
                                            <div
                                                className="student-item-avatar"
                                                onClick={() => openStudentDetail(student)}
                                            >
                                                {getInitials(student.name)}
                                            </div>
                                            <div
                                                className="student-item-info"
                                                onClick={() => openStudentDetail(student)}
                                            >
                                                <div className="student-item-name">{student.name}</div>
                                                <div className="student-item-meta">
                                                    <span>{student.email}</span>
                                                    {student.gradeLevel && <span>Grade: {student.gradeLevel}</span>}
                                                </div>
                                            </div>
                                            <div className="student-item-actions">
                                                <button
                                                    className="btn-action"
                                                    title="Edit"
                                                    onClick={() => openEditStudent(student)}
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="btn-action danger"
                                                    title="Remove"
                                                    onClick={() => handleRemoveStudent(student.id)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Side Panel */}
                        <div className="side-panel">
                            {/* Classes Card */}
                            <div className="classes-card">
                                <div className="panel-header">
                                    <h2>Your Classes</h2>
                                    <span className="class-count">{classes.length}</span>
                                </div>
                                <div className="classes-list">
                                    {classes.length === 0 ? (
                                        <div className="empty-classes">
                                            No classes yet. Create one to get started!
                                        </div>
                                    ) : (
                                        classes.map(cls => (
                                            <div key={cls.id} className="class-item-card">
                                                <div className="class-item-title">{cls.title}</div>
                                                <div className="class-item-details">
                                                    <span>{cls.subject}</span>
                                                    <span>{formatDateTime(cls.scheduledAt)}</span>
                                                    <span className={`class-status ${cls.status}`}>{cls.status}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="quick-stats">
                                <h3>Quick Stats</h3>
                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <span className="stat-value">{students.length}</span>
                                        <span className="stat-label">Students</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-value">{classes.length}</span>
                                        <span className="stat-label">Classes</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-value">{classes.filter(c => c.status === 'scheduled').length}</span>
                                        <span className="stat-label">Upcoming</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-value">{classes.filter(c => c.status === 'completed').length}</span>
                                        <span className="stat-label">Completed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Student Modal */}
            {activeModal === 'add-student' && (
                <div className="onboarding-modal-overlay" onClick={closeModal}>
                    <div className="onboarding-modal" onClick={e => e.stopPropagation()}>
                        <div className="onboarding-modal-header">
                            <h2>Add New Student</h2>
                            <button className="onboarding-modal-close" onClick={closeModal}>✕</button>
                        </div>
                        <div className="onboarding-modal-body">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="e.g. John Doe"
                                        value={addStudentForm.fullName}
                                        onChange={e => setAddStudentForm(prev => ({ ...prev, fullName: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email <span className="required">*</span></label>
                                    <input
                                        type="email"
                                        placeholder="student@email.com"
                                        value={addStudentForm.email}
                                        onChange={e => setAddStudentForm(prev => ({ ...prev, email: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="+27 ..."
                                        value={addStudentForm.phoneNumber}
                                        onChange={e => setAddStudentForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Grade Level</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Grade 10"
                                        value={addStudentForm.gradeLevel}
                                        onChange={e => setAddStudentForm(prev => ({ ...prev, gradeLevel: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>School Name</label>
                                    <input
                                        type="text"
                                        placeholder="School name"
                                        value={addStudentForm.schoolName}
                                        onChange={e => setAddStudentForm(prev => ({ ...prev, schoolName: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <CalendarPicker
                                        value={addStudentForm.dateOfBirth}
                                        onChange={val => setAddStudentForm(prev => ({ ...prev, dateOfBirth: val }))}
                                        placeholder="Select date of birth"
                                    />
                                </div>
                            </div>
                            {classes.length > 0 && (
                                <div className="form-group">
                                    <label>Assign to Class (optional)</label>
                                    <select
                                        value={addStudentForm.classId}
                                        onChange={e => setAddStudentForm(prev => ({ ...prev, classId: e.target.value }))}
                                    >
                                        <option value="">-- No class --</option>
                                        {classes.map(c => (
                                            <option key={c.id} value={c.id}>{c.title} ({c.subject})</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className="onboarding-modal-footer">
                            <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                            <button className="btn-submit" onClick={handleAddStudent} disabled={submitting}>
                                {submitting ? 'Adding...' : 'Add Student'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Student Modal */}
            {activeModal === 'edit-student' && editingStudent && (
                <div className="onboarding-modal-overlay" onClick={closeModal}>
                    <div className="onboarding-modal" onClick={e => e.stopPropagation()}>
                        <div className="onboarding-modal-header">
                            <h2>Edit Student</h2>
                            <button className="onboarding-modal-close" onClick={closeModal}>✕</button>
                        </div>
                        <div className="onboarding-modal-body">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={editStudentForm.fullName}
                                        onChange={e => setEditStudentForm(prev => ({ ...prev, fullName: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        value={editStudentForm.phoneNumber}
                                        onChange={e => setEditStudentForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Grade Level</label>
                                    <input
                                        type="text"
                                        value={editStudentForm.gradeLevel}
                                        onChange={e => setEditStudentForm(prev => ({ ...prev, gradeLevel: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>School Name</label>
                                    <input
                                        type="text"
                                        value={editStudentForm.schoolName}
                                        onChange={e => setEditStudentForm(prev => ({ ...prev, schoolName: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Date of Birth</label>
                                <CalendarPicker
                                    value={editStudentForm.dateOfBirth}
                                    onChange={val => setEditStudentForm(prev => ({ ...prev, dateOfBirth: val }))}
                                    placeholder="Select date of birth"
                                />
                            </div>

                            {/* Current Enrollments */}
                            {studentEnrollments.length > 0 && (
                                <div className="form-group">
                                    <label>Current Class Enrollments</label>
                                    <div className="enrollment-list">
                                        {studentEnrollments.map(e => (
                                            <div key={e.id} className="enrollment-item">
                                                <div>
                                                    <div className="enrollment-class">{e.classTitle}</div>
                                                    <div className="enrollment-subject">{e.subject} · {formatDate(e.scheduledAt)}</div>
                                                </div>
                                                <button
                                                    className="btn-unenroll"
                                                    onClick={() => handleUnenroll(editingStudent.id, e.classId)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="onboarding-modal-footer">
                            <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                            <button className="btn-submit" onClick={handleUpdateStudent} disabled={submitting}>
                                {submitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Student Detail Modal */}
            {activeModal === 'student-detail' && editingStudent && (
                <div className="onboarding-modal-overlay" onClick={closeModal}>
                    <div className="onboarding-modal" onClick={e => e.stopPropagation()}>
                        <div className="onboarding-modal-header">
                            <h2>Student Details</h2>
                            <button className="onboarding-modal-close" onClick={closeModal}>✕</button>
                        </div>
                        <div className="onboarding-modal-body">
                            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                                <div className="student-item-avatar" style={{ width: 60, height: 60, fontSize: '1.5rem' }}>
                                    {getInitials(editingStudent.name)}
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, color: '#2d3748' }}>{editingStudent.name}</h3>
                                    <p style={{ margin: '0.25rem 0 0', color: '#718096' }}>{editingStudent.email}</p>
                                </div>
                            </div>

                            <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                                {editingStudent.phone && (
                                    <div className="stat-card">
                                        <span className="stat-label">Phone</span>
                                        <span style={{ color: '#2d3748', fontWeight: 600, fontSize: '0.9rem' }}>{editingStudent.phone}</span>
                                    </div>
                                )}
                                {editingStudent.gradeLevel && (
                                    <div className="stat-card">
                                        <span className="stat-label">Grade</span>
                                        <span style={{ color: '#2d3748', fontWeight: 600, fontSize: '0.9rem' }}>{editingStudent.gradeLevel}</span>
                                    </div>
                                )}
                                {editingStudent.schoolName && (
                                    <div className="stat-card">
                                        <span className="stat-label">School</span>
                                        <span style={{ color: '#2d3748', fontWeight: 600, fontSize: '0.9rem' }}>{editingStudent.schoolName}</span>
                                    </div>
                                )}
                                {editingStudent.dateOfBirth && (
                                    <div className="stat-card">
                                        <span className="stat-label">Birthday</span>
                                        <span style={{ color: '#2d3748', fontWeight: 600, fontSize: '0.9rem' }}>{formatDate(editingStudent.dateOfBirth)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Enrolled Classes ({studentEnrollments.length})</label>
                                {studentEnrollments.length === 0 ? (
                                    <p style={{ color: '#a0aec0', fontStyle: 'italic' }}>Not enrolled in any classes</p>
                                ) : (
                                    <div className="enrollment-list">
                                        {studentEnrollments.map(e => (
                                            <div key={e.id} className="enrollment-item">
                                                <div>
                                                    <div className="enrollment-class">{e.classTitle}</div>
                                                    <div className="enrollment-subject">{e.subject} · {formatDate(e.scheduledAt)} · <span className={`class-status ${e.status}`}>{e.status}</span></div>
                                                </div>
                                                <button
                                                    className="btn-unenroll"
                                                    onClick={() => handleUnenroll(editingStudent.id, e.classId)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="onboarding-modal-footer">
                            <button className="btn-cancel" onClick={closeModal}>Close</button>
                            <button
                                className="btn-submit"
                                onClick={() => {
                                    closeModal();
                                    openEditStudent(editingStudent);
                                }}
                            >
                                ✏️ Edit Student
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Class Modal */}
            {activeModal === 'add-class' && (
                <div className="onboarding-modal-overlay" onClick={closeModal}>
                    <div className="onboarding-modal" onClick={e => e.stopPropagation()}>
                        <div className="onboarding-modal-header">
                            <h2>Create New Class</h2>
                            <button className="onboarding-modal-close" onClick={closeModal}>✕</button>
                        </div>
                        <div className="onboarding-modal-body">
                            <div className="form-group">
                                <label>Class Title <span className="required">*</span></label>
                                <input
                                    type="text"
                                    placeholder="e.g. Mathematics - Grade 10"
                                    value={addClassForm.title}
                                    onChange={e => setAddClassForm(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Subject <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Mathematics"
                                        value={addClassForm.subject}
                                        onChange={e => setAddClassForm(prev => ({ ...prev, subject: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Duration (minutes)</label>
                                    <input
                                        type="number"
                                        min="15"
                                        max="240"
                                        value={addClassForm.durationMinutes}
                                        onChange={e => setAddClassForm(prev => ({ ...prev, durationMinutes: parseInt(e.target.value) || 60 }))}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Schedule Date & Time <span className="required">*</span></label>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <CalendarPicker
                                            value={addClassForm.scheduledAt.split('T')[0] || ''}
                                            onChange={val => {
                                                const time = addClassForm.scheduledAt.split('T')[1] || '09:00';
                                                setAddClassForm(prev => ({ ...prev, scheduledAt: `${val}T${time}` }));
                                            }}
                                            placeholder="Select date"
                                        />
                                    </div>
                                    <input
                                        type="time"
                                        value={addClassForm.scheduledAt.split('T')[1] || ''}
                                        onChange={e => {
                                            const date = addClassForm.scheduledAt.split('T')[0] || new Date().toISOString().split('T')[0];
                                            setAddClassForm(prev => ({ ...prev, scheduledAt: `${date}T${e.target.value}` }));
                                        }}
                                        style={{ width: '130px', padding: '0.75rem 1rem', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '0.95rem' }}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Meeting Link</label>
                                <input
                                    type="url"
                                    placeholder="https://meet.google.com/..."
                                    value={addClassForm.meetingLink}
                                    onChange={e => setAddClassForm(prev => ({ ...prev, meetingLink: e.target.value }))}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    rows={3}
                                    placeholder="What will this class cover?"
                                    value={addClassForm.description}
                                    onChange={e => setAddClassForm(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="onboarding-modal-footer">
                            <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                            <button className="btn-submit" onClick={handleAddClass} disabled={submitting}>
                                {submitting ? 'Creating...' : 'Create Class'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign to Class Modal */}
            {activeModal === 'assign-class' && (
                <div className="onboarding-modal-overlay" onClick={closeModal}>
                    <div className="onboarding-modal" onClick={e => e.stopPropagation()}>
                        <div className="onboarding-modal-header">
                            <h2>Assign to Class</h2>
                            <button className="onboarding-modal-close" onClick={closeModal}>✕</button>
                        </div>
                        <div className="onboarding-modal-body">
                            <p style={{ color: '#718096', marginBottom: '1rem' }}>
                                Assign {selectedStudentIds.size} selected student{selectedStudentIds.size !== 1 ? 's' : ''} to a class:
                            </p>
                            {classes.length === 0 ? (
                                <div className="empty-classes">
                                    <p>No classes available. Create a class first.</p>
                                    <button className="btn-submit" onClick={() => { closeModal(); openAddClass(); }} style={{ marginTop: '1rem' }}>
                                        Create Class
                                    </button>
                                </div>
                            ) : (
                                <div className="assign-class-list">
                                    {classes.map(cls => (
                                        <label
                                            key={cls.id}
                                            className={`assign-class-option ${assignClassId === cls.id ? 'selected' : ''}`}
                                        >
                                            <input
                                                type="radio"
                                                name="assignClass"
                                                value={cls.id}
                                                checked={assignClassId === cls.id}
                                                onChange={() => setAssignClassId(cls.id)}
                                            />
                                            <div className="assign-class-info">
                                                <div className="assign-class-name">{cls.title}</div>
                                                <div className="assign-class-meta">{cls.subject} · {formatDateTime(cls.scheduledAt)} · {cls.duration}min</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="onboarding-modal-footer">
                            <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                            <button className="btn-submit" onClick={handleAssignClass} disabled={submitting || !assignClassId}>
                                {submitting ? 'Assigning...' : 'Assign Students'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
};

export default TutorOnboarding;
