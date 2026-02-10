import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    notificationService,
    type Notification,
    getNotificationIcon,
    getNotificationColor,
    formatNotificationTime
} from '../services/notification.service';
import './NotificationBell.css';

interface NotificationBellProps {
    className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ className = '' }) => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchUnreadCount();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const response = await notificationService.getUnreadCount();
            if (response.success) {
                setUnreadCount(response.data.unreadCount);
            }
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await notificationService.getNotifications(1, 5);
            if (response.success) {
                setNotifications(response.data.notifications);
                setUnreadCount(response.data.unreadCount);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = () => {
        if (!isOpen) {
            fetchNotifications();
        }
        setIsOpen(!isOpen);
    };

    const handleNotificationClick = async (notification: Notification) => {
        // Mark as read
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

        // Navigate if action URL exists
        if (notification.action_url) {
            navigate(notification.action_url);
            setIsOpen(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleViewAll = () => {
        setIsOpen(false);
        navigate('/notifications');
    };

    return (
        <div className={`notification-bell-container ${className}`} ref={dropdownRef}>
            <button 
                className={`notification-bell-button ${unreadCount > 0 ? 'has-unread' : ''}`}
                onClick={handleToggle}
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            >
                <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="bell-icon"
                >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="dropdown-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                                className="mark-all-read-btn"
                                onClick={handleMarkAllAsRead}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="dropdown-content">
                        {loading ? (
                            <div className="dropdown-loading">
                                <div className="loading-spinner-small"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="dropdown-empty">
                                <span className="empty-icon">🔔</span>
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            <ul className="notification-list">
                                {notifications.map(notification => (
                                    <li 
                                        key={notification.id}
                                        className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <span 
                                            className="notification-icon"
                                            style={{ backgroundColor: `${getNotificationColor(notification.type)}20` }}
                                        >
                                            {getNotificationIcon(notification.type)}
                                        </span>
                                        <div className="notification-content">
                                            <p className="notification-title">{notification.title}</p>
                                            <p className="notification-message">{notification.message}</p>
                                            <span className="notification-time">
                                                {formatNotificationTime(notification.created_at)}
                                            </span>
                                        </div>
                                        {!notification.is_read && (
                                            <span className="unread-dot"></span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="dropdown-footer">
                        <button className="view-all-btn" onClick={handleViewAll}>
                            View all notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
