import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Student, Tutor, Parent } from '../../types/admin';
import '../../styles/AdminUsers.css';

type UserType = Student | Tutor | Parent;

const AdminUsers: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'students' | 'tutors' | 'parents'>('students');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addUserType, setAddUserType] = useState<'student' | 'tutor' | 'parent'>('student');

    // Mock users data
    const [students] = useState<Student[]>([
        {
            id: 'student1',
            firstName: 'Thabo',
            lastName: 'Mabaso',
            email: 'thabo.mabaso@email.com',
            phone: '+27 71 234 5678',
            role: 'student',
            status: 'active',
            createdAt: new Date('2024-09-15'),
            grade: '11',
            subjects: ['Mathematics', 'Physical Sciences', 'Life Sciences'],
            enrollmentDate: new Date('2024-09-15'),
            totalSessions: 42,
            averageGrade: 76,
            paymentStatus: 'current',
            assignedTutors: ['tutor1', 'tutor2']
        },
        {
            id: 'student2',
            firstName: 'Lindiwe',
            lastName: 'Nkosi',
            email: 'lindiwe.nkosi@email.com',
            phone: '+27 82 345 6789',
            role: 'student',
            status: 'active',
            createdAt: new Date('2024-10-20'),
            grade: '9',
            subjects: ['English', 'Mathematics', 'Geography'],
            enrollmentDate: new Date('2024-10-20'),
            totalSessions: 28,
            averageGrade: 82,
            paymentStatus: 'overdue',
            assignedTutors: ['tutor3']
        },
        {
            id: 'student3',
            firstName: 'Sipho',
            lastName: 'Khumalo',
            email: 'sipho.khumalo@email.com',
            phone: '+27 83 456 7890',
            role: 'student',
            status: 'suspended',
            createdAt: new Date('2024-08-10'),
            grade: '12',
            subjects: ['Accounting', 'Business Studies', 'Economics'],
            enrollmentDate: new Date('2024-08-10'),
            totalSessions: 15,
            averageGrade: 65,
            paymentStatus: 'suspended',
            assignedTutors: []
        }
    ]);

    const [tutors] = useState<Tutor[]>([
        {
            id: 'tutor1',
            firstName: 'Sipho',
            lastName: 'Dlamini',
            email: 'sipho.dlamini@email.com',
            phone: '+27 83 456 7890',
            role: 'tutor',
            status: 'active',
            createdAt: new Date('2024-07-01'),
            subjects: ['Mathematics', 'Physical Sciences'],
            qualifications: ['BSc Mathematics, UCT', 'PGCE'],
            hourlyRate: 350,
            totalEarnings: 14700,
            totalSessions: 42,
            rating: 4.8,
            verified: true,
            availability: {},
            pendingPayment: 0
        },
        {
            id: 'tutor2',
            firstName: 'Nomsa',
            lastName: 'Shabalala',
            email: 'nomsa.shabalala@email.com',
            phone: '+27 84 567 8901',
            role: 'tutor',
            status: 'active',
            createdAt: new Date('2024-06-15'),
            subjects: ['Life Sciences', 'Physical Sciences'],
            qualifications: ['BSc Biology, Wits', 'Honours Biochemistry'],
            hourlyRate: 400,
            totalEarnings: 21000,
            totalSessions: 52,
            rating: 4.9,
            verified: true,
            availability: {},
            pendingPayment: 19950
        },
        {
            id: 'tutor3',
            firstName: 'Thandi',
            lastName: 'Ndlovu',
            email: 'thandi.ndlovu@email.com',
            phone: '+27 85 678 9012',
            role: 'tutor',
            status: 'inactive',
            createdAt: new Date('2024-05-20'),
            subjects: ['English', 'History'],
            qualifications: ['BA English Literature, Stellenbosch'],
            hourlyRate: 375,
            totalEarnings: 16875,
            totalSessions: 45,
            rating: 4.7,
            verified: true,
            availability: {},
            pendingPayment: 0
        }
    ]);

    const [parents] = useState<Parent[]>([
        {
            id: 'parent1',
            firstName: 'Michael',
            lastName: 'Mabaso',
            email: 'michael.mabaso@email.com',
            phone: '+27 71 234 5678',
            role: 'parent',
            status: 'active',
            createdAt: new Date('2024-09-15'),
            children: ['student1'],
            totalSpent: 7200,
            paymentMethod: 'PayFast'
        },
        {
            id: 'parent2',
            firstName: 'Sarah',
            lastName: 'Nkosi',
            email: 'sarah.nkosi@email.com',
            phone: '+27 82 345 6789',
            role: 'parent',
            status: 'active',
            createdAt: new Date('2024-10-20'),
            children: ['student2'],
            totalSpent: 3200,
            paymentMethod: 'Bank Transfer'
        }
    ]);

    const handleSuspend = (user: UserType) => {
        if (confirm(`Are you sure you want to suspend ${user.firstName} ${user.lastName}?`)) {
            alert(`${user.firstName} ${user.lastName} has been suspended.`);
        }
    };

    const handleReactivate = (user: UserType) => {
        alert(`${user.firstName} ${user.lastName} has been reactivated.`);
    };

    const handleEdit = (user: UserType) => {
        setSelectedUser(user);
    };

    const handleAddUser = (type: 'student' | 'tutor' | 'parent') => {
        setAddUserType(type);
        setShowAddModal(true);
    };

    const handleSubmitNewUser = () => {
        alert(`New ${addUserType} added successfully!`);
        setShowAddModal(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return '#10b981';
            case 'inactive': return '#6b7280';
            case 'pending': return '#f59e0b';
            case 'suspended': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const filterUsers = (users: UserType[]) => {
        let filtered = users;

        if (filterStatus !== 'all') {
            filtered = filtered.filter(u => u.status === filterStatus);
        }

        if (searchQuery) {
            filtered = filtered.filter(u =>
                `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    const currentUsers = activeTab === 'students' ? students :
        activeTab === 'tutors' ? tutors : parents;
    const filteredUsers = filterUsers(currentUsers);

    return (
        <div className="admin-users">
            <div className="admin-header">
                <div className="admin-header-content">
                    <div className="admin-logo">
                        <h1>🎓 TutorHQ Admin</h1>
                        <span className="admin-badge">Users</span>
                    </div>
                    <Link to="/admin" className="back-btn">← Back to Dashboard</Link>
                </div>
            </div>

            <div className="admin-main">
                <div className="admin-container">
                    <div className="page-header">
                        <div>
                            <h2>User Management</h2>
                            <p>View and manage all platform users</p>
                        </div>
                        <div className="add-user-buttons">
                            <button className="add-btn student-btn" onClick={() => handleAddUser('student')}>
                                ➕ Add Student
                            </button>
                            <button className="add-btn tutor-btn" onClick={() => handleAddUser('tutor')}>
                                ➕ Add Tutor
                            </button>
                            <button className="add-btn parent-btn" onClick={() => handleAddUser('parent')}>
                                ➕ Add Parent
                            </button>
                        </div>
                    </div>

                    <div className="stats-row">
                        <div className="stat-card students">
                            <div className="stat-icon">👨‍🎓</div>
                            <div className="stat-content">
                                <div className="stat-label">Total Students</div>
                                <div className="stat-value">{students.length}</div>
                                <div className="stat-detail">
                                    {students.filter(s => s.status === 'active').length} active
                                </div>
                            </div>
                        </div>
                        <div className="stat-card tutors">
                            <div className="stat-icon">👨‍🏫</div>
                            <div className="stat-content">
                                <div className="stat-label">Total Tutors</div>
                                <div className="stat-value">{tutors.length}</div>
                                <div className="stat-detail">
                                    {tutors.filter(t => t.status === 'active').length} active
                                </div>
                            </div>
                        </div>
                        <div className="stat-card parents">
                            <div className="stat-icon">👨‍👩‍👧</div>
                            <div className="stat-content">
                                <div className="stat-label">Total Parents</div>
                                <div className="stat-value">{parents.length}</div>
                                <div className="stat-detail">
                                    {parents.filter(p => p.status === 'active').length} active
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="search-filter-bar">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select
                            className="filter-select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>

                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === 'students' ? 'active' : ''}`}
                            onClick={() => setActiveTab('students')}
                        >
                            Students ({students.length})
                        </button>
                        <button
                            className={`tab ${activeTab === 'tutors' ? 'active' : ''}`}
                            onClick={() => setActiveTab('tutors')}
                        >
                            Tutors ({tutors.length})
                        </button>
                        <button
                            className={`tab ${activeTab === 'parents' ? 'active' : ''}`}
                            onClick={() => setActiveTab('parents')}
                        >
                            Parents ({parents.length})
                        </button>
                    </div>

                    <div className="users-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Contact</th>
                                    {activeTab === 'students' && <th>Grade/Subjects</th>}
                                    {activeTab === 'students' && <th>Performance</th>}
                                    {activeTab === 'tutors' && <th>Subjects</th>}
                                    {activeTab === 'tutors' && <th>Rating/Sessions</th>}
                                    {activeTab === 'parents' && <th>Children</th>}
                                    {activeTab === 'parents' && <th>Total Spent</th>}
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="user-avatar">
                                                    {user.firstName[0]}{user.lastName[0]}
                                                </div>
                                                <div>
                                                    <div className="user-name">{user.firstName} {user.lastName}</div>
                                                    <div className="user-date">
                                                        Joined {user.createdAt.toLocaleDateString('en-ZA')}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div>{user.email}</div>
                                            <div className="user-phone">{user.phone}</div>
                                        </td>
                                        {activeTab === 'students' && (
                                            <>
                                                <td>
                                                    <div>Grade {(user as Student).grade}</div>
                                                    <div className="user-detail">
                                                        {(user as Student).subjects.length} subjects
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>Avg: {(user as Student).averageGrade}%</div>
                                                    <div className="user-detail">
                                                        {(user as Student).totalSessions} sessions
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                        {activeTab === 'tutors' && (
                                            <>
                                                <td>
                                                    <div>{(user as Tutor).subjects.join(', ')}</div>
                                                    <div className="user-detail">
                                                        R{(user as Tutor).hourlyRate}/hour
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>⭐ {(user as Tutor).rating}/5.0</div>
                                                    <div className="user-detail">
                                                        {(user as Tutor).totalSessions} sessions
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                        {activeTab === 'parents' && (
                                            <>
                                                <td>
                                                    {(user as Parent).children.length} child(ren)
                                                </td>
                                                <td>
                                                    R{(user as Parent).totalSpent.toLocaleString()}
                                                </td>
                                            </>
                                        )}
                                        <td>
                                            <span
                                                className="status-pill"
                                                style={{ background: getStatusColor(user.status) }}
                                            >
                                                {user.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="action-btn edit"
                                                    onClick={() => handleEdit(user)}
                                                >
                                                    ✏️ Edit
                                                </button>
                                                {user.status === 'active' ? (
                                                    <button
                                                        className="action-btn suspend"
                                                        onClick={() => handleSuspend(user)}
                                                    >
                                                        🚫 Suspend
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="action-btn reactivate"
                                                        onClick={() => handleReactivate(user)}
                                                    >
                                                        ✅ Reactivate
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content add-user-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add New {addUserType === 'student' ? 'Student' : addUserType === 'tutor' ? 'Tutor' : 'Parent'}</h2>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            {/* Personal Information - Common for all */}
                            <div className="form-section">
                                <h3>Personal Information</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>First Name *</label>
                                        <input type="text" placeholder="Enter first name" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name *</label>
                                        <input type="text" placeholder="Enter last name" required />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Email Address *</label>
                                        <input type="email" placeholder="email@example.com" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number *</label>
                                        <input type="tel" placeholder="+27 XX XXX XXXX" required />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>ID Number *</label>
                                        <input type="text" placeholder="Enter ID number" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Date of Birth *</label>
                                        <input type="date" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Physical Address *</label>
                                    <input type="text" placeholder="Street address" required />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>City *</label>
                                        <input type="text" placeholder="City" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Postal Code *</label>
                                        <input type="text" placeholder="0000" required />
                                    </div>
                                </div>
                            </div>

                            {/* Student-Specific Fields */}
                            {addUserType === 'student' && (
                                <>
                                    <div className="form-section">
                                        <h3>Academic Information</h3>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Grade *</label>
                                                <select required>
                                                    <option value="">Select grade</option>
                                                    <option value="8">Grade 8</option>
                                                    <option value="9">Grade 9</option>
                                                    <option value="10">Grade 10</option>
                                                    <option value="11">Grade 11</option>
                                                    <option value="12">Grade 12</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>School Name *</label>
                                                <input type="text" placeholder="Enter school name" required />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Subjects (hold Ctrl to select multiple) *</label>
                                            <select multiple size={6}>
                                                <option value="mathematics">Mathematics</option>
                                                <option value="physical-sciences">Physical Sciences</option>
                                                <option value="life-sciences">Life Sciences</option>
                                                <option value="english">English</option>
                                                <option value="afrikaans">Afrikaans</option>
                                                <option value="accounting">Accounting</option>
                                                <option value="business-studies">Business Studies</option>
                                                <option value="economics">Economics</option>
                                                <option value="geography">Geography</option>
                                                <option value="history">History</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-section parent-link-section">
                                        <h3>Parent/Guardian Information</h3>
                                        <div className="form-group">
                                            <label>Link to Existing Parent</label>
                                            <select>
                                                <option value="">-- Select existing parent or add new below --</option>
                                                {parents.map(parent => (
                                                    <option key={parent.id} value={parent.id}>
                                                        {parent.firstName} {parent.lastName} ({parent.email})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="divider">OR Add New Parent</div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Parent First Name</label>
                                                <input type="text" placeholder="Parent's first name" />
                                            </div>
                                            <div className="form-group">
                                                <label>Parent Last Name</label>
                                                <input type="text" placeholder="Parent's last name" />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Parent Email</label>
                                                <input type="email" placeholder="parent@example.com" />
                                            </div>
                                            <div className="form-group">
                                                <label>Parent Phone</label>
                                                <input type="tel" placeholder="+27 XX XXX XXXX" />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Tutor-Specific Fields */}
                            {addUserType === 'tutor' && (
                                <>
                                    <div className="form-section">
                                        <h3>Teaching Information</h3>
                                        <div className="form-group">
                                            <label>Subjects (hold Ctrl to select multiple) *</label>
                                            <select multiple size={6}>
                                                <option value="mathematics">Mathematics</option>
                                                <option value="physical-sciences">Physical Sciences</option>
                                                <option value="life-sciences">Life Sciences</option>
                                                <option value="english">English</option>
                                                <option value="afrikaans">Afrikaans</option>
                                                <option value="accounting">Accounting</option>
                                                <option value="business-studies">Business Studies</option>
                                                <option value="economics">Economics</option>
                                                <option value="geography">Geography</option>
                                                <option value="history">History</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Qualifications *</label>
                                            <textarea
                                                rows={3}
                                                placeholder="E.g., BSc Mathematics - University of Cape Town, PGCE"
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Years of Experience *</label>
                                                <input type="number" placeholder="0" min="0" required />
                                            </div>
                                            <div className="form-group">
                                                <label>Hourly Rate (ZAR) *</label>
                                                <input type="number" placeholder="350" min="0" required />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-section banking-section">
                                        <h3>Banking Details *</h3>
                                        <div className="form-group">
                                            <label>Bank Name *</label>
                                            <select required>
                                                <option value="">Select bank</option>
                                                <option value="absa">ABSA</option>
                                                <option value="fnb">FNB (First National Bank)</option>
                                                <option value="standard-bank">Standard Bank</option>
                                                <option value="nedbank">Nedbank</option>
                                                <option value="capitec">Capitec Bank</option>
                                                <option value="investec">Investec</option>
                                                <option value="african-bank">African Bank</option>
                                            </select>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Account Number *</label>
                                                <input type="text" placeholder="Enter account number" required />
                                            </div>
                                            <div className="form-group">
                                                <label>Account Type *</label>
                                                <select required>
                                                    <option value="">Select type</option>
                                                    <option value="savings">Savings Account</option>
                                                    <option value="current">Current/Cheque Account</option>
                                                    <option value="transmission">Transmission Account</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Branch Code *</label>
                                                <input type="text" placeholder="Enter branch code" required />
                                            </div>
                                            <div className="form-group">
                                                <label>Account Holder Name *</label>
                                                <input type="text" placeholder="Full name as per bank" required />
                                            </div>
                                        </div>
                                        <div className="banking-note">
                                            <strong>Note:</strong> Banking details are required for tutor payouts.
                                            All information will be kept secure and confidential.
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Parent-Specific Fields */}
                            {addUserType === 'parent' && (
                                <div className="form-section">
                                    <h3>Children Information</h3>
                                    <div className="form-group">
                                        <label>Link to Existing Students</label>
                                        <select multiple size={4}>
                                            {students.map(student => (
                                                <option key={student.id} value={student.id}>
                                                    {student.firstName} {student.lastName} (Grade {student.grade})
                                                </option>
                                            ))}
                                        </select>
                                        <small>Hold Ctrl/Cmd to select multiple children</small>
                                    </div>
                                    <div className="form-group">
                                        <label>Relationship to Children *</label>
                                        <select required>
                                            <option value="">Select relationship</option>
                                            <option value="parent">Parent</option>
                                            <option value="guardian">Legal Guardian</option>
                                            <option value="grandparent">Grandparent</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Preferred Payment Method</label>
                                        <select>
                                            <option value="payfast">PayFast (Card/EFT)</option>
                                            <option value="eft">Direct Bank Transfer</option>
                                            <option value="debit-order">Debit Order</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </button>
                            <button className="submit-btn" onClick={handleSubmitNewUser}>
                                ✅ Add {addUserType === 'student' ? 'Student' : addUserType === 'tutor' ? 'Tutor' : 'Parent'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {selectedUser && (
                <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit User</h2>
                            <button className="close-btn" onClick={() => setSelectedUser(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" defaultValue={selectedUser.firstName} />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" defaultValue={selectedUser.lastName} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" defaultValue={selectedUser.email} />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input type="tel" defaultValue={selectedUser.phone} />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select defaultValue={selectedUser.status}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={() => setSelectedUser(null)}>
                                Cancel
                            </button>
                            <button className="submit-btn" onClick={() => {
                                alert('User updated successfully');
                                setSelectedUser(null);
                            }}>
                                💾 Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
