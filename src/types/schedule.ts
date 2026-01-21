// Schedule-related types for classes, tests, and assignments

export type ClassType = '1-1' | 'group';
export type ScheduleItemType = 'liveClass' | 'test' | 'assignment';

/**
 * Represents a scheduled live class
 */
export interface ScheduledClass {
    id: string;
    subject: string;
    topic: string;
    tutorId: string;
    tutorName: string;
    date: Date;
    time: string; // HH:MM format
    duration: number; // in minutes
    classType: ClassType; // 1-1 or group class
    classLink: string; // Zoom, Google Meet, or custom meeting link
    description?: string;
    studentIds: string[]; // IDs of students enrolled
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    recordings?: {
        id: string;
        url: string;
        uploadedAt: Date;
        duration: number;
    }[];
}

/**
 * Represents a scheduled test/quiz
 */
export interface ScheduledTest {
    id: string;
    title: string;
    subject: string;
    tutorId: string;
    tutorName: string;
    date: Date;
    time: string; // HH:MM format
    duration: number; // in minutes
    classType: ClassType; // whether this is for 1-1 or group students
    totalMarks: number;
    passingMarks: number;
    questions: TestQuestion[];
    studentIds: string[];
    status: 'scheduled' | 'ongoing' | 'completed';
    instructions?: string;
    allowRetakes: boolean;
    maxRetakes?: number;
}

/**
 * Represents a scheduled assignment
 */
export interface ScheduledAssignment {
    id: string;
    title: string;
    subject: string;
    tutorId: string;
    tutorName: string;
    createdDate: Date;
    dueDate: Date;
    classType: ClassType; // whether this is for 1-1 or group students
    description?: string;
    assignmentType: 'test' | 'upload' | 'both'; // test-based, file upload, or both
    questions?: TestQuestion[]; // if test-based
    allowedFileTypes?: string[]; // e.g., ['.pdf', '.docx', '.jpg']
    maxFileSize?: number; // in MB
    requiresDescription?: boolean;
    totalMarks: number;
    studentIds: string[];
    status: 'active' | 'completed' | 'archived';
    submissions?: StudentAssignmentSubmission[];
}

/**
 * Test/Quiz question structure
 */
export interface TestQuestion {
    id: string;
    questionText: string;
    questionType: 'multiple-choice' | 'short-answer' | 'essay' | 'fill-blank';
    options?: string[]; // for multiple choice
    correctAnswer?: string | string[]; // for validation
    points: number;
    explanation?: string; // feedback for students
}

/**
 * Student assignment submission
 */
export interface StudentAssignmentSubmission {
    id: string;
    studentId: string;
    studentName: string;
    assignmentId: string;
    submittedAt: Date;
    submissionType: 'test' | 'file' | 'both';
    testAnswers?: StudentTestAnswer[];
    fileSubmissions?: FileSubmission[];
    score?: number;
    feedback?: string;
    tutorComments?: TutorComment[];
}

/**
 * Student's answer to a test question
 */
export interface StudentTestAnswer {
    questionId: string;
    answer: string;
    submittedAt: Date;
    isCorrect?: boolean;
    earnedPoints?: number;
}

/**
 * File submission for assignment
 */
export interface FileSubmission {
    id: string;
    fileName: string;
    fileUrl: string; // URL to Supabase or storage
    fileSize: number; // in bytes
    uploadedAt: Date;
    description?: string;
    fileType: string; // MIME type
}

/**
 * Tutor comment on student work
 */
export interface TutorComment {
    id: string;
    tutorId: string;
    tutorName: string;
    comment: string;
    createdAt: Date;
    updatedAt?: Date;
    onQuestion?: string; // if commenting on specific question
}

/**
 * School test score uploaded by student
 */
export interface StudentTestScore {
    id: string;
    studentId: string;
    subject: string;
    testName: string;
    score?: number; // if extracted or manually entered
    maxScore?: number;
    imageUrl: string; // URL to Supabase or storage
    uploadedAt: Date;
    notes?: string; // student notes about the test
    tutorComments?: TutorComment[];
}

/**
 * Class schedule view (for calendar and schedule displays)
 */
export interface ClassScheduleEvent {
    id: string;
    type: 'class' | 'test' | 'assignment';
    title: string;
    subject: string;
    date: Date;
    time: string;
    duration: number;
    classType: ClassType;
    tutorName: string;
    description?: string;
    link?: string; // for live class
    status: string;
}
