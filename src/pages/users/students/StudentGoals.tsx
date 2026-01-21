import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import type { Goal, WeeklyGoalSummary } from '../../../types/goals';
import type { NavigationLink } from '../../../types';
import { GoalStatus, GoalCategory } from '../../../types/goals';
import { GoalCard } from '../../../components/GoalCard';
import { AddGoalModal } from '../../../components/AddGoalModal';
import '../../../styles/StudentGoals.css';

// Mock data - replace with API calls
const mockGoals: Goal[] = [
    {
        id: '1',
        studentId: 'student-1',
        title: 'Complete Calculus Assignment',
        description: 'Finish all exercises from Chapter 5 on derivatives',
        category: GoalCategory.HOMEWORK,
        status: GoalStatus.IN_PROGRESS,
        targetDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        weekNumber: 20,
        year: 2025
    },
    {
        id: '2',
        studentId: 'student-1',
        title: 'Master Photosynthesis Topic',
        description: 'Review notes and watch video tutorials on photosynthesis process',
        category: GoalCategory.ACADEMIC,
        status: GoalStatus.NOT_STARTED,
        targetDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        weekNumber: 20,
        year: 2025
    },
    {
        id: '3',
        studentId: 'student-1',
        title: 'Prepare for History Test',
        description: 'Study World War II events and create summary notes',
        category: GoalCategory.TEST_PREP,
        status: GoalStatus.COMPLETED,
        targetDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        weekNumber: 19,
        year: 2025
    }
];

const StudentGoals: React.FC = () => {
    const navigate = useNavigate();
    const [goals, setGoals] = useState<Goal[]>(mockGoals);
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

    const getWeekNumber = (date: Date): number => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    };

    const filteredGoals = useMemo(() => {
        if (filter === 'all') return goals;
        return goals.filter(goal => goal.status === filter);
    }, [goals, filter]);

    const weeklyStats = useMemo((): WeeklyGoalSummary => {
        const currentWeek = getWeekNumber(new Date());
        const currentYear = new Date().getFullYear();
        const weekGoals = goals.filter(g => g.weekNumber === currentWeek && g.year === currentYear);

        const completed = weekGoals.filter(g => g.status === GoalStatus.COMPLETED).length;
        const inProgress = weekGoals.filter(g => g.status === GoalStatus.IN_PROGRESS).length;
        const overdue = weekGoals.filter(g => {
            const isOverdue = new Date(g.targetDate) < new Date() && g.status !== GoalStatus.COMPLETED;
            return isOverdue;
        }).length;

        return {
            weekNumber: currentWeek,
            year: currentYear,
            totalGoals: weekGoals.length,
            completedGoals: completed,
            inProgressGoals: inProgress,
            overdueGoals: overdue,
            completionRate: weekGoals.length > 0 ? (completed / weekGoals.length) * 100 : 0
        };
    }, [goals]);

    const handleStatusChange = (goalId: string, newStatus: GoalStatus) => {
        setGoals(prevGoals =>
            prevGoals.map(goal =>
                goal.id === goalId
                    ? {
                        ...goal,
                        status: newStatus,
                        completedAt: newStatus === GoalStatus.COMPLETED ? new Date() : undefined
                    }
                    : goal
            )
        );
    };

    const handleEdit = (goal: Goal) => {
        setEditingGoal(goal);
        setIsModalOpen(true);
    };

    const handleDelete = (goalId: string) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
        }
    };

    const handleSaveGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'weekNumber' | 'year'>) => {
        const weekNumber = getWeekNumber(new Date());
        const year = new Date().getFullYear();

        if (editingGoal) {
            // Update existing goal
            setGoals(prevGoals =>
                prevGoals.map(goal =>
                    goal.id === editingGoal.id
                        ? { ...goalData, id: goal.id, createdAt: goal.createdAt, weekNumber, year }
                        : goal
                )
            );
        } else {
            // Create new goal
            const newGoal: Goal = {
                ...goalData,
                id: Date.now().toString(),
                createdAt: new Date(),
                weekNumber,
                year
            };
            setGoals(prevGoals => [newGoal, ...prevGoals]);
        }

        setEditingGoal(null);
    };

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
                            <p className="stat-value">{weeklyStats.totalGoals} Goals</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <h3>Completed</h3>
                            <p className="stat-value">{weeklyStats.completedGoals} Goals</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🔄</div>
                        <div className="stat-info">
                            <h3>In Progress</h3>
                            <p className="stat-value">{weeklyStats.inProgressGoals} Goals</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📈</div>
                        <div className="stat-info">
                            <h3>Completion Rate</h3>
                            <p className="stat-value">{weeklyStats.completionRate.toFixed(0)}%</p>
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
                        className={`filter-btn ${filter === GoalStatus.NOT_STARTED ? 'active' : ''}`}
                        onClick={() => setFilter(GoalStatus.NOT_STARTED)}
                    >
                        Not Started ({goals.filter(g => g.status === GoalStatus.NOT_STARTED).length})
                    </button>
                    <button
                        className={`filter-btn ${filter === GoalStatus.IN_PROGRESS ? 'active' : ''}`}
                        onClick={() => setFilter(GoalStatus.IN_PROGRESS)}
                    >
                        In Progress ({goals.filter(g => g.status === GoalStatus.IN_PROGRESS).length})
                    </button>
                    <button
                        className={`filter-btn ${filter === GoalStatus.COMPLETED ? 'active' : ''}`}
                        onClick={() => setFilter(GoalStatus.COMPLETED)}
                    >
                        Completed ({goals.filter(g => g.status === GoalStatus.COMPLETED).length})
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
