import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';
import {
    notificationService,
    type Notification,
    type NotificationType,
    type NotificationPreferences,
    getNotificationIcon,
    getNotificationColor,
    formatNotificationTime,
    groupNotificationsByDate,
    getNotificationTypeLabel
} from '../services/notification.service';
import type { NavigationLink } from '../types';
import './Notifications.css';

const Notifications: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [typeFilter, setTypeFilter] = useState<NotificationType | ''>('');
    const [showPreferences, setShowPreferences] = useState(false);
    const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
    const [savingPreferences, setSavingPreferences] = useState(false);

    const role = user?.role || 'student';

    const navigationLinks: NavigationLink[] = role === 'tutor'
        ? [
            { label: 'Dashboard', href: '/tutor/dashboard' },
            { label: 'My Classes', href: '/tutor/classes' },
            { label: 'Analytics', href: '/analytics' },
        ]
        : role === 'parent'
            ? [
                { label: 'Dashboard', href: '/parent/dashboard' },
                { label: 'Children', href: '/parent/children' },
            ]
            : [
                { label: 'Dashboard', href: '/student/dashboard' },
                { label: 'Progress', href: '/student/progress' },
                { label: 'Goals', href: '/student/goals' },
            ];

    const fetchNotifications = useCallback(async (pageNum: number = 1, append: boolean = false) => {
        try {
            if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);

            const response = await notificationService.getNotifications(
                pageNum,
                20,
                filter === 'unread',
                typeFilter || undefined
            );

            if (response.success) {
                const newNotifications = response.data.notifications;
                setNotifications(prev =>
                    append ? [...prev, ...newNotifications] : newNotifications
                );
                setUnreadCount(response.data.unreadCount);
                setHasMore(pageNum < response.data.pagination.totalPages);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to load notifications';
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [filter, typeFilter, showToast]);

    useEffect(() => {
        setPage(1);
        fetchNotifications(1, false);
    }, [filter, typeFilter, fetchNotifications]);

    const loadMore = () => {
        if (!loadingMore && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchNotifications(nextPage, true);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.is_read) {
            try {
                await notificationService.markAsRead(notification.id);
                setNotifications(prev =>
                    prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            } catch (error) {
                console.error('Failed to mark as read:', error);
            }
        }

        if (notification.action_url) {
            navigate(notification.action_url);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
            showToast('All notifications marked as read', 'success');
        } catch {
            showToast('Failed to mark notifications as read', 'error');
        }
    };

    const handleDeleteNotification = async (notificationId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await notificationService.deleteNotification(notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            showToast('Notification deleted', 'info');
        } catch {
            showToast('Failed to delete notification', 'error');
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm('Are you sure you want to clear all notifications?')) return;

        try {
            await notificationService.clearAll();
            setNotifications([]);
            setUnreadCount(0);
            showToast('All notifications cleared', 'success');
        } catch {
            showToast('Failed to clear notifications', 'error');
        }
    };

    const fetchPreferences = async () => {
        try {
            const response = await notificationService.getPreferences();
            if (response.success) {
                setPreferences(response.data.preferences);
            }
        } catch {
            showToast('Failed to load preferences', 'error');
        }
    };

    const handleOpenPreferences = () => {
        fetchPreferences();
        setShowPreferences(true);
    };

    const handleSavePreferences = async () => {
        if (!preferences) return;

        try {
            setSavingPreferences(true);
            await notificationService.updatePreferences(preferences);
            showToast('Preferences saved', 'success');
            setShowPreferences(false);
        } catch {
            showToast('Failed to save preferences', 'error');
        } finally {
            setSavingPreferences(false);
        }
    };

    const groupedNotifications = groupNotificationsByDate(notifications);

    if (loading) {
        return (
            <div className="notifications-page">
                <Header navigationLinks={navigationLinks} />
                <div className="notifications-container">
                    <LoadingSpinner message="Loading notifications..." />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="notifications-page">
            <Header navigationLinks={navigationLinks} />

            <div className="notifications-container">
                {/* Page Header */}
                <div className="page-header">
                    <div className="header-content">
                        <h1>🔔 Notifications</h1>
                        <p>
                            {unreadCount > 0
                                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                                : 'All caught up!'}
                        </p>
                    </div>
                    <div className="header-actions">
                        <button
                            className="settings-btn"
                            onClick={handleOpenPreferences}
                        >
                            ⚙️ Settings
                        </button>
                    </div>
                </div>

                {/* Filters and Actions */}
                <div className="filters-bar">
                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
                            onClick={() => setFilter('unread')}
                        >
                            Unread {unreadCount > 0 && <span className="count">{unreadCount}</span>}
                        </button>
                    </div>

                    <div className="filter-controls">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as NotificationType | '')}
                            className="type-filter"
                        >
                            <option value="">All types</option>
                            <option value="assignment_created">Assignments</option>
                            <option value="test_available">Tests</option>
                            <option value="class_scheduled">Classes</option>
                            <option value="goal_deadline">Goals</option>
                            <option value="material_uploaded">Materials</option>
                            <option value="announcement">Announcements</option>
                        </select>

                        {unreadCount > 0 && (
                            <button className="action-btn" onClick={handleMarkAllAsRead}>
                                Mark all read
                            </button>
                        )}
                        {notifications.length > 0 && (
                            <button className="action-btn danger" onClick={handleClearAll}>
                                Clear all
                            </button>
                        )}
                    </div>
                </div>

                {/* Notifications List */}
                {notifications.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🔔</div>
                        <h3>No notifications</h3>
                        <p>
                            {filter === 'unread'
                                ? "You're all caught up! No unread notifications."
                                : "You haven't received any notifications yet."}
                        </p>
                    </div>
                ) : (
                    <div className="notifications-list">
                        {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
                            <div key={date} className="notification-group">
                                <h3 className="group-date">{date}</h3>
                                {dateNotifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        className={`notification-card ${notification.is_read ? 'read' : 'unread'}`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div
                                            className="notification-icon"
                                            style={{
                                                backgroundColor: `${getNotificationColor(notification.type)}15`,
                                                color: getNotificationColor(notification.type)
                                            }}
                                        >
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        <div className="notification-body">
                                            <div className="notification-header">
                                                <span className="notification-type">
                                                    {getNotificationTypeLabel(notification.type)}
                                                </span>
                                                <span className="notification-time">
                                                    {formatNotificationTime(notification.created_at)}
                                                </span>
                                            </div>
                                            <h4 className="notification-title">{notification.title}</h4>
                                            <p className="notification-message">{notification.message}</p>
                                            {notification.action_label && (
                                                <span className="notification-action">
                                                    {notification.action_label} →
                                                </span>
                                            )}
                                        </div>

                                        <div className="notification-actions">
                                            {!notification.is_read && (
                                                <span className="unread-indicator"></span>
                                            )}
                                            <button
                                                className="delete-btn"
                                                onClick={(e) => handleDeleteNotification(notification.id, e)}
                                                title="Delete notification"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}

                        {hasMore && (
                            <div className="load-more">
                                <button
                                    className="load-more-btn"
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                >
                                    {loadingMore ? 'Loading...' : 'Load more'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Preferences Modal */}
            {showPreferences && preferences && (
                <div className="modal-overlay" onClick={() => setShowPreferences(false)}>
                    <div className="preferences-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Notification Settings</h2>
                            <button
                                className="close-btn"
                                onClick={() => setShowPreferences(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="modal-content">
                            <div className="preferences-section">
                                <h3>📱 In-App Notifications</h3>
                                <div className="preference-grid">
                                    <label className="preference-item">
                                        <input
                                            type="checkbox"
                                            checked={preferences.in_app_assignments}
                                            onChange={(e) => setPreferences({
                                                ...preferences,
                                                in_app_assignments: e.target.checked
                                            })}
                                        />
                                        <span>Assignments</span>
                                    </label>
                                    <label className="preference-item">
                                        <input
                                            type="checkbox"
                                            checked={preferences.in_app_tests}
                                            onChange={(e) => setPreferences({
                                                ...preferences,
                                                in_app_tests: e.target.checked
                                            })}
                                        />
                                        <span>Tests</span>
                                    </label>
                                    <label className="preference-item">
                                        <input
                                            type="checkbox"
                                            checked={preferences.in_app_classes}
                                            onChange={(e) => setPreferences({
                                                ...preferences,
                                                in_app_classes: e.target.checked
                                            })}
                                        />
                                        <span>Classes</span>
                                    </label>
                                    <label className="preference-item">
                                        <input
                                            type="checkbox"
                                            checked={preferences.in_app_goals}
                                            onChange={(e) => setPreferences({
                                                ...preferences,
                                                in_app_goals: e.target.checked
                                            })}
                                        />
                                        <span>Goals</span>
                                    </label>
                                    <label className="preference-item">
                                        <input
                                            type="checkbox"
                                            checked={preferences.in_app_materials}
                                            onChange={(e) => setPreferences({
                                                ...preferences,
                                                in_app_materials: e.target.checked
                                            })}
                                        />
                                        <span>Materials</span>
                                    </label>
                                    <label className="preference-item">
                                        <input
                                            type="checkbox"
                                            checked={preferences.in_app_announcements}
                                            onChange={(e) => setPreferences({
                                                ...preferences,
                                                in_app_announcements: e.target.checked
                                            })}
                                        />
                                        <span>Announcements</span>
                                    </label>
                                </div>
                            </div>

                            <div className="preferences-section">
                                <h3>📧 Email Notifications</h3>
                                <div className="preference-grid">
                                    <label className="preference-item">
                                        <input
                                            type="checkbox"
                                            checked={preferences.email_assignments}
                                            onChange={(e) => setPreferences({
                                                ...preferences,
                                                email_assignments: e.target.checked
                                            })}
                                        />
                                        <span>Assignments</span>
                                    </label>
                                    <label className="preference-item">
                                        <input
                                            type="checkbox"
                                            checked={preferences.email_tests}
                                            onChange={(e) => setPreferences({
                                                ...preferences,
                                                email_tests: e.target.checked
                                            })}
                                        />
                                        <span>Tests</span>
                                    </label>
                                    <label className="preference-item">
                                        <input
                                            type="checkbox"
                                            checked={preferences.email_classes}
                                            onChange={(e) => setPreferences({
                                                ...preferences,
                                                email_classes: e.target.checked
                                            })}
                                        />
                                        <span>Classes</span>
                                    </label>
                                    <label className="preference-item">
                                        <input
                                            type="checkbox"
                                            checked={preferences.email_announcements}
                                            onChange={(e) => setPreferences({
                                                ...preferences,
                                                email_announcements: e.target.checked
                                            })}
                                        />
                                        <span>Announcements</span>
                                    </label>
                                </div>

                                <label className="preference-item digest">
                                    <input
                                        type="checkbox"
                                        checked={preferences.email_digest}
                                        onChange={(e) => setPreferences({
                                            ...preferences,
                                            email_digest: e.target.checked
                                        })}
                                    />
                                    <span>Send daily digest instead of individual emails</span>
                                </label>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="cancel-btn"
                                onClick={() => setShowPreferences(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="save-btn"
                                onClick={handleSavePreferences}
                                disabled={savingPreferences}
                            >
                                {savingPreferences ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Notifications;
