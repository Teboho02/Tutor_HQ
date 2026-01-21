// Badge and Achievement types

/**
 * Badge that can be awarded to students by tutors
 */
export interface Badge {
    id: string;
    name: string;
    description: string;
    icon?: string; // emoji or icon code
    imageUrl?: string; // URL to badge image (for custom uploaded badges)
    pointsValue: number; // points awarded when badge is earned
    category: 'achievement' | 'milestone' | 'skill' | 'improvement' | 'custom';
    createdBy: string; // tutorId
    createdAt: Date;
    isCustom: boolean; // true if created by individual tutor, false if system default
}

/**
 * Instance of a badge earned by a student
 */
export interface StudentBadge {
    id: string;
    studentId: string;
    badgeId: string;
    badge: Badge;
    earnedAt: Date;
    unlockedBy: string; // tutorId who unlocked it
    reason?: string; // why the badge was awarded
}

/**
 * Achievement - broader accomplishment tracking
 */
export interface Achievement {
    id: string;
    studentId: string;
    title: string;
    description: string;
    category: 'academic' | 'participation' | 'improvement' | 'milestone';
    points: number;
    unlockedAt?: Date;
    isUnlocked: boolean;
    icon: string; // emoji
    metadata?: Record<string, any>; // flexible data storage
}

/**
 * Student's achievement summary
 */
export interface StudentAchievementSummary {
    studentId: string;
    totalPoints: number;
    totalBadges: number;
    totalAchievements: number;
    unlockedAchievements: number;
    badges: StudentBadge[];
    achievements: Achievement[];
    recentlyEarned: (StudentBadge | Achievement)[]; // last 5
}

/**
 * Badge creation form data
 */
export interface BadgeFormData {
    name: string;
    description: string;
    icon?: string;
    imageFile?: File;
    pointsValue: number;
    category: 'achievement' | 'milestone' | 'skill' | 'improvement' | 'custom';
}
