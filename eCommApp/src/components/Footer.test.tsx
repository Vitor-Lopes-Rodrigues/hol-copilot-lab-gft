import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
    it('renders the copyright notice', () => {
        render(<Footer />);

        expect(screen.getByText(/The Daily Harvest/)).toBeInTheDocument();
    });
});