import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CheckoutModal from './CheckoutModal';

describe('CheckoutModal', () => {
    it('renders the checkout confirmation prompt', () => {
        render(<CheckoutModal onConfirm={vi.fn()} onCancel={vi.fn()} />);

        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
        expect(screen.getByText('Do you want to proceed with the checkout?')).toBeInTheDocument();
    });

    it('calls onConfirm when checkout is continued', async () => {
        const onConfirm = vi.fn();
        const user = userEvent.setup();
        render(<CheckoutModal onConfirm={onConfirm} onCancel={vi.fn()} />);

        await user.click(screen.getByRole('button', { name: 'Continue Checkout' }));

        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when returning to the cart', async () => {
        const onCancel = vi.fn();
        const user = userEvent.setup();
        render(<CheckoutModal onConfirm={vi.fn()} onCancel={onCancel} />);

        await user.click(screen.getByRole('button', { name: 'Return to cart' }));

        expect(onCancel).toHaveBeenCalledTimes(1);
    });
});