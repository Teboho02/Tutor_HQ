import React from 'react';
import './EmptyState.css';

export type EmptyStateVariant = 'no-data' | 'no-results' | 'no-items' | 'error';

interface EmptyStateProps {
    variant?: EmptyStateVariant;
    icon?: string;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    variant = 'no-data',
    icon,
    title,
    description,
    actionLabel,
    onAction,
    className = '',
}) => {
    const getDefaultIcon = () => {
        switch (variant) {
            case 'no-data':
                return '📭';
            case 'no-results':
                return '🔍';
            case 'no-items':
                return '📦';
            case 'error':
                return '⚠️';
            default:
                return '📭';
        }
    };

    const displayIcon = icon || getDefaultIcon();

    return (
        <div className={`empty-state empty-state-${variant} ${className}`}>
            <div className="empty-state-icon">{displayIcon}</div>
            <h3 className="empty-state-title">{title}</h3>
            {description && <p className="empty-state-description">{description}</p>}
            {actionLabel && onAction && (
                <button onClick={onAction} className="empty-state-action">
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
