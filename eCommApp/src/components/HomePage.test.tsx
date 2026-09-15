import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import HomePage from './HomePage';

vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

describe('HomePage', () => {
    it('renders the welcome content', () => {
        render(<MemoryRouter><HomePage /></MemoryRouter>);

        expect(screen.getByRole('heading', { name: 'Welcome to the The Daily Harvest!' })).toBeInTheDocument();
        expect(screen.getByText('Check out our products page for some great deals.')).toBeInTheDocument();
    });
});