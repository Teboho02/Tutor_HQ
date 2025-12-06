export enum GoalStatus {
    NOT_STARTED = 'not_started',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    OVERDUE = 'overdue'
}

export enum GoalCategory {
    ACADEMIC = 'academic',
    HOMEWORK = 'homework',
    TEST_PREP = 'test_prep',
    SKILL_DEVELOPMENT = 'skill_development',
    PERSONAL = 'personal'
}

export interface Goal {
    id: string;
    studentId: string;
    title: string;
    description: string;
    category: GoalCategory;
    status: GoalStatus;
    targetDate: Date;
    createdAt: Date;
    completedAt?: Date;
    weekNumber: number; // Week of the year
    year: number;
}

export interface WeeklyGoalSummary {
    weekNumber: number;
    year: number;
    totalGoals: number;
    completedGoals: number;
    inProgressGoals: number;
    overdueGoals: number;
    completionRate: number;
}
