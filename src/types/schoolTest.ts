export interface TutorComment {
    id: string;
    tutorId: string;
    tutorName: string;
    comment: string;
    createdAt: Date;
    isPrivate: boolean; // Whether only student and tutor can see it
}

export interface SchoolTest {
    id: string;
    studentId: string;
    subject: string;
    testName: string;
    testDate: Date;
    score?: number;
    maxScore?: number;
    grade?: string;
    imageUrl: string;
    thumbnailUrl?: string;
    uploadedAt: Date;
    tutorComments: TutorComment[];
    status: 'pending_review' | 'reviewed' | 'needs_improvement';
    tags: string[];
}

export interface SchoolTestUploadData {
    subject: string;
    testName: string;
    testDate: Date;
    score?: number;
    maxScore?: number;
    grade?: string;
    imageFile: File;
    tags?: string[];
}
