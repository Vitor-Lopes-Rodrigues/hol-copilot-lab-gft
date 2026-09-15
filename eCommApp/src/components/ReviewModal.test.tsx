import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ReviewModal from './ReviewModal';
import { Product } from '../types';

const product: Product = {
    id: 'apple',
    name: 'Apple',
    price: 0.5,
    reviews: [],
    inStock: true
};

describe('ReviewModal', () => {
    it('renders nothing when no product is selected', () => {
        const { container } = render(<ReviewModal product={null} onClose={vi.fn()} onSubmit={vi.fn()} />);

        expect(container).toBeEmptyDOMElement();
    });

    it('shows an empty review message', () => {
        render(<ReviewModal product={product} onClose={vi.fn()} onSubmit={vi.fn()} />);

        expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
    });

    it('renders existing reviews', () => {
        const productWithReview = {
            ...product,
            reviews: [{ author: 'Sam', comment: 'Great fruit', date: '2026-01-01' }]
        };
        render(<ReviewModal product={productWithReview} onClose={vi.fn()} onSubmit={vi.fn()} />);

        expect(screen.getByText(/Sam/)).toBeInTheDocument();
        expect(screen.getByText('Great fruit')).toBeInTheDocument();
    });

    it('submits a review and resets the form', async () => {
        const onSubmit = vi.fn();
        const user = userEvent.setup();
        render(<ReviewModal product={product} onClose={vi.fn()} onSubmit={onSubmit} />);

        await user.type(screen.getByPlaceholderText('Your name'), 'Alex');
        await user.type(screen.getByPlaceholderText('Your review'), 'Fresh and crisp');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(onSubmit).toHaveBeenCalledWith({
            author: 'Alex',
            comment: 'Fresh and crisp',
            date: expect.any(String)
        });
        expect(screen.getByPlaceholderText('Your name')).toHaveValue('');
        expect(screen.getByPlaceholderText('Your review')).toHaveValue('');
    });

    it('closes from the close button and backdrop', async () => {
        const onClose = vi.fn();
        const user = userEvent.setup();
        const { container } = render(<ReviewModal product={product} onClose={onClose} onSubmit={vi.fn()} />);

        await user.click(screen.getByRole('button', { name: 'Close' }));
        fireEvent.click(container.firstElementChild as HTMLElement);

        expect(onClose).toHaveBeenCalledTimes(2);
    });

    it('does not close when clicking inside the modal', () => {
        const onClose = vi.fn();
        render(<ReviewModal product={product} onClose={onClose} onSubmit={vi.fn()} />);

        fireEvent.click(screen.getByText('Reviews for Apple'));

        expect(onClose).not.toHaveBeenCalled();
    });
});