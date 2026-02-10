import React from 'react';
import '../styles/GoalCard.css';

// Use string literals for compatibility with both service and types
type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'overdue';
type GoalCategory = 'academic' | 'homework' | 'test_prep' | 'skill_development' | 'personal';

interface Milestone {
    id: string;
    title: string;
    isCompleted: boolean;
    completedAt?: string;
    orderIndex: number;
}

interface Goal {
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

interface GoalCardProps {
    goal: Goal;
    onStatusChange: (goalId: string, newStatus: GoalStatus) => void;
    onEdit: (goal: Goal) => void;
    onDelete: (goalId: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onStatusChange, onEdit, onDelete }) => {
    const getStatusColor = (status: GoalStatus): string => {
        switch (status) {
            case 'completed':
                return '#4CAF50';
            case 'in_progress':
                return '#2196F3';
            case 'overdue':
                return '#f44336';
            default:
                return '#9e9e9e';
        }
    };

    const getCategoryLabel = (category: GoalCategory): string => {
        return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getStatusLabel = (status: GoalStatus): string => {
        return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const isOverdue = (): boolean => {
        return new Date(goal.targetDate) < new Date() && goal.status !== 'completed';
    };

    const daysUntilDue = (): number => {
        const today = new Date();
        const target = new Date(goal.targetDate);
        const diffTime = target.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const formatDate = (date: string | Date): string => {
        return new Date(date).toLocaleDateString('en-ZA', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="goal-card" style={{ borderLeftColor: getStatusColor(goal.status) }}>
            <div className="goal-card-header">
                <div className="goal-title-section">
                    <h3 className="goal-title">{goal.title}</h3>
                    <span className="goal-category">{getCategoryLabel(goal.category)}</span>
                </div>
                <div className="goal-actions">
                    <button onClick={() => onEdit(goal)} className="goal-action-btn edit-btn">
                        ✏️
                    </button>
                    <button onClick={() => onDelete(goal.id)} className="goal-action-btn delete-btn">
                        🗑️
                    </button>
                </div>
            </div>

            <p className="goal-description">{goal.description}</p>

            <div className="goal-metadata">
                <div className="goal-date">
                    <span className="date-label">Target Date:</span>
                    <span className={`date-value ${isOverdue() ? 'overdue' : ''}`}>
                        {formatDate(goal.targetDate)}
                        {!isOverdue() && goal.status !== 'completed' && (
                            <span className="days-remaining">
                                {daysUntilDue() === 0 ? ' (Today)' : ` (${daysUntilDue()}d)`}
                            </span>
                        )}
                        {isOverdue() && <span className="overdue-label"> (Overdue)</span>}
                    </span>
                </div>

                {goal.completedAt && (
                    <div className="goal-completed">
                        <span className="completed-label">Completed:</span>
                        <span className="completed-value">{formatDate(goal.completedAt)}</span>
                    </div>
                )}
            </div>

            <div className="goal-status-selector">
                <label>Status:</label>
                <select
                    value={goal.status}
                    onChange={(e) => onStatusChange(goal.id, e.target.value as GoalStatus)}
                    className="status-select"
                    style={{ color: getStatusColor(goal.status) }}
                >
                    <option value="not_started">{getStatusLabel('not_started')}</option>
                    <option value="in_progress">{getStatusLabel('in_progress')}</option>
                    <option value="completed">{getStatusLabel('completed')}</option>
                </select>
            </div>

            {goal.status === 'completed' && (
                <div className="completion-badge">
                    ✅ Goal Achieved!
                </div>
            )}
        </div>
    );
};
