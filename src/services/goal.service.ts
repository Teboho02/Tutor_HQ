import apiClient from '../config/api';

// ================================================
// TYPES
// ================================================

export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'overdue';
export type GoalCategory = 'academic' | 'homework' | 'test_prep' | 'skill_development' | 'personal';

// Const object for runtime use (matching the type)
export const GoalStatusValues = {
    NOT_STARTED: 'not_started' as const,
    IN_PROGRESS: 'in_progress' as const,
    COMPLETED: 'completed' as const,
    OVERDUE: 'overdue' as const,
};

export interface Milestone {
    id: string;
    title: string;
    isCompleted: boolean;
    completedAt?: string;
    orderIndex: number;
}

export interface Goal {
    id: string;
    studentId: string;
    title: string;
    description: string;
    category: GoalCategory;
    status: GoalStatus;
    targetDate: string;
    completedAt?: string;
    weekNumber: number;
    year: number;
    createdAt: string;
    updatedAt: string;
    milestones: Milestone[];
}

export interface WeeklyGoalStats {
    weekNumber: number;
    year: number;
    totalGoals: number;
    completedGoals: number;
    inProgressGoals: number;
    overdueGoals: number;
    notStartedGoals: number;
    completionRate: number;
}

export interface CreateGoalData {
    title: string;
    description?: string;
    category?: GoalCategory;
    targetDate: string;
}

export interface UpdateGoalData {
    title?: string;
    description?: string;
    category?: GoalCategory;
    status?: GoalStatus;
    targetDate?: string;
}

// ================================================
// API SERVICE
// ================================================

export const goalService = {
    /**
     * Create a new goal
     */
    async createGoal(data: CreateGoalData): Promise<{ success: boolean; data?: { goal: Goal }; message?: string }> {
        const response = await apiClient.post('/goals', data);
        return response.data;
    },

    /**
     * Get a single goal by ID
     */
    async getGoal(goalId: string): Promise<{ success: boolean; data?: { goal: Goal }; message?: string }> {
        const response = await apiClient.get(`/goals/${goalId}`);
        return response.data;
    },

    /**
     * Get all goals for a student
     */
    async getStudentGoals(
        studentId: string,
        filters?: {
            week?: number;
            year?: number;
            status?: GoalStatus;
            category?: GoalCategory;
        }
    ): Promise<{ success: boolean; data?: { goals: Goal[] }; message?: string }> {
        const params = new URLSearchParams();
        if (filters?.week) params.append('week', filters.week.toString());
        if (filters?.year) params.append('year', filters.year.toString());
        if (filters?.status) params.append('status', filters.status);
        if (filters?.category) params.append('category', filters.category);

        const queryString = params.toString();
        const url = `/goals/student/${studentId}${queryString ? `?${queryString}` : ''}`;

        const response = await apiClient.get(url);
        return response.data;
    },

    /**
     * Get weekly statistics for a student
     */
    async getWeeklyStats(
        studentId: string,
        week?: number,
        year?: number
    ): Promise<{ success: boolean; data?: { stats: WeeklyGoalStats }; message?: string }> {
        const params = new URLSearchParams();
        if (week) params.append('week', week.toString());
        if (year) params.append('year', year.toString());

        const queryString = params.toString();
        const url = `/goals/student/${studentId}/stats${queryString ? `?${queryString}` : ''}`;

        const response = await apiClient.get(url);
        return response.data;
    },

    /**
     * Update a goal
     */
    async updateGoal(goalId: string, data: UpdateGoalData): Promise<{ success: boolean; data?: { goal: Goal }; message?: string }> {
        const response = await apiClient.patch(`/goals/${goalId}`, data);
        return response.data;
    },

    /**
     * Delete a goal
     */
    async deleteGoal(goalId: string): Promise<{ success: boolean; message?: string }> {
        const response = await apiClient.delete(`/goals/${goalId}`);
        return response.data;
    },

    /**
     * Update goal status
     */
    async updateGoalStatus(goalId: string, status: GoalStatus): Promise<{ success: boolean; data?: { goal: Goal }; message?: string }> {
        return this.updateGoal(goalId, { status });
    },

    // ================================================
    // MILESTONE METHODS
    // ================================================

    /**
     * Add a milestone to a goal
     */
    async addMilestone(goalId: string, title: string): Promise<{ success: boolean; data?: { milestone: Milestone }; message?: string }> {
        const response = await apiClient.post(`/goals/${goalId}/milestones`, { title });
        return response.data;
    },

    /**
     * Update a milestone
     */
    async updateMilestone(
        milestoneId: string,
        data: { title?: string; isCompleted?: boolean }
    ): Promise<{ success: boolean; data?: { milestone: Milestone }; message?: string }> {
        const response = await apiClient.patch(`/goals/milestones/${milestoneId}`, data);
        return response.data;
    },

    /**
     * Delete a milestone
     */
    async deleteMilestone(milestoneId: string): Promise<{ success: boolean; message?: string }> {
        const response = await apiClient.delete(`/goals/milestones/${milestoneId}`);
        return response.data;
    },

    /**
     * Toggle milestone completion
     */
    async toggleMilestone(milestoneId: string, isCompleted: boolean): Promise<{ success: boolean; data?: { milestone: Milestone }; message?: string }> {
        return this.updateMilestone(milestoneId, { isCompleted });
    }
};

// ================================================
// HELPER FUNCTIONS
// ================================================

/**
 * Get week number from a date
 */
export function getWeekNumber(date: Date): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Format a category for display
 */
export function formatCategory(category: GoalCategory): string {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Format a status for display
 */
export function formatStatus(status: GoalStatus): string {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Get status color
 */
export function getStatusColor(status: GoalStatus): string {
    switch (status) {
        case 'completed':
            return '#4CAF50';
        case 'in_progress':
            return '#2196F3';
        case 'overdue':
            return '#f44336';
        case 'not_started':
        default:
            return '#9e9e9e';
    }
}

/**
 * Get category icon
 */
export function getCategoryIcon(category: GoalCategory): string {
    switch (category) {
        case 'academic':
            return '📚';
        case 'homework':
            return '📝';
        case 'test_prep':
            return '📋';
        case 'skill_development':
            return '🎯';
        case 'personal':
            return '🌟';
        default:
            return '📌';
    }
}

/**
 * Check if a goal is overdue
 */
export function isGoalOverdue(goal: Goal): boolean {
    return new Date(goal.targetDate) < new Date() && goal.status !== 'completed';
}

/**
 * Calculate days until due
 */
export function daysUntilDue(targetDate: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default goalService;
