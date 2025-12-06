export interface SubjectGrade {
    subject: string;
    grade: number;
    letterGrade: string;
    testsCompleted: number;
    assignmentsCompleted: number;
    microassessmentsCompleted: number;
}

export interface MonthlyGrade {
    id: string;
    studentId: string;
    month: number; // 1-12
    year: number;
    subjects: SubjectGrade[];
    overallAverage: number;
    overallLetterGrade: string;
    totalTests: number;
    totalAssignments: number;
    attendanceRate: number;
    trend: 'up' | 'down' | 'stable';
    previousMonthAverage?: number;
}

export interface GradeHistory {
    months: MonthlyGrade[];
    bestMonth: MonthlyGrade;
    averageOverall: number;
}
