import apiClient, { handleApiError } from './client';

export interface ClassData {
    title: string;
    subject: string;
    description?: string;
    startTime: string;
    endTime: string;
    duration?: number;
    meetingUrl?: string;
    maxStudents?: number;
    isGroup?: boolean;
}

// Classes API Services
export const classesApi = {
    /**
     * Get all classes with optional filters
     */
    getClasses: async (filters?: {
        tutorId?: string;
        studentId?: string;
        status?: string;
        subject?: string;
        startDate?: string;
        endDate?: string;
    }) => {
        try {
            const response = await apiClient.get('/classes', { params: filters });
            return response.data.classes;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get class by ID
     */
    getClass: async (classId: string) => {
        try {
            const response = await apiClient.get(`/classes/${classId}`);
            return response.data.class;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Create a new class (tutors only)
     */
    createClass: async (data: ClassData) => {
        try {
            const response = await apiClient.post('/classes', data);
            return response.data.class;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Update class
     */
    updateClass: async (classId: string, data: Partial<ClassData>) => {
        try {
            const response = await apiClient.put(`/classes/${classId}`, data);
            return response.data.class;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Delete class
     */
    deleteClass: async (classId: string) => {
        try {
            const response = await apiClient.delete(`/classes/${classId}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Enroll in a class (students only)
     */
    enrollInClass: async (classId: string) => {
        try {
            const response = await apiClient.post(`/classes/${classId}/enroll`);
            return response.data.enrollment;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Unenroll from a class
     */
    unenrollFromClass: async (classId: string) => {
        try {
            const response = await apiClient.delete(`/classes/${classId}/enroll`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Update attendance status (tutors only)
     */
    updateAttendance: async (
        classId: string,
        enrollmentId: string,
        attendanceStatus: 'pending' | 'attended' | 'absent' | 'excused'
    ) => {
        try {
            const response = await apiClient.put(`/classes/${classId}/attendance/${enrollmentId}`, {
                attendanceStatus,
            });
            return response.data.enrollment;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};
