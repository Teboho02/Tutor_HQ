import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header';

describe('Header Component', () => {
    it('renders the logo image', () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        const logo = screen.getByAltText('Tutor HQ');
        expect(logo).toBeInTheDocument();
    });

    it('renders navigation links', () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        // Check if navigation exists
        const nav = screen.getByRole('navigation');
        expect(nav).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { container } = render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        expect(container).toMatchSnapshot();
    });
});
