import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { adminService } from '../../../services/admin.service';
import type { AdminUser, AdminClass, DashboardStats, Relationship } from '../../../services/admin.service';
import type { NavigationLink } from '../../../types';
import './AdminDashboard.css';

type TabKey = 'dashboard' | 'users' | 'pending' | 'classes' | 'relationships';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [pendingUsers, setPendingUsers] = useState<AdminUser[]>([]);
    const [classes, setClasses] = useState<AdminClass[]>([]);
    const [relationships, setRelationships] = useState<Relationship[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // All users & classes cache for dropdown selectors
    const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
    const [allClasses, setAllClasses] = useState<AdminClass[]>([]);

    // Filters
    const [roleFilter, setRoleFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Link modals
    const [showLinkModal, setShowLinkModal] = useState<'student-tutor' | 'student-parent' | 'tutor-class' | 'create-class' | null>(null);
    const [linkForm, setLinkForm] = useState({ studentId: '', parentId: '', tutorId: '', classId: '' });
    const [newClassForm, setNewClassForm] = useState({ title: '', subject: '', description: '', scheduledAt: '', duration: 60, maxStudents: 30 });

    // Edit user modal
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [editForm, setEditForm] = useState({ fullName: '', email: '', role: '', phoneNumber: '' });

    // Assign class to tutor modal
    const [assignTutorUser, setAssignTutorUser] = useState<AdminUser | null>(null);
    const [assignClassId, setAssignClassId] = useState('');

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Users', href: '#', onClick: () => setActiveTab('users') },
        { label: 'Pending', href: '#', onClick: () => setActiveTab('pending') },
        { label: 'Classes', href: '#', onClick: () => setActiveTab('classes') },
    ];

    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    // --- Fetch all users/classes for dropdown selectors ---
    const fetchAllUsersAndClasses = useCallback(async () => {
        try {
            const [usersRes, classesRes] = await Promise.all([
                adminService.getUsers(),
                adminService.getClasses(),
            ]);
            if (usersRes.success) setAllUsers(usersRes.data?.users ?? []);
            if (classesRes.success) setAllClasses(classesRes.data?.classes ?? []);
        } catch {
            // Silently fail — dropdowns will just be empty
        }
    }, []);

    useEffect(() => {
        fetchAllUsersAndClasses();
    }, [fetchAllUsersAndClasses]);

    // --- Tab data fetchers ---
    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true);
            const res = await adminService.getDashboard();
            if (res.success) setStats(res.data?.stats ?? res.data);
        } catch { setError('Failed to load dashboard'); }
        finally { setLoading(false); }
    }, []);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const params: { role?: string; status?: string; search?: string } = {};
            if (roleFilter) params.role = roleFilter;
            if (statusFilter) params.status = statusFilter;
            if (searchQuery) params.search = searchQuery;
            const res = await adminService.getUsers(params);
            if (res.success) setUsers(res.data?.users ?? []);
        } catch { setError('Failed to load users'); }
        finally { setLoading(false); }
    }, [roleFilter, statusFilter, searchQuery]);

    const fetchPending = useCallback(async () => {
        try {
            setLoading(true);
            const res = await adminService.getPendingUsers();
            if (res.success) setPendingUsers(res.data?.users ?? []);
        } catch { setError('Failed to load pending users'); }
        finally { setLoading(false); }
    }, []);

    const fetchClasses = useCallback(async () => {
        try {
            setLoading(true);
            const res = await adminService.getClasses();
            if (res.success) setClasses(res.data?.classes ?? []);
        } catch { setError('Failed to load classes'); }
        finally { setLoading(false); }
    }, []);

    const fetchRelationships = useCallback(async () => {
        try {
            setLoading(true);
            const res = await adminService.getRelationships();
            if (res.success) setRelationships(res.data?.relationships ?? []);
        } catch { setError('Failed to load relationships'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => {
        setError(null);
        switch (activeTab) {
            case 'dashboard': fetchDashboard(); break;
            case 'users': fetchUsers(); break;
            case 'pending': fetchPending(); break;
            case 'classes': fetchClasses(); break;
            case 'relationships': fetchRelationships(); break;
        }
    }, [activeTab, fetchDashboard, fetchUsers, fetchPending, fetchClasses, fetchRelationships]);

    // --- Actions ---
    const handleApprove = async (userId: string) => {
        setActionLoading(userId);
        try {
            await adminService.approveUser(userId);
            showSuccess('User approved successfully');
            fetchPending();
            fetchAllUsersAndClasses();
            if (activeTab === 'users') fetchUsers();
        } catch { setError('Failed to approve user'); }
        finally { setActionLoading(null); }
    };

    const handleReject = async (userId: string) => {
        const reason = prompt('Reason for rejection (optional):');
        setActionLoading(userId);
        try {
            await adminService.rejectUser(userId, reason || undefined);
            showSuccess('User rejected');
            if (activeTab === 'pending') fetchPending();
            else fetchUsers();
        } catch { setError('Failed to reject user'); }
        finally { setActionLoading(null); }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to permanently delete this user?')) return;
        setActionLoading(userId);
        try {
            await adminService.deleteUser(userId);
            showSuccess('User deleted');
            fetchUsers();
            fetchAllUsersAndClasses();
        } catch { setError('Failed to delete user'); }
        finally { setActionLoading(null); }
    };

    const handleEditUser = (user: AdminUser) => {
        setEditingUser(user);
        setEditForm({
            fullName: user.fullName || '',
            email: user.email || '',
            role: user.role || '',
            phoneNumber: user.phoneNumber || '',
        });
    };

    const handleEditSubmit = async () => {
        if (!editingUser) return;
        setActionLoading('edit');
        try {
            await adminService.updateUser(editingUser.id, editForm);
            showSuccess('User updated successfully');
            setEditingUser(null);
            fetchUsers();
            fetchAllUsersAndClasses();
        } catch { setError('Failed to update user'); }
        finally { setActionLoading(null); }
    };

    const handleAssignClassToTutor = async () => {
        if (!assignTutorUser || !assignClassId) return;
        setActionLoading('assign-class');
        try {
            await adminService.assignTutorToClass(assignTutorUser.id, assignClassId);
            showSuccess('Class assigned to tutor');
            setAssignTutorUser(null);
            setAssignClassId('');
            fetchClasses();
            fetchAllUsersAndClasses();
        } catch { setError('Failed to assign class'); }
        finally { setActionLoading(null); }
    };

    const handleLinkSubmit = async () => {
        setActionLoading('link');
        try {
            switch (showLinkModal) {
                case 'student-tutor':
                    await adminService.linkStudentToTutor(linkForm.studentId, linkForm.classId);
                    showSuccess('Student enrolled in class');
                    break;
                case 'student-parent':
                    await adminService.linkStudentToParent(linkForm.studentId, linkForm.parentId);
                    showSuccess('Student linked to parent');
                    break;
                case 'tutor-class':
                    await adminService.assignTutorToClass(linkForm.tutorId, linkForm.classId);
                    showSuccess('Tutor assigned to class');
                    break;
                case 'create-class':
                    await adminService.createClass(newClassForm);
                    showSuccess('Class created');
                    fetchClasses();
                    fetchAllUsersAndClasses();
                    break;
            }
            setShowLinkModal(null);
            setLinkForm({ studentId: '', parentId: '', tutorId: '', classId: '' });
            if (activeTab === 'relationships') fetchRelationships();
        } catch { setError('Action failed. Please try again.'); }
        finally { setActionLoading(null); }
    };

    const handleUnlinkStudentParent = async (studentId: string, parentId: string) => {
        if (!confirm('Remove this student-parent link?')) return;
        setActionLoading(`unlink-${studentId}-${parentId}`);
        try {
            await adminService.unlinkStudentFromParent(studentId, parentId);
            showSuccess('Link removed');
            fetchRelationships();
        } catch { setError('Failed to remove link'); }
        finally { setActionLoading(null); }
    };

    const handleUnlinkStudentClass = async (studentId: string, classId: string) => {
        if (!confirm('Remove this student from the class?')) return;
        setActionLoading(`unlink-${studentId}-${classId}`);
        try {
            await adminService.unlinkStudentFromTutor(studentId, classId);
            showSuccess('Student removed from class');
            fetchRelationships();
        } catch { setError('Failed to remove enrollment'); }
        finally { setActionLoading(null); }
    };

    // --- Helpers ---
    const approvedStudents = allUsers.filter(u => u.role === 'student' && u.status === 'approved');
    const approvedTutors = allUsers.filter(u => u.role === 'tutor' && u.status === 'approved');
    const approvedParents = allUsers.filter(u => u.role === 'parent' && u.status === 'approved');

    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case 'student': return 'badge-student';
            case 'tutor': return 'badge-tutor';
            case 'parent': return 'badge-parent';
            case 'admin': return 'badge-admin';
            default: return '';
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'approved': return 'badge-approved';
            case 'pending': return 'badge-pending';
            case 'rejected': return 'badge-rejected';
            default: return '';
        }
    };

    // --- Render Tabs ---
    const renderDashboard = () => (
        <div className="admin-dashboard-content">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>{stats?.totalUsers ?? '—'}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
                <div className="stat-card stat-pending">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                        <h3>{stats?.pendingApprovals ?? '—'}</h3>
                        <p>Pending Approvals</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🎓</div>
                    <div className="stat-info">
                        <h3>{stats?.totalStudents ?? '—'}</h3>
                        <p>Students</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👨‍🏫</div>
                    <div className="stat-info">
                        <h3>{stats?.totalTutors ?? '—'}</h3>
                        <p>Tutors</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👪</div>
                    <div className="stat-info">
                        <h3>{stats?.totalParents ?? '—'}</h3>
                        <p>Parents</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📚</div>
                    <div className="stat-info">
                        <h3>{stats?.totalClasses ?? '—'}</h3>
                        <p>Classes</p>
                    </div>
                </div>
            </div>

            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <button className="action-btn" onClick={() => setActiveTab('pending')}>
                        ⏳ Review Pending Users
                    </button>
                    <button className="action-btn" onClick={() => setShowLinkModal('student-parent')}>
                        🔗 Link Student &amp; Parent
                    </button>
                    <button className="action-btn" onClick={() => setShowLinkModal('student-tutor')}>
                        📚 Enroll Student in Class
                    </button>
                    <button className="action-btn" onClick={() => setShowLinkModal('tutor-class')}>
                        👨‍🏫 Assign Tutor to Class
                    </button>
                    <button className="action-btn" onClick={() => setShowLinkModal('create-class')}>
                        ➕ Create New Class
                    </button>
                    <button className="action-btn" onClick={() => setActiveTab('relationships')}>
                        🔗 View Relationships
                    </button>
                </div>
            </div>
        </div>
    );

    const renderUsers = () => (
        <div className="admin-users-content">
            <div className="users-toolbar">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                    <option value="">All Roles</option>
                    <option value="student">Students</option>
                    <option value="tutor">Tutors</option>
                    <option value="parent">Parents</option>
                    <option value="admin">Admins</option>
                </select>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            <div className="users-table-wrapper">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="user-name">{user.fullName}</td>
                                <td>{user.email}</td>
                                <td><span className={`badge ${getRoleBadgeClass(user.role)}`}>{user.role}</span></td>
                                <td><span className={`badge ${getStatusBadgeClass(user.status)}`}>{user.status}</span></td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="actions-cell">
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEditUser(user)}
                                        title="Edit user"
                                    >✏️</button>
                                    {user.role === 'tutor' && user.status === 'approved' && (
                                        <button
                                            className="btn-assign"
                                            onClick={() => { setAssignTutorUser(user); setAssignClassId(''); }}
                                            title="Assign class to this tutor"
                                        >📚</button>
                                    )}
                                    {user.status === 'pending' && (
                                        <>
                                            <button
                                                className="btn-approve"
                                                onClick={() => handleApprove(user.id)}
                                                disabled={actionLoading === user.id}
                                            >✓</button>
                                            <button
                                                className="btn-reject"
                                                onClick={() => handleReject(user.id)}
                                                disabled={actionLoading === user.id}
                                            >✗</button>
                                        </>
                                    )}
                                    {user.role !== 'admin' && (
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(user.id)}
                                            disabled={actionLoading === user.id}
                                        >🗑</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && !loading && (
                            <tr><td colSpan={6} className="no-data">No users found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderPending = () => (
        <div className="admin-pending-content">
            <h2>Pending Approvals ({pendingUsers.length})</h2>
            {pendingUsers.length === 0 && !loading && (
                <div className="empty-state">
                    <p>🎉 No pending users to review!</p>
                </div>
            )}
            <div className="pending-cards">
                {pendingUsers.map(user => (
                    <div key={user.id} className="pending-card">
                        <div className="pending-card-header">
                            <div className="pending-avatar">{user.fullName?.charAt(0) || '?'}</div>
                            <div className="pending-info">
                                <h3>{user.fullName}</h3>
                                <p>{user.email}</p>
                                <span className={`badge ${getRoleBadgeClass(user.role)}`}>{user.role}</span>
                            </div>
                        </div>
                        <div className="pending-meta">
                            <span>Applied: {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="pending-actions">
                            <button
                                className="btn-action btn-approve-lg"
                                onClick={() => handleApprove(user.id)}
                                disabled={actionLoading === user.id}
                            >
                                {actionLoading === user.id ? 'Processing...' : '✓ Approve'}
                            </button>
                            <button
                                className="btn-action btn-reject-lg"
                                onClick={() => handleReject(user.id)}
                                disabled={actionLoading === user.id}
                            >
                                ✗ Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderClasses = () => (
        <div className="admin-classes-content">
            <div className="section-header">
                <h2>Classes</h2>
                <button className="btn-primary" onClick={() => setShowLinkModal('create-class')}>
                    ➕ Create Class
                </button>
            </div>
            <div className="classes-grid">
                {classes.map(cls => (
                    <div key={cls.id} className="class-card">
                        <h3>{cls.title}</h3>
                        <div className="class-details">
                            <span>📚 {cls.subject}</span>
                            {cls.tutorName && <span>👨‍🏫 {cls.tutorName}</span>}
                            {cls.scheduledAt && <span>📅 {new Date(cls.scheduledAt).toLocaleDateString()}</span>}
                            {cls.maxStudents && <span>👥 Max {cls.maxStudents}</span>}
                        </div>
                        <div className="class-actions">
                            <button className="btn-sm" onClick={() => { setLinkForm(f => ({ ...f, classId: cls.id })); setShowLinkModal('student-tutor'); }}>
                                Enroll Student
                            </button>
                            <button className="btn-sm" onClick={() => { setLinkForm(f => ({ ...f, classId: cls.id })); setShowLinkModal('tutor-class'); }}>
                                Assign Tutor
                            </button>
                        </div>
                    </div>
                ))}
                {classes.length === 0 && !loading && (
                    <div className="empty-state"><p>No classes created yet.</p></div>
                )}
            </div>
        </div>
    );

    const renderRelationships = () => (
        <div className="admin-relationships-content">
            <div className="section-header">
                <h2>Relationships</h2>
                <div className="section-actions">
                    <button className="btn-primary" onClick={() => setShowLinkModal('student-parent')}>
                        🔗 Link Student &amp; Parent
                    </button>
                    <button className="btn-primary" onClick={() => setShowLinkModal('student-tutor')}>
                        📚 Enroll Student
                    </button>
                    <button className="btn-primary" onClick={() => setShowLinkModal('tutor-class')}>
                        👨‍🏫 Assign Tutor
                    </button>
                </div>
            </div>
            <div className="relationships-table-wrapper">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Student</th>
                            <th>Related To</th>
                            <th>Details</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {relationships.map((rel, idx) => (
                            <tr key={idx}>
                                <td><span className={`badge ${rel.type === 'student-parent' ? 'badge-parent' : 'badge-tutor'}`}>{rel.type}</span></td>
                                <td>{rel.studentName}<br /><small>{rel.studentEmail}</small></td>
                                <td>{rel.relatedName}<br /><small>{rel.relatedEmail}</small></td>
                                <td>{rel.className || '—'}</td>
                                <td>
                                    {rel.type === 'student-parent' ? (
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleUnlinkStudentParent(rel.studentId, rel.relatedId)}
                                            disabled={actionLoading === `unlink-${rel.studentId}-${rel.relatedId}`}
                                        >Unlink</button>
                                    ) : (
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleUnlinkStudentClass(rel.studentId, rel.relatedId)}
                                            disabled={actionLoading === `unlink-${rel.studentId}-${rel.relatedId}`}
                                        >Remove</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {relationships.length === 0 && !loading && (
                            <tr><td colSpan={5} className="no-data">No relationships found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // --- Link Modal with Dropdowns ---
    const renderLinkModal = () => {
        if (!showLinkModal) return null;

        const titles: Record<string, string> = {
            'student-tutor': 'Enroll Student in Class',
            'student-parent': 'Link Student & Parent',
            'tutor-class': 'Assign Tutor to Class',
            'create-class': 'Create New Class',
        };

        return (
            <div className="modal-overlay" onClick={() => setShowLinkModal(null)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>{titles[showLinkModal]}</h2>
                        <button className="modal-close" onClick={() => setShowLinkModal(null)}>×</button>
                    </div>
                    <div className="modal-body">
                        {showLinkModal === 'create-class' ? (
                            <>
                                <div className="form-group">
                                    <label>Class Title *</label>
                                    <input type="text" value={newClassForm.title} onChange={e => setNewClassForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g., Grade 10 Mathematics" />
                                </div>
                                <div className="form-group">
                                    <label>Subject *</label>
                                    <input type="text" value={newClassForm.subject} onChange={e => setNewClassForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g., Mathematics" />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea value={newClassForm.description} onChange={e => setNewClassForm(f => ({ ...f, description: e.target.value }))} placeholder="Class description..." rows={3} />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Schedule</label>
                                        <input type="datetime-local" value={newClassForm.scheduledAt} onChange={e => setNewClassForm(f => ({ ...f, scheduledAt: e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label>Duration (min)</label>
                                        <input type="number" value={newClassForm.duration} onChange={e => setNewClassForm(f => ({ ...f, duration: parseInt(e.target.value) || 60 }))} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Max Students</label>
                                    <input type="number" value={newClassForm.maxStudents} onChange={e => setNewClassForm(f => ({ ...f, maxStudents: parseInt(e.target.value) || 30 }))} />
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Student dropdown */}
                                {(showLinkModal === 'student-tutor' || showLinkModal === 'student-parent') && (
                                    <div className="form-group">
                                        <label>Select Student *</label>
                                        <select value={linkForm.studentId} onChange={e => setLinkForm(f => ({ ...f, studentId: e.target.value }))}>
                                            <option value="">-- Choose a student --</option>
                                            {approvedStudents.map(s => (
                                                <option key={s.id} value={s.id}>{s.fullName} ({s.email})</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Parent dropdown */}
                                {showLinkModal === 'student-parent' && (
                                    <div className="form-group">
                                        <label>Select Parent *</label>
                                        <select value={linkForm.parentId} onChange={e => setLinkForm(f => ({ ...f, parentId: e.target.value }))}>
                                            <option value="">-- Choose a parent --</option>
                                            {approvedParents.map(p => (
                                                <option key={p.id} value={p.id}>{p.fullName} ({p.email})</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Tutor dropdown */}
                                {showLinkModal === 'tutor-class' && (
                                    <div className="form-group">
                                        <label>Select Tutor *</label>
                                        <select value={linkForm.tutorId} onChange={e => setLinkForm(f => ({ ...f, tutorId: e.target.value }))}>
                                            <option value="">-- Choose a tutor --</option>
                                            {approvedTutors.map(t => (
                                                <option key={t.id} value={t.id}>{t.fullName} ({t.email})</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Class dropdown */}
                                {(showLinkModal === 'student-tutor' || showLinkModal === 'tutor-class') && (
                                    <div className="form-group">
                                        <label>Select Class *</label>
                                        <select value={linkForm.classId} onChange={e => setLinkForm(f => ({ ...f, classId: e.target.value }))}>
                                            <option value="">-- Choose a class --</option>
                                            {allClasses.map(c => (
                                                <option key={c.id} value={c.id}>{c.title} — {c.subject}{c.tutorName ? ` (${c.tutorName})` : ''}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button className="btn-secondary" onClick={() => setShowLinkModal(null)}>Cancel</button>
                        <button className="btn-primary" onClick={handleLinkSubmit} disabled={actionLoading === 'link'}>
                            {actionLoading === 'link' ? 'Processing...' : 'Confirm'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // --- Edit User Modal ---
    const renderEditModal = () => {
        if (!editingUser) return null;

        return (
            <div className="modal-overlay" onClick={() => setEditingUser(null)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Edit User</h2>
                        <button className="modal-close" onClick={() => setEditingUser(null)}>×</button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" value={editForm.fullName} onChange={e => setEditForm(f => ({ ...f, fullName: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}>
                                <option value="student">Student</option>
                                <option value="tutor">Tutor</option>
                                <option value="parent">Parent</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="text" value={editForm.phoneNumber} onChange={e => setEditForm(f => ({ ...f, phoneNumber: e.target.value }))} placeholder="e.g., +27 12 345 6789" />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn-secondary" onClick={() => setEditingUser(null)}>Cancel</button>
                        <button className="btn-primary" onClick={handleEditSubmit} disabled={actionLoading === 'edit'}>
                            {actionLoading === 'edit' ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // --- Assign Class to Tutor Modal ---
    const renderAssignClassModal = () => {
        if (!assignTutorUser) return null;

        return (
            <div className="modal-overlay" onClick={() => setAssignTutorUser(null)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Assign Class to {assignTutorUser.fullName}</h2>
                        <button className="modal-close" onClick={() => setAssignTutorUser(null)}>×</button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label>Select Class *</label>
                            <select value={assignClassId} onChange={e => setAssignClassId(e.target.value)}>
                                <option value="">-- Choose a class --</option>
                                {allClasses.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.title} — {c.subject}{c.tutorName ? ` (currently: ${c.tutorName})` : ' (no tutor)'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn-secondary" onClick={() => setAssignTutorUser(null)}>Cancel</button>
                        <button className="btn-primary" onClick={handleAssignClassToTutor} disabled={actionLoading === 'assign-class' || !assignClassId}>
                            {actionLoading === 'assign-class' ? 'Assigning...' : 'Assign Class'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const tabs: { key: TabKey; label: string; icon: string }[] = [
        { key: 'dashboard', label: 'Dashboard', icon: '📊' },
        { key: 'users', label: 'Users', icon: '👥' },
        { key: 'pending', label: 'Pending', icon: '⏳' },
        { key: 'classes', label: 'Classes', icon: '📚' },
        { key: 'relationships', label: 'Links', icon: '🔗' },
    ];

    return (
        <div className="admin-page">
            <Header navigationLinks={navigationLinks} />

            <div className="admin-container">
                <div className="admin-sidebar">
                    <h2 className="sidebar-title">Admin Panel</h2>
                    <nav className="sidebar-nav">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                className={`sidebar-btn ${activeTab === tab.key ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                <span className="sidebar-icon">{tab.icon}</span>
                                <span className="sidebar-label">{tab.label}</span>
                                {tab.key === 'pending' && stats && stats.pendingApprovals > 0 && (
                                    <span className="sidebar-badge">{stats.pendingApprovals}</span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="admin-main">
                    {error && (
                        <div className="admin-alert admin-alert-error">
                            <span>{error}</span>
                            <button onClick={() => setError(null)}>×</button>
                        </div>
                    )}
                    {successMsg && (
                        <div className="admin-alert admin-alert-success">
                            <span>{successMsg}</span>
                        </div>
                    )}

                    {loading && (
                        <div className="admin-loading">
                            <div className="spinner" />
                            <p>Loading...</p>
                        </div>
                    )}

                    {!loading && activeTab === 'dashboard' && renderDashboard()}
                    {!loading && activeTab === 'users' && renderUsers()}
                    {!loading && activeTab === 'pending' && renderPending()}
                    {!loading && activeTab === 'classes' && renderClasses()}
                    {!loading && activeTab === 'relationships' && renderRelationships()}
                </div>
            </div>

            {renderLinkModal()}
            {renderEditModal()}
            {renderAssignClassModal()}

            <Footer />
        </div>
    );
};

export default AdminDashboard;
