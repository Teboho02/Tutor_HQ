import apiClient from '../config/api';

export interface CreateAssignmentData {
    title: string;
    description?: string;
    classId: string;
    dueDate: string;
    totalMarks: number;
    allowLateSubmission?: boolean;
    lateSubmissionPenalty?: number;
    instructions?: string;
}

export interface Assignment {
    id: string;
    title: string;
    description: string;
    class_id: string;
    tutor_id: string;
    total_marks: number;
    due_date: string;
    allow_late_submission: boolean;
    late_submission_penalty: number;
    instructions: string;
    status: 'draft' | 'published' | 'archived';
    created_at: string;
    classes?: {
        title: string;
        subject: string;
    };
    assignment_submissions?: AssignmentSubmission[];
}

export interface AssignmentSubmission {
    id: string;
    assignment_id: string;
    student_id: string;
    file_url?: string;
    description?: string;
    answers?: Record<string, unknown>;
    submitted_at: string;
    is_late: boolean;
    score?: number;
    percentage?: number;
    feedback?: string;
    graded_at?: string;
    status: 'submitted' | 'graded' | 'returned';
}

export const assignmentService = {
    /**
     * Create a new assignment (Tutor only)
     */
    async createAssignment(data: CreateAssignmentData) {
        const response = await apiClient.post('/assignments', data);
        return response.data;
    },

    /**
     * Get assignment details
     */
    async getAssignment(assignmentId: string) {
        const response = await apiClient.get(`/assignments/${assignmentId}`);
        return response.data;
    },

    /**
     * Submit assignment (Student)
     */
    async submitAssignment(assignmentId: string, submissionData: {
        fileUrl?: string;
        description?: string;
        answers?: Record<string, unknown>;
    }) {
        const response = await apiClient.post(`/assignments/${assignmentId}/submit`, submissionData);
        return response.data;
    },

    /**
     * Grade assignment (Tutor)
     */
    async gradeSubmission(submissionId: string, score: number, feedback?: string) {
        const response = await apiClient.post(`/assignments/submissions/${submissionId}/grade`, {
            score,
            feedback,
        });
        return response.data;
    },

    /**
     * Get student assignments
     */
    async getStudentAssignments(studentId: string) {
        const response = await apiClient.get(`/assignments/student/${studentId}`);
        return response.data;
    },

    /**
     * Get class assignments (Tutor)
     */
    async getClassAssignments(classId: string) {
        const response = await apiClient.get(`/assignments/class/${classId}`);
        return response.data;
    },

    /**
     * Upload file to server
     */
    async uploadFile(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post('/assignments/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
