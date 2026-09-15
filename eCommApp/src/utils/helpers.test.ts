import { describe, expect, it } from 'vitest';
import { calculateTotal, formatPrice, validateEmail } from './helpers';

describe('formatPrice', () => {
    it('formats a number as US currency', () => {
        expect(formatPrice(12.5)).toBe('$12.50');
    });
});

describe('calculateTotal', () => {
    it('returns zero for an empty cart', () => {
        expect(calculateTotal([])).toBe(0);
    });

    it('calculates totals using each item quantity', () => {
        expect(calculateTotal([
            { price: 2.5, quantity: 2 },
            { price: 4, quantity: 1 }
        ])).toBe(9);
    });
});

describe('validateEmail', () => {
    it('accepts a valid email address', () => {
        expect(validateEmail('shopper@example.com')).toBe(true);
    });

    it('rejects an invalid email address', () => {
        expect(validateEmail('shopper.example.com')).toBe(false);
    });
});