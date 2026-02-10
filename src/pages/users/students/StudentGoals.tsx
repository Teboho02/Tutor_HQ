import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useToast } from '../../../components/Toast';
import { useAuth } from '../../../contexts/AuthContext';
import { goalService, type Goal, type GoalStatus, type GoalCategory, type WeeklyGoalStats, getWeekNumber, GoalStatusValues } from '../../../services/goal.service';
import type { NavigationLink } from '../../../types';
import { GoalCard } from '../../../components/GoalCard';
import { AddGoalModal } from '../../../components/AddGoalModal';
import '../../../styles/StudentGoals.css';

const StudentGoals: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [weeklyStats, setWeeklyStats] = useState<WeeklyGoalStats | null>(null);
    const [filter, setFilter] = useState<'all' | GoalStatus>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/student/dashboard' },
        { label: 'Calendar', href: '/student/calendar' },
        { label: 'Materials', href: '/student/materials' },
        { label: 'Progress', href: '/student/progress' },
        { label: 'Tests', href: '/student/tests' },
        { label: 'Goals', href: '/student/goals' },
    ];

    const fetchGoals = useCallback(async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            const response = await goalService.getStudentGoals(user.id);
            if (response.success && response.data) {
                setGoals(response.data.goals);
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            showToast(err.response?.data?.message || 'Failed to load goals', 'error');
        } finally {
            setLoading(false);
        }
    }, [user?.id, showToast]);

    const fetchWeeklyStats = useCallback(async () => {
        if (!user?.id) return;

        try {
            const response = await goalService.getWeeklyStats(user.id);
            if (response.success && response.data) {
                setWeeklyStats(response.data.stats);
            }
        } catch (error: unknown) {
            console.error('Failed to fetch weekly stats:', error);
        }
    }, [user?.id]);

    // Fetch goals and stats on mount
    useEffect(() => {
        if (user?.id) {
            fetchGoals();
            fetchWeeklyStats();
        }
    }, [user?.id, fetchGoals, fetchWeeklyStats]);

    const filteredGoals = useMemo(() => {
        if (filter === 'all') return goals;
        return goals.filter(goal => goal.status === filter);
    }, [goals, filter]);

    // Calculate local stats if API stats not available yet
    const displayStats = useMemo(() => {
        if (weeklyStats) return weeklyStats;

        const currentWeek = getWeekNumber(new Date());
        const currentYear = new Date().getFullYear();
        const weekGoals = goals.filter(g => g.weekNumber === currentWeek && g.year === currentYear);
        const completed = weekGoals.filter(g => g.status === 'completed').length;

        return {
            weekNumber: currentWeek,
            year: currentYear,
            totalGoals: weekGoals.length,
            completedGoals: completed,
            inProgressGoals: weekGoals.filter(g => g.status === 'in_progress').length,
            overdueGoals: weekGoals.filter(g => g.status === 'overdue' || (new Date(g.targetDate) < new Date() && g.status !== 'completed')).length,
            notStartedGoals: weekGoals.filter(g => g.status === 'not_started').length,
            completionRate: weekGoals.length > 0 ? Math.round((completed / weekGoals.length) * 100) : 0
        };
    }, [goals, weeklyStats]);

    const handleStatusChange = async (goalId: string, newStatus: GoalStatus) => {
        try {
            const response = await goalService.updateGoalStatus(goalId, newStatus);
            if (response.success && response.data) {
                setGoals(prevGoals =>
                    prevGoals.map(goal =>
                        goal.id === goalId ? response.data!.goal : goal
                    )
                );
                showToast('Goal status updated', 'success');
                fetchWeeklyStats(); // Refresh stats
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            showToast(err.response?.data?.message || 'Failed to update goal status', 'error');
        }
    };

    const handleEdit = (goal: Goal) => {
        // Transform to match the AddGoalModal expected format
        setEditingGoal(goal);
        setIsModalOpen(true);
    };

    const handleDelete = async (goalId: string) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            try {
                const response = await goalService.deleteGoal(goalId);
                if (response.success) {
                    setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
                    showToast('Goal deleted successfully', 'success');
                    fetchWeeklyStats(); // Refresh stats
                }
            } catch (error: unknown) {
                const err = error as { response?: { data?: { message?: string } } };
                showToast(err.response?.data?.message || 'Failed to delete goal', 'error');
            }
        }
    };

    const handleSaveGoal = async (goalData: { title: string; description?: string; category: string; targetDate: Date | string }) => {
        try {
            const category = goalData.category as GoalCategory;
            if (editingGoal) {
                // Update existing goal
                const response = await goalService.updateGoal(editingGoal.id, {
                    title: goalData.title,
                    description: goalData.description,
                    category: category,
                    targetDate: goalData.targetDate instanceof Date
                        ? goalData.targetDate.toISOString()
                        : goalData.targetDate
                });

                if (response.success && response.data) {
                    setGoals(prevGoals =>
                        prevGoals.map(goal =>
                            goal.id === editingGoal.id ? response.data!.goal : goal
                        )
                    );
                    showToast('Goal updated successfully', 'success');
                }
            } else {
                // Create new goal
                const response = await goalService.createGoal({
                    title: goalData.title,
                    description: goalData.description,
                    category: category,
                    targetDate: goalData.targetDate instanceof Date
                        ? goalData.targetDate.toISOString()
                        : goalData.targetDate
                });

                if (response.success && response.data) {
                    setGoals(prevGoals => [response.data!.goal, ...prevGoals]);
                    showToast('Goal created successfully', 'success');
                }
            }

            fetchWeeklyStats(); // Refresh stats
            setEditingGoal(null);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            showToast(err.response?.data?.message || 'Failed to save goal', 'error');
        }
    };

    if (loading) {
        return (
            <div className="student-goals-page">
                <Header navigationLinks={navigationLinks} />
                <div className="goals-container">
                    <LoadingSpinner message="Loading your goals..." />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="student-goals-page">
            <Header navigationLinks={navigationLinks} />

            <div className="goals-container">
                <div className="page-header">
                    <div className="header-content">
                        <div className="header-text">
                            <h1>My Goals</h1>
                            <p>Track your weekly goals and stay motivated</p>
                        </div>
                        <button
                            onClick={() => { setEditingGoal(null); setIsModalOpen(true); }}
                            className="create-goal-btn"
                            title="Create a new goal"
                        >
                            ➕ New Goal
                        </button>
                    </div>
                </div>

                {/* Weekly Stats */}
                <div className="weekly-stats">
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-info">
                            <h3>This Week</h3>
                            <p className="stat-value">{displayStats.totalGoals} Goals</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <h3>Completed</h3>
                            <p className="stat-value">{displayStats.completedGoals} Goals</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🔄</div>
                        <div className="stat-info">
                            <h3>In Progress</h3>
                            <p className="stat-value">{displayStats.inProgressGoals} Goals</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📈</div>
                        <div className="stat-info">
                            <h3>Completion Rate</h3>
                            <p className="stat-value">{displayStats.completionRate}%</p>
                        </div>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="goals-filters">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({goals.length})
                    </button>
                    <button
                        className={`filter-btn ${filter === GoalStatusValues.NOT_STARTED ? 'active' : ''}`}
                        onClick={() => setFilter(GoalStatusValues.NOT_STARTED)}
                    >
                        Not Started ({goals.filter(g => g.status === GoalStatusValues.NOT_STARTED).length})
                    </button>
                    <button
                        className={`filter-btn ${filter === GoalStatusValues.IN_PROGRESS ? 'active' : ''}`}
                        onClick={() => setFilter(GoalStatusValues.IN_PROGRESS)}
                    >
                        In Progress ({goals.filter(g => g.status === GoalStatusValues.IN_PROGRESS).length})
                    </button>
                    <button
                        className={`filter-btn ${filter === GoalStatusValues.COMPLETED ? 'active' : ''}`}
                        onClick={() => setFilter(GoalStatusValues.COMPLETED)}
                    >
                        Completed ({goals.filter(g => g.status === GoalStatusValues.COMPLETED).length})
                    </button>
                </div>

                {/* Goals List */}
                <div className="goals-list">
                    {filteredGoals.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🎯</div>
                            <h3>No goals yet</h3>
                            <p>Create your first goal to get started!</p>
                            <button onClick={() => setIsModalOpen(true)} className="empty-action-btn">
                                Create Goal
                            </button>
                        </div>
                    ) : (
                        filteredGoals.map(goal => (
                            <GoalCard
                                key={goal.id}
                                goal={goal}
                                onStatusChange={handleStatusChange}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </div>

                {/* Add/Edit Goal Modal */}
                <AddGoalModal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setEditingGoal(null); }}
                    onSave={handleSaveGoal}
                    editGoal={editingGoal}
                />
            </div>

            <Footer />
        </div>
    );
};

export default StudentGoals;
