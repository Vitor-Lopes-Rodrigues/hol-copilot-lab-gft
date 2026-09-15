import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import LoginPage from './LoginPage';

vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

const renderLogin = () => render(
    <MemoryRouter initialEntries={['/login']}>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<p>Admin destination</p>} />
        </Routes>
    </MemoryRouter>
);

describe('LoginPage', () => {
    it('shows an error for invalid credentials', async () => {
        const user = userEvent.setup();
        renderLogin();

        await user.type(screen.getByPlaceholderText('Username'), 'wrong');
        await user.type(screen.getByPlaceholderText('Password'), 'credentials');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('navigates to admin and clears the form for valid credentials', async () => {
        const user = userEvent.setup();
        renderLogin();

        const username = screen.getByPlaceholderText('Username');
        const password = screen.getByPlaceholderText('Password');
        await user.type(username, 'admin');
        await user.type(password, 'admin');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        expect(screen.getByText('Admin destination')).toBeInTheDocument();
    });
});