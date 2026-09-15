import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import AdminPage from './AdminPage';

vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

const renderAdmin = () => render(
    <MemoryRouter>
        <AdminPage />
    </MemoryRouter>
);

describe('AdminPage', () => {
    it('starts with no sale active', () => {
        renderAdmin();

        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });

    it('activates a sale for a valid percentage', async () => {
        const user = userEvent.setup();
        renderAdmin();

        const saleInput = screen.getByLabelText('Set Sale Percent (% off for all items):');
        await user.clear(saleInput);
        await user.type(saleInput, '20');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText('All products are 20% off!')).toBeInTheDocument();
    });

    it('shows an error for non-numeric sale input', async () => {
        const user = userEvent.setup();
        renderAdmin();

        const saleInput = screen.getByLabelText('Set Sale Percent (% off for all items):');
        await user.clear(saleInput);
        await user.type(saleInput, 'twenty');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText(/Invalid input/)).toBeInTheDocument();
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });

    it('ends an active sale and resets the input', async () => {
        const user = userEvent.setup();
        renderAdmin();

        const saleInput = screen.getByLabelText('Set Sale Percent (% off for all items):');
        await user.clear(saleInput);
        await user.type(saleInput, '15');
        await user.click(screen.getByRole('button', { name: 'Submit' }));
        await user.click(screen.getByRole('button', { name: 'End Sale' }));

        expect(saleInput).toHaveValue('0');
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });

    it('links back to the storefront', () => {
        renderAdmin();

        expect(screen.getByRole('link', { name: 'Back to Storefront' })).toHaveAttribute('href', '/');
    });
});