import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button Component', () => {
    it('renders the button with text', () => {
        render(<Button btnText="Click Me" />);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('calls btnFunction on click', () => {
        const mockFn = vi.fn();
        render(<Button btnText="Test" btnFunction={mockFn} />);
        
        fireEvent.click(screen.getByText('Test'));
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('renders the imageIcon when provided', () => {
        render(<Button btnText="With Icon" imageIcon="icon.png" />);
        const img = screen.getByRole('presentation');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'icon.png');
    });

    it('does not render imageIcon when not provided', () => {
        render(<Button btnText="Without Icon" />);
        const img = screen.queryByRole('img');
        expect(img).not.toBeInTheDocument();
    });
});
