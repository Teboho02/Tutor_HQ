export interface Microassessment {
    id: string;
    studentId: string;
    topic: string;
    subject: string;
    score: number;
    maxScore: number;
    percentage: number;
    date: Date;
    tutorId: string;
    tutorName: string;
    feedback?: string;
}

export interface MicroassessmentStats {
    recentAssessments: Microassessment[];
    averageLast10: number;
    averageLast30Days: number;
    totalAssessments: number;
    strongTopics: string[];
    weakTopics: string[];
    trend: 'improving' | 'stable' | 'declining';
}
