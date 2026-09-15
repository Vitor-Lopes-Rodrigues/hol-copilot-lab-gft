import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProductsPage from './ProductsPage';
import { CartContext } from '../context/CartContext';
import { Product, Review } from '../types';

vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('./ReviewModal', () => ({
    default: ({ product, onClose, onSubmit }: {
        product: Product | null;
        onClose: () => void;
        onSubmit: (review: Review) => void;
    }) => product ? (
        <div data-testid="review-modal">
            <p>{product.reviews.map(review => review.comment).join(', ')}</p>
            <button onClick={() => onSubmit({ author: 'Reviewer', comment: 'Fresh review', date: '2026-01-01' })}>
                Add review
            </button>
            <button onClick={onClose}>Close reviews</button>
        </div>
    ) : null
}));

const products: Product[] = [
    {
        id: 'apple',
        name: 'Apple',
        price: 0.5,
        description: 'A juicy apple',
        image: 'apple.png',
        reviews: [],
        inStock: true
    },
    {
        id: 'pear',
        name: 'Pear',
        price: 0.75,
        image: 'pear.png',
        reviews: [],
        inStock: false
    }
];

const fetchedProducts: Product[] = [
    products[0],
    { ...products[0], id: 'grapes', name: 'Grapes', image: 'grapes.png' },
    { ...products[0], id: 'orange', name: 'Orange', image: 'orange.png' },
    products[1]
];

const createCartContext = () => ({
    cartItems: [],
    addToCart: vi.fn(),
    clearCart: vi.fn()
});

const renderProducts = (cartContext = createCartContext()) => render(
    <CartContext.Provider value={cartContext}>
        <ProductsPage />
    </CartContext.Provider>
);

const mockSuccessfulFetch = () => {
    let requestIndex = 0;
    vi.stubGlobal('fetch', vi.fn(() => {
        const product = fetchedProducts[requestIndex++];
        return Promise.resolve({ ok: true, json: () => Promise.resolve(product) });
    }));
};

describe('ProductsPage', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('shows a loading state while products are loading', async () => {
        const resolvers: Array<(response: unknown) => void> = [];
        vi.stubGlobal('fetch', vi.fn(() => new Promise(resolve => {
            resolvers.push(resolve);
        })));
        renderProducts();

        expect(screen.getByText('Loading products...')).toBeInTheDocument();

        resolvers.forEach((resolve, index) => resolve({
            ok: true,
            json: () => Promise.resolve(fetchedProducts[index])
        }));
        await waitFor(() => expect(screen.getByText('Our Products')).toBeInTheDocument());
    });

    it('renders loaded products and sends in-stock products to the cart', async () => {
        mockSuccessfulFetch();
        const cartContext = createCartContext();
        const user = userEvent.setup();
        renderProducts(cartContext);

        await waitFor(() => expect(screen.getByText('Our Products')).toBeInTheDocument());

        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Grapes')).toBeInTheDocument();
        expect(screen.getByText('Orange')).toBeInTheDocument();
        expect(screen.getByText('Pear')).toBeInTheDocument();
        expect(screen.getAllByText('$0.50')).toHaveLength(3);
        expect(screen.getAllByText('A juicy apple')).toHaveLength(3);

        await user.click(screen.getAllByRole('button', { name: 'Add to Cart' })[0]);

        expect(cartContext.addToCart).toHaveBeenCalledWith(products[0]);
    });

    it('disables the add button for out-of-stock products', async () => {
        mockSuccessfulFetch();
        renderProducts();

        await waitFor(() => expect(screen.getAllByRole('button', { name: 'Out of Stock' })).toHaveLength(1));

        expect(screen.getAllByRole('button', { name: 'Out of Stock' })[0]).toBeDisabled();
    });

    it('opens reviews and updates the selected product after a review is submitted', async () => {
        mockSuccessfulFetch();
        const user = userEvent.setup();
        renderProducts();

        await waitFor(() => expect(screen.getByAltText('Apple')).toBeInTheDocument());
        await user.click(screen.getByAltText('Apple'));
        expect(screen.getByTestId('review-modal')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Add review' }));

        expect(screen.getByText('Fresh review')).toBeInTheDocument();
    });

    it('stops loading when a product request fails', async () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false })));
        renderProducts();

        await waitFor(() => expect(screen.getByText('Our Products')).toBeInTheDocument());

        expect(consoleError).toHaveBeenCalledWith('Error loading products:', expect.any(Error));
        expect(screen.queryByRole('button', { name: 'Add to Cart' })).not.toBeInTheDocument();
    });
});