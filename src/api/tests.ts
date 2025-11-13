import apiClient, { handleApiError } from './client';

export interface TestData {
    title: string;
    subject: string;
    description?: string;
    testType: 'quiz' | 'test' | 'assignment' | 'homework';
    questions: any[];
    totalPoints: number;
    duration?: number;
    dueDate?: string;
}

// Tests/Assignments API Services
export const testsApi = {
    /**
     * Get all tests with optional filters
     */
    getTests: async (filters?: {
        tutorId?: string;
        subject?: string;
        testType?: string;
    }) => {
        try {
            const response = await apiClient.get('/tests', { params: filters });
            return response.data.tests;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get test by ID
     */
    getTest: async (testId: string) => {
        try {
            const response = await apiClient.get(`/tests/${testId}`);
            return response.data.test;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Create a new test (tutors only)
     */
    createTest: async (data: TestData) => {
        try {
            const response = await apiClient.post('/tests', data);
            return response.data.test;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Update test
     */
    updateTest: async (testId: string, data: Partial<TestData>) => {
        try {
            const response = await apiClient.put(`/tests/${testId}`, data);
            return response.data.test;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Delete test
     */
    deleteTest: async (testId: string) => {
        try {
            const response = await apiClient.delete(`/tests/${testId}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Assign test to students (tutors only)
     */
    assignTest: async (testId: string, studentIds: string[], dueDate?: string) => {
        try {
            const response = await apiClient.post(`/tests/${testId}/assign`, {
                studentIds,
                dueDate,
            });
            return response.data.assignments;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get assignments for a student
     */
    getStudentAssignments: async (studentId: string, status?: string) => {
        try {
            const response = await apiClient.get(`/tests/assignments/student/${studentId}`, {
                params: { status },
            });
            return response.data.assignments;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get assignment details
     */
    getAssignment: async (assignmentId: string) => {
        try {
            const response = await apiClient.get(`/tests/assignments/${assignmentId}`);
            return response.data.assignment;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Submit test answers (students only)
     */
    submitTest: async (assignmentId: string, answers: any[]) => {
        try {
            const response = await apiClient.post(`/tests/assignments/${assignmentId}/submit`, {
                answers,
            });
            return response.data.submission;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Grade submission (tutors only)
     */
    gradeSubmission: async (submissionId: string, score: number, feedback?: string) => {
        try {
            const response = await apiClient.put(`/tests/submissions/${submissionId}/grade`, {
                score,
                feedback,
            });
            return response.data.submission;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};
