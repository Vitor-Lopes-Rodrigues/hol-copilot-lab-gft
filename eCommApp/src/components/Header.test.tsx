import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Header from './Header';

describe('Header', () => {
    it('renders the store title and navigation links', () => {
        render(<MemoryRouter><Header /></MemoryRouter>);

        expect(screen.getByRole('heading', { name: 'The Daily Harvest' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
        expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products');
        expect(screen.getByRole('link', { name: 'Cart' })).toHaveAttribute('href', '/cart');
        expect(screen.getByRole('link', { name: 'Admin Login' })).toHaveAttribute('href', '/login');
    });
});