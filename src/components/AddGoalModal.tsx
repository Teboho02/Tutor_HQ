import React, { useState } from 'react';
import '../styles/AddGoalModal.css';

// Use string literals for compatibility with API
type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'overdue';
type GoalCategory = 'academic' | 'homework' | 'test_prep' | 'skill_development' | 'personal';

interface Goal {
    id: string;
    studentId: string;
    title: string;
    description: string;
    category: GoalCategory;
    status: GoalStatus;
    targetDate: string | Date;
    completedAt?: string | Date;
    weekNumber: number;
    year: number;
}

interface AddGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (goalData: Omit<Goal, 'id' | 'createdAt' | 'weekNumber' | 'year'>) => void;
    editGoal?: Goal | null;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({ isOpen, onClose, onSave, editGoal }) => {
    const [title, setTitle] = useState(editGoal?.title || '');
    const [description, setDescription] = useState(editGoal?.description || '');
    const [category, setCategory] = useState<GoalCategory>(editGoal?.category || 'academic');
    const [targetDate, setTargetDate] = useState(
        editGoal?.targetDate ? new Date(editGoal.targetDate).toISOString().split('T')[0] : ''
    );
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    React.useEffect(() => {
        if (editGoal) {
            setTitle(editGoal.title);
            setDescription(editGoal.description);
            setCategory(editGoal.category);
            setTargetDate(new Date(editGoal.targetDate).toISOString().split('T')[0]);
        } else {
            setTitle('');
            setDescription('');
            setCategory('academic');
            setTargetDate('');
        }
        setErrors({});
    }, [editGoal, isOpen]);

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!title.trim()) {
            newErrors.title = 'Title is required';
        } else if (title.length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required';
        } else if (description.length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
        }

        if (!targetDate) {
            newErrors.targetDate = 'Target date is required';
        } else {
            const selectedDate = new Date(targetDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                newErrors.targetDate = 'Target date cannot be in the past';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        const goalData: Omit<Goal, 'id' | 'createdAt' | 'weekNumber' | 'year'> = {
            studentId: 'current-student', // This would come from auth context
            title: title.trim(),
            description: description.trim(),
            category,
            status: editGoal?.status || 'not_started',
            targetDate: new Date(targetDate),
            completedAt: editGoal?.completedAt,
        };

        onSave(goalData);
        handleClose();
    };

    const handleClose = () => {
        setTitle('');
        setDescription('');
        setCategory('academic');
        setTargetDate('');
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{editGoal ? 'Edit Goal' : 'Create New Goal'}</h2>
                    <button className="close-btn" onClick={handleClose}>
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="goal-form">
                    <div className="form-group">
                        <label htmlFor="title">
                            Goal Title <span className="required">*</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Master Algebra Equations"
                            className={errors.title ? 'error' : ''}
                        />
                        {errors.title && <span className="error-message">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">
                            Category <span className="required">*</span>
                        </label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as GoalCategory)}
                        >
                            <option value="academic">Academic</option>
                            <option value="homework">Homework</option>
                            <option value="test_prep">Test Preparation</option>
                            <option value="skill_development">Skill Development</option>
                            <option value="personal">Personal</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            Description <span className="required">*</span>
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your goal in detail..."
                            rows={4}
                            className={errors.description ? 'error' : ''}
                        />
                        {errors.description && <span className="error-message">{errors.description}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="targetDate">
                            Target Date <span className="required">*</span>
                        </label>
                        <input
                            id="targetDate"
                            type="date"
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className={errors.targetDate ? 'error' : ''}
                        />
                        {errors.targetDate && <span className="error-message">{errors.targetDate}</span>}
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={handleClose} className="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" className="save-btn">
                            {editGoal ? 'Update Goal' : 'Create Goal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
