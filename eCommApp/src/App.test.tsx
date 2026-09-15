import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

vi.mock('./components/Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./components/Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('./components/ProductsPage', () => ({
    default: () => <p>Products route</p>
}));

vi.mock('./components/LoginPage', () => ({
    default: () => <p>Login route</p>
}));

vi.mock('./components/AdminPage', () => ({
    default: () => <p>Admin route</p>
}));

describe('App', () => {
    it.each([
        ['/', 'Welcome to the The Daily Harvest!'],
        ['/products', 'Products route'],
        ['/login', 'Login route'],
        ['/admin', 'Admin route'],
        ['/cart', 'Your Cart']
    ])('renders the page for %s', (path, expectedText) => {
        render(
            <MemoryRouter initialEntries={[path]}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByText(expectedText)).toBeInTheDocument();
    });
});