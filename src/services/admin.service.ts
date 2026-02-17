import apiClient from '../config/api';

export interface AdminUser {
    id: string;
    email: string;
    fullName: string;
    role: 'student' | 'tutor' | 'parent' | 'admin';
    status: 'pending' | 'approved' | 'rejected';
    phoneNumber?: string;
    avatarUrl?: string;
    createdAt: string;
}

export interface AdminClass {
    id: string;
    title: string;
    subject: string;
    tutorId?: string;
    tutorName?: string;
    scheduledAt?: string;
    duration?: number;
    maxStudents?: number;
    status?: string;
}

export interface DashboardStats {
    totalUsers: number;
    pendingApprovals: number;
    totalStudents: number;
    totalTutors: number;
    totalParents: number;
    totalClasses: number;
}

export interface Relationship {
    type: 'student-tutor' | 'student-parent';
    studentId: string;
    studentName: string;
    studentEmail: string;
    relatedId: string;
    relatedName: string;
    relatedEmail: string;
    relatedRole: string;
    className?: string;
}

export const adminService = {
    // Dashboard
    async getDashboard() {
        const response = await apiClient.get('/admin/dashboard');
        return response.data;
    },

    // Users
    async getUsers(params?: { role?: string; status?: string; search?: string }) {
        const response = await apiClient.get('/admin/users', { params });
        return response.data;
    },

    async getPendingUsers() {
        const response = await apiClient.get('/admin/users/pending');
        return response.data;
    },

    async approveUser(userId: string) {
        const response = await apiClient.patch(`/admin/users/${userId}/approve`);
        return response.data;
    },

    async rejectUser(userId: string, reason?: string) {
        const response = await apiClient.patch(`/admin/users/${userId}/reject`, { reason });
        return response.data;
    },

    async deleteUser(userId: string) {
        const response = await apiClient.delete(`/admin/users/${userId}`);
        return response.data;
    },

    // Student-Tutor links (via class enrollment)
    async linkStudentToTutor(studentId: string, classId: string) {
        const response = await apiClient.post('/admin/link-student-tutor', { studentId, classId });
        return response.data;
    },

    async unlinkStudentFromTutor(studentId: string, classId: string) {
        const response = await apiClient.delete('/admin/unlink-student-tutor', {
            data: { studentId, classId },
        });
        return response.data;
    },

    // Student-Parent links
    async linkStudentToParent(studentId: string, parentId: string) {
        const response = await apiClient.post('/admin/link-student-parent', { studentId, parentId });
        return response.data;
    },

    async unlinkStudentFromParent(studentId: string, parentId: string) {
        const response = await apiClient.delete('/admin/unlink-student-parent', {
            data: { studentId, parentId },
        });
        return response.data;
    },

    // Tutor-Class assignment
    async assignTutorToClass(tutorId: string, classId: string) {
        const response = await apiClient.post('/admin/assign-tutor-class', { tutorId, classId });
        return response.data;
    },

    // Classes
    async getClasses() {
        const response = await apiClient.get('/admin/classes');
        return response.data;
    },

    async createClass(data: { title: string; subject: string; description?: string; scheduledAt?: string; duration?: number; maxStudents?: number }) {
        const response = await apiClient.post('/admin/classes', data);
        return response.data;
    },

    // Relationships
    async getRelationships() {
        const response = await apiClient.get('/admin/relationships');
        return response.data;
    },
};
