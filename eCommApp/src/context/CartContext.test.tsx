import { ReactNode, useContext } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CartContext, CartProvider } from './CartContext';
import { Product } from '../types';

const product: Product = {
    id: 'apple',
    name: 'Apple',
    price: 0.5,
    reviews: [],
    inStock: true
};

const CartConsumer = () => {
    const cart = useContext(CartContext);

    if (!cart) {
        throw new Error('CartContext must be used within a CartProvider');
    }

    return (
        <>
            <p data-testid="cart-count">{cart.cartItems.length}</p>
            <p data-testid="item-quantity">{cart.cartItems[0]?.quantity ?? 0}</p>
            <button onClick={() => cart.addToCart(product)}>Add product</button>
            <button onClick={cart.clearCart}>Clear cart</button>
        </>
    );
};

const renderCart = (children: ReactNode = <CartConsumer />) => {
    return render(<CartProvider>{children}</CartProvider>);
};

describe('CartProvider', () => {
    it('starts with an empty cart', () => {
        renderCart();

        expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
        expect(screen.getByTestId('item-quantity')).toHaveTextContent('0');
    });

    it('adds a new product with quantity one', async () => {
        const user = userEvent.setup();
        renderCart();

        await user.click(screen.getByRole('button', { name: 'Add product' }));

        expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
        expect(screen.getByTestId('item-quantity')).toHaveTextContent('1');
    });

    it('increments the quantity when the same product is added again', async () => {
        const user = userEvent.setup();
        renderCart();

        const addButton = screen.getByRole('button', { name: 'Add product' });
        await user.click(addButton);
        await user.click(addButton);

        expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
        expect(screen.getByTestId('item-quantity')).toHaveTextContent('2');
    });

    it('clears all cart items', async () => {
        const user = userEvent.setup();
        renderCart();

        await user.click(screen.getByRole('button', { name: 'Add product' }));
        await user.click(screen.getByRole('button', { name: 'Clear cart' }));

        expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
        expect(screen.getByTestId('item-quantity')).toHaveTextContent('0');
    });
});