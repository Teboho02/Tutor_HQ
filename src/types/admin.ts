// Admin User Management Types
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: 'student' | 'tutor' | 'parent' | 'admin';
    status: 'active' | 'inactive' | 'pending' | 'suspended';
    createdAt: Date;
    lastLogin?: Date;
    avatar?: string;
}

export interface Student extends User {
    role: 'student';
    grade: string;
    subjects: string[];
    parentId?: string;
    enrollmentDate: Date;
    totalSessions: number;
    averageGrade: number;
    paymentStatus: 'current' | 'overdue' | 'suspended';
    assignedTutors: string[];
}

export interface Tutor extends User {
    role: 'tutor';
    subjects: string[];
    qualifications: string[];
    hourlyRate: number;
    totalEarnings: number;
    totalSessions: number;
    rating: number;
    verified: boolean;
    availability: WeeklyAvailability;
    pendingPayment: number;
}

export interface Parent extends User {
    role: 'parent';
    children: string[];
    totalSpent: number;
    paymentMethod?: string;
}

// Onboarding Types
export interface OnboardingRequest {
    id: string;
    userId: string;
    type: 'student' | 'tutor';
    status: 'pending' | 'approved' | 'rejected' | 'reviewing';
    createdAt: Date;
    reviewedBy?: string;
    reviewedAt?: Date;
    notes?: string;
    personalInfo: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        dateOfBirth: Date;
        idNumber: string;
        address: string;
    };
    studentInfo?: {
        grade: number;
        school: string;
        subjects: string[];
        learningGoals: string;
    };
    tutorInfo?: {
        subjects: string[];
        grades: number[];
        qualifications: string[];
        experience: string;
        hourlyRate: number;
        availability: WeeklyAvailability;
    };
    documents?: Document[];
}

export interface Document {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
    verified: boolean;
}

// Scheduling Types
export interface ClassSession {
    id: string;
    title: string;
    subject: string;
    tutorId: string;
    tutorName: string;
    studentIds: string[];
    date: Date;
    startTime: string;
    endTime: string;
    duration: number;
    lessonSpaceUrl?: string;
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
    attendance: AttendanceRecord[];
    recordingUrl?: string;
}

export interface AttendanceRecord {
    studentId: string;
    status: 'present' | 'absent' | 'late';
    joinedAt?: Date;
    leftAt?: Date;
}

export interface WeeklyAvailability {
    [key: string]: TimeSlot[]; // Monday, Tuesday, etc.
}

export interface TimeSlot {
    start: string;
    end: string;
}

// Payment Management Types
export interface PaymentRecord {
    id: string;
    userId: string; // studentId
    userName: string; // studentName
    type?: 'tuition' | 'package' | 'material' | 'other';
    amount: number;
    currency: 'ZAR';
    parentId?: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded' | 'overdue';
    dueDate: Date;
    paidDate?: Date;
    method?: 'payfast' | 'bank-transfer' | 'eft' | 'cash' | 'card';
    reference: string;
    invoiceNumber?: string;
    description: string;
    createdAt: Date;
}

export interface TutorPayout {
    id: string;
    tutorId: string;
    tutorName: string;
    period: string; // e.g., "January 2025"
    totalSessions: number; // sessionsCompleted
    totalHours: number;
    hourlyRate: number;
    grossAmount: number; // totalAmount
    deductions: number;
    netAmount: number;
    status: 'pending' | 'processing' | 'completed' | 'paid' | 'on-hold';
    calculatedAt: Date;
    paidAt?: Date; // paymentDate
    paymentMethod?: string;
    reference?: string;
    sessionIds: string[];
}

// Analytics Types
export interface AnalyticsSummary {
    totalStudents: number;
    activeStudents: number;
    totalTutors: number;
    activeTutors: number;
    totalRevenue: number;
    monthlyRevenue: number;
    pendingPayments: number;
    overduePayments: number;
    totalSessions: number;
    completedSessions: number;
    averageAttendance: number;
    studentGrowth: number; // percentage
    revenueGrowth: number; // percentage
}

export interface StudentPerformance {
    studentId: string;
    studentName: string;
    grade: string;
    subjects: SubjectPerformance[];
    overallAverage: number;
    sessionsCompleted: number;
    attendanceRate: number;
    trend?: 'improving' | 'stable' | 'declining';
    lastAssessment?: Date;
    flagged: boolean;
    notes?: string;
}

export interface SubjectPerformance {
    name: string;
    subject?: string;
    tutor?: string;
    average: number;
    currentGrade?: number;
    previousGrade?: number;
    improvement: number;
    trend: 'improving' | 'stable' | 'declining';
    sessionsCompleted?: number;
    lastTest?: {
        date: Date;
        score: number;
        maxScore: number;
    };
}

export interface ClassPerformance {
    subject: string;
    grade: string;
    averageGrade: number;
    totalStudents: number;
    attendanceRate: number;
    tutorName: string;
    sessionCount: number;
    studentsAbove80: number;
    studentsBelow50: number;
    topPerformer: {
        studentId: string;
        studentName: string;
        grade: number;
    };
    needsAttention: {
        studentId: string;
        studentName: string;
        grade: number;
    }[];
}

// Reports Types
export interface FinancialReport {
    period: string;
    revenue: {
        tuitionFees: number;
        materialSales: number;
        registrationFees: number;
        other: number;
    };
    expenses: {
        tutorPayouts: number;
        platformCosts: number;
        marketing: number;
        administration: number;
        other: number;
    };
    netProfit: number;
    profitMargin: number;
}

export interface AcademicReport {
    period: string;
    totalStudents: number;
    averageAttendance: number;
    platformAverage: number;
    subjectAverages: {
        subject: string;
        average: number;
        studentCount: number;
    }[];
    improvementRate: number;
    flaggedStudents: number;
}

// Activity Log Types
export interface ActivityLog {
    id: string;
    timestamp: Date;
    userId: string;
    userName: string;
    userRole: string;
    action: string;
    category: 'user' | 'payment' | 'session' | 'system';
    description: string;
    metadata?: any;
}

// Notification Types
export interface AdminNotification {
    id: string;
    type: 'payment' | 'user' | 'session' | 'system' | 'alert';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    actionUrl?: string;
    actionLabel?: string;
}
