import apiClient, { handleApiError } from './client';

// User API Services
export const usersApi = {
    /**
     * Get user profile by ID
     */
    getProfile: async (userId: string) => {
        try {
            const response = await apiClient.get(`/users/profile/${userId}`);
            return response.data.profile;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Update user profile
     */
    updateProfile: async (userId: string, data: any) => {
        try {
            const response = await apiClient.put(`/users/profile/${userId}`, data);
            return response.data.profile;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get all tutors with optional filters
     */
    getTutors: async (filters?: { subject?: string; minRating?: number; maxRate?: number }) => {
        try {
            const response = await apiClient.get('/users/tutors', { params: filters });
            return response.data.tutors;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get tutor by ID
     */
    getTutor: async (tutorId: string) => {
        try {
            const response = await apiClient.get(`/users/tutors/${tutorId}`);
            return response.data.tutor;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Update tutor profile
     */
    updateTutor: async (tutorId: string, data: any) => {
        try {
            const response = await apiClient.put(`/users/tutors/${tutorId}`, data);
            return response.data.tutor;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get student by ID
     */
    getStudent: async (studentId: string) => {
        try {
            const response = await apiClient.get(`/users/students/${studentId}`);
            return response.data.student;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Update student profile
     */
    updateStudent: async (studentId: string, data: any) => {
        try {
            const response = await apiClient.put(`/users/students/${studentId}`, data);
            return response.data.student;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get students for a parent
     */
    getParentStudents: async (parentId: string) => {
        try {
            const response = await apiClient.get(`/users/parents/${parentId}/students`);
            return response.data.students;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Link student to parent
     */
    linkStudentToParent: async (parentId: string, studentId: string, relationship?: string) => {
        try {
            const response = await apiClient.post(`/users/parents/${parentId}/students`, {
                studentId,
                relationship,
            });
            return response.data.link;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Search users
     */
    searchUsers: async (query: string, role?: string) => {
        try {
            const response = await apiClient.get('/users/search', {
                params: { query, role },
            });
            return response.data.users;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};
