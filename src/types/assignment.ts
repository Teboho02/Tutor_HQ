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
    updated_at: string;
    classes?: {
        title: string;
        subject: string;
    };
    profiles?: {
        full_name: string;
        avatar_url: string;
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
