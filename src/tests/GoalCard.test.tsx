import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GoalCard } from '../components/GoalCard';

describe('GoalCard Component', () => {
    const mockGoal = {
        id: '1',
        studentId: 'student-1',
        title: 'Complete Math Assignment',
        description: 'Finish chapters 5-7',
        targetDate: '2026-02-15',
        category: 'academic' as const,
        status: 'in_progress' as const,
        weekNumber: 7,
        year: 2026,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        milestones: [],
    };

    const mockHandlers = {
        onStatusChange: vi.fn(),
        onEdit: vi.fn(),
        onDelete: vi.fn(),
    };

    it('renders goal title', () => {
        render(<GoalCard goal={mockGoal} {...mockHandlers} />);

        const title = screen.getByText('Complete Math Assignment');
        expect(title).toBeInTheDocument();
    });

    it('renders goal description', () => {
        render(<GoalCard goal={mockGoal} {...mockHandlers} />);

        const description = screen.getByText('Finish chapters 5-7');
        expect(description).toBeInTheDocument();
    });

    it('displays category', () => {
        render(<GoalCard goal={mockGoal} {...mockHandlers} />);

        const category = screen.getByText('Academic');
        expect(category).toBeInTheDocument();
    });

    it('shows status selector with current status', () => {
        render(<GoalCard goal={mockGoal} {...mockHandlers} />);

        // Check if status dropdown exists
        const statusSelect = screen.getByRole('combobox');
        expect(statusSelect).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { container } = render(<GoalCard goal={mockGoal} {...mockHandlers} />);
        expect(container).toMatchSnapshot();
    });
});
