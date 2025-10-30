// Test and Assignment System Types

export type QuestionType = 'text' | 'multiple-choice' | 'multiple-select' | 'scale' | 'image';

export type AssignmentType = 'test' | 'upload' | 'both';

export interface QuestionContent {
    text?: string;
    image?: string; // URL or base64
}

export interface AnswerOption {
    id: string;
    text?: string;
    image?: string;
    isCorrect?: boolean; // For tutor's reference
}

export interface Question {
    id: string;
    type: QuestionType;
    content: QuestionContent;
    options?: AnswerOption[]; // For multiple-choice, multiple-select, or image options
    correctAnswer?: string | string[]; // For text or multiple answers
    scaleMin?: number; // For scale questions
    scaleMax?: number;
    correctScale?: number; // For scale questions
    points: number;
}

export interface Test {
    id: string;
    title: string;
    subject: string;
    description: string;
    tutorId: string;
    tutorName: string;
    scheduledDate: string;
    scheduledTime: string;
    duration: number; // in minutes
    totalPoints: number;
    questions: Question[];
    studentIds: string[]; // Students assigned to this test
    status: 'upcoming' | 'active' | 'completed';
    createdAt: string;
    assignmentType?: AssignmentType; // 'test', 'upload', or 'both'
    allowedFileTypes?: string[]; // e.g., ['.pdf', '.docx', '.jpg']
    maxFileSize?: number; // in MB
    requiresDescription?: boolean; // Whether student must provide text description
}

export interface StudentAnswer {
    questionId: string;
    answer: string | string[] | number; // text, multiple choices, or scale value
    timeSpent?: number; // seconds spent on this question
}

export interface UploadedFile {
    id: string;
    name: string;
    size: number; // in bytes
    type: string; // MIME type
    url: string; // URL to access the file
    uploadedAt: string;
}

export interface TestSubmission {
    id: string;
    testId: string;
    studentId: string;
    studentName: string;
    answers: StudentAnswer[];
    score: number;
    totalPoints: number;
    submittedAt: string;
    timeStarted: string;
    timeCompleted: string;
    uploadedFiles?: UploadedFile[]; // For assignment submissions
    description?: string; // Text description for assignments
}

export interface TestResult extends TestSubmission {
    test: Test;
    correctAnswers: Map<string, boolean>; // questionId -> isCorrect
    feedback?: string;
}
