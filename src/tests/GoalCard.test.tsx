import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GoalCard from '../components/GoalCard';

describe('GoalCard Component', () => {
    const mockGoal = {
        id: '1',
        title: 'Complete Math Assignment',
        description: 'Finish chapters 5-7',
        targetDate: new Date('2026-02-15'),
        progress: 60,
        category: 'academic' as const,
        status: 'in-progress' as const,
    };

    it('renders goal title', () => {
        render(<GoalCard goal={mockGoal} />);

        const title = screen.getByText('Complete Math Assignment');
        expect(title).toBeInTheDocument();
    });

    it('renders goal description', () => {
        render(<GoalCard goal={mockGoal} />);

        const description = screen.getByText('Finish chapters 5-7');
        expect(description).toBeInTheDocument();
    });

    it('displays progress percentage', () => {
        render(<GoalCard goal={mockGoal} />);

        const progress = screen.getByText('60%');
        expect(progress).toBeInTheDocument();
    });

    it('shows correct status', () => {
        render(<GoalCard goal={mockGoal} />);

        // Check if progress bar shows correct percentage
        const progressBar = screen.getByRole('progressbar', { hidden: true });
        expect(progressBar).toHaveStyle({ width: '60%' });
    });

    it('matches snapshot', () => {
        const { container } = render(<GoalCard goal={mockGoal} />);
        expect(container).toMatchSnapshot();
    });
});
