// ================================================
// NOTIFICATION SERVICE
// ================================================
// Frontend service for notifications
// Phase 6: Notifications System

import apiClient from '../config/api';

// ================================================
// TYPES
// ================================================

export type NotificationType =
    | 'assignment_created'
    | 'assignment_due_soon'
    | 'assignment_overdue'
    | 'assignment_graded'
    | 'test_available'
    | 'test_graded'
    | 'class_scheduled'
    | 'class_starting_soon'
    | 'class_cancelled'
    | 'goal_deadline'
    | 'goal_completed'
    | 'material_uploaded'
    | 'message_received'
    | 'announcement'
    | 'system';

export interface Notification {
    id: string;
    user_id: string;
    type: NotificationType;
    title: string;
    message: string;
    entity_type?: string;
    entity_id?: string;
    action_url?: string;
    action_label?: string;
    metadata?: Record<string, unknown>;
    is_read: boolean;
    read_at?: string;
    created_at: string;
    expires_at?: string;
}

export interface NotificationPreferences {
    id: string;
    user_id: string;
    // In-app preferences
    in_app_assignments: boolean;
    in_app_tests: boolean;
    in_app_classes: boolean;
    in_app_goals: boolean;
    in_app_materials: boolean;
    in_app_messages: boolean;
    in_app_announcements: boolean;
    // Email preferences
    email_assignments: boolean;
    email_tests: boolean;
    email_classes: boolean;
    email_goals: boolean;
    email_materials: boolean;
    email_messages: boolean;
    email_announcements: boolean;
    // Timing preferences
    email_digest: boolean;
    digest_time: string;
    quiet_hours_start: string;
    quiet_hours_end: string;
    created_at: string;
    updated_at: string;
}

export interface NotificationsResponse {
    notifications: Notification[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    unreadCount: number;
}

// ================================================
// API SERVICE
// ================================================

export const notificationService = {
    // Get notifications with pagination and filters
    async getNotifications(
        page: number = 1,
        limit: number = 20,
        unreadOnly: boolean = false,
        type?: NotificationType
    ) {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            unread_only: String(unreadOnly)
        });

        if (type) {
            params.append('type', type);
        }

        const response = await apiClient.get(`/notifications?${params}`);
        return response.data as { success: boolean; data: NotificationsResponse };
    },

    // Get unread count only
    async getUnreadCount() {
        const response = await apiClient.get('/notifications/unread-count');
        return response.data as { success: boolean; data: { unreadCount: number } };
    },

    // Mark single notification as read
    async markAsRead(notificationId: string) {
        const response = await apiClient.put(`/notifications/${notificationId}/read`);
        return response.data as { success: boolean; data: { notification: Notification } };
    },

    // Mark all notifications as read
    async markAllAsRead() {
        const response = await apiClient.put('/notifications/read-all');
        return response.data as { success: boolean; data: { count: number } };
    },

    // Delete single notification
    async deleteNotification(notificationId: string) {
        const response = await apiClient.delete(`/notifications/${notificationId}`);
        return response.data as { success: boolean };
    },

    // Clear all notifications
    async clearAll(readOnly: boolean = false) {
        const params = readOnly ? '?read_only=true' : '';
        const response = await apiClient.delete(`/notifications/clear${params}`);
        return response.data as { success: boolean };
    },

    // Get notification preferences
    async getPreferences() {
        const response = await apiClient.get('/notifications/preferences');
        return response.data as { success: boolean; data: { preferences: NotificationPreferences } };
    },

    // Update notification preferences
    async updatePreferences(preferences: Partial<NotificationPreferences>) {
        const response = await apiClient.put('/notifications/preferences', preferences);
        return response.data as { success: boolean; data: { preferences: NotificationPreferences } };
    }
};

// ================================================
// HELPER FUNCTIONS
// ================================================

// Get icon for notification type
export const getNotificationIcon = (type: NotificationType): string => {
    const icons: Record<NotificationType, string> = {
        assignment_created: '📝',
        assignment_due_soon: '⏰',
        assignment_overdue: '🚨',
        assignment_graded: '✅',
        test_available: '📋',
        test_graded: '📊',
        class_scheduled: '📅',
        class_starting_soon: '🔔',
        class_cancelled: '❌',
        goal_deadline: '🎯',
        goal_completed: '🏆',
        material_uploaded: '📚',
        message_received: '💬',
        announcement: '📢',
        system: '⚙️'
    };
    return icons[type] || '🔔';
};

// Get color for notification type
export const getNotificationColor = (type: NotificationType): string => {
    const colors: Record<NotificationType, string> = {
        assignment_created: '#2196F3',
        assignment_due_soon: '#FF9800',
        assignment_overdue: '#F44336',
        assignment_graded: '#4CAF50',
        test_available: '#9C27B0',
        test_graded: '#4CAF50',
        class_scheduled: '#2196F3',
        class_starting_soon: '#FF9800',
        class_cancelled: '#F44336',
        goal_deadline: '#FF9800',
        goal_completed: '#4CAF50',
        material_uploaded: '#2196F3',
        message_received: '#9C27B0',
        announcement: '#5e3bee',
        system: '#607D8B'
    };
    return colors[type] || '#5e3bee';
};

// Format notification time
export const formatNotificationTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-ZA', {
        month: 'short',
        day: 'numeric'
    });
};

// Group notifications by date
export const groupNotificationsByDate = (notifications: Notification[]): Record<string, Notification[]> => {
    const groups: Record<string, Notification[]> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    notifications.forEach(notification => {
        const date = new Date(notification.created_at);
        date.setHours(0, 0, 0, 0);

        let key: string;
        if (date.getTime() === today.getTime()) {
            key = 'Today';
        } else if (date.getTime() === yesterday.getTime()) {
            key = 'Yesterday';
        } else {
            key = date.toLocaleDateString('en-ZA', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            });
        }

        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(notification);
    });

    return groups;
};

// Get friendly type label
export const getNotificationTypeLabel = (type: NotificationType): string => {
    const labels: Record<NotificationType, string> = {
        assignment_created: 'New Assignment',
        assignment_due_soon: 'Due Soon',
        assignment_overdue: 'Overdue',
        assignment_graded: 'Graded',
        test_available: 'New Test',
        test_graded: 'Test Graded',
        class_scheduled: 'Class Scheduled',
        class_starting_soon: 'Starting Soon',
        class_cancelled: 'Class Cancelled',
        goal_deadline: 'Goal Deadline',
        goal_completed: 'Goal Completed',
        material_uploaded: 'New Material',
        message_received: 'New Message',
        announcement: 'Announcement',
        system: 'System'
    };
    return labels[type] || 'Notification';
};

export default notificationService;
