// Common types used throughout the application

export interface NavigationLink {
    label: string;
    href: string;
    external?: boolean;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'tutor' | 'parent' | 'admin';
    avatar?: string;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    instructor: string;
    duration: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    price: number;
    rating: number;
    studentsCount: number;
    thumbnail?: string;
}

export interface Lesson {
    id: string;
    title: string;
    description: string;
    duration: string;
    courseId: string;
    videoUrl?: string;
    materials?: string[];
    completed?: boolean;
}

export interface Assignment {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    courseId: string;
    submitted?: boolean;
    grade?: number;
}

export interface Schedule {
    id: string;
    title: string;
    date: Date;
    startTime: string;
    endTime: string;
    type: 'class' | 'assignment' | 'exam' | 'meeting';
    description?: string;
    participants?: string[];
}

export interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    date: Date;
    description: string;
    method: 'card' | 'paypal' | 'bank_transfer';
}

export interface Analytics {
    totalStudents: number;
    totalCourses: number;
    totalRevenue: number;
    averageRating: number;
    monthlyGrowth: number;
    popularCourses: Course[];
    recentActivities: Activity[];
}

export interface Activity {
    id: string;
    type: 'enrollment' | 'completion' | 'payment' | 'review';
    description: string;
    date: Date;
    userId: string;
    userName: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    date: Date;
}

// Component Props Types
export interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface CardProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
    header?: React.ReactNode;
    footer?: React.ReactNode;
}

// Page-specific types
export interface DashboardStats {
    totalEnrollments: number;
    completedCourses: number;
    upcomingClasses: number;
    averageGrade: number;
}

export interface TutorProfile {
    id: string;
    name: string;
    title: string;
    bio: string;
    rating: number;
    reviewsCount: number;
    subjects: string[];
    experience: string;
    education: string[];
    avatar: string;
    hourlyRate: number;
}