import apiClient from '../config/api';

// ================================================
// TYPES
// ================================================

export interface StudentAnalyticsOverview {
    overallAverage: number;
    assignmentsCompleted: number;
    avgAssignmentScore: number;
    testsCompleted: number;
    avgTestScore: number;
    totalClasses: number;
    goalsCreated: number;
    goalsCompleted: number;
    goalCompletionRate: number;
    materialsViewed: number;
}

export interface TrendDataPoint {
    week: string;
    startDate: string;
    avgScore: number;
    submissions: number;
}

export interface TutorTrendDataPoint {
    week: string;
    startDate: string;
    assignmentsCreated: number;
    materialsUploaded: number;
}

export interface SubjectBreakdown {
    subject: string;
    assignments: number;
    tests: number;
    avgScore: number;
}

export interface StudentAnalyticsData {
    overview: StudentAnalyticsOverview;
    trend: TrendDataPoint[];
    subjectBreakdown: SubjectBreakdown[];
    period: string;
}

export interface TutorAnalyticsOverview {
    totalStudents: number;
    totalClasses: number;
    activeClasses: number;
    assignmentsCreated: number;
    assignmentsGraded: number;
    testsCreated: number;
    totalTestSubmissions: number;
    avgStudentScore: number;
    materialsUploaded: number;
}

export interface TutorAnalyticsData {
    overview: TutorAnalyticsOverview;
    trend: TutorTrendDataPoint[];
    subjectDistribution: Record<string, number>;
    period: string;
}

export interface ChildAnalytics {
    studentId: string;
    studentName: string;
    assignmentsCompleted: number;
    testsCompleted: number;
    avgScore: number;
    goalsCompleted: number;
    totalGoals: number;
}

export interface ParentAnalyticsData {
    children: ChildAnalytics[];
    period: string;
}

export interface LeaderboardEntry {
    rank: number;
    studentId: string;
    name: string;
    avgScore: number;
    submissionsCount: number;
}

export interface ActivityLog {
    id: string;
    userId: string;
    activityType: string;
    activityCategory: string;
    entityType?: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
}

// ================================================
// API SERVICE
// ================================================

export const analyticsService = {
    /**
     * Get student analytics
     */
    async getStudentAnalytics(
        studentId: string,
        period: string = '30d'
    ): Promise<{ success: boolean; data?: StudentAnalyticsData; message?: string }> {
        const response = await apiClient.get(`/analytics/student/${studentId}?period=${period}`);
        return response.data;
    },

    /**
     * Get tutor analytics
     */
    async getTutorAnalytics(
        tutorId: string,
        period: string = '30d'
    ): Promise<{ success: boolean; data?: TutorAnalyticsData; message?: string }> {
        const response = await apiClient.get(`/analytics/tutor/${tutorId}?period=${period}`);
        return response.data;
    },

    /**
     * Get parent analytics (overview of all children)
     */
    async getParentAnalytics(
        period: string = '30d'
    ): Promise<{ success: boolean; data?: ParentAnalyticsData; message?: string }> {
        const response = await apiClient.get(`/analytics/parent?period=${period}`);
        return response.data;
    },

    /**
     * Log user activity
     */
    async logActivity(data: {
        activityType: string;
        activityCategory: string;
        entityType?: string;
        entityId?: string;
        metadata?: Record<string, unknown>;
    }): Promise<{ success: boolean; data?: { activity: ActivityLog }; message?: string }> {
        const response = await apiClient.post('/analytics/activity', data);
        return response.data;
    },

    /**
     * Get activity feed
     */
    async getActivityFeed(
        limit: number = 20,
        category?: string
    ): Promise<{ success: boolean; data?: { activities: ActivityLog[] }; message?: string }> {
        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        if (category) params.append('category', category);

        const response = await apiClient.get(`/analytics/activity?${params.toString()}`);
        return response.data;
    },

    /**
     * Get leaderboard
     */
    async getLeaderboard(
        type: 'students' = 'students',
        classId?: string,
        limit: number = 10
    ): Promise<{ success: boolean; data?: { leaderboard: LeaderboardEntry[] }; message?: string }> {
        const params = new URLSearchParams();
        params.append('type', type);
        params.append('limit', limit.toString());
        if (classId) params.append('classId', classId);

        const response = await apiClient.get(`/analytics/leaderboard?${params.toString()}`);
        return response.data;
    }
};

// ================================================
// HELPER FUNCTIONS
// ================================================

/**
 * Format period for display
 */
export function formatPeriod(period: string): string {
    const days = parseInt(period.replace('d', ''));
    if (days === 7) return 'Last 7 days';
    if (days === 30) return 'Last 30 days';
    if (days === 90) return 'Last 3 months';
    if (days === 365) return 'Last year';
    return `Last ${days} days`;
}

/**
 * Get score color based on percentage
 */
export function getScoreColor(score: number): string {
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 60) return '#FF9800'; // Orange
    if (score >= 40) return '#FFC107'; // Yellow
    return '#f44336'; // Red
}

/**
 * Get score label based on percentage
 */
export function getScoreLabel(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Improvement';
}

/**
 * Calculate percentage change between two values
 */
export function calculateChange(current: number, previous: number): {
    change: number;
    direction: 'up' | 'down' | 'stable';
    percentage: number;
} {
    if (previous === 0) {
        return {
            change: current,
            direction: current > 0 ? 'up' : 'stable',
            percentage: current > 0 ? 100 : 0
        };
    }

    const change = current - previous;
    const percentage = Math.abs((change / previous) * 100);

    return {
        change,
        direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
        percentage: Math.round(percentage * 10) / 10
    };
}

/**
 * Format large numbers (e.g., 1000 -> 1k)
 */
export function formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
}

export default analyticsService;
